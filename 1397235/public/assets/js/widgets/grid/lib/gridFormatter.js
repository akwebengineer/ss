/**
 * A module reformats the grid configuration object for adding columns by using the jqGrid configuration format
 *
 * @module GridFormatter
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'lib/template_renderer/template_renderer',
    'widgets/grid/lib/columnFilter',
    'widgets/grid/lib/columnActionFormatter',
    'widgets/grid/lib/baseContentCellFormatter',
    'widgets/grid/lib/groupContentCellFormatter',
    'widgets/grid/lib/collapseContentEditCellFormatter',
    'widgets/grid/lib/collapseContentCellFormatter',
    'widgets/grid/lib/typeCellFormatter',
    'widgets/grid/lib/dropdownEditCellFormatter',
    'widgets/grid/lib/dropdownEditBuilder'
], /** @lends GridFormatter */
function (render_template, ColumnFilter, ColumnActionFormatter, BaseContentCellFormatter, GroupContentCellFormatter, CollapseContentEditCellFormatter, CollapseContentCellFormatter, TypeCellFormatter, DropdownEditCellFormatter, DropdownEditBuilder) {
    /**
     * GridFormatter constructor
     *
     * @constructor
     * @class GridFormatter - Reformats the grid configuration object.
     *
     * @param {Object} templates - grid templates
     * @param {Class} gridConfigurationHelper - Grid gridConfigurationHelper Class
     * @param {Object} searchUtility - search Utility instance
     * @param {Object} gridSizeCalculator - gridSizeCalculator instance
     * @returns {Object} Current GridFormatter's object: this
     */
    var GridFormatter = function (templates, gridConfigurationHelper, searchUtility, gridSizeCalculator) {

        /**
         * Builds the GridFormatter
         * @returns {Object} Current "this" of the class
         */

        var lookupLabelContentTable = {},
            searchableColumns = {},
            columnFilter = new ColumnFilter(gridConfigurationHelper, searchUtility, gridSizeCalculator),
            defaults = {
                "simpleGridRowHeight": 21, //sets default row height
                "simplifiedGridRowHeight": 29, //sets default row height
                "simplifiedGridRowWidth": 180, //sets default row width per column
                "multiselectColWidth": 40 //multiselect is 35px and padding is 5px
            },
            self = this,
            isCollapseRequired = false,
            hasBindRowExpand = false,
            isRowSortable, rowMaxElementConf, groupContentCellFormatter, switchColumn, isCellsDnD,
            $gridTable, collapseContentEditCellFormatter, collapseContentCellFormatter,
            dropdownEditCellFormatter, dropdownEditBuilder, baseContentCellFormatter, viewType, lessIconTemplate;

        /**
         * Initialize GridFormatter
         * @param {Object} confElements - current conf.elements configuration
         */
        var init = function(confElements){
            baseContentCellFormatter = new BaseContentCellFormatter(confElements, gridConfigurationHelper, templates);
            groupContentCellFormatter = undefined;
            collapseContentEditCellFormatter = undefined;
            collapseContentCellFormatter = undefined;
            dropdownEditCellFormatter = undefined;
            dropdownEditBuilder = undefined;
            viewType = confElements.viewType;
            lessIconTemplate = render_template(templates.moreCell, {
                lessIcon: "lessIcon",
                collapseContent: false,
                isCard: viewType == "card"
            });
        };

        this.formatFilterConfiguration = function (conf, url) {
            var config = $.extend(true, {}, conf.elements); //deep copy
            config.url = url;
            if (config.subGrid) {
                config.jsonRoot = config.subGrid.jsonRoot;
                config.scroll = config.subGrid.scroll;
                config.height = config.subGrid.height;
                config.numberOfRows = config.subGrid.numberOfRows;
                config.showRowNumbers = config.subGrid.showRowNumbers;
                delete config.subGrid;
                var columns = config.columns,
                    column;
                for (var i = 0; i < columns.length; i++) {
                    column = columns[i];
                    if (column.groupBy) {
                        column.hidden = true;
                        break;
                    }
                }
            }
            return config;
        };

        /**
         * get the switched column config. If none, then return undefined
         */
        this.getSwitchColumnConfig = function () {
            return switchColumn;
        };

        /*
         * Sets the collapse row configuration to be used to set the max numbers of elements that can be seen in a cell when the row is expanded or collapsed
         * @inner
         */
        var setCollapseRowConfiguration = function (conf) {
            rowMaxElementConf = {
                "collapse": (conf.rowMaxElement && conf.rowMaxElement.collapse) ? conf.rowMaxElement.collapse : 1,
                "expand": (conf.rowMaxElement && conf.rowMaxElement.expand) ? conf.rowMaxElement.expand : 5,
                "edit": (conf.rowMaxElement && conf.rowMaxElement.edit) ? conf.rowMaxElement.edit : 5,
                "groupContentCollapseItems": 1, //number of items per cell column in a collapse state
                "groupContentItems": (conf.rowMaxElement && conf.rowMaxElement.groupContentItems) ? conf.rowMaxElement.groupContentItems : 2, //todo: height of row is set for two items, a configurable value will break virtual scrolling and the predefined. UX to define a different approach so this parameter is deprecated or used differently.
                "groupContentColumns": (conf.rowMaxElement && conf.rowMaxElement.groupContentColumns) ? conf.rowMaxElement.groupContentColumns : 15,//for card responsiveness
                "hasCollapseExpandConfig": conf.rowMaxElement && (conf.rowMaxElement.collapse || conf.rowMaxElement.expand) ? true : false
            };
        };

        /*
         * Adjust the row as per its content by modifying its height, width and removing the expand/collapse icon when it's not needed
         * @param {Object} $gridTable - jQuery object with the grid table
         */
        this.adjustMultipleCellRow = function (gridTable) {
            if (isCollapseRequired) {
                if (_.isUndefined($gridTable)) {
                    $gridTable = gridTable;
                }
                if (rowMaxElementConf.hasCollapseExpandConfig) {
                    $gridTable.find('.cellCollapseWrapper').css({
                        "max-height": defaults.simpleGridRowHeight * rowMaxElementConf.collapse
                    });
                } else if (groupContentCellFormatter) {
                    $gridTable.find('.groupContentHeight.expand').css({
                        "height": defaults.simplifiedGridRowHeight * rowMaxElementConf.groupContentItems
                    });
                    $gridTable.find('.groupContentWidth').css({
                        "max-width": defaults.simplifiedGridRowWidth * rowMaxElementConf.groupContentColumns
                    });
                }                
                $gridTable.find(".jqgrow").each(function () {
                    var $row = $(this),
                        $more = $row.find(".slipstreamgrid_more"),
                        collapseCellContent = hasCollapseContent($row);
                    if ((groupContentCellFormatter && groupContentCellFormatter.hasCollapseCell($row)) || collapseCellContent) {
                        $more.addClass("cellClickable");
                        $more.find(".moreIcon").addClass("moreIconShow");
                    } else {
                        $more.empty();
                    }
                });
            }
        };

        /*
         * Toggles the content of a cell by adding the expand cell content
         * @param {Object} row - row that is toggled
         * @param {Object} $gridTable - jQuery object with the grid table for the row
         * @param {Object} tooltipBuilder - Tooltip builder instance to be applied on the row more icon
         */
        this.toggleRow = function (row, $gridTable, tooltipBuilder) {
            var $row = $(row);
                
            if (groupContentCellFormatter){
                groupContentCellFormatter.toggleGroupContentCell(row, $gridTable, tooltipBuilder, lessIconTemplate);
            }
            if (collapseContentCellFormatter){
                var isRowExpandedBefore = $row.find('.cellExpandWrapper').length ? true : false;
                collapseContentCellFormatter.toggleCollapseContent($gridTable, row, templates.moreCell, lessIconTemplate);    

                if (!isRowExpandedBefore && rowMaxElementConf.hasCollapseExpandConfig) {
                    $row.find('.cellExpandWrapper').css({
                        "max-height": defaults.simpleGridRowHeight * rowMaxElementConf.expand
                    });
                }
            }
        };

        var getNumberOfRows = function (gridConfiguration) {
            var numberOfRows = gridConfiguration.numberOfRows;
            if (gridConfiguration.height == 'auto' && numberOfRows) {
                if (_.isBoolean(gridConfiguration.autoPageSize) && !gridConfiguration.autoPageSize) {
                    return numberOfRows;
                } else if (parseInt(numberOfRows) < 50) {
                    return 50;
                }
            }
            return numberOfRows;
        };

        /*
         * Splits the columns objects into two columns: column and columnSubGrid if subGrid object is available
         * Also, adds custom formatters and unformats.
         */
        this.formatConfiguration = function (conf, treeFormatter, containers) {
            var gridConfiguration = _.extend({}, conf),//deep copy
                $gridContainer = containers.$gridWidget,
                $searchContainer = $gridContainer.find('.search-container'),
                draggableClass;

            isCellsDnD = (gridConfiguration.dragNDrop && (gridConfiguration.dragNDrop.moveCell || gridConfiguration.connectWith)) ? true : false;
            isRowSortable = gridConfiguration.dragNDrop && gridConfiguration.dragNDrop.moveRow && gridConfiguration.dragNDrop.moveRow.afterDrop;
            columnFilter.setGridContainer(containers);
            gridConfiguration.numberOfRows = getNumberOfRows(gridConfiguration);
            init(conf);

            setCollapseRowConfiguration(conf);
            if (gridConfiguration.dragNDrop) {
                draggableClass = getDragNDropClass(gridConfiguration);
            }

            var originalColumns = gridConfiguration.columns;
            var columns = [],
                subGridColumns = [],
                moreColum = {
                    "index": "slipstreamgrid_more",
                    "name": "slipstreamgrid_more",
                    "label": "",
                    "formatter": showMoreIcon,
                    "unformat": hideIcon,
                    "width": "32",
                    "search": false,
                    "sortable": false,
                    "resizable": false,
                    "fixed": true,
                    "classes": "slipstreamgrid_more " + draggableClass
                },
                emptyColum = {
                    "name": "slipstreamgrid_empty",
                    "label": "",
                    "width": "30",
                    "search": false,
                    "sortable": false,
                    "resizable": false,
                    "fixed": true,
                    "classes": draggableClass
                },
                isSwitchColWithRowSelection = false,
                column, subGridColumn, formatter, unformat, switchColumnIndex, switchNestedColumnIndex, typeCellFormatter;

            for (var i = 0; i < originalColumns.length; i++) {
                formatter = null, unformat = null;
                column = getColumn(originalColumns[i], $searchContainer, conf, templates);

                if (originalColumns[i]['collapseContent']) {
                    if (_.isUndefined(collapseContentCellFormatter)) {
                        collapseContentCellFormatter = new CollapseContentCellFormatter(gridConfiguration, gridConfigurationHelper, baseContentCellFormatter, templates, rowMaxElementConf, lookupLabelContentTable);
                        collapseContentCellFormatter.init();
                        isCollapseRequired = true;
                    }
                    if (originalColumns[i]['collapseContent'].keyValueCell) {
                        formatter = collapseContentCellFormatter.formatObjectContent;
                        unformat = collapseContentCellFormatter.unformatObjectContent;
                        lookupLabelContentTable[originalColumns[i]['name']] = originalColumns[i]['collapseContent']['lookupKeyLabelTable'];
                    } else {
                        formatter = collapseContentCellFormatter.formatArrayContent;
                        unformat = collapseContentCellFormatter.unformatArrayContent;
                    }
                } else if (originalColumns[i]['groupContent']) {
                    if (_.isUndefined(groupContentCellFormatter)) {
                        groupContentCellFormatter = new GroupContentCellFormatter(gridConfigurationHelper, baseContentCellFormatter, templates, rowMaxElementConf, defaults);
                        groupContentCellFormatter.init(containers);
                        isCollapseRequired = true;
                    }
                    formatter = groupContentCellFormatter.formatGroupContent;
                    unformat = groupContentCellFormatter.unformatGroupContent;
                } else if (_.isString(originalColumns[i]['type'])) {
                    typeCellFormatter = new TypeCellFormatter(templates, baseContentCellFormatter, originalColumns[i]['type']);
                    formatter = typeCellFormatter.format;
                    unformat = typeCellFormatter.unformat;
                } else {
                    if (originalColumns[i]['showInactive']) {
                        if (gridConfiguration.subGrid)
                            gridConfiguration.subGrid.disableColumn = originalColumns[i]['name'];
                        else
                            gridConfiguration.disableColumn = originalColumns[i]['name'];
                    } else if (originalColumns[i]['onHoverShowRowSelection'] && originalColumns[i].hidden !== true) {
                        isSwitchColWithRowSelection = true;
                    }
                    formatter = baseContentCellFormatter.enableEmptyCell(originalColumns[i], true)
                    unformat = baseContentCellFormatter.enableEmptyCell(originalColumns[i]);
                } 

                if (!gridConfiguration.subGrid) {
                    originalColumns[i]['onHoverShowRowSelection'] && (switchColumnIndex = i);
                    assignFormatterAndUnformat(originalColumns[i], column, formatter, unformat);
                    column['name'] = originalColumns[i]['name'];
                    columns.push(column);
                } else {
                    var showHeader = !originalColumns[i]['hideHeader'];
                    if (originalColumns[i]['groupBy']) {
                        gridConfiguration['groupBy'] = originalColumns[i]['name'];
                        assignFormatterAndUnformat(originalColumns[i], column, formatter, unformat);
                        column['name'] = originalColumns[i]['name'];
                    } else {
                        subGridColumn = getColumn(originalColumns[i], $searchContainer, conf);
                        assignFormatterAndUnformat(originalColumns[i], subGridColumn, formatter, unformat);
                        subGridColumn['name'] = originalColumns[i]['name'];
                    }
                    if (column && showHeader) {
                        originalColumns[i]['onHoverShowRowSelection'] && (switchColumnIndex = columns.length);
                        columns.push(column);
                    }
                    if (subGridColumn) {
                        originalColumns[i]['onHoverShowRowSelection'] && (switchNestedColumnIndex = subGridColumns.length);
                        subGridColumns.push(subGridColumn);
                    }
                }
                //Add dragNDrop classes
                column = addDragNDropColumnClass(column, gridConfiguration);

                //Add multiselection classes
                column = addMultiselectColumnClass(column);
            }

            if (isSwitchColWithRowSelection && _.isUndefined(switchColumn)) {
                switchColumn = columns.splice(switchColumnIndex, 1);
                if (gridConfiguration.subGrid) {
                    switchColumn = subGridColumns.splice(switchNestedColumnIndex, 1);
                }
            }

            if (gridConfiguration.contextMenu && gridConfiguration.contextMenu.quickView) {
                columns.unshift(new ColumnActionFormatter().getSelectionColumn(conf));
            }

            if (isCollapseRequired) {
                if (gridConfiguration.subGrid)
                    subGridColumns.unshift(moreColum);
                else
                    columns.unshift(moreColum)
            } else {
                if (gridConfiguration.subGrid && _.isUndefined(gridConfiguration.viewType)) //not list style
                    subGridColumns.unshift(emptyColum);
            }

            if (gridConfiguration.tree && (gridConfiguration.multiselect || gridConfiguration.singleselect)) {
                columns.unshift(treeFormatter.getSelectionColumn(conf));
            }

            if (isSwitchColWithRowSelection && !_.isUndefined(switchColumn)) {
                var switchCol = switchColumn[0];

                switchCol.hidden = true;
                switchCol.width = setSwitchedColWidth(switchCol);

                if (switchCol.classes) {
                    switchCol.classes += " slipstreamgrid_switch_col";
                } else {
                    switchCol.classes = "slipstreamgrid_switch_col";
                }
                if (gridConfiguration.subGrid) {
                    subGridColumns.unshift(switchCol);
                } else {
                    columns.unshift(switchCol);
                }
            }

            gridConfiguration.columns = columns;
            if (gridConfiguration.subGrid) {
                gridConfiguration.subGrid.columns = subGridColumns;
            }

            return gridConfiguration;
        };

        /*
         * Set switched col width
         * @param {Object} switchCol configuration
         * @inner
         */
        var setSwitchedColWidth = function (switchCol) {
            var switchColWidth;

            if (switchCol.width) {
                var colWidth = _.isNumber(switchCol.width) ? switchCol.width : parseInt(switchCol.width.split('px')[0]);

                if (colWidth < defaults.multiselectColWidth) {
                    switchColWidth = defaults.multiselectColWidth;
                } else {
                    switchColWidth = switchCol.width
                }
            } else {
                switchColWidth = defaults.multiselectColWidth;
            }
            return switchColWidth;
        };

        /*
         * Gets dragNDrop classes
         * @param {Object} grid configuration
         * @inner
         */
        var getDragNDropClass = function (gridConfiguration) {
            if (isRowSortable) {
                return "row_draggable";
            } else if (gridConfiguration.dragNDrop.connectWith) {
                return "cell_draggable";
            }
        };

        /*
         * Add dragNDrop classes to columns
         * @param {Object} column configuration
         * @param {Object} grid configuration
         * @inner
         */
        var addDragNDropColumnClass = function (column, gridConfiguration) {
            var isCellDraggable = false;

            //cell_draggable is for dragNDrop to know which column is draggable
            if ((column.dragNDrop && column.dragNDrop.isDraggable) || (gridConfiguration.dragNDrop && gridConfiguration.dragNDrop.connectWith)) {
                column.classes = _.isUndefined(column.classes) ? 'cell_draggable' : 'cell_draggable ' + column.classes;
                isCellDraggable = true;
            }
            if (!isCellDraggable && isRowSortable) {
                column.classes = _.isUndefined(column.classes) ? 'row_draggable' : 'row_draggable ' + column.classes;
            }
            //cell_droppable is for dragNDrop to know which column is droppable
            if (column.dragNDrop && column.dragNDrop.isDroppable) {
                if (column.dragNDrop.groupId) {
                    column.classes = _.isUndefined(column.classes) ? column.dragNDrop.groupId + '_droppable cell_droppable' : column.dragNDrop.groupId + '_droppable cell_droppable ' + column.classes;
                } else {
                    column.classes = _.isUndefined(column.classes) ? 'cell_droppable' : 'cell_droppable ' + column.classes;
                }
            }
            return column;
        };

        /*
         * Add classes to columns that allows multi selection of items
         * @param {Object} column configuration
         * @inner
         */
        var addMultiselectColumnClass = function (column) {
            if ((column.collapseContent && column.collapseContent.multiselect) || (column.dragNDrop && column.dragNDrop.isDraggable)) {
                column.classes = _.isUndefined(column.classes) ? "multiselect_cell" : "multiselect_cell " + column.classes;
            }
            return column;
        };

        /*
         * Instantiate and initializes the DropdownEditBuilder to be used to insert dropdowns that are built using the Dropdown widget
         * @param {Object} conf - configuration of the grid (elements property)
         * @inner
         */
        var initializeDropdownEditBuilder = function (conf) {
            if (_.isUndefined(dropdownEditBuilder)) {
                dropdownEditBuilder = new DropdownEditBuilder(gridConfigurationHelper, templates);
                dropdownEditBuilder.init(conf);
            }
        };

        /*
         * Get the properties of a column from its original column and reformat its according to jqGrid library requirements
         * @inner
         */
        var getColumn = function (originalColumn, $searchContainer, conf, templates) {
            var column = _.extend({}, originalColumn);
            delete column.editCell;
            if (originalColumn['collapseContent'] && originalColumn['editCell'] !== false) {
                initializeDropdownEditBuilder(conf);
                if (_.isUndefined(collapseContentEditCellFormatter)) {
                    collapseContentEditCellFormatter = new CollapseContentEditCellFormatter(gridConfigurationHelper, dropdownEditBuilder, templates, rowMaxElementConf, lookupLabelContentTable);
                    collapseContentEditCellFormatter.init(conf);
                }
                _.extend(column, collapseContentEditCellFormatter.getEditFormatter(originalColumn));
            } else if (originalColumn['editCell']) {
                var editCell = originalColumn['editCell'];
                var editType = editCell['type'];
                switch (editType) {
                    case 'custom':
                        if (typeof(editCell['element']) == "function" && typeof(editCell['value']) == "function") {
                            column['editable'] = true;
                            column['edittype'] = "custom";
                            column['editoptions'] = {
                                custom_element: editCell['element'],
                                custom_value: editCell['value']
                            };
                        }
                        break;
                    case 'dropdown':
                        initializeDropdownEditBuilder(conf);
                        if (_.isUndefined(dropdownEditCellFormatter)) {
                            dropdownEditCellFormatter = new DropdownEditCellFormatter(gridConfigurationHelper, dropdownEditBuilder, templates);
                        }
                        _.extend(column, dropdownEditCellFormatter.getEditFormatter(originalColumn));
                        break;
                    default:
                        column['editable'] = true;
                        column['value'] = editCell['value'];
                        break;
                }
            }
            if (_.isObject(originalColumn['searchCell'])) {
                delete column.searchCell;
                var searchCell = originalColumn['searchCell'];

                var searchType = searchCell['type'];
                switch (searchType) {
                    case 'dropdown':
                        column['searchoptions'] = columnFilter.getDropdownSearch(column, searchCell, conf);
                        break;
                    case 'date':
                        column['searchoptions'] = (_.isArray(conf.data) && typeof conf.getData == "undefined") ? columnFilter.getInputSearch(column) : columnFilter.getDateSearch(column);
                        break;
                    case 'number':
                        column['searchoptions'] = (_.isArray(conf.data) && typeof conf.getData == "undefined") ? columnFilter.getInputSearch(column) : columnFilter.getNumberSearch(column);
                        break;
                    default:
                        searchType && delete searchType['type'];
                        column['searchoptions'] = searchCell['searchoptions'];
                        break;
                }
                column['searchoptions'].clearSearch = false;
                addSeachableColumn(searchableColumns, originalColumn);
            } else if ($searchContainer && originalColumn['searchCell'] === true) { //simple filtering is enabled
                column['searchoptions'] = columnFilter.getInputSearch(column);
                column['searchoptions'].clearSearch = false;
                addSeachableColumn(searchableColumns, originalColumn);
            } else {
                column['search'] = false;
            }
            if (_.isString(conf.viewType) && conf.viewType == "card") { //only available for auto width, then no column resizable allowed/required
                column['resizable'] = false;
            }
            return column;
        };

        var addSeachableColumn = function (searchableColumns, originalColumn) {
            var key = originalColumn['index'] || originalColumn['name'];
            searchableColumns[key] = originalColumn['searchCell']['type'] || 'input';
        };

        /* Assigns the formatter and unformat functions to a end variable depending on the formatter or unformat of
         * the source.
         */
        var assignFormatterAndUnformat = function (source, end, formatter, unformat) {
            end['formatter'] = formatter ? formatter : source['formatter'];
            end['unformat'] = unformat ? unformat : source['unformat'];
        };

        /* Custom function to update the content of a cell, so that its content can be collapsed on one line
         * and showing instead the number of entries not seen plus the word "more..."
         */
        var showMoreIcon = function (cellvalue, options, rowObject) {
            var rowIcon = render_template(templates.moreCell, {
                moreIcon: "moreIcon",
                collapseContent: true,
                isCard: viewType == "card"
            });
            return rowIcon;
        };

        /*
         * Custom function to remove any markup introduced by showMoreIcon function
         */
        var hideIcon = function (cellvalue, options, rowObject) {
            return "";
        };

        /**
         * Provides all columns that are searchable in the grid
         * @returns {Array} All searchable columns
         */
        this.getSearchableColumns = function () {
            return searchableColumns;
        };

        /**         
         * Identify if a given grid row has content that requires enabling collapsing capability
         * @param {object} $row - jQuery object of the grid row
         * @returns {boolean} collapsible - true or false to determine if the row has collapsible content
         */
        var hasCollapseContent = function ($row) {
            var $moreTooltip =  $row.find(".moreTooltip"),
                $cellContentBlock = $row.find('.objectWrap'),
                collapsible = (gridConfigurationHelper.hasColumnProperty("collapseContent") && $moreTooltip.length > 0) || (gridConfigurationHelper.hasColumnProperty("collapseContent", "keyValueCell")  && $cellContentBlock.length > 0);
            return collapsible;
        };

        /*
         * Get $moreCell only when the row is expanded
         * @param {jQuery Object} $row
         * @returns $moreCell
         */
        this.getExpandedMoreCell = function($row){
            var $moreCell;
            if ($row){
                var collapseCellContent = hasCollapseContent($row);

                if (collapseCellContent){
                    var isExpanded = $row.find('.lessIcon').length > 0 && !$row.find('.lessIcon').hasClass('moreContent') ? true: false;
                    isExpanded && ($moreCell = $row.find(' .slipstreamgrid_more'));
                }
            }
            
            return $moreCell;
        };

        /*
         * Get custom cells that were built during edit mode and using widgets like the dropdown widget
         * @returns {Object} All cells that have an integrated widget with columnName as a key and details of the cell as a value
         */
        this.getIntegratedWidgetsOnEditMode = function () {
            var integratedWidgets = {};
            if (dropdownEditBuilder) {
                _.extend(integratedWidgets, dropdownEditBuilder.getDropdownInstancePerColumn());
            }
            return integratedWidgets;
        }

    };

    return GridFormatter;
});