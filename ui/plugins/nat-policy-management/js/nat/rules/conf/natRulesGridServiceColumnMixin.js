/**
 * This is a mixin container for NAT service column config items
 * Created by Vijayat.
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
      var me = this, draggedValues, dragType, draggedRule = draggedItemsRowData[0],
      draggedRuleModel = me.getRuleModel(draggedRule.id),
      dragRuleType = draggedRuleModel.getNatType(),
      natServiceData = draggedRuleModel.getServiceData();
      return natServiceData;
    },
    validateItems: function (draggedServices, hoveredRowData, $droppedTargetColumn) {          
       var src_ports,dst_ports,protocol,dst_portset,src_portset,column,
       me = this,errorVal = null,ruleModel = me.getRuleModel(hoveredRowData.id),
       natType = ruleModel.getNatType(),
       orgPacket = ruleModel.getOriginalPacket();

      column = $droppedTargetColumn.attr('aria-describedby').split('_')[1].split('.')[0];
      src_portset = ruleModel.getServiceSourcePortSets();
      dst_portset = ruleModel.getServiceDestinationPortSets();
      protocol =  ruleModel.getServiceProtocolData();
      dst_ports =  ruleModel.getServiceDestinationPorts();
      src_ports =  ruleModel.getServiceSourcePorts();

      
      $.each(draggedServices, function (index, item) {
       if (natType === 'STATIC') {
          errorVal = {isValid: false, errorMessage: me.ruleGridConfigInstance.context.getMessage
            ('nat_service_statictype_message')};
          return false;
        }
        else if((natType === 'SOURCE' || natType === 'DESTINATION') &&
          ( !_.isEmpty(dst_ports) || !_.isEmpty(src_ports) || !_.isEmpty(dst_portset) ||
            !_.isEmpty(src_portset) || !_.isEmpty(protocol) )) {

            errorVal = {isValid: false, errorMessage: me.ruleGridConfigInstance.context.getMessage
            ('nat_rule_protocolport_message')};
          return false;
        }
        else if (item['name'] === 'Any' && draggedServices.length > 1){
            errorVal = {isValid: false, errorMessage: me.ruleGridConfigInstance.context.getMessage
            ('nat_any_withother_services_message')};
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
      var column,me = this, mergedServiceArr = [], isMerged = false,
      ruleCollection = me.ruleGridConfigInstance.ruleCollection,
      ruleId = hoveredRowData.id,
      ruleModel = me.getRuleModel(ruleId),
      natType = ruleModel.getNatType(),
      natServices = ruleModel.getServices(),
     
      originalService = natServices['service-reference'];

      if (draggedServices.length === 1 && draggedServices[0]['name'] === 'Any') {
        //Check if dragged items has 'ANY'
        mergedServiceArr = draggedServices;
        isMerged = true;
      } else if (originalService.length === 1 && originalService[0]['name'] === 'Any') {
        //Check if dropped row service item is 'ANY'
        mergedServiceArr = draggedServices;
        isMerged = true;
      } else {
        isMerged = smUtil.mergeObjectArrays(originalService, draggedServices, 'id',  mergedServiceArr);
      }
      if (isMerged === true) {
        natServices['service-reference'] = mergedServiceArr;
        ruleModel.set('services', natServices);
        me.modifyRule(ruleCollection, ruleModel, ruleId, $droppedTargetColumn);
      }
    }
  }); 
  return serviceColumnMixin;
});
