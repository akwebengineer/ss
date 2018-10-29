/**
 * A configuration object with the parameters required to build a Grid widget for ips rules
 *
 * @module ipsRulesConfiguration
 * @author Mamata <mamatad@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define(['../../../../../base-policy-management/js/policy-management/rules/conf/baseRulesGridConfiguration.js', 'widgets/dropDown/dropDownWidget',  'text!../templates/diffServMarkingCellLink.html',
        '../../../../../base-policy-management/js/policy-management/rules/views/addressObjectToolTipView.js',
        '../../../../../base-policy-management/js/policy-management/rules/views/serviceObjectToolTipView.js'
],function (BaseRuleGridConfiguration, DropDownWidget,DiffServMarkingCellLink, AddressToolTip, ServiceToolTip ) {
  
  var ipsRulesConfiguration = function (context, ruleCollection, policyManagementConstants, policyObj) {
    this.initialize(context, ruleCollection, policyManagementConstants, policyObj);
  };

  _.extend(ipsRulesConfiguration.prototype, BaseRuleGridConfiguration.prototype, {

    //defined by each grid
    tableId: 'ipsRuleGrid',

    //defined to get the i18n title for grid
    gridTitleString: 'ips_policyRulesGrid_title',

    labelTable: {
      "false": "Disable",
      "true": "Enable",
      "warning": "Warning",
      "critical" : "Critical",
      "minor" : "Minor",
      "major" : "Major",
      "info" : "Info",
      "none" : "None",
      "ip-notify" : "IP Notify",
      "ip-close" : "IP Close",
      "ip-block" : "IP Block",
      "destination-address":"Destination Address",
      "service" : "Service",
      "source-address": "Source Address",
      "source-zone":"Source Zone",
      "source-zone-address":"Source Zone Address",
      "zone-service":"Zone Service",
      "drop-packet" : "Drop Packet",
      "no-action" : "No Action",
      "ignore-connection" : "Ignore",
      "drop-packet" : "Drop Packet",
      "drop-connection" : "Drop Connection",
      "close-client" : "Close Client",
      "close-server" : "Close Server",
      "close-client-and-server" : "Close Client and Server",
      "recommended" : "Recommended",
      "class-of-service" : "DiffServ Marking",
      "":"None"
    },

    keyLabelTable: {
      "alert":"Alert",
      "logAttack":"Log Attack",
      "packetLog":"Log Packets",
      "pre-attack":"Packets Before",
      "post-attack":"Packets After",
      "post-attack-timeout": "Post Attack Timeout",
      "ip-action": "IP Action",
      "target": "Target",
      "refresh-timeout":"Refresh Timeout",
      "timeout-value" : "Timeout Value",
      "log": "Log",
      "log-create": "Log Create",
      "severity" : "Severity",
      "terminal" : "Terminal"
    },

    ipsTypeSearchData : function(){
          var me = this;
          var ipsTypeSearchData = [{
            "value": "IPS",
            "label":  me.policyManagementConstants.IPS_TYPE_DEFAULT
          },{
            "value": "Exempt",
            "label": me.policyManagementConstants.EXEMPT
          }
          ];
        return ipsTypeSearchData;         
    },

    actionDropdownData : function(){
         var me = this;
         var actionDropdownData =  [{
            "id": "no-action",
            "text": me.policyManagementConstants.NO_ACTION
          },{
            "id": "ignore-connection",
            "text": me.policyManagementConstants.IGNORE
          },{
            "id": "drop-packet",
            "text": me.policyManagementConstants.DROP_PACKET
          },
          {
            "id": "drop-connection",
            "text": me.policyManagementConstants.DROP_CONNECTION
          },
          {
            "id": "close-client",
            "text": me.policyManagementConstants.CLOSE_CLIENT
          },
          {
            "id": "close-server",
            "text": me.policyManagementConstants.CLOSE_SERVER
          },
          {
            "id": "close-client-and-server",
            "text": me.policyManagementConstants.CLOSE_CLIENT_SERVER
          },
          {
            "id": "recommended",
            "text": me.policyManagementConstants.RECOMMENDED
          },
          {
            "id": "class-of-service",
            "text": me.policyManagementConstants.DIFFSERV_MARKING
          }
          ];

          return actionDropdownData;
            
        },

        actionSearchData : function(){
            var me = this;
            var actionSearchData = [{
              "value": "no-action",
              "label":  me.policyManagementConstants.NO_ACTION
            },{
              "value": "ignore-connection",
              "label": me.policyManagementConstants.IGNORE
            },{
              "value": "drop-packet",
              "label": me.policyManagementConstants.DROP_PACKET
            },
            {
              "value": "drop-connection",
              "label": me.policyManagementConstants.DROP_CONNECTION
            },
            {
              "value": "close-client",
              "label": me.policyManagementConstants.CLOSE_CLIENT
            },
            {
              "value": "close-server",
              "label":  me.policyManagementConstants.CLOSE_SERVER
            },
            {
              "value": "close-client-and-server",
              "label":  me.policyManagementConstants.CLOSE_CLIENT_SERVER
            },
            {
              "value": "recommended",
              "label": me.policyManagementConstants.RECOMMENDED
            },
            {
              "value": "class-of-service",
              "label": me.policyManagementConstants.DIFFSERV_MARKING
            }
            ];
          return actionSearchData;
            
      },

    formatHitsCell : function (cellvalue, options, rowObject) {
      return (cellvalue == undefined) ? "" : cellvalue;
    },

    formatSourceZoneData: function(cellvalue, options, rowObject){
        var me = this,zoneName = [],
                    recordCollection = me.ruleCollection,
                    rule = recordCollection.get(options.rowId),
                    zone = rule.get("source-zone"),
                    rule_type = rule.get("rule-type");

        var name = "-";
        name.fontcolor("#989898");

        if(!$.isEmptyObject(zone)){
            if(zone.name !== undefined) {
                zoneName.push(zone.name);
            } else {
                if (rule_type == "RULE") {
                  zoneName.push(name);
                }
            }
        } else {
            if (rule_type == "RULE") {
              zoneName.push(name);
            }
        }

        return zoneName;
    },

    formatSourceZone: function(cell, cellvalue, options, rowObject){
        var me = this,zones = [],
                    recordCollection = me.ruleCollection,
                    rule = recordCollection.get(options.rowId),
                    zone = rule.get("source-zone"),
                    rule_type = rule.get("rule-type");

        var name = "-";
        name.fontcolor("#989898");

        if(!$.isEmptyObject(zone)){
            if(zone.name !== undefined) {
                zones.push(zone);
                me.gridZoneIcons(zones, cell);

            } else {
                if (rule_type == "RULE") {
                    return '<span style="color: #989898">-</span>';
                }
            }
        } else {
            if (rule_type == "RULE") {
                return '<span style="color: #989898">-</span>';
            }
        }

        // add tooltip
        $(cell[0]).find('.cellContentValue .cellItem').attr('data-tooltip', 'collapsed');

        return cell;
    },

    formatSourceAddressData:function(cellValue, options, rowObject){
      var me = this, cellContent,
          recordCollection = me.ruleCollection,
          rule = recordCollection.get(options.rowId),
          sourceAddresses = rule.get("source-address")["addresses"]["address-reference"],
          cellValueArr = [];

      if(sourceAddresses){
        if(sourceAddresses.length != 0){
          sourceAddresses.forEach(function(sourceAddress){
            cellValueArr.push({
              key: sourceAddress.id,
              label: sourceAddress.name
            });
          });
        }
      }
      if(cellValueArr.length !== 0){
        return cellValueArr;
      }
      return cellValue;

    },

    formatSourceAddress: function (cell, cellvalue, options, rowObject) {
        var me = this,
          recordCollection = me.ruleCollection,
          rule = recordCollection.get(options.rowId),
          sourceAddresses = rule.get("source-address")["addresses"]["address-reference"],
          excludeAddress = rule.get('source-address')['exclude-list'],
          rule_type = rule.get("rule-type");
        if (excludeAddress === true) {
            $(cell[0]).find('.cellContentValue').addClass('lineThrough');
            $(cell[1]).find('.cellContentWrapper .cellContentValue').addClass('lineThrough');
        }

        if (rule_type == "RULE") {
          if (cellvalue == undefined || cellvalue.length == 0) {
            return '<span style="color: #989898">-</span>';
          }
        }

        // display icon for the addresses
        me.gridAddressIcons(sourceAddresses, cell);

        return cell;
    },

    formatDestinationZoneData: function(cellvalue, options, rowObject){
        var me = this,zoneName = [],
                    recordCollection = me.ruleCollection,
                    rule = recordCollection.get(options.rowId),
                    zone = rule.get("destination-zone"),
                    rule_type = rule.get("rule-type");

        var name = "-";
        name.fontcolor("#989898");

        if(!$.isEmptyObject(zone)){
            if(zone.name !== undefined){
                zoneName.push(zone.name) ;
            } else {
              if (rule_type == "RULE") {
                zoneName.push(name);
              }
            }
        } else {
            if (rule_type == "RULE") {
              zoneName.push(name);
            }
        }
        return zoneName;
    },

    formatDestinationZone: function(cell, cellvalue, options, rowObject){
        var me = this,zones = [],
                    recordCollection = me.ruleCollection,
                    rule = recordCollection.get(options.rowId),
                    zone = rule.get("destination-zone"),
                    rule_type = rule.get("rule-type");

        var name = "-";
        name.fontcolor("#989898");

        if(!$.isEmptyObject(zone)){
            if(zone.name !== undefined) {
                zones.push(zone);
                me.gridZoneIcons(zones, cell);

            } else {
                if (rule_type == "RULE") {
                    return '<span style="color: #989898">-</span>';
                }
            }
        } else {
            if (rule_type == "RULE") {
                return '<span style="color: #989898">-</span>';
            }
        }

        // add tooltip
        $(cell[0]).find('.cellContentValue .cellItem').attr('data-tooltip', 'collapsed');

        return cell;
    },

    formatDestinationAddressData:function(cellValue, options, rowObject){
      var me = this, cellContent,
          recordCollection = me.ruleCollection,
          rule = recordCollection.get(options.rowId),
          destinationAddresses = rule.get("destination-address")["addresses"]["address-reference"],
          cellValueArr = [];

      if(destinationAddresses){
        if(destinationAddresses.length != 0){
          destinationAddresses.forEach(function(destinationAddress){
            cellValueArr.push({
              key: destinationAddress.id,
              label: destinationAddress.name
            });
          });
        }
      }
      if(cellValueArr.length !== 0){
        return cellValueArr;
      }
      return cellValue;
    },

    formatDestinationAddress: function (cell, cellvalue, options, rowObject) {
        var me = this,
          recordCollection = me.ruleCollection,
          rule = recordCollection.get(options.rowId),
          destinationAddresses = rule.get("destination-address")["addresses"]["address-reference"],
          excludeAddress = rule.get('destination-address')['exclude-list'],
          rule_type = rule.get("rule-type");
        if (excludeAddress === true) {
            $(cell[0]).find('.cellContentValue').addClass('lineThrough');
            $(cell[1]).find('.cellContentWrapper .cellContentValue').addClass('lineThrough');
        }

        if (rule_type == "RULE") {
          if (cellvalue == undefined || cellvalue.length == 0) {
            return '<span style="color: #989898">-</span>';
          }
        }

        // display icon for the addresses
        me.gridAddressIcons(destinationAddresses, cell);

      return cell;
    },

    formatAction: function(cellvalue, options, rowObject) {
        var formattedValue = cellvalue,me = this,
            recordCollection = me.ruleCollection,
            rule = recordCollection.get(options.rowId),
            ruleType = rule.get("ipsType");

 
        if(!_.isEmpty(ruleType) && ruleType.toLowerCase() === "exempt"){
             return Slipstream.SDK.Renderer.render("<span class='nat-disabled'>" + me.context.getMessage("nat_rulegrid_not_applicable") + "</span>");
        }

        //setting icons for the actions
        if (!$.isEmptyObject(formattedValue)) {
          var textValue = me.labelTable[formattedValue];
          if(formattedValue == 'class-of-service' && !_.isEmpty(rowObject['action-data']) && rowObject['action-data']['dscpcode']){
             textValue = me.labelTable[formattedValue]+" - "+rowObject['action-data']['dscpcode'];
          }
          return Slipstream.SDK.Renderer.render("<span class='rule-grid-action'>{{text}}</span>", {"cell-value": formattedValue,"text": textValue});
        }
        return "";
    },

    templateResult : function (data){
        if (!data.id) {
          return data.text;
        }
        var imageDir = '/installed_plugins/base-policy-management/images';
        var mySelect = data.text;
        var $myCustomHtml = $("<span><img src='" + imageDir + "/icon_error.png'/> " + mySelect + "</span>");
        if (data.id == 'PERMIT')
            $myCustomHtml = $("<span><img src='" + imageDir + "/permit14X14.png'/> " + mySelect + "</span>");
        else if (data.id == 'DENY')
            $myCustomHtml = $("<span><img src='" + imageDir + "/deny14X14.png'/> " + mySelect + "</span>");
        else if (data.id == 'REJECT')
            $myCustomHtml = $("<span><img src='" + imageDir + "/reject14X14.png'/> " + mySelect + "</span>");
        else if (data.id == 'TUNNEL')
            $myCustomHtml = $("<span><img src='" + imageDir + "/permit_and_tunnel_14X14.png'/> " + mySelect + "</span>");

        return $myCustomHtml;
    },

    getActionEditor : function(cellvalue, options, rowObject) {
        var span;
        var me = this,
        recordCollection = me.ruleCollection,
        rule = recordCollection.get(options.rowId),
        ruleType = rule.get('ipsType'),
        actionData = rule.get('action-data'), dropdowndata = me.actionDropdownData();
        var action = actionData['action'];
        if (action == "class-of-service"){
             var dscpcode = actionData['dscpcode'],
             diffServMarkLink = Slipstream.SDK.Renderer.render(DiffServMarkingCellLink,{"ruleId": rule.id, "cellValue": 'Code Point: '+ dscpcode});
            $span = $('<div><select class="fwactioneditor"></select></br><span>' + diffServMarkLink + '</span></div>');
        }else{
            $span = $('<div><select class="fwactioneditor" style="width: 100%"></select></div>');
        }
        if(!_.isEmpty(ruleType) && ruleType.toLowerCase() === "ips"){
          me.actionEditor = new DropDownWidget({
            "container": $span.find('.fwactioneditor'),
            "data": dropdowndata
          }).build();
          me.actionEditor.setValue(action);
        }
        return $span[0];
    },


    getActionEditorValue : function(element, operation) {
        var actionValue = "";
        if(!_.isEmpty(this.actionEditor)){
             actionValue = this.actionEditor.getValue();
        }
        return  actionValue; 
    },

    formatAdditionalData : function(cellvalue, options, rowObject){
      var me = this,formattedValue = {},severity,terminal,
          recordCollection = me.ruleCollection,
          rule = recordCollection.get(options.rowId),
          isGroupNode = rule.isRuleGroup(),
          configData = rule.attributes['config-data'];
          if (isGroupNode) {
            return formattedValue;
          } 
          if(!$.isEmptyObject(configData)){
             severity = configData['severity'];
             terminal = configData['terminal'];
             if(severity != undefined ){
                 formattedValue["severity"] =  me.labelTable[severity];
             }
             if(terminal != undefined && terminal){
                 formattedValue["terminal"]  = me.labelTable[terminal];
             }
             if(!$.isEmptyObject(formattedValue)){
               return formattedValue;
             }
          }
      return "";
    },

    formatIpActionData : function(cellvalue, options, rowObject){
        var me = this,formattedValue = {},ipAction,target,refreshTimeout,timeoutValue,log,logcreate,
            recordCollection = me.ruleCollection,
            rule = recordCollection.get(options.rowId),
            isGroupNode = rule.isRuleGroup(),
            configData = rule.attributes['config-data'];

        if (isGroupNode) {
            return formattedValue;
        }    
        if(!$.isEmptyObject(configData)){
           ipAction = configData['ip-action'];
           target = configData['target'];
           refreshTimeout = configData['refresh-timeout'];
           timeoutValue = configData['timeout-value'];
           log = configData['log'];
           logcreate = configData['log-create'];

           if(ipAction != undefined){
              formattedValue["ip-action"] = me.labelTable[ipAction];
           }
           if(target != undefined){
              formattedValue["target"] = me.labelTable[target];
           }
           if(refreshTimeout != undefined && refreshTimeout){
               formattedValue["refresh-timeout"] = me.labelTable[refreshTimeout];
           }
           if(timeoutValue != undefined && timeoutValue != ""){
               formattedValue["timeout-value"] = timeoutValue;
           }
           if(log != undefined && log){
              formattedValue["log"] = me.labelTable[log];
           }
           if(logcreate != undefined && logcreate){
               formattedValue["log-create"] = me.labelTable[logcreate];
           }
           if(!$.isEmptyObject(formattedValue)){
             return formattedValue;
           } 
        }

        return "";
    },

    formatNotification: function (cellvalue, options, rowObject) {
        var me = this,formattedValue = {},
        recordCollection = me.ruleCollection,logAttack,packetLog,preAttack,postAttack,postAttackTimeout,
        rule = recordCollection.get(options.rowId),
        isGroupNode = rule.isRuleGroup(),
        configData = rule.attributes['config-data'];
        if (isGroupNode) {
            return formattedValue;
        }
        if(!$.isEmptyObject(configData)){
           logAttack = configData['log-attacks'];
           alert = configData['alert'];
           packetLog = configData['packet-log'];
           preAttack = configData['pre-attack'];
           postAttack = configData['post-attack'];
           postAttackTimeout = configData['post-attack-timeout'];
           if(logAttack != undefined && logAttack){
              formattedValue["logAttack"] = me.labelTable[logAttack];
           }
           if(alert != undefined && alert){
               formattedValue["alert"] = me.labelTable[alert];
           }
           if(packetLog != undefined && packetLog){
              formattedValue["packetLog"] = me.labelTable[packetLog];
           }
           if(preAttack != undefined && preAttack != ""){
              formattedValue["pre-attack"] = preAttack;
           }
           if(postAttack != undefined && postAttack != ""){
              formattedValue["post-attack"] = postAttack;
           }
           if(postAttackTimeout != undefined && postAttackTimeout != "" ){
              formattedValue["post-attack-timeout"] = postAttackTimeout;
           }
          if(!$.isEmptyObject(formattedValue)){
             return formattedValue;
           }
        }
        return "";
    },

    formatCell : function(cell,cellvalue, options, rowObject){
        var me = this,formattedValue = {},
            recordCollection = me.ruleCollection,
            rule = recordCollection.get(options.rowId),
            rule_type = rule.get("rule-type"),
            ipsRuleType = rule.get("ipsType"),
            isGroupNode = rule.isRuleGroup(),
            configData = rule.attributes['config-data'],
            severity,terminal,
            ipAction,target,refreshTimeout,timeoutValue,log,logcreate,
            logAttack,alert,packetLog,preAttack,postAttack,postAttackTimeout,
            newCellContent;
 
        if (isGroupNode) {
            return cell;
        }

        if (options.colModel.name === "ipaction") {
          $(cell[0]).attr("data-tooltip", "collapsed");
          if (!$.isEmptyObject(configData)) {
            ipAction = configData['ip-action'];
            target = configData['target'];
            refreshTimeout = configData['refresh-timeout'];
            timeoutValue = configData['timeout-value'];
            log = configData['log'];
            logcreate = configData['log-create'];

            if ((ipAction == undefined) && 
                (target == undefined) &&
                ((refreshTimeout == undefined) || (refreshTimeout != undefined && !refreshTimeout) ) &&
                ((timeoutValue == undefined) || (timeoutValue != undefined && timeoutValue == "") ) &&
                ((log == undefined) || (log != undefined && !log) ) &&
                ((logcreate == undefined) || (logcreate != undefined && !logcreate)) ) {
              return "-";
            }
          }
        }

        if (options.colModel.name === "notification") {
          $(cell[0]).attr("data-tooltip", "collapsed");
          if (!$.isEmptyObject(configData)) {
            logAttack = configData['log-attacks'];
            alert = configData['alert'];
            packetLog = configData['packet-log'];
            preAttack = configData['pre-attack'];
            postAttack = configData['post-attack'];
            postAttackTimeout = configData['post-attack-timeout'];
            if (( (logAttack == undefined) || (logAttack != undefined && !logAttack) ) &&
                ( (alert == undefined) || (alert != undefined && !alert) ) &&
                ( (packetLog == undefined) || (packetLog != undefined && !packetLog) ) &&
                ( (preAttack == undefined) || (preAttack != undefined && preAttack == "") ) &&
                ( (postAttack == undefined) || (postAttack != undefined && postAttack == "") ) &&
                ( (postAttackTimeout == undefined) || (postAttackTimeout != undefined && postAttackTimeout == "")) ) {
              return "-";
            }
          }
        }
 
        if (options.colModel.name === "additional") { 
          $(cell[0]).attr("data-tooltip", "collapsed");
          if (!$.isEmptyObject(configData)) {
            severity = configData['severity'];
            terminal = configData['terminal'];
            if ((severity == undefined) &&
                ((terminal == undefined) || (terminal != undefined && !terminal)) ) {
              return "-";
            }
          }
        }


        if(!_.isEmpty(ipsRuleType) && ipsRuleType.toLowerCase() === "exempt"){
           newCellContent =  "<span class='nat-disabled'>" + me.context.getMessage("nat_rulegrid_not_applicable") + "</span>";
        }
        if(newCellContent != undefined){
            return newCellContent;
        }else{
            return cell;
        }

    },

    formatServiceData:function(cellValue, options, rowObject){
            var me = this,
              recordCollection = me.ruleCollection,
              rule = recordCollection.get(options.rowId),
              app = rule.get("application"),
              cellValueArr = [];

            if(!_.isEmpty(app)){
              cellValueArr.push({
                key: app.id,
                label: app.name
              });
            }
            if(cellValueArr.length !== 0){
                return cellValueArr;
            }
            return cellValue;
    },

    formatService : function(cell, cellvalue, options, rowObject){
        var me = this,
        recordCollection = me.ruleCollection,
        rule = recordCollection.get(options.rowId),
        rule_type = rule.get("rule-type"),
        ipsRuleType = rule.get("ipsType"),
        app = rule.get("application");

        if ($.isEmptyObject(app)) {
          if (rule_type == "RULE") {
            if (cellvalue == undefined || cellvalue.length == 0) {
              return "<span style='color: #989898'>-</span>";
            }
          }
        }

        if(!_.isEmpty(ipsRuleType) && ipsRuleType.toLowerCase() === "exempt"){
            return "<span class='nat-disabled'>" + me.context.getMessage("nat_rulegrid_not_applicable") + "</span>";
        }

        var services = [];
        services.push(app);
        me.gridServiceIcons(services, cell);
        
        return cell;
    },

    formatIpsSignatureData:function(cellValue, options, rowObject){
      var  cellValueArr = [],
           recordCollection = this.ruleCollection,
           rule = recordCollection.get(options.rowId),
           ipsDataArr = rule.get("attacks")["reference"];
      if(!_.isEmpty(ipsDataArr)) {
        ipsDataArr.forEach(function(ipsData) {
              cellValueArr.push({
                key: ipsData.id,
                label: ipsData.name
              });
        });
      } 
      if(cellValueArr.length !== 0){
        return cellValueArr;
      }
      return cellValue;       
    },

    //Adding formatter for IPS Signatures cell.If no IPS Sig selected cell should display "None"
    formatIpsSignature : function(cell, cellvalue, options, rowObject){
        var me = this,
        recordCollection = me.ruleCollection,
        rule = recordCollection.get(options.rowId),
        ruleType = rule.get("ipsType"),
        isGroupNode = rule.isRuleGroup();

        if (isGroupNode) {
            return cell;
        }
        if(_.isEmpty(cellvalue)){
            return "None";
        }
        return cell;
    },

    // Latest structure for flat rules
    getColumnConfiguration : function () {
      var me = this,
          context = me.context;

      return [{
          "index": me.policyManagementConstants.JSON_ID,
          "name": me.policyManagementConstants.JSON_ID,
          "hidden": true,
          "width": 50
        }, {
          "index": "disabled",
          "name": "disabled",
          "hidden": true,
          "showInactive":"true"
        }, {
          "index": "icons",
          "name":  "icons",
          "label": "",
          "width": 30,
          "sortable": false,          
          "formatter": $.proxy(me.formatIconsCell, me),
          "fixed": true,
          "resizable": false

        }, {
          "index": "serial-number",
          "name": "serial-number",
          "classes": "rule-grid-group-object",
          "label": context.getMessage("rulesGrid_column_serialNumber"),
          "width": 55,
          "sortable": false,         
          "formatter": $.proxy(me.formatSerialNumberCell, me),
          "fixed": true,
          "resizable": false
        }, {
          "index": "RuleName",
          "name": "name",
          "label": context.getMessage("grid_column_rule_name"),
          "width": 140,
          "sortable": false,
          "collapseContent": {
              "formatData": $.proxy(me.formatNameCell, me),
              "formatCell": $.proxy(me.formatObject, me),
              "overlaySize": "small"
          },
          "searchCell": true
        },
        {
          "index": "ipsRuleType",
          "name": "ipsType",
          "label": context.getMessage("ips_rulesgrid_column_type"),
          "width": 75,
          "sortable": false,
          "searchCell": {
                "type": 'dropdown',
                "values":me.ipsTypeSearchData()
           }
        },{
          "index": "SrcZone",
          "name": "source-zone",
          "label": context.getMessage("rulesGrid_column_sourceZone"),
          "width": 116,
          "sortable": false,
          "collapseContent": {
            "name": "name",
            "formatData": $.proxy(me.formatSourceZoneData, me),
            "formatCell": $.proxy(me.formatSourceZone, me)
          },
          "searchCell": true
        }, {
          "index": "SrcAddress",
          "name": "source-address.addresses.address-reference",
          'cellTooltip' : {
            renderer : AddressToolTip
          },
          "label": context.getMessage("rulesGrid_column_sourceAddress"),
          "width": 150,
          "sortable": false,
          "collapseContent": {
            "name": "name",
            "formatData": $.proxy(me.formatSourceAddressData, me),
            "formatCell": $.proxy(me.formatSourceAddress, me),
            "overlaySize": "large"
          },
          "searchCell": true
        }, {
          "index": "DstZone",
          "name": "destination-zone",
          "label": context.getMessage("rulesGrid_column_destinationZone"),
          "width": 116,
          "sortable": false,
          "collapseContent": {
            "name": "name",
            "formatData" : $.proxy(me.formatDestinationZoneData, me),
            "formatCell" : $.proxy(me.formatDestinationZone, me)
          },
          "searchCell": true
        }, {
          "index": "DstAddress",
          "name": "destination-address.addresses.address-reference",
          'cellTooltip' : {
            renderer : AddressToolTip
          },
          "label": context.getMessage("rulesGrid_column_destinationAddress"),
          "width": 150,
          "sortable": false,
          "dataProperty": "destination-address",
          "collapseContent": {
            "name": "name",
            "formatData": $.proxy(me.formatDestinationAddressData, me),
            "formatCell": $.proxy(me.formatDestinationAddress, me),
            "overlaySize": "large"
          },
          "searchCell": true
        }, {
          "index": "Service",
          "name": "services.service-reference",
          'cellTooltip' : {
            renderer : ServiceToolTip
          },
          "label": context.getMessage("rulesGrid_column_service"),
          "width": 116,
          "sortable": false,
          "collapseContent": {
            "name": "name",
            "formatData": $.proxy(me.formatServiceData, me),
            "formatCell": $.proxy(me.formatService, me),
            "overlaySize": "large"
          },
          "searchCell": true
        },
        {
         "index": "ipsAttackName",
         "name": "attacks.reference",
         "label": context.getMessage("ips_rulesGrid_column_signature"),
         "width": 170,
          "sortable": false,
         "collapseContent": {
           "name": "name",
           "formatData": $.proxy(me.formatIpsSignatureData, me),
           "formatCell": $.proxy(me.formatIpsSignature, me),
           "overlaySize": "xlarge"
         },
         "searchCell": true
       },{
          "index": "ipsRuleAction",
          "name": "action-data.action",
          "label": context.getMessage("rulesGrid_column_action"),
          "width": 140,
          "sortable": false,
          "editCell": {
              "type": "custom",
              "element": $.proxy(me.getActionEditor, me),
              "value": $.proxy(me.getActionEditorValue, me)
          },
          "formatter": $.proxy(me.formatAction, me),
           "searchCell": {
                "type": 'dropdown',
                "values":me.actionSearchData()
           }
        }, {
          "index": "notification",
          "name": "notification",
          "label": context.getMessage("ips_rulegrid_column_notification"),
          "width": 120,
          "sortable": false,
          "collapseContent": {
            "keyValueCell": true, //if false or absent, defaults to an array
            "lookupKeyLabelTable": me.keyLabelTable,
            "formatData": $.proxy(me.formatNotification, me),
            "formatObjectCell": $.proxy(me.formatCell, me)
         }
        }, {
          "index": "ipaction",
          "name": "ipaction",
          "label": context.getMessage("ips_rulegrid_column_ipaction"),
          "width": 120,
          "sortable": false,
          "collapseContent": {
          "keyValueCell": true, //if false or absent, defaults to an array
          "lookupKeyLabelTable": me.keyLabelTable,
          "formatData": $.proxy(me.formatIpActionData, me),
          "formatObjectCell": $.proxy(me.formatCell, me)
         }
        }, {
          "index": "additional",
          "name": "additional",
          "label": context.getMessage("ips_rulegrid_column_additional"),
          "width": 120,
          "sortable": false,
          "collapseContent": {
          "keyValueCell": true, //if false or absent, defaults to an array
          "lookupKeyLabelTable": me.keyLabelTable,
          "formatData": $.proxy(me.formatAdditionalData, me),
          "formatObjectCell": $.proxy(me.formatCell, me)
         }
        }, {
          "index": "dcRuledescription",
          "name": "description",
          "label": context.getMessage("grid_column_description"),
          "width": 170,
          "sortable": false,
          "collapseContent": {
            "formatData": $.proxy(me.formatDescriptionCell, me),
            "formatCell": $.proxy(me.formatObject, me),
            "overlaySize": "small",
            "singleValue" : true
          },
          "searchCell": true
        }];
    },

    getConfirmationDialogInfo: function(){
        return {
            "delete": {
                title: this.context.getMessage("ips_rules_delete_confirmation_title"),
                question: this.context.getMessage("rules_delete_confirmation_msg")
            }
        }
    }
  });

  return ipsRulesConfiguration;
});
