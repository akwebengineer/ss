/**
 * A configuration object with the parameters required to build 
 * a list builder for devices in assign devices workflow
 *
 * @module assignDevicesListBuilderConfiguration
 * @author Sandhya B<sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
'../../../../../ui-common/js/common/restApiConstants.js',
'../../../../../ui-common/js/common/listBuilderCommonConstants.js',
'../../../../../sd-common/js/common/deviceNameFormatter.js'
], function (RestApiConstants,ListBuilderCommonConstants,DeviceNameFormatter) {

    var Configuration = function(context) {
        var me = this;

        me.formatDeviceName = function( cellValue, options, rowObject ){
          var deviceNameFormatter = new DeviceNameFormatter();
          return deviceNameFormatter.formatDeviceName(rowObject);
        }; 

        me.getValues = function(listBuilderModel) {
            return {
                "availableElements": {
                    "url": listBuilderModel.getAvailableUrl(),
                    "jsonRoot": "devices.device",
                    "totalRecords": "devices." + RestApiConstants.TOTAL_PROPERTY,
                    "urlParameters" : {"policy-type":"GROUP"}
                },
                "selectedElements": {
                    "url": listBuilderModel.getSelectedUrl(),
                    "jsonRoot": "devices.device",
                    "totalRecords": "devices." + RestApiConstants.TOTAL_PROPERTY,
                    "hideSearchOptionMenu": true
                },
                "search": {
                  //this is for LHS filtering URL
                    "url": function (currentPara, value){
                        console.log(value);
                        if (value){
                            return _.extend(currentPara, {'_search' : value});
                        } else {
                          delete currentPara._search;
                          return currentPara;
                        }
                    }
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": listBuilderModel.availableAccept
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
                    "hidden": true,
                    "sortable":false
                }, {
                    "index": "name",
                    "name": "name",
                    "label": "Name",
                    "width": ListBuilderCommonConstants.COLUMN_NAME_WIDTH,
                    "sortable":false,
                    "formatter" : $.proxy(me.formatDeviceName,me)
                }, {
                    "index": "domain-name",
                    "name": "domain-name",
                    "label": "Domain",
                    "width": ListBuilderCommonConstants.COLUMN_DOMAIN_WIDTH,
                    "sortable":false
                }]
            };
        };
    };

    return Configuration;
});