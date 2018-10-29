/**
 * A module that builds a Context Menu widget from a configuration object.
 * The configuration object includes the container which should be used to render the widget
 * and the list of label/values that should be showed in the Context Menu.
 *
 * *icons* property has been deprecated
 *
 * @module ContextMenuWidget
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'jquery.contextMenu'
],  /** @lends ContextMenuWidget */
    function(contextMenu) {

    /**
     * ContextMenuWidget constructor
     *
     * @constructor
     * @class ContextMenuWidget - Builds a Context Menu widget from a configuration object.
     *
     * @param {Object} conf - It requires two parameters:
     * container: define the container where the widget will be rendered
     * elements: define the items that should be showed in the Context Menu, callback and auto hide options.
     * dynamic: defines if the DOM footprint of the context menu should be destroyed after the menu is hidden
     * @returns {Object} Current ContextMenuWidget's object: this
     */
    var ContextMenuWidget = function(conf){

        var isSubmenuConfigured = false;
        // This object will include callback functions which can be used by other widgets.
        var contextMenuCallbacks = {}; 
        /** 
         * Builds the Context Menu widget in the specified container
         * @returns {Object} Current "this" of the class
         */
        this.build =  function () {
            var contextMenuConfiguration =  {selector: conf.container};
            conf.trigger && (contextMenuConfiguration.trigger = conf.trigger);
            contextMenuConfiguration.zIndex = conf.zIndex || 200;
            var contextMenuElements = formatConfiguration(conf);
            if (conf.dynamic) {
                contextMenuConfiguration.build = function($trigger, e){
                    conf.position && (this.position = conf.position);
                    conf.context && (this.context = conf.context);
                    conf.autoHide && (this.autoHide = conf.autoHide);
                    return contextMenuElements;
                }
            } else {
                contextMenuConfiguration =  _.extend(contextMenuConfiguration, contextMenuElements);
                conf.position && (contextMenuConfiguration.position = conf.position);
                conf.context && (contextMenuConfiguration.context = conf.context);
            }
            
            setHasSubmenu(contextMenuElements);
            if(!isSubmenuConfigured) {
                contextMenuConfiguration.className = (contextMenuConfiguration.className) ?  contextMenuConfiguration.className + ' context-menu-scroll' : 'context-menu-scroll';
            }

            $.contextMenu(contextMenuConfiguration);

            return this;
        };

        /**
         * Reformat the configuration parameters from the Context Menu widget configuration to parameters that the third party context menu library (contextMenu) can use.
         * @param {Object} context - ContextMenu's configuration for the elements section
         * @returns {Object} Reformatted Tooltip elements parameter
         */
        var formatConfiguration =  function (conf) {
            var contextMenuConfiguration = $.extend( true, {}, conf.elements),
                confItems = conf.elements.items,
                confItem, confItemItem, item;
            contextMenuConfiguration['items']={};
            for (var i=0; i<confItems.length; i++){
                confItem=confItems[i];
                getItemMenuConfiguration(confItem,contextMenuConfiguration);
                if (confItem.items){
                    confItemItem = confItem.items;
                    contextMenuConfiguration.items[confItem.key].items={};
                    for (var j=0; j<confItemItem.length; j++){
                        getItemMenuConfiguration(confItemItem[j],contextMenuConfiguration.items[confItem.key]);
                    }
                }
            }

            if (contextMenuConfiguration.events){
                var confShowEvent =  contextMenuConfiguration.events.show;
                var confHideEvent =  contextMenuConfiguration.events.hide;

            }
            else {
                contextMenuConfiguration.events = {};
            }

            contextMenuConfiguration.events.show = function (opt) {
                /**
                 *  Function to configure max-height of the context-menu.
                 *  @param {Number} - max-height to be set for the context-menu.
                 */
                var configureMaxHeight = function (maxHeight) {
                    if (!isSubmenuConfigured) {
                        opt.$menu.css('max-height', maxHeight);
                    }
                };
                contextMenuCallbacks.configureMaxHeight = configureMaxHeight;

                contextMenuConfiguration.maxHeight && configureMaxHeight(contextMenuConfiguration.maxHeight);
                if (_.isFunction(confShowEvent)) {
                    return confShowEvent.call(this, opt, contextMenuCallbacks);
                }
            };

            contextMenuConfiguration.events.hide = function (opt) {
                if (_.isFunction(confHideEvent)) {
                    return confHideEvent.call(this, opt);
                }
            };

            return contextMenuConfiguration;
        };

        /**
         * Reformat the item element of Context Menu widget to a format that the third party context menu library (contextMenu) can use.
         * @param {Object} itemConfiguration - configuration of the item
         * @param {Object} contextMenuConfiguration - ContextMenu's configuration for the elements section
         */
        var getItemMenuConfiguration  = function (itemConfiguration, contextMenuConfiguration){
            var itemMenuConfiguration, itemKey;
            if (itemConfiguration.separator){
                contextMenuConfiguration['items'][_.uniqueId("context_menu_separator")]='';
            } else if (itemConfiguration.title){
                itemKey = _.uniqueId("context_menu_title");
                itemMenuConfiguration = {
                    "name": itemConfiguration.title,
                    "type": "text",
                    "className": itemConfiguration.className ? "contextMenuTitle " + itemConfiguration.className : "contextMenuTitle"
                };
                contextMenuConfiguration.items[itemKey] = itemMenuConfiguration
            } else if (itemConfiguration.key){
                itemMenuConfiguration = _.extend({},itemConfiguration);
                itemKey = itemMenuConfiguration.key;
                contextMenuConfiguration.items[itemKey] = {"name": itemMenuConfiguration.label};
                delete itemMenuConfiguration.key;
                delete itemMenuConfiguration.label;
                if(itemMenuConfiguration.groupId){
                    itemMenuConfiguration.radio = itemMenuConfiguration.groupId;
                    delete itemMenuConfiguration.groupId;
                }
                _.extend(contextMenuConfiguration.items[itemKey],itemMenuConfiguration);
            }
        };
        
        /**
         * Check if submenu is configured for any of list items.
         * @param {Object} config - ContextMenu's configuration for the elements section
         * @inner        
         */
        var setHasSubmenu = function(config) {
            var list = config.items;
            for(listItem in list) {
                if(!_.isUndefined(list[listItem]['items'])){
                    isSubmenuConfigured = true;
                    break;
                }
            }
        }

        /**
         * Set values for input elements. It could be used to import states from data store.
         * @param {Object} opt - it is a reference to the options object passed at contextMenu registration
         * @param {Object} data - data to be set
         * @returns {Object} Current Context Menu object
         */
        this.setInputValues =  function (opt, data) {
            $.contextMenu.setInputValues(opt, data);
            return this;
        };

        /**
         * Fetch values for input elements. It could be used to export states from data store.
         * @param {Object} opt - it is a reference to the options object passed at contextMenu registration
         * @param {Object} data - data to be set
         * @returns {Object} Current Context Menu object
         */
        this.getInputValues =  function (opt, data) {
            $.contextMenu.getInputValues(opt, data);
            return this;
        };

        /**
         * Allows to open the context menu programmatically
         * @returns {Object} Current Context Menu object
         */
        this.open =  function (pos) {
            $(conf.container).contextMenu(pos);
            return this;
        };

        /**
         * Destroys all elements created by the Context Menu widget in the specified container
         * @returns {Object} Current Context Menu object
         */
        this.destroy =  function () {
            $.contextMenu('destroy', conf.container );
            return this;
        };
    };

    return ContextMenuWidget;
});