/**
 * A configuration object with the parameters required to build
 * a grid for Firewall Policy in Create Policy Analysis Report
 *
 *  @module ReportsDefinition
 *  @author Shini <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */

define(['../../../ui-common/js/common/restApiConstants.js'], function (RestApiConstants) {

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "tableId":"policies_reports_tableID",
                "url": '/api/juniper/sd/policy-management/firewall/policies',
                "type": 'GET',
                "dataType": "json",
                "jsonId": "id",
                "ajaxOptions": {
                    headers: {
                        "Accept": 'application/vnd.juniper.sd.policy-management.firewall.policies+json;version="2"'
                    }
                },

                "jsonRoot": "policies.policy",
                "jsonRecords": function(data) {
                    return data['policies'][RestApiConstants.TOTAL_PROPERTY];
                },
                "scroll": "true",
                "numberOfRows": 9999,
                "height": "100px",
                "singleselect": "true",
                "onSelectAll": false,
                "contextMenu": {},
                "repeatItems": "false",
                "columns": [
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage("grid_column_name"),
                        "width": 200
                    },{
                        "index": "policy-type",
                        "name": "policy-type",
                        "label": context.getMessage("grid_column_type"),
                        "width": 100,
                        "sortable" : false
                    },{
                        "index": "policy-state",
                        "name": "policy-state",
                        "label": context.getMessage("grid_column_policyState"),
                        "width": 100,
                        "sortable" : false
                    },/*{
                        "index": "domain-name",
                        "name": "domain-name",
                        "label": context.getMessage("fw_policyGrid_column_domainName"),
                        "width": 100
                    },*/ {
                       "index": "id",
                       "name": "id",
                       "label": context.getMessage("grid_column_id"),
                       "hidden": true,
                       "width" : 80
                    }]
            };
        };
    };

    return Configuration;
});
