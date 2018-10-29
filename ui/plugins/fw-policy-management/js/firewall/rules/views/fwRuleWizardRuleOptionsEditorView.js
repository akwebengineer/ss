/**
 * Firewall rule wizard rule options editor view
 *
 * @module FirewallWizardRuleOptionsEditorView
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    './fwRuleOptionsEditorView.js',
    '../conf/fwRuleWizardOptionsConfig.js'
], function (RuleOptionsEditorView, FWRuleWizardOptionsConf) {

    var WizardRuleOptionsEditorView = RuleOptionsEditorView.extend({
           
        setFormConfiguration: function() {
            this.formConfiguration = new FWRuleWizardOptionsConf(this.context);
        }, 

        beforePageChange : function(currentStep, requestedStep) {
            this.updateProfileValuesOnView();
            return true;
        },

        editCompleted :function(e, model){
            this.closeOverlay(e);
        },

        closeOverlay: function (e) {
        },

        getTitle: function () {
            return this.context.getMessage('rule_options');
        },

        getSummary: function() {
            var summary = [];
            var self = this;

            summary.push({
                label: self.context.getMessage('rule_options'),
                value: ' '
            });
            

            var profileType = self.model.get("rule-profile")["profile-type"],
                profileTxt = "";

            if (profileType === "") { 
                profileTxt = "None";
            } else if (profileType === "INHERITED") {
                profileTxt = "Inherited from policy";
            } else if (profileType === "USER_DEFINED") {
                profileTxt = self.model.get("rule-profile").name;
            } else if (profileType === "CUSTOM"){
                profileTxt = "Custom";
            }

            summary.push({
                label: self.context.getMessage('profile'),
                value: profileTxt
            });

                   
            summary.push({
                label: self.context.getMessage('scheduler'),
                value: self.model.get("scheduler") ? self.model.get("scheduler")["name"] : ""
            });
            return summary;
        },

        closeProfileOverlay : function (columnName, e) {
            this.profileOverlay.destroy();
            e && e.preventDefault();
        }
    });

    return WizardRuleOptionsEditorView;
});
