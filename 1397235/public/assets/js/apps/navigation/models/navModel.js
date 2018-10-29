/**
 * A module that implements a model representing elements
 * of the framework's navigation.
 *
 * @module 
 * @name Slipstream/Entities
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(["./baseModel", "./treePicky"], /** @lends PrimaryNavigation */ function(BaseNavModel, TreePicky) {
    Slipstream.module("Navigation.Entities", function(Entities, Slipstream, Backbone, Marionette, $, _) {
        /**
         * Construct a model representing a navigation element.
         *
         * @constructor
         * @class NavigationElement
         * @classdesc A navigation model
         */
        Entities.NavigationElement = BaseNavModel.extend({
            /**
             * Initialize the navigation model
             * @inner
             */
            initialize: function(attributes, options) {
                this.set("internal_name", this.get("name"));
                this.set("internal_dom_id", this.get("internal_name").replace(/_/g,'__').replace(/\./g,'_'));
                // internationalize the name of the nav element
                var msg_descriptor = {
                    msg: this.get("name"), 
                    namespace: this.get("nls_context")
                };
                !(this.get('isDynamicNav')) && this.set("name", Slipstream.request("nls:retrieve", msg_descriptor));
                this.set("id", _.uniqueId("nav_element_"))
            }
        });

        /**
         * Construct a model representing a primary navigation element.
         *
         * @constructor
         * @class PrimaryNavigationElement
         * @classdesc A primary navigation model
         */
        Entities.PrimaryNavigationElement = Entities.NavigationElement.extend({
            /**
             * Initialize the navigation model
             * @inner
             */
            initialize: function(attributes, options) {
                var singleSelect = new Backbone.Picky.Selectable(this);
                _.extend(this, singleSelect);                
                var icon = this.get('icon');
                if(!icon) {
                    this.set('icon', 'icon_plugin_application');
                }
                Entities.NavigationElement.prototype.initialize.apply(this, arguments);
                this.treeSelectionModel = new Backbone.Picky.SingleSelect();
                _.extend(this.treeSelectionModel, Backbone.Events);
            },
            treeNodeSelect: function(node) {
                this.treeSelectionModel.select(node);
            },
            treeNodeDeselect: function(node) {
                this.treeSelectionModel.deselect(node);
            }
        });

        /**
         * Construct a model representing a secondary navigation element.
         *
         * @constructor
         * @class SecondaryNavigationElement
         * @classdesc A secondary navigation model
         */
        Entities.SecondaryNavigationElement = Entities.NavigationElement.extend({
            /**
             * Initialize the navigation model
             * @inner
             */
            initialize: function(attributes, options) {
                var selectable = new TreePicky.Selectable(this, attributes.tree);
                _.extend(this, selectable);
                Entities.NavigationElement.prototype.initialize.apply(this, arguments);
            }    
        });

        /**
         * Construct a model representing a primary navigation collection.
         *
         * @constructor
         * @class PrimaryNavigationCollection
         * @classdesc A primary navigation collection
         */
        Entities.NavigationElementCollection = Backbone.Collection.extend({
            model: Entities.NavigationElement
        });
     });

    return Slipstream.Navigation.Entities;
});
