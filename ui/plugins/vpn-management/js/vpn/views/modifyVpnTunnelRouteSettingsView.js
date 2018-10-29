/**
 * Module that implements the Modify VPN Tunnel/Route Settings page view.
 *
 * @module ModifyVpnTunnelRouteSettingsView
 * @author balasaritha <balasaritha@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon',
    '../conf/modifyVpnTunnelRouteSettingsFormConf.js',
    'widgets/form/formWidget',
    '../models/modifyTunnelRouteSettingsVpnModel.js',
    'widgets/overlay/overlayWidget'
], function (
    Backbone, Syphon, ModifyVpnTunnelRouteSettingsFormConf, FormWidget, ModifyIpsecVpnModel, OverlayWidget
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
            this.modifyVpnModel = new ModifyIpsecVpnModel();
        },

        /**
         * Renders the form view.
         *
         * returns this object
         */
        render: function() {
            var self = this;
            this.clearCache();
            var returnedData = this.loadVpn();
            if(returnedData['ipsec-vpn']["max-transmission-unit"] == -1) {
                returnedData['ipsec-vpn']["max-transmission-unit"] = '';
            }
            this.model.attributes = returnedData['ipsec-vpn'];

            var vpnTunnelRouteConfig = ModifyVpnTunnelRouteSettingsFormConf.getConfiguration(this.context);
            this.setVPNTypeString();

            this.formWidget = new FormWidget({
                'elements': vpnTunnelRouteConfig,
                'container': this.el,
                'values': this.model.attributes
            });
            this.formWidget.build();

            this.$el.find("#network-ip-subnet-mask").closest("div.row.row_subnet").hide();

            if(Object.keys(this.model.toJSON()).length !== 0) {
                this.modifyForm();
            }

            return this;
        },

        clearCache: function() {
            var clearStatus = false;
            var UUID = this.options.UUID;
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/reset-cache?ui-session-id=' + UUID,
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

        loadVpn: function() {
            var loadStatus = false;
            var UUID = this.options.UUID;
            var returnData ;
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/'+this.options.selectedRow+'?ui-session-id=' + UUID,
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

        // Check whether the selected devices support the type of vpn specified

        isFeatureSupported: function() {
            // Get the VPN MO saved from previous page
            var jsonRequestBody = this.model.get("basicvpndetails");
            var UUID = this.options.UUID;
            var jsonRequest = JSON.stringify(jsonRequestBody);
            var results = false;

            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/is-feature-supported?ui-session-id=' + UUID,//this.uuid,
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
        validateTunnel: function(json, event) {
            var self = this;
            var UUID = this.options.UUID;
            var jsonRequest = '{"vpn-basic-details":'+JSON.stringify(json)+'}';

             $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/validate-tunnel-settings?ui-session-id=' + UUID,//this.uuid,
                type: 'post',
                headers: {
                   'content-type': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.vpn-basic-details+json;version=1;charset=UTF-8',
                   'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.validate-tunnel-settings+json;version=1;q=0.01'
                },
                data: jsonRequest,
                success: function(data, status, response) {

                    if(response.responseJSON["validate-tunnel-settings-response"]["validation-result"] == "") {
                        self.saveVpn();
                        self.cancel(event);
                    } else if(response.responseJSON["validate-tunnel-settings-response"]["validation-result"][0].error != undefined) {
                        self.formWidget.showFormError(response.responseJSON["validate-tunnel-settings-response"]["validation-result"][0].field + ': ' + response.responseJSON["validate-tunnel-settings-response"]["validation-result"][0].error);
                         return false;
                    }
                },
                error: function(status) {

                }
            });
        },

        saveVpn: function() {
            var saveStatus = false;
            var UUID = this.options.UUID;
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/save-endpoints?ui-session-id='+ UUID +'&overwrite-changes=true',
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
            if(this.model.get("tunnel-interface-type") === "UNNUMBERED") {
                this.$el.find('input:radio[name=tunnel-interface-type]:nth(0)').attr('checked',true).trigger("click");
            } else {
                this.$el.find('input:radio[name=tunnel-interface-type]:nth(1)').attr('checked',true).trigger("click");
                if(this.model.get("tunnel-multi-point-size") === -1) {
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
        },

        /**
         * Return the page title for the wizard.
         *
         * returns String, the page title
         */
        getTitle: function() {
            return this.context.getMessage('vpn_trg_settings_form_section_heading_tunnel-settings');
        },

        submit: function(event) {
            event.preventDefault();
            var self = this,
                formData = Syphon.serialize(this),
                json;

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
                  "routing-type": formData['routing-type'],
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
                  "tunnel-multi-point-size": formData['tunnel-multi-point-size'],
                  "multi-proxyid": this.model.attributes['multi-proxyid'],
                  "advpn": this.model.attributes['advpn'],
                  "auto-vpn": this.model.attributes["auto-vpn"]
              }
              //"device-modification": ""
            };

            if (!this.formWidget.isValidInput()) {
                if(formData["tunnel-interface-type"] == "NUMBERED") {
                    console.log('form is invalid');
                    return false;
                }
            }

            this.modifyVpnModel.set(json);
            this.modifyVpnModel.url = '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/update-tunnel-settings-in-cache?ui-session-id='+ this.options.UUID;
            this.modifyVpnModel.save(null,{
                success: function(model, response) {
                    //this.isFeatureSupported();
                    if(json["vpn-mo"]["tunnel-interface-type"] != null && json["vpn-mo"]["tunnel-interface-type"] == "NUMBERED") {
                        console.log('interface type is:'+json["vpn-mo"]["tunnel-interface-type"]);
                        self.validateTunnel(json, event);
                    } else {
                        console.log('interface type is:'+json["vpn-mo"]["tunnel-interface-type"]);
                        self.saveVpn();
                        self.cancel(event);
                    }
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
        },

        setVPNTypeString: function() {
            var vpnType="";
            switch(this.model.attributes.type) {
                case "HUB_N_SPOKE":
                    vpnType = "Hub And Spoke";
                    break;
                case "FULL_MESH":
                    vpnType = "Full Mesh";
                    break;
                case "SITE_TO_SITE":
                    vpnType = "Site To Site";
                    break;
            }

            this.model.attributes.vpnType = vpnType;
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
                if(type === "HUB_N_SPOKE") {
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
                    break;
                case 'OSPF':
                    this.$el.find('.area-id').show();
                    this.$el.find('.max-retrans-time').hide();
                    this.$el.find('input[value="OSPF_ROUTES"]').parent().hide();
                    this.$el.find('input[value="RIP_ROUTES"]').parent().show();
                    this.$el.find('.allow-spoke-to-spoke-communication').hide();
                    break;
                case 'RIP':
                    this.$el.find('.area-id').hide();
                    this.$el.find('.max-retrans-time').show();
                    this.$el.find('input[value="OSPF_ROUTES"]').parent().show();
                    this.$el.find('input[value="RIP_ROUTES"]').parent().hide();
                    this.$el.find('.allow-spoke-to-spoke-communication').hide();
                    break;
                case 'NO_ROUTING':
                    this.$el.find('.area-id').hide();
                    this.$el.find('.max-retrans-time').hide();
                    this.$el.find('.allow-spoke-to-spoke-communication').hide();
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

        cancel: function (event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        }
    });

    return ModifyVpnTunnelRouteSettingsView;
});
