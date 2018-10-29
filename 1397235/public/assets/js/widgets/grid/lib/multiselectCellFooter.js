/**
 * A module that creates a footer for the multiselect selection on a on cell
 *
 * @module MultiselectCellFooter
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'lib/template_renderer/template_renderer',
    'widgets/grid/conf/i18nGridConfiguration'
], /** @lends MultiselectCellFooter */
    function (render_template, i18nGridConfiguration) {

    /**
     * MultiselectCellFooter constructor
     *
     * @constructor
     * @class MultiselectCellFooter - Creates drag and drop footer on cell selection
     * @param {Object} - The object of gridTemplates
     * @param {object} tooltipBuilder - The object of TooltipBuilder which is created in gridWidget
     * @param {object} gridContainer - The object of gridContainer
     * @returns {Object} Current MultiselectCellFooter's object: this
     * @inner
     */
    var MultiselectCellFooter = function (templates, tooltipBuilder, gridContainer) {

        var multiselectCellFooterTemplate = render_template(templates.multiselectCellFooterContainer, i18nGridConfiguration.multiselectCellFooter),
            $multiselectCellFooter, $gridTableFooter;

        /**
         * Removes cell multiselect footer from grid and shows actual grid footer.
         * @inner
         */
        var removeMultiselectCellFooter = function () {

            if ($multiselectCellFooter && $multiselectCellFooter.length > 0) {
                $multiselectCellFooter.fadeOut('fast', function () {
                    $(this).next().fadeIn('fast');
                });
                var infoTooltip = $multiselectCellFooter.find(".multiselectCellFooter_info");
                if (infoTooltip.hasClass('tooltipstered')) {
                    infoTooltip.tooltipster('hide');
                }
            }

        };

        /**
         * Creates cell multiselect footer on Grid and hides the actual grid footer.
         * @inner
         */
        var createMultiselectCellFooter = function () {
            $gridTableFooter = gridContainer.find('.gridTableFooter');
            $gridTableFooter.hide();
            if ($multiselectCellFooter) {
                $multiselectCellFooter.fadeIn("slow");
            }
            else {
                $multiselectCellFooter = $(multiselectCellFooterTemplate).hide().insertBefore($gridTableFooter).fadeIn("fast");
                var infoTooltip = $multiselectCellFooter.find(".multiselectCellFooter_info");
                tooltipBuilder.multiselectCellFooterTooltip(infoTooltip);
                //show info tooltip when the MultiselectCell footer is created for the first time
                infoTooltip.tooltipster('show');
            }

        };

        /**
         * Updates cell multiselect footer with cell information
         * @param {Number} numberOfCellItems - total number of items in the cell
         * @param {Number} numberOfSelectedCellItems - number of items selected in the cell
         * @param {String} columnName - name of the selected cell's column
         * @inner
         *
         */
        var updateMultiselectCellFooter = function (numberOfCellItems, numberOfSelectedCellItems, columnName) {
            if ($multiselectCellFooter) {
                $multiselectCellFooter.find('.totalRows').text(numberOfCellItems);
                $multiselectCellFooter.find('.columnName').text(columnName);
                $multiselectCellFooter.find('.selectedRows').text(numberOfSelectedCellItems);
            }
        };

        /**
         * Bind cell multiselect footer events
         * @param {Object} gridTable
         */
        this.bindMultiselectCellFooterEvents = function ($gridTable) {

            $gridTable.on("slipstreamGrid.multiselectCell:cellItemSelected", function (evt, cellObj) {

                //if no checkbox is selected remove the MultiselectCell footer.
                if (cellObj.numberOfSelectedCellItems === 0) {
                    removeMultiselectCellFooter();
                }
                else {

                    if (cellObj.numberOfSelectedCellItems === 1 && (!$multiselectCellFooter || ($multiselectCellFooter && $multiselectCellFooter.css('display') == "none"))) {
                        createMultiselectCellFooter();
                    }

                    updateMultiselectCellFooter(cellObj.numberOfCellItems, cellObj.numberOfSelectedCellItems, cellObj.columnName);

                    if ($multiselectCellFooter) {
                        //bind MultiselectCell footer to listen for click event on select all button
                        $multiselectCellFooter.find('.selectAll').off('click.dnd').on('click.dnd', function () {
                            cellObj.cellContainer.find('.multiselect-cell-checkbox').prop('checked', true);
                            updateMultiselectCellFooter(cellObj.numberOfCellItems, cellObj.numberOfCellItems, cellObj.columnName);
                        });

                        //bind MultiselectCell footer to listen for click event on deselect all button
                        $multiselectCellFooter.find('.deselectAll').off('click.dnd').on('click.dnd', function () {
                            cellObj.cellContainer.find('.multiselect-cell-checkbox').prop('checked', false);
                            removeMultiselectCellFooter();
                        });
                    }
                }

            });

        };

    };

    return MultiselectCellFooter;
});
