/**
 * Refresh certificates View
 *
 * @module refreshCertificatesView
 * @author vinayms <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 *
 * all the selected devices will be listed and this is used as a confirmation overlay for refresh certeficates
 **/
define( [
  '../../../../space-device-management/js/common/deviceManagementBaseView.js',
  '../conf/refreshCertificateFormConf.js',
  '../../../../space-device-management/js/device-delete/conf/deviceListGridConfiguration.js'
],
    function( DeviceManagementBaseView,
        FormConfiguration,
        GridConfiguration
        ) {

      var refreshCertificatesView = DeviceManagementBaseView.extend( {

        events: {
          "click #refresh_device_certificates_confirm_button": "refreshDeviceCertificates",
          "click #refresh_device_certificates_cancel_button": "closeOverlay"
        },

        // Method to view delete devices success job link

        refreshCertificatesSuccessCallback: function(jobid) {
          var intent = new Slipstream.SDK.Intent( "Space.Intent.action.DETAILED_JOB_VIEW",
              {
                "mime_type": "vnd.net.juniper.sm.job.detailedView"
              } );

          intent.putExtras( {
            data:{
              job: {
                id: jobid
              }
            }
          } );

          Slipstream.vent.trigger( "activity:start",
              intent );

        },

        render: function( ) {
          var self = this,
            formConfiguration = new FormConfiguration( self.context ).getValues( ),
            gridConfiguration = new GridConfiguration( self.context, self.urlPath ).getValues( );
          self.addFormWidget( self.el, formConfiguration, self );
          self.addGridWidget( 'device_list_grid', gridConfiguration, self );
          return self;
        },

        refreshDeviceCertificates: function(e) {
          var self = this, 
          dataObj = {
            "update-certificates-request": {
              "security-device-id-list": { "security-device-ids": self.sdDeviceIds }
            }
          };
          self.statusText = "Waiting_status_text";
          self.addSpinnerWidget( "refresh_device_certificates", self );
          $.ajax({
            url: '/api/juniper/sd/device-management/refresh-certificate-list',
            type: 'POST',
            data: JSON.stringify(dataObj),
            dataType:"json",
            headers:{
                'accept': 'application/vnd.net.juniper.space.job-management.task+json;version=1;q=0.02',
                'content-type': 'application/vnd.juniper.sd.device-management.update-certificates-request+json;version=2;charset=UTF-8'
            },
            success: function(response, status){
              self.closeOverlay(e);
              self.refreshCertificatesSuccessCallback(response.task.id);
            }
          });
        }

      } );

      return refreshCertificatesView;
    } );