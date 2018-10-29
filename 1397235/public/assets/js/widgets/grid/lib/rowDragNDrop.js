/**
 * A module that provides row drag-n-drop in the grid. 
 *
 * @module RowDragNDrop
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
    'widgets/grid/lib/confirmationDialogBuilder'
],  /** @lends RowDragNDrop */
    function(ConfirmationDialogBuilder) {

    /**
     * RowDragNDrop constructor
     *
     * @constructor
     * @class RowDragNDrop - provide row drag-n-drop in the grid .
     *
     * @returns {Object} Current RowDragNDrop's object: this
     */
    var RowDragNDrop = function(conf, gridReference){

        /**
         * Builds the RowDragNDrop
         * @returns {Object} Current "this" of the class
         */

        var $draggableGridTable,
            sortedElementCached,
            selectedRows,
            isExpanded,
            triggerAfterDrop,
            sortableInitialized = false,
            isTreeGrid = conf.elements.tree ? true : false,
            isSortAllowed = true,
            addRowCount = 0,
            areSelectedRowsSiblings, //indicate if selected rows are siblings in the treeGrid
            allRowsInTree = gridReference.objects.allRowsInTree,
            originalRowData = gridReference.objects.originalRowData;

        /**
         * Bind row drag-n-drop
         * @param {Object} $gridTable - jQuery object with the table that will have drag and drop capabilities
         */
        this.bindRowDnD = function ($gridTable) {
            var sortableConfig = getSortableConf($gridTable);

            !$gridTable.hasClass("slipstreamGrid_dnd") && $gridTable.addClass("slipstreamGrid_dnd");
            $gridTable.sortable(sortableConfig);
            bindDnDRowHoverEvent($gridTable);
            refreshSortable();
        };

        
        /**
         * Bind treeGrid event
         * @param {Object} $gridTable
         */
        this.bindTreeGridEvent = function ($gridTable) {
            $gridTable.bind("gridLoaded", function(){
                if (isExpanded && triggerAfterDrop){
                    updateRowVisualEffect(selectedRows['selectedRowIds']);
                    addRowCount = 0;
                }
            });

            /**
             * When the row is added into a new group, it will trigger ajax to load the children. 
             * Thus, we need to wait until all of children are loaded and update the style
             */
            $gridTable.bind("slipstreamGrid.row:updateNumberOfRows", function(){
                if (isExpanded && triggerAfterDrop){
                    addRowCount = addRowCount + 1;
                    if (addRowCount == (selectedRows['selectedRowIds'].length - 1)){
                        addRowCount = 0;
                        updateRowVisualEffect(selectedRows['selectedRowIds']);
                    } 
                }
            });
        };

        /**
         * Adds support for drag and drop of a row
         * @param {Object} $table - jQuery object with the table that will have drag and drop capabilities
         * @inner
         */
        var bindDnDRowHoverEvent = function ($gridTable) {
            $gridTable.find("tr:not(.rowNoSelectable)").droppable({
                accept: 'tr',
                over: function (event, draggableElement) {
                    rowHoverDropEvent(event, draggableElement, $(this), $gridTable);
                }
            });
        };


        /**
         * Refresh the sortable items. Triggers the reloading of all sortable items, causing new items to be recognized.
         * @inner
         */
        var refreshSortable = function () {
            if (sortableInitialized && $draggableGridTable) {
                $draggableGridTable.find('tbody:first').sortable("refresh");
            }
            if (sortedElementCached) {
                for (var i = 0; i < sortedElementCached.draggableRows.length; i++) {
                    var sortedRow = $draggableGridTable.find("#" + sortedElementCached.draggableRows[i].id),
                        isInDom = $.contains($draggableGridTable[0], sortedElementCached.sortedElement[0]);
                    //Add sortable visual and the helper back when the original instance has been removed
                    if (sortedRow && !isInDom) {
                        sortedRow.addClass('sortable-source');
                        !i && sortedRow.after(sortedElementCached.helper);
                    }
                }
            }
        };

        /**
         * Get Helper Content
         * @param {Object} $gridTable
         * @param {Object} $sortedRow
         * @inner
         */
        var getHelperContent = function ($gridTable, $sortedRow) {
            /**
             Because sortable lib will copy the draggable row into the helper and remove the row from the DOM.
             UX desgin wants to keep the original copy in the DOM, so we have to clone the row and add it back to its original position
             After it drops, we need to remove the row that we just added
             */
            var content = gridReference.instance.render_template(gridReference.templates.gridDraggableDefaultElement),
                rowId = $sortedRow.attr('id');

            selectedRows = gridReference.method.getSelectedRows();
            if (isTreeGrid){
                //Check if any row is selected. If a row is selected, then don't toggleRowSelection
                if (selectedRows.numberOfSelectedRows == 0){
                    //Select the row if the row hasn't been selected
                    gridReference.method.toggleRowSelection(rowId, "selected");
                    selectedRows = gridReference.method.getSelectedRows();
                }
                
                areSelectedRowsSiblings = false;
                isSortAllowed = checkSortAllowed(selectedRows);
                if (isSortAllowed && !_.isEmpty(allRowsInTree[rowId]['children'])){
                    if (selectedRows.numberOfSelectedRows == 1){
                        //Select all the children
                        gridReference.instance.treeActions.selectChildren(gridReference.method.toggleRowSelection, rowId);
                        selectedRows = gridReference.method.getSelectedRows();
                    }
                }
            }else{
                isSortAllowed = checkSortAllowed(selectedRows);
                //Select the row if the row hasn't been selected
                isSortAllowed && (selectedRows = gridReference.method.checkRowSelected(rowId, $gridTable));
            }

            if (isSortAllowed){
                if (selectedRows.numberOfSelectedRows > 1) {
                    content = gridReference.instance.render_template(gridReference.templates.gridDraggableElement, {content: gridReference.method.generateMessage('Moving_rows', selectedRows.selectedRowIds.length)});
                } else {
                    content = $sortedRow;
                }
                $sortedRow.data('movedRow', $sortedRow.clone().insertAfter($sortedRow));
            }
            
            return content;
        };

        /**
         * Check if sorting is allowed in the grid
         * @param {Object} selectedRows
         * @inner
         */
        var checkSortAllowed = function(selectedRows){
            if (selectedRows.numberOfSelectedRows == 1){
                if (gridReference.method.isRowInEditMode(selectedRows.selectedRowsDom[0])){
                    return false;
                }
                return true;
            }else if (selectedRows.numberOfSelectedRows > 1 && isTreeGrid){
                var parents = _.pluck(selectedRows.selectedRows, "parent");

                //only same group can be reordered
                if (_.uniq(parents).length == 1){ 
                    areSelectedRowsSiblings = true;
                    return true;
                }
            }else{
                return true;
            }
        };

        /**
         * get Sortable Conf
         * @param {Object} $gridTable
         * @inner
         */
        var getSortableConf = function($gridTable){
            var sortableConfig = {
                helper: function (event, sortedElement) {
                    return getHelperContent($gridTable, sortedElement);
                },
                handle: ".row_draggable",
                cancel: ".rowNoSelectable",
                scrollSpeed: 10,
                items: ".jqgrow",
                axis: "y",
                cursor: "move",
                start: function (event, sortedElement) {
                    isSortAllowed && rowBeforeDragEvent(event, sortedElement, $(this), $gridTable);
                },
                change: function (event, sortedElement) {
                    isSortAllowed && rowAfterChangeEvent(event, sortedElement, $(this), $gridTable);
                },
                stop: function (event, sortedElement) {
                    isSortAllowed && rowAfterDropEvent(event, sortedElement, $(this), $gridTable);
                },
                sort: function(event, ui) { // prevent dragging if validation is false
                    if (!isSortAllowed) {
                        isSortAllowed = false;
                        // allow current jQuery UI code to finish runing, then cancel
                        setTimeout(function() {
                            $gridTable.sortable('cancel');
                        }, 0);
                    }
                }
            };

            return sortableConfig;
        };



        /**
         * Invoke row beforeDrag callback
         * @param {Object} event
         * @param {Object} sortable ui
         * @param {Object} sortable lib instance
         * @param {Object} gridTable
         * @inner
         */
        var rowBeforeDragEvent = function (e, sortedElement, $sortable, $gridTable) {
            var invokeBeforeDragCallback = function (draggableValues, draggableRows, $helper) {
                var isValidCallbacks = true;

                if (conf.elements.dragNDrop && conf.elements.dragNDrop.moveRow && conf.elements.dragNDrop.moveRow.beforeDrag) {
                    var options = {};

                    options.data = draggableValues;
                    options.draggableRows = draggableRows;
                    options.helper = $helper;

                    isValidCallbacks = conf.elements.dragNDrop.moveRow.beforeDrag(options);
                }

                return isValidCallbacks;
            };

            var rowId = sortedElement.item[0].id,
                sortedTableID = $gridTable.attr('id'),
                sortableData = generateSortableData($gridTable),
                isValidCallback = invokeBeforeDragCallback(sortableData.sortableValues, sortableData.sortableRows, sortedElement.helper),
                $sortedElement = sortedElement.item,
                $helper = sortedElement.helper,
                $overridedRowNext = sortedElement.placeholder.next(),
                $overridedRowPrev = sortedElement.placeholder.prev(),
                isMulitpleDrag = sortableData.sortableRows.length > 1,
                $checkbox = gridReference.instance.gridConfigurationHelper.getCheckbox($helper, sortedTableID);

            $overridedRowNext.addClass('override-border-top sortable-source');
            $overridedRowPrev.addClass('override-border-bottom');
            $sortedElement.data('overridedRowNext', $overridedRowNext);
            $sortedElement.data('overridedRowPrev', $overridedRowPrev);
            $draggableGridTable = $gridTable;
            sortableInitialized = true;

            //Update the style based on the specs
            if (!isMulitpleDrag) {
                /*
                 Have to update the visual style for the helper
                 We need to replace the checkbox with the icon(access or deny), so helper can indicate the change is valid or not
                 Thus, we need to save the original jquery object and we need to change back to the original checkbox after drops
                 */
                $helper.addClass("override-helper-style");
                $sortedElement.data('originalCheckbox', $checkbox.clone().html());
                $checkbox && $checkbox.html(gridReference.instance.render_template(gridReference.templates.gridSortableElement));
            } else {
                if (selectedRows.selectedRowsDom) {
                    var rows = selectedRows.selectedRowsDom;
                    for (var i = 0; i < rows.length; i++) {
                        var $row = rows[i];
                        if ($row.attr('id') !== rowId) {
                            $row.addClass('sortable-source');
                        }
                    }
                }
            }
            gridReference.method.updateDraggableElementClass(false);

            //after the callback is executed, the validation is returned
            if (isValidCallback) {
                if (_.isObject(isValidCallback) && !isValidCallback.isValid) {
                    var buildConfirmationDialog = new ConfirmationDialogBuilder(conf).showErrorMsg(isValidCallback.errorMessage);
                    $sortedElement.data('isStartSortableValid', false);
                    gridReference.method.updateDraggableElementClass(true);
                } else {
                    $sortedElement.data('isStartSortableValid', true);
                }
            } else {
                $sortedElement.data('isStartSortableValid', false);
                gridReference.method.updateDraggableElementClass(true);
            }
        };

        /**
         * Invoke row hoverDrop callback
         * @param {Object} event
         * @param {Object} droppable ui
         * @param {Object} hovered element
         * @param {Object} gridTable
         * @inner
         */
        var rowHoverDropEvent = function (e, draggableElement, $hoveredElement, $gridTable) {
            var isDraggableValid = draggableElement.draggable.data('isStartSortableValid'),
                isValidCallback = isDraggableValid ? true : false,
                $helper = draggableElement.helper;

            if (isDraggableValid && conf.elements.dragNDrop && conf.elements.dragNDrop.moveRow && conf.elements.dragNDrop.moveRow.hoverDrop) {
                var rowId = draggableElement.draggable[0].id,
                    sortableData = generateSortableData($gridTable),
                    options = {};

                options.data = sortableData && sortableData.sortableValues;
                options.draggableRows = sortableData && sortableData.sortableRows;
                options.helper = $helper;

                var $hoveredGridTable = $hoveredElement.parents('table'),
                    hoveredRowId = $hoveredElement.closest('tr').attr('id'),
                    rowData = gridReference.method.reformatRow($hoveredGridTable.jqGrid('getRowData', hoveredRowId));
                
                options.hoveredRow = {
                    rowData: rowData,
                    rawData: $hoveredElement.data('jqgrid.record_data') || {}
                };

                isValidCallback = conf.elements.dragNDrop.moveRow.hoverDrop(options);
            }
            !isValidCallback && gridReference.method.updateDraggableElementClass(true);
            draggableElement.draggable.data('isHoverValid', isValidCallback);
            draggableElement.draggable.data('helper', $helper);
        };

        /**
         * Generate sortable data for callbacks
         * @param {Object} gridTable
         * @return {Object} sortable data
         * @inner
         */
        var generateSortableData = function ($gridTable) {
            var sortableValues = selectedRows ? selectedRows.selectedRowIds : [],
                sortableRows = selectedRows.selectedRows,
                draggableRows = gridReference.instance.gridConfigurationHelper.getSelectedRowData(sortableRows, $gridTable);

            return {sortableValues: sortableValues, sortableRows: draggableRows};
        };
        
        /**
         * Change sortable event
         * @param {Object} event
         * @param {Object} sortable ui
         * @param {Object} sortable lib instance
         * @param {Object} gridTable
         * @inner
         */
        var rowAfterChangeEvent = function (e, sortedElement, $sortable, $gridTable) {
            var $sortedElement = sortedElement.item,
                isSortableValid = $sortedElement.data('isStartSortableValid'),
                isValidCallback = true,
                $prevRow = sortedElement.placeholder.prev(),
                $nextRow = sortedElement.placeholder.next();

            $nextRow.addClass('override-border-top');
            $prevRow.addClass('override-border-bottom');
            if ($sortedElement) {
                var $overridedRowNext = $sortedElement.data('overridedRowNext'),
                    $overridedRowPrev = $sortedElement.data('overridedRowPrev');

                $overridedRowNext && $overridedRowNext.removeClass("override-border-top");
                $overridedRowPrev && $overridedRowPrev.removeClass("override-border-bottom");

                if (isTreeGrid){
                    var isPrevRowCollapse = $prevRow.find('.treeclick.tree-plus').length == 1 ? true : false,
                        $nextVisibleRow = gridReference.instance.gridConfigurationHelper.getVisibleRow($nextRow, true),
                        $prevVisibleRow = gridReference.instance.gridConfigurationHelper.getVisibleRow($prevRow);
                    if ($prevRow.is(":visible") && isPrevRowCollapse && !$nextRow.is(":visible")){
                        $nextVisibleRow.before(sortedElement.placeholder.detach());
                    }
                    $sortedElement.data('overridedRowNext', $nextVisibleRow);
                    $sortedElement.data('overridedRowPrev', $prevVisibleRow);
                }else{
                    $sortedElement.data('overridedRowNext', $nextRow);
                    $sortedElement.data('overridedRowPrev', $prevRow);
                }
            }
            var data = generateSortableCallbackData(sortedElement, $gridTable, "afterChange");

            isValidCallback = isOrderChanged(data, sortedElement);
            if (conf.elements.dragNDrop && conf.elements.dragNDrop.moveRow && conf.elements.dragNDrop.moveRow.afterChange && isValidCallback) {
                isValidCallback = isSortableValid && conf.elements.dragNDrop.moveRow.afterChange(data);
                !isValidCallback && gridReference.method.updateDraggableElementClass(true);
            }

            $sortedElement.data('isChangeValid', isValidCallback);

            //Cached sortable elements so we can still have reference after losing the content
            sortedElementCached = data;
            sortedElementCached.sortedElement = $sortedElement;
        };

        /**
         * Invoke row afterDrop callback
         * @param {Object} event
         * @param {Object} sortable ui
         * @param {Object} sortable lib instance
         * @param {Object} gridTable
         * @inner
         */
        var rowAfterDropEvent = function (e, sortedElement, $sortable, $gridTable) {
            var isSortableValid = sortedElement.item.data('isStartSortableValid') && sortedElement.item.data('isHoverValid') && sortedElement.item.data('isChangeValid'),
                isValidCallback = true,
                $sortedElement = sortedElement.item,
                isSortableInDom = $sortedElement && $.contains($gridTable[0], $sortedElement[0]);
            sortableInitialized = false;
            if (!isSortAllowed) return;
            if (isSortableInDom) {
                var rowId = $sortedElement[0].id,
                    sortedTableID = $gridTable.attr('id'),
                    sortableData = generateSortableData($gridTable),
                    isMulitpleDrag = sortableData.sortableRows.length > 1,
                    $checkbox = gridReference.instance.gridConfigurationHelper.getCheckbox($sortedElement, sortedTableID),
                    $movedRow = $sortedElement.removeClass('override-helper-style').data('movedRow');

                if ($movedRow) {
                    $movedRow.remove();
                } else {
                    $gridTable.find('.sortable-source').removeClass("sortable-source");
                }
                $sortedElement.next().removeClass('override-border-top');
                if (sortedElementCached) {
                    $sortedElement.prev().removeClass('override-border-bottom');
                } else {
                    //Means the row order doesn't change
                    $sortedElement.removeClass('override-border-bottom');
                    $sortedElement.addClass('override-border-width');//overwrite sortable lib inline css
                }

                if (!isMulitpleDrag) {
                    $checkbox.html($sortedElement.data('originalCheckbox'));
                    $checkbox.find('input').prop('checked', true);
                }
            } else {
                $gridTable.find('.sortable-source').removeClass("sortable-source");
            }

            if (conf.elements.dragNDrop && conf.elements.dragNDrop.moveRow && conf.elements.dragNDrop.moveRow.afterDrop) {
                var data = generateSortableCallbackData(sortedElement, $gridTable, "afterDrop");
                data.updateRowVisualEffect = updateRowVisualEffect;

                isValidCallback = (isSortableValid !== false || !isSortableInDom) && sortedElementCached && isOrderChanged(data, sortedElement) && conf.elements.dragNDrop.moveRow.afterDrop(data);
            }

            sortedElementCached = null;
            //after the callback is executed, the validation is returned
            if (_.isObject(isValidCallback) && !isValidCallback.isValid) {
                $sortable.sortable('cancel');
                gridReference.method.updateDraggableElementClass(true);
                removeSortableSourceClass();
                var buildConfirmationDialog = new ConfirmationDialogBuilder(conf).showErrorMsg(isValidCallback.errorMessage);
            } else if (!isSortableValid || !isValidCallback) {
                $sortable.sortable('cancel');
                removeSortableSourceClass();
            } else {
                var reorderedData,
                    isMulitpleDrag = (data && data.draggableRows.length > 1);

                gridReference.method.clearAllSelection();
                gridReference.method.resetSelections($gridTable, true);
                if (isTreeGrid && data){
                    var currentParentRowId = originalRowData[rowId].parent,
                        newParentRowId = data.siblingRows.prevRow && gridReference.instance.treeGridHelper.getNewParentId($gridTable, data.siblingRows.prevRow.rawData, rowId, areSelectedRowsSiblings),
                        deletedRowIds = $.merge([], data.data),
                        moveToNewParent = (currentParentRowId != newParentRowId) ? true : false;

                    isExpanded = gridReference.instance.treeGridHelper.isRowExpanded($sortedElement);
                    if (isMulitpleDrag){
                        if (moveToNewParent){  
                            gridReference.instance.treeActions.reorderRowsToDiffParent($gridTable, rowId, deletedRowIds, isExpanded, newParentRowId, areSelectedRowsSiblings);                
                        }else{
                            //Only delete and add rows except for the current sortedRow. The current row is handled by sortable lib
                            deletedRowIds = _.without(deletedRowIds, rowId);

                            var updateVisualFunc = function($row){
                                $row.removeClass('sortable-source');
                            };
                            gridReference.instance.treeActions.reorderRowsInSameParent($gridTable, deletedRowIds, $sortedElement, updateVisualFunc);
                        }
                    }else if (!isMulitpleDrag && moveToNewParent){
                        gridReference.instance.treeActions.reorderRowsToDiffParent($gridTable, rowId, [rowId], false, newParentRowId, areSelectedRowsSiblings);
                    }
                }else{
                    if (isMulitpleDrag) {
                        if (conf.elements.dragNDrop && conf.elements.dragNDrop.moveRow && conf.elements.dragNDrop.moveRow.position) {
                            reorderedData = data.draggableRows.sort(
                                function (firstValue, secondValue) {
                                    var position = conf.elements.dragNDrop.moveRow.position;
                                    return secondValue.rawData[position] - firstValue.rawData[position];
                                });
                        } else {
                            reorderedData = data.draggableRows;
                        }
                        reorderedData.forEach(function (rowData) {
                            var raw_data = rowData.rawData,
                                rowId = raw_data[conf.elements.jsonId];
                            $gridTable.jqGrid('delRowData', rowId);

                            if (!_.isEmpty(data.siblingRows.prevRow.rawData) && rowId !== data.siblingRows.prevRow.rawData[conf.elements.jsonId]) {
                                gridReference.method.addNewRowData(rowId, raw_data, 'after', data.siblingRows.prevRow.rawData[conf.elements.jsonId]);
                            } else {
                                gridReference.method.addNewRowData(rowId, raw_data, 'first');
                            }
                        });
                    }
                }
                
                if (isTreeGrid){
                    //Only when triggerAfterDrop is true, then we update the row visual effect
                    triggerAfterDrop = true; 
                    if (!moveToNewParent || areSelectedRowsSiblings || !isMulitpleDrag){
                        updateRowVisualEffect(selectedRows['selectedRowIds']);
                    }
                }else if (!isTreeGrid){
                    updateRowVisualEffect(selectedRows['selectedRowIds']);
                }
            }
        };

        

        /**
         * Removes sortable source class
         * @inner
         */
        var removeSortableSourceClass = function () {
            selectedRows.selectedRowsDom.forEach(function (row) {
                row.removeClass('sortable-source');
            });
        };

        /**
         * Update visual effect for the sorted rows
         * @param {Array} rowIds
         * @inner
         */
        var updateRowVisualEffect = function (rowIds) {
            var toggleClassTimeout,
                toggleClass = function () {
                    rowIds.forEach(function (id) {
                        if ($draggableGridTable) {
                            var $row = $draggableGridTable.find("#" + id);

                            if ($row.hasClass('sortable-success')) {
                                $row.removeClass('sortable-success override-border-top override-border-bottom');
                                $row.prev().removeClass('override-border-bottom');
                            } else {
                                $row.addClass('sortable-success').removeClass('override-border-bottom override-border-top');
                                $row.prev().addClass('override-border-bottom');
                            }
                        }
                    });
                    triggerAfterDrop = null;
                    toggleClassTimeout && clearTimeout(toggleClassTimeout);
                };
            toggleClass();
            toggleClassTimeout = setTimeout(toggleClass, 3000);
        };

        /**
         * Generate sortable callback data
         * @param {Object} sortable ui
         * @param {Object} gridTable
         * @param {String} callbackName
         * @inner
         */
        var generateSortableCallbackData = function (sortedElement, $gridTable, callbackName) {
            var rowId = sortedElement.item[0].id,
                $row = $gridTable.find('#' + rowId),
                sortableData = generateSortableData($gridTable),
                $helper = sortedElement.item.data('helper'),
                $placeholder = $gridTable.find('.ui-sortable-placeholder'),
                $currentRow = callbackName === "afterChange" ? $placeholder : $row, //On change event, the placeholder will display the current position so we use it to look for its previous and next row
                $prevRow = $currentRow.prev(),
                $nextRow = $currentRow.next(),
                prevRowId,
                nextRowId,
                siblingRows = {},
                options = {},
                nextRowData,
                prevRowData;

            if (callbackName === "afterChange") {
                //When the placeholder is $preRow, then we should look for its previous row.
                if ($prevRow && $prevRow.hasClass('ui-sortable-helper')) {
                    prevRowId = $prevRow.prev().attr('id');
                } else {
                    prevRowId = $prevRow.attr('id');
                }

                if ($nextRow){
                    nextRowData = {
                        rowData: gridReference.method.reformatRow($gridTable.jqGrid('getRowData', nextRowId)),
                        rawData: $nextRow.data('jqgrid.record_data') || {}
                    };
                }
                
                if ($prevRow){
                    prevRowData = {
                        rowData: gridReference.method.reformatRow($gridTable.jqGrid('getRowData', prevRowId)),
                        rawData: $prevRow.data('jqgrid.record_data') || {}
                    };
                }

                siblingRows.nextRow = nextRowData;
                siblingRows.prevRow = prevRowData;
            } else {
                siblingRows = sortedElementCached && sortedElementCached.siblingRows;
            }

            options.data = sortableData && sortableData.sortableValues;
            options.draggableRows = sortableData && sortableData.sortableRows;
            options.helper = $helper;
            options.siblingRows = siblingRows;

            return options;
        };

        var isOrderChanged = function (data, sortedElement) {
            var isOrderChanged = true,
                $sortedElement = sortedElement.item,
                $orgNextRow = $sortedElement.next(),
                $nextRow = sortedElement.placeholder.next(),
                $prevRow = sortedElement.placeholder.prev(),
                rowEqualsPrevRow = (data.siblingRows && !data.siblingRows.prevRow && $prevRow.length === 1 && $prevRow.attr('id') === $sortedElement.attr('id')) ? true : false,
                rowEqualsNextRow = ($nextRow.length === 1 && $orgNextRow.length === 1 && $nextRow.attr('id') === $orgNextRow.attr('id')) ? true : false;
            if ( rowEqualsPrevRow || rowEqualsNextRow || $prevRow.hasClass('sortable-source')) {
                isOrderChanged = false;
            }
            return isOrderChanged;
        };
    };

    return RowDragNDrop;
});