define(["backbone", 
		"../service/blockService.js",
		//"../../../../fw-policy-management/js/firewall/rules/controller/fwRulesController.js",
		"../controller/blockRuleController.js",
		"./blockFWRulesView.js",
		"../../../../../base-policy-management/js/policy-management/rules/util/ruleGridConstants.js"
		],
	function(Backbone, 
			 BlockService,
			 FWRulesController,
			 BlockFWRulesView,
			 PolicyManagementConstants){
	var _fwRuleController,
		_isValid=true;
	var BlockSummaryView = Backbone.View.extend({

		initialize: function(options){
			var me=this;
			me.options = options;
			me.service = new BlockService();
			//me.smUtil = new SMUtil();
			//me.cuid = Slipstream.SDK.Utils.url_safe_uuid();
		},
		render: function(){
			var me=this,
				confObject = {
					"context": me.options.context,
					"policyObj": me.options.policyObject,
					"launchWizard": false,
					"cuid": me.options.cuid,
					"customColumns": [],
					"rulesView": BlockFWRulesView
				};
			//
			var applySuccess,
				applyFailure,
				errorTemplateString,
				modifyRules= {
					"modify-rules":{}
				};
			//
			_isValid = true;
			//
			applySuccess = function(response){
				confObject["parentView"] = me;
				_fwRuleController = new FWRulesController(confObject);
				_fwRuleController.view["modify-rules"] = response["modify-rules"];
				var ruleGridView = _fwRuleController.view.render();
				me.$el.append(ruleGridView.el);
				me.$el.addClass("fw-policy-management");
				//me.$el.find(".rulegrid-div").css("display", "none")//as per the visual spec
			};
			//
			applyFailure = function(error){
				console.log(error);
				_isValid=false;
				//if(error.responseText === PolicyManagementConstants.POLICY_EDIT_LOCK_NOT_AVAILABLE){
					errorTemplateString = "<div style='height: 44px; width: 100%; border: 2px solid #eb2125; background-color: white; padding: 12px; color: #eb2125; font-size: 12px; font-weight: normal'>" + me.options.context.getMessage(error.responseText) + "</div>"
					me.$el.append(errorTemplateString);
		        //};
			};
			//
			if(me.options.ruleChangeList){
				modifyRules["modify-rules"] = me.options.ruleChangeList;
				me.applyChangeListToStore(me.options.policyObject.id, me.options.cuid, modifyRules, applySuccess, applyFailure);
				//				
			}else{
				_isValid = false;
				var lockMessage = "",
					appAccessDetails = me.options.policyObject["app-access-details"]["app-acceess-rule-details"]["application-access-details"][0];
				if(appAccessDetails["targets"]["target"] && appAccessDetails["targets"]["target"].length > 0){//specific targets block
					var targets = appAccessDetails["targets"]["target"];
					targets.forEach(function(item, index){
						lockMessage += index === 0 ? item : ", " + item;
					});
				}else{//application block
					var applications = appAccessDetails["applications"]["application"];
					applications.forEach(function(item, index){
						lockMessage += index === 0 ? item : ", " + item;
					});
				};
				//
				lockMessage = me.options.context.getMessage("block_summary_page_pending_changes", [lockMessage]);
				// 
				errorTemplateString = "<div style='height: 44px; width: 100%; border: 2px solid #eb2125; background-color: white; padding: 12px; color: #eb2125; font-size: 12px; font-weight: normal'>" + lockMessage + "</div>";
				me.$el.append(errorTemplateString);
			}
			//
			return me;
		},
		/**
		Applies the change list to the store
		*/
		applyChangeListToStore: function(id, cuid, modifyRules, applySuccess, applyFailure){
			var me=this;
			me.service.applyChangeListToStore(id, cuid, modifyRules, applySuccess, applyFailure);
		},
		/**
		returns the effective change list to be merged in the block application view and then finally save it
		*/
		getEffectiveRuleChangeList: function(onSuccess, onFailure){
			var me=this,
				errorMessage,
				errorTemplateString,
				failureCallBack,
				successCallBack;
			//
			failureCallBack = function(error){
                if (error && error.responseText) {
                    errorMessage = me.options.context.getMessage(error.responseText);
                    errorTemplateString = "<div style='height: 44px; width: 100%; border: 2px solid #eb2125; background-color: white; padding: 12px; color: #eb2125; font-size: 12px; font-weight: normal'>" + errorMessage + "</div>";
                    me.$el.append(errorTemplateString);
                }else{// no error so proceed to call the onFailure
                	onFailure(response);
                }
			};
			//
			successCallBack = function(response){
                if (response && response.responseText) {
                    errorMessage = me.options.context.getMessage(response.responseText);
                    errorTemplateString = "<div style='height: 44px; width: 100%; border: 2px solid #eb2125; background-color: white; padding: 12px; color: #eb2125; font-size: 12px; font-weight: normal'>" + errorMessage + "</div>";
                    me.$el.append(errorTemplateString);
                }else{// no error so proceed to call the onSuccess
                	onSuccess(response);
                }
			};
			//
			me.service.getEffectiveChangeList(me.options.policyObject.id, me.options.cuid, successCallBack, failureCallBack);
		},
		/**
		*Called when the view is closed either by escape button, cancel click or ok click
		*/
		close: function(){
			_fwRuleController && _fwRuleController.view && _fwRuleController.view.close();
			_fwRuleController = null;
		},
		/**
		*Incase summaryPage is used as an overlay, call the client method - closeOverLay().
		*Client must close the overlay
		*/
		closeOverLay: function(){
			var me=this;
			me.options.closeOverLay && me.options.closeOverLay();
		},
		/**
		*Validation for Submit/Accept button
		*/
		isValid: function(){
			return _isValid;
		}
	});

	return BlockSummaryView;
});