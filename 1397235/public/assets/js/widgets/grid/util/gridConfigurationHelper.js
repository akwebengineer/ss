/**
 * A module contains the helper methods for the grid configuration
 *
 * @module GridConfigurationHelper
 * @author Vidushi Gupta<vidushi@juniper.net>
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([], /** @lends GridConfigurationHelper */
function () {

    /**
     * GridConfigurationHelper constructor
     *
     * @constructor
     * @class GridConfigurationHelper - Builds a Grid widget from a configuration object.
     * @param {Object} conf - grid configuration object
     * @returns {Object} Current GridConfigurationHelper's object: this
     */
    var GridConfigurationHelper = function (conf) {

        var searchCellValueHash = {};
        /**
         * creates a hash of all the column based on column index as key & column details as value object
         * @returns {Object} Object with hash of column index with column details values
         */
        this.buildColumnConfigurationHash = function () {
            // create the hash for the columns
            var columnDetails = {};
            $.each(conf.elements.columns, function (index, column) {
                columnDetails[column.index] = column;
            });
            return columnDetails;
        };

        /**
         * creates a hash for the values configuration of searchCell from specific column config
         * @param {Object} searchCell - searchCell configuration for specific column
         * @returns {Object} Object with hash of label & value
         */
        this.buildColumnSearchCellHash = function (key, searchCell) {
            // create the hash for the columns
            if (_.isEmpty(searchCellValueHash) || typeof(searchCellValueHash[key]) == "undefined") {
                if (searchCell.type == "dropdown" && _.isArray(searchCell.values)) {
                        var labelValueHash = {};
                        $.each(searchCell.values, function (index, valueObject) {
                            labelValueHash[valueObject.label] = valueObject.value;
                        });
                        searchCellValueHash[key] = labelValueHash;
                }
            }

            return searchCellValueHash;
        };

        /**
         * Retrieve child data from the data object 
         * @param {Object} data
         * @param {String} path. for example: addresses.address
         * @inner
         */
        this.getNestedData = function(data, path){
            var originalData = data,
                jsonRoot = conf.elements.jsonRoot,
                recordsRoot = path ? path.split('.') : jsonRoot ? jsonRoot.split('.') : undefined;
            if (recordsRoot && recordsRoot.length > 0){
                for(var i = 0; i < recordsRoot.length; i++){
                    if (data[recordsRoot[i]]){
                        data = data[recordsRoot[i]];
                    }
                }
                originalData = $.isArray(data) || path ? data : [data];
            } else {
                originalData = data[jsonRoot];
            }
            return originalData
        };

        /**
         * creates a hash of all the column based on column name as key & column details as value object
         * @param {String} columnProperty - the property that the columns will include
         * @returns {Object} Object with hash of column name with column details values
         */
        this.buildColumnConfigurationHashByName = function (columns, columnProperty) {
            // create the hash for the columns
            var columnDetails = {},
                columnsConfig = columns || conf.elements.columns;
            $.each(columnsConfig, function (index, column) {
                if (columnProperty && column[columnProperty]){
                    columnDetails[column.name] = column;
                }else if (_.isUndefined(columnProperty)){
                    columnDetails[column.name] = column;
                }
            });
            return columnDetails;
        };
        
        /**
         * return column configuration data
         * @param {Object} Object with hash of column name with column details values
         * @param {Array} Array with config path
         */
        this.getColumnConfiguration = function (columns, paths) {
            var columnDetails,
                columnsConfig = columns || conf.elements.columns;

            $.each(columnsConfig, function (index, column) {
                var currentConf = column,
                    count = 0;
                for (var i = 0; i < paths.length; i++){
                    if (currentConf[paths[i]]){
                        currentConf = currentConf[paths[i]];
                        count += 1;
                    }else{
                        break;
                    }
                }
                if (count === paths.length){
                    columnDetails = column;
                }
            });
            return columnDetails;
        };

        /**
         * return column name
         * @param {Object} element with aria-describedby attribute
         * @param {String} tableId
         * @returns {String} column name
         */
        this.getColumnName = function ($element, tableId) {
            return $element.attr('aria-describedby').replace( tableId + "_", '');
        };

        /**
         * Get the column name from header
         * @param {String} tid - tableId
         * @param {String} columnId
         * @inner
         */
        this.getHeaderColumnName = function(tid, columnId){
            return columnId.replace(/^jqgh_/, "").replace(tid,"");
        };

        /**
         * return jqGrid multiselect checkbox
         * @param {Object} element with aria-describedby attribute
         * @param {String} tableId
         * @returns {Object} jQuery object with the found multiselect checkbox
         */
        this.getCheckbox = function ($element, tableId) {
            if (conf.elements.tree){
                return $element.find(".tree_custom_checkbox");
            }else{
                return $element.find("[aria-describedby= "+ tableId+"_cb]");
            }
        };

        /**
         * return jqGrid cell by finding the cell with the aria-descibedby property composed by tableId and column name
         * @param {Object} jQuery object where the element with aria-describedby attribute will be searched
         * @param {String} tableId
         * @param {String} columnName
         * @returns {Object} jQuery object with the found cell
         */
        this.getCell = function ($container, tableId, columnName) {
            var cellAttr = tableId + "_" + this.escapeSpecialChar(columnName);
            return this.getCellsFromAriaDescribedBy($container, cellAttr);
        };

        /**
         * Gets all the cells that matches the aria-describedby cellAttr for the given container
         * @param {Object} $container - jQuery DOM Object that will be searched
         * @param {String} cellAttr - aria-describedby attribute that will be searched in the container
         * @returns {Object} $columnCells - jQuery DOM Object that matches the search
         */
        this.getCellsFromAriaDescribedBy = function($container, cellAttr) {
            var $columnCells = $container.find("td[aria-describedby="+cellAttr+"]");
            return $columnCells;
        };

        /**
         * return the formatted string in order to search in the DOM
         * @param {String} str
         * @returns {String} formatted str
         */
        this.escapeSpecialChar = function(str){
            return str.replace(/[.:@]/g, "\\$&");
        };

        /**
         * Get all columns of a grid except the ones that are not available in the grid configuration and added by either the grid library or the grid implementation
         * @param {Object} gridTable - table generated by the grid library
         * @param {Array} columnProperties - list of properties that the columns will include
         * @returns {Object} All columns except the reserved ones
         */
        this.getGridColumns = function (gridTable, columnProperties){
            if (gridTable) {
                var colArray = gridTable.getGridParam('colModel'),
                //reserved columns are added by the grid library or the grid widget but that are not part of the original grid configuration
                    reservedColumns = ['cb', 'slipstreamgrid_more', 'slipstreamgrid_leftAction', 'slipstreamgrid_select'];
                var trimmedColArray = _.filter(colArray, function(item){
                    // filter out the checkbox col used for row selection and other decl. based cols.
                    return !(~reservedColumns.indexOf(item.name));
                });
                if (columnProperties) {
                    var filteredColArray = [],
                        filteredColumn;
                    trimmedColArray.forEach(function (column) {
                        filteredColumn = {};
                        columnProperties.forEach(function (property) {
                            filteredColumn[property] = column[property];
                        });
                        filteredColArray.push(filteredColumn);
                    });
                    trimmedColArray = filteredColArray;
                }
                return trimmedColArray;
            }
        };

        /**
         * Gets the horizontal offset (number of pixels) of a column with respect to the grid container
         * @param {Object} gridTable - table generated by the grid library
         * @param {String} columnName - name of a column
         * @param {int} isSwitchColWithRowSelection - grid has switched col onHover
         * @returns {int} number of pixels
         */
        this.getGridColumnOffset = function (gridTable, columnName, isSwitchColWithRowSelection) {
            var columnName = columnName || conf.elements.columns[0].name,
                colArray = gridTable.getGridParam('colModel'),
                startsAt = 0,
                column;
            for (var i=0; i<colArray.length; i++){
                column = colArray[i];

                if (column.name == columnName) {
                    break;
                }else if (isSwitchColWithRowSelection && column.name == 'cb'){
                    //When there is a switched column, the checkbox is hidden by default, so don't need to include the checkbox width
                    continue;
                }

                startsAt += column.width
            }
            return startsAt;
        };

        /**
         * Checks if a property is available in one of the columns of the grid column configuration
         * @param {String} property - name of a property
         * @param {String} childProperty - name of a property which parent is defined in the first argument of the method
         * @param {String} confPropertyPath - path to the configuration that holds the property to be found
         */
        this.hasColumnProperty = function (property, childProperty, confPropertyPath) {
            var columns = confPropertyPath || conf.elements.columns;
            for (var i = 0; i < columns.length; i++) {
                if (columns[i][property]) {
                    if (childProperty) {
                        if (columns[i][property] && columns[i][property][childProperty]) {
                            return true;
                        }
                    } else {
                        return true;
                    }
                }
            }
            return false;
        };

        /**
         * Filter the column configuration to provide only the columns that match a column property
         * @param {String} property - name of a column property. It can be represented as multiple properties joined by dot. For example: prop1.pro2.prop3
         * @returns {Array} columns that have a property and optionally, a child property. If not match, the property returns undefined.
         */
        this.getColumnsWithProperty = function (properties) {
            properties = properties.split(".");
            var columns = $.extend(true, [], conf.elements.columns),
                columnsWithProperty = [],
                findColumnWithProperty = function (column) {
                    var originalColumn = column;
                    for (var i = 0; i < properties.length; i++) {
                        if (column[properties[i]]) {
                            column = column[properties[i]];
                        } else {
                            return;
                        }
                    }
                    return originalColumn;
                },
                addColumn = function (column) {
                    column.sequenceId = i;
                    columnsWithProperty.push(column);
                },
                foundColumn;
            for (var i = 0; i < columns.length; i++) {
                foundColumn = findColumnWithProperty(columns[i]);
                foundColumn && addColumn(foundColumn);
            }
            if (!_.isEmpty(columnsWithProperty)) {
                return columnsWithProperty;
            }
        };

        /**
         * By giving the aria-describedby cellAttr and the current row, this method will return the cell is matched with the cellAttr
         * @param {Object} $row
         * @param {String} cellAttr: aria-describedby attribute
         * @returns {Object} the cell DOM
         */
        this.getCellDom = function($row, cellAttr){
            var columns = $row.find('td');

            for (var i = 0; i < columns.length; i++){
                var $column = $(columns[i]);
                if ($column.attr("aria-describedby") == cellAttr){
                    return $column;
                }
            }
        };

        /**
         * Generate rowData and rawData for each selected rows
         * @param {Object} selected_rows
         * @param {Object} $gridTable 
         * @return {Array} draggable rows that contain rowData and rawData
         */
        this.getSelectedRowData = function(selected_rows, $gridTable){
            var selectedRows = [];
            selected_rows.forEach(function(row) {
                var $row = $gridTable.find("#" + row[conf.elements.jsonId]);
                selectedRows.push({
                    rowData: row,
                    rawData: ($row && $row.data('jqgrid.record_data')) || {}
                });
            });
            return selectedRows;
        };

        /**
         * Get prev/next visible row
         * @param {Object} $row
         * @param {Boolean} isNext - find the next row or prev row
         * @returns {Object} the prev/next visible row
         */
        this.getVisibleRow = function ($row, isNext) {
            var $updatedRow = isNext ? $row.next() : $row.prev();
            if ($updatedRow.length && !$updatedRow.is(":visible")){
                $updatedRow = this.getVisibleRow($updatedRow, isNext);
            }
            return $updatedRow;
        };

        /**
         * Check if the current row is leaf or parent
         * @param {Object} rowData
         * @returns {Boolean} if row a leaf or not
         */
        this.isTreeLeaf = function (rowData) {
            var leaf = conf.elements.tree.leaf || "leaf",
                isLeaf = rowData[leaf] || false ;

            if (_.isString(isLeaf)){
                isLeaf = !(rowData[leaf] == "false");
            }
            
            return isLeaf;
        }; 

        /**
         * Check if all values in an Array is empty or not
         * @param {Array} value
         * @returns {Boolean} if all values are empty or not
         */
        this.hasOnlyEmptyValueArray = function (value){
            if (_.isArray(value)){
                var emptyValueCount = 0;

                for (var i = 0; i<value.length; i++){
                    this.isEmptyValue(value[i]) && emptyValueCount++;
                }
                if (emptyValueCount == value.length){
                    return true;
                }
            }
            return false;
        };

        /**
         * Check if the value is empty
         * @param {Object} value
         * @returns {Boolean} if the value is empty
         */
        this.isEmptyValue = function (value){
            //_.isEmpty() will return true when value is a number or a boolean
            return _.isEmpty(value) && !_.isNumber(value) && !_.isBoolean(value);
        };

        /**
         * Gets a target element by adjusting it if it is coming from a use element with a svg parent
         * @param {Object} $ele - jQuery Object with the target element
         * @returns {Object} updated jQuery Object target element
         */
        this.getTargetElement = function ($ele) {
            var $element = $ele.is("use") ? $ele.closest("svg") : $ele;
            return $element;
        };

        /**
         * Gets gets the class list of an element or its parent if it is the <use> child of a svg element
         * @param {Object} $ele - jQuery Object with the target element
         * @returns {Array} element classes
         */
        this.getTargetElementClassList = function ($ele) {
            var $element = this.getTargetElement($ele),
                classList = $element.attr("class");
            if (classList) {
                classList = classList.split(" ");
            }
            return classList;
        };

        /**
         * Get all values from the collapsed cell content
         * @param {Object} $ele - jQuery Object with the target element
         * @returns {Array} cell values
         */
        this.getCellValue = function ($ele) {
            return $ele.find('.originalCellValue').html().split('\n').slice(0,-1);
        };

        /**
         * get current table id when the element is not in the gridTable
         * @param {jQuery Object} $element
         * return tableId
         */
        this.getTableId = function($element){
            return $element.parents(".grid-widget").find(".gridTable").attr("id");
        };
    };

    return GridConfigurationHelper;
});