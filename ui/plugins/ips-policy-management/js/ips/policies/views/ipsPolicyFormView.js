/**
 * The launch create ips policy page
 *
 * @module IPSPolicyFormView
 * @author Vinamra Jaiswal <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',   
    'widgets/overlay/overlayWidget',
    '../conf/ipsPolicyFormConfiguration.js',
    '../models/ipsPolicyModel.js',
    '../models/ipsPolicyCollection.js',
    '../../../../../ui-common/js/views/apiResourceView.js',
    '../widgets/ipsTemplateListBuilder.js',
     '../../../../../base-policy-management/js/policy-management/policies/views/basePolicyView.js',
     '../../../../../ips-policy-management/js/ips/common/constants/ipsPolicyManagementConstants.js',
     './ipsPolicyTemplateEditorView.js'
], function (Backbone, Syphon, FormWidget, OverLayWidget, IPSPolicyFormConfiguration,
             IPSPolicyModel, Collection, ResourceView, TemplateListBuilder, 
             BasePolicyView, IPSPolicyManagementConstants, IpsPolicyTemplateEditorView) {

    var IPSPolicyFormView = BasePolicyView.extend({

        model: new IPSPolicyModel(),
        collection : new Collection(),
        serviceType: IPSPolicyManagementConstants.SERVICE_TYPE,
        policyManagementConstants:IPSPolicyManagementConstants,

        events: function(){
          return _.extend({},BasePolicyView.prototype.events,{
               "click #policy_template_overlay": "showPolicyTemplateOverlay"
          });
        },

        initializeHandler: function () {

            this.successMessageKey = 'ips_policy_create_success';
            this.editMessageKey = 'ips_policy_edit_success';
            this.fetchErrorKey = 'ips_policy_fetch_error';
            this.fetchCloneErrorKey = 'ips_policy_fetch_clone_error';
        },

        renderHandler : function() {        
          var sourceIdentityElem = this.$el.find("#ips-policy-temp-editor");
          $(sourceIdentityElem).append("<div class=formatable-text-div id=ips-policy-temp-editor-txt></div>");
          this.populateTemplateData();
          if(this.formMode === this.MODE_EDIT) {
          if(this.model.attributes['ips-policy-type']==="IPSADVANCED"){ 
              this.$el.find('#ips_policy_template_form').hide();
              this.$el.find('#ips_policy_template_form').children().hide();
            }
          }
        },

        getFormConfiguration : function() {
            return new IPSPolicyFormConfiguration(this.context);
        },

        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);
            switch (this.formMode) {
                case this.MODE_EDIT:
                    dynamicProperties.title = this.context.getMessage('ips_policy_edit');
                    break;
                case this.MODE_CREATE:
                    dynamicProperties.title = this.context.getMessage('ips_policy_create');
                    break;
                case this.MODE_CLONE:
                    dynamicProperties.title = this.context.getMessage('ips_policy_clone');
                    break;
                case this.MODE_SAVE_AS:
                    dynamicProperties.title = this.context.getMessage('ips_policy_save_as');
                    break;
            }

            _.extend(formConfiguration, dynamicProperties);
        },

        getTemplateListBuilderSelectedItems: function (){
            var self =this;
                    var sigSets = self.model.attributes['signature-sets'];
                     if (sigSets!= undefined && sigSets.reference!==undefined){
                        var members = [];
                        for (var i in sigSets.reference) {
                            members.push({
                                "id": sigSets.reference[i].id,
                                "name": sigSets.reference[i].name,
                                "domain-name": sigSets.reference[i]["domain-name"],
                                "domain-id": sigSets.reference[i]["domain-id"]
                            });
                        }
                        return members;            
                    }
        },

        //Populates the policy template info. 
        populateTemplateData: function() {
            var self = this;
            var selectedListValues = self.getTemplateListBuilderSelectedItems();
            if(!_.isEmpty(selectedListValues)){
                var listStr = ""
                selectedListValues.forEach(function (object) {
                    listStr += object.name+ "\n";
                });
                var sourceText = self.$el.find("#ips-policy-temp-editor-txt");
                sourceText.add( "span" ).css( "font-size", "12px" );
                $(sourceText).text(listStr);
                self.selectedTemplates = selectedListValues;
          }
        },

        getFormData: function () {
            var params = Syphon.serialize(this);            
            params["definition-type"] = "CUSTOM";
            delete params.ipsConfigurationMode;
            var selectedSignatureSet = this.selectedTemplates;
            var members=[];
            if(!_.isEmpty(selectedSignatureSet)){
                selectedSignatureSet.forEach(function (object) {
                    members.push({
                        "id": object.id,
                        "name": object.name
                    });
                });
            }
            //Policy type will be IPSADVANCE when Policy template is not part of policy        
            if(!_.isEmpty(selectedSignatureSet) && selectedSignatureSet.length >= 1){
                 params["ips-policy-type"] = "IPSBASIC";
            }else{
                params["ips-policy-type"] = "IPSADVANCED";
            }
            var reference = {'reference':members};
            params["signature-sets"] = reference;
            return params;
        },

        validateForm : function(){
            return this.formWidget.isValidInput(this.$el.find('form'));
        },


       //Below method is used to launch Ips Policy Template Editor
        showPolicyTemplateOverlay : function() {
            var self = this,selectedListValues;
            var view= new IpsPolicyTemplateEditorView({
                context : self.context,
                parentView : self
            });
            self.ipsPolicyTemplateOverlay  = new OverLayWidget({
                  view: view,
                  type: 'large'
             });
            self.ipsPolicyTemplateOverlay.build();
            var ipsTemplateContainer = view.$el.find('#list-builder-element');
            ipsTemplateContainer.attr("readonly", "");
            selectedListValues = self.selectedTemplates;
            self.ipsPolicyTemplateListBuilder = new TemplateListBuilder({
                container: ipsTemplateContainer,
                selectedItems: selectedListValues
            });
             self.ipsPolicyTemplateListBuilderObj = self.ipsPolicyTemplateListBuilder.build();           
             ipsTemplateContainer.find('.new-list-builder-widget').unwrap();
        }

    });
    return IPSPolicyFormView;
});