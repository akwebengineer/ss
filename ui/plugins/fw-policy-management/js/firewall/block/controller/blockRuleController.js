/**
 * Controller for Summary page in Block Workflow
 * @module BlockFWRulesController extends FWRulesController
 * @author Dharma <adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
*/
define(["../../rules/controller/fwRulesController.js"], function(FWRulesController){
	//call the super constructor function
	var BlockFWRulesController = function(options){
		var me=this;
		//set the flag to show the navigation controls
		options.showNavigationControls = true;
        //disable drag n drop feature
        this.getObjectsViewData = function () {
          return [];
        };
        /*Override to suppress the policy re-direct when policy is deleted*/
        this.policyModifiedHandler = function(newPolicyObj){
        	var me=this,
        		conf={},
        		policyName = me.ruleCollection.policy.name;
        	//
        	if(newPolicyObj === undefined){
              //give a message that policy is deleted and close the view
              conf = {
                  title: "Error",
                  question: "The policy " + '\"' + policyName + '\" is deleted. Closing the Policy Preview Changes overlay.',
                  yesButtonLabel: me.view.context.getMessage('ok'),
                  yesButtonTrigger:'yesEventTriggered',
                  kind: 'error'
              };
              me.createConfirmationDialog(conf, function() {
                options.parentView && options.parentView.closeOverLay();
              });
        	}else{//otherwise proceed with the default implementation
        		FWRulesController.prototype.policyModifiedHandler.apply(me, [newPolicyObj]);
        	};
        	//
        };
		//call the super constructor function
		FWRulesController.call(me, options);
	};
 	_.extend(BlockFWRulesController.prototype, FWRulesController.prototype, {});
	return BlockFWRulesController;
});