/**
 * A configuration object with the parameters required to build
 * a grid for policy sequence
 *
 * @module policySequenceGridConfiguration
 * @author Swathi Nagaraj <swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
'../../../../../ui-common/js/common/restApiConstants.js'
], function (RestApiConstants) {
    var Configuration = function(context,policyRecord) {

        this.isRowEditable = function(rowId, rowRecord){
            if(policyRecord && policyRecord.id) {
                if(policyRecord.id === rowRecord.id){
                    return true;
                }
            }
            if(!rowRecord.id || rowRecord.id == 0)
                return true;
            return false;
        };

        this.formatNameCell = function(cellValue, options, rowObject) {
            if(policyRecord && policyRecord.id) {
                if(policyRecord.id === rowObject.id){
                    return policyRecord.name;
                }
            }
            if(!rowObject.id)
                return policyRecord.name;
            return cellValue;
        };

        this.formatDomainNameCell = function(cellValue, options, rowObject) {
          return Juniper.sm.DomainProvider.getDomainName(rowObject["domain-id"]);
        };

        this.getValues = function () {
            var me = this;

            return {
               
                "tableId": "policy_sequence_table",
                "jsonRoot": "policies.policy",
                "datatype": "local",
                "jsonId": "id",
                "numberOfRows": 100,
                "height": "auto",
                "singleselect": "true",
                "onSelectAll": false,
                "footer":false,
                "editRow": {
                    "showInline": true,
                    "isRowEditable": $.proxy(me.isRowEditable, me)
                },
                "columns": [
                    {
                        "index": "id",
                        "name": "id",
                        "label": context.getMessage("grid_column_id"),
                        "hidden": true,
                        "width": 50
                    },
                    {
                        "index": "domain-id",
                        "name": "domain-id",
                        "label": context.getMessage("nat_policyGrid_column_domainID"),
                        "hidden": true,
                        "width": 50
                    },
                    {
                        "index": "sequence-number",
                        "name": "sequence-number",
                        "label": context.getMessage("grid_column_seq"),
                        "width": 58,
                        "editCell": {
                            "type": "input",
                            "post_validation": "postSequenceValidation",
                            "pattern": "^([1-9][0-9]*)$",
                            "error": context.getMessage("grid_column_seq_error")
                        }
                    },
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage("grid_column_name"),
                        "width": 200,
                        "formatter": $.proxy(me.formatNameCell, me)
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage("grid_column_description"),
                        "width": 200
                    },
                    {
                        "index": "domain",
                        "name": "domain-name",
                        "label": context.getMessage('grid_column_domain'),
                        "width": 100,
                        "formatter" : $.proxy(me.formatDomainNameCell,me),
                        "sortable":false
                    },
                    {
                        "index":"policy-order",
                        "name" : "policy-order",
                        "hidden": true,
                        "label": context.getMessage("grid_column_policyState"),
                        "width": 300
                    }
                    ],
                    "actionButtons":me.getActionButtons(),
                    "contextMenu" : {}
            };
        };

        this.getActionButtons  = function() {
          var me = this;
          var actionButtons = {
            "customButtons":[{
                "button_type": true,
                "label": context.getMessage("policyGrid_contextMenu_move_policy_up"),
                "key": "movePolicyUpEvent",
                "secondary": true
            },
            {
                "button_type": true,
                "label": context.getMessage("policyGrid_contextMenu_move_policy_down"),
                "key": "movePolicyDownEvent",
                "secondary": true
            }]
          };
          return actionButtons;
        };
    };

    return Configuration;
});
