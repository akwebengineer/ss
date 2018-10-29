/**
 * A module that provides the cell formatter and unformat callbacks required to render a collapsed cell
 *
 * @module CollapseContentCellFormatter
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
    'lib/template_renderer/template_renderer'
], function (render_template) {

    /**
     * CollapseContentCellFormatter constructor
     *
     * @constructor
     * @class CollapseContentCellFormatter - Formats the cell content
     *
     * @param {Object} conf
     * @param {Object} gridConfigurationHelper - GridConfigurationHelper instance
     * @param {Class} baseContentCellFormatter
     * @param {Object} templates - grid templates
     * @param {Object} rowMaxElementConf - grid configuration for the number of items and columns allowed per cell
     * @param {Object} lookupLabelContentTable - the object from the gridFormatter class
     * @returns {Object} Current CollapseContentCellFormatter's object: this
     */
    var CollapseContentCellFormatter = function (conf, gridConfigurationHelper, baseContentCellFormatter, templates, rowMaxElementConf, lookupLabelContentTable) {
        var self = this,
            isCellsDnD = (conf.dragNDrop && (conf.dragNDrop.moveCell || conf.connectWith)) ? true : false,
            isEditInline = conf.editRow && conf.editRow.showInline? true: false,
            moreTemplate,
            collapseContentColumns,
            columnsHash;

        /**
         * Initialize CollapseContentCellFormatter
         */
        this.init = function(){
            collapseContentColumns = gridConfigurationHelper.getColumnsWithProperty('collapseContent');
            columnsHash = gridConfigurationHelper.buildColumnConfigurationHashByName(conf.columns, 'collapseContent');
        };

        /**
         * Toggle collapse content to expand the row
         * @param {Object} $gridTable
         * @param {Object} current row
         * @param {String} cellTemplate
         * @param {String} lessIconTemplate
         */
        this.toggleCollapseContent = function($gridTable, row, cellTemplate, lessIconTemplate){
            var $row = $(row);

            var rowId = $row.attr('id'),
                $moreCell = $row.find('.slipstreamgrid_more'),
                tableId = $moreCell.closest('table').attr('id');

            //Only add lessIcon at the first time
            (!_.isElement($moreCell.find('.cellExpandWrapper')[0])) && $moreCell.append(lessIconTemplate);

            for (var i = 0; i < collapseContentColumns.length; i++){
                var columnName = collapseContentColumns[i].name, 
                    cellAttr = tableId + '_' + columnName,
                    $cell =  gridConfigurationHelper.getCellDom($row, cellAttr),
                    $expandSpan = $cell.find('.cellExpandWrapper');

                //Only add expanded content when it is not there
                if (!_.isElement($expandSpan[0])){
                    var rowObject = $row.data('jqgrid.record_data'), 
                        options = {
                            colModel: columnsHash[columnName],
                            rowId: rowId,
                            gid: tableId
                        };
                    if (columnsHash[columnName]['collapseContent']['keyValueCell']){
                        expandContent(cellTemplate, $cell, columnName, options, rowObject, false);
                    } else {
                        expandContent(cellTemplate, $cell, columnName, options, rowObject, true);
                    }
                }
            }

            //trigger dragNDrop bindDnDItemsEvent
            $gridTable.trigger("slipstreamGrid.cellItems:appended", $row);
            
        };


        /**
         * Expand the cell content
         * Add moreCell content into the DOM. Also, make sure the DOM element is updated when editRow in the expanded mode.
         * @param {String} cellTemplate
         * @param {Object} $cell 
         * @param {String} columnName 
         * @param {Object} options
         * @param {Object} rowObject: the API data
         * @param {Boolean} isArray: if the data is an arrary
         */
        var expandContent = function (cellTemplate, $cell, columnName, options, rowObject, isArray){
            var template,
                $originalContent = $cell.find('.originalCellValue'),
                originalContent;

            if (_.isElement($originalContent[0])){
                originalContent = $cell.find('.originalCellValue').text().split('\n');
            }
            if (originalContent){
                var cellObject = rowObject[options.colModel.name] || gridConfigurationHelper.getNestedData(rowObject, options.colModel.name);
                if (isArray){
                    template = generateCellArrayTemplate(cellObject, options, rowObject, true);
                }else{
                    template = generateCellObjectTemplate(cellObject, options, rowObject, true);
                }
            }
            

            template && $cell.append(template);
        };

        /*
         * Custom function to update the content of a cell, so that its content can be collapsed on one line
         * and showing instead the number of entries not seen plus the word "more..."
         * @param {Object} cellvalue: data is from jqGrid formatter callback
         * @param {Object} options: data is from jqGrid formatter callback
         * @param {Object} rowObject: data is from jqGrid formatter callback
         */
        this.formatArrayContent = function (cellvalue, options, rowObject) {
            return generateCellArrayTemplate(cellvalue, options, rowObject, false)
        };
        /**
         * Generate cell template from array
         * @param {Object} cellvalue: data is from jqGrid formatter callback
         * @param {Object} options: data is from jqGrid formatter callback
         * @param {Object} rowObject: data is from jqGrid formatter callback
         * @param {Boolean} expandedRow: if the row should be expanded or not. Only when "slipstreamGrid.row:expanded" event is triggered, the value is true.
         */
        var generateCellArrayTemplate = function(cellvalue, options, rowObject, expandedRow){
            var collapseContent = options.colModel.collapseContent,
                collapseNumberOfItems = rowMaxElementConf.collapse,
                expandNumberOfItems = rowMaxElementConf.expand,
                cellLess = '',
                cellValueObject = {};

            if (_.isFunction(collapseContent.formatData)) {
                cellvalue = collapseContent.formatData(cellvalue, options, rowObject);
            }

            //reformat cellvalue from strings to key/value pair if required
            var formatCellItem = function (cell) {
                if (_.isString(cell)) {
                    cell = { "label": cell };
                }else if (_.isObject(cell)){
                    cell[collapseContent.name] && _.extend(cell, { "label": cell[collapseContent.name] });
                    cell[collapseContent.key] && _.extend(cell, { "key": cell[collapseContent.key] });
                }
                return cell;
            };

            if (collapseContent.name && cellvalue instanceof Object) {
                if (cellvalue instanceof Array) {
                    if (cellvalue.length == 1) cellvalue = cellvalue[0][collapseContent.name] || cellvalue;
                } else {
                    cellvalue = [ cellvalue[collapseContent.name] || cellvalue ];
                }
            }

            if (_.isString(cellvalue) && !_.isEmpty(cellvalue)) {
                if (collapseContent.singleValue) {
                    cellvalue = cellvalue.trim().split("\n");
                } else {
                    cellvalue = [ formatCellItem(cellvalue) ];
                }
            }

            if (_.isArray(cellvalue) && !gridConfigurationHelper.hasOnlyEmptyValueArray(cellvalue)) {
                var formattedCells = [],
                    lessFormattedCells = [],
                    originalCells = '',
                    restOfElementsLess, restOfElementsMore;

                cellvalue = cellvalue.filter(function (value) {
                    return value != ''
                });
                for (var i = 0; i < cellvalue.length; i++) {
                    var cell = cellvalue[i];
                    var formattedCell = formatCellItem(cell);
                    formattedCell.identifier = i+1; //identifiers are starting with 1 to avoid a falsy when data is binded to the template
                    cellValueObject[i] = cell;
                    formattedCells.push(formattedCell);
                    (!expandedRow && i < collapseNumberOfItems) && lessFormattedCells.push(formattedCell);
                    originalCells += formattedCell.label + "\n";
                }
                originalCells.slice(0, -2);

                if(expandedRow){
                    var isMultiselect = false,
                        isDraggable = false;

                    //enables multiselect on the items of a cell (when a row is expanded)
                    if (collapseContent.multiselect) {
                        isMultiselect = true;
                    }
                    //enables multiselect and draggable on the items of a cell (when a row is expanded)
                    if (isCellsDnD || (options.colModel.dragNDrop && options.colModel.dragNDrop.isDraggable)) {
                        isMultiselect = true;
                        isDraggable = true;
                    }

                    cellLess = render_template(templates.moreCell,{
                        moreContent: formattedCells,
                        isDraggable: isDraggable,
                        isMultiselect: isMultiselect,
                        collapseContent: false
                    }, {
                        partialMoreCell: templates.partialMoreCell
                    });
                }else{
                    if (formattedCells.length > collapseNumberOfItems) {
                        restOfElementsLess = {
                            more: "+",
                            number: formattedCells.length - collapseNumberOfItems,
                            rowId: options.rowId,
                            columnName: options.colModel.name
                        };
                    }

                    cellLess = render_template(templates.moreCell, {
                        lessContent: lessFormattedCells,
                        moreNumber: restOfElementsLess,
                        singleValue: collapseContent.singleValue,
                        cellValue: originalCells,
                        collapseContent: true
                    }, {
                        partialMoreCell: templates.partialMoreCell
                    });
                }
            }else{
                cellLess = baseContentCellFormatter.generateEmptyTemplate(cellvalue, options, rowObject);
            }
            
            if (_.isFunction(collapseContent.formatCellItem)){
                cellLess = triggerCellItemCallback(cellLess, cellvalue, options, rowObject, collapseContent.formatCellItem, cellValueObject);
            }
            if (_.isFunction(collapseContent.formatCell)) {
                var $cellLess = collapseContent.formatCell($(cellLess), cellvalue, options, rowObject);
                if (_.isObject($cellLess)) {
                    var cellLessString = '';
                    $cellLess.each(function (index, item) {
                        cellLessString += item.outerHTML;
                    });
                    cellLess = cellLessString;
                } else {
                    cellLess = $cellLess;
                }
            }
            return cellLess;
        };

        /*
         * Custom function to restore the value of the cell before it was formatted by collapseContent function
         * @param {Object} cellvalue: data is from jqGrid formatter callback
         * @param {Object} options: data is from jqGrid formatter callback
         * @param {Object} rowObject: data is from jqGrid formatter callback
         */
        this.unformatArrayContent = function (cellvalue, options, rowObject) {
            var $cell = $(rowObject),
                originalContent;
            if (baseContentCellFormatter.isEmptyCell($cell)){
                originalContent = "";
            }else{
                var collapseContent = options.colModel.collapseContent;
                originalContent = $cell.find('.originalCellValue').text().split('\n');
                if (originalContent.length == 1) originalContent.push("");
                if (_.isFunction(collapseContent.unformatCell)) {
                    originalContent = collapseContent.unformatCell(originalContent, cellvalue, options, rowObject);
                }
            }
            return originalContent;
        };
        
        /*
         * Custom function to update the content of a cell, so that its content can be collapsed on one line
         * and split by "|". The cellvalue is expected to be an object.
         * @param {Object} cellvalue: data is from jqGrid formatter callback
         * @param {Object} options: data is from jqGrid formatter callback
         * @param {Object} rowObject: data is from jqGrid formatter callback
         */
        this.formatObjectContent = function (cellvalue, options, rowObject) {
            return generateCellObjectTemplate(cellvalue, options, rowObject, false);
        };

        /**
         * Generate cell template from object
         * @param {Object} cellvalue: data is from jqGrid formatter callback
         * @param {Object} options: data is from jqGrid formatter callback
         * @param {Object} rowObject: data is from jqGrid formatter callback
         * @param {Boolean} expandedRow: if the row should be expanded or not. Only when "slipstreamGrid.row:expanded" event is triggered, the value is true.
         */
        var generateCellObjectTemplate = function(cellvalue, options, rowObject, expandedRow){
            var cellSplit = '',
                cellValueObject = {},
                collapseContent = options.colModel.collapseContent;

            if (_.isFunction(collapseContent.formatData)) {
                cellvalue = collapseContent.formatData(cellvalue, options, rowObject);
            }

            if (cellvalue instanceof Object) {
                var cellValueLess = '',
                    cellValueAll = [],
                    cellOriginalValue = '',
                    keyLabelTable = lookupLabelContentTable[options.colModel.name],
                    count = 0;

                for (var key in cellvalue) {
                    var label = keyLabelTable && keyLabelTable[key] ? keyLabelTable[key] : key;
                    var value = cellvalue[key];

                    cellValueObject[count] = {};
                    cellValueObject[count][key] = value;

                    cellValueLess += label + " | ";
                    cellValueAll.push({
                        "label": label,
                        "objectKey": value.key,
                        "value": value.label || value
                    });
                    cellOriginalValue += key + "-&&&-" + cellvalue[key] + "\n";
                    count++;
                }

                if(expandedRow){
                    var isDraggable = false;
                    if (options.colModel.dragNDrop && options.colModel.dragNDrop.isDraggable){
                        isDraggable = true;
                    }
                    cellSplit = render_template(templates.moreCell,{
                        moreContent:cellValueAll,
                        isDraggable: isDraggable,
                        collapseContent: false
                    }, {
                        partialMoreCell: templates.partialMoreCell
                    });
                }else{
                    cellSplit = render_template(templates.moreCell, {
                        lessContent: {
                            label: cellValueLess.trim().slice(0, -1),
                            objectContent: true
                        },
                        cellValue: cellOriginalValue,
                        collapseContent: true
                    }, {
                        partialMoreCell: templates.partialMoreCell
                    });
                }
            }else{
                cellSplit = baseContentCellFormatter.generateEmptyTemplate(cellvalue, options, rowObject);
            }
            if (_.isFunction(collapseContent.formatObjectCellItem)){
                cellSplit = triggerCellItemCallback(cellSplit, cellvalue, options, rowObject, collapseContent.formatObjectCellItem, cellValueObject);
            }
            if (_.isFunction(collapseContent.formatObjectCell)) {
                var $cellSplit = collapseContent.formatObjectCell($(cellSplit), cellvalue, options, rowObject);
                if (_.isObject($cellSplit)) {
                    var cellSplitString = '';
                    $cellSplit.each(function (index, item) {
                        cellSplitString += item.outerHTML;
                    });
                    cellSplit = cellSplitString;
                } else {
                    cellSplit = $cellSplit;
                }
            }
            return cellSplit;
        };

        /*
         * Trigger the callback of the collapseContent formatCellItem
         * @param {String} cell html
         * @param {Object} cellvalue: data is from jqGrid formatter callback
         * @param {Object} options: data is from jqGrid formatter callback
         * @param {Object} rowObject: data is from jqGrid formatter callback
         * @param {Function} callback: the callback of the collapseContent formatCellItem
         * @param {Object} cellValueObject: Object with a hash of cell item index with each cell item value
         */
        var triggerCellItemCallback = function(cell, cellvalue, options, rowObject, callback, cellValueObject){
            var $labels = $(cell).find('.slipstreamgrid_cell_item_label');
                
            if ($labels.length > 0){
                $.each($labels, function(index, item){
                    var $item = $(item),
                        $itemLess = callback($item, cellvalue, cellValueObject[index], options, rowObject);
                    if (_.isObject($itemLess)) {
                        $item[0].outerHTML = $itemLess[0].outerHTML;
                    }else{
                        $item.html($itemLess);
                    }
                });
                cell = $labels.prevObject[0].outerHTML;
            }
            return cell;
        };

        /*
         * Reformat the object content from the original content 
         * @param {Array} originalContent
         */
        var reformatObjectContent = function(originalContent){
            var contents = {};

            if (originalContent.length == 1) {
                contents.push("");
            } else {
                for (var i = 0; i < originalContent.length; i++) {
                    var content = originalContent[i];
                    var contentArray = content.split('-&&&-');
                    if (contentArray[0]) contents[contentArray[0]] = contentArray[1];
                }
            }
            return contents;
        };

        /*
         * Custom function to restore the value of the cell before it was formatted by collapseContent function
         * @param {Object} cellvalue: data is from jqGrid formatter callback
         * @param {Object} options: data is from jqGrid formatter callback
         * @param {Object} rowObject: data is from jqGrid formatter callback
         */
        this.unformatObjectContent = function (cellvalue, options, rowObject) {
            var contents,
                $cell = $(rowObject);
            if (baseContentCellFormatter.isEmptyCell($cell)){
                contents = "";
            }else{
                var collapseContent = options.colModel.collapseContent;
                var originalContent = $cell.find('.originalCellValue').text().split('\n');
                contents = reformatObjectContent(originalContent);
                if (_.isFunction(collapseContent.unformatObjectCell)) {
                    contents = collapseContent.unformatObjectCell(contents, cellvalue, options, rowObject);
                }
            }
            return contents;
        };
    };

    return CollapseContentCellFormatter;
});