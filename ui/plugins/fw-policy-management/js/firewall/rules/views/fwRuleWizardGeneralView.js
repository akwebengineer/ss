/**
 * Firewall rule wizard general view 
 *
 * @module FirewallRuleWizardGeneralView
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'widgets/form/formWidget',
    '../conf/fwRuleWizardGeneralConfig.js'
    ],function(Backbone, FormWidget, RuleWizardGeneralConf) {

        var FirewallRuleGeneralView = Backbone.View.extend({

            initialize: function(){
                var me = this;
                this.context = this.options.context;
                this.policyObj = this.options.policyObj;
                 
                this.formConfiguration = new RuleWizardGeneralConf(this.context);   

            },

            render: function(){
                var self = this;

                var formElements = self.formConfiguration.getElements();  
          
                this.form = new FormWidget({
                     "elements": self.formConfiguration.getElements(),
                     "container": this.el
                });
                this.form.build();

                this.$el.find("#rule-name").val(this.model.get("name"));
                this.$el.find("#rule-description").val(this.model.get("description"));

                return this;
            },

           beforePageChange : function(currentStep, requestedStep) {
             
                if (!this.form.isValidInput()) {
                    return false;
                }

                this.model.set(
                    { name: this.$el.find("#rule-name").val(), 
                      description: this.$el.find("#rule-description").val()
                    }
                );
                return true;
            },

            getSummary: function() {
                var summary = [];
                var self = this;

                summary.push({
                    label: self.context.getMessage('general_information'),
                    value: ' '
                });

                summary.push({
                        label: self.context.getMessage('name'),
                        value: this.model.get("name")
                });
               
                summary.push({
                        label: self.context.getMessage('description'),
                        value: this.model.get("description")
                });
            
                return summary;
            },

            getTitle: function () {
                return this.context.getMessage('general_information');
            }

        });
        return FirewallRuleGeneralView;

    });
