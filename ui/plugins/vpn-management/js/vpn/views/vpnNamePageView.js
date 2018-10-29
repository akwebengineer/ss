/**
 * Module that implements the VpnNamePageView.
 *
 * @module VpnNamePageView
 * @author Stanley Quan <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */


define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/vpnNameFormConfig.js',
    '../models/vpnProfileCollection.js',
    './vpnCreateWizardStepView.js',
    'widgets/spinner/spinnerWidget'
], function(
    Backbone,
    Syphon,
    FormWidget,
    VpnNameFormConfig,
    VPNProfileCollection,
    StepView,
    SpinnerWidget
){
    var VpnNamePageView = StepView.extend({

        initialize: function(options) {
            this.context = options.context;
            this.collection = new VPNProfileCollection();
            // uuid is generated at start of wizard and passed to each page
            this.uuid = options.uuid;
        },

        events: {
            'click #route-based-id': "routeBased",
            'click #policy-based-id': "policyBased",

            'click #site-to-site-id': "siteToSite",
            'click #full-mesh-id': "fullMesh",
            'click #hub-and-spoke-id': "hubAndSpoke",

            'click #auto-generate-id': "autoGenerate",
            'click #manual-id': "manual",
            'click #auto-vpn-id': "autoVpn",
            'click #advpn-id': "adVpn",
            'click #unmask-id': "manualUnmask",
            'change #vpn-profile-id' : 'vpnProfileSelect'
        },

        routeBased: function(event) {
            this.$el.find('.route-based').show();
            this.$el.find('.policy-based').hide();
            if (this.$el.find('#hub-and-spoke-id').prop('checked')) {
                this.$el.find('.hub-and-spoke').show();
            };
            if (this.$el.find('#auto-vpn-id').prop('checked')) {
                this.$el.find('.auto-vpn').show();
            };
            if  (this.$el.find('#advpn-id').prop('checked')) {
                 this.$el.find('.shortcut-conn-limit').show();
                 this.$el.find('.idle-threshold').show();
                 this.$el.find('.idle-time').show();
            };
        },

        policyBased: function(event) {
            this.$el.find('.route-based').hide();
            this.$el.find('.policy-based').show();
            this.$el.find('.hub-and-spoke').hide();
            this.$el.find('.auto-vpn').hide();
            this.$el.find('.shortcut-conn-limit').hide();
            this.$el.find('.idle-threshold').hide();
            this.$el.find('.idle-time').hide();
            this.$el.find('#hub-and-spoke-id').prop('checked',false);
            this.$el.find('#full-mesh-id').prop('checked',false);
            this.$el.find('#site-to-site-id').prop('checked',true);
            this.getVpnProfilesData();
            this.$el.find('#auto-vpn-id').prop('checked',false);
            this.$el.find('#advpn-id').prop('checked',false);
        },

        siteToSite: function(event) {
            this.$el.find('.hub-and-spoke').hide();
            this.$el.find('.auto-vpn').hide();
            this.$el.find('#multi-proxyid-enable-id').prop("disabled", false);
            this.$el.find('.shortcut-conn-limit').hide();
            this.$el.find('.idle-threshold').hide();
            this.$el.find('.idle-time').hide();
            this.getVpnProfilesData();
            this.$el.find('#auto-vpn-id').prop('checked',false);
            this.$el.find('#advpn-id').prop('checked',false);
            this.model.set("globalsettingsbuttons", "");
            this.model.set("globalsettingsproperties", "");
            this.model.set("globalsettingsgrid", "");
        },

        fullMesh: function(event) {
            // profile changes if full mesh selected, aggressive mode profile not allowed
            var filterUrl = '?vpnType=FULL_MESH';
            this.$el.find('.hub-and-spoke').hide();
            this.$el.find('#multi-proxyid-enable-id').prop("disabled", false);
            this.$el.find('.auto-vpn').hide();
            this.$el.find('.shortcut-conn-limit').hide();
            this.$el.find('.idle-threshold').hide();
            this.$el.find('.idle-time').hide();
            this.$el.find('#auto-vpn-id').prop('checked',false);
            this.$el.find('#advpn-id').prop('checked',false);
            this.getVpnProfilesData(filterUrl);
            this.model.set("globalsettingsbuttons", "");
            this.model.set("globalsettingsproperties", "");
            this.model.set("globalsettingsgrid", "");
        },

        hubAndSpoke: function(event) {
            var filterUrl = "";
            this.$el.find('#multi-proxyid-enable-id').prop("disabled", false);
            this.$el.find('.hub-and-spoke').show();
            if (this.$el.find('#auto-vpn-id').prop('checked')) {
                this.$el.find('.auto-vpn').show();
            };

            if (this.$el.find('#auto-vpn-id').prop('checked')) {
                filterUrl = '?vpnType=HUB_N_SPOKE&isAutoVpn=true&isAdvpn=false';
                if (this.$el.find('#advpn-id').prop('checked'))
                    filterUrl = '?vpnType=HUB_N_SPOKE&isAutoVpn=true&isAdvpn=true';
                this.getVpnProfilesData(filterUrl);
            } else {
                this.getVpnProfilesData();
            }
            this.model.set("globalsettingsbuttons", "");
            this.model.set("globalsettingsproperties", "");
            this.model.set("globalsettingsgrid", "");
        },

        autoGenerate: function(event) {
            this.$el.find('.auto-generate').show();
            this.$el.find('.manual').hide();
        },

        manual: function(event) {
            this.$el.find('.manual').show();
            this.$el.find('.auto-generate').hide();
        },

        autoVpn: function(event) {

            if (this.$el.find('#auto-vpn-id').prop('checked')) {
                this.$el.find('#multi-proxyid-enable-id').prop('checked', false);
                this.$el.find('#multi-proxyid-enable-id').prop("disabled", true);
                this.$el.find('.auto-vpn').show();
            } else {
                this.$el.find('#multi-proxyid-enable-id').prop('checked', false);
                this.$el.find('#multi-proxyid-enable-id').prop("disabled", false);
                this.$el.find('.auto-vpn').hide();
                this.$el.find('#advpn-id').prop('checked', false);
                this.$el.find('.shortcut-conn-limit').hide();
                this.$el.find('.idle-threshold').hide();
                this.$el.find('.idle-time').hide();
            }

            // profile changes if auto vpn is selected - filter parameter is passed to collection
            if (this.$el.find('#auto-vpn-id').prop('checked')) {
                var filterUrl = '?vpnType=HUB_N_SPOKE&isAutoVpn=true&isAdvpn=false';
                this.getVpnProfilesData(filterUrl);
            } else {
                this.getVpnProfilesData();
            }
        },

        adVpn: function(event) {
            var filterUrl = "";

            if  (this.$el.find('#advpn-id').prop('checked')) {
                 this.$el.find('.shortcut-conn-limit').show();
                 this.$el.find('.idle-threshold').show();
                 this.$el.find('.idle-time').show();
            }
            // profile changes if advpn is selected - filter parameter is passed to collection
            if (this.$el.find('#advpn-id').prop('checked')) {
                filterUrl = '?vpnType=HUB_N_SPOKE&isAutoVpn=true&isAdvpn=true';
                this.getVpnProfilesData(filterUrl);
            } else {
                this.$el.find('.shortcut-conn-limit').hide();
                this.$el.find('.idle-threshold').hide();
                this.$el.find('.idle-time').hide();
                filterUrl = '?vpnType=HUB_N_SPOKE&isAutoVpn=true&isAdvpn=false';
                this.getVpnProfilesData(filterUrl);
            }
        },
        manualUnmask : function(event){
             event.stopPropagation();
             if(this.$el.find("input#unmask-id").is(':checked')=== true){
                $('#manual-key-id').attr('type','text');
             }else{
                 $('#manual-key-id').attr('type','password');
             }
        },

        getVpnProfilesData: function (filterUrl) {
            var self = this;
            var newUrl;

            if (filterUrl) {
                // Get base url + filter url
                newUrl = this.collection.url() + filterUrl;
            } else {
                // Get unfiltered base url
                newUrl = this.collection.url();
            };

            this.collection.fetch({
                url: newUrl,
                success: function (collection, response, options) {
                    var generalSettings = self.model.get('generalsettings');
                    var vpnProfileId = self.$el.find('#vpn-profile-id');

                    // clear out any profiles in the drop down menu
                    self.$el.find('#vpn-profile-id').empty();
                    // fill drop down with filtered list
                    response['vpn-profiles']['vpn-profile'].forEach(function(object) {
                        vpnProfileId.append( new Option(object.name+" ("+object['domain-name']+")",object.id));
                        if (generalSettings && (generalSettings["profile-id"] === object.id.toString())) {
                            vpnProfileId.val(generalSettings["profile-id"]);
                        }
                    });
		            self.vpnProfileSelect();
                },
                error: function (collection, response, options) {
                    console.log('vpn profile collection not fetched');
                }
            });
        },

        vpnProfileSelect : function() {
            var selectedVal = $("#vpn-profile-id").children('option:selected').val();
            if(this.isCerificateBasedProfile(selectedVal)) {
              this.$el.find('.presharedkey').hide();
              this.$el.find('.auto-generate').hide();
              this.$el.find('.manual').hide();
            }
            else {
              this.$el.find('.presharedkey').show();
              if (this.$el.find('#auto-generate-id').prop('checked')) {
                  this.$el.find('.manual').hide();
                  this.$el.find('.auto-generate').show();
              } else {
                  this.$el.find('.manual').show();
                  this.$el.find('.auto-generate').hide();
              }

            }
        },

        isCerificateBasedProfile : function(profileId) {
            var self = this;
            self.isCertBasedProfile=false;
           // var profileId = self.options.returnedData["profile"].id;
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
                                 //self.isCertBasedProfile = false;
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

        render: function() {
            var self = this;
            var vpnNameFormConfig = new VpnNameFormConfig(this.context);
            var generalButtons = this.model.get('generalsettingsbuttons');
            var generalSettings = this.model.get('generalsettings');

            this.formWidget = new FormWidget({
                "container": this.el,
                elements: vpnNameFormConfig.getValues(),
                values: this.model.attributes
            });
            this.formWidget.build();


            // Set value for dropdown list and checkbox

            if (typeof generalSettings === 'undefined') {
                this.getVpnProfilesData();
            } else {
                this.$el.find('#tunnel-mode-id').prop('checked',generalSettings['tunnel-mode']);
                this.$el.find('#multi-proxyid-enable-id').prop('checked', generalSettings['multi-proxyid-enable']);
                this.$el.find('#route-based-id').prop('checked', generalButtons['route-based']);
                this.$el.find('#policy-based-id').prop('checked', generalButtons['policy-based']);
                this.$el.find('#site-to-site-id').prop('checked', generalButtons['site-to-site']);
                this.$el.find('#full-mesh-id').prop('checked', generalButtons['full-mesh']);
                this.$el.find('#hub-and-spoke-id').prop('checked', generalButtons['hub-and-spoke']);
                this.$el.find('#auto-vpn-id').prop('checked', generalSettings["auto-vpn"]);
                this.$el.find('#advpn-id').prop('checked', generalSettings["advpn"]);
                this.$el.find('#auto-generate-id').prop('checked', generalButtons['auto-generate']);
                this.$el.find('#generate-unique-key-id').prop('checked', generalSettings['generate-unique-key']);
                this.$el.find('#manual-id').prop('checked', generalButtons['manual']);
                this.$el.find('#unmask-id').prop('checked', generalSettings['unmask']);
                this.$el.find('#shortcut-conn-limit').val(generalSettings['shortcut-conn-limit']);
                this.$el.find('#idle-threshold').val(generalSettings['idle-threshold']);
                this.$el.find('#idle-time').val(generalSettings['idle-time']);

                if(generalButtons['full-mesh'])
                   this.fullMesh();

                if (generalButtons['hub-and-spoke'])
                    this.hubAndSpoke();

                if (generalSettings['auto-vpn'])
                    this.autoVpn();

                if (generalSettings['advpn'])
                    this.adVpn();

                if (this.$el.find('#auto-vpn-id').prop('checked')) {
                    filterUrl = '?vpnType=HUB_N_SPOKE&isAutoVpn=true&isAdvpn=false';
                    if (this.$el.find('#advpn-id').prop('checked'))
                        filterUrl = '?vpnType=HUB_N_SPOKE&isAutoVpn=true&isAdvpn=true';
                    this.getVpnProfilesData(filterUrl);
                }else if (this.$el.find('#full-mesh-id').prop('checked')) {
                          filterUrl = '?vpnType=FULL_MESH';
                          this.getVpnProfilesData(filterUrl);
                }else{
                    this.getVpnProfilesData();
                };
            };

            if (this.$el.find('#route-based-id').prop('checked')) {
                this.$el.find('.route-based').show();
            };

            if(this.$el.find('#policy-based-id').prop('checked')) {
               this.$el.find('.policy-based').show();
            };




            if(this.$el.find('#shortcut-conn-limit').val() == "-1"){
               this.$el.find('#shortcut-conn-limit').val("");
             }
             if(this.$el.find('#idle-threshold').val() == "-1"){
                this.$el.find('#idle-threshold').val("");
              }
             if(this.$el.find('#idle-time').val() == "-1"){
                this.$el.find('#idle-time').val("");
              }

            // For create vpn, this first step is to clear the SD VPN cache
            // Clear the SD vpn cache
            this.clearSDVPNCache();

            return this;
        },

        displaySpinner: function(container, message){
            this.spinner = new SpinnerWidget({
                                "container": container,
                                "statusText": message
                            }).build();
            return this.spinner;
            this.options.wizardView.wizard.showMask(this.spinner);
        },

        destroySpinner:function(spinner){
            this.spinner.destroy();
        },

    getTitle: function () {
      return this.context.getMessage('vpn_wizard_name_page_title');
    },

    // Clears the SD VPN Cache
    // Must do this before creating a VPN
    // Current Reset-Cache call returns unformatted response
    // Set the datatype to text and empty header
    // uuid is generated at the start of the wizard and passed in through options parameter

    clearSDVPNCache: function() {
        var self = this;
        var success = true;

        $.ajax({
            // Current REST Reset-Cache call returns unformatted response
            // Set the datatype to text and make header empty
            url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/reset-cache?ui-session-id=' +self.uuid,
            type: 'get',
            dataType: "text",
	    headers: {
//			    'accept': 'application/vnd.juniper.sd.vpn-management/vpn-ui.reset-cache+json;q=0.01;version=1'
            },
           success: function(data, status) {
               // parse text for an additional check
               if (data === "{startVpnCreateWizardApplication}")
                   success = true;
               else
                   success = false;
           },
           error: function(status, data) {
               success = false;
           },
           async: false
        });

        return success;
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
          'value': this.model.attributes.generalsettings["profile.name"]
      });

      return summary;
    },
    beforePageChange: function() {
        var jsonDataObj = {},
            generalSettings = this.model.get("generalsettings"),
            properties = Syphon.serialize(this);

        this.displaySpinner(this.el, this.context.getMessage("Waiting_status_text"));

        // Get the text name of selected profile
        var profileName = $('select option:selected').text();
        var multiProxy = false;

        if (this.$el.find('#shortcut-conn-limit').parent().hasClass("error") || this.$el.find('#idle-time').parent().hasClass("error") || this.$el.find('#idle-threshold').parent().hasClass("error")) {
             this.destroySpinner();
             return false;
        }

        if(!this.validateVpnName()) {
            this.destroySpinner();
            return false;
        }

        if(properties["tunnel-mode"] != "POLICY_BASED") {
            multiProxy =  properties["multi-proxyid-enable"];
        }


        // Resetting device selection when vpn type or Tunnel Mode or Multi-ProxyID or Auto-vpn selection changed

        if (generalSettings) {
            if((properties["vpn-type-button"] !== generalSettings["vpn-type"]) ||
               (properties["tunnel-mode"] !== generalSettings["tunnel-mode"]) ||
               (properties["multi-proxyid-enable"] !== generalSettings["multi-proxyid-enable"]) ||
               (properties["auto-vpn"] !== generalSettings["auto-vpn"])) {
                    this.model.set("selectedEndpointDeviceIds", []);
                    this.model.set("selectedHubDeviceIds", []);
            }
        }

        // Save properties to model for use in a different page

        jsonDataObj = {
            "name" : properties["name"],
            "description": properties["description"],
            "tunnel-mode": properties["tunnel-mode"],
            "multi-proxyid-enable": multiProxy,
            "vpn-type": properties["vpn-type-button"],
            "auto-vpn": properties["auto-vpn"],
            "advpn": properties["advpn"],
            "preshared-key-button": properties["preshared-key-button"],
            "generate-unique-key": properties["generate-unique-key"],
            "manual": properties["manual"],
            "unmask": properties["unmask"],
            "profile-id": properties["vpn-profile"],
            "profile.name": profileName,
            "shortcut-conn-limit": properties["shortcut-conn-limit"],
            "idle-threshold": properties["idle-threshold"],
            "idle-time": properties["idle-time"]
        };

        // if advpn parameters are not set then set to -1
        if (jsonDataObj["shortcut-conn-limit"] === "")
            jsonDataObj["shortcut-conn-limit"] = -1;
        if (jsonDataObj["idle-threshold"] === "")
            jsonDataObj["idle-threshold"] = -1;
        if (jsonDataObj["idle-time"] === "")
            jsonDataObj["idle-time"] = -1;

        // Save the general settings to the model

        this.model.set("generalsettings",jsonDataObj);

        // Save properties for next pages back button

        this.model.set("name",properties["name"]);
        this.model.set("description",properties["description"]);
        this.model.set("manual",properties["manual"]);

        // Save buttons that where pressed for next pages back button

        jsonDataButtonObj = {
            "route-based": this.$el.find('#route-based-id').prop('checked'),
            "policy-based": this.$el.find('#policy-based-id').prop('checked'),
            "site-to-site": this.$el.find('#site-to-site-id').prop('checked'),
            "full-mesh": this.$el.find('#full-mesh-id').prop('checked'),
            "hub-and-spoke": this.$el.find('#hub-and-spoke-id').prop('checked'),
            "auto-generate": this.$el.find('#auto-generate-id').prop('checked'),
            "manual": this.$el.find('#manual-id').prop('checked'),
            "generate-unique-key": this.$el.find('#generate-unique-key-id').prop('checked'),
            "unmask": this.$el.find('#unmask-id').prop('checked')
        };

        if(this.$el.find('#policy-based-id').prop('checked')){
            jsonDataButtonObj["site-to-site"] = true;
            jsonDataButtonObj["full-mesh"] = false;
            jsonDataButtonObj["hub-and-spoke"] = false;
        }

        this.model.set("generalsettingsbuttons", jsonDataButtonObj)

        // The endpoint settings grid page will need to know if the selected vpn profile
        // has aggressive mode.  Instead of making a REST all for every row of the grid,
        // make one rest call and save the mode data to a space model that can be used
        // in the endpoint settings grid page.
        // Note:  site to site agressive mode overloads the is-hub parameter
        // is-hub = true means initiator = false and recipient = true
        // is-hub = false means initiator = true and recipient = false

        this.model.set("generalsettingsprofilemode", this.getVpnProfileMode());

        this.destroySpinner();

        return true;
    },

        // Read Contents of selected profile and returns Mode

        getVpnProfileMode: function() {
            var self = this;
            var generalSettings = this.model.get("generalsettings");
            //var profileId = self.options.vpnData["ipsec-vpn"]["profile"].id;
            var profileId = generalSettings["profile-id"];
            var mode = "";
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-profiles/'+profileId,
                type: 'get',
                dataType: 'json',
                headers: {
                   'accept': 'application/vnd.juniper.sd.vpn-management.vpn-profile+json;q=0.01;version=1'
                },
                success: function(data, status) {
                    mode = data['vpn-profile']['phase1-setting']['mode'];
                },
                error: function() {
                    console.log('certificates not fetched');
                },
                async: false
            });
            return mode;
        },


    validateVpnName: function() {
	    var comp = this.$el.find('#vpn-name-id');
        var vpnError;

        if ((comp.attr("data-invalid") === undefined) && (this.$el.find('#vpn-name-id')[0].value != "")) {
            if (!this.isVpnNameUnique(comp.val())) {
                vpnError = this.context.getMessage('name_duplicate_error');
                this.showErrorMessage('vpn-name-id', vpnError);
/* BUG - if error 404 can't access then thinks duplicate error

WORKAROUND IF NO VPN exist needs to be done.

                return false;
*/
                return false;
            }
        } else {
            vpnError = this.context.getMessage('vpn_wizard_name_input_error');
            this.showErrorMessage('vpn-name-id', vpnError);
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
    }

  });

  return VpnNamePageView;
});
