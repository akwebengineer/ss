/** 
 * A module that implements a registry for navigation schemas and their nav elements.
 * Elements and their associated schemas can be added to the registry in any order.  Once the
 * schemas and navigation elements have been added to the registry, a client of the registry
 * can fetch the forest of trees representing the defined navigation paths for a given schema.  These
 * trees can then be used as a model for rendering a navigation hierarchy.
 *
 * @module 
 * @name NavElementRegistry
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */ 
define(["./models/navModel",
        "modules/searchIndex",
	    "lib/utils",
	    'underscore'], function(NavModel, SearchIndex, Utils, _) {
	function NavElementRegistry() {
		var unboundElementsByContext = {}; // maps a context name to an object containing the context's nav schema/defined elements
		var schemasByContext = {}
        var searchIndex = new SearchIndex();
       
        /**
	     * Add an element to the registry.  A nav element will have the following
	     * attributes:
	     *
	     * @param {Object} navElement - The navigation element to be added.
	     * @param {Object} navElement.filter - The filter that can be used to resolve the nav element's associated activity.
	     * @param {String} navElement.context - The navigation context for the navigation element.
	     */
        this.addElement = function(navElement) {
        	if (schemasByContext[navElement.context]) {
	        	// schema is already registered, bind the nav element to the schema
	        	bindNavElementToSchema(navElement, schemasByContext[navElement.context]);
	        }
	        else { // schema hasn't been registered yet, buffer navElement 
        	    var elements = unboundElementsByContext[navElement.context];

	            if (!elements) {
	        	    elements = unboundElementsByContext[navElement.context] = [];
	            }

	            elements.push(navElement);
	        }
        }

        /**
         * Register a context schema
         *
         * @param {Array<Object>} schema - The forest of schema nodes for the schema.
         * @param {String} contextName - The context name of the schema.
         * 
         * @returns The default navigation element for the schema, or undefined if
         * no default navigation element exists
         */
        this.registerContextSchema = function(schema, contextName) {
        	// schema already registered
        	if (schemasByContext[contextName]) {
                console.log("schema ", contextName, " already registered");
        		return;
        	}

            schemasByContext[contextName] = {roots: schema};

            // process any buffered nav elements for this context
            _.each(unboundElementsByContext[contextName], function(element) {
                bindNavElementToSchema(element, schemasByContext[contextName]);
            });

            // empty the element buffer
            unboundElementsByContext[contextName] = [];
        }

        /**
         * Return the defined navigation elements for the schema with the given context name.
         *
         * @param {String} contextName - The name of the context for which the defined nodes should be returned.
         *
         * @returns An object with the following attributes:
         *
         * roots - The roots of the defined navigational paths.
         * defaultNode - The node in the navigation schema that is defined as the default element.
         *
         * This method should only be called for a schema once that schema has been registered  
         * (@see {@link registerContextSchema}).  Once this method is called, additional elements added
         * via addElement will not be reflected in the returned set of nodes.
         */
        this.getDefinedNavElementsByContext = function(contextName) {
        	var schema = schemasByContext[contextName];

            if (!schema) {
            	throw new Error("The schema context " + contextName + " has not been registered");
            }

            var definedPaths = schema.definedPaths;

            if (!definedPaths) {
                definedPaths = getDefinedNavElements(schema.roots, contextName);

                // cache defined paths
                schema.definedPaths = definedPaths;
            }

            return {
            	roots: definedPaths,
            	defaultNode: schema.defaultNode
            }
        }

        /**
         * Get the defined nav elements along a navigation path
         *
         * @param {String} path - The navigation path from the root to a node in the schema context
         * @param {String} contextName - The name of the schema context in which to find the nodes on the given path.
         *
         * @returns An array of nodes representing the nodes on the given navigation path.
         *
         * This method should only be called for a schema once that schema has been registered  
         * (@see {@link registerContextSchema}).  Once this method is called, additional elements added
         * via addElement will not be reflected in the returned set of nodes.
         */
        this.getDefinedNavElementsByPath = function(path, contextName) {
        	var schema = schemasByContext[contextName];

            if (!schema) {
            	throw new Error("The schema context " + contextName + " has not been registered");
            }

            var definedPaths = schema.definedPaths;

            if (!definedPaths) {
                definedPaths = getDefinedNavElements(schema.roots, contextName);

                // cache defined paths
                schema.definedPaths = definedPaths;
            }

            var cmp_fn = function(path_element, node) {
                return path_element == node.get("internal_name");
            }

        	return map_nav(path, schema.definedPaths, cmp_fn);
        }

        /**
         * Get the set of defined navigation elements.  A defined path is one that
         * is contributed by a plugin.
         * 
         * @param {Array<Object>} paths - The trees representing the navigation paths
         * to be traversed in the search for defined elements.
         *
         * @param {String} contextName: The context name from which to get the nav elements.
         *
         * @param {Object} parent - The nearest common parent of the given paths.
         *
         * @returns The set of trees representing defined navigation paths.
         */
        function getDefinedNavElements(paths, contextName, parent, tree) {
        	// only return those elements that have been defined by a discovered navigation path
            var nodes = [], leaves = [];
            var nls_context = "@slipstream_nav" + (contextName || "");

            if (paths && paths.length) {
                for (var i = 0; i < paths.length; i++) {
                    if (paths[i].defined && isNavElementAccessible(paths[i])) {
                        var navElement;

                        if (parent) {
                           navElement = new NavModel.SecondaryNavigationElement(_.extend(paths[i], {tree : tree, nls_context:nls_context}));
                        }
                        else {
                            navElement = new NavModel.PrimaryNavigationElement(_.extend(paths[i], {nls_context:nls_context}));
                            tree = navElement;
                        }

                        navElement.set("parent", parent);
                        
                        if (paths[i].children) {
                            var children = getDefinedNavElements(paths[i].children, contextName, navElement, tree);
                            navElement.set("isParent", children && children.length > 0);
                            
                            var leaves = []
                            for (var j = 0; j < children.length; j++) {
                                if (!children[j].get("children")) {
                                    leaves.push(children[j]);
                                }
                                else {
                                    leaves = leaves.concat(children[j].get("leaves"));
                                }
                            }
                            if (leaves.length) {
                                navElement.set("leaves", leaves);
                            }
                            
                            navElement.set("children", children.length ? children : null);
                        }

                        if (navElement.get("intent") || navElement.get("children")) {
                            nodes.push(navElement);
                        }
                    }
                }
            }

            return nodes;
        }

        /**
         * Process a discovered navigation element
         *
         * @param {Object} navElement - The navigation element to be bound.
         * @param {Object} schemaInfo - An object describing a navigation schema.
         * @param {Array<Object>} schemaInfo.roots - The roots of the schema.
         * @param {Object} schemaInfo.defaultNode - The node identified as the default nav element in the schema.
         */
        function bindNavElementToSchema(navElement, schemaInfo) {
        	var schema = schemaInfo.roots;

            var cmp_fn = function(path_element, node) {
                return path_element == node.name;
            };

            var map_fn = function(node, parent) {
                node.defined = true;
                node.parent = parent;

                if (node.default) {
                	schemaInfo.defaultNode = node;
                }
            };

            var nodes = map_nav(navElement.path, schema, cmp_fn, map_fn);

            if (nodes) {
                var filter = navElement.filter.filter;

                if (filter) {
                    var leaf_node = nodes[nodes.length-1];
                    leaf_node.intent = new Slipstream.SDK.Intent(filter.action, filter.data); 
                    leaf_node.capabilities = navElement.filter.activity.capabilities;

                    indexNavElement(navElement);
                }  
            }
            else {
                console.log("Invalid navigation path", navElement.path, "specified for schema", navElement.context, ".  Path ignored.");    
            }
        }

        /**
         * Map a set of navigation path elements that match 
         * a path in the given set of nodes.  Each element in the
         * supplied navigation path will be compared to an element
         * at the corresponding depth in the given set of tree nodes.
         * This comparison will use the supplied cmp_fn.  If the
         * cmp_fn returns 'true', the map_fn will be applied to the
         * tree node.  
         *
         * @param {Object} path  - The navigation path to be mapped.
         *
         * @param {Array} nodes - A tree of nodes representing a set of
         * possible navigation paths.
         *
         * @param {Function} cmp_fn - A comparison function used to 
         * compare path elements to nodes in the tree.
         *
         * @param {Function} map_fn - A function to be applied to all
         * nodes along the supplied navigation path.
         * 
         * @returns {Object} If all path elements
         * match a path in the tree then an array of the matched nodes
         * is returned.  Otherwise null is returned.
         * 
         */
        function map_nav(path, nodes, cmp_fn, map_fn) {
            // helper function for getting an object's property value
            function get(object, prop) {
                var propVal = null;
                if (object.hasOwnProperty(prop)) {
                    propVal = object[prop];
                }
                else if (typeof object["get"] == "function") {
                    propVal = object.get(prop);
                }
                return propVal;
            }

            var path_fragments = path.split('/'),
                last_matched_node = null,
                matched_nodes = [],
                parent = null;

            /*
             * Walk the list of path fragments and compare each to 
             * the corresponding node in the supplied tree.
             */
            for (var i = 0; i < path_fragments.length; i++) {
                if (!nodes) {
                    break;    
                }

                var num_children = nodes.length;

                for (var j = 0; j < num_children; j++) {
                    if (cmp_fn(path_fragments[i], nodes[j])) {
                        last_matched_node = nodes[j];
                        matched_nodes.push(last_matched_node);
                        if (map_fn) {
                            map_fn(last_matched_node, parent);
                        }
                        parent = last_matched_node;
                        nodes = get(last_matched_node, "children");
                        break;
                     }
                 }

                // We didn't find the path fragment in the current set of nodes
                if (j == num_children) {
                    break;  
                }
            }

            // all path fragments matched against the schema
            if (i == path_fragments.length) {
                return matched_nodes;
            }

            return null;
        }

        /**
         * Check that the nav element is accessible given the current user's capabilities
         *
         * @param {Object} navElement - The nav element whose capabilities are to be checked.
         */
        function isNavElementAccessible(navElement) {
            var requiredCapabilities = navElement.capabilities;

             // if no capabilities defined, then access is unrestricted.
             if (!requiredCapabilities) {
                return true;
             }

             return Utils.userHasCapabilities(requiredCapabilities);
        }

        /**
         * Index a navigation element for search
         *
         * @param {Object} navElement - The nav element to be indexed
         */ 
        function indexNavElement(navElement) {
            var filter = navElement.filter.filter;
            var tags = filter.tags;

            if (tags) {
                var url = generateURL(navElement.filter.activity);

                var doc = {
                    "body": tags.join(" "),
                    "url": url
                }

                searchIndex.addDoc(doc);
            }

            function generateURL(activity) {
                return "/" + activity.plugin_name + activity.url_path;
            }
        }

        /**
         *  Request handler for navigation index searches
         */
        Slipstream.reqres.setHandler("navigation:search", function(query, options) {
            var success = options.success;
            var modded_options = $.extend({}, options);

            /**
             * Create a human readable name from a string of tags
             *
             * @param tags - A space separated string of tags.
             */
            function createObjectName(tags) {
                var tagArray = tags.split(" "); 
                var name = tagArray.map(function(tag) {
                    return tag.charAt(0).toUpperCase() + tag.slice(1);
                }).join(" "); 

                return name;
            }

            modded_options.success = function(results) {
                var mappedResultSet = results.map(function(result) {
                   return { 
                      objectName: createObjectName(result.doc.body),
                      url: result.doc.url
                   };
                });
                
                if (success) {
                    success({
                        totalResults: mappedResultSet.length,
                        results: mappedResultSet
                    });
                }
            };

            searchIndex.search(query, modded_options);
        });
	}

	return NavElementRegistry;
});