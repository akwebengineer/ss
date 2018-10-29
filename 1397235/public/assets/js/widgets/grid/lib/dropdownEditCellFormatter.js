/**
 * A module that provides the cell formatter and unformat callbacks required to render a cell using the dropdown type of the editCell property defined in its column configuration
 *
 * @module DropdownEditCellFormatter
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([], /* @lends DropdownEditCellFormatter */
    function () {

        /**
         * DropdownEditCellFormatter constructor
         *
         * @constructor
         * @class DropdownEditCellFormatter - Formats the cells that are of the dropdown type
         *
         * @param {Object} gridConfigurationHelper - GridConfigurationHelper instance
         * @param {Object} dropdownEditBuilder - DropdownEditBuilder instance
         * @returns {Object} Current DropdownEditCellFormatter's object: this
         */
        var DropdownEditCellFormatter = function (gridConfigurationHelper, dropdownEditBuilder) {

            /**
             * Gets the formatter required to edit a dropdown type of the editCell property defined in its column configuration
             * @param {Object} originalColumn - column configuration, as defined in the grid widget configuration (elements.columns)
             */
            this.getEditFormatter = function (originalColumn) {
                var editObj = {
                    "editable": true,
                    "edittype": "custom",
                    "editoptions": {
                        "custom_element": getCustomEditionCell,
                        "custom_value": getCustomEditionValue
                    }
                };
                dropdownEditBuilder.setDropdownHash(originalColumn.name); //initializes dropdown cell
                return editObj;
            };

            /*
             * Defines the html element that will be used to edit a cell and that is available only for dropdown type of the editCell property
             * @inner
             */
            var getCustomEditionCell = function (cellvalue, options) {
                var cell = dropdownEditBuilder.setDropdown([cellvalue], options.name, this);
                return cell;
            };

            /*
             * Defines the value that will be returned after a dropdown is edited.
             * @inner
             */
            var getCustomEditionValue = function ($elem, operation) {
                if (operation === 'get' && _.isElement($elem[0])) {
                    return dropdownEditBuilder.getDropdown($elem);
                }
                return $elem;
            };

        };

        return DropdownEditCellFormatter;
    });