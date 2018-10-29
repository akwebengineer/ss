/**
 * A module that builds the filtering options of the grid widget: filter menu, options menu, token area and column filter
 * @module FilterOptions
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'widgets/contextMenu/contextMenuWidget',
    'widgets/search/searchWidget',
    'widgets/queryBuilder/queryBuilderWidget',
    'lib/i18n/i18n',
    'widgets/grid/util/gridLocalSearch'
],  /** @lends FilterOptions */
    function(ContextMenuWidget, SearchWidget, QueryBuilderWidget, i18n, GridLocalSearch) {

    /**
     * FilterOptions constructor
     *
     * @constructor
     * @class FilterOptions - Adds the filter options of the grid widget located at the top right of the grid and below the grid title.
     *
     * @param {Object} conf - grid configuration
     * @param {Object} gridContainer - grid container
     * @param {Object} menuFormatter - object of the MenuFormatter function
     * @param {Object} dateFormatter - object of the DateFormatter function
     * @param {Object} gridConfigurationHelper - object of the GridConfigurationHelper function
     * @param {Boolean} isCollectionGrid - if it is collectionData grid
     * @returns {Object} Current FilterOptions's object: this
     */
    var FilterOptions = function(conf, gridContainer, menuFormatter, gridFormatter, dateFormatter, gridConfigurationHelper, searchUtility, isCollectionGrid){

        /**
         * Builds the FilterOptions
         * @returns {Object} Current "this" of the class
         */

        var filterConfiguration = conf.elements.filter,
            gridSections = {
                $filter: gridContainer.find('.filter-container'),
                $saveSearch: gridContainer.find('.search-save-container'),
                $token: gridContainer.find('.search-container'), // todo: Should be renamed to $searchFilterBar instead at the read only Integration
                $table: gridContainer.find('.gridTable')
            },
            showHideLabel = i18n.getMessage('ShowHideColumns'),
            showHideId = _.uniqueId("slipstream_grid_widget_show_hide_container"),
            filterId = _.uniqueId("slipstream_grid_widget_filter_container"),
            saveId = _.uniqueId("slipstream_grid_widget_save_container"),
            self = this,
            startSearch = true,
            isSearchTriggered = false,
            searchWidget,
            numTokensToBeAdded,
            reloadGrid,
            showHideGridColumn,
            searchColName = {},
            filterDrop,
            gridLocalSearch = new GridLocalSearch(gridSections.$table, conf, searchColName),
            groupColumnsHash, columnConfigurationByNameHash,
            isAdvanceFilter = !_.isUndefined(filterConfiguration.advancedSearch),
            isQueryBuilder = isAdvanceFilter && filterConfiguration.advancedSearch.queryBuilder,
            isGetPageDataEnabled = isCollectionGrid && conf.elements.getPageData,
            isSearchWidgetBuilt = false;

        /**
         * Sets a hash for the columns that have a group
         * @param {Object} groupsWithColumnName - hash with a key that is the group id and a value that is an array of all column names for that group
         * @param {Object} columnConfigurationByName - hash with a key that is the column name and the value is the column configuration for that column name
         */
        this.setGroupColumn = function (groupsWithColumnName, columnConfigurationByName) {
            if (filterConfiguration && filterConfiguration.optionMenu && filterConfiguration.optionMenu.showHideColumnsItem) {
                groupColumnsHash = groupsWithColumnName;
                columnConfigurationByNameHash = columnConfigurationByName;
            }
        };

        /**
         * Adds the search input element and builds the search widget
         * @inner
         */
        var initializeSearch = function () {
            if(isAdvanceFilter){
                addAdvancedSearch();
                filterConfiguration.advancedSearch.save && addSaveSearch();
                isQueryBuilder && registerAdvanceFilterHandlers();
            } else {
                addSearchInput();
                initializeReadOnlySearch();
            }
            addSearchHandler();
        };

        /**
         * Enables filter capabilities according to the filter configuration
         * @param {Function} reloadGridData - callback function used to reload the data after a filter request
         * @param {Function} showHideGridColumnCallback - callback function from the GridWidget class used to show or hide a group column
         * @param {Class} FilterDrop - Grid filter drop Class
         */
        this.enableFilter = function (reloadGridData, showHideGridColumnCallback, FilterDrop) {
            showHideGridColumn = showHideGridColumnCallback;
            filterDrop = FilterDrop;
            if (filterConfiguration.searchUrl || filterConfiguration.searchResult || isGetPageDataEnabled){
                reloadGridData && (reloadGrid = reloadGridData);
                if (_.isEmpty(this.getSearchWidgetInstance()))
                    initializeSearch();
            }
            (filterConfiguration.showFilter || filterConfiguration.columnFilter) && addFiltersMenu();
            filterConfiguration.optionMenu && addOptionMenu();
        };

        /**
         * Adds the search input on the filter area
         * @inner
         */
        var addSearchInput = function () {
            var $gridSearch = gridSections.$filter.find('.grid_filter_input'),
                $filterIcon = gridSections.$filter.find('.filter-icon');
            gridSections.$inputSearch = $gridSearch.find('input.filter');
            $gridSearch.show();
            $filterIcon.on('click.fndtn.search', function(e){
                var inputValue = $(this).siblings('input').val();
                if(inputValue) {
                    self.search(inputValue);
                    gridSections.$inputSearch.focus();
                }
                else {
                    if($gridSearch.hasClass("collapse-search")) {
                        $gridSearch.removeClass("collapse-search");
                        gridSections.$inputSearch.focus();
                    }
                    else {
                        $gridSearch.addClass("collapse-search");
                    }
                }
            });
            gridSections.$inputSearch.on('keypress.fndtn.inputSearch',function(e) {
                if (e.which == 13) {
                    e.preventDefault();
                    e.stopPropagation();
                    self.search($(this).val());
                }
            });
        };

        /**
         * Adds the search area on top of the grid by invoking the search widget with the read only option
         * @inner
         */
        var initializeReadOnlySearch = function () {
            searchWidget = new SearchWidget({
                "container": gridSections.$token,
                "readOnly": true,
                "afterTagAdded": doSearch,
                "afterAllTagRemoved": removeAllSearch,
                "afterTagRemoved": removeSearch
            });
        };

        /**
         * Adds the search area on top of the grid by invoking the search widget. It includes the option to add tokens using the context menu of the search widget.
         * @inner
         */
        var addAdvancedSearch = function () {
            if(isQueryBuilder){
                var queryBuilderConfig = {
                    "container": gridSections.$token,
                    "filterMenu": filterConfiguration.advancedSearch.filterMenu,
                    "logicMenu": filterConfiguration.advancedSearch.logicMenu,
                    "autoComplete": true
                };
                if (filterDrop){
                    queryBuilderConfig.dragNDrop = {
                        "drop": filterDrop.getQueryBuilderDropCallback,
                        "over": filterDrop.getQueryBuilderOverCallback
                    };
                }
                searchWidget = new QueryBuilderWidget(queryBuilderConfig);
            }else {
                searchWidget = new SearchWidget({
                    "container": gridSections.$token,
                    "filterMenu": filterConfiguration.advancedSearch.filterMenu,
                    "logicMenu": filterConfiguration.advancedSearch.logicMenu,
                    "allowPartialTokens": filterConfiguration.advancedSearch.allowPartialTokens,
                    "autocomplete": filterConfiguration.advancedSearch.autocomplete,
                    "implicitLogicOperator": filterConfiguration.advancedSearch.implicitLogicOperator,
                    "tokenizeOnEnter": filterConfiguration.advancedSearch.tokenizeOnEnter,
                    "keyTokens": filterConfiguration.advancedSearch.keyTokens,
                    "afterTagAdded": triggerSearch,
                    "afterPartialTagUpdated": triggerSearch,
                    "afterAllTagRemoved": removeAllSearch,
                    "afterTagRemoved": removeSearch
                });
            }
            searchWidget.build();
            isSearchWidgetBuilt = true;
        };

        /**
         * Adds the save menu next to the search area on top of the grid by invoking the context menu widget.
         * @inner
         */
        var addSaveSearch = function () {
            gridSections.$saveSearch.addClass('saveSearch');
            var saveMenu = [];
            var saveMenuId = "."+saveId+".save-container";
            gridSections.$saveSearch.find(".save-container").addClass(saveId);

            filterConfiguration.advancedSearch.save.forEach(function(option){
                saveMenu.push({
                    "key": option.key,
                    "label": option.label
                });
            });

            var menuConfiguration = getFilterMenuConfiguration(saveMenu);
            new ContextMenuWidget({
                "elements": menuConfiguration,
                "container": saveMenuId,
                "trigger": 'left',
                "dynamic": true
            }).build();
        };

        /**
         * Adds the toolbar search below the title of the grid
         * @inner
         */
        var addColumnFilter = function () {
            gridSections.$table.jqGrid('filterToolbar', {
                autosearch: false,
                defaultSearch: "cn"
            });
            gridSections.$columnFilter = gridContainer.find('.ui-search-toolbar')
            gridSections.$columnFilter.toggleClass('hide-toolbar');
        };

        /*
         * Creates a generic configuration that allows to add show and hide events for checkbox items in a context menu
         * @param {Object} updateItemSelectionCallback - callback that allows users of the widget to persist the current checkbox selection
         * @returns {Object} configuration for the events of a checkbox item from the context menu widget
         */
        var getCheckboxItemMenuEvents = function (updateItemSelectionCallback) {
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
                    gridSections.$table.trigger('slipstreamGrid.updateConf:columns');
                }
            }
        };

        /**
         * Adds the 'Filters' menu to the filter area of the grid
         * @inner
         */
        var addFiltersMenu = function () {
            var filterMenuId = "." + showHideId + ".grid_show_filters",
                filterMenu = [],
                hasColumnFilter = filterConfiguration.columnFilter,
                hasCustomItems = filterConfiguration.showFilter && !!filterConfiguration.showFilter.customItems,
                hasQuickFilters = filterConfiguration.showFilter && !!filterConfiguration.showFilter.quickFilters,
                $columnQuickFilter = gridSections.$filter.find(".grid_show_filters"),
                toggleColumnFilter = function () {
                    gridSections.$columnFilter.toggleClass('hide-toolbar');
                };

            $columnQuickFilter.addClass(showHideId);

            if (hasColumnFilter) {
                addColumnFilter();
                if(hasCustomItems || hasQuickFilters){ //contributes to the filter menu
                    filterMenu = [{
                        "key": "slipstream-columnFilters",
                        "label": "Show Hide Column Filters",
                        "callback": toggleColumnFilter
                    },{
                        "separator": "true"
                    }]
                }
            }

            if (hasCustomItems){
                filterConfiguration.showFilter.customItems.forEach(function(option){
                    filterMenu.push({
                        "key": option.key,
                        "label": option.label
                    });
                });
            }

            if (hasQuickFilters){
                var quickFilterKey = "quickFilter = ";

                if (hasCustomItems){
                    filterMenu.push({
                        "separator": true
                    });
                }
                filterMenu.push({
                    "title": "Quick Filters"
                });
                filterConfiguration.showFilter.quickFilters.forEach(function(option){
                    filterMenu.push({
                        "key": option.key,
                        "value": option.key,
                        "label": option.label,
                        "type": "checkbox",
                        "events": {
                            "change": function(e){
                                if (this.checked){
                                    addSearchTokens(quickFilterKey + this.value);
                                } else {
                                    removeSearchTokens(quickFilterKey + this.value);
                                }
                            }
                        }
                    });
                });
                gridSections.$token.bind('slipstream-token-removed', function (e, token) {
                    var quickFilterData = $columnQuickFilter.data();
                    if (token) {
                        var quickFilterConfigKey;
                        var advanceSearchFilterMenuHash = searchUtility.getAdvanceSearchFilterMenuHash();
                        if(_.isUndefined(advanceSearchFilterMenuHash)){
                            quickFilterConfigKey = quickFilterKey;
                        }else{
                            quickFilterConfigKey = advanceSearchFilterMenuHash["quickFilter"]+" = ";
                        }

                        if(~token.indexOf(quickFilterConfigKey)){
                            var tokenValueArr = token.slice(quickFilterConfigKey.length).split(',');
                            tokenValueArr.forEach( function (tokenValue) {
                                quickFilterData && (quickFilterData[tokenValue] = false);
                            });
                        }
                    } else {
                        for (var key in quickFilterData) {
                            quickFilterData[key] = false;
                        }
                    }
                });
            }

            //shows filter menu or filter icon
            if(hasCustomItems || hasQuickFilters){
                gridSections.$filter.find(filterMenuId).show();
                var menuConfiguration = getFilterMenuConfiguration(filterMenu);

                if (hasQuickFilters) {
                    menuConfiguration.events = menuFormatter.getCheckboxItemMenuEvents();
                }

                new ContextMenuWidget({
                    "elements": menuConfiguration,
                    "container": filterMenuId,
                    "trigger": 'left',
                    "dynamic": true
                }).build();
            } else if (hasColumnFilter) {
                $columnQuickFilter.show();
                $columnQuickFilter.on('click.fndtn.columnFilter', toggleColumnFilter);
            }

        };

        /**
         * Adds the option icon and enables the option menu using the items defined in the grid configuration and the context menu widget
         * @inner
         */
        var addOptionMenu = function () {
            var optionMenuId = "."+filterId+".grid_filter_options";
            var $optionMenu = gridSections.$filter.find(".grid_filter_options").addClass(filterId);
            var optionMenuItems = [];
            $optionMenu.show();

            if (filterConfiguration.optionMenu.showHideColumnsItem){
                var gridColumnsSubMenu = getGridColumnsSubMenu();
                if (typeof(filterConfiguration.optionMenu.showHideColumnsItem.setColumnSelection) === "function"){
                    gridColumnsSubMenu = setInitialColumnSelection(gridColumnsSubMenu);
                }
                gridColumnsSubMenu = addContextMenuParameters(gridColumnsSubMenu);

                optionMenuItems.push({
                    "key": "showHideColumns",
                    "label": showHideLabel,
                    "items": gridColumnsSubMenu,
                    "className": "grid-widget-show-hide-columns-menu"
                });
            }

            if (filterConfiguration.optionMenu.customItems) {
                optionMenuItems = optionMenuItems.concat(filterConfiguration.optionMenu.customItems);
            }
            var menuConfiguration = menuFormatter.getActionMenuConfiguration(undefined,optionMenuItems);

            if (filterConfiguration.optionMenu.showHideColumnsItem){
                menuConfiguration.events = getCheckboxItemMenuEvents(filterConfiguration.optionMenu.showHideColumnsItem.updateColumnSelection);
            }

            new ContextMenuWidget({
                "elements": menuConfiguration,
                "container": optionMenuId,
                "trigger": 'left',
                "dynamic": true
            }).build();
        };

        /**
         * Sets the initial checkboxes of the show hide menu by setting them to true and then disabling the ones defined in the setColumnSelection function callback.
         * @inner
         */
        var setInitialColumnSelection = function (gridColumnsSubMenu) {
            //format the input of the set selection callback
            var inputOfSetSelectionCallback = {};
            for(var i=0; i<gridColumnsSubMenu.length; i++){
                var column = gridColumnsSubMenu[i];
                inputOfSetSelectionCallback[column.key] = column.selected;
            }
            if (!conf._configRestored) {
                inputOfSetSelectionCallback = filterConfiguration.optionMenu.showHideColumnsItem.setColumnSelection(inputOfSetSelectionCallback);
            }
            for(var i=0; i<gridColumnsSubMenu.length; i++){
                var column = gridColumnsSubMenu[i];
                column.selected = inputOfSetSelectionCallback[column.value];
                showHideGridColumn(column.value,column.selected);
            }
            return gridColumnsSubMenu;
        };

        /**
         * Populates the show hide columns menu from the column model of the grid.
         * @inner
         */
        var getGridColumnsSubMenu = function () {
            var showHideMenuItems= [],
                reservedColumns = ['slipstreamgrid_more', 'slipstreamgrid_leftAction', 'slipstreamgrid_select'];
            var gridModel = gridSections.$table.getGridParam('colModel');
            for(var i=0; i<gridModel.length; i++){
                var column = gridModel[i],
                    columnLabel = column.label;
                if(!column.internal && !column.title && columnLabel && !~reservedColumns.indexOf(column.name)){
                    if (_.isObject(columnLabel)) {
                        if (_.isFunction(columnLabel.unformat)) {
                            columnLabel = columnLabel.unformat(column.name, column);
                        } else {
                            columnLabel = column.name;
                        }
                    }
                    showHideMenuItems.push({
                        "key": column.name,
                        "label": columnLabel,
                        "value": column.name,
                        "selected": column.hidden ? false : true
                    });
                }
            }
            return showHideMenuItems;
        };

        /**
         * Adds the checkbox type parameter required to render the menu as a checkbox list and also adds a change event that allows to persist the current user selection by invoking the showHideGridColumn callback.
         * @inner
         */
        var addContextMenuParameters = function (showHideMenuItems) {
            for (var j=0; j<showHideMenuItems.length; j++){
                var showHideMenuItem = showHideMenuItems[j];
                showHideMenuItem.type = "checkbox",
                showHideMenuItem.events = {
                    change: function(e){
                        var columnName = this.value,
                            showColumn = this.checked,
                            groupId = columnConfigurationByNameHash && columnConfigurationByNameHash[columnName].group;
                        if (groupColumnsHash && groupId && groupColumnsHash[groupId]) { //if column belongs to a valid group then the columns in the same grgoup should be shown/hidden as a group
                            showHideGroupGridColumn(columnName, groupId, showColumn, $(this));
                        } else {
                            showHideGridColumn(columnName, showColumn);
                        }
                        gridSections.$table.trigger('slipstreamGrid.resized:gridColumn');
                    }
                };
            }
            return showHideMenuItems;
        };

        /**
         * Shows or hides all the columns for the group that it belongs to
         * @param {String} columnName - name of the column
         * @param {String} groupId - id of the group which the column belongs to
         * @param {Boolean} showColumn - true to show a column and false to hide it.
         * @param {Object} $itemMenuContainer - jQuery container for the item in the showHide menu that represents the column that should be shown or hidden
         * @inner
         */
        var showHideGroupGridColumn = function (columnName, groupId, showColumn, $itemMenuContainer) {
            var groupColumn = groupColumnsHash[groupId];
            var $contextMenuContainer = $itemMenuContainer.closest("ul"),
                columns = groupColumn.columns,
                columnsLength = columns.length - 1,
                column;
            for (var i = 0; i <= columnsLength; i++) {
                column = columns[i];
                $contextMenuContainer.find("input[value=" + gridConfigurationHelper.escapeSpecialChar(column) + "]").prop("checked", showColumn);
                showHideGridColumn(column, showColumn, i == columnsLength, groupId); //triggers resize only on last column
            }
        };

        /**
         * Adds the search token for the input search element
         * @param {String} value - value of the search
         * @param {Boolean} isPreSearch - defines if the search needs to be started immediately (after each token is added): true - default value or false in case a different mechanism will trigger the search (like when the grid is loaded for the first time)
         * @inner
         */
        this.search = function (value, isExternalPreSearch) {
            if (conf.elements.filter && (filterConfiguration.searchUrl || filterConfiguration.searchResult || isGetPageDataEnabled)){
                var isExternalPreSearch = _.isBoolean(_.isBoolean(isExternalPreSearch)) ? isExternalPreSearch : false;

                if (isExternalPreSearch)
                    numTokensToBeAdded = _.isArray(value)? value.length : 1;
                startSearch = _.isBoolean(isExternalPreSearch) ? false : true;
                _.isEmpty(this.getSearchWidgetInstance()) && initializeSearch();
                gridSections.$inputSearch && gridSections.$inputSearch.val('');//clear input value since it is showed on the token area
                addSearchTokens(value, isExternalPreSearch);
                startSearch = true;
            } else {
                throw new Error(errorMessages.noFilter);
            }
        };

        /**
         * Resets column filtering if available before the grid search is started
         * @inner
         */
        var removeAllSearch = function () {
            gridSections.$token.trigger('slipstream-token-removed');
            gridSections.$token.trigger('slipstream-all-tokens-removed');
            triggerSearch();
        };

        /**
         * Resets column filtering if available before the grid search is started
         * @inner
         */
        var removeSearch = function (token) {
            gridSections.$token.trigger('slipstream-token-removed', token);
            if (!isAdvanceFilter && !searchWidget.getAllTokens().length) { //send the slipstream-all-tokens-removed event if all tokens were removed
                gridSections.$token.trigger('slipstream-all-tokens-removed');
            }

            !(isSearchTriggered && isCollectionGrid) && triggerSearch();
            isSearchTriggered = false;
        };

        /**
         * Trigger the search once the startSearch flag is set to true. It
         * @inner
         */
        var doSearch = function () {
            //checks that the search is triggered only when all tokens are added in the search widget for cases where a external search (this.search from the grid widget) has been used.
            if (numTokensToBeAdded == 1) {
                startSearch = true;
                numTokensToBeAdded = null;
                isSearchTriggered = true;
            } else if (numTokensToBeAdded  > 0){
                numTokensToBeAdded --;
            }
            startSearch && triggerSearch();
        };

        /**
         * Reload the grid according to a new url provided as a result of updating the tokens in the search grid area
         * @inner
         */
        var triggerSearch = function () {
            var value = self.getSearchTokens(),
                gridPostData = gridSections.$table.jqGrid('getGridParam').postData,
                gridParam,
                datatype = gridSections.$table.jqGrid('getGridParam','datatype'),
                isLocalData = (datatype === "local")? true: false,
                hasSubgrid = (_.isUndefined(conf.elements.subGrid)) ? false : true,
                isTreeGrid = (_.isUndefined(conf.elements.tree)) ? false : true,
                isGroupGrid = conf.elements.grouping ? true : false,
                isSimpleGrid = !(hasSubgrid || isTreeGrid || isGroupGrid) ? true : false;
//            console.log(value);

            if (!isAdvanceFilter && !value.length) //hide search container
                gridSections.$token.hide();

            if((conf.elements.filter.searchResult && typeof(conf.elements.filter.searchResult)==='function') || isGetPageDataEnabled){
                var gridSearchTokens = getGridSearchTokens(value);
                console.log(gridSearchTokens);
                if (conf.elements.filter.searchResult){
                    conf.elements.filter.searchResult(gridSearchTokens, reloadGrid);
                }else if (conf.elements.getPageData){
                    var options = {
                        pages: [1],
                        search: gridSearchTokens,
                        callback: reloadGrid,
                        pageSize: gridSections.$table.getGridParam('rowNum').toString()
                    };
                    gridSections.$table.trigger('slipstreamGrid.loadCollectionData', options);
                }
            }else if(isLocalData && isSimpleGrid){
                gridLocalSearch.runLocalSearch(self.getSearchTokens);
            } else {
                delete gridPostData['_search'];
                delete gridPostData['filter'];
                if(typeof(conf.elements.filter.searchUrl)==='function'){
                    var searchUrl = conf.elements.filter.searchUrl(value, conf.elements.url);
                    var postData = searchUrl.substring(searchUrl.indexOf('?')+1);
                    if (postData) postData = _.object(_.compact(_.map(postData.split('&'), function(item) {  if (item) return item.split('='); })));
                    gridParam = {
                        url: searchUrl.substring(0, searchUrl.indexOf('?')),
                        postData: postData,
                        page: 1
                    };
                } else {
                    gridParam =  {
                        url: conf.elements.url,
                        search: value,
                        page: 1
                    };
                }
                if (conf.elements.tree) { //restores the tree grid datatype and expansion level modified when childrend are added to a parent by using the addChildren method of the gridWidget class
                    _.extend(gridParam, {
                        datatype: 'json',
                        treeANode: -1
                    });
                }
                gridSections.$table.jqGrid('setGridParam', gridParam).trigger('reloadGrid');
            }

            gridSections.$table.trigger('slipstreamGrid.updateConf:search', {"tokens": value});
        };

        /**
         * Add handlers to the search token area that are used by the toolbar filtering when a column filter is added or removed
         * @inner
         */
        var addSearchHandler = function () {
            gridSections.$token.unbind("slipstream-add-token").bind("slipstream-add-token", function(e, data){//data.inputElement, data.columnName
                if  (data.columnName){
                    searchColName[data.columnName] = data.origName;
                    addSearchTokens(data.columnName + " = " + data.searchValue);
                }else{
                    addSearchTokens(data.searchValue);
                }
            });
            gridSections.$token.unbind("slipstream-remove-token").bind("slipstream-remove-token", function(e, data){//data.inputElement, data.columnName
                removeSearchTokens(data.columnName + " = " + data.searchValue);
            });
            gridSections.$token.unbind("slipstream-remove-column-token").bind("slipstream-remove-column-token", function(e, data){//data.inputElement, data.columnName
                removeSearchTokens(data.columnName);
            });
            gridSections.$token.unbind("slipstream-remove-column-token-no-reload").bind("slipstream-remove-column-token-no-reload", function(e, data){//data.inputElement, data.columnName
                removeSearchTokensNoReload(data.columnName);
            });
            gridSections.$token.unbind("slipstream-replace-column").bind("slipstream-replace-column", function(e, data){
                replaceSearchToken(data.columnName, data.searchValue);
            });
        };

        /**
         * Add tokens to the search container of the grid
         * @param {String/Array} search value(s)
         * @param {Boolean} isExternalPreSearch
         * @inner
         */
        var addSearchTokens = function (value, isExternalPreSearch) {
            // IMP: The fixes are done for PR-1239158 | PR-1308626 - Make sure to test the use cases - if any modifications
            if (!_.isEmpty(value)) {
                showSearchWidget();
                if(_.isArray(value)){
                    if (isExternalPreSearch){
                        if(isQueryBuilder) {
                            // Add the provided tokens to the queryBuilder widget
                            searchWidget.add({"query": value});
                        }else {
                            //If isExternalPreSearch is true (means the function is triggered by the grid search method),
                            //then add first n values without trigger event
                            //and only trigger the event when the last value is added
                            var firstNValues = value.slice(0, value.length - 1),
                                lastValue = value.slice(-1);

                            searchWidget.addTokens(firstNValues, true);
                            searchWidget.removeToken(lastValue[0], true, false);
                        }
                    }else{
                        // Fix for the scenario when multiple tokens are expected to be added immidiately after grid load.
                        searchWidget.addTokens(value, true); // Do not trigger internal event associated with add tokens
                    }
                }else {
                    // Note: following internally also creates the token after removal
                    // if token already present, then new value will be appended
                    // if non existent token value then it will added in filter
                    // Do not trigger event associated with remove tokens
                    if(isQueryBuilder){
                        searchWidget.add({"query": value});
                    }else{
                        searchWidget.removeToken(value, true, true);
                    }
                }
            }
        };

        /**
         * Remove tokens from the search container of the grid
         * @inner
         */
        var removeSearchTokens = function (value) {
            if (gridSections.$token.children().length) {

                // Do not trigger event associated with remove tokens
                var deletedToken = searchWidget.removeToken(value, false, true);

                if (_.isEmpty(deletedToken)) { //send the slipstream-all-tokens-removed event if all tokens were removed
                    triggerSearch();
                    if (!isAdvanceFilter && !searchWidget.getAllTokens().length) {
                        gridSections.$token.trigger('slipstream-all-tokens-removed');
                    }
                }
            }
        };

        var removeAllSearchTokens = function (){
            if (gridSections.$token.children().length){
                searchWidget.removeAllTokens();
            }
        };

        var removeSearchTokensNoReload = function (value){
            if (gridSections.$token.children().length){
                searchWidget.removeToken(value);
            }
        };

        var replaceSearchToken = function (columnName, value){
            if (!_.isEmpty(value)) {
                showSearchWidget();
                searchWidget.replaceToken(columnName, value);
            }
        };

        var showSearchWidget = function(){
            //build the token area only when a search is requested
            if (gridSections.$token.children().length == 0){
                searchWidget.build();
                isSearchWidgetBuilt = true;
            }
            if (!isAdvanceFilter && !gridSections.$token.is(":visible")) //show search container
                gridSections.$token.show();
        };

        /**
         * Remove all search token
         */
        this.removeAllSearchTokens = function (){
            removeAllSearchTokens();
            return searchWidget;
        };

        /**
         * Provides the search widget instance used in the grid widget
         * @returns {Array} All applied tokens to the grid
         */
        this.getSearchWidgetInstance = function (){
            return searchWidget;
        };

        /**
         * Provides all tokens available on the search container of the grid
         * @returns {Array} All applied tokens to the grid
         */
        this.getSearchTokens = function (){
            if(isQueryBuilder){
                return searchWidget.getAST(); // provide back the AST as the value to app
            }else{
                return searchWidget.getAllTokens();
            }
        };

        /**
         * Return if searchWidget is built or not. ReadOnly search widget will be built after searching.
         * @returns {Boolean} isSearchWidgetBuilt
         */
        this.isSearchWidgetBuilt = function(){
            return isSearchWidgetBuilt;
        };

        /*
         * Formats the tokens provided by the SearchWidget into a grid format (column name/value and operator array)
         */
        var getGridSearchTokens = function (tokens){
            var searchTokens = [],
                searchToken;

            if(isQueryBuilder){
                // In this case pass the entire AST to the app.
                searchTokens = tokens;
            }else{
                var searchableColumns = gridFormatter.getSearchableColumns();
                var tokenConnectors = [' = ', '!= ', ' >= ', ' <= '];
                var findConnector = function (token) {
                    for (var i = 0; i < tokenConnectors.length; i++) {
                        if (~token.indexOf(tokenConnectors[i])) {
                            return tokenConnectors[i];
                        }
                    }
                    return null;
                };
                tokens.forEach(function (token) {
                    if (searchTokens.length) searchTokens.push('AND');
                    var connector = findConnector(token);

                    if (connector) { //key, value pair
                        var keyValue = token.split(connector);
                        var key = keyValue[0],
                            values = keyValue[1];

                        var searchType = searchableColumns[key];
                        switch (searchType) {
                            case 'number':
                                if (~token.indexOf(' = ')) {
                                    searchToken = [{
                                        "column" : key,
                                        "operator" : "=",
                                        "value" : values
                                    }];
                                } else if (~token.indexOf(' >= ')) {
                                    searchToken = [{
                                        "column" : key,
                                        "operator" : ">=",
                                        "value" : values
                                    }];
                                } else if (~token.indexOf(' <= ')) {
                                    searchToken = [{
                                        "column" : key,
                                        "operator" : "<=",
                                        "value" : values
                                    }];
                                } else {
                                    var numberRange = values.split(' - ');
                                    searchToken = [{
                                        "column" : key,
                                        "operator" : ">=",
                                        "value" : numberRange[0]
                                    },
                                        "AND",
                                        {
                                            "column" : key,
                                            "operator" : "<=",
                                            "value" : numberRange[1]
                                        }];
                                }
                                searchTokens.push(searchToken);
                                break;
                            case 'date':
                                if (~token.indexOf(' Before ')) {
                                    var dateValues = dateFormatter.formatDateTime(values.split('Before ')[1]);
                                    searchToken = [{
                                        "column" : key,
                                        "operator" : "<=",
                                        "value" : dateValues
                                    }];
                                } else if (~token.indexOf(' After ')) {
                                    var dateValues = dateFormatter.formatDateTime(values.split('After ')[1]);
                                    searchToken = [{
                                        "column" : key,
                                        "operator" : ">=",
                                        "value" : dateValues
                                    }];
                                } else if (~token.indexOf(' - ')) {
                                    var dateRange = values.split(' - ');
                                    var rangeFrom = dateFormatter.formatDateTime(dateRange[0]);
                                    var rangeTo = dateFormatter.formatDateTime(dateRange[1]);
                                    searchToken = [{
                                        "column" : key,
                                        "operator" : ">=",
                                        "value" : rangeFrom
                                    },
                                        "AND",
                                        {
                                            "column" : key,
                                            "operator" : "<=",
                                            "value" : rangeTo
                                        }];
                                } else {
                                    var dateValues = dateFormatter.formatDateTime(values);
                                    searchToken = [{
                                        "column" : key,
                                        "operator" : "=",
                                        "value" : dateValues
                                    }];
                                }
                                searchTokens.push(searchToken);
                                break;
                            default:
                                searchToken = [];
                                values = values.split(', ');
                                var valuesLength = values.length, i;
                                for (i=0; i < valuesLength; i++) {
                                    searchToken.push({
                                        "column" : key,
                                        "operator" : "=",
                                        "value" : values[i]
                                    });
                                    (values.length > 1 && i!= valuesLength-1) && searchToken.push("OR");
                                }
                                searchTokens.push(searchToken);
                                break;
                        }
                    } else {
                        searchTokens.push(token);
                    }
                });
            }

            return searchTokens;
        };

        var getAdvancedSearchTokens = function () {
            if(isQueryBuilder){
                return searchWidget.getAST();
            }else{
                return searchWidget.getAllTokens();
            }
        };

        var getFilterMenuConfiguration = function (items) {
            return {
                "callback": function(key, options) {
                    $(this).trigger('slipstreamGrid.'+key, {
                        "search": getAdvancedSearchTokens()
                    });
                },
                "position": function(opt, x, y){
                    opt.$menu.position({ my: "left top", at: "left bottom", of: this, offset: "0 0"});
                },
                "items": items
            };
        };

        /**
         * Registers the handlers for the events that are generated by queryWidget.
         */
        var registerAdvanceFilterHandlers = function () {
            var queryExecuted = false;

            searchWidget.bindEvents({
                "query.executeQuery": {
                    "handler": [function (e, queryObj) {
                        queryExecuted = true;
                        triggerSearch(queryObj);
                    }]
                },
                "query.emptyQuery": {
                    "handler": [function (e) {
                        // make sure that search is triggered only if data is already filtered
                        // if there is no filtered results yet, then no point making the call to app for refresh data as it would be same as initial load
                        if(queryExecuted){
                            triggerSearch();
                            queryExecuted = false;
                        }
                    }]
                }
            });
        };
    };

    return FilterOptions;
});
