/**
 * Firewall wizard service editor view
 *
 * @module fwWizardServiceEditorView
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../base-policy-management/js/policy-management/rules/views/ruleGridServiceEditorView.js'
], function (ServiceEditorView) {
    var WizardServiceEditorView = ServiceEditorView.extend({
        editCompleted :function(e, model){
            // close editor overlay
            this.closeOverlay(e);
        }
    });

    return WizardServiceEditorView;
});
