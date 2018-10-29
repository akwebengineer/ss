/**
 * Firewall rule wizard source address Editor view
 *
 * @module fwRuleWizardSourceAddressEditorView unit test
 * @author vinayms
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    '../../../../../fw-policy-management/js/firewall/rules/views/fwRuleWizardSourceAddressEditorView.js',
    '../../../../../fw-policy-management/js/firewall/rules/models/fwRuleModel.js'
],function(FwRuleWizardSourceAddressEditorView, RuleModel) {
    var fwRuleWizardSourceAddressEditorView,context = new Slipstream.SDK.ActivityContext();
    //executes once
    before(function () {
        var viewParams = {
            'policyObj': {},
            'save': {},
            'close': {},
            'context': context,
            'columnName': 'source-address.addresses.address-reference',
            "model" : new RuleModel()
        };
        fwRuleWizardSourceAddressEditorView = new FwRuleWizardSourceAddressEditorView(viewParams);
    });

    after(function () {
    });

    describe("RW Rule create source editor view tests", function () {

        describe("FW rule Create source editor view initialize check", function () {
            var closeOverlay;
            beforeEach(function () {
                closeOverlay = sinon.stub(fwRuleWizardSourceAddressEditorView, 'closeOverlay', function(){
                    return true;
                });
            });

            afterEach(function () {
                closeOverlay.restore();
            });
            it("edit completed check", function () {
                fwRuleWizardSourceAddressEditorView.editCompleted();
                closeOverlay.called.should.be.equal(true);
            });

        });
    });
});
