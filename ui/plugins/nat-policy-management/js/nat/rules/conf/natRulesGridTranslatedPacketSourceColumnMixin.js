/**
 * This is a mixin container for NAT  grid translated packet source column config items
 * Created by skesarwani.
 */
define(['./natRulesGridTranslatedPacketDestinationColumnMixin.js'], function (ColumnMixin) {
  var tpsColumnMixin = function (ruleGridConfigInstance) {
      this.ruleGridConfigInstance = ruleGridConfigInstance;
    };
  tpsColumnMixin.prototype = new ColumnMixin();
  _.extend(tpsColumnMixin.prototype, {
    /**
     * Returns dnd config for translated packet cell
     * @returns {*|{isDraggable: boolean, isDroppable: boolean, groupId: string, callbacks: {beforeDrag: *, hoverDrop: *, afterDrop: *}}}
     */
    getTranslatedPacketSourceDndConfig: function () {
      return this.getTranslatedPacketDestinationDndConfig();
    },
    hoverDrop: function (callbackData) {
      var me = this,
        $dragHelper = callbackData.helper, hoveredRowData = callbackData.hoveredRow,
        ruleCollection = me.ruleGridConfigInstance.ruleCollection,
        ruleModel = me.getRuleModel(hoveredRowData.id);
      if (true === !(ruleModel.isRuleGroup() || ruleCollection.isPolicyReadOnly() || ruleCollection.isGroupPolicy())) {
        //Check if Address or Destination Nat pool type is being dropped
        if (ruleModel.getNatType() === 'SOURCE') {
          return true;
        }
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
        ruleType = ruleModel.getNatType();
      if (draggedItems.length > 1) {
        //For translated packet source cell only single item is allowed
        errorVal = {isValid: false,
          errorMessage: me.ruleGridConfigInstance.context.getMessage('nat_tps_cell_only_one_nat_pool_drop_allowed')};
      } else if(ruleType === 'SOURCE') {
        //For translated packet source cell, in source rule only single source nat pool
        // is allowed provided translation type is not Interface
        if('INTERFACE' !== ruleModel.getTranslationType() &&
          (dragType === 'NATPOOL' && draggedItems[0]['pool-type'] === me.SOURCE_POOL_TYPE)) {
          return true;
        }
        errorVal = {isValid: false, errorMessage: me.ruleGridConfigInstance.context.
          getMessage('nat_tps_cell_source_rule_only_one_source_nat_pool_allowed_and_translation_is_not_interface')};
      }
      return errorVal;
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

      var me = this, draggedRule = draggedItemsRowData[0],
        draggedRuleModel = me.getRuleModel(draggedRule.id),
        dragRuleType = draggedRuleModel.getNatType(), natPool = draggedRuleModel.getTranslationNatPool(),
        isDevicePolicy = me.ruleGridConfigInstance.ruleCollection.isGroupPolicy() === false;
      if (isDevicePolicy) {
        if (dragRuleType === 'SOURCE' && !_.isEmpty(natPool)) {
          //Source Nat Pool is dragged
          natPool['pool-type'] = me.SOURCE_POOL_TYPE;
          $dragHelper[0].draggedItems = [natPool];
          $dragHelper[0].dragObjectType = 'NATPOOL';
          return true;
        }
      }
      return false;
    }
  });
  return tpsColumnMixin;
});
