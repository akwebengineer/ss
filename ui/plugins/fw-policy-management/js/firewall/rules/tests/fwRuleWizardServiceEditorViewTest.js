
/**
 * Firewall rule wizard Options editor view
 *
 * @module fwRuleWizardRuleOptionsEditorView unit test
 * @author vinayms
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    '../../../../../fw-policy-management/js/firewall/rules/views/fwRuleWizardServiceEditorView.js',
    '../../../../../fw-policy-management/js/firewall/rules/models/fwRuleModel.js'
],function(FwRuleWizardServiceEditorView, RuleModel) {
    var fwRuleWizardServiceEditorView,context = new Slipstream.SDK.ActivityContext();
    //executes once
    before(function () {
        var viewParams = {
            'policyObj': {},
            'save': {},
            'close': {},
            'context': context,
            'columnName': 'destination-address.addresses.address-reference',
            "model" : new RuleModel()
        };
        fwRuleWizardServiceEditorView = new FwRuleWizardServiceEditorView(viewParams);
    });

    after(function () {
    });

    describe("RW Rule create Destination editor view tests", function () {

        describe("FW rule Create Destination editor view initialize check", function () {
            var closeOverlay;
            beforeEach(function () {
                closeOverlay = sinon.stub(fwRuleWizardServiceEditorView, 'closeOverlay', function(){
                    return true;
                });
            });

            afterEach(function () {
                closeOverlay.restore();
            });
            it("edit completed check", function () {
                fwRuleWizardServiceEditorView.editCompleted();
                closeOverlay.called.should.be.equal(true);
            });

        });
    });
});
