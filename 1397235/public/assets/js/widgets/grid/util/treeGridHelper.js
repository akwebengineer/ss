/**
 * A module contains the methods related to tree grid, for example, get children ids and updated data
 *
 * @module TreeGridHelper
 * @author Eva Wang<iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
],  /** @lends TreeGridHelper */
    function() {

    /**
     * TreeGridHelper constructor
     *
     * @returns {Object} Current TreeGridHelper's object: this
     */
    var TreeGridHelper = function(conf) {
        var originalRowData, allRowsInTree, rootId = "";
        /**
         * Initialize the TreeGridHelper class
         * @param {Object} objects in the grid widget
         * @inner
         */
        this.init = function(options){
            originalRowData = options.originalRowData;
            allRowsInTree = options.allRowsInTree;
        };

        /**
         * get all of children and grandchildren ids from treeGrid
         * @param {Array} array of ids
         * @param {Array} array of all ids
         * @inner
         */
        this.getAllChildrenId = function(rowIds, allIds){
            for (var i = 0; i < rowIds.length; i++){
                var childrenIds = allRowsInTree[rowIds[i]]['children'];
                allIds.push(rowIds[i]);
                if (!_.isEmpty(childrenIds)){
                    this.getAllChildrenId(childrenIds, allIds);
                }
            }
            return allIds;
        };

        /**
         * Return updated tree children row data 
         * @param {Object} gridTable
         * @param {Object} newParentId - the new parent id for the current row
         * @param {Array} selectedRowIds
         * @param {String/Number} current row id
         * @param {Boolean} if all multiple rows are in the same group
         * @inner
         */
        this.getUpdatedChildrenRowData = function ($gridTable, newParentId, selectedRowIds, rowId, isMultiRowsInSameGroup) {
            var children = [],
                level = conf.elements.tree.level,
                tempRowData = _.extend({}, originalRowData),
                newParentLevel;
            
            selectedRowIds.forEach(function (id) {
                var currentParentId = originalRowData[id]['parent'],
                    parentId = (rowId == id || isMultiRowsInSameGroup) ? newParentId : currentParentId;
                if (currentParentId != parentId){
                    _.isUndefined(parentId) && (parentId = rootId);
                    allRowsInTree[id]['parent'] = parentId.toString();
                    originalRowData[id][level] = parentId ? parseInt(tempRowData[parentId][level], 10) + 1 : 0;
                    newParentLevel = originalRowData[id][level];
                    !_.isEmpty(parentId) && (allRowsInTree[parentId]['children'] = _.union(allRowsInTree[parentId]['children'], [id]));
                    allRowsInTree[currentParentId] && (allRowsInTree[currentParentId]['children'] = _.without(allRowsInTree[currentParentId]['children'], id));
                    originalRowData[id]['parent'] = parentId;
                }else if (!_.isUndefined(newParentLevel)){
                    //When drag-n-drop the parent row to different parent group, all its children needs to update the rule level even they are still under the same parent
                    originalRowData[id][level] = newParentLevel + 1;
                }
                
                $gridTable.find("#" + id).length > 0 && children.push(originalRowData[id]);
            });
            

            return children;
        };

        /**
         * Return the new parent id 
         * After a new row is inserted to a new position in the tree, the new parentId can be 
         * 1. previous row id: When the previous row is expanded
         * 2. the parent id of previous row: when the previous row doesn't have children or the previous row is collapsed.
         * @param {Object} gridTable
         * @param {Object} prevRowData 
         * @param {String} current row id
         * @param {Boolean} if all multiple rows are in the same group
         * @inner
         */
        this.getNewParentId = function ($gridTable, prevRowData, rowId, isMultiRowsInSameGroup) {
            var prevRowId = prevRowData[conf.elements.jsonId],
                prevParentRowId = originalRowData[allRowsInTree[prevRowId].parent] && originalRowData[allRowsInTree[prevRowId].parent][conf.elements.jsonId],
                prevRowChildren = allRowsInTree[prevRowId].children,
                $prevRow = $gridTable.find('#' + prevRowId),
                isExpand = this.isRowExpanded($prevRow),
                newParentRowId;

            if (((prevRowChildren && _.isArray(prevRowChildren) && prevRowChildren.length > 0) || isMultiRowsInSameGroup) && isExpand){
                newParentRowId = prevRowId;
            }else{
                newParentRowId = prevParentRowId;
            }

            //When the new parent row is collapsed, then the newParentRowId is its parentId
            if ($gridTable.find('#' + newParentRowId + " .tree-plus").length == 1){
                newParentRowId = this.getNewParentId($gridTable, originalRowData[newParentRowId], newParentRowId);
            }
            return newParentRowId.toString();
        };

        /**
         * Return Boolean value if the row is expanded or collapsed.
         * @param {Object} $row
         */
        this.isRowExpanded = function($row){
            return $row.find('.treeclick.tree-minus').length > 0 ? true : false;
        }
    };

   return TreeGridHelper;
});