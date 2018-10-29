/**
 * Firewall rule wizard rule analysis view 
 *
 * @module FirewallRuleWizardRuleAnalysisView
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget',
    '../constants/fwRuleGridConstants.js',
    '../conf/fwRuleWizardRuleAnalysisConfig.js',
    '../../../../../ui-common/js/common/widgets/progressBarForm.js'
    ],function(Backbone, FormWidget, OverlayWidget, PolicyManagementConstants, FirewallRuleAnalysisConf,
               ProgressBarForm) {
        var FirewallRuleWizardRuleAnalysisView = Backbone.View.extend({
            events:{
                 "click #btnRunAnalysis": "runRuleAnalysis"
            },
            
            initialize: function(){
                 this.context = this.options.context;
                 this.policyObj = this.options.policyObj;
                 this.model = this.options.model;
                 this.cuid = this.options.cuid;

                 this.formConfiguration = new FirewallRuleAnalysisConf(this.context);
                 self = this;
            },

            render: function(){
                var self = this;
                           
                this.form = new FormWidget({
                    "elements": self.formConfiguration.getElements(),
                    "container": this.el
                });

                this.form.build();

                this.$el.addClass("security-management");

                if (this.model.get("run-analysis")) {
                    $(this.$el.find("#perform_analysis")).prop("checked", true);
                }

                $(this.$el.find("#perform_analysis")).parent().width(500);

                return this;
            },

            beforePageChange : function(currentStep, requestedStep) {
             
                if (this.$el.find("#perform_analysis").is(":checked")) {
                    this.model.set("run-analysis", true);
                } else {
                    this.model.set("run-analysis", false);
                }
               
                return true;
            },

            getSummary: function() {
                var summary = [],
                    self = this;

                summary.push({
                    label: self.context.getMessage('rule_analysis'),
                    value: ' '
                });
                
                return summary;
            },

            getTitle: function () {
                return this.context.getMessage('auto_rule_placement');
            }

        });
        return FirewallRuleWizardRuleAnalysisView;

    });
