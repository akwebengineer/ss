/**
 * A module that collapse or expand the row parent in a grid that has hierarchy like the tree grid, group grid and nested grid
 *
 * @module RowParentToggler
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([], /** @lends RowParentToggler*/
function () {

    var RowParentToggler = function (conf) {
        /**
         * RowParentToggler constructor
         *
         * @constructor
         * @class RowParentToggler- Collapse or expand row parent for tree grid, group grid and nested grid
         * @param {Object} conf - Grid configuration
         * @returns {Object} Current RowParentToggler's object: this
         */

        /**
         * Gets the carat selector depending of the type of grid
         */
        var caratSelector = function () {
                var rowSelector = "tr[role='row'] .ui-icon",
                    carat;
                if (conf.elements.tree) {
                    carat = {
                        "closed": rowSelector + ".tree-plus",
                        "opened": rowSelector + ".tree-minus"
                    }
                } else if (conf.elements.subGrid) {
                    carat = {
                        "closed": rowSelector + ".ui-icon-plus",
                        "opened": rowSelector + ".ui-icon-minus"
                    }
                } else if (conf.elements.grouping) {
                    carat = {
                        "closed": rowSelector + ".ui-icon-circlesmall-plus",
                        "opened": rowSelector + ".ui-icon-circlesmall-minus"
                    }
                }
                return carat;
            }(),
            errorMessage = "Expand or Collapse option is only available for tree, nested and group grids";

        /**
         * Expands all parents in a grid
         * @param {Object} $gridTable - jQuery Object with the grid table
         */
        this.expandAllParentRows = function ($gridTable) {
            if (caratSelector) {
                $gridTable.find(caratSelector.closed).trigger("click");
            } else {
                console.log(errorMessage);
            }
        };

        /**
         * Collapses all parents in a grid
         * @param {Object} $gridTable - jQuery Object with the grid table
         */
        this.collapseAllParentRows = function ($gridTable) {
            if (caratSelector) {
                $gridTable.find(caratSelector.opened).trigger("click");
            } else {
                console.log(errorMessage);
            }
        };

    };

    return RowParentToggler;
});