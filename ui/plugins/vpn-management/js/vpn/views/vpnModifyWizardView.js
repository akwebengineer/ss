/**
 * Wizard to Modify VPN.
 *
 * @module vpnModifyVPNVIew
 * @author Srinivasan Sriramulu <ssriram@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'widgets/shortWizard/shortWizard',
 //   '../models/managedServicesCollection.js',
    './vpnModifyIntroPageView.js',
    './modifyIpsecWizardView.js',
    './modifyVpnDeviceAssociationWizardView.js',
    './modifyVpnTunnelRouteSettingsWizardView.js',
    './modifyVpnDeviceEndpointsSettingsWizardView.js',
    './vpnImportDeviceGridView.js',
    './vpnImportDeviceEndPointsView.js',
    './vpnImportSummaryView.js',
    '../utils.js',
    '../../../../ui-common/js/views/apiResourceView.js'
    ], function(
           Backbone,
           ShortWizard,
           vpnModifyIntroPageView,
           ModifyIpsecWizardView,
           ModifyVpnDeviceAssociationWizardView,
           ModifyVpnTunnelRouteSettingsWizardView,
           ModifyVpnDeviceEndpointsSettingsWizardView,
           VpnImportDeviceGridView,
           VpnImportDeviceEndPointsView,
           VpnImportSummaryView,
           Utils,
           ResourceView){

    var VpnModifyWizardView = ResourceView.extend({

        initialize: function (options) {
            var self = this,
                pages = [],
                dataObject = {},
                serviceType = [];
            this.context = options.activity.getContext();

            ResourceView.prototype.initialize.call(this, options);

            this.uuid = options.UUID;
            this.dataObject = dataObject;
            this.dataObject.isInitiated = false;
            this.serviceType = 'modifyvpn';


           dataObject.uuid = this.uuid;
              /*   dataObject.managedServicesCache = {
                "model": new ManagedServicesCollection({"uuid":this.uuid})
            };*/

            var linkValue = options.selectedRow;//options.selectedRows[0].id;
            var model = options.model;//new this.model();
      //      var url_safe_uuid = Slipstream.SDK.Utils.url_safe_uuid();

            this.clearCache(this.uuid);
            var returnedData =[];
            returnedData = this.loadVpn(this.uuid);
            self.model.attributes = returnedData['ipsec-vpn'];

          /*  pages.push({
                title            : this.context.getMessage(''),
                view             : new vpnModifyIntroPageView({
                    "context"    : this.context,
                    "dataObject" : dataObject,
                    "uuid"       :this.uuid
                }),
                intro: true

            }); */

            pages.push({
                title               : this.context.getMessage('modify_vpn_wizard_general_settings'),
                view                : new ModifyIpsecWizardView({
                    activity        : self,
                    model           : model,
                    context         : self.context,
                    selectedRow     : linkValue,
                    uuid            : this.uuid,
                    wizardView      : self,
                    returnedData    : returnedData['ipsec-vpn']
                })
            });

            pages.push({
                title               : this.context.getMessage('modify_vpn_wizard_device_association'),
                view                : new ModifyVpnDeviceAssociationWizardView({
                    activity        : self,
                    model           : model,
                    context         : self.context,
                    selectedRow     : linkValue,
                    UUID            : this.uuid,
                    wizardView      : self,
                    returnedData    : returnedData['ipsec-vpn']
                })
            });

            pages.push({
                title               : this.context.getMessage('modify_vpn_wizard_tunnel_route_settings'),
                view                : new ModifyVpnTunnelRouteSettingsWizardView({
                    activity        : self,
                    model           : model,
                    context         : self.context,
                    selectedRow     : linkValue,
                    UUID            : this.uuid,
                    wizardView      : self,
                    returnedData    : returnedData['ipsec-vpn']
                })
            });


            pages.push({
                title               : this.context.getMessage('modify_vpn_wizard_device_endpoint_settings'),
                view                : new ModifyVpnDeviceEndpointsSettingsWizardView({
                    activity        : self,
                    model           : model,
                    context         : self.context,
                    selectedRow     : linkValue,
                    wizardView      : self,
                    UUID            : this.uuid,
                    returnedData    : returnedData['ipsec-vpn']
                })
            });

            this.wizard = new ShortWizard({
                id: 'modifyVPNWizard',
                container: this.el,
                title: this.context.getMessage('modify_vpn_wizard_title'),
               //     showSummary: MyCustomView,  // Optional, defaults to true
                titleHelp: {
                    "content": this.context.getMessage('modify_vpn_wizard_title_tooltip'),
                    "ua-help-text": this.context.getMessage('more_link'),
                    "ua-help-identifier": this.context.getHelpKey("VPN_IPSEC_EDITING")
                },
                pages: pages,
                type: "xlarge",
                save:  function(options) {
                    self.saveVpn(self.uuid, options);
                },

                 sleep: function(milliSeconds) {
                    var startTime = new Date().getTime();
                    while (new Date().getTime() < startTime + milliSeconds);
                 },

                onCancel: _.bind(function() {
                    self.activity.setResult(Slipstream.SDK.BaseActivity.RESULT_CANCELLED);
                    self.activity.finish();
                    self.activity.view.overlay.destroy();
                }, self),
                onDone: _.bind(function() {

                    self.activity.view.overlay.destroy();
                    self.activity.view.gridWidget.reloadGrid();
                    // Closing Wizard while Click on OK Button Summary Page
                }, self)
            });
            return this;
        },

        render: function() {
          this.dataObject.lastScreen=0;
          this.wizard.build();
          return this;
        },

        clearCache: function(uuid) {
            var clearStatus = false;
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/reset-cache?ui-session-id=' + uuid,
                type: 'get',

                success: function(data, status) {
                    clearStatus = true;
                },
                async: false,
                error: function(status) {
                    console.log('Unable to clear cache');
                }
            });

            return clearStatus;
        },

        loadVpn: function(uuid) {
            var loadStatus = false;
            var returnData ;
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/'+this.options.selectedRow+'?ui-session-id=' + uuid,
                type: 'get',
                dataType: 'json',
                headers: {
                   'Accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpn+json;version=1;q=0.01'
                },
                success: function(data, status) {
                    returnData = data;
                    loadStatus = true;
                },
                async: false,
                error: function(status) {
                    console.log('Unable to clear cache');
                    loadStatus = false;
                }
            });

            return returnData;
        },

        saveVpn: function(uuid, options) {
            var saveStatus = false;
            var self = this;
            var resText = '';

            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/save-endpoints?ui-session-id='+ uuid +'&overwrite-changes=true',
                type: 'get',
                success: function(data, status, response) {
                    var successIndex = response.responseText.indexOf('success');
                    var vpnResult = response.responseText.substr(successIndex+8, 5);

               /*     if (vpnResult.indexOf('true') != -1){
                        saveStatus = true;
                    } else {
                        saveStatus = response.responseText;
                    }
                    */

                    if (vpnResult.indexOf('true') != -1) {
                        // Replace the placeholder "{0}" with the vpn name
                        responseString = self.context.getMessage("vpn_wizard_modify_success");
                        responseString = responseString.replace("{0}",self.model.attributes["name"]);
                        Utils.showNotification("success", responseString);
                        // Invoke the success process of wizard
                        options.success(responseString);
                    } else {

                         var messageFailureStartIndex = response.responseText.indexOf('<message>');
                         var messageFailureEndIndex = response.responseText.indexOf('</message>');
                         var totalStringLength = messageFailureEndIndex - messageFailureStartIndex;
                         var vpnResult = response.responseText.substr(messageFailureStartIndex+9, totalStringLength-9);

                        // Replace the placeholder "{0}" with the vpn name
                        responseString = self.context.getMessage("vpn_wizard_modify_failure");
                        responseString = responseString.replace("{0}",self.model.attributes["name"]);
                        Utils.showNotification("success", responseString);
                        // Invoke the error process of wizard
                        options.error(vpnResult + ". " + responseString);
                    }
                },
         //       async: false,
                error: function(status) {
                    console.log('Unable to clear cache');
                }
            });

            return saveStatus;
        },

         /**
         *  generate Unique Id for each Import Configuration action.
         *  returns unique identifier String
         */
        getUUId: function () {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });
            return uuid;
        }
    });

  return VpnModifyWizardView;
});
