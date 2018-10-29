/**
 * Created by vithun on 9/7/15.
 */

/**
 * A module that works with devices
 * 
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    '../../../ui-common/js/sse/smSSEEventSubscriber.js',
    '../../../ui-common/js/gridActivity.js',
    './conf/devicesGridConfiguration.js',
    './conf/devicesGridActionsConfig.js',
    '../../../ui-common/js/common/utils/deviceManager.js',
    './views/devicesView.js',
    '../../../space-common-lib/js/util/selectAllCallback.js',
    '../../../space-common-lib/js/util/appendSearchContainerTokensInUrlUtil.js',
    '../../../ui-common/js/util/gridUtility.js'
], function(SmSSEEventSubscriber, GridActivity, GridConfiguration, ActionConfig, DeviceManager, DevicesView, SelectAllCallback,
            appendSearchContainerTokensInUrlUtil, GridUtility) {
    /**
  * Constructs a Devices Activity.
  */
  
    var DevicesActivity = function () {
      GridActivity.call(this);
      this.initialize();
      
    };
  
    DevicesActivity.prototype = Object.create(GridActivity.prototype);
    DevicesActivity.prototype.constructor = DevicesActivity;
  
  
    _.extend(DevicesActivity.prototype, GridActivity.prototype, {
        getActionCapabilities: function() {
          return {
                "launch-modify-configuration-page" : "ConfigEditorCap",
                "view-inventory-details" : this.getInventoryCapability(),
                "launch-web-ui" : "LaunchDeviceWebUI",
                "ssh-to-device" : "OpenSSH",
                "delete_devices" : "DeleteDevice",
                "resynchronize_devices" : "ResyncNetwork",
                "reboot_devices" : "RebootDevice",
                "import_config" : "ImportDevice",
                "import_change" : "ImportDevice",
                "view_change" : "UpdateDevice",
                "device_update" : "UpdateDevice",
                "update_all_sd_devices" : "UpdateDevice",
                "preview_config" : "UpdateDevice",
                "upload_keys" : "UploadKeys",
                "resolve_key_conflict" : "UploadPublicKey",
                "assign_device_to_domain" : "AssignDevice2Domain",
                "acknowledge_device_fingerprint" : "AcknowledgeDeviceFingerprint",
                "view_active_configuration" : "ConfigViewerCap",
                "quickViewEvent":"ReadDevices"
            };
        },
         initialize: function() {
           this.gridConf = GridConfiguration;
           this.selectedIdMap = [];
           this.getDeviceManagedValue();
         },

        getInventoryCapability : function() {
          var resolver = new Slipstream.SDK.RBACResolver();
          var viewInventoryCap = "ViewPhysicalInventory";
          if(resolver.verifyAccess( [ "ViewPhysicalInventory" ] ) )
          {
            viewInventoryCap = "ViewPhysicalInventory";
          }
          else if( resolver.verifyAccess( [ "ViewInterfaces" ] ) )
          {
            viewInventoryCap = "ViewInterfaces";
          }
          else if( resolver.verifyAccess( [ "ViewLogicalInterfaces" ] ) )
          {
            viewInventoryCap = "ViewLogicalInterfaces";
          }
          return viewInventoryCap;
        },
        
        getView : function() {
          var self = this;
          var conf = this.getConfigValues();
          var View = (this.capabilities.list && this.capabilities.list.view) ?
              this.capabilities.list.view : DevicesView;
          var searchParams = new GridUtility().getSearchParamsFromExtras(this.getIntent().getExtras());
          this.view = new View({
              conf: conf, 
              activity: this,
              search: searchParams ? [searchParams] : undefined,
              actionEvents: this.events
          });
          var getChildrenIdsCallbackForSelectAll = function(data){
        	  var selectedIds = {};
        	  if(data){
        		  if(!_.isArray(data)){
        			  data = [data];
        		  }
        		  for(var i = 0; i< data.length;i++){
        			  selectedIds[data[i]['id']] = data[i]['device-id'];
        		  }
        	  }
        	  var selectedChildids = [];
        	  if(self.view && self.view.gridWidget){
              	var visibleRows = self.view.gridWidget.getAllVisibleRows();
              	if(!visibleRows){
              		return selectedChildids;
              	}
              	if(!_.isArray(visibleRows)){
              		visibleRows = [visibleRows];
              	}
              	for ( var j = 0; j < visibleRows.length; j++ ){
              		if(visibleRows[j]['parent'] && visibleRows[j]['parent'] != ''){
              			selectedChildids.push( visibleRows [ j ] [ 'id' ] );
              			selectedIds[visibleRows[j]['id']] = visibleRows[j]['device-id'];
              		}
                  }
              }
        	  self.selectedIdMap = selectedIds;
        	  return selectedChildids;
          };
          
          this.addSelectAllCallback(this.view.conf, "id", 
        	'/api/juniper/sd/device-management/devices/select-all?domainContext=(currentDomainId eq 999 and accessMode eq ASSOCIATION)&pageMaxCheck=false&paging=(start eq 0, limit eq 2147483647)',
			'application/vnd.juniper.sd.select-all-devices-ids+json;version=1;q=0.01', getChildrenIdsCallbackForSelectAll, ".grid-widget");

          this.bindEvents();
          if(!this.view.$el.hasClass(this.getContext()["ctx_name"])){
                this.view.$el.addClass(this.getContext()["ctx_name"]);
            }

          this.setContextMenuItemStatus(this.view.conf);
          this.subscribeNotifications();
          return this.view;
        },
        //var self = this;
        complete : function(jqXHR, settings ) {/*
          if(jqXHR.responseJSON.devices.device.length != self.view.gridWidget.getNumberOfRows()){
            self.view.gridWidget.reloadGrid();
          }
        */},
        
        getConfigValues : function() {
          return new this.gridConf(this.getContext(), this.intent, this).getValues(this.complete);
        },
        
        bindEvents : function() {
          
         Object.keys(ActionConfig).forEach(function(actionconfigKey){
           var actionconfigdata = ActionConfig[actionconfigKey]
               actionCapabilities = this.getActionCapabilities();
           this.events[actionconfigKey] = actionconfigKey;
           if(actionCapabilities[actionconfigKey]){
             this.events[actionconfigKey] = { capabilities : [actionCapabilities[actionconfigKey]], name : actionconfigKey}
           }
           
           this.view.$el.bind(this.events[actionconfigKey].name ? this.events[actionconfigKey].name : this.events[actionconfigKey], $.proxy(this.handleCustomEvent, this, actionconfigdata));
          }.bind(this));

        },
        
        getNotificationUrl : function() {
          var self = this;
          return [self.getConfigValues().url]; 
        },
        
        handleCustomEvent : function(actionconfig, e, selectedRows) {
          
          var deviceManager = new DeviceManager();
          var defaultMimeType = actionconfig["is-cluster-action"]?
            "vnd.juniper.sd.device-management.devices"
            :"vnd.juniper.sd.device-management.cluster-members";
          
          var intentData = {
            "mime_type" : actionconfig["mime-type"] ? actionconfig["mime-type"] : defaultMimeType
          };
          
          var intent = new Slipstream.SDK.Intent(
            actionconfig.intent.action,
            intentData
          );
          
//          var devices = this.view.gridWidget.getSelectedRows();
          var devices = (selectedRows && selectedRows.allRowIds && selectedRows.allRowIds.length > 0)? selectedRows.allRowIds : selectedRows.selectedRows;
          var unSelectedRows = (selectedRows && selectedRows.allUnselectedRowIds && selectedRows.allUnselectedRowIds.length > 0)? selectedRows.allUnselectedRowIds : undefined;
          var isSelectAll = false;
          var filterString = undefined;
          if(selectedRows.allRowIds && selectedRows.allRowIds.length > 0){
            isSelectAll = true;
            try{
            	var idMap = (self && self.selectedIdMap) ? self.selectedIdMap : undefined;
           	 if(idMap){
           		 var ids = [];
           		 for (var i = 0; i < devices.length; i++) {
           			 ids.push(parseInt(idMap[devices[i]]));
           		 }
           		 selectedRowIds = ids;
           		 ids = [];
           		 if(unSelectedRows){
           			for (var i = 0; i < unSelectedRows.length; i++) {
           				if(idMap[unSelectedRows[i]] && selectedRowIds.indexOf(parseInt(idMap[unSelectedRows[i]])) == -1){
           					ids.push(idMap[unSelectedRows[i]]);
           				}
              		 }
           			unSelectedRows = ids;
           		 }
           	 }
              if(this.view.gridWidget.getSearchWidgetInstance().getAllTokens().length > 0){
                filterString = self.getFilterQuery(this.view.gridWidget.conf.elements, this.view.gridWidget.getSearchWidgetInstance().getAllTokens());
              }
              } catch (e) {
                filterString = undefined;
             }
          }
          
          var url = "/api/juniper/sd/device-management/devices/select-all?domainContext=(currentDomainId eq 999 and accessMode eq ASSOCIATION)&pageMaxCheck=false&paging=(start eq 0, limit eq 2147483647)";
          var acceptType = "application/vnd.juniper.sd.select-all-devices-ids+json;version=1;q=0.01";
          if(isSelectAll){
            if(unSelectedRows && unSelectedRows.length > 0){
            url = url + "&filter=(";
            var filterStr = "";
            for (var index = 0; index < unSelectedRows.length; index++) {
              if (!filterStr) {
               filterStr = " device-id ne " + unSelectedRows[index];
              } else {
               filterStr = filterStr + " and device-id ne " + unSelectedRows[index];
              }
            }
            filterStr = filterStr + " )";
            url = url + filterStr;
            }
            if(filterString){
              if(appendSearchContainerTokensInUrlUtil){
                var test = appendSearchContainerTokensInUrlUtil();
                url = appendSearchContainerTokensInUrlUtil.appendSearchTokens(url, filterString);
              }
            }
            
            $.ajax({
              type : 'GET',
              url : url,
              async : false,
              headers: {          
                Accept : acceptType         
               },
              success: function (response) {
                if(response && response.devices && response.devices.total > 0){
                  devices = response.devices.device;
                  if(!_.isArray(devices)){
                    devices = [ devices ];
                  }
                } else {
                  devices = undefined;
                }
              },
              error : function(response){
                devices = undefined;
                console.log("devices not fetched");
              }
             });
            
            } 
          
          var devicePlatformIds = [];
          var deviceSDIds = [];
          var parentSDIds=[];
          
          var nonClusterDevicePlatformIds = [];
          var nonClusterDeviceSDIds = [];
          var parentDevicePlatformIds = [];
          var parentDeviceSDIds = [];
          var childrenDevicePlatformIds = [];
          var childrenDeviceSDIds = [];
          
          devices.forEach(function(device){
            
            if(device.cluster == undefined || device.cluster === ""){
              childrenDevicePlatformIds.push(device["device-id"]);
              childrenDeviceSDIds.push(device["id"]);
              parentSDIds.push(device["parent"]);
            } else if(device.cluster == true || device.cluster == "true" ){
              parentDevicePlatformIds.push(device["device-id"]);
              parentDeviceSDIds.push(device["id"]);
            } else {
              nonClusterDevicePlatformIds.push(device["device-id"]);
              nonClusterDeviceSDIds.push(device["id"]);
            } 
            
          });
          
          if(actionconfig["is-cluster-action"]){
            devicePlatformIds = this.getChildrenIds(parentDeviceSDIds).concat(childrenDevicePlatformIds.concat(nonClusterDevicePlatformIds));
          } else {
            devicePlatformIds = parentDevicePlatformIds.concat(childrenDevicePlatformIds.concat(nonClusterDevicePlatformIds));
            deviceSDIds = parentDeviceSDIds.concat(childrenDeviceSDIds.concat(nonClusterDeviceSDIds));
          }
          devicePlatformIds = this.getUniqueIds(devicePlatformIds);
          deviceSDIds = this.getUniqueIds(deviceSDIds);
          parentSDIds = this.getUniqueIds(parentSDIds);
          intent.putExtras(
            {
             "data":{
              "deviceIds": devicePlatformIds,
              "sdDeviceIds":deviceSDIds,
              "parentIds":parentSDIds
             }
            });
          this.context.startActivity(intent);
          
        },
        
        getUniqueIds : function( deviceIds ) {
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
        },
        
        
        addSelectAllCallback : function(conf, jsonRootId, optionalURL, optionalAcceptType, getChildrenIdsCallback, domIdForSpinner) {
         if(SelectAllCallback && SelectAllCallback.addSelectAllCallback)
          SelectAllCallback.addSelectAllCallback(conf,jsonRootId, optionalURL, optionalAcceptType, getChildrenIdsCallback, domIdForSpinner);
          },
          
         getFilterQuery : function(conf, tokens) {
            return SelectAllCallback.formFilterQuery(conf, tokens);
          },
          
        getChildrenIds : function(parentDeviceSDIds) {
          var self = this;
          var devicePlatformIds = [];
          
          var deviceSDIds = {};
          deviceSDIds["device-id-list"] = {};
          deviceSDIds["device-id-list"]["device-ids"] = parentDeviceSDIds;
          
          $.ajax({
              url: "/api/juniper/sd/device-management/id-map",
              dataType: 'json',
              type: 'POST',
              data : JSON.stringify(deviceSDIds),
              async: false,
              contentType: "application/vnd.juniper.sd.device-management.id-map-request+json;version=2;charset=UTF-8",
              headers: {
                'accept': 'application/vnd.juniper.sd.device-management.id-map+json;q="0.02";version="2"'
              },
              success: function(data, status) {
                if(data && data["device-id-map"] && data["device-id-map"].idEntry){
                  data["device-id-map"].idEntry.forEach(function(clusterDevice){
                    clusterDevice["platform-device-ids"].forEach(function(id){
                      devicePlatformIds.push(id); 
                    });
                  });
                }
              },
              error: function() {
                  console.log('No Devices Found');
              }
          });
          return devicePlatformIds;
        },
        
        setContextMenuItemStatus : function(conf) {
          this.addColumnForPredefinedIdentifier(conf);
          conf.contextMenuItemStatus = conf.contextMenuItemStatus || {};
        },
        /* device change status check */
        getDeviceManagedValue : function() {
          var self = this;
           $.ajax({
              url: '/api/juniper/sd/app-setting-management/device-change-preview-import-enabled',
              dataType: 'text',
              type: 'get',
              success: function(data) {
                 self.isBookKeepingEnabled = data; // return the response for the device change status
              }
            });
        },
        addColumnForPredefinedIdentifier : function(conf) {
          var item = {
              "id": "definition-type",
              "label": false,
              "name": "definition-type",
              "hidden": true
          };

          conf.columns = conf.columns || [];
          conf.columns.push(item);
        }
    });

    return DevicesActivity;
});

