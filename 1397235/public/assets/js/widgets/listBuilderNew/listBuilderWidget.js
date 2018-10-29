/**
 * A module that builds a double list widget from a configuration object.
 * The configuration object includes the container which should be used to render the widget
 *
 * @module ListBuilderWidget
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
    'widgets/grid/gridWidget',
    'widgets/listBuilderNew/lib/formatConf',
    'widgets/listBuilderNew/lib/tooltipBuilder',
    'widgets/listBuilderNew/lib/dataLoader',
    'widgets/listBuilderNew/lib/actionBarBuilder',
    'lib/template_renderer/template_renderer',
    'text!widgets/listBuilderNew/templates/listContainer.html',
    'text!widgets/listBuilderNew/templates/listTable.html',
    'text!widgets/listBuilderNew/templates/loadingBackground.html',
    'lib/i18n/i18n'
],  /** @lends ListBuilderWidget */
    function(GridWidget, FormatConf, TooltipBuilder, DataLoader, ActionBarBuilder, render_template, listContainer, listTable, LoadingBackgroundTemplate, i18n) {

    /**
     * ListBuilderWidget constructor
     *
     * @constructor
     * @class ListBuilderWidget - Builds a list builder widget from a configuration object.
     *
     * @param {Object} conf - It requires two parameters:
     * container: define the container where the widget will be rendered
     * elements: define the parameters required to build the widget.
     * @returns {Object} Current ListBuilderWidget's object: this
     */
    var ListBuilderWidget = function(conf){
        var self = this,
            confObj = {
                container: $(conf.container),
                elements: conf.elements
            },
            elements,
            tooltipBuilder,
            dataLoader,
            actionBarBuilder,
            gridTableAvailable = null,
            gridTableSelected = null,
            availableGridWidget = null,
            selectedGridWidget = null,
            jsonId,
            isPopulated = 0,
            availableIds =[],
            selectedIds =[],
            searchObj = {
                customAvailableGridPostData: {},
                customSelectedGridPostData: {},
                gridAvailablePostData: {},
                gridSelectedPostData: {},
                availableSearchValue: '',
                selectedSearchValue: ''
            },
            spaceConst = {
                buttonContainer: 50  //the width of button panel
            },
            gridTableWidth,
            hasRequiredParameters = conf && conf.container && conf.elements && conf.elements.columns && conf.elements.availableElements,
            isLoadRemotely,
            isLoadLocally,
            isCollectionBased,
            isAutoWidth;

        var errorMessages = {
            'noConf': 'The configuration object required to build the List Builder widget is missing',
            'noContainer': 'The container object required to build the List Builder widget is missing',
            'noElements': 'The elements object required to build the List Builder widget is missing',
            'noColums': 'List Builder widget could not be built because column is a required parameter in the configuration object of the List Builder widget',
            'noListBuilder': 'The list builder widget has not been built',
            'noSearch': 'Search is not available for this list builder',
            'duplicatedID': 'This ID already exists',
            'noElement': 'The element object is not in the list builder.',
            'noAvailableElements': 'The availableElements configuration is required.'
        };

        /**
         * Binding Events in the list builder
         * @inner
         */
        var bindEvents = function (){
            elements.selectButton.on('click', function() {
                toggleSelection(true);
            });
            elements.unselectButton.on('click', function() {
                toggleSelection();
            });

            elements.panel2.on('onChangeSelected', conf.elements.onChangeSelected);
            elements.listBuilder.on('onDestroyListBuilder', conf.elements.onDestroyListBuilder);
            elements.listBuilder.on('onBuildListBuilder', conf.elements.onBuildListBuilder);

            elements.panel1.on("onSelectAllCompleted", selectAllCompletedEvent);
            elements.panel2.on("onSelectAllCompleted", selectAllCompletedEvent);

            gridTableAvailable.on("slipstreamGrid.row:updateNumberOfRows", function(e, totalRows){
                updateCounts(false, totalRows);
            });
            gridTableSelected.on("slipstreamGrid.row:updateNumberOfRows", function(e, totalRows){
                updateCounts(true, totalRows);
            });

            gridTableAvailable.on("gridLoaded", function(e, totalRows){
                loadComplete(gridTableAvailable, availableGridWidget);
            });
            gridTableSelected.on("gridLoaded", function(e, totalRows){
                loadComplete(gridTableSelected, selectedGridWidget);
            });

            confObj.container.resize(function () {
                setListBuilderWidth();
            });

            gridTableAvailable.on("gridOnRowSelection", function(e, selectedRows){
                toggleArrowStatus(false, selectedRows.numberOfSelectedRows > 0);
            });
            gridTableSelected.on("gridOnRowSelection", function(e, selectedRows){
                toggleArrowStatus(true, selectedRows.numberOfSelectedRows > 0);
            });
            gridTableAvailable.on("gridOnSelectAll", function(e, status){
                toggleArrowStatus(false, status);
            });
            gridTableSelected.on("gridOnSelectAll", function(e, status){
                toggleArrowStatus(true, status);
            });
        },

        /**
         * Toggle arrows class in the btn-group
         * @param {Boolean} isSelectedPanel
         * @param {Boolean} arrow status
         * @inner
         */
        toggleArrowStatus = function(isSelectedPanel, status){
            var button = isSelectedPanel ? elements.unselectButton : elements.selectButton;
            if (status){
                toggleBtnClass(false, button);
            }else{
                toggleBtnClass(true, button);
            }
        },

        /**
         * Update count
         * @param {Boolean} isSelectedPanel
         * @param {Number} totalRows - total number of rows
         * @inner
         */
        updateCounts = function(isSelectedPanel, totalRows){
            var $listAction = isSelectedPanel ? elements.listAction2 : elements.listAction1,
                content = isSelectedPanel ? i18n.getMessage('Selected') : i18n.getMessage('Available'),
                $countContainer = $listAction.find('.subTitle .content');
            $countContainer.length && $countContainer.text(totalRows + " " + content);
            gridComplete(isSelectedPanel);
        },

        /**
         * Toggle arrow btn
         * @param {Boolean} isDisabled
         * @param {Object} $element
         * @inner
         */
        toggleBtnClass = function(isDisabled, $element){
            var $button = $element || elements.buttonContainer;
            if (isDisabled){
                $button.find('.arrow').addClass("arrow_disable");
            }else{
                $button.find('.arrow').removeClass("arrow_disable");
            }
        },

        /**
         * Calculate the grid width
         * @inner
         */
        calculateGridWidth = function(){
            var containerWidth = confObj.container.width();

            return (containerWidth - spaceConst.buttonContainer)/2;
        },

        /**
         * Set listBuilder panel width
         * @inner
         */
        setListBuilderWidth = function(){
            if (isAutoWidth){
                gridTableWidth = calculateGridWidth();
                gridTableAvailable.css('width', gridTableWidth);
                gridTableSelected.css('width', gridTableWidth);
            }
        },

        /**
         * When grid complete, list builder will trigger event and assign container width
         * @param {Boolean} isSelectedPanel
         * @inner
         */
        gridComplete = function(isSelectedPanel){
            var hasGetDataFunc = ((!isSelectedPanel && conf.elements.availableElements.getData) || (isSelectedPanel && conf.elements.selectedElements && conf.elements.selectedElements.getData))? true: false;
            hasGetDataFunc && conf.elements.loadonce && triggerOnBuildListBuilder();
        },

        /**
         * When grid loads, list builder will enable tooltips and arrow buttons
         * @param {Object} gridTable
         * @param {Object} gridWidget
         * @inner
         */
        loadComplete = function(gridTable, gridWidget){
            tooltipBuilder && tooltipBuilder.addContentTooltips(gridTable, gridWidget);
            toggleBtnClass(true);
            triggerOnBuildListBuilder();
        },

        /**
         * Trigger onBuildListBuilder event
         * @param {Object} gridTable
         * @param {Object} gridWidget
         * @inner
         */
         triggerOnBuildListBuilder = function(){
            isPopulated ++;

            //When both available and selected grids are loaded, we trigger onBuildListBuilder event
            if (isPopulated === 2){
                elements.listBuilder && elements.listBuilder.trigger('onBuildListBuilder', elements.listBuilder);
                setListBuilderWidth();
            }
         },

        /**
         * Select/Unselect the items from panel
         * @param {Boolean} isSelectedPanel
         * @inner
         */
        toggleSelection = function(isSelectedPanel){
            var selectEvent,
                selectedRows = isSelectedPanel? getSelectedRows(availableGridWidget): getSelectedRows(selectedGridWidget),
                isSelectAll = selectedRows.allRowIds && selectedRows.allRowIds.length > 0;

            if (isSelectedPanel){
                selectEvent = (isSelectAll)? "selectAll": "select";
                changeItems(selectedGridWidget, availableGridWidget, selectEvent);
            }else{
                selectEvent = (isSelectAll)? "unselectAll":"unselect";
                changeItems(availableGridWidget, selectedGridWidget, selectEvent);
            }
        },

        /**
         * Select All Event
         * @inner
         */
        selectAllCompletedEvent = function(e, data){
            var gridTable = $(this).find('.listTable'),
                currentGrid = gridTable.attr('id'),
                panelNo = currentGrid.slice(-1);
            if (panelNo === '1'){
                availableIds = data['ids'].toString().split(',');
            }

            if (panelNo === '2'){
                selectedIds = data['ids'].toString().split(',');
            }
        },

        /**
         * Select items from the available column to the selected column.
         * @inner
         */
        createElements = function(listBuilder){
            elements = {
                listBuilder: listBuilder.find('.new-list-builder-widget'),
                panel1: listBuilder.find('.panel1'),
                panel2: listBuilder.find('.panel2'),
                buttonContainer: listBuilder.find('.btn-group'),
                selectButton: listBuilder.find('.btn-group .select-container'),
                unselectButton: listBuilder.find('.btn-group .unselect-container')
              };

            _.extend(elements, {
                listAction1: elements.panel1.find('.listActions'),
                listAction2: elements.panel2.find('.listActions')
            });
        },

        /**
         * Select items from the available column to the selected column.
         * @inner
         */
        changeItems = function(gridTable1, gridTable2, event, list){
            var getSelectedObjects = getSelectedRows(gridTable2),
                changedItems = [],
                list = list || getSelectedObjects.selectedRows;

            if ((isLoadLocally || conf.elements.loadonce)  && !isCollectionBased){
                for (var i = 0; i < list.length; i++){
                    gridTable1.addRow(list[i], 'last');
                    gridTable2.deleteRow(list[i][jsonId], false);
                    changedItems.push(list[i]);
                }
                availableGridWidget.resizeGridWidth();
                selectedGridWidget.resizeGridWidth();
                tooltipBuilder.addContentTooltips(gridTableAvailable, availableGridWidget);
                tooltipBuilder.addContentTooltips(gridTableSelected, selectedGridWidget);
             }else{
                if (event === "selectAll" || event === "unselectAll"){
                    changedItems = getSelectedObjects.allRowIds;
                }else{
                    changedItems = list;
                }
            }

            changedItems.length > 0 && triggerOnChangeSelected({data: changedItems, event: event});
        },

        /**
         * Get a list of selected rows using the jqGrid library
         * @param {Object} gridTable
         * @inner
         */
        getSelectedRows = function(gridTable){
            return gridTable.getSelectedRows(true);
        },

        /**
         * Trigger onChangeSelected
         * @inner
         */
        triggerOnChangeSelected  = function(list) {
            elements.panel2.trigger('onChangeSelected', list);
            console.log(list);
        },

        /**
         * Creates a grid using the jqGrid library
         * @param {Object} gridConfiguration - configuration of the grid
         * @param {Object} gridTable
         * @param {boolean} isSelectedPanel - if this is the panel2
         * @inner
         */
        createGrid = function (gridConfiguration, gridTable, isSelectedPanel) {
            var buildGrid = function(gridConfiguration){
                var FormattedConf = new FormatConf(gridConfiguration, searchObj),
                    selectOnHover = function(e, selectedRows){
                        var $element = this.conf.container.parent(),
                            data = [selectedRows.rowOnHover.rowData];

                        if ($element.hasClass("panel1")){
                            self.selectItems(data);
                        }else{
                            self.unselectItems(data);
                        }
                    },
                    grid = new GridWidget({
                        container: gridTable,
                        elements: FormattedConf.getConf(isSelectedPanel, elements, isCollectionBased),
                        actionEvents: {
                            selectOnHover: {
                                name: "selectOnHover",
                                handler: [selectOnHover]
                            }
                        }
                    });
                if (isSelectedPanel){
                    selectedGridWidget = grid;
                }else{
                    availableGridWidget = grid;
                }

                grid.build();
            
                actionBarBuilder.bindActionBarEvents(isSelectedPanel, grid);
            };

            var hasGetDataFunc = ((!isSelectedPanel && gridConfiguration.availableElements.getData) || (isSelectedPanel && gridConfiguration.selectedElements && gridConfiguration.selectedElements.getData))? true: false;

            //Request ajax call when loadonce is true and use datatyle local in the grid
            if (gridConfiguration.loadonce && !hasGetDataFunc){
                dataLoader = new DataLoader(conf);
                dataLoader.init(gridConfiguration, isSelectedPanel, buildGrid);
            }else{
                buildGrid(gridConfiguration);
            }
        },

         /**
         * Throw error messages depeding on the parameter that is missing in the configuration object
         * @inner
         */
        throwErrorMessage = function () {
            if (typeof(conf) === 'undefined') throw new Error(errorMessages.noConf);
            else if (typeof(conf.container) === 'undefined') throw new Error(errorMessages.noContainer);
            else if (typeof(conf.elements) === 'undefined') throw new Error(errorMessages.noElements);
            else if (typeof(conf.elements.columns) === 'undefined') throw new Error(errorMessages.noColums);
            else if (!conf.elements.availableElements) throw new Error(errorMessages.noAvailableElements);
        },


        /**
         * Get the row data by Id
         * @param {Object} gridTable
         * @param {String} rowId
         * @returns {Object} row data
         * @inner
         */
        getRowDataById = function (gridTable, rowId) {
            var rows = gridTable.getAllVisibleRows(),
                rowData = {};

            for (var i = 0; i< rows.length; i++){
                var row = rows[i];
                if (row[jsonId] == rowId){
                    rowData = row;
                }
            }
            return rowData;
        },

        /**
         * Generate array ids from a list
         * @param {Array} list
         * @returns {Array} a list of ids
         * @inner
         */
        getListIds = function (list) {
            return _.pluck(list, jsonId);
        },

        /**
         * Initialize all globla varialbes in the listBuilder
         * @inner
         */
        initVariables = function(){
            var gridConfiguration = conf.elements;

            jsonId = gridConfiguration.jsonId;
            //Check if both url are defined. If yes, then it is loading remotely
            isLoadRemotely = gridConfiguration.selectedElements && !_.isUndefined(gridConfiguration.selectedElements.url) && gridConfiguration.availableElements && !_.isUndefined(gridConfiguration.availableElements.url);
            //Check if both url are not defined. If yes, then it is loading locally
            isLoadLocally = gridConfiguration.selectedElements && _.isUndefined(gridConfiguration.selectedElements.url) && gridConfiguration.availableElements && _.isUndefined(gridConfiguration.availableElements.url),
            isCollectionBased = (gridConfiguration.availableElements && _.isUndefined(gridConfiguration.availableElements.data) && _.isUndefined(gridConfiguration.availableElements.url) && _.isUndefined(gridConfiguration.availableElements.getData));
            isAutoWidth = _.isBoolean(gridConfiguration.showWidthAsPercentage) && gridConfiguration.showWidthAsPercentage;
        };


        //Exposed Methods

        /**
         * Builds the Grid widget in the specified container
         * @returns {Object} Current "this" of the class
         */
        this.build =  function () {
            if(hasRequiredParameters){
                var gridContainer1,
                    gridContainer2,
                    gridWidth,
                    gridConfiguration = conf.elements,
                    id = gridConfiguration.id || _.uniqueId("slipstream_list_builder_widget"),
                    listBuilderID = 'slipstream_list_builder_widget_' + id,
                    listBuilderClass = _.uniqueId("slipstream_list_builder_widget_class"),
                    hasSearchMenu = (gridConfiguration.search && gridConfiguration.search.optionMenu) ? true : false;

                initVariables();

                gridContainer1 = confObj.container.html(render_template(listContainer,{
                            id: listBuilderID,
                            class: listBuilderClass
                        }
                    )).find('.panel1').append(render_template(listTable,{
                    'table_id':id + 1
                }));
                gridContainer2 = confObj.container.find('.panel2').append(render_template(listTable,{
                    'table_id':id + 2
                }));

                createElements(confObj.container);

                gridTableAvailable = gridContainer1.find('.listTable');
                gridTableSelected  = gridContainer2.find('.listTable');
                bindEvents();

                actionBarBuilder = new ActionBarBuilder(self, gridConfiguration, searchObj);
                actionBarBuilder.buildActionBar(elements.listAction1, false, _.bind(self.searchAvailableItems, self));
                actionBarBuilder.buildActionBar(elements.listAction2, true, _.bind(self.searchSelectedItems, self));

                createGrid(gridConfiguration, gridTableAvailable, false);
                createGrid(gridConfiguration, gridTableSelected, true);

                tooltipBuilder = new TooltipBuilder(conf);
                if (isLoadLocally && !conf.elements.loadonce){
                    tooltipBuilder.addContentTooltips(gridTableAvailable, availableGridWidget);
                    tooltipBuilder.addContentTooltips(gridTableSelected, selectedGridWidget);
                }
            } else {
                throwErrorMessage();
            }
            return this;
        };

        /**
         * Get available items which are currently displaying in the panel 1.
         * Note: If you have virtual scrolling in the panel 1, it will only return the displaying items.
         * @returns {Object} A set of objects for each of the available items
         */
        this.getAvailableItems = function (){
            var allRowsInGrid;
            if (gridTableAvailable && availableGridWidget){
                allRowsInGrid = availableGridWidget.getAllVisibleRows();
            }else{
                throw new Error(errorMessages.noListBuilder)
            }
            return allRowsInGrid;
        };

        /**
         * Remove elements for the available column (panel1)
         * @param [Array] A set of objects for each of the item that will be removed from the available panel
         */
        this.removeAvailableItems = function (list){
            var removeAvailableItems;
            if (gridTableAvailable && availableGridWidget){
                availableGridWidget.deleteRow(getListIds(list), false);
                removeAvailableItems = list;
            }else{
                throw new Error(errorMessages.noListBuilder)
            }
            return removeAvailableItems;
        };

        /**
         * Add elements for the available column (panel1)
         * @param {Object} A set of objects for each of the items that will be added to the available column
         */
        this.addAvailableItems = function (list){
            if (gridTableAvailable && availableGridWidget){
                for (var i = 0; i < list.length; i++){
                    var rowId = list[i][jsonId],
                        dataFromTheRow = getRowDataById(availableGridWidget, rowId);
                    if (_.isEmpty(dataFromTheRow)){
                        availableGridWidget.addRow(list[i], 'last');
                    }else{
                        throw new Error(errorMessages.duplicatedID);
                    }
                }
            }else{
                throw new Error(errorMessages.noListBuilder);
            }
        };

        /**
         * Add rows to the available panel for no url requests
         * @param {Array} data - data of the new row
         */
        this.renderAvailableItems = function (data) {
            if (availableGridWidget){
                var page = {numberOfPage: 1, totalRecords: data.length, totalPages: 1};
                availableGridWidget.addPageRows(data, page);
            }else{
                throw new Error(errorMessages.noListBuilder);
            }
        };

        /**
         * Search keyword for the available column (panel1)
         * if local @param {String} or {Array}
         * if remote @param {String} or {Object}
         */
        this.searchAvailableItems = function (keyword){
            if (availableGridWidget){
                if (isLoadLocally || conf.elements.loadonce || _.isString(keyword)){
                    searchObj.availableSearchValue = keyword;
                    availableGridWidget.clearSearch();
                    availableGridWidget.search(keyword, false);
                } else if (_.isArray(keyword) || _.isObject(keyword)){
                    searchObj.customAvailableGridPostData = keyword;

                    //When the keyword is an array or an object, we need to search first, then it will trigger reformatUrl, so list builder can pass the object to the grid.
                    availableGridWidget.search("slipstream_available", false);
                }
            }else{
                throw new Error(errorMessages.noListBuilder);
            }
        };

        /**
         * Return current search parameters for the available column (panel1)
         * @param {Object}
         */
        this.getAvailableUrlParameter = function (){
            if (availableGridWidget){
                return searchObj.gridAvailablePostData;
            }else{
                throw new Error(errorMessages.noListBuilder);
            }
        };

        /**
         * Set elements for the available column (panel1)
         * @param [Array] A set of objects for each of the items that will be moved to the available column from the selected colunm
         */
        this.unselectItems = function (list){
            if (gridTableAvailable && gridTableSelected){
                if (isLoadRemotely){
                    triggerOnChangeSelected({data: list, event: 'unselect'});
                }else{
                    changeItems(availableGridWidget, selectedGridWidget, 'unselect', list);
                }
            }else{
                throw new Error(errorMessages.noListBuilder);
            }
        };

        /**
         * Get selected items which are currently displaying in the panel 2.
         * Note: If you have virtual scrolling in the panel 2, it will only return the displaying items.
         * @returns {Object} A set of objects for each of the selected items
         */
        this.getSelectedItems = function (){
            var allRowsInGrid;
            if (gridTableSelected && selectedGridWidget){
                allRowsInGrid = selectedGridWidget.getAllVisibleRows();
            }else{
                throw new Error(errorMessages.noListBuilder);
            }
            return allRowsInGrid;
        };

        /**
         * Remove the items that were selected (panel2)
         * @returns [Array] A set of objects for each of the item that will be removed from the selected panel
         */
        this.removeSelectedItems = function (list){
            var removeSelectedItems;
            if (gridTableSelected && selectedGridWidget){
                selectedGridWidget.deleteRow(getListIds(list), false);
                removeSelectedItems = list;
            }else{
                throw new Error(errorMessages.noListBuilder)
            }

            return removeSelectedItems;
        };

        /**
         * Add elements for the second column (panel2)
         * @param {Object} A set of objects for each of the items that will be added to the selected column
         */
        this.addSelectedItems = function (list){
            if (gridTableSelected && selectedGridWidget){
                for (var i = 0; i < list.length; i++){
                    var rowId = list[i][jsonId],
                        dataFromTheRow = getRowDataById(selectedGridWidget, rowId);
                    if (_.isEmpty(dataFromTheRow)){
                        selectedGridWidget.addRow(list[i], 'last');
                    }else{
                        throw new Error(errorMessages.duplicatedID);
                    }
                }
            }else{
                throw new Error(errorMessages.noListBuilder)
            }
        };

        /**
         * Add rows to the selected panel for no url requests
         * @param {Array} data - data of the new row
         */
        this.renderSelectedItems = function (data) {
            if (selectedGridWidget){
                var page = {numberOfPage: 1, totalRecords: data.length, totalPages: 1};
                selectedGridWidget.addPageRows(data, page);
            }else{
                throw new Error(errorMessages.noListBuilder);
            }
        };

        /**
         * Search keyword for the second column (panel2)
         * if local @param {String} or {Array}
         * if remote @param {String} or {Object}
         */
        this.searchSelectedItems = function (keyword){
            if (selectedGridWidget){
                if (isLoadLocally || conf.elements.loadonce || _.isString(keyword)){
                    searchObj.selectedSearchValue = keyword;
                    selectedGridWidget.clearSearch();
                    selectedGridWidget.search(keyword, false);
                } else if (_.isArray(keyword) || _.isObject(keyword)){
                    searchObj.customSelectedGridPostData = keyword;

                    //When the keyword is an array or an object, we need to search first, then it will trigger reformatUrl, so list builder can pass the object to the grid.
                    selectedGridWidget.search("slipstream_selected", false);
                }
            }else{
                throw new Error(errorMessages.noListBuilder);
            }
        };

        /**
         * Return current search parameters for the available column (panel1)
         * @param {Object}
         */
        this.getSelectedUrlParameter = function (){
            if (gridTableSelected){
                return searchObj.gridSelectedPostData;
            }else{
                throw new Error(errorMessages.noListBuilder);
            }
        };


        /**
         * Set elements for the second column (panel2)
         * @param [Array] A set of objects for each of the items that will be moved to the selected column from the available column
         */
        this.selectItems = function (list){
            if (gridTableAvailable && gridTableSelected){
                if (isLoadRemotely){
                    triggerOnChangeSelected({data: list, event: 'select'});
                }else{
                    changeItems(selectedGridWidget, availableGridWidget, 'select', list);
                }
            }else{
                throw new Error(errorMessages.noListBuilder);
            }
        };

        /**
         * Destroys all elements created by the GridWidget in the specified container
         * @returns {Object} Current GridWidget object
         */
        this.destroy =  function () {
            if(elements && elements.listBuilder){
                elements.listBuilder.trigger('onDestroyListBuilder', elements.listBuilder);
                elements.listBuilder.remove();
            }else{
                throw new Error(errorMessages.noListBuilder);
            }

            return this;
        };

        /**
         * Reload the list builder by url requests
         */
        this.reload = function (){
            if (availableGridWidget && selectedGridWidget){
                var options = {
                    resetSelection: true
                };
                availableGridWidget.reloadGrid(options);
                selectedGridWidget.reloadGrid(options);

                //Reset arrow status to be false. 
                toggleArrowStatus(true, false); //Disable unselect arrow
                toggleArrowStatus(false, false); //Disable select arrow
            } else {
                throw new Error(errorMessages.noListBuilder);
            }
        };

    };

    return ListBuilderWidget;
});