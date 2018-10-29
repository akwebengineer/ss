/**
 * A module that add drop feature to the grid filter
 *
 * @module FilterDrop
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([

], /** @lends FilterDrop */
    function () {

    /**
     * FilterDrop constructor
     *
     * @constructor
     * @class FilterDrop - Add drop feature to the grid filter
     *
     * @param {Object} conf - User configuration object
     * @param {Class} DragNDrop - Grid DragNDrop Class
     * @param {Class} MultiSelectCell - Grid MultiselectCell Class
     * @param {Class} gridConfigurationHelper - Grid ConfigurationHelper Class
     * @returns {Object} Current FilterDrop's object: this
     */
    var FilterDrop = function (conf, dragNDrop, multiSelectCell, gridConfigurationHelper) {
        /**
         * return queryBuilder drop callback function
         * @param {Object} event
         * @param {Object} ui object - the parameters from jquery droppable
         */
        this.getQueryBuilderDropCallback = function(event, ui){
            var result = {
                    data: []
                },
                dragTableId = ui.draggable.data('dragTableId'),
                currentTableId = gridConfigurationHelper.getTableId($(event.target));
            
            //Droppable search only works for the same grid
            if (dragTableId === currentTableId){
                var $dragElement = ui.draggable,
                    $helper = ui.helper,
                    selectedItemValue = [];
                
                //When dragging items instead of cell, need to reassign $dragElement
                if (multiSelectCell.isCellItem($dragElement)) {
                    $dragElement = $dragElement.parents('td');
                    selectedItemValue = multiSelectCell.getSelectedCellItemValue($dragElement);
                }else{
                    selectedItemValue = gridConfigurationHelper.getCellValue($dragElement);
                }
                var draggableCellName = gridConfigurationHelper.getColumnName($dragElement, dragTableId),
                    dragTableColumnHash = gridConfigurationHelper.buildColumnConfigurationHashByName(),
                    searchData = {
                        label: dragTableColumnHash[draggableCellName].label,
                        values: selectedItemValue
                    };
                result.data.push(searchData);

                //Hide the helper. In case the grid gets refresh in the callback.
                $helper.hide();
            }
            return result;
        };

        /**
         * return queryBuilder over callback function
         * @param {Object} event
         * @param {Object} ui object - the parameters from jquery droppable
         */
        this.getQueryBuilderOverCallback = function(event, ui){
            var dragTableId = ui.draggable.data('dragTableId'),
                currentTableId = gridConfigurationHelper.getTableId($(event.target)),
                updateClass = (dragTableId !== currentTableId) ? true : false;
                
            //Update help icon when draggable items are from different grid
            dragNDrop && dragNDrop.updateDraggableElementClass(updateClass);
        };
    };

    return FilterDrop;
});