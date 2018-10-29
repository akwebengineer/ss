/**
 * A configuration object with the parameters required to build 
 * a list builder for Source Identities
 *
 * @module sourceIDConfiguration
 * @author Judy Nguyen <jnguyen@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
'../../../../../ui-common/js/common/restApiConstants.js'
], function (RestApiConstants) {

    var Configuration = function(context) {
        // var GROUP_FLAG = " (group)",
        //     IP_ADDRESS = 'IPADDRESS',
        //     GROUP = 'GROUP';

        // var formatName = function (cellValue, options, rowObject) {
        //     if (rowObject['address-type'] == IP_ADDRESS && rowObject['ip-address']) {
        //         return cellValue + ' (' + rowObject['ip-address'] + ')';
        //     } else if (rowObject['address-type'] == GROUP) {
        //         return cellValue + GROUP_FLAG;
        //     } else {
        //         return cellValue;
        //     }
        // };

        this.getValues = function(listBuilderModel) {

            return {
                "availableElements": {
                    "url": listBuilderModel.getAvailableUrl(),
                    "jsonRoot": "SrcIdentityList.srcIdentities",
                    "totalRecords": "SrcIdentityList." + RestApiConstants.TOTAL_PROPERTY
                },
                "selectedElements": {
                    "url": listBuilderModel.getSelectedUrl(),
                    "jsonRoot": "SrcIdentityList.srcIdentities",
                    "totalRecords": "SrcIdentityList." + RestApiConstants.TOTAL_PROPERTY,
                    "hideSearchOptionMenu": true
                },
                "search": {
                    "url": function (currentPara, value){
                        console.log(value);
                        return _.extend(currentPara, {_search:value});
                    }
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.firewall-policies-draft.src-identities+json;version=1;q=0.01'
                    }
                },
                "pageSize": 10,
                "id": "SrcIdentityList",
                "jsonId": "name",
                "height": '200px',
                "columns": [
                {
                    "index": "id",
                    "name": "id",
                    "hidden": true
                }, {
                    "index": "name",
                    "name": "name",
                    "label": context.getMessage('grid_column_name'),
                    "width": 200,
                    "sortable":false
                    // "formatter": formatName
                // }, {
                //     "index": "domain-name",
                //     "name": "domain-name",
                //     "label": context.getMessage('grid_column_domain'),
                //     "width": 120
                }]
            };
        };
    };

    return Configuration;
});
