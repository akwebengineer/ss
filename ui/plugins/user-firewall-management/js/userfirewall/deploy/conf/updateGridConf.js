/**
 *  A configuration object for Update User Firewall Device Grid
 *  @module User Firewall
 *  @author svaibhav
 *  @copyright Juniper Networks, Inc. 2015
 * */
define([
    '../../../../../ui-common/js/common/restApiConstants.js',
    '../../constants/userFirewallConstants.js',
    '../../../../../ui-common/js/util/gridUtility.js'
], function (RestApiConstants,
            UserFwConstatnts,
            GridUtility) {

    var Configuration = function(context, update) {

            var objId,objType ;

            /**
             *  format/ append image before display of the Configuration Status
             *  @params cellValue, options, rowObject
             *  returns html [image + string]
             */
             this.getConfigurationStatus  = function(cellValue) {
                var img = 'image-transparent';
                if ( cellValue === "In Sync" || cellValue === "In RMA" ) {
                    img = 'icon_device_managed_status_in_sync';
                }
                else if ( cellValue === "Sync Failed" || cellValue === "Out Of Sync" || cellValue === "Reactivate Failed" ) {
                    img = 'icon_device_managed_status_sync_failed';
                }
                return "<div class="+img+">&nbsp&nbsp&nbsp&nbsp&nbsp" + cellValue + "</div>";
            };

            /**
             *  format/ append image before display of the Connection Status
             *  @params cellValue, options, rowObject
             *  returns html [image + string]
             */
            this.getConnectionStatus  = function(cellValue) {
                return "<div class='image-transparent'>&nbsp&nbsp&nbsp&nbsp&nbsp" + cellValue + "</div>";
            };

            /**
             *  display view configuration link only on device status up
             *  @params cell cellValue, options, rowObject
             *
             *  returns string View Configuration link
             */
            this.viewConfigurationLinkConstructor = function(cell, cellValue, options){
                deviceViewConfiguration = function (id, name,objectId) {
                    update.deviceViewConfiguration({id:id,name:name,objectId:objectId});
                };
                if(options['connection-status'] === 'up'){
                    return "<a onclick=deviceViewConfiguration("+options.id+",'"+options.name+"','"+update.objId+"')>View</a>";
                }else {
                    return 'Not Available';
                }
            };

            /**
             *  filter help msg
             *  returns helpText string
             */
            this.getFilterHelp = function(){
                return 'Search based on Name and Device IP only';
            };
            this.gridUtility = new GridUtility();
            this.selectAll = function (setIdsSuccess, setIdsError, searchData, deviceListQueryParams) {
                var url, qString = "";
                console.log('grid filters');
                url= UserFwConstatnts[update.objType].DEVICE_FETCH_URL.replace('{0}',update.objId);
                if(deviceListQueryParams._search !== undefined){
                  qString += "?_search="+deviceListQueryParams._search;
                  url = url + qString;
                }
                if(deviceListQueryParams.search !== undefined){
                  qString += "?search="+deviceListQueryParams.search;
                  url = url + qString;
                }
                this.gridUtility.getRowIds(setIdsSuccess, setIdsError, searchData, deviceListQueryParams, url);
             };

            /**
             *  builds the URL for fetching devices based on the Object Type
             *  returns url string
             */
             this.getDeviceFetchURL = function(){
                return UserFwConstatnts[this.objType].DEVICE_FETCH_URL.replace('{0}',this.objId);
            };

             this.getDeviceFetchAcceptHeader = function(option){
                return  UserFwConstatnts[this.objType].DEVICE_FETCH_ACCEPT;
            };

            this.setShowHideColumnSelection= function (columnSelection){
                return columnSelection;
            };

    this.getUpdateDevicesGridConfig = function(option){
               this.objType= option.objType;
               this.objId= option.objId;
            return {
                "tableId":"update_affected_device_grid",
                "numberOfRows":50,
                "scroll": true,
                "repeatItems": true, 
                "onSelectAll" : $.proxy(this.selectAll,this),
                "multiselect" : true,
                "url": this.getDeviceFetchURL(),
                "ajaxOptions": {
                    headers: {
                        "Accept": this.getDeviceFetchAcceptHeader()
                    },
                    complete:function(data){
                      if(data.responseJSON!==undefined){
                      option.activity.onGridDataLoadCheckForDevices(data.responseJSON.devices.device);
                      }
                    }
                },
                "filter-help": {
                    "content": this.getFilterHelp,
                    "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
                },
                "filter": {
                    searchUrl : true,
                   optionMenu: {
                        "showHideColumnsItem": {
                             "setColumnSelection": this.setShowHideColumnSelection
                        },
                        "customItems":[]
                    }
                },  
                "jsonRoot": "devices.device",
                "jsonRecords": function(data) {
                    return data['devices'][RestApiConstants.TOTAL_PROPERTY];
                },
                "contextMenu": {},
                "columns": [{
                    "index": "deviceMOID",
                    "name": "deviceMOID",
                    "hidden": true
                },{
                    "index": "id",
                    "name": "id",
                    "hidden": true
                },{
                    "index":"name",
                    "name":"name",
                    "label":context.getMessage('policy_devices_grid_column_name'),
                    "width":130,
                    "sortable" : false
                },
                {
                  "index":"connectionStatus",
                  "name":"configuration",
                  "label":context.getMessage('policy_devices_grid_column_configuration'),
                  "width":95,
                  "sortable" : false,
                  "formatter": this.viewConfigurationLinkConstructor
                },
                {
                  "index":"configurationStatus",
                  "name":"configuration-status",
                  "label":context.getMessage('devices_grid_column_configurationstate'),
                  "width":120,
                  "sortable" : false,
                  "formatter": this.getConfigurationStatus
                },
                {
                  "index":"connectionStatus",
                  "name":"connection-status",
                  "label":context.getMessage('policy_devices_grid_column_connection_status'),
                  "width":120,
                  "sortable" : false,
                  "formatter": this.getConnectionStatus
                },
                {
                   "index":"domainName",
                   "name":"domain-name",
                   "label":context.getMessage('policy_devices_grid_column_domain'),
                   "sortable" : false,
                   "width":90
                },
                {
                    "index":"deviceIP",
                    "name":"device-ip",
                    "label":context.getMessage('policy_devices_grid_column_deviceip'),
                    "sortable" : false,
                    "width":100
                },{
                    "index":"platform",
                    "name":"platform",
                    "label":context.getMessage('policy_devices_grid_column_platform'),
                    "sortable" : false,
                    "width":90
                },{
                    "index":"softwareRelease",
                    "name":"software-release",
                    "label":context.getMessage('policy_devices_grid_column_osversion'),
                    "sortable" : false,
                    "width":130
                }]
            };
        };

    };

    return Configuration;
});
