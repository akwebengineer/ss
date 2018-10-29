/**
 * Firewall Rule Wizard destination address editor view
 *
 * @module FirewallRuleWizardDestinationAddressEditorView
 * @author Omega Developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../base-policy-management/js/policy-management/rules/views/ruleGridDestinationAddressEditorView.js'
], function (AddressEditorView) {
    var WizardDestinationAddressEditorView = AddressEditorView.extend({
        editCompleted :function(e, model){
            // close editor overlay
            this.closeOverlay(e);
        }
    });

    return WizardDestinationAddressEditorView;
});
