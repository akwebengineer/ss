/**
 * This is a mixin container for NAT  grid translated packet destination column config items
 * Created by skesarwani.
 */
define(['../../../../../base-policy-management/js/policy-management/rules/conf/rulesGridColumnMixin.js'], function (ColumnMixin) {
  var tpdColumnMixin = function (ruleGridConfigInstance) {
      this.ruleGridConfigInstance = ruleGridConfigInstance;
    };
  tpdColumnMixin.prototype = new ColumnMixin();
  _.extend(tpdColumnMixin.prototype, {
    SOURCE_POOL_TYPE : 0,
    DESTINATION_POOL_TYPE : 1,
    /**
     * Returns the column dnd config
     * @returns {{isDraggable: boolean, isDroppable: boolean, groupId: string, callbacks: {beforeDrag: *, hoverDrop: *, afterDrop: *}}}
     */
    getTranslatedPacketDestinationDndConfig: function () {
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
     * Validates if hover is allowed or not
     * @param callbackData
     * @returns {boolean}
     */
    hoverDrop: function (callbackData) {
      var me = this;
      if (true === ColumnMixin.prototype.hoverDrop.call(this, callbackData)) {
        //Check if Address or Destination Nat pool type is being dropped
        var $dragHelper = callbackData.helper, hoveredRowData = callbackData.hoveredRow,
          natType = me.getRuleModel(hoveredRowData.id).getNatType();
        if ( natType && natType === 'SOURCE') {
          return false;
        }
        return true;
      }
      return false;
    },
    /**
     * Validate if drag items can be dropped or not
     * @param hoveredRowData
     * @param draggedItems
     * @param dragType
     * @returns {*}
     */
    validateItems: function (hoveredRowData, draggedItems, dragType) {
      var me = this, errorVal,
        ruleModel = me.getRuleModel(hoveredRowData.id),
        ruleType = ruleModel.getNatType(),
        translationType = ruleModel.getTranslationType(),
        arrayOfStaticRulePermissibleAddresses = ['IPADDRESS', 'NETWORK'];
      if (draggedItems.length > 1) {
        errorVal = {isValid: false,
          errorMessage: me.ruleGridConfigInstance.context.getMessage('nat_tpd_cell_only_one_item_drop_allowed')};
      } else if(ruleType && ruleType === 'STATIC') {
        //For translated packet destination cell, in static rule only Host and Network address types are
        // allowed provided translation type is not Inet
        if(translationType && 'INET' !== translationType &&
          (dragType === 'ADDRESS' &&
            -1 < $.inArray(draggedItems[0]['address-type'], arrayOfStaticRulePermissibleAddresses))) {
          return true;
        }
        errorVal = {isValid: false, errorMessage: me.ruleGridConfigInstance.context.
          getMessage('nat_tpd_cell_static_rule_only_host_network_address_allowed_and_translation_is_not_inet')};
      } else if (ruleType && ruleType === 'DESTINATION') {
        //For translated packet destination cell, in destination rule only single destination nat pool is allowed
        if(dragType === 'NATPOOL' && draggedItems[0]['pool-type'] === me.DESTINATION_POOL_TYPE) {
          return true;
        }
        errorVal = {isValid: false,
          errorMessage: me.ruleGridConfigInstance.context.
            getMessage('nat_tpd_cell_dest_rule_only_one_dest_natpool_allowed')};
      }
      return errorVal;

    },
    /**
     * Callback for after drop. Inside this validations and merge of data to row data happens
     * @param callbackData
     * @returns {*}
     */
    afterDrop: function (callbackData) {
      var me = this,
        draggedItemsData = callbackData.data, $draggedItems = callbackData.draggableItems,
        $droppedTargetColumn = callbackData.dropColumn, draggedItemsRowData = callbackData.draggableRows,
        hoveredRowData = callbackData.droppableRow, $dragHelper = callbackData.helper,
        column, columnHeading, originalAddress, draggedItems, errorVal, dragType;

      draggedItems = $dragHelper[0].draggedItems;
      dragType = $dragHelper[0].dragObjectType;

      //Validations
      errorVal = me.validateItems(hoveredRowData, draggedItems, dragType);
      if (errorVal !== true) {
        //Show error msg
        return errorVal;
      }
      //Process merge
      me.mergeItems(hoveredRowData, draggedItems, dragType, $droppedTargetColumn);
      return false;
    },
    /**
     * Method to check if drag is allowed at all or not
     * @param callbackData
     * @returns {*}
     */
    beforeDrag: function (callbackData) {
      if (this.ruleGridConfigInstance.ruleCollection.isPolicyReadOnly()) {
        return false;
      }
      var me = this,
        draggedItemsData = callbackData.data, $draggedItems = callbackData.draggableItems,
        draggedItemsRowData = callbackData.draggableRows,
        $dragHelper = callbackData.helper, draggedParam;

      return me.getDragItems(draggedItemsRowData, $dragHelper);
    },
    /**
     * This method checks which items are being dragged from a packet destination cell
     * since this cell supports both ADDRESS and NATPOOL types we have to check for these
     * and then add the info to dragHelper. Later this is consumed by drop and hover validations
     * @param draggedItemsRowData
     * @param $dragHelper
     * @returns {boolean}
     */
    getDragItems: function (draggedItemsRowData, $dragHelper) {

      var me = this, draggedValues, dragType, draggedRule = draggedItemsRowData[0],
        draggedRuleModel = me.getRuleModel(draggedRule.id),
        dragRuleType = draggedRuleModel.getNatType(),
        address = draggedRuleModel.getTranslationAddress(),
        natPool = draggedRuleModel.getTranslationNatPool(),
        isDevicePolicy = me.ruleGridConfigInstance.ruleCollection.isGroupPolicy() === false;
      if (isDevicePolicy) {
        if (dragRuleType === 'STATIC' && !_.isEmpty(address)) {
          //Address is dragged
          draggedValues = address;
          dragType = 'ADDRESS';
        } else if (dragRuleType === 'DESTINATION' && !_.isEmpty(natPool)) {
          //Destination Nat Pool is dragged
          draggedValues = natPool;
          draggedValues['pool-type'] = me.DESTINATION_POOL_TYPE;
          dragType = 'NATPOOL';
        } else {
          return false;
        }
        $dragHelper[0].draggedItems = [draggedValues];
        $dragHelper[0].dragObjectType = dragType;
        return true;
      }
      return false;
    },
    /**
     * after drop success merge the address objects for this rule
     * @param hoveredRowData
     * @param draggedItems
     * @param dragType
     */
    mergeItems: function (hoveredRowData, draggedItems, dragType, $droppedTargetColumn) {
      var me = this, isMerged = false, ruleCollection = me.ruleGridConfigInstance.ruleCollection,
        ruleId = hoveredRowData['id'],
        ruleModel = me.getRuleModel(ruleId), translatedPacket = ruleModel.getTranslatedPacket(), itemId;
      if(_.isEmpty(translatedPacket)) {
        return;
      }
      if (dragType === 'ADDRESS') {
        //As per validations happened so far this is static rule. Add address to it
        itemId = ruleModel.getTranslationAddress()['id'];
        if (ruleModel.getTranslationAddress()['id'] !== draggedItems[0]['id']) {
          isMerged = true;
          translatedPacket['translated-address'] = draggedItems[0];
        }
      } else if (dragType === 'NATPOOL') {
        //As per validations happened so far this is destination rule. Add nat-pool to it
        itemId = ruleModel.getTranslationNatPool()['id'];
        if ( itemId !== draggedItems[0]['id']) {
          isMerged = true;
          translatedPacket['pool-addresses'] = draggedItems[0];
        }
      }

      if (isMerged) {
        ruleModel.set('translated-packet', translatedPacket);
        me.modifyRule(ruleCollection, ruleModel, ruleId, $droppedTargetColumn);
      }
    }
  });
  return tpdColumnMixin;
});
