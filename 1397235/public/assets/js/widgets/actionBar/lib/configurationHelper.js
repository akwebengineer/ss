/**
 * A library that provides methods to format configuration so it can be consumed by the actionBar widget
 *
 * @module ConfigurationHelper
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'text!widgets/actionBar/templates/actionBarContainer.html'
], /** @lends ConfigurationHelper */
function (actionBarContainer) {

    /*
     * ConfigurationHelper constructor
     *
     * @constructor
     * @class ConfigurationHelper
     */
    var ConfigurationHelper = function (conf, defaultConfiguration) {

        /**
         * Filters actions as per its rbac state
         * @returns {Array} the list of actions
         */
        this.rbacFilter = function () {
            var actions = conf.actions,
                rbacResolver = getRBACResolver();

            if (rbacResolver || conf.rbac) {
                actions = _.filter(actions, function (action) {
                    if (action.items) {
                        action.items = _.filter(action.items, function (item) {
                            return hasAccess(item.capabilities, rbacResolver);
                        });
                        if (!action.items.length) { //if all items in a menu have restricted access, then the menu is not needed
                            return false;
                        }
                    }
                    return hasAccess(action.capabilities, rbacResolver);
                });
            }
            return actions;
        };

        /**
         * Resolves RBAC permission as defined in Slipstream
         * @inner
         */
        var getRBACResolver = function () {
            if (typeof(Slipstream) != "undefined" && Slipstream.SDK && Slipstream.SDK.RBACResolver) {
                return new Slipstream.SDK.RBACResolver();
            }
        };

        /**
         * Checks if a capability has access permission
         * @inner
         */
        var hasAccess = function (capability, rbacResolver) {
            if (capability) {
                var hasAccess;
                if (!_.isUndefined(rbacResolver)) {
                    hasAccess = rbacResolver.verifyAccess(capability);
                } else if (conf.rbac) {
                    hasAccess = conf.rbac[capability];
                }
                return _.isUndefined(hasAccess) || hasAccess;
            }
            return true;
        };

        /**
         * Gets an actionsHash from the actions property by grouping the actions byKey or byType (button, icon, menu, search or others)
         * @param {Array} actionsConfiguration - configuration of the actionBar widget
         * @inner
         */
        this.getActionsHash = function (actionsConfiguration) {
            var actionsHash = {
                "byKey": {},
                "byType": {},
                "byKeyDisabledStatus": {}
            };
            var setActionType = function (type) {
                    if (_.isUndefined(actionsHash.byType[type])) {
                        actionsHash.byType[type] = {};
                    }
                },
                setActionHashByType = function (action) {
                    var actionType;
                    if (action.menu_type) {
                        actionType = "menu";
                    } else if (action.search_type) { //full support, to be added
                        actionType = "search";
                    } else if (action.icon_type) {
                        actionType = "icon";
                    } else { //button_type
                        actionType = "button";
                    }
                    setActionType(actionType);
                    actionsHash.byType[actionType][action.key] = action;
                },
                getActionDisabledStatus = function (disabled) {
                    if (_.isBoolean(disabled)) {
                        return disabled;
                    }
                    return false;
                };
            actionsConfiguration.forEach(function (action) {
                if (!_.isUndefined(action.key)) {
                    setActionHashByType(action);
                    actionsHash.byKey[action.key] = action;
                    actionsHash.byKeyDisabledStatus[action.key] = getActionDisabledStatus(action.disabledStatus);
                    if (_.isArray(action.items)) {
                        action.items.forEach(function (item) {
                            if (!_.isUndefined(item.key)) {
                                actionsHash.byKeyDisabledStatus[item.key] = getActionDisabledStatus(item.disabledStatus);
                                if (_.isArray(item.items)) {
                                    item.items.forEach(function (subItem) {
                                        if (!_.isUndefined(subItem.key)) {
                                            actionsHash.byKeyDisabledStatus[subItem.key] = getActionDisabledStatus(subItem.disabledStatus);
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
            return actionsHash;
        };

        /**
         * Updates the hash with the key/status (enable/disable) using an updated status hash
         * @param {Object} actionsHash - current action configuration Object with a key/value pair. key represents the action key and the value is a boolean that indicates if the action should be disabled (true) or enabled (false)
         * @param {Object} updatedEventsHash - updated action configuration Object with a key/value pair. key represents the action key and the value is a boolean that indicates if the action should be disabled (true) or enabled (false)
         */
        this.updateActionStatus = function (actionsHash, updatedStatusHash) {
            _.extend(actionsHash.byKeyDisabledStatus, updatedStatusHash);
        };


        /**
         * Gets the menu elements configuration for an action (key) using the actionsHash
         * @param {String} key - the key of the action menu
         * @param {Object} actionsHash - hash with all actions to be included in the actionBar widget
         * @returns {Array} the elements to be included in the menu
         */
        this.getMenuElements = function (key, actionsHash) {
            var menuElements = actionsHash.byType.menu[key],
                items = [];
            menuElements = _.omit(menuElements, defaultConfiguration.commonProperties.action);
            menuElements.items.forEach(function (item) {
                item.disabled = actionsHash.byKeyDisabledStatus[item.key];
                item = _.omit(item, defaultConfiguration.commonProperties.icon);
                if (_.isArray(item.items)) {
                    subItems = [];
                    item.items.forEach(function (subItem) {
                        subItem.disabled = actionsHash.byKeyDisabledStatus[subItem.key];
                    });
                    subItems.length && item.push(subItems);
                }
                items.push(item);
            });
            if (items.length) {
                menuElements.items = items;
            }
            return menuElements;
        };

    };

    return ConfigurationHelper;
});
