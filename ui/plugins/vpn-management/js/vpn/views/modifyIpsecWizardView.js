/**
 * The launch Update device ILP page
 *
 * @module DeviceUpdate View
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../models/modifyGeneralSettingsVpnModel.js',
    '../models/vpnProfileCollection.js',
    '../conf/modifyIpsecVpnsFormWizardConf.js',
    'widgets/spinner/spinnerWidget',
    '../utils.js'
],  function (Backbone, Syphon,
        FormWidget,ModifyGeneralModel, VPNProfileCollection, ModifyIpsecFormWizardConf, SpinnerWidget, Utils) {

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
            'click #unmask-id': "manualUnmask",
            'click #advpn-id': "adVpn",
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

        render: function () {
            var self = this, modifyFormConf = new ModifyIpsecFormWizardConf(this.context);
            var filterUrl = '';
            self.model.attributes = this.options.returnedData;

            self.isReadyForNextPage = false;

            this.setVPNTypeString();
            this.setVPNTunnelModeString();

            // build the device update form
            this.formWidget = new FormWidget({
                "elements" : modifyFormConf.getValues(),
                "container" : this.el,
                "values": self.model.attributes
            });
            this.formWidget.build();

            if(Object.keys(this.model.toJSON()).length !== 0){
               this.modifyForm();
            }

           this.$el.find('input[type=radio][name=preshared-key-type]').click(function() {
                self.presharedTypeChangeHandler(this.value);
            });

           var auto_vpn_checked = this.$el.find('#auto-vpn-id').prop('checked');
           var advpn_checked = this.$el.find('#advpn-id').prop('checked');


           if(auto_vpn_checked){
               filterUrl = '?vpnType=HUB_N_SPOKE&isAutoVpn=true&isAdvpn=' + advpn_checked;
               this.getVpnProfilesData(filterUrl);
            } else {
               // full mesh does not support aggressive mode profile
               if (this.model.attributes.type === "Full Mesh") {
                   filterUrl = '?vpnType=FULL_MESH';
                   this.getVpnProfilesData(filterUrl);
               } else {
                   this.getVpnProfilesData();
               }
            }
             if(this.$el.find('#shortcut-conn-limit').val() == "-1"){
               this.$el.find('#shortcut-conn-limit').val("");
             }
             if(this.$el.find('#idle-threshold').val() == "-1"){
                this.$el.find('#idle-threshold').val("");
              }
             if(this.$el.find('#idle-time').val() == "-1"){
                this.$el.find('#idle-time').val("");
              }
            return this;
       },

        vpnProfileSelect : function(event) {
           var selectedVal = $("#modify-vpn-profile-id").children('option:selected').val();
           var profileId="";
           this.profileObjects.forEach(function(object){
                if(object.name===selectedVal) {
                    profileId=object.id;
                }
           });

           if(this.isCertificateBasedProfile(profileId)) {
               this.$el.find('.presharedkeyid').hide();
               this.$el.find('.auto-generate').hide();
               this.$el.find('.manual').hide();
           }
           else {
               this.$el.find('.presharedkeyid').show();
               if (this.$el.find('input:radio[name=preshared-key-type]:nth(0)').prop('checked')) {
                   this.$el.find('.manual').hide();
                   this.$el.find('.auto-generate').show();
               } else {
                   this.$el.find('.manual').show();
                   this.$el.find('.auto-generate').hide();
               }
           }
        },
        manualUnmask : function(event){
             event.stopPropagation();
              if(this.$el.find("input#unmask-id").is(':checked')=== true){
                 var passwrd = this.getDecryptedValue();
                     if (passwrd !== 'undefined') {
                         this.$el.find('#manual-key-id').val(passwrd);
                     };
                     $('#manual-key-id').attr('type','text');
             }else{
                 $('#manual-key-id').attr('type','password');
             }
        },

//        ADVPN is true only for hub-and-spoke and for auto-vpn
        adVpn: function(event) {
            var filterUrl = "";

            if  (this.$el.find('#advpn-id').prop('checked')) {
                 this.$el.find('.shortcut-conn-limit').show();
                 this.$el.find('.idle-threshold').show();
                 this.$el.find('.idle-time').show();

            // profile changes if advpn is selected - filter parameter is passed to collection
                filterUrl = '?vpnType=HUB_N_SPOKE&isAutoVpn=true&isAdvpn=true';
                this.model.attributes.advpn = true;

                this.$el.find('#shortcut-conn-limit').val(this.model.attributes['advpn-settings']['shortcut-conn-limit']);
                this.$el.find('#idle-threshold').val(this.model.attributes['advpn-settings']['idle-threshold']);
                this.$el.find('#idle-time').val(this.model.attributes['advpn-settings']['idle-time']);

                // Do not show -1 value if user hits next from modify form page and then back from device association page
                // and then selects advpn

                if (this.$el.find('#shortcut-conn-limit').val() == "-1"){
                    this.$el.find('#shortcut-conn-limit').val("");
                }
                if (this.$el.find('#idle-threshold').val() == "-1"){
                    this.$el.find('#idle-threshold').val("");
                }
                if (this.$el.find('#idle-time').val() == "-1"){
                    this.$el.find('#idle-time').val("");
                }

                this.getVpnProfilesData(filterUrl);
            } else {
                this.$el.find('.shortcut-conn-limit').hide();
                this.$el.find('.idle-threshold').hide();
                this.$el.find('.idle-time').hide();
                filterUrl = '?vpnType=HUB_N_SPOKE&isAutoVpn=true&isAdvpn=false';
                this.model.attributes.advpn = false;
                this.getVpnProfilesData(filterUrl);
            }
        },

        getJsonForVpn: function(){
            var self = this,
            formData = Syphon.serialize(this),
            json;
            self.displaySpinner(self.el, self.context.getMessage("Waiting_status_text"));
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
            if (formData["idle-threshold"] === "")
                formData["idle-threshold"] = -1;
            if (formData["idle-time"] === "")
                formData["idle-time"] = -1;
            if (formData["shortcut-conn-limit"] === "")
                formData["shortcut-conn-limit"] = -1;

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

            var routeSettingVal = "NO_ROUTING";

            if(!formData["multi-proxy-id"]) {
                routeSettingVal = this.model.attributes["routing-type"];
            }

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
          			  "routing-type": routeSettingVal,
                      "preshared-key-type": formData["preshared-key-type"],
                      "preshared-key": formData["manual"],
                      "unique-key-per-tunnel": formData.uniqueKeyPerTunnel,
                      "advpn": formData["advpn"],
                      "auto-vpn": formData["auto-vpn-id"],
                      "advpn-settings": {
                             "shortcut-conn-limit": formData["shortcut-conn-limit"],
                             "idle-threshold": formData["idle-threshold"],
                             "idle-time": formData["idle-time"]
                      },
                      "multi-proxyid": formData["multi-proxy-id"],
                      "max-transmission-unit": this.model.attributes['max-transmission-unit']
                      }
                  //},
                  //"device-modification": ""
                };
          return json;

        },

        submit: function(event) {
             var self = this;
             var json = this.getJsonForVpn();
             if (this.formWidget.isValidInput(this.$el.find('form'))) {
                this.modifyGeneralModel.set(json);
                this.modifyGeneralModel.url = '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/modify-general-settings?ui-session-id=' + this.options.uuid;
                this.modifyGeneralModel.save(null,{
                success: function(model, response) {

                       self.model.attributes["name"]                = json["vpn-mo"]["name"];
                       self.model.attributes["description"]         = json["vpn-mo"]["description"];
                       self.model.attributes["profile"]["id"]       = json["vpn-mo"]["profile"]["id"];
                       self.model.attributes["profile"]["name"]     = json["vpn-mo"]["profile"]["name"];
                       self.model.attributes["preshared-key-type"]  = json["vpn-mo"]["preshared-key-type"];
                       self.model.attributes["preshared-key"]       = json["vpn-mo"]["preshared-key"];
                       self.model.attributes["multi-proxyid"]       = json["vpn-mo"]["multi-proxyid"];
                       self.model.attributes["advpn-settings"]      = json["vpn-mo"]["advpn-settings"];

                       var vpnProfileMO = self.getVpnProfileMo(self.model.attributes["profile"]["id"]);
                       self.model.set("modifygeneralsettingsprofilemode", vpnProfileMO['phase1-setting']['mode']);
                       self.model.set("isGeneralIkeIdProfile", vpnProfileMO['phase1-setting']['general-ikeid']);

                        if(self.validateDevice()) {

                           self.isReadyForNextPage = true;
                           if(self.nextPage == 0) {
                               self.options.wizardView.wizard.gotoPage(0);
                           }  else {
                               self.options.wizardView.wizard.nextPage();
                           }

                        }
                         self.destroySpinner();

                },

                error: function(model, response) {
                    self.destroySpinner();
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


        validateDevice: function() {
           var json = this.getJsonForVpn();
           var results = true;
           var jsonRequest = '{"vpn-basic-details":'+JSON.stringify(json)+'}';

            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/validate-device?ui-session-id=' + this.options.uuid,
                type: 'post',
                dataType: 'json',
                headers: {
                   'content-type': ' application/vnd.juniper.sd.vpn-management.ipsec-vpns.vpn-basic-details+json;version=1;charset=UTF-8'
                },
                data: jsonRequest,
                success: function(data, status, response) {
                    if(jQuery(status.responseText).text() === "True"){
                        results = true;
                    } else {
                        Utils.showNotification("error", jQuery(status.responseText).text())
                        results = false;
                    }
                },
                error: function(status) {
                    if(jQuery(status.responseText).text() === "True"){
                        results = true;
                    } else {
                        Utils.showNotification("error", jQuery(status.responseText).text())
                        results = false;
                    }

                },
                async: false
            });

            return results;
        },

        displaySpinner: function(container, message){
            this.spinner = new SpinnerWidget({
                                "container": container,
                                "statusText": message
                            }).build();
            return this.spinner;
        },

        destroySpinner:function(spinner){
            this.spinner.destroy();
        },

        /**
         *  Renders the form view in a overlay.
         *  returns this object
         */
        getVpnProfilesData: function (filterUrl) {
            var self = this;
            self.profileObjects = [];

            var newUrl;
            if (filterUrl) {
                // Get base url + filter url
                newUrl = this.vpnProfileCollection.url() + filterUrl;
            } else {
                // Get unfiltered base url
                newUrl = this.vpnProfileCollection.url();
            };

            this.vpnProfileCollection.fetch({
                url: newUrl,
                success: function (vpnProfileCollection, response, options) {
                    var generalSettings = self.model.get('generalsettings');
//                    // clear out any profiles in the drop down menu
                    self.$el.find('#modify-vpn-profile-id').empty();
                    response['vpn-profiles']['vpn-profile'].forEach(function(object) {
                       self.$el.find('#modify-vpn-profile-id').append( new Option(object.name+" ("+object['domain-name']+")",object.name));
                       self.$el.find('#modify-vpn-profile-id').val(self.model.attributes['profile'].name);
                       self.profileObjects.push({"name":object.name,"id":object.id});
                    });
                    self.options.returnedData.profile.profileObjects=self.profileObjects;
                    if(self.$el.find('#modify-vpn-profile-id').val() == null || self.$el.find('#modify-vpn-profile-id').val() == undefined)
                    self.$el.find('#modify-vpn-profile-id').val(self.profileObjects[0].name);
                },
                error: function (vpnProfileCollection, response, options) {
                    console.log('vpn profile collection not fetched');
                }
            });
        },

       getDecryptedValue: function() {
            var generalSettings = this.model.attributes;
            keyid = generalSettings["preshared-key"];
            var decryptedPresharedKey = '';
            $.ajax({
                url: '/api/juniper/sd/vpn-management/decrypted-presharedkey?key=' + keyid,
                headers: {
                    'Accept': 'application/vnd.juniper.sd.vpn-management.decrypted-presharedkey+json;version=2;q=0.02'
                },
                type: 'get',
                success: function(data, status,response) {
                   var clearStatus = true;
                    decryptedPresharedKey = response.responseJSON['decrypted-preshared-key'].value;
                },
                async: false,
            });

            return decryptedPresharedKey;
        },
/*
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
        },  */
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

            this.$el.find('input[name=multi-proxy-id]').attr("checked", this.model.get("multi-proxyid"));
            this.$el.find('input[name=auto-vpn-id]').attr("checked", this.model.get("auto-vpn"));
            this.$el.find('input[name=advpn]').attr("checked", this.model.get("advpn"));
            this.$el.find('input:radio[name=preshared-key-type]:nth(0)').attr('checked',true).trigger("click");

            if(tunnelMode === "POLICY_BASED" || tunnelMode === "Policy Based") {
                this.$el.find('.multi-proxy-id').hide();
            } else {
                this.$el.find('.multi-proxy-id').show();
            }
            if(type == "HUB_N_SPOKE" || type == "Hub And Spoke") {
                this.$el.find('.hub-and-spoke').show();
                this.$el.find('.auto-vpn').show();
                this.$el.find('#auto-vpn-id').prop("disabled", true);

                if (this.$el.find('#auto-vpn-id').prop('checked')) {
                    this.$el.find('#multi-proxy-id').prop('checked', false);
                    this.$el.find('#multi-proxy-id').prop("disabled", true);
                }
            }

            if(presharedType === "MANUAL"){
                this.$el.find('input:radio[name=preshared-key-type]:nth(1)').attr('checked',true).trigger("click");
                this.$el.find('.manual').show();
                this.$el.find('.auto-generate').hide();
            }else{
                this.$el.find('input:radio[name=preshared-key-type]:nth(0)').attr('checked',true).trigger("click");
                this.$el.find('.manual').hide();
                this.$el.find('.auto-generate').show();
            }

            var profileId = this.model.attributes.profile.id;
            if(this.isCertificateBasedProfile(profileId)) {
                this.$el.find('.presharedkeyid').hide();
                this.$el.find('.auto-generate').hide();
                this.$el.find('.manual').hide();
            }
            else {
                this.$el.find('.presharedkeyid').show();
                if (presharedType === "MANUAL"){
                    this.$el.find('.manual').show();
                    this.$el.find('.auto-generate').hide();
                } else {
                    this.$el.find('.manual').hide();
                    this.$el.find('.auto-generate').show();
                }
            }
            if(this.$el.find('#auto-vpn-id').prop('checked')){
                this.$el.find('.auto-vpn').show();
            } else {
                this.$el.find('.auto-vpn').hide();
            }


            if(this.$el.find('#advpn-id').prop('checked')){

                 this.$el.find('#shortcut-conn-limit').val(this.model.attributes['advpn-settings']['shortcut-conn-limit']);
                 this.$el.find('#idle-threshold').val(this.model.attributes['advpn-settings']['idle-threshold']);
                 this.$el.find('#idle-time').val(this.model.attributes['advpn-settings']['idle-time']);

                 this.$el.find('.shortcut-conn-limit').show();
                 this.$el.find('.idle-threshold').show();
                 this.$el.find('.idle-time').show();
            } else {
                 this.$el.find('.shortcut-conn-limit').hide();
                 this.$el.find('.idle-threshold').hide();
                 this.$el.find('.idle-time').hide();
            }
        },

        isCertificateBasedProfile : function(profileId) {
                    var self = this;
                    self.isCertBasedProfile=false;
                    $.ajax({
                         url: '/api/juniper/sd/vpn-management/vpn-profiles/'+profileId,
                              type: 'get',
                              dataType: 'json',
                              headers: {
                                 'accept': 'application/vnd.juniper.sd.vpn-management.vpn-profile+json;q=0.01;version=1'
                              },
                              success: function(data, status) {
                                         self.vpnProfileData = data;
                                         var authMethod = data['vpn-profile']['phase1-setting']['auth-method'];
                                         var isGeneralIkeIdProfile = data['vpn-profile']['phase1-setting']['general-ikeid'];
                                         self.options.returnedData.profile.authMethod=authMethod;
                                         self.options.returnedData.profile.isGeneralIkeIdProfile = isGeneralIkeIdProfile;
                                         if(authMethod === "RSA_SIGNATURE" || authMethod === "DSA_SIGNATURE"
                                                || authMethod === "EC_DSA_SIGNATURE_256" || authMethod === "EC_DSA_SIGNATURE_384") {
                                                    self.isCertBasedProfile = true;
                                                }
                                         },
                                         error: function() {
                                                console.log('vpn profile data not fetched');
                                         },
                              async: false
                    });
                    return this.isCertBasedProfile;
        },

        getSummary: function() {
          // get summary is being called, so add the new vpn name to collection now

          var summary = [];
          var userData = Syphon.serialize(this);
          var vpnnameLabel = this.context.getMessage('vpn_wizard_name_page_train_title');
          var vpnType = "";

          summary.push({
              'label': vpnnameLabel,
              'value': ' '
          });

          summary.push({
              'label': this.context.getMessage('ipsec_vpns_grid_column_name_name'),
              'value': userData["name"]
          });

          if (userData["vpn-type-button"] == "SITE_TO_SITE")
              vpnType = this.context.getMessage("vpn_wizard_site_to_site_button");

          if (userData["vpn-type-button"] == "HUB_AND_SPOKE")
              vpnType = this.context.getMessage("vpn_wizard_hub_and_spoke_button");

          if (userData["vpn-type-button"] == "FULL_MESH")
              vpnType  = this.context.getMessage("vpn_wizard_full_mesh_button");

          summary.push({
              'label': this.context.getMessage('ipsec_vpns_grid_column_name_type'),
              'value': vpnType
          });

          summary.push({
              'label': this.context.getMessage('ipsec_vpns_grid_column_name_profile-name'),
              'value': this.model.attributes["profile"]["name"]
          });

          return summary;
        },



        beforePageChange:function (currentPage, nextPage) {
                var vpnType="";
                var vpnTunnelMode = "";
                var comp1 = this.$el.find('#name').val();
                var comp2 = this.options.returnedData.name;
                var self = this;
                self.nextPage = nextPage;

                console.log("Current Page:" + currentPage);
                console.log("Next Page : " + nextPage);

                if(self.isReadyForNextPage)
                    return true;

                if(comp1 != comp2){
                if(!this.validateVpnName()) {
                        this.destroySpinner();
                        return false;
                }
                   }
                switch(this.model.attributes.type) {
                    case "Hub And Spoke":
                    case "HUB_N_SPOKE":
                        vpnType = "HUB_N_SPOKE";
                        break;
                    case "Full Mesh":
                    case "FULL_MESH":
                        vpnType = "FULL_MESH";
                        break;
                    case "Site To Site":
                    case "SITE_TO_SITE":
                        vpnType = "SITE_TO_SITE";
                        break;
                }
                this.model.attributes.type = vpnType;

                switch(this.model.get("vpn-tunnel-mode-types")) {
                    case "Route Based":
                    case "ROUTE_BASED":
                        vpnTunnelMode = "ROUTE_BASED";
                        break;
                    case "Policy Based":
                    case "POLICY_BASED":
                        vpnTunnelMode = "POLICY_BASED";
                        break;
                    }
                this.model.set("vpn-tunnel-mode-types", vpnTunnelMode);
                if (this.$el.find('#shortcut-conn-limit').parent().hasClass("error") || this.$el.find('#idle-time').parent().hasClass("error") || this.$el.find('#idle-threshold').parent().hasClass("error")) {
                     this.destroySpinner();
                     return false;
                }

                this.submit();

            return false;
        },
        /**
         *   destroy the overlay
         *   @params event(mouse, keyboard)
         */
        closeOverlay: function (event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        },

         validateVpnName: function() {
                 	    var comp = this.$el.find('#name');
                         var vpnError;

                         if (comp.attr("data-invalid") === undefined) {
                             if (!this.isVpnNameUnique(comp.val())) {
                                 vpnError = this.context.getMessage('name_duplicate_error');
                                 this.showErrorMessage('name', vpnError);
                 /* BUG - if error 404 can't access then thinks duplicate error

                 WORKAROUND IF NO VPN exist needs to be done.

                                 return false;
                 */
                                 return false;
                             }
                         } else {
                             vpnError = this.context.getMessage('vpn_wizard_name_input_error');
                             this.showErrorMessage('name', vpnError);
                             return false;
                         }

                 	    return true;
                     },

            showErrorMessage: function(id, message) {
                    this.$el.find('#'+id).attr("data-invalid", "").parent().addClass('error');
                    this.$el.find('label[for='+id+']').parent().addClass('error');
                    this.$el.find('#'+id).parent().find("small[class*='error']").html(message);
                },

                isVpnNameUnique: function(name) {
                	    var me = this;
                        var isValid = false;
                        $.ajax({
                		    url: '/api/juniper/sd/vpn-management/isuniquename?name='+name,
                		    type: 'GET',
                		    dataType: "json",
                		    headers: {
                			    'accept': 'application/vnd.juniper.sd.vpn-management.isuniquename+json;version=2;q=0.02'
                		    },

                		    success: function(data, status) {
                			    if(data['is-unique-vpnname']['value'] == 'true' || data['is-unique-vpnname']['value'] == true) {
                			        isValid = true;
                			    }
                		    },
                		    async: false
                	    });

                	    return isValid;
                    },

        getVpnProfileMo: function(profileId) {
            var self = this;
            var mo = "";
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-profiles/'+profileId,
                type: 'get',
                dataType: 'json',
                headers: {
                   'accept': 'application/vnd.juniper.sd.vpn-management.vpn-profile+json;q=0.01;version=1'
                },
                success: function(data, status) {
                    mo = data['vpn-profile'];
                },
                error: function() {
                    console.log('certificates not fetched');
                },
                async: false
            });
            return mo;
        },

        getTitle: function () {
              return this.context.getMessage('vpn_wizard_name_page_title');
        }
    });

    return ModifyIpsecVpnsForm;
});
