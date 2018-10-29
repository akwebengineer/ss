define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget',
    'widgets/tabContainer/tabContainerWidget',
    '../conf/vpnProfileFormConf.js',
    '../models/vpnProfileModel.js',
    '../models/vpnProfileCollection.js',
   '../utils.js',
    './vpnProfileBaseView.js'
    ]
    ,function(Backbone, Syphon, FormWidget, OverlayWidget, TabContainerWidget, VPNProfileFormConf, VPNProfileModel, VPNProfileCollection,utils,vpnprofilebaseview){
        
        var VPNProfileView = vpnprofilebaseview.extend({
            events: {
                "click #ok" : 'onOk',
                "click #cancel" : 'cancel'
            },
            initialize: function(options){
                 vpnprofilebaseview.prototype.initialize.call(this, options);

                this.successMessageKey = 'vpn_profiles_create_success';
                this.editMessageKey = 'vpn_profiles_edit_success';
            },

            addDynamicFormConfig: function(formConfiguration) {
                var dynamicProperties = {};
                vpnprofilebaseview.prototype.addDynamicFormConfig.call(this, formConfiguration);
                
                switch (this.formMode) {
                case this.MODE_EDIT:
                    dynamicProperties.title = this.context.getMessage('vpn_profiles_edit');
                    break;
                case this.MODE_CREATE:
                    dynamicProperties.title = this.context.getMessage('vpn_profiles_create');
                    break;
                case this.MODE_CLONE:
                    dynamicProperties.title = this.context.getMessage('vpn_profiles_clone');
                    break;
                 case this.MODE_VIEW:
                     dynamicProperties.title = this.context.getMessage('vpn_profiles_detail');
                     break;
                }
                

                _.extend(formConfiguration, dynamicProperties);
            },

            render: function(){
                var self = this;

                var vpnProfileConfiguration = new VPNProfileFormConf(this.activity.getContext());
                var formElements = vpnProfileConfiguration.getValues(self.formMode);

                this.addDynamicFormConfig(formElements);

                this.form = new FormWidget({
                    'elements': formElements,
                    'container': this.el,
                    'values': this.model.toJSON()[this.model.jsonRoot]
                });
                this.form.build();

                this.addTabWidget('tab-widget'); 
                
                this.handleModifyForUsedProfile();

                 if(this.formMode == this.MODE_VIEW){
                    this.$el.find(':input:not(:disabled)').prop('disabled',true);
                    this.$el.find('#cancel').prop('disabled',false);
                    this.$el.find('#cancel').val('Close');
                    this.$el.find('#ok').hide();
                 }

                return this;
            },
            /* addTabWidget : function() {  code removed and added at vpnprofileBaseview.js } */

            validateVpnProfileName: function(name) {
                var self = this;
                var isValid = false;

                //If name is not changed in modify then it is valid
                if(this.model.get('name') && name && name === this.model.get('name')) {
                    return isValid = true;
                }

                $.ajax({
                    url: '/api/juniper/sd/vpn-management/vpn-profiles/isuniquename/?name='+name,
                    type: 'GET',
                    dataType: "json",
                    headers: {
                        'accept': 'application/vnd.juniper.sd.vpn-management.isuniquename+json;version=1;q=0.01'
                    },
                    success: function(data, status) {
                        return isValid = data['is-unique-name']['uniqueness'];
                    },
                    async: false
                });

                return isValid;
            },

           isProfileInUse: function(profileId) {
                var self = this;
                var isValid = false;

                $.ajax({
                    url: '/api/juniper/sd/vpn-management/vpn-profiles/'+profileId +'/is-profile-used',
                    type: 'GET',
                    dataType: "json",
                    headers: {
                        'accept': 'application/vnd.juniper.sd.vpn-management.is-profile-used+json;version=1;q=0.01'
                    },
                    success: function(data, status) {
                        return isValid = data['is-profile-used']['used'];
                    },
                    async: false
                });

                return isValid;
            },

           handleModifyForUsedProfile: function() {
                    if(this.formMode == this.MODE_EDIT){
                         if(this.isProfileInUse(this.model.attributes.id)) {
                               utils.showNotification("warning",this.context.getMessage("vpn_profile_used_in_vpn_cannot_modify"));
                               this.$el.find('select[id="auth-method"],select[id="ike-version"],select[id="ike-id"],input[id="username"],input[id="mode"],input[id="general-ikeid"]')
                                            .prop( "disabled", true );
                         }
                    }
           },
          
            // View event handlers

            /**
             * Called when OK button is clicked on the overlay based form view.
             * 
             * @param {Object} event - The event object
             * returns none
             */
            onOk: function(event) {
                var self = this;
              
                event.preventDefault();
                if (this.form.isValidInput(this.$el.find('form'))) {
                    var formData = Syphon.serialize(this);

                   
                    if(!this.validateVpnProfileName(formData["name"])) {
                        this.form.showFormError(self.context.getMessage("vpn_profile_name_duplicate_error"));
                        return;
                    };

                    // console.log(results);
                    var tabsData = this.tabContainerWidget.getTabsData();
                    console.log("tabs data");
                    console.log(tabsData);

                    var modelObj = {};
                    var profile = {};
                    profile["name"] = formData["name"];
                    profile["description"] = formData["description"];
                    profile["definition-type"] = "CUSTOM";
                    profile["phase1-setting"] = tabsData["phase1-setting"];
                    profile["phase2-setting"] = tabsData["phase2-setting"];

                    /* validation of tabs - phase1 / phase2 */
                    if(!this.vpnTabValidation (tabsData, self)) {
                        return;
                    }

                    this.bindModelEvents();
                    this.model.set(profile);
                    this.model.save();
                }
            }

        });
        return VPNProfileView;
    });
