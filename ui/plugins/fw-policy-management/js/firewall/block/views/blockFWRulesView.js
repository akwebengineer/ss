/**
BlockFWRulesView extends the FWRulesView
Used in Summary Page in block workflow
*/
define(["../../rules/views/fwRulesView.js",
		//"../conf/blockFWRuleGridConfiguration.js",//reqrired to set the flag showNavigationControls
		"../../rules/conf/fwRulesGridConfiguration.js",
		"text!../templates/summaryPageTemplate.html",
		"lib/template_renderer/template_renderer",
		'../../../../../ui-common/js/common/utils/SmUtil.js'], function(FWRulesView, BlockFWRuleGridConf, SummaryPageTemplate, TemplateRenderer, SMUtil){
	var BlockFWRulesView = FWRulesView.extend({
		/**
		* Returns true if the Rules ILP has context menu.
		* @returns {boolean}
		*/
		hasRuleGridContextMenu: function(){
			return false;
		},
		/**
		* overriding base class function
		* @returns {boolean}
		*/
		hasRuleGridSaveButton: function(){
			return false;
		},
		/**
		* overriding base class function
		* @returns {boolean}
		*/
		hasRuleGridDiscardButton: function(){
			return false;
		},
		/**
		* overriding base class function
		* @returns {boolean}
		*/
		hasRuleGridPublishUpdateButtons: function(){
			return false;
		},
       /**
        * Returns true if the Rules ILP has action buttons.
        * Sub classes can override if actions buttons are to be hidden
        * @returns {boolean}
        */
		hasRuleGridActionButtons: function(){
			return false;
		},

		hasNavigationActionButtons: function(){
			return true;
		},
		/**
		gets the base rule grid config and adds the navigation controls.
		*/
		getRuleGridConfiguration: function(){
			var me = this,
				smUtil = new SMUtil(),
				configuration;
			me.fwRuleGridConf = new BlockFWRuleGridConf(me.context, me.ruleCollection, me.policyManagementConstants, me.policyObj);
			me.fwRuleGridConf["showNavigationControls"] = true;
			configuration = me.fwRuleGridConf.getConfiguration();
			//gridWidget documentation insists to provide a fixed height in case of grid inside an overlay
			configuration["height"] = smUtil.calculateGridHeightForOverlay(180);
			return configuration;
		},
		//
		buildSummaryPageHeader: function(){
			var me=this,
				summaryPage;
			//
			summaryPage = TemplateRenderer(SummaryPageTemplate, {
				"rules-added": me["modify-rules"]["added-rules"]["added-rule"].length + " Rules Added",
				"rules-modified": me["modify-rules"]["modified-rules"]["modified-rule"].length + " Rules modified",
				"rules-deleted": me["modify-rules"]["deleted-rules"]["deleted-rule"].length + " Rules Deleted"
			});
			//
			me.$el.prepend(summaryPage);
		},
		//
		render: function(){
			var me = FWRulesView.prototype.render.call(this);
			me.buildSummaryPageHeader();
			return me;
		}
	});
	return BlockFWRulesView;
});