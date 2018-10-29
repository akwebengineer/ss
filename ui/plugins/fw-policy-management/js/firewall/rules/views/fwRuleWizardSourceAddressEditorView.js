/**
 * Firewall rule wizard source address editor view
 *
 * @module FirewallWizardSourceAddressEditorView
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../base-policy-management/js/policy-management/rules/views/ruleGridSourceAddressEditorView.js'
], function (AddressEditorView) {
    var WizardSourceAddressEditorView = AddressEditorView.extend({
        editCompleted :function(e, model){
            // close editor overlay
            this.closeOverlay(e);
        }
    });

    return WizardSourceAddressEditorView;
});
