/**
 * A configuration object with the parameters required to build a Grid widget for firewall policies & rules
 *
 * @module firewallRulesConfiguration
 * @author Omega Developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'widgets/dropDown/dropDownWidget',
    '../../../../../base-policy-management/js/policy-management/rules/conf/baseRulesGridConfiguration.js',
    'text!../templates/fwRulesAction.html',
    '../../../../../base-policy-management/js/policy-management/rules/util/ruleGridConstants.js',
    'text!../templates/fwRuleHitCellRender.html',
    'text!../templates/fwRuleHitCount.html',
    'text!../templates/vpnTunnelCellLink.html',
    '../../../../../base-policy-management/js/policy-management/rules/views/addressObjectToolTipView.js',
    '../../../../../base-policy-management/js/policy-management/rules/views/serviceObjectToolTipView.js',
    './fwRulesGridAddressColumnMixin.js',
    './fwRulesGridServiceColumnMixin.js',
    './fwRulesGridZoneColumnMixin.js'
    
], function (DropDownWidget, BaseRuleGridConfiguration, actionTemplate, RuleGridConstants, hitCellTemplate, hitCountTemplate, vpnTunnelTemplate, AddressToolTip, ServiceToolTip, AddressColumnMixin, ServiceColumnMixin, ZoneColumnMixin) {

  var firewallRulesConfiguration = function (context, ruleCollection, policyManagementConstants, policyObj) {
        var me = this;
        me.initialize(context, ruleCollection, policyManagementConstants, policyObj);
      },
      abbreviateNumber = function(num, points) {
        var chars = [ 'K', 'M', 'G', 'T' ], index = -1, retVal = num, rounded = num;

        while (rounded >= 1000) {
          rounded = rounded / 1000;
          index++;
          // after trillion, do not abbreviate more. That means, it might show 100000T
          if(index === 3) {
            break;
          }
        }

        if (index !== -1) {
          retVal = parseFloat(rounded.toFixed(points)) + chars[index > 3 ? 3 : index];
        }

        return retVal;
      };



    _.extend(firewallRulesConfiguration.prototype, BaseRuleGridConfiguration.prototype, {
        getAddressDndConfig : function () {
          var me = this;
          if(!me.addressColumnMixin) {
            me.addressColumnMixin = new AddressColumnMixin(me);
          }
          return me.addressColumnMixin.getAddressDndConfig();
        },
        getServiceDndConfig : function () {
          var me = this;
          if(!me.serviceColumnMixin) {
            me.serviceColumnMixin = new ServiceColumnMixin(me);
          }
          return me.serviceColumnMixin.getServiceDndConfig();
        },
        getZoneDndConfig : function () {
          var me = this;
          if(!me.zoneColumnMixin) {
            me.zoneColumnMixin = new ZoneColumnMixin(me);
          }
          return me.zoneColumnMixin.getZoneDndConfig();
        },

        //defined by each grid
        tableId: 'firewallRuleGrid',
        //defined to get the i18n title for grid
        gridTitleString: 'fw_policyRulesGrid_title',


        keyLabelTable: {
            "sec-intel": "SecIntel",
            "ips": "IPS",
            "utm": "UTM",
            "ssl-proxy": "SSL PROXY",
            "threat-policy": "THREAT POLICY",
            "app-firewall": "APP FIREWALL",
            "profile": "Profile",
            "scheduler": "Schedule",
            "profile_none": "-"
        },

      isDevicePolicy: function () {
        return this.policyObj && this.policyObj["policy-type"] === "DEVICE";
      },

      getActionDropdownData : function(rule){

            var actionDropdownData =  [{
                "id": "PERMIT",
                "text": this.context.getMessage("rulesGrid_column_action_permit")
            },{
                "id": "DENY",
                "text": this.context.getMessage("rulesGrid_column_action_deny")
            },{
                "id": "REJECT",
                "text": this.context.getMessage("rulesGrid_column_action_reject")
            }];

            if (this.isDevicePolicy() && !rule.get("global-rule")) {
                actionDropdownData.push({
                    "id": "TUNNEL",
                    "text": this.context.getMessage("permit_and_tunnel")
                });
            }

            return actionDropdownData;
        },

        actionSearchData : function() {
            var actionSearchData = [{
                "label": this.context.getMessage("rulesGrid_column_action_permit"),
                "value": "PERMIT"
            },{
                "label": this.context.getMessage("rulesGrid_column_action_deny"),
                "value": "DENY"
            },{
                "label": this.context.getMessage("rulesGrid_column_action_reject"),
                "value": "REJECT"
            }];

            if (this.isDevicePolicy()) {
                actionSearchData.push({
                    "label": this.context.getMessage("permit_and_tunnel"),
                    "value": "TUNNEL"
                });
            }
            return actionSearchData;
        },

        formatHitsCell : function (cellValue, options, rowObject) {
          var hitCount,
              fullBoxWidth = 36,
              recordCollection = this.ruleCollection,
              rule = recordCollection.get(options.rowId),
              value = rule.get('hit-count-details');
          var hitCountBox;

          if (rule.get("is-leaf") && value !== "" && value['hit-percent'] != undefined) {
            hitCount = abbreviateNumber(value['hit-count'], 2);
            if (value['hit-count'] === 0) {
              // for zero level and zero count
              hitCountBox = Slipstream.SDK.Renderer.render(hitCountTemplate,{"ruleObject": JSON.stringify(rowObject), "0": fullBoxWidth, "1": value['hit-percent']});
            } else if (value['hit-count'] && (value['hit-percent'] || value['hit-percent'] === 0)) {
              // empty boxes
              hitCountBox = Slipstream.SDK.Renderer.render(hitCountTemplate,{"ruleObject": JSON.stringify(rowObject), "0": fullBoxWidth, "1": value['hit-percent']});
            } else if (value['hit-percent'] === 1) {
              // partly filled and partly empty
              hitCountBox = Slipstream.SDK.Renderer.render(hitCountTemplate,{"ruleObject": JSON.stringify(rowObject), "0": fullBoxWidth, "1": 2}); //Because of 1px border div will always take min 2px
            } else {
              // partly filled and partly empty
              hitCountBox = Slipstream.SDK.Renderer.render(hitCountTemplate,{"ruleObject": JSON.stringify(rowObject), "0": fullBoxWidth, "1": value['hit-percent']});
            }
            return Slipstream.SDK.Renderer.render(hitCellTemplate,{"ruleObject": JSON.stringify(rowObject), "cellValue": hitCount}) + hitCountBox;
          }
          else{
            return Slipstream.SDK.Renderer.render(hitCellTemplate,{"ruleObject": JSON.stringify(rowObject), "cellValue": hitCount});
          }
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

        formatSourceAddress: function (cell, cellValue, options, rowObject) {
            var me = this,
              recordCollection = me.ruleCollection,
              rule = recordCollection.get(options.rowId),
              addrs = rule.get('source-address')['addresses']['address-reference'],
              excludeAddress = rule.get('source-address')['exclude-list'];
            if (excludeAddress === true) {
                $(cell[0]).find('.cellContentValue').addClass('lineThrough');
                $(cell[1]).find('.cellContentWrapper .cellContentValue').addClass('lineThrough');
            }

            // display icon for the addresses
            me.gridAddressIcons(addrs, cell);

            return cell;
        },

        formatSourceIdentity: function (cell, cellValue, options, rowObject) {
            var me = this,
              recordCollection = me.ruleCollection,
              rule = recordCollection.get(options.rowId),
              rule_type = rule.get("rule-type");
            if (rule_type == "RULE") {
              if (cellValue == undefined || cellValue.length == 0) {
                cellValue = '<span style="color: #989898">-</span>';
                return cellValue;
              }
            }

            // add tooltip
            $(cell[0]).find('.cellContentValue .cellItem').attr('data-tooltip', 'collapsed');
            
            return cell;
        },
      /**
       * Add zone information to zone cell. This will be used for drag and drop
       * @param cell
       * @param zones
       */
        addZoneInfoToHtmlCell: function (cell, zones) {
          var eachItem = $(cell[1]).find('.cellContentValue.cellItem');
          $.each(zones, function (index, item) {
            if (item['zone-type'] === 'ZONE') {
              $(eachItem[index]).attr('data-name', item['name']);
              $(eachItem[index]).attr('zone-type', 'ZONE');
            } else {
              $(eachItem[index]).attr('data-id', item['id']);
              $(eachItem[index]).attr('zone-type', 'ZONESET');
            }
          });
        },
        formatSrcZone: function (cell, cellValue, options, rowObject) {
            var me = this,
              recordCollection = me.ruleCollection,
              rule = recordCollection.get(options.rowId),
              zones = rule.get('source-zone')['zone'] || [],
              rule_type = rule.get("rule-type");
            if (rule_type == "RULE") {
              if (cellValue == undefined || cellValue.length == 0) {
                return '<span style="color: #989898">-</span>';
              }
            }

            // add tooltip
            $(cell[0]).find('.cellContentValue .cellItem').attr('data-tooltip', 'collapsed');
            me.addZoneInfoToHtmlCell(cell, zones);
            me.gridZoneIcons(zones, cell);

            return cell;
        },

        formatDstZone: function (cell, cellValue, options, rowObject) {
            var me = this,
              recordCollection = me.ruleCollection,
              rule = recordCollection.get(options.rowId),
              zones = rule.get('destination-zone')['zone'] || [],
              rule_type = rule.get("rule-type");
            if (rule_type == "RULE") {
              if (cellValue == undefined || cellValue.length == 0) {
                return '<span style="color: #989898">-</span>';
              }
            }

            // add tooltip
            $(cell[0]).find('.cellContentValue .cellItem').attr('data-tooltip', 'collapsed');
            me.addZoneInfoToHtmlCell(cell, zones);

            me.gridZoneIcons(zones, cell);

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

        formatDestinationAddress: function (cell, cellValue, options, rowObject) {
            var me = this,
              recordCollection = me.ruleCollection,
              rule = recordCollection.get(options.rowId),
              addrs = rule.get('destination-address')['addresses']['address-reference'],
              excludeAddress = rule.get('destination-address')['exclude-list'];
            if (excludeAddress === true) {
                $(cell[0]).find('.cellContentValue').addClass('lineThrough');
                $(cell[1]).find('.cellContentWrapper .cellContentValue').addClass('lineThrough');
            }

            // display icon for the addresses
            me.gridAddressIcons(addrs, cell);

            return cell;
        },

        formatServiceData:function(cellValue, options, rowObject){
            var me = this, cellContent,
              recordCollection = me.ruleCollection,
              rule = recordCollection.get(options.rowId),
              services = rule.get("services")["service-reference"],
              cellValueArr = [];

            if(services){
                if(services.length != 0){
                    services.forEach(function(services){
                        cellValueArr.push({
                          key: services.id,
                          label: services.name
                        });
                    });
                }
            }
            if(cellValueArr.length !== 0){
                return cellValueArr;
            }
            return cellValue;
        },

        formatService: function (cell, cellValue, options, rowObject) {
            var me = this,
                recordCollection = me.ruleCollection,
                rule = recordCollection.get(options.rowId),
                services = rule.get("services")["service-reference"];

            me.gridServiceIcons(services, cell);

            return cell;
        },

        formatAction: function(cellValue, options, rowObject) {
            var formattedValue = cellValue,
                imgSrc = '/installed_plugins/base-policy-management/images/',
                img;

            if (cellValue === "PERMIT") {
                formattedValue = "Permit";
                img = 'icon_permit14X14';
            } else if (cellValue === "DENY") {
                formattedValue = "Deny";
                img = 'icon_deny14X14';
            } else if (cellValue === "REJECT") {
                formattedValue = "Reject";
                img = 'icon_reject14X14';
            } else if (cellValue === "TUNNEL") {
                formattedValue = "Permit and Tunnel";
                img = 'icon_permit_and_tunnel14X14';
            } else {
                if (!cellValue)
                  formattedValue = "";
            }

            //setting icons for the actions
            if (!$.isEmptyObject(formattedValue)) {
                var imgIcon = img;

                return Slipstream.SDK.Renderer.render(actionTemplate, {"cell-value": formattedValue, "icon": imgIcon, "text": formattedValue});
            }
            return "";
        },

        formatRuleOptionsData: function (cellValue, options, rowObject) {

            var me = this,
                recordCollection = me.ruleCollection,
                rule = recordCollection.get(options.rowId);

            if(rule.get("rule-profile")){
                var formattedValue = {},
                    returnValue = '<span style="color: #989898">-</span>',
                    profileType = rule.get("rule-profile")["profile-type"],
                    scheduler = rule.get("scheduler").name;

                if (profileType == "INHERITED") {
                    formattedValue["profile"] = "Inherited";
                } else if (profileType == "USER_DEFINED") {
                    formattedValue["profile"] =  rule.get("rule-profile")["user-defined-profile"]["name"];
                } else if (profileType == "CUSTOM") {
                    formattedValue["profile"] =  "Custom";
                } else if (profileType == "NONE") {

                }

                if (!$.isEmptyObject(scheduler)) {
                    formattedValue["scheduler"] = scheduler;
                }

                // if there is no cell value, display '-'
                if($.isEmptyObject(formattedValue)) {
                  formattedValue["profile_none"] = returnValue;
                }

                if (!$.isEmptyObject(formattedValue) && rule.get("is-leaf")) {
                    return formattedValue;
                }
            } 
            return "";
        },

        formatRuleOptions: function ($cell, cellValue, options, rowObject) {
            $($cell[0]).attr("data-tooltip", "collapsed");

            var cellContentValue = $($cell[1]).find('.cellContentWrapper .cellContentValue');
            var cellContentBlock = $($cell[1]).find('.cellContentWrapper .cellContentBlock');
            var length = $(cellContentBlock).length;
            var profileValue = "";
            for (i = 0; i < length; i++) {
              profileValue = $($(cellContentValue)[i]).text();
              $($(cellContentBlock)[i]).attr('data-tooltip', profileValue);
            }

            // if there is no cell value, display '-'
            var me = this,
              recordCollection = me.ruleCollection,
              rule = recordCollection.get(options.rowId),
              rule_type = rule.get("rule-type");
            if (rule_type == "RULE") {
              if (cellValue == undefined || cellValue == "") {
                cellValue = '<span style="color: #989898">-</span>';
                //cellValue = '-';
                return cellValue;
              }
            }

            return $cell;
        },

        formatAdvanceSecurityData: function (cellValue, options, rowObject) {
            var me = this,formattedValue = {},
            recordCollection = me.ruleCollection,
            rule = recordCollection.get(options.rowId),

        //        secIntelPolicy = rule.get("secintel-policy"),
              utmPolicy = rule.get("utm-policy"),
              sslProxy = rule.get("ssl-forward-proxy-profile"),
              appFirewall = rule.get("app-fw-policy"),
              ipsEnabled = rule.get("ips-enabled"),
              threatPolicy = rule.get("threat-policy");

        //        if (!$.isEmptyObject(secIntelPolicy)) {
        //          formattedValue["sec-intel"] = secIntelPolicy.name;
        //        }
            if (true === ipsEnabled) {
                formattedValue["ips"] = "ON";
            }
            if (!$.isEmptyObject(utmPolicy)) {
                formattedValue["utm"] = utmPolicy.name;
            }

            if(!$.isEmptyObject(sslProxy)) {
                formattedValue["ssl-proxy"] = sslProxy.name;
            }
            if(!$.isEmptyObject(appFirewall)) {
                formattedValue["app-firewall"] = appFirewall.name;
            }

            if(!$.isEmptyObject(threatPolicy)) {
                formattedValue["threat-policy"] = threatPolicy.name;
            }

            if(!$.isEmptyObject(formattedValue)){
                return formattedValue;
            }
            return "";
        },

        formatAdvanceSecurity: function ($cell, cellValue, options, rowObject) {
            $($cell[0]).attr("data-tooltip", "collapsed");

            var cellContentValue = $($cell[1]).find('.cellContentWrapper .cellContentValue');
            var cellContentBlock = $($cell[1]).find('.cellContentWrapper .cellContentBlock');
            var length = $(cellContentBlock).length;
            var advSecValue = "";
            for (i = 0; i < length; i++) {
              advSecValue = $($(cellContentValue)[i]).text();
              $($(cellContentBlock)[i]).attr('data-tooltip', advSecValue);
            }

            // if there is no cell value, display '-'
            var me = this,
              recordCollection = me.ruleCollection,
              rule = recordCollection.get(options.rowId),
              rule_type = rule.get("rule-type");
            if (rule_type == "RULE") {
              if (cellValue == undefined || cellValue == "") {
                //cellValue = '<span style="color: #989898">-</span>';
                cellValue = '-';
                return cellValue;
              }
            }

            return $cell;
        },

        formatDescription: function ($cell, cellValue, options, rowObject) {
            var me = this,
              recordCollection = me.ruleCollection,
              rule = recordCollection.get(options.rowId),
              rule_type = rule.get("rule-type");
            if (rule_type == "RULE") {
              //if (cellValue == undefined || cellValue.length == 0) {
              if (rowObject.description == "") {
                cellValue = '<span style="color: #989898">-</span>';
                return cellValue;
              }
            }
            return $cell;
        },


         templateResult : function (data){
            if (!data.id) {
              return data.text;
            }
            var mySelect = data.text;
            var $myCustomHtml = $("<span><div class='icon_error'></div>" + mySelect + "</span>");
            if (data.id == 'PERMIT')
                $myCustomHtml = $("<span><div class='icon_permit14X14'></div> " + mySelect + "</span>");
            else if (data.id == 'DENY')
                $myCustomHtml = $("<span><div class='icon_deny14X14'></div> " + mySelect + "</span>");
            else if (data.id == 'REJECT')
                $myCustomHtml = $("<span><div class='icon_reject14X14'></div> " + mySelect + "</span>");
            else if (data.id == 'TUNNEL')
                $myCustomHtml = $("<span><div class='icon_permit_and_tunnel14X14'></div> " + mySelect + "</span>");

            return $myCustomHtml;
        },

        getActionEditor : function(cellValue, options, rowObject) {
            var span;
            var me = this,
                recordCollection = me.ruleCollection,
                rule = recordCollection.get(options.rowId),
                action = rule.get("action"), dropdowndata = me.getActionDropdownData(rule);

            var imageDir = '/installed_plugins/base-policy-management/images/',
                sd_managed = (rule.get("vpn-tunnel-refs"))["is-managed"],
                imgIcon = "icon_tunnel_SD_managed.svg";

            var vpn_tunnel = rule.get("vpn-tunnel-refs").name,
                vpnTunnelLink = Slipstream.SDK.Renderer.render(vpnTunnelTemplate,
                  {"ruleId": rule.id, "cellValue": vpn_tunnel});

            if (sd_managed === false) {
                imgIcon = "icon_tunnel_device.svg";
            }           

            if (action == "TUNNEL"  && vpn_tunnel)
                $span = $('<div><select class="fwactioneditor"></select></br><span>Tunnel: <img width=14px height=14px src="' + imageDir + imgIcon + '"/>&nbsp' + vpnTunnelLink + '</span></div>');
            else
                $span = $('<div><select class="fwactioneditor" style="width: 100%"></select></div>');

            me.actionEditor = new DropDownWidget({
                "container": $span.find('.fwactioneditor'),
                "data": dropdowndata,
                "placeholder": "Select an option",
                "templateSelection": me.templateResult,
                "templateResult": me.templateResult
            }).build();

            me.actionEditor.setValue(action);
            return $span[0];
        },

        getActionEditorValue : function(element, operation) {
          return this.actionEditor.getValue();
        },

        getSourceZoneEditor : function(cellValue, options){
            var me = this,
                recordCollection = me.ruleCollection,
                rule = recordCollection.get(options.rowId),
                sourceZone = rule.get("source-zones")["source-zone"]["name"];
            var $span =  $('<div><select class="fwsourcezoneeditor"></select></div>');
            me.sourceZoneEditor = new DropDownWidget({
                "container": $span.find('.fwsourcezoneeditor'),
                "data": [],
                "placeholder": "Select an option",
                "enableSearch": true,
                "multipleSelection": {
                  allowClearSelection: true
                }
            }).build();
            me.sourceZoneEditor.setValue(sourceZone);
            return $span[0];
        },

        getSourceZoneEditorValue : function(element, operation){
          return this.sourceZoneEditor.getValue();
        },

        getDestinationZoneEditor : function(cellValue, options){
            var me = this,
                recordCollection = me.ruleCollection,
                rule = recordCollection.get(options.rowId),
                destinationZone = rule.get("destination-zones")["destination-zone"]["name"];
            var $span =  $('<div><select class="fwdestinationzoneeditor"></select></div>');
            me.destinationZoneEditor = new DropDownWidget({
                "container": $span.find('.fwdestinationzoneeditor'),
                "data": [],
                "placeholder": "Select an option",
                "enableSearch": true
            }).build();
            me.destinationZoneEditor.setValue(destinationZone);
            return $span[0];
        },

        getDestinationZoneEditorValue : function(element, operation){
            return this.sourceZoneEditor.getValue();
        },

        // Latest structure for flat rules
        getColumnConfiguration : function () {
            var me = this,
              context = me.context;

            return [{
                "index": me.policyManagementConstants.JSON_ID,
                "name":  me.policyManagementConstants.JSON_ID,
                "hidden": true,
                "width": 50
            }, {
                "index": "disabled",
                "name": "disabled",
                "hidden": true,
                "width": 120,
                "showInactive":"true"
            }, {
                "index": "icons",
                "name":  "icons",
                "label": "",
                "width": 30,
                "sortable": false,               
                "formatter": $.proxy(me.formatIconsCell, me),
                "fixed": true,
                'resizable': false
            }, {
                "index": "serial-number",
                "name": "serial-number",
                "classes": "rule-grid-group-object",
                "label": context.getMessage("rulesGrid_column_serialNumber"),
                "width": 55,
                "sortable": false,
                "formatter": $.proxy(me.formatSerialNumberCell, me),
                "resizable": false,
                "fixed": true
            }, {
                "index": "hitCountLevel",
                "name": "hit-count-details.hit-count",
                "label": context.getMessage("fw_policyRulesGrid_column_hits"),
                "width": 70,
                "sortable": false,
                "formatter": $.proxy(me.formatHitsCell, me),
                "searchCell": {
                  "type": 'dropdown',
                  "values":[{
                    "label": "Zero",
                    "value": "zero"
                  },{
                    "label": "Low",
                    "value": "low"
                  },{
                    "label": "Medium",
                    "value": "medium"
                  },{
                    "label": "High",
                    "value": "high"
                  }]
                }
            }, {
                "index": "RuleName",
                "name": "name",
                "label": context.getMessage("grid_column_rule_name"),
                "width": 160,
                "sortable": false,
                "collapseContent": {
                    "formatData": $.proxy(me.formatNameCell, me),
                    "formatCell": $.proxy(me.formatObject, me),
                    "overlaySize": "small"
                },
                "searchCell": true
            }, {
                "index": "SrcZone",
                "name": "source-zone.zone",
                "label": context.getMessage("rulesGrid_column_sourceZone"),
                "width": 150,
                "sortable": false,
                "dragNDrop" : me.getZoneDndConfig(),
                "collapseContent": {
                    "name": "name",
                    "formatCell": $.proxy(me.formatSrcZone, me),
                    "overlaySize": "medium"
                },
                "searchCell": true
            }, {
                "index": "SrcAddress",
                "name": "source-address.addresses.address-reference",
                'cellTooltip' : {
                  renderer : AddressToolTip
                },
                "label": context.getMessage("rulesGrid_column_sourceAddress"),
                "width": 200,
                "sortable": false,
                "dragNDrop" : me.getAddressDndConfig(),
                "collapseContent": {
                    "name": "name",
                    "formatData": $.proxy(me.formatSourceAddressData, me),
                    "formatCell": $.proxy(me.formatSourceAddress, me),
                    "overlaySize": "large"
                },
                "searchCell": true
            }, {
                "index": "SrcIdentity",
                "name": "sourceidentities.sourceidentity",
                "label": context.getMessage("source_identity"),
                "width": 100,
                "sortable": false,
                "collapseContent": {
                    "name": "name",
                    "formatCell": $.proxy(me.formatSourceIdentity, me),
                    "overlaySize": "large"
                },
                "searchCell": true
            },{
                "index": "DstZone",
                "name": "destination-zone.zone",
                "label": context.getMessage("rulesGrid_column_destinationZone"),
                "width": 150,
                "sortable": false,
                "dragNDrop" : me.getZoneDndConfig(),
                "collapseContent": {
                    "name": "name",
                    "formatCell": $.proxy(me.formatDstZone, me),
                    "overlaySize": "medium"
                },
                "searchCell": true
            }, {
                "index": "DstAddress",
                "name": "destination-address.addresses.address-reference",
                'cellTooltip' : {
                  renderer : AddressToolTip
                },
                "label": context.getMessage("rulesGrid_column_destinationAddress"),
                "width": 200,
                "sortable": false,
                "dataProperty": "destination-address",
                "dragNDrop" : me.getAddressDndConfig(),
                "collapseContent": {
                    "name": "name",
                    "formatData": $.proxy(me.formatDestinationAddressData, me),
                    "formatCell": $.proxy(me.formatDestinationAddress, me),
                    "overlaySize": "large"
                    // "moreTooltip": $.proxy(me.setTooltipAddressData, me)
                },
                "searchCell": true
            }, {
                "index": "Service",
                "name": "services.service-reference",
                'cellTooltip' : {
                  renderer : ServiceToolTip
                },
                "label": context.getMessage("rulesGrid_column_service"),
                "width": 150,
                "sortable": false,
                "dragNDrop" : me.getServiceDndConfig(),
                "collapseContent": {
                    "name": "name",
                    "formatData": $.proxy(me.formatServiceData, me),
                    "formatCell": $.proxy(me.formatService, me),
                    "overlaySize": "large"
                },
                "searchCell": true
            }, {
                "index": "dcRuleAction",
                "name": "action",
                "label": context.getMessage("rulesGrid_column_action"),
                "width": 135,
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
                "index": "AdvSecurity",
                "name": "ips-enabled",
                "label": context.getMessage("advanced_security"),
                "width": 140,
                "sortable": false,
                "collapseContent": {
                    "keyValueCell": true, //if false or absent, defaults to an array
                    "lookupKeyLabelTable": me.keyLabelTable,
                    "formatData": $.proxy(me.formatAdvanceSecurityData, me),
                    "formatObjectCell": $.proxy(me.formatAdvanceSecurity, me)
                },
                "searchCell": true
            },  {
                "index": "RuleOptions",
                "name": "scheduler",
                "label": context.getMessage("rule_options"),
                "width": 120,
                "sortable": false,
                "collapseContent": {
                    "keyValueCell": true, //if false or absent, defaults to an array
                    "lookupKeyLabelTable": me.keyLabelTable,
                    "formatData": $.proxy(me.formatRuleOptionsData, me),
                    "formatObjectCell": $.proxy(me.formatRuleOptions, me)
                },
                "searchCell": true
            },{
                "index": "dcRuleDescription",
                "name": "description",
                "label": context.getMessage("grid_column_description"),
                "width": 140,
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
                    title: this.context.getMessage("fw_rules_delete_confirmation_title"),
                    question: this.context.getMessage("rules_delete_confirmation_msg")
                }
            }
        }
    });

    return firewallRulesConfiguration;
});
