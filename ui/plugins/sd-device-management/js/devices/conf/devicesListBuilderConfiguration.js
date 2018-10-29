/**
 * A configuration object with the parameters required to build 
 * a list builder for devices
 *
 * @module devicesConfiguration
 * @author Sandhya B<sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
'../../../../ui-common/js/common/restApiConstants.js',
'../../../../ui-common/js/common/listBuilderCommonConstants.js',
'../../../../sd-common/js/common/deviceNameFormatter.js'
], function (RestApiConstants, ListBuilderCommonConstants, DeviceNameFormatter) {

    var Configuration = function(context) {
        this.formatDeviceName = function( cellValue, options, rowObject ){
            var deviceNameFormatter = new DeviceNameFormatter();
            return deviceNameFormatter.formatDeviceName(rowObject);
        }; 

        this.getValues = function(listBuilderModel) {
            return {
                "availableElements": {
                    "url": listBuilderModel.getAvailableUrl(),
                    "jsonRoot": "devices.device",
                    "totalRecords": "devices." + RestApiConstants.TOTAL_PROPERTY,
                },
                "selectedElements": {
                    "url": listBuilderModel.getSelectedUrl(),
                    "jsonRoot": "devices.device",
                    "totalRecords": "devices." + RestApiConstants.TOTAL_PROPERTY,
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
                        "Accept": 'application/vnd.juniper.sd.device-management.devices+json;version=1;q=0.01'
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
                    "label": "Name",
                    "width": ListBuilderCommonConstants.COLUMN_NAME_WIDTH,
                    "sortable": false,
                    "formatter": this.formatDeviceName
                }, {
                    "index": "domain-name",
                    "name": "domain-name",
                    "label": "Domain",
                    "width": ListBuilderCommonConstants.COLUMN_DOMAIN_WIDTH,
                    "sortable": false
                }]
            };
        };
    };

    return Configuration;
});
