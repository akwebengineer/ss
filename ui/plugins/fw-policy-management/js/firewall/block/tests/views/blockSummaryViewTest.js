define([], function(){
	describe("Block Summary View UT", function(){
		var stubs = {
		"/installed_plugins/fw-policy-management/js/firewall/block/views/blockFWRulesView.js": function () {
		  this.subscribeNotifications = function () {
		    console.log("subscribeNotifications mock");
		  };
		}, 
		"/installed_plugins/fw-policy-management/js/firewall/block/controller/blockRuleController.js": function(options){
			this.view = new Backbone.View();
			this.view.close = function(){
				console.log("summary view closed");
			}
		}};
		//Note after create in the end call deleteContext to delete the created context
		var context = createContext(stubs, "blockSummaryViewName");

		context(["/installed_plugins/fw-policy-management/js/firewall/block/views/blockSummaryView.js"], function(
					BlockSummaryView){
			describe("Block Summary View UT", function(){
				var blockSummaryView,
					context,
					activity,
					CUID = "123Dummy",
					initialInput={},
					policyObject = {"id": 123},
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

		            $.mockjax({
		                url: "/api/juniper/sd/policy-management/firewall/policies/draft/rules/save-comments",
		                type: 'GET',
		                responseText: true
		            });

		            $.mockjax({
		                url: "/api/juniper/sd/policy-management/firewall/policies/" + policyObject["id"] + "/draft/effective-changelist?cuid=" + CUID,
		                type: 'GET',
		                responseText: true
		            });
					activity.cuid = CUID;
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
				        "context": context,
				        "policyObject": policyObject,
				        "cuid": CUID,
				        "ruleChangeList": ruleChangeList["modify-rules"]
					};
					//
				});
				//
				after(function () {
					$.mockjax.clear();
				});
				//
				describe("Summary view initialization and render tests", function(){
					before(function(){
						$.mockjax({
							url: "/api/juniper/sd/policy-management/firewall/policies/" + policyObject["id"] + "/draft/apply-changelist?cuid=" + CUID,
							type: 'POST',
							status: 200,
							responseText: {
								"modify-rules": {}
							}
						});
					});
					//
					after(function(){
						$.mockjax.clear();
					});
					//
					var stub;
					it("Verify if summary view is initialized", function(){	
						blockSummaryView = new BlockSummaryView(initialInput);
						blockSummaryView.should.exist;
					});
					//
					it("Verify if summary view is rendered", function(){
						stub = sinon.stub(blockSummaryView, "applyChangeListToStore", function(id, cuid, modifyRules, applySuccess, applyFailure){
							console.log("applyChangeListToStore success stubbed");
							applySuccess({
			                	"modify-rules": {}
			                });
						});
						blockSummaryView.render();
						stub.restore();
					});
					//
					it("Verify if summary view is rendered for failure case", function(){
						stub = sinon.stub(blockSummaryView, "applyChangeListToStore", function(id, cuid, modifyRules, applySuccess, applyFailure){
							console.log("applyChangeListToStore failure stubbed");
							applyFailure({
			                	responseText:"POLICY_EDIT_LOCK_NOT_AVAILABLE"
			                });
						});
						blockSummaryView.render();
						stub.restore();
					});
					//
					it("Verify if applyChangeListToStore is called", function(){
						blockSummaryView.applyChangeListToStore(policyObject["id"], CUID);
					});
					//
					it("Verify if summary view is rendered if target source is blocked", function(){
						blockSummaryView.options["ruleChangeList"] = undefined;
						blockSummaryView.options["policyObject"] = {
							"app-access-details":{
								"app-acceess-rule-details":{
									"application-access-details":[
										{
											"targets":{
												"target":[
												"1.1.1.1"
												]
											}
										}
									]
								}
							}
						};
						blockSummaryView.render();
					});
					//
					it("Verify if summary view is rendered if target application is blocked", function(){
						blockSummaryView.options["ruleChangeList"] = undefined;
						blockSummaryView.options["policyObject"] = {
							"app-access-details":{
								"app-acceess-rule-details":{
									"application-access-details":[
										{
											"applications":{
												"application":[
													"FLIPKART"
												]
											},
											"targets":{
												"target":[]
											}
										}
									]
								}
							}
						};
						blockSummaryView.render();
					});
					//
					it("Verify if summary view effective rule change list is invoked", function(){
						blockSummaryView.getEffectiveRuleChangeList();
					})
					//
					it("Verify block summary view close is called", function(){
						blockSummaryView.close();
					})

					it("Verify block summary view isValid is called", function(){
						blockSummaryView.isValid();
					})
				});
				//This is to avoid memory leak and runtime slowness
      			deleteContext('blockSummaryViewName');
			});
			//mocha.run();
		});
	});
});