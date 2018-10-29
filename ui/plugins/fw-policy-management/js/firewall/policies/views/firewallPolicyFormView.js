/**
 * The launch create firewall policy page
 *
 * @module FirewallPolicyFormView
 * @author Pei-Yu Yang <pyang@juniper.net>
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/dropDown/dropDownWidget',
    '../conf/firewallPolicyFormConfiguration.js',
    '../models/firewallPolicyModel.js',
    '../models/fwPolicyCollection.js',
    "../../profiles/models/policyProfileCollection.js",
    '../../../../../base-policy-management/js/policy-management/policies/views/basePolicyView.js',
    '../../../../../ui-common/js/views/apiResourceView.js',
    '../constants/fwPolicyManagementConstants.js'
], function (Backbone, Syphon, FormWidget, DropDownWidget, FirewallPolicyFormConfiguration,
             FirewallPolicyModel, Collection, PolicyProfileCollection, 
             BasePolicyView, ResourceView, FwPolicyManagementConstants) {

    var FirewallPolicyFormView = BasePolicyView.extend({

        model: new FirewallPolicyModel(),
        collection : new Collection(),
        serviceType: FwPolicyManagementConstants.SERVICE_TYPE,
        policyManagementConstants: FwPolicyManagementConstants,

        initializeHandler: function () {
            this.successMessageKey = 'fw_policy_create_success';
            this.editMessageKey = 'fw_policy_edit_success';
            this.fetchErrorKey = 'fw_policy_fetch_error';
            this.fetchCloneErrorKey = 'fw_policy_fetch_clone_error';
            this.profileCollection = new PolicyProfileCollection();
        },

        getFormConfiguration : function() {
            return new FirewallPolicyFormConfiguration(this.context);
        },

        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);
            switch (this.formMode) {
                case this.MODE_EDIT:
                    dynamicProperties.title = this.context.getMessage('grid_edit_policy');
                    break;
                case this.MODE_CREATE:
                    dynamicProperties.title = this.context.getMessage('grid_create_policy');
                    break;
                case this.MODE_CLONE:
                    dynamicProperties.title = this.context.getMessage('grid_clone_policy');
                    break;
                case this.MODE_SAVE_AS:
                    dynamicProperties.title = this.context.getMessage('grid_saveas_policy');
                    break;
                case this.MODE_PROMOTE_TO_GROUP:
                    dynamicProperties.title = this.context.getMessage('promote_group_policy');
                    break;
            }

            _.extend(formConfiguration, dynamicProperties);
        },

        getPolicyProfiles: function () {
            var self = this;

            this.profileCollection.fetch({
                success: function (collection, response, options) {
                    var profilesData = [],
                        profileInModel = self.model.get("policy-profile");

                    response['policy-profiles']['policy-profile'].forEach(function (object) {
                        profilesData.push({id:object.id, text:object.name});
                        
                    });
                    self.profileDropDown.addData(profilesData);

                    if (profileInModel && profileInModel.id) {
                        self.profileDropDown.setValue(profileInModel.id);
                    }
                },
                error: function (collection, response, options) {
                    console.log('Policy profile collection not fetched');
                }
            });
        },

        renderHandler : function() {
            this.buildPolicyProfileDropdown();
            this.getPolicyProfiles();
        },

        buildPolicyProfileDropdown: function(){
            var self = this,  
                profileContainer = self.$el.find('.firewall-policy-profiles');

            self.profileDropDown = new DropDownWidget({
                "container": profileContainer,
                "data": [{"id": "", "text":""}],
                "onChange" : function() {
                    self.selectedProfile = {"id":this.value};
                },
                "enableSearch": true,
                "showCheckboxes": false,
                "placeholder": self.context.getMessage("select_option")
            });
            self.profileDropDown.build();
            self.$el.find('.select2-container').css('width', '100%');
            self.profileDropDown.setValue([""]);
        },

        getFormData: function () {

            var params = Syphon.serialize(this);
            params["manage-zone-policy"] = true;
            params["manage-global-policy"] = true;
            params["policy-profile"] = {"id": this.selectedProfile.id};
            params["ips-mode"] = "NONE";

            return params;
        },

        validateForm : function(){
            return this.formWidget.isValidInput(this.$el.find('form'));
        },

        promoteToGroupPolicy : function(params){
            var self=this;
            params["id"]=self.model.get("id");
            $.ajax({
                url: '/api/juniper/sd/policy-management/firewall/policies/'+self.model.get("id")+'/promote',
                method:'POST',
                dataType:'json',
                data: JSON.stringify({policy:params}),
                headers: {
                    "Content-Type":FwPolicyManagementConstants.POLICY_CONTENT_HEADER,
                     'accept': FwPolicyManagementConstants.POLICY_ACCEPT_HEADER
                 },
                success: function(data, status) {
                     self.destroyOverlay();
                },
           
                error: function( jqXhr, textStatus, errorThrown ) {
                     self.formWidget.showFormError(jqXhr['responseText']);
                }
            });
        }

    });

    return FirewallPolicyFormView;
});
