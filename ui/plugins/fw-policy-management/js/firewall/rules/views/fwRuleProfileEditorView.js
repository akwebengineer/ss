/**
 * Profile editor view that extends from base cellEditor & is used to select profile & add new profile editors
 *
 * @module ProfileEditorView
 * @author Judy Nguyen <jnguyen@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget',
    'widgets/tabContainer/tabContainerWidget',
    'widgets/dropDown/dropDownWidget',
    '../conf/fwRuleProfileFormConfiguration.js',
    '../../profiles/models/policyProfileCollection.js',
    '../../profiles/models/policyProfileModel.js',
    './fwRuleProfileDetailView.js',
    './fwRuleCustomLoggingView.js',
    './fwRuleCustomAuthenticationView.js',
    './fwRuleCustomAdvancedSettingsView.js',
    '../constants/fwRuleGridConstants.js',
    '../../devicetemplates/models/deviceTemplatesCollection.js'
], function (Backbone, FormWidget, OverlayWidget, TabContainerWidget, DropDownWidget, ProfileEditorFormConfiguration,
             PolicyProfileCollection, PolicyProfileModel, ProfileDetailView, LoggingView, AuthenticationView,
             AdvancedSettingsView, PolicyManagementConstants,TemplateCollection) {
    var ProfileEditorView = Backbone.View.extend({

        events: {
            'click #btnProfileOk': 'updateData',
            'click #linkProfileCancel': 'closeProfilEditorOverlay',
            'click #show_inherit_profile_overlay': 'showInheritProfileDetailsOverlay',
            'click #show_select_profile_overlay': 'showSelectProfileDetailsOverlay'
        },

        initialize: function () {
            this.context = this.options.context;
            this.model = this.options.model;
//            this.model = new FWRuleModel();

            if (this.options.policyObj["policy-profile"]) {
                this.policyProfileId = this.options.policyObj["policy-profile"].id;
                this.policyProfileName = this.options.policyObj["policy-profile"].name;
            } else {
                this.policyProfileName = 'None';
            }

            this.profileEditorFormConfiguration = new ProfileEditorFormConfiguration(this.context);
            this.profileCollection = new PolicyProfileCollection();
            this.profileModel = new PolicyProfileModel();
            this.template = new TemplateCollection();

//            self = this;

            // this.options.editorForm = {
            //     'editorFormConfig': this.profileEditorFormConfiguration.getElements(),
            //     'editorFormElements': {
            //         'addNewButtonElementID': 'add-new-button',
            //         'cancelButtonID': 'cancel',
            //         'okButtonID': 'save'
            //     },
            //     'editorFormMsgBundle': {
            //         'title': this.context.getMessage('fw_rules_editor_profile_title'),
            //         'heading_text': this.context.getMessage('fw_rules_editor_profile_description')
            //     }
            // };

            // CellEditorView.prototype.initialize.apply(this, this.options);
        },
        render : function(){
            var self = this;

            this.form = new FormWidget({
                "elements": this.profileEditorFormConfiguration.getElements(),
                "container": this.el
            });

            this.form.build();

            var profileTypeEditor = self.$el.find('#profile_type_select').parent();
            $(profileTypeEditor).empty();
            var $span =  $(profileTypeEditor).append('<select class="profiletypecelldropdown" style="width: 100%"></select>');
            self.profileTypeDropdown = new DropDownWidget({
                "container": $span.find('.profiletypecelldropdown'),
                "data": [],
                "enableSearch": true,
                "onChange": function(){
                    var value = this.value;
                    if(value === "None"){
                        self.$el.find("#show_select_profile_overlay").hide();
                    }else{
                        self.$el.find("#show_select_profile_overlay").show();
                    }
                }
            }).build();

             // self.profileTypeDropdown.addData([
             //     {"id": "None", "text":self.context.getMessage("none")}
             // ]);

            this.addTabWidget('tab-widget');
            this.populateTemplateDropDown();
            this.templateDropDown =this.createDropDown('device_template',
                                        [],'Select Device Template');

            // hide inherited profile policy initially
            self.$el.find("label[for='profile_inherit_policy']").hide();
            this.$el.find("label[for='device_template']").hide();
               // this.templateDropDown.conf.$container.parent.hide();
               self.$el.find("#device_template").hide();
            // self.$el.find("input[type=url][name=profile_inherit_policy]").hide();
            self.$el.find("#profile_inherit_policy").hide();
            self.$el.find("#show_inherit_profile_overlay").hide();
            self.$el.find("span[data-ua-id='alias_for_inherit_profile_editor']").hide();

            self.$el.find("input[type=radio][name=profile_type][value=inherit]").click(function() {
                self.profileTypeHandler(this.value);
                this.checked = true;
            });

            // hide the select profile initially
            self.$el.find("label[for='profile_type_select']").hide();
            self.profileTypeDropdown.conf.$container.parent().hide();
            self.$el.find("#show_select_profile_overlay").hide();
            self.$el.find("span[data-ua-id='alias_for_profile_editor']").hide();

            self.$el.find('input[type=radio][name=profile_type]').click(function() {
                self.profileTypeHandler(this.value);
                this.checked = true;
            });

            // hide custom tab widget
//            self.$el.find("label[for='profile_templates']").hide();
//            self.$el.find("#profile_templates").hide();
            self.$el.find('.tab-widget').hide();
 //           self.$el.find("span[data-ua-id='alias_for_templates_profile_editor']").hide();

            // mark selected policy profile type
            // var profile_type = this.rowData["rule-profile"]["profile-type"];
            var profile_type = this.model.get("rule-profile")["profile-type"];
            var selected_profile;
            if (profile_type == "NONE" || profile_type == "") {
                self.$el.find('input[type=radio][name=profile_type][value=none]').attr("checked", true);
            } else if (profile_type == "INHERITED") {
                self.$el.find('input[type=radio][name=profile_type][value=inherit]').attr("checked", true);
                self.$el.find("label[for='profile_inherit_policy']").show();
                if (self.policyProfileName) {
                    self.$el.find("#profile_inherit_policy").val(self.policyProfileName);
                    self.$el.find("#show_inherit_profile_overlay").show();
                } else {
                    self.$el.find("#profile_inherit_policy").val(self.context.getMessage('fw_rules_edit_profile_inherit_not_available'));
                    self.$el.find("#profile_inherit_policy").css("border", "none");
                    self.$el.find("#profile_inherit_policy").css("box-shadow", "none");
                    self.$el.find("#show_inherit_profile_overlay").hide();
                }
                self.$el.find("#profile_inherit_policy").prop('disabled', true);
                self.$el.find("#profile_inherit_policy").css("background-color", "transparent");
                self.$el.find("#profile_inherit_policy").show();
                self.$el.find("span[data-ua-id='alias_for_inherit_profile_editor']").show();
            } else if (profile_type == "USER_DEFINED") {
                self.$el.find("label[for='profile_type_select']").show();
                self.$el.find("span[data-ua-id='alias_for_profile_editor']").show();
                self.profileTypeDropdown.conf.$container.parent().show();

                this.getPolicyProfiles();

                self.$el.find('input[type=radio][name=profile_type][value=user-defined]').attr("checked", true);
            } else if (profile_type == "CUSTOM") {
                // self.$el.find("label[for='profile_templates']").show();
                // self.$el.find("#profile_templates").show();
                // self.$el.find("span[data-ua-id='alias_for_templates_profile_editor']").show();
                self.$el.find('.tab-widget').show();
                this.$el.find("label[for='device_template']").show();
                this.$el.find('#'+'device_template').show();
                self.$el.find('input[type=radio][name=profile_type][value=custom]').attr("checked", true);            
            }

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

        profileTypeHandler: function (val) {
            var self =this;
            console.log(val);

            if (val === "user-defined") {
                this.profileTypeDropdown.conf.$container.parent().show();
                this.$el.find("label[for='profile_type_select']").show();
                this.$el.find("span[data-ua-id='alias_for_profile_editor']").show();
//                self.$el.find("#show_select_profile_overlay").show();

                this.getPolicyProfiles();

                self.$el.find("label[for='profile_inherit_policy']").hide();
                self.$el.find("#profile_inherit_policy").hide();
                self.$el.find("label[for='device_template']").hide();
                self.$el.find("#show_inherit_profile_overlay").hide(); 
                self.$el.find("span[data-ua-id='alias_for_inherit_profile_editor']").hide();

                self.$el.find('.tab-widget').hide();
                self.templateDropDown.conf.$container.parent().hide();
                // self.$el.find("label[for='profile_templates']").hide();
                // self.$el.find("span[data-ua-id='alias_for_templates_profile_editor']").hide();
                // self.$el.find("#profile_templates").hide();
            } else if (val === "inherit") {
                self.$el.find("label[for='profile_inherit_policy']").show();

                if (self.policyProfileName) {
                    self.$el.find("#profile_inherit_policy").val(self.policyProfileName);
                    self.$el.find("#show_inherit_profile_overlay").show();
                } else {
                    self.$el.find("#profile_inherit_policy").val(self.context.getMessage('fw_rules_edit_profile_inherit_not_available'));
                    self.$el.find("#profile_inherit_policy").css("border", "none");
                    self.$el.find("#profile_inherit_policy").css("box-shadow", "none");
                    self.$el.find("#show_inherit_profile_overlay").hide();
                }
                self.$el.find("#profile_inherit_policy").prop('disabled', true);
                self.$el.find("#profile_inherit_policy").css("background-color", "transparent");
                self.$el.find("#profile_inherit_policy").show();
                self.$el.find("span[data-ua-id='alias_for_inherit_profile_editor']").show();

                self.$el.find("label[for='device_template']").hide();
                self.templateDropDown.conf.$container.parent().hide();

                this.profileTypeDropdown.conf.$container.parent().hide();
                this.$el.find("label[for='profile_type_select']").hide();
                self.$el.find("#show_select_profile_overlay").hide();
                this.$el.find("span[data-ua-id='alias_for_profile_editor']").hide();  

                self.$el.find('.tab-widget').hide();
                self.templateDropDown.conf.$container.hide();
                // self.$el.find("label[for='profile_templates']").hide();
                // self.$el.find("span[data-ua-id='alias_for_templates_profile_editor']").hide();
                // self.$el.find("#profile_templates").hide();
            } else if (val === "custom") {
                
                self.$el.find('.tab-widget').show(); 

                // self.$el.find("label[for='profile_templates']").show();
                // self.$el.find("span[data-ua-id='alias_for_templates_profile_editor']").show();
                // self.$el.find("#profile_templates").show();     

                this.profileTypeDropdown.conf.$container.parent().hide();
                this.$el.find("label[for='device_template']").show();
                this.$el.find('#'+'device_template').show();
                this.$el.find("label[for='profile_type_select']").hide();
                self.$el.find("#show_select_profile_overlay").hide();
                this.$el.find("span[data-ua-id='alias_for_profile_editor']").hide();

                self.$el.find("label[for='profile_inherit_policy']").hide();
                self.$el
                .find("#profile_inherit_policy").hide();
                self.$el.find("#show_inherit_profile_overlay").hide(); 
                self.$el.find("span[data-ua-id='alias_for_inherit_profile_editor']").hide();     
            } else {
                this.profileTypeDropdown.conf.$container.parent().hide();
                this.$el.find("label[for='profile_type_select']").hide();
                this.$el.find("label[for='device_template']").hide();
                this.$el.find("label[for='device_template']").hide();
                this.$el.find('#'+'device_template').hide();
                self.$el.find("#show_select_profile_overlay").hide();
                self.$el.find("label[for='device_template']").hide();
                this.$el.find("span[data-ua-id='alias_for_profile_editor']").hide();

                self.$el.find("label[for='profile_inherit_policy']").hide();
                self.$el.find("#profile_inherit_policy").hide();
                self.$el.find("#show_inherit_profile_overlay").hide(); 
                self.$el.find("span[data-ua-id='alias_for_inherit_profile_editor']").hide();

                self.$el.find('.tab-widget').hide();
                // self.$el.find("label[for='profile_templates']").hide();
                // self.$el.find("span[data-ua-id='alias_for_templates_profile_editor']").hide();
                // self.$el.find("#profile_templates").hide();
            }
            // Need backend API for this option to get URL
        },

        populateTemplateDropDown: function() {
            var self = this,optionList=[{"text": "None","id": "-1"}];
            self.template.fetch({
                success: function (collection, response, options) {
                    if(response['config-templates'] !== undefined && response['config-templates']['config-template'] !== undefined) {
                        if(response["config-templates"]["config-template"].length == undefined){
                            var object = response["config-templates"]["config-template"];
                            if(response["config-templates"]["config-template"]["device-family"] != "JUNOS")
                            optionList.push({"text":object.name,"id":object.id});
                        }
                        else{
                            response["config-templates"]["config-template"].forEach(function(tmp) {
                                var object = tmp;
                                if(tmp["device-family"] != "JUNOS")
                                optionList.push({"text":object.name,"id":object.id});
                            });
                         }
                         self.templateDropDown.addData(optionList);
                    }
                    if(!_.isEmpty(self.model.get('rule-profile')['custom-profile']) && self.model.get('rule-profile')['custom-profile']['sd-template']){
                           self.templateDropDown.setValue(self.model.get('rule-profile')['custom-profile']['sd-template'].id||"-1");
                    }       
                },
                error: function (collection, response, options) {
                    console.log('config templates collection not fetched');
                }
            });
        },


        getPolicyProfiles: function () {

            var self = this;

            this.profileCollection.fetch({
                success: function (collection, response, options) {
                    var policyProfiles = response['policy-profiles']['policy-profile'];
                    if (!$.isEmptyObject(policyProfiles)){
                        if (policyProfiles.length > 1) {
                            var selectData = [];
                            policyProfiles.forEach(function (object) {
                                selectData.push({id:object.id, text:object.name});
                            });
                        } else {
                                selectData.push({id:policyProfiles.id, text:policyProfiles.name});
                        }
                        self.profileTypeDropdown.addData(selectData);

                        //if the policy profile is passed from the grid select that by default
                        if (self.model.get('rule-profile')["user-defined-profile"]) {
                            var policyProfileId = self.model.get('rule-profile')["user-defined-profile"].id;
                            if (policyProfileId){
                                self.profileTypeDropdown.setValue(policyProfileId);
                                self.$el.find("#show_select_profile_overlay").show();
                            }
                        }
                    }
                },
                error: function (collection, response, options) {
                    console.log('Policy profile collection not fetched');
                }
            });
        },

        addTabWidget: function(id, gridConf) {
            var tabWidgetContainer = this.$el.find('.tab-widget').empty();
            var loggingModel = this.model ? new Backbone.Model(this.model.attributes) : new Backbone.Model();
            var authenticationModel = this.model ? new Backbone.Model(this.model.attributes) : new Backbone.Model();
            var advancedSettingsModel = this.model ? new Backbone.Model(this.model.attributes) : new Backbone.Model();
            this.authView = new AuthenticationView({
                                    context : this.context,
                                    model : authenticationModel,
                                    modelType: 'ruleOptions'
                                });
            this.advancedView = new AdvancedSettingsView({
                                    context : this.context,
                                    model : advancedSettingsModel,
                                    modelType: 'ruleOptions'
                                });    
            this.loggingView = new LoggingView({
                                    context : this.context,
                                    model : loggingModel,
                                    modelType: 'ruleOptions'
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

        updateData: function (e) {
            // get the user selected values as 'Any' OR from list builder
            // var selectedValuesObject = {};
            // var valuesForGridCell = [];
            // var valuesForAPICall = [];
            // var updatedValuesForEditor;

            //get the policy profile ID. If NONE is selected them pass empty data
            // this.$el.find('input[type=radio][name=profile_type]:checked').val()
            // var policyProfileId =  this.$el.find("#profile_type_select option:selected").val();
            // if (policyProfileId !== "") {
            //     var policyProfile = _.find(this.profileCollection.models, function(item){
            //         return item.get('id') === parseInt(policyProfileId);
            //     });
            //     gridData['Policy-Profile'] = this.$el.find("#profile_type_select option:selected").text();
            //     backendData['policy-profile'] = policyProfile.attributes;
            // } else {
            //     backendData['policy-profile'] = {};
            // }

            var profileType = this.$el.find('input[type=radio][name=profile_type]:checked').val();
            if (profileType === "none") {
             //   valuesForGridCell.push("None");
                this.model.set({
                    "rule-profile": {
                        "profile-type": "NONE"
                    }
                });

            } else if (profileType === "inherit") {
                var policy_profile = this.policyObj;  // ?????
                this.model.set({
                    "rule-profile": {
                        "profile-type": "INHERITED"
                    }
                });

            } else if (profileType === "user-defined") {

                //get the policy profile ID If NONE is selected them pass empty data
                var selectedProfileId = this.profileTypeDropdown.getValue(),policyProfile={};

                if (selectedProfileId !== "None"){
                    policyProfile = _.find(this.profileCollection.models, function(item){
                        return item.get('id') === parseInt(selectedProfileId);
                    });
                }
//                var selectedProfileName = this.$el.find("#profile_type_select option:selected").text();

                this.model.set({
                    "rule-profile": {
//                        "@href": policyProfile['@href'],
//                        "@uri": policyProfile['@uri'],
//                        "id": policyProfile.id,
//                        "name": policyProfile.name,
                        "user-defined-profile": policyProfile.toJSON()["policy-profile"],
                        "profile-type": "USER_DEFINED"
                    }
                });

            } else if (profileType === "custom") {
                // Work around until form.isValidInput() can support to check fields that don't have the "required" property
                if (this.authView != undefined && this.loggingView!==undefined && this.checkFieldStatus()) {
                    console.log('form is invalid');
                    return;
                }
                // Check if the form  is valid or not
                if (!this.form.isValidInput() && 
                    !this.authView.form.isValidInput() && !this.advancedView.form.isValidInput() 
                        &&!this.loggingView.form.isValidInput()) {
                    console.log('The form is invalid');
                    return;
                }
                this.updateCustomValues();

            //     this.updateCustomLogging();
            //     this.updateCustomAuthentication();
            //     this.updateCustomAdvancedSettings();
            }

            this.closeProfilEditorOverlay(e);
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
        },
        updateCustomValues: function() {
            var authType = this.authView.authDropDown!==undefined?this.authView.authDropDown.getValue():"NONE";
            var addrTranslation = this.advancedView.addrTranslationDropDown!==undefined?this.advancedView.addrTranslationDropDown.getValue():"NONE";                                        
            var redirect = this.advancedView.redirectDropDown!==undefined?this.advancedView.redirectDropDown.getValue():"NONE";
            var templateName = this.$el.find('#device_template :selected').text();
            var templateID=this.templateDropDown.getValue();
            var templateObj= {"id":templateID,"name":templateName};

            if(authType === "PASSTHROUGH_AUTHENTICATION"){
                this.model.set({
                    "rule-profile": {
                        "custom-profile": {
                            "authentication-type": "PASSTHROUGH_AUTHENTICATION",
                            "web-auth-client-name": this.$el.find('#client-name').val(),
                            "web-redirect": this.$el.find('input[name=web-redirect]').is(':checked'),
                            "web-redirect-to-https": this.$el.find('input[name=web-redirect-https]').is(':checked'),
                            "sd-template":templateObj,
                            "log-at-session-init-time": this.$el.find('input[name=enable-log-session-init]').is(':checked'),
                            "log-at-session-close": this.$el.find('input[name=enable-log-session-close]').is(':checked'),
                            "enable-count": this.$el.find('input[name=enable-count]').is(':checked'),
                            "per-second-alarm-threshold": this.$el.find('#alarm-threshold-bytes-second').val(),
                            "per-minute-alarm-threshold": this.$el.find('#alarm-threshold-kilo-minute').val(),
                            "service-offload": this.$el.find('input[name=services-offload]').is(':checked'),
                            "destination-address-translation": addrTranslation,
                            "redirect": redirect,
                            "tcp-syn-check": this.$el.find('input[name=tcp-syn-check]').is(':checked'),
                            "tcp-seq-check": this.$el.find('input[name=tcp-seq-check]').is(':checked')
                        },
                        "profile-type": "CUSTOM"                       
                    }
                });

            } else if(authType === "WEB_AUTHENTICATION"){

                this.model.set({
                    "rule-profile": {
                        "custom-profile": {
                            "authentication-type": "WEB_AUTHENTICATION",
                            "web-auth-client-name": this.$el.find('#web-client-name').val(),
                            "sd-template":(templateID!=='NONE')?{"id":templateID,"name":templateName}:undefined,
                            "log-at-session-init-time": this.$el.find('input[name=enable-log-session-init]').is(':checked'),
                            "log-at-session-close": this.$el.find('input[name=enable-log-session-close]').is(':checked'),
                            "enable-count": this.$el.find('input[name=enable-count]').is(':checked'),
                            "per-second-alarm-threshold": this.$el.find('#alarm-threshold-bytes-second').val(),
                            "per-minute-alarm-threshold": this.$el.find('#alarm-threshold-kilo-minute').val(),
                            "service-offload": this.$el.find('input[name=services-offload]').is(':checked'),
                            "destination-address-translation": addrTranslation,
                            "redirect": redirect,
                            "tcp-syn-check": this.$el.find('input[name=tcp-syn-check]').is(':checked'),
                            "tcp-seq-check": this.$el.find('input[name=tcp-seq-check]').is(':checked')
                        },
                        "profile-type": "CUSTOM"                       
                    }
                });

            } else if(authType === "USER_FIREWALL"){
                var userFwDropDowns = this.authView.form.getInstantiatedWidgets(),
                    domainName = userFwDropDowns['dropDown_domain-name'].instance.getValue(),
                    accessProfile  = userFwDropDowns['dropDown_access-profile-name'].instance.getValue();
                this.model.set({
                    "rule-profile": {
                        "custom-profile": {
                            "authentication-type": "USER_FIREWALL",
                            "domain": this.$el.find('#domain-name').val(),
                            "access-profile": this.$el.find('#access-profile-name').val(),
                            "sd-template":templateObj,
                            "log-at-session-init-time": this.$el.find('input[name=enable-log-session-init]').is(':checked'),
                            "log-at-session-close": this.$el.find('input[name=enable-log-session-close]').is(':checked'),
                            "enable-count": this.$el.find('input[name=enable-count]').is(':checked'),
                            "per-second-alarm-threshold": this.$el.find('#alarm-threshold-bytes-second').val(),
                            "per-minute-alarm-threshold": this.$el.find('#alarm-threshold-kilo-minute').val(),
                            "service-offload": this.$el.find('input[name=services-offload]').is(':checked'),
                            "destination-address-translation": addrTranslation,
                            "redirect": redirect,
                            "tcp-syn-check": this.$el.find('input[name=tcp-syn-check]').is(':checked'),
                            "tcp-seq-check": this.$el.find('input[name=tcp-seq-check]').is(':checked'),
                            'access-profile-name' : (accessProfile && accessProfile.length > 0)? accessProfile[0] : "",
                            'user-firewall-domain' : (domainName && domainName.length> 0) ? domainName[0] : ""
                        },
                        "profile-type": "CUSTOM"
                    }
                });

            } else if(authType === "INFRANET_AUTHENTICATION"){

                var infranetRedirect = "NONE";
                if (this.$el.find('input:radio[name=infranet-redirect]:nth(0)').is(':checked')) {
                    infranetRedirect = "NONE";
                } else if (this.$el.find('input:radio[name=infranet-redirect]:nth(1)').is(':checked')) {
                     infranetRedirect =  "REDIRECT_ALL";              
                } else if (this.$el.find('input:radio[name=infranet-redirect]:nth(2)').is(':checked')) {
                    infranetRedirect = "REDIRECT_UNAUTHENTICATED";
                }   

                this.model.set({
                    "rule-profile": {
                        "custom-profile": {
                            "authentication-type": "INFRANET_AUTHENTICATION",
                            "infranet-redirect": infranetRedirect,
                            "redirect-url": this.$el.find('#redirect-url').val(),
                            "sd-template":templateObj,
                            "log-at-session-init-time": this.$el.find('input[name=enable-log-session-init]').is(':checked'),
                            "log-at-session-close": this.$el.find('input[name=enable-log-session-close]').is(':checked'),
                            "enable-count": this.$el.find('input[name=enable-count]').is(':checked'),
                            "per-second-alarm-threshold": this.$el.find('#alarm-threshold-bytes-second').val(),
                            "per-minute-alarm-threshold": this.$el.find('#alarm-threshold-kilo-minute').val(),
                            "service-offload": this.$el.find('input[name=services-offload]').is(':checked'),
                            "destination-address-translation": addrTranslation,
                            "redirect": redirect,
                            "tcp-syn-check": this.$el.find('input[name=tcp-syn-check]').is(':checked'),
                            "tcp-seq-check": this.$el.find('input[name=tcp-seq-check]').is(':checked')
                        },
                        "profile-type": "CUSTOM"                       
                    }       
                });         
            } else {

                this.model.set({
                    "rule-profile": {
                        "custom-profile": {
                            "log-at-session-init-time": this.$el.find('input[name=enable-log-session-init]').is(':checked'),
                            "log-at-session-close": this.$el.find('input[name=enable-log-session-close]').is(':checked'),
                            "sd-template":templateObj,
                            "enable-count": this.$el.find('input[name=enable-count]').is(':checked'),
                            "per-second-alarm-threshold": this.$el.find('#alarm-threshold-bytes-second').val(),
                            "per-minute-alarm-threshold": this.$el.find('#alarm-threshold-kilo-minute').val(),
                            "service-offload": this.$el.find('input[name=services-offload]').is(':checked'),
                            "destination-address-translation": addrTranslation,
                            "redirect": redirect,
                            "tcp-syn-check": this.$el.find('input[name=tcp-syn-check]').is(':checked'),
                            "tcp-seq-check": this.$el.find('input[name=tcp-seq-check]').is(':checked')
                        },
                        "profile-type": "CUSTOM"                       
                    }
                });
            }         
        },

        showProfileDetailsOverlay: function(e, profileId) {
            var intent = new Slipstream.SDK.Intent("sd.intent.action.ACTION_SHOW_DETAIL_VIEW",
                {mime_type:'vnd.juniper.net.firewall.policy-profiles'});
            intent.putExtras({'id':profileId});    
            this.context.startActivity(intent);
        },

        showInheritProfileDetailsOverlay: function(e) {
            var self = this;
            console.log("inherit profile overlay");

            var profileId = self.policyProfileId;
            this.showProfileDetailsOverlay(e, profileId);
        },

        showSelectProfileDetailsOverlay: function(e) {
            var self = this;
            console.log("select profile overlay");

//            var selected_profile_id = self.model.get("rule-profile").id;
            var selected_profile_id = this.profileTypeDropdown.getValue();
            if(selected_profile_id !== "None"){
                this.showProfileDetailsOverlay(e, selected_profile_id);
            }

        },

        closeProfileDetailOverlay: function(e) {
            if (this.detailOverlay)
                this.detailOverlay.destroy();      
        },

        closeProfilEditorOverlay: function (e) {
            this.options.close(this.options.columnName, e);
        },

        setCellViewValues: function (rowData) {
            // to get the values from the grid cell in this view
            this.model = this.options.ruleCollection.get(rowData.originalRowData[PolicyManagementConstants.JSON_ID]);
        }

    });

    return ProfileEditorView;
});