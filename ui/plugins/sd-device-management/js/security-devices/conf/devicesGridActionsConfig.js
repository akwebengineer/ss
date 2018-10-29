define( [ ],
    function( ) {

      var DEVICE_STATE_UNMANAGED = "DEVICE_STATE_UNMANAGED";
      var DEVICE_STATE_SYNC_FAILED = "DEVICE_STATE_SYNC_FAILED";
      var LSYS = "LSYS";
      var MODELED = "Modeled";
      var DEVICE_STATE_MODELED = "DEVICE_STATE_MODELED";
      var DEVICE_STATE_ACTIVATED = "DEVICE_STATE_ACTIVATED";
      var BXOS_DEVICEFAMILY = "bxos";
      var QFX_DEVICEFAMILY = "junos-qfx";
      var QF_DEVICEFAMILY = "junos-qf";
      var SCREENOS_DEVICEFAMILY = "screenos";
      var DEVICE_STATE_IN_RMA = "DEVICE_STATE_IN_RMA";
      var DEVICE_STATE_RMA_REACTIVATING = "DEVICE_STATE_RMA_REACTIVATING";
      var DEVICE_STATE_RMA_REACTIVATE_FAILED = "DEVICE_STATE_RMA_REACTIVATE_FAILED";
      var WWJUNOS_ADAPTOR = "wwjunos";
      var KEY_CONFLICT = "KEY_CONFLICT";
      var KEY_CONFLICT_UNVERIFIED = "KEY_CONFLICT_UNVERIFIED";
      var FINGER_PRINT_CONFLICT = "FINGER_PRINT_CONFLICT";
      var CONNECTION_STATUS_UP = "up";
      var DEVICE_FAMILY_VSE = "vse-mcg";
      var DEVICE_FAMILY_TCAOS = "tcaos";
      var CREDENTIAL_UNVERIFIED = "CREDENTIAL_UNVERIFIED";
      var RSA_KEY_UNVERIFIED = "RSA_KEY_UNVERIFIED";
//      var DEVICE_CHANGED ="DEVICE_CHANGED";
      var DEVICE_STATE_SSOR_BOTH_CHANGED ="DEVICE_STATE_SSOR_BOTH_CHANGED";
      var DEVICE_STATE_SSOR_SPACE_CHANGED ="DEVICE_STATE_SSOR_SPACE_CHANGED";
      var DEVICE_STATE_SSOR_DEVICE_CHANGED ="DEVICE_STATE_SSOR_DEVICE_CHANGED";
      var DEVICE_STATE_SSOR_UNKNOWN ="DEVICE_STATE_SSOR_UNKNOWN";
      var DEVICE_STATE_SSOR_IN_SYNC ="DEVICE_STATE_SSOR_IN_SYNC";
      var DEVICE_STATE_SSOR_UNDEF ="DEVICE_STATE_SSOR_UNDEF";
      
      var UNMANAGED = "Unmanaged";
      var MANAGED_INSYNC = "In Sync";
      var SD_CHANGED = "SD Changed";
      var DEVICE_CHANGED = "Device Changed";
      var SD_CHANGED_DEVICE_CHANGED = "SD Changed, Device Changed";

       
      var actionConfig ={};
      actionConfig = {
                      
        "launch-modify-configuration-page" :
        {
          "key": "launch-modify-configuration-page",
          "intent": {
            action: "space.intent.action.MODIFY_CONFIGURATION"
          },
          "is-cluster-action": false,
          "mime-type": "vnd.juniper.net.device.modify.configuration.view",

          // Should check-enabled be moved to context menu config?
          "check-enabled": function( selectedRows ,isItemDisabled) {
			//TODO: It should be removed because Menu status is Fetched from remote
            // Check if this needs to be enabled for member devices

            var disabledstatus = isItemDisabled;

            // Check for Single selection

            var deviceObject = selectedRows [ 0 ];
            if(!deviceObject || _.isArray(deviceObject)){
              return true;
            }
              
            if ( deviceObject [ 'configuration-status' ] == DEVICE_STATE_UNMANAGED || deviceObject [ 'configuration-status' ] == DEVICE_STATE_ACTIVATED
                 || deviceObject [ 'deviceFamily' ] == DEVICE_FAMILY_VSE || deviceObject [ 'deviceFamily' ] == DEVICE_FAMILY_TCAOS )
            {
              disabledstatus = true;
            }

            // Check for Multiple selection

            if ( selectedRows.length > 1 )
            {
              // 'Modify Configuration' action will be enabled only if all the selected devices are of same Family
              var family = selectedRows [ 0 ] [ 'deviceFamily' ];
              
              for ( i = 0; i < selectedRows.length; i++ )
              {
                deviceObject = selectedRows [ i ];
                if ( deviceObject [ 'connection-status' ] != CONNECTION_STATUS_UP )
                {
                  disabledstatus = true;
                }
                else if ( deviceObject [ 'configuration-status' ] == DEVICE_STATE_UNMANAGED || deviceObject [ 'configuration-status' ] == DEVICE_STATE_ACTIVATED
                          || deviceObject [ 'deviceFamily' ] == DEVICE_FAMILY_VSE || deviceObject [ 'deviceFamily' ] == DEVICE_FAMILY_TCAOS
                          || deviceObject [ 'deviceFamily' ] != family )
                {
                  disabledstatus = true;
                }

                // 'Modify Configuration' action will be enabled only if all the selected devices satisfies the above conditions
                if ( disabledstatus )
                {
                  break;
                }

              }
            }

            return disabledstatus;
          }
        },
        
        "view-inventory-details" :
        {
          "key": "view-inventory-details",
          "intent": {
            action: "space.intent.action.INVENTORY_DETAILS"
          },
          "is-cluster-action": true,
          "mime-type": "vnd.net.juniper.space.device-management.devices",
          "check-enabled": function( selectedRows , isItemDisabled ) {
            var disabledstatus = isItemDisabled;
            for ( i = 0; i < selectedRows.length; i++ )
            {
              var deviceObject = selectedRows [ i ];

              if ( deviceObject [ 'configuration-status' ] == DEVICE_STATE_UNMANAGED )
              {
                disabledstatus = true;
              }
              else if ( selectedRows.length > 1 && deviceObject [ 'device-type' ] == LSYS )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ "connection-type" ] == MODELED && deviceObject [ 'configuration-status' ] == DEVICE_STATE_MODELED )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ "connection-type" ] == MODELED && deviceObject [ 'configuration-status' ] == DEVICE_STATE_ACTIVATED )
              {
                disabledstatus = true;
              }
            }
            return disabledstatus;
          }
        },
        
        "launch-web-ui" :
        {
          "key": "launch-web-ui",
          "intent": {
            action: "space.intent.action.LAUNCH_WEB_UI"
          },
          "is-cluster-action": false,
          "mime-type": "vnd.net.juniper.space.device-management.devices",
          "check-enabled": function( selectedRows,isItemDisabled ) {

            // Check if this needs to be enabled for Parent devices

            var disabledstatus = isItemDisabled;
			//For single selection Check
            if ( selectedRows.length != 1 )
            {
              disabledstatus = true;
            }
            else
            {
              var deviceObject = selectedRows [ 0 ];
              if(!deviceObject || _.isArray(deviceObject)){
                disabledstatus = true;
              }
              else if ( deviceObject [ 'web-mgmt' ] == undefined || deviceObject [ 'web-mgmt' ] == null || deviceObject [ 'web-mgmt' ] == "" )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ 'deviceFamily' ] == BXOS_DEVICEFAMILY || deviceObject [ 'deviceFamily' ] == QFX_DEVICEFAMILY
                        || deviceObject [ 'deviceFamily' ] == QF_DEVICEFAMILY || deviceObject [ 'deviceFamily' ] == SCREENOS_DEVICEFAMILY )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ 'configuration-status' ] == DEVICE_STATE_IN_RMA || deviceObject [ 'configuration-status' ] == DEVICE_STATE_RMA_REACTIVATING
                        || deviceObject [ 'configuration-status' ] == DEVICE_STATE_RMA_REACTIVATE_FAILED )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ 'device-type' ] == LSYS )
              {
                disabledstatus = true;
              }
            }
            return disabledstatus;
          }
        },
        
        "ssh-to-device" :
        {
          "key": "ssh-to-device",
          "intent": {
            action: "space.intent.action.SSH_TO_DEVICE"
          },
          "is-cluster-action": false,
          "mime-type": "vnd.net.juniper.space.device-management.devices",
          "check-enabled": function( selectedRows,isItemDisabled ) {
            
            // Check if this needs to be enabled for parent devices

            var disabledstatus = isItemDisabled;
            if ( selectedRows.length != 1 )
            {
              disabledstatus = true;
            }
            else
            {
              var deviceObject = selectedRows [ 0 ];
              if(!deviceObject || _.isArray(deviceObject)){
                disabledstatus = true;
              }
              else if ( deviceObject [ "adapter-name" ] == WWJUNOS_ADAPTOR )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ 'deviceFamily' ] == DEVICE_FAMILY_TCAOS )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ 'device-type' ] == LSYS )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ "connection-type" ] == MODELED && deviceObject [ 'configuration-status' ] == DEVICE_STATE_MODELED )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ "connection-type" ] == MODELED && deviceObject [ 'configuration-status' ] == DEVICE_STATE_ACTIVATED )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ "authentication-status" ] == KEY_CONFLICT || deviceObject [ 'authentication-status' ] == KEY_CONFLICT_UNVERIFIED )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ "authentication-status" ] == FINGER_PRINT_CONFLICT )
              {
                disabledstatus = true;
              }
            }
            return disabledstatus;
          }
        },
        
        "delete_devices" : 
        {
          "key": "delete_devices",
          "intent": {
            action: "space.intent.action.ACTION_DELETE"
          },
          "is-cluster-action": true,
          "mime-type": "vnd.net.juniper.space.device-management.devices",
          "check-enabled": function( selectedRows,isItemDisabled ) {
            // Enable/Disable check is not needed for 'Delete Device' action, defaults to TRUE
            var disabledstatus = isItemDisabled;
            if(!selectedRows [ 0 ] || _.isArray(selectedRows [ 0 ])){
              disabledstatus = true;
            }
            return disabledstatus;
          }
        },
        
        "resynchronize_devices" : 
        {
          "key": "resynchronize_devices",
          "intent": {
            action: "space.intent.action.ACTION_RESYNC"
          },
          "is-cluster-action": true,
          "mime-type": "vnd.net.juniper.space.device-management.devices",
          "check-enabled": function( selectedRows,isItemDisabled ) {

            // Check if this needs to be enabled for parent devices

            var disabledstatus = isItemDisabled;
            if(!selectedRows [ 0 ] || _.isArray(selectedRows [ 0 ])){
              return true;
            }
            for ( i = 0; i < selectedRows.length; i++ )
            {
              var deviceObject = selectedRows [ i ];
              if ( deviceObject [ 'configuration-status' ] == DEVICE_STATE_SSOR_BOTH_CHANGED 
                        || deviceObject [ 'configuration-status' ] == DEVICE_STATE_SSOR_SPACE_CHANGED
                        || deviceObject [ 'configuration-status' ] == DEVICE_STATE_SSOR_DEVICE_CHANGED 
                        || deviceObject [ 'configuration-status' ] == DEVICE_STATE_SSOR_UNKNOWN 
                        || deviceObject [ 'configuration-status' ] == DEVICE_STATE_SSOR_IN_SYNC
                        || deviceObject [ 'configuration-status' ] == DEVICE_STATE_SSOR_UNDEF )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ 'configuration-status' ] == DEVICE_STATE_IN_RMA || deviceObject [ 'configuration-status' ] == DEVICE_STATE_RMA_REACTIVATING
                        || deviceObject [ 'configuration-status' ] == DEVICE_STATE_RMA_REACTIVATE_FAILED )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ 'device-type' ] == LSYS )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ 'deviceFamily' ] == DEVICE_FAMILY_VSE )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ 'configuration-status' ] == DEVICE_STATE_UNMANAGED )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ "connection-type" ] == MODELED && deviceObject [ 'configuration-status' ] == DEVICE_STATE_MODELED )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ "connection-type" ] == MODELED && deviceObject [ 'configuration-status' ] == DEVICE_STATE_ACTIVATED )
              {
                disabledstatus = true;
              }
            }
            return disabledstatus;

          }
        },
        
        "reboot_devices" : 
        {
          "key": "reboot_devices",
          "intent": {
            action: "space.intent.action.ACTION_REBOOT"
          },
          "is-cluster-action": true,
          "mime-type": "vnd.net.juniper.space.device-management.devices",
          "check-enabled": function( selectedRows,isItemDisabled ) {

            // Check if this needs to be enabled for parent devices

            var disabledstatus = isItemDisabled;
            if(!selectedRows [ 0 ] || _.isArray(selectedRows [ 0 ])){
              disabledstatus = true;
            }
            for ( i = 0; i < selectedRows.length; i++ )
            {
              var deviceObject = selectedRows [ i ];
              if ( deviceObject [ 'connection-status' ] != CONNECTION_STATUS_UP )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ 'device-type' ] == LSYS )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ 'configuration-status' ] == DEVICE_STATE_UNMANAGED )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ "connection-type" ] == MODELED && deviceObject [ 'configuration-status' ] == DEVICE_STATE_MODELED )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ "connection-type" ] == MODELED && deviceObject [ 'configuration-status' ] == DEVICE_STATE_ACTIVATED )
              {
                disabledstatus = true;
              }
            }
            return disabledstatus;

          }
        },
        
        "import_config" :
        {
          "key": "import_config",
          "intent": {
            action: "slipstream.intent.action.ACTION_IMPORT"
          },
          "is-cluster-action": false,
          "mime-type": "vnd.juniper.net.importconfig",
          "check-enabled": function( selectedRows,isItemDisabled ) {

            // Check if this needs to be enabled for parent devices

            var disabledstatus = isItemDisabled;
              var index;
              for (index = 0; index < selectedRows.length; index++) {
                  var deviceObject = selectedRows [index];
                  if (!deviceObject) {
                      disabledstatus = true;
                      break;
                  }
                  else if (deviceObject [ 'connection-status' ] != CONNECTION_STATUS_UP) {
                      disabledstatus = true;
                      break;
                  }
                  else if (deviceObject [ 'configuration-status' ] == DEVICE_STATE_UNMANAGED || deviceObject [ 'configuration-status' ] == DEVICE_STATE_SYNC_FAILED) {
                      disabledstatus = true;
                      break;
                  }
              }
            
            return disabledstatus;

          }
        },
        
        "import_change" :
        {
          "key": "import_change",
          "intent": {
            action: "sd.intent.action.ACTION_IMPORT_DEVICECHANGE"
          },
          "is-cluster-action": false,
          "mime-type": "vnd.juniper.net.importchange",
          "check-enabled": function( selectedRows,isItemDisabled ) {

            // Check if this needs to be enabled for parent devices

            var disabledstatus = isItemDisabled;

              var deviceObject = selectedRows [ 0 ];
              if (!deviceObject || selectedRows.length != 1 )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ 'connection-status' ] != CONNECTION_STATUS_UP )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ 'configuration-status' ] == DEVICE_STATE_UNMANAGED )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ 'management-status' ] != DEVICE_CHANGED  && deviceObject [ 'management-status' ] !== SD_CHANGED_DEVICE_CHANGED)
              {
                disabledstatus = true;
              }

            return disabledstatus;

          }
        },
        
        "view_change" :
        {
          "key": "view_change",
          "intent": {
            action: "sd.intent.action.ACTION_VIEW_DEVICECHANGE"
          },
          "is-cluster-action": false,
          "mime-type": "vnd.juniper.net.viewchange",
          "check-enabled": function( selectedRows,isItemDisabled ,isBookKeepingEnabled) {

            // Check if this needs to be enabled for parent devices

            var disabledstatus = isItemDisabled;

              var deviceObject = selectedRows [ 0 ];

              // check the flag status to enable or disable the device change button 
              if(!isBookKeepingEnabled) { 
                return true;
              }

              if (!deviceObject || selectedRows.length != 1 )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ 'connection-status' ] != CONNECTION_STATUS_UP )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ 'configuration-status' ] == DEVICE_STATE_UNMANAGED )
              {
                disabledstatus = true;
              }
              else if (deviceObject [ 'management-status' ] != DEVICE_CHANGED && deviceObject [ 'management-status' ] !== SD_CHANGED_DEVICE_CHANGED)
              {
                disabledstatus = true;
              }

            return disabledstatus;

          }
        },
        
        "device_update" :
        {
          "key": "device_update",
          "intent": {
            action: "slipstream.intent.action.ACTION_UPDATE"
          },
          "is-cluster-action": false,
          "mime-type": "vnd.juniper.net.sd.device.update",
          "check-enabled": function( selectedRows,isItemDisabled ) {

            // Check if this needs to be enabled for parent devices

            var disabledstatus = isItemDisabled;			
            for ( i = 0; i < selectedRows.length; i++ )
            {
              var deviceObject = selectedRows [ i ];
              if ( deviceObject [ 'connection-status' ] != CONNECTION_STATUS_UP )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ 'configuration-status' ] == DEVICE_STATE_UNMANAGED )
              {
                disabledstatus = true;
              }
           }
            return disabledstatus;

          }
        },
        
        "update_all_sd_devices" :
        {
          "key": "update_all_sd_devices",
          "intent": {
            action: "slipstream.intent.action.ACTION_UPDATE_ALL_SD_CHANGED_DEVICES"
          },
          "is-cluster-action": false,
          "mime-type": "vnd.juniper.net.sd.device.updateAllSdChangedDevices",
          "check-enabled": function( selectedRows,isItemDisabled ) {

            // Check if this needs to be enabled for parent devices

            var disabledstatus = isItemDisabled;
            return disabledstatus;

          }
        },
        
        "preview_config" :
        {
          "key": "preview_config",
          "intent": {
            action: "slipstream.intent.action.ACTION_PREVIEW"
          },
          "is-cluster-action": false,
          "mime-type": "vnd.juniper.net.sd.device.preview",
          "check-enabled": function( selectedRows,isItemDisabled ) {

            // Check if this needs to be enabled for parent devices

              var disabledstatus = isItemDisabled;
              var deviceObject = selectedRows [ 0 ];
              if (!deviceObject || selectedRows.length != 1 )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ 'connection-status' ] != CONNECTION_STATUS_UP )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ 'configuration-status' ] == DEVICE_STATE_UNMANAGED )
              {
                disabledstatus = true;
              }
           
              return disabledstatus;

          }
        },

        "refresh_certificate" :
        {
          "key": "refresh_certificate",
          "intent": {
            action: "slipstream.intent.action.ACTION_REFRESH_CERTIFICATES"
          },
          "is-cluster-action": false,
          "mime-type": "vnd.juniper.net.sd.device.refresh.certificates",
          "check-enabled": function( selectedRows,isItemDisabled ) {

              var disabledstatus = isItemDisabled,i;
              for (i = 0; i < selectedRows.length; i++) {
                  if(selectedRows[i]['device-type'] && selectedRows[i]['device-type'] === "LSYS"){
                    disabledstatus = true;
                    break;
                  }
              }
              return disabledstatus;

          }
        },
        
        "upload_keys" :
        {
          "key": "upload_keys",
          "intent": {
            action: "space.intent.action.UPLOAD_KEYS"
          },
          "is-cluster-action": false,
          "mime-type": "vnd.net.juniper.space.upload-keys.devices",
          "check-enabled": function( selectedRows,isItemDisabled ) {
            // Enable/Disable check is not needed for 'Upload Keys' action, defaults to TRUE
            var disabledstatus = isItemDisabled;
            return disabledstatus;
          }
        },
        
        "resolve_key_conflict" :
        {
          "key": "resolve_key_conflict",
          "intent": {
            action: "space.intent.action.RESOLVE_KEY_CONFLICT"
          },
          "is-cluster-action": true,
          "mime-type": "vnd.net.juniper.space.device-management.resolve-key-conflict",
          "check-enabled": function( selectedRows,isItemDisabled ) {

            var disabledstatus = isItemDisabled;
            if(_.isArray(selectedRows[0])){
              return true;
			}
            if ( selectedRows.length < 1 )
            {
              disabledstatus = true;
            }
            for ( i = 0; i < selectedRows.length; i++ )
            {
              var deviceObject = selectedRows [ i ];
              if ( deviceObject [ 'configuration-status' ] == DEVICE_STATE_UNMANAGED )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ "connection-type" ] == MODELED && deviceObject [ 'configuration-status' ] == DEVICE_STATE_MODELED )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ "connection-type" ] == MODELED && deviceObject [ 'configuration-status' ] == DEVICE_STATE_ACTIVATED )
              {
                disabledstatus = true;
              }
              else if ( deviceObject [ "authentication-status" ] != KEY_CONFLICT && deviceObject [ "authentication-status" ] != KEY_CONFLICT_UNVERIFIED )
              {
                disabledstatus = true;
              }
            }
            return disabledstatus;

          }
        },
        
        "assign_device_to_domain" :
        {
          "key": "assign_device_to_domain",
          "intent": {
            action: "space.intent.action.ASSIGN_DEVICE_TO_DOMAIN"
          },
          "is-cluster-action": true,
          "mime-type": "vnd.net.juniper.space.device-management.devices",
          "check-enabled": function( selectedRows,isItemDisabled ) {
            // Enable/Disable check is not needed for 'Asign Device to Domain' action, defaults to TRUE
            var disabledstatus = isItemDisabled;
            var deviceObject = selectedRows [ 0 ];
			if(!deviceObject || _.isArray( deviceObject ) ){
              disabledstatus = true;
            }
            if ( selectedRows.length < 1 )
            {
              disabledstatus = true;
            }
            return disabledstatus;
          }
        },
        
        "acknowledge_device_fingerprint" :
        {
          "key": "acknowledge_device_fingerprint",
          "intent": {
            action: "space.intent.action.ACTION_ACKNOWLEDGE_FINGERPRINT"
          },
          "is-cluster-action": true,
          "mime-type": "vnd.net.juniper.space.device-management.devices",
          "check-enabled": function( selectedRows,isItemDisabled ) {

            var disabledstatus = isItemDisabled;
            var deviceObject = selectedRows [ 0 ];
			if(!deviceObject || _.isArray( selectedRows [ 0 ] ) ){
              return true;
            }
            if ( selectedRows.length < 1 )
            {
              disabledstatus = true;
            }
            for ( i = 0; i < selectedRows.length; i++ )
            {
              var deviceObject = selectedRows [ i ];
              if ( deviceObject [ 'authentication-status' ] != FINGER_PRINT_CONFLICT
                  && deviceObject [ 'authentication-status' ] != KEY_CONFLICT_UNVERIFIED
                  && deviceObject [ 'authentication-status' ] != CREDENTIAL_UNVERIFIED
                  && deviceObject [ 'authentication-status' ] != RSA_KEY_UNVERIFIED )
              {
                disabledstatus = true;
              }
            }
            return disabledstatus;
          }
        },
        
        "view_active_configuration" :
        {
          "key": "view_active_configuration",
          "intent": {
            action: "space.intent.action.VIEW"
          },
          "is-cluster-action": false,
          "mime-type": "vnd.net.juniper.space.device-management.devices.active-configuration",
          "check-enabled": function( selectedRows,isItemDisabled ) {
            var disabledstatus = isItemDisabled;
            if (selectedRows.length > 10)
            {
              disabledstatus = true;
            }
            return disabledstatus;
          }
        },
        
        "quickViewEvent" :
        {
          "key": "quickView",
          "intent": {
            action: "Space.Intent.action.DETAILED_VIEW"
          },
          "is-cluster-action": false,
          "mime-type": "vnd.net.juniper.space.device-management.devices.detailed-view",
          "check-enabled": function( selectedRows,isItemDisabled ) {
            var disabledstatus = isItemDisabled;
            if ( selectedRows.length != 1 )
            {
              disabledstatus = true;
            }
            return disabledstatus;
          }
        }
        
      }
      
      return actionConfig;

    } );