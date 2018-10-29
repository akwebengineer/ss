/**
 * 
 * @author Ashish Vyawahare <avyaw@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/form/formValidator',
    '../../../../../ui-common/js/views/apiResourceView.js',
    '../conf/ipsPolicyTemplateFormViewConf.js',
    '../constants/ipsPolicyTemplatesConstants.js',
    '../models/ipsPolicyTemplatesModel.js',
    '../models/ipsPolicyTemplatesCollection.js'
], function (Backbone, Syphon, FormWidget, FormValidator, ResourceView, IpsPolicyTemplateForm, IpsPolicyTemplateConstant, IpsPolicyTemplateModel, IpsPolicyTemplateCollection) {
    var IpsPolicyTemplateView = ResourceView.extend({

        events: {
            'click #ips-policy-template-save': "submit",
            'click #ips-policy-template-cancel': "cancel"
        },

        model: new IpsPolicyTemplateModel(),
        collection : new IpsPolicyTemplateCollection(),
        policyManagementConstants : IpsPolicyTemplateConstant,

        submit: function (event) {
            event.preventDefault();
            var self = this;
            if (self.validateForm() && self.isValidDescription()) {
                self.bindModelEvents();
                var params = self.getFormData();
                if(self.formMode === self.MODE_CLONE) {
                        self.clonePolicy(params,event);
                } else if(self.formMode === self.MODE_SAVE_AS) {
                       self.saveAsPolicy(params);
                }else{
                       self.model.save(params, {
                            success: function (model, response, options) {
                                self.cancel(event);  
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown) {
                                self.cancel(event);
                            }
                       });
                }
            }
        },

        saveAsPolicy: function(params) {
            var self = this;
            var policyId = self.activity.getIntent().getExtras().id;
            var dataObj = {
              "policy-template" : params
            };
            $.ajax({
                url: self.policyManagementConstants.IPS_POLICY_TEMPLATE_URL+"/"+policyId+"/draft/save-as?cuid=" + self.screenId,
                type: 'POST',
                dataType:"json",
                data: JSON.stringify(dataObj),
                headers: {
                    "Content-Type": IpsPolicyTemplateConstant.IPS_POLICY_TEMPLATE_CONTENT_TYPE,
                    "accept": IpsPolicyTemplateConstant.IPS_POLICY_TEMPLATE_ACCEPT_HEADER
                },               
                success: function(data, status) {  
                    self.cancel(event);
                    var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_LIST,
                        {
                            mime_type: self.policyManagementConstants.POLICY_MIME_TYPE
                        }
                    );
                    self.context.startActivityForResult(intent);
                    self.notify('success', self.context.getMessage("policy_create_success",[params.name]));  
                },
                error: function(data) {
                    console.log("Save As failed");
                }
            });
        },
      clonePolicy: function(params,event) {
            var self = this; 
            var policyId = self.activity.getIntent().getExtras().id;
            var dataObj = {
              "policy-template" : params
            };
            $.ajax({
                url: IpsPolicyTemplateConstant.getClonePolicyTemplateURL(policyId),
                type: 'POST',
                dataType:"json",
                data: JSON.stringify(dataObj),
                headers: {
                    "Content-Type": IpsPolicyTemplateConstant.IPS_POLICY_TEMPLATE_CONTENT_TYPE,
                    "accept": IpsPolicyTemplateConstant.IPS_POLICY_TEMPLATE_ACCEPT_HEADER
                },               
                success: function(data, status) { 
                  self.cancel(event);
                  console.log("Clone successful");
                },
                error: function() {
                    self.cancel(event);  
                    console.log("Clone failed");
                }
            });
        },

        cancel: function(event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        },

        initialize: function(options) {
            ResourceView.prototype.initialize.call(this, options);
            this.activity = options.activity;
            this.context = options.activity.getContext();
            this.screenId = options.activity.cuid;
            var mode = this.activity.getIntent().getExtras().mode;
            if(mode === this.MODE_SAVE_AS){
                this.formMode=this.MODE_SAVE_AS;
                this.screenId = this.activity.getIntent().getExtras().cuid;
            }
            this.initializeHandler();
        },

        initializeHandler: function () {
            this.successMessageKey = 'ips_policy_template_create_success';
            this.editMessageKey = 'ips_policy_template_edit_success';
            this.fetchErrorKey = 'ips_policy_template_fetch_error';
            this.fetchCloneErrorKey = 'ips_policy_template_fetch_clone_error';
        },
        
        render: function() {
            var self = this,
                formConfiguration = new IpsPolicyTemplateForm(this.context),
                formElements = formConfiguration.getValues();

            self.addDynamicFormConfig(formElements);
            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.attributes
            });
            this.form.build();
            return this;
        },

        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);
            switch (this.formMode) {
                case this.MODE_EDIT:
                    dynamicProperties.title = this.context.getMessage('ips_policy_templates_grid_edit');
                    break;
                case this.MODE_CREATE:
                    dynamicProperties.title = this.context.getMessage('ips_policy_templates_grid_create');
                    break;
                case this.MODE_CLONE:
                    dynamicProperties.title = this.context.getMessage('ips_policy_templates_grid_clone');
                    break;
                case this.MODE_SAVE_AS:
                    dynamicProperties.title = this.context.getMessage('ips_policy_templates_grid_save_as');
                    break;    
            }

            _.extend(formConfiguration, dynamicProperties);
        },

        getFormData: function () {
            var params = Syphon.serialize(this);
            return params;
        },

        validateForm : function(){
            return this.form.isValidInput(this.$el.find('form'));
        },

        isValidDescription : function(){
            var policy_template_description = this.$el.find('#ips-policy-template-description').val();
            if(policy_template_description.length >= 256){
              return false;
            }
            return true;
        }

    });

    return IpsPolicyTemplateView;
});
