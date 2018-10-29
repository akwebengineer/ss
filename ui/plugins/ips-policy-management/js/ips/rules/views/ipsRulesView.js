/**
 * A view to manage ips policy rules
 *
 * @module RulesView
 * @author Mamata
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  '../../../../../base-policy-management/js/policy-management/rules/views/baseRulesView.js',
  '../conf/ipsRulesGridConfiguration.js',
  './ipsRuleGridSourceZoneEditorView.js',
  './ipsRulesGridSourceAddressEditorView.js',
  './ipsRuleGridDestinationZoneEditorView.js',
  './ipsRulesGridDestinationAddressEditorView.js',
  './ipsRuleGridServiceEditorView.js',
  './ruleGridNotificationEditorView.js',
  './ruleGridIPActionEditorView.js',
  './ruleGridAdditionalEditorView.js',
  '../conf/ipsRulesContextMenu.js',
  './ipsRuleGridSignatureEditorView.js',
  '../../../../../base-policy-management/js/policy-management/rules/views/ruleGridNameEditorView.js',
  '../../../../../base-policy-management/js/policy-management/rules/views/descriptionEditorView.js',
  './ipsRuleGridActionDiffServCodePointFormView.js',
  'widgets/overlay/overlayWidget',
  './ipsSignatureObjectTooltip.js'
], function (BaseRulesView, RuleGrid, SourceZoneEditorView, SourceAddressEditorView, DestinationZoneEditorView, 
  DestinationAddressEditorView, ServiceEditorView,NotificationEditorView,IPActionEditorView,AdditionalEditorView,
  IPSRulesContextMenu,IPSSigEditorView,RuleNameEditorView,DescriptionEditorView,CodePointView,OverlayWidget,IpsSigToolTip) {

  var RulesView = BaseRulesView.extend({

    events : $.extend(BaseRulesView.prototype.events, {
        "click #diffServMarkActionCell": "showCodePointOverlay"
    }),

    getRuleGridConfiguration: function() {
      var me = this;
          me.ruleGrid = new RuleGrid(me.context, me.ruleCollection, me.policyManagementConstants, me.policyObj);
          me.ruleGridConfiguration = me.ruleGrid.getConfiguration();
          if(me.hasRuleGridActionButtons()) {
            var defaultButtons = {
              "create":{
                "label": me.context.getMessage('create'),
                "key":"createEvent",
                "items": [{
                  "label":me.context.getMessage('addIPSRule'),
                  "key":"ipsRule"
                },{
                  "label":me.context.getMessage('addExemptRule'),
                  "key":"exemptRule"
                }]
              }
            };
            me.ruleGridConfiguration.actionButtons.defaultButtons = defaultButtons;
          }
      return me.ruleGridConfiguration;
    },

    getContextMenu: function() {
      var me = this,
          contextMenu = new IPSRulesContextMenu(me.context, me.ruleCollection);
      return contextMenu;
    },

    /**
     * returns the gridTable object
     *
     * @returns {*}
     */
    getGridTable: function() {
      return this.$el.find("#ipsRuleGrid");
    },

    getCustomActionKeys : function(){
      var me = this,
      customKeys = BaseRulesView.prototype.getCustomActionKeys.apply(me);
      customKeys["ADVANCE"] = "advancePolicy";
      return customKeys;
    },


    addCustomButtons : function(customButtons){
      var me = this;
      if(me.hasRuleGridAdvanceButton()){
          customButtons.push({
              "button_type": true,
              "label": "Enable Editing",
              "key": me.customActionKeys.ADVANCE,
              "secondary": true,
              "disabledStatus": me.isCustomButtonDisabled(me.customActionKeys.ADVANCE)//if not set will show it as enabled by default
          });
       }
       $.extend(BaseRulesView.prototype.addCustomButtons.call(this,customButtons),{
       })

    },

    render: function(){
      var me=this;
      var view = BaseRulesView.prototype.render.apply(me);
      if(!_.isEmpty(me.extras) && me.extras.operation === 'createRule'){    
       me.ruleCollection.once('fetchComplete', function () {
           me.ruleCollection.addExemptRuleFromIPSLog(me.extras);
        });
      }
      return view;
    },

    buildActionEvents: function(){
        this.actionEvents = $.extend(BaseRulesView.prototype.buildActionEvents.call(this),{
            ipsRule: {
                name: "ipsRule",
                capabilities: [this.policyManagementConstants.CAPABILITY_MODIFY]
            },
            exemptRule: {
                name: "exemptRule",
                capabilities: [this.policyManagementConstants.CAPABILITY_MODIFY]
            }

        });

        if(this.hasRuleGridAdvanceButton()){
            $.extend(this.actionEvents,{
                advancePolicy: {
                    name: "advancePolicy",
                    capabilities: [this.policyManagementConstants.CAPABILITY_MODIFY]
                }
            });
        }
      return this.actionEvents
    },

    /**
      * Returns true if the Rules ILP has action buttons.
      * Sub classes can override if actions buttons are to be hidden
      * @returns {boolean}
      */
    hasRuleGridActionButtons: function(){
        if(this.policyObj['ips-policy-type'] == "IPSBASIC") {
          return false;
        }
        return true;
    },    

    /**
    * overriding base class function
    * @returns {boolean}
    */
    hasRuleGridSaveButton: function(){
        if(this.policyObj['ips-policy-type'] == "IPSBASIC") {
          return false;
        }
        return true;
    },

    /**
    * overriding base class function
    * @returns {boolean}
    */
    hasRuleGridDiscardButton: function(){
        if(this.policyObj['ips-policy-type'] == "IPSBASIC") {
          return false;
        }
        return true;
    },

    /**
    * overriding base class function
    * @returns {boolean}
    */
    hasRuleGridPublishUpdateButtons: function(){
        return true;
    },

    hasRuleGridAdvanceButton: function(){
        return (this.policyObj['ips-policy-type'] == "IPSBASIC") ? true : false;
    },

    createViews: function () {

      var me = this,

      ruleNameEditorView = new RuleNameEditorView({
        'policyObj': me.policyObj,
        'close': _.bind(me.closeEditorOverlay, this),
        'context': me.context,
        'columnName': 'name',
        'pattern':/^[a-zA-Z0-9][a-zA-Z0-9-_]{0,62}$/,
        'error':'name_error',
        'ruleCollection': me.ruleCollection
      }),

      sourceAddressEditorView = new SourceAddressEditorView({
        'policyObj': me.policyObj,
        'close': _.bind(me.closeEditorOverlay, this),
        'context': me.context,
        'ruleCollection': me.ruleCollection
      }),

      destinationAddressEditorView = new DestinationAddressEditorView({
        'policyObj': me.policyObj,
        'close': _.bind(me.closeEditorOverlay, this),
        'context': me.context,
        'ruleCollection': me.ruleCollection
      }),

      sourceZoneEditorView = new SourceZoneEditorView({
        'policyObj': me.policyObj,
        'close': _.bind(me.closeEditorOverlay, this),
        'context': me.context,
        'ruleCollection': me.ruleCollection
      }),

      destinationZoneEditorView = new DestinationZoneEditorView({
        'policyObj': me.policyObj,
        'close': _.bind(me.closeEditorOverlay, this),
        'context': me.context,
        'ruleCollection': me.ruleCollection
      }),

      serviceEditorView = new ServiceEditorView({
        'close': _.bind(me.closeEditorOverlay, this),
        'context': me.context,
        'columnName': 'services.service-reference',
        'ruleCollection': me.ruleCollection
      }),

      notificationEditorView = new NotificationEditorView({
        'close': _.bind(me.closeEditorOverlay, this),
        'policyObj': me.policyObj,
        'context': me.context,
        'columnName': 'notification',
        'ruleCollection': me.ruleCollection
      }),

      ipActionEditorView = new IPActionEditorView({
        'close': _.bind(me.closeEditorOverlay, this),
        'policyObj': me.policyObj,
        'context': me.context,
        'columnName': 'ipaction',
        'ruleCollection': me.ruleCollection
      }),

      additionalEditorView = new AdditionalEditorView({
        'close': _.bind(me.closeEditorOverlay, this),
        'policyObj': me.policyObj,
        'context': me.context,
        'columnName': 'additional',
        'ruleCollection': me.ruleCollection
      }),
      ipsSigEditorView = new IPSSigEditorView({
        'close': _.bind(me.closeEditorOverlay, this),
        'context': me.context,
        'columnName': 'attacks.reference',
        'ruleCollection': me.ruleCollection
      }),
      descriptionEditorView = new DescriptionEditorView({
        'policyObj': me.policyObj,
        'close': _.bind(me.closeEditorOverlay, this),
        'context': me.context,
        'columnName': 'description',
        'ruleCollection': me.ruleCollection
      }),
      cellViews = {
        'name':ruleNameEditorView,
        'source-zone': sourceZoneEditorView,
        'source-address.addresses.address-reference': sourceAddressEditorView,
        'destination-zone': destinationZoneEditorView,
        'destination-address.addresses.address-reference': destinationAddressEditorView,
        'services.service-reference': serviceEditorView,
        'notification' : notificationEditorView,
        'ipaction' : ipActionEditorView,
        'additional' : additionalEditorView,
        'attacks.reference':ipsSigEditorView,
        'description':descriptionEditorView
      };
      return cellViews;
    },

    showCodePointOverlay: function(e) {
      var me = this;
      var ruleId = $(e.target).attr('data-rule-obj');
      var codeView= new CodePointView({
        parentInstance: me,
        currentRule: me.ruleCollection.get(ruleId),
        context: me.context,
        selectedAction: 'class-of-service'
      });
      me.Overlay = new OverlayWidget({
            view: codeView,
            type: 'small'
       });           
      me.Overlay.build();
    },

    /**
     * Tooltip
     */
    cellTooltip: function(cellData, renderTooltip){
    var me  = this;
        if (cellData.columnName === "attacks.reference") {
          var attackTooltip = new IpsSigToolTip({ObjId:cellData.cellId, callback:renderTooltip});
          attackTooltip.render();
        } else if (cellData.columnName === "notification") {
          var notificationData = cellData.rowData["notification"];
          if (notificationData) {
            renderTooltip(me.getTooltipForNotification(notificationData));
          }
        } else if (cellData.columnName === "ipaction") {
          var ipAction = cellData.rowData["ipaction"];
          if (ipAction) {            
            renderTooltip(me.getTooltipForIpAction(ipAction));
          }
        } else if (cellData.columnName === "additional") {
          var additional = cellData.rowData["additional"];
          if (additional) {            
            renderTooltip(me.getTooltipForAdditional(additional));
          }
        } else if (cellData.columnName === "source-zone") {
          var zoneArr = cellData.rowData["source-zone"];
          if (zoneArr && zoneArr.length > 0 && zoneArr[0].length > 0 && zoneArr[0] != "-") {
            var formattedValue = "<span>" + zoneArr[0] + "</span>";
            renderTooltip(formattedValue);
          }
        } else if (cellData.columnName === "destination-zone") {
          var zoneArr = cellData.rowData["destination-zone"];
          if (zoneArr && zoneArr.length > 0 && zoneArr[0].length > 0 && zoneArr[0] != "-") {
            var formattedValue = "<span>" + zoneArr[0] + "</span>";
            renderTooltip(formattedValue);
          }         
        } else {
            BaseRulesView.prototype.cellTooltip.apply(this,[cellData, renderTooltip]);
        }
    },

    getTooltipRecord : function(key, data, value) {
      return "<b>"+ key +"</b>:  " + data[value] + "</br>";
    },

    getTooltipForNotification : function(dataObj) {
      var me = this,
          formattedValue = "<span>";
      if (dataObj["logAttack"])
        formattedValue += me.getTooltipRecord("Log Attack", dataObj, "logAttack");
      if (dataObj["packetLog"])
        formattedValue += me.getTooltipRecord("Packet Log", dataObj, "packetLog");
      if (dataObj["pre-attack"])
        formattedValue += me.getTooltipRecord("Packets Before", dataObj, "pre-attack");
      if (dataObj["post-attack"])
        formattedValue += me.getTooltipRecord("Packets After", dataObj, "post-attack");
      if (dataObj["post-attack-timeout"])
        formattedValue += me.getTooltipRecord("Post Attack Timeout", dataObj, "post-attack-timeout");
      formattedValue += "</span>";
      return formattedValue;
    },

    getTooltipForIpAction : function(dataObj) {
      var me = this,
          formattedValue = "<span>";
      if (dataObj["ip-action"])
        formattedValue += me.getTooltipRecord("IP Action", dataObj, "ip-action");
      if (dataObj["target"])
        formattedValue += me.getTooltipRecord("Target", dataObj, "target");
      if (dataObj["refresh-timeout"])
        formattedValue += me.getTooltipRecord("Refresh Timeout", dataObj, "refresh-timeout");
      if (dataObj["log"])
        formattedValue += me.getTooltipRecord("Log", dataObj, "log");
      if (dataObj["log-create"])
        formattedValue += me.getTooltipRecord("Log Create", dataObj, "log-create");             
      formattedValue += "</span>";   
      return formattedValue;   
    },

    getTooltipForAdditional : function(dataObj) {
      var me = this,
          formattedValue = "<span>";
      if (dataObj["severity"])
        formattedValue += me.getTooltipRecord("Severity", dataObj, "severity");
      if (dataObj["terminal"])
        formattedValue += me.getTooltipRecord("Terminal", dataObj, "terminal");         
      formattedValue += "</span>";   
      return formattedValue; 
    },

      /**
       * Returns the SID for the policy
       * @returns {string} sid
       */
      getSID: function() {
        return 'juniper.net:ips-policy-management:ips-rules-grid';
    }

  });

  return RulesView;
});
