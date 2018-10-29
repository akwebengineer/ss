/**
 
 */

define([
'../../../../../fw-policy-management/js/firewall/rules/constants/fwRuleGridConstants.js',
'../../../../../ui-common/js/common/restApiConstants.js'
], function (PolicyManagementConstants, RestApiConstants) {

    var compareConfiguration = function (context,obj) {

    
        // Grid to show on Policy Page
        this.policyGrid = function () {
            return {
                "title": "",
                "tableId": "compare_grid",
                "jsonRoot": "policies.policy",
                "jsonRecords": function (data) {
                    var arr = data['policies']['policy'];
                    data['policies']['policy']= _.reject(arr, function(el) { 
                       return (el.id == obj.id);
                    });
                    return data['policies'][RestApiConstants.TOTAL_PROPERTY];
                },
                "contextMenu": {
                    "edit": context.getMessage("fw_policyGrid_contextMenu_edit"),
                    "delete": context.getMessage("fw_policyGrid_contextMenu_delete")
                },
                "numberOfRows": 50,
                "height": "500px",
                "singleselect": "true",
                "columns": [
                    {
                        "index": "id",
                        "name": "id",
                        "label": context.getMessage("grid_column_id"),
                        "hidden": true,
                        "width": 200
                    },
                    {
                        "index": "domain-id",
                        "name": "domain-id",
                        "label": context.getMessage("fw_policyGrid_column_domainID"),
                        "hidden": true,
                        "width": 100
                    },
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage("grid_column_name"),
                        "width": 200,
                        "sortable":true
                    },
                    {
                        "index": "type",
                        "name": "type",
                        "label": context.getMessage("grid_column_type"),
                        "width": 200
                    },
                    {
                        "index": "policy-state",
                        "name": "policy-state",
                        "hidden": true,
                        "label": context.getMessage("grid_column_policyState"),
                        "width": 200,
                        "sortable":true
                    },
                    {
                        "index": "domain-name",
                        "name": "domain-name",
                        "label": context.getMessage("fw_policyGrid_column_domainName"),
                        "width": 200
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage("grid_column_description"),
                        "width": 200
                    }
                ]
            };
        };
    };

    return compareConfiguration;
});
