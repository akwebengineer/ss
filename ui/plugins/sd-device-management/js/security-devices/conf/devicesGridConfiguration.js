/**
 * Created by nareshu on 7/7/15.
 */

define( [
  './../../../../sd-common/js/devices/conf/devicesGridConfigurationColumn.js',
  './devicesGridActionsConfig.js',
  '../../../../ui-common/js/common/restApiConstants.js',
  '../../../../sd-common/js/common/timeKeeper.js',
  '../../../../ui-common/js/common/utils/deviceManager.js'
],
    function( ColumnConfig, ContextMenuActionConfig, RestApiConstants, TimeKeeper, DeviceManager) {

      var Configuration = function( context, intent, activity ) {
        
        var parameter = undefined;
        var order = undefined;
        var filterString = undefined;
        var totalRecords = 0;
        var isLeafReq = false;
        if(intent && intent.extras){
          
          if(intent.extras.sortBy){
            parameter = intent.extras.sortBy.parameter;
            if ( intent.extras.sortBy.order == "descending" )
            {
              order="desc";
            }
            else if(intent.extras.sortBy.order == "ascending" )
            {
              order="asc";
            }
          }
          
          if(intent.extras.filterBy){
            filterString = intent.extras.filterBy.filterString;
          }
        }

        var TOPLEVELDEVICES = "/api/juniper/sd/device-management/devices?domainContext=(currentDomainId eq 999 and accessMode eq ASSOCIATION)";
        
        if(filterString){
          TOPLEVELDEVICES += "&filter=(" + filterString + ")";
        }
        
        var TOPLEVELDEVICES_MEDIATYPE = "application/vnd.juniper.sd.device-management.devices-extended+json;q=0.01;version=2";
        var PARENT_ID_PLACEHOLDER = "{parentid}";
        var MEMEBERDEVICES = "/api/juniper/sd/device-management/devices/" + PARENT_ID_PLACEHOLDER + "/cluster-members";
        var MEMEBERDEVICES_MEDIATYPE = 'application/vnd.juniper.sd.device-management.security-device-refs+json;q="0.02";version="2"';
        var ACCEPT_HEADER = "Accept";

        var columnConfig = ( new ColumnConfig( context ) ).getValues( );
        
        var columnsToBeHidden = ["software-release", "number-of-sessions", "authentication-status", "serial-number", "last-rebooted-time", "connection-type"];
        
        var configuration_page = ["launch-modify-configuration-page", "view_active_configuration"];
        var operation_page = ["delete_devices", "reboot_devices", "resynchronize_devices", "resolve_key_conflict"];
        var access_page = ["launch-web-ui", "ssh-to-device"];
        var device_change_page = ["import_change","view_change"];
        
        var enableDisableList = {};
        var mainMenuItems = {};
        var selectedDevicesData = [];
        
        mainMenuItems = {
          "configuration-page" : configuration_page,
          "operation-page" : operation_page,
          "access-page" : access_page,
          "device-change-page" : device_change_page
        };   
        
        var wait = false;
        this.getNotificationConfig = function () {
         var notificationSubscriptionConfig = {
           'uri' : ['/api/juniper/sd/device-management/devices'],
           'autoRefresh' : false
         };
         return notificationSubscriptionConfig;
        };
 
        var getUniqueIds = function( deviceIds ) {
          var uniqueIds = [ ];
          for ( var index = 0; index < deviceIds.length; index++ )
            {
              if( typeof ( deviceIds [ index ]) !== "number" )
                {
                  deviceIds[ index ] = parseInt( deviceIds [ index ] );
                }
              if ( uniqueIds.indexOf( deviceIds [ index ] ) === -1 )
                {
                  uniqueIds.push( deviceIds [ index ] );
                }
            }
          return uniqueIds;
        };

        this.getValues = function(complete ) {
          var config = {
            "title": context.getMessage( 'devices_ilp_title' ),
            "title-help": {
              "content": context.getMessage( 'devices_ilp_tooltip' ),
              "ua-help-text":context.getMessage("more_link"),
              "ua-help-identifier": context.getHelpKey("SECURITY_DEVICES_FEATURES_USING")
            },
            "tableId": "sd-devices",
            "numberOfRows": 50,
            "height": "auto",
            "url": TOPLEVELDEVICES,
            "showWidthAsPercentage": false,
            "footer" : {
                hideRowCount: true,
                hideSelectionAndRowCount: false
            },
            "filter": true,
            "orderable": true,
            "scroll": {
              "pagination": true
            },
            multiselect: true,
            "tree": {
              "column": "name",
              "level": "level",
              "parent": "parent",
              "leaf": "leaf",
              "initialLevelExpanded": -1, // number of levels to be expanded at initial loading
              parentSelect: true

            },
            "filter": {
              searchUrl: true,
              columnFilter: true,
              showFilter: false,
              optionMenu: {
                "showHideColumnsItem": {
                  "setColumnSelection": function( columnStatus ) {
                    columnsToBeHidden.forEach(function(column){
                      columnStatus[column] = false;
                    });
                    return columnStatus;
                  },
                  "updateColumnSelection": function( columnStatus ) {
                    return columnStatus;
                  }
                },
                "customItems": [ ]
              }
            },

            "jsonRoot": "devices.device",
            "jsonId": "id",
            "jsonRecords": function( data ) {
            	//For the Child result the count children is ignored.
            	//And Previously stored parent count is returned.
            	if(isLeafReq){
            		return totalRecords;
            	}
              totalRecords = data [ 'devices' ] [ RestApiConstants.TOTAL_PROPERTY ];
              return totalRecords;
            },
            "ajaxOptions": {
              "beforeSend": function( xhr,
                  props ) {
                var levelregex = /n_level=([0-9])/;
                var nodeidregex = /nodeid=([0-9]+)/;
                var level = levelregex.exec( props.url );
                var nodeidgroup = nodeidregex.exec( props.url );
                var nodeid = null;
                if ( level != null && level [ 1 ] == "0" )
                {// for device children - group(1)
                  nodeid = nodeidgroup [ 1 ];
                  var parenturl = props.url;
                  var parenturlqueryparam = parenturl.split( "?" ) [ 1 ];
                  props.url = MEMEBERDEVICES.replace( PARENT_ID_PLACEHOLDER,
                      nodeid ) + "?" + parenturlqueryparam;
                  
                  if(filterString){
                    props.url = MEMEBERDEVICES.replace( PARENT_ID_PLACEHOLDER,
                        nodeid ) + "?" + parenturlqueryparam + "&" + filterString;
                  }
                  
                  xhr.setRequestHeader( ACCEPT_HEADER, MEMEBERDEVICES_MEDIATYPE );
                  xhr.setRequestHeader( "x-date", TimeKeeper.getXDate( ) );
                  isLeafReq = true;
                }
                else
                {
                  xhr.setRequestHeader( ACCEPT_HEADER, TOPLEVELDEVICES_MEDIATYPE );
                  xhr.setRequestHeader( "x-date", TimeKeeper.getXDate( ) );
                  isLeafReq = false;
                }
                xhr.then( function( data ) {
                  var devicearray = data.devices.device;

                  if ( !( devicearray instanceof Array ) )
                  {
                    devicearray = [
                      devicearray
                    ];
                  }

                  var deviceIds = [ ];
                  
                  var deviceManager = new DeviceManager();
                  devicearray.forEach( function( device ) {
                    device.leaf = !device.cluster;
                    
//                    if(deviceManager.isLsys(device) || deviceManager.isRootLsysDevice(device)){
//                      device.leaf = true;
//                    }
                    
                    device.level = ( nodeid ) ? 1 : 0;
                    if ( nodeid != null )
                    {
                      device.parent = Number( nodeid );
                    }
                    else
                    {
                      device.parent = null;
                    }
                    deviceIds.push( device.id );
                  } );

                  
                  return data;

                } );
              },
              "complete": complete
            },
            "columns": columnConfig,
            "sorting": [
                        {
                          "column": ( parameter ) ? parameter : "id",
                          "order": ( order ) ? order : "asc" // asc,desc
                        }
                      ],
            "actionButtons": {
              "defaultButtons": { // overwrite default CRUD grid buttons
              },
              "customButtons": [
                {
                  "button_type": true,
                  "label": context.getMessage( "device_page_menu_update" ),
                  "key": "device_update",
                  "secondary": true
                },
                {
                  "button_type": true,
                  "label": context.getMessage( "device_page_menu_resynchronize_devices" ),
                  "key": "resynchronize_devices",
                  "secondary": true,
                  "disabledStatus": true
                },
                {
                  "button_type": true,
                  "label": context.getMessage( "device_page_menu_upload_keys" ),
                  "key": "upload_keys",
                  "secondary": true
                }
              ],
              "actionStatusCallback": contextMenuStatusCallback
            },
            "contextMenu": {
              "custom": [
                {
                  "label": context.getMessage( 'device_page_menu_configuration_page' ),
                  "key": "configuration-page",
                  "items": [
                            {
                              "label": context.getMessage( 'device_page_menu_launch_modify_configuration_page' ),
                              "key": "launch-modify-configuration-page"
                            },
                            {
                              "label": context.getMessage( 'device_page_menu_view_active_configuration' ),
                              "key": "view_active_configuration"
                            }
                           ]
                },
                {
                  "label": context.getMessage( 'device_page_menu_operation_page' ),
                  "key": "operation-page",
                  "items": [
                            {
                              "label": context.getMessage( 'device_page_menu_delete_devices' ),
                              "key": "delete_devices"
                            },
                            {
                              "label": context.getMessage( 'device_page_menu_reboot_devices' ),
                              "key": "reboot_devices"
                            },
                            {
                              "label": context.getMessage( 'device_page_menu_resynchronize_devices' ),
                              "key": "resynchronize_devices"
                            },
                            {
                              "label": context.getMessage( 'device_page_menu_resolve_key_conflict' ),
                              "key": "resolve_key_conflict"
                            }
                           ]
                },
                {
                  "label": context.getMessage( 'device_page_menu_access_page' ),
                  "key": "access-page",
                  "items": [
                            {
                              "label": context.getMessage( 'device_page_menu_launch_web_ui' ),
                              "key": "launch-web-ui"
                            },
                            {
                              "label": context.getMessage( 'device_page_menu_ssh_to_device' ),
                              "key": "ssh-to-device"
                            }
                           ]
                },
                {
                  "separator": "true"
                },
                {
                  "label": context.getMessage( 'device_page_menu_device_change_page' ),
                  "key": "device-change-page",
                  "items": [
                            {
                              "label": context.getMessage( 'device_page_menu_import_change' ),
                              "key": "import_change"
                            },
                            {
                              "label": context.getMessage( 'device_page_menu_view_change' ),
                              "key": "view_change"
                            }
                           ]
                },
                {
                  "separator": "true"
                },
                {
                  "label": context.getMessage( 'device_page_menu_view_inventory_details' ),
                  "key": "view-inventory-details"
                },
                {
                  "separator": "true"
                },
                {
                  "label": context.getMessage( 'device_page_menu_preview_changes' ),
                  "key": "preview_config"
                },
                {
                  "label": context.getMessage( 'device_page_menu_update' ),
                  "key": "device_update"
                },
//                {
//                  "label": context.getMessage( 'device_page_menu_update_all' ),
//                  "key": "update_all_sd_devices"
//                },
                {
                  "label": context.getMessage( 'device_page_menu_import_config' ),
                  "key": "import_config"
                },
                {
                  "label": context.getMessage( 'device_page_menu_refresh_certificate' ),
                  "key": "refresh_certificate"
                },
                {
                  "separator": "true"
                },
                {
                  "label": context.getMessage( 'device_page_menu_assign_device_to_domain' ),
                  "key": "assign_device_to_domain"
                },
                {
                  "label": context.getMessage( 'device_page_menu_acknowledge_device_fingerprint' ),
                  "key": "acknowledge_device_fingerprint"
                }
              ],
              
            "quickView" : context.getMessage( 'device_page_detailed_view' )

            },
            "contextMenuStatusCallback" : contextMenuStatusCallback
          }
          return config;
        };
        
        var isLsys = function( rowObject ){

          var isLsys = false;
          if(rowObject["device-type"] == "LSYS"){
            isLsys = true;
          }
          return isLsys;
          
        };
        
        var isRootLsysDevice = function( rowObject ){
          
          var isLsysRoot = false;
          if (rowObject["device-family"] && rowObject["device-family"] != "" && rowObject["device-family"] == "junos-es"
              && rowObject["software-release"] && rowObject["software-release"] != "" && !isLsys(rowObject)) {
            
            var softwareRelease = rowObject["software-release"];
            var deviceReleaseStrArray = softwareRelease.split("R");

            if (deviceReleaseStrArray.length == 1) {
              deviceReleaseStrArray = softwareRelease.split("W");
            }
            if (deviceReleaseStrArray.length == 1) {
              deviceReleaseStrArray = softwareRelease.split("I");
            }
            if (deviceReleaseStrArray.length == 1) {
              deviceReleaseStrArray = softwareRelease.split("X");
            }

            if (deviceReleaseStrArray.length > 1) {
              var majorRelease = deviceReleaseStrArray[0];
              if (majorRelease == 11.2 || majorRelease > 11.2) {
                var dplatform = rowObject["platform"];
                if (dplatform && dplatform != "") {
                  dplatform = dplatform.toLowerCase();
                  if (dplatform == "srx5800" || dplatform == "srx5600" || dplatform == "srx3600" || dplatform == "srx3400")
                    isLsysRoot = true;
                  else if (dplatform == "srx1400" && majorRelease != 11.2)
                    isLsysRoot = true;
                }
              }
            }
          }
          return isLsysRoot;
          
        };
        
         var getDeviceObject = function(urlPath) {
           var self = this;
           var deviceObjects = [];
           $.ajax({
               url: urlPath,
               type: 'get',
               async: false,
               headers: {
                 'accept': 'application/vnd.net.juniper.space.device-management.devices+json;version="1"'
               },
               success: function(data, status) {
                 if(data && data.devices){
                   deviceObjects = data.devices.device;
                 }
               },
               error: function() {
                   console.log('No Devices Found');
               }
           });
           return deviceObjects;
       };
       
       var contextMenuStatusCallback = function( selectedRows,
      updateStatusSuccess, updateStatusError) {
     var selectedObject = selectedRows.selectedRows;
     var selectedRowIds = [];
     var isChildDevice = false;
     var isDifferentDomain = false;
     var islsysInMultipleSelection = false;
     var lsysDevice = 0;
     for (var index = 0; index < selectedObject.length; index++) {
    	 if(selectedObject[index]["device-type"] == "LSYS")
    	 {
    		 lsysDevice++;
    	 }
     }
     if(selectedObject.length > 1 && lsysDevice > 0)
     {
    	 islsysInMultipleSelection = true;
     }
     selectedRowIds = (selectedRows
       && selectedRows.allRowIds && selectedRows.allRowIds.length > 0) ? selectedRows.allRowIds
       : [];
     if(selectedRowIds.length == 0 && selectedObject){
      for (var index = 0; index < selectedObject.length; index++) {
       selectedRowIds.push(selectedObject[index]['device-id']);
      }
     } else{
    	 var idMap = (activity && activity.selectedIdMap) ? activity.selectedIdMap : undefined;
    	 if(idMap){
    		 var ids = [];
    		 for (var i = 0; i < selectedRowIds.length; i++) {
    			 ids.push(idMap[selectedRowIds[i]]);
    		 }
    		 selectedRowIds = ids;
    	 }
     }
     if(selectedObject){
      selectedObject.forEach( function( device ) {
                      if (device.cluster == "")
                      {
                        isChildDevice = true;
                      }
                      // check if the device is in the same domain
                      if (!Juniper.sm.DomainProvider.isCurrentDomain(Number.parseInt(device['domain-id']))) {
                          isDifferentDomain = true;
                      }
                    });
     }
     var data = {};
     data['check-enabled-tasks-request'] = {};
     data['check-enabled-tasks-request']['selected-object-ids'] = {
      "selected-object-id" : selectedRowIds
     };
     data['check-enabled-tasks-request']['tasks'] = {
      'task' : [ "acknowledgeDeviceFingerprint",
        "configEditor", "viewPhysicalInventory", // The viewPhysicalInventory, viewInterfaces, viewLogicalInterfaces has same enable criteria
        "resyncNetwork", "rebootDevice",
        "uploadPublicKey", "launchDeviceWebUI",
        "openSSH","configViewer","assignToDomain", "deleteDevice" ]
     };

     $
       .ajax({
        type : 'POST',
        url : '/api/space/user-management/check-enabled-tasks',
        data : JSON.stringify(data),
        headers : {
         "Accept" : 'application/vnd.net.juniper.space.user-management.menu-statuses+json;version=3;q=0.03',
         "Content-Type" : 'application/vnd.net.juniper.space.user-management.menu-status-request+json;version=3;charset=UTF-8'
        },
        success : function(data) {
         var menuStatus = {};
         if (data && data['menu-statuses']
           && data['menu-statuses'].menu) {
          if (!$
            .isArray(data['menu-statuses'].menu)) {
           data['menu-statuses'].menu = [ data['menu-statuses'].menu ]
          }
          var tempStatus = data['menu-statuses'].menu
          for (var index = 0; index < tempStatus.length; index++) {
           menuStatus[tempStatus[index]['menu-name']] = tempStatus[index]['menu-status'];
          }
         }
         var status = {
          "launch-modify-configuration-page" : (!isChildDevice && menuStatus["configEditor"] && !islsysInMultipleSelection) ? true
            : false,
          "view-inventory-details" : (selectedRowIds.length==1 && !ContextMenuActionConfig["view-inventory-details"]["check-enabled"](selectedObject,false) ) || ((selectedRowIds.length <= 200) && (menuStatus["viewPhysicalInventory"])),
          "launch-web-ui" :(!isChildDevice && menuStatus["launchDeviceWebUI"]) ? true
            : false,
          "ssh-to-device" : menuStatus["openSSH"] ? true
            : false,
          "resynchronize_devices" : menuStatus["resyncNetwork"] ? true
            : false,
          "reboot_devices" : (!isChildDevice && menuStatus["rebootDevice"])? true
            : false,
          "import_config" : !isChildDevice && !isDifferentDomain &&!ContextMenuActionConfig["import_config"]["check-enabled"](selectedObject,false),
          "import_change" : !ContextMenuActionConfig["import_change"]["check-enabled"](selectedObject,false),
          "device-change-page" : !ContextMenuActionConfig["view_change"]["check-enabled"](selectedObject,false, activity.isBookKeepingEnabled),
          "device_update" : selectedRowIds.length == 0 || ( !isChildDevice && !ContextMenuActionConfig["device_update"]["check-enabled"](selectedObject,false)),
          "update_all_sd_devices" : !ContextMenuActionConfig["update_all_sd_devices"]["check-enabled"](selectedObject,false),
          "preview_config" : !isChildDevice && !ContextMenuActionConfig["preview_config"]["check-enabled"](selectedObject,false),
          "refresh_certificate" : !isChildDevice && !ContextMenuActionConfig["refresh_certificate"]["check-enabled"](selectedObject,false),
          "upload_keys" : !ContextMenuActionConfig["upload_keys"]["check-enabled"](selectedObject,false),
          "acknowledge_device_fingerprint" : menuStatus["acknowledgeDeviceFingerprint"] ? true
            : false,
          "view_active_configuration" : (!isChildDevice &&  menuStatus["configViewer"])? true : false,
          "quickView" : selectedRowIds.length == 1 && !ContextMenuActionConfig["quickViewEvent"]["check-enabled"](selectedObject,false),
          "delete_devices" : menuStatus["deleteDevice"] ? true : false,
          "resolve_key_conflict" : menuStatus["uploadPublicKey"] ? true
            : false,
          "assign_device_to_domain" : (!isChildDevice && menuStatus["assignToDomain"]) ? true : false
         };
         updateStatusSuccess(status);
         if(hideSpinner){
        	 hideSpinner();
         }
        },
        error : function() {
         updateStatusError("Update in the status of the context menu items FAILED.");
         if(hideSpinner){
        	 hideSpinner();
         }
        }
       });
    };
    
    var hideSpinner = function( ) {
        spinnerDiv = $($.find( ".indeterminateSpinnerContainer" ));
        spinnerMask = $( $.find( ".slipstream-indicator-background" ) );
  	  if(spinnerMask){        		  
  		  spinnerMask.addClass( "hide" );
  	  }
    	if(spinnerDiv){          		
    		spinnerDiv.addClass( "hide" );
    	}
    };
        
      };
      return Configuration;
    } );