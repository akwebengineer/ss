/**
 * This is a mixin container for fw rules grid address column config items
 * Created by skesarwani on 8/11/16.
 */
define(['../../../../../ui-common/js/common/utils/SmUtil.js',
   '../../../../../base-policy-management/js/policy-management/rules/conf/rulesGridColumnMixin.js'], function (SmUtil, ColumnMixin) {
  var smUtil = new SmUtil(),
    addressColumnMixin = function (ruleGridConfigInstance) {
    this.ruleGridConfigInstance = ruleGridConfigInstance;
    };
  addressColumnMixin.prototype = new ColumnMixin();
  _.extend(addressColumnMixin.prototype, {
    getAddressDndConfig: function () {
      var me = this;
      return {
        'isDraggable': true,
        'isDroppable': true,
        'groupId': 'ADDRESS',
        'callbacks': {
          'beforeDrag': _.bind(me.beforeDrag, me),
          'hoverDrop': _.bind(me.hoverDrop, me),
          'afterDrop': _.bind(me.afterDrop, me)
        }
      }
    },
    isNegateAddress : function (column, ruleModel) {
      var isNegateAddress;
      if(column === 'source-address') {
        isNegateAddress = ruleModel.isSourceNegateAddress();
      } else if (column === 'destination-address') {
        isNegateAddress = ruleModel.isDestinationNegateAddress();
      }
      return isNegateAddress;
    },
    getAddress : function (column, ruleModel) {
      var address;
      if(column == 'source-address') {
        address = ruleModel.getSourceAddress();
      }
      else if(column == 'destination-address') {
        address = ruleModel.getDestinationAddress();
      }
      return address;
    },
    getAddressRefsFromModel : function (column, ruleModel) {
      var address;
      if(column == 'source-address') {
        address = ruleModel.getSourceAddressRefs();
      }
      else if(column == 'destination-address') {
        address = ruleModel.getDestinationAddressRefs();
      }
      return address;
    },
    
    getDragItems : function(draggedItemsRowData, $draggedItems) {
      var me = this, draggedColumn = $($draggedItems.context).closest('td').attr('aria-describedby').split('_')[1].split('.')[0],
        draggedRule = draggedItemsRowData[0],
        draggedRuleModel = me.getRuleModel(draggedRule.id),
        draggedValues;
      draggedValues = me.getAddressRefsFromModel(draggedColumn, draggedRuleModel);
      return draggedValues;
    },
    /**
     * Validate if the drop of dragged addresses is allowed or not
     * @param draggedAddresses
     * @param hoveredRowData
     * @param column
     * @returns {*}
     */
    validateItems: function (draggedAddresses, hoveredRowData, $droppedTargetColumn) {
      var column = $droppedTargetColumn.attr('aria-describedby').split('_')[1].split('.')[0], me = this,
        ruleModel = me.getRuleModel(hoveredRowData.id),
        isNegateAddress,
        isDevicePolicy = me.ruleGridConfigInstance.ruleCollection.policy['policy-type'] === 'DEVICE',
        arrayOfNegateNonPermissibleAddresses = ['ANY', 'ANY_IPV4', 'ANY_IPV6', 'WILDCARD', 'ALL_IPV6', 'DYNAMIC_ADDRESS_GROUP'],
        arrayOfDevicePolicyNonPermissibleAddresses = ['POLYMORPHIC', 'DYNAMIC_ADDRESS_GROUP'], errorVal = null;

      isNegateAddress = me.isNegateAddress(column, ruleModel);
      $.each(draggedAddresses, function (index, item) {
        //ANY address can not be dropped along with any other address
        if (draggedAddresses.length > 1 && item['address-type'] === 'ANY') {
          errorVal = {isValid: false, errorMessage: me.ruleGridConfigInstance.context.getMessage('address_message')};
          return false;
        }

        if (isNegateAddress && -1 < $.inArray(item['address-type'], arrayOfNegateNonPermissibleAddresses)) {
          errorVal = {isValid: false, errorMessage: me.ruleGridConfigInstance.context.getMessage('address_Dynmessage')};
          return false;
        }
        //Device policy can not have variable address

        if (isDevicePolicy && -1 < $.inArray(item['address-type'], arrayOfDevicePolicyNonPermissibleAddresses)) {
          errorVal = {isValid: false, errorMessage:  me.ruleGridConfigInstance.context.getMessage('address_variableMessage')};
          return false;
        }
      });
      return errorVal;
    },
    /**
     * after drop success merge the address objects for this rule
     * @param draggedAddresses
     * @param hoveredRowData
     * @param column
     */
    mergeItems: function (draggedAddresses, hoveredRowData, $droppedTargetColumn) {
      var me = this,
        mergedAddressArr = [],
        isMerged = true,
        ruleId = hoveredRowData.id,
        ruleCollection = me.ruleGridConfigInstance.ruleCollection,
        address,
        ruleModel = ruleCollection.get(ruleId),
      
      column = $droppedTargetColumn.attr('aria-describedby').split('_')[1].split('.')[0],
      
      originalAddress;

      originalAddress = me.getAddressRefsFromModel(column, ruleModel);
      if (draggedAddresses.length === 1 && draggedAddresses[0]['address-type'] === 'ANY') {
        //Check if dragged items has 'ANY'
        mergedAddressArr = draggedAddresses;
      } else if (originalAddress.length === 1 && originalAddress[0]['address-type'] === 'ANY') {
        //Check if dropped row address item is 'ANY'
        mergedAddressArr = draggedAddresses;
      } else {
        isMerged = smUtil.mergeObjectArrays(originalAddress, draggedAddresses, 'id', mergedAddressArr);
      }
      if (isMerged === true) {
        address = me.getAddress(column, ruleModel);
        address ['addresses']['address-reference'] = mergedAddressArr;
        ruleModel.set(column, address);
        me.modifyRule(ruleCollection, ruleModel, ruleId, $droppedTargetColumn);
      }
    }
  });
  return addressColumnMixin;
});
