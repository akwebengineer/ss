
/**
 * Firewall rule wizard Options editor view
 *
 * @module fwRuleWizardRuleOptionsEditorView unit test
 * @author vinayms
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    '../../../../../fw-policy-management/js/firewall/rules/views/fwRulesPlacementView.js',
    '../../../../../fw-policy-management/js/firewall/rules/models/fwRuleModel.js',
    '../constants/fwRuleGridConstants.js'
],function(FwRulesPlacementView, RuleModel, PolicyManagementConstants) {
    var fwRulesPlacementView,context = new Slipstream.SDK.ActivityContext();
    //executes once
    before(function () {
        var viewParams = {
            'policyManagementConstants': PolicyManagementConstants,
            'placementRules': [],
            'policyObj': {},
            'save': {},
            'close': {},
            'context': context,
            'columnName': 'destination-address.addresses.address-reference',
            "model" : new RuleModel({"scheduler": {name:"test"}, set: function(){},get: function(){}, clone: function(){}})
        };
        fwRulesPlacementView = new FwRulesPlacementView(viewParams);
    });

    after(function () {
    });

    describe("RW Rule create Placement view tests", function () {

        describe("FW rule Create Placement view initialize check", function () {

            it("initialize check", function () {
                fwRulesPlacementView.should.exist;
            });

        });
        /* describe("FW rule Create Placement view render check", function () {

         var find, addClass, addTreeViewRendering,when, formatRulesGrid;
         beforeEach(function () {
         find = sinon.stub(fwRulesPlacementView.$el, 'find', function(){
         return {attr: function(){}, addClass: function(){}};
         });
         when = sinon.stub($, 'when', function() {
         var response = {
         addRow: function () {}
         };
         return {
         done: function (options){options(response);}
         }
         });
         addClass = sinon.stub(fwRulesPlacementView.$el, 'addClass');
         addTreeViewRendering = sinon.stub(fwRulesPlacementView, 'addTreeViewRendering');
         formatRulesGrid = sinon.stub(fwRulesPlacementView, 'formatRulesGrid');
         });

         afterEach(function () {
         find.restore();
         when.restore();
         addClass.restore();
         addTreeViewRendering.restore();
         formatRulesGrid.restore();
         });
         it("render check", function () {
         fwRulesPlacementView.render();
         assert(find.calledWith("#firewallRuleGrid"));
         assert(find.calledWith("#firewallRulePlacementGrid #"));
         when.called.should.be.equal(true);
         assert(addClass.calledWith("security-management"));
         addTreeViewRendering.called.should.be.equal(true);
         formatRulesGrid.called.should.be.equal(true);
         });
         it("render check", function () {
         fwRulesPlacementView.options.placementRules = [{id: -1}];
         fwRulesPlacementView.render();
         assert(find.calledWith("#firewallRuleGrid"));
         assert(find.calledWith("#firewallRulePlacementGrid #-1"));
         when.called.should.be.equal(true);
         assert(addClass.calledWith("security-management"));
         addTreeViewRendering.called.should.be.equal(true);
         formatRulesGrid.called.should.be.equal(true);
         });

         });*/
        describe("FW rule Create Placement view getRuleGridConfiguration check", function () {

            var getRuleGridConfiguration;
            beforeEach(function () {
                getRuleGridConfiguration = sinon.stub(fwRulesPlacementView, 'getRuleGridConfiguration');
            });

            afterEach(function () {
                getRuleGridConfiguration.restore();
            });
            it("getRuleGridConfiguration check", function () {
                fwRulesPlacementView.getRuleGridConfiguration();
                getRuleGridConfiguration.called.should.be.equal(true);
            });

        });

        describe("FW rule Create Placement view getGridTable check", function () {

            var find;
            beforeEach(function () {
                find = sinon.stub(fwRulesPlacementView.$el, 'find');
            });

            afterEach(function () {
                find.restore();
            });
            it("getGridTable check", function () {
                fwRulesPlacementView.getGridTable();
                assert(find.calledWith("#firewallRulePlacementGrid"));
            });

        });

    });
});
