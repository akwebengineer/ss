/**
 * A module that builds a grid widget using a configuration object.
 * The configuration object includes a container where the widget will be rendered and
 * an element object with the parameters required to build the widget.
 *
 * @module GridWidget
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'jqGrid',
    'infiniteScroll',
    "widgets/baseWidget",
    'widgets/grid/lib/actionEvents',
    'widgets/grid/lib/gridRBAC',
    'widgets/grid/lib/gridNonRecordsState',
    'widgets/grid/lib/gridFormatter',
    'widgets/grid/lib/treeFormatter',
    'widgets/grid/lib/menuFormatter',
    'widgets/grid/lib/actionBuilder',
    'widgets/grid/lib/filterOptions',
    'widgets/grid/lib/dataFormatter',
    'widgets/grid/lib/tooltipBuilder',
    'widgets/grid/lib/gridTemplates',
    'widgets/grid/lib/gridSpinner',
    'widgets/grid/lib/gridEvents',
    'widgets/grid/lib/dragNDrop',
    'widgets/grid/lib/filterDrop',
    'widgets/grid/lib/selectAllManager',
    'widgets/grid/lib/confirmationDialogBuilder',
    'widgets/grid/util/gridSizeCalculator',
    'widgets/grid/lib/gridConfigUtil',
    'widgets/grid/lib/pagination',
    'widgets/grid/lib/sortableColumns',
    'widgets/grid/lib/gridKeyEventHandlers',
    'widgets/grid/lib/columnSwitchOnHover',
    'widgets/grid/lib/multiselectCell',
    'widgets/grid/lib/indeterminateCheckbox',
    'widgets/grid/lib/treeActions',
    'widgets/grid/lib/actionAfterRowInserted',
    'widgets/grid/util/jqGridModifier',
    'widgets/grid/util/gridConfigurationHelper',
    'widgets/grid/util/dateFormatter',
    'widgets/grid/util/gridUtility',
    'widgets/grid/util/treeGridHelper',
    'widgets/grid/lib/preferencesReconciler',
    'widgets/grid/lib/groupColumn',
    'widgets/grid/lib/rowParentToggler',
    'widgets/grid/lib/inlineEditRow',
    'lib/template_renderer/template_renderer',
    'widgets/form/formValidator',
    'widgets/overlay/overlayWidget',
    'widgets/grid/util/searchUtility',
    'lib/i18n/i18n',
    'isInViewport'
], /** @lends GridWidget */
    function (jqGrid, infiniteScroll, BaseWidget, ActionEvents, GridRBAC, GridNonRecordsState, GridFormatter, TreeFormatter, 
        MenuFormatter, ActionBuilder, FilterOptions, DataFormatter, TooltipBuilder, GridTemplates, GridSpinner, GridEvents, 
        DragNDrop, FilterDrop, SelectAllManager, ConfirmationDialogBuilder, GridSizeCalculator, GridConfigUtil, GridPagination, 
        SortableColumns, GridKeyEventHandlers, ColumnSwitchOnHover, MultiselectCell, IndeterminateCheckbox, TreeActions, 
        ActionAfterRowInserted, JqGridModifier, GridConfigurationHelper, DateFormatter, GridUtility, TreeGridHelper, 
        PreferencesReconciler, GroupColumn, RowParentToggler, InlineEditRow, render_template, FormValidator, OverlayWidget, 
        SearchUtility, i18n, isInViewport) {
    /**
     * GridWidget constructor
     *
     * @constructor
     * @class GridWidget - Builds a Grid widget from a configuration object.
     *
     * @param {Object} conf - It requires two parameters:
     * container: define the container where the widget will be rendered
     * elements: define the parameters required to build the widget. It should have the following parameters:
     * title, url (required), height, tooltip, sortorder, sortname, multiselect, tableId and columns (required)
     * columns contains the data required to render the header of the table and column features like sorting, editing, etc. The available parameters per column are:
     * index, name, label, sorttype, sortable, width, editable, align
     * @returns {Object} Current GridWidget's object: this
     */

    var GridWidget = function (conf) {

        var preferencesReconciler = new PreferencesReconciler(conf);
        conf = preferencesReconciler.reconcilePreferences();

        BaseWidget.call(this, {
            "events": conf.actionEvents
        });

        this.conf = {
            container: $(conf.container),
            elements: conf.elements,
            events: conf.actionEvents //optional
        };

        var self = this,
            actionEvents = new ActionEvents(this, errorMessages),
            rbacHash = new GridRBAC(conf).init(),
            templates = new GridTemplates().getTemplates(),
            gridConfigurationHelper = new GridConfigurationHelper(conf),
            formValidator = new FormValidator(),
            searchUtility = new SearchUtility(conf.elements),
            gridSizeCalculator = new GridSizeCalculator(conf.elements),
            gridFormatter = new GridFormatter(templates, gridConfigurationHelper, searchUtility, gridSizeCalculator),
            treeFormatter = new TreeFormatter(),
            menuFormatter = new MenuFormatter(conf.elements, gridConfigurationHelper, gridSizeCalculator),
            dataFormatter = new DataFormatter(),
            actionBuilder = new ActionBuilder(conf, templates, rbacHash, gridConfigurationHelper),
            gridSpinner = new GridSpinner(conf),
            selectAllManager = new SelectAllManager(),
            confirmationDialogBuilder = new ConfirmationDialogBuilder(conf.elements),
            dateFormatter = new DateFormatter(),
            jqGridModifier = new JqGridModifier(),
            gridConfigUtil = new GridConfigUtil(conf, gridConfigurationHelper),
            gridPagination = new GridPagination(conf),
            gridUtility = new GridUtility(),
            gridEvents = new GridEvents(conf),
            gridKeyEventHandlers = new GridKeyEventHandlers(conf),
            actionAfterRowInserted,
            indeterminateCheckbox,
            columnSwitchOnHover,
            dragNDrop,
            filterDrop,
            groupColumn,
            sortableColumns,
            multiselectCell,
            filterOptions,
            tooltipBuilder,
            rowParentToggler,
            gridContainer = null,
            gridTable = null,
            containers,
            selectedRowsByTables = {},
            selectedRowsInTree = {},
            allRowsInTree = {},
            originalRowData = {},
            actionElements = {},
            requestKey,
            columnConfigurationHash,
            numCollectionRecords,
            searchCellValueHash,
            autoWidth = _.isBoolean(conf.elements.showWidthAsPercentage) ? conf.elements.showWidthAsPercentage : true,//todo: deprecate showWidthAsPercentage parameter and default autoWidth to false
            isPaginationSupported = (conf.elements.scroll && conf.elements.scroll.pagination && conf.elements.tree),
            isCollectionDataGrid = _.isUndefined(conf.elements.url) && _.isUndefined(conf.elements.data) && _.isUndefined(conf.elements.getData),
            copiedRows = [],
            tableId,
            isLocalData = false,
            hasSelectAll = (conf.elements.onSelectAll === false || conf.elements.singleselect) ? false : true,
            rowSelectionEnabled = conf.elements.multiselect || conf.elements.singleselect,
            allRowIds = {
                "selectAllEnabled": false,
                "selectAllFiltered": false,
                "selectAllReset": false,
                "selectAllIndeterminate": false,
                "unselectedRowIds": {},
                "selectedRowIds": {}
            },
            lastSelectedRows = {
                "rowsInDom": {}
            },
            reservedElementClasses = {
                "morePill": ["moreTooltipElements", "moreTooltipElement", "moreGroups"],
                "moreIcon": ["slipstreamgrid_more", "moreIcon", "lessIcon", "toggleIcon"],
                "rowHoverAction": "hoverAction",
                "rowNoSelectable": "rowNoSelectable",
                "cellWithNoSelectable": ["quickView"], //cells/elements that when are clicked won't cause row selection
                "rowCarat": "slipstreamgrid_more"
            },
            hasMultipleCellContent = gridConfigurationHelper.hasColumnProperty("collapseContent") || gridConfigurationHelper.hasColumnProperty("groupContent") ? true : false,
        treeGridRowNumberCount = 0,
        gridNonRecordsState, inlineEditRow;

        var errorMessages = {
            'hasRequiredParameters': conf && conf.container && conf.elements && conf.elements.columns,
            'noConf': 'The configuration object required to build the Grid widget is missing',
            'noContainer': 'The container object required to build the Grid widget is missing',
            'noElements': 'The elements object required to build the Grid widget is missing',
            'noColums': 'Grid widget could not be built because \"column\" is a required parameter in the configuration object of the Grid widget',
            'noColumData': 'Grid widget could not be built because one or more columns are undefined or have an incorrect data type',
            'noGrid': 'The Grid widget has not been built',
            'noUniqueId': 'Editing a Grid widget using an overlay requires a unique id that needs to be defined in the jsonId parameter',
            'noFilter': 'Filtering is not available for this grid',
            'noSearchWidgetInstance': 'The Search widget Instance is not available'
        };

        /**
         * Builds the Grid widget in the specified container
         * @returns {Object} Current "this" of the class
         */
        this.build = function () {
            if (errorMessages.hasRequiredParameters) {
                this.conf.cellProperties = getCellProperties(); //merged with conf.cellOverlayViews

                columnConfigurationHash = gridConfigurationHelper.buildColumnConfigurationHash();

                if (conf.elements.editRow && conf.elements.editRow.showInline) {
                    inlineEditRow = new InlineEditRow(templates, actionBuilder);
                }

                requestKey = gridUtility.generateRandomKey();
                tableId = conf.elements.tableId || _.uniqueId("slipstream_grid_widget");

                var footerConf = {
                    selectionEnabled: rowSelectionEnabled,
                    refreshEnabled: conf.elements.refresh,
                    itemsLabel: i18n.getMessage('Items'),
                    ofLabel: i18n.getMessage('Of'),
                    rowsLabel: i18n.getMessage('Rows'),
                    displayLabel: i18n.getMessage('Display'),
                    footerPaginationContainer: isPaginationSupported ? true : false,
                    hideRowCount: (conf.elements.footer && conf.elements.footer.hideRowCount) ? true : false,
                    hideSelectionAndRowCount: (conf.elements.footer && conf.elements.footer.hideSelectionAndRowCount) ? true : false
                };
                gridContainer = $(render_template(templates.gridContainer, _.extend({
                    'key': requestKey,
                    'title': conf.elements.title ? {  'content': conf.elements.title,
                        'help': conf.elements['title-help'],
                        'isTitle': true
                    } : false,
                    'subTitle': _.isString(conf.elements.subTitle) ? {'content': conf.elements.subTitle} : conf.elements.subTitle,
                    'action_id': _.uniqueId("slipstream_grid_widget_action_container"),
                    'table_id': tableId,
                    'edit_inline': (inlineEditRow && !conf.elements.subGrid) ? true : false,
                    'management': conf.actionEvents, //createEvent,updateEvent,deleteEvent,copyEvent,pasteEvent,moreEvent,statusEvent
                    'actionButtons': actionBuilder.formatCustomActionIcons(conf.elements.actionButtons),
                    'filter': conf.elements.filter,
                    'footer': (_.isBoolean(conf.elements.footer) && !conf.elements.footer && !isPaginationSupported ) ? false : footerConf,
                    'selection': showSelection(),
                    'selectedLabel': i18n.getMessage('selected')
                }, getListViewType()), {
                    'titleContainer': templates.titleContainer,
                    'actionContainer': templates.actionContainer,
                    'partialActionContainerButton': templates.partialActionContainerButton,
                    'partialActionContainerIcon': templates.partialActionContainerIcon,
                    'partialActionContainerMenu': templates.partialActionContainerMenu,
                    'partialActionContainerCheckbox': templates.partialActionContainerCheckbox,
                    'partialActionContainerDropdown': templates.partialActionContainerDropdown,
                    'filterContainer': templates.filterContainer,
                    'footerContainer': templates.footerContainer,
                    'pagination': templates.pagination,
                    'selectionContainer': templates.selectionContainer
                }));
                this.conf.container.append(gridContainer);

                gridTable = gridContainer.find('.gridTable');
                containers = actionBuilder.init(gridContainer, menuFormatter, actionElements, getSelectedRows, reservedElementClasses);
                !containers.$gridWidget && (containers.$gridWidget = gridContainer);
                !containers.$gridTable && (containers.$gridTable = gridTable);
                menuFormatter.init(containers);

                if (conf.elements.tree){
                    gridContainer.addClass("slipstream_tree_grid");

                    if (conf.elements.tree.preselection){
                        indeterminateCheckbox = new IndeterminateCheckbox();
                        var initObj = {
                            containers: containers,
                            lastSelectedRows: lastSelectedRows,
                            allRowIds: allRowIds,
                            getNumberOfRows: self.getNumberOfRows
                        };
                        indeterminateCheckbox.init(initObj);
                    }
                }

                jqGridModifier.modifyEncoder();
                gridConfigUtil.init(gridTable);
                gridSizeCalculator.init($(this.conf.container), gridContainer);

                var gridNonRecordsStateConf = {
                    gridConf: conf,
                    containers: containers,
                    gridContainer: gridContainer,
                    noResultsContainerTemplate: templates,
                    getSearchTokens: getSearchTokens,
                    getNumberOfRows: this.getNumberOfRows,
                    gridContext: this
                };
                gridNonRecordsState = new GridNonRecordsState(gridNonRecordsStateConf, actionBuilder);

//conf.elements.height = 'auto';

                var gridConfiguration = gridFormatter.formatConfiguration(conf.elements, treeFormatter, containers);

                if (conf.elements.filter) {
                    filterOptions = new FilterOptions(conf, gridContainer, menuFormatter, gridFormatter, dateFormatter, gridConfigurationHelper, searchUtility, isCollectionDataGrid);
                    containers.$searchContainer.off("slipstream-all-tokens-removed").on("slipstream-all-tokens-removed", function (event) {
                        if (conf.elements.tree) {
                            allRowIds.selectAllReset = true;
                            allRowIds.selectAllFiltered = false;
                            containers.$selectAllCheckbox.prop("checked", false);
                        }
                        if (conf.elements.filter.onClearAllTokens && typeof(conf.elements.filter.onClearAllTokens) === "function") {
                            conf.elements.filter.onClearAllTokens();
                        }
                    });
                }
                if (conf.actionEvents) {
                    actionBuilder.addActionButtonsMenus(addCustomMenuItemEvent, getIconClasses);
                }

                tooltipBuilder = new TooltipBuilder(gridContainer, conf, gridConfigurationHelper);
                initializeGroupColumn();//instantiates GroupColumn if the grid have grouped columns

                createGrid(gridConfiguration);

                setGroupColumn(); //only available if the groupColumn exists
                setColumnReorder();
                //Only when sortableColumns and groupColumn both are enabled, we need to set the groupHash in the sortableColumns class
                sortableColumns && groupColumn && sortableColumns.setGroupHash(groupColumn);

                if (conf.elements.filter) {
                    initializeFilterDrop();
                    filterOptions.enableFilter(_.bind(self.reloadGridData, self), showHideGridColumn, filterDrop);
                    containers.$searchInput = gridContainer.find('.grid_filter_input input');//todo: might not be needed
                    if (conf.elements.filter.optionMenu){
                        //Checking if optionsMenu is defined
                        addCustomMenuItemEvent(conf.elements.filter.optionMenu.customItems);
                    }
                }
                
                containers.$selectAllCheckbox = gridContainer.find('.ui-jqgrid-labels .cbox');
                if (!hasSelectAll) {
                    containers.$selectAllCheckbox.hide();
                } else if (conf.elements.tree) {
                    containers.$selectAllCheckbox.on("click", function (e) {
                        var status = $(this).is(':checked') && !allRowIds.selectAllIndeterminate ? true: false;
                        var rowIds = gridTable.jqGrid('getDataIDs');
                        !status && unselectAllTreeRows();
                        setSelectAll(gridTable[0], rowIds, status);
                        e.stopImmediatePropagation();
                    });
                }

                tooltipBuilder.addHeaderTooltips();

                if (conf.elements.refresh) {
                    var options = {onRefresh: _.bind(this.reloadGrid, this)};

                    if (_.isObject(conf.elements.refresh)) {
                        if (conf.elements.refresh.onRefresh) {
                            // ensure that the callback runs in the grid context
                            options = {onRefresh: conf.elements.refresh.onRefresh};
                        }
                        options = _.extend(conf.elements.refresh, options);
                    }

                    bindRefreshControls(options, tooltipBuilder);
                }

                inlineEditRow && inlineEditRow.init(gridContainer, containers);
                gridContainer.find('#' + tableId).on("slipstreamGrid.saveRow", function (e) {
                    saveRow();
                });
                (conf.elements.footer === false) && gridContainer.addClass("no-footer");

                isPaginationSupported && gridPagination.buildPagination(gridContainer, gridTable, _.bind(loadPage, this), _.bind(addTreeChildren, this));

                actionEvents.init(gridTable); //alternative event mechanism to jQuery events
                preferencesReconciler.persistReconciledPreferences(gridTable);
            } else {
                throwErrorMessage();
            }
            return this;
        };

        /**
         * Trigger loadCollectionData event to load page data
         * @param {Object} - page objects for the collection data
         * @inner
         */
        var loadCollectionData= function(pages){
            if (isCollectionDataGrid){
                options = pages || {
                    pages: [1],
                    pageSize: (pages && pages.pageSize) || gridTable.getGridParam('rowNum').toString()
                };

                gridTable.trigger('slipstreamGrid.loadCollectionData', options);
            }
        };

        /**
         * Sets the columns reordering
         * @inner
         */
        var setColumnReorder = function(){
            var isColReorder = (conf.elements.orderable !== false) && (conf.elements.sorting !== false) ? true: false;
            if (isColReorder){
                sortableColumns = new SortableColumns(conf, gridConfigurationHelper, templates);
                sortableColumns.init(containers);
            }
        };

        /**
         * Initializes groupColumn depending on the availability of grouped columns
         * @inner
         */
        var initializeGroupColumn = function () {
            groupColumn = new GroupColumn(gridConfigurationHelper);
            groupColumn.init();
            // check if class is not needed when none of the columns are grouped
            if (_.isUndefined(groupColumn.getGroupsWithColumns())) {
                groupColumn = undefined;
            }
        };

        /**
         * Initializes FilterDrop class depending on if dragNDrop and filter are enabled
         * @inner
         */
        var initializeFilterDrop = function(){
            if (dragNDrop){
                var isAdvanceFilter = !_.isUndefined(conf.elements.filter.advancedSearch),
                    isQueryBuilder = isAdvanceFilter && conf.elements.filter.advancedSearch.queryBuilder;
                if (isQueryBuilder){
                    filterDrop = new FilterDrop(conf, dragNDrop, multiselectCell, gridConfigurationHelper);
                }
            }
        };

        /**
         * Sets the columns that include the group property and enables features for this type of columns like show or hide columns in groups
         * @inner
         */
        var setGroupColumn = function () {
            if (groupColumn) {
                groupColumn.setGroupColumnTitle(containers, showHideGridColumn, tooltipBuilder);
                var hasColumnOrderable = !(_.isBoolean(conf.elements.orderable) && !conf.elements.orderable);
                if (conf.elements.filter || hasColumnOrderable) {
                    var groupsWithColumnName = groupColumn.getGroupsWithColumnName(),
                        columnConfigurationByName = gridConfigurationHelper.buildColumnConfigurationHashByName();
                    groupsWithColumnName && filterOptions && filterOptions.setGroupColumn(groupsWithColumnName, columnConfigurationByName);
                }
            }
        };

        function bindRefreshControls(options, tooltipBuilder) {
            var refreshControl = gridContainer.find(".gridTableFooter .refresh");

            if (typeof(options.onRefresh) == 'function') {
                if (refreshControl) {
                    refreshControl.on("click", function () {
                        options.onRefresh();
                    });
                }
            }

            if (refreshControl) {
                if (!options.tooltipText) {
                    options.tooltipText = i18n.getMessage('default_grid_refresh_tooltip')
                }

                tooltipBuilder.addRefreshTooltip(options.tooltipText, refreshControl);
            }
        };

        /**
         * Unselect all rows in a tree grid and sets the allRowIds flags accordingly
         * @inner
         */
        var unselectAllTreeRows = function () {
            gridTable.find('tr .tree_custom_checkbox input').each(function () {
                this.checked = false;
            });
            resetSelectedRows();
            allRowIds.selectAllEnabled = false;
            allRowIds.selectAllReset = false;
            if (indeterminateCheckbox){
                indeterminateCheckbox.resetIndeterminateState();
                indeterminateCheckbox.updateCheckboxState(getSelectedRows());
            }
        };

        var addNewRowData = function (rowId, data, location, sourceRowId) {
            lastSelectedRows.isRowsInDomSetCompleted = false; //afterInsertRow callback is called but as a part of the current grid page
            sourceRowId ? gridTable.jqGrid('addRowData', rowId, data, location, sourceRowId) : gridTable.jqGrid('addRowData', rowId, data, location);
            tooltipBuilder && tooltipBuilder.addRowTooltips(gridTable, originalRowData, rowId);
            var $newRow = gridTable.find("#"+rowId);
            setGridHighlightStyles($newRow);
        };

        /**
         * Gets the number of records showed in the grid
         * @returns {number} the number of record in the grid
         */
        this.getNumberOfRows = function () {
            var records;
            if (gridTable) {
                records = gridTable.getGridParam('records');
            } else {
                throw new Error(errorMessages.noGrid);
            }
            return records;
        };

        /**
         * Updates the status of the action buttons of the grid widget. It resets current row selection and defaults to false status for the elements not defined in the custom status
         * @param {Object} customStatus - Object with the set of key/status for each action icon, button and split buttons
         * @param {Boolean} hardReset - Resets the icon status to only the states defined in the customStatus (otherwise, it disables it) and resets the current row selection
         */
        this.updateActionStatus = function (customStatus, hardReset) {
            if (gridTable) {
                if (!_.isEmpty(customStatus)) {
                    if (hardReset) {
                        actionElements.originalStatus = _.extend({}, actionElements.status);
                        if (getSelectedRows().numberOfSelectedRows > 0) {
                            gridTable.jqGrid('resetSelection');
                            gridTable.find('tr.selectedRow').removeClass('selectedRow');
                            resetSelectedRows(null, true);
                        }
                        setActionStatus(customStatus, true);
                    } else {
                        setActionStatus(customStatus, true, getSelectedRows(), true);
                    }
                } else {
                    console.log("Custom status Object is empty");
                }
            } else {
                throw new Error(errorMessages.noGrid);
            }
        };

        /**
         * Adds a row in the Grid widget
         * @param {Object} data - data of the new row
         * @param {string} location - location of the new row
         */
        this.addRow = function (data, location) {
            if (gridTable) {
                if (conf.elements.tree) {
                    var treeData = dataFormatter.formatTreeJSONData(conf, data);
                    addChildren(null, treeData);
                } else {
                    var rowId;
                    if (!location)
                        location = (conf.elements.createRow && conf.elements.createRow.addLast) ? 'last' : 'first';
                    if (conf.elements.jsonId)
                        rowId = data[conf.elements.jsonId];
                    if (typeof(rowId) == "undefined")
                        rowId = $.jgrid.randId();

                    addNewRowData(rowId, data, location);
                    (allRowIds.selectAllEnabled || allRowIds.selectAllFiltered) && self.toggleRowSelection([rowId], "selected");
                    gridNonRecordsState.displayNoResultMessage(data);
                }
                updateGridSelectionCount();
            } else {
                throw new Error(errorMessages.noGrid);
            }
        };

        /**
         * Adds all the rows that will be added during virtual scrolling or pagination and that represents one page
         * @param {Object} data - data of the new row
         * @param {Object} page - parameters of the page: numberOfPage, totalPages, totalRecords
         */
        this.addPageRows = function (data, page) {
            if (gridTable) {
                if (!_.isEmpty(data)) {
                    var numberOfPage = (page && page.numberOfPage) || gridTable.getGridParam('page'),
                        originalData;
                    if (typeof(numCollectionRecords) == "undefined") {
                        numCollectionRecords = data.length;
                    }
                    gridTable.setGridParam({datatype: 'local'});
                    conf.elements.tree && gridTable.setGridParam({treeANode: -1});//jqGrid keeps track of the last opened node, but when a new page is loaded, that node is not relevant. Since jqGrid won't find the node, then it won't be able to populate the new page. To avoid this issue (PR: 1388109), the treeANode needs to be reset.

                    gridTable[0].addJSONData({
                        page: numberOfPage,
                        total: (page && page.totalPages) || data.length,
                        records: (page && page.totalRecords) || conf.elements.jsonRecords(data),
                        rows: data,
                        id: conf.elements.jsonId
                    });
                    if (conf.elements.tree) {
                        cacheTreeGridRawData(data);
                        inititalizeTreeRows(gridTable, data, conf.elements);
                    }
                    console.log("added data on page: " + numberOfPage);
                    tooltipBuilder && tooltipBuilder.addContentTooltips(gridTable, originalRowData);
                } else {
                    console.log("data for the grid is not available");
                }
                gridNonRecordsState.displayNoResultMessage(data);
                hasMultipleCellContent && gridFormatter.adjustMultipleCellRow(gridTable);
                updateGridSelectionCount();
                columnSwitchOnHover && columnSwitchOnHover.toggleSwitchCol(gridContainer, null, null, true);
            } else {
                throw new Error(errorMessages.noGrid);
            }
        };

        /**
         * Delete a row(s) in the Grid widget
         * @param {String/Array} rowId
         * @param {Boolean} - grid widget should reset all selections. Default: true
         */
        this.deleteRow = function (rowId, resetSelection) {
            if (gridTable) {
                deleteRows(rowId, resetSelection);
            } else {
                throw new Error(errorMessages.noGrid);
            }
        };

        /**
         * Edits a row in the Grid widget based on the row data
         * @param {Object} originalRow - data of the original row
         * @param {Object} updatedRow - data of the new row
         */
        this.editRow = function (originalRow, updatedRow) {
            if (gridTable) {
                if (conf.elements.jsonId) {
                    var originalId = originalRow[conf.elements.jsonId],
                        $row = gridTable.find('#' + originalId),
                        $moreCell = gridFormatter.getExpandedMoreCell($row);

                    //By default, jqGrid will display collapsed content after updates. Make sure the row is collapsed when the row is expanded. 
                    $moreCell && $moreCell.click();

                    gridTable.jqGrid('setRowData', originalId, updatedRow);
                    tooltipBuilder && tooltipBuilder.addRowTooltips(gridTable, originalRowData, originalId);
                    $row.data("jqgrid.record_data", updatedRow);
                    lastSelectedRows.rowsInDom[originalId] && (lastSelectedRows.rowsInDom[originalId].rowData = reformatRow(gridTable.jqGrid('getRowData', originalId)));
                    
                    //Make sure the row remains expanded after updates
                    $moreCell && $moreCell.click();
                } else {
                    throw new Error(errorMessages.noUniqueId);
                }
            } else {
                throw new Error(errorMessages.noGrid);
            }
        };

        /**
         * Switches the row view from view mode to edit mode
         * @param {String} rowId - id of the row that should be edited
         */
        this.addEditModeOnRow = function (rowId) {
            if (gridTable) {
                updateRow(rowId);
                gridTable.find('#' + rowId).addClass("selectedRow");
            } else {
                throw new Error(errorMessages.noGrid);
            }
        };

        /**
         * Switches the row view from edit mode to view mode
         * @param {String} rowId - id of the row that should go to view mode
         */
        this.removeEditModeOnRow = function (rowId) {
            if (gridTable) {
                if (typeof (rowId) == 'undefined')
                    rowId = lastSelectedRows.tempLastSelectedRowId;
                if (rowId) {
                    if (isValidUpdatedRow(rowId)) {
                        saveRow(rowId);
                        lastSelectedRows.tempLastSelectedRowId = null;
                        updateActionStatus(getSelectedRows());
                        return getSelectedRows();
                    }
                } else {
                    console.log("a valid row id was not found");
                }
            } else {
                throw new Error(errorMessages.noGrid);
            }
        };

        /**
         * Reset all selections and update the footer
         * @param {Object} gridTable
         * @param {Boolean} reset value: true or false
         */
        var resetSelections = function ($gridTable, reset) {
            resetSelectedRows($gridTable[0], reset);
            updateGridSelectionCount();
            $gridTable.jqGrid('resetSelection');
        };

        /*
         * Updates the count of total rows and selected rows in Grid.
         */
        var updateGridSelectionCount = function () {

            var selections = self.getSelectedRows(true); //triggers row selection event even if footer is set to false

            // Hide or show selection button based on current selections
            var changeSelectionButtonDisplay = function(selectionCount, $selectionContainer) {
                if(selectionCount > 0){
                    $selectionContainer.show();
                }
                else {
                    $selectionContainer.hide();
                }
            };

            //Attach tooltip with selection button in Grid header
            var initSelectionTooltip = function() {
                if(_.isObject(conf.elements.showSelection) && !containers.$selectedHeader.hasClass('tooltipstered')) {
                    tooltipBuilder.showSelectionTooltip(containers.$selectedHeader, getSelectedRows);
                }
            };
            if ((_.isBoolean(conf.elements.footer) && conf.elements.footer) || _.isUndefined(conf.elements.footer) || (!_.isEmpty(conf.elements.footer))) {
                if (!containers.$gridTableFooter) {
                    containers.$gridTableFooter = gridContainer.find('.gridTableFooter');
                }
                if (!containers.$footerTotal) {
                    containers.$footerTotal = containers.$gridTableFooter.find('.totalRows');
                }

                var rows = self.getNumberOfRows();
            
                if (_.isObject(conf.elements.footer) && _.isFunction(conf.elements.footer.getTotalRows)) {
                    rows = conf.elements.footer.getTotalRows();
                }
                if (rowSelectionEnabled) {
                    if (!containers.$selectedHeader) {
                        containers.$selectedHeader = gridContainer.find('.selection-count');
                        containers.$selectedRowsCount = containers.$selectedHeader.find('.selection-count-number');
                    }
                    if(conf.elements.showSelection !== false) {

                        initSelectionTooltip();

                        var selectionCount;
                        if (isLocalData) {
                            if (gridTable.find('tr').length == 1) {
                                    selectionCount = 0;
                            } else {
                                    selectionCount = selections.selectedRowsDom.length;
                                    containers.$selectedRowsCount.html(selectionCount);
                            }
                        } else {
                            selectionCount = selections.numberOfSelectedRows.toString();
                            containers.$selectedRowsCount.html(selectionCount);
                        }
                        changeSelectionButtonDisplay(selectionCount, containers.$selectedHeader)
                    }
                }
                containers.$footerTotal.html(rows.toString());
            }
        };

        /**
         * Get the row and table DOM element for some row id
         * @param {String} rowId - id of the row that should go on edit mode
         * @return an Object with the jQuery Object $row and the jQuery Object $table
         * @inner
         */
        var getRowAndTable = function (rowAndTables, rowId) {
            var $row, rowId, $table, $rowAndTable;
            if (!_.isEmpty(rowAndTables)) {
                $rowAndTable = rowAndTables[0]; //takes only the first row since edition happens on one row at a time
                $table = $rowAndTable['$table'];
                $row = $rowAndTable['$row'];
                rowId = $row.attr('id');
            } else {
                $row = gridContainer.find('#' + rowId);
                $table = $row.closest('table');
            }
            return {
                "rowId": rowId,
                "$row": $row,
                "$table": $table
            }
        };

        /**
         * Updates a row in the Grid widget based on the selected row.
         * The edition can happen on an overlay (by default) or inline (editRow,showOverlay parameter set to true)
         * @param {String} rowId - <optional> id of the row that should go on edit mode
         * @param {String} iCol - <optional> id of the column that is selected for editing and setting the focus to the cell
         * @inner
         */
        var updateRow = function (rowId, iCol) {
            var showOverlay = (conf.elements.editRow && (conf.elements.editRow.showInline || conf.elements.editRow.onEdit)) ? false : true;
            var $row, $rowTable, $rowAndTable;

            /**
             * Updates editable property of a column so inline editing is restricted as per the cellHash.
             * @param {Object} cellHash - hash with the column name and if editable should be available (true) or false otherwise
             * @param {boolean} set - <optional> true to set the original hash of column name and editable boolean
             * @returns {Object} originalCellHash - hash before updates
             * @inner
             */
            var restrictCells = function (cellHash, set) {
                var originalCellHash = {},
                    columnName, isEditable;
                for (columnName in cellHash) {
                    isEditable = cellHash[columnName];
                    if (_.isBoolean(isEditable)) {
                        if (set) {
                            originalCellHash[columnName] = $rowTable.jqGrid('getColProp', 'name').editable;
                        }
                        $rowTable.jqGrid('setColProp', columnName, {editable: isEditable});
                    }
                }
                return originalCellHash;
            };

            if (rowId) {
                $rowAndTable = getRowAndTable(undefined, rowId);
            } else {
                var selectedRows = getSelectedRows(),
                    rowAndTables = selectedRows['$rowAndTable'];
                if (rowAndTables.length == 0) {
                    rowId = selectedRows.selectedRowIds[0];
                }
                $rowAndTable = getRowAndTable(rowAndTables, rowId);
            }
            $rowTable = $rowAndTable['$table'];
            $row = $rowAndTable['$row'];
            rowId = $rowAndTable['rowId'];

            var originalRow = $rowTable.jqGrid('getRowData', rowId),
                isTreeParentRow = conf.elements.tree ? !gridConfigurationHelper.isTreeLeaf(originalRow) : undefined,
                rawRow = conf.elements.tree ? originalRowData[gridConfigurationHelper.escapeSpecialChar(rowId)] : $row.data('jqgrid.record_data');
            if (showOverlay) {
                originalRow.slipstreamGridWidgetRowId = rowId;
                var defaultObj = {
                    'originalRow': reformatRow(originalRow),
                    'originalData': rawRow
                };
                triggerActionEvent("updateEvent", defaultObj);
            } else {
                var onBeforeEdit = true;
                if (inlineEditRow && _.isFunction(conf.elements.editRow.onBeforeEdit)) {
                    onBeforeEdit = conf.elements.editRow.onBeforeEdit(rowId, rawRow, reformatRow(originalRow), isTreeParentRow);
                }
                //put the row in the edit mode if the function returns does not return false
                if (onBeforeEdit) {
                    lastSelectedRows.tempLastSelectedRowId = rowId;
                    $row.addClass('selectedRow');

                    if (conf.elements.editRow.onEdit) { //row creation on user defined view to be available when the onEdit callback is invoked
                        var onSuccess = function (data) {
                            data && self.editRow(rawRow, data);
                        };
                        var rowData = {
                            "rowId": rowId,
                            "originalRow": reformatRow(originalRow),
                            "originalData": rawRow
                        };
                        conf.elements.editRow.onEdit(self.getGridHeaderLayout($rowTable), rowData, onSuccess);
                    } else {
                        var isRestrictedEdition = _.isObject(onBeforeEdit),
                            focusCol = iCol || false,
                            originalCellHash;
                        if (isRestrictedEdition) { //restrict cells
                            originalCellHash = restrictCells(onBeforeEdit, true);
                        }
                        $rowTable.jqGrid('editRow', rowId, {keys: false, focusField: focusCol});
                        inlineEditRow.addSaveButton($row, $rowTable,'update', isValidUpdatedRow, saveRow, cancelRow);
                        addCellEventHandlers($row, $rowTable);
                        isRestrictedEdition && restrictCells(originalCellHash);//restore cell edition
                    }

                    notifyOnEditMode($row, originalRow);
                    updateActionStatus(getSelectedRows());
                } else {
                    console.log('row is not editable because onBeforeEdit returned false');
                }
            }
        };

        /**
         * Sends the "gridRowOnEditMode" event when a row has switched to edit mode
         * @param {Object} $row - row on edit mode
         * @param {Object} originalRow - values associated with the row
         * @inner
         */
        var notifyOnEditMode = function ($row, originalRow) {
            var rowId = $row.attr('id');
            var editModeRow = {
                currentRowData: self.conf.elements.tree ? originalRowData[rowId] : $row.data('jqgrid.record_data'),
                currentRowFields: getRowCells($row, true),
                currentRow: originalRow,
                row: $row[0],
                integratedWidgets: gridFormatter.getIntegratedWidgetsOnEditMode(),
                operation: {type: "update"}
            };
            gridTable.trigger("gridRowOnEditMode", editModeRow);
        };

        /**
         * Updates the status of a row toggling from enabled (true) to disabled (false).
         * @param {Object} status - status of the row: 'enable' or otherwise disabled.
         * @param {string} statusColumn - name of the column in the grid that holds the status
         * @inner
         */
        var updateRowStatus = function (status, statusColumn) {
            var $rowAndTable, $rowTable, $row, rowId, i,
                updatedRows = [], rowTables = [];
            var selectedRowsObj = getSelectedRows();
            var $rowAndTables = selectedRowsObj['$rowAndTable'];

            for (i = 0; i < $rowAndTables.length; i++) {
                $rowAndTable = $rowAndTables[i];
                $rowTable = $rowAndTable['$table'];
                $row = $rowAndTable['$row'];
                rowId = $row.attr('id');
                if (status == 'enable') {
                    $row.removeClass('rowDisabled');
                    $rowTable.jqGrid('setCell', rowId, statusColumn, false);
                } else {
                    $row.addClass('rowDisabled');
                    $rowTable.jqGrid('setCell', rowId, statusColumn, true);
                }
                $row.removeClass('selectedRow');
                updatedRows.push(reformatRow($rowTable.jqGrid('getRowData', rowId)));
                if (rowTables.indexOf($rowTable) < 0) {//gathers subgrids that were used during selection
                    rowTables.push($rowTable);
                }
            }

            resetSelectedRows();

            for (var i = 0; i < rowTables.length; i++) {
                rowTables[i].jqGrid('resetSelection');
            }
            addSelectedRowData(selectedRowsByTables);

            triggerActionEvent("statusEvent", {"updatedRows": updatedRows});
        };

        /**
         * Deletes rows in the Grid widget
         * @param {String/Array} rowId
         * @param {Boolean} - grid widget should reset all selections. Default: true
         * @inner
         */
        var deleteRows = function (rowIds, resetSelection) {
            var $rowAndTable, $rowTable, rowId, i,
                selectedRowsObj = getSelectedRows(),
                hasSubgrid = (typeof(conf.elements.subGrid) === 'undefined') ? false : true,
                deletedRows = [];

            var deleteRow = function ($rowTable, rowId) {
                var tableId = $rowTable.attr('id');
                if (conf.elements.tree) {
                    //Have to do it here in order to update selectedRowsByTables and allRowIds because treeGrid setRowStatus is not reliable
                    selectedRowsByTables[tableId] && delete selectedRowsByTables[tableId][rowId];
                    indeterminateCheckbox && indeterminateCheckbox.setIndeterminateState(rowId);
                    allRowIds.selectedRowIds && delete allRowIds.selectedRowIds[rowId];
                    (allRowIds.selectAllEnabled || allRowIds.selectAllFiltered || allRowIds.selectAllReset) && delete allRowIds.unselectedRowIds[rowId];
                    $rowTable.find('#' + rowId).find('.treeclick.tree-minus').click(); //tree grid collapse node method from the library doesn't work, but the node needs to be closed to delete a row;
                    $rowTable.jqGrid('delTreeNode', rowId);
                } else {
                    setSelectedRows($rowTable[0], rowId, false);
                    $rowTable.jqGrid('delRowData', rowId);
                }
                if (lastSelectedRows.tempLastSelectedRowId == rowId) {
                    lastSelectedRows.tempLastSelectedRowId = null;
                }
            };


            if (!hasSubgrid) {
                //TreeGrid, SimpleGrid, GroupGrid
                if (rowIds) {
                    var rowId;

                    rowIds = _.isString(rowIds) ? [rowIds] : _.isNumber(rowIds) ? [rowIds.toString()] : rowIds;
                    for (i = 0; i < rowIds.length; i++) {
                        var deletedRowData = {};

                        rowId = rowIds[i];
                        if (_.isEmpty(gridTable.jqGrid('getRowData', rowId))) {
                            var jsonId = conf.elements.jsonId || 'id';
                            deletedRowData[jsonId] = rowId;
                        } else {
                            deletedRowData = gridTable.jqGrid('getRowData', rowId);
                        }
                        deletedRows.push(reformatRow(deletedRowData));
                        deleteRow(gridTable, rowId);
                    }
                } else {
                    var $rowAndTables = selectedRowsObj['$rowAndTable'];

                    for (i = 0; i < $rowAndTables.length; i++) {
                        $rowAndTable = $rowAndTables[i];
                        $rowTable = $rowAndTable['$table'];
                        rowId = $rowAndTable['$row'].attr('id');
                        deleteRow($rowTable, rowId);
                    }
                    deletedRows = selectedRowsObj.selectedRows;
                }
            } else {
                //NestedGrid

                //We don't support dynamically deleteRows for nestedGrid
                if (rowId) {
                    return;
                }

                for (var nestedTableId in selectedRowsByTables) {
                    var nestedTable = selectedRowsByTables[nestedTableId];
                    $rowTable = gridContainer.find('#' + nestedTableId);
                    for (rowId in nestedTable) {
                        deleteRow($rowTable, rowId);
                    }
                }
                deletedRows = selectedRowsObj.selectedRows;
            }

            if (resetSelection !== false || self.getNumberOfRows() == 0) {
                resetSelectedRows(gridTable[0], true);
                selectedRowsByTables = {}; //Have to reset the hashtable if it is treeGrid
                lastSelectedRows.tempLastSelectedRowId = null;
            }

            addSelectedRowData(selectedRowsByTables);
            triggerActionEvent("deleteEvent", {
                "deletedRows": deletedRows,
                "selectedRows": selectedRowsObj,
                "isSelectAll": allRowIds.selectAllEnabled || allRowIds.selectAllReset
            });

            updateActionStatus(getSelectedRows());

            //Unselect selectAll checkbox when selectAll is checked
            if (containers.$selectAllCheckbox && containers.$selectAllCheckbox.is(':checked')) containers.$selectAllCheckbox.prop('checked', false);

            // check if there are any records after deletion - show appropriate container for 'no data' message
            gridNonRecordsState.displayNoResultMessage();
            updateGridSelectionCount();
        };

        /**
         * Test if a row is a tree node
         * @param {Object} $row - row that could be a node in a tree grid
         * @param {Object} $table - jQuery object with the table that contains the row
         * @param {Boolean} isEditMode - true if the row is on edit mode
         * @inner
         */
        var isTreeNode = function (rowId, $rowTable, isEdit) {
            var rowData = isEdit && inlineEditRow ? originalRowData[rowId] : $rowTable.jqGrid('getRowData', rowId);
            var isLeaf = rowData[conf.elements.tree.leaf || 'leaf'] == 'true' ? true : false;
            return !isLeaf;
        };

        /**
         * Copy a row in the Grid widget based on the selected row
         * @inner
         */
        var copyRow = function ($row) {
            var $rowTable = $row.closest('table'); //assumes no multiple copies from different tables
            var selectedRowsObj = getSelectedRows($rowTable, $row);
            copiedRows = selectedRowsObj.selectedRows;
            _.extend(selectedRowsObj, {
                copiedRow: copiedRows,
                isRowCopied: true
            });
            addSelectedRowData(selectedRowsObj, $row);
            triggerActionEvent("copyEvent", selectedRowsObj);
        };

        /**
         * Gets the selected rows either as an Array of row data or an object with dom elements, selectedRowIds, selectedRows and other parameters.
         * @param {isObject} isSelectRowsObject - Defines if the output of getSelectedRows is an Object (true) with all the parameter available for the selected rows; otherwise, the output of the method will be an Array with the data for each row.
         * @returns {Array} All selected rows
         */
        this.getSelectedRows = function (isSelectRowsObject) {
            var selectedRows;
            if (gridTable) {
                var selectedRows = isSelectRowsObject ? getSelectedRows() : getSelectedRows().selectedRows;
                triggerActionEvent("selectedEvent", selectedRows);
            } else {
                throw new Error(errorMessages.noGrid);
            }
            return selectedRows;
        };

        /**
         * Checks whether an id exists in a row id array
         * @param {Array} rowIdArray - Array with the ids of the rows
         * @param {String/Number} rowIdentifier - The row id which needs to be checked
         */
        var hasRowIdInArray = function(rowIdArray, rowIdentifier) {
            return (rowIdArray.indexOf(rowIdentifier.toString())!=-1);
        };

        /**
         * Toggles the status of rows; if the rows are selected, then they will be unselected and vice versa
         * @param {Array/String} rowIds - Array or String with the ids of the rows that need to be selected or unselected
         * @param {String} status - Optional. 'selected' will set all rows on selected and 'unselected' will unselect all rows
         */
        this.toggleRowSelection = function (rowIds, status) {
            if (gridTable) {
                if (rowIds) {
                    var i, rowId, $row, $rowTable, selRowIds, isRowSelected, isCurrentRowSelected, isRowInDom, rowData, isLastRow,
                        selectedRows = getSelectedRows(),
                        gridTableId = gridTable.attr('id'),
                        rowIdsLength = rowIds.length;

                    if (allRowIds.selectAllEnabled || allRowIds.selectAllReset)
                        selectedRows = selectedRows.allRowIds;
                    else
                        selectedRows = selectedRows.selectedRowIds;

                    if (_.isEmpty(selectedRowsByTables[gridTableId]))
                        selectedRowsByTables[gridTableId] = {};

                    switch (status) { //normalizes the status from selected to isRowSelected
                        case 'selected':
                            isRowSelected = true;
                            break;
                        case 'unselected':
                            isRowSelected = false;
                            break;
                    }

                    if (_.isString(rowIds)) {
                        rowIds = rowIds.split();
                    }
                    var selectTreeRow = function (id, $checkbox, rowTable) {
                        if ($checkbox.length) {
                            // Sending the parameter using data as the arguments are not passing using trigger
                            $checkbox.data("isPreselectingChildren",true).trigger("click"); //trees with preselection enabled gets all children selected after this parent selection
                            $checkbox.removeData("isPreselectingChildren");
                        } else {
                            setSelectedRows(rowTable, id, true);
                        }
                        columnSwitchOnHover && columnSwitchOnHover.toggleSwitchCol(gridContainer, true);
                    };

                    var unselectTreeRow = function (id, $checkbox, rowTable) {
                        if ($checkbox.length) {
                            // Sending the parameter using data as the arguments are not passing using trigger
                            $checkbox.data("isPreselectingChildren",true).trigger("click");
                            $checkbox.removeData("isPreselectingChildren");
                        } else {
                            $row.removeClass("selectedRow");
                            setSelectedRows(rowTable, id, false);//trees with preselection enabled gets all children unselected after this parent unselection
                        }
                        indeterminateCheckbox && indeterminateCheckbox.setIndeterminateState(rowId);
                        columnSwitchOnHover && columnSwitchOnHover.toggleSwitchCol(gridContainer, false);
                    };

                    /**
                     * Sets the allRowsIds hashes as per if the row is toggled from selected to unselected and visceversa
                     * @param {String} rowId - Id of the row to be toggled
                     * @param {String} gridTableId - Id of the table where the toggled row is located
                     * @param {Boolean} isSelected - indicates final state of the row, true if it was toggled unselected to selected or false otherwise
                     * @inner
                     */
                    var setSelectedRowHash = function (rowId, gridTableId, isSelected) {
                        if (isSelected) {
                            selectedRowsByTables[gridTableId][rowId] = {};
                            if (allRowIds.selectAllEnabled || allRowIds.selectAllReset) {
                                allRowIds.selectedRowIds[rowId] = true;
                                delete allRowIds.unselectedRowIds[rowId];
                            }
                        } else {
                            delete selectedRowsByTables[gridTableId][rowId];
                            if (allRowIds.selectAllEnabled || allRowIds.selectAllReset) {
                                delete allRowIds.selectedRowIds[rowId];
                                allRowIds.unselectedRowIds[rowId] = true;
                            }
                        }
                        if (allRowIds.selectAllEnabled) { //a row that is toggled when select all is enabled will activate the selectAllReset state
                            allRowIds.selectAllReset = true;
                        }
                    };

                    for (var i = 0; i < rowIds.length; i++) {
                        isLastRow = i == rowIdsLength - 1 ? true : false;
                        rowId = rowIds[i];
                        $row = lastSelectedRows.rowsInDom[rowId];

                        if (lastSelectedRows.rowsInDom[rowId]) {
                            isRowInDom = true;
                            $row = lastSelectedRows.rowsInDom[rowId].$row;
                            $rowTable = lastSelectedRows.rowsInDom[rowId].$table;
                        } else {
                            isRowInDom = false;
                            $rowTable = gridTable;
                        }

                        if (conf.elements.tree) { //recreates simple grid selection model since it is not available in the tree grid

                            if (!_.isEmpty(selectedRowsInTree) && !_.isUndefined(selectedRowsInTree[rowId])) {
                                isCurrentRowSelected = true;
                            } else {
                                isCurrentRowSelected = false;
                            }

                            var $checkbox = getTreeRowCheckbox(rowId);
                            if (typeof(status) == "undefined") {
                                if (isCurrentRowSelected) {
                                    unselectTreeRow(rowId, $checkbox, $rowTable[0], $row);
                                } else {
                                    selectTreeRow(rowId, $checkbox, $rowTable[0]);
                                }
                            } else {
                                if (isRowSelected && !isCurrentRowSelected) {
                                    selectTreeRow(rowId, $checkbox, $rowTable[0]);
                                } else if (!isRowSelected && isCurrentRowSelected) {
                                    unselectTreeRow(rowId, $checkbox, $rowTable[0], $row);
                                }
                            }

                        } else {
                            isRowSelected = hasRowIdInArray(selectedRows, rowId);
                            selRowIds = $rowTable.jqGrid("getGridParam", "selarrrow");
                            switch (status) {
                                case 'selected':
                                    if (!isRowSelected) {
                                        if (isRowInDom) {
                                            if (!hasRowIdInArray(selRowIds, rowId))
                                                $rowTable.jqGrid('setSelection', rowId, false);
                                            setSelectedRows($rowTable[0], rowId, true);
                                        } else {
                                            if (isLastRow) {
                                                setSelectedRows($rowTable[0], rowId, true);
                                            } else {
                                                setSelectedRowHash(rowId, gridTableId, true);
                                            }
                                        }
                                    }
                                    break;
                                case 'unselected':
                                    if (isRowSelected) {
                                        if (isRowInDom) {
                                            $row.removeClass('selectedRow');
                                            if (hasRowIdInArray(selRowIds, rowId))
                                                $rowTable.jqGrid('setSelection', rowId, false);
                                            setSelectedRows($rowTable[0], rowId, false);
                                        } else {
                                            if (isLastRow) {
                                                setSelectedRows($rowTable[0], rowId, false);
                                            } else {
                                                setSelectedRowHash(rowId, gridTableId, false);
                                            }
                                        }
                                    }
                                    break;
                                default:
                                    if (isRowInDom) {
                                        if (isRowSelected) {
                                            $row.removeClass("selectedRow");
                                            if (!hasRowIdInArray(selRowIds, rowId))
                                                $rowTable.jqGrid('setSelection', rowId, false);
                                        }
                                        else
                                            $row.addClass("selectedRow");
                                        $rowTable.jqGrid('setSelection', rowId, false);
                                        setSelectedRows($rowTable[0], rowId, !isRowSelected);
                                    } else {
                                        if (isRowSelected) {
                                            setSelectedRowHash(rowId, gridTableId, false); //toggle row selection hash from selected to unselected
                                        } else {
                                            setSelectedRowHash(rowId, gridTableId, true); //toggle row selection hash from unselected to selected
                                        }
                                        if (isLastRow) {
                                            setSelectedRows($rowTable[0], rowId, !isRowSelected);
                                        }
                                    }
                            }
                        }
                    }
                }
            } else {
                throw new Error(errorMessages.noGrid);
            }
        };

        /**
         * Creates an instance of a class if it is not already available
         * @param {Object} classVariable - variable that keeps a reference if the intance of a class is already available
         * @param {Object} ClassName - class that will be used to create an instance
         * @param {Object} classConf - configuration to be passed in the class constructor
         * @inner
         */
        var instantiateClass = function (classVariable, ClassName, classConf) {
            var tempClassVariable;
            if (_.isUndefined(classVariable)) {
                tempClassVariable = new ClassName(classConf);
                return tempClassVariable;
            }
            return classVariable;
        };

        /**
         * Expands all parents in a grid. Available for tree grid, group grid and nested grid.
         */
        this.expandAllParentRows = function (){
            if (gridTable) {
                rowParentToggler = instantiateClass(rowParentToggler, RowParentToggler, conf);
                rowParentToggler.expandAllParentRows(gridTable);
            } else {
                throw new Error(errorMessages.noGrid);
            }
        };

        /**
         * Collapses all parents in a grid. Available for tree grid, group grid and nested grid.
         */
        this.collapseAllParentRows = function (){
            if (gridTable) {
                rowParentToggler = instantiateClass(rowParentToggler, RowParentToggler, conf);
                rowParentToggler.collapseAllParentRows(gridTable);
            } else {
                throw new Error(errorMessages.noGrid);
            }
        };

        /**
         * Toggles the "select all" checkbox of the grid
         */
        this.toggleSelectAllRows = function () {
            if (gridTable) {
                containers.$selectAllCheckbox.trigger('click');
            } else {
                throw new Error(errorMessages.noGrid);
            }
        };


        /**
         * Get all available rows of a simple grid
         * @returns {Object} All selected rows
         */
        this.getAllVisibleRows = function () {
            var allVisibleRows = [];
            if (gridTable) {
                var allRows = gridTable.jqGrid('getRowData');
                for (var rowId in allRows) {
                    allVisibleRows.push(reformatRow(allRows[rowId]));
                }
            } else {
                throw new Error(errorMessages.noGrid);
            }
            return allVisibleRows;
        };

        /**
         * Reload the grid according to a new configuration defined by the user
         * Note: When the datatype is local, grid widget only supports ONE value search. It means the previous search would be dismissed.
         * @param {Array} preDefConf - Array of strings tokens
         */
        this.setSearch = function (preDefConf) {
            if (errorMessages.hasRequiredParameters) {
                conf.search = preDefConf;
            } else {
                throw new Error(errorMessages.noGrid);
            }
        };

        /**
         * Reload the grid according to a new url provided as a result of a search of a value in the grid data
         * @param {String/Array} value - value(s) to be searched
         * @param {Boolean} isInternal - indicates if the search was started by the search area provided by the grid widget (true).
         */
        this.search = function (value, isInternal) {
            if (gridTable) {
                var isExternalPresearch = _.isBoolean(isInternal) ? !isInternal : true;
                filterOptions.search(value, isExternalPresearch);
            } else {
                throw new Error(errorMessages.noGrid);
            }
        };

        /**
         * Clear all search tokens
         */
        this.clearSearch = function () {
            if (gridTable) {
                filterOptions.removeAllSearchTokens();
            } else {
                throw new Error(errorMessages.noGrid);
            }
        };

        /**
         * Gets the search tokens currently applied to the grid
         * @returns {Array} All tokens applied to the grid
         */
        this.getSearchTokens = function () {
            if (conf.elements.filter) {
                var tokens = getSearchTokens();
                if (_.isUndefined(tokens) || _.isEmpty(tokens)) {
                    tokens = conf.search;
                }
                return tokens;
            } else {
                throw new Error(errorMessages.noFilter);
            }
        };

        /**
         * Filters the grid according to url
         * @param {String} url - API that contains the data for the grid
         * @param {String} isSimpleGrid - indicates if the table should be showed as simple grid or nested grid. If it's set to true, the table will be showed as simpled grid.
         */
        this.filterGrid = function (url, isSimpleGrid) {
            if (gridTable) {
                gridTable.jqGrid('GridUnload');
                gridTable = gridContainer.find('.gridTable');
                var filteredConfiguration = isSimpleGrid ? gridFormatter.formatFilterConfiguration(conf, url) : conf.elements;
                var gridConfiguration = gridFormatter.formatConfiguration(filteredConfiguration, treeFormatter, containers);

                createGrid(gridConfiguration);
            } else {
                throw new Error(errorMessages.noGrid);
            }
        };

        /**
         * Provides the instance of integrated widget
         * @returns {Object} Integrated Search Widget
         */
        this.getSearchWidgetInstance = function () {
            if (conf.elements.filter) {
                var searchWidgetInstance = filterOptions.getSearchWidgetInstance();
                if (typeof(searchWidgetInstance) != "undefined") {
                    return searchWidgetInstance;
                } else {
                    throw new Error(errorMessages.noSearchWidgetInstance);
                }
            } else {
                throw new Error(errorMessages.noFilter);
            }
        };

        /**
         *  Get the grid's current vertical scroll position.
         *
         *  @returns {Integer} The grid's vertical scroll position.  This is the number of pixels that
         *  are hidden from view above the grid's scrollable area.
         */
        this.getScrollPosition = function () {
            return $(gridTable[0].grid.bDiv).scrollTop();
        };

        /**
         *  Set the grid's vertical scroll position.
         *
         *  @param {Integer} The grid's vertical scroll position.  This is the number of pixels that
         *  are hidden from view above the grid's scrollable area.
         */
        this.setScrollPosition = function(position) {
            setTimeout(function() {
                $(gridTable[0].grid.bDiv).scrollTop(position);
            }, 0);
        };

        /**
         * Updates the grid configuration on properties related to the grid data; for example: url, jsonId, jsonRecords, jsonRoot. It allows to switch between simple grid and group grid. It also allows to update the tree grid configuration (conf.elements.grid)
         * Once the grid configuration is updated, the grid is reloaded with the new configuration
         * @param {Object} options - new grid configuration applied to conf.elements
         * @inner
         */
        this.updateGridConfiguration = function (options) {
            var gridParam = gridTable.jqGrid("getGridParam"),
                readerParam = gridParam.dataType == "local" ? gridParam.localReader : gridParam.jsonReader,
                key, option;
            for (key in options) {
                option = options[key];
                switch (key) {
                    case "jsonRoot":
                        conf.elements.jsonRoot = option;
                        readerParam.root = option;
                        break;
                    case "jsonId":
                        conf.elements.jsonId = option;
                        readerParam.id = option;
                        break;
                    case "jsonRecords":
                        conf.elements.jsonRecords = option;
                        readerParam.records = option;
                        break;
                    case "url":
                        conf.elements.url = option;
                        gridParam.url = option;
                        break;
                    case "grouping":
                        if (_.isObject(option)) {
                            _.extend(gridParam.groupingView, getGroupingViewParameter(option));
                            conf.elements.grouping = option; //all properties required for grouping should be available in option
                        }
                        break;
                }
            }
            gridTable.jqGrid('setGridParam', gridParam).trigger('reloadGrid');
            gridContainer.trigger('slipstreamGrid.resized:width');
        };

        /**
         * Reload the grid container for url requests
         * @param {Object} options - An object containing a set of options that control the reload operation.
         * Valid options are:
         *  rowIndex - The index of the row to which the grid should be positioned after reload.  Valid row indexes are > 0.
         *  numberOfRows - Resets the numbers of rows so when the grid is reloaded, grid sends a request with the new number of rows
         *  highlightRow: A boolean indicating if the row given by rowIndex should be highlighted when it is displayed.
         *  callback: A callback function that is invoked after the reload operation is complete.  The function will be passed the following arguments:
         *      rowIndex - the rowIndex provided in the call to reloadGrid.  If no rowIndex was provided this will be undefined.
         *      row - The row object of the row at index rowIndex. If no row index was provided, this will be undefined.
         *  resetSelection: A boolean that allows to reset the selected rows
         */
        this.reloadGrid = function (options) {
            if (gridTable) {
                if (options && options.resetSelection) {
                    resetSelectedRows(null, true);
                    updateActionStatus(getSelectedRows());
                } else {
                    retrieveAllRowIds();
                }
                conf.elements.getData && gridTable.jqGrid('clearGridData');
                options && options.numberOfRows && gridTable.setGridParam({rowNum: options.numberOfRows});

                var pageSize = gridTable.getGridParam('rowNum');
                var scrollPosition = 0;
                var maintainViewport = false;
                var rowIndex = 1;

                if (options && options.rowIndex) {
                    if (options.rowIndex > 0) {
                        rowIndex = options.rowIndex;
                    }
                } else {
                    maintainViewport = true;
                }

                var pageNumberOfRow = Math.ceil(rowIndex / pageSize);

                if (this.conf.elements.tree) {
                    gridTable.jqGrid('clearGridData');
                    gridTable.trigger('reloadGrid');
                } else {
                    scrollPosition = this.getScrollPosition();
                    gridTable[0].grid.prevRowHeight = undefined; // workaround for jqGrid bug. https://github.com/tonytomov/jqGrid/issues/690

                    gridTable.on('jqGridLoadComplete.reload', function (e, data) {
                        gridTable.off('jqGridLoadComplete.reload');

                        if (maintainViewport) {
                            self.setScrollPosition(scrollPosition);
                            return;
                        }

                        var relativePageIndex = (rowIndex % pageSize);
                        var scrollAmount = 0;

                        // Get the total client height of all rows on the page above the target row
                        for (var i = 1; i < relativePageIndex; i++) {
                            scrollAmount += gridTable[0].rows[i].offsetHeight;
                        }

                        // scroll the viewport to the correct row
                        scrollAmount += self.getScrollPosition();
                        self.setScrollPosition(scrollAmount);

                        if (options && options.highlightRow) {
                            var $newRow = $(gridTable[0].rows[relativePageIndex]);
                            setGridHighlightStyles($newRow);
                        }

                        // invoke the provided callback if one exists
                        if (options && options.afterReload) {
                            var targetRowNode;

                            if (options.rowIndex && options.rowIndex > 0) {
                                targetRowNode = (gridTable[0].rows[relativePageIndex /*options.rowIndex*/]);
                            }

                            options.afterReload(options.rowIndex, targetRowNode);
                        }
                    });

                    gridTable.trigger('reloadGrid', [
                        {page: pageNumberOfRow}
                    ]);

                    updateActionStatus(getSelectedRows());
                }
            } else {
                throw new Error(errorMessages.noGrid);
            }
        };

        /**
         * Toggle the grid header from show to hide and viceversa. The grid header is composed by the subHeader (the subtitle of the grid and the action bar), the header (title of the table) and the search (search token)
         * @param {boolean} isHidden - Optional, indicates if the grid header should be shown or hide
         * @param {string/array} keepContainer - Optional, indicates if one of the containers (subHeader, header or search) should not be hidden during the method execution. It has the values: subHeader, header or search
         */
        this.toggleGridHeader = function (isHidden, keepContainer) {
            if (gridTable) {
                !containers.$gridWidget && (containers.$gridWidget = gridTable.parents('.grid-widget'));
                !containers.$subHeader && (containers.$subHeader = containers.$gridWidget.find('.sub-header'));
                !containers.$searchSaveContainer && (containers.$searchSaveContainer = containers.$gridWidget.find(".search-save-container"));

                var showContainer = function (container) {
                    switch (container) {
                        case "subheader":
                            containers.$subHeader.removeClass("hidden");
                            break;
                        case "header":
                            containers.$header.removeClass("hidden");
                            break;
                        case "search":
                            containers.$searchSaveContainer.removeClass("hidden");
                            break;
                    }
                };

                if (_.isBoolean(isHidden)) {
                    if (isHidden) {
                        containers.$subHeader.addClass("hidden");
                        containers.$header.addClass("hidden");
                        containers.$searchSaveContainer.addClass("hidden");
                    } else {
                        containers.$subHeader.removeClass("hidden");
                        containers.$header.removeClass("hidden");
                        containers.$searchSaveContainer.removeClass("hidden");
                    }
                } else {
                    containers.$subHeader.toggleClass("hidden");
                    containers.$header.toggleClass("hidden");
                    containers.$searchSaveContainer.toggleClass("hidden");
                }
                if (_.isArray(keepContainer)) {
                    for (var i = 0; i < keepContainer.length; i++) {
                        showContainer(keepContainer[i]);
                    }
                } else {
                    showContainer(keepContainer);
                }
            } else {
                throw new Error(errorMessages.noGrid);
            }
        };

        var retrieveAllRowIds = function () {
            var rowIds = gridTable.jqGrid("getDataIDs"),
                allRowIdsConf = conf.elements.onSelectAll && !isLocalData ? conf.elements.onSelectAll : rowIds;

            var updateSelectedRowsByTables = function (allRowIdsHash) {
                var getSelectedRowsData = getSelectedRows();
                $.each(getSelectedRowsData.selectedRowIds, function (index, value) {
                    if (!allRowIdsHash[value]) {
                        delete selectedRowsByTables[gridTable[0].id][value];
                    }
                });
                updateActionStatus(getSelectedRows());
            };

            if (allRowIds.selectAllEnabled) {
                selectAllManager.setAllRowIds(allRowIdsConf, getSearchTokens(), gridTable.getGridParam("postData"), updateSelectedRowsByTables);
            } else {
                updateActionStatus(getSelectedRows());
            }

        };

        /**
         * Returns the rows in the current viewport
         * @returns {Object} jQuery Object with current viewport rows
         */
        this.getViewportRows = function () {
            if (gridTable) {
                var viewportRows = containers.$gridContentContainer.find('tr.jqgrow:in-viewport(0, .ui-jqgrid-bdiv)');
                return viewportRows;
            } else {
                throw new Error(errorMessages.noGrid);
            }
        };

        /**
         * Reload the rows of the grid for no url requests
         * @param {Object} rows - rows that needs to be showed in the grid
         * @param {Object} page - parameters of the page: numberOfPage, totalPages, totalRecords
         * @param {boolean} resetSelection - reset the selected rows
         * @param {boolean} keepData - keeps the current grid data
         * @param {boolean} resize - indicates to resize the grid when it is set to true
         */
        this.reloadGridData = function (data, page, resetSelection, keepData, resize) {
            if (gridTable && conf.elements.url == undefined) {
                var selectedRows = getSelectedRows().$rowAndTable;
                if (typeof(keepData) == 'undefined' || keepData == false)
                    gridTable.jqGrid('clearGridData');
                this.addPageRows(data, page || {numberOfPage: 1});
                restoreSelectedRows(selectedRows, resetSelection);
            } else {
                throw new Error(errorMessages.noGrid);
            }
        };

        var triggerInfiniteScroll = function (gridConfiguration, gridTable) {
            var records = gridTable.getGridParam("treeRecords");

            if (records > gridConfiguration.numberOfRows) {
                var $infiniteContainer = gridTable.parents('.ui-jqgrid-bdiv');
                
                $infiniteContainer.removeClass('defaultHeight').attr("forceScrollbar", true);
                $infiniteContainer.infiniteScrollHelper('destroy');
                $infiniteContainer.infiniteScrollHelper({
                    loadMore: function (page, done) {
                        var gridParam = gridTable.getGridParam("postData"),
                            numberOfRows = gridParam.rows,
                            rowSeq = (page - 1) * numberOfRows;
                        if (rowSeq < records) {
                            var successCallBack = function (data) {
                                addTreeChildren(data);
                                done();
                            };
                            loadPage(page, null, successCallBack);
                        }
                    },
                    bottomBuffer: 80, //TODO: try to investigate if this can be implemented like the grid widget
                    loadingClass: "loadingText",
                    startingPageCount: 1,
                    triggerInitialLoad: false
                });
            }
        };


        /**
         *  Load page function for the treeGrid only when using pagination
         *
         *  @param {Integer} Load the certain page
         */
        var loadPage = function (page, rowNum, successCallBack) {
            var gridParam = gridTable.getGridParam("postData"),
                numberOfRows = rowNum ? rowNum : gridParam.rows,
                rowSeq = (page - 1) * numberOfRows,
                pagingParameter = "(start eq " + rowSeq + ", limit eq " + numberOfRows + ")",
                ajaxOptions = conf.elements.ajaxOptions || {};

            gridTable.setGridParam({page: page});
            _.extend(gridParam, {page: page, paging: pagingParameter, rows: numberOfRows});

            gridSpinner && gridSpinner.showSpinner(gridContainer);

            $.ajax($.extend({
                type: 'GET',
                url: gridTable.jqGrid("getGridParam", "url"),
                data: $.param(gridParam),
                dataType: 'json',
                success: function (data) {
                    successCallBack(data);
                    loadCollectionData({pages: [page], pageSize: numberOfRows});
                    gridTable.trigger("slipstreamGrid.pagination:pageLoaded", {page: page, pageSize: numberOfRows, status: "success"});
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    gridTable.trigger("slipstreamGrid.pagination:pageLoaded", {page: page, status: error});
                    console.log("An error occurred while requesting the data. Details:" + xhr.responseText);
                }
            }, ajaxOptions));
        };

        var addTreeChildren = function (data) {
            if (typeof(conf.elements.reformatData) == 'function') {
                data = conf.elements.reformatData(data);
            }
            var originalData = dataFormatter.formatJSONData(conf, data),
                treeData = dataFormatter.formatTreeJSONData(conf, originalData, data);

            gridTable.setGridParam({datatype: 'local'});
            addChildren(null, treeData);
            gridSpinner && gridSpinner.hideSpinner();

            hasMultipleCellContent && gridFormatter.adjustMultipleCellRow(gridTable, tooltipBuilder);            
            //adds tooltips to the grid table content
            tooltipBuilder && tooltipBuilder.addContentTooltips(gridTable, originalData);
        };

        /**
         * Sets row selection of the grid using the jqGrid library
         * @param {boolean} resetSelection - reset the selected rows
         * @inner
         */
        var restoreSelectedRows = function (selectedRows, resetSelection) {
            if (resetSelection) {
                resetSelectedRows();
            } else {
                var selectedRow, $row, $rowTable, i;
                for (i = 0; selectedRows && i < selectedRows.length; i++) {
                    selectedRow = selectedRows[i];
                    $rowTable = selectedRow.$table;
                    $row = selectedRow.$row;
                    $rowTable.jqGrid('setSelection', $row.attr('id'), true);
                }
            }
        };

        /**
         * Gets the search tokens currently applied to the grid
         * @inner
         */
        var getSearchTokens = function () {
            if (conf.elements.filter && containers.$searchContainer.children().length) { //filterOptions gets created if conf.elements.filter exists
                return filterOptions.getSearchTokens();
            }
        };

        var setSelectAll = function (rowTable, rowIds, status) {
            var isFiltered = isFilteredGrid(),
                isDraggableRow = dragNDrop && dragNDrop.isDraggableRow(),
                records = self.getNumberOfRows(),
                $rowTable = $(rowTable);

            if (isFiltered && !allRowIds.selectAllEnabled) {
                allRowIds.selectAllFiltered = status;
            } else {
                allRowIds.selectAllEnabled = status;
                if (status) {
                    allRowIds.unselectedRowIds = {};
                    allRowIds.selectAllReset = false;
                }
            }

            var onSelectAllTimerId,
                selectAllOverlay,
                allRowIdsConf = conf.elements.onSelectAll && !isLocalData ? conf.elements.onSelectAll : rowIds;

            var updateSelectStatus = function () {
                updateActionStatus(getSelectedRows());
                gridTable.trigger("gridOnSelectAll", status);
            };

            var updateSelectAllStatus = function () {
                if (selectAllManager.isAllRowIdsSet()) {
                    updateSelectStatus();
                    isDraggableRow && selectAllManager.hideSelectAllMask(selectAllOverlay, records, gridSpinner);
                    onSelectAllTimerId && clearInterval(onSelectAllTimerId)
                }
            };

            var isRowInteractionEnabled = function (rowId) {
                if (conf.elements.enabledRowInteraction) {
                    //gets the checkbox for the row selection by using the cached value if the row is in the DOM. It's extracted from $checbox property, and if it's not avaialable, it could be get by searching in the $row property; otherwise, if the row was not cached, just do a regular search on the $rowTable
                    var $rowCheckbox = lastSelectedRows.rowsInDom[rowId] && lastSelectedRows.rowsInDom[rowId].$checkbox ? lastSelectedRows.rowsInDom[rowId].$checkbox : lastSelectedRows.rowsInDom[rowId] && lastSelectedRows.rowsInDom[rowId].$row ? lastSelectedRows.rowsInDom[rowId].$row.find(".cbox") : $rowTable.find("#" + rowId + " .cbox"),
                        isRowEnabled = _.isUndefined($rowCheckbox.attr("disabled"));
                    if (!isRowEnabled && $rowCheckbox[0].checked) { //jqgrid will select all rows and provide the selectAll callback after the selection
                        $rowCheckbox[0].checked = false;
                    }
                    return isRowEnabled;
                } else {
                    return true;
                }
            };

            var setAllRow = function () {
                selectAllManager.setAllRowIds(allRowIdsConf, getSearchTokens(), gridTable.getGridParam("postData"));
                if (conf.elements.tree) {
                    inlineEditRow && lastSelectedRows.tempLastSelectedRowId && self.removeEditModeOnRow(lastSelectedRows.tempLastSelectedRowId);
                    setSelectedRows(rowTable, null, status, true);
                } else {
                    for (var i = 0; i < rowIds.length; i++) {
                        setSelectedRows(rowTable, rowIds[i], isRowInteractionEnabled(rowIds[i]), true);
                    }
                }
                onSelectAllTimerId = setInterval(updateSelectAllStatus, 0);
            };

            var unselectAll = function (updateSelectStatus) {
                if (isFiltered) {
                    var allFilteredRowIds = selectAllManager.getAllRowIds(allRowIds.unselectedRowIds, true);
                    _.extend(allRowIds.unselectedRowIds, allFilteredRowIds);
                    for (var allFilteredRowId in allFilteredRowIds) {
                        delete allRowIds.selectedRowIds[allFilteredRowId];
                    }
                    allRowIds.selectAllReset = true;
                    resetSelectedRows(rowTable);
                } else {
                    resetSelectedRows(rowTable, true);
                }
                updateSelectStatus();
                $rowTable.jqGrid('resetSelection');
            };

            if (status) {
                if (isDraggableRow) {
                    selectAllOverlay = selectAllManager.showSelectAllMask(gridContainer, setAllRow, unselectAll, updateSelectStatus, records, confirmationDialogBuilder, gridSpinner);
                } else {
                    setAllRow();
                }
                columnSwitchOnHover && columnSwitchOnHover.toggleSwitchCol(gridContainer, true);
            } else {
                unselectAll(updateSelectStatus);
                columnSwitchOnHover && columnSwitchOnHover.toggleSwitchCol(gridContainer);
            }

        };

        /**
         * Sets setRowInTree hash used to keep track of relation between child and parent
         * @param {Object} $gridTable - jQuery Object with the grid table
         * @param {string} rowId - id of the row
         * @inner
         */
        var setAllRowsInTree = function ($gridTable, rowId) {
            var setRowInTree = function (rowId) {
                var rowData = lastSelectedRows.rowsInDom[rowId] ? lastSelectedRows.rowsInDom[rowId].rowData : gridTable.jqGrid('getRowData', rowId);
                var isLeaf = rowData.leaf == "true";
                var rowParentId = rowData.parent;
                allRowsInTree[rowId] = {
                    "parent": rowParentId,
                    "children": isLeaf ? null : []
                };
                if (rowParentId){
                    var id = rowId.toString();
                    if (_.isEmpty(allRowsInTree[rowParentId].children)){
                        //Create allRowsInTree hash when rows are loaded
                        allRowsInTree[rowParentId].children.push(id);
                    }else{
                        //Update allRowsInTree when updating rows dynamically, for example, reorder rows by drag-n-drop
                        allRowsInTree[rowParentId].children = _.union(allRowsInTree[rowParentId].children, [id]);
                    }
                }
            };

            if (rowId) {
                setRowInTree(rowId);
            } else {
                var $rows = $gridTable.find('tr[role=row]'); //sequence is important so that the parents could be set first and then its children. using rowsInDom brings rows sorted by its id which will cause an error when a child is set while his parent has still not been set
                $rows.each(function (index, row) {
                    row.id != "" && setRowInTree(row.id);
                });
            }
        };

        /**
         * Gets allRowInTree hash used to keep track of relation between child and parent
         * @inner
         */
        var getAllRowsInTree = function() {
            return allRowsInTree;
        };
        /**
         * Initializes rows in the tree grid like set them in cache and restore row selection
         * @param {Object} $gridTable - jQuery Object with the grid table
         * @param {Object} data - data of the rows
         * @param {Object} gridConfiguration - configuration of the grid
         * @inner
         */
        var inititalizeTreeRows = function ($gridTable, data, gridConfiguration) {
            setRowsInDom();
            setAllRowsInTree($gridTable);
            treeGridRowNumberCount = actionAfterRowInserted.stampRowIndex(gridTable, treeGridRowNumberCount);
            setPreviousRowState($gridTable); //tree grid doesn't trigger the afterInsertRow event when grid data is loaded, it only happens on addChildren method
            cacheTreeGridRawData(data);
            _.isFunction(conf.elements.enabledRowInteraction) && $gridTable.find('.rowNoSelectable .cbox_tree').prop("disabled", true); //Disable tree checkboxes because afterInsertRow is NOT triggered when the grid loads first time
            lastSelectedRows.isRowsInDomSetCompleted = false; //tree grid keeps the new rows in the same page even after addChildren method is called
            conf.elements.scroll && !conf.elements.scroll.pagination && triggerInfiniteScroll(gridConfiguration, $gridTable);
            groupColumn && groupColumn.updateGroupColumnsStyle($gridTable);//sets cell style if grouped columns are collapsed
        };

        /**
         * Creates a grid using the jqGrid library
         * @param {Object} gridConfiguration - configuration of the grid
         * @inner
         */
        var createGrid = function (gridConfiguration) {
            var hasSubgrid = gridConfiguration.subGrid ? true : false;
            var hasMultiselectSubgrid = hasSubgrid && gridConfiguration.multiselect ? true : false;
            var hasMultiselect = !hasSubgrid && (gridConfiguration.multiselect || gridConfiguration.singleselect) ? true : false;
            var isOrderable = gridConfiguration.orderable !== false,
                isSortable =  isOrderable && _.isUndefined(gridConfiguration.tree) && !hasSubgrid && _.isUndefined(gridConfiguration.grouping);
            var datatype = 'json',
                subGridNoDataCount = 0,
                isTreeGrid = gridConfiguration.tree ? true : false,
                isGroupGrid = gridConfiguration.grouping ? true : false,
                isSimpleGrid = !(hasSubgrid || isTreeGrid || isGroupGrid) ? true : false,
                hasUpdatePermission = (rbacHash['updateEvent'] !== false),
                initLoadLocalData = true,
                rowNumberCount = 0,
                isCollectionGrid;

            if (_.isUndefined(gridConfiguration.url)){// potentially, a collection grid
                if (_.isFunction(gridConfiguration.getData)){
                    datatype = gridConfiguration.getData;
                } else {
                    datatype = 'local';
                    if (isSimpleGrid) {
                        if (_.isArray(gridConfiguration.data)) {
                            isLocalData = true;
                        } else {
                            isCollectionGrid = true;
                        }
                    } else if (conf.elements.tree) {
                        gridConfiguration.url = "/assets/js/widgets/grid/data/treeEmpty.json";  //initializes tree grid with empty grid to be able to add data later using collections
                    }
                }
            }

            var ajaxOptions = gridConfiguration.ajaxOptions || {};
            var updateObj = {
                update: function () {
                    gridTable.trigger("slipstreamGrid.updateConf:columns");
                }
            };

            var multiSort, sortOrder, gridSortingOptions;
            if (gridConfiguration.sorting) {
                if (gridConfiguration.sorting.length == 1 || isLocalData) {
                    multiSort = false;
                    sortOrder = gridConfiguration.sorting[0].order ? gridConfiguration.sorting[0].order : 'asc';
                    gridSortingOptions = gridConfiguration.sorting[0].column;
                } else if (gridConfiguration.sorting.length > 1) {
                    multiSort = true;
                    gridSortingOptions = getGridSortingOptions(gridConfiguration.sorting);
                }
            }

            //enables multiselectCell and dragNDrop features
            var hasMultiselectCell = enablesMultiselectCellAndDragNDrop(isSimpleGrid, hasUpdatePermission);

            if ((rbacHash['updateEvent'] === false) && gridConfiguration.editRow && (gridConfiguration.editRow.showInline === true))
                    gridConfiguration.editRow.showInline = false;

            //Only create ColumnSwitchOnHover class instance when there is switchedColumn
            if (_.isObject(gridFormatter.getSwitchColumnConfig())){
                columnSwitchOnHover = new ColumnSwitchOnHover(conf, gridFormatter, gridConfigurationHelper)
            }

            actionAfterRowInserted = new ActionAfterRowInserted(conf, gridContainer);

            isCollectionDataGrid && gridEvents.bindLoadCollectionData(gridTable, _.bind(self.addPageRows, self));
            var jqGridConf = {
                height: gridConfiguration.height,
                multiselect: hasMultiselect,
                multiboxonly: hasMultiselect,
                multiselectWidth: 35,
                colNames: getColumnNames(gridConfiguration.columns),
                colModel: gridConfiguration.columns,
                datatype: datatype,
                url: gridConfiguration.url,
                mtype: gridConfiguration.urlMethod || 'GET',
                postData: (typeof(gridConfiguration.postData) != 'function') ? gridConfiguration.postData : undefined,
                multiSort: multiSort,
                sortorder: sortOrder,
                sortname: gridSortingOptions,
                sortable: isSortable ? updateObj : false,
                rowNum: gridConfiguration.numberOfRows,
                viewrecords: true,
                dragNDrop: gridConfiguration.dragNDrop,
                forceFit: autoWidth ? true : false, //resizes column title
                shrinkToFit: isSimpleGrid && autoWidth ? false: true, //BUG: when groupGrid has autoWidth and change the position of the last column, the separator of the last column is missing.
                headertitles: true,
                autoencode: true,
                cellsubmit: 'clientArray',
                editurl: 'clientArray',
                editRow: gridConfiguration.editRow,
                scroll: gridConfiguration.scroll && typeof(gridConfiguration.tree) == 'undefined' ? 1 : 0,
                rownumbers: gridConfiguration.showRowNumbers,
                cmTemplate: {
                    title: false,
                    sortable: _.isBoolean(gridConfiguration.sorting) ? gridConfiguration.sorting : true
                },
                ajaxGridOptions: ajaxOptions,
                treeGrid: gridConfiguration.tree ? true : false,
                treeGridModel: gridConfiguration.tree && 'adjacency',
                ExpandColumn: gridConfiguration.tree && gridConfiguration.tree.column,
                treeReader: {
                    level_field: gridConfiguration.tree && gridConfiguration.tree.level ? gridConfiguration.tree.level : "level",
                    parent_id_field: gridConfiguration.tree && gridConfiguration.tree.parent ? gridConfiguration.tree.parent : "parent",
                    leaf_field: gridConfiguration.tree && gridConfiguration.tree.leaf ? gridConfiguration.tree.leaf : "leaf",
                    expanded_field: gridConfiguration.tree && "expanded"
                },
                grouping: gridConfiguration.grouping ? true : false,
                groupingView: gridConfiguration.grouping ? getGroupingViewParameter(gridConfiguration.grouping) : '',
                onCellSelect: !hasSubgrid && cellSelect,
                onSortCol: datatype == 'local' ? customSort : false,
                onSelectAll: function (rowIds, status) {
                    setSelectAll(this, rowIds, status);
                },
                afterInsertRow: function (rowId, rowData, rawData) {
                    var $rowTable = $(this),
                        $row = $rowTable.find("#" + rowId),
                        $checkbox = conf.elements.tree ? $row.find('.tree_custom_checkbox>input') : undefined;

                    if ($row.hasClass(reservedElementClasses.rowNoSelectable)) {
                        var rowSelectionClass = (conf.elements.tree) ? ".cbox_tree" : ".cbox";
                        $row.find(rowSelectionClass).prop("disabled", true);
                    }
                    $row.data("jqgrid.record_data", rawData);
                    $row.addClass("slipstreamgrid_row");

                    if(lastSelectedRows.isRowsInDomSetCompleted) { //because of flag, loop execute once per page (updateRowsInDom)
                        for (var selectedRowId in lastSelectedRows.rowsInDom) {
                            var selectedRowDomElement = $rowTable.find("#"+selectedRowId);
                            if (!selectedRowDomElement.length) {
                                delete lastSelectedRows.rowsInDom[selectedRowId];
                            }
                        }
                    }  //the flag is set in gridComplete to indicate that when this event is called, a new page in the grid is called -except for adding a new row-
                    lastSelectedRows.isRowsInDomSetCompleted = false;

                    setRowsInDom(rowId, {
                        $row: $row,
                        $checkbox: $checkbox,
                        $table: $rowTable,
                        rowData: reformatRow($rowTable.jqGrid('getRowData', rowId)),
                        rawRow: rawData,
                        isRowDisabled: $row.hasClass('rowDisabled')
                    });

                    if (conf.elements.tree) {
                        if (isPaginationSupported) {
                            allRowIds.selectedRowIds && allRowIds.selectedRowIds[rowId] && $checkbox.prop('checked', true);
                            setPreviousRowState($rowTable, rowId, $row);
                        }
                        treeGridRowNumberCount = actionAfterRowInserted.stampRowIndex(gridTable, treeGridRowNumberCount, $row);
                        groupColumn && groupColumn.updateGroupColumnsStyle($row);//sets cell style if grouped columns are collapsed
                    } else {
                        rowNumberCount = actionAfterRowInserted.stampRowIndex(gridTable, rowNumberCount, $row);
                        setPreviousRowState($rowTable, rowId, $row);
                    }
                    dragNDrop && dragNDrop.addNotDroppableMask($row);
                },
                gridComplete: function () {
                    var $gridTable = $(this);

                    conf.elements.getData && gridSizeCalculator.resizeGridHeight(isFilteredGrid());

                    //adds item selection for a cell
                    hasMultiselectCell && multiselectCell.init($gridTable);

                    if (!(isTreeGrid || isGroupGrid)) { //only if it is a grid different than tree or group then the page load is completed
                        lastSelectedRows.isRowsInDomSetCompleted = true; //once all rows are inserted, gridComplete is called

                        //Only in the simple grid
                        !hasSubgrid && hasMultipleCellContent && gridFormatter.adjustMultipleCellRow($gridTable);
                    }

                    dragNDrop && dragNDrop.bindDnD($gridTable);                    
                    
                    if (hasSubgrid && gridConfiguration.subGrid.expandOnLoad) {
                        $.each($gridTable.getDataIDs(), function (index, rowId) {
                            $gridTable.expandSubGridRow(rowId);
                        });
                    }

                    gridSpinner && gridSpinner.hideSpinner(false, $gridTable.closest('.ui-jqgrid'));
                    groupColumn && groupColumn.updateGroupColumnsStyle($gridTable); //sets cell style if grouped columns are collapsed
                    !isCollectionGrid && updateGridSelectionCount();
                    $gridTable.trigger('slipstreamGrid.row:updateNumberOfRows', self.getNumberOfRows());
                    if ((!hasSubgrid && columnSwitchOnHover) || gridConfiguration.rowHoverMenu) {
                        gridEvents.triggerHoverRow($gridTable);
                        columnSwitchOnHover && !allRowIds.selectAllEnabled && columnSwitchOnHover.init($gridTable, gridContainer);
                    }
                },
                loadComplete: function (data) {
                    var $gridTable = $(this);
                    hasMultipleCellContent && gridFormatter.adjustMultipleCellRow($gridTable);
                    rowNumberCount = 0;
                    if (initLoadLocalData && isLocalData){
                        $gridTable.addRowData(conf.elements.jsonId, conf.elements.data);
                        initLoadLocalData = false;
                    }

                    $gridTable.trigger('gridLoaded', 'success');
                    loadCollectionData();
                    
                    isPaginationSupported && $gridTable.trigger("slipstreamGrid.pagination:pageLoaded", {page: 1, pageSize: conf.elements.numberOfRows, status: "success"});

                    if (allRowIds.selectAllEnabled && !allRowIds.selectAllReset)
                        containers.$selectAllCheckbox.prop('checked', true);

                    //adds tooltips to the grid table content
                    tooltipBuilder && tooltipBuilder.addContentTooltips($gridTable, originalRowData);

                    if (conf.elements.tree) { //addChildren in tree grid calls gridComplete for every row that is added while the first time a tree grid is created, only this callback is invoked
                        inititalizeTreeRows($gridTable, data, gridConfiguration);
                    } else if (conf.elements.grouping) {
                        setRowsInDom();
                    }

                    conf.elements.url && gridSizeCalculator.resizeGridHeight(isFilteredGrid());
                    gridTable.trigger('slipstreamGrid.resized:gridColumn');

                    // check the count of records to show/hide the message container
                    subGridNoDataCount = 0;
                    !isCollectionGrid && gridNonRecordsState.displayNoResultMessage(data);

                    //trigger to enable click for grid sorting
                    containers.$gridWidget && gridEvents.unbindClickSorting(containers.$gridWidget);
                },
                loadError: function (xhr, status, error) {
                    var $gridTable = $(this);
                    gridNonRecordsState.displayErrorMessage();
                    $gridTable.trigger('gridLoaded', error);
                    conf.elements.tree && $gridTable.trigger("slipstreamGrid.treeGrid:pageLoaded", {page: 1, status: error});
                    console.log("An error occurred while loading data into the grid. Title: " + error + " - Details:" + xhr.responseText);
                },
                subGrid: hasSubgrid,
                subGridRowExpanded: function (subgrid_id, row_id) {
                    var rowHeight = 35; //default row height of the grid
                    var searchTokens = conf.elements.filter ? self.getSearchTokens() : undefined;
                    var rowData = $(this).find("#" + row_id).data("jqgrid.record_data");
                    var subgrid_url = _.isFunction(gridConfiguration.subGrid.url) ? gridConfiguration.subGrid.url(rowData, searchTokens, row_id) : gridConfiguration.subGrid.url;
                    var subgrid_ajaxOptions = _.isFunction(gridConfiguration.subGrid.ajaxOptions) ? gridConfiguration.subGrid.ajaxOptions(rowData, searchTokens, row_id) : (gridConfiguration.subGrid.ajaxOptions || {});
                    var gridParentWidth = gridTable.jqGrid('getGridParam', 'width');
                    var subgrid_table_id = subgrid_id + "_slipstreamSubGrid";
                    var subgridTableContainer = $(this).find("#" + subgrid_id).html(render_template(templates.subGridContainer, {subGridId: subgrid_table_id}));
                    var $subgridTable = subgridTableContainer.find("#" + subgrid_table_id).addClass('slipstream-edit-grid-inline');
                    var subGridConf = {
                        url: subgrid_url,
                        ajaxGridOptions: subgrid_ajaxOptions,
                        datatype: "json",
                        colNames: getColumnNames(gridConfiguration.subGrid.columns),
                        colModel: gridConfiguration.subGrid.columns,
                        height: (gridConfiguration.subGrid.height && gridConfiguration.subGrid.height !== "auto") ? gridConfiguration.subGrid.height : rowHeight * gridConfiguration.subGrid.numberOfRows,
                        rowNum: gridConfiguration.subGrid.numberOfRows,
                        scroll: gridConfiguration.subGrid.scroll, //lazy load requires height in px and a number of rows
                        sortname: gridConfiguration.subGrid.sorting && gridConfiguration.subGrid.sorting.order,
                        sortorder: gridConfiguration.subGrid.sorting && gridConfiguration.subGrid.sorting.column,
                        multiselect: hasMultiselectSubgrid,
                        multiboxonly: hasMultiselectSubgrid,
//                        scrollrows: true, //to get fix height in rows
                        rownumbers: gridConfiguration.subGrid.showRowNumbers,
                        rownumWidth: 31,
                        width: gridParentWidth,
//                        shrinkToFit: false,
                        cellsubmit: 'clientArray',
                        editurl: 'clientArray',
                        cmTemplate: {
                            title: false,
                            sortable: false
                        },
                        jsonReader: {
                            root: _.isFunction(gridConfiguration.subGrid.jsonRoot) ? gridConfiguration.subGrid.jsonRoot(rowData, searchTokens, row_id) : gridConfiguration.subGrid.jsonRoot,
                            id: _.isFunction(gridConfiguration.subGrid.jsonId) ? gridConfiguration.subGrid.jsonId(rowData, searchTokens, row_id) : gridConfiguration.subGrid.jsonId,
                            repeatitems: gridConfiguration.subGrid.repeatItems,
                            page: gridConfiguration.subGrid.page,
                            total: gridConfiguration.subGrid.total,
                            records: gridConfiguration.subGrid.jsonRecords
                        },
                        onCellSelect: cellSelect,
                        afterInsertRow: function (rowId, rowData, rawData) {
                            var $rowTable = $(this),
                                $row = $rowTable.find("#" + rowId);
                            $row.data("jqgrid.record_data", rawData);
                            setRowsInDom(rowId, {
                                $row: $row,
                                $checkbox: null,
                                $table: $rowTable,
                                rowData: reformatRow($rowTable.jqGrid('getRowData', rowId)),
                                rawRow: rawData,
                                isRowDisabled: $row.hasClass('rowDisabled')
                            });
                        },
                        loadComplete: function (data) {
                            var $table = $(this),
                                parentTotalRecords = gridTable.jqGrid('getGridParam', 'records'),
                                numberOfRecords = gridConfiguration.subGrid.jsonRecords(data, this.id);
                            gridSpinner && gridSpinner.hideSpinner(false, $table.closest('.ui-jqgrid'));
                            if (numberOfRecords == 0) {
                                if (gridConfiguration.subGrid.expandOnLoad) {
                                    var $subgridContent = $table.closest(".ui-subgrid");
                                    subGridNoDataCount++;
                                    $subgridContent.hide();
                                    $subgridContent.prev().hide();
                                    subGridNoDataCount == parentTotalRecords && gridNonRecordsState.displayNoResultMessage(data, false, true, gridTable);
                                } else {
                                    gridNonRecordsState.displayNoResultMessage(data, false, true, $table);
                                }
                            } else {
                                var $bdivTable = $table.closest(".ui-jqgrid-bdiv");
                                $bdivTable.css({
                                    "height": "auto",
                                    "max-height": $bdivTable.height()
                                });
                                tooltipBuilder && tooltipBuilder.addContentTooltips($table, originalRowData);
                            }
                            if (columnSwitchOnHover || gridConfiguration.rowHoverMenu) {
                                gridEvents.triggerHoverRow($table);
                                columnSwitchOnHover && columnSwitchOnHover.init($table, gridContainer);
                            }
                            $(this).trigger('subGridLoaded', 'success');
                        }
                    };
                    subGridConf = extendConfiguration(subGridConf, gridConfiguration.subGrid);
                    if (conf.elements.contextMenu) {
                        subGridConf = extendOnSelectRow(subGridConf, gridConfiguration);
                    }
                    $subgridTable.jqGrid(subGridConf);
                    var subGridContainers = {
                        $gridTable: $subgridTable,
                        $selectedHeader: subgridTableContainer.find('.selection-count')
                    };
                    //attach key event handlers for subgrids.
                    gridKeyEventHandlers.addListeners(subGridContainers, getSelectedRows, getSearchTokens, self.toggleRowSelection, getAllRowsInTree);
                }
            };

            //allows table width to be adjusted automatically
            if (autoWidth) {
                jqGridConf.autowidth = true;
            }

            //sets jqGrid callbacks
            jqGridConf = extendConfiguration(jqGridConf, gridConfiguration); //beforeRequest, serializeGridData, beforeProcessing, resizing
            if (!hasSubgrid && rowSelectionEnabled) {
                jqGridConf = extendOnSelectRow(jqGridConf, gridConfiguration); //rowattr, beforeSelectRow, onSelectRow, onRightClickRow
                conf.elements.singleselect && extendOnSingleRowSelection(jqGridConf); //beforeSelectRow, onSelectRow
                _.isUndefined(conf.elements.contextMenu) && delete jqGridConf.onRightClickRow; //right click on a row is not needed
            }
            jqGridConf = extendJsonReader(jqGridConf, gridConfiguration);//adds localReader or JsonReader

            gridTable.jqGrid(jqGridConf);

            //Check if the datatype is getData function and if it is loadonce
            //TO BE DEPRECATED: _loadonce should be removed once getData function is removed from the list builder
            if (_.isFunction(datatype) && gridConfiguration['_loadonce']){
                gridTable.setGridParam({datatype: 'local'});
            }

            if (hasSubgrid) { //adds the first element in the header of a grid that has a nested grid
                var $leftHeader = gridContainer.find('.ui-jqgrid-labels th:first');
                if (gridConfiguration.sequenceHeader) {
                    gridContainer.find('.ui-jqgrid-labels th:first')
                        .addClass('leftNestedHeader')
                        .empty()
                        .append(render_template(templates.gridNestedHeader, {'leftHeader': gridConfiguration.sequenceHeader}));
                }
                gridTable.addClass('nestedTable');
                gridContainer.addClass("slipstream_nested_grid");
            } else {
                gridKeyEventHandlers.addListeners(containers, getSelectedRows, getSearchTokens, self.toggleRowSelection, getAllRowsInTree); //attach key event handlers for simple/group grids.
            }
            gridSizeCalculator.adjustColumnWidth(autoWidth);

            if (_.isBoolean(gridConfiguration.sorting) && !gridConfiguration.sorting) { //restores default cursor when sorting is not available
                gridContainer.find('.ui-jqgrid-sortable').addClass('not-sortable');
            }

            gridConfiguration.contextMenu && menuFormatter.setColumnContextMenuConfiguration(gridTable.jqGrid("getGridParam", "colModel"));
            gridConfiguration.rowHoverMenu && actionBuilder.setRowHoverMenu(getRowData);

            addGridEventListener();
            addExpandCollapseRowListener();
            cacheGridContainers();
        };

        /**
         * Cache containers used in the grid under the class variable: containers
         * @inner
         */
        var cacheGridContainers = function(){
            !containers.$header && (containers.$header = containers.$gridWidget.find(".ui-jqgrid-hdiv"));
        };

        /**
         * Cache record_data for the treeGrid.
         * Tree grid doesn't trigger the afterInsertRow event when grid data is loaded
         * @param {Object} data
         * @inner
         */
        var cacheTreeGridRawData = function(data){
            var treeData = gridConfigurationHelper.getNestedData(data);
            if (treeData){
                for (var i = 0; i < treeData.length; i++){
                    gridTable.find("#" + treeData[i][conf.elements.jsonId]).data("jqgrid.record_data", treeData[i]);
                }
            }
        };

        /**
         * Enables drag and drop and multiselect features. Drag and drop feature uses multiselect cell option but a multi selection of items in a cell can be enabled even if the grid does not have the drag and drop feature.
         * @returns {boolean} - true if multiselect was enabled or false if it is not
         * @inner
         */
        var enablesMultiselectCellAndDragNDrop = function (isSimpleGrid, hasUpdatePermission) {
            var hasDragNDrop = conf.elements.dragNDrop || gridConfigurationHelper.hasColumnProperty("dragNDrop"),
                hasMultiselectCell = gridConfigurationHelper.hasColumnProperty("collapseContent", "multiselect"),
                isTreeWithoutPreselection = conf.elements.tree && !conf.elements.tree.preselection? true : false,
                dragNDropConf, isCellDnD, treeGridHelper, treeActions;
            if ((isTreeWithoutPreselection || isSimpleGrid) && hasDragNDrop) {
                if (isTreeWithoutPreselection){
                    //treeGridHelper and treeActions are only used for treeGrid dragNDrop for now. We can move them out if needed.
                    treeGridHelper = new TreeGridHelper(conf);
                    treeActions = new TreeActions(conf, treeGridHelper);
                    treeGridHelper.init({originalRowData : originalRowData, allRowsInTree: allRowsInTree});
                    treeActions.init({originalRowData : originalRowData, allRowsInTree: allRowsInTree});
                }

                var dragNDropConf = {
                    "instance": {
                        "tooltipBuilder": tooltipBuilder,
                        "gridConfigurationHelper": gridConfigurationHelper,
                        "treeGridHelper": treeGridHelper,
                        "treeActions": treeActions
                    },
                    "method": {
                        "getSelectedRows": _.bind(getSelectedRows, self),
                        "resetSelections": resetSelections,
                        "clearAllSelection": clearAllSelection,
                        "addNewRowData": addNewRowData,
                        "reformatRow": reformatRow,
                        "isRowInEditMode": isRowInEditMode,
                        "editRow": self.editRow,
                        "toggleRowSelection": self.toggleRowSelection
                    },
                    "objects":{
                        "allRowsInTree": allRowsInTree,
                        "originalRowData": originalRowData
                    }
                };
                dragNDrop = new DragNDrop(conf, dragNDropConf, templates, hasUpdatePermission);
                dragNDrop.rowDnDInit(gridTable);
                if (isSimpleGrid){
                    isCellDnD = dragNDrop.isCellDnD();
                    hasMultiselectCell = hasMultiselectCell || isCellDnD;
                }
            }
            //adds item selection for a cell
            if (hasMultiselectCell) {
                multiselectCell = new MultiselectCell(conf, {
                    "instance": {
                        "gridConfigurationHelper": gridConfigurationHelper,
                        "tooltipBuilder": tooltipBuilder
                    }
                }, templates, gridContainer);
                isCellDnD && (dragNDropConf.instance.multiselectCell = multiselectCell); //adds multiselectCell instance if dragNDrop has cell/item drag and drop
            }

            return hasMultiselectCell;
        };

        /**
         * Adds a collapse or expand row listener for grids that have one or more columns with the collpaseContent or groupContent properties. These properties allow a row to expand or collapse its content.
         * @inner
         */
        var addExpandCollapseRowListener = function () {
            var hasCollapseRow = gridConfigurationHelper.hasColumnProperty("collapseContent") || gridConfigurationHelper.hasColumnProperty("groupContent"),
                updateExpandedRowIds = function (rowId, isExpanded) {
                    if (isExpanded) {
                        allRowIds.expandedRowIds[rowId] = true;
                    } else {
                        delete allRowIds.expandedRowIds[rowId];
                    }
                };

            if (hasCollapseRow) {
                allRowIds.expandedRowIds = {};
                gridEvents.bindOnCollapseExpandRow(gridTable, updateExpandedRowIds, {
                    "gridFormatter": gridFormatter,
                    "tooltipBuilder": tooltipBuilder
                });
            }
        };

        /**
         * Caches the rows available in the DOM at the time the grid is loaded
         * @inner
         */
        var setRowsInDom = function (rowId, options) {
            if (rowId) {
                lastSelectedRows.rowsInDom[rowId] = options;
            } else {
                lastSelectedRows.rowsInDom = {};
                var $rows = gridContainer.find('tr[role=row]');
                $rows.each(function (id, row) {
                    if (row.id) {
                        var rowId = row.id;
                        var $row = $(row);
                        var $rowTable = conf.elements.subgrid ? $row.closest('table') : gridTable;
                        var isRowDisabled = $row.hasClass('rowDisabled');
                        var rowData = reformatRow($rowTable.jqGrid('getRowData', rowId));
                        var rawRow = conf.elements.tree ? originalRowData[gridConfigurationHelper.escapeSpecialChar(rowId)] : $row.data('jqgrid.record_data');
                        lastSelectedRows.rowsInDom[rowId] = {
                            $row: $row,
                            $checkbox: conf.elements.tree ? $row.find('.tree_custom_checkbox>input') : $row.find('.cbox'),
                            $table: $rowTable,
                            rowData: rowData,
                            rawRow: rawRow,
                            isRowDisabled: isRowDisabled
                        };
                    }
                });
            }
        };

        var addChildren = function (parent, rowData) {
            var allChildrenId = [],
                gridTableId = gridTable.attr("id"),
                records = gridTable.getGridParam('records');
            var isParentSelected = function (parentId) {
                if (parentId && conf.elements.tree.preselection && lastSelectedRows.rowsInDom[parentId]) {
                    return lastSelectedRows.rowsInDom[parentId].$checkbox[0].checked;
                }
                return false;
            };

            var addChildNode = function (row) {
                var parentId = parent || row[conf.elements.tree.parent];
                var rowId = row[conf.elements.jsonId];

                gridTable.jqGrid('addChildNode', rowId, parentId, row);
                allChildrenId.push(rowId);
                var isPrefetchedRow = allRowsInTree[rowId] ? true : false;
                setAllRowsInTree(gridTable, rowId);
                if (allRowIds.selectAllEnabled || isParentSelected(parentId)) { //if select all or parent is checked (for preselection enabled), then the children should be added to the selected rows
                    var rowInDom = lastSelectedRows.rowsInDom[rowId];
                    if (isPrefetchedRow && !selectedRowsByTables[gridTableId][rowId]) {
                        rowInDom.$checkbox[0].checked = false;
                    } else {
                        rowInDom.$checkbox[0].checked = true;
                        rowInDom.$row.addClass("selectedRow");
                        selectedRowsInTree[rowId] = rowInDom.rowData;
                        addSelectedRow(rowId);                        
                    }
                }
            };

            if (_.isArray(rowData)) {
                rowData.forEach(function (row) {
                    addChildNode(row);
                });
            } else {
                addChildNode(rowData);
            }
            selectAllManager.extendRowIds(allChildrenId); //allChildrenId are already expected to be in allRowIds

            //restores the original number of records that was provided in jsonRecords parameter
            gridTable.setGridParam({records: records});
            columnSwitchOnHover && columnSwitchOnHover.toggleSwitchCol(gridContainer, null, null, true);
            updateGridSelectionCount();
        };

        /**
         * Sets the row state as it was just before the page or the grid was reloaded
         * @param {Object} $rowTable - table that holds the row that needs state update
         * @param {String} rowId - optional, id of the row to set the state
         * @param {Object} $row - optional, id of the row to set the state
         * @inner
         */
        var setPreviousRowState = function ($rowTable, rowId, $row) {
            setPreviousSelectedRows($rowTable, rowId);
            setPreviousExpandedRows($rowTable, rowId, $row);
        };

        /**
         * Sets the row selection as it was just before the page or the grid was reloaded
         * @param {Object} $rowTable - table that holds the row that needs row selection update
         * @param {String} rowId - optional, id of the row to set the row selection
         * @inner
         */
        var setPreviousSelectedRows = function ($rowTable, rowId) {
            var isAllRowIdsAvailable = allRowIds.selectAllEnabled || allRowIds.selectAllReset || allRowIds.selectAllFiltered;
            if (conf.elements.tree) {  //ToDo: preselection needs to be revisited for infinite scrolling (with and without filtering)
                isPaginationSupported && isAllRowIdsAvailable && setSelectedRows($rowTable[0], rowId);
                var selectedRows = getSelectedRows();
                if (selectedRows.numberOfSelectedRows) {
                    var selectedRowIds = isAllRowIdsAvailable ? selectedRows.allRowIds : selectedRows.selectedRowIds;
                    selectedRows.selectedRowIds.forEach(function (rowId) {
                        if (lastSelectedRows.rowsInDom[rowId]) {
                            lastSelectedRows.rowsInDom[rowId].$checkbox[0].checked = true;
                            lastSelectedRows.rowsInDom[rowId].$row.addClass("selectedRow");
                        }
                    });
                    gridTable.jqGrid('setSelection', selectedRowIds[selectedRowIds.length - 1]);
                }
            } else {
                var rowTableId = $rowTable.attr("id");
                var isRowSelected = (isAllRowIdsAvailable && typeof(allRowIds.selectedRowIds[rowId]) != "undefined") ||
                    (selectedRowsByTables[rowTableId] && typeof(selectedRowsByTables[rowTableId][rowId]) != "undefined");
                if(isRowSelected) {
                    var selRowIds = $rowTable.jqGrid("getGridParam", "selarrrow");
                    if(hasRowIdInArray(selRowIds, rowId)) // Since the library messes up the selarrrow so updating the selarrrow before performing update on Grid SelectedRowsByTables hash
                        $rowTable.jqGrid('setSelection', rowId, false);
                    $rowTable.jqGrid('setSelection', rowId); //test with true
                }
            }
        };

        /**
         * Sets the current row state (from the default collapse to expand) as it was just before the page or the grid was reloaded. This feature is only available for grids that have columns collapseContent and groupContent property
         * @param {Object} $rowTable - table that holds the row that needs to be expanded
         * @param {Object} rowId - optional, id of the row to be expanded
         * @param {Object} $row - optional, id of the row to be expanded
         * @inner
         */
        var setPreviousExpandedRows = function ($rowTable, rowId, $row) {
            if (allRowIds.expandedRowIds) { //initialized in the addExpandCollapseRowListener method
                var expandRow = function ($expandTarget) {
                        $expandTarget.length && $expandTarget.trigger("click");
                    },
                    caratClass = "." + reservedElementClasses.rowCarat,
                    $carat;
                if (rowId) {
                    if (allRowIds.expandedRowIds[rowId]) {
                        $carat = $row.find(caratClass);
                        expandRow($carat);
                    }
                } else { //tree grid case, where data is available in lastSelectedRows.rowsInDom
                    for (var rowId in allRowIds.expandedRowIds) {
                        if (lastSelectedRows.rowsInDom[rowId]) { //if row is found in DOM
                            $carat = lastSelectedRows.rowsInDom[rowId].$row.find(caratClass);
                            expandRow($carat);
                        }
                    }
                }
            }
        };

        /**
         * Callback that is invoked when a cell is clicked
         * Provides:
         * - hot keys for grids with drag and drop
         * - no row selection when the expand/collapse icon is selected
         * - quick view event when the quickView icon is clicked
         * - row selection update when a row is clicked around the cell for row checkbox selection
         * @param {string} rowId - id of the row
         * @param {string} iCol - id of the column
         * @param {string} cellcontent - content of the cell
         * @param {Object} e - event Object
         * @inner
         */
        var cellSelect = function (rowId, iCol, cellcontent, e) {
            cellcontent = cellcontent.replace(/&nbsp;/g, '');
            var $gridTable = gridContainer.find("#" + this.id);
            var formattedRowId = gridConfigurationHelper.escapeSpecialChar(rowId);
            var $row = $gridTable.find("#" + formattedRowId);
            var $cell = $row.find(e.target);
            var $column = $cell.closest('td');
            var $rowExpandIcon = $row.find('.moreIcon');
            var $cell = $(e.target);
            var isCellCheckboxClicked = $cell.find('.cbox').length ? true : false || $cell.hasClass("tree_custom_checkbox"); //cell where the row checkbox is located

            if ($column.hasClass('multiselect_cell') && $rowExpandIcon.hasClass('moreContent') && (e.ctrlKey || e.metaKey || e.shiftKey)) {
                multiselectCell.selectCellsWithHotKey(e, $gridTable, $cell);
            } else if (!!(cellcontent) && ($column.hasClass('slipstreamgrid_more') || isElementClassInSuperset($(e.target), reservedElementClasses.morePill))) {
                $row.find('td .cellContent').toggleClass('moreContent');
                if (!isRowInEditMode($row) && $rowExpandIcon.hasClass('moreContent')) {
                    $gridTable.trigger('slipstreamGrid.row:expanded', $row);
                    $column.trigger('mouseenter');
                } else {
                    $gridTable.trigger('slipstreamGrid.row:collapsed', $row);
                }
            } else if (!!(cellcontent) && gridConfigurationHelper.getTargetElement($cell).hasClass('quickView')) {
                (rbacHash['quickViewEvent'] !== false ) && addQuickViewEvent(rowId, $row, $gridTable);
            } else if (e.target.className != ('cbox' || 'treeclick' || '') && !isCellCheckboxClicked && inlineEditRow) {
                var rowData = $(this).jqGrid('getRowData', rowId);

                var rawRow = conf.elements.tree ? originalRowData[formattedRowId] : $row.data('jqgrid.record_data');
                if ($row.hasClass(reservedElementClasses.rowNoSelectable) || conf.elements.editRow.isRowEditable && !conf.elements.editRow.isRowEditable(rowId, rawRow, rowData)) {
                    console.log('row is not editable because isRowEditable returned false');
                    columnSwitchOnHover && columnSwitchOnHover.toggleSwitchCol(gridContainer);
                } else if (isValidUpdatedRow()) {
                    lastSelectedRows.clickedCell = { //object that tracks which target was selected to put a row on edit  mode
                        "column": gridConfigurationHelper.getColumnName($column, this.id),
                        "$clickedCellTarget": $cell
                    };
                    if(!(e.ctrlKey || e.metaKey) && $row.attr("editable")!="1") {
                        updateRow(rowId, iCol);
                    }
                    var tdAttr = $row.find('td')[iCol].getAttribute('aria-describedby');
                    var $textArea = $row.find('[aria-describedby="' + tdAttr + '"] textarea');
                    $textArea && $textArea.trigger('click');
                    $gridTable.trigger('slipstreamGrid.row:editMode', $cell);
                }
            } else if(columnSwitchOnHover && !($cell.hasClass('cbox') || $cell.hasClass('treeclick') || $cell.hasClass('slipstreamgrid_switch_row_selection'))){
                columnSwitchOnHover.toggleSwitchCol(gridContainer);
            } else { //default case when a cell is clicked
                if (conf.elements.tree) {
                    lastSelectedRows.tempLastSelectedRowId = rowId;
                }
            }
        };

        /**
         * Builds an array of objects with the column name and the order (asc or desc) that are applied when one or more columns are sorted
         * @param {String} sortname - string that includes all columns and order that were sorted and it is available from the grid library internal object
         * @param {String} sortorder - string with order of the last column that was sorted and it is available from the grid library internal object
         * @inner
         */
        var buildSortArray = function (sortname, sortorder) {
            var sortArray = [],
                hasMultisortingString = !!~sortname.indexOf(sortorder, sortname.length - sortorder.length),
                sortingIndex = hasMultisortingString ? sortname : (sortname.trim() + " " + sortorder),
                column, columnName, columnIndex, i;
            sortingIndex = sortingIndex.split(',');
            for (i = 0; i < sortingIndex.length; i++) {
                column = sortingIndex[i].trim().split(' ');
                if (column[0] != 'asc' && column[0] != 'desc') { //verifies that the first element is a column and not a sort order
                        columnName = column[0].trim(),
                        columnIndex = _.pluck(sortArray, "column").indexOf(columnName);
                    if (~columnIndex) {
                        column[1] && (sortArray[columnIndex].order = column[1].trim());
                    } else {
                        sortArray.push({
                            "column": columnName,
                            "order": column[1] ? column[1].trim() : 'asc' //default to asc if the order is not available
                        });
                    }
                }
            }
            return sortArray;
        };

        var customSort = function (index, iCol, sortOrder) {
            var gridParam = gridTable.jqGrid('getGridParam'),
                sortName = gridParam.sortname,
                sortOrder = gridParam.sortorder,
                name = gridParam.colModel[iCol].name;
            gridTable.trigger("slipstreamGrid.updateConf:sort", {"config": buildSortArray(sortName, sortOrder)});
            if (_.isFunction(conf.elements.customSortCallback)) {
                conf.elements.customSortCallback(index, name, sortOrder, getSearchTokens());
                return 'stop';
            } else {
                return false;
            }
        };

        /**
         * Format the grouping configuration parameter from an array to one defined in jqGrid library for the groupingView parameter
         * @param {Array} groupingViewConf - configuration parameter for grouping the grid
         * @inner
         */
        var getGroupingViewParameter = function (groupingViewConf) {
            var getGroupParameter = function (conf, parameter) {
                var groupParameter = [];
                if (conf && conf.columns) {
                    var columns = conf.columns;
                    for (var i = 0; i < columns.length; i++) {
                        if (parameter == "text") {
                            groupParameter.push("<span>" + columns[i][parameter] + "</span>");
                        } else {
                            groupParameter.push(columns[i][parameter]);
                        }
                    }
                }
                return groupParameter;
            };
            var groupingViewParameter = {
                groupField: getGroupParameter(groupingViewConf, 'column'),
                groupOrder: getGroupParameter(groupingViewConf, 'order'),
                groupColumnShow: getGroupParameter(groupingViewConf, 'show'),
                groupText: getGroupParameter(groupingViewConf, 'text'),
                groupCollapse: groupingViewConf.collapse ? groupingViewConf.collapse : false
            };
            var groupSummary = [];
            groupingViewConf.columns.forEach(function (item) {
                groupSummary.push(false);
            });
            groupingViewParameter.groupSummary = groupSummary;
            return groupingViewParameter;
        };

        /**
         * Format the sorting configuration parameter from an array to one that the jqGrid library uses; for example: "job-status asc, percent-complete desc"
         * @param {Array} sortingOptions - configuration parameter for sorting the grid
         * @inner
         */
        var getGridSortingOptions = function (sortingOptions) {
            var formattedSortingOptions = '';
            for (var i = 0; i < sortingOptions.length; i++) {
                var colum = sortingOptions[i].column;
                var order = sortingOptions[i].order ? sortingOptions[i].order : 'asc';
                formattedSortingOptions += colum + ' ' + order + ',';
            }
            return formattedSortingOptions.slice(0, -1);
        };

        /**
         * Gets the jqgrid id of the last visible column (hidden:false) for the grid column model
         * @inner
         */
        var getLastVisibleColumn = function () {
            var colModel = gridTable.jqGrid('getGridParam', 'colModel');
            for (var iCol = colModel.length - 1; iCol >= 0; iCol--) {
                if (!colModel[iCol].hidden)
                    return iCol;
            }
        };

        /**
         * Gets the default operator
         * @param {Object} logic operators that defines in the serializeGridData callback
         * @inner
         */
        var getDefaultOps = function (operators) {
            if (conf.elements.filter && conf.elements.filter.readOnlySearch && conf.elements.filter.readOnlySearch.logicOperator && conf.elements.filter.readOnlySearch.logicOperator === 'or') {
                return operators.or;
            } else {
                return operators.and;
            }
        };

        /**
         * Extends jqGrid library to add data required to support lazy load
         * @param {Object} jqGridConf - the current grid configuration
         * @param {Object} gridSubset - subset of the grid configuration related to the navigation of the grid data
         * @inner
         */
        var extendConfiguration = function (jqGridConf, gridSubset) {
            var isLastVisibleColumn;
            $.extend(jqGridConf, {
                beforeRequest: function () {
                    if (jqGridConf.url || jqGridConf.getData) {
                        if (conf.elements.beforeSendRequest) {
                            jqGridConf.url = conf.elements.beforeSendRequest(conf.elements.url);
                            gridTable.setGridParam({url: jqGridConf.url});
                        }

                        gridSpinner && gridSpinner.showSpinner($(this).closest('.ui-jqgrid'));
                    }

                    //trigger to disable click for grid sorting
                    containers.$gridWidget && gridEvents.bindClickSorting(containers.$gridWidget);

                    //TreeGrid automatically change datatype to local when loading completed.
                    //Need to change datatype back to json for the remote sorting
                    if (jqGridConf.treeGrid) {
                        var dataType = gridTable.jqGrid('getGridParam', 'datatype');
                        jqGridConf.url && (dataType == 'local') && gridTable.setGridParam({datatype: 'json'});
                    }

                    if (conf.elements.tree && conf.elements.tree.getChildren && conf.elements.tree.initialLevelExpanded != "undefined") {
                        var gridParam = gridTable.jqGrid("getGridParam", "postData");

                        if (gridParam.n_level > parseInt(conf.elements.tree.initialLevelExpanded)) {
                            var node = {
                                expanded: gridParam.expanded,
                                nodeId: gridParam.nodeid,
                                parentId: gridParam.parentid,
                                n_level: gridParam.n_level
                            };
                            gridTable.setGridParam({datatype: 'local'}); //adding new children only works if the the datatype is local
                            conf.elements.tree.getChildren(node, addChildren);
                            return false;
                        }
                    }
                },
                serializeGridData: function (postData) {
                    var tokens, numberOfRows;
                    if (conf.elements.tree) {
                        gridTable.setGridParam({rowNum: conf.elements.numberOfRows});
                        postData.rows = conf.elements.numberOfRows;
                    }

                    if (isPaginationSupported) {
                        numberOfRows = gridPagination.getNumRows();
                    } else {
                        numberOfRows = jqGridConf.numberOfRows || postData.rows
                    }

                    var rowSeq = (postData.page - 1) * numberOfRows;

                    var pagingParameter = "(start eq " + rowSeq + ", limit eq " + numberOfRows + ")";
                    var postDataObj = {paging: pagingParameter, rows: numberOfRows};
                    if (postData.sidx) { //=(domain-id(descending),id(ascending)): support for multisorting
                        var sortingIndex = buildSortArray(postData.sidx, postData.sord),
                            sortingParameter = "(",
                            sortingOrder, i;

                        for (i = 0; i < sortingIndex.length; i++) {
                            sortingOrder = (sortingIndex[i].order == 'desc') ? 'descending' : 'ascending';
                            sortingParameter += sortingIndex[i].column + "(" + sortingOrder + "),";
                        }
                        sortingParameter = sortingParameter.slice(0, -1) + ")";
                        postDataObj.sortby = sortingParameter;

                        gridTable.trigger("slipstreamGrid.updateConf:sort", {"config": sortingIndex});
                    }

                    if (conf.elements.tree && conf.elements.tree.initialLevelExpanded) {
                        postDataObj.expanded = conf.elements.tree.initialLevelExpanded;
                    }

                    //adds: filter = (col2 eq 'val 4' and (col1 eq 'val1' or col1 eq 'val2' or col1 eq 'val3') and ...)
                    if (!(containers.$searchInput) || !(containers.$searchInput.val().trim())) delete postData['_search'];
                    if (conf.elements.filter) {

                        if (conf.search && _.isEmpty(filterOptions.getSearchWidgetInstance())) { //available only when the grid is loaded for the first time
                            filterOptions.search(conf.search, false); //creates a search widget instance and adds the tokens defined in conf.search
                        }

                        if (containers.$searchContainer.children().length) {
                            var filter = "(",
                                search = "",
                                operators = {
                                    and: " and ",
                                    or: " or ",
                                    contains: " contains ",
                                    equal: " eq ",
                                    notEqual: " ne ",
                                    less: " lt ",
                                    lessEq: " le ",
                                    greater: " gt ",
                                    greaterEq: " ge "
                                };

                            tokens = filterOptions.getSearchTokens();
                            var originalTokens = tokens;
                            var defaultOperator = getDefaultOps(operators);
                            if (typeof(conf.elements.filter.onBeforeSearch) == "function") {
                                tokens = conf.elements.filter.onBeforeSearch(filterOptions.getSearchTokens());
                            }
//                            console.log(tokens);

                            var searchableColumns = gridFormatter.getSearchableColumns();
                            for (var searchColumnKey in searchableColumns) { //ToDo: test if it can be deleted or comment usage
                                delete postData[searchColumnKey];
                            }

                            var searchTokens = [];
                            var filterTokens = '';
                            var tokenConnectors = [' = ', '!= ', ' >= ', ' <= '];
                            var findConnector = function (token) {
                                for (var i = 0; i < tokenConnectors.length; i++) {
                                    if (~token.indexOf(tokenConnectors[i])) {
                                        return tokenConnectors[i];
                                    }
                                }
                                return null;
                            };

                            var isOriginalToken = function (token) {
                                if (~originalTokens.indexOf(token))
                                    return true;
                                return false;
                            };

                            if (conf.elements.filter.advancedSearch) {
                                postDataObj['filterTokens'] = tokens;
                            } else {
                                tokens.forEach(function (token) {
                                    var filterToken;
                                    var connector = findConnector(token);

                                    if (!isOriginalToken(token)) {
                                        filterTokens += token + defaultOperator;
                                    } else if (connector) { //key, value pair
                                        var keyValue = token.split(connector);
                                        var key = keyValue[0],
                                            values = keyValue[1];

                                        var searchType = searchableColumns[key];

                                        var parseValueString = function (values, operator) {
                                            // parse comma separated values to include logical operator
                                            if (values && ~values.indexOf(',')) { //multiple values
                                                filterToken = "(";
                                                values.split(',').forEach(function (value) {
                                                    filterToken += key + operator + "'" + value + "'" + operators.or;
                                                });
                                                filterToken = filterToken.slice(0, -operators.or.length) + ')';
                                            } else {
                                                filterToken = key + operator + "'" + values + "'";
                                            }
                                            return filterToken;
                                        };

                                        switch (searchType) {
                                            case 'dropdown':
                                                var updatedValueString = "",
                                                    tokenValues = values.split(',');

                                                var columnDetails = columnConfigurationHash[key];
                                                if (columnDetails && columnDetails.searchCell && _.isArray(columnDetails.searchCell.values)) {
                                                    searchCellValueHash = gridConfigurationHelper.buildColumnSearchCellHash(key, columnDetails.searchCell);
                                                    var currentColumnSearchCellHash = searchCellValueHash[key];
                                                    $.each(tokenValues, function (index, tokenElement) {
                                                        updatedValueString = updatedValueString.length > 0 ? updatedValueString + "," : updatedValueString;
                                                        updatedValueString = updatedValueString + currentColumnSearchCellHash[tokenElement];
                                                    });
                                                    // replace the 'values' with updated value from config
                                                    values = updatedValueString;
                                                }
                                                filterToken = parseValueString(values, operators.equal);
                                                break;
                                            case 'number':
                                                if (~token.indexOf(' = ')) {
                                                    var numberRange = values.split(' - ');

                                                    if (numberRange.length == 1) {
                                                        // not a range
                                                        filterToken = key + operators.equal + values;
                                                    } else {
                                                        // range value
                                                        var rangeFrom = numberRange[0];
                                                        var rangeTo = numberRange[1];

                                                        if (numberRange[0] > numberRange[1]) {
                                                            rangeFrom = numberRange[1];
                                                            rangeTo = numberRange[0];
                                                        }
                                                        filterToken = "(" + key + operators.greaterEq + rangeFrom + defaultOperator + key + operators.lessEq + rangeTo + ")";
                                                    }
                                                } else if (~token.indexOf(' >= ')) {
                                                    filterToken = key + operators.greaterEq + values;
                                                } else if (~token.indexOf(' <= ')) {
                                                    filterToken = key + operators.lessEq + values;
                                                }
                                                break;
                                            case 'date':
                                                if (~token.indexOf(' Before ')) {
                                                    var dateValues = dateFormatter.formatDateTime(values.split('Before ')[1]);
                                                    filterToken = "(" + key + operators.lessEq + "timestamp('" + dateValues + "'))";
                                                } else if (~token.indexOf(' After ')) {
                                                    var dateValues = dateFormatter.formatDateTime(values.split('After ')[1]);
                                                    filterToken = "(" + key + operators.greaterEq + "timestamp('" + dateValues + "'))";
                                                } else if (~token.indexOf(' - ')) {
                                                    var dateRange = values.split(' - '); //Range
                                                    var rangeFrom = dateFormatter.formatDateTime(dateRange[0]);
                                                    var rangeTo = dateFormatter.formatDateTime(dateRange[1]);
                                                    filterToken = "(" + key + operators.greaterEq + "timestamp('" + rangeFrom + "')" + defaultOperator + key + operators.lessEq + "timestamp('" + rangeTo + "'))";
                                                } else {
                                                    var dateValues = dateFormatter.formatDateTime(values);
                                                    filterToken = "(" + key + operators.equal + "timestamp('" + dateValues + "'))";
                                                }
                                                break;
                                            default:
                                                filterToken = parseValueString(values, operators.contains);
                                                break;
                                        }
                                        filterTokens += filterToken + defaultOperator;
                                    } else { //only value
                                        searchTokens.push(token)
                                    }
                                });
                                filter += filterTokens.slice(0, -defaultOperator.length) + ")";
                                if (searchTokens.length == 1) {
                                    search += searchTokens[0];
                                } else {
                                    search += "(" + searchTokens.map(function (val) {
                                        return "(" + val + ")"
                                    }).join(defaultOperator) + ")";
                                }

                                if (filterTokens) postDataObj['filter'] = filter;
                                if (searchTokens.length) postDataObj['_search'] = search;
                                console.log(postDataObj);

                            }// end else
                        }
                    }

                    var newPostData;
                    if (typeof(conf.elements.postData) == 'function')
                        newPostData = conf.elements.postData($.extend(postData, postDataObj));

                    if (conf.elements.urlMethod == "POST") {//overwrites data for POST method
                        newPostData = newPostData || $.extend(postData, postDataObj);
                        return JSON.stringify(newPostData);
                    } else if (conf.elements.reformatUrl) {//overwrites data for GET method
                        var newGetUrl = conf.elements.reformatUrl($.extend(postData, postDataObj));
                        return $.param(newGetUrl);
                    }

                    return $.param($.extend(postData, postDataObj));
                },
                beforeProcessing: function (data, status, xhr) {
                    var gridKey = $("#gbox_" + tableId).parents('.grid-widget').attr('data-slipstream-grid-key');

                    if (gridKey != requestKey) {
                        return false;
                    }
                    if (typeof(conf.elements.reformatData) == 'function') {
                        data = conf.elements.reformatData(data);
                    }
                    if (gridSubset.scroll) {
                        var records = gridSubset.jsonRecords ? gridSubset.jsonRecords(data, this.id) : 0;
                        data['page'] = $(this).getGridParam('page');
                        data['total'] = gridSubset.numberOfRows ? Math.ceil(records / gridSubset.numberOfRows) : 0;
                        data['records'] = records;

                        //Only need this for the treeGrid because the records is not accurate in the jgGrid library
                        if (isPaginationSupported) {
                            var numRows = gridPagination.getNumRows();
                            data['total'] = (records === 0) ? 1 : Math.ceil(records / numRows);
                            gridPagination.updatePagination(data);
                        } else if (conf.elements.tree) {
                            gridTable.setGridParam({treeRecords: records});
                        }
                    }
                    var originalData = dataFormatter.formatJSONData(conf, data);

                    for (var i = 0; originalData && i < originalData.length; i++) {
                        var rowObj = originalData[i];

                        if (conf.elements.tree) { //adds expanded attribute if the row should be expanded
                            var isExpanded = rowObj[conf.elements.tree.level] <= conf.elements.tree.initialLevelExpanded;
                            if (isExpanded) {
                                rowObj.expanded = true;
                            }
                        }

                        for (var key in data) {
                            if (!$.isArray(data[key])) {
                                rowObj[key] = data[key];
                            }
                        }
                    }
                },
                resizeStart: function (w, i) {
                    isLastVisibleColumn = getLastVisibleColumn() == i;
                    //fixes jqgrid bug related to resizing the last column of a grid
                    if (isLastVisibleColumn) {
                        !containers.$gridLibraryWrapper && (containers.$gridLibraryWrapper = gridContainer.find('.ui-jqgrid'));
                        containers.$gridLibraryWrapper
                            .addClass("lastColumnResizing")
                            .width(gridTable.outerWidth());
                    }
                },
                resizeStop: function (w, i) {
                    //fixes jqgrid bug related to resizing the last column of a grid
                    if (isLastVisibleColumn) {
                        containers.$gridLibraryWrapper
                            .removeClass("lastColumnResizing")
                            .attr("style", "width: " + containers.$gridLibraryWrapper.width() + "px !important");
                    }
                    $(this).jqGrid("setGridWidth", this.grid.newWidth, false);
                    gridContainer.trigger('slipstreamGrid.resized:width', true); //jqGrid by default saves the column area when rendering the grid; so that, the grid needs to be resized.
                    gridTable.trigger('slipstreamGrid.resized:gridColumn');
                    gridTable.trigger('slipstreamGrid.updateConf:columns');
                }
            });
            return jqGridConf;

        };

        /**
         * Checks if one or more of the classes of the element belongs to an array of classes
         * @param {Object} $ele - jQuery Object of the element to be tested
         * @param {array} supersetClasses - Array of strings with the classes name that could represent a superset for the element classes
         * @inner
         */
        var isElementClassInSuperset = function ($ele, supersetClasses) { //tests if the element clicked is not part of the reserved elements that don't update row selection
            var elementClasses = gridConfigurationHelper.getTargetElementClassList($ele);
            if (elementClasses) {
                return _.intersection(elementClasses, supersetClasses).length >= 1;
            }
            return false;
        };

        /**
         * Adds a context menu when a row is selected
         * @param {Object} jqGridConf - the current grid configuration
         * @param {Object} gridConfiguration - configuration of the filtered grid
         * @inner
         */
        var extendOnSelectRow = function (jqGridConf, gridConfiguration) {
            var isRightClickSelected,
                rowSelectionNoUpdateClasses = _.union(reservedElementClasses.morePill, reservedElementClasses.moreIcon);
            conf.elements.rowHoverMenu && rowSelectionNoUpdateClasses.push(reservedElementClasses.rowHoverAction); //clicking an action from the row hover menu shouldn't change the row selection

            $.extend(jqGridConf, {
                rowattr: function (rowData, currentObj, rowId) {
                    var rowKey = gridConfigurationHelper.escapeSpecialChar(rowId);
                    if (conf.elements.tree) originalRowData[rowKey] = currentObj;

                    //sets disabled and enabledRowInteraction required classes
                    var rowAttrClass = '';
                    if ((gridConfiguration.subGrid && rowData[gridConfiguration.subGrid.disableColumn]) ||
                        rowData[gridConfiguration.disableColumn]) {
                        rowAttrClass += "rowDisabled " ;
                    }
                    if (_.isFunction(conf.elements.enabledRowInteraction) && !conf.elements.enabledRowInteraction(rowId, rowData)) {  //adds rowNoSelectable class which will disable row selection, edition, context menu and drag and drop
                        rowAttrClass += reservedElementClasses.rowNoSelectable;
                    }

                    if (rowAttrClass != '') {
                        return {class: rowAttrClass};
                    }
                },
                beforeSelectRow: function (rowId, e) {
                    var ele = e.target,
                        $ele = $(ele),
                        $row = $(this).find("#" + rowId);

                    $ele.focus(); //Firefox issue: to set focus on checkbox.

                    //checks to prevent row selection
                    if (_.isElement($ele.closest(".hoverMenu-wrapper")[0])) { //on click of the row hover menu, do not select the row
                        return false;
                    }
                    if ($row.hasClass(reservedElementClasses.rowNoSelectable)) { //row is not selectable
                        $ele.hasClass("cbox") && $ele.prop("checked", false);
                        return false;
                    }
                    if (isElementClassInSuperset($ele, rowSelectionNoUpdateClasses) || isElementClassInSuperset($ele, reservedElementClasses.cellWithNoSelectable) ) { //if the element has a class that belongs to a reserved one, then no row selection should happen
                        return false;
                    }
                    if (multiselectCell && multiselectCell.isMultiselectCell($ele)) {
                        return false; // Do not select the row when draggable cell checkbox or its label is clicked
                    }
                    var isValidSelection = updateBeforeSelectRow(rowId, e);
                    if (conf.elements.tree) {
                        var isSelectAllChecked = containers.$selectAllCheckbox.is(':checked'),
                            isCheckbox = $ele.hasClass("tree_custom_checkbox"),
                            isRowCheckbox = isValidSelection && ($ele.parent().hasClass("tree_custom_checkbox") || isCheckbox);
                        if (isSelectAllChecked) {
                            if (!isRowCheckbox) {
                                unselectAllTreeRows();
                            } else {
                                allRowIds.selectAllReset = true;
                                allRowIds.selectAllEnabled = false;
                                allRowIds.selectAllFiltered = false;
                            }
                            containers.$selectAllCheckbox.attr('checked', false);
                        } else if (allRowIds.selectAllReset) {
                            (!isRowCheckbox) && unselectAllTreeRows();
                        }
                        if (isRowCheckbox) { //triggers row selection for custom checkbox
                            lastSelectedRows.tempLastSelectedRowId = rowId;
                            if (isCheckbox) { //simulates row selection in tree grid when selection happens on cell outside the cbox_tree checkbox
                                gridTable.jqGrid('setSelection', rowId, false);
                                var treeRowSelection = $ele.find('input').prop('checked');
                                $ele.find('input').prop('checked', !treeRowSelection);
                            } else {
                                gridTable.jqGrid('setSelection', rowId, true);
                            }
                        }
                    }
                    if (isValidSelection && e && (e.ctrlKey || e.metaKey)) { // multiselect rows with hot keys.
                        gridTable.jqGrid('setSelection', rowId, true);
                        
                        return false;
                    }
                    return isValidSelection;
                },
                onSelectRow: function (rowId, rowStatus, e) {
                    if (e) {  //when multiple rows are selected and a row already selected is clicked then the previous selection is removed and the current one is kept
                        var $ele = $(e.target);
                        if (conf.elements.tree) {
                            var $row = $(this).find("#" + rowId);
                            if ($row.hasClass(reservedElementClasses.rowNoSelectable)) { //only in the case of tree grid, the onSelectRow callback is invoked when onRightClickRow happens. In this case, rowNoSelectable needs to be checked so the row selection doesn't happen when a row is not selectable (defined by enabledRowInteraction callback)
                                return;
                            }
                            if (!$ele.hasClass('tree_custom_checkbox')) {
                                var isRowSelected = selectedRowsByTables[this.id] ? typeof(selectedRowsByTables[this.id][rowId]) != "undefined" : false;
                                if (isRowSelected && e.type != "contextmenu") { //reset row selection only if it is not right click
                                    resetSelectedRows(this);
                                }
                            }
                        } else {
                            if (!$ele.hasClass('cbox')) {
                                selectedRowsByTables[this.id] = {};
                                resetSelectedRows(null, true);
                            }
                        }
                    }
                    lastSelectedRows.lastSelectedRowId = rowId;
                    setSelectedRows(this, rowId, rowStatus); //rowStatus doesn't seem reliable in the tree grid
                },
                onRightClickRow: function (rowId, rowStatus, isRightClick, e) {
                    if (e.slipstreamContextMenu)  return true;

                    if (_.isElement($(e.target).closest(".hoverMenu-wrapper")[0])) { //on click of the row hover menu, do not select the row
                        return true;
                    }

                    var $rowTable = gridContainer.find("#" + this.id),
                        $row = $rowTable.find("#" + rowId),
                        columnIndex = $(e.target).closest("td").index(),
                        contextMenuId = "#" + this.id + " #" + rowId,
                        rightClick = (e.which === 3),
                        controlClick = (e.ctrlKey && e.which === 1);

                    if ($row.hasClass(reservedElementClasses.rowNoSelectable)) { //row without context menu
                        return;
                    }
                    if (conf.elements.tree && !conf.elements.tree.parentSelect && isTreeNode(rowId, $rowTable, true)) //no context menu for node rows with not parent select attribute
                        return;

                    var selectedRowsByTable = getGridParameterForSelectedRows($rowTable, rowId);
                    var isRowSelected = typeof(selectedRowsByTable[rowId]) != "undefined";

                    inlineEditRow && saveRow();

                    var setSelectedRow = function (rowId) {
                        if (conf.elements.tree) {
                            gridTable.trigger('jqGridBeforeSelectRow');
                        } else {
                            $rowTable.jqGrid('setSelection', rowId);
                        }
                    };

                    if (_.isEmpty(selectedRowsByTable)) {
                        setSelectedRow(rowId);
                    } else if (!isRowSelected) {
                        $rowTable.jqGrid('resetSelection');
                        resetSelectedRows(this);
                        allRowIds.selectAllEnabled = false;
                        allRowIds.selectAllReset = false;
                        setSelectedRow(rowId);
                    }

                    setSelectedRows(this, rowId, rowStatus);

                    e.preventDefault();
                    if (rightClick || controlClick) {
                        var contextMenuPos = { x: e.pageX, y: e.pageY};
                        menuFormatter.addRowContextMenu(contextMenuId, getSelectedRows, columnIndex, contextMenuPos);
                    }
                }
            });
            registerMenuEventsHandlers(gridConfiguration);
            return jqGridConf;
        };

        /**
         * Updates the row selection status to false if validation has failed for inline editing or true otherwise
         * In the case of not tree grid, the row selection is set using setSelection of jqgrid. Tree grid uses custom checkbox for row selection; therefore custom row selection is implemented in beforeSelectRow after the isValidSelection method is invoked
         * @param {String} rowId - id of the row
         * @param {Object} event - Dom event triggered by the selection of a row
         * @inner
         */
        var updateBeforeSelectRow = function (rowId, event) {
            var isEditInputClicked = false,
                isRowSelectionClicked = false,
                inlineInputElements = ['input', 'textarea', 'select'],
                isSimpleGridCellCheckboxClicked = false,
                isTreeGridCellCheckboxClicked = false,
                $row, $updatedRow;

            if (event) {
                var $ele = $(event.target)
                if ($ele.find('.cbox').length) {
                    isSimpleGridCellCheckboxClicked = true;
                } else if ($ele.hasClass("tree_custom_checkbox")) {
                    isTreeGridCellCheckboxClicked = true;
                }
            } else {
                $row = gridTable.find("#" + rowId);
                if ($row.find(".cbox").length) {
                    isSimpleGridCellCheckboxClicked = true;
                } else if ($row.find(".tree_custom_checkbox")) {
                    isTreeGridCellCheckboxClicked = true;
                }
            }

            if (inlineEditRow) {
                if (event) {
                    isRowSelectionClicked = $ele.hasClass('cbox') || isSimpleGridCellCheckboxClicked || $ele.parent().hasClass('tree_custom_checkbox') || isTreeGridCellCheckboxClicked;
                    isEditInputClicked = inlineInputElements.indexOf(event.target.nodeName.toLowerCase()) != -1 || $ele.closest('.editable').length != 0;
                }
                if (isRowSelectionClicked || !isEditInputClicked) {
                    var isValid = isValidUpdatedRow(rowId, isRowSelectionClicked);
                    if (isValid) {
                        $updatedRow = saveRow();
                        if (_.isUndefined($updatedRow) && isSimpleGridCellCheckboxClicked) { //if a row was not found in edit mode then allow the area around the checkbox to select a row, only applicable for non tree grids
                            gridTable.jqGrid('setSelection', rowId);
                            return false;
                        }
                        return true;
                    }
                }
            } else {
                // PR-1346808: Following 5 lines to be removed and fix needs to be done in gridKeyEventHandler.js
                // The selectRow callback depends on the selarrrow value to update the state of a checkbox so to fix selarrrow we need to check if the value is already selected then add it to selarrrow of library if it does not have one
                var $row = gridTable.find('#' + rowId),
                    selRowIds = gridTable.jqGrid("getGridParam", "selarrrow");
                if($row.hasClass('selectedRow') && !hasRowIdInArray(selRowIds, rowId)) {
                    gridTable.jqGrid('setSelection', rowId, false);
                }
                if (isSimpleGridCellCheckboxClicked) { //update row selection even if the click happens outside the row selection checkbox but inside the cell, only applicable for non tree grids
                    gridTable.jqGrid('setSelection', rowId);
                    return false;
                }
                return true;
            }
            return false;
        };

        /**
         * Extends the jqGrid library by overwriting the beforeSelectRow and selectRow parameters to allow single row selections
         * @param {Object} jqGridConf - the current grid configuration
         * @inner
         */
        var extendOnSingleRowSelection = function (jqGridConf) {
            var tempRowId = null;
            $.extend(jqGridConf, {
                beforeSelectRow: function (rowId, e) {
                    if (tempRowId != rowId) {
                        $(this).jqGrid('resetSelection');
                        selectedRowsByTables[this.id] = {};
                    }
                    tempRowId = rowId;
                    if (conf.elements.tree) {
                        var $checkbox = getTreeRowCheckbox(rowId);
                        var rowStatus = $checkbox.is(':checked');
                        unselectAllTreeRows();
                        if (rowStatus) {
                            setSelectedRows(this, rowId, rowStatus);
                        } else {
                            resetSelectedRows(this);
                            updateGridSelectionCount();
                        }
                    }
                    return true;
                },
                onSelectRow: function (rowId, rowStatus) {
                    setSelectedRows(this, rowId, rowStatus);
                }
            });
            return jqGridConf;
        };

        var addGridEventListener = function () {
            var isCollectionSimpleGrid = isCollectionDataGrid &&  _.isUndefined(conf.elements.tree),
                firstGridPageRendered = false,
                gridHeaderLayout = self.getGridHeaderLayout(),
                $scrollContainer = gridTable.closest(".ui-jqgrid-bdiv > div");
            !containers.$gridWidget && (containers.$gridWidget = gridTable.parents('.grid-widget'));

            /**
             * Provides all the pages that need to be rendered in order to render some specific page (pageNumber).
             * In virtual scrolling, when user scroll to a specific location/page, some other page can be partially shown depending on the scroll position, so a request for a page involves requesting the previous, current and next page, when available.
             * @param {string} page -  number of the page that needs to be rendered
             * @param {string} numberOfPages -  number of pages available in the grid
             * @return an Array with the pages that needs to be rendered
             */
            var getRequiredPages = function (pageNumber, numberOfPages) {
                if (pageNumber == 1) {
                    if (firstGridPageRendered) {
                        return [1, 2]
                    } else {//first time the grid is rendered
                        return [1]
                    }
                } else if (pageNumber < numberOfPages) {
                    return [pageNumber - 1, pageNumber, pageNumber + 1];
                } else {
                    return [pageNumber - 1, pageNumber];
                }
            };

            gridTable
                .bind("jqGridBeforeRequest", function (e) {
                    var gridParam = gridTable.jqGrid("getGridParam"),
                        pageNumber = gridParam.page,
                        numberOfPages = gridParam.lastpage,
                        requestData = {
                            "pageRequest": pageNumber,
                        };

                    if (isCollectionSimpleGrid) {
                        var pages = getRequiredPages(pageNumber, numberOfPages),
                            scrollPosition = self.getScrollPosition();
                        requestData.pages = pages;
                        console.log("requested page: " + pageNumber + ", required pages: " + " pages: " + pages);

                        var outerHeight = $scrollContainer.height();
                        gridTable.setGridParam({datatype: 'collection'});//sets to a datatype different than local so jqgrid does not try to add local data (empty first page) that comes from the datatype local
                        gridTable.jqGrid('clearGridData');
                        $scrollContainer.height(outerHeight);
                        $(gridTable[0].grid.bDiv).scrollTop(scrollPosition);

                        var isSearchWidgetBuilt = filterOptions.isSearchWidgetBuilt();

                        _.extend(requestData, {
                            "search": isSearchWidgetBuilt ? filterOptions.getSearchTokens(): [],
                            "pageSize": gridTable.getGridParam('rowNum').toString()
                        });

                        gridTable.trigger('slipstreamGrid.loadCollectionData', requestData);
                    }
                    
                    gridSpinner && gridSpinner.showSpinner(gridContainer);
                    gridTable.trigger("gridOnPageRequest", requestData);
                    firstGridPageRendered = true;
                    //grid widget expects result to be false or stop in case loading needs to be stopped.
                    return requestData.result === false || requestData.result === 'stop' ? requestData.result : true;
                })
                .bind("jqGridAfterInsertRow", function (e) {
                    if (typeof(conf.elements.url) == 'undefined' && !firstGridPageRendered) {
                        numCollectionRecords && numCollectionRecords--;
                        if (numCollectionRecords == 0) {
                            gridSizeCalculator.calculateGridHeight(true, true);
                            numCollectionRecords = -1;
                        }
                    }
                });

            if(isPaginationSupported) {
                gridTable.on("SlipstreamGrid.pageChanges:grid", function() {
                    treeGridRowNumberCount = 0;
                    $(this).trigger("SlipstreamGrid.resetShiftClickParameters:grid");
                });
            }
            //listens for a row that goes to inline edition
            if (inlineEditRow) {
                var editCellTypeColumns = gridConfigurationHelper.getColumnsWithProperty("editCell.type") || [],
                    collapseContentColumns = gridConfigurationHelper.getColumnsWithProperty("collapseContent") || [],
                    editableColumns = editCellTypeColumns.concat(_.filter(collapseContentColumns, function (column) {
                        return !column.editCell;
                    }));
                if (editableColumns.length) {
                    var editableCells = {},
                        tableId, $row;
                    gridTable.bind("jqGridInlineEditRow", function (evt, rowId) {
                        tableId = this.id;
                        $row = $(this).find("#" + rowId);
                        editableColumns.forEach(function (editableColumn) {
                            editableCells[editableColumn.name] = {
                                "$cell": gridConfigurationHelper.getCell($row, tableId, editableColumn.name),
                                "configuration": editableColumn
                            }
                        });
                        if (lastSelectedRows.clickedCell && editableCells[lastSelectedRows.clickedCell.column]) { //checks if cell that was clicked belongs to a cell that is editable
                            editableCells[lastSelectedRows.clickedCell.column].$clickedCellTarget = lastSelectedRows.clickedCell.$clickedCellTarget;
                        }

                        gridTable.trigger("slipstreamGrid.edit:inlineEditRow", editableCells);
                    });
                }
            }

            gridContainer.bind("slipstreamGrid.resized:gridWidth", function () {
                if (gridHeaderLayout && !_.isEqual(gridHeaderLayout.columns, self.getGridHeaderLayout().columns)) {
                    gridHeaderLayout = self.getGridHeaderLayout();
                    containers.$gridWidget.trigger("slipstreamGrid.resized:gridTable", {
                        "gridHeaderLayout": gridHeaderLayout
                    })
                }
            });
        };

        /**
         * Extend jsonReader configuration
         * @param {Object} jqGridConf - the current grid configuration
         * @param {Object} gridConfiguration - configuration of the grid
         * @inner
         */
        var extendJsonReader = function (jqGridConf, gridConfiguration) {
            if (jqGridConf.datatype == 'local') {
                _.extend(jqGridConf, {
                    localReader: {
                        repeatitems: (gridConfiguration.repeatitems || gridConfiguration.jsonId) ? true : false,
                        id: gridConfiguration.jsonId
                    },
                    ignoreCase: true
                });
            } else {
                _.extend(jqGridConf, {
                    jsonReader: {
                        root: gridConfiguration.jsonRoot,
                        repeatitems: (gridConfiguration.repeatitems || gridConfiguration.jsonId) ? true : false,
                        id: gridConfiguration.jsonId,
                        page: gridConfiguration.page,
                        records: gridConfiguration.jsonRecords
                    }
                });
            }
            return jqGridConf;
        };

        /**
         * Register event handlers for each element of the context menu and the action container
         * @inner
         */
        var registerMenuEventsHandlers = function (gridConfiguration) {
            registerActionEventsHandlers();
            gridContainer
                .unbind("slipstreamGrid.edit").bind("slipstreamGrid.edit", function (e, rowObj) {
                    updateRow(); //no argument passed since it relies on selected row
                })
                .unbind("slipstreamGrid.enable").bind("slipstreamGrid.enable",function (e, rowObj) {
                    var statusColumn = gridConfiguration.subGrid ? gridConfiguration.subGrid.disableColumn : gridConfiguration.disableColumn;
                    (rbacHash['statusEvent'] !== false ) && updateRowStatus('enable', statusColumn);
                }).unbind("slipstreamGrid.disable").bind("slipstreamGrid.disable", function (e, rowObj) {
                    var statusColumn = gridConfiguration.subGrid ? gridConfiguration.subGrid.disableColumn : gridConfiguration.disableColumn;
                    (rbacHash['statusEvent'] !== false ) && updateRowStatus('disable', statusColumn);
                })
                .unbind("slipstreamGrid.createBefore").bind("slipstreamGrid.createBefore", function (e, rowObj) {
                    (rbacHash['createEvent'] !== false ) && createInlineRowFromContextMenu(rowObj.row, 'before');
                })
                .unbind("slipstreamGrid.createAfter").bind("slipstreamGrid.createAfter", function (e, row) {
                    (rbacHash['createEvent'] !== false ) && createInlineRowFromContextMenu(rowObj.row, 'after');
                })
                .unbind("slipstreamGrid.delete").bind("slipstreamGrid.delete", function (e, rowObj) {
                    (rbacHash['deleteEvent'] !== false ) && confirmationDialogBuilder.deleteRow(getSelectedRows(), deleteRows, _.bind(self.reloadGrid, self));
                })
                .unbind("slipstreamGrid.copy").bind("slipstreamGrid.copy", function (e, rowObj) {
                    var $row = rowObj.selectedRowsDom ? rowObj.selectedRowsDom[0] : $(rowObj.row); //copy one row at a time
                    (rbacHash['copyEvent'] !== false ) && copyRow($row);
                })
                .unbind("slipstreamGrid.pasteBefore").bind("slipstreamGrid.pasteBefore", function (e, rowObj) {
                    (rbacHash['pasteEvent'] !== false ) && createInlineRowFromContextMenu(rowObj, 'before', true);
                })
                .unbind("slipstreamGrid.pasteAfter").bind("slipstreamGrid.pasteAfter", function (e, rowObj) {
                    (rbacHash['pasteEvent'] !== false ) && createInlineRowFromContextMenu(rowObj, 'after', true);
                })
                .unbind("slipstreamGrid.quickView").bind("slipstreamGrid.quickView", function (e, rowObj) {
                    (rbacHash['quickViewEvent'] !== false ) && addQuickViewEvent();
                })
                .unbind("slipstreamGrid.clearAllEvent").bind("slipstreamGrid.clearAll", function (e, rowObj) {
                    (rbacHash['clearAllEvent'] !== false ) && clearAllSelection(rowObj.row);
                });

            var createInlineRowFromContextMenu = function (row, location, isCopy) {
                var $row = row.selectedRowsDom ? row.selectedRowsDom[0] : $(row.row),
                    rowId = $row.attr('id'),
                    $rowTable = $row.closest('table');

                $rowTable.jqGrid('setSelection', rowId, false);
                setSelectedRows($rowTable[0], rowId, false);
                createInlineRow($row, location, $rowTable, isCopy && copiedRows[0]);//TODO: update to support multiple copies with no edition
            };

            if (gridConfiguration.contextMenu) {
                if (gridConfiguration.contextMenu.custom)
                    addCustomMenuItemEvent(gridConfiguration.contextMenu.custom);
                gridConfiguration.columns.forEach(function (column) {
                    if (column.contextMenu && column.contextMenu.custom) {
                        addCustomMenuItemEvent(column.contextMenu.custom);
                    }
                });
            }
            if (gridConfiguration.filter) {
                if (gridConfiguration.filter.showFilter && gridConfiguration.filter.showFilter.customItems)
                    addCustomMenuItemEvent(gridConfiguration.filter.showFilter.customItems);
                if (gridConfiguration.filter.advancedSearch && gridConfiguration.filter.advancedSearch.save)
                    addCustomMenuItemEvent(gridConfiguration.filter.advancedSearch.save);
            }
        };

        var addCustomMenuItemEvent = function (customMenu) {
            var bindCustomMenuItemEvent = function (key) {
                gridContainer.unbind('slipstreamGrid.' + key).bind('slipstreamGrid.' + key, function (evt, menuData) {
                    var customMenuKey = evt.namespace,
                        eventData = getSelectedRows(),
                        gridTableId, $cell, $selectedCellItems, selectedCellItems, $cellItem;

                    if (menuData && menuData.columnModel) {
                        eventData.cellColumn = {
                            name: menuData.columnModel.name,
                            index: menuData.columnModel.index
                        };
                        if (eventData.numberOfSelectedRows == 1) {
                            gridTableId = $(this).find(".gridTable").attr("id");
                            $cell = gridConfigurationHelper.getCell($(menuData.row), gridTableId, menuData.columnModel.name);
                            eventData.cellColumn.$cell = $cell;
                            if (multiselectCell) {
                                $selectedCellItems = multiselectCell.getSelectedCellItems($cell);
                                if ($selectedCellItems.length) {
                                    selectedCellItems = {
                                        $itemDom: [],
                                        itemValue: []
                                    };
                                    $selectedCellItems.forEach(function (cellItem) {
                                        $cellItem = $(cellItem);
                                        selectedCellItems.$itemDom.push($cellItem);
                                        selectedCellItems.itemValue.push($cellItem.text());
                                    });
                                    eventData.cellColumn.selectedCellItems = selectedCellItems;
                                }
                            }
                        }
                    }

                    if (conf.actionEvents && conf.actionEvents[customMenuKey]) {
                        if (_.isString(conf.actionEvents[customMenuKey])) {
                            gridTable.trigger(conf.actionEvents[customMenuKey], eventData)
                        } else {
                            (rbacHash[customMenuKey] !== false) && gridTable.trigger(conf.actionEvents[customMenuKey]['name'], eventData)
                        }
                    }
                });
            };
            for (var i = 0; customMenu && i < customMenu.length; i++) {
                var item = customMenu[i];
                if (item.items) { //has submenu
                    for (var j = 0; j < item.items.length; j++) {
                        var subMenu = item.items[j];
                        bindCustomMenuItemEvent(subMenu.key);
                    }
                } else {
                    bindCustomMenuItemEvent(customMenu[i].key);
                }
            }
        };

        var resetSelectedRows = function (rowTable, resetAll) {
            if (rowTable) {
                var $rowTable = $(rowTable),
                    $selectedRows = $rowTable.find('tr.selectedRow');
                $selectedRows.removeClass('selectedRow').removeClass('ui-state-highlight').attr('aria-selected', false);
                if (conf.elements.tree) {
                    $rowTable.find('.tree_custom_checkbox>input:checked').attr('checked', false);
                    selectedRowsInTree = {};
                } else {
                    $selectedRows.find('.cbox').prop('checked', false);
                    selectedRowsByTables[rowTable.id] = {};
                }
            } else {
                selectedRowsByTables = {};
                selectedRowsInTree = {};
            }
            if (allRowIds.selectAllEnabled) {
                allRowIds.unselectedRowIds = {};
                allRowIds.selectedRowIds = {};
            }
            if (resetAll) {
                allRowIds.selectAllEnabled = false;
                allRowIds.selectAllReset = false;
                allRowIds.selectedRowIds = {};
                allRowIds.unselectedRowIds = {};
                selectAllManager.resetAllRowIdsHash();
            }
        };

        var isRowInEditMode = function (row) {
            if (row.attr("editable") === "1") {
                return true;
            } else {
                return false;
            }
        };

        /**
         * Adds to the more menu container and select row the current status of the row selections
         * @param {Object} rowTable - table of the row that need to set as selected/unselected
         * @param {String} selectedRowId - Allows to set the row selection on the row using the data method
         * @param {Boolean} rowStatus - Defines if the row was selected: true, or false otherwise
         * @param {Boolean} selectAll - Defines if the selection was triggered by the select all
         * @inner
         */
        var setSelectedRows = function (rowTable, selectedRowId, rowStatus, selectAll) {
            var tableId = rowTable.id;
            var $rowTable = gridContainer.find('#' + tableId);
            var $selectedRow = $rowTable.find('#' + selectedRowId);

            var selectedRowsByTable = getGridParameterForSelectedRows($rowTable, selectedRowId, selectAll);

            if (_.isEmpty(selectedRowsByTable) || conf.elements.tree)
                $rowTable.find('tr.selectedRow').removeClass('selectedRow');

            if (conf.elements.tree) {
                if (allRowIds.selectAllEnabled) {
                    $rowTable.find('tr:not(.rowNoSelectable)').addClass('selectedRow');
                } else {
                    for (var rowId in selectedRowsByTable) {
                        var rowIdDom = lastSelectedRows.rowsInDom[rowId];
                        rowIdDom && rowIdDom.$row.addClass("selectedRow");
                    }
                }
                //sets the row status in the tree grid since the value provided the jqGrid library is not reliable
                if (selectedRowsByTable[selectedRowId])
                    rowStatus = true;
                else
                    rowStatus = false;
            } else {
                if (rowStatus) { //row unselected
                    selectedRowsByTable[selectedRowId] = reformatRow($rowTable.jqGrid('getRowData', selectedRowId));
                    allRowIds.selectedRowIds[selectedRowId] = true;
                    $selectedRow.addClass("selectedRow");

                } else {
                    delete selectedRowsByTables[tableId][selectedRowId];
                    delete allRowIds.selectedRowIds[selectedRowId];
                    $selectedRow.removeClass("selectedRow");
                }
                if (allRowIds.selectAllEnabled || allRowIds.selectAllFiltered || allRowIds.selectAllReset) {
                    if (rowStatus) {
                        delete allRowIds.unselectedRowIds[selectedRowId];
                    } else {
                        allRowIds.selectAllReset = true;
                        allRowIds.unselectedRowIds[selectedRowId] = true;
                    }
                }
            }
            columnSwitchOnHover && columnSwitchOnHover.toggleSwitchCol(gridContainer, rowStatus, $selectedRow);
            
            var selectedRows = getSelectedRows($rowTable, $selectedRow, rowStatus);

            //Update the checkbox visual state
            conf.elements.tree && indeterminateCheckbox && indeterminateCheckbox.updateCheckboxState(selectedRows);
            addSelectedRowData(selectedRows, $selectedRow);
            if (typeof(selectAll) == 'undefined') updateActionStatus(selectedRows);
            gridTable.trigger("gridOnRowSelection", selectedRows);
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

        var setActionStatus = function (customStatus, hasActionStatusCallback, selectedRows, updateElement) {
            var updateAllElements = _.isBoolean(updateElement) ? !updateElement : true,
                numberOfRows;

            if (updateAllElements && actionElements.originalStatus)
                actionElements.status = _.extend({}, actionElements.originalStatus);
            if (typeof(selectedRows) != "undefined")
                numberOfRows = selectedRows.numberOfSelectedRows;

            var updateActionElementStatus = function ($container, status) {
                if (status) {
                    $container.removeClass('disabled');
                } else {
                    $container.addClass('disabled');
                }
            };

            var updateIconElementStatus = function ($container, status, action) {
                var icons = actionElements.customIcons[action],
                    iconClasses = getIconClasses(icons);
                if (status) {
                    $container.removeClass(iconClasses.disabled).addClass(iconClasses.default);
                } else {
                    $container.removeClass(iconClasses.default).addClass(iconClasses.disabled);
                }
            };

            var updateCustomActionElementStatus = function ($container, status) {
                var $customDefault = $container.find(".customDefault"),
                    $customDisabled = $container.find(".customDisabled");
                if (status) {
                    $container.removeClass('disabled');
                    $customDefault.removeClass("hide");
                    $customDisabled.addClass("hide");
                } else {
                    $container.addClass('disabled');
                    $customDefault.addClass("hide");
                    $customDisabled.removeClass("hide");
                }
            };

            var updateDropdownActionStatus = function ($container, status) {
                var dropdownKey = $container.attr("id"),
                    dropdownInstance = actionElements.dropdown[dropdownKey];
                if (status) {
                    $container.removeClass('disabled');
                    dropdownInstance.enable();
                } else {
                    $container.addClass('disabled');
                    dropdownInstance.disable();
                }
            };

            var isRowEditable = function () {
                var rowId, $row, $rowTable, $rowAndTable;
                var selectedRows = getSelectedRows();
                var isRowInDom = !_.isEmpty(selectedRows['$rowAndTable']);
                var rowAndTables = isRowInDom ? selectedRows['$rowAndTable'] : lastSelectedRows['$rowAndTable'];
                var $rowAndTable = getRowAndTable(rowAndTables),
                    rowId = $rowAndTable['rowId'],
                    $row = $rowAndTable['$row'],
                    $rowTable = $rowAndTable['$table'];
                var rowData = isRowInDom ? reformatRow($rowTable.jqGrid('getRowData', rowId)) : $rowAndTable['rowData'];
                var rawRow = $rowAndTable['rawRow'];
                if (isRowInDom)
                    rawRow = conf.elements.tree ? originalRowData[gridConfigurationHelper.escapeSpecialChar(rowId)] : $row.data('jqgrid.record_data');
                return conf.elements.editRow.isRowEditable(rowId, rawRow, rowData);
            };

            var setActionElementStatus = function (action, actionElementStatus) {
                var rowId = lastSelectedRows.tempLastSelectedRowId,
                    $row = lastSelectedRows.rowsInDom[rowId] && lastSelectedRows.rowsInDom[rowId]['$row'];
                switch (action) {
                    case "create":
                        updateActionElementStatus(containers.$createContainer, actionElementStatus);
                        break;
                    case "edit":
                        if (numberOfRows == 1) {
                            if (conf.elements.editRow && conf.elements.editRow.isRowEditable && !isRowEditable()) {
                                actionElementStatus = false;
                            } else if (!_.isEmpty($row) && isRowInEditMode($row)) {
                                actionElementStatus = false;
                            }
                        } else if (typeof(numberOfRows) != "undefined" || typeof(actionElementStatus) == "undefined") {
                            actionElementStatus = false;
                        }
                        updateActionElementStatus(containers.$updateContainer, actionElementStatus);
                        break;
                    case "delete":
                        actionElementStatus = numberOfRows > 0 ? actionElementStatus : false;
                        updateActionElementStatus(containers.$deleteContainer, actionElementStatus);
                        break;
                    default:
                        if (!hasActionStatusCallback) {
                            if (actionElements.customIcons === undefined) {
                                actionElementStatus = true;
                            } else if (typeof(actionElements.customIcons[action]) == "undefined" ||
                                (typeof(actionElements.customIcons[action]) != "undefined" && typeof(actionElements.customIcons[action]['disabledStatus'])) == "undefined") {
                                actionElementStatus = true;
                            } else {
                                actionElementStatus = numberOfRows > 0 ? true : false;
                            }
                        }
                        var customActionContainer = containers.$actionContainer.find('#' + action);
                        var customActionContainerChildren = customActionContainer.children(':first-child');
                        if (customActionContainerChildren.hasClass('actionIcon')) { //updates disabled icon and adds/remove "disabled" class
                            updateIconElementStatus(customActionContainerChildren, actionElementStatus, action);
                            updateActionElementStatus(customActionContainerChildren, actionElementStatus);
                        } else if (customActionContainer.hasClass('actionMenu')) {
                            updateActionElementStatus(customActionContainer, actionElementStatus);
                        } else if (customActionContainer.hasClass('dropdownMenu') || customActionContainer.hasClass('dropdownMenuItem')) {
                            updateDropdownActionStatus(customActionContainer, actionElementStatus);
                        } else if (customActionContainer.hasClass('customAction')) {
                            updateCustomActionElementStatus(customActionContainer, actionElementStatus);
                        } else {
                            updateActionElementStatus(customActionContainerChildren, actionElementStatus);
                        }
                        break;
                }
            };

            if (!_.isEmpty(customStatus)) {
                if (updateAllElements) {
                    for (var element in actionElements.status) {
                        if (typeof(selectedRows) == "undefined")
                            actionElements.status[element] = false;
                        if (typeof(customStatus [element]) != "undefined")
                            actionElements.status[element] = customStatus[element];
                    }
                } else {
                    for (var action in customStatus) {
                        var actionElementStatus = customStatus[action];
                        setActionElementStatus(action, actionElementStatus);
                    }
                }
            }
            if (updateAllElements) {
                for (var action in actionElements.status) {
                    var actionElementStatus = actionElements.status[action];
                    setActionElementStatus(action, actionElementStatus);
                }
            }
            updateGridSelectionCount();
        };

        var updateActionStatus = function (selectedRows) {
            var hasActionStatusCallback = false;
            var getCustomActionElementStatus = function () {
                var deferred = $.Deferred();
                if (conf.elements.actionButtons && conf.elements.actionButtons.actionStatusCallback) {
                    conf.elements.actionButtons.actionStatusCallback(selectedRows,
                        function (customStatus) {
                            deferred.resolve(customStatus);
                        },
                        function (errorMessage) {
                            deferred.reject(errorMessage);
                        }
                    );
                    hasActionStatusCallback = true;
                } else {
                    deferred.resolve({});
                }
                return deferred.promise();
            };

            var promise = getCustomActionElementStatus();
            $.when(promise)
                .done(function (customStatus) {
                    setActionStatus(customStatus, hasActionStatusCallback, selectedRows);
                })
                .fail(function (errorMessage) {
                    console.log(errorMessage);
                });
        };

        var getTreeRowCheckbox = function (rowId) {
            var $checkbox = gridTable.find('#' + rowId + ' .tree_custom_checkbox>input');
            return $checkbox;
        };

        /**
         * Checks if a row or its ancestor is the last selected/unselected row by checking current node and moving up in the tree until the top level parent
         * @param {String} rowId - Id of the row that will be tested
         * @returns {boolean} true if the tested row or one of its ancestors was the last selected row
         * @inner
         */
        var isRowClickedUpInTree = function (rowId) {
            //gets the id of the parent of a row
            var getParentRowId = function (childId) {
                var row = allRowsInTree[childId];
                return row.parent;
            };
            //tests if a row was the last selected/unselected row
            var isRowClicked = function (id) {
                return lastSelectedRows.tempLastSelectedRowId == id;
            };
            var isRowInNodeTree = isRowClicked(rowId),
                parentId = rowId;
            //if the current row was not the one that started preselection, then move up on the tree to find if one of the ancestor was the one that was clicked at first
            if (!isRowInNodeTree) {
                do {
                    parentId = getParentRowId(parentId);
                    if (isRowClicked(parentId)) {
                        isRowInNodeTree = true;
                        break;
                    }
                } while (parentId);
            }
            return isRowInNodeTree;
        };

        var setTreePreselection = function (rowId, status) {
            var row = allRowsInTree[rowId];
            if (row) {
                var rowParent = row.parent;
                var rowChildren = row.children;
               
                if (rowParent) {
                    var parentCheckbox = lastSelectedRows.rowsInDom[rowParent].$checkbox;
                    if (status != parentCheckbox.is(':checked') || indeterminateCheckbox.getIndeterminateState(rowParent) || indeterminateCheckbox.getIndeterminateState(rowId)) {
                        var parentChildren = allRowsInTree[rowParent].children;
                        var isSibblingSelected = false,
                            siblingCheckedCount = 0;
                        parentChildren.forEach(function (child) {
                            var childCheckbox = lastSelectedRows.rowsInDom[child].$checkbox,
                                childrenRowId = lastSelectedRows.rowsInDom[child].$row.attr('id'),
                                isIndeterminateState = indeterminateCheckbox.getIndeterminateState(childrenRowId);
                            if (childCheckbox[0].checked || isIndeterminateState){
                                isSibblingSelected = true;
                                childCheckbox[0].checked && !isIndeterminateState && siblingCheckedCount++;
                            }
                        });
                        var isParentChecked = (parentChildren.length == siblingCheckedCount) ? true : false;

                        indeterminateCheckbox.updateParentCheckboxState(rowParent, isSibblingSelected, isParentChecked);
                        parentCheckbox[0].checked = isSibblingSelected;

                        if (allRowIds.selectAllReset){
                            //When unselect one of rows after selectAll, all rows are checked except for the current row. 
                            //When the row parent is triggered again, then parentCheckbox is still checked (even its state is indeterminate) so we only need to update the indeterminateStateInTree and don't need to set selection. 
                            lastSelectedRows.tempLastSelectedRowId == rowId && gridTable.jqGrid('setSelection', rowParent);
                        }else{
                            gridTable.jqGrid('setSelection', rowParent);
                        }

                        //When columnSwitchOnHover is true, the selection checkbox has to be displayed when selection is true. Otherwise, hide the selection checkbox by default.
                        columnSwitchOnHover && columnSwitchOnHover.toggleSwitchCol(gridContainer, isSibblingSelected, lastSelectedRows.rowsInDom[rowParent].$row);
                    }
                }
                if (rowChildren && isRowClickedUpInTree(rowId)) {
                    rowChildren.forEach(function (child) {
                        var childCheckbox = lastSelectedRows.rowsInDom[child].$checkbox,
                            childCheckboxState = childCheckbox[0].checked;
                        if (childCheckboxState != status) {
                            childCheckbox[0].checked = status;
                            gridTable.jqGrid('setSelection', child);
                        }
                        //When columnSwitchOnHover is true, the selection checkbox has to be displayed when selection is true. Otherwise, hide the selection checkbox by default.
                        columnSwitchOnHover && columnSwitchOnHover.toggleSwitchCol(gridContainer, status, lastSelectedRows.rowsInDom[child].$row);
                    });
                }

            }
        };
        /**
         * Adds a row to the selectedRowIds Object and removes it from the unselectedRowIds Object for the allRowsId Object
         * @param {String} rowId - Id of the selected row
         * @inner
         */
        var addSelectedRow = function (rowId) {
            allRowIds.selectedRowIds[rowId] = true;
            delete allRowIds.unselectedRowIds[rowId];
        };

        /**
         * Removes a row from the selectedRowIds Object and adds it from the unselectedRowIds Object for the allRowsId Object
         * @param {String} rowId - Id of the selected row
         * @inner
         */
        var removeSelectedRow = function (rowId) {
            allRowIds.unselectedRowIds[rowId] = true;
            delete allRowIds.selectedRowIds[rowId];
        };

        /**
         * Gets the grid parameters for the selected rows including the current selected one. In case of the tree grid, the selection parameters are not available in the library or are not reliable, so logic is added to fill up the gap.
         * @param {Object} $rowTable - Jquery table that contains the selected row
         * @param {String} rowId - Id of the selected row
         * @inner
         */
        var getGridParameterForSelectedRows = function ($rowTable, rowId) {
            var selectedRowsByTable, rowIdDom;
            var tableId = $rowTable.attr('id');
            if (typeof(selectedRowsByTables[tableId]) === 'undefined') {
                selectedRowsByTables[tableId] = {};
            }
            if (conf.elements.tree) { //recreates simple grid selection model since it is not available in the tree grid
                if (allRowIds.selectAllEnabled) {
                    var rowInDomId;
                    selectedRowsInTree = {};
                    allRowIds.unselectedRowIds = {};
                    for (rowInDomId in lastSelectedRows.rowsInDom) {
                        rowIdDom = lastSelectedRows.rowsInDom[rowInDomId];
                        if (_.isUndefined(rowIdDom.$checkbox.attr('disabled'))){
                            selectedRowsInTree[rowInDomId] = rowIdDom.rowData;
                            rowIdDom.$checkbox[0].checked = true;
                        }                        
                    }
                    selectedRowsByTables[tableId] = selectedRowsInTree;
                } else if (allRowIds.selectAllFiltered) {
                    var rowInDomId;
                    selectedRowsInTree = {};
                    for (rowInDomId in lastSelectedRows.rowsInDom) {
                        delete allRowIds.unselectedRowIds[rowInDomId];
                        rowIdDom = lastSelectedRows.rowsInDom[rowInDomId];
                        selectedRowsInTree[rowInDomId] = rowIdDom.rowData;
                        rowIdDom.$checkbox[0].checked = true;
                    }
                    selectedRowsByTables[tableId] = _.extend(selectedRowsInTree, selectedRowsByTables[tableId]);
                } else {
                    var rowData, $checkbox, rowStatus,
                        isRowInDom = rowId && lastSelectedRows.rowsInDom[rowId],
                        isRowInTable = typeof(selectedRowsInTree[rowId]) != "undefined";

                    if (isRowInDom) {
                        rowIdDom = lastSelectedRows.rowsInDom[rowId];
                        rowData = rowIdDom.rowData;
                        $checkbox = rowIdDom.$checkbox;
                        rowStatus = $checkbox.is(':checked');
                    }

                    if (allRowIds.selectAllReset) {
                        if (!rowStatus) {//row unselected
                            delete selectedRowsByTables[tableId][rowId];
                            isRowInDom && (rowIdDom.$checkbox[0].checked = false);
                            removeSelectedRow(rowId);
                        } else {
                            selectedRowsByTables[tableId][rowId] = rowData;
                            isRowInDom && (rowIdDom.$checkbox[0].checked = true);
                            addSelectedRow(rowId);
                        }
                        conf.elements.tree.preselection && setTreePreselection(rowId, rowStatus);
                    } else {
                        var isEmptyTable = _.isEmpty(selectedRowsInTree);
                        if (isEmptyTable) {
                            selectedRowsInTree[rowId] = rowData;
                            if (!rowStatus && $checkbox.length) {//row selected
                                $checkbox[0].checked = true;
                                rowStatus = true;
                                addSelectedRow(rowId);
                            }
                        } else {
                            if (!isRowInTable && rowStatus) {
                                selectedRowsInTree[rowId] = rowData;
                                addSelectedRow(rowId);
                            } else if (!isRowInTable && !rowStatus) {
                                var key, previousSelectedRowId, $previousSelectedRow, $previousCheckbox;
                                for (key in selectedRowsInTree) {
                                    previousSelectedRowId = key;
                                    $previousSelectedRow = $rowTable.find('#' + previousSelectedRowId);
                                    $previousCheckbox = $previousSelectedRow.find('.tree_custom_checkbox>input');
                                    if ($previousCheckbox.length)
                                        $previousCheckbox[0].checked = false;
                                }
                                selectedRowsInTree = {};
                                selectedRowsInTree[rowId] = rowData;
                                if ($checkbox.length) {
                                    $checkbox[0].checked = true;
                                    rowStatus = true;
                                }
                                removeSelectedRow(rowId);
                            } else if (!rowStatus) {
                                delete selectedRowsInTree[rowId];
                                indeterminateCheckbox && indeterminateCheckbox.setIndeterminateState(rowId);
                                removeSelectedRow(rowId);
                            }
                        }
                        conf.elements.tree.preselection && setTreePreselection(rowId, rowStatus);
                        selectedRowsByTables[tableId] = selectedRowsInTree;
                    }
                }
            }

            selectedRowsByTable = selectedRowsByTables[tableId];
            return selectedRowsByTable;
        };

        /**
         * Adds to the more menu container and select row the current status of the row selections
         * @param {Object} $row - Jquery row selected when the context menu was opened
         * @inner
         */
        var addSelectedRowData = function (selectedRows, $selectedRow) {
            if ($selectedRow) $selectedRow.data('rowSelections', selectedRows);
            containers.$moreContainer.data('rowSelections', selectedRows);
        };

        /**
         * Gets the data associated to a specific row
         * @param {Object} $row - Jquery object for the row
         * @param {Object} $rowTable - Jquery object for the row table
         * @inner
         */
        var getRowData = function ($row, $rowTable) {
            var rowId = $row.attr('id');
            return {
                "rowId": rowId,
                'gridHeaderLayout': self.getGridHeaderLayout($rowTable),
                "rowData": reformatRow($rowTable.jqGrid('getRowData', rowId)),
                'originalData': reformatRow($row.data('jqgrid.record_data'))
            }
        };

        /**
         * Gets the current row selection related to the number of rows that are enabled, disabled, number of selected rows and if a row was copied
         * @returns {Object} Object with current row selections
         * @inner
         */
        var getSelectedRows = function ($table, $selectedRow, rowStatus) {
            var hasSubgrid = (typeof(conf.elements.subGrid) === 'undefined') ? false : true,
                isAllTables = (arguments.length == 0),
                rowSelections, $selectedRow, rowData, $rowTable, $row, rowId, rowInDom,
                isARowEnabled = true,
                isARowDisabled = false,
                selectedRowsData = [],
                selectedRowIds = [],
                selectedRowsDom = [],
                $rowAndTable = [],
                numberOfSelectedRows = 0,
                numberOfDisabledRows = 0,
                isRowCopied = copiedRows.length != 0;

            _.isEmpty(lastSelectedRows.rowsInDom) && setRowsInDom();
            for (var tableId in selectedRowsByTables) {
                if (hasSubgrid || isAllTables || tableId == $table.attr('id')) {
                    $rowTable = gridContainer.find('#' + tableId);
                    var selectedRows = selectedRowsByTables[tableId];
                    numberOfSelectedRows += _.size(selectedRows);
                    for (rowId in selectedRows) {
                        rowInDom = lastSelectedRows.rowsInDom[rowId];
                        if (rowInDom) {
                            $row = rowInDom.$row;
                            selectedRowsData.push(rowInDom.rowData);
                            selectedRowsDom.push($row);
                            if (rowInDom.isRowDisabled) {
                                isARowDisabled = true;
                                numberOfDisabledRows++;
                            }
                            if (isAllTables) {
                                $rowAndTable.push({
                                    $row: $row,
                                    $table: $rowTable,
                                    rowData: rowInDom.rowData,
                                    rawRow: rowInDom.rawRow
                                });
                            }
                        } else {
                            selectedRowsData.push(selectedRows[rowId]);
                        }
                        selectedRowIds.push(rowId);
                    }
                }
                if (!isAllTables && !hasSubgrid)
                    break;
            }

            if (numberOfDisabledRows == numberOfSelectedRows) //if all rows are disabled, then isARownEnabled should be false
                isARowEnabled = false;

            rowSelections = {
                numberOfSelectedRows: numberOfSelectedRows,
                selectedRows: selectedRowsData,
                selectedRowIds: selectedRowIds,
                selectedRowsDom: selectedRowsDom,
                isRowCopied: isRowCopied,
                isRowEnabled: isARowEnabled,
                isRowDisabled: isARowDisabled,
                lastSelectedRowId: lastSelectedRows.lastSelectedRowId
            };



            //sets allRowIds if select all checkbox was selected (from main view or filtered view) and unselections or selections happened after it
            if (allRowIds.selectAllEnabled || allRowIds.selectAllFiltered || allRowIds.selectAllReset) {
                var allSelectedRowIds = selectAllManager.getAllRowIds(allRowIds.unselectedRowIds, true); //get all selected row ids in a hash object
                _.extend(allRowIds.selectedRowIds, allSelectedRowIds); //extend all selected row ids (from main or filtered view) to the current selected rows

                var allUnselectedRowIds = Object.keys(allRowIds.unselectedRowIds), //converts hash to array data structure
                    allUnselectedRowData = [], unselectedRowId, unselectedRowData;
                if (conf.elements.jsonId) {
                    if (!hasSubgrid && _.isUndefined($rowTable)) { //when all rows are unselected but grid is filtered, the reference to the $rowTable is lost. Nevertheless, in the case of grids other than subgrid, the $rowTable is the same as gridTable
                        $rowTable = gridTable;
                    }
                    allUnselectedRowIds.forEach(function (unselectedRowId) {
                        unselectedRowData = $rowTable.jqGrid('getRowData', unselectedRowId);
                        allUnselectedRowData.push(reformatRow(unselectedRowData));
                    });
                }
                rowSelections.allRowIds = Object.keys(allRowIds.selectedRowIds); //converts hash to array data structure
                rowSelections.allUnselectedRowIds = allUnselectedRowIds;
                rowSelections.allUnselectedRowData = allUnselectedRowData;
                rowSelections.numberOfSelectedRows = rowSelections.allRowIds.length;
            }

            if (isAllTables && !hasSubgrid) {
                rowSelections.$rowAndTable = $rowAndTable;
                if (!_.isEmpty($rowAndTable)) {
                    lastSelectedRows.$rowAndTable = $rowAndTable;
                }
            } else if ($selectedRow) {
                rowSelections.currentRow = {
                    selected: rowStatus,
                    rowId: $selectedRow.attr('id')
                };
            }

            hasSelectAll && setSelectAllCheckbox(rowSelections.numberOfSelectedRows);

            return rowSelections;
        };

        /**
         * Restores the select all checkbox when unselection of rows and then selection of rows makes the total row selection the same as the total number of rows
         * @param {number} numberOfSelectedRows - number of selected rows
         * @inner
         */
        var setSelectAllCheckbox = function (numberOfSelectedRows) {
            var checkSelectAll = function () {
                if (_.isElement(containers.$selectAllCheckbox[0])) {
                    containers.$selectAllCheckbox[0].checked = true;
                    indeterminateCheckbox && indeterminateCheckbox.resetIndeterminateState();
                }
            };
            if (allRowIds.selectAllEnabled && !allRowIds.selectAllFiltered) { //individual row selection after a select all case
                allRowIds.totalRows = self.getNumberOfRows();
                if (allRowIds.selectAllReset && numberOfSelectedRows == allRowIds.totalRows) {
                    allRowIds.selectAllEnabled = true;
                    allRowIds.selectAllReset = false;
                }
            }
            if (!isPaginationSupported && numberOfSelectedRows && numberOfSelectedRows == self.getNumberOfRows()) {//individual row selection
                checkSelectAll();
            }
        };

        /**
         * Creates a new row using inline edition or a user defined view (by overlay).
         * @param {Object} $rowTable - table that will have the new row
         * @inner
         */
        var createRow = function ($rowTable) {
            var addFirst = true,
                showOverlay = true,
                getDefaultRowObj = function () {
                    var columns = self.conf.elements.subGrid ? self.conf.elements.subGrid.columns : self.conf.elements.columns;
                    return getDefaultValues(columns);
                };

            if (conf.elements.createRow) {
                if (conf.elements.createRow.addLast)  addFirst = false;
                if (conf.elements.createRow.showInline || conf.elements.createRow.onCreate) showOverlay = false;
            }
            if (showOverlay) { //row creation on overlay
                triggerActionEvent("createEvent", getDefaultRowObj());
            } else if (conf.elements.createRow.onCreate) { //row creation on user defined view to be available when the onCreate callback is invoked
                var onSuccess = function (data) {
                    var location = addFirst ? "first" : "last";
                    data && self.addRow(data, location);
                };
                conf.elements.createRow.onCreate(self.getGridHeaderLayout($rowTable), {"defaultRow": getDefaultRowObj()}, onSuccess);
            } else { ///inline row creation
                var allRows = $rowTable.find(".jqgrow"),
                    isEmptyGrid = allRows.length == 0,
                    setScrollPosition = function (position) {
                        $(gridTable[0].grid.bDiv).scrollTop(position);
                    },
                    isFirstRecordLoaded = function (rows) {
                        var numberOfRecords = gridTable.jqGrid("getGridParam", "records");
                        return rows.length == numberOfRecords || rows.first().data("rowIndexNumber") == 1;
                    },
                    isLastRecordLoaded = function (rows) {
                        var numberOfRecords = gridTable.jqGrid("getGridParam", "records");
                        return rows.length == numberOfRecords || rows.last().data("rowIndexNumber") == numberOfRecords;
                    };
                if (addFirst) {
                    setScrollPosition(0);//load first page
                    if (isEmptyGrid || isFirstRecordLoaded(allRows)) { //if grid is empty or the first record is available in the DOM, then let jqgrid add the row
                        createInlineRow("", "first", $rowTable);
                    } else {//else load the first record (page) and then let jqgrid add the row
                        $rowTable.bind("gridLoaded", function () {//once first page is loaded, add the record
                            if (isFirstRecordLoaded($rowTable.find(".jqgrow"))) {
                                createInlineRow("", "first", $rowTable);
                                $rowTable.unbind("gridLoaded");
                            }
                        });
                    }
                } else {
                    if (isEmptyGrid || isLastRecordLoaded(allRows)) { //if grid is empty or the last record is available in the DOM, then let jqgrid add the row
                        createInlineRow("", "last", $rowTable);
                    } else {//else load the last record (page) and then let jqgrid add the row
                        var lastRecordPosition = containers.$gridContentContainer.find(">div").height();
                        setScrollPosition(lastRecordPosition);//load last page
                        $rowTable.bind("gridLoaded", function () {//once last page is loaded, add the record
                            if (isLastRecordLoaded($rowTable.find(".jqgrow"))) {//search new rows
                                createInlineRow("", "last", $rowTable);
                                $rowTable.unbind("gridLoaded");
                            }
                        });
                    }
                }
            }
            updateGridSelectionCount();
        };

        /**
         * Clones the grid header
         * @param {Object} $rowTable - table of the row
         * @returns {Object} jQuery object with the cloned header without search toolbar
         * @inner
         */
        var getGridHeader = function ($rowTable) {
            var $gridHeaderCopy = $rowTable.closest(".grid-widget").find('.ui-jqgrid-hdiv').clone().removeClass("hidden"),
                $gridHeader = $(templates.gridHeader);
            $gridHeaderCopy.find('.ui-search-toolbar').remove();
            $gridHeader.find(".ui-jqgrid").append($gridHeaderCopy);
            return $gridHeader;
        };

        /**
         * Provides the grid header dom and its current layout (columns, width, horizontal offset respect to the grid container)
         * @param {Object} $rowTable - optional, jQuery Object with the table of the row
         */
        this.getGridHeaderLayout = function ($rowTable) {
            if (gridTable) {
                var $rowTable = $rowTable || gridTable,
                    gridHeader = getGridHeader($rowTable),
                    columns = gridConfigurationHelper.getGridColumns($rowTable, ["name", "label", "width"]),
                    columnsOffset = gridConfigurationHelper.getGridColumnOffset($rowTable, null, _.isObject(gridFormatter.getSwitchColumnConfig()));

                return {
                    "gridHeader": gridHeader,
                    "columns": columns,
                    "columnOffset": columnsOffset
                };
            } else {
                throw new Error(errorMessages.noGrid);
            }
        };

        /**
         * Trigger an event based on the name provided for the key in conf.actionEvents
         * conf.actionEvents is composed by a key/value pair. key is the unique identifier of the event that will be triggered, while the value of the key could be a string or an Object. string value is only available for events that will be triggered using a jQuery event. For a non jQuery event, the value of the key should be an Object and should include the name and handler properties. name is a string that represents the event name. handler is an array with all the callbacks to be invoked when the event is triggered.
         * @param {String} key - key in the conf.actionEvents that will provide the name of the event
         * @param {Object} eventData - data that will be associated with the event
         * @inner
         */
        var triggerActionEvent = function (key, eventData) {
            if (self._getRegisteredEvents()[key] || (conf.actionEvents && conf.actionEvents[key])) {
                var event = self._getRegisteredEvents()[key] || conf.actionEvents[key],
                    eventName = _.isObject(event) ?  event.name : event;
                eventName && gridTable.trigger(eventName, eventData);
            }
        };

        /**
         * Creates a new inline row before or after a selected row.
         * @param {Object} $srcRow - current selected row.
         * @param {String} location - location of the new row with reference to current row: before or after.
         * @param {Object} $rowTable - table of the row
         * @param {Object} copiedRow - copied row
         * @inner
         */
        var createInlineRow = function ($srcRow, location, $rowTable, copiedRow) {
            var newRowId = $.jgrid.randId();
            var columns = self.conf.elements.subGrid ? self.conf.elements.subGrid.columns : self.conf.elements.columns;
            var newValues = getDefaultValues(columns, copiedRow);
            var srcRowId = $srcRow ? $srcRow.attr('id') : undefined;

            //We need to reset isRowsInDomSetCompleted back to false. Otherwise, it will remove data in the afterInsertRow event
            lastSelectedRows.isRowsInDomSetCompleted = false;
            if (self.conf.elements.tree) {
                var parentId = $rowTable.jqGrid('getRowData', srcRowId)[self.conf.elements.tree.parent];
                $rowTable.jqGrid('addChildNode', newRowId, parentId, newValues);
            } else {
                $rowTable.jqGrid('addRowData', newRowId, newValues, location, srcRowId);
            }
            var $newRow = $rowTable.find('#' + newRowId);
            $rowTable.jqGrid('editRow', newRowId, {keys: false});
            inlineEditRow.addSaveButton($newRow, $rowTable,'create', isValidUpdatedRow, saveRow, cancelRow, location == "last");

            lastSelectedRows.tempLastSelectedRowId = newRowId;
            $rowTable.jqGrid('setSelection', newRowId, false);
            setSelectedRows($rowTable[0], newRowId, true);
            addCellEventHandlers($newRow, $rowTable);

            var operation = copiedRow ? 'paste' : "create";
            var originalRow = copiedRow ? copiedRow : {};

            //row has been created and it's on edit mode, notify it
            notifyRowUpdates($newRow, $rowTable, operation, location, originalRow);
            notifyOnEditMode($newRow, originalRow);
            gridNonRecordsState.displayNoResultMessage();
        };

        /**
         * Registers event handlers for the action buttons on the action container
         * @inner
         */
        var registerActionEventsHandlers = function () {
            var createEventHandler = function () {
                if (!containers.$createContainer.hasClass('actionMenu')) { //it's not a menu button
                    containers.$createContainer.off('click.fndtn.createRow').on('click.fndtn.createRow', function (e) {
                        if (!$(this).hasClass('disabled')) {
                            if (inlineEditRow) {
                                var rows = getSelectedRows().$rowAndTable, $row, i, rowId;
                                for (i = 0; i < rows.length; i++) {
                                    $row = rows[i].$row;
                                    rowId = $row.attr('id');
                                    if ($row.attr("editable") == "1") {
                                        if (_.isUndefined(lastSelectedRows.lastUpdatedRow) || lastSelectedRows.lastUpdatedRow.operation == "create") {
                                            gridTable.jqGrid("delRowData", rowId);
                                        } else {
                                            inlineEditRow.removeSaveButton();
                                            gridTable.jqGrid("restoreRow", rowId);
                                        }
                                    }
                                }
                            }
                            resetSelections(gridTable, true);
                            updateActionStatus(getSelectedRows());

                            createRow(gridTable); //create applies on main grid
                        }
                    });
                }
            };

            var updateEventHandler = function () {
                if (!containers.$updateContainer.hasClass('actionMenu')) { //it's not a menu button
                    containers.$updateContainer.off('click.fndtn.editRow').on('click.fndtn.editRow', function (e) {
                        !$(this).hasClass('disabled') && updateRow();
                    });
                }
            };

            var deleteEventHandler = function () {
                if (!containers.$deleteContainer.hasClass('actionMenu')) { //it's not a menu button
                    containers.$deleteContainer.off('click.fndtn.deleteRow').on('click.fndtn.deleteRow', function (e) {
                        !$(this).hasClass('disabled') && confirmationDialogBuilder.deleteRow(getSelectedRows(), deleteRows, _.bind(self.reloadGrid, self));
                    });
                }
            };

            (rbacHash['createEvent'] !== false) && createEventHandler();
            (rbacHash['updateEvent'] !== false) && updateEventHandler();
            (rbacHash['deleteEvent'] !== false) && deleteEventHandler();
        };

        /**
         * Notify to the registered events of actions in the row: create, update or paste
         * @param {Object} row - row that was updated.
         * @param {Object} $rowTable - table that containes the row that was updated.
         * @param {String} location - location of the new row with reference to a selected row: before or after.
         * @param {Object} originalRow - values of to the original selected row.
         * @inner
         */
        var notifyRowUpdates = function ($row, $rowTable, operation, location, originalRow) {
            if (conf.actionEvents) {
                var rowId = $row.attr('id');
                var operationObj = {'type': operation};
                location && _.extend(operationObj, {'location': location});

                var customEvent = {
                    'create': _.isObject(conf.actionEvents.createEvent) ? conf.actionEvents.createEvent.name : conf.actionEvents.createEvent,
                    'update': _.isObject(conf.actionEvents.updateEvent) ? conf.actionEvents.updateEvent.name : conf.actionEvents.updateEvent,
                    'paste': _.isObject(conf.actionEvents.pasteEvent) ? conf.actionEvents.pasteEvent.name : conf.actionEvents.pasteEvent
                };
                var rawRow = conf.elements.tree ? originalRowData[gridConfigurationHelper.escapeSpecialChar(rowId)] : (lastSelectedRows.lastUpdatedRow ? lastSelectedRows.lastUpdatedRow.originalRowData : $row.data('jqgrid.record_data'));
                var prevRowId = $row.prev().attr('id');
                var prevRow = prevRowId ? $rowTable.jqGrid('getRowData', prevRowId) : {};
                var updatedObj = {
                    'updatedRow': reformatRow($rowTable.jqGrid('getRowData', rowId)),
                    'previousRow': reformatRow(prevRow),
                    'originalData': rawRow,
                    'operation': operationObj
                };

                if (lastSelectedRows.lastUpdatedRow) {
                    lastSelectedRows.lastUpdatedRow.operation = operation;
                }

                originalRow && _.extend(updatedObj, {'originalRow': reformatRow(originalRow)});

                var $cells = getCellsData($row);
                $cells && _.extend(updatedObj, {'cellCustomData': $cells});

                var rbacCheck = true;
                if (customEvent[operation]) {
                    //Only when there are capabilities in the event conf, then we check the rbac
                    if (operation === "create" && _.isObject(conf.actionEvents.createEvent)) {
                        rbacCheck = rbacHash["createEvent"];
                    } else if (operation === "update" && _.isObject(conf.actionEvents.updateEvent)) {
                        rbacCheck = rbacHash["updateEvent"];
                    } else if (operation === "paste" && _.isObject(conf.actionEvents.pasteEvent)) {
                        rbacCheck = rbacHash["pasteEvent"];
                    }
                    (rbacCheck !== false) && gridTable.trigger(customEvent[operation], updatedObj);
                }
            }
        };

        /**
         * Gets the default values that a row can have when it is created.
         * @param {Object} columnsConfiguration - Object that contains the default value for each column of a row
         * @returns {Object} Object with a key and value set composed by the name of the column and the default value of its cells
         * @inner
         */
        var getDefaultValues = function (columnsConfiguration, copiedRow) {
            var currentRow = copiedRow ? copiedRow : {};
            var newValues = {};
            for (var i = 0; i < columnsConfiguration.length; i++) {
                var column = columnsConfiguration[i];
                var newValue = '';
                if (copiedRow) {
                    newValue = currentRow[column['name']];
                    if (column['copiedDefaultValue']) {
                        var copiedValue = column['copiedDefaultValue'];
                        if (typeof copiedValue == "function") {
                            newValue = copiedValue(currentRow[column['name']]);
                        } else {
                            newValue = copiedValue;
                        }
                    }
                } else if (column['createdDefaultValue']) {
                    var addedValue = column['createdDefaultValue'];
                    if (typeof addedValue == "function") {
                        newValue = addedValue(currentRow[column['name']])
                    } else {
                        newValue = addedValue;
                    }
                }
                newValues[column['name']] = newValue;
            }
            return newValues;
        };

        /**
         * Test if the updates on a row are valid values and applicable for a grid with inline editing
         * @param {String} newSelectedRowId - id of the row
         * @param {Boolean} isRowSelectionClicked - selection status of the row: true if the row was selected and false otherwise
         * @inner
         */
        var isValidUpdatedRow = function (newSelectedRowId, isRowSelectionClicked) {
            var rowAndTables = getSelectedRows()['$rowAndTable'],
                isValid = true;

            if (!_.isEmpty(rowAndTables)) {
                var $rowAndTable = rowAndTables[0]; //takes only the first row since edition happens on one row at a time
                var $editedRow = $rowAndTable['$row'];
                var editedRowId = $editedRow.attr('id');
                if (isRowInEditMode($editedRow)) { //the row is in edit mode
                    validateInput(null, null, $editedRow);
                    isValid = $editedRow.find('.error').length != 0 ? false : true;
                }
                if (isRowSelectionClicked && !isValid) {
                    if (conf.elements.tree) {
                        $editedRow.find('.tree_custom_checkbox :input').prop('checked', true);
                    } else {
                        $editedRow.find('.cbox').prop('checked', true);
                    }

                    if (editedRowId != newSelectedRowId) {
                        if (conf.elements.tree) {
                            gridContainer.find('#' + newSelectedRowId).find('.tree_custom_checkbox :input').prop('checked', false);
                        } else {
                            gridContainer.find('#' + newSelectedRowId).find('.cbox').prop('checked', false);
                        }
                    }
                }
            }
            return isValid;
        };

        /**
         * Saves the current selected row
         * @inner
         */
        var saveRow = function () {
            var selectedRows = getSelectedRows(),
                $rowAndTable = getRowAndTable(selectedRows['$rowAndTable'], selectedRows.selectedRowIds[0]),
                rowId = $rowAndTable['rowId'],
                $row = $rowAndTable['$row'],
                $rowTable = $rowAndTable['$table'],
                hasSubgrid = conf.elements.subGrid ? true : false;
            if ($rowTable.length && isRowInEditMode($row)) {
                inlineEditRow.removeSaveButton();
                $rowTable.jqGrid('saveRow', rowId, {
                    aftersavefunc: function (rowid) { //keeps row expanded after inline edition
                        var $row = $(this).find("#" + rowid),
                            $moreCells = $row.find('td').find('.cellContent'),
                            $lessIcon = $row.find('td').find('.lessIcon'),
                            $moreIcon = $row.find('td').find('.moreIcon');
                        $moreCells.toggleClass('moreContent');
                        if ($lessIcon.hasClass('moreContent')) { //restores more icon visibility
                            $lessIcon.removeClass('moreContent');
                            $moreIcon.addClass('moreContent');
                        }
                        lastSelectedRows.lastUpdatedRow = {
                            originalRowData: $row.data("jqgrid.record_data")
                        };
                        var newData = _.extend({}, lastSelectedRows.lastUpdatedRow.originalRowData, reformatRow($rowTable.jqGrid('getRowData', rowId)));
                        $row.data("jqgrid.record_data", newData);
                        $rowTable.trigger('slipstreamGrid.row:expanded', $row);
                    }
                });

                if (lastSelectedRows.rowsInDom[rowId]) {
                    lastSelectedRows.rowsInDom[rowId].rowData = reformatRow($rowTable.jqGrid('getRowData', rowId));
                } else {
                    setRowsInDom(rowId);
                }
                tooltipBuilder && tooltipBuilder.addRowTooltips($rowTable, originalRowData, rowId);
                notifyRowUpdates($row, $rowTable, 'update');
                updateActionStatus(getSelectedRows());
                dragNDrop && dragNDrop.isCellDnD() && dragNDrop.bindDnDItemsEvent($row, $rowTable);
                //Only in the simple grid
                !hasSubgrid && hasMultipleCellContent && gridFormatter.adjustMultipleCellRow($rowTable);
                return $row;
            }
        };

        /**
         * Cancels the row creation or edition of a row on edit mode
         * @param {Object} gridTable - jQuery Object of the table that contains the grid
         * @param {string} rowId - id of the row
         * @param {string} operation - update for row update or create for row creation
         * @inner
         */
        var cancelRow = function ($gridTable, rowId, operation) {
            if (operation == "update") {
                $gridTable.jqGrid('restoreRow', rowId);
            } else {
                $gridTable.jqGrid('delRowData', rowId);
                resetSelections($gridTable, true);
            }
            updateActionStatus(getSelectedRows());
        };

        /**
         * Adds events handlers for the input elements of a row that is on edit mode
         * @param {Object} $row - row on edit mode
         * @returns {Object} $rowTable - table that contains the row on edit mode
         * @inner
         */
        var addCellEventHandlers = function ($row, $rowTable) {
            var rowId = $row.attr('id');
            var validatorTimer = self.conf.elements.validationTime ? self.conf.elements.validationTime : 500; //the validation will be triggered after validatorTimer milliseconds
            $row.find('input')
                .on('click', function (e) {
                    $(this).data('originalRow', reformatRow($rowTable.jqGrid('getRowData', rowId)));
                    validateInput(this, e, $row);
                })
                .on('keydown.fndtn.validator', function (e) {
                    clearTimeout(self.timer);
                    self.timer = setTimeout(function () {
                        $(this).data('originalRow', reformatRow($rowTable.jqGrid('getRowData', rowId)));
                        validateInput(this, e, $row);
                    }.bind(this), validatorTimer);
                });
            $row.find('textarea').off('click')
                .on('click', function (e) {
                    var $textarea = $(this);
                    var colName = $textarea.attr('name');
                    var isEnabled = !$textarea.hasClass('disabled');
                    if (isEnabled && self.conf.cellProperties[colName] && self.conf.cellProperties[colName].type) {
                        if (/view/.test(self.conf.cellProperties[colName].type)) {
                            var cellView = self.conf.cellProperties[colName].values;
                            cellView.delegateEvents(self.conf.cellProperties[colName].values.events);
                            var list = this.value.trim().split('\n');
                            var rawRow = conf.elements.tree ? originalRowData[gridConfigurationHelper.escapeSpecialChar(rowId)] : $row.data('jqgrid.record_data');
                            var overlayObj = {
                                'cellData': list,
                                'originalRowData': rawRow
                            };
                            cellView.setCellViewValues && cellView.setCellViewValues(overlayObj);
                            self.overlay = new OverlayWidget({
                                view: cellView,
                                type: self.conf.cellProperties[colName]['overlaySize'] ? self.conf.cellProperties[colName]['overlaySize'] : 'medium'
                            });
                            self.overlay.build();
                            var closeCellOverlayViewHandle = self.conf.container.unbind('closeCellOverlayView').bind("closeCellOverlayView", function (e, key) {
                                self.overlay && self.overlay.destroy();
                            });
                        }
                    }
                });
            $row.on('keydown', 'input,textarea', function (e) { //escape key to exit any inline edit. Reverts the change.
                if (e.keyCode === $.ui.keyCode.ESCAPE) {
                    inlineEditRow.removeSaveButton();
                    $rowTable.jqGrid("restoreRow", rowId);
                }
            });

            self.conf.container.bind("updateCellOverlayView", function (e, dataObj) { //dataObj:columnName/data
                var colName = dataObj['columnName'];
                var cellvalue = dataObj['cellData'];
                var allData = dataObj['allData'];
                var cellFormatter = dataObj['formatter'];
                var textAreaValue = cellvalue;
                var breaks = 1;
                if (cellvalue instanceof Array) {
                    textAreaValue = cellvalue[0];
                    breaks = cellvalue.length;
                    for (var i = 1; i < cellvalue.length; i++) {
                        textAreaValue += "\n" + cellvalue[i];
                    }
                } else if (cellvalue instanceof Object) {
                    textAreaValue = '';
                    for (var key in cellvalue) {
                        textAreaValue += key + ": " + cellvalue[key] + "\n";
                        breaks++;
                    }
                }
                var $textArea = $row.find("textarea[name='" + colName + "']");
                $textArea.attr('rows', breaks).val(textAreaValue);
                $textArea.closest('td').data(allData);
                if (cellFormatter)
                    cellFormatter($textArea[0], allData);
            });
        };

        /**
         * Reformat the output row removing internal grid elements
         * @param {Object} row - Original row
         * @returns {Object} Row without internal grid elements
         * @inner
         */
        var reformatRow = function (row) {
            if (row) {
                delete row['slipstreamgrid_more'];
                delete row['slipstreamgrid_select'];
                delete row['slipstreamgrid_leftAction'];
                for (var columnKey in row) {
                    var column = row[columnKey];
                    if (column instanceof Array) {
                        row[columnKey] = column.filter(function (value) {
                            return value != ''
                        });
                    }
                }
                return row;
            }
        };

        /**
         * Test if the value of a cell is valid according to the its corresponding pattern
         * @param {Object} ele - DOM element that requires validation
         * @param {Object} e - element's event
         * @param {Object} row - current row
         * @inner
         */
        var validateInput = function (ele, e, $row) {
            var $ele = $(ele),
                isRowValidation = (!_.isEmpty($row)) ? isRowInEditMode($row) : false; //We want to check if row validation or input validation

            var validateColumn = function (cellProperties, element) {
                var $element = $(element),
                    clientValidation = cellProperties.pattern,
                    remoteValidation = cellProperties.remote,
                    error = cellProperties.error;
                addFormValidatorDataProperties($element, cellProperties);

                if (clientValidation && remoteValidation) {
                    var isValid = formValidator.isValidValue(clientValidation, element);
                    addErrorMessage($row, element, isValid, error);
                    if (isValid) {
                        $element.bind('remote_' + element.id, function (e, isValid) {
                            addErrorMessage($row, element, isValid, remoteValidation.error);
                        });
                        formValidator.isValidValue('', element, remoteValidation);//asynchronous call to server
                    }
                } else if (clientValidation) {
                    var isValid = formValidator.isValidValue(clientValidation, element);
                    addErrorMessage($row, element, isValid, error);
                } else if (remoteValidation) {
                    $element.bind('remote_' + element.id, function (e, isValid) {
                        addErrorMessage($row, element, isValid, remoteValidation.error);
                    });
                    formValidator.isValidValue('', element, remoteValidation);//asynchronous call to server
                } else {
                    triggerCustomEvent($element, true);
                }
            };

            if (isRowValidation) {
                if ($row.length !== 0) {
                    var currentRowId = $row.attr('id');
                    for (var colName in self.conf.cellProperties) {
                        var col = $row.find("#" + currentRowId + "_" + colName)
                        validateColumn(self.conf.cellProperties[colName], col[0]);
                    }
                }
            } else if (!_.isEmpty($ele) && $ele.closest('tr')[0]) {
                var colName = ele.id.substring($ele.closest('tr').attr('id').length + 1);
                var cellProperties = self.conf.cellProperties[colName];
                if (cellProperties) {
                    validateColumn(cellProperties, ele);
                }
            }
        };

        /**
         * Triggers a custom event using the name provided by the data-trigger attribute
         * Listeners of the custom event should implement a binding event handler. For example: $ele.bind(custom_event,function(){...});
         * @param {Object} $ele - Jquery element that needs validation
         * @param {boolean} isValid - true if the element passed the input validation and false if the validation failed
         * @inner
         */
        var triggerCustomEvent = function ($ele, isValid) {
            var custom_event = $ele.attr('data-trigger');
            if (custom_event) {
                $ele.trigger(custom_event, isValid);
            }
        };

        /**
         * Set properties to a specific element for validation
         * @param {Object} $ele - Jquery element that needs validation
         * @param {Object} cellProperties - Object with all columns and the type, pattern, error, values that the column should have.
         * @inner
         */
        var addFormValidatorDataProperties = function ($ele, cellProperties) { //ToDo: Extend for other form validator patterns that need data attributes
            var pattern = cellProperties.pattern;
            switch (pattern) {
                case "length":
                    cellProperties["min_length"] && $ele.attr('data-minLength', cellProperties["min_length"]);
                    cellProperties["max_length"] && $ele.attr('data-maxLength', cellProperties["max_length"]);
                    break;
            }
            cellProperties["post_validation"] && $ele.attr('data-trigger', cellProperties["post_validation"]);
        };

        /**
         * Shows or hides error messages depending on the cell validation
         * @param {Object} $row - jQuery object of the row
         * @param {Object} ele - DOM element that requires a validation message
         * @param {boolean} isValid - true if the value of the cell is valid and false otherwise
         * @param {string} error - error message that will be shown if validation fails
         * @inner
         */
        var addErrorMessage = function ($row, ele, isValid, error) {
            var $ele = $(ele),
                errorElement = $ele.siblings('.error'),
                $parent = $ele.parent(),
                errorTemplate = render_template(templates.inputCellEnd, {'error': error});
            if (/true/.test(isValid)) {
                $parent.find('.error').remove();
            } else if (!errorElement.length) {
                $parent.append(errorTemplate);
            }
            inlineEditRow && inlineEditRow.addSaveButtonOverlay($row);
            triggerCustomEvent($ele, isValid);
        };

        /**
         * Adds a quick view event when the quick view action is triggered from the column action or the context menu
         * @param {string} rowId - id of the row that will show the quick view
         * @param {Object} $row - jQuery object of the row
         * @param {Object} $gridTable - jQuery object of the table that contains the row
         * @inner
         */
        var addQuickViewEvent = function (rowId, $row, $gridTable) {
            var selectedRows = getSelectedRows(),
                quickViewData;

            //builds the data that will be sent with the quickViewEvent
            if (rowId) {
                var formattedRowId = gridConfigurationHelper.escapeSpecialChar(rowId),
                    rawRow = conf.elements.tree ? originalRowData[formattedRowId] : $row.data('jqgrid.record_data'),
                    rowData = reformatRow($gridTable.jqGrid('getRowData', rowId));
                quickViewData = {
                    "$rowAndTable": [{
                        "$row": $row,
                        "$table": $row,
                        "rawRow": rawRow,
                        "rowData": rowData
                    }],
                    "lastSelectedRowId": rowId,
                    "numberOfSelectedRows": 1,
                    "selectedRowIds": [rowId],
                    "selectedRows": [rowData], //keeps it backward compatible
                    "selectedRowsDom": [$row]
                };
            } else {
                quickViewData = _.extend({}, selectedRows);
                delete quickViewData.isRowCopied;
                delete quickViewData.isRowDisabled;
                delete quickViewData.isRowEnabled;
                $row =  selectedRows.selectedRowsDom[0];
            }
            quickViewData.nonQuickViewSelectedRows = selectedRows; //introduces the current selected rows

            //updates the state of the quick view icon
            updateQuickViewIcon($row, $gridTable, true);

            triggerActionEvent("quickViewEvent", quickViewData);
        };

        /**
         * Updates the quick view icon by removing any existing icon and then adding it to the current row.
         * @returns {Object} $row - jQuery object of the row
         * @returns {Object} $gridTable - jQuery object of the table that contains the row
         * @inner
         */
        var updateQuickViewIcon = function ($row, $gridTable) {
            var $quickViewGridTable = $gridTable || gridTable;
            $quickViewGridTable.find(".quickView[data-preview-triggered]").removeAttr("data-preview-triggered");
            $row && $row.find(".quickView").attr("data-preview-triggered", "");
        };

        /**
         * Removes the quick view mode by removing a quick view icon currently associated to a row.
         * The method is required when the quickViewEvent is triggered, and then a quick view is opened by the user of the grid widget. When the final user closes the quick view, the user of the widget needs to inform to the grid widget that the quick view has been closed.
         */
        this.removeQuickView = function () {
            updateQuickViewIcon();
        };

        /**
         * Adds clear all event when the clearAll action is triggered from the more menu or the context menu. It allows to clear all row selections.
         * @inner
         */
        var clearAllSelection = function () {
            var previousSelectedRows = getSelectedRows();
            if (conf.elements.tree) {
                unselectAllTreeRows();
                gridTable.find('tr.selectedRow').removeClass('selectedRow');
            } else {
                resetSelectedRows(gridTable[0]);
                allRowIds.selectAllEnabled = false;
                allRowIds.selectAllReset = false;
            }

            containers.$selectAllCheckbox.removeAttr('checked');
            updateGridSelectionCount();
            columnSwitchOnHover && columnSwitchOnHover.toggleSwitchCol(gridContainer);
            triggerActionEvent("clearAllEvent", previousSelectedRows);
        };

        /**
         * Shows or hides columns and resizes grid width accordingly
         * @param {String} columnName - name of the column
         * @param {Boolean} showColumn - true to show a column and false to hide it.
         * @param {Boolean} triggerResize - true to show a column or falsy to hide it.
         * @param {Boolean} groupId - id of the group column to show/hide
         * @inner
         */
        var showHideGridColumn = function (columnName, showColumn, triggerResize, groupId) {
            //Shows or hides columns using the jqGrid library
            var showHideCol = function (name, show) {
                if (show) {
                    gridTable.jqGrid('showCol', name);
                } else {
                    gridTable.jqGrid('hideCol', name);
                }
            };
            if (_.isUndefined(groupId)) {//handles regular show/hide of columns without a group
                showHideCol(columnName, showColumn);
            } else if (groupColumn) {//handles show/hide of columns that have group columns
                var groupColumnState = groupColumn.getGroupColumnState()[groupId];
                if (showColumn && groupColumnState.collapsed) { //collapsed group column needs to show/hide only the first column
                    if (columnName == groupColumnState.firstColumn) {
                        showHideCol(columnName, showColumn);
                    }
                } else {//expanded group column should show/hide all columns
                    showHideCol(columnName, showColumn);
                }
            }
            if (triggerResize !== false) {//group column closes a group of columns at a time; therefore, no need to trigger resizing of the grid width until the last column is hidden
                gridContainer.trigger('slipstreamGrid.resized:width'); //jqGrid by default saves the column area when rendering the grid; so that, the grid needs to be resized.
            }
        };

        /**
         * Builds an array with the labels provided in the configuration of the grid and group collapse/expand controls for group columns
         * @param {Object} columnsJson - Object with the columns configuration
         * @returns {Array} Array with labels
         * @inner
         */
        var getColumnNames = function (columnsJson) {
            var labelArray = [],
                column, label, customLabel;
            if (groupColumn) {
                var groupColumnHash = groupColumn.getGroupsWithColumnName(),
                    formatLabel = function (groupLabel, groupColumn) { //generates the html required for the title (label) of group columns
                        if (groupColumnHash && groupColumnHash[groupColumn.group]) {
                            var group = groupColumnHash[groupColumn.group];
                            groupLabel = render_template(templates.groupColumnTitle, {
                                "content": groupLabel,
                                "count": group.columns.length - 1,
                                "first": groupColumn.name == group.firstLastColumns[0], //first column of the group
                                "last": groupColumn.name == group.firstLastColumns[1], //last column of the group
                                "groupId": groupColumn.group
                            });
                        }
                        return groupLabel;
                    };
            }
            for (var i = 0; i < columnsJson.length; i++) {
                column = columnsJson[i];
                label = column.label;
                if (_.isObject(label)) { //custom column title
                    if (_.isFunction(label.formatter))
                        customLabel = {
                            "content": label.formatter(column.name, column)
                        };
                    label = render_template(templates.customColumnLabel, customLabel);
                }
                if (column.group) {//group title
                    label = formatLabel(label, column);
                }
                labelArray.push(label);
            }
            return labelArray;
        };

        /**
         * Gets the cell properties required to edit a cell from the elements property and the cellOverlayView property.
         * If a column has a cellOverlayView defined, the column is considered a view; otherwise the type of column (input, dropdown) is retrieved from the elements property.
         * @returns {Object} Object with all columns and the type, pattern, error, values that the column should have.
         * @inner
         */
        var getCellProperties = function () {
            var columns = conf.elements.columns,
                cellProperties = {},
                i, column, editCell;
            for (i = 0; columns && i < columns.length; i++) {
                column = columns[i];
                if (!_.isEmpty(column) && _.isObject(column)) {
                    if (column['width'] && _.isString(column['width']) && ~column['width'].indexOf('%'))
                        autoWidth = true;
                    if (column['editCell'])
                        cellProperties[column.name] = column['editCell'];
                    if (column['collapseContent'] && column['collapseContent']['overlaySize']) {
                        cellProperties[column.name] = {
                            'overlaySize': column['collapseContent']['overlaySize']
                        }
                    }
                } else {
                    throw new Error(errorMessages.noColumData);
                }
            }
            for (var key in conf.cellOverlayViews) {
                if (conf.cellOverlayViews[key]) {
                    cellProperties[key] = cellProperties[key] ? cellProperties[key] : {};
                    var hasPredefinedViewType = cellProperties[key] && cellProperties[key]["type"];
                    if (!hasPredefinedViewType) { //if the cell has a predefined view type, then "cell to be edited on overlay" is not applied
                        _.extend(cellProperties[key], {
                            "type": "view",
                            "values": conf.cellOverlayViews[key]
                        });
                    }
                }
            }
            return cellProperties;
        };

        /**
         * Gets the DOM elements for each cell in a row during edition mode
         * @param {Object} $row - row wrapped in a jQuery object
         * @param {boolean} isDom - sets the return values of the object in a DOM or a jQuery format
         * @param {boolean} isParent - sets the return values of the object in a DOM or a jQuery format
         * @returns {Object} All DOM elements available during edition mode
         * @inner
         */
        var getRowCells = function ($row, isDom, isParent) {
            var cells = {}, cell;
            var cellProperties = self.conf.cellProperties;
            for (var key in cellProperties) {
                var cellProperty = cellProperties[key];
                // var type = '';
                // if (!isParent){
                //     type = cellProperty['type'];
                //     if (cellProperty['type'] == 'view')
                //         type = 'textarea';
                //     else if (cellProperty['type'] == 'dropdown')
                //         type = 'select';
                // }
                cell = $row.find('td[aria-describedby$="_' + key + '"]');
                if (cell.children())
                    cell = cell.children();
                if (isDom) cell = cell[0];
                cells[key] = cell;
            }
            return cells;
        };

        var getCellsData = function ($row) {
            var cellsData = {},
                columnName, $cell, cellData;
            var cells = getRowCells($row, false, true);
            for (columnName in cells) {
                $cell = cells[columnName];
                cellData = $cell.data();
                if (!_.isEmpty(cellData))
                    cellsData[columnName] = cellData;
            }
            return cellsData;
        };

        /**
         * Test if the current grid view has been filtered
         * @inner
         */
        var isFilteredGrid = function () {
            if (conf.elements.filter && containers.$searchContainer.children().length && containers.$searchContainer.is(":visible"))
                return true;
            else
                return false;
        };

        /**
         * Checks whether selection counter should be visible or not
         * @returns {Boolean} 
         * @inner
         */
        var showSelection = function () {
            var hideSelectionAndRowCount = (conf.elements.footer && conf.elements.footer.hideSelectionAndRowCount) ? true : false;
            var showSelection = _.isBoolean(conf.elements.showSelection) ? conf.elements.showSelection : true; 
            if(!showSelection || hideSelectionAndRowCount) {
                return false;
            } else {
                return true;
            }
        };

        /**
         * Throw error messages depending on the parameter that is missing in the configuration object
         * @inner
         */
        var throwErrorMessage = function () {
            if (typeof(conf) === 'undefined') throw new Error(errorMessages.noConf);
            else if (typeof(conf.container) === 'undefined') throw new Error(errorMessages.noContainer);
            else if (typeof(conf.elements) === 'undefined') throw new Error(errorMessages.noElements);
            else if (typeof(conf.elements.columns) === 'undefined') throw new Error(errorMessages.noColums);
        };

        /**
         * Gets the list view type from the conf.elements.viewType which is used for defining the style that a grid could have
         * @inner
         */
        var getListViewType = function () {
            if (_.isString(conf.elements.viewType)) {
                switch (conf.elements.viewType) {
                    case "card":
                        return {
                            'cardView': true
                        }
                    case "list":
                        return {
                            'listView': true
                        }
                }
            }
        };

        /**         
         * Adds highlight animaiton to the row that is passed as argument
         * @param {object} $newRow: jQuery object of the row that needs highlighting
         */
        var setGridHighlightStyles = function ($newRow) {
            var $prevRow = $newRow.prev();
            function resetStyles() {
                // Reset to original value for the previous row
                $prevRow.removeClass("no-bottom-border");
                $newRow.removeClass("scroll_highlight");                
            }
            //Previous row's bottom border prevents the current row top border from showing.
            //So, the value is temporarily set to zero until the row highlight animation completes
            $prevRow.addClass("no-bottom-border");
            $newRow.addClass("scroll_highlight");
            setTimeout(resetStyles, 1000);
        };

        /**
         * Destroys all elements created by the GridWidget in the specified container
         * @returns {Object} Current GridWidget object
         */
        this.destroy = function () {
            if (gridConfigUtil) {
                gridConfigUtil.destroy();
            }

            gridContainer.find(".gridTableFooter .refresh").off("click");

            $(conf.container).remove();
            return this;
        };
        /**
         * Force grid to resize in order to recalculate the width of the container
         */
        this.resizeGridWidth = function () {
            containers.$gridWidget.trigger('slipstreamGrid.resized:width', true);
        };
    };

    GridWidget.prototype = Object.create(BaseWidget.prototype);
    GridWidget.prototype.constructor = GridWidget;

    return GridWidget;
});