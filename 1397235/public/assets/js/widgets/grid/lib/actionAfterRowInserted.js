/**
 * A module used carry out operations right after a row inserted
 *
 * @module actionAfterRowInserted
 * @author Swena Gupta <gswena@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([],  /** @lends actionAfterRowInserted */
function() {

    /**
     * actionAfterRowInserted constructor
     *
     * @constructor
     * @class ActionAfterRowInserted - carries out operations right after a row inserted.
     * @returns {Object} Current ActionAfterRowInserted's object: this
     */
    var ActionAfterRowInserted = function(conf){
        /**
         * Builds the ActionAfterRowInserted
         * @param {Object} Grid Configuration
         * @returns {Object} Current "this" of the class
         */

        /**
         * Stamps the row with the row number count
         * @param {Object} $gridTable - Grid Table container
         * @param {Number} rowNumberCount - current value of counter for rows
         * @param {Object} $row - optional for tree grid, id of the row to stamp on
         * @return rowNumberCount - updated row number count
         */
        this.stampRowIndex = function($gridTable, rowNumberCount, $row) {
            if(conf.elements.tree) {
                if($row) {
                    rowNumberCount++;
                    $row.data("rowIndexNumber", rowNumberCount);
                } else {
                    var $rows = $gridTable.find('tr.jqgrow');
                    for(var i=0;i<$rows.length;i++) { //We cannot use the lastSelectedRows.rowsInDom as it has sorted row ids
                        var $row = $rows.eq(i);
                        rowNumberCount++;
                        $row.data("rowIndexNumber", rowNumberCount);
                    }
                }
            } else {
                var gridParams = $gridTable.jqGrid("getGridParam");
                var rowId = $row.attr("id");
                rowNumberCount++;
                var actualRowIndex = ((gridParams.page - 1) * gridParams.rowNum) + rowNumberCount;
                $row.data("rowIndexNumber", actualRowIndex);
                if(actualRowIndex == 1) {
                    $gridTable.jqGrid("setGridParam", {"firstRowId":rowId});
                }
            }
            return rowNumberCount;
        }
    };

    return ActionAfterRowInserted;
});