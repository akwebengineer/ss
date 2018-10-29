/**
 * A view to manage ips policy rules
 *
 * @module IpsPolicyTemplatesRulesView
 * @author avyaw
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  '../../rules/views/ipsRulesView.js',
  '../conf/ipsPolicyTemplatesRulesGridConf.js',
  '../../rules/views/ruleGridNotificationEditorView.js',
  '../../rules/views/ruleGridIPActionEditorView.js',
  '../../rules/views/ruleGridAdditionalEditorView.js',
  '../../rules/conf/ipsRulesContextMenu.js',
  '../../rules/views/ipsRuleGridSignatureEditorView.js',
  '../conf/ipsPolicyTemplatesRulesContextMenu.js',
  '../../../../../base-policy-management/js/policy-management/rules/views/ruleGridNameEditorView.js',
  '../../../../../base-policy-management/js/policy-management/rules/views/descriptionEditorView.js'
], function (IpsRulesView, RuleGrid,NotificationEditorView,IPActionEditorView,AdditionalEditorView,
   IPSRulesContextMenu,IPSSigEditorView,IPSPolicyTemplateRulesContextMenu,RuleNameEditorView,DescriptionEditorView) {

  var RulesView = IpsRulesView.extend({

    getRuleGridConfiguration: function() {
      var me = this;
          me.ruleGrid = new RuleGrid(me.context, me.ruleCollection, me.policyManagementConstants,me.policyObj);
          me.ruleGridConfiguration = me.ruleGrid.getConfiguration();
        if(me.hasRuleGridActionButtons()) {
          var defaultButtons = {
            "create":{
              "label": me.context.getMessage('create'),
              "key":"createEvent",
              "items": [{
                "label":me.context.getMessage('addIPSRule'),
                "key":"ipsRule"
              },{
                "label":me.context.getMessage('addExemptRule'),
                "key":"exemptRule"
              }]
            }
          };
          me.ruleGridConfiguration.actionButtons.defaultButtons = defaultButtons;
        }
      return me.ruleGridConfiguration;
    },

    getContextMenu: function() {
      var me = this,
          contextMenu = new IPSPolicyTemplateRulesContextMenu(me.context, me.ruleCollection,me.policyObj);
      return contextMenu;
    },

        /**
      * Returns true if the Rules ILP has action buttons.
      * Sub classes can override if actions buttons are to be hidden
      * @returns {boolean}
      */
    hasRuleGridActionButtons: function(){
        if(this.policyObj['predefined'] === true) {
          return false;
        }
        return true;
    },    

    /**
    * overriding base class function
    * @returns {boolean}
    */
    hasRuleGridSaveButton: function(){
        if(this.policyObj['predefined'] === true) {
          return false;
        }
        return true;
    },

    /**
    * overriding base class function
    * @returns {boolean}
    */
    hasRuleGridDiscardButton: function(){
        if(this.policyObj['predefined'] === true) {
          return false;
        }
        return true;
    },


    hasRuleGridPublishUpdateButtons: function(){
        return false;
    },

    hasRuleGridAdvanceButton: function(){
        return false;
    },

    createViews: function () {

      var me = this,
        ruleNameEditorView = new RuleNameEditorView({
        'policyObj': me.policyObj,
        'close': _.bind(me.closeEditorOverlay, this),
        'context': me.context,
        'columnName': 'name',
        'pattern':/^[a-zA-Z0-9][a-zA-Z0-9-_]{0,62}$/,
        'error':'name_error',
        'ruleCollection': me.ruleCollection
      }),

      notificationEditorView = new NotificationEditorView({
        'close': _.bind(me.closeEditorOverlay, this),
        'policyObj': me.policyObj,
        'context': me.context,
        'columnName': 'notification',
        'ruleCollection': me.ruleCollection
      }),

      ipActionEditorView = new IPActionEditorView({
        'close': _.bind(me.closeEditorOverlay, this),
        'policyObj': me.policyObj,
        'context': me.context,
        'columnName': 'ipaction',
        'ruleCollection': me.ruleCollection
      }),

      additionalEditorView = new AdditionalEditorView({
        'close': _.bind(me.closeEditorOverlay, this),
        'policyObj': me.policyObj,
        'context': me.context,
        'columnName': 'additional',
        'ruleCollection': me.ruleCollection
      }),
      ipsSigEditorView = new IPSSigEditorView({
        'close': _.bind(me.closeEditorOverlay, this),
        'context': me.context,
        'columnName': 'attacks.reference',
        'ruleCollection': me.ruleCollection
      }),
      descriptionEditorView = new DescriptionEditorView({
        'policyObj': me.policyObj,
        'close': _.bind(me.closeEditorOverlay, this),
        'context': me.context,
        'columnName': 'description',
        'ruleCollection': me.ruleCollection
      }),
      cellViews = {
        'name':ruleNameEditorView,
        'notification' : notificationEditorView,
        'ipaction' : ipActionEditorView,
        'additional' : additionalEditorView,
        'attacks.reference':ipsSigEditorView,
        'description':descriptionEditorView
      };
      return cellViews;
    }
  });

  return RulesView;
});
