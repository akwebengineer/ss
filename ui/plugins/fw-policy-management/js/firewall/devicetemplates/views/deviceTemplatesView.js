/**
 * View to create a Device Templates
 * 
 * @module DeviceTemplateView
 * @author Vivek Kumar <vkumar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/form/formValidator',
    '../../../../../ui-common/js/views/apiResourceView.js',
    '../models/deviceTemplatesCollection.js',
    '../conf/deviceTemplatesFormConf.js',
    '../common/constant/deviceTemplatesConstant.js',
    'widgets/dropDown/dropDownWidget',
    '../../../../../ui-common/js/common/utils/validationUtility.js',
    '../../../../../ui-common/js/common/restApiConstants.js'
], function(Backbone, FormWidget, FormValidator, ResourceView, Collection, DeviceTemplateForm, DeviceConstant, DropDownWidget,ValidationUtility, RestApiConstants) {
    // the limit of source port
    var TEMPLATE_ID = null;
    var DeviceTemplateView = ResourceView.extend({
        nameValidationTotalProperty : RestApiConstants.SPACE_TOTAL_PROPERTY,
        events: {
            'click #devicetemplate-validate': "validatebutton",
            'click #devicetemplate-save': "submit",
            'click #devicetemplate-cancel': "cancel"
        },

        submit: function(event) {
            event.preventDefault();
            var self = this;
            self.doValidation(false);
            self.bindModelEvents();
        },

        cancel: function(event) {
            event.preventDefault();
            if (this.formMode != this.MODE_EDIT && this.TEMPLATE_ID != null) {
                this.deleteoldtemplate();
            }
            this.activity.overlay.destroy();
        },

        initialize: function(options) {
            ResourceView.prototype.initialize.call(this, options);
            _.extend(this, ValidationUtility);
            this.activity = options.activity;
            this.context = options.activity.getContext();
            this.validator = new FormValidator();
            this.collection = new Collection;

            this.successMessageKey = 'device_templates_create_success';
            this.editMessageKey = 'device_templates_edit_success';
            this.fetchErrorKey = 'device_templates_fetch_error';
        },

        render: function() {
            var self = this,
                formConfiguration = new DeviceTemplateForm(this.context),
                formElements = formConfiguration.getValues();

            this.addDynamicFormConfig(formElements);

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.attributes
            });
            this.form.build();
            //work around for clone option to avoid undefined error for id
            this.TEMPLATE_ID = this.model.attributes.id || this.activity.getIntent().getExtras().id;
            this.$el.find('#devicetemplate-editor').height(320);
            this.$el.find('#devicetemplate-editor').width(600);
            this.$el.find('#devicetemplate-validate')[0].style.marginLeft = "320px";
            
            this.$el.find('.devicetemplate-example .elementlabel').append("<label for='devicetemplate-sample' class='left inline'><a href='../../../../../fw-policy-management/js/firewall/devicetemplates/data/sampleCLI_Templates.txt' download style='padding-left:1px; padding-right:3px;'>Sample CLI</a></label>");

            this.populateVersions();
            this.profileDropDown = this.createDropDown('devicetemplate-os-version', [],this.osversiondropdownchange);
            if(this.formMode === this.MODE_EDIT || this.formMode === this.MODE_CLONE){
                this.$el.find('.devicetemplate-os-version').prop('disabled',true);
                this.gettemplateconfiguration();
            }     
            return this;
        },
         checkReleaseNumberPresent : function() {
             var releaseID= this.selectedReleaseId,
                 version = this.$el.find('#devicetemplate-os-version');
                 error = version.siblings('.error');

             if((releaseID == undefined || releaseID == "") ) {
                 version.parent().addClass("error").siblings().addClass("error");
                 return false;
             }
             else {
                 version.parent().removeClass("error").siblings().removeClass("error");
             }
             return true;
        },
        createDropDown: function(container,data,onchange){
              var self = this;
              this.$el.find('#'+container).append('<select class="'+container+'" style="width: 100%"></select>');
              return new DropDownWidget({
                  "container": this.$el.find("."+container),
                  "data": JSON.stringify(data),
                  "placeholder": this.context.getMessage('select_option'),
                  "enableSearch": true,
                  "onChange": function(event) {
                      if (onchange) {onchange($(this).val(),self);}
                   }
              }).build();
        },
        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);
            switch (this.formMode) {
                case this.MODE_EDIT:
                    dynamicProperties.title = this.context.getMessage('device_templates_grid_edit');
                    break;
                case this.MODE_CREATE:
                    dynamicProperties.title = this.context.getMessage('device_templates_grid_create');
                    break;
                case this.MODE_CLONE:
                    dynamicProperties.title = this.context.getMessage('device_templates_grid_clone');
                    break;    
            }

            _.extend(formConfiguration, dynamicProperties);
        },
        osversiondropdownchange: function(value,scope) {
            var THIS = scope || this;
            THIS.selectedReleaseId = value;
            if (THIS.formMode != THIS.MODE_EDIT) {
                THIS.createnewtemplate();
            }
        },

        /* This API will create the config based on Version selected by the user, On each change it will create new template 
           and subsequently delete the older one*/
        createnewtemplate: function() {
            var self = this;
            var dataObj = {
                "create-quick-template-request": {
                    "description": self.$el.find('#devicetemplate-description').val(),
                    "device-family": "junos-es",
                    "os-version": self.profileDropDown.getValue(),
                    "template-name": self.$el.find('#devicetemplate-name').val()
                }
            };

            $.ajax({
                url: DeviceConstant.TEMPLATE_CREATE_CONFIG_URL,
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify(dataObj),
                headers: {
                    "Content-Type": DeviceConstant.TEMPLATE_CREATE_CONFIG_CONTENT_TYPE
                },
                success: function(data, status) {
                    console.log('created successfully');
                    if (self.formMode != self.MODE_EDIT && self.TEMPLATE_ID != null) {
                        self.deleteoldtemplate();
                    }
                    self.TEMPLATE_ID = data['quick-template-basic-info']['template-id'];
                },
                error: function(jqXhr, textStatus, errorThrown) {
                    console.log('unsuccessfull');
                }
            });
        },

        /* This API will delete the config based on Version selected by the user*/
        deleteoldtemplate: function() {
            var self = this;
            $.ajax({
                url: "/api/space/config-template-management/templates/" + self.TEMPLATE_ID + '/discard-quick-template-draft',
                method: 'POST',
                dataType: 'json',
                headers: {
                    "Content-Type": DeviceConstant.TEMPLATE_DELETE_CONFIG_CONTENT_TYPE
                },
                success: function(data, status) {
                    console.log('delete successfully');
                },

                error: function(jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            });
        },

        /* This API will populate the version combo box based on the SRX schema in the Platform
         If there are multiple version coming from the backend it will be come as Array else will come as String*/
        populateVersions: function() {
            var self = this;
            // var serviceValue = self.parentView.$el.find('#os-version').val();
            $.ajax({
                url: DeviceConstant.OS_VERSION_URL,
                method: 'GET',
                dataType: 'json',
                headers: {
                    'accept': DeviceConstant.OS_VERSION_ACCEPT_HEADER
                },
                success: function(data, status) {
                    var record = [{"id":"","text":""}];
                    if (data && data['os-versions']) {
                        if (Array.isArray(data['os-versions']['os-version'])) {
                            data['os-versions']['os-version'].forEach(function(object) {
                                var d = {
                                    "text": object,
                                    "id": object
                                };
                                record.push(d);
                            });

                        } else {
                            var d = {
                                "text": data['os-versions']['os-version'],
                                "id": data['os-versions']['os-version']
                            };
                            record.push(d);
                        }
                    self.profileDropDown.addData(record);
                    if(self.model.get('os-version')) {
                        var versionId = $("#devicetemplate-os-version option:contains("+self.model.get('os-version')+")").attr('value');
                        self.profileDropDown.setValue(versionId);
                    }      
                    }
                },
                error: function(jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            });
        },

        /*Fetch Template Config in Edit Mode*/
        gettemplateconfiguration: function() {
            var self = this;
            $.ajax({
                url: "/api/space/config-template-management/config-templates/" + self.TEMPLATE_ID + "/configuration",
                method: 'GET',
                dataType: 'json',
                headers: {
                    'accept': DeviceConstant.TEMPLATE_GET_CONFIG_CONTENT_TYPE
                },
                success: function(data, status) {
                    if (data && data['configuration-cli']) {
                        if (data['configuration-cli']['cli'] != "") {
                            var dd = data['configuration-cli']['cli'].toString();
                            self.$el.find('#devicetemplate-editor').text(dd);
                        }
                    }
                },
                error: function(jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            });
        },

        validatebutton: function() {
            var self = this;
            self.doValidation(true);
        },
        /*1 it will validate the configuration
          2. it will set the formConfiguration
          3. it will save template*/
        doValidation: function(flag) {
            var self = this;
            if(!self.checkReleaseNumberPresent()){
                console.log('relaese number is invalid');
                return;
            }
            if (!this.form.isValidInput()) {
                console.log('form is invalid');
                return;
            }

            if (!flag && self.$el.find('#devicetemplate-editor').val() == "") {
                self.form.showFormError("Template Editor field is empty");
                return;
            }
            var dataObj = {
                "validate-quick-template-config-cli-request": {
                    "clis": self.$el.find('#devicetemplate-editor').val()
                }
            };
            $.ajax({
                url: "/api/space/config-template-management/templates/" + self.TEMPLATE_ID + '/validate-quick-template-config-cli',
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify(dataObj),
                headers: {
                    "Content-Type": DeviceConstant.TEMPLATE_VALIDATION_CONTENT_TYPE
                },
                success: function(data, status) {
                    if (data['quick-template-validate-result']['status'] == 'FAIL') {
                        self.form.showFormError(data['quick-template-validate-result']['errors']['quick-template-validation-error']['err-reason']);
                        return;
                    }
                    if(data['quick-template-validate-result']['status'] == 'PASS'){
                        console.log('Validated successfully');
                        self.showInfoForTextarea(self.$el.find('#devicetemplate-editor'));
                        if (!flag) {
                            self.configureTemplateconfig();
                        }
                    }
                },
                error: function(jqXhr, textStatus, errorThrown) {
                    console.log("Validation Unsuccessful");
                    self.form.showErrorInfo(self.$el.find('#devicetemplate-editor'));
                }
            });

        },

        /* This API will Populate the configuration based on the template id*/
        configureTemplateconfig: function() {
            var self = this;

            var dataObj = {
                "configuration-cli-request": {
                    "clis": self.$el.find('#devicetemplate-editor').val()
                }
            };

            $.ajax({
                url: "/api/space/config-template-management/config-templates/" + self.TEMPLATE_ID + '/configuration',
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify(dataObj),
                headers: {
                    "Accept": DeviceConstant.TEMPLATE_CONFIG_ACCEPT_HEADER,
                    "Content-Type": DeviceConstant.TEMPLATE_CONFIG_CONTENT_TYPE
                },
                success: function(data, status) {
                    console.log("Configuration set Successful");
                    self.configureTemplate();
                },
                error: function(jqXhr, textStatus, errorThrown) {
                    console.log("Configuration set Unsuccessful");

                }
            });
        },
        /**
         * Used to show success information for textarea, it's a temporary workaround.
         */
        showInfoForTextarea: function(comp) {
            var self = this;
            var infoTarget = comp[0].id + '-error';
            var infoObj = $('#' + infoTarget);
            if(infoObj.length === 0){
                var html = '<span class="inline-help valid">Valid</span>';
                comp.after(html);
            }
            else{
                infoObj.remove();
                comp.siblings(".inline-help").hide();
            }
        },
        /*This API will finally persist the configuration in the DB*/
        configureTemplate: function(event) {
            var self = this;

            var templateObj = {
                "quick-template-basic-info": {
                    "template-description": self.$el.find('#devicetemplate-description').val(),
                    "template-name": self.$el.find('#devicetemplate-name').val(),
                    "families": {
                        "supported-device-families": {
                            "family-name": 'junos-es',
                            "versions": {
                                "version":  self.profileDropDown.getValue()
                            }
                        }
                    }
                }
            };

            $.ajax({
                url: "/api/space/config-template-management/templates/" + self.TEMPLATE_ID + '/commit-quick-template',
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify(templateObj),
                headers: {
                    "Content-Type": DeviceConstant.TEMPLATE_CREATION_CONTENT_TYPE
                },
                success: function(data, status) {
                    self.activity.overlay.destroy();
                    if(self.formMode === self.MODE_EDIT || self.formMode === self.MODE_CLONE){
                        self.successMessageKey = self.editMessageKey;
                    }    
                    self.notify("success", self.context.getMessage(self.successMessageKey,[self.$el.find('#devicetemplate-name').val()]));
                },
                error: function(jqXhr, textStatus, errorThrown) {
                    self.form.showFormError(jqXhr.responseText);
                    self.view.notify('error', self.fetchErrorKey);
                }
            });
        }
    });

    return DeviceTemplateView;
});
