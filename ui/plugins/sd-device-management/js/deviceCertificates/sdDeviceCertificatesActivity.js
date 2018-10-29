/**
 * Device certificates Activity page
 *
 * @module sdDeviceCertificatesActivity
 * @author vinayms <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 * 
 **/
define( [
  '../../../space-device-management/js/common/deviceManagementBaseActivity.js',
  './views/refreshCertifictesView.js'
],
    function( DeviceManagementBaseActivity,
        RefreshCertificatesView ) {

      var DeviceRefreshCertificatesActivity = function( ) {

        DeviceManagementBaseActivity.call( this );

        this.onStart = function( ) {

          this.handleRefreshCertificatesIntent( );

        };

        this.handleRefreshCertificatesIntent = function( ) {

          var self = this,
              extras = this.intent.getExtras( ),
              sdDeviceIds = '',
              deviceIds = '',
              data;
          if ( extras.data ) {
            data = extras.data;
            sdDeviceIds = data.sdDeviceIds;
            deviceIds = data.deviceIds;
            this.createRefreshCertificatesView( self, deviceIds, sdDeviceIds );
          }

        };

        this.createRefreshCertificatesView = function( self, deviceIds, sdDeviceIds ) {

          self.refreshCertificatesView = new RefreshCertificatesView( {
            activity: self,
            data: { deviceIds:deviceIds, sdDeviceIds : sdDeviceIds }
          });
          self.buildOverlay( self.refreshCertificatesView, { type: 'medium' } );

        };

      };

      DeviceRefreshCertificatesActivity.prototype = Object.create( DeviceManagementBaseActivity.prototype );
      DeviceRefreshCertificatesActivity.prototype.constructor = DeviceRefreshCertificatesActivity;

      return DeviceRefreshCertificatesActivity;
    } );
