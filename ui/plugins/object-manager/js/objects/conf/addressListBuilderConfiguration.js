/**
 * A configuration object with the parameters required to build 
 * a list builder for Addresses
 *
 * @module addressConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
'../../../../ui-common/js/common/restApiConstants.js',
'../../../../ui-common/js/common/listBuilderCommonConstants.js'
], function (RestApiConstants, ListBuilderCommonConstants) {

    var Configuration = function(context) {
        var GROUP_FLAG = " (group)",
            IP_ADDRESS = 'IPADDRESS',
            GROUP = 'GROUP';

        var formatName = function (cellValue, options, rowObject) {
            if (rowObject['address-type'] == IP_ADDRESS && rowObject['ip-address']) {
                return cellValue + ' (' + rowObject['ip-address'] + ')';
            } else if (rowObject['address-type'] == GROUP) {
                return cellValue + GROUP_FLAG;
            } else {
                return cellValue;
            }
        };

        this.getValues = function(listBuilderModel) {

            return {
                "availableElements": {
                    "url": listBuilderModel.getAvailableUrl(),
                    "jsonRoot": "addresses.address",
                    "totalRecords": "addresses." + RestApiConstants.TOTAL_PROPERTY
                },
                "selectedElements": {
                    "url": listBuilderModel.getSelectedUrl(),
                    "jsonRoot": "addresses.address",
                    "totalRecords": "addresses." + RestApiConstants.TOTAL_PROPERTY,
                    "hideSearchOptionMenu": true
                },
                "search": {
                    "url": function (currentPara, value){
                        console.log(value);
                        if (_.isArray(value)){
                            return _.extend(currentPara, {searchKey:value.join(' '), searchAll:true});
                        }else{
                            return _.extend(currentPara, {searchKey:value, searchAll:true});
                        }
                    }
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.address-management.address-refs+json;version=1;q=0.01'
                    }
                },
                "sorting": [{
                    "column": "name",
                    "order": "asc"
                }],
                "pageSize": ListBuilderCommonConstants.PAGE_SIZE,
                "id": "address",
                "jsonId": "id",
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
                    "width": ListBuilderCommonConstants.COLUMN_NAME_WIDTH,
                    "sortable": false,
                    "formatter": formatName
                }, {
                    "index": "domain-name",
                    "name": "domain-name",
                    "label": context.getMessage('grid_column_domain'),
                    "width": ListBuilderCommonConstants.COLUMN_DOMAIN_WIDTH,
                    "sortable": false
                }]
            };
        };
    };

    return Configuration;
});
