/**
 * The launch create nat policy page
 *
 * @module NATPolicyFormView
 * @author Sandhya B <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'backbone.syphon',
    '../conf/natPolicyFormConfiguration.js',
    '../models/natPolicyModel.js',
    '../models/natPolicyCollection.js',
    '../../../../../base-policy-management/js/policy-management/policies/views/basePolicyView.js',
    '../../../../../ui-common/js/views/apiResourceView.js',
    '../../../../../nat-policy-management/js/nat/common/constants/natPolicyManagementConstants.js'
], function (Backbone, Syphon, NATPolicyFormConfiguration,
             NATPolicyModel,Collection,
             BasePolicyView,ResourceView,
             NATPolicyManagementConstants) {
    
    var NATPolicyFormView = BasePolicyView.extend({

        model: new NATPolicyModel(),
        collection : new Collection(),
        serviceType:NATPolicyManagementConstants.SERVICE_TYPE,
        policyManagementConstants:NATPolicyManagementConstants,
        
        initializeHandler: function () {
            this.successMessageKey = 'nat_policy_create_success';
            this.editMessageKey = 'nat_policy_edit_success';
            this.fetchErrorKey = 'nat_policy_fetch_error';
            this.fetchCloneErrorKey = 'nat_policy_fetch_clone_error';
        },

        getFormConfiguration : function() {
            return new NATPolicyFormConfiguration(this.context);
        },

        populateData : function() {
            this.$el.find('input[name=enable-auto-arp]').attr("checked", this.model.get("enable-auto-arp"));
            this.$el.find('input[name=proxy-arp-managed]').attr("checked",this.model.get("proxy-arp-managed"));
            if(this.model.get("proxy-arp-managed")===false){
              this.$el.find('input[name=enable-auto-arp]').prop('disabled', true);
            }
        },
        renderHandler : function() {
                var enableAutoArpObject = this.$el.find('input[name=enable-auto-arp]');
                this.$el.find('input[name=proxy-arp-managed]').on('change', function() {
                  if (this.checked) {
                    enableAutoArpObject.prop('disabled', false);
                  } else {
                    enableAutoArpObject.prop('disabled', true);
                    enableAutoArpObject.prop('checked', false);
                  }
                });
              },

        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);
            switch (this.formMode) {
                case this.MODE_EDIT:
                    dynamicProperties.title = this.context.getMessage('nat_policy_edit');
                    break;
                case this.MODE_CREATE:
                    dynamicProperties.title = this.context.getMessage('nat_policy_create');
                    break;
                case this.MODE_CLONE:
                    dynamicProperties.title = this.context.getMessage('nat_policy_clone');
                    break;
                case this.MODE_SAVE_AS:
                    dynamicProperties.title = this.context.getMessage('nat_policy_save_as');
                    break;
            }

            _.extend(formConfiguration, dynamicProperties);
        },

        getFormData: function () {
            var params = Syphon.serialize(this);
            return params;
        },

        validateForm : function(){
            return this.formWidget.isValidInput(this.$el.find('form'));
        }
    });

    return NATPolicyFormView;
});