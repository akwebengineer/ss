/**
 * Module that implements the Modify VPN Tunnel/Route Settings page view.
 *
 * @module ModifyVpnTunnelRouteSettingsView
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon',
    '../conf/modifyVpnTunnelRouteSettingsFormWizardConf.js',
    'widgets/form/formWidget',
    '../models/modifyTunnelRouteSettingsVpnModel.js',
    'widgets/overlay/overlayWidget'
], function (
    Backbone, Syphon, ModifyVpnTunnelRouteSettingsFormWizardConf, FormWidget, ModifyIpsecVpnModel, OverlayWidget
) {

    var ModifyVpnTunnelRouteSettingsView = Backbone.View.extend({

        // events registration
        events: {
            "click input[name=tunnel-interface-type]": "onClickInterfaceType",
            "click input[name=no-of-spokes]": "onClickNoOfSpokes",
            "click input[name=routing-type]": "onClickRoutingOptions",
            'click #btnOk': 'submit',
            'click #linkClose': 'cancel'
        },

        /**
         * The constructor for this view using overlay.
         *
         * @param {Object} options - The options containing the Slipstream's context
         */
        initialize: function(options) {
            this.activity = options.activity;
            this.context = options.context;
            this.UUID = this.options.UUID;
            this.model = options.model;
            this.modifyVpnModel = new ModifyIpsecVpnModel();
        },

        /**
         * Renders the form view.
         *
         * returns this object
         */
        render: function() {
            var self = this;
            /*this.clearCache();
            var returnedData = this.loadVpn();

            if(returnedData['ipsec-vpn']["max-transmission-unit"] == -1) {
                returnedData['ipsec-vpn']["max-transmission-unit"] = '';
            }
            this.model.attributes = returnedData['ipsec-vpn']; */
            if(this.options.returnedData["max-transmission-unit"] == -1) {
                this.options.returnedData["max-transmission-unit"] = '';
            }

            if(this.options.returnedData["tunnel-multi-point-size"] == -1) {
                this.options.returnedData["tunnel-multi-point-size"] = '';
            }

            this.model.attributes = this.options.returnedData;

            var vpnTunnelRouteConfig = ModifyVpnTunnelRouteSettingsFormWizardConf.getConfiguration(this.context);

            this.formWidget = new FormWidget({
                'elements': vpnTunnelRouteConfig,
                'container': this.el,
                'values': this.model.attributes
            });
            this.formWidget.build();

            if (self.options.wizardView.wizard.mode === "POLICY_BASED"){
                 self.formWidget.conf.container.find('form#modify-vpn-tr-settings .form_section').hide();
                 self.formWidget.showFormError(this.context.getMessage('vpn_policy_based_no_tunnel_setting_error'));
                return this;
            }

            this.$el.find("#network-ip-subnet-mask").closest("div.row.row_subnet").hide();

            if(Object.keys(this.model.toJSON()).length !== 0) {
                this.modifyForm();
            }

            return this;
        },

        // Check whether the selected devices support the type of vpn specified

        isFeatureSupported: function() {
            // Get the VPN MO saved from previous page
            var jsonRequestBody = this.model.get("basicvpndetails");
            var jsonRequest = JSON.stringify(jsonRequestBody);
            var results = false;

            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/is-feature-supported?ui-session-id=' + this.UUID,//this.uuid,
                type: 'post',
                dataType: 'json',
                headers: {
                   'content-type': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.vpn-basic-details+json;version=1;charset=UTF-8',
                   'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.is-feature-supported+json;version=1;q=0.01'
                },
                data: jsonRequest,
                success: function(data, status, response) {
                    if (response.responseJSON["is-feature-supported-response"].value === "True")
                        results = true;
                    else
                        results = false;
                },
                error: function(status) {
                    results = false;
                },
                async: false
            });

            return results;
        },

        // To validate Tunnel settings if Tunnel interface type is Numbered
        validateTunnelSettings: function(json) {
            var self = this;
            var jsonRequest = '{"vpn-basic-details":'+JSON.stringify(json)+'}';

            var results = false;

             $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/validate-tunnel-settings?ui-session-id=' + this.UUID,//this.uuid,
                type: 'post',
                headers: {
                   'content-type': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.vpn-basic-details+json;version=1;charset=UTF-8',
                   'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.validate-tunnel-settings+json;version=1;q=0.01'
                },
                data: jsonRequest,
                success: function(data, status, response) {
                    if (response.responseJSON["validate-tunnel-settings-response"]["validation-result"].length === 0)
                        results = true;
                    else
                        results = response.responseJSON["validate-tunnel-settings-response"]["validation-result"][0];
                },
                error: function(status) {
                    console.log('tunnel not validated');
                    results = false;
                },
                async: false
            });
            return results;
        },

        saveVpn: function() {
            var saveStatus = false;
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/save-endpoints?ui-session-id='+ this.UUID +'&overwrite-changes=true',
                type: 'get',
                success: function(data, status) {
                    saveStatus = true;
                },
                async: false,
                error: function(status) {
                    console.log('Unable to clear cache');
                }
            });

            return saveStatus;
        },

        modifyForm : function(data){

            var autoVpn = this.model.get("auto-vpn");
            var adVpn = this.model.get("advpn");
            if(autoVpn || (autoVpn && adVpn)) {
                this.$el.find('#interface-type-numbered-id').attr('checked',true).trigger("click");
                this.$el.find('#interface-type-numbered-id').hide();
                this.$el.find("#interface-type-unnumbered-id").closest("div.optionselection").hide();
            }
            if(this.model.get("multi-proxyid") && (this.model.get("type") == "FULL_MESH" || this.model.get("type") == "HUB_N_SPOKE" )) {
                this.$el.find("#interface-type-numbered-id").closest("div.optionselection").hide();
                this.$el.find('#interface-type-unnumbered-id').hide();
            }
            if(this.model.get("tunnel-interface-type") === "UNNUMBERED") {
                this.$el.find('input:radio[name=tunnel-interface-type]:nth(0)').attr('checked',true).trigger("click");
            } else {
                this.$el.find('input:radio[name=tunnel-interface-type]:nth(1)').attr('checked',true).trigger("click");
                if(this.model.get("tunnel-multi-point-size") === -1 || this.model.get("tunnel-multi-point-size") == "") {
                    this.$el.find('input:radio[name=no-of-spokes]:nth(0)').attr('checked',true).trigger("click");
                } else {
                    this.$el.find('input:radio[name=no-of-spokes]:nth(1)').attr('checked',true).trigger("click");
                }
            }
            switch(this.model.get("routing-type")) {
                case 'STATIC':
                    this.$el.find('input:radio[name=routing-type]:nth(0)').attr('checked',true).trigger("click");
                    if(this.model.get("allow-spoke-to-spoke-communication") === true) {
                        this.$el.find('#allow-spoke-to-spoke-communication').attr('checked', true);
                    } else {
                        this.$el.find('#allow-spoke-to-spoke-communication').attr('checked', false);
                    }
                    break;
                case 'OSPF':
                    this.$el.find('input:radio[name=routing-type]:nth(1)').attr('checked',true).trigger("click");
                    break;
                case 'RIP':
                    this.$el.find('input:radio[name=routing-type]:nth(2)').attr('checked',true).trigger("click");
                    break;
                case 'NO_ROUTING':
                    this.$el.find('input:radio[name=routing-type]:nth(3)').attr('checked',true).trigger("click");
                    break;
            }
            if(autoVpn) {
                this.$el.find("#routing-type-static").closest("div.optionselection").hide();
//                this.$el.find('#routing-type-ospf').attr('checked',true).trigger("click");
            }

            if(this.model.get("multi-proxyid") == true) {
                this.$el.find('#route-settings').hide();
            } else {
                this.$el.find('#route-settings').show();
                this.$el.find("input[type='radio']:checked").click();
            }
        },

        /**
         * Return the page title for the wizard.
         *
         * returns String, the page title
         */
        getTitle: function() {
            return this.context.getMessage('vpn_trg_settings_form_title');
        },

        submit: function(event) {
            //event.preventDefault();
            var self = this,
                formData = Syphon.serialize(this),
                json;

            var routeSettingVal = "NO_ROUTING";

            if(!this.model.attributes['multi-proxyid']) {
                routeSettingVal = formData['routing-type'];
            }

            if (formData["tunnel-interface-type"] === "NUMBERED") {

                 if (!this.formWidget.isValidInput()) {
                      console.log('form is invalid');
                      return false;
                 }

                 if(formData["network-ip-cidr"] == "") {
                      this.formWidget.showFormError(this.context.getMessage('vpn_trg_settings_specify_mask'));
                      return false;
                 }
            }

            var tunnelMultiPointSize = -1;
            if(formData["tunnel-interface-type"] == "NUMBERED" && this.model.attributes.type == "HUB_N_SPOKE"
               && formData["no-of-spokes"] === "SPECIFY_VALUE") {
                    if(formData["tunnel-multi-point-size"] != -1 && formData["tunnel-multi-point-size"] != "") {
                       tunnelMultiPointSize = formData["tunnel-multi-point-size"];
                    } else {
                        this.formWidget.showFormError(this.context.getMessage('vpn_trg_settings_specify_value'));
                        return false;
                    }
            }

            //for unnumbered always set the tunnel-multi-point-size as "1", This is what backend expects in case or unnumbered.
            if(formData["tunnel-interface-type"] == "UNNUMBERED") {
                tunnelMultiPointSize = 1;
            }

            /**
            *  Json Format for Modify IPsec Vpn
            */
            json = {"vpn-mo": {
                  "edit-version": this.model.attributes["edit-version"],
                  "id": this.model.attributes.id,
                  "name": this.model.attributes.name,
                  "description": this.model.attributes.description,
                  "profile": this.model.attributes.profile,
                  "profile": {
                      "id": this.model.attributes.profile.id,
                      "name": this.model.attributes.profile.name,
                      "moid": "net.juniper.space.sd.vpnmanager.jpa.IPSecVPNProfileEntity:"+this.model.attributes.profile.id
                  },
                  "preshared-key-type": this.model.attributes["preshared-key-type"],
                  "preshared-key": this.model.attributes["preshared-key"],
                  "vpn-tunnel-mode-types": this.model.attributes["vpn-tunnel-mode-types"],
                  "type": this.model.attributes.type,
                  "routing-type": routeSettingVal,
                  "unique-key-per-tunnel": this.model.attributes["unique-key-per-tunnel"],
                  //"advpnSettings": this.model.attributes["advpnSettings"],
                  "tunnel-ip-range": {
                      "mask": formData['network-ip-cidr'],
                      "network-ip": formData['network-ip-address']
                  },
                  "mini-subnet-mask": this.model.attributes['mini-subnet-mask'],
                  "domain-name": this.model.attributes['domain-name'],
                  "ospf-area-id": formData['area-id'],
                  "max-retrans-time": formData['max-retrans-time'],
                  "max-transmission-unit": formData['max-transmission-unit'],
                  "allow-spoke-to-spoke-communication": formData['allow-spoke-to-spoke-communication'],
                  "tunnel-interface-type": formData['tunnel-interface-type'],
                  "tunnel-multi-point-size": tunnelMultiPointSize,
                  "multi-proxyid": this.model.attributes['multi-proxyid'],
                  "advpn": this.model.attributes['advpn'],
                  "auto-vpn": this.model.attributes["auto-vpn"],
                 "advpn-settings": {
                        "shortcut-conn-limit": this.model.attributes["advpn-settings"]["shortcut-conn-limit"],
                        "idle-threshold": this.model.attributes["advpn-settings"]["idle-threshold"],
                        "idle-time": this.model.attributes["advpn-settings"]["idle-time"]
                  }
              }
              //"device-modification": ""
            };

            if(formData["tunnel-interface-type"] == "NUMBERED") {
                validate = this.validateTunnelSettings(json);
                if (validate != true || validate === "true") {
                    this.formWidget.showFormError(validate.field+': '+validate.error);
                    return false;
                }
            }

            this.modifyVpnModel.set(json);
            this.modifyVpnModel.url = '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/update-tunnel-settings-in-cache?ui-session-id='+ this.UUID;
            this.modifyVpnModel.save(null,{
                success: function(model, response) {

                    /*//this.isFeatureSupported();
                    if(json["vpn-mo"]["tunnel-interface-type"] != null && json["vpn-mo"]["tunnel-interface-type"] == "NUMBERED") {
                        console.log('interface type is:'+json["vpn-mo"]["tunnel-interface-type"]);
                        self.validateTunnel(json, event);
                    } else {
                        console.log('interface type is:'+json["vpn-mo"]["tunnel-interface-type"]);
                        self.saveVpn();
                        self.cancel(event);
                    }*/

                    self.model.attributes["max-retrans-time"]                    = json["vpn-mo"]["max-retrans-time"];
                    self.model.attributes["max-transmission-unit"]               = json["vpn-mo"]["max-transmission-unit"];
                    self.model.attributes["mini-subnet-mask"]                    = json["vpn-mo"]["mini-subnet-mask"];
                    self.model.attributes["allow-spoke-to-spoke-communication"]  = json["vpn-mo"]["allow-spoke-to-spoke-communication"];
                    self.model.attributes["multi-proxyid"]                       = json["vpn-mo"]["multi-proxyid"];
                    self.model.attributes["ospf-area-id"]                        = json["vpn-mo"]["ospf-area-id"];
                    self.model.attributes["tunnel-interface-type"]               = json["vpn-mo"]["tunnel-interface-type"];
                    self.model.attributes["tunnel-multi-point-size"]             = json["vpn-mo"]["tunnel-multi-point-size"];
                    self.model.attributes["unique-key-per-tunnel"]               = json["vpn-mo"]["unique-key-per-tunnel"];
                    self.model.attributes["tunnel-ip-range"]["mask"]             = json["vpn-mo"]["tunnel-ip-range"]["mask"];
                    self.model.attributes["tunnel-ip-range"]["network-ip"]       = json["vpn-mo"]["tunnel-ip-range"]["network-ip"];
                    self.model.attributes["routing-type"]                        = json["vpn-mo"]["routing-type"];
                    self.model.attributes["advpn-settings"]                      = json["vpn-mo"]["advpn-settings"];

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
//                    options.error(message);
                }
            });
            return true;
        },

        // Page View event handlers

        /**
         * Handles clicks on interface-type radio selection, shows/hides related UI elements.
         * @param {Object} e - event object
         */
        onClickInterfaceType: function(e) {
            var type = this.model.attributes.type;
            if (e.currentTarget.value == 'NUMBERED') {
                this.$el.find('.numbered').show();
                if((type === "HUB_N_SPOKE") && !(this.model.attributes['auto-vpn'])) {
                    this.$el.find('.no-of-spokes').show();
                    this.$el.find('.no-of-spokes-value').show();
                    this.$el.find("input[value='ALL']:checked").click();
                } else {
                    this.$el.find('.no-of-spokes').hide();
                    this.$el.find('.no-of-spokes-value').hide();
                }
            } else {
                this.$el.find('.numbered').hide();
            }
        },

        /**
         * Handles clicks on routing-options radio selection, shows/hides related UI elements.
         * @param {Object} e - event object
         */
        onClickRoutingOptions: function(e) {
            var type = this.model.attributes.type;
            switch (e.currentTarget.value) {
                case 'STATIC':
                    this.$el.find('.area-id').hide();
                    this.$el.find('.max-retrans-time').hide();
                    if(type === "HUB_N_SPOKE") {
                        this.$el.find('.allow-spoke-to-spoke-communication').show();
                    } else {
                        this.$el.find('.allow-spoke-to-spoke-communication').hide();
                    }
                    this.model.set("routingOptions","STATIC");
                    break;
                case 'OSPF':
                    this.$el.find('.area-id').show();
                    this.$el.find('.max-retrans-time').hide();
                    this.$el.find('input[value="OSPF_ROUTES"]').parent().hide();
                    this.$el.find('input[value="RIP_ROUTES"]').parent().show();
                    this.$el.find('.allow-spoke-to-spoke-communication').hide();
                    this.model.set("routingOptions","OSPF");
                    break;
                case 'RIP':
                    this.$el.find('.area-id').hide();
                    this.$el.find('.max-retrans-time').show();
                    this.$el.find('input[value="OSPF_ROUTES"]').parent().show();
                    this.$el.find('input[value="RIP_ROUTES"]').parent().hide();
                    this.$el.find('.allow-spoke-to-spoke-communication').hide();
                    this.model.set("routingOptions","RIP");
                    break;
                case 'NO_ROUTING':
                    this.$el.find('.area-id').hide();
                    this.$el.find('.max-retrans-time').hide();
                    this.$el.find('.allow-spoke-to-spoke-communication').hide();
                    this.model.set("routingOptions","NO_ROUTING");
                    break;
            }
        },

        /**
         * Handles clicks on no-of-spokes radio selection, shows/hides related UI elements.
         * @param {Object} options - The options containing the Slipstream's context
         */
        onClickNoOfSpokes: function(e) {
            if (e.currentTarget.value == 'ALL') {
                this.$el.find('.no-of-spokes-value').hide();
            } else {
                this.$el.find('.no-of-spokes-value').show();
            }
        },

        getSummary: function() {
            var summary = [];
            var userData = this.model.attributes;
            var vpnnameLabel = this.context.getMessage('vpn_wizard_tunnel_and_route_settings_page_train_title');
            var interfaceType = "";
            var routingOptions  = "";
            var spokeToSpoke = "";

            if (userData["routing-type"] == "OSPF")
                routingOptions = this.context.getMessage('vpn_wizard_ospf');
            if (userData["routing-type"] == "STATIC")
                routingOptions = this.context.getMessage('vpn_wizard_static');
            if (userData["routing-type"] == "RIP")
                routingOptions = this.context.getMessage('vpn_wizard_rip');
            if (userData["routing-type"] == "NO_ROUTING")
                routingOptions = this.context.getMessage('vpn_wizard_none');


           if (userData["spoke-to-spoke"] == this.context.getMessage('vpn_wizard_allow'))
               spokeToSpoke = this.context.getMessage('vpn_wizard_ospf');
           if (userData["routing-type"] == this.context.getMessage('vpn_wizard_not_allow'))
               spokeToSpoke = this.context.getMessage('vpn_wizard_not_allow');

            if(userData["vpn-tunnel-mode-types"] != "POLICY_BASED") {
                summary.push({
                  'label': vpnnameLabel,
                  'value': '&nbsp;'
                });

                summary.push({
                   'label': this.context.getMessage('vpn_wizard_routing_options'),
                   'value': routingOptions
                });

                summary.push({
                   'label': this.context.getMessage('vpn_wizard_spoke_to_spoke'),
                   'value': spokeToSpoke
                });
            }

            return summary;
        },

        beforePageChange:function (currentPage, nextPage) {
             if (this.options.wizardView.wizard.mode === "POLICY_BASED" && nextPage == 4 || nextPage == 2){
                 return true;
             }
             return this.submit();
        }

    });

    return ModifyVpnTunnelRouteSettingsView;
});
