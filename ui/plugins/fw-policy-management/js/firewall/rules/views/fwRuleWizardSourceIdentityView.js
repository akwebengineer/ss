/**
 * Firewall rule wizard source identity view
 *
 * @module FirewallWizardSourceIdentityView
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    './fwRuleSourceIdentityEditorView.js'
], function (SourceIdentityEditorView) {
    var WizardSourceIdentityView = SourceIdentityEditorView.extend({
        editCompleted :function(e, model){
            this.closeOverlay(e);
        }
    });

    return WizardSourceIdentityView;
});
