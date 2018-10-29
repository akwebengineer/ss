/**
 * View to create Policy Profile
 *
 * @module PolicyProfileView
 * @author Vinamra Jaiswal <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget',
    'widgets/tabContainer/tabContainerWidget',
    '../conf/policyProfileFormConf.js',
    '../models/policyProfileModel.js',
    '../models/policyProfileCollection.js',
    '../../../../../ui-common/js/views/apiResourceView.js',
    './loggingView.js',
    './authenticationView.js',
    './advancedSettingsView.js',
    '../../devicetemplates/models/deviceTemplatesCollection.js',
    'widgets/dropDown/dropDownWidget'
    ]
    ,function(Backbone, Syphon, FormWidget, OverlayWidget, TabContainerWidget, PolicyProfileFormConf, PolicyProfileModel, PolicyProfileCollection, ResourceView, LoggingView, AuthenticationView, AdvancedSettingsView,TemplateCollection,DropDownWidget){
        var PolicyProfileView = ResourceView.extend({
            events: {
                "click #policy-profile-save" : 'onOk',
                "click #policy-profile-cancel" : 'cancel'
            },
            initialize: function(options){
                ResourceView.prototype.initialize.call(this, options);

                this.successMessageKey = 'policy_profiles_create_success';
                this.editMessageKey = 'policy_profiles_edit_success';
                this.template = new TemplateCollection();
            },

            addDynamicFormConfig: function(formConfiguration) {
                var dynamicProperties = {};
                ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);
                switch (this.formMode) {
                case this.MODE_EDIT:
                    dynamicProperties.title = this.context.getMessage('policy_profiles_edit');
                    break;
                case this.MODE_CREATE:
                    dynamicProperties.title = this.context.getMessage('policy_profiles_create');
                    break;
                case this.MODE_CLONE:
                    dynamicProperties.title = this.context.getMessage('policy_profiles_clone');
                    break;
                }

                _.extend(formConfiguration, dynamicProperties);
            },

            render: function(){
                var self = this;

                var policyProfileConfiguration = new PolicyProfileFormConf(this.activity.getContext());
                var formElements = policyProfileConfiguration.getValues();

                this.addDynamicFormConfig(formElements);

                this.formWidget = new FormWidget({
                    'elements': formElements,
                    'container': this.el,
                    'values': this.model.toJSON()[this.model.jsonRoot]
                });
                this.formWidget.build();
                this.populateTemplateDropDown();
                this.addTabWidget('tab-widget');
                this.templateDropDown =this.createDropDown('device_template',
                                        [],'Select an option');
                                    
                return this;
            },
            createDropDown: function(container,data,placeholder,onchange){
              var self = this;
              this.$el.find('#'+container).append('<select class="'+container+'" style="width: 100%"></select>');
              return new DropDownWidget({
                  "container": this.$el.find("."+container),
                  "data": JSON.stringify(data),
                  "placeholder": placeholder,
                  "enableSearch": true,
                  "onChange": function(event) {
                      if (onchange) {onchange($(this).val(),self);}
                   }
              }).build();
            },
            populateTemplateDropDown: function() {
            var self = this,optionList=[{"text": "None","id": "-1"}];
            self.template.fetch({
                success: function (collection, response, options) {
                    if(response['config-templates'] !== undefined && response['config-templates']['config-template'] !== undefined) {
                        if(response["config-templates"]["config-template"].length == undefined){
                            var object = response["config-templates"]["config-template"];
                            if(response["config-templates"]["config-template"]["device-family"] != "JUNOS")
                            optionList.push({"text":object,"id":id});
                        }
                        else{
                            response["config-templates"]["config-template"].forEach(function(tmp) {
                                if(tmp["device-family"] != "JUNOS")
                                optionList.push({"text":tmp.name,"id":tmp.id});
                            });
                         }
                         self.templateDropDown.addData(optionList);
                    }
                    if(self.formMode === self.MODE_EDIT ||self.formMode === self.MODE_CLONE ) {
                        self.templateDropDown.setValue(self.model.get('sd-template').id || "-1");
                    }
                },
                error: function (collection, response, options) {
                    console.log('config templates collection not fetched');
                }
            });
        },

            addTabWidget: function(id, gridConf) {
                var tabWidgetContainer = this.$el.find('.tab-widget').empty();
                var loggingModel = this.model ? new Backbone.Model(this.model.attributes) : new Backbone.Model();
                var authenticationModel = this.model ? new Backbone.Model(this.model.attributes) : new Backbone.Model();
                var advancedSettingsModel = this.model ? new Backbone.Model(this.model.attributes) : new Backbone.Model();
                this.authView = new AuthenticationView({
                                    context : this.activity.getContext(),
                                    model : authenticationModel
                                });
                this.advancedView = new AdvancedSettingsView({
                                    context : this.activity.getContext(),
                                    model : advancedSettingsModel
                                });  
                this.loggingView = new LoggingView({
                                    context : this.activity.getContext(),
                                    model : loggingModel
                                });                      

                this.tabs = [{
                        id : "logging",
                        name : this.context.getMessage("policy_profiles_tab_logging"),
                        content : this.loggingView
                    },{
                        id : "authentication",
                        name : this.context.getMessage("policy_profiles_tab_authentication"),
                        content : this.authView
                    },{
                        id : "advancedSettings",
                        name : this.context.getMessage("policy_profiles_tab_advancedSettings"),
                        content : this.advancedView    
                }];
                this.tabContainerWidget = new TabContainerWidget({
                    "container": tabWidgetContainer,
                    "tabs": this.tabs
                   // "height": "250px"
                });
                this.tabContainerWidget.build();
            },

            // View event handlers

            /**
             * Called when OK button is clicked on the overlay based form view.
             * 
             * @param {Object} event - The event object
             * returns none
             */
            onOk: function(event) {
                event.preventDefault();

                // Work around until form.isValidInput() can support to check fields that don't have the "required" property
                if (this.authView != undefined && this.loggingView!==undefined && this.checkFieldStatus()) {
                    console.log('form is invalid');
                    return;
                }
                // Check if the form  is valid or not
                if (!this.formWidget.isValidInput() && 
                    !this.authView.form.isValidInput() && !this.advancedView.form.isValidInput() 
                        &&!this.loggingView.form.isValidInput()) {
                    console.log('The form is invalid');
                    return;
                }
                var formData = Syphon.serialize(this);
                // console.log(results);
                var tabsData = this.tabContainerWidget.getTabsData();
                console.log("tabs data");
                console.log(tabsData);

                var modelObj = {};
                var profile = {};
                profile["name"] = formData["name"];
                profile["description"] = formData["description"];
                profile["definition-type"] = "CUSTOM";
                if(tabsData["logging"] !== undefined) {
                    profile["log-at-session-init-time"] = tabsData["logging"]["enable-log-session-init"];
                    profile["log-at-session-close"] = tabsData["logging"]["enable-log-session-close"];
                    profile["enable-count"] = tabsData["logging"]["enable-count"];
                    profile["per-second-alarm-threshold"] = tabsData["logging"]["alarm-threshold-bytes-second"];
                    profile["per-minute-alarm-threshold"] = tabsData["logging"]["alarm-threshold-kilo-minute"];
                }
                if(tabsData["authentication"] !== undefined) {
                    profile["authentication-type"] = this.authView.authDropDown.getValue();
                    if(profile["authentication-type"] === "NONE") {
                        profile["pass-thru-auth-client-name"] = "";
                    } else if(profile["authentication-type"] === "PASSTHROUGH_AUTHENTICATION") {
                        profile["pass-thru-auth-client-name"] = tabsData["authentication"]["client-name"];
                        profile["web-redirect"] = tabsData["authentication"]["web-redirect"];
                        profile["web-redirect-to-https"] = tabsData["authentication"]["web-redirect-https"];
                    } else if(profile["authentication-type"] === "WEB_AUTHENTICATION") {
                        profile["web-auth-client-name"] = tabsData["authentication"]["web-client-name"];
                    } else if(profile["authentication-type"] === "USER_FIREWALL") {
                        profile["domain"] = tabsData["authentication"]["domain-name"];
                        profile["access-profile"] = tabsData["authentication"]["access-profile-name"];
                    } else if(profile["authentication-type"] === "INFRANET_AUTHENTICATION") {
                        profile["infranet-redirect"] = tabsData["authentication"]["infranet-redirect"];
                        profile["redirect-url"] = tabsData["authentication"]["redirect-url"];
                    }                                  
                }
                if(tabsData["advancedSettings"] !== undefined) {
                    profile["service-offload"] = tabsData["advancedSettings"]["services-offload"];
                    profile["destination-address-translation"] = this.advancedView.addrTranslationDropDown.getValue();
                    profile["redirect"] = this.advancedView.redirectDropDown.getValue();
                    profile["tcp-syn-check"] = tabsData["advancedSettings"]["tcp-syn-check"];
                    profile["tcp-seq-check"] = tabsData["advancedSettings"]["tcp-seq-check"];
                }
                //profile["authentication-type"] = "WEB_AUTHENTICATION";
                
                var templateName = this.$el.find('#device_template :selected').text(),
                    templateID=this.templateDropDown.getValue();
                //profile['sd-template'] = (templateID!=='NONE')?{"id":templateID,"name":templateName}:undefined;
                profile['sd-template'] = {"id":templateID,"name":templateName};
                console.log("Profile data");
                console.log(profile);

                this.bindModelEvents();
                this.model.set(profile);
                this.model.save();
                
            },
            checkFieldStatus: function() {     
                // Work around: Check those fields that are not required
                var redirecturl = this.authView.$el.find('#redirect-url');
                var clientName = this.authView.$el.find('#client-name');
                var webClientName = this.authView.$el.find('#web-client-name');
                var domainName = this.authView.$el.find('#domain-name');
                var accessProfile = this.authView.$el.find('#access-profile-name');
                var bytesLogged = this.loggingView.$el.find('#alarm-threshold-bytes-second');
                var count = this.loggingView.$el.find('#alarm-threshold-kilo-minute');
                //Work around to prevent the backend request 
                if (redirecturl.is(":visible") && redirecturl.parent().hasClass("error")) {return true;}
                if (clientName.is(":visible") && clientName.parent().hasClass("error")) {return true;}
                if (webClientName.is(":visible") && webClientName.parent().hasClass("error")) {return true;}
                if (domainName.is(":visible") && domainName.parent().hasClass("error")) {return true;}
                if (accessProfile.is(":visible") && accessProfile.parent().hasClass("error")) {return true;}
                if (bytesLogged.is(":visible") && bytesLogged.parent().hasClass("error")) {return true;}
                if (count.is(":visible") && count.parent().hasClass("error")) {return true;}

                return false;
            }
        });
        return PolicyProfileView;
    });