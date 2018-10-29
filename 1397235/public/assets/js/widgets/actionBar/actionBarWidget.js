/**
 * A module that creates an action bar from a configuration object.
 * The configuration object includes the container which should be used to render the widget
 *
 * @module ActionBarWidget
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
    "lib/template_renderer/template_renderer",
    "widgets/baseWidget",
    "widgets/actionBar/lib/actionBarTemplates",
    "widgets/actionBar/lib/menuFormatter",
    "widgets/actionBar/lib/configurationHelper",
    "widgets/tooltip/tooltipWidget",
    "widgets/help/helpWidget",
    "widgets/queryBuilder/lib/searchBuilder",
    "widgets/actionBar/conf/defaultConfiguration"
], /** @lends ActionBarWidget*/
function (render_template, BaseWidget, ActionBarTemplates, MenuFormatter, ConfigurationHelper, TooltipWidget, HelpWidget, SearchBuilder, defaultConfiguration) {

    var ActionBarWidget = function (conf) {
        /**
         * ActionBarWidget constructor
         *
         * @constructor
         * @class ActionBarWidget- Builds a actionBar widget from a configuration object.
         * @param {Object} conf - It requires the container and the actions parameters.
         * @param {Object} conf.container - DOM element that defines the container where the widget will be rendered.
         * @param {Object} conf.subTitle - defines the subtitle assigned to the action bar.
         * @param {Object} conf.actions - defines actions that will be showed in the action bar.
         * @param {Object} conf.events - defines handlers that will be invoked when the click event on an action is triggered.
         * @param {Object} conf.rbac - defines the access permission of the actions defined in the actionBar widget.
         * @param {Object} conf.layout - defines type of layout that will be used to render the actionBar. It defaults to button style.
         * @returns {Object} Current ActionBarWidget's object: this
         */

        BaseWidget.call(this, {
            "events": conf.events
        });

        var self = this,
            $actionBarContainer = $(conf.container),
            hasRequiredConfiguration = _.isObject(conf) && !_.isUndefined(conf.container) && _.isObject(conf.actions) && !_.isEmpty(conf.actions),
            actionBarId = _.uniqueId("slipstream_action_bar_widget"),
            actionBarBuilt = false,
            errorMessages = {
                "noConf": "The configuration object for the actionBar widget is missing",
                "noContainer": "The configuration for the actionBar widget must include the container property",
                "noActions": "The configuration for the actionBar widget must include the actions property",
                "noBuilt": "The actionBar widget was not built"
            },
            configurationHelper = new ConfigurationHelper(conf, defaultConfiguration),
            actionsHash; //actionsHash is the main reference to all actions and it's available after conf.actions is filtered as per access to capabilities. The usage of conf.actions should be AVOIDED once the actions are filtered by its capabilities

        /**
         * Throws error messages if some required properties of the configuration are not available
         * @inner
         */
        var showError = function () {
            if (!_.isObject(conf))
                throw new Error(errorMessages.noConf);
            else if (_.isUndefined(conf.container))
                throw new Error(errorMessages.noContainer);
            else if (!_.isObject(conf.actions) && _.isEmpty(conf.actions))
                throw new Error(errorMessages.noActions);
            else //generic error
                throw new Error(errorMessages.noBuilt);
        };

        /**
         * Builds the actionBar widget in the specified container with the elements defined in the actions property
         * @returns {Object} returns the instance of the actionBar widget that was built
         */
        this.build = function () {
            if (hasRequiredConfiguration) {
                var actionBarTemplates = new ActionBarTemplates(),
                    actionBarConfiguration = configurationHelper.rbacFilter(),
                    actionBarTemplateConfiguration = {
                        "action_bar_id": actionBarId,
                        "sub_title": _.isObject(conf.subTitle) ? conf.subTitle.content : conf.subTitle,
                        "actions": actionBarConfiguration,
                        "grid_layout": conf.layout == "grid"//default: "button"
                    },
                    actionBarContainer = render_template(actionBarTemplates.getMainTemplate(), actionBarTemplateConfiguration, actionBarTemplates.getPartialTemplates());

                $actionBarContainer = $actionBarContainer.append(actionBarContainer).find(".action-bar-widget");
                actionsHash = configurationHelper.getActionsHash(actionBarConfiguration);
                addSubTitleHelp();
                addMenu();
                addSearch();
                addIconStyle();
                addActionTooltip();
                registerEvents(actionsHash.byKey);
                actionBarBuilt = true;
            } else {
                showError();
            }
            return this;
        };

        /**
         * Adds help to the subtitle
         * @inner
         */
        var addSubTitleHelp = function () {
            if (_.isObject(conf.subTitle) && _.isObject(conf.subTitle.help)) {
                var $helpContainer =  $actionBarContainer.find(".subTitle");
                new HelpWidget({
                    "container": $helpContainer,
                    "view": conf.subTitle.help,
                    "size": "small"
                }).build();
            }
        };

        /**
         * Gets the icon class(es) assigned to an action
         * @inner
         */
        var getIconClasses = function (icon) {
            var defaultClass = "defaultIcon",
                iconClasses = _.extend({
                    "default": defaultClass,
                    "hover": "hoverIcon",
                    "disabled": "disabledIcon"
                }, icon);
            if (_.isObject(icon.default)) {
                iconClasses.default = icon.default.icon_color || defaultClass ;
            }
            return iconClasses;
        };

        /**
         * Adds the hover class to the action icons
         * @inner
         */
        var addIconStyle = function () {
            var setHoverIcon = function (icon, $icon) {
                var $iconImg = $icon.find(".iconImg");
                if (_.isObject(icon)) {
                    var iconClasses = getIconClasses(icon);
                    $icon.hover(function () {
                        !isActionDisabled($icon) && $iconImg.removeClass(iconClasses.default) && $iconImg.addClass(iconClasses.hover);
                    }, function () {
                        !isActionDisabled($icon) && $iconImg.removeClass(iconClasses.hover) && $iconImg.addClass(iconClasses.default);
                    });
                }
            };

            var allIcons = $.extend(true, {}, actionsHash.byType.menu, actionsHash.byType.icon);
            for (var key in allIcons) {
                var icon = allIcons[key].icon;
                if (icon) {
                    var $icon = getActionContainer(key);
                    setHoverIcon(icon, $icon);
                }
            }
        };

        /**
         * Adds the menu type to the action bar
         * @inner
         */
        var addMenu = function () {
            if (_.size(actionsHash.byType.menu)) {
                var menuFormatter = new MenuFormatter(actionBarId),
                    getMenuElements = function (key) {
                        return configurationHelper.getMenuElements(key, actionsHash);
                    };
                for (var key in actionsHash.byType.menu) {
                    var menuItems = actionsHash.byType.menu[key].items,
                        $menu = getActionContainer(key);
                    if (menuItems) {
                        menuFormatter.addActionMenu(key, $menu, getMenuElements, isActionDisabled);
                    } else {
                        $menu.hide();
                    }
                }
            }
        };

        /**
         * Adds the search type to the action bar
         * @inner
         */
        var addSearch = function () {
            if (_.size(actionsHash.byType.search)) {
                var searchBuilder = new SearchBuilder();
                for (var key in actionsHash.byType.search) {
                    var $search = getActionContainer(key),
                        data = {
                            key: key
                        };
                    searchBuilder.buildSearch($search, actionsHash.byType.search[key], self._invokeHandlers, data);
                }
            }
        };

        /**
         * Adds tooltips that describe an action
         * @inner
         */
        var addActionTooltip = function () {
            new TooltipWidget({
                "container": $actionBarContainer,
                "elements": defaultConfiguration.tooltip
            }).build();
        };

        /**
         * Register handlers for actions that provide a handler by using the events property or the bindEvents method
         * @param {Object} keysHash - object with a key that represents the action key and the value of the key should be an Object with the handler and capabilities properties. handler is a required property and it represents the callback that will be invoked when the action is clicked. handler should be represented as an array, so multiple callbacks to the same event can be added. capabilities is an Array of string and allows to disable an action if the user does not have the corresponding capabilities. Support for capabilities is work in progress.
         * @inner
         */
        var registerEvents = function (keysHash) {
            var registerEvent = function (key, eventName, $container) {
                if (key) {
                    var eventData = {
                        "key": key
                    };
                    $container.unbind(eventName + key).bind(eventName + key, function (event) {
                        !isActionDisabled($container) && self._invokeHandlers(key, event.originalEvent, eventData);
                    });
                }
            };
            var actionKey, actionConfiguration, $action;
            for (actionKey in keysHash) {
                actionConfiguration = actionsHash.byKey[actionKey];
                if (!_.isUndefined(actionConfiguration)) {
                    $action = getActionContainer(actionKey);
                    if (actionConfiguration.menu_type && actionConfiguration.items) { //an action with items has a menu and each item has its own key
                        actionConfiguration.items.forEach(function (item) {
                            registerEvent(item.key, "menu.actionBar.", $action);
                            if (_.isArray(item.items)) {
                                item.items.forEach(function (subItem) {
                                    registerEvent(subItem.key, "menu.actionBar.", $action);
                                });
                            }
                        });
                    } else if (!actionConfiguration.search_type){
                        registerEvent(actionKey, "click.actionBar.", $action);
                    }
                }
            }
        };

        /**
         * Provides the jQuery object container that an action has
         * @param {string} actionKey - key of the action
         * @inner
         */
        var getActionContainer = function (actionKey) {
            var $action = $actionBarContainer.find("." + actionKey);
            return $action;
        };

        /**
         * Indicates if an action is currently enabled or disabled
         * @param {Object} $action - jQuery Object of an action
         * @returns {boolean} true if an action is disabled or false if the action is enabled
         * @inner
         */
        var isActionDisabled = function ($action) {
            var isDisabled = _.isElement($action.find("[disabled]")[0]);
            return isDisabled;
        };

        /**
         * Register handlers for the actions provided in the input parameter
         * @param {Object} updatedEventsHash - object with a key/value pair. key represents the event key and the value is an Object with the handler and capabilities properties. handler is a required property and it represents the callback that will be invoked when the action is clicked. handler should be represented as an array, so multiple callbacks to the same event can be added. capabilities is an Array of string and allows to disable an action if the user does not have the corresponding capabilities. Support for capabilities is work in progress.
         */
        this.bindEvents = function (updatedEventsHash) {
            if (actionBarBuilt) {
                self._bindEvents(updatedEventsHash);
                registerEvents(updatedEventsHash);
            } else {
                throw new Error(errorMessages.noBuilt);
            }
        };

        /**
         * Unregister handlers for the actions provided in the input parameter
         * @param {Object} updatedEventsHash - object with a key/value pair. key represents the event key and the value is an Object with the handler property. handler is a required property and it represents the callback that should be unregistered.
         */
        this.unbindEvents = function (updatedEventsHash) {
            if (actionBarBuilt) {
                self._unbindEvents(updatedEventsHash);
            } else {
                throw new Error(errorMessages.noBuilt);
            }
        };

        /**
         * Updates the state of an action to enabled or disabled.
         * @param {Object} updatedEventsHash - Object with a key/value pair. key represents the action key and the value is a boolean that indicates if the action should be enabled (true) or disabled (false)
         */
        this.updateDisabledStatus = function (updatedStatusHash) {
            if (actionBarBuilt) {
                var actionKey, $action,
                    updateActionIcon = function ($actionIcon, disabled) {
                        var icon = actionsHash.byKey[actionKey].icon;
                        if (_.isObject(icon)) {
                            var iconClasses = getIconClasses(icon);
                            if (disabled) {
                                $actionIcon.removeClass(iconClasses.default).addClass(iconClasses.disabled);
                            } else {
                                $actionIcon.removeClass(iconClasses.disabled).addClass(iconClasses.default);
                            }
                        }
                    };
                for (actionKey in updatedStatusHash) {
                    $action = getActionContainer(actionKey).find(">");
                    if (updatedStatusHash[actionKey]) {
                        $action.attr("disabled", true);
                    } else {
                        $action.removeAttr("disabled");
                    }
                    //if the action is an icon, then the icon classes needs to be updated
                    $action.hasClass("iconImg") && updateActionIcon($action, updatedStatusHash[actionKey]);
                    configurationHelper.updateActionStatus(actionsHash, updatedStatusHash);
                }
            } else {
                throw new Error(errorMessages.noBuilt);
            }
        };

        /**
         * Clean up the specified container from the resources created by the actionBar widget
         * @returns {Object} returns the instance of the actionBar widget
         */
        this.destroy = function () {
            if (actionBarBuilt) {
                $actionBarContainer.remove();
            } else {
                throw new Error(errorMessages.noBuilt);
            }
            return this;
        };

    };

    ActionBarWidget.prototype = Object.create(BaseWidget.prototype);
    ActionBarWidget.prototype.constructor = ActionBarWidget;

    return ActionBarWidget;
});