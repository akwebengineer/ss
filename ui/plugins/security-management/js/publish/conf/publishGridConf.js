/**
 *  A configuration object for Publish Policy Device Grid
 *  @module publish policy
 *  @author vinay<vinayms@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define([
    '../../../../ui-common/js/common/restApiConstants.js'
], function (RestApiConstants) {

    var Configuration = function(context, publish) {

        this.getPublishDevicesGridConfig = function(option){

            var isVPN, formatDisplayName, publishRequiredFormatter, getConfigurationStatus, getConnectionStatus, formatServicesObject,formatServicesObjectData, getFilterHelp, getDeviceFetchURL, viewConfigurationLinkConstructor;
            /**
             * [isVPN description]
             * @return {Boolean} [check if the selected service is VPN]
             */
            isVPN = function(){
              return option.serviceType === 'vpn';
            };
            /**
             *  format/ append hub before display of the device name for VPN Publish only
             *  @params cellValue, options, rowObject
             *  returns String name
             */
             formatDisplayName = function(cellValue, options, rowObject) {
                 if(isVPN() && rowObject.hub){
                     cellValue = cellValue + " [Hub]";
                 }
                 return cellValue;
            };
            publishRequiredFormatter = function (cellValue, options, rowObject) {
              return cellValue === true ? 'Required' : 'Not Required';
            };
            /**
             *  format/ append image before display of the Configuration Status
             *  @params cellValue, options, rowObject
             *  returns html [image + string]
             */
             getConfigurationStatus  = function(cellValue) {
                var img = "transparent.png";
                if ( cellValue === "In Sync" || cellValue === "In RMA" ) {
                    img = 'icon_device_managed_status_in_sync.svg';
                }
                else if ( cellValue === "Sync Failed" || cellValue === "Out Of Sync" || cellValue === "Reactivate Failed" ) {
                    img = 'icon_device_managed_status_sync_failed.svg';
                }
                return '<img id="device_managed_status_' + cellValue + '" width="12px" height="14px" src="' + context.ctx_root + '/images/' + img + '"/> <span>' + cellValue + '</span>';
            };

            /**
             *  format/ append image before display of the Connection Status
             *  @params cellValue, options, rowObject
             *  returns html [image + string]
             */
             getConnectionStatus  = function(cellValue) {
                return '<img id="device_connection_status_' + cellValue + '" width="12px" height="14px" src="' + context.ctx_root + '/images/transparent.png"/> <span>' + cellValue + '</span>';
            };

            /**
             *  format service object before display of the servies 
             *  @params cell cellValue, options, rowObject
             *  returns services string
             */
             formatServicesObject = function (cell, cellValue, options, rowObject) {
                if (rowObject && cellValue ) {
                    var formattedCell = '';
                    $(cell).each(function (i, ele) {
                      if(isVPN()){
                        formattedCell += $(ele)[0].outerHTML.replace("[Delete]", "<span style='color:red;'> [Delete]</span>");
                      } else{
                        formattedCell += $(ele)[0].outerHTML;
                      }
                      
                    });
                    cell = formattedCell;
                }
              return cell;
            };

             formatServicesObjectData = function (cellValue, cell, options, rowObject) {
               
              var valueList = [];
              if(!cellValue || cellValue.length == 0){
                return "";
              } 
              if(!cellValue.length){
                var service = cellValue;
                cellValue = []
                cellValue.push(service);
              }
              
              cellValue.forEach( function( service ) {
                var serviceName = service["name"];
                if(service.deploymentType === "Delete" && isVPN()){
                  service = serviceName + "[Delete]";
                }
                valueList.push(service);
              } );
              
              return valueList;
            },

            /**
             *  display view configuration link only on device status up
             *  @params cell cellValue, options, rowObject
             *
             *  returns string View Configuration link
             */
            viewConfigurationLinkConstructor = function(cell, cellValue, options){
                deviceViewConfiguration = function (id, name,serviceIDs) {
                    publish.deviceViewConfiguration({id:id,name:name,serviceIDs:serviceIDs});
                };
                if(options.connectionStatus === 'up'){
                    var serviceIDs = "",i=0;
                    (options.services).forEach(function (object) {
                        serviceIDs += (i>0?",":"") + object.moid.split(":")[1];
                        i++;
                    });

                    return "<a onclick=deviceViewConfiguration("+options.id+",'"+options.name+"','"+serviceIDs+"')>View</a>";
                }else {
                    return 'Not Available';
                }
            };

            /**
             *  filter help msg
             *  returns helpText string
             */
            getFilterHelp = function(){
                return 'Search based on Name and Device IP only';
            };
            selectAll = function (setIdsSuccess, setIdsError, searchData, deviceListQueryParams) {
                //setIdsSuccess([688144, 131093, 131101]);
                var url, qString = "";
                console.log('grid filters');
                switch(option.serviceType) {
                case 'vpn' :
                  url = '/api/juniper/sd/vpn-management/provisioning/devices-for-publish/select-all';
                  break;
                case 'firewall' :
                  url = '/api/juniper/sd/policy-management/firewall/provisioning/devices-for-publish/select-all';
                  break;
                case 'ips' :
                  url = '/api/juniper/sd/policy-management/ips/provisioning/devices-for-publish/select-all';
                  break;
                case 'nat' : 
                  url = '/api/juniper/sd/policy-management/nat/provisioning/devices-for-publish/select-all';
                  break;
                }
                url = url + '?publish_policy_uuid=' + option.uuId + '&' + option.policyIds;
                
                if(deviceListQueryParams._search !== undefined){
                  qString += "&_search="+deviceListQueryParams._search;
                }
                if(deviceListQueryParams.search !== undefined){
                  qString += "&search="+deviceListQueryParams.search;
                }  
                /*if(deviceListQueryParams.sord !== undefined){
                  qString += "&sord="+deviceListQueryParams.sord; 
                }
                if(deviceListQueryParams.sortby !== undefined) {
                  qString += "&sortby="+deviceListQueryParams.sortby;
                }*/

                // when searching for devices and click select all checkbox
                url = url + qString;
                $.ajax({
                    method: 'GET',
                    dataType:'json',
                    headers: { 
                      'accept': 'application/vnd.juniper.sd.select-all-ids+json;version=1;q=0.01'
                    },
                    url: url,
                    success: function(data) {
                      var ids = [];
                      if(data['id-list'] && data['id-list']['ids']) {
                        ids = data['id-list']['ids'];
                      }
                      setIdsSuccess(ids);
                    },
                    error: function() {
                      setIdsError("Getting all row ids in the grid FAILED.");
                    }
                });
              };
            /**
             *  builds the URL for fetching devices based on the serviceType
             *  returns url string
             */
             getDeviceFetchURL = function(){
                var url = "";
                if(isVPN()){
                    url = '/api/juniper/sd/vpn-management/provisioning/devices-for-publish';
                } else{
                    url = '/api/juniper/sd/policy-management/'+ option.serviceType +'/provisioning/devices-for-publish';
                }
                return url;
            };
            this.setShowHideColumnSelection= function (columnSelection){
                return columnSelection;
            };
            return {
                "tableId":"publish_affected_device_grid",
                "numberOfRows":50,
                "scroll": true,
                "repeatItems": true, 
                "onSelectAll" : selectAll,
                "multiselect" : isVPN() ? false : true,
                "url": getDeviceFetchURL() +'?publish_policy_uuid=' +option.uuId,
                "beforeSendRequest": function (url) {
                    return (url + '&' + option.policyIds);
                },
                "ajaxOptions": {
                    headers: {
                        "Accept": 'application/vnd.juniper.sd.provisioning.deployment-device-list+json;version=1;q=0.01'
                    },
                    complete:function(data){
                      option.activity.onGridDataLoadCheckForDevices(data.responseJSON.devices.device);
                    }
                },
                "filter-help": {
                    "content": getFilterHelp,
                    "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
                },
                "filter": {
                    searchUrl: function (value, url){
                        return url + "&search=" + value;
                   },
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
                "sorting": [
                  {
                    "column": "republishRequired",
                    "order": "desc"
                  }
                ],
                "columns": [{
                    "index": "deviceMOID",
                    "name": "deviceMOID",
                    "hidden": true
                },{
                    "index": "id",
                    "name": "id",
                    "hidden": true
                },{
                    "index":"displayName",
                    "name":"displayName",
                    "label":context.getMessage('policy_devices_grid_column_name'),
                    "width":130,
                    "sortable" : false,
                    "formatter": formatDisplayName
                },
                {
                  "index":"republishRequired",
                  "name":"republishRequired",
                  "label":context.getMessage('sd.publish.devicesgrid.column.publishRequired'),
                  "width": 110,
                  "hidden" : isVPN() ? true : false,
                  "sortable" : false,
                  "formatter": publishRequiredFormatter
                },
                {
                  "index":"connectionStatus",
                  "name":"configuration",
                  "label":context.getMessage('policy_devices_grid_column_configuration'),
                  "width":95,
                  "sortable" : false,
                  "formatter": viewConfigurationLinkConstructor
                },
                {
                  "index":"configurationStatus",
                  "name":"configurationStatus",
                  "label":context.getMessage('policy_devices_grid_column_managed_status'),
                  "width":110,
                  "sortable" : false,
                  "formatter": getConfigurationStatus
                },
                {
                  "index":"connectionStatus",
                  "name":"connectionStatus",
                  "label":context.getMessage('policy_devices_grid_column_connection_status'),
                  "width":120,
                  "sortable" : false,
                  "formatter": getConnectionStatus
                },
                {
                  "index":"services",
                  "name":"services",
                  "label":context.getMessage('policy_devices_grid_column_services'),
                  "width":140,
                  "sortable" : false,
                  "collapseContent": {
                      "name": "name",
                      "formatData": formatServicesObjectData,
                      "formatCell": formatServicesObject,
                      "overlaySize": "large"
                  }
                },
                {
                   "index":"domainName",
                   "name":"domainName",
                   "label":context.getMessage('policy_devices_grid_column_domain'),
                   "sortable" : false,
                   "width":100
                },
                {
                    "index":"displayName",
                    "name":"name",
                    "hidden":true
                },{
                    "index":"deviceIP",
                    "name":"deviceIP",
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
                    "name":"softwareRelease",
                    "label":context.getMessage('policy_devices_grid_column_osversion'),
                    "sortable" : false,
                    "width":130
                }]
            };
        };

    };

    return Configuration;
});
