/**
 * A configuration object with the parameters required to build 
 * a grid for nat pools
 *
 * @module natPoolsSelectionGridFormGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../models/natPoolsCollection.js',
    '../../../../../nat-policy-management/js/nat/common/constants/natPolicyManagementConstants.js',
    '../../../../../ui-common/js/common/restApiConstants.js'
], function (Collection, NATPolicyManagementConstants, RestApiConstants) {

    var Configuration = function(context) {

        this.getValues = function(filter) {
            var collection = new Collection();

            return {
                "tableId": "nat-pools-selection-grid-table",
                "numberOfRows": 20,
                "height": "300px",
                "sorting": [
                    {
                        "column": "name",
                        "order": "asc"
                    }
                ],
                "repeatItems": "true",
                "onSelectAll": false,
                "singleselect": "true",
                "scroll": true,
                "url": collection.url(filter),
                "jsonRoot": "nat-pools.nat-pool",
                "jsonId": "id",
                "jsonRecords": function(data) {
                    return data['nat-pools'][RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": NATPolicyManagementConstants.NAT_POOLS_ACCEPT_HEADER
                    }
                },
                "filter": {//TODO check what filter needs to be added
                    searchUrl: function (value, url){
                        return url;// + "?filter=(global eq '"+ value +"')";
                    }
                },
                "columns": [
                    {
                        "index": "id",
                        "name": "id",
                        "hidden": true
                    },
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('name'),
                        "width": 230
                    },
                    {
                        "index": "domain-name",
                        "name": "domain-name",
                        "label": context.getMessage('grid_column_domain'),
                        "width": 200
                    }
                ]
            };
        };
    };

    return Configuration;
});
