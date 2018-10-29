/*
 Firewall rule grid controller
 */
define([
  'widgets/overlay/overlayWidget',
 '../../../../../base-policy-management/js/policy-management/rules/controller/baseRuleController.js',
  '../constants/ipsRuleGridConstants.js',
  '../../../../../base-policy-management/js/policy-management/rules/models/zonesCollection.js',
  '../models/ipsRuleCollection.js',
  '../views/ipsRulesView.js',
  '../views/ipsRuleGridActionDiffServCodePointFormView.js',
  '../../policies/models/ipsPolicyModel.js',
  'widgets/confirmationDialog/confirmationDialogWidget'
  //,  '../../../../../objects-manager/js/objects/models/serviceCollection.js',
],function(OverlayWidget, BaseController, PolicyManagementConstants, ZonesCollection, RuleCollection,
           IPSRulesView/*,ServiceCollection*/,CodePointView,IPSPolicyModel,ConfirmationDialogWidget){

  var IPSRulesController = function(options) {
    var me = this;
    me.activity = options;
    me.setContext(options);
    me.policyModel = new IPSPolicyModel();
    me.initialize(PolicyManagementConstants, RuleCollection, IPSRulesView);
  }

  _.extend(IPSRulesController.prototype, BaseController.prototype, {
    //Enable lock manager for the Rule grid
    ENABLE_LOCKING: true,


    initialize: function(PolicyManagementConstants, RuleCollection, RulesView) {
      var me = this, policy = me.policyObj,  policyID = policy.id;
      BaseController.prototype.initialize.apply(this, arguments);
    },

    bindGridEvents: function () {
      var self = this;
      BaseController.prototype.bindGridEvents.apply(this);
     
      if (self.actionEvents.advancePolicy) {
          self.view.$el.bind(self.actionEvents.advancePolicy.name, function (e, gridRowsObject) {
              self.handlerForAdvanceButton();              
          });
      }
      
      self.view.$el
      .bind(self.actionEvents.ipsRule.name, function (e, gridRowsObject) {
//        console.log("IPS rule");
        self.ruleCollection.addRule(null,PolicyManagementConstants.DIRECTION_MAP.MOVE_RULE_DOWN,PolicyManagementConstants.IPS_TYPE_DEFAULT);
      })
      .bind(self.actionEvents.exemptRule.name, function (e, gridRowsObject) {
//        console.log("Exempt rule");
        self.ruleCollection.addRule(null,PolicyManagementConstants.DIRECTION_MAP.MOVE_RULE_DOWN,PolicyManagementConstants.IPS_TYPE_EXEMPT);
      });
    },

    handleRowDataEdit :function(editModeRow){
      BaseController.prototype.handleRowDataEdit.apply(this, [editModeRow]);

      var self=this;
      if(editModeRow.currentRowData !== undefined){
      var currentRule = self.ruleCollection.get(editModeRow.currentRowData[PolicyManagementConstants.JSON_ID]);
//            self.getZones.apply(self,[editModeRow, currentRule]);
      var ruleType = currentRule.get('ipsType');

      if(!_.isEmpty(ruleType) && ruleType.toLowerCase() === "ips"){
         self.checkAction.apply(self,[editModeRow,currentRule]);
      }      
        
            self.formatAddressEditors.apply(self,[editModeRow,currentRule]);
            self.checkEditors.apply(self,[editModeRow,currentRule]);
      }
    },

    handlerForAdvanceButton : function(){
        var self = this; 

        var cancelButtonCallback = function () {
            
            confirmationDialogWidget.destroy();
        };

        var OkButtonCallback = function () {
          
          self.policyModel.set('id', self.policyObj.id);
         
          self.policyModel.fetch({
              success: function (collection, response, options) {
                
                var currentPolicy = response;
                var policy = response['policy']
                policy['ips-policy-type'] = "IPSADVANCED";
                self.policyModel.save(policy, {
                    success: function (model, response, options) {
                       location.reload(true);
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        console.log("Failed to change policy type");
                    }
                });

              },
              error: function (collection, response, options) {
               
                  console.log('Ips Policy model not fetched');
              }
          });
      };

      var conf = {
          title: 'Warning', 
          question: this.context.getMessage('ips_policy_enable_edit_warning'),
          yesButtonLabel: 'Yes',
          yesButtonCallback: OkButtonCallback,
          noButtonLabel: 'Cancel',
          noButtonCallback: cancelButtonCallback,
          kind: 'warning'
      };
      var confirmationDialogWidget = new ConfirmationDialogWidget(conf);
     
      confirmationDialogWidget.build();
    },

    checkEditors : function(editRow, currentRule) {
       var self = this, ipsRuleType = "";

       if(!$.isEmptyObject(currentRule)){
          ipsRuleType = currentRule.get("ipsType");
        }
        
        if (ipsRuleType == PolicyManagementConstants.EXEMPT) {
             self.removeEditor(editRow,"services.service-reference");
             self.removeEditor(editRow,"notification");
             self.removeEditor(editRow,"ipaction");
             self.removeEditor(editRow,"additional");
             self.removeEditor(editRow,"action-data.action");
        }       
    },

    removeEditor : function(editRow,keyValue) {
      //get the data of the cell that needs to have editor removed
      //get the td of the cell whose editor needs to be removes.emty the contents of td and append the value of the cell which is span
        
        var editorCellData = editRow.currentRow[keyValue],
            editorCell = $(editRow.currentRowFields[keyValue]).closest('td');
              //span containing the text area has to be hidden.
            $(editRow.currentRowFields[keyValue].childNodes[0]).addClass('disabled');
            //removing the editor makes the grid loose focus and actions of the grid will not work on first click
            editorCell.find("span.editable").hide();
            //workaround because editorCellData doesn't return the text
            if(typeof editorCellData != "string") {
                editorCellData = "<span class='nat-disabled'>" + this.context.getMessage("nat_rulegrid_not_applicable") + "</span>";
            }
            editorCell.append(editorCellData);      
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
     Handler for creating the rule
     Launches the rule creation wizard
     */
    createRuleHandler: function() {  
     
      this.ruleCollection.addRule(null,PolicyManagementConstants.DIRECTION_MAP.MOVE_RULE_DOWN,PolicyManagementConstants.IPS_TYPE_DEFAULT);
    },

    checkAction: function(editRow, currentRule) {
        console.log("in checkAction");
        var self = this;
        this.actionEditor = this.view.ruleGrid.actionEditor;

        var $actionEditorContainer = this.actionEditor.conf.$container;
        $actionEditorContainer.off("change");
        $actionEditorContainer.on("change", $.proxy(self.onActionChange, self, currentRule));

    },

    onActionChange : function(currentRule) {      
      var self = this; 
            var selectedAction = this.actionEditor.conf.$container[0].value;
            if(selectedAction == 'class-of-service'){
                if(this.codeView == undefined){
                  this.codeView= new CodePointView({
                    parentInstance: self,
                    currentRule: currentRule,
                    context: self.activity.context,
                    selectedAction:selectedAction
                  });
                  self.Overlay = new OverlayWidget({
                        view: this.codeView,
                        type: 'small'
                   });           
                  self.Overlay.build();
                }
            }
             else{
                currentRule.set({"action-data":{"dscpcode" :0,"action":selectedAction}});
                self.ruleCollection.modifyRule(currentRule);   
             }         
        }


  });
  return IPSRulesController;
});