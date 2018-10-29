/*
 Firewall rule grid controller
 */
define([
  'widgets/overlay/overlayWidget',
 '../../../../../base-policy-management/js/policy-management/rules/controller/baseRuleController.js',
  '../constants/fwRuleGridConstants.js',
  '../../../../../base-policy-management/js/policy-management/rules/models/zonesCollection.js',
  '../models/fwRuleCollection.js',
  '../views/fwRulesView.js',
  '../views/fwRuleCreateWizard.js',
  '../views/fwRuleGridVPNTunnelsView.js',
  '../../../../../ui-common/js/common/utils/SmUtil.js'
],function(OverlayWidget, BaseController, PolicyManagementConstants, ZonesCollection, RuleCollection,
           FirewallRulesView, RuleWizard, RuleGridVPNTunnelView, SmUtil){

  var FirewallRulesController = function(options) {
    var me = this,
        fwRulesView = options.rulesView || FirewallRulesView;
    me.activity = options;
    me.setContext(options);
    me.initialize(PolicyManagementConstants, RuleCollection, fwRulesView);
    me.reloadHitDone = false;
  };

  _.extend(FirewallRulesController.prototype, BaseController.prototype, {

    //Enable lock manager for the Rule grid
    ENABLE_LOCKING: true,

    initialize: function(PolicyManagementConstants, RuleCollection, RulesView) {
        var me = this, policy = me.policyObj,  policyID = policy.id;
        BaseController.prototype.initialize.apply(this, arguments);
    },

    getObjectsViewData : function () {
      var retArr = [], smUtil = new SmUtil();
      if(smUtil.checkPermission(PolicyManagementConstants.MANAGE_ADDRESS_CAPABILITY)) {
        retArr.push(PolicyManagementConstants.ADDRESS_GRID_VIEW_DATA);
      }
      if(smUtil.checkPermission(PolicyManagementConstants.MANAGE_SERVICE_CAPABILITY)) {
        retArr.push(PolicyManagementConstants.SERVICE_GRID_VIEW_DATA);
      }
      return retArr;
    },

    handleFetchComplete: function(collection, response, options) {
        BaseController.prototype.handleFetchComplete.apply(this, arguments);
        if (!this.reloadHitDone) {
            this.ruleCollection.reloadHitCount();
            this.reloadHitDone = true;
        }
        if(this.launchWizard === "true"){
            console.log("launch wizard");
            this.createRuleHandler();
            this.launchWizard = "false";
        }
    },

    /**
     * @override
     *
     * Overriding to reset hit count after discard changes are done.
     *
     * @param response
     * @param status
     */
    afterResetStoreOnDiscard: function(response,status) {
      this.reloadHitDone = false;
      BaseController.prototype.afterResetStoreOnDiscard.apply(this, arguments);
    },

    handleRowDataEdit :function(editModeRow){
        BaseController.prototype.handleRowDataEdit.apply(this, [editModeRow]);

        // PR 1102918 - Prevent display of the Advanced Security overlay when transitioning from View mode to Edit mode for the row
        if(editModeRow.currentRowData !== undefined){
            if (editModeRow.currentRowData.action === 'DENY' || editModeRow.currentRowData.action === 'REJECT') {
                $(editModeRow.currentRowFields["ips-enabled"]).find(".cellOverlayView").addClass("disabled");
            }else if(editModeRow.currentRowData.action === 'PERMIT') //PR 1145159- Adv security not editable before save after changing the action to permit
            {
                $(editModeRow.currentRowFields["ips-enabled"]).find(".cellOverlayView").removeClass("disabled");
            }
        }

        var self=this;
        if(editModeRow.currentRowData !== undefined){
            var currentRule = self.ruleCollection.get(editModeRow.currentRowData[PolicyManagementConstants.JSON_ID]);
            self.checkAction.apply(self,[editModeRow,currentRule]);
            self.formatAddressEditors.apply(self,[editModeRow,currentRule]);
        }
    },

    //the data in the address editors has to be formatted to show strike through for excluded addresses
    formatAddressEditors :function(editRow,currentRule){
         var srcAddressField = editRow.currentRowFields["source-address.addresses.address-reference"];
         var dstnAddressField = editRow.currentRowFields["destination-address.addresses.address-reference"];
         var srcExcluded = currentRule.get("source-address")["exclude-list"];
         var dstnExcluded = currentRule.get("destination-address")["exclude-list"];
         if(srcExcluded === true){
            $(srcAddressField).addClass('lineThrough');
         }

         if(dstnExcluded === true){
            $(dstnAddressField).addClass('lineThrough');
         }
    },

    /*
    * handler for after the rule creation
    * calls the destroy on wizard and the newly created row highlight
    */
    handleAfterCreateRule: function(data){
        var self = this;
        if(self.overlay){
            self.overlay.destroy();
        }
        BaseController.prototype.handleAfterCreateRule.apply(this, [data]);

    },

    /*
     Handler for creating the rule
     Launches the rule creation wizard
     */
    createRuleHandler: function(){
      var self = this;
      var view = new RuleWizard({
        context: self.context,
        parentView: self.view,
        policyObj: self.policyObj,
        cuid: self.cuid,
        ruleCollection: self.ruleCollection
      });
      self.overlay = new OverlayWidget({
        view: view,
        type: 'large',
        showScrollbar: true
      });

      self.overlay.build();
    },

    checkAction: function(editRow, currentRule) {
        console.log("in checkAction");
        var self = this, selectedAction = "";
        this.actionEditor = this.view.fwRuleGridConf.actionEditor;


        if(!$.isEmptyObject(currentRule)){
          selectedAction = currentRule.get("action");
        }

        //this.actionEditor.setValue(selectedAction);

        // console.log("currentRule action: " + selectedAction);
        // console.log("editor action: " + this.actionEditor.getValue());

        var currentActionField = editRow.currentRowFields["action"];

        // checking for action value to disable advanced security accordingly
        // (if action is Deny or Reject, disable Advanced Security)
        if (selectedAction == "DENY" || selectedAction == "deny" || selectedAction == "REJECT" || selectedAction == "reject") {
             $(editRow.currentRowFields["ips-enabled"].childNodes[0]).attr('disabled', true);
             $(editRow.currentRowFields["ips-enabled"]).find(".cellOverlayView").addClass("disabled");
        } else if (selectedAction == "PERMIT" ||  selectedAction == "permit") {
             $(editRow.currentRowFields["ips-enabled"].childNodes[0]).attr('disabled', false);
             $(editRow.currentRowFields["ips-enabled"]).find(".cellOverlayView").removeClass("disabled");
        }

        // clear '-' in edit mode

        if ($(editRow.currentRowFields["ips-enabled"].childNodes[0]).val().indexOf('<span') >= 0)
            $(editRow.currentRowFields["ips-enabled"].childNodes[0]).val("");

        if ($(editRow.currentRowFields["scheduler"].childNodes[0]).val().indexOf('<span') >= 0)
            $(editRow.currentRowFields["scheduler"].childNodes[0]).val("");

        $(editRow.currentRowFields["description"]).val(editRow.currentRowData.description);
        
        var $actionEditorContainer = this.actionEditor.conf.$container;
        $actionEditorContainer.off("change");
        $actionEditorContainer.on("change", $.proxy(self.onActionChange, self, currentRule));

    },

   onActionChange : function(currentRule) {    
      var self =this;

      var selectedAction = this.actionEditor.conf.$container[0].value;
            console.log("in action dropdown handler : " + selectedAction);

            if (selectedAction === "TUNNEL") {
                if (!self.tOverlay) {
                  console.log("creating new vpnTunnelOverlay");
                   
                  var vpnTunnelView = new RuleGridVPNTunnelView({
                    'close': function (e) {
                      //set the action to the value in the model
                      //when user does cancel on vpntunnel then the value will be reset to old value
                      self.actionEditor.setValue(currentRule.get("action"));
                      vpnTunnelOverlay.destroy();
                      self.tOverlay = null;
                      e && e.preventDefault();
                    },
                    'policyId': self.ruleCollection.policyID,
                    'context': self.context,
                    'ruleCollection': self.ruleCollection,
                    "model": currentRule
                  }),
                  vpnTunnelOverlay = new OverlayWidget({
                    view: vpnTunnelView,
                    type: 'medium',
                    showScrollbar: true
                  });
                 
                  vpnTunnelOverlay.build();
                  self.tOverlay = vpnTunnelOverlay;
                }
            } else if (selectedAction === "DENY" || selectedAction === "REJECT") {
                // reset advanced settings
                currentRule.set("action", selectedAction);
                currentRule.set("ips-enabled", false);
                currentRule.set("utm-policy", {});
                currentRule.set("ssl-forward-proxy-profile", {});
                currentRule.set("threat-policy", {});
                currentRule.set("app-fw-policy", {});
                self.ruleCollection.modifyRule(currentRule);
            } else {
                //set the actions in the model only when it is not tunnel
                //action will be set to tunnel in model when the user selects the tunnel in the overlay
                currentRule.set("action", selectedAction);
                self.ruleCollection.modifyRule(currentRule);
            }
    }
    
  });

  return FirewallRulesController;
});