/*
 Nat rule grid controller
 */
define([
  '../../../../../base-policy-management/js/policy-management/rules/controller/baseRuleController.js',
  '../constants/natRuleGridConstants.js',
  '../models/natRuleCollection.js',
  '../views/natRulesView.js',
  '../../../../../ui-common/js/common/utils/SmUtil.js'
],function(BaseController, PolicyManagementConstants, RuleCollection,
          NatRulesView, SmUtil){

  var NatRuleController = function(options) {
    var me = this;
    me.activity = options;
    me.setContext(options);
    me.initialize(PolicyManagementConstants, RuleCollection, NatRulesView);
  };

  _.extend(NatRuleController.prototype, BaseController.prototype, {

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
      if(smUtil.checkPermission(PolicyManagementConstants.MANAGE_NAT_POOL_CAPABILITY)) {
        retArr.push(PolicyManagementConstants.NATPOOL_GRID_VIEW_DATA);
      }
      return retArr;
    },

    bindGridEvents: function () {
      var self = this;
      BaseController.prototype.bindGridEvents.apply(this);
      self.view.$el
      .bind(self.actionEvents.sourceRule.name, function (e, gridRowsObject) {
        console.log("Source rule");
        self.ruleCollection.addRule(null,PolicyManagementConstants.DIRECTION_MAP.MOVE_RULE_DOWN,PolicyManagementConstants.NAT_TYPE_SOURCE);
      })
      .bind(self.actionEvents.staticRule.name, function (e, gridRowsObject) {
        console.log("Static rule");
        self.ruleCollection.addRule(null,PolicyManagementConstants.DIRECTION_MAP.MOVE_RULE_DOWN,PolicyManagementConstants.NAT_TYPE_STATIC);
      })
      .bind(self.actionEvents.destinationRule.name, function (e, gridRowsObject) {
        console.log("Destination rule");
        self.ruleCollection.addRule(null,PolicyManagementConstants.DIRECTION_MAP.MOVE_RULE_DOWN,PolicyManagementConstants.NAT_TYPE_DESTINATION);
      });
    },

    //Handler for create rule
    createRuleHandler: function() {
      this.ruleCollection.addRule(null,PolicyManagementConstants.DIRECTION_MAP.MOVE_RULE_DOWN,PolicyManagementConstants.NAT_TYPE_SOURCE);
    },

    handleRowDataEdit :function(editModeRow){
      BaseController.prototype.handleRowDataEdit.apply(this, [editModeRow]);
      var self=this;
      if(editModeRow.currentRowData !== undefined){
        var currentRule = self.ruleCollection.get(editModeRow.currentRowData[PolicyManagementConstants.JSON_ID]);
        self.checkEditors(editModeRow,currentRule);
      }
    },

    checkAction: function(editRow, currentRule) {},

    checkEditors : function(editRow, currentRule) {
       var self = this, natType = "";

       if(!$.isEmptyObject(currentRule)){
          natType = currentRule.get("nat-type");
        }
        //Removing Not applicable editors
        this.removeNotApplicableEditors(natType, editRow);

        //Services and Protocols/Ports can't be configured together.
        this.validateServicesProtocolsPortsEditors(currentRule, natType, editRow);     
    },

    removeNotApplicableEditors : function(natType,editRow) {
      var self = this;
      switch(natType) {
        case "SOURCE" :       self.removeEditor(editRow,"translated-packet.pool-addresses");
                              break;
        case "DESTINATION" :  self.removeEditor(editRow,"translated-packet.translated-address");
                              self.removeEditor(editRow,"original-packet.src-ports");
                              self.removeEditor(editRow,"original-packet.dst-traffic-match-value.dst-traffic-match-value");
                              break;
        case "STATIC"      :  self.removeEditor(editRow,"translated-packet.translated-address");
                              self.removeEditor(editRow,"services.service-reference");
                              self.removeEditor(editRow,"original-packet.protocol.protocol-data");
                              self.removeEditor(editRow,"original-packet.dst-traffic-match-value.dst-traffic-match-value");
                              break;                    
      }
    },

    validateServicesProtocolsPortsEditors : function(currentRule, natType, editRow) {
        var originalPkt = currentRule.get('original-packet'),
            protocolData = originalPkt['protocol']['protocol-data'],
            srcPortSets = originalPkt['src-port-sets']['reference'],
            dstPortSets = originalPkt['dst-port-sets']['reference'],
            srcPorts = originalPkt['src-ports'],
            dstPorts = originalPkt['dst-ports'],
            services = currentRule.get('services')['service-reference'],
            errorMsg = this.context.getMessage("nat_rulegrid_service_protocol_ports_validation");

        //For source & Destination NAT Rules, Service Editor is disabled when protocols and ports are configured.
        var isEmptyServices = _.isEmpty(services);
        if(natType !== "STATIC") {
          if ( isEmptyServices && 
              (!_.isEmpty(protocolData) || 
               !_.isEmpty(srcPortSets) ||
               !_.isEmpty(dstPortSets) || 
               !_.isEmpty(srcPorts) ||
               !_.isEmpty(dstPorts))) {
            this.disableEditor(editRow, "services.service-reference", errorMsg);
          }
          else {
            this.enableEditor(editRow, "services.service-reference");
          }
        }

        //When Service is configured, Protocols and Src/Dest Ports should not be allowed for applicable editors.
        if (!isEmptyServices) {
          this.disableEditor(editRow, "original-packet.dst-ports",errorMsg);           
          if(natType !== "DESTINATION") {     
             this.disableEditor(editRow, "original-packet.src-ports",errorMsg); 
          }    
          if(natType !== "STATIC") {
             this.disableEditor(editRow, "original-packet.protocol.protocol-data",errorMsg); 
          }   
        }
        else {
          this.enableEditor(editRow, "original-packet.dst-ports");
          if(natType !== "DESTINATION") {
            this.enableEditor(editRow, "original-packet.src-ports");
          }  
          if(natType !== "STATIC") {
            this.enableEditor(editRow, "original-packet.protocol.protocol-data");
          }  
        }
    },

    disableEditor : function(editRow, keyValue, errorMsg) {
      //Validation Error shown in the column renderers of the editors    
      var notAllowedCellData = "<span class='nat-disabled' style= 'word-wrap:break-word;white-space:pre-wrap;'>" + errorMsg + "</span>";     
      var rowField = editRow.currentRowFields,
          editorCell = $(rowField[keyValue]).closest('td');

      $(rowField[keyValue].childNodes[0]).addClass('disabled');
      editorCell.find("span.editable").hide();
      editorCell.append(notAllowedCellData);
    },

    enableEditor : function(editRow, keyValue) {
      var rowField = editRow.currentRowFields,
          editorCell = $(rowField[keyValue]).closest('td');

      $(rowField[keyValue].childNodes[0]).removeClass('disabled');
      editorCell.find("span.editable").show();
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
    }

  });
  return NatRuleController;
});