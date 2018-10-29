/**
 * This is a parent mixin container for nat /firewall rules grid column config items
 * Created by vijayat
 */
define([], function () {
  var ColumnMixin = function (ruleGridConfigInstance) {
     this.ruleGridConfigInstance = ruleGridConfigInstance;
  };
  _.extend(ColumnMixin.prototype, {
    getRuleModel : function (rowId) {
      return this.ruleGridConfigInstance.ruleCollection.get(rowId);
    },
    modifyRule: function (ruleCollection, ruleModel, ruleId, $droppedTargetColumn) {
      ruleCollection.modifyRule(ruleModel.toJSON(), {
        'makeRowEditable': false,
        dnd: {
          highlight: {
            cell: {
              row: ruleId,
              index: $droppedTargetColumn.index()
            }
          }
        }
      });
    },
    /**
     * Validate and process before drag. Put dragged items in helper object
     * @param callbackData
     * @returns {boolean}
     */
    beforeDrag: function (callbackData) {
      if(this.ruleGridConfigInstance.ruleCollection.isPolicyReadOnly()) {
        return false;
      }
      var me = this,
        draggedItemsData = callbackData.data, $draggedItems = callbackData.draggableItems,
        draggedItemsRowData = callbackData.draggableRows,
        $dragHelper = callbackData.helper, draggedParam;

      draggedParam = me.getDraggedItems(draggedItemsRowData, $draggedItems);
      $dragHelper[0].draggedItems = draggedParam;
      return true;
    },
    /**
     * Callback to verify if on hover is allowed or not
     * @param callbackData
     * @returns {boolean}
     */
    hoverDrop: function (callbackData) {
      var ruleModel = this.getRuleModel(callbackData.hoveredRow.id);
      return !(ruleModel.isRuleGroup() || this.ruleGridConfigInstance.ruleCollection.isPolicyReadOnly());
    },
    /**
     * Get the dragged item objects
     * @param draggedItemsRowData
     * @param $draggedItems
     * @returns {Array}
     */
    getDraggedItems: function (draggedItemsRowData, $draggedItems) {
      var me = this,draggedIds = [], draggedAddresses = [], draggedValues;

      $draggedItems.each(function (index, item) {
        draggedIds[draggedIds.length] = parseInt($(item).attr('data-tooltip'));
      });

      draggedValues = me.getDragItems(draggedItemsRowData, $draggedItems);
      draggedAddresses = $.grep(draggedValues, function (item, index) {
      return -1 < $.inArray(item.id, draggedIds);
      });
      return draggedAddresses;
    },
    /**
     * On drop call back for addresses cell
     * @param callbackData
     * @returns {*}
     */
    afterDrop: function (callbackData) {
      var me = this,
        draggedItemsData = callbackData.data, $draggedItems = callbackData.draggableItems,
        $droppedTargetColumn = callbackData.dropColumn, draggedItemsRowData = callbackData.draggableRows,
        hoveredRowData = callbackData.droppableRow, $dragHelper = callbackData.helper,
        column,columnHeading, originalAddress, draggedAddresses, errorVal;
      
      draggedAddresses = $dragHelper[0].draggedItems;

      //Validations
      errorVal = me.validateItems(draggedAddresses, hoveredRowData, $droppedTargetColumn);
      if (errorVal) {
        //Show error msg
        return errorVal;
      }
      //Process merge
      me.mergeItems(draggedAddresses, hoveredRowData, $droppedTargetColumn);
      return false;
    }
  });
  return ColumnMixin;
});
