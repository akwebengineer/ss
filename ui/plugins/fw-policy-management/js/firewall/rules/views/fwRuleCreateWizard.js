    /**
    * Module that implements the FirewallRuleCreateWizardView.
    *
    * @module FirewallRuleCreateWizardView
    * @author Mamata Devabhaktuni<mdevabhaktuni@juniper.net>
    * @copyright Juniper Networks, Inc. 2015
    */

define([
    'backbone',
    'widgets/shortWizard/shortWizard',
    './fwRuleWizardGeneralView.js',
    './fwRuleWizardSourceView.js',
    './fwRuleWizardDestinationView.js',
    './fwRuleWizardAdvSecurityEditorView.js',
    './fwRuleWizardRuleAnalysisView.js',
    './fwRuleWizardRulePlacementView.js',
    './fwRuleWizardRuleOptionsEditorView.js'
    ], function(
        Backbone,
        ShortWizard,
        FirewallRuleGeneralView,
        FirewallRuleSourcePageView,
        FirewallRuleDestinationPageView,
        FirewallRuleAdvSecurityView,
        FirewallRuleWizardRuleAnalysisView,
        FirewallRuleWizardRulPlacementView,
        FWRuleWizardRuleOptionsEditorView) {

        var FirewallRuleCreateWizardView = Backbone.View.extend({

            initialize: function (options) {
                this.context = options.context;
                this.parentView = options.parentView;
                this.policyObj = options.policyObj;
                this.ruleCollection = options.ruleCollection;
                this.cuid = this.options.cuid;


                this.ruleCollection.getNewRule();

                var self = this, pages = new Array();
                this.ruleCollection.bind("newRuleFetched", function(model){
                    self.model = model;
                    var viewParams = {
                            context: self.context,
                            policyObj: self.policyObj,
                            model: self.model,
                            cuid: self.cuid
                        };

                    pages.push({
                        title: self.context.getMessage('general'),
                        view: new FirewallRuleGeneralView(viewParams)
                    });

                    pages.push({
                        title: self.context.getMessage('source'),
                        view: new FirewallRuleSourcePageView(viewParams)
                    });

                    pages.push({
                        title: self.context.getMessage('destination'),
                        view: new FirewallRuleDestinationPageView(viewParams)
                    });

                    pages.push({
                        title: self.context.getMessage('advanced_security'),
                        view: new FirewallRuleAdvSecurityView(viewParams)
                    });

                    pages.push({
                        title: self.context.getMessage('rule_options'),
                        view: new FWRuleWizardRuleOptionsEditorView(viewParams)
                    });

                    pages.push({
                        title: self.context.getMessage('rule_analysis'),
                        view: new FirewallRuleWizardRuleAnalysisView(viewParams)
                    });

                    pages.push({
                        title: self.context.getMessage('rule_placement'),
                        view: new FirewallRuleWizardRulPlacementView(viewParams)
                    });

                    self.wizard = new ShortWizard({
                        container: self.el,
                        title: self.context.getMessage('fw_rule_wizard_title'),
                        titleHelp: {
                            "content": self.context.getMessage("fw_rule_create_wizard_tooltip"),
                            "ua-help-text": self.context.getMessage('more_link'),
                            "ua-help-identifier": self.context.getHelpKey("FIREWALL_POLICY_RULE_CREATING")
                        },
                        pages: pages,
                        save:  function(options) {
                            saveModel(options);
                        },
                        onCancel: _.bind(function() {
                            self.ruleCollection.trigger("closeRuleWizard");
                        }, self),
                        onDone: _.bind(function() {
                            self.ruleCollection.trigger("closeRuleWizard");
                        }, self)
                    });

                    self.wizard.build();
                });

                // Save model
                var saveModel = function(options) {
                    self.ruleCollection.saveNewRule(self.model.toJSON());
                };
                return this;
            }, //end of initialize
            render: function() {
                return this;
            }

        });

        return FirewallRuleCreateWizardView;
    });
