define(["../../controller/blockRuleController.js", 
		"../../views/blockFWRulesView.js"], function(BlockRuleController, BlockFWRulesView){
	//
	describe("Summary Block controller UT", function(){
		var controller, context, activity, policyObj = {"id": 123}, initialInput={}, CUID = "123Dummy", stub1, stub2, stub3;
		//
		before(function(){
			context = new Slipstream.SDK.ActivityContext();
			activity = new Slipstream.SDK.Activity();
			context.getMessage = function (key) {
				return key;
			};

			context.getHelpKey = function () {
			};

			context.startActivityForResult = function () {
			};
			//
			initialInput = {
				"context": context,
				"policyObj": policyObj,
				"launchWizard": false,
				"cuid": CUID,
				"customColumns": [],
				"rulesView": BlockFWRulesView
			};
			//
            $.mockjax({
                url: "/api/juniper/sd/policy-management/firewall/policies/draft/rules/save-comments",
                type: 'GET',
                responseText: true
            });//
            $.mockjax({
                url: "/api/juniper/sd/policy-management/firewall/policies/" + policyObj["id"] + "/draft/rules?paging=(start eq 0, limit eq 50)&cuid=" + CUID,
                type: 'GET',
                responseText: true
            });
            stub1 = sinon.stub(BlockRuleController.prototype, 'initialize');
            stub2 = sinon.stub(BlockRuleController.prototype, 'initializeLockManager');
		});
		//
		after(function(){
			$.mockjax.clear();
			stub1.restore();
			stub2.restore();
		});
		//
		it("Block rule controller initialization test", function(){
			controller = new BlockRuleController(initialInput);
			controller.should.exist;
		});

    it("Block rule controller getObjectsViewData test", function(){
      controller = new BlockRuleController(initialInput);
      controller.should.exist;
      var retVal = controller.getObjectsViewData();
      assert.deepEqual([], retVal);
    });
	});
	//
});