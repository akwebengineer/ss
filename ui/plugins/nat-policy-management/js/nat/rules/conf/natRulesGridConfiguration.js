/**
 * A configuration object with the parameters required to build a Grid widget for firewall policies & rules
 *
 * @module firewallRulesConfiguration
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  'text!widgets/grid/templates/moreCell.html',
  '../../../../../base-policy-management/js/policy-management/rules/conf/baseRulesGridConfiguration.js',
  '../../../../../base-policy-management/js/policy-management/rules/views/addressObjectToolTipView.js',
  '../../../../../base-policy-management/js/policy-management/rules/views/serviceObjectToolTipView.js',
  './natRulesGridAddressColumnMixin.js',
  './natRulesGridServiceColumnMixin.js',
  './natRulesGridTranslatedPacketDestinationColumnMixin.js',
  './natRulesGridTranslatedPacketSourceColumnMixin.js'
], function (cellTemplate, BaseRuleGridConfiguration, AddressToolTip, ServiceToolTip, NatAddressColumnMixin, NatServiceColumnMixin, NatTranslatedPacketDestinationColumnMixin, NatTranslatedPacketSourceColumnMixin) {

  var NAME_MAX_LENGTH = "31",
    NAME_MIN_LENGTH = "1";

  var natRulesConfiguration = function (context, ruleCollection, policyManagementConstants, policyObj) {
    var me = this;
    me.initialize(context, ruleCollection, policyManagementConstants, policyObj);
  };

  _.extend(natRulesConfiguration.prototype, BaseRuleGridConfiguration.prototype, {

    //defined by each grid
    tableId: 'natRuleGrid',
    getAddressDndConfig : function () {
      var me = this;
      if(!me.nataddressColumnMixin) {
        me.nataddressColumnMixin = new NatAddressColumnMixin(me);
      }
      return me.nataddressColumnMixin.getAddressDndConfig();
    },
    getServiceDndConfig : function () {
      var me = this;
      if(!me.natserviceColumnMixin) {
        me.natserviceColumnMixin = new NatServiceColumnMixin(me);
      }
      return me.natserviceColumnMixin.getServiceDndConfig();
    },
    getTranslatedPacketDestinationDndConfig : function () {
      var me = this;
      if(!me.natTranslatedPacketDestination) {
        me.natTranslatedPacketDestination = new NatTranslatedPacketDestinationColumnMixin(me);
      }
      return me.natTranslatedPacketDestination.getTranslatedPacketDestinationDndConfig();
    },
    getTranslatedPacketSourceDndConfig : function () {
      var me = this;
      if(!me.natTranslatedPacketSource) {
        me.natTranslatedPacketSource = new NatTranslatedPacketSourceColumnMixin(me);
      }
      return me.natTranslatedPacketSource.getTranslatedPacketSourceDndConfig();
    },
    /**
     * Validate if drag is allowed or not
     * @param draggedItemsData
     * @param $draggedItems
     * @param draggedItemsRowData
     * @param $dragHelper
     * @returns {boolean}
     */
    cellBeforeDrag : function (draggedItemsData,$draggedItems, draggedItemsRowData, $dragHelper) {
      //Check if edit is allowed or not
      return !this.ruleCollection.isPolicyReadOnly();
    },


    //defined to get the i18n title for grid
    gridTitleString: 'nat_policyRulesGrid_title',

    labelTable: {
      "ZONE": "Zones",
      "VIRTUAL_ROUTER": "Routing Instances",
      "POOL": "Pool",
      "INTERFACE": "Interface",
      "NO_TRANSLATION": "No Translation",
      "PREFIX": "Address",
      "INET": "Corresponding IPv4",
      "translation" : "Translation Type",
      "dstAddress" : "Destination Address",
      "routing" : "Routing Instance",
      "port" : "Mapped Port",
      "ports" : "Ports",
      "interface" : "Interface",
      "persistent" : "Persistent NAT",
      "noTranslation" : "No Translation"
    },

    persistentNatTypeEnum : {
      "ANY_REMOTE_HOST" : "Permit any remote host",
      "TARGET_HOST" : "Permit target host",
      "TARGET_HOST_PORT" : "Permit target host port"
    },

    formatSourceAddressData:function(cellValue, options, rowObject){
      var me = this, cellContent,
        recordCollection = me.ruleCollection,
        rule = recordCollection.get(options.rowId),
        srcAddress = rule.get("original-packet")["src-address"],
        sourceAddresses,
        cellValueArr = [];

      if (srcAddress)
        sourceAddresses = srcAddress["address-reference"];

      if(sourceAddresses){
        if(sourceAddresses.length !== 0){
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

    /*
     * Custom function to update the content of a cell, so that its content can be collapsed on one line
     * and showing instead the number of entries not seen plus the word "more..."
     */

    formatSourceAddress: function (cell, cellvalue, options, rowObject) {
      var me = this,
        recordCollection = me.ruleCollection,
        rule = recordCollection.get(options.rowId),
        rule_type = rule.get("rule-type"),
        srcAddress = rule.get("original-packet")["src-address"],
        sourceAddresses,
        excludeAddress = rule.get('source-excluded-address');

      if (excludeAddress === true) {
        var formattedCell = '';
        $(cell).each(function (i, ele) {
          formattedCell += $(ele).addClass('lineThrough')[0].outerHTML;
        });
        cell = formattedCell;
      }

      if (srcAddress) {
        sourceAddresses = srcAddress["address-reference"];
        me.gridAddressIcons(sourceAddresses, cell);
      }

      if (rule_type == "RULE") {
        if (cellvalue === undefined || (cellvalue !== undefined && cellvalue === "")) {
          return "-";
        }
      }

      return cell;
    },

    formatDestinationAddressData:function(cellValue, options, rowObject){
      var me = this, cellContent,
        recordCollection = me.ruleCollection,
        rule = recordCollection.get(options.rowId),
        dstAddress = rule.get("original-packet")["dst-address"],
        destinationAddresses,
        cellValueArr = [];

      if (dstAddress)
        destinationAddresses = dstAddress["address-reference"];

      if(destinationAddresses){
        if(destinationAddresses.length !== 0){
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
        rule_type = rule.get("rule-type"),
        dstAddress = rule.get("original-packet")["dst-address"],
        destinationAddresses,
        excludeAddress = rule.get('destination-excluded-address');
      if (excludeAddress === true) {
        var formattedCell = '';
        $(cell).each(function (i, ele) {
          formattedCell += $(ele).addClass('lineThrough')[0].outerHTML;
        });
        cell = formattedCell;
      }

      if (dstAddress) {
        destinationAddresses = dstAddress["address-reference"];
        me.gridAddressIcons(destinationAddresses, cell);
      }

      if (rule_type == "RULE") {
        if (cellvalue === undefined || (cellvalue !== undefined && cellvalue === "")) {
          return "-";
        }
      }

      return cell;
    },


    formatIngressData : function(cellvalue, options, rowObject){
      var me = this, cellContent,
        recordCollection = me.ruleCollection,
        rule = recordCollection.get(options.rowId),
        isGroupNode = rule.isRuleGroup(),
        srcTrafficType = rule.get("original-packet")["src-traffic-match-type"],
        ruleType = rule.get("nat-type"),
        zoneSets = [], cellValueArr = [], trafficValues =[];

      if(rule.get("original-packet")["src-traffic-match-value"]){
        trafficValues = rule.get("original-packet")["src-traffic-match-value"]["src-traffic-match-value"];
        if(trafficValues !== undefined && trafficValues !== null && trafficValues.length > 0) {
          trafficValues.forEach(function(zone){
            cellValueArr.push({key:zone,label:zone});
          });
        }
      }

      if(srcTrafficType == "ZONE") {
        if(rule.get("original-packet")["src-zone-sets"]){
          zoneSets = rule.get("original-packet")["src-zone-sets"]["reference"];

          if(zoneSets.length !==0){
            zoneSets.forEach(function(zoneSet){
              cellValueArr.push({key:zoneSet.id,label:zoneSet.name});
            });
          }
        }
      }

      return cellValueArr;
    },

    formatIngress: function (cell, cellvalue, options, rowObject) {
      var me = this, cellContent,
        recordCollection = me.ruleCollection,
        rule = recordCollection.get(options.rowId),
        rule_type = rule.get("rule-type"),
        srcTrafficType = rule.get("original-packet")["src-traffic-match-type"],
        isGroupNode = rule.isRuleGroup(),
        zoneSets = [], trafficValues =[], formatData = [];

      if (isGroupNode) {
        return "";
      }

      if(cellvalue !== undefined && cellvalue !== "" && cellvalue.length !== 0){
        if(cell){
          $(cell[0]).find('.cellContentValue .cellItem').prepend("<span><b>"+me.labelTable[srcTrafficType]+":</b></span>");
        }
      }

      // setting empty value '-' for grid cells
      if (rule_type == "RULE") {
        if (cellvalue === undefined || (cellvalue !== undefined && cellvalue === "")) {
          return "-";
        }
      }

      // adding image to src ingress
      // get src-traffic
      trafficValues = rule.get("original-packet")["src-traffic-match-value"]["src-traffic-match-value"];
      if(trafficValues !== undefined && trafficValues !== null && trafficValues.length > 0) {
        trafficValues.forEach(function(value) {
          formatData.push({name: value, "zone-type": srcTrafficType});
        });
      }

      // get zone sets
      if(srcTrafficType == "ZONE") {
        if(rule.get("original-packet")["src-zone-sets"]){
          zoneSets = rule.get("original-packet")["src-zone-sets"]["reference"];

          if(zoneSets.length !==0){
            zoneSets.forEach(function(zoneSet){
              formatData.push({name: zoneSet.name, "zone-type": 'ZONESET'});
            });
          }
        }
      }

      if (formatData && formatData.length > 0)
        me.gridZoneIcons(formatData, cell);

      return cell;
    },

    formatEgressData : function(cellvalue, options, rowObject){
      var me = this, cellContent,
        recordCollection = me.ruleCollection,
        rule = recordCollection.get(options.rowId),
        isGroupNode = rule.isRuleGroup(),
        dstTrafficType = rule.get("original-packet")['dst-traffic-match-type'],
        ruleType = rule.get("nat-type"),
        zoneSets = [], cellValueArr = [], trafficValues = [];

      if(rule.get("original-packet")["dst-traffic-match-value"]){
        trafficValues = rule.get("original-packet")["dst-traffic-match-value"]["dst-traffic-match-value"];
        if(trafficValues && trafficValues.length > 0) {
          trafficValues.forEach(function(zone){
            cellValueArr.push({key:zone,label:zone});
          });
        }
      }

      if(dstTrafficType === "ZONE") {
        if(rule.get("original-packet")["dst-zone-sets"]){
          zoneSets = rule.get("original-packet")["dst-zone-sets"]["reference"];

          if(zoneSets.length !==0){
            zoneSets.forEach(function(zoneSet){
              cellValueArr.push({key:zoneSet.id,label:zoneSet.name});
            });
          }
        }
      }
      return cellValueArr;
    },

    formatEgress: function (cell, cellvalue, options, rowObject) {
      var me = this, cellContent,
        recordCollection = me.ruleCollection,
        rule = recordCollection.get(options.rowId),
        rule_type = rule.get("rule-type"),
        dstTrafficType = rule.get("original-packet")['dst-traffic-match-type'],
        isGroupNode = rule.isRuleGroup(),
        ruleType = rule.get("nat-type"),
        formatData = [], zoneSets = [], trafficValues =[];

      if (isGroupNode) {
        return "";
      }
      if(ruleType === "STATIC" || ruleType === "DESTINATION"){
        return "<span class='nat-disabled'>" + me.context.getMessage("nat_rulegrid_not_applicable") + "</span>";
      }

      if(cellvalue !== undefined && cellvalue !== "" && cellvalue.length !== 0){
        if(cell){
          $(cell[0]).find('.cellContentValue .cellItem').prepend("<span><b>"+me.labelTable[dstTrafficType]+":</b></span>");
        }
      }

      if (rule_type == "RULE") {
        if (cellvalue === undefined || (cellvalue !== undefined && cellvalue === "")) {
          return "-";
        }
      }

      // adding image to src ingress
      // get src-traffic
      trafficValues = rule.get("original-packet")["dst-traffic-match-value"]["dst-traffic-match-value"];
      if(trafficValues && trafficValues.length > 0) {
        trafficValues.forEach(function(value) {
          formatData.push({name: value, "zone-type": dstTrafficType});
        });
      }

      // get zone sets
      if(dstTrafficType == "ZONE") {
        if(rule.get("original-packet")["dst-zone-sets"]){
          zoneSets = rule.get("original-packet")["dst-zone-sets"]["reference"];

          if(zoneSets.length !==0){
            zoneSets.forEach(function(zoneSet){
              formatData.push({name: zoneSet.name, "zone-type": 'ZONESET'});
            });
          }
        }
      }

      if (formatData && formatData.length > 0)
        me.gridZoneIcons(formatData, cell);

      return cell;
    },

    formatDestinationPortData: function(cellvalue, options, rowObject){
      var me = this, cellContent,
        recordCollection = me.ruleCollection,
        rule = recordCollection.get(options.rowId),
        isGroupNode = rule.isRuleGroup(),
        ruleType = rule.get("nat-type"),
        portSets = [], ports = "", cellValueArr = [];

      if(rule.get("original-packet")["dst-ports"]){
        ports = rule.get("original-packet")["dst-ports"];
        if(ports.indexOf(",") > -1){
          cellValueArr = ports.split(",");
        }else if(ports !== ""){
          cellValueArr.push(ports);
        }
      }
      if(rule.get("original-packet")["dst-port-sets"]){
        portSets = rule.get("original-packet")["dst-port-sets"]["reference"];

        if(portSets && portSets.length !==0){
          portSets.forEach(function(portSet){
            cellValueArr.push({key:portSet.id,label:portSet.name});
          });
        }
      }
      return cellValueArr;
    },

    formatDestinationPort: function(cell, cellvalue, options, rowObject){
      var me = this,
        recordCollection = me.ruleCollection,
        rule = recordCollection.get(options.rowId),
        rule_type = "RULE",
        isGroupNode = rule.isRuleGroup();
//        ports = rule.get("original-packet")["dst-ports"];

      if (isGroupNode) {
        return "";
      }

      if(cellvalue !== undefined && cellvalue !== "" && cellvalue.length !== 0){
        if(cell){
          $(cell[0]).find('.cellContentValue .cellItem').prepend("<span><b>"+me.labelTable["ports"]+":</b></span>");
        }
      }

      if (rule_type == "RULE") {
        if (cellvalue === undefined || cellvalue.length === 0) {
          return '<span style="color: #989898">-</span>';
        }
      }

      return cell;
    },

    formatSourcePortData: function(cellvalue, options, rowObject){
      var me = this, cellContent,
        recordCollection = me.ruleCollection,
        rule = recordCollection.get(options.rowId),
        isGroupNode = rule.isRuleGroup(),
        ruleType = rule.get("nat-type"),
        portSets = [], ports = "", cellValueArr = [];

      if(rule.get("original-packet")["src-ports"]){
        ports = rule.get("original-packet")["src-ports"];
        if(ports.indexOf(",") > -1){
          cellValueArr = ports.split(",");
        }else if(ports !== ""){
          cellValueArr.push(ports);
        }
      }
      if(rule.get("original-packet")["src-port-sets"]){
        portSets = rule.get("original-packet")["src-port-sets"]["reference"];

        if(portSets && portSets.length !==0){
          portSets.forEach(function(portSet){
            cellValueArr.push({key:portSet.id,label:portSet.name});
          });
        }
      }
      return cellValueArr;
    },

    formatSourcePort: function(cell, cellvalue, options, rowObject){
      var me = this, cellContent,
        recordCollection = me.ruleCollection,
        rule = recordCollection.get(options.rowId),
        rule_type = rule.get("rule-type"),
        isGroupNode = rule.isRuleGroup(),
        ruleType = rule.get("nat-type");
//        ports = rule.get("original-packet")["src-ports"],
//        portSets = [];

      if (isGroupNode) {
        return "";
      }
      if(ruleType === "DESTINATION"){
        return "<span class='nat-disabled'>" + me.context.getMessage("nat_rulegrid_not_applicable") + "</span>";
      }

      if(cellvalue !== undefined && cellvalue !== "" && cellvalue.length !== 0){
        if(cell){
          $(cell[0]).find('.cellContentValue .cellItem').prepend("<span><b>"+me.labelTable["ports"]+":</b></span>");
        }
      }

      if (rule_type == "RULE") {
        if (cellvalue === undefined || cellvalue.length === 0) {
          return '<span style="color: #989898">-</span>';
        }
      }

      return cell;
    },

    formatServiceData:function(cellValue, options, rowObject){
      var me = this, cellContent,
        recordCollection = me.ruleCollection,
        rule = recordCollection.get(options.rowId),
        services = rule.get("services")["service-reference"],
        cellValueArr = [];

      if(services){
        if(services.length !== 0){
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

    formatService : function(cell, cellvalue, options, rowObject){
      var me = this,
        recordCollection = me.ruleCollection,
        rule = recordCollection.get(options.rowId),
        rule_type = rule.get("rule-type"),
        isGroupNode = rule.isRuleGroup(),
        services = rule.get('services')['service-reference'],
        ruleType = rule.get("nat-type");

      if (isGroupNode) {
        return "";
      }
      if(ruleType === "STATIC"){
        return "<span class='nat-disabled'>" + me.context.getMessage("nat_rulegrid_not_applicable") + "</span>";
      }

      me.gridServiceIcons(services, cell);

      if (rule_type == "RULE") {
        if (cellvalue === undefined || cellvalue.length === 0) {
          return '<span style="color: #989898">-</span>';
        }
      }

      return cell;
    },

    formatProtocol : function(cell, cellvalue, options, rowObject){
      var me = this,
        recordCollection = me.ruleCollection,
        rule = recordCollection.get(options.rowId),
        rule_type = rule.get("rule-type"),
        isGroupNode = rule.isRuleGroup(),
        ruleType = rule.get("nat-type");

      if (isGroupNode) {
        return "";
      }
      if(ruleType === "STATIC"){
        return "<span class='nat-disabled'>" + me.context.getMessage("nat_rulegrid_not_applicable") + "</span>";
      }

      if (rule_type == "RULE") {
        if (cellvalue === undefined || (cellvalue !== undefined && cellvalue === "")) {
          return "-";
        }
      }

      return cell;
    },

    formatSrcTranslatedPacket: function(cellvalue, options, rowObject){
      var me = this,formattedValue = [],
        recordCollection = me.ruleCollection,
        rule = recordCollection.get(options.rowId),
        translationType = "",
        poolName = "",
        isGroupNode = rule.isRuleGroup(),
        ruleType = rule.get("nat-type"),
        translatedPacket = rule.get("translated-packet");

      if (isGroupNode) {
        return formattedValue;
      }
      if(ruleType === "DESTINATION" || ruleType === "STATIC"){
        return formattedValue;
      }else{
        if(!$.isEmptyObject(translatedPacket)){
          translationType = translatedPacket["translated-traffic-match-type"];
          if(translationType === "POOL"){
            poolName = translatedPacket["pool-addresses"]["name"];
            if(poolName && !$.isEmptyObject(poolName)){
              formattedValue.push(poolName);
            }
          }else if(translationType === "INTERFACE") {
            // formattedValue["interface"] = "";
            if(translatedPacket["persistent-nat-setting"]) {
              if(translatedPacket["persistent-nat-setting"]["persistent-nat-type"] && translatedPacket["persistent-nat-setting"]["persistent-nat-type"] != "NONE") {
                formattedValue.push("Persistent Enabled");
              }
              else {
                formattedValue.push("Persistent Disabled");
              }
            }
            else {
              formattedValue.push("Persistent Disabled");
            }
          }else if(translationType === "NO_TRANSLATION"){
            formattedValue.push(me.labelTable[translationType]);
          }
        }
        return formattedValue;
      }
    },

    formatSrcTranslatedPacketCell : function(cell,cellvalue, options, rowObject){
      var me = this,formattedValue = {},
        recordCollection = me.ruleCollection,
        rule = recordCollection.get(options.rowId),
        type = rule.get("rule-type"),
        isGroupNode = rule.isRuleGroup(),
        ruleType = rule.get("nat-type"),
        translatedPacket = rule.get("translated-packet"),
        newCellContent = "";

      if (isGroupNode) {
        return cell;
      }
      if(ruleType === "DESTINATION"){
        newCellContent =  "<span class='nat-disabled'>" + me.context.getMessage("nat_rulegrid_original_packet") + "</span>";
      }else if(ruleType === "STATIC"){
        newCellContent =  "<span class='nat-disabled'>" + me.context.getMessage("nat_rulegrid_not_applicable") + "</span>";
      }else{
        if(!$.isEmptyObject(translatedPacket)){
          // translationType = translatedPacket["translated-traffic-match-type"];
          //if(translationType === "NO_TRANSLATION"){
          //    newCellContent = "<span class='nat-disabled'>" + me.context.getMessage("nat_rulegrid_no_translation") + "</span>";
          //}
        }
      }
      if(newCellContent !== ""){
        return newCellContent;
      }else{
        $(cell[0]).attr("data-tooltip", "collapsed");
        var morecell = $(cell[1]).find('.cellContentWrapper');
        $(morecell).attr("data-tooltip", "expanded");
        if(cellvalue !== undefined && cellvalue !== "" && cellvalue.length !== 0){
          if(cell){
            var translationType = translatedPacket["translated-traffic-match-type"];
            if(translationType === "NO_TRANSLATION") {
              $(cell[0]).find('.cellContentValue .cellItem').html("<span><b>"+me.labelTable[translationType]+"</b></span>");
            } else {
              $(cell[0]).find('.cellContentValue .cellItem').prepend("<span><b>"+me.labelTable[translationType]+":</b></span>");
            }
          }
        }

        if (cellvalue === undefined || (cellvalue !== undefined && cellvalue === "")) {
          if (type == "RULE")
            return "-";
        }

        return cell;
      }

    },

    formatDestnTranslatedPacket:function(cellvalue, options, rowObject){
      var me = this,formattedValue = [],
        recordCollection = me.ruleCollection,
        rule = recordCollection.get(options.rowId),
        translationType = "",
        poolName = "", addressName = "",
        isGroupNode = rule.isRuleGroup(),
        ruleType = rule.get("nat-type"),
        translatedPacket = rule.get("translated-packet");

      if (isGroupNode) {
        return formattedValue;
      }
      if(ruleType === "SOURCE"){
        return formattedValue;
      }else{
        if(!$.isEmptyObject(translatedPacket)){
          translationType = translatedPacket["translated-traffic-match-type"];
          if(translationType === "POOL"){
            poolName = translatedPacket["pool-addresses"]["name"];
            if(poolName && !$.isEmptyObject(poolName)){
              formattedValue.push(poolName);
            }
          }else if(translationType === "PREFIX"){
            addressName = translatedPacket["translated-address"]["name"];
            if(addressName && !$.isEmptyObject(addressName)){
              formattedValue.push(addressName);
            }
          }else if(translationType === "INET"){
            var routingInstance = translatedPacket["routing-instance-name"];
            if(routingInstance && !$.isEmptyObject(routingInstance)){
              formattedValue.push(routingInstance);
            }
            else {
              formattedValue.push("None");
            }
          }else if(translationType === "NO_TRANSLATION"){
            formattedValue.push(me.labelTable[translationType]);
          }
        }
        return formattedValue;
      }
    },

    formatDestnTranslatedPacketCell : function(cell,cellvalue, options, rowObject){
      var me = this,formattedValue = {},
        recordCollection = me.ruleCollection,
        rule = recordCollection.get(options.rowId),
        type = rule.get("rule-type"),
        isGroupNode = rule.isRuleGroup(),
        ruleType = rule.get("nat-type"),
        translatedPacket = rule.get("translated-packet"),
        newCellContent = "";

      if (isGroupNode) {
        return cell;
      }
      if(ruleType === "SOURCE"){
        newCellContent =  "<span class='nat-disabled'>" + me.context.getMessage("nat_rulegrid_not_applicable") + "</span>";
      }else{
        if(!$.isEmptyObject(translatedPacket)){
          //translationType = translatedPacket["translated-traffic-match-type"];
          /* if(translationType === "NO_TRANSLATION"){
           newCellContent =  "<span class='nat-disabled'>" + me.context.getMessage("nat_rulegrid_no_translation") + "</span>"  ;
           }*/
        }
      }
      if(newCellContent !== ""){
        return newCellContent;
      }else{
        $(cell[0]).attr("data-tooltip", "collapsed");
        var morecell = $(cell[1]).find('.cellContentWrapper');
        $(morecell).attr("data-tooltip", "expanded");
        if(cellvalue !== undefined && cellvalue !== "" && cellvalue.length !== 0){
          if(cell){
            var translationType = translatedPacket["translated-traffic-match-type"];
            if(translationType === "NO_TRANSLATION") {
              $(cell[0]).find('.cellContentValue .cellItem').html("<span><b>"+me.labelTable[translationType]+"</b></span>");
            } else {
              $(cell[0]).find('.cellContentValue .cellItem').prepend("<span><b>"+me.labelTable[translationType]+":</b></span>");
            }
          }
        }

        if (cellvalue === undefined || (cellvalue !== undefined && cellvalue === "")) {
          if (type == "RULE")
            return "-";
        }

        return cell;

      }
    },

    // Latest structure for flat rules
    getColumnConfiguration : function () {
      var me = this,
        context = me.context,
        ruleCollection = me.ruleCollection;

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
        "label": context.getMessage("grid_column_name"),
        "width": 140,
        "sortable": false,
        "collapseContent": {
          "formatData": $.proxy(me.formatNameCell, me),
          "formatCell": $.proxy(me.formatObject, me),
          "overlaySize": "small"
        },
        "searchCell": true
      }, {
        "index": "dcNatRuleType",
        "name": "nat-type",
        "label": context.getMessage("nat_rulesgrid_column_type"),
        "width": 75,
        "sortable": false,
        "searchCell": true
      }, {
        "index": "Ingress",
        "name": "original-packet.src-traffic-match-value.src-traffic-match-value",
        "label": context.getMessage("nat_rulesgrid_column_ingress"),
        "width": 120,
        "sortable": false,
        "collapseContent": {
          "formatCell": $.proxy(me.formatIngress, me),
          "formatData": $.proxy(me.formatIngressData, me),
          "overlaySize": "large"
        },
        "searchCell": true
      }, {
        "index": "SrcAddress",
        "name": "original-packet.src-address.address-reference",
        'cellTooltip' : {
          renderer : AddressToolTip
        },
        "label": context.getMessage("rulesGrid_column_sourceAddress"),
        "width": 150,
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
        "index": "SrcPort",
        "name": "original-packet.src-ports",
        "label": context.getMessage("nat_rulesgrid_column_port_source"),
        "width": 116,
        "sortable": false,
        "collapseContent": {
          "formatData": $.proxy(me.formatSourcePortData, me),
          "formatCell": $.proxy(me.formatSourcePort, me),
          "overlaySize": "large"
        },
        "searchCell": true
      },  {
        "index": "protocol",
        "name": "original-packet.protocol.protocol-data",
        "label": context.getMessage("nat_rulesgrid_column_protocol"),
        "width": 120,
        "sortable": false,
        "collapseContent": {
          "name": "name",
          "formatCell": $.proxy(me.formatProtocol, me),
          "overlaySize": "medium"
        },
        "searchCell": true
      }, {
        "index": "Egress",
        "name": "original-packet.dst-traffic-match-value.dst-traffic-match-value",
        "label": context.getMessage("nat_rulesgrid_column_egress"),
        "width": 120,
        "sortable": false,
        "collapseContent": {
          "formatCell": $.proxy(me.formatEgress, me),
          "formatData": $.proxy(me.formatEgressData, me),
          "overlaySize": "large"
        },
        "searchCell": true
      }, {
        "index": "DstAddress",
        "name": "original-packet.dst-address.address-reference",
        'cellTooltip' : {
          renderer : AddressToolTip
        },
        "label": context.getMessage("rulesGrid_column_destinationAddress"),
        "width": 150,
        "sortable": false,
        "dataProperty": "destination-address",
        "dragNDrop" : me.getAddressDndConfig(),
        "collapseContent": {
          "name": "name",
          "formatData": $.proxy(me.formatDestinationAddressData, me),
          "formatCell": $.proxy(me.formatDestinationAddress, me),
          "overlaySize": "large"
        },
        "searchCell": true
      }, {
        "index": "DstPort",
        "name": "original-packet.dst-ports",
        "label": context.getMessage("nat_rulesgrid_column_port_destination"),
        "width": 116,
        "sortable": false,
        "collapseContent": {
          "formatData": $.proxy(me.formatDestinationPortData, me),
          "formatCell": $.proxy(me.formatDestinationPort, me),
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
        "dragNDrop" : me.getServiceDndConfig(),
        "collapseContent": {
          "name": "name",
          "formatData": $.proxy(me.formatServiceData, me),
          "formatCell": $.proxy(me.formatService, me),
          "overlaySize": "large"
        },
        "searchCell": true
      }, {
        "index": "TranslatedPacketAddress",
        "name": "translated-packet.translated-address",
        "label": context.getMessage("nat_rulesgrid_column_packet_source"),
        "width": 160,
        "sortable": false,
        "dragNDrop" : me.getTranslatedPacketSourceDndConfig(),
        "collapseContent": {
          "formatData": $.proxy(me.formatSrcTranslatedPacket, me),
          "formatCell": $.proxy(me.formatSrcTranslatedPacketCell, me)
        },
        "searchCell": true
      }, {
        "index": "TranslatedPacketAddress",
        "name": "translated-packet.pool-addresses",
        "label": context.getMessage("nat_rulesgrid_column_packet_destination"),
        "width": 170,
        "sortable": false,
        "dragNDrop" : me.getTranslatedPacketDestinationDndConfig(),
        "collapseContent": {
          "formatData": $.proxy(me.formatDestnTranslatedPacket, me),
          "formatCell": $.proxy(me.formatDestnTranslatedPacketCell, me)
        },
        "searchCell": true
      }, {
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
          title: this.context.getMessage("nat_rules_delete_confirmation_title"),
          question: this.context.getMessage("rules_delete_confirmation_msg")
        }
      };
    }
  });

  return natRulesConfiguration;
});
