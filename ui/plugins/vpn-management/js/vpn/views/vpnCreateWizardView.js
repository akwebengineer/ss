/**
 * Module that implements the VpnCreateWizardView.
 *
 * @module VpnCreateWizardView
 * @author Stanley Quan <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'widgets/shortWizard/shortWizard',
    './vpnNamePageView.js',
    './vpnEndpointsPageView.js',
    './vpnTunnelRouteGlobalSettingsPageView.js',
    './vpnEndpointSettingsPageView.js',
    '../../../../ui-common/js/views/apiResourceView.js'
    ], function(
           Backbone,
           ShortWizard,
           VpnNamePageView,
           VpnEndpointsPageView,
           VpnTunnelRouteGlobalSettingsPageView,
           VpnEndpointSettingsPageView,
           ResourceView){

    var VpnCreateWizardView = ResourceView.extend({

        initialize: function (options) {
            var self = this,
                pages = new Array();

            // Generates a uuid
            var uuid = Slipstream.SDK.Utils.url_safe_uuid();


            ResourceView.prototype.initialize.call(this, options);

/*
Kept here incase UX wants to put the intro back in
            pages.push({
                title: this.context.getMessage('intro_page_train_title'),
                view: new VpnCreateIntroPageView({
                    context: this.context
                }),
                intro: true
            });
*/

            pages.push({
                title: this.context.getMessage('vpn_wizard_name_page_train_title'),
                view: new VpnNamePageView({
                    context: this.context,
                    model: this.model,
                    wizardView: this,
                    uuid: uuid
                })
            });

            pages.push({
                title: this.context.getMessage('vpn_wizard_endpoint_page_train_title'),
                view: new VpnEndpointsPageView({
                    context: this.context,
                    model: this.model,
                    wizardView: this,
                    uuid: uuid
                })
            });

            pages.push({
                title: this.context.getMessage('vpn_wizard_tunnel_and_route_settings_page_train_title'),
                view: new VpnTunnelRouteGlobalSettingsPageView({
                    context: this.context,
                    wizardView: this,
//                    model: (this.vpnTRGSettingsPageViewModel = new Backbone.Model())
                    model: this.model,
                    uuid: uuid
                })
            });

            pages.push({
                title: this.context.getMessage('vpn_wizard_endpoint_settings_page_train_title'),
                view: new VpnEndpointSettingsPageView({
                    context: this.context,
                    model: this.model,
                    wizardView: this,
                    uuid: uuid
                })
            });

            this.wizard = new ShortWizard({
                container: this.el,
                title: this.context.getMessage('vpn_create_wizard_title'),
                titleHelp: {
                    "content": this.context.getMessage("vpn_wizard_create_tooltip"),
                    'ua-help-text' : this.context.getMessage('more_link'),
                    "ua-help-identifier": this.context.getHelpKey("VPN_IPSEC_CREATING")
                },
                pages: pages,
                save:  function(options) {
                    // vpn endpoint settings page has method for creating vpn
                    var wizardPage = 3;
                    var response;
                    var results;
                    var responseString = "";
                    var responseText = "";

                    // get the name of the vpn from the space model
                    var generalSettings = self.model.get("generalsettings");
                    var vpnName = generalSettings.name;

                    // Create the VPN by executing the cached createVpn method in the endpoint settings page

                    this.pages[wizardPage].view.createVpnFromCache(uuid, options);
                    
                    /*if (results === true) {
                        // Replace the placeholder "{0}" with the vpn name
                        responseString = self.context.getMessage("vpn_wizard_create_success");
                        responseString = responseString.replace("{0}",vpnName);
                        // Invoke the success process of wizard
                        options.success(responseString);
                    } else {
                        // Replace the placeholder "{0}" with the vpn name
                        responseString = self.context.getMessage("vpn_wizard_create_failure");
                        responseString = responseString.replace("{0}",vpnName);
                        // Invoke the error process of wizard
                        options.error(responseText + ". " + responseString);
                    }*/
//                    saveModel(options);
                },

                sleep: function(milliSeconds) {
                    var startTime = new Date().getTime();
                    while (new Date().getTime() < startTime + milliSeconds);
                },

                onCancel: _.bind(function() {
                    self.activity.setResult(Slipstream.SDK.BaseActivity.RESULT_CANCELLED);
                    self.activity.finish();
                    self.activity.overlay.destroy();
                }, self),
                onDone: _.bind(function() {
                    self.activity.overlay.destroy();
                }, self)
            });

            var saveModel = function(options) {
                self.model.save(null,{
                    success: function(model, response) {
                        var json = model.toJSON();

                        json = json[model.jsonRoot];

                        // Set result to the grid
                        self.activity.setResult(Slipstream.SDK.BaseActivity.RESULT_OK, json);
                        self.activity.finish();

                        // Invoke the success process of wizard
                        options.success(self.context.getMessage("vpn_wizard_create_success", [model.get("name")]));
                    },

                    error: function(model, response) {
                        var message;

                        try {
                            message = JSON.parse(response.responseText);
                            message = (message.title) ? message.title + ': ' + message.message : message.message;
                        } catch (e) {
                            message = response.responseText || response;
                        }
                        // Invoke the error process of wizard
                        options.error(message);
                    }
                });
            };
            return this;
        },

        render: function() {
          this.wizard.build();
          return this;
        }
    });

  return VpnCreateWizardView;
});
