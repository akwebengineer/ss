/**
 * The launch Update device ILP page
 *
 * @module DeviceUpdate View
 * @author ponraja <ponraja@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../models/modifyGeneralSettingsVpnModel.js',
    '../models/vpnProfileCollection.js',
    '../conf/modifyIpsecVpnsFormConf.js'
],  function (Backbone, Syphon,
        FormWidget,ModifyGeneralModel, VPNProfileCollection, ModifyIpsecFormConf) {

    var ModifyIpsecVpnsForm = Backbone.View.extend({

        /**
         *   add event for
         *   closing,
         *   Ok
         */
        events: {
            'click #btnOk': 'submit',
            'click #linkClose': 'closeOverlay',
            'change #modify-vpn-profile-id' : 'vpnProfileSelect',
            'click #unmask-id': "manualUnmask"
        },

        vpnProfileSelect : function(event) {
           var selectedVal = $("#modify-vpn-profile-id").children('option:selected').val();
           if(selectedVal==="RSAProfile") {
              this.$el.find('.presharedkeyid').hide();
              this.$el.find('.auto-generate').hide();
           }
           else {
             this.$el.find('.presharedkeyid').show();
             this.$el.find('.auto-generate').show();
           }
        },

        manualUnmask : function(event){

             if(this.$el.find("#unmask-id").is(":checked") === true){
                $('#manual-key-id').attr('type','text');

             }else{
                 $('#manual-key-id').attr('type','password');
             }
        },

        submit: function(event) {
            var self = this,
            formData = Syphon.serialize(this),
            json;
            formData.id = this.model.attributes.id;
            var profileLength = self.vpnProfileCollection.models.length;
            for (var i = 0; i < profileLength; i ++) {
                if(self.vpnProfileCollection.models[i].attributes.name == formData["vpn-profile"]) {
                    this.model.attributes.profile.name = formData["vpn-profile"];
                    this.model.attributes.profile["@href"] = self.vpnProfileCollection.models[i].attributes["@href"];
                    this.model.attributes.profile["id"] = self.vpnProfileCollection.models[i].attributes["id"];
                }
            }
            var profileFromModel = this.model.attributes.profile;
            formData.profile = new Object();//this.model.attributes.profile;
            formData.profile.id=profileFromModel.id;
            formData.profile.moid="net.juniper.space.sd.vpnmanager.jpa.IPSecVPNProfileEntity:"+profileFromModel.id;
            formData.profile.name=profileFromModel.name;
            formData.advpnSettings = this.model.attributes.advpnSettings;
            formData.editVersion = this.model.attributes["edit-version"];
            if(this.model.attributes["vpn-tunnel-mode-types"] == "Route Based") {
                formData.vpnTunnelMode = "ROUTE_BASED";
            } else {
                formData.vpnTunnelMode = "POLICY_BASED";
            }

            formData.tunnelInterfaceType = this.model.attributes["tunnel-interface-type"];
            formData.tunnelIpRange = this.model.attributes["tunnel-ip-range"];
            var tunnelIpRangeFromModel = this.model.attributes["tunnel-ip-range"];//formData.tunnelIpRange;
            formData.tunnelIpRange = new Object();
            formData.tunnelIpRange.mask=tunnelIpRangeFromModel.mask;
            formData.tunnelIpRange.networkIp=tunnelIpRangeFromModel['network-ip'];
            formData.tunnelMultiPointSize = this.model.attributes["tunnel-multi-point-size"];
            formData.uniqueKeyPerTunnel = this.model.attributes["unique-key-per-tunnel"];
            formData.routingType = this.model.attributes["routing-type"];
            if(this.model.attributes.type == "Site To Site") {
                formData.type = "SITE_TO_SITE";
            } else if (this.model.attributes.type == "Full Mesh") {
                formData.type = "FULL_MESH";
            } else {
                formData.type = "HUB_N_SPOKE";
            }

           /**
            *  Json Format for Modify IPsec Vpn
            */
          json = {"vpn-mo": {
                      "edit-version": formData.editVersion,
                      "id": formData.id,
                      "name": formData.name,
                      "description": formData.description,
                      "profile": formData.profile,
                      "vpn-tunnel-mode-types": formData.vpnTunnelMode,
                      "type": formData.type,
                      "tunnel-interface-type": formData.tunnelInterfaceType,
                      "tunnel-ip-range":{
		         "network-ip":formData.tunnelIpRange.networkIp,
		          "mask":formData.tunnelIpRange.mask
		       },
                      "tunnel-multi-point-size": formData.tunnelMultiPointSize,
          			  "routing-type": formData.routingType,
                      "preshared-key-type": formData["preshared-key-type"],
                      "preshared-key": formData["manual"],
                      "unique-key-per-tunnel": formData.uniqueKeyPerTunnel,
                      "advpn": "false",
                      "auto-vpn": formData["auto-vpn-id"],
                      "advpnSettings": formData.advpnSettings,
                      "multi-proxyid": formData["multi-proxy-id"],
                      "max-transmission-unit": this.model.attributes['max-transmission-unit']
                      }
                  //},
                  //"device-modification": ""
                };

             if (this.formWidget.isValidInput(this.$el.find('form'))) {
                this.modifyGeneralModel.set(json);
                this.modifyGeneralModel.url = '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/modify-general-settings?ui-session-id=' + this.options.uuid;
                this.modifyGeneralModel.save(null,{
                success: function(model, response) {
                    self.saveVpn();
                    self.closeOverlay(event);
                },

                error: function(model, response) {
                    var message;

                    try {
                        message = JSON.parse(response.responseText);
                        message = (message.title) ? message.title + ': ' + message.message : message.message;
                    } catch (e) {
                        message = response.responseText || response;
                    }
                }
            });
            }
        },
        /**
         *  Initialize all the view require params
         */
        initialize: function (options) {
            var self = this;
            self.activity = options.activity;
            self.context = options.context;
            self.model = options.model;
            self.modifyGeneralModel = new ModifyGeneralModel();
            this.vpnProfileCollection = new VPNProfileCollection();
        },

        /**
         *  Renders the form view in a overlay.
         *  returns this object
         */
        getVpnProfilesData: function () {
            var self = this;
            this.vpnProfileCollection.fetch({
                success: function (vpnProfileCollection, response, options) {
                    response['vpn-profiles']['vpn-profile'].forEach(function(object) {
                       self.$el.find('#modify-vpn-profile-id').append( new Option(object.name,object.name));
                       self.$el.find('#modify-vpn-profile-id').val(self.model.attributes['profile'].name);
                    });
                },
                error: function (vpnProfileCollection, response, options) {
                    console.log('vpn profile collection not fetched');
                }
            });
        },

        render: function () {
            var self = this, modifyFormConf = new ModifyIpsecFormConf(this.context);
            this.clearCache();
            var returnedData = this.loadVpn();
            self.model.attributes = returnedData['ipsec-vpn'];
            this.setVPNTypeString();
            this.setVPNTunnelModeString();
            // build the device update form
            this.formWidget = new FormWidget({
                "elements" : modifyFormConf.getValues(),
                "container" : this.el,
                "values": self.model.attributes
            });
            this.formWidget.build();
            this.getVpnProfilesData();

            if(Object.keys(this.model.toJSON()).length !== 0){
               this.modifyForm();
            }

           this.$el.find('input[type=radio][name=preshared-key-type]').click(function() {
                self.presharedTypeChangeHandler(this.value);
            });
            return this;
        },

        clearCache: function() {
            var clearStatus = false;
            var UUID = this.options.uuid;
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
            var UUID = this.options.uuid;
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

        saveVpn: function() {
            var saveStatus = false;
            var UUID = this.options.uuid;
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
       /*
        *Hide or show the predefined proposal set fields based on the proposal type
        */
        presharedTypeChangeHandler : function(presharedType){
            if(presharedType === "MANUAL"){
                this.$el.find('.manual').show();
                this.$el.find('.auto-generate').hide();
            }else{
                this.$el.find(".manual").hide();
                this.$el.find('.auto-generate').show();
            }
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
            this.model.attributes.type = vpnType;
        },

         setVPNTunnelModeString: function() {
              var vpnTunnelMode = "";
              switch(this.model.get("vpn-tunnel-mode-types")) {
                case "ROUTE_BASED":
                    vpnTunnelMode = "Route Based";
                    break;
                case "POLICY_BASED":
                    vpnTunnelMode = "Policy Based";
                    break;
                }
              this.model.set("vpn-tunnel-mode-types", vpnTunnelMode);
         },


        /*
         * Incase of modify and clone fill the form values with the data of the selected profile
         */
        modifyForm : function(data){
            var presharedType = this.model.get("preshared-key-type");
            var tunnelMode = this.model.get("vpn-tunnel-mode-types");
            var type = this.model.get("type");
            if(tunnelMode == "ROUTE_BASED") {
                this.$el.find('.multi-proxy').show();
            }
            if(type == "HUB_N_SPOKE") {
                this.$el.find('.auto-vpn').show();
            }

            this.$el.find('input[name=multi-proxy-id]').attr("checked", this.model.get("multi-proxyid"));
            this.$el.find('input[name=auto-vpn-id]').attr("checked", this.model.get("auto-vpn"));
            this.$el.find('input:radio[name=preshared-key-type]:nth(0)').attr('checked',true).trigger("click");
            if(presharedType === "MANUAL"){
                this.$el.find('input:radio[name=preshared-key-type]:nth(1)').attr('checked',true).trigger("click");
                this.$el.find('.manual').show();
                this.$el.find('.auto-generate').hide();
            }else{
                this.$el.find('input:radio[name=preshared-key-type]:nth(0)').attr('checked',true).trigger("click");
                this.$el.find(".manual").hide();
                this.$el.find('.auto-generate').show();
            }
        },

        /**
         *   destroy the overlay
         *   @params event(mouse, keyboard)
         */
        closeOverlay: function (event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        }
    });

    return ModifyIpsecVpnsForm;
});
