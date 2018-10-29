/**
 * A module that formats and adds an action menu
 *
 * @module MenuFormatter
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
    'widgets/contextMenu/contextMenuWidget'
], /** @lends MenuFormatter */
function (ContextMenuWidget) {

    /**
     * MenuFormatter constructor
     *
     * @constructor
     * @class MenuFormatter - Formats an action menus, more menus and context menu configuration objects and builds them.
     * @returns {Object} Current MenuFormatter's object: this
     */
    var MenuFormatter = function (actionBarId) {

        /**
         * Builds the MenuFormatter
         * @returns {Object} Current "this" of the class
         */
        var moreMenuObj;

        /*
         * Builds a menu in an action menu container
         * @param {string} menuId - ids of the action to have a menu
         * @param {Object} $menuContainer - jQuery Object of the action to have a menu
         * @param {function} getMenuElements - when it is invoked, it provides the items that should be part of the menu
         * @param {function} isActionDisabled - when it is invoked, it indication if the action menu is enabled or disabled
         */
        this.addActionMenu = function (menuId, $menuContainer, getMenuElements, isActionDisabled) {
            var menu = getMenuElementsConfiguration(getMenuElements(menuId));
            var isHover = menu.hover ? true : false;
            var eventString = isHover ? "mouseover.actionBar" : "click.actionBar";
            $menuContainer.off(eventString).on(eventString, function (e) {
                if (!isActionDisabled($menuContainer)) {
                    var conf = {
                        "elements": menu,
                        "container": "#" + actionBarId + " ." + menuId,//unique identifier
                        "dynamic": true,
                        "trigger": 'left'
                    };
                    if (isHover) {
                        conf = $.extend({
                            "trigger": 'hover',
                            "autoHide": true
                        }, conf);
                    }
                    moreMenuObj && moreMenuObj.destroy();
                    moreMenuObj = new ContextMenuWidget(conf);
                    moreMenuObj.build().open();
                }
            });
        };

        /*
         * Provides the elements configuration required to build a menu. The menu is showed exactly below the container.
         * @inner
         */
        var getMenuElementsConfiguration = function (menuConfiguration) {
            return _.extend({
                "callback": function (key, options) {
                    $(this).trigger("menu.actionBar." + key, {
                        "key": key,
                        "$container": $(this)
                    });
                },
                "position": function(opt, x, y) {
                    opt.$menu.position({ my: "left top", at: "left bottom", of: opt.$trigger, offset: "0 0"});
                }
            }, menuConfiguration);
        };

    };

    return MenuFormatter;
});