/**
 * A module that builds the bar for action buttons, action icons, and action menus of the grid widget
 *
 * @module ActionBuilder
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define([
    'widgets/dropDown/dropDownWidget',
    'widgets/actionBar/actionBarWidget',
    'widgets/grid/conf/actionBarConfiguration',
    'lib/template_renderer/template_renderer'
], /** @lends ActionBuilder */
function (DropDownWidget, ActionBarWidget, actionBarWidgetConfiguration, render_template) {

    /**
     * ActionBuilder constructor
     *
     * @constructor
     * @class ActionBuilder - Builds the action bar of the grid widget
     * @param {Object} conf - Configuration of the grid widget
     * @param {Object} templates - templates of the grid widget
     * @param {Object} rbacHash from grid
     * @param {Class} gridConfigurationHelper - Grid gridConfigurationHelper Class
     *
     * @returns {Object} Current ActionBuilder's object: this
     */
    var ActionBuilder = function (conf, templates, rbacHash, gridConfigurationHelper) {

        var self = this,
            hasCustomButtons = conf.elements.actionButtons && conf.elements.actionButtons.customButtons,
            hasCrudActions = conf.actionEvents && (conf.actionEvents.createEvent || conf.actionEvents.updateEvent || conf.actionEvents.deleteEvent),
            hasFilter = conf.elements.filter,
            menuFormatter,
            actionElements,
            getSelectedRows,
            reservedElementClasses,
            $gridContainer,
            $gridTable,
            $gridContent,
            actionId,
            actionBarContainerHash,
            subtitleMinWidthThreshold = 140,
            actionBarConfiguration;
        /**
         * Initialize the ActionBarBuilder
         * @param {jQuery Object} gridContainer - jQuery Object with the grid container
         * @param {Class} menuFormatter - instance of the MenuFormatter class
         * @param {Object} actionElements - all the action elements available in the grid
         * @param {function} getRows - when it is executed, it provides the selected rows
         * @param {Object} reservedElementClasses - Hash with classes reserved to restrict some interactions
         * @returns {Object} A hashtable with the jQuery object containers of the action filter bar elements
         */
        this.init = function (gridContainer, menu, actions, getRows, reservedClasses) {
            $gridContainer = gridContainer;
            $gridTable = gridContainer.find('.gridTable');
            setActionBarContainerHash();
            hasCustomButtons && setActionBarConfigurationHash();
            actionId = actionBarContainerHash.$subHeaderContainer.attr("id");
            menuFormatter = menu;
            actionElements = actions;
            getSelectedRows = getRows;
            reservedElementClasses = reservedClasses;
            return actionBarContainerHash;
        };

        /**
         * Reformats the action buttons
         * @param {Object} actionButtons - actionButtons config
         * @param {boolean} isIconType - indicates is the actions available in the actionButtons properties are all icons. It is required in cases where actionButtons is not a mix of icons, buttons and menus and the icon_type check is not required.
         * @returns {Object} actionButtons - actionButtons config
         */
        this.formatCustomActionIcons = function (actionButtons, isIconType) {
            if (actionButtons) {
                if (actionButtons.defaultButtons) {
                    for (var key in actionButtons.defaultButtons) {
                        var defaultButton = actionButtons.defaultButtons[key];
                        if (_.isUndefined(defaultButton.icon_type) && _.isUndefined(defaultButton.button_type) && _.isUndefined(defaultButton.menu_type)) {
                            defaultButton.menu_type = true;
                        }
                    }
                }
                if (actionButtons.customButtons) {
                    var customButtons = getPermissionList(actionButtons.customButtons, isIconType);
                    actionButtons.customButtons = customButtons;
                }
            }
            return actionButtons;
        };

        /**
         * Adds action buttons, icons and menus to the grid widget
         * @param {function} addCustomMenuItemEvent -  when it is executed, it attaches events to the buttons, icons and menus
         */
        this.addActionButtonsMenus = function (addCustomMenuItemEvent, getIconClasses) {
            conf.elements.contextMenu && addMoreMenu();
            if (conf.elements.actionButtons) {
                var hasCustomAction = gridConfigurationHelper.hasColumnProperty("custom_type", undefined, conf.elements.actionButtons.customButtons),
                    hasDropdownAction = gridConfigurationHelper.hasColumnProperty("dropdown_type", undefined, conf.elements.actionButtons.customButtons);
                hasCustomAction && addCustomAction();
                hasDropdownAction && addDropdownMenu();
                addActionButtons(getIconClasses);
                addActionMenus(addCustomMenuItemEvent);
            }
            setActionButtonsStatus();
            updateActionBarBasedOnGridWidth();
        };

        /**
         * Adds the more menu to the action area if there are more items to show
         * @inner
         */
        var addMoreMenu = function () {
            var moreMenuId = '#' + actionId + ' ' + '.more',
                $moreContainer = $gridContainer.find(moreMenuId);
            menuFormatter.setRbacHash(rbacHash);
            menuFormatter.addMoreMenu(moreMenuId, $moreContainer, getSelectedRows, actionBarConfiguration);
        };

        /**
         * Adds the custom action from its formatter into the .customAction container of the action area. Disables it if disabledStatus is set to true
         * @inner
         */
        var addCustomAction = function () {
            actionBarContainerHash.$actionContainer.find(".customAction").each(function () {
                var $customAction = $(this),
                    customActionKey = this.id,
                    customActionConfiguration = actionBarConfiguration.byKey[customActionKey];
                if (_.isFunction(customActionConfiguration.formatter)) {
                    var customHtmlObj = customActionConfiguration.formatter(customActionKey);
                    if (customActionConfiguration.disabledStatus) {
                        $customAction.addClass("disabled");
                        customHtmlObj.disabledStatus = customActionConfiguration.disabledStatus;
                    }
                    $customAction.find("span").append(render_template(templates.customActionContainer, customHtmlObj));
                }
            });
        };

        /**
         * Adds the dropdowan action into the .dropdownMenu container of the action area. It also binds it with associated action event.
         * @inner
         */
        var addDropdownMenu = function () {
            actionElements.dropdown = {};
            actionBarContainerHash.$actionContainer.find(".dropdownMenu").each(function () {
                var $dropdownMenu = $(this),
                    $dropdownMenuSelect = $dropdownMenu.find("select"),
                    dropdownKey = this.id,
                    dropdownConfiguration = actionBarConfiguration.byKey[dropdownKey];
                actionElements.dropdown[dropdownKey] = new DropDownWidget({
                    "container": $dropdownMenuSelect,
                    "height": "small",
                    "width": "auto",
                    "onChange": function (event) {
                        var itemKey = event.target.value;
                        conf.actionEvents && conf.actionEvents[itemKey] && triggerActionEvent($dropdownMenu, conf.actionEvents[itemKey]);
                    }
                }).build();

                for (var item in dropdownConfiguration.items) {
                    var dropdownItem = dropdownConfiguration.items[item];
                    if (conf.actionEvents && conf.actionEvents[dropdownItem.key]) {
                        bindMenuEvent(dropdownItem.key);
                    }
                }
            });
        };

        /**
         * Triggers an event with a name defined in the actionEvent. The data associated with the event provides the selected rows
         * @param {Object} $element - jQuery object of the element that will be used to trigger the event
         * @param {Object} eventConf - configuration of the event to be triggered
         * @param {Object} currentRowData - data associated with the current row
         * @inner
         */
        var triggerActionEvent = function ($element, eventConf, currentRowData) {
            var getEventData = function () {
                var eventData = getSelectedRows();
                currentRowData && _.extend(eventData, currentRowData);
                return eventData;
            };
            if (_.isString(eventConf)) {
                $element.trigger(eventConf, getEventData());
            } else if (rbacHash[eventConf['capabilities']] !== false) {
                $element.trigger(eventConf['name'], getEventData());
            }
        };


        /**
         * Binds events for actions when the action is moved from the action area to the more menu because of the width of the grid container (grid size responsiveness)
         * @param {string} customButtonKey - key of the action
         * @param {Object} currentRowData - data associated with the current row
         * @inner
         */
        var bindMenuEvent = function (customButtonKey, currentRowData) {
            var key = conf.actionEvents[customButtonKey]['name'] || conf.actionEvents[customButtonKey];
            $gridContainer.unbind('slipstreamGrid.' + key).bind('slipstreamGrid.' + key, function (e) {
                triggerActionEvent($gridTable, conf.actionEvents[e.namespace], currentRowData);
            });
        };

        /**
         * Binds the click event to the container that has the action button or icons
         * @param {Object} customButtons - ids of the buttons to bind
         * @param {Object} $container - jQuery object of the container with the button/icon action
         * @param {Object} currentRowData - data associated with the current row
         * @inner
         */
        this.bindEvents = function (customButtons, $container, currentRowData) {
            for (var customButtonKey in customButtons) {
                var $customButton = $container.find('#' + customButtonKey),
                    rbacCheck = rbacHash[customButtonKey];
                if (rbacCheck === false) {
                    $customButton.hide();
                }
                if (conf.actionEvents && conf.actionEvents[customButtonKey]) {
                    //binds event to the buttons
                    $customButton.off('click.fndtn.' + customButtonKey).on('click.fndtn.' + customButtonKey, function (e) {
                        var $actionContainer = $(this);
                        if ($actionContainer.hasClass("customAction")) { //if it's a custom action, then trigger only if it's not disabled
                            !$actionContainer.hasClass("disabled") && triggerActionEvent($actionContainer, conf.actionEvents[this.id]);
                        } else if (!~gridConfigurationHelper.getTargetElementClassList($(e.target)).indexOf("disabled")) { //if action is not disabled
                            triggerActionEvent($actionContainer, conf.actionEvents[this.id], currentRowData);
                        }
                    });
                    bindMenuEvent(customButtonKey, currentRowData);
                }
            }
        };

        /**
         * Adds state (hover, disabled) to noMenu actions like icons (icon_type), buttons (button_type) and custom actions (custom_type)
         * @param {Object} actionItem - action button config representing a custom button, icon, custom action or overridden default buttons
         * @param {function} getIconClasses - provides the CSS classes associated to an icon
         * @inner
         */
        var addNoMenuState = function (actionItem, getIconClasses) {
            var setActionElementsCustomIcons = function (customIconConf) {
                var customIcon = customIconConf || {},
                    hasDisabledStatus = _.isBoolean(actionItem.disabledStatus);
                if (hasDisabledStatus) {
                    actionElements.customIcons[actionItem.key] = _.extend(customIcon, {
                        "disabledStatus": actionItem.disabledStatus
                    });
                } else if (customIconConf) {
                    actionElements.customIcons[actionItem.key] = customIcon;
                }
            };
            if (actionItem.icon_type) {
                if (_.isObject(actionItem.icon)) {
                    var customIconConf = actionItem.icon,
                        $customIcon = actionBarContainerHash.$actionContainer.find("#" + actionItem.key);
                    //sets default and hover icon
                    var $customIconImg = $customIcon.find(".actionIcon"),
                        iconClasses = getIconClasses(customIconConf);
                    $customIcon.hover(function () {
                        !$customIconImg.hasClass("disabled") && $customIconImg.removeClass(iconClasses.default).addClass(iconClasses.hover);
                    }, function () {
                        !$customIconImg.hasClass("disabled") && $customIconImg.removeClass(iconClasses.hover).addClass(iconClasses.default);
                    });
                    setActionElementsCustomIcons(customIconConf);
                }
            } else if (actionItem['custom_type']) {
                if (_.isFunction(actionItem.formatter)) {
                    var $customElement = actionBarContainerHash.$actionContainer.find("#" + actionItem.key),
                        customElementHtml = actionItem.formatter(actionItem.key);
                    if (customElementHtml.hover) { //sets default and hover icon
                        $customElement.hover(function () {
                            $customElement.find(".customDefault").html(customElementHtml.hover);
                        }, function () {
                            $customElement.find(".customDefault").html(customElementHtml.default);
                        });
                    }
                    setActionElementsCustomIcons(customElementHtml);
                }
            } else if (actionItem.button_type) {
                setActionElementsCustomIcons();
            }
        };

        /**
         * Adds custom action buttons, icons and overridden default buttons to the grid widget
         * @param {function} getIconClasses - provides the CSS classes associated to an icon
         * @inner
         */
        var addActionButtons = function (getIconClasses) {
            var customButtons = hasCustomButtons ? actionBarConfiguration.byMenu.noMenu : {};

            //gets all overridden default items which are not menu type
            var defaultButtons = conf.elements.actionButtons.defaultButtons;
            for (var key in defaultButtons) {
                var defaultButton = defaultButtons[key];
                if (defaultButton && !defaultButton.items) { //only when it is not a context menu case, since events are triggered differently
                    customButtons[defaultButton.key] = defaultButton;
                }
            }
            if (!_.isEmpty(customButtons)) {
                self.bindEvents(customButtons, actionBarContainerHash.$actionContainer);
                actionElements.customIcons = {};
                for (var key in customButtons) {//add custom icon, button, custom types hover and state
                    addNoMenuState(customButtons[key], getIconClasses);
                }
            }
            //hides line separator for cases when it's not required
            if (!hasFilter || !(hasCustomButtons && actionBarConfiguration.byType.noIcon) || !hasCrudActions) {
                actionBarContainerHash.$subHeaderContainer.find('.actionSeparator:last-child').hide();
            }

        };

        /**
         * Check if each button or menu item has rbac permission and return the list of permission items
         * @param {Array} items - it could be action buttons or menu items
         * @param {boolean} isIconType - indicates is the actions available in the actionButtons properties are all icons. It is required in cases where actionButtons is not a mix of icons, buttons and menus and the icon_type check is not required.
         * @returns {Array} the list of permission items
         */
        var getPermissionList = function (items, isIconType) {
            var menuItems = [];
            //Check rbac for each item
            for (var i = 0; i < items.length; i++) {
                var item = items[i],
                    permission = _.isBoolean(rbacHash[item['key']]) ? rbacHash[item['key']] : true;
                if (!permission) continue;
                if (item['icon_type'] || isIconType) {
                    if (_.isString(item['icon'])) {
                        item['icon'] = {
                            default: item['icon'],
                            hover: item['icon'],
                            disabled: item['icon']
                        };
                    }
                }
                menuItems.push(item);
            }
            return menuItems;
        };
        /**
         * Adds custom action menus to the grid widget
         * @param {function} addCustomMenuItemEvent -  when it is executed, it attaches events to the buttons, icons and menus
         * @inner
         */
        var addActionMenus = function (addCustomMenuItemEvent) {
            var actionMenus = menuFormatter.getActionMenus(),
                statusCallback = conf.elements.actionButtons.itemStatusCallback;

            for (var key in actionMenus) {// loop and call context menu widget
                var actionMenu = actionMenus[key];
                var actionMenuConfiguration = menuFormatter.getActionMenuConfiguration(getSelectedRows, actionMenu.items, actionMenu.itemStatusCallback),
                    actionMenuId = '#' + actionId + ' #' + key,
                    actionMenuContainer = actionBarContainerHash.$actionContainer.find('#' + key),
                    menuItems = getPermissionList(actionMenuConfiguration.items, false); //This is the menu items which is not iconType

                menuFormatter.addActionMenu(actionMenuId, actionMenuContainer, menuItems);
                addCustomMenuItemEvent(menuItems);
            }
        };

        /**
         * Sets action button status based on RBAC permission
         * @inner
         */
        var setActionButtonsStatus = function () {
            actionElements.status = {};

            var hasDefaultButtons = conf.elements.actionButtons && conf.elements.actionButtons.defaultButtons,
                createEvent = (hasDefaultButtons && conf.elements.actionButtons.defaultButtons.create) ? conf.elements.actionButtons.defaultButtons.create.key : "createEvent",
                updateEvent = (hasDefaultButtons && conf.elements.actionButtons.defaultButtons.edit) ? conf.elements.actionButtons.defaultButtons.edit.key : "updateEvent",
                deleteEvent = (hasDefaultButtons && conf.elements.actionButtons.defaultButtons.delete) ? conf.elements.actionButtons.defaultButtons.delete.key : "deleteEvent";

            var setActionEvent = function (event, container) {
                if (conf.actionEvents[event] && rbacHash[event] !== false) {
                    actionElements.status[event] = true;
                } else {
                    actionBarContainerHash[container].hide();
                }
            };

            setActionEvent(createEvent, '$createContainer');
            setActionEvent(updateEvent, '$updateContainer');
            setActionEvent(deleteEvent, '$deleteContainer');

            if (conf.elements.actionButtons && conf.elements.actionButtons.customButtons) {
                conf.elements.actionButtons.customButtons.forEach(function (action) {
                    if (action.key)
                        actionElements.status[action.key] = true;
                });
            }
            _.extend(actionElements.status, rbacHash);

            var renameKey = function (oldKey, newKey) {
                var keyValue = actionElements.status[oldKey];
                delete actionElements.status[oldKey];
                actionElements.status[newKey] = keyValue;
            };

            for (var key in actionElements.status) { //delete all actions that doesn't have access permission (RBAC)
                if (!actionElements.status[key]) {
                    delete actionElements.status[key];
                } else {
                    switch (key) {
                        case "createEvent":
                            renameKey("createEvent", "create");
                            break;
                        case "updateEvent":
                            renameKey("updateEvent", "edit");
                            break;
                        case "deleteEvent":
                            renameKey("deleteEvent", "delete");
                            break;
                    }
                }
            }
        };

        /**
         * Updates action bar based on available grid width
         * @inner
         */
        var updateActionBarBasedOnGridWidth = function () {
            var updateActionBar = function () {
                var i = 0, originalTitleWidth, suggestedTitleWidth,
                    $gridSubtitleContent = conf.elements.subTitle ? actionBarContainerHash.$subTitleContainer.find('.content') : undefined,
                    gridSubtitleMinWidth = $gridSubtitleContent ? parseInt($gridSubtitleContent.css('min-width').slice(0, -2)) : 0;

                // Set the min width for subtitle.
                if ($gridSubtitleContent && $gridSubtitleContent.length > 0) {
                    var subtitleContentWidth = $gridSubtitleContent.width();
                    if (subtitleContentWidth > subtitleMinWidthThreshold) {
                        gridSubtitleMinWidth = subtitleMinWidthThreshold;
                        $gridSubtitleContent.css('min-width', gridSubtitleMinWidth);
                    }
                }

                var actionBarWidthDelta = function () {
                    var expectedActionBarWidth = actionBarContainerHash.$subHeaderContainer.outerWidth(true),
                        currentActionBarWidth = actionBarContainerHash.$leftHeaderContainer.outerWidth(true) + actionBarContainerHash.$actionFilterWrapperContainer.outerWidth(true);
                    return currentActionBarWidth - expectedActionBarWidth;
                };

                actionBarContainerHash.$actionFilterWrapperContainer.find('.hideAction').removeClass('hideAction');
                actionBarContainerHash.$subTitleContainer.css('width', 'auto');
                if (actionBarWidthDelta() >= 0) {
                    if (gridSubtitleMinWidth) {
                        originalTitleWidth = actionBarContainerHash.$subTitleContainer.width();
                        suggestedTitleWidth = originalTitleWidth - actionBarWidthDelta() - 5;
                        if (suggestedTitleWidth > gridSubtitleMinWidth) {
                            actionBarContainerHash.$subTitleContainer.width(suggestedTitleWidth);
                        } else {
                            actionBarContainerHash.$subTitleContainer.width(gridSubtitleMinWidth);
                        }
                    }
                    if (hasCustomButtons) {
                        var inMoreMaxSize = _.size(actionBarConfiguration.byMenu.inMore);
                        actionBarConfiguration.inMore = [];
                        while (actionBarWidthDelta() >= 0 && i < inMoreMaxSize && actionBarContainerHash.$actionFilterWrapperContainer.find('.hideAction').length < inMoreMaxSize) {
                            var buttonKey = actionBarConfiguration.byMenu.inMore[i++].key,
                                $button = actionBarContainerHash.$actionFilterWrapperContainer.find('#' + buttonKey);
                            $button.addClass('hideAction');
                            actionBarConfiguration.inMore.push({
                                "key": buttonKey,
                                "$button": $button.find(">span")
                            });
                        }
                    }
                } else if (actionBarConfiguration) {
                    delete actionBarConfiguration.inMore;
                }
            };
            //register handler for resize event
            $gridContainer.bind("slipstreamGrid.resized:heightWidth", function (e) {
                updateActionBar();
            });
        };

        /**
         * Sets action bar containers in a hastable
         * @inner
         */
        var setActionBarContainerHash = function () {
            actionBarContainerHash = {
                $subHeaderContainer: $gridContainer.find('.sub-header'),
                $actionFilterWrapperContainer: $gridContainer.find('.action-filter-wrapper'),
                $subTitleContainer: $gridContainer.find('.grid-sub-title'),
                $actionContainer: $gridContainer.find('.actions'),
                $createContainer: $gridContainer.find('.create'),
                $updateContainer: $gridContainer.find('.edit'),
                $deleteContainer: $gridContainer.find('.delete'),
                $moreContainer: $gridContainer.find('.more'),
                $searchContainer: $gridContainer.find('.search-container'),
                $leftHeaderContainer: $gridContainer.find('.gridLeftHeaderWrapper')
            };

            //returns the container for the overridden default buttons
            var getDefaultButtonContainer = function (item) {
                var itemKey = conf.elements.actionButtons.defaultButtons[item].key;
                return actionBarContainerHash.$actionContainer.find('#' + itemKey);
            };

            //updates action containers based on menu/split button
            if (conf.elements.actionButtons && conf.elements.actionButtons.defaultButtons) {
                if (!_.isElement(actionBarContainerHash.$createContainer) && conf.elements.actionButtons.defaultButtons["create"]) {
                    actionBarContainerHash.$createContainer = getDefaultButtonContainer("create");
                }
                if (!_.isElement(actionBarContainerHash.$updateContainer) && conf.elements.actionButtons.defaultButtons["edit"]) {
                    actionBarContainerHash.$updateContainer = getDefaultButtonContainer("edit");
                }
                if (!_.isElement(actionBarContainerHash.$deleteContainer) && conf.elements.actionButtons.defaultButtons["delete"]) {
                    actionBarContainerHash.$deleteContainer = getDefaultButtonContainer("delete");
                }
            }
            if (hasFilter) {
                actionBarContainerHash.$searchInput = $gridContainer.find('.grid_filter_input input');
            }
        };

        /**
         * Sets action bar configuration in a hashtable
         * @inner
         */
        var setActionBarConfigurationHash = function () {
            var inMore = 0,
                iconOrder = 0,
                noIconOrder = 0; //action: button, dropdown, checkbox or custom
            actionBarConfiguration = {
                byType: {
                    icon: {},
                    noIcon: {}
                },
                byMenu: {
                    context: {}, //only menu_type
                    dropdown: {}, //only dropdown_type
                    noMenu: {}, //button_type, icon_type, custom_type
                    inMore: {} //button_type, menu_type, dropdown_type, custom_type (only with unformat)
                },
                byKey: {}
            };
            conf.elements.actionButtons.customButtons.forEach(function (action) {
                if (action.icon_type) { //icons are not moved to More menu on width responsiveness
                    actionBarConfiguration.byType.icon[iconOrder++] = action;
                    actionBarConfiguration.byMenu.noMenu[action.key] = action;
                } else {
                    if (action.menu_type) {
                        actionBarConfiguration.byType.noIcon[noIconOrder++] = action;
                        actionBarConfiguration.byMenu.context[action.key] = action;
                        actionBarConfiguration.byMenu.inMore[inMore++] = action;
                    } else if (action.dropdown_type) {
                        actionBarConfiguration.byType.noIcon[noIconOrder++] = action;
                        actionBarConfiguration.byMenu.dropdown[action.key] = action;
                        actionBarConfiguration.byMenu.inMore[inMore++] = action;
                    } else { //button or custom type defaults to "noIcon" and "noMenu"
                        actionBarConfiguration.byType.noIcon[noIconOrder++] = action;
                        actionBarConfiguration.byMenu.noMenu[action.key] = action;
                        if (action.button_type || (action.custom_type && _.isFunction(action.unformat))) {
                            actionBarConfiguration.byMenu.inMore[inMore++] = action;
                        }
                    }
                    actionBarConfiguration.byKey[action.key] = action;
                }
            });
        };

        /**
         * Build the menu that will be showed on a hover of a row
         * @param {function} getRowData - when it is executed, it provides the data of the current row like id, current data, and original row data
         */
        this.setRowHoverMenu = function (getRowData) {
            var isRowHoverMenuDynamic = _.isFunction(conf.elements.rowHoverMenu),
                isRowHoverActionMenuOpened = false,
                rowHoverMenu, $hoverMenu;
            /**
             * Checks if the row has a valid interaction; for example, rowNoSelectable reserved class will limit row interaction like not menu on row hover
             * @param {Object} $row - jQuery Object for the row to be tested
             * @returns {boolean} if the row
             * @inner
             */
            var isValidRowHover = function ($row) {
                if (!$row.hasClass(reservedElementClasses.rowNoSelectable)) {
                    return true;
                }
                return false;
            };

            /**
             * Gets the configuration required to build the action row hover action bar
             * @param {Object} rowHoverMenu - configuration provided by the user of the widget
             * @inner
             */
            var getRowHoverMenuActions = function (rowHoverMenu) {
                var hasDefaultButtons = rowHoverMenu.defaultButtons,
                    isValidAction = function (key) { //test if the action has an event associated and doesn't have RBAC restriction
                        var actionEvent = conf.actionEvents[key];
                        return actionEvent && rbacHash[key] != false;
                    },
                    hasActionType = function (action) { //test if the action belongs to one of the default action types (for example, icon_type, button_type or menu_type)
                        var defaultActionsType = actionBarWidgetConfiguration.actionType;
                        for (var i = 0; i < defaultActionsType.length; i++) {
                            var defaultActionType = defaultActionsType[i];
                            if (_.has(action, defaultActionType)) {
                                return true;
                            }
                        }
                        return false;
                    },
                    addAction = function (action, capabilities) {//adds the action either on the actions (depending on action type) or more menu (default one)
                        if (capabilities) {
                            action.capabilities = capabilities;
                        }
                        if (hasActionType(action)) {
                            actions.push(action);
                        } else {
                            moreActions.push(action);
                        }
                    },
                    setDefaultActionValue = function (defaultAction, key) {//sets the default create and delete actions
                        var disableDefaultAction, action;
                        if (hasDefaultButtons) {
                            action = rowHoverMenu.defaultButtons[key];
                            disableDefaultAction = action == false;
                        }
                        if (!disableDefaultAction) {
                            if (_.isObject(action)) {
                                $.extend(true, defaultAction, action);
                            }
                            addAction(defaultAction);
                        }
                    },
                    actions = [], moreActions = [];
                var defaultActions = actionBarWidgetConfiguration.defaultActions;
                for (var key in defaultActions) {
                    var defaultAction = defaultActions[key];
                    isValidAction(defaultAction.key) && setDefaultActionValue(defaultActions[key], key);
                }
                rowHoverMenu.customButtons.forEach(function (customAction) {
                    isValidAction(customAction.key) && addAction(customAction);
                });
                if (moreActions.length) {
                    var moreMenuRow = $.extend(true, {
                        "items": moreActions,
                        "events": {
                            show: function (opt) {
                                isRowHoverActionMenuOpened = true;
                            },
                            hide: function (opt) {
                                isRowHoverActionMenuOpened = false;
                            }
                        },
                        "position": function(opt, x, y) {
                            opt.$menu.position({ my: "left top", at: "left-12 bottom", of: opt.$trigger, offset: "0 0"});
                        }
                    }, actionBarWidgetConfiguration.moreMenuRow);
                    actions.push(moreMenuRow);
                }
                return actions;
            };

            /**
             * Gets the events required to build the action row hover action bar
             * @param {Object} $tr - jQuery Object of the row that will have the hover action bar
             * @param {Object} rowData - data of the row that will be provided when an action is selected
             * @inner
             */
            var getRowHoverMenuEvents = function ($tr, rowData) {
                var actionBarEvents = {},
                    actionBarHandler = function (e, actionData) {
                        triggerActionEvent($tr, conf.actionEvents[actionData.key], {
                            "rowOnHover": rowData
                        });
                    };
                for (var key in conf.actionEvents) {
                    actionBarEvents[key] = {
                        "handler": [actionBarHandler]
                    };
                }
                return actionBarEvents;
            };

            /**
             * Calculate the left position of the .hoverMenu-wrapper container during scrolling
             */
            var getHoverMenuLeftOffset = function () {
                //recalculated in case grid got resized
                var containersSize = {
                    rowTableWidth: $gridTable.width(),
                    gridContentWidth: $gridContent.width(),
                    saveCancelWidth: $hoverMenu.outerWidth(true),
                    saveCancelPaddingWidth: $hoverMenu.outerWidth(true) - $hoverMenu.width()
                };
                var hoverMenuX = containersSize.gridContentWidth - containersSize.saveCancelWidth,
                    hoverMenuScrollX = hoverMenuX + $gridContent.scrollLeft();
                if (hoverMenuScrollX > containersSize.rowTableWidth) {
                    hoverMenuScrollX = containersSize.rowTableWidth - containersSize.saveCancelWidth;
                }
                return hoverMenuScrollX - containersSize.saveCancelPaddingWidth;
            };

            /**
             * Assigns left position to the .hoverMenu-wrapper container
             */
            var assignLeftPosition = function () {
                $hoverMenu.css('left', getHoverMenuLeftOffset());
            };

            if (conf.actionEvents && conf.elements.rowHoverMenu) {
                if (!isRowHoverMenuDynamic) {
                    rowHoverMenu = getRowHoverMenuActions(conf.elements.rowHoverMenu);
                }
                if (!$gridContent) {
                    $gridContent = $gridTable.closest('.ui-jqgrid-bdiv');
                }

                $gridTable.on("slipstreamGrid.row:mouseenter", function (e, row) { //adds the row on hover menu
                    var $tr = $(row),
                        previousHoverTrId =  ".hoverMenu:not(#" + row.id + ")", //identifier of hover menu potentially still available because menu is still opened
                        isViewMode = $tr.attr("editable") !== "1", //row is not on edit mode
                        rowData = getRowData($tr, $gridTable),
                        rowHeight;

                    //removes previous hover menus that could be available because its menu is still opened
                    $gridTable.find(previousHoverTrId).each(function () {
                        self.removeRowHoverMenu($(this)); //$(this) represents the tr in the grid
                    });

                    if (isValidRowHover($tr) && isViewMode && !_.isElement($tr.find(".hoverMenu-wrapper")[0]) && !isRowHoverActionMenuOpened) { //fixes row hover container creation when triggered automatically by the grid library
                        if (isRowHoverMenuDynamic) {
                            rowHoverMenu = getRowHoverMenuActions(conf.elements.rowHoverMenu(rowData.rowId, rowData.rowData, rowData.originalData));
                        }
                        rowHeight = $tr.height();
                        if (rowHoverMenu.length) {
                            $tr.addClass("hoverMenu");
                            new ActionBarWidget({
                                "container": $tr,
                                "actions": rowHoverMenu,
                                "events": getRowHoverMenuEvents($tr, rowData)
                            }).build();

                            $tr.find(".action-bar-widget").wrap(templates.rowHoverMenu);//jqGrid listens to bindcontext, so any cell in a row to complain to its format. th allows to pass the cell check and then right click callback is triggered if the rowHoverMenu container had that event triggered. From the onRightClick callback, the function is returned so no row selection or other logic happens.
                            $hoverMenu  = $tr.find(".hoverMenu-wrapper");
                            $hoverMenu.css({
                                height: rowHeight,//required to vertical align the hover menu
                                left: getHoverMenuLeftOffset(),
                                width: $hoverMenu.outerWidth(true)
                            });
                            $gridContent.scroll(assignLeftPosition);
                            isRowHoverActionMenuOpened = false;
                        } else {
                            console.log("No action is enabled for the row hover menu");
                        }
                    }
                }).on("slipstreamGrid.row:mouseleave", function (e, row) { //destroys the hover menu
                    var $tr = $(row);
                    if (isValidRowHover($tr) && rowHoverMenu.length && !isRowHoverActionMenuOpened) {
                        self.removeRowHoverMenu($tr);
                        $gridContent.off("scroll", assignLeftPosition);
                    }
                });
            }
        };

        /**
         * Removes hover menu on a row
         * @param {Object} $row - jQuery Object for the row to have menu removed
         * @inner
         */
        this.removeRowHoverMenu = function ($row) {
            if ($row.hasClass("hoverMenu")) {
                $row.removeClass("hoverMenu")
                    .find(".hoverMenu-wrapper").remove();
            }
        };

    };

    return ActionBuilder;
});