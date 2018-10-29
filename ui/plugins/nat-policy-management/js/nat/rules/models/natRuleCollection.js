/**
 * A Backbone Collection to be used by the Rule grids for rules model.
 *
 * @module ruleCollection
 * @author mdevabhaktuni
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  '../../../../../base-policy-management/js/policy-management/rules/models/baseRuleCollection.js',
  './natRuleModel.js',
  '../constants/natRuleGridConstants.js'
], function (BaseCollection, RuleModel, PolicyManagementConstants) {

  /**
   * NatRules Collection definition.
   */
  var RuleCollection = BaseCollection.extend({
    model: RuleModel,

    policyManagementConstants: PolicyManagementConstants,
    /**
     *
     * @param selectedRuleID
     * @param direction
     */
    addRule: function(selectedRuleID, direction, natType) {
      var me = this, ruleAddInfo = {
            ruleAddInfo: {
              direction: direction,
              type: natType,
              referenceRuleID: selectedRuleID
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
              me.highlightRule("afterCreateRule",{ruleIds: [model["nat-rule"][me.policyManagementConstants.JSON_ID]], isRowEditable: true});
            },
            error: function (model, response, options) {
              //UtilityClass.showErrorDialogue(firewallPolicyObject.name, actionObject.action, response, self);
              ++(actionObject.errorCounter);
              if(model) {
                new Slipstream.SDK.Notification()
                  .setText(me.context.getMessage(model.responseText))
                  .setType('error')
                  .notify();
              }    
            }
          };
      me.sync("create", new me.model(ruleAddInfo), options);
    },

    fetchArpEntries : function(value,policyId,ruleId,onSuccess,onError,merge) {
        var me = this,
            idArr = [];
        idArr.push(value);
        var dataObj = {'id-list': 
                        {
                            'ids': idArr
                        }
                      };
          $.ajax({
              url : me.policyManagementConstants.POLICY_URL + policyId + me.policyManagementConstants.RULE_DRAFT +"/"+ ruleId + 
                    me.policyManagementConstants.RULE_ARP_ENTRIES + '?cuid=' + me.cuid,
              type:'POST',
              data: JSON.stringify(dataObj),
              dataType: "json",
              headers: {
                "Content-Type": me.policyManagementConstants.RULE_CONTENT_HEADER,
                "accept" : me.policyManagementConstants.RULE_ACCEPT_HEADER
              },
              success :function(data) {
                onSuccess(data,merge);
              },
              error : onError
        });
    },

    showEvents: function(ruleIds) {
      var me = this,
          rule = me.get(ruleIds),
          ruleName = rule.get('name'),
          originalPacket = rule.get('original-packet'),
          natType = rule.get('nat-type').toLowerCase(),
          srcZone = [],
          destZone = [];

      //Filter Creation for Rule name and event category
      var filterObj  =  {
        and : []
      };

      //Creating filters for Nat Source/Static/Destination Rule Name
      if(!_.isEmpty(natType)){
        var srcNatRuleName = {
            filter : {
                key: "src-nat-rule-name",
                operator: "EQUALS",
                value: ruleName
            }
        };

        var destNatRuleName = {
            filter : {
                key: "dst-nat-rule-name",
                operator: "EQUALS",
                value: ruleName
            }
        };

        if(natType === "source") {
            filterObj.and.push(srcNatRuleName);
        } else if(natType === "static") {
            filterObj.or = [];
            filterObj.or.push(srcNatRuleName);
            filterObj.or.push(destNatRuleName);
        } else if(natType === "destination") {
            filterObj.and.push(destNatRuleName);
        }
      }

      //Filter Creation for event category
      var eventCategory = {
          filter : {
              key: "event-category",
              operator: "EQUALS",
              value: "firewall" //NAT is not an event category. Use Firwall and provide the nat rule name
          }
      };
      filterObj.and.push(eventCategory);

      if(originalPacket) {
          srcType = originalPacket['src-traffic-match-type'];
          destType = originalPacket['dst-traffic-match-type'];

          if(srcType === "ZONE"){
            if(originalPacket['src-traffic-match-value'] && !_.isEmpty(originalPacket['src-traffic-match-value']['src-traffic-match-value'])) {
                var srcZoneArray = originalPacket['src-traffic-match-value']['src-traffic-match-value'];
                //mutate the zone object to introduce zone-type
                _.each(srcZoneArray, function(value, key, obj) {
                  obj[key] = {'name': value, 'zone-type':'ZONE'};
                });
                srcZone = srcZone.concat(srcZoneArray);
            }
            if(originalPacket['src-zone-sets'] && !_.isEmpty(originalPacket['src-zone-sets']['reference'])) {
                var srcZoneSetArray = originalPacket['src-zone-sets']['reference'];
                //mutate the zone object to introduce zone-type
                _.each(srcZoneSetArray, function(value, key, obj) {
                  obj[key] = {'id': value.id, 'name': value.name, 'zone-type':'ZONESET'};
                });
                srcZone = srcZone.concat(srcZoneSetArray);
            }
          } else {
              //srcZone.push({name: "Any", 'zone-type':'ZONE'});
          }

          if(destType === "ZONE"){
            if(originalPacket['dst-traffic-match-value'] && !_.isEmpty(originalPacket['dst-traffic-match-value']['dst-traffic-match-value'])) {
                var dstZoneArray = originalPacket['dst-traffic-match-value']['dst-traffic-match-value'];
                //mutate the zone object to introduce zone-type
                _.each(dstZoneArray, function(value, key, obj) {
                  obj[key] = {'name': value, 'zone-type':'ZONE'};
                });
                destZone = destZone.concat(dstZoneArray);
            }
            if(originalPacket['src-zone-sets'] && !_.isEmpty(originalPacket['dst-zone-sets']['reference'])) {
                var dstZoneSetArray = originalPacket['dst-zone-sets']['reference'];
                //mutate the zone object to introduce zone-type
                _.each(dstZoneSetArray, function(value, key, obj) {
                  obj[key] = {'id': value.id, 'name': value.name, 'zone-type':'ZONESET'};
                });
                destZone = destZone.concat(dstZoneSetArray);
              }
          } else {
              //destZone.push({name: "Any", 'zone-type':'ZONE'});
          }
      }

      return BaseCollection.prototype.showEvents.call(this, {
        srcZone: srcZone,
        destZone: destZone,
        filterObj: filterObj
      });
    }

  });

  return RuleCollection;
});

