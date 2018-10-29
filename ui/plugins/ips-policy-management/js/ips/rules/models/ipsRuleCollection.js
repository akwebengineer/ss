/**
 * A Backbone Collection to be used by the Rule grids for rules model.
 *
 * @module ruleCollection
 * @author mamata
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  '../../../../../base-policy-management/js/policy-management/rules/models/baseRuleCollection.js',
  './ipsRuleModel.js',
  '../constants/ipsRuleGridConstants.js'
], function (BaseCollection, RuleModel, PolicyManagementConstants) {

  /**
   * IPSRules Collection definition.
   */
  var RuleCollection = BaseCollection.extend({
    model: RuleModel,

    policyManagementConstants: PolicyManagementConstants,

    isPolicyReadOnly : function(){
      if(this.policy['ips-policy-type'] === "IPSBASIC") {
        return true;
      } 
      return BaseCollection.prototype.isPolicyReadOnly.call(this);
    },

    /**
     *
     * @param selectedRuleID
     * @param direction
     */
    addRule: function(selectedRuleID, direction, ruleType, callback, ruleName) {
      var me = this, ruleAddInfo = {
            ruleAddInfo: {
              direction: direction,
              type: ruleType,
              referenceRuleID: selectedRuleID,
              name : ruleName || ""
            }
          },
          actionObject = {
            successCounter: 0,
            errorCounter: 0,
            totalNumber: 1,
            action: "createAction"
          }, options = {
            url: me.url() + me.policyManagementConstants.RULE_DRAFT_ADD,
            success: function (model, response, options) {
              me.setCollectionDirty(true);
              console.log(arguments);
              var editRuleId = model["ips-rule"][me.policyManagementConstants.JSON_ID];
              me.highlightRule("afterCreateRule",{ruleIds: [model["ips-rule"][me.policyManagementConstants.JSON_ID]], isRowEditable: true});
              if(callback){
                callback(model,editRuleId);
              }
            },
            error: function (model, response, options) {
              //UtilityClass.showErrorDialogue(ipsPolicyObject.name, actionObject.action, response, self);
              ++(actionObject.errorCounter);
               me.editLockErrorMsg(model,me);
            }
          };
      me.sync("create", new me.model(ruleAddInfo), options);
    },

    /**
     * @param rulePara
     * Below method triggers add rule to create exempt rule.
     * Once rule is created, get of ips signature triggers.
     * Call back of ips signature triggers modify rule with respective values.
     */
    addExemptRuleFromIPSLog: function(rulePara){
      var me=this;
      var ruleData,ruleIdToEdit,srcAddress,dstAddress;

      //Call back for add rule
      var callback = function(data,editRuleId){
          ruleData = data;
          ruleIdToEdit = editRuleId;          
          if(rulePara['ips-signature']) {
                 me.getSignature(rulePara['ips-signature'],callbackForIPSSig);
          }                   
      };

      //Call back for get signature
      var callbackForIPSSig = function(sigData){
          var ipsSigs = sigData['ips-signatures'];
          if(ipsSigs){
            var ipsSigArray = ipsSigs['ips-signature'];
            var ipsSig = ipsSigArray[0];
            var ipsModel = new me.model(ruleData['ips-rule']);
             ipsModel.set( {
                  'source-zone':{'name':rulePara.srcZone,'resolved':false,'zone-type':"ZONE"},
                  'destination-zone':{'name':rulePara.dstZone,'resolved':false,'zone-type':"ZONE"},
                  //'name':rulePara.ruleName,
                  'description':'Added by Create Exempt Rule action',
                  'attacks':{'reference': [{'id': ipsSig.id, 'name': ipsSig.name}]},
                  'source-address': me.getAddressForExemptRule(rulePara.srcAddressId,rulePara.srcAddressName),
                  'destination-address': me.getAddressForExemptRule(rulePara.destAddressId,rulePara.destAddressName)
            });  
            var modiFiedRule = {
              "modify-rules": {
                "modified-rules": {
                  "modified-rule": [ipsModel.toJSON()]
                }
            }};
            me.updateRuleToStore(modiFiedRule, "modifyAction", ruleIdToEdit);
          }else{
            console.log("IPS getSignature not availble");
          }
      };
      me.addRule(null,"Top",rulePara.ruleType,callback, rulePara.ruleName);

    },

    getAddressForExemptRule : function(id,name){
      return {'exclude-list':false,'addresses':{'address-reference':[{'id':id,'domain-id':Juniper.sm.DomainProvider.getCurrentDomain(),'name':name,'address-type':'IPADDRESS'}]}};
    },

    getSignature : function(ipsSigName,callbackForIPSSig){
      var self=this;
      $.ajax({
          url: '/api/juniper/sd/ips-signature-management/ips-signatures?filter=(name eq '+"'"+ipsSigName+"')",
          type: 'GET',
          headers: {
          Accept: 'application/vnd.juniper.sd.ips-signature-management.ips-signatures+json;version=1;q=0.01'
          },
          success: function (data) {
            callbackForIPSSig(data);
          },
          error: function () {
            console.log("call to fetch ips-signature is failed");
          }
        });
    },

    showEvents: function(ruleIds) {
      var me = this,
          rule = me.get(ruleIds),
          srcZone = rule.get('source-zone'),
          destZone = rule.get('destination-zone');

      //Filter Creation for policy name and event category
      var filterObj  =  {
        and : [{
              filter : {
                key: "event-category",
                operator: "EQUALS",
                value: "ips"
            }
          }
        ]
      };

      return BaseCollection.prototype.showEvents.call(this, {
        srcZone: srcZone,
        destZone: destZone,
        filterObj: filterObj
      });
    }

  });

  return RuleCollection;
});

