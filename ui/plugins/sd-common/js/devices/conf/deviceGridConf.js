/**
 * Created by wasima on 7/17/15.
 */

define([
    './devicesGridConfigurationColumn.js',
    '../../../../ui-common/js/common/restApiConstants.js'
], function(ColumnConfig, RestApiConstants) {
    var Configuration = function(context, params) {
        this.getValues = function(config) {

            var columnConfig = (new ColumnConfig(context)).getValues();

            columnConfig= _.filter(columnConfig, function(el) { 
              return (el.index === "id" || el.index === "device-id" || el.index === "name" || el.index === "domain-id" || el.index === "platform"
                || el.index === "device-ip" || el.index === "connection-status" || el.index === "configuration-status");
            });

            var namedata = _.findWhere(columnConfig,{index:'name'});
            if (namedata) {
               namedata.width = 270;
            }

            return {
                "tableId": "policy-devices",
                "url" : params.devicesForPolicyURLRoot,
                "jsonRoot": "devices.device",
                "jsonId": "id",
                "jsonRecords": function( data ) {
                  return data [ 'devices' ] [ RestApiConstants.TOTAL_PROPERTY ];
                },
                "ajaxOptions": {
                    headers: {                       
                        "Accept": params.devicesForPolicyAcceptHeader
                    }
                },
                "numberOfRows": 20,
                "height": "350px",
                "scroll": true,
                "columns": columnConfig,
                "filter": {
                    searchUrl: true,
                    columnFilter: true,
                    showFilter: false,
                    optionMenu: {
                        "showHideColumnsItem": {},
                        "customItems": []
                    }
                }
            }
        };
    };

    return Configuration;

});
