/**
 * A module contains the methods related to tree grid actions, for example, CRUD actions
 *
 * @module TreeActions
 * @author Eva Wang<iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
],  /** @lends TreeActions */
    function() {

    /**
     * TreeActions constructor
     *
     * @returns {Object} Current TreeActions's object: this
     */
    var TreeActions = function(conf, treeGridHelper) {
        var originalRowData, allRowsInTree;
        /**
         * Initialize the TreeActions class
         * @param {Object} objects in the grid widget
         */
        this.init = function(options){
            originalRowData = options.originalRowData;
            allRowsInTree = options.allRowsInTree;
        };

        /**
         * Select all of children of the row from treeGrid
         * @param {Function} toggleRowSelection method in the grid
         * @param {String} rowId
         */
        this.selectChildren = function(toggleRowSelection, rowId){
            var children = treeGridHelper.getAllChildrenId([rowId], []);
            toggleRowSelection(children, "selected");
        };


        /**
         * Delete rows to treeGrid
         * @param {Object} $gridTable
         * @param {String/Array} rowId(s)
         */
        this.deleteRows = function($gridTable, rowIds){
            if (!_.isArray(rowIds)){
                rowIds = [rowIds];
            }
            rowIds.forEach(function (row) {
                $gridTable.jqGrid('delTreeNode', row);
            });
        };

        /**
         * Add rows to treeGrid
         * @param {Object} $gridTable
         * @param {Object/Array} rowData
         */
        this.addRows = function($gridTable, rowData){
            if (!_.isArray(rowData)){
                rowData = [rowData];
            }
            rowData.forEach(function (row) {
                $gridTable.jqGrid('addChildNode', row[conf.elements.jsonId], row[conf.elements.tree.parent], row);
            });
        };

        /**
         * Toggle Row expand/collapse
         * @param {Object} $row
         */
        this.toggleParentRow = function($row){
            $row.find('.treeclick').click();
        };

        /**
         * Reorder rows to different parent group
         * @param {Object} $gridTable
         * @param {String} currentRowId
         * @param {String/Array} selected rowId(s)
         * @param {Boolean} isExpanded: current row is expanded or not
         * @param {String} newParentRowId
         * @param {Boolean} areSelectedRowsSiblings
         */
        this.reorderRowsToDiffParent = function($gridTable, currentRowId, selectedRowIds, isExpanded, newParentRowId, areSelectedRowsSiblings){
            var isNewParentRowEmpty = newParentRowId && !allRowsInTree[newParentRowId].children.length ? true : false,
                newRowData = treeGridHelper.getUpdatedChildrenRowData($gridTable, newParentRowId, selectedRowIds, currentRowId, areSelectedRowsSiblings);

            this.deleteRows($gridTable, selectedRowIds);
            if (isNewParentRowEmpty){
                //When the new parent row has no children
                var record = $gridTable.jqGrid('getInd', newParentRowId) + 1;
                newRowData.forEach(function (row) {
                    $gridTable.jqGrid('addRowData', row[conf.elements.jsonId], row, 'after', row[conf.elements.tree.parent]);
                    $gridTable.jqGrid('setTreeNode', record, record + 1);
                });
            }else{
                this.addRows($gridTable, newRowData);
                isExpanded && this.toggleParentRow($gridTable.find("#"+ currentRowId));
            }
        };

        /**
         * Reorder rows in the same parent group
         * @param {Object} $gridTable
         * @param {String/Array} the rowId(s) for reordering
         * @param {Object} $baseRow - the base row for other rows to append after it.
         * @param {Function} updateVisualFunc (Optional) - This callback function is used to update visual effects
         */
        this.reorderRowsInSameParent = function($gridTable, reorderRowIds, $baseRow, updateVisualFunc){
            var $prevRow = $baseRow,
                isFirstRow = true; 
            reorderRowIds.forEach(function (id) {
                var $row = $gridTable.find("#" + id);

                if ($row.length > 0){
                    var prevRowId = $prevRow.attr('id');
                    if ((allRowsInTree[id].parent != allRowsInTree[prevRowId].parent) && !isFirstRow){
                        $prevRow = $gridTable.find("#" + allRowsInTree[id].parent);
                    }
                    $prevRow.after($row.detach());
                    _.isFunction(updateVisualFunc) && updateVisualFunc($row);
                    $prevRow = $row;
                    isFirstRow = false;
                }                                    
            });
        };
    };

   return TreeActions;
});