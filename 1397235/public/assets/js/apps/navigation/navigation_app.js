/** 
 * A module that implements the framework's navigational elements.
 *
 * The navigational elements are partitioned into two structures:
 *
 * 1) A collection of primary navigation elements.
 *
 * 2) A forest of secondary navigational elements.  Each tree in the forest is
 *    rooted at a primary navigational element.
 *
 * An example structure can be visualized as follows:
 *
 * +---------+---------+---------+
 * |    p1   |    p2   |   p3    |
 * *---------+---------+---------+
 *      |         |               
 *      c1        c1              
 *     /  \      / | \
 *    c2   c3   c2 c3 c4
 *
 * which represents the following navigational paths:
 *
 * p1 > c1 > c2,
 * p1 > c1 > c3,
 * p2 > c1 > c2,
 * p2 > c1 > c3,
 * p2 > c1 > c4,
 * p3
 *
 * Selection models govern the rules for selecting primary and secondary elements.
 *
 * The primary elements are governed by a single-select model, allowing only a single primary
 * element to be selected at a given time.  Selection of one element deselects the currently selected
 * element. 
 *
 * The secondary elements are governed by a 'tree' selection model with the following characteristics:
 *
 * 1) Only a single leaf node may be selected at a given time.  Selection of one leaf node deselects
 *    the currently selected leaf node.
 *
 * 2) Any number of non-leaf nodes may be selected at a given time.    
 *
 * @module 
 * @name Slipstream/Navigation
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([ "./navElementRegistry",
    "./models/navModel",
    "./views/primaryNavView",
    "./views/primaryNavIconView",
    "./views/secondaryNavView",
    "./models/quicklinksModel",
    "./views/quicklinksView",
    "./schemaImportResolver",
    "backbone.picky"
], /** @lends Navigation */ function (NavElementRegistry, NavModel, PrimaryNavView, PrimaryNavIconView, SecondaryNavView, QuicklinksCollection, QuicklinksView, SchemaImportResolver, Picky) {

    Slipstream.module("Navigation", function (Navigation, Slipstream, Backbone, Marionette, $, _) {
        // Don't start the navigation app when the framework boots
        this.startWithParent = false;

        var roots = [],
            primaryNavigation,
            current_root = undefined,
            navElements,
            currentSchemaContext = "";

        var baseSchemaPath = "conf/navigation"

        var navElementRegistry = new NavElementRegistry();

        Slipstream.vent.on("nav:discovered", function(navElement) {
            navElementRegistry.addElement(navElement);
        });

        Slipstream.vent.on("nav:primary:selected", function (primaryNavModel) {
            var intent = null,
                primaryIntent = primaryNavModel.get("intent"),
                leaves = primaryNavModel.get("leaves"),
                makeSecondaryVisible = true;

            if (primaryIntent) {
                if (leaves) {
                    Slipstream.vent.trigger("activity:start", primaryIntent);
                }
            }
            else {
                if (leaves) {
                    var parent_intent = leaves[ 0 ].attributes.parent.get("intent");

                    intent = (parent_intent) ? parent_intent : leaves[ 0 ].get("intent");
                    Slipstream.vent.trigger("activity:start", intent);
                }
                else {
                    var secondaryNavView = createSecondaryNavView(primaryNavModel);

                    if (secondaryNavView) {
                        displaySecondaryNavView(secondaryNavView);
                    }
                }
            }

            var children = primaryNavModel.get("children");


            // Remove dynamically added children before opening the secondaryNavRegion

            if (children) {
                for (var idx = 0, len = children.length; idx < len; idx++) {
                    if (isNavDynamic(children[ idx ].attributes.intent)) {
                        children.splice(idx, len - idx);
                    }
                }
            }

            if (!children || (children && !children.length)) {
                //TODO: Move this section out if / when dynamically added children should not be removed before opening the secondaryNavRegion
                makeSecondaryVisible = false;
            }

            Slipstream.commands.execute("nav:secondary:activate", children);
            Slipstream.commands.execute("ui:setSecondaryNavigationVisibility", makeSecondaryVisible);
        });

        // Before an activity starts, reveal its navigation path
        Slipstream.vent.on("activity:beforeStart", function(activity, options) {
            if (activity.paths) {
                // Reveal the navigation paths associated with the activity.
                activity.paths.forEach(function(nav_path) {
                   // load the activity's navigation schema
                    loadSchema({
                        contextName: nav_path.context,
                        onLoad: function(definedNodes) {
                            if (nav_path.context != currentSchemaContext) {
                                currentSchemaContext = nav_path.context; // new schema context
                                renderNavigation(definedNodes.roots);
                            }
                            revealNav(activity, nav_path, options.fromURL);
                        }
                    });   
                })
            }
        });

        // If an activity is not found, render the default nav elements
        Slipstream.vent.on("ui:404", function() {
            loadSchema({
                onLoad: function(definedNodes) {
                    renderNavigation(definedNodes.roots);
                }
            });
        })

        Slipstream.vent.on("nav:update", function (obj) {
            appendSecondaryNavElement(obj);
        });

        /**
         * Reveal an activity's navigation path in the UI 
         *
         * @param {Object} activity - The activity whose navigation path is to be revealed.
         * @param {Object} nav_path - A navigation path associated with the activity.
         * @param {Boolean} fromURL - true if the activity being navigated to was initiated via URL, false otherwise.
         */
        function revealNav(activity, nav_path, fromURL) {
            var cmp_fn = function (path_element, node) {
                return path_element == node.get("internal_name");
            }

            var children;
            var navResolved = false;

            if (nav_path) {
                if (nav_path.path != "/") {
                    navElements = navElementRegistry.getDefinedNavElementsByPath(nav_path.path, nav_path.context);

                    if (navElements) {
                        var root = navElements[ 0 ],
                            children = root.get("children");

                        root.select();

                        if (children) {
                            if (root != current_root) {
                                current_root = root;

                                var secondaryNavView = createSecondaryNavView(root);

                                if (secondaryNavView) {
                                    displaySecondaryNavView(secondaryNavView);
                                }
                            }

                            for (var i = 1; i < navElements.length - 1; i++) {
                                if (navElements[ i ].get("children")) {
                                    navElements[ i ].expand();
                                }
                            }
                            // select the last element
                            var mod = navElements[ navElements.length - 1 ];
                            navElements[ navElements.length - 1 ].select();
                        }

                        navResolved = true;
                    }
                }
            }
            else {
                var navIntent = activity.context.module.getIntent(),
                    navResolved = false,
                    isDynamicNav = false,
                    navAction,
                    mimeType;

                if (navIntent) {
                    isDynamicNav = isNavDynamic(navIntent);
                    navAction = navIntent.action;
                    mimeType = navIntent.data.mime_type;
                }

                if (isDynamicNav) {
                    for (var idx = 0, navLength = navElements.length; idx < navLength; idx++) {
                        if (_.isEqual(navElements[ idx ].attributes.intent, navIntent)) {
                            navElements.splice(idx, navLength - idx);
                            break;
                        }
                    }
                    navResolved = true;
                }
            }

            if (navResolved) {
                var makeSecondaryVisible = true;
                // Remove dynamically added children before opening the secondaryNavRegion
                if (children) {
                    for (var idx = 0, len = children.length; idx < len; idx++) {
                        if (isNavDynamic(children[ idx ].attributes.intent)) {
                            children.splice(idx, len - idx);
                        }
                    }
                }
                if (!children || (children && !children.length)) {
                    //TODO: Move this section out if / when dynamically added children should not be removed before opening the secondaryNavRegion
                    makeSecondaryVisible = false;
                }

                if (fromURL) {
                    makeSecondaryVisible = getSecondaryNavStateSetting(makeSecondaryVisible);
                    Slipstream.commands.execute("ui:setSecondaryNavigationVisibility", makeSecondaryVisible);
                }

                Slipstream.commands.execute("nav:secondary:activate", children);
                Slipstream.vent.trigger("nav:resolved", navElements, activity);

                navActionInitated = false;
            }
        }

        /** 
         *  Return Secondary Navigation state based on user's preferences
        */
        function getSecondaryNavStateSetting(makeSecondaryVisible) {
            var leftNavExpandedUserPreference = Slipstream.reqres.request("ui:preferences:get", "ui:nav:left:expanded");
            return (leftNavExpandedUserPreference === undefined) ? makeSecondaryVisible : (makeSecondaryVisible && leftNavExpandedUserPreference);
        }

        /**
         * Create a view representing the secondary navigation for a given primary
         * navigation element.
         *
         * @param {Object} root - The primary navigation element corresponding to 
         * the secondary navigational elements whose view is to be created.
         * 
         * @return The created view, or null if the primary navigation element has
         * no children.
         */
        function createSecondaryNavView(root) {
            var secondaryNavView = null,
                children = root.get("children");

            if (children) {
                var collection = new NavModel.NavigationElementCollection(children);
                root.treeNodeDeselect();

                secondaryNavView = new SecondaryNavView({
                    collection: collection
                });
            }

            return secondaryNavView;
        }

        /**
         * Display a secondary navigation view
         *
         * @param {Object} view - The view to be displayed
         */
        function displaySecondaryNavView(view) {
            Slipstream.secondaryNavRegion.reset();
            Slipstream.secondaryNavRegion.show(view);
        }

        function appendSecondaryNavElement(obj) {

            var newLeafNodeVal = obj.leafNode,
                intent = obj.intent,
                totalNav = 0,
                currentLeafNode,
                tree;
            intent.data.isDynamicNav = true;

            for (var idx = 0, navLength = navElements.length; idx < navLength; idx++) {
                if (_.isEqual(navElements[ idx ].attributes.intent, intent)) {
                    navElements.splice(idx, navLength - idx);
                    break;
                }
            }

            if (newLeafNodeVal) {
                if (navElements) {
                    totalNav = navElements.length;
                    currentLeafNode = navElements[ totalNav - 1 ];
                    tree = navElements[ 0 ];
                }

                var newLeafPath = {
                    children: [],
                    defined: true,
                    name: newLeafNodeVal,
                    parent: currentLeafNode,
                    tree: tree,
                    intent: intent,
                    isDynamicNav: true
                };

                var newLeafNode = new NavModel.SecondaryNavigationElement(newLeafPath);
                (currentLeafNode) && (currentLeafNode.attributes.children = [ newLeafNode ]);
                navElements.push(newLeafNode);
                var activity = Slipstream.reqres.request("activity:resolve", intent);

                // TODO: Uncomment if / when dynamically added nav elements need to be displayed in teh secondary nav area 
                // Slipstream.commands.execute("nav:secondary:activate", navElements[0]);
                // Slipstream.commands.execute("ui:setSecondaryNavigationVisibility", navElements[0]);

                Slipstream.vent.trigger("nav:resolved", navElements, activity);
            }
        }

        /**
         * Get the set of defined navigation elements.  A defined path is one that
         * is contributed by a plugin.
         * 
         * @param {Array<Object>} paths - The trees representing the navigation paths
         * to be traversed in the search for defined elements.
         *
         * @param {Object} parent - The nearest common parent of the given paths.
         *
         * @returns The set of trees representing defined navigation paths.
         */
        function getNavElements(paths, parent, tree) {
            // only return those elements that have been defined by a discovered navigation path
            var nodes = [], leaves = [];

            if (paths && paths.length) {
                for (var i = 0; i < paths.length; i++) {
                    if (paths[ i ].defined && isNavElementAccessible(paths[ i ])) {
                        var navElement;

                        if (parent) {
                            navElement = new NavModel.SecondaryNavigationElement(_.extend(paths[ i ], { tree: tree }));
                        }
                        else {
                            navElement = new NavModel.PrimaryNavigationElement(paths[ i ]);
                            tree = navElement;
                        }

                        navElement.set("parent", parent);

                        if (paths[ i ].children) {
                            navElement.set("isParent", true);

                            var children = getNavElements(paths[ i ].children, navElement, tree);
                            var leaves = []
                            for (var j = 0; j < children.length; j++) {
                                if (!children[ j ].get("children")) {
                                    leaves.push(children[ j ]);
                                }
                                else {
                                    leaves = leaves.concat(children[ j ].get("leaves"));
                                }
                            }
                            if (leaves.length) {
                                navElement.set("leaves", leaves);
                            }

                            navElement.set("children", children.length ? children : null);
                        }

                        if (!navElement.get("isParent") || (navElement.get("isParent") && (navElement.get("intent") || navElement.get("children")))) {
                            nodes.push(navElement);
                        }
                    }
                }
            }

            return nodes;
        }

        /**
         * Render the navigation elements
         */
        function renderNavigation(nav_elements) {
            // Create the primary navigation collection and mix in its single-select model
            function isNavElementDisplayable(elem) {
                return (elem.get("intent") || elem.get("children"));
            }

            primaryNavigation = new NavModel.NavigationElementCollection(nav_elements.filter(isNavElementDisplayable));
            var singleSelect = new Picky.SingleSelect(primaryNavigation);
            _.extend(primaryNavigation, singleSelect);

            var primaryNavView = new PrimaryNavView({
                collection: primaryNavigation
            });

            var primaryNavIconView = new PrimaryNavIconView({
                collection: primaryNavigation
            });

            Slipstream.primaryNavRegion.show(primaryNavView);
            Slipstream.primaryNavIconRegion.show(primaryNavIconView);

            $("#ss_navigation").on("mouseleave", function(e) {
                Slipstream.vent.trigger("nav:mouseout");
            })

            // renderQuicklinks(); Re-enable when quicklinks support is added officially
        }

        function isNavDynamic(navIntent) {
            if (navIntent) {
                return navIntent.data.isDynamicNav;
            }
            return false;
        }

        Navigation.on("start", function () {

            // Load and define the default schema
            loadSchema({
                onLoad: function (definedPaths) {
                    Slipstream.commands.setHandler("nav:selectDefault", function () {
                        if (window.location.pathname == "/") {
                            var defaultNode = definedPaths.defaultNode;

                            if (defaultNode) {
                                Slipstream.vent.trigger("activity:start", defaultNode.intent, {fromURL: true});
                            }
                        }
                    });
                }
            });
        });

        /**
         * Render quicklinks based on URL referral data
         */
        function renderQuicklinks() {
            var collection = new QuicklinksCollection();

            var quicklinksView = new QuicklinksView({
                collection: collection
            });

            collection.on("sync", function() {
                Slipstream.quicklinksRegion.show(quicklinksView);    
            });

            collection.fetch();
        }

        /**
         * Load a navigation schema
         * @param {Object} options - A set of options for use during the schema loading process.
         * @param {String} options.contextName - The name of the schema context to be loaded.
         * @param {Function} options.onLoad - An optional calllback function to be invoked after the schema is loaded successfully.
         */
        function loadSchema(options) {
            // Load the navigation schema's nls bundle
            var contextName = options.contextName || "";

            Slipstream.execute("nls:loadBundle", {
                ctx_name: "@slipstream_nav" + contextName,
                ctx_root: "/assets/js/" + baseSchemaPath  + "/" + contextName
            });

            var schemaPath = baseSchemaPath + (contextName ? "/" + contextName : "") + "/schema";

            var afterLoad = function(loadedSchema) {
                navElementRegistry.registerContextSchema(loadedSchema, options.contextName);

                var definedPaths = navElementRegistry.getDefinedNavElementsByContext(options.contextName);

                if (options && options.onLoad) {
                    options.onLoad(definedPaths);
                }    
            }

            // dynamically load and register the schema
            require([ schemaPath ], function (schema) {
                var schemaElements = schema;
                var schemaImports;

                if (!_.isArray(schema)) {
                   schemaElements = schema.elements || [];
                   schemaImports = schema.imports;
                }
                
                if (schemaImports) {
                    var importResolver = new SchemaImportResolver(baseSchemaPath + "/");
                    importResolver.resolveImports(schemaElements, schemaImports, afterLoad);
                }
                else {
                    afterLoad(schemaElements);
                }
            });
        }
    });

    return Slipstream.Navigation;
});