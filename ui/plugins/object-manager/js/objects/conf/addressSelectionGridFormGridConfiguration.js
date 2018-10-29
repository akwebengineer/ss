/**
 * A configuration object with the parameters required to build 
 * a grid for addresses
 *
 * @module addressSelectionGridFormGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
'../models/addressCollection.js',
'../../../../ui-common/js/common/restApiConstants.js',
'../../../../ui-common/js/common/gridConfigurationConstants.js'
], function (Collection, RestApiConstants, GridConfigurationConstants) {

    var Configuration = function(context) {

        this.getValues = function(filter) {
            var collection = new Collection();

            return {
                "tableId": "address-selection-grid-table",
                "numberOfRows": GridConfigurationConstants.OVERLAY_PAGE_SIZE,
                "height": "210px",
                "sorting": [
                    {
                        "column": "name",
                        "order": "asc"
                    }
                ],
                "repeatItems": "true",
                "singleselect": "true",
                "onSelectAll": false,
                "scroll": true,
                "url": collection.url(filter),
                "jsonRoot": "addresses.address",
                "jsonId": "id",
                "jsonRecords": function(data) {
                    return data.addresses[RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.address-management.address-refs+json;version=1;q=0.01'
                    }
                },
                "filter": {
                    searchUrl: true
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
                        "label": context.getMessage('grid_column_name'),
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
