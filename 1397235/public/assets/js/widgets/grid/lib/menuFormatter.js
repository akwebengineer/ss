/**
 * A module that formats and adds the more menu, the context menu and the action menus
 *
 * @module MenuFormatter
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define([
    'widgets/contextMenu/contextMenuWidget'
],  /** @lends MenuFormatter */
    function(ContextMenuWidget) {

    /**
     * MenuFormatter constructor
     *
     * @constructor
     * @class GridFormatter - Formats the action menus, more menus and context menu configuration objects and builds them.
     *
     * @param {Object} conf - Context menu configuration defined in the Grid configuration object
     * @param {Class} gridConfigurationHelper - Grid gridConfigurationHelper Class
     * @param {Object} gridSizeCalculator - gridSizeCalculator instance
     * @returns {Object} Current MenuFormatter's object: this
     */
    var MenuFormatter = function(gridConf, gridConfigurationHelper, gridSizeCalculator){

        /**
         * Builds the MenuFormatter
         * @returns {Object} Current "this" of the class
         */

        var conf = gridConf.contextMenu,
            customActionMenu = gridConf.actionButtons,
            defaultActions = ["create", "edit", "delete"],
            gridColumnModelConfiguration = {},
            rbacHash, contextMenuObj, moreMenuObj,
            eventHash = {"edit": "updateEvent", 
                        "createBefore": "createEvent", 
                        "createAfter": "createEvent",
                        "quickView": "quickViewEvent",
                        "pasteBefore": "pasteEvent",
                        "pasteAfter": "pasteEvent",
                        "copy": "copyEvent",
                        "delete": "deleteEvent",
                        "enable": "enableEvent",
                        "disable": "disableEvent"},
            containers,
            gridModelConfiguration,
            gridActionBarConfiguration,
            $actionContainer;


        /*
         * Initialize the menuFormatter
         * @param {Object} A hashtable with the jQuery object containers of the grid
         */
        this.init= function(containersHash) {
            containers = containersHash;
        }

        /**
         * Adds the disable handler to the context menu items. It is required to enable or disable an item in a context menu.
         * {Object} itemsConf - items in a conxtext menu
         * {Object} customStatus - enable or disable status for a group of the elements in a context menu
         * {Object} itemStatusCallback - enable or disable status for each of the elements in a context menu
         * {Object} getSelectedRows - callback that provides the number of selected rows and the row data
         * @inner
         */
        var addItemStatusCallback = function(itemsConf, customStatus, itemStatusCallback, getSelectedRows){
            var items = [], customContextMenuMap = [];

            customStatus = customStatus || {};

            for (var i =0; i<itemsConf.length; i++){
                if (rbacHash[itemsConf[i]['key']] === false) continue;
                //add each item in the map so that we can use it later for calling isDisable
                if(itemsConf[i].items){
                    var subItems = itemsConf[i].items,
                        len = itemsConf[i].items.length,
                        count = 0;
                    for(var j=0;j<subItems.length;){
                        if (rbacHash[subItems[j]['key']] === false) {
                            count += 1;
                            itemsConf[i].items.splice(j, 1);
                            continue;
                        }else{
                            addDisableHandler(subItems[j], customContextMenuMap, customStatus, itemStatusCallback, getSelectedRows);
                            j++;
                        }
                    }

                    //If all of submenu items are hidden, then remove the parent item from the context menu
                    if (count === len) continue;
                }
                _.extend(customStatus, disableParentItem(itemsConf[i], customStatus, getSelectedRows, itemStatusCallback));
                addDisableHandler(itemsConf[i], customContextMenuMap, customStatus, itemStatusCallback, getSelectedRows);
                items.push(itemsConf[i]);
            }
            return items;
        };

        /**
         * Disable the parent item when its all children are disabled
         * {Object} parentItemConf - items in a conxtext menu
         * {Object} customStatus - enable or disable status for a group of the elements in a context menu
         * {Object} getSelectedRows - callback that provides the number of selected rows and the row data
         * {Object} itemStatusCallback - enable or disable status for each of the elements in a context menu
         * @inner
         */
        var disableParentItem = function(parentItemConf, customStatus, getSelectedRows, itemStatusCallback){
            var count = 0,
                key = parentItemConf['key'],
                obj = {};

            if (parentItemConf.items){
                $.each( parentItemConf.items, function( index, item ) {
                    if (checkItemStatus(item, customStatus, getSelectedRows, itemStatusCallback) === true) {
                        count++;
                    }
                });
                if (count == parentItemConf.items.length)
                    obj[key] = false; 
            }
            
            return obj; 
        };

        /**
         * Extends the context menu configuration to include the disabled callback for each item in the menu
         * @inner
         */
        var addDisableHandler = function(menuItem, customContextMenuMap, customStatus, itemStatusCallback, getSelectedRows){
            customContextMenuMap[menuItem.key] = menuItem;
            _.extend(menuItem, {
               "disabled": function(key, opt) {
                   if (key) {
                        if (rbacHash[key] === false){
                            return true;
                        }

                        return checkItemStatus(customContextMenuMap[key], customStatus, getSelectedRows, itemStatusCallback);
                   }
               }
            });
        };

        var checkItemStatus = function(item, customStatus, getSelectedRows, itemStatusCallback){
            var status = false,
                key = item['key'],
                rowSelections = getSelectedRows() || $(this).data('rowSelections');

            if (!_.isEmpty(customStatus) && typeof(customStatus[key])!="undefined"){
               status = !(customStatus[key]);
            } else if (typeof(itemStatusCallback)==='function') {
               status = itemStatusCallback(key, status, rowSelections.selectedRows);
//             status = setItemStatus.apply(context, [key, status, rowSelections.selectedRows]); todo: context of the function needs to be defined
            }

            //check if the current item has isDisabled method defined
            if (item.isDisabled && typeof(item.isDisabled)==='function') {
               //item has specific isDisabled. lets call it
               status = item.isDisabled(key, rowSelections.selectedRows);
//             status = item.isDisabled.apply(context, [key, rowSelections.selectedRows]); todo: context of the function needs to be defined
            }
            return status;
        };

        /**
         * Gets the items to be added in the more menu and context menu. Includes callback to set the disabled status according to row selections in the grid
         * @returns {Object} items to be used in the more and the context menu configuration object
         * @inner
         */
        var getMenuElements = function (getSelectedRows, customStatus, columnMenuConfiguration) {
            var items = [],
                item = {},
                contextConfiguration = columnMenuConfiguration || conf,
                numberOfSelectedRows = 0,
                status = true,
                setItemStatus = gridConf.contextMenuItemStatus;

            var isItemDisabled = function (menuKey, defaultStatus){
                if (!_.isEmpty(customStatus) && typeof(customStatus[menuKey])!="undefined")
                    return !(customStatus[menuKey]);
                else
                    return !defaultStatus;
            };

            for (var key in contextConfiguration){
                if(!/custom/.test(key)){
                    var actionEvent = eventHash[key];
                    
                    if (rbacHash[actionEvent] !== false){
                        item = {
                            "label": contextConfiguration[key],
                            "key": key,
                            "disabled": function(key, opt) {
                                var rowSelections = getSelectedRows() || $(this).data('rowSelections');
                                if(rowSelections) numberOfSelectedRows = rowSelections.numberOfSelectedRows;
                                switch(key){
                                    case 'edit':
                                    case 'createBefore':
                                    case 'createAfter':
                                    case 'quickView':
                                        status = isItemDisabled(key, numberOfSelectedRows == 1);
                                        break;
                                    case 'pasteBefore':
                                    case 'pasteAfter':
                                        status = isItemDisabled(key, rowSelections && numberOfSelectedRows == 1 && rowSelections.isRowCopied);
                                        break;
                                    case 'copy': //TODO: update to support multiple row selection
                                        status = isItemDisabled(key, rowSelections && numberOfSelectedRows == 1);
                                        break;
                                    case 'delete':
                                        status = isItemDisabled(key, numberOfSelectedRows > 0);
                                        break;
                                    case 'enable':
                                    case 'disable':
                                        status = isItemDisabled(key, rowSelections && numberOfSelectedRows > 0 && rowSelections.isRowEnabled);
                                        break;
                                    case 'pasteCell':
                                        status = true;
                                        break;
                                    default:
                                        status = false;
                                        break;
                                }
                                if (typeof(setItemStatus)==='function' && rowSelections){
                                    status = setItemStatus(key, status, rowSelections.selectedRows);
                                }
                                return status;
                            }
                        };
                        items.push(item);
                    }
                } else {
                    var customItems = contextConfiguration['custom'];
                    items = items.concat(addItemStatusCallback(customItems, customStatus, setItemStatus, getSelectedRows));
                }
            }
            return items;
        };

        /**
         * Gets the status of all the items in a menu by using a defer promise which allows to sync the response of callback when it is available
         * @inner
         */
        var getMenuStatus = function (contextMenuContainer, $moreContainer, getSelectedRows, isContextMenu, columnIndex, contextMenuPos) {
            var selectedRows = getSelectedRows();
            var contextMenuCallback = gridConf.contextMenuStatusCallback;
            // context menu event geenrated from mouse event bubbles up and gets lost while waiting for promise to resolve. Work around by storing the event position in a variable.            
            var getMenuElementStatus = function() {
                var deferred = $.Deferred();
                if (_.isFunction(contextMenuCallback) && selectedRows){
                    var columnModel = gridModelConfiguration[columnIndex];
                    if (columnModel) {
                        selectedRows.cellColumn = {
                            name: columnModel.name,
                            index: columnModel.index
                        };
                    }
                    contextMenuCallback(selectedRows,
                        function (menuStatus) {
                            deferred.resolve(menuStatus);
                        },
                        function (errorMessage) {
                            deferred.reject(errorMessage);
                        }
                    );
                } else {
                    deferred.resolve({});
                }
                return deferred.promise();
            };

            var promise = getMenuElementStatus();
            $.when(promise)
                .done(function(customStatus) {
                    if (typeof(customStatus)!= 'undefined') {
                        if (isContextMenu) {
                            // Build context menu with contextMenuPos in order to keep track of X & Y positions of mousedown event
                            buildContextMenu(contextMenuContainer, getSelectedRows, columnIndex, customStatus, contextMenuPos);
                        }
                        else
                            buildMoreMenu(contextMenuContainer, $moreContainer, getSelectedRows, customStatus);
                    }
                })
                .fail(function(errorMessage) {
                    console.log(errorMessage);
                });
        };

        /*
         * Calculates maxHeight configuration for contextMenu
         */
        var calcMaxHeight = function() {
            var gridMaxHeight = gridSizeCalculator.getGridMaxHeight();
            var maxHeight = (!_.isUndefined(gridMaxHeight) && gridMaxHeight != "" && gridMaxHeight != "none") ? gridMaxHeight : '80%';
            return maxHeight;
        };

        /**
         * Builds the context menu of the grid widget
         * @inner
         */
        var buildContextMenu = function(contextMenuContainer, getSelectedRows, columnIndex, customStatus, contextMenuPos) {
            var menuElements = getMenuElements(getSelectedRows, customStatus),
                columnModel = gridModelConfiguration[columnIndex];

            if (columnIndex) {
                //restricts the container where the context menu will be created to just the cell of the columnIndex so another cell in the same row can show a different menu
                if (_.isUndefined(gridConf.subGrid)) {
                    var gridTableId = contextMenuContainer.split(" ")[0].substring(1);
                    contextMenuContainer += " td[aria-describedby=" + gridTableId + "_" + columnModel.name + "]";
                }

                //appends the menu defined for a column
                if(gridColumnModelConfiguration[columnIndex]){
                    var cellContextMenuConfiguration = gridColumnModelConfiguration[columnIndex];
                    var cellContextMenuItems = getMenuElements(getSelectedRows, customStatus, cellContextMenuConfiguration);
                    menuElements.push({"separator": true});
                    menuElements = menuElements.concat(cellContextMenuItems);
                }
            }
            contextMenuContainer = gridConfigurationHelper.escapeSpecialChar(contextMenuContainer);

            $(contextMenuContainer).bind("contextmenu", function(e){
                $(contextMenuContainer).unbind("contextmenu");
                e.slipstreamContextMenu = true;
            });

            contextMenuObj = new ContextMenuWidget({
                "elements": {
                    "callback": function(key, options) {
                        var $target = $(this),
                            row = columnIndex ? $target.closest("tr")[0] : this;
                        $target.trigger('slipstreamGrid.'+key, {
                            row: row,
                            columnModel: columnModel
                        });
                    },
                    "items": menuElements,
                    "maxHeight": calcMaxHeight()
                },
                "container": contextMenuContainer,
                "trigger": "right",
                "dynamic": true
            });

            if (contextMenuPos) {
                contextMenuObj.build().open({x: contextMenuPos.x, y: contextMenuPos.y});
            }
            else {
                contextMenuObj.build();
            }
            
        };

        /*
         * Adds the context menu to a row(s) container
         * @inner
         */
        this.addRowContextMenu = function (contextMenuContainer, getSelectedRows, columnIndex, contextMenuPos) {
            if (contextMenuObj) contextMenuObj.destroy();
            if (gridConf.contextMenuStatusCallback){
                getMenuStatus(contextMenuContainer, null, getSelectedRows, true, columnIndex, contextMenuPos);
            } else {
                buildContextMenu(contextMenuContainer, getSelectedRows, columnIndex);
            }
        };

        /*
         * Sets the RBAC has table
         * @param {Object} rbacHashTable - RBAC hash table
         */
        this.setRbacHash = function (rbacHashTable){
            rbacHash = rbacHashTable;
        };

        /*
         * Add the more menu to the grid widget
         * @returns {Object} configuration for the context menu of a row
         */
        this.addMoreMenu = function (moreMenuId, $moreContainer, getSelectedRows, actionBarConfiguration) {
            var isMoreMenuEmpty = function () {
                var contextMenuConfiguration = _.extend({}, conf);
                defaultActions.forEach(function(action) {
                    delete contextMenuConfiguration[action];
                });
                return _.isEmpty(contextMenuConfiguration);
            };
            gridActionBarConfiguration = actionBarConfiguration;
            if (isMoreMenuEmpty()){
                $moreContainer
                    .hide()
                    .next('.actionSeparator').hide();
            } else {
                $moreContainer.unbind('click').bind('click', function (e){
                    if (moreMenuObj) moreMenuObj.destroy();
                    e.stopPropagation();
                    if (gridConf.contextMenuStatusCallback){
                        getMenuStatus(moreMenuId, $moreContainer, getSelectedRows);
                    } else {
                        buildMoreMenu(moreMenuId, $moreContainer, getSelectedRows);
                    }
                });
            }
        };

        /*
         * Builds the context menu widget for the more button
         * @inner
         */
        var buildMoreMenu =  function (moreMenuId, $moreContainer, getSelectedRows, customStatus) {
            !$actionContainer && ($actionContainer = $moreContainer.closest('.actions'));
            _.isEmpty(customStatus) && (customStatus = {});

            var moreMenuElementsConfiguration = getMoreMenuElementsConfiguration (customStatus),
                moreMenuElements = getMenuElements(getSelectedRows, customStatus, moreMenuElementsConfiguration);

            var elements = getElementsContextMenuConfiguration(moreMenuElements);
            
            var gridContainerMaxHeight = calcMaxHeight();
            if(_.isNumber(gridContainerMaxHeight)) {
                var actionContainerHeight = _.isElement(containers.$actionContainer[0]) ? containers.$actionContainer.height() : 0;
                elements.maxHeight = gridContainerMaxHeight - actionContainerHeight;
            } else {
                elements.maxHeight = gridContainerMaxHeight;
            }

            moreMenuObj = new ContextMenuWidget({
                "elements": elements,
                "container": moreMenuId,
                "trigger": 'left',
                "dynamic": true
            });
            moreMenuObj.build().open();
        };

        /*
         * Builds the more menu configuration for the more menu button. It includes items that are added because of the responsive width of the grid
         * @inner
         */
        var getMoreMenuElementsConfiguration = function (customStatus) {
            //get default More menu elements
            var originalConf = $.extend(true, {}, conf),
                moreMenuElements = _.omit(originalConf, defaultActions); //removes CRUD actions from the items in more menu

            //append action buttons that are not visible because of responsive width
            if (gridActionBarConfiguration && !_.isEmpty(gridActionBarConfiguration.inMore)) {
                moreMenuElements.custom.push({"separator": true});

                gridActionBarConfiguration.inMore.forEach(function(menuElement){
                    var actionButton = gridActionBarConfiguration.byKey[menuElement.key],
                        moreMenuElement = {
                            key: actionButton.key,
                            label: actionButton.label || actionButton.unformat(menuElement.$button)
                        };
                    if (actionButton.items) {
                        moreMenuElement.items = actionButton.items;
                    }
                    moreMenuElements.custom.push(moreMenuElement);

                    if (_.isUndefined(customStatus[actionButton.key])) {
                        if (actionButton.menu_type || actionButton.dropdown_type || actionButton.custom_type) {
                            customStatus[actionButton.key] = !$actionContainer.find('#'+actionButton.key).hasClass('disabled');
                        } else {
                            customStatus[actionButton.key] = !$actionContainer.find('#'+actionButton.key + ' input').hasClass('disabled');
                        }
                    }
                });
            }
            return moreMenuElements;
        };

        /*
         * Provides the basic element configuration required to build a context menu. The context menu is showed exactly below the container. For example, it could be showed below the More button.
         * @inner
         */
        var getElementsContextMenuConfiguration = function (items) {
            return {
                "callback": function(key, options) {
                    $(this).trigger('slipstreamGrid.'+key, $(this).data('rowSelections'), 'test');
                },
                "position": function(opt, x, y){
                    opt.$menu.position({ my: "left top", at: "left bottom", of: this, offset: "0 0"});
                },
                "items": items,
                "events": {
                    show: function(opt) {
                        if (this.hasClass('disabled'))
                            return false;
                        else
                            return true;
                    }
                }
            };
        };

        /*
         * Gets the action menu configuration object to be used in building the context menu widget for the action menu
         * @returns {Object} configuration for the action menu
         */
        this.getActionMenuConfiguration = function (getSelectedRows, items, addActionMenuStatusCallback){
            if (addActionMenuStatusCallback){
                items = addItemStatusCallback(items, addActionMenuStatusCallback,getSelectedRows);
            }
            return getElementsContextMenuConfiguration(items);
        };

        /*
         * Adds the action menu to the action area if there are items to show
         */
        this.addActionMenu = function (menuId, menuContainer, menuElements){
            if (menuElements.length>0){
                new ContextMenuWidget({
                    "elements": getElementsContextMenuConfiguration(menuElements),
                    "container": menuId,
                    "trigger": 'left',
                    "dynamic": true
                }).build();
            } else {
                menuContainer.hide();
            }
        };

        /*
         * Provides the action menu configuration in a format that can be consumed by the context menu widget
         * @returns {Object} configuration for the action menu
         */
        this.getActionMenus = function(){
            var actionMenus = {};
            var defaultButtons = customActionMenu.defaultButtons;
            var setActionMenu = function (button, actionMenus) {
                var actionMenuKey = button['key'];
                if (button.items && !button.dropdown_type) { //only applicable to buttons with menu
                    actionMenus[actionMenuKey] = {
                        'items': button.items,
                        'statusCallback': button.itemStatusCallback
                    };
                }
            };
            if (defaultButtons) {
                for (var key in defaultButtons) {
                    var defaultButton = defaultButtons[key];
                    setActionMenu(defaultButton, actionMenus);
                }
            }
            var customButtons = customActionMenu.customButtons;
            if (customButtons) {
                for (var i=0; i<customButtons.length; i++){
                    var customButton = customButtons[i];
                    setActionMenu(customButton, actionMenus);
                }
            }
            return actionMenus;
        };

        /*
         * Provides the action button configuration
         * @param {Object} customButtonsConf - grid configuration that contains the custom buttons/actions
         * @returns {Object} configuration for action buttons
         */
        this.getActionButtons = function(customButtonsConf){
            var actionButtons = [];
            if (customButtonsConf && customButtonsConf.customButtons){
                var customButtons = customButtonsConf.customButtons;
                for (var i=0; i<customButtons.length; i++){
                    var customButton = customButtons[i];
                    !customButton.items && (actionButtons[customButton.key] = true);
                }
                return actionButtons;
            }
        };

        /*
         * Creates a generic configuration that allows to add show and hide events for checkbox items in a context menu
         * @param {Object} updateItemSelectionCallback - callback that allows users of the widget to persist the current checkbox selection
         * @returns {Object} configuration for the events of a checkbox item from the context menu widget
         */
        this.getCheckboxItemMenuEvents = function (updateItemSelectionCallback) {
            var subMenuData;
            return {
                show: function(opt) {
                    subMenuData = $(this).data();
                    if(!_.isEmpty(subMenuData) ) {
                        $.contextMenu.setInputValues(opt, subMenuData); // import states from data store
                    }
                },
                hide: function(opt) {
                    $.contextMenu.getInputValues(opt, subMenuData); // export states to data store
                    if (typeof(updateItemSelectionCallback) === "function"){
                        updateItemSelectionCallback(subMenuData);
                    }
                }
            }
        };

        /**
         * Gets the grid column configuration as how it is defined in the grid library column model and the grid configuration
         * @inner
         */
        this.setColumnContextMenuConfiguration = function (gridModel, gridId) {
            var reservedColumns = ['slipstreamgrid_more', 'slipstreamgrid_leftAction', 'slipstreamgrid_select'],
                gridTableId = gridId;
            var findColumnConfiguration = function (column) {
                var columnsConf = gridConf.columns;
                for(var i=0; i<columnsConf.length; i++){
                    var columnConf = columnsConf[i];
                    if (columnConf.name == column.name)
                        return columnConf;
                }
            };
            
            gridModelConfiguration = gridModel;
            for (var j=0; j<gridModel.length; j++){
                var columnModel = gridModel[j];
                if(!columnModel.title && !columnModel.hidden && !~reservedColumns.indexOf(columnModel.name)){
                    var columnConfiguration = findColumnConfiguration(columnModel);
                    if (columnConfiguration && columnConfiguration.contextMenu)
                        gridColumnModelConfiguration[j] = columnConfiguration.contextMenu;
                }
            }
        };

    };

    return MenuFormatter;
});