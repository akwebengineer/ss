/**
 * This is a mixin container for NAT  grid address column config items
 * Created by vijayat.
 */
define(['../../../../../ui-common/js/common/utils/SmUtil.js',
  '../../../../../base-policy-management/js/policy-management/rules/conf/rulesGridColumnMixin.js'], function (SmUtil, NatColumnMixin) {
  var smUtil = new SmUtil(),
    addressColumnMixin = function (ruleGridConfigInstance) {
    this.ruleGridConfigInstance = ruleGridConfigInstance;
    };
  addressColumnMixin.prototype = new NatColumnMixin();
  _.extend(addressColumnMixin.prototype, {
    getAddressDndConfig: function () {
      var me = this;
      return {
        'isDraggable': true,
        'isDroppable': true,
        'groupId': 'ADDRESS_NATPOOL',
        'callbacks': {
          'beforeDrag': _.bind(me.beforeDrag, me),
          'hoverDrop': _.bind(me.hoverDrop, me),
          'afterDrop': _.bind(me.afterDrop, me)
        }
      }
    },
    /**
     * Override this method to add the dragged items info like type
     * @param callbackData
     * @returns {boolean}
     */
    beforeDrag: function (callbackData) {
      if(true === NatColumnMixin.prototype.beforeDrag.call(this, callbackData)) {
        var $dragHelper = callbackData.helper;
        //Add the drag type
        $dragHelper[0].dragObjectType = 'ADDRESS';
        return true;
      }
      return false;
    },
    /**
     * Allows drop only if the item being dropped is Address
     * @param callbackData
     * @returns {boolean}
     */
    hoverDrop: function (callbackData) {
      if(true === NatColumnMixin.prototype.hoverDrop.call(this, callbackData)) {
        var $dragHelper = callbackData.helper;
        if($dragHelper[0].dragObjectType === 'ADDRESS') {
          return true;
        }
      }
      return false;
    },

    getDragItems : function(draggedItemsRowData, $draggedItems) {
       var me = this, draggedRule = draggedItemsRowData[0],
       draggedRuleModel = me.getRuleModel(draggedRule.id),
      draggedcolumn = $($draggedItems.context).closest('td').attr('aria-describedby').split('_')[1].split('.')[1];
      
      if(draggedcolumn == 'src-address') {
        return draggedRuleModel.getSourceAddress();
      }
      else if(draggedcolumn == 'dst-address') {
         return draggedRuleModel.getDestinationAddress();
      }

    },
    /**
     * Validate if the drop of dragged addresses is allowed or not
     * @param draggedAddresses
     * @param hoveredRowData
     * @param column
     * @returns {*}
     draggedAddresses, hoveredRowData, $droppedTargetColumn
     */
    validateItems: function (draggedAddresses, hoveredRowData, $droppedTargetColumn) {
       var originalAddress,column_parent,column,me = this,errorVal = null,
       ruleModel = me.getRuleModel(hoveredRowData.id),
       natType = ruleModel.getNatType(),      
       arrayOfNonPermissibleAddresses = ['ANY', 'WILDCARD','DNS'],
       arrayOfDestNatType_notallowed = ['ANY','WILDCARD', 'GROUP', 'RANGE', 'DNS'],
       arrayOfStaticNatType_notallowed = ['ANY','ANY_IPV4', 'ANY_IPV6','WILDCARD', 'GROUP', 'RANGE', 'DNS'];
        
      /* column - dst-address/src-address*/
      
      column_parent = $droppedTargetColumn.attr('aria-describedby').split('_')[1].split('.')[0];
      column = $droppedTargetColumn.attr('aria-describedby').split('_')[1].split('.')[1];
     
       $.each(draggedAddresses, function (index, item) {
        //ANY address can not be dropped along with any other address
        if(column === 'src-address' && $.inArray(item['address-type'], arrayOfNonPermissibleAddresses) !== -1){
          errorVal = {isValid: false, errorMessage: me.ruleGridConfigInstance.context.getMessage('nat_rules_dragdrop_diff_addresstype')};
          return false;
        }
        else if(column === 'dst-address') {
          if((natType == 'STATIC' || natType == 'DESTINATION') && draggedAddresses.length >1 )
          {
          errorVal = {isValid: false, errorMessage: me.ruleGridConfigInstance.context.getMessage('nat_static&dest_rules_dragdrop_single_address')};
          return false;
          } 
          if(natType == 'DESTINATION' && $.inArray(item['address-type'], arrayOfDestNatType_notallowed )!== -1){
          errorVal = {isValid: false, errorMessage:  me.ruleGridConfigInstance.context.getMessage('nat_dest_rules_dragdrop_multiple_addresstype')};
          return false;
          }
          if(natType == 'STATIC' && $.inArray(item['address-type'], arrayOfStaticNatType_notallowed)!== -1){
          errorVal = {isValid: false, errorMessage: me.ruleGridConfigInstance.context.getMessage('nat_static_rules_dragdrop_diff_addresstype')};
          return false;
          }
          if(natType == 'SOURCE' && $.inArray(item['address-type'], arrayOfNonPermissibleAddresses)!== -1){
          errorVal = {isValid: false, errorMessage: me.ruleGridConfigInstance.context.getMessage('nat_rules_dragdrop_diff_addresstype')};
          return false;
          }

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
      var originalAddress,me = this, mergedAddressArr = [],
      ruleCollection = me.ruleGridConfigInstance.ruleCollection,
      ruleId = hoveredRowData.id,
      ruleModel = me.getRuleModel(ruleId),
      natType = ruleModel.getNatType(),
      isMerged = false, 
      orgPackets = ruleModel.getOriginalPacket(),
     
      
      column_parent = $droppedTargetColumn.attr('aria-describedby').split('_')[1].split('.')[0];

      column_child = $droppedTargetColumn.attr('aria-describedby').split('_')[1].split('.')[1];
      
     if(column_child == 'src-address') {
         originalAddress = ruleModel.getSourceAddress();
      }
      else if(column_child == 'dst-address') {
         originalAddress = ruleModel.getDestinationAddress();
      }
       /* merge dragged address - check address -type is Any_ipv4 */
       if ((natType == 'STATIC' || natType == 'DESTINATION') && 
            column_child =='dst-address')
        {
          mergedAddressArr = draggedAddresses;
          isMerged = true;
        }
        else {
            isMerged = smUtil.mergeObjectArrays(originalAddress, draggedAddresses, 'id', mergedAddressArr);  
        }      
      
      if (isMerged === true) {
        orgPackets[column_child]['address-reference'] = mergedAddressArr;
        ruleModel.set('original-packet', orgPackets);
        me.modifyRule(ruleCollection, ruleModel, ruleId, $droppedTargetColumn);
      }
    }
  });
  return addressColumnMixin;
});
