/**
 * Configuration for nat policy configure rule sets 
 *
 * @module GridConfiguration
 * @author Damodhar M<mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../../nat-policy-management/js/nat/common/constants/natPolicyManagementConstants.js',
    '../../../../../ui-common/js/common/restApiConstants.js'
], function (NATPolicyManagementConstants, RestApiConstants) {

    var Configuration = function(context, options) {

        this.getValues = function(policyId) {
            var me =this;
            return {
                "tableId": "nat_policy_configure_ruleset",
                "numberOfRows": 100,
                "height": "350px",
                "repeatItems": "true",
                "scroll": true,
                "url": NATPolicyManagementConstants.getRuleSetsUrl(policyId),
                "jsonRoot": "policy-rule-set.rule-sets.rule-set",
                "jsonId": "id", 
                "jsonRecords": function(data) { 
                    return  data['policy-rule-set']['rule-sets'][RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                          "accept":NATPolicyManagementConstants.RULE_SETS_ACCEPT_HEADER
                    }
                },
                "editRow": {
                    "showInline": true
                },
                "columns": [
                   {
                        "index": "nat-type",
                        "name": "nat-type",
                        "label": "Nat Type",
                        "width": 150,
                        "sortable":false,
                        "formatter" : $.proxy(me.formatNatTypeColumn,me)
                    },
                    {
                        "index": "ingress",
                        "name": "src-match-type",
                        "label": "Ingress",
                        "width": 270,
                        "formatter" : $.proxy(me.formatIngressColumn,me),
                        "sortable":false
                    },
                    {
                        "index": "egress",
                        "name": "dst-match-type",
                        "label": "Egress",
                        "width": 270,
                        "formatter" : $.proxy(me.formatEgressColumn,me),
                        "sortable":false
                    },
                    {
                        "index": "rule-set-name",
                        "name": "rule-set-name",
                        "label":  "Rule Set Name",
                        "width": 350,
                        "sortable":false,
                        "editCell": {
                            "type": "input",
                            "pattern": "hasnotspace",
                            "error": context.getMessage("rulesGrid_column_name_errMsg")
                        }
                    }

                ]
            }
        };
        this.formatNatTypeColumn = function(cellvalue, options, rowObject) {
         cellvalue =cellvalue || "";
         return "<span class='select-disabled-with-placeholder' style='cursor: default;'>"+cellvalue+"</span>";
        };
        this.formatIngressColumn = function(cellvalue, options, rowObject) {
          var formattedValue = '';
          var srcMatchType = rowObject['src-match-type'];
          var values = "";
         // options.cellattr("editable", true);
          //options.cellattr("read", true);
          var ingressMatch = rowObject['ingress-match'] != "" ? rowObject['ingress-match']['ingress-match'] : "";
          if(srcMatchType == "" || ingressMatch == ""){
            cellvalue =cellvalue ||"";
            return "<span class='select-disabled-with-placeholder' style='cursor: default;'>"+cellvalue+"</span>";
          }
          ingressMatch = $.isArray(ingressMatch)? ingressMatch : [ingressMatch];
          ingressMatch.forEach(function (object) {
            if(values == "") {
                values = object;
            } else {
                values = values+","+object;
            }
          });
          formattedValue = (srcMatchType + '[' + values + ']')||"";
          return "<span class='select-disabled-with-placeholder' style='cursor: default;'>"+formattedValue+"</span>";
        };
        
        this.formatEgressColumn = function(cellvalue, options, rowObject) {
          var formattedValue = '';
          var dstMatchType = rowObject['dst-match-type'];
          var values = "";
          var egressMatch = rowObject['egress-match'] != "" ? rowObject['egress-match']['egress-match'] : "";
          if(dstMatchType == "" || egressMatch == "") {
            cellvalue =cellvalue || "";
            return "<span class='select-disabled-with-placeholder' style='cursor: default;'>"+cellvalue+"</span>";;
          }
          egressMatch = $.isArray(egressMatch)? egressMatch : [egressMatch];
          egressMatch.forEach(function (object) {
            if(values == "") {
                values = object;
            } else {
                values = values+","+object;
            }
          });
          formattedValue = (dstMatchType + '[' + values + ']') || "";
          return "<span class='select-disabled-with-placeholder' style='cursor: default;'>"+formattedValue+"</span>";
        };
    };

    return Configuration;

});
