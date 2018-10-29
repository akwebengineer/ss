/**
 * This is a mixin container for fw rules grid service column config items
 * Created by skesarwani on 8/11/16.
 */
define(['../../../../../ui-common/js/common/utils/SmUtil.js',
    '../../../../../base-policy-management/js/policy-management/rules/conf/rulesGridColumnMixin.js'], function (SmUtil, ColumnMixin) {
  var smUtil = new SmUtil(),
    serviceColumnMixin = function (ruleGridConfigInstance) {
      this.ruleGridConfigInstance = ruleGridConfigInstance;
    };
  serviceColumnMixin.prototype = new ColumnMixin();
  _.extend(serviceColumnMixin.prototype, {
    getServiceDndConfig: function () {
      var me = this;
      return {
        'isDraggable': true,
        'isDroppable': true,
        'groupId': 'SERVICE',
        'callbacks': {
          'beforeDrag': _.bind(me.beforeDrag, me),
          'hoverDrop': _.bind(me.hoverDrop, me),
          'afterDrop': _.bind(me.afterDrop, me)
        }
      }
    },
    getDragItems : function(draggedItemsRowData, $draggedItems) {

     var draggedRule = draggedItemsRowData[0],
       draggedRuleModel = this.getRuleModel(draggedRule.id),
       draggedValues = draggedRuleModel.getServiceRefs();
     return draggedValues;
    },
    validateItems: function (draggedServices, hoveredRowData, $droppedTargetColumn) {
      var me = this,errorVal = null;
      $.each(draggedServices, function (index, item) {
       if (draggedServices.length >1 && item['name'] === 'Any') {
          errorVal = {isValid: false, errorMessage: me.ruleGridConfigInstance.context.getMessage
            ('service_message')};
          return false;
        }
      });
      return errorVal;
    },
    /**
     * after drop success merge the service objects for this rule
     * @param draggedServices
     * @param hoveredRowData
     * @param column
     */
    mergeItems: function (draggedServices, hoveredRowData, $droppedTargetColumn) {
      var me = this, mergedServiceArr = [], isMerged = true, ruleId = hoveredRowData.id,
        ruleCollection = me.ruleGridConfigInstance.ruleCollection,
        ruleModel = ruleCollection.get(ruleId),
        service,
        originalService = ruleModel.getServiceRefs();

      if (draggedServices.length === 1 && draggedServices[0]['name'] === 'Any') {
        //Check if dragged items has 'ANY'
        mergedServiceArr = draggedServices;
      } else if (originalService.length === 1 && originalService[0]['name'] === 'Any') {
        //Check if dropped row service item is 'ANY'
        mergedServiceArr = draggedServices;
      } else {
        isMerged = smUtil.mergeObjectArrays(originalService, draggedServices, 'id',  mergedServiceArr);
      }
      if (isMerged === true) {
        service = ruleModel.getService();
        service['service-reference'] = mergedServiceArr;
        ruleModel.set('services', service);
        me.modifyRule(ruleCollection, ruleModel, ruleId, $droppedTargetColumn);
      }
    }
  }); 
  return serviceColumnMixin;
});
