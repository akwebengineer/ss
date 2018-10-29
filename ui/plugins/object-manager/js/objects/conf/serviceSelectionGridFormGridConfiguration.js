/**
 * A configuration object with the parameters required to build 
 * a grid for services
 *
 * @module serviceSelectionGridFormGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../models/serviceCollection.js',
    '../../../../ui-common/js/common/restApiConstants.js',
    '../../../../ui-common/js/common/gridConfigurationConstants.js'
], function (Collection, RestApiConstants, GridConfigurationConstants) {
    var Configuration = function(context) {

        this.getValues = function(filter) {
            var collection = new Collection();

            return {
                "tableId": "service-selection-grid-table",
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
                "jsonRoot": "services.service",
                "jsonId": "id",
                "jsonRecords": function(data) {
                    return data.services[RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.service-management.services+json;version=1;q=0.01'
                    }
                },
                "filter": {
                    searchUrl: function (value, url){
                        return url + "?filter=(global eq '"+ value +"')";
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
                        "label": context.getMessage('name'),
                        "width": 200
                    }
                ]
            };
        };
    };

    return Configuration;
});
