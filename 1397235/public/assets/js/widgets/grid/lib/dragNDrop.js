/**
 * A module that add drag and drop feature to the simple grid cell or row.
 *
 * @module DragNDrop
 * @author Eva Wang <iwang@juniper.net>
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define([
    'widgets/grid/lib/confirmationDialogBuilder',
    'widgets/grid/lib/dragScroller',
    'widgets/grid/lib/rowDragNDrop',
    'lib/template_renderer/template_renderer',
    'lib/i18n/i18n'
], /** @lends DragNDrop */
    function (ConfirmationDialogBuilder, DragScroller, RowDragNDrop, render_template, i18n) {

    /**
     * DragNDrop constructor
     *
     * @constructor
     * @class DragNDrop - Add drag and drop feature to the grid
     *
     * @param {Object} conf - User configuration object
     * @returns {Object} Current DragNDrop's object: this
     */
    var DragNDrop = function (conf, gridReference, templates, hasUpdatePermission) {
        var $draggableGridTable,
            $draggableElement,
            $clonedDraggableElement,
            dragElementData = {
                rowData: {},
                rawData: {}
            },
            draggableRowId,
            draggableTableResetSelection,
            dragTableId,
            dropTableColumnHash,
            isBeforeDragValid = true,
            isHoverDropValid = true,
            isDraggingItems = false,
            selectedRows,
            rowDragNDrop,
            scrollingInitialized = false,
            dragNDropInitialized = false,
            gridParamsCache = null,
            gridUpdatePermission = _.isBoolean(hasUpdatePermission) ? hasUpdatePermission : true ,
            gridNotDroppableMask = render_template(templates.gridNotDroppableMask),
            draggingElementGroupId = null,
            cellCheckEventDefaultObj = {
                numberOfCellItems: 0,
                numberOfSelectedCellItems: 0,
                columnName: undefined,
                cellContainer: undefined
            },
            isRowSortable = gridUpdatePermission && conf.elements.dragNDrop && conf.elements.dragNDrop.moveRow && conf.elements.dragNDrop.moveRow.afterDrop,
            isDraggableRow = conf.elements.dragNDrop && conf.elements.dragNDrop.connectWith && conf.elements.dragNDrop.connectWith.isDraggingRow !== false,
            self = this;

        /**
         * Check if a cell has drag a drop either by the moveCell from the dragNDrop or if it has the dragNDrop property in one of its colums
         * It will be false ONLY when it is row to row in the same table (sortable) and no other drag and/or drop feature is available
         * @returns {boolean} - true is cell (and items) can be dragged or dropped or false otherwise
         * @inner
         */
        var isCellDnD = function () {
            if (conf.elements.dragNDrop && (conf.elements.dragNDrop.moveCell || conf.elements.dragNDrop.connectWith)) {
                return true;
            }
            return gridReference.instance.gridConfigurationHelper.hasColumnProperty("dragNDrop");
        }();

        /**
         * Init rowDragNDrop class when the row drag-n-drop config is enabled.
         * @param {Object} $gridTable
         */
        this.rowDnDInit = function($gridTable){
            if (isRowSortable){
                var options = {
                    "instance": {
                        "gridConfigurationHelper": gridReference.instance.gridConfigurationHelper,
                        "render_template": render_template,
                        "treeGridHelper": gridReference.instance.treeGridHelper,
                        "treeActions": gridReference.instance.treeActions
                    },
                    "method": {
                        "addNewRowData": gridReference.method.addNewRowData,
                        "checkRowSelected": checkRowSelected,
                        "generateMessage": generateMessage,
                        "updateDraggableElementClass": self.updateDraggableElementClass,
                        "toggleRowSelection": gridReference.method.toggleRowSelection,
                        "getSelectedRows": gridReference.method.getSelectedRows,
                        "resetSelections": gridReference.method.resetSelections,
                        "clearAllSelection": gridReference.method.clearAllSelection,
                        "reformatRow": gridReference.method.reformatRow,
                        "isRowInEditMode": gridReference.method.isRowInEditMode
                    },
                    "objects":{
                        "allRowsInTree": gridReference.objects.allRowsInTree,
                        "originalRowData": gridReference.objects.originalRowData
                    },
                    "templates": templates
                };
                rowDragNDrop = new RowDragNDrop(conf, options);
                rowDragNDrop.bindTreeGridEvent($gridTable);
            }
        };

        /**
         * Adds the classes and binds the events required to provide drag and drop on the cells and rows of a grid
         * @param {Object} $gridTable - grid with the elements that will have drag and drop added
         */
        this.bindDnD = function ($gridTable) {
            addDraggableClass($gridTable); //Add row or cell draggable class to the checkbox of td
            if (isCellDnD) {
                bindDnDCellsEvent($gridTable);
                initDnDScrolling($gridTable);
            }
            rowDragNDrop && rowDragNDrop.bindRowDnD($gridTable);
        };

        /**
         * Bind drag and drop event and triggered when an accepted draggable is dropped on the droppable
         * @param {Object} event - row on edit mode
         * @param {Object} ui - Object provided by the drop callback that includes the properties: draggable, helper, position and offset
         * @param {Object} dropElement - jQuery object with the this of the drop event
         * @inner
         */
        var droppableDropEvent = function (event, ui, dropElement) {
            if (dropElement.hasClass('draggable-cell-source')) {
                return;
            }

            var droppableGridTable = dropElement.parents('table');
            droppableGridTable.parents(".ui-jqgrid-view").find(".cell_mask").remove();

            var dropGridTablePara = droppableGridTable.jqGrid('getGridParam'),
                $dropElement = dropElement,
                $dragElement = $(ui.draggable),
                $helper = $(ui.helper),
                dragGridTablePara = $draggableGridTable && $draggableGridTable.jqGrid('getGridParam'),
                $droppableRow = $dropElement.parents('tr'),
                droppableRowId = $droppableRow.attr('id'),
                droppableRow = {
                    rawData: $droppableRow.data('jqgrid.record_data'),
                    rowData: gridReference.method.reformatRow(droppableGridTable.jqGrid('getRowData', droppableRowId))
                },
                isRowDraggable = dragGridTablePara && dragGridTablePara.dragNDrop && dragGridTablePara.dragNDrop.connectWith && dragGridTablePara.dragNDrop.connectWith.isDraggingRow !== false,
                isValidAfterDrop = true,
                revertDrop = false,
                groupId,
                dropTableID = droppableGridTable.attr('id'),
                dragTableId = $draggableGridTable && $draggableGridTable.attr('id'),
                dropColumnName = gridReference.instance.gridConfigurationHelper.getColumnName($dropElement, dropTableID);

            dropTableColumnHash = dropTableColumnHash || gridReference.instance.gridConfigurationHelper.buildColumnConfigurationHashByName(dropGridTablePara.colModel);
            draggingElementGroupId = false;

            if (isRowDraggable) {
                groupId = dragGridTablePara.dragNDrop && dragGridTablePara.dragNDrop.connectWith && dragGridTablePara.dragNDrop.connectWith.groupId;
            } else {
                //Need this when applying cell-to-cell logic to multiple items drag-n-drop
                if ($dragElement.hasClass('cellItem')) {
                    $dragElement = $dragElement.parents('td');
                }

                var dragColumnName = dragTableId && gridReference.instance.gridConfigurationHelper.getColumnName($dragElement, dragTableId),
                    columnPara = droppableGridTable.getColProp(dragColumnName);

                groupId = columnPara.dragNDrop && columnPara.dragNDrop.groupId;
            }
            if ((groupId && !$dropElement.hasClass(groupId + '_droppable')) || !droppableRow || (!groupId && !$dropElement.hasClass('cell_droppable')) || !isBeforeDragValid || !isHoverDropValid) {
                var connectTableId = dragGridTablePara && dragGridTablePara.dragNDrop && dragGridTablePara.dragNDrop.connectWith && dragGridTablePara.dragNDrop.connectWith.selector;
                $dragElement.draggable('option', 'revert', true);

                if (connectTableId) {
                    $(connectTableId).find(".cell_mask").remove();
                }
                return;
            }

            var options = generateDroppableData(isRowDraggable, dragGridTablePara.colModel, $dragElement, $dropElement, $helper, dragTableId, dropColumnName, droppableRow);

            options.updateColumnVisualEffect = updateColumnVisualEffect;

            //Hide the helper. In case the grid gets refresh in the callback.
            $helper.hide();

            if (dropTableColumnHash[dropColumnName].dragNDrop && dropTableColumnHash[dropColumnName].dragNDrop.callbacks && dropTableColumnHash[dropColumnName].dragNDrop.callbacks.afterDrop) {
                isValidAfterDrop = dropTableColumnHash[dropColumnName].dragNDrop.callbacks.afterDrop(options);
            } else if (dropGridTablePara.dragNDrop && dropGridTablePara.dragNDrop.moveCell && dropGridTablePara.dragNDrop.moveCell.afterDrop) {
                isValidAfterDrop = dropGridTablePara.dragNDrop.moveCell.afterDrop(options);
            }

            //after the callback is executed, the validation is returned
            if (isValidAfterDrop) {
                if (_.isObject(isValidAfterDrop) && !isValidAfterDrop.isValid) {
                    $helper.show();
                    $dragElement.draggable('option', 'revert', true);
                    var buildConfirmationDialog = new ConfirmationDialogBuilder(conf).showErrorMsg(isValidAfterDrop.errorMessage);
                    revertDrop = true;
                } else {
                    var isRowExpanded = $dropElement.find('.cellExpandWrapper') && $dropElement.find('.cellExpandWrapper').is(':visible'),
                        $moreCell = $droppableRow.find('.slipstreamgrid_more');

                    $clonedDraggableElement.find('input').removeClass('showCheckbox').prop("checked", false);
                    $draggableGridTable && $draggableGridTable.trigger('slipstreamGrid.multiselectCell:cellItemSelected', cellCheckEventDefaultObj);
                    $dragElement.draggable('option', 'revert', false);

                    //By default, jqGrid will display collpased content after updates. Make sure the row is collapsed when the row is expanded.
                    isRowExpanded && $moreCell.click();
                    //We need to update jqgrid.record_data after drops, so expand a row will display the updated data.
                    var droppableRowData = gridReference.method.reformatRow(droppableGridTable.jqGrid('getRowData', droppableRowId)),
                        newCellData = droppableRowData[dropColumnName].concat(options.data),
                        newDroppableRowData = _.extend({},droppableRowData,true);
                    newDroppableRowData[dropColumnName] = newCellData;
                    gridReference.method.editRow(droppableRowData, newDroppableRowData);

                    if (isRowExpanded) {
                        $moreCell.click();
                        $dropElement.find('input').addClass('showCheckbox');
                    }

                    gridReference.method.resetSelections(droppableGridTable, true);
                    draggableTableResetSelection($draggableGridTable, true);
                    selectedRows = null;

                    if (!dropGridTablePara.editRow) {
                        droppableGridTable.trigger('slipstreamGrid.saveRow');
                    }

                    updateColumnVisualEffect($dropElement);
                    gridReference.instance.tooltipBuilder.addRowTooltips(droppableGridTable, {}, droppableRowId);
                }
            }

            $dragElement.data('revertDrop', revertDrop);
        };

        /**
         * Update visual effect for the dropped target column
         * @param {jQuery Object} $dropCell
         * @inner
         */
        var updateColumnVisualEffect = function ($dropCell) {
            $dropCell.addClass("scroll_highlight");            
            removeHighlight = function () {
                $dropCell.removeClass("scroll_highlight");            
            };
            setTimeout(removeHighlight, 3000);
        };

        /**
         * Update draggable element class
         * @param {Boolean} isDenied
         */
        this.updateDraggableElementClass = function(isDenied){
            var $dragElement = $('#draggableElement');
            if ($dragElement.length > 0) {
                var $iconContainer = $dragElement.find('.icon_container'),
                    $iconAccess = $iconContainer.find('.helper-access'),
                    $iconReject = $iconContainer.find('.helper-reject');
                if (isDenied) {
                    $iconAccess.hide();
                    $iconReject.show();
                } else {
                    $iconAccess.show();
                    $iconReject.hide();
                }
            }
        };

        /**
         * Search Helper Data that should come from which column
         * @param {Array} array of columns
         * @inner
         */
        var searchHelperData = function (columns) {
            var currentConf = gridReference.instance.gridConfigurationHelper.getColumnConfiguration(columns, ["dragNDrop", "isDraggableHelperData"]);

            if (currentConf) {
                return currentConf.name;
            } else {
                return conf.elements.jsonId;
            }
        };

        /**
         * Bind all DnD internal events
         * @param {Object} gridTable
         * @inner
         */
        var bindDnDEvents = function ($gridTable) {
            $gridTable.on("slipstreamGrid.draggableStart", function (event, data) {
                $draggableGridTable = data.draggableTable;
                draggableTableResetSelection = data.resetSelection;
                dragTableId = data.dragTableId;
                selectedRows = data.selectedRows;
                isBeforeDragValid = data.isBeforeDragValid;
                $clonedDraggableElement = data.clonedDraggableElement;
                dragElementData = {
                    rowData: data.rowData.rowData,
                    rawData: data.rowData.rawData
                };
                draggableRowId = data.draggableRowId;
            });

            //the rest was moved to bindHoverCell
            $gridTable.on("mouseenter", ".draggable-source", function () {
                var $dropElement = $(this);
                if ($dropElement.hasClass('draggable-source')) {
                    self.updateDraggableElementClass(true);
                }
            });
            $gridTable.on("mouseenter", ".draggable-cell-source", function () {
                var $dropElement = $(this);
                if ($dropElement.hasClass('draggable-cell-source')) {
                    self.updateDraggableElementClass(true);
                }
            });
            $gridTable.bind("slipstreamGrid.cellItems:appended", function (e, row) {
                bindDnDItemsEvent($(row), $(this));
            });
        };


        /**
         * Generate draggable data for callbacks
         * @param {Boolean} isRowDraggable
         * @param {Array} colModel
         * @param {Object} dragElement
         * @param {String} dragGrid table id
         * @inner
         */
        var generateDraggableData = function (isRowDraggable, colModel, $dragElement, dragTableId) {
            var draggableValues = selectedRows && selectedRows.selectedRowIds.length > 0 ? selectedRows.selectedRowIds : [],
                selected_rows = selectedRows && selectedRows.selectedRows.length > 0 ? selectedRows.selectedRows : [],
                draggableCellColumn = {},
                draggableRows = [],
                isMulitpleDrag = (isRowDraggable && selectedRows && selectedRows.selectedRowIds.length > 1),
                helperColumnData = searchHelperData(colModel);

            var generateSelectedRowsHash = function () {
                var selectedRowsHash = {};
                for (var j = 0; j < selectedRows.selectedRows.length; j++) {
                    selectedRowsHash[selectedRows.selectedRows[j][conf.elements.jsonId]] = selectedRows.selectedRows[j];
                }
                return selectedRowsHash;
            };

            if (!isRowDraggable){
                var draggableCellName = gridReference.instance.gridConfigurationHelper.getColumnName($dragElement, dragTableId),
                    dragTableColumnHash = gridReference.instance.gridConfigurationHelper.buildColumnConfigurationHashByName(colModel),
                    cellAttr = $dragElement.attr('aria-describedby'),
                    $row = $draggableGridTable.find("#" + draggableRowId);

                draggableCellColumn = {
                    index: dragTableColumnHash[draggableCellName].index || '',
                    name: dragTableColumnHash[draggableCellName].name
                };
                $dragElement = gridReference.instance.gridConfigurationHelper.getCellDom($row, cellAttr);
            }
            if (!isMulitpleDrag) {
                //if just drag one item
                if (isRowDraggable && helperColumnData) {
                    var draggableData = dragElementData.rowData[helperColumnData];
                    draggableValues = (_.isArray(draggableData)) ? draggableData : draggableData.split('\n');
                    draggableValues[draggableValues.length - 1] === '' && draggableValues.pop();
                } else {
                    if (isDraggingItems){
                        var draggableItems = !isMulitpleDrag && isDraggingItems && gridReference.instance.multiselectCell.getSelectedCellItems($dragElement);
                        for (var i = 0; i< draggableItems.length; i++){
                            draggableValues.push(draggableItems[i].textContent);
                        }
                    }else{
                        draggableValues = dragElementData.rowData[draggableCellColumn.name];
                    }
                }
                draggableRows.push({
                    rowData: dragElementData.rowData,
                    rawData: dragElementData.rawData
                });
            } else {
                if (selectedRows.allRowIds && selectedRows.allRowIds.length > 0) {
                    
                    var selectedRowsHash = generateSelectedRowsHash();
                    draggableValues = selectedRows.allRowIds;

                    for (var i = 0; i < selectedRows.allRowIds.length; i++) {
                        var obj = {},
                            id = selectedRows.allRowIds[i],
                            $row = $draggableGridTable.find("#" + row[id]);
                        if (selectedRowsHash[id]) {
                            _.extend(obj, selectedRowsHash[id]);
                        } else {
                            obj.id = id;
                        }
                        draggableRows.push({
                            rowData: obj,
                            rawData: ($row && $row.data('jqgrid.record_data')) || {}
                        });
                    }
                }else if (isMulitpleDrag){
                    draggableRows = gridReference.instance.gridConfigurationHelper.getSelectedRowData(selected_rows, $draggableGridTable);
                }
            }

            return {draggableValues: draggableValues, draggableCell: $dragElement, draggableItems: draggableItems, draggableRows: draggableRows, draggableCellColumn: draggableCellColumn};
        };

        /**
         * Generate draggable data for the droppable callbacks
         * @param {Boolean} isRowDraggable
         * @param {Array} dragGrid colModel
         * @param {Object} dragElement
         * @param {Object} helper
         * @param {String} dragGrid table id
         * @inner
         */
        var generateDraggbleDataForDroppable = function (isRowDraggable, dragTableColModel, $dragElement, $helper, dragTableId) {
            var dragCallbackData = generateDraggableData(isRowDraggable, dragTableColModel, $dragElement, dragTableId),
                options = {},
                cellColumn;

            options.data = dragCallbackData && dragCallbackData.draggableValues;
            options.helper = $helper;
            options.draggableRows = dragCallbackData && dragCallbackData.draggableRows;

            if (!isRowDraggable){
                options.$draggableCell = dragCallbackData && dragCallbackData.draggableCell;
            }

            if (dragCallbackData && !isRowDraggable) {
                options.draggableCellColumn = dragCallbackData.draggableCellColumn;
                if (dragCallbackData.draggableItems && dragCallbackData.draggableItems.length > 0) {
                    options.draggableItems = dragCallbackData.draggableItems;
                }
            }

            return options;
        };


        /**
         * Generate droppable data for callbacks
         * @param {Boolean} isRowDraggable
         * @param {Array} dragGrid colModel
         * @param {Object} dragElement
         * @param {Object} dropElement
         * @param {Object} helper
         * @param {String} dragGrid table id
         * @param {String} droppable cell column name
         * @param {Object} dropRow data
         * @param {Boolean} if the function is triggered by the over event
         * @inner
         */
        var generateDroppableData = function (isRowDraggable, dragTableColModel, $dragElement, $dropElement, $helper, dragTableId, droppableCellColName, droppableRow, isOverEvent, isSearchDropped) {
            var options = generateDraggbleDataForDroppable(isRowDraggable, dragTableColModel, $dragElement, $helper, dragTableId),
                cellColumn;

            if (dropTableColumnHash){
                cellColumn = {
                    index: dropTableColumnHash[droppableCellColName].index || '',
                    name: dropTableColumnHash[droppableCellColName].name
                };
            }
            if (isOverEvent){
                options.$hoveredCell = $dropElement;
                options.hoveredRow = droppableRow;
                options.hoveredCellColumn = cellColumn;
            }else{
                options.droppableRow = droppableRow; 
                options.$droppableCell = $dropElement;
                options.droppableCellColumn = cellColumn;
            }  

            return options;
        };

        /**
         * Invoke draggable callback parameters
         * @param {Object} $gridTable
         * @param {Object} $connectedGridTable
         * @param {Object} $dragElement
         * @param {Object} $helper
         * @param {String} draggableCellColumnName
         * @param {String} groupId
         * @param {Boolean} isRowDraggable
         * @inner
         */
        var invokeBeforeDragCallback = function ($gridTable, $connectedGridTable, $dragElement, $helper, draggableCellColumnName, groupId, isRowDraggable, dragTableId) {
            var isValidBeforeDrag = true,
                dragGridTablePara = $gridTable.jqGrid('getGridParam'),
                dragTableColumnHash = gridReference.instance.gridConfigurationHelper.buildColumnConfigurationHashByName(dragGridTablePara.colModel),
                dragCallbackData = generateDraggableData(isRowDraggable, dragGridTablePara.colModel, $dragElement, dragTableId),
                options = {};

            /**
             * Trigger beforeDrag callback
             * @param {Boolean} isGridLevel: trigger the callback at the grid level or column level
             * @inner
             */
            var triggerCallback = function(isGridLevel){
                if (dragCallbackData && dragCallbackData.draggableItems){
                    options.draggableItems = dragCallbackData.draggableItems;
                }
                options.$draggableCell = dragCallbackData && dragCallbackData.draggableCell;
                
                if (isGridLevel){
                    return dragGridTablePara.dragNDrop.moveCell.beforeDrag(options);
                }else{
                    return dragTableColumnHash[draggableCellColumnName].dragNDrop.callbacks.beforeDrag(options);
                }
            };

            options.data = dragCallbackData && dragCallbackData.draggableValues;
            options.draggableRows = dragCallbackData && dragCallbackData.draggableRows;
            options.helper = $helper;

            if (!isRowDraggable) {
                options.draggableCellColumn = dragCallbackData && dragCallbackData.draggableCellColumn;
            }

            if (draggableCellColumnName && dragTableColumnHash[draggableCellColumnName].dragNDrop && dragTableColumnHash[draggableCellColumnName].dragNDrop.callbacks && dragTableColumnHash[draggableCellColumnName].dragNDrop.callbacks.beforeDrag) {
                isValidBeforeDrag = triggerCallback();

            } else if (dragGridTablePara.dragNDrop && dragGridTablePara.dragNDrop.moveCell && dragGridTablePara.dragNDrop.moveCell.beforeDrag) {
                isValidBeforeDrag = triggerCallback(true);

            } else if (dragGridTablePara.dragNDrop && dragGridTablePara.dragNDrop.moveRow && dragGridTablePara.dragNDrop.moveRow.beforeDrag) {
                isValidBeforeDrag = dragGridTablePara.dragNDrop.moveRow.beforeDrag(options);
            }

            //after the callback is executed, the validation is returned
            if (_.isObject(isValidBeforeDrag) && !isValidBeforeDrag.isValid) {
                if (groupId) {
                    $gridTable.find("." + groupId + "_droppable").append(gridNotDroppableMask);
                    $connectedGridTable && $connectedGridTable.find("." + groupId + "_droppable").append(gridNotDroppableMask);
                }
                var buildConfirmationDialog = new ConfirmationDialogBuilder(conf).showErrorMsg(isValidBeforeDrag.errorMessage);
                isValidBeforeDrag = false;
            } else if (!isValidBeforeDrag && groupId) {
                $gridTable.find("." + groupId + "_droppable").append(gridNotDroppableMask);
                $connectedGridTable && $connectedGridTable.find("." + groupId + "_droppable").append(gridNotDroppableMask);
            }
            return isValidBeforeDrag;
        };

        /**
         * Check current hovered element is in the grid view port or not
         * @param {Object} current hovered column
         * @inner
         */
        var checkElementInViewport = function ($currentlyHoveredElement) {
            var $currentlyHoveredRow = $currentlyHoveredElement.parents('tr'),
                rowHeight = $currentlyHoveredRow.height(),
                $currentBdiv = $currentlyHoveredElement.parents('.ui-jqgrid-bdiv:first'),
                $currentHdiv = $currentBdiv.siblings('.ui-jqgrid-hdiv:first'),
                $currentUIGrid = $currentlyHoveredElement.parents('.ui-jqgrid:first'),
                $gridTableFooter = $currentUIGrid.siblings('.gridTableFooter'),
                $currentFooter = $gridTableFooter.length > 0 && $gridTableFooter.is(':visible') ? $gridTableFooter : $currentUIGrid.siblings('.grid-widget-end'),
                isInViewport = $currentlyHoveredElement.offset().top < $currentFooter.offset().top - rowHeight / 2 && $currentlyHoveredElement.offset().top > $currentHdiv.offset().top + rowHeight / 2;

            return isInViewport;
        };

        /**
         * Set helper icon for overDrop event
         * @param {Object} droppable instance
         * @param {Object} current hovered column
         * @param {String} groupId
         * @inner
         */
        var setHelperIconHoverDrop = function (droppable, $currentlyHoveredElement, groupId) {
            var isInViewport = checkElementInViewport($currentlyHoveredElement);

            if (!isBeforeDragValid || $currentlyHoveredElement.hasClass('draggable-source') || $currentlyHoveredElement.hasClass('draggable-cell-source')) {
                self.updateDraggableElementClass(true);
            } else if (groupId && isInViewport && $currentlyHoveredElement.hasClass(groupId + '_droppable')) {
                self.updateDraggableElementClass(false);
            } else if (!groupId && isInViewport && $currentlyHoveredElement.hasClass('cell_droppable')) {
                self.updateDraggableElementClass(false);
            } else {
                self.updateDraggableElementClass(true);
            }
        };

        /**
         * Add draggable-source class to the source cell and cell mask to not droppablable cells
         * @param {Object} $gridTable
         * @param {Object} $dragElement
         * @param {Boolean} isRowDraggable
         * @param {Object} all selectedRows data
         * @inner
         */
        var addDraggableVisualClass = function ($gridTable, $dragElement, isRowDraggable, selectedRows) {
            //if this grid is draggableRow is true and it has multi-selected rows
            if (isRowDraggable && selectedRows && selectedRows.selectedRowIds.length >= 1) {
                for (var i = 0; i < selectedRows.selectedRowIds.length; i++) {
                    $gridTable.find('#' + selectedRows.selectedRowIds[i]).addClass("row-draggable-source");
                }
                //if this grid is draggableRow is true
            } else if (isRowDraggable) {
                $dragElement.parents('tr').addClass("row-draggable-source");
                //else they are cell interaction
            } else {
                var draggableItems = $dragElement.find('input:checked');
                var isRowExpanded = $dragElement.find('.cellExpandWrapper').is(':visible');
                if (isRowExpanded) {
                    for (var i = 0; i < draggableItems.length; i++) {
                        $(draggableItems[i]).parents(".cellItem").addClass("draggable-source");
                    }
                    $dragElement.addClass("draggable-cell-source");
                } else {
                    $dragElement.addClass("draggable-source");
                }
            }
        };

        var addCellMask = function ($gridTable, groupId) {
            var $notDroppableCells = [],
                $notDroppableHeader = [];

            if (groupId) {
                $notDroppableCells.push($gridTable.parents(".ui-jqgrid-view").find("td:not(." + groupId + "_droppable):not(.ui-search-input):not(.ui-search-clear)"));
            } else {
                $notDroppableCells.push($gridTable.parents(".ui-jqgrid-view").find("td:not(.cell_droppable):not(.ui-search-input):not(.ui-search-clear)"));
            }
            $notDroppableHeader.push($gridTable.parents(".ui-jqgrid-view").find("th"));

            //add cell_mask to non-droppable cells and all table th
            for (var i = 0; i < $notDroppableCells.length; i++) {
                $notDroppableCells[i].append(gridNotDroppableMask);
                $notDroppableHeader[i].append(gridNotDroppableMask);
            }
        };

        /**
         * Trigger gridTable and $connectedGridTable
         * @param {Object} $gridTable
         * @param {Object} $connectedGridTable
         * @param {String} dragTableId
         * @param {String} dropTableID
         * @param {Object} selectedRows
         * @param {Function} resetSelection
         * @param {Boolean} isValidBeforeDrag
         * @inner
         */
        var triggerGridTablesBeforeDrag = function ($gridTable, $connectedGridTable, dragTableId, dropTableID, selectedRows, isValidBeforeDrag) {
            var data = {};

            data.resetSelection = gridReference.method.resetSelections;
            data.draggableTable = $gridTable;
            data.dragTableId = dragTableId;
            data.selectedRows = selectedRows;
            data.isBeforeDragValid = isValidBeforeDrag;
            data.clonedDraggableElement = $clonedDraggableElement;
            data.draggableRowId = draggableRowId;
            data.rowData = {
                rowData: dragElementData.rowData,
                rawData: dragElementData.rawData
            };

            //Trigger both grid to pass draggbleTable methods
            $gridTable && $gridTable.trigger("slipstreamGrid.draggableStart", data);

            if ($connectedGridTable) {
                $connectedGridTable.trigger("slipstreamGrid.draggableStart", data);
            }
        };

        /**
         * Check if the row is selected. If not, check the row first and return the selectedRows.
         * @param {String} the rowId
         * @param {Object} gridTable
         * @param {Object} selectedRows data
         * @inner
         */
        var checkRowSelected = function (rowId, $gridTable, selectedRows) {
            var selectedRowsData = !selectedRows ? gridReference.method.getSelectedRows() : selectedRows;

            if ($.inArray(rowId, selectedRowsData.selectedRowIds) === -1) {
                $gridTable.jqGrid('setSelection', rowId);
                selectedRowsData = gridReference.method.getSelectedRows();
            }

            return selectedRowsData;
        };


        /**
         * Update helper in the draggable helper event
         * @param {Object} the current dragging element
         * @param {Object} gridTable
         * @param {Boolean} check if cell (true) or item (false) is invoking this method
         * @inner
         */
        var draggingRowHelper = function ($dragElement, $gridTable, isCell) {
            var content,
                draggableTableID = $gridTable.attr('id');

            selectedRows = gridReference.method.getSelectedRows();
            if (isCell) {
                //Select the row if the row hasn't been selected
                var rowId = $dragElement.parents("tr").attr('id');
                selectedRows = checkRowSelected(rowId, $gridTable, selectedRows);
            }

            if (selectedRows.selectedRows.length > 1) {
                var totalRows = selectedRows.allRowIds ? selectedRows.allRowIds.length : selectedRows.selectedRows.length;
                content = generateMessage('Copying_items', totalRows);
            } else {
                var dragGridTablePara = $gridTable.jqGrid('getGridParam'),
                    draggableRowId = $dragElement.parents('tr').attr('id'),
                    draggableRow = $gridTable.jqGrid('getRowData', draggableRowId),
                    helperColumnData = searchHelperData(dragGridTablePara.colModel);

                content = draggableRow[helperColumnData];
                if (_.isArray(content)) {
                    var attr = draggableTableID + "_" + helperColumnData;
                    content = $dragElement.parents('tr').find("[aria-describedby= " + attr + "]").find('.cellContent:first').text();
                }
            }

            return content;
        };

        /**
         * Invoke callback when the draggable elements start
         * @param {Object} the current dragging element
         * @param {Object} helper
         * @param {String} dropTable ID
         * @param {Object} gridTable
         * @param {Object} connectedGridTable
         * @inner
         */
        var invokeDragStartEvent = function ($dragElement, $helper, dropTableID, $gridTable, $connectedGridTable) {
            var groupId,
                dragTableId = $gridTable.attr('id'),
                options = $dragElement.draggable("option"),
                droppableOptions = $dragElement.hasClass('cell_droppable') && $dragElement.droppable("option"),
                itemOptions = $dragElement.find('.cellExpandWrapper .cellItem').length > 0 && $dragElement.find('.cellExpandWrapper .cellItem').draggable('option');

            $draggableGridTable = $gridTable;
            /**
             * We need to clone the $dragElement into a variable, so when page starts scrolling, the $dragElement won't be removed by lib or any clearGrid methods
             * If $dragElement was removed before finished drag-n-drop behavior, the stop event wouldn't get triggered so the helper and cell mask stay in the grid.
             */

            $dragElement.data("dragTableId", dragTableId);
            $clonedDraggableElement = $dragElement.clone(true, true);
            $dragElement.before($clonedDraggableElement);
            $draggableElement = $dragElement.detach();
            $dragElement = $clonedDraggableElement;

            //Add the $clonedDraggableElement draggable and droppable so it can be used later
            options && $dragElement.draggable(options);
            droppableOptions && $dragElement.droppable(droppableOptions);
            itemOptions && $dragElement.find('.cellExpandWrapper .cellItem').draggable(itemOptions);
            draggableRowId = $dragElement.parents('tr').attr('id');
            gridReference.instance.tooltipBuilder.addRowTooltips($gridTable, {}, draggableRowId);

            dragElementData.rowData = gridReference.method.reformatRow($gridTable.jqGrid('getRowData', draggableRowId));
            dragElementData.rawData = $dragElement.parents('tr').data('jqgrid.record_data');
            // Unselect previous selections and trigger 'slipstreamGrid.multiselectCell:cellItemSelected' event with the cloned cell items
            gridReference.instance.multiselectCell.cellItemSelect($clonedDraggableElement, $gridTable);
            if (dropTableID && isDraggableRow) {
                if ($connectedGridTable) {
                    groupId = conf.elements.dragNDrop && conf.elements.dragNDrop.connectWith && conf.elements.dragNDrop.connectWith.groupId;
                    addCellMask($connectedGridTable, groupId);
                    gridReference.instance.tooltipBuilder.disableTooltip($connectedGridTable.find('.tooltipstered'));
                }
            } else {
                var dragColumnName = gridReference.instance.gridConfigurationHelper.getColumnName($dragElement, dragTableId),
                    columnPara = $gridTable.getColProp(dragColumnName);

                groupId = columnPara.dragNDrop && columnPara.dragNDrop.groupId;
                addCellMask($gridTable, groupId);
                gridReference.instance.tooltipBuilder.disableTooltip($gridTable.find('.tooltipstered'));
            }

            draggingElementGroupId = groupId;
            addDraggableVisualClass($gridTable, $dragElement, isDraggableRow, selectedRows);
            isBeforeDragValid = invokeBeforeDragCallback($gridTable, $connectedGridTable, $dragElement, $helper, dragColumnName, groupId, isDraggableRow, dragTableId);
            triggerGridTablesBeforeDrag($gridTable, $connectedGridTable, dragTableId, dropTableID, selectedRows, isBeforeDragValid);
            
            self.updateDraggableElementClass(!isBeforeDragValid);
            
        };

        /**
         * Invoke callback when the draggable elements stop
         * @param {Object} gridTable
         * @param {Object} connectedGridTable
         * @inner
         */
        var invokeDragStopEvent = function ($gridTable, $connectedGridTable) {
            var updateGrid = function ($gridTable) {
                $gridTable.parents(".ui-jqgrid-view").find(".cell_mask").remove();
                gridReference.instance.tooltipBuilder.enableTooltip($gridTable.find('.tooltipstered'));
            };
            if (isDraggableRow) {
                $gridTable && $gridTable.find('.row-draggable-source').removeClass("row-draggable-source");
                $connectedGridTable && updateGrid($connectedGridTable);
            } else if ($gridTable) {
                $gridTable.find('.draggable-source').removeClass("draggable-source");
                $gridTable.find('.draggable-cell-source').removeClass("draggable-cell-source");
                updateGrid($gridTable);
            }

            $clonedDraggableElement.before($draggableElement);
            $clonedDraggableElement.remove();
            $draggableElement = null;
            draggingElementGroupId = null;
        };

        /**
         * Invoke callback when the draggable elements revert
         * @param {Object} the current dragging element
         * @inner
         */
        var invokeDragRevertEvent = function ($dragElement) {
            var revertDrop = $dragElement.data('revertDrop');

            if (typeof revertDrop === "undefined" || revertDrop) {
                return true;
            } else {
                return false;
            }
        };

        /**
         * Generate Message for i18n
         * @param {String} the message string
         * @param {Int} the number of count
         * @inner
         */
        var generateMessage = function (str, count) {
            return i18n.getMessage({msg: str, sub_values: [count]});
        };

        /**
         * Bind Drag and Drop event for items
         * @param {Object} the current row
         * @param {Object} gridTable
         * @inner
         */
        var bindDnDItemsEvent = function ($row, $gridTable) {
            var $draggableItems = $row ? $row.find("td.cell_draggable .cellExpandWrapper .cellItem") : $gridTable.find("tr:not(.rowNoSelectable) td.cell_draggable .cellExpandWrapper .cellItem"),
                dropTableID = conf.elements.dragNDrop && conf.elements.dragNDrop.connectWith && conf.elements.dragNDrop.connectWith.selector,
                $connectedGridTable = dropTableID && $(dropTableID);

            $draggableItems.draggable({
                appendTo: 'body',
                //Define the customized draggable helper
                helper: function (event) {
                    var $this = $(this),
                        draggableTdElement = $this.parents('td'),
                        draggableElement,
                        draggableItems,
                        content;

                    if (isDraggableRow) { //If this is row drag-n-drop
                        content = draggingRowHelper($this, $gridTable);
                    } else {
                        draggableItems = gridReference.instance.multiselectCell.getSelectedCellItems(draggableTdElement);
                        content = (draggableItems.length > 1) ? generateMessage('Copying_items', draggableItems.length) : $this.text();
                    }

                    draggableElement = render_template(templates.gridDraggableElement, {content: content});

                    return $(draggableElement);
                },
                //When user starts dragging the element
                start: function (event, draggableElement) {
                    var $this = $(this),
                        $helper = $(draggableElement.helper),
                        draggableTdElement = $this.parents('td');

                    $this.find('input').prop("checked", true);
                    draggableTdElement.addClass("draggable-cell-source");
                    isDraggingItems = true;

                    var draggableItems = gridReference.instance.multiselectCell.getSelectedCellItems(draggableTdElement);
                    if (draggableItems.length > 1) {
                        $helper.find(".helper_content").text(generateMessage('Copying_items', draggableItems.length));
                    }
                    $this.data('dragTableId', $gridTable.attr('id'));
                    //helper position
                    $helper.css("margin-left", event.clientX - $(event.target).offset().left + 10);
                    invokeDragStartEvent(draggableTdElement, $helper, dropTableID, $gridTable, $connectedGridTable);
                },
                //When user stops dragging the element
                stop: function (event, draggableElement) {
                    invokeDragStopEvent($gridTable, $connectedGridTable);
                },
                revert: function () {
                    invokeDragRevertEvent($(this));
                },
                drag: function (event, draggableElement) {
                    var $this = $(this),
                        $checkboxes = $this.parents('td').find('input');
                    !$checkboxes.hasClass('showCheckbox') && $checkboxes.addClass('showCheckbox');

                    var scroller = $this.data("__slipstream_dnd_dragScroller");
                    scroller && scroller.scroll({mouseX: event.pageX, mouseY: event.pageY});
                },
                refreshPositions: true,
                zIndex: 999
            });
        };

        /**
         * Bind Drag and Drop event for items
         * @param {Object} $row
         * @param {Object} gridTable
         * @inner
         */
        this.bindDnDItemsEvent = function ($row, $gridTable) {
            bindDnDItemsEvent($row, $gridTable);
        };

        /**
         * Bind Drag and Drop event for cells
         * @param {Object} gridTable
         * @inner
         */
        var bindDnDCellsEvent = function ($gridTable) {
            var $draggableCells = $gridTable.find("tr:not(.rowNoSelectable) td.cell_draggable"),
                $droppableCells = !isDraggableRow && $gridTable.find("tr:not(.rowNoSelectable) td.cell_draggable"),
                dropTableID = conf.elements.dragNDrop && conf.elements.dragNDrop.connectWith && conf.elements.dragNDrop.connectWith.selector,
                $connectedGridTable = dropTableID && $(dropTableID),
                tableClass = isDraggableRow ? "table_draggable_row" : "table_draggable_cell";

            bindDnDEvents($gridTable);
            gridParamsCache = $gridTable.jqGrid('getGridParam');
            dragNDropInitialized = true;
            $gridTable.addClass("slipstreamGrid_dnd " + tableClass);
            $draggableCells.draggable({
                appendTo: 'body',
                //Define the customized draggable helper
                helper: function (event) {
                    var $this = $(this),
                        draggableElement,
                        content;

                    if (isDraggableRow) {   //If this is row drag-n-drop
                        content = draggingRowHelper($this, $gridTable, true);
                    } else {
                        var cellValues = $this.find('.originalCellValue').text().trim().split('\n');
                        content = (cellValues.length > 1) ? generateMessage('Copying_items', cellValues.length) : cellValues[0];
                    }
                    draggableElement = render_template(templates.gridDraggableElement, {content: content});

                    return $(draggableElement);
                },
                //When user starts dragging the element
                start: function (event, draggableElement) {
                    var $this = $(this),
                        $helper = $(draggableElement.helper),
                        $expandedWrapper = $this.find('.cellExpandWrapper');

                    if ($expandedWrapper.length == 0 || !($expandedWrapper.length > 0 && $expandedWrapper.is(':visible'))) {
                        //helper position
                        $helper.css("margin-left", event.clientX - $(event.target).offset().left + 10);
                        isDraggingItems = false;
                        
                        var $items = $this.find('.cellCollapseWrapper').children();

                        if ($items.length === 0 && !isDraggableRow) {
                            //Hide helper if it is empty column
                            $helper.hide();
                            isBeforeDragValid = false;
                        } else {
                            //Check all of items during cell-to-cell drag-n-drop
                            $items.prop("checked", true);
                            isBeforeDragValid = true;
                        }

                        isBeforeDragValid && invokeDragStartEvent($this, $helper, dropTableID, $gridTable, $connectedGridTable);
                    } else {
                        $helper.hide();
                        isBeforeDragValid = false;
                    }
                },
                //When user stops dragging the element
                stop: function (event, draggableElement) {
                    invokeDragStopEvent($gridTable, $connectedGridTable);
                },
                revert: function () {
                    invokeDragRevertEvent($(this));
                },
                drag: function (event, draggableElement) {
                    var $this = $(this),
                        $checkboxes = $this.find('input');
                    !$checkboxes.hasClass('showCheckbox') && $checkboxes.addClass('showCheckbox');

                    var scroller = $this.data("__slipstream_dnd_dragScroller");
                    scroller && scroller.scroll({mouseX: event.pageX, mouseY: event.pageY});
                },
                refreshPositions: true,
                zIndex: 999
            });

            if ($droppableCells.length > 0) {
                $droppableCells.droppable({
                    accept: '.cell_draggable, .cellItem',
                    hoverClass: "droppable-hover",
                    drop: function (event, draggableElement) {
                        droppableDropEvent(event, draggableElement, $(this));
                    },
                    tolerance: 'pointer',
                    over: function (event, draggableElement) {
                        /**
                         * Reformat rowData. Some rowData contains droppable mask which is added dynamically when starts dragging. Thus, grid needs to remove it before passing to callbacks.
                         * @param {Object} rowData
                         * @return {Object} reformatted rowData
                         * @inner
                         */
                        var reformatHoveredRowData = function(rowData){
                            _.each(rowData, function(value, key) {
                                if(_.isString(value)){
                                    rowData[key] = value.replace(gridNotDroppableMask, '');
                                }
                            });
                            return rowData;
                        };

                        var $hoveredElement = $(this),
                            $dragElement = $(draggableElement.draggable),
                            $helper = $(draggableElement.helper),
                            groupId,
                            hoveredGroupId,
                            isValid = true,
                            $hoveredGridTable = $hoveredElement.parents('table'),
                            hoveredGridTablePara = $hoveredGridTable.jqGrid('getGridParam'),
                            dragGridTablePara = $draggableGridTable && $draggableGridTable.jqGrid('getGridParam'),
                            $hoveredRow = $hoveredElement.parents('tr'),
                            hoveredTableID = $hoveredGridTable.attr('id'),
                            dragTableId = $draggableGridTable && $draggableGridTable.attr('id'),
                            hoveredCellName = gridReference.instance.gridConfigurationHelper.getColumnName($hoveredElement, hoveredTableID),
                            hoveredRowId = $hoveredRow.attr('id'),
                            hoveredRowData =  droppableRow = {
                                rawData: $hoveredRow.data('jqgrid.record_data'),
                                rowData: reformatHoveredRowData(gridReference.method.reformatRow($hoveredGridTable.jqGrid('getRowData', hoveredRowId)))
                            },
                            isInViewport = checkElementInViewport($hoveredElement),
                            isRowDraggable = dragGridTablePara && dragGridTablePara.dragNDrop && dragGridTablePara.dragNDrop.connectWith && dragGridTablePara.dragNDrop.connectWith.isDraggingRow !== false;

                        if (!$draggableGridTable || isBeforeDragValid !== true || !isInViewport || gridUpdatePermission === false) {
                            isHoverDropValid = false;
                            $hoveredElement.removeClass('droppable-hover');
                            self.updateDraggableElementClass(true);
                            return;
                        }

                        if (isRowDraggable) {
                            groupId = dragGridTablePara.dragNDrop && dragGridTablePara.dragNDrop.connectWith && dragGridTablePara.dragNDrop.connectWith.groupId;
                        } else {
                            $dragElement = $dragElement.hasClass('cellItem') ? $dragElement.parents('td') : $dragElement;

                            var dragColumnName = dragTableId && gridReference.instance.gridConfigurationHelper.getColumnName($dragElement, dragTableId),
                                columnPara = $hoveredGridTable.getColProp(dragColumnName);

                            groupId = columnPara.dragNDrop && columnPara.dragNDrop.groupId;
                        }
                        draggingElementGroupId = groupId;
                        //set the helper icon to reflect the droppable status
                        setHelperIconHoverDrop(this, $hoveredElement, groupId);

                        var hoveredColumnName = hoveredTableID && gridReference.instance.gridConfigurationHelper.getColumnName($hoveredElement, hoveredTableID),
                            columnPara = $hoveredGridTable.getColProp(hoveredColumnName);

                        hoveredGroupId = columnPara.dragNDrop && columnPara.dragNDrop.groupId;

                        if (hoveredGroupId !== groupId) {
                            isHoverDropValid = false;
                            return;
                        }

                        dropTableColumnHash = dropTableColumnHash || gridReference.instance.gridConfigurationHelper.buildColumnConfigurationHashByName(hoveredGridTablePara.colModel);

                        var options = generateDroppableData(isRowDraggable, dragGridTablePara.colModel, $dragElement, $hoveredElement, $helper, dragTableId, hoveredColumnName, hoveredRowData, true);

                        if (dropTableColumnHash[hoveredColumnName].dragNDrop && dropTableColumnHash[hoveredColumnName].dragNDrop.callbacks && dropTableColumnHash[hoveredColumnName].dragNDrop.callbacks.hoverDrop) {
                            isValid = dropTableColumnHash[hoveredColumnName].dragNDrop.callbacks.hoverDrop(options);
                        } else if (hoveredGridTablePara.dragNDrop && hoveredGridTablePara.dragNDrop.moveCell && hoveredGridTablePara.dragNDrop.moveCell.hoverDrop) {
                            isValid = hoveredGridTablePara.dragNDrop.moveCell.hoverDrop(options);
                        }

                        if (!isValid) {
                            isHoverDropValid = false;
                            self.updateDraggableElementClass(true);
                        } else {
                            isHoverDropValid = true;
                            $dragElement.hasClass('cellItem') && $hoveredElement.addClass('droppable-hover');
                        }
                    }
                });
            }
        };


        /**
         * Check if a cell has drag a drop either by the moveCell from the dragNDrop or if it has the dragNDrop property in one of its colums
         * @returns {boolean} - true is cell (and items) can be dragged or dropped or false otherwise
         */
        this.isCellDnD = function () {
            return isCellDnD;
        };

        /**
         * Initialize DnD scrolling functionality.
         * @param {Object} $gridTable - The grid table associated with this drag and drop instance.
         * @inner
         */
        var initDnDScrolling = function ($gridTable) {
            if (!scrollingInitialized) {
                scrollingInitialized = true;

                // Set the grid up for DnD scrolling
                $($gridTable[0].grid.bDiv).droppable({
                    over: function (event, ui) {
                        startDraggableScrolling(ui.draggable, $(this));
                    },
                    out: function (event, ui) {
                        endDraggableScrolling(ui.draggable);
                    },
                    drop: function (event, ui) {
                        endDraggableScrolling(ui.draggable);
                    },
                    tolerance: "pointer"
                });
            }
        };

        /**
         * Start scrolling operations for a draggable.
         * @param {Object} draggable - The draggable whose drag operations cause the droppable to scroll.
         * @param {Object} droppable - The droppable that is to be scrolled when the draggable is dragged.
         * @inner
         */
        var startDraggableScrolling = function (draggable, droppable) {
            draggable.data("__slipstream_dnd_droppable", droppable);
            draggable.data("__slipstream_dnd_dragScroller", new DragScroller(draggable));
        };

        /**
         * End scrolling operations for a draggable.
         * @param {Object} draggable - The draggable whose drag operations are to be ended.
         * @inner
         */
        var endDraggableScrolling = function (draggable) {
            draggable.removeData("__slipstream_dnd_droppable");

            var scroller = draggable.data("__slipstream_dnd_dragScroller");
            scroller && scroller.stop();
            draggable.removeData("__slipstream_dnd_dragScroller");
        };

        /**
         * Add row draggable class to the checkbox of td so we can moveRow by using the checkbox td area
         * @param {Object} $gridTable - jQuery object with the table that will have drag and drop capabilities
         * @inner
         */
        var addDraggableClass = function ($gridTable) {
            if (isRowSortable) {
                $gridTable.find("td[aria-describedby = " + conf.elements.tableId + "_cb]").addClass("row_draggable");
            } else if (conf.elements.dragNDrop && conf.elements.dragNDrop.connectWith && conf.elements.dragNDrop.connectWith.isDraggingRow !== false) {
                $gridTable.find("td[aria-describedby = " + conf.elements.tableId + "_cb]").addClass("cell_draggable");
            }

            //Add class to header label in order to align the td
            if (isCellDnD && !dragNDropInitialized) {
                var i,
                    draggableColumns = [],
                    columns = conf.elements.columns,
                    tableId = conf.elements.tableId;
                for (i = 0; i < columns.length; i++) {
                    if (columns[i].dragNDrop && columns[i].dragNDrop.isDraggable) {
                        draggableColumns.push(columns[i].name);
                    }
                }
                for (i = 0; i < draggableColumns.length; i++) {
                    $gridTable.parents('.ui-jqgrid-bdiv').siblings('.ui-jqgrid-hdiv').find('#' + tableId + '_' + draggableColumns[i]).addClass("draggable_column_header");
                }
            }
        };

        /**
         * Add mask to non-droppable cell
         * @param {Object} $row
         */
        this.addNotDroppableMask = function ($row) {
            if ($row && isCellDnD && draggingElementGroupId) {
                $row.find("td:not(." + draggingElementGroupId + "_droppable)").append(gridNotDroppableMask);
            }
        };

        /**
         * Check if the grid is row draggable
         */
        this.isDraggableRow = function () {
            return isDraggableRow;
        };

    };

    return DragNDrop;
});