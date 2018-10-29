/**
 * A module that adds a inline edition mode for a row
 *
 * @module InlineEditRow
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
], /** @lends InlineEditRow */
function () {

    /**
     * InlineEditRow constructor
     *
     * @constructor
     * @class InlineEditRow - Adds inline edition mode for a row
     *
     * @param {Object} templates - GridTemplates instance
     * @param {Object} actionBuilder - ActionBuilder instance
     * @returns {Object} Current InlineEditRow's object: this
     */
    var InlineEditRow = function (templates, actionBuilder) {

        /**
         * Builds the InlineEditRow
         * @returns {Object} Current "this" of the class
         */

        var self = this,
            CONTAINER_BORDER = 2,// offset because of borders
            $gridContainer, containers, saveButtonOverlayContainers, containersSize;

        /**
         * Initializes the InlineEditRow class
         * @param {Object} gridContainer - jQuery DOM Object with the grid container
         * @param {Object} containersObj - hash table with containers used in the grid
         */
        this.init = function (gridContainer, containersObj) {
            $gridContainer = gridContainer;
            containers = containersObj;
            setSaveButtonOverlay();
        };

        /**
         * Sets the the save button overlay
         * @inner
         */
        var setSaveButtonOverlay = function () {
            $gridContainer.find(".jqgrid-overlay").before(templates.inlineSaveOverlay);
            saveButtonOverlayContainers = {
                "$gridContent": $gridContainer.find(".ui-jqgrid-bdiv").eq(0),
                "$topOverlay": $gridContainer.find(".save-overlay.top"),
                "$bottomOverlay": $gridContainer.find(".save-overlay.bottom")
            };
        };

        /**
         * Adds the the save button overlay to recreate an inline edition mode on a row
         * @param {Object} $row - jQuery Object with the row that needs to be saved.
         * @param {Object} $rowTable - jQuery Object with the grid of the row that needs to be saved.
         * @param {boolean} isAddLast - indicates if the overlay is added after adding a row at the end of a grid, in this case, jqgrid does not locate the row on the right position until the callback returns, so a reference to the latest row is needed instead.
         */
        this.addSaveButtonOverlay = function ($row, $rowTable, isAddLast) {
            var gridHeaderY = containers.$header.outerHeight(true),
                gridContentY = saveButtonOverlayContainers.$gridContent.offset().top,
                isMultiRowsGrid = saveButtonOverlayContainers.$gridContent.find("tr[role=row]:not('.jqgfirstrow')").length > 1,
                rowY = $row.offset().top,
                rowHeight = $row.height(),
                topOverlayY = rowY - gridContentY,
                bottomOverlayY = topOverlayY + rowHeight + gridHeaderY + CONTAINER_BORDER,
                lastRowY = saveButtonOverlayContainers.$gridContent.height() - rowHeight - CONTAINER_BORDER;
            saveButtonOverlayContainers.$topOverlay.css({
                "top": gridHeaderY,
                "height": isAddLast ? lastRowY : topOverlayY
            });
            saveButtonOverlayContainers.$bottomOverlay.css({
                "top": bottomOverlayY
            });
            var bottomOverlayHeight = saveButtonOverlayContainers.$bottomOverlay.height(),
                saveButtonHeight = saveButtonOverlayContainers.$saveCancel.height(),
                saveButtonY;
            if (isMultiRowsGrid) {
                saveButtonOverlayContainers.$gridContent.removeClass("oneInlineRow");
                saveButtonY = bottomOverlayHeight > saveButtonHeight ? topOverlayY + rowHeight + 1 : topOverlayY - saveButtonHeight;
                saveButtonY += saveButtonOverlayContainers.$gridContent.scrollTop(); //offset from scrolling
            } else {
                saveButtonOverlayContainers.$gridContent.addClass("oneInlineRow");
                saveButtonY = gridHeaderY - saveButtonHeight;
            }
            saveButtonOverlayContainers.$saveCancel.css({
                "top": saveButtonY,
                "left": getSaveCancelLeftOffset($rowTable)
            });
        };

        /**
         * Calculate the left position of the save button during scrolling
         * @param {Object} $rowTable - jQuery Object with the grid of the row that needs to be saved.
         */
        var getSaveCancelLeftOffset = function ($rowTable) {
            if (_.isUndefined(containersSize)) {
                containersSize = {
                    rowTableWidth: $rowTable.width(),
                    saveCancelWidth: saveButtonOverlayContainers.$saveCancel.width() + CONTAINER_BORDER
                }
            }
            containersSize.gridContentWidth = saveButtonOverlayContainers.$gridContent.width(); //recalculated in case grid got resized

            var saveButtonX = containersSize.gridContentWidth - containersSize.saveCancelWidth,
                saveButtonScrollX = saveButtonX + saveButtonOverlayContainers.$gridContent.scrollLeft();
            if (saveButtonScrollX > containersSize.rowTableWidth) {
                saveButtonScrollX = containersSize.rowTableWidth - saveButtonX;
            }
            return saveButtonScrollX;
        };

        /**
         * Adds a save container area composed by the save and discard icons.
         * @param {Object} $row - jQuery Object with the row that needs to be saved.
         * @param {Object} $rowTable - jQuery Object with the grid of the row that needs to be saved.
         * @param {string} operation - Type of operation performed in the row: edit, paste or add.
         * @param {function} isValidUpdatedRow - grid widget callback to check is if a row valid to be updated
         * @param {function} saveRow - grid widget callback to save a row
         * @param {function} cancelRow - grid widget callback to cancel a row update/creation
         * @param {boolean} isAddLast - indicates if the overlay is added after adding a row at the end of a grid
         */
        this.addSaveButton = function ($row, $rowTable, operation, isValidUpdatedRow, saveRow, cancelRow, isAddLast) {
            var rowId = $row.attr("id");

            actionBuilder && actionBuilder.removeRowHoverMenu($row);

            $gridContainer.attr("data-grid-on-edit-mode", true);

            saveButtonOverlayContainers.$saveCancel = $row.append(templates.inlineSave).find(".save-cancel-inline-row");
            this.addSaveButtonOverlay($row, $rowTable, isAddLast);

            saveButtonOverlayContainers.$saveCancel.find('.save-inline-row').off().on('click', function (e) {
                var isValid = isValidUpdatedRow(rowId);
                isValid && saveRow();
            });

            saveButtonOverlayContainers.$saveCancel.find('.cancel-inline-row').off().on('click', function (e) {
                self.removeSaveButton();
                cancelRow($rowTable, rowId, operation);
            });

            saveButtonOverlayContainers.$gridContent.scroll(function () {
                saveButtonOverlayContainers.$saveCancel.css('left', getSaveCancelLeftOffset($rowTable));
            });

        };

        /**
         * Removes the edition mode of a row
         */
        this.removeSaveButton = function () {
            $gridContainer.removeAttr("data-grid-on-edit-mode");
            saveButtonOverlayContainers.$topOverlay.removeAttr("style");
            saveButtonOverlayContainers.$bottomOverlay.removeAttr("style");
            saveButtonOverlayContainers.$saveCancel.remove();
            saveButtonOverlayContainers.$gridContent.off("scroll");
        };

    };

    return InlineEditRow;
});