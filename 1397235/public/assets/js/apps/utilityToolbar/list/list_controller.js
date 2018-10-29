/** 
 * A module that implements a controller for rendering the utility toolbar.
 * @module 
 * @name Slipstream/UtilityToolbar/List/Controller
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(["./list_view", "./util", "lib/utils"], /** @lends Controller */ function(View, Util, Utils) {
    Slipstream.module("UtilityToolbar.List", function(List, Slipstream, Backbone, Marionette, $, _) {
        /**
         * @class Controller
         * @classdesc List controller class
         */
        List.Controller = {
            /**
             * Display the toolbar elements
             * @memberof Controller
             */
            listToolbarElements: function() { 
                var toolbarElements = Slipstream.request("utilityToolbar:entities"),
                ltAlignedToolbarElements = toolbarElements.iconElements.filter(function(element){
                    return element.get("alignLeft");
                }),
                rtAlignedToolbarElements = toolbarElements.iconElements.filter(function(element){
                    return !element.get("alignLeft");
                });

                var rightAlignedToolbarIconView = new View.UtilityToolbarCollectionView({
                    collection: new Backbone.Collection(rtAlignedToolbarElements)
                });
                rightAlignedToolbarIconView.render();

                var leftAlignedToolbarIconView = new View.UtilityToolbarCollectionView({
                    collection: new Backbone.Collection(ltAlignedToolbarElements),
                    el: "#toolbar_elements_left"
                });
                leftAlignedToolbarIconView.render();
                
                activateToolbar(toolbarElements.iconElements);

                if (toolbarElements.genericElements) {
                    // listen for the view to be set on generic elements
                    toolbarElements.genericElements.each(function(element) {
                        element.on("change:view", function(genericElement) {
                            var view = genericElement.get("view");
                            var $elementContainer = (genericElement.get('alignLeft')) ? $('#view_elements_left') : $('#view_elements');

                            // render the provided view
                            view.render();

                            // insert the view's DOM nodes into the toolbar
                            var $el = $("<li>");
                            $el.attr("class", 'utility_toolbar_element');
                            $el.append(view.$el);

                            $elementContainer.append($el);
                        })
                    })
                    activateToolbar(toolbarElements.genericElements);

                }
            }
        };

        /**
         * Verify if user has the required capabilities to see toolbar element.
         * @returns {Boolean} true if the user has the required capabilities, otherwise false
         */
        function hasCapabilities(intent) {
            // intent.capabilities -> intent.capability. So that activity_mediator won't do redundant RBAC check.
            if(!_.isUndefined(intent.capability)) {
                return Utils.userHasCapabilities(intent.capability);
            }
            else {
                return true;
            }
        }

        /**
         * Activate the toolbar.  This methods starts the activity associated with
         * managing the toolbar state (if one is provided)
         */
        function activateToolbar(elements) {
            if (elements) {
                elements.each(function(element) {
                    var activities = element.get("activity");

                    if (activities) {
                        // normalize the activities for a toolbar element to an array
                        if (!_.isArray(activities)) {
                            activities = [activities];
                        }

                        activities.forEach(function(activity) {
                            require([element.get("protoModule")], function(ProtoModule) {
                                var intent = Util.createToolbarIntent(activity, element, ProtoModule);

                                if(hasCapabilities(intent)) {
                                    Slipstream.vent.trigger("activity:start", intent);
                                }
                                else {
                                    Slipstream.vent.trigger("utilityToolbar:privilegesError");
                                }
                            });
                        });
                    }
                });
            }
        }
    });

    return Slipstream.UtilityToolbar.List.Controller;
});