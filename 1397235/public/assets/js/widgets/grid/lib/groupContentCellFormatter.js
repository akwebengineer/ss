/**
 * A module that provides the cell formatter and unformat callbacks required to render a cell using the groupContent style
 *
 * @module GroupContentCellFormatter
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define(['lib/template_renderer/template_renderer'
    ], /* @lends GroupContentCellFormatter */
    function (render_template) {

        /**
         * GroupContentCellFormatter constructor
         *
         * @constructor
         * @class GroupContentCellFormatter - Formats the cells that are of the groupContent type
         *
         * @param {Object} gridConfigurationHelper - GridConfigurationHelper instance
         * @param {Class} baseContentCellFormatter
         * @param {Object} templates - grid templates
         * @param {Object} rowMaxElementConf - grid configuration for the number of items and columns allowed per cell
         * @param {Object} defaults - default value of the cell height and cell width in pixels
         * @returns {Object} Current GroupContentCellFormatter's object: this
         */
        var GroupContentCellFormatter = function (gridConfigurationHelper, baseContentCellFormatter, templates, rowMaxElementConf, defaults) {
            var groupDistribution = {},
                columnOptions = {}, //sets default row width per column
                defaultSize,
                CELL_MARGIN = 16;//all cells left+right margin

            /**
             * Initializes the GroupContentCellFormatter class
             * @param {Object} containers - containers available in the grid
             */
            this.init = function (containers) {
                groupDistribution.collapse = getGroupItemsDistributions(rowMaxElementConf.groupContentCollapseItems, rowMaxElementConf.groupContentColumns);
                groupDistribution.expand = getGroupItemsDistributions(rowMaxElementConf.groupContentItems, rowMaxElementConf.groupContentColumns);
                bindGridEvents(containers);
            };

            /**
             * Adds handlers to grid events
             * @param {Object} containers - containers available in the grid
             */
            var bindGridEvents = function (containers) {
                containers.$gridWidget.bind("slipstreamGrid.resized:gridTable", function (e, options) {
                    setVisibleCards(containers.$gridTable);
                });
                containers.$gridTable.bind("slipstreamGrid.resized:gridColumn", function (e, options) {
                    setVisibleCards(containers.$gridTable);
                });
            };

            /**
             * Sets the cards that will be visible in collapse state as per the available width in the column
             * @param {Object} $gridTable - jQuery Object with the gridTable
             */
            var setVisibleCards = function ($gridTable) {
                if (_.isUndefined(defaultSize)) { //deferred until grid content is available indicated by grid events
                    var $groupContent = $gridTable.find(".groupContent");
                    if ($groupContent.length) {
                        defaultSize = {
                            cardWidth: $groupContent.eq(0).outerWidth(true),
                            moreWidth: $gridTable.find(".moreGroups").eq(0).outerWidth(true)
                        };
                    }
                }

                //sets the cards that will be visible or hidden for a specific cell
                var setCellVisibleCards = function ($cell) {
                    var $groupContentWrapper = $cell.find(".groupContentWrapper"),
                        $cards = $cell.find(".groupContent"),
                        $more = $cell.find(".moreGroups"),
                        maxVisibleCards = Math.floor((columnWidth - defaultSize.moreWidth)/ defaultSize.cardWidth),
                        requiredCards = $groupContentWrapper.data("group-total");

                    if (requiredCards) {//a card was defined
                        if (maxVisibleCards >= requiredCards) {
                            $cards.show();
                            $more.hide();
                        } else {
                            var restOfCards = requiredCards - maxVisibleCards;//more will partially take the room of 1 card
                            $cards.hide();
                            for (var i = 0; i < maxVisibleCards; i++) {
                                $cards.eq(i).show();
                            }
                            $more.html("+" + restOfCards);
                            $more.show();
                        }
                    }
                };
                for (var columnName in columnOptions) {
                    var columnOption = columnOptions[columnName],
                        isColumnHidden = columnOption.colModel.hidden,
                        isShowOperator = columnOption.colModel.groupContent.showOperator,
                        columnWidth = columnOption.colModel.width - CELL_MARGIN;
                    if (!isColumnHidden && !isShowOperator) {//adjust column cards if it's not hidden
                        var columnCells = gridConfigurationHelper.getCell($gridTable, $gridTable.attr("id"), columnName);
                        columnCells.each(function () {
                            setCellVisibleCards($(this), columnWidth);
                        });
                    }
                }
            };

            /**
             * Calculates the number of items allowed per column for a group content formatter
             * @param {number} viewNumberOfItemsPerColumn - maximum number of items allowed per column
             * @param {number} viewNumberOfColumns - maximum number of columns to fit items before 1 item at a time is allowed
             * @inner
             */
            var getGroupItemsDistributions = function (viewNumberOfItemsPerColumn, viewNumberOfColumns) {
                var maxItems = viewNumberOfItemsPerColumn,//represents the number of items per column
                    maxColumns = viewNumberOfColumns, //represents the number of columns
                    columnItem = [],
                    column = viewNumberOfColumns - 1,
                    item = 0;
                for (var n = 1; n <= maxItems * maxColumns; n++) { //n represent the item number available for the total: maxItems * maxColumns
                    if (n <= maxColumns) { //less or equal than the number of groups
                        columnItem[n - 1] = {
                            column: n,
                            item: 0
                        }
                    } else if (n == maxItems * maxColumns) { //the maximum number of items
                        columnItem[n - 1] = {
                            column: 0,
                            item: maxItems * maxColumns
                        }
                    } else { //less than the number of groups but less than the maximum number of items
                        if (item == viewNumberOfItemsPerColumn * (viewNumberOfColumns - column)) {
                            //if there is no more spots to put on a column, replace it for only items
                            if (column > 0) {
                                column--;
                            }
                            item = 0;
                        }
                        while (n > column + item) { //calculate the items required to fill up the number of items
                            item++;
                        }
                        columnItem[n - 1] = {
                            column: column,
                            item: item
                        };
                    }
                }
                return columnItem;
            };

            /*
             * Custom formatter to update the content of a cell that has multiple items with a key(group) and value pair and that it only shows two items per row;
             * the rest of the items are available by the more tooltip
             * @param {Object} cellValue - value of the cell
             * @param {Object} options - configuration of the column of the cell and tableId, rowId
             * @param {Object} rowObject - original value of the cell
             * @returns {string} html for group content cell
             */
            this.formatGroupContent = function (cellValue, options, rowObject) {
                if (_.isUndefined(columnOptions[options.colModel.name])) { //hash column once, one value per column
                    columnOptions[options.colModel.name] = _.extend({}, options);
                    delete columnOptions[options.colModel.name].rowId; //removes data specific to a cell
                }
                return formatGroupContent(cellValue, options, rowObject, false);
            };

            /*
             * Formats the content of a cell that has multiple items with a key(group) and value pair and that it only shows two items per row;
             * the rest of the items are available by the more tooltip.
             * It includes invoking callback to formatData and to reformat the html content
             * @param {Object} cellValue - value of the cell
             * @param {Object} options - configuration of the column of the cell and tableId, rowId
             * @param {Object} rowObject - original value of the cell
             * @param {boolean} isExpand - false for the collapse cell state and true for the expand cell option
             * @returns {string} html for group content cell
             * @inner
             */
            var formatGroupContent = function (cellValue, options, rowObject, isExpand) {
                var groupContent = options.colModel.groupContent;

                //updates data by grid configuration callback
                if (_.isFunction(groupContent.formatData) && !isExpand) { //data formatted is saved per collapsed cell so reformatting of data is not required for the expanded cell
                    cellValue = groupContent.formatData(cellValue, options, rowObject);
                }

                var cellGroup = formatCellGroup(groupContent, cellValue, options, rowObject, isExpand);

                //updates cell by grid configuration callback
                if (_.isFunction(groupContent.formatCell)) {
                    cellGroup = reformatCellGroup(groupContent, cellValue, options, rowObject, cellGroup);
                }
                return cellGroup;

            };

            /*
             * Formats the content of a cell that has multiple items with a key(group) and value pair and that it only shows two items per row;
             * the rest of the items are available by the more tooltip.
             * @param {Object} groupContent - configuration of the column of the cell
             * @param {Object} cellValue - value of the cell
             * @param {Object} options - configuration of the column of the cell and tableId, rowId
             * @param {Object} rowObject - original value of the cell
             * @param {boolean} isExpand - false for the collapse cell state and true for the expand cell option
             * @returns {string} html for group content cell
             * @inner
             */
            var formatCellGroup = function (groupContent, cellValue, options, rowObject, isExpand) {
                var viewNumberOfItemsPerColumn = isExpand ? rowMaxElementConf.groupContentItems : rowMaxElementConf.groupContentCollapseItems,
                    maxNumberOfItemsPerCollapseCell = rowMaxElementConf.groupContentCollapseItems * rowMaxElementConf.groupContentColumns,
                    showOperator = _.isBoolean(groupContent.showOperator) ? groupContent.showOperator : false,
                    cellGroup = '',
                    groupId = 0,
                    moreGroups = 0;

                if (!_.isEmpty(cellValue) && _.isArray(cellValue)) {
                    var hasMaxColumns = !showOperator && cellValue.length <= groupDistribution.expand.length ? true : false,
                        formattedCells = [],
                        groupOperator = {},
                        defaultOperator = "AND",
                        cellGroupObject = [],
                        groupValue;

                    cellValue = cellValue.filter(function (value) {
                        return value != ''
                    });

                    var setGroupOperator = function (operator) {
                        groupOperator.operator = operator;
                        formattedCells.push(groupOperator);
                        groupOperator = {};
                    };

                    cellValue.forEach(function (value) {
                        if (_.isArray(value)) {
                            if (!_.isEmpty(groupOperator)) {
                                setGroupOperator(defaultOperator);
                            }
                            groupOperator.groupValue = value;
                        } else if (_.isString(value)) {
                            setGroupOperator(value);
                        }
                    });
                    formattedCells.push(groupOperator);

                    var groupItemsDistributionsPattern = isExpand ? groupDistribution.expand : groupDistribution.collapse,
                        groupItemsDistributions = _.extend({}, groupItemsDistributionsPattern[formattedCells.length - 1]),
                        getAllowedNumberOfItems = function () {
                            //if the group can be rendered as a column, then the number of items is the default groupContentItems otherwise, it's just 1 item
                            if (groupItemsDistributions.column) {
                                groupItemsDistributions.column--;
                                return viewNumberOfItemsPerColumn;
                            }
                            return 1;
                        };

                    //sets the item object (groupValue) to include value value and/or key. value is needed to show the item content and key is needed to enable the moreTooltip callback
                    var setValueKey = function (groupValue) {
                        if (groupContent.value && !_.isUndefined(groupValue[groupContent.value])) {
                            groupValue.value =  groupValue[groupContent.value];
                        }
                        if (groupContent.key && !_.isUndefined(groupValue[groupContent.key])) {
                            groupValue.key =  groupValue[groupContent.key];
                        }
                    };

                    for (var j = 0; j < formattedCells.length; j++) {
                        var formattedCell = formattedCells[j],
                            groupFormattedCells = [],
                            groupFormattedItems = [],
                            viewAllowedNumberOfItems = showOperator ? viewNumberOfItemsPerColumn : getAllowedNumberOfItems(),
                            hasGroups = formattedCell.groupValue.length > viewAllowedNumberOfItems,
                            originalCells = '',
                            restOfElements = 0,
                            cellGroupObjectValue;

                        //sets cell content
                        for (var i = 0; i < formattedCell.groupValue.length; i++) {
                            groupValue = formattedCell.groupValue[i];
                            setValueKey(groupValue);

                            //if condition is only for items that are below the allowed number of items to be rendered,
                            //no else condition since the rest of items will be showed in the more tooltip
                            if (i < viewAllowedNumberOfItems) {
                                groupFormattedItems.push(groupValue);
                                if ((i + 1) % viewNumberOfItemsPerColumn == 0) {
                                    groupFormattedCells.push({
                                        "groupColumnContent": groupFormattedItems
                                    });
                                    groupFormattedItems = [];
                                }
                            }

                            //sets the original value of the cell to be used in the unformatGroupContent (unformat callback of the library)
                            originalCells += groupValue.group + "-&&&-" + groupValue.value
                            if (groupValue.key) {
                                originalCells += "-&&&-" + groupValue.key
                            }
                            originalCells += "\n";
                        }

                        if (originalCells) {
                            originalCells = originalCells.slice(0, -1);
                        }

                        //if there are items left that were not appended in the last if condition ((i+1)%viewNumberOfItemsPerColumn == 0) because it was not true
                        if (!_.isEmpty(groupFormattedItems)) {
                            groupFormattedCells.push({
                                groupColumnContent: groupFormattedItems
                            });
                        }

                        if (hasGroups) {
                            restOfElements = {
                                more: "+",
                                number: formattedCell.groupValue.length - viewAllowedNumberOfItems,
                                rowId: options.rowId,
                                columnName: options.colModel.name,
                                groupId: groupId
                            };
                        }
                        groupId++;

                        //sets operator original value
                        if (!_.isUndefined(formattedCell.operator)) {
                            originalCells += "-&&&startOperator&&&-" + formattedCell.operator + "-&&&endOperator&&&-";
                        }

                        if (isExpand) {
                            cellGroupObjectValue = {
                                groupContent: groupFormattedCells,
                                operator: showOperator ? formattedCell.operator : false,
                                isColumn: showOperator || viewAllowedNumberOfItems == viewNumberOfItemsPerColumn,
                                moreNumber: restOfElements
                            };
                        } else {
                            if (groupId <= maxNumberOfItemsPerCollapseCell) {
                                cellGroupObjectValue = {
                                    groupContent: groupFormattedCells,
                                    operator: showOperator ? formattedCell.operator : false,
                                    isColumn: showOperator || viewAllowedNumberOfItems == viewNumberOfItemsPerColumn,
                                    moreNumber: restOfElements,
                                    cellValue: originalCells
                                };
                                moreGroups = formattedCells.length - groupId;
                                moreGroups = showOperator ? moreGroups : "+" + moreGroups;
                            } else {
                                cellGroupObjectValue = {
                                    isContentValue: true,
                                    cellValue: originalCells
                                };
                            }
                        }
                        cellGroupObject.push(cellGroupObjectValue);

                    }

                    if (isExpand) {
                        cellGroup = render_template(templates.partialGroupCell, {
                            "cellGroupObject": cellGroupObject,
                            "hasMaxColumns": hasMaxColumns
                        });
                    } else {
                        cellGroup = render_template(templates.groupCell, {
                            "cellGroupObject": cellGroupObject,
                            "totalGroups": formattedCells.length,
                            "moreGroups": moreGroups
                        }, {
                            "partialGroupCell": templates.partialGroupCell
                        });
                    }
                }else{
                    var defaultEmptyColumnTemplates = baseContentCellFormatter.getEmptyColumnTemplates();
                    //Add emptyCell when cellValue is empty
                    cellGroup = defaultEmptyColumnTemplates[options.colModel.name];
                }

                return cellGroup;
            };

            /*
             * Reformats the content of a cell to produce a simple html string
             * @param {Object} groupContent - configuration of the column of the cell
             * @param {Object} cellValue - value of the cell
             * @param {Object} options - configuration of the column of the cell and tableId and rowId
             * @param {Object} rowObject - original value of the cell
             * @param {boolean} isExpand - false for the collapse cell state and true for the expand cell option
             * @param {string} cellGroup - html for group content cell
             * @param {string} html for group content cell
             * @inner
             */
            var reformatCellGroup = function (groupContent, cellValue, options, rowObject, cellGroup) {
                var $cellGroup = groupContent.formatCell($(cellGroup), cellValue, options, rowObject);
                if (_.isElement($cellGroup[0])) {
                    var cellGroupString = '';
                    $cellGroup.each(function (index, item) {
                        cellGroupString += item.outerHTML;
                    });
                    cellGroup = cellGroupString;
                } else {
                    cellGroup = $cellGroup;
                }
                return cellGroup;
            };

            /*
             * Custom function to restore the value of the cell before it was formatted by collapseContent function
             * @param {Object} cellValue - value of the cell
             * @param {Object} options - configuration of the column of the cell and tableId and rowId
             * @param {Object} rowObject - original value of the cell
             * @returns {Object} value of the cell
             */
            this.unformatGroupContent = function (cellValue, options, rowObject) {
                var $cell = $(rowObject),
                    groups;
                if (baseContentCellFormatter.isEmptyCell($cell)){
                    groups = "";
                }else{
                    var groupContent = options.colModel.groupContent;
                    var startOperator = "-&&&startOperator&&&-",
                        endOperator = "-&&&endOperator&&&-",
                        originalGroupOperators = $cell.find('.originalCellValue').text().split(endOperator);

                    groups = [];
                    originalGroupOperators.forEach(function (originalGroupOperator) {
                        var groupOperators = originalGroupOperator.split(startOperator)[0].split("\n"),
                            items = [];
                        groupOperators.forEach(function (groupValue) {
                            var item = groupValue.split('-&&&-'),
                            itemValue = {
                                "group": item[0],
                                "value": item[1]
                            };
                            if (item[2]) { //includes key attribute to restore original data used by data-tooltip
                                itemValue.key = item[2]
                            }
                            items.push(itemValue);
                        });
                        groups.push(items);
                    });

                    if (typeof groupContent.unformatCell == "function") {
                        groups = groupContent.unformatCell(groups, cellValue, options, rowObject);
                    }
                } 

                return groups;
            };

            /*
             * Toggles the content of a cell by adding the expand cell content. The cell is only added once.
             * @param {Object} row - row that is toggled
             * @param {Object} $gridTable - jQuery object with the grid table for the row
             * @param {Object} tooltipBuilder - Tooltip builder instance to be applied on the row more icon
             * @param {String} lessIconTemplate
             */
            this.toggleGroupContentCell = function (row, $gridTable, tooltipBuilder, lessIconTemplate) {
                var $row = $(row),
                    allGroupContentCollapse = $row.find(".groupContentExpand:empty");

                if (allGroupContentCollapse.length) {
                    var tableId = $gridTable.attr("id"),
                        rowId = row.id,
                        rowData = $gridTable.jqGrid("getRowData", rowId),
                        $moreCell = $row.find('.slipstreamgrid_more'),
                        $groupContentCollapse, $cell, columnName, rowObject, expandCellContent, options;
                    
                    //Only add lessIcon at the first time
                    (!_.isElement($moreCell.find('.cellExpandWrapper')[0])) && $moreCell.append(lessIconTemplate);

                    allGroupContentCollapse.each(function (index, groupContentCollapse) {
                        $groupContentCollapse = $(groupContentCollapse);
                        $cell = $groupContentCollapse.closest("td");
                        columnName = gridConfigurationHelper.getColumnName($cell, tableId);
                        rowObject = $row.data('jqgrid.record_data');

                        if (columnOptions[columnName]) {
                            options = columnOptions[columnName];
                            options.rowId = rowId;
                        }

                        expandCellContent = formatGroupContent(rowData[columnName], options, rowObject, true);
                        $groupContentCollapse.append(expandCellContent);
                        $groupContentCollapse.find('.groupContentWidth').css({
                            "max-width": defaults.simplifiedGridRowWidth * rowMaxElementConf.groupContentColumns
                        });
                        $cell.find('.groupContentExpand .groupContentHeight').css({
                            "height": defaults.simplifiedGridRowHeight * rowMaxElementConf.groupContentItems
                        });
                        tooltipBuilder && tooltipBuilder.addRowTooltips($gridTable, rowObject, rowId);
                    });
                }
            };

            /*
             * Checks if a row will need to be expanded because it has more data than the collapse option allows
             * @param {Object} $row - jQuery object of the row
             * @returns {Boolean} true if the cell has more content than the collapse shows or false if all the cell content is available in the cell
             */
            this.hasCollapseCell = function ($row) {
                if ($row.find(".moreGroups").length) {
                    return true;
                }
                return false;
            };

        };

        return GroupContentCellFormatter;
    });