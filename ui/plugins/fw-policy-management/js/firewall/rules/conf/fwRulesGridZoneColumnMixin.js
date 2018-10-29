/**
 * This is a mixin container for fw rules grid zone column config items
 * Created by skesarwani on 8/11/16.
 */
define([  '../../../../../base-policy-management/js/policy-management/rules/conf/rulesGridColumnMixin.js'], function (ColumnMixin) {
  var zoneColumnMixin = function (ruleGridConfigInstance) {
      this.ruleGridConfigInstance = ruleGridConfigInstance;
    };
  zoneColumnMixin.prototype = new ColumnMixin();
  _.extend(zoneColumnMixin.prototype, {
    getZoneDndConfig: function () {
      var me = this;
      return {
        'isDraggable': true,
        'isDroppable': true,
        'groupId': 'ZONE',
        'callbacks': {
          'beforeDrag': _.bind(me.beforeDrag, me),
          'hoverDrop': _.bind(me.hoverDrop, me),
          'afterDrop': _.bind(me.afterDrop, me)
        }
      }
    },
    getZone : function (column, ruleModel) {
      var zone;
      if(column === 'source-zone') {
        zone = ruleModel.getSourceZone();
      } else if (column === 'destination-zone') {
        zone = ruleModel.getDestinationZone();
      }
      return zone;
    },
    getZoneItems : function (column, ruleModel) {
      var zones;
      if(column === 'source-zone') {
        zones = ruleModel.getSourceZoneItems();
      } else if (column === 'destination-zone') {
        zones = ruleModel.getDestinationZoneItems();
      }
      return zones;
    },
    /**
     * Get the list of zones/zoneset objects being dragged
     * @param draggedItemsRowData
     * @param $draggedItems
     * @returns {Array}
     */
    getDraggedItems: function (draggedItemsRowData, $draggedItems) {
      var me = this, draggedZoneSetIds = [],
        draggedZoneNames = [],
        draggedZones = [],
        draggedColumn,
        draggedRule = draggedItemsRowData[0],
        draggedRuleModel = me.getRuleModel(draggedRule.id);
      $draggedItems.each(function (index, item) {
        if ($(item).attr('zone-type') === 'ZONE') {
          draggedZoneNames[draggedZoneNames.length] = $(item).attr('data-name');
        } else if ($(item).attr('zone-type') === 'ZONESET') {
          draggedZoneSetIds[draggedZoneSetIds.length] = parseInt($(item).attr('data-id'));
        }
      });
      draggedColumn = $($draggedItems.context).closest('td').attr('aria-describedby').split('_')[1].split('.')[0];
      draggedZones = $.grep(me.getZoneItems(draggedColumn, draggedRuleModel), function (item, index) {
        if (item['zone-type'] === 'ZONE') {
          return -1 < $.inArray(item.name, draggedZoneNames);
        } else if (item['zone-type'] === 'ZONESET') {
          return -1 < $.inArray(item.id, draggedZoneSetIds);
        }
        ;
      });
      return draggedZones;
    },
    /**
     * Validate if dragged zones/zonesets can be droppped or not on the current rule
     * @param draggedZones
     * @param hoveredRowData
     * @param column
     * @returns {*}
     */
    validateItems: function (draggedZones, hoveredRowData, $droppedTargetColumn) {
      var me = this,
        ruleModel = me.getRuleModel(hoveredRowData.id),
        isGlobalRule = ruleModel.isGlobalRule(),
        errorVal = null,
        len = draggedZones.length;
      $.each(draggedZones, function (index, item) {
        //Global rule can not have ANY zone with any other zone
        if (isGlobalRule) {
          if (len > 1 && item['name'] === 'Any' && item['zone-type'] === 'ZONESET') {
             errorVal = {isValid: false, errorMessage: me.ruleGridConfigInstance.context.getMessage
            ('zone_message')};
            return false;
          }
        } else {
          if (len > 1) {
            errorVal = {isValid: false, errorMessage: me.ruleGridConfigInstance.context.getMessage
            ('zone-rule-message')};
            return false;
          }
          if (item['zone-type'] === 'ZONESET') {
            errorVal = {isValid: false, errorMessage: me.ruleGridConfigInstance.context.getMessage('zone-mesage-zoneset')};
            return false;
          }
        }
      });
      return errorVal;
    },
    /**
     * Merge the zones/zonesets of a rule with the newly dropped zones/zonesets
     * @param array1
     * @param array2
     * @param key1
     * @param key2
     * @param retArr
     * @returns {boolean}
     */
    mergeGlobalRuleZonesArrays: function (array1, array2, key1, key2, retArr) {

      var tmpMap, tmpKey, returnArray = _.isEmpty(array1) ? [] : $.extend(true, [], array1), map1 = {}, map2 = {} , isMerged = false;
      $.each(array1, function (index, item) {
        if (item['zone-type'] === 'ZONESET') {
          map1[item[key1]] = true;
        } else {
          map2[item[key2]] = true;
        }

      });

      array2 = array2 || [];
      $.each(array2, function (i, element) {
        if (element['zone-type'] === 'ZONESET') {
          tmpMap = map1;
          tmpKey = key1;
        } else {
          tmpMap = map2;
          tmpKey = key2;
        }
        if (tmpMap[element[tmpKey]] === undefined) {
          isMerged = true;
          returnArray.push(element);
        }
      });
      if (isMerged === true) {
        $.each(returnArray, function (i, element) {
          retArr[retArr.length] = element;
        });
      }
      return isMerged;
    },
    /**
     * after drop success merge the zone objects for this rule
     * @param draggedZones
     * @param hoveredRowData
     * @param column
     */
    mergeItems: function (draggedZones, hoveredRowData, $droppedTargetColumn) {
      var me = this, mergedZonesArr = [],
        isMerged = true,
        ruleId = hoveredRowData.id,
        ruleCollection = me.ruleGridConfigInstance.ruleCollection,
        ruleModel = ruleCollection.get(ruleId),
        column = $droppedTargetColumn.attr('aria-describedby').split('_')[1].split('.')[0],
        originalZones = me.getZoneItems(column, ruleModel), isGlobalRule = ruleModel.isGlobalRule();

      //Global Rules
      if (isGlobalRule) {
        if (draggedZones.length === 1 && draggedZones[0]['name'] === 'Any' && draggedZones[0]['zone-type'] === 'ZONESET') {
          //If Drop is ANY final zones is ANY
          mergedZonesArr = draggedZones;
        } else if (originalZones.length === 1 && originalZones[0]['name'] === 'Any' && originalZones[0]['zone-type'] === 'ZONESET') {
          //Check if dropped row zone item is 'ANY'
          mergedZonesArr = draggedZones;
        } else {
          isMerged = me.mergeGlobalRuleZonesArrays(originalZones, draggedZones, 'id', 'name', mergedZonesArr);
        }

      } else {
        mergedZonesArr = draggedZones;
      }
      if (isMerged === true) {
        var zone = me.getZone(column, ruleModel);
        zone['zone'] = mergedZonesArr;
        ruleModel.set(column, zone);
        me.modifyRule(ruleCollection, ruleModel, ruleId, $droppedTargetColumn);
      }
    }
  });
  return zoneColumnMixin;
});
