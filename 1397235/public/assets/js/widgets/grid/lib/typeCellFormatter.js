/**
 * A module that provides the cell formatter and unformat callbacks required to render a cell using the groupContent style
 *
 * @module TypeCellFormatter
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define(['lib/template_renderer/template_renderer',
        'lib/dateFormatter/dateFormatter'
    ], /* @lends TypeCellFormatter */
    function (render_template, dateFormatter) {

        /**
         * TypeCellFormatter constructor
         *
         * @constructor
         * @class TypeCellFormatter - Formats the cells that are of the groupContent type
         *
         * @param {Object} templates - grid templates
         * @param {Class} baseContentCellFormatter
         * @param {string} type - type of cell
         * @returns {Object} Current TypeCellFormatter's object: this
         */
        var TypeCellFormatter = function (templates, baseContentCellFormatter, type) {
            var viewType = type; //sets default row width per column

            /*
             * Custom formatter to update the content of a cell as per its view type; for example, date type
             * @param {Object} cellValue - value of the cell
             * @param {Object} options - configuration of the column of the cell and tableId, rowId
             * @param {Object} rowObject - original value of the cell
             * @returns {string} html for group content cell
             */
            this.format = function (cellValue, options, rowObject) {
                if (_.isEmpty(cellValue) && !_.isNumber(cellValue)) {
                    var defaultEmptyColumnTemplates = baseContentCellFormatter.getEmptyColumnTemplates();
                    return defaultEmptyColumnTemplates[options.colModel.name];
                } else {
                    switch (viewType) {
                        case "date":
                            return formatDate(cellValue, options, rowObject);
                        default:
                            return cellValue;
                    }
                }
            };

            /*
             * Custom formatter to update the content of a cell that is a date type
             * @param {Object} cellValue - value of the cell
             * @param {Object} options - configuration of the column of the cell and tableId, rowId
             * @param {Object} rowObject - original value of the cell
             * @returns {string} html for the date type cell
             * @inner
             */
            var formatDate = function (cellValue, options, rowObject) {
                var cellHtml = render_template(templates.dateCell, {
                    "original-date": cellValue,
                    "long-date": dateFormatter.format(new Date(cellValue), {format: "long", options: {seconds: true}}),
                    "short-date": dateFormatter.format(new Date(cellValue), {format: "short", options: {seconds: true}})
                });
                return cellHtml;
            };

            /*
             * Custom function to restore the value of the cell before it was formatted by collapseContent function
             * @param {Object} cellValue - value of the cell
             * @param {Object} options - configuration of the column of the cell and tableId and rowId
             * @param {Object} htmlCell - html assigned to the cell
             * @returns {Object} new html of the cell
             */
            this.unformat = function (cellValue, options, htmlCell) {
                var $cell = $(htmlCell);
                if (baseContentCellFormatter.isEmptyCell($cell)) {//empty cell case
                    return "";
                } else {
                    $cell = $cell.find("[data-view-type]");
                    switch (viewType) {
                        case "date":
                            return unformatDate(cellValue, options, htmlCell, $cell);
                        default:
                            return cellValue;
                    }
                }
            };

            /*
             * Custom function to restore the value of the cell before it was formatted by collapseContent function
             * @param {Object} cellValue - value of the cell
             * @param {Object} options - configuration of the column of the cell and tableId and rowId
             * @param {Object} htmlCell - html assigned to the cell
             * @param {Object} $cell - jQuery object  value of the cell
             * @returns {Object} value of the cell
             */
            var unformatDate = function (cellValue, options, htmlCell, $cell) {
                return $cell.attr("data-date-value");
            };

        };

        return TypeCellFormatter;
    });