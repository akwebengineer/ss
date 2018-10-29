define(["../../views/blockFWRulesView.js", 
		"../../../rules/models/fwRuleCollection.js",
		"../../../rules/constants/fwRuleGridConstants.js"], function(BlockFWRuleView, FWRuleCollection, RuleGridConstants){
	describe("Block Summary Page Rules View", function(){
	    var view, 
	    	context, 
	    	activity, 
	    	CUID = "123Dummy", 
	    	initialInput = {}, 
	    	policy = {id: 123},
	    	ruleChangeList = {
	    		"modify-rules":{
	    			"added-rules": {
	    				"added-rule": []
	    			},
	    			"modified-rules": {
						"modified-rule": []
	    			},
	    			"deleted-rules": {
	    				"deleted-rule": []
	    			}
	    		}
	    	};
	    //
		before(function () {
			context = new Slipstream.SDK.ActivityContext();
			activity = new Slipstream.SDK.Activity();
            $.mockjax.clear();
            $.mockjax({
                url: '/api/juniper/sd/policy-management/firewall/policies/draft/rules/save-comments',
                type: 'GET',
                responseText: true
            });
            $.mockjax({
                url: '/api/juniper/sd/policy-management/firewall/policies/123/draft/rules/filter?*',
                type: 'POST',
                responseText: true
            });

			activity.cuid = 'CUID';
			activity.context = context;

			context.getMessage = function (key) {
				return key;
			};

			context.getHelpKey = function () {
			};

			context.startActivityForResult = function () {
			};
			//

			initialInput = {
		        context: context,
		        actionEvents: {},
		        ruleCollection: new FWRuleCollection(CUID, policy, context),
		        policyManagementConstants: RuleGridConstants,
		        cuid: CUID,
		        extras: {filter: 'filter'}				
			};
			
		});

		after(function () {
			$.mockjax.clear();
		});
		//
		describe("Summary view render test", function(){
			//
			var stub1, stub2, stub3;
			before(function(){			
                stub1 = sinon.stub(BlockFWRuleView.prototype, 'buildActionEvents');
                stub2 = sinon.stub(BlockFWRuleView.prototype, 'subscribeNotifications');
                stub3 = sinon.stub(BlockFWRuleView.prototype, 'handleNavigateAway');			
			});
			//
			it("Verify if the summary page is initialized and exists?", function(){
				view = new BlockFWRuleView(initialInput);
				view["modify-rules"] = ruleChangeList["modify-rules"];
				view.should.exist;
			});
			//
			it("Verify if the summary page is rendered?", function(){
                var stub, stub2, stub3, stub4, stub5, stub6, stub7;

                view.getContextMenu = function () {
                    return {getContextMenuItems: function () {
                        return [];
                    }}
                };

                stub = sinon.stub(view, 'appendCustomColumn');

                stub2 = sinon.stub(view, 'appendRulesGridTopSection');
                stub3 = sinon.stub(view, 'generateCellTooltips');
                stub4 = sinon.stub(view, 'hasRuleGridBottomSection', function () {
                    return true;
                });
                stub5 = sinon.stub(view, 'appendRulesGridBottomSection');
                stub6 = sinon.stub(view, 'createGrid');
                stub7 = sinon.stub(view, 'addCustomButtons');

                // storing preferences in cache
                var pref = Slipstream.SDK.Preferences;
                Slipstream.SDK.Preferences = null;

                view.render();

                // storing it back
                Slipstream.SDK.Preferences = pref;

                stub.called.should.be.equal(true);
                stub2.called.should.be.equal(true);
                stub3.called.should.be.equal(true);
                stub4.called.should.be.equal(true);
                stub5.called.should.be.equal(true);
                stub6.called.should.be.equal(true);

                stub.restore();
                stub2.restore();
                stub3.restore();
                stub4.restore();
                stub5.restore();
                stub6.restore();
                stub7.restore();
			});
			//
			it("Verify if Rule Grid Save button is hidden for summary page", function(){
				assert.isFalse(view.hasRuleGridSaveButton(), "Rule grid save button is hidden in summary page");
			});
			//
			it("Verify if Rule Grid Discard button is hidden for summary page", function(){
				assert.isFalse(view.hasRuleGridDiscardButton(), "Rule grid discard button is hidden in summary page");
			});
			//
			it("Verify if Rule Grid publish, update button is hidden for summary page", function(){
				assert.isFalse(view.hasRuleGridPublishUpdateButtons(), "Rule Grid publish, update button is hidden for summary page");
			});
			//
			it("Verify if Rule grid action buttons are hidden for summary page", function(){
				assert.isFalse(view.hasRuleGridActionButtons(), "Rule grid action buttons are hidden for summary page");
			});
			//	
			it("Verify if Navigation buttons are shown only for summary page", function(){
				assert.isTrue(view.hasNavigationActionButtons(), "Navigation buttons are shown only for summary page");
			});
			//								
			after(function(){
                stub1.restore();
                stub2.restore();
                stub3.restore();
                $.mockjax.clear();
			});
		});
	});
});