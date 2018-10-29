/**
 * A module that adds multiselection to a cell
 *
 * @module MultiselectCell
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
    'widgets/grid/lib/multiselectCellFooter'
], function (MultiselectCellFooter) {

    /**
     * MultiselectCell constructor
     *
     * @constructor
     * @class MultiselectCell - Add multiselection to a cell
     *
     * @param {Object} conf - Grid configuration
     * @param {Object} gridReference - Reference to some instances like the gridConfigurationHelper and the tooltipBuilder
     * @param {Object} templates - Grid templates
     * @param {Object} gridContainer - jQuery Object for the grid container
     * @returns {Object} Current MultiselectCell's object: this
     */
    var MultiselectCell = function (conf, gridReference, templates, gridContainer) {

        var multiselectCellFooter = new MultiselectCellFooter(templates, gridReference.instance.tooltipBuilder, gridContainer),
            $gridTable,
            self = this;

        this.init = function ($table) {
            $gridTable = $table;
            bindHoverCell();
            multiselectCellFooter.bindMultiselectCellFooterEvents($gridTable);
        };

        /**
         * Bind row mouseleave and mouseenter events
         * mouseleave event triggers slipstreamGrid.row:mouseleave
         * mouseenter event triggers slipstreamGrid.row:mouseenter
         * @param {Object} $gridTable
         */
        var bindHoverCell = function () {
            // Cell item click (and hotkey + click) handler.
            $gridTable.on("click", ".cellExpandWrapper .multiselect-cell-checkbox", function (evt) {
                var hotKey;
                if (evt.ctrlKey || evt.metaKey || evt.shiftKey) {
                    hotKey = {
                        ctrlKey: evt.ctrlKey,
                        metaKey: evt.metaKey,
                        shiftKey: evt.shiftKey
                    }
                }
                self.cellItemSelect($(evt.target), $gridTable, hotKey);
            });

            //The following events are related to update hover style
            $gridTable.on("mouseenter", ".cellExpandWrapper .cellItem", function () {
                var $hoveredElement = $(this);
                $hoveredElement.addClass("multiselect-item");
                !$hoveredElement.parents('td').hasClass('droppable-hover') && $hoveredElement.parents('td').addClass("override-hover");
            });
            $gridTable.on("mouseleave", ".cellExpandWrapper .cellItem", function () {
                $(this).removeClass("multiselect-item");
            });
            $gridTable.on("mouseenter", ".multiselect_cell", function () {
                var $hoveredElement = $(this),
                    $cellExpandElement = $hoveredElement.find('.cellExpandWrapper');
                if (_.isElement($cellExpandElement[0]) && $cellExpandElement.is(':visible')) {
                    $hoveredElement.addClass("override-hover");
                    $hoveredElement.find('input').addClass("showCheckbox");
                } else if ($hoveredElement.hasClass('droppable-hover')) {
                    $hoveredElement.addClass("override-hover");
                }
                $hoveredElement.parents('tr').find('td:first-child').addClass('override-row-hover');
            });
            $gridTable.on("mouseleave", ".multiselect_cell", function () {
                var $hoveredElement = $(this);
                var $cellItemCheckbox = $(this).removeClass("override-hover").find('input');
                if (!$cellItemCheckbox.is(':checked')) {
                    $cellItemCheckbox.removeClass("showCheckbox");
                }
                $hoveredElement.parents('tr').find('td:first-child').removeClass('override-row-hover');
            });

            //Unselect all checkbox when cell goes into edit mode and update the footer
            $gridTable.on("slipstreamGrid.row:editMode", function (evt, cell) {
                self.cellItemSelect($(cell), $gridTable);
            });

            //Deselect previously selected cell items when a different row is selected
            $gridTable.on("gridOnRowSelection", function (evt, selectedRowsObj) {
                var $prevSelectedCellItemWrapper = $gridTable.find('.selected-cell-item'),
                    $cellItemRow;

                if ($prevSelectedCellItemWrapper.length) {
                    $cellItemRow = $prevSelectedCellItemWrapper.closest("tr");
                    if (selectedRowsObj.numberOfSelectedRows == 1) {
                        if ($cellItemRow.attr("id") != selectedRowsObj.selectedRowIds[0]) {
                            removeItemSelection($prevSelectedCellItemWrapper, $gridTable);
                        } else {
                            console.log("row with id: " + selectedRowsObj.selectedRowIds[0] + " has items selected");
                        }
                    } else if (selectedRowsObj.numberOfSelectedRows > 1) {
                        removeItemSelection($prevSelectedCellItemWrapper, $gridTable);
                    }
                }
            });
        };

        /**
         * Removes selection for the cell items for the provided container (.selected-cell-item) and triggers the update for the slipstreamGrid.multiselectCell:cellItemSelected event
         * @param  {object} $selectedCellItemWrapper jQuery object that corresponds to the .selected-cell-item container
         * @param  {object} $gridTable jQuery object that corresponds to the grid table
         * @inner
         */
        var removeItemSelection = function ($selectedCellItemWrapper, $gridTable) {
            $selectedCellItemWrapper.removeClass('selected-cell-item');
            $selectedCellItemWrapper.find('.multiselect-cell-checkbox').prop('checked', false).removeClass("showCheckbox");
            $gridTable.trigger('slipstreamGrid.multiselectCell:cellItemSelected', {
                numberOfCellItems: 0,
                numberOfSelectedCellItems: 0,
                columnName: undefined,
                cellContainer: undefined
            });
        };

        /**
         * Method called by gridWidget when a cell item is selected with Ctrl / Cmd / Shift Key
         * @param  {object} e          click event passed from gridWidget
         * @param  {object} $gridTable jQuery object of the grid
         * @param  {object} $cell      jQuery object of the dNd cell
         */
        this.selectCellsWithHotKey = function (e, $gridTable, $cell) {
            var hotKey = {
                ctrlKey: e.ctrlKey,
                metaKey: e.metaKey,
                shiftKey: e.shiftKey
            };
            self.cellItemSelect($(e.target), $gridTable, hotKey);
        };

        /**
         * Selects cell items that are in the path of a previously selected cell item and currently selected cell item. Used with shift + click
         * @param  {object} $cellWrapper      jQuery object that corresponds to the draggable cell wrapper
         * @param  {object} $checkBox         jQuery object that corresponds to the current selected check box
         * @param  {[type]} $lastSelectedItem jQuery object that corresponds to the previously selected check box
         * @inner
         */
        var selectMultipleItemsWithShift = function ($cellWrapper, $checkBox, $lastSelectedItem) {
            var $cellCheckBoxes = $cellWrapper.find('.multiselect-cell-checkbox');
            var currentCheckboxIndex = $cellCheckBoxes.index($checkBox);
            var lastCheckboxIndex = $cellCheckBoxes.index($lastSelectedItem);
            var startIndex = (currentCheckboxIndex > lastCheckboxIndex) ? lastCheckboxIndex : currentCheckboxIndex;
            var endIndex = (currentCheckboxIndex > lastCheckboxIndex) ? currentCheckboxIndex : lastCheckboxIndex;
            $cellCheckBoxes.slice(startIndex, endIndex).prop('checked', true);
        };

        /**
         *  Adds cell item selection interaction
         * @param  {object} $elem      jQuery object corresponding to the cell item checkbox
         * @param  {object} $gridTable jQuery object corresponding to the grid
         * @param  {object} hotKey     object that contains event hotKey (ctrl; mac-comman; shift) boolean values
         */
        this.cellItemSelect = function ($elem, $gridTable, hotKey) {
            var targetIsCheckbox = $elem.hasClass('multiselect-cell-checkbox');
            var $checkBox = (targetIsCheckbox) ? $elem : $elem.find('.multiselect-cell-checkbox');
            var $cellWrapper = $checkBox.closest('td');
            var cellColumnName;

            if ($cellWrapper.length > 0) {
                cellColumnName = gridReference.instance.gridConfigurationHelper.getColumnName($cellWrapper, $gridTable.prop('id'));
            }

            if (!targetIsCheckbox && hotKey) {
                $checkBox.is(':checked') ? $checkBox.prop('checked', false) : $checkBox.prop('checked', true)
            }

            if ($checkBox.is(':checked')) {
                // Keep a record of the most recent selected checkbox and previsouly selected checkbox to allow (Shift + Click) select consecutive items
                var $lastSelectedItem = $cellWrapper.find('.last-selected-item-checkbox');
                if (hotKey && hotKey.shiftKey) {
                    selectMultipleItemsWithShift($cellWrapper, $checkBox, $lastSelectedItem);
                }
                $lastSelectedItem.removeClass('last-selected-item-checkbox');
                $checkBox.addClass('last-selected-item-checkbox');
            }else{
                $checkBox.removeClass('last-selected-item-checkbox');
            }

            // Keep record of the cell wrapper that has cell items selected. This is used to determine whether previous selections need to be removed or retained
            if (!$cellWrapper.hasClass('selected-cell-item')) {
                var $prevSelectedCellItemWrapper = $gridTable.find('.selected-cell-item');
                $prevSelectedCellItemWrapper.removeClass('selected-cell-item');
                $prevSelectedCellItemWrapper.find('.multiselect-cell-checkbox').prop('checked', false).removeClass("showCheckbox last-selected-item-checkbox");
                $cellWrapper.addClass('selected-cell-item');
            }

            var cellCheckEventObj = {
                numberOfCellItems: $cellWrapper.find('.multiselect-cell-checkbox').length,
                numberOfSelectedCellItems: $cellWrapper.find('.multiselect-cell-checkbox:checked').length,
                columnName: cellColumnName,
                cellContainer: $cellWrapper
            };

            $gridTable.trigger('slipstreamGrid.multiselectCell:cellItemSelected', cellCheckEventObj);
        };

        /**
         * Gets the selected items in a cell
         * @param {Object} $cell - jQuery Object of the cell that contains selected items
         * @inner
         */
        this.getSelectedCellItems = function ($cell) {
            if ($cell.is("td")) {
                var $cellExpandElement = $cell.find('.cellExpandWrapper'),
                    draggableItems = [];

                if (_.isElement($cellExpandElement[0])){
                    var $draggableItems = $cell.find(".cellExpandWrapper input:checked").parents('.cellItem');
                    for (var i = $draggableItems.length - 1; i >= 0; i--) {
                        draggableItems.push($draggableItems[i]);
                    }
                }
                return draggableItems;
            }
        };

        /**
         * Gets the selected item value in a cell
         * @param {Object} $cell - jQuery Object of the cell that contains selected items
         * @returns {Array} selected item value
         */
        this.getSelectedCellItemValue = function ($cell) {
            var selectedItemValue = [],
                selectedItems = this.getSelectedCellItems($cell);
            selectedItems.forEach(function(item){
                selectedItemValue.push(item.textContent);
            });
            return selectedItemValue;
        };


        /**
         * Check if the cellItem element has multiselection
         * @param {object} $elem
         * @returns {boolean}
         */
        this.isMultiselectCell = function ($elem) {
            if ($elem.hasClass("multiselect-cell-checkbox") || $elem.find(".multiselect-cell-checkbox").length) {
                return true;
            }
            return false;
        };

        /**
         * Check if the element is cellItem 
         * @param {object} $elem
         * @returns {boolean}
         */
        this.isCellItem = function ($elem) {
            return $elem.hasClass("cellItem");
        };
    };

    return MultiselectCell;
});