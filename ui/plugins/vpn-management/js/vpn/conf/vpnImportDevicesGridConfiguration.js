/**
 * Module that implements the VpnImportDeviceGridConfiguration.
 *
 * @module VpnImportDeviceGridConfiguration
 * @author anuranc <anuranc@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define(
    ['../../../../ui-common/js/common/restApiConstants.js'
    ],
    function(RestApiConstants) {
        var Configuration = function(context) {
            var formatConfigStatusColumn = function( cellValue, options, rowObject ) {

                          if(!cellValue){
                            return "";
                          }

                          var img = "transparent.png";
                          if ( cellValue == "In Sync" || cellValue == "In RMA" )
                          {
                            img = 'icon_device_managed_status_in_sync.svg';
                          }
                          else if ( cellValue == "Sync Failed" || cellValue == "Out Of Sync" || cellValue == "Reactivate Failed" )
                          {
                            img = 'icon_device_managed_status_sync_failed.svg';
                          }
              return '<img id="device_managed_status_' + cellValue + '" width="12px" height="14px" src="' + context.ctx_root + '/images/' + img + '"/> <span>' + cellValue + '</span>';

            };
            var getRowIds = function (setIdsSuccess, setIdsError, tokens, parameters) {
                 $(".shortWizardNextButton").prop('disabled',true);
                 $.ajax({
                     type: 'GET',
                     url: "/api/juniper/sd/device-management/devices/select-all?excludeLSYS=true&domainContext=(currentDomainId eq "+ Juniper.sm.DomainProvider.getCurrentDomain() +" and accessMode eq ASSOCIATION)&pageMaxCheck=false&paging=(start eq 0, limit eq 2147483647)",
                     headers: {
                         Accept: 'application/vnd.juniper.sd.select-all-devices-ids+json;version=1;q=0.01'
                     },
                     success: function(response) {
                         if(response && response.devices && response.devices.total > 0){
                            devices = response.devices.device;
                            var id = [];
                         if(devices != 'undefined'){
                            for($i=0;$i<devices.length;$i++){
                                 id[$i] = devices[$i]["id"];
                             }
                         }
                         setIdsSuccess(id);
                        }
                        $(".shortWizardNextButton").prop('disabled',false);
                     },
                     error: function() {
                         setIdsError("Getting all row ids in the grid FAILED.");
                     }
                 });
            };
            var formatConnectionStatusColumn = function( cellValue, options, rowObject ) {
               if(!cellValue){
                 return "";
               }
               var img = "transparent.png";
               if ( cellValue == "up"){
                    img = 'icon_device_status_up.svg';
               } else if ( cellValue == "down"){
                  img = 'icon_device_status_down.svg';
               }
               return '<img id="device_connection_status_' + cellValue + '" width="12px" height="14px" src="' + context.ctx_root + '/images/' + img + '"/> <span>' + cellValue.toUpperCase() + '</span>';
            };


            this.getValues = function() {
                return {
                    "tableId":"import_configuration_managed_services_grid",
                    //get devices API picks up currentdomain from session context ,so passing currentDomainId as 0 to avoid bad requrest.
                    "url": "/api/juniper/sd/device-management/devices?excludeLSYS=true&domainContext=(currentDomainId eq 0 and accessMode eq ASSOCIATION)", //PR :1130057
                    "ajaxOptions": {
                        "headers": {
                            "Accept": 'application/vnd.juniper.sd.device-management.devices+json;version=2;q=0.02'
                        }
                    },
                    "jsonRoot": "devices.device",
                    "jsonRecords": function(data) {
                        return data['devices'][RestApiConstants.TOTAL_PROPERTY];
                    },
                    "numberOfRows": 50,
                    "scroll": "true",
                    "onSelectAll": getRowIds,
                    "height": "360",
                    "multiselect": "true",
                    "jsonId": "id",
                    "filter": {
                           searchUrl: function (value, url){
                                return url;
                           },
                           noSearchResultMessage : context.getMessage("ipsec_vpn_no_result_for_search")
                    },
                    "contextMenu":{},
                    "columns": [
                        {
                             "index": "id",
                             "name": "id",
                             "hidden": true
                        },
                        {
                             "index": "domain-id",
                             "name": "domain-id",
                             "hidden": true
                        },{
                             "index": "moid",
                             "name": "moid",
                             "hidden": true
                        }, {
                             "index": "name",
                             "name": "name",
                             "label": context.getMessage("import_vpn_device_name"), // Name
                             "width": 120
                        }, {
                             "index": "device-ip",
                             "name": "device-ip",
                             "label": context.getMessage("import_vpn_ip_address"), // "IP Address"
                             "width": 150
                        }, {
                             "index": "domain-name",
                             "name": "domain-name",
                             "label": context.getMessage("import_vpn_domain"), //  "Domain"
                             "width": 80
                         }, {
                             "index": "software-release",
                             "name": "software-release",
                             "label": context.getMessage("import_vpn_osversion"), //  "OS Version"
                             "width": 250
                         }, {
                             "index": "platform",
                             "name": "platform",
                             "label": context.getMessage("import_vpn_platform"), // "Platform"
                             "width": 200
                         }, {
                             "index": "connection-status",
                             "name": "connection-status",
                             "formatter": formatConnectionStatusColumn,
                             "label": context.getMessage("import_vpn_ip_connection_status"), //"Connection Status"
                             "width": 80
                         }, {
                             "index": "configuration-state",
                             "name": "configuration-status",
                             "formatter": formatConfigStatusColumn,
                             "label": context.getMessage("import_vpn_ip_config_status"), //"configuration state
                             "width": 100
                         }
                    ]
                };
            }
        };

        return Configuration;
    }
);
