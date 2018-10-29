/**
 * A configuration object with the parameters required to build a Grid widget for ips rules
 *
 * @module ipsPolicyTemplatesRulesConfiguration
 * @author avyaw <avyaw@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define(['../../rules/conf/ipsRulesGridConfiguration.js'
],function (IpsRuleGridConfiguration) {
  
  var ipsPolicyTemplatesRulesConfiguration = function (context, ruleCollection, policyManagementConstants, policyObj) {
    this.initialize(context, ruleCollection, policyManagementConstants);
    this.policyObj = policyObj;
  }

  _.extend(ipsPolicyTemplatesRulesConfiguration.prototype, IpsRuleGridConfiguration.prototype, {


    isRowEditable: function(rowId){
      var me=this, recordCollection = me.ruleCollection,
          rule = recordCollection.get(rowId);
      if(rule.get("is-leaf") === false)
        return false;
      if(me.policyObj['definition-type'] == 'PREDEFINED')
        return false;
      return true;
    },

    onBeforeEdit : function(rowId) {
      return true;
    },


    // Latest structure for flat rules
    getColumnConfiguration : function () {
      var me = this,
          context = me.context;

      return [{
          "index": me.policyManagementConstants.JSON_ID,
          "name": me.policyManagementConstants.JSON_ID,
          "hidden": true,
          "width": 50
        }, {
          "index": "disabled",
          "name": "disabled",
          "hidden": true,
          "showInactive":"true"
        }, {
          "index": "icons",
          "name":  "icons",
          "label": "",
          "width": 30,
          "formatter": $.proxy(me.formatIconsCell, me)
        }, {
          "index": "serial-number",
          "name": "serial-number",
          "classes": "rule-grid-group-object",
          "label": context.getMessage("rulesGrid_column_serialNumber"),
          "width": 50,
          "formatter": $.proxy(me.formatSerialNumberCell, me)
        }, {
          "index": "RuleName",
          "name": "name",
          "label": context.getMessage("grid_column_name"),
          "width": 240,
          "sortable": false,
          "collapseContent": {
              "formatData": $.proxy(me.formatNameCell, me),
              "formatObjectCell": $.proxy(me.formatNameCell, me),
              "overlaySize": "small"
          },
          "searchCell": true
        },
        {
          "index": "ipsRuletype",
          "name": "ipsType",
          "label": context.getMessage("ips_rulesgrid_column_type"),
          "width": 75,
          "searchCell": true
        },
        {
         "index": "ipsAttackName",
         "name": "attacks.reference",
         "label": context.getMessage("ips_rulesGrid_column_signature"),
         "width": 150,
         "collapseContent": {
           "name": "name",
           "overlaySize": "xlarge"
         },
         "searchCell": true
       },{
          "index": "action-data",
          "name": "action-data.action",
          "label": context.getMessage("rulesGrid_column_action"),
          "width": 120,
          "editCell": {
              "type": "custom",
              "element": $.proxy(me.getActionEditor, me),
              "value": $.proxy(me.getActionEditorValue, me)
          },
          "formatter": $.proxy(me.formatAction, me),
           "searchCell": {
                "type": 'dropdown',
                "values":me.actionSearchData()
           }
        }, {
          "index": "notification",
          "name": "notification",
          "label": context.getMessage("ips_rulegrid_column_notification"),
          "width": 120,
          "collapseContent": {
            "keyValueCell": true, //if false or absent, defaults to an array
            "lookupKeyLabelTable": me.keyLabelTable,
            "formatData": $.proxy(me.formatNotification, me),
            "formatObjectCell": $.proxy(me.formatCell, me)
         }
        }, {
          "index": "ipaction",
          "name": "ipaction",
          "label": context.getMessage("ips_rulegrid_column_ipaction"),
          "width": 120,
          "collapseContent": {
          "keyValueCell": true, //if false or absent, defaults to an array
          "lookupKeyLabelTable": me.keyLabelTable,
          "formatData": $.proxy(me.formatIpActionData, me),
          "formatObjectCell": $.proxy(me.formatCell, me)
         }
        }, {
          "index": "additional",
          "name": "additional",
          "label": context.getMessage("ips_rulegrid_column_additional"),
          "width": 120,
          "collapseContent": {
          "keyValueCell": true, //if false or absent, defaults to an array
          "lookupKeyLabelTable": me.keyLabelTable,
          "formatData": $.proxy(me.formatAdditionalData, me),
          "formatObjectCell": $.proxy(me.formatCell, me)
         }
        }, {
          "index": "dcRuledescription",
          "name": "description",
          "label": context.getMessage("grid_column_description"),
          "width": 210,
          "sortable": false,
          "collapseContent": {
            "formatData": $.proxy(me.formatDescriptionCell, me),
            "formatObjectCell": $.proxy(me.formatDescriptionCell, me),
            "overlaySize": "small"
          },
          "searchCell": true
        }];
    },

    getConfirmationDialogInfo: function(){
        return {
            "delete": {
                title: this.context.getMessage("ips_rules_delete_confirmation_title"),
                question: this.context.getMessage("rules_delete_confirmation_msg")
            }
        }
    }
  });

  return ipsPolicyTemplatesRulesConfiguration;
});
