/**
 * A configuration object with the parameters required to build a Grid widget for firewall policies & rules
 *
 * @module firewallRulesConfiguration
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
   'widgets/tooltip/tooltipWidget',
   '../../../../../ui-common/js/common/utils/SmUtil.js'
], function (TooltipWidget, SMUtil) {

  var baseRulesConfiguration = function (context, ruleCollection) {};

  _.extend(baseRulesConfiguration.prototype, {

    showNavigationControls: false,
    //defined by each extending configuration
    getColumnConfiguration: undefined,

    //defined by each grid
    tableId: undefined,

    //defined to get the i18n title for grid
    gridTitleString: undefined,

      //Not specifying table height. wil take from grid container
    tableHeight: 'auto',

    initialize: function(context, ruleCollection, policyManagementConstants, policyObj) {
      this.context = context;
      this.ruleCollection = ruleCollection;
      this.policyManagementConstants = policyManagementConstants;
      this.policyObj = policyObj;
      this.isRowEditable = this.isRowEditable? $.proxy(this.isRowEditable, this) : context.isRowEditable;
      this.onBeforeEdit = this.onBeforeEdit ? $.proxy(this.onBeforeEdit,this) : context.onBeforeEdit;
    },
    formatNameCell: function (cellValue, options, row) {
      var me = this,
          recordCollection = me.ruleCollection,
          rule = recordCollection.get(options.rowId),
          isGroupNode = rule.isRuleGroup();
      // if (isGroupNode) {
      //   return "";
      // }
      return cellValue;
    },

    formatObject : function (cell, cellValue, options, rowObject) {
      $(cell[0]).attr("data-tooltip", "collapsed");
      return cell;
    },  

    formatDescriptionCell: function (cellValue, options, row) {
      var me = this,
        recordCollection = me.ruleCollection,
        rule = recordCollection.get(options.rowId),
        rule_type = rule.get("rule-type");
      if (rule_type == "RULE") {
        //if (cellValue == undefined || cellValue.length == 0) {
        if (row.description == undefined || (row.description != undefined && row.description == "")) {
          return "-";
        }
      }
      return cellValue;
    }, 

    formatDetailCell: function (cellvalue, options) {
      var formattedCellValue = "<span style='border-right: 0px'>" + cellvalue + "</span>";
      return formattedCellValue;
    },

    setTooltipAddressData: function (rowData, rawData, setTooltipDataCallback){
      var addrs = [];
      addrs.push("1.1.1.1/32");
      addrs.push("2.2.2.2/24");
        setTooltipDataCallback(addrs, {
            "key": "ip-prefix",
            "label": "name",
            "clickHandler": function(item){
                console.log(item);
            }
        });
    },
    /**
     * [getCellContentObj description]
     * @param  {[type]} cell [description]
     * @return {[type]}      [description]
     */
    getCellContentObj: function(cell){
      return {
        displayLen : $(cell[0]).find('.cellContentValue').length,
        cellContentValue : $(cell[0]).find('.cellContentValue .cellItem'),
        cellContentWrapper : $(cell[1]).find('.cellContentWrapper .cellContentValue'),
        moreLen : $(cell[1]).find('.cellContentWrapper .cellContentValue').length
      };
    },
    /**
     * [addCellContentValue description]
     * @param {[type]} display_len        [description]
     * @param {[type]} cellContentValue   [description]
     * @param {[type]} more_len           [description]
     * @param {[type]} cellContentWrapper [description]
     * @param {[type]} name               [description]
     */
     addCellContentValue: function(display_len, cellContentValue, more_len, cellContentWrapper, name, img){
       var oldName;
      for (i = 0; i < display_len; i++) {
        oldName = $(cellContentValue[i]).text();
        if (oldName === name) {
          $(cellContentValue[i]).html('<span>' + img + '&nbsp&nbsp' + oldName + '</span>');
        }
      }

      for (i = 0; i < more_len; i++) {
        oldName = $(cellContentWrapper[i]).text();
        if (oldName === name) {
          $(cellContentWrapper[i]).html(this.getCheckboxHtml(cellContentWrapper[i]) + img + '&nbsp&nbsp' + oldName);
        }
      }
    },
    gridAddressIcons: function(addrs, cell) {
      var me = this, cellObj = me.getCellContentObj(cell);

      // display icon for the addresses
      if (addrs) {
        if (addrs.length != 0) {
            addrs.forEach(function(addr) {
              var addr_type = addr['address-type'];
              var addr_name = addr['name'];

              // set tooltip for the icons
              var icon_tooltip = 'Host';
              if (addr_type) {
                if (addr_type == "ANY") {
                  icon_tooltip = 'Any';
                } else if (addr_type === "NETWORK") {
                  icon_tooltip = 'Network';
                } else if (addr_type === "RANGE") {
                  icon_tooltip = 'Range';
                } else if (addr_type === "ANY_IPV4") {
                  icon_tooltip = 'Any IPv4';
                } else if (addr_type === "ANY_IPV6") {
                  icon_tooltip = 'Any IPv6';
                } else if (addr_type === "GROUP") {
                  icon_tooltip = 'Address Group';
                } else if (addr_type === "DNS") {
                  icon_tooltip = 'DNS Host';
                } else if (addr_type === "WILDCARD") {
                  icon_tooltip = 'Wildcard';
                } else if (addr_type === "POLYMORPHIC") {
                  icon_tooltip = 'Variable';
                }
              }
              if (addr_type) {
                var img = "";
                if (addr_type !== "DYNAMIC") {
                  img = '<div class="icon_address_'+ addr_type.toLowerCase() + ' tooltip" title="' + icon_tooltip + '" />';
                } 
                me.addCellContentValue(cellObj.displayLen, cellObj.cellContentValue, cellObj.moreLen, cellObj.cellContentWrapper, addr_name, img);
              }
            });
        }
      }
    },

    gridServiceIcons: function(services, cell) {
      var me = this, cellObj = me.getCellContentObj(cell);

      // display icon for the addresses
      if (services) {
        if (services.length != 0) {
            services.forEach(function(service) {
              var service_type = service['is-group'],
              service_name = service['name'],
              img = '<div class="' + (service_type?'icon_service_group':'icon_service')+' tooltip" title="' + (service_type ? 'Service Group':'Service') + '" />';
              me.addCellContentValue(cellObj.displayLen, cellObj.cellContentValue, cellObj.moreLen, cellObj.cellContentWrapper, service_name, img);
            });
        }
      }
    },
    getCheckboxHtml : function (cellContentWrapper) {
      var checkboxHtml;
      if($(cellContentWrapper).find('input[type=checkbox]').length > 0) {
        checkboxHtml = '<input class =  "dragabble-cell-checkbox" type = "checkbox" style="float:left">';
      } else {
        checkboxHtml = '';
      }
      return checkboxHtml;
    },

    gridZoneIcons: function(zones, cell) {
      var me = this, cellObj = me.getCellContentObj(cell);

      // display icon for the addresses
      if (zones) {
        if (zones.length != 0) {
            zones.forEach(function(zone) {
              var zone_type = zone['zone-type'],
              zone_name = zone['name'],
              icon_tooltip = 'Zone',
              img = "";

              if (zone_type == 'ZONESET') {
                icon_tooltip = 'Zone Set';
              } else if (zone_type == 'ZONE') {
                icon_tooltip = 'Zone';
              } else if (zone_type == 'POLYMORPHIC') {
                icon_tooltip = 'Variable';
              } else if (zone_type == 'INTERFACE') {
                icon_tooltip = 'Interface';
              } else if (zone_type == 'VIRTUAL_ROUTER') {
                icon_tooltip = 'Routing Instance';
              }

              img = '<div class="' + 'icon_'+zone_type.toLowerCase() +  ' tooltip" title="' + icon_tooltip + '" />';

              var display_len = cellObj.displayLen, more_len = cellObj.moreLen, oldZone, index, checkboxHtml = '';
              for (i = 0; i < display_len; i++) {
                //var oldZone = $($(cell[0]).find('.cellContentValue .cellItem')[i]).find('span').text();
                oldZone = $((cellObj.cellContentValue)[i]).text();
                if (oldZone === zone_name) {
                  index = oldZone.indexOf("(set)");
                  if (index >= 0)
                    oldZone = oldZone.substring(0, index);
                  $((cellObj.cellContentValue)[i]).html('<span>' + img + '&nbsp&nbsp' + oldZone + '</span>');
                }
              }

              for (i = 0; i < more_len; i++) {
                oldZone = $((cellObj.cellContentWrapper)[i]).text();
                if (oldZone === zone_name) {
                  index = oldZone.indexOf("(set)");
                  if (index >= 0)
                    oldZone = oldZone.substring(0, index);
                  $((cellObj.cellContentWrapper)[i]).html( me.getCheckboxHtml((cellObj.cellContentWrapper)[i]) + img + '&nbsp&nbsp' + oldZone);
                }
              }

            });
        }
      }
    },

    formatIconsCell: function (cellvalue, options) {
      var me = this;
      var imageSrc = me.policyManagementConstants.IMAGE_LOCATION,
      recordCollection = me.ruleCollection;
      me.cuid = me.ruleCollection.cuid;
      var rowObject = me.ruleCollection.get(options.rowId);
      var formattedCellValue;
      if (rowObject) {
        var cuid = rowObject.collection.cuid;
        var rule_type = rowObject.get("rule-type");
        var error_level = rowObject.get("error-level");        

        // *****  manage icons for rule ******

        if (rule_type == "RULE") { 
          formattedCellValue = "<span>";                     

           formattedCellValue += "<span data-tooltip='" + me.cuid + "' style='margin-left: 0px; margin-right: 3px;'><span class=' "+me.policyManagementConstants.validation_icon[error_level].imgClass+" validate_icon' 'data-policy-id'="+recordCollection.policyID+  " 'data-error-level'="+error_level+  " 'data-row-id'="+options.rowId+  " 'data-cell-id'="+me.cuid+"></span></span>";
            
          formattedCellValue += "</span>";
        }
      }

      return formattedCellValue;

    },

/******* original ***********
    formatSerialNumberCell: function (cellvalue, options) {
        var me = this,
            recordCollection = me.ruleCollection,
            rule = recordCollection.get(options.rowId),
            level = rule.get("rule-level"),
            isExpanded = rule.get("expanded"),
            isGroupNode = rule.isRuleGroup(),
            offSet = 10 * level,
            ruleName = rule.get("name"),
            returnValue;
        if (isGroupNode) {
            returnValue =  '<div class="tree-wrap tree-wrap-ltr" style="width:';
            returnValue += (18 + offSet);
            returnValue += 'px;"><div style="left:';
            returnValue += offSet;
            returnValue += 'px;" class="ui-icon ';
            if (isExpanded) {
                returnValue += ' ui-icon-triangle-1-s tree-minus  ';
            } else {
                returnValue += ' ui-icon-triangle-1-e tree-plus ';
            }
            returnValue += ' treeclick"></div></div><span class="cell-wrapper">';
            if (level == 0)
              returnValue += "<b>" + ruleName.toUpperCase() + "</b>";
            else
              returnValue += ruleName;
            returnValue += me.getCountText(rule);
            returnValue += '</span>';
            return returnValue;
        }

        return cellvalue;
    },
*************************/

    formatSerialNumberCell: function (cellvalue, options) {
        var me = this,
            recordCollection = me.ruleCollection,
            rule = recordCollection.get(options.rowId),
            level = rule.get("rule-level"),
            isExpanded = rule.get("expanded"),
            isGroupNode = rule.isRuleGroup(),
            offSet = 8 * level,
            ruleName = rule.get("name"),
            error_level = rule.get("error-level"),
            returnValue,
            margin_left = level !== 0 ? '-60px': '-87px';
        me.cuid = me.ruleCollection.cuid;
        if (isGroupNode) {
            returnValue =  '<div class = "rule-group-node" style = "display:table; margin-left:' + margin_left + ';" ><div class="tree-wrap tree-wrap-ltr" style="padding-left:0px; width:';
            returnValue += 16;  // (18 + offSet);
            returnValue += 'px;"><div style="padding-bottom: 10px; padding-left:';
            returnValue += 0;  // offSet;  //14;
            returnValue += 'px;" class="ui-icon ';
            if (isExpanded) {
                //returnValue += ' ui-icon-triangle-1-s tree-minus  ';
                if (level == 0) {
                  returnValue += ' icon-arrow-big-expand tree-minus ';
                  returnValue += ' treeclick">';  //</div></div>';
                } else {
                  //returnValue += ' icon-arrow-sm-expand tree-minus ';
                  returnValue += ' treeclick"><img src="/installed_plugins/base-policy-management/images/icon_arrow_small_down.png"/></div></div>';
                }
            } else {
                //returnValue += ' ui-icon-triangle-1-e tree-plus ';
                if (level == 0) {
                  returnValue += ' icon-arrow-big-collapse tree-plus ';
                  returnValue += ' treeclick">';  //</div></div>';
                } else {
                  //returnValue += ' icon-arrow-sm-collapse tree-plus ';
                  returnValue += ' treeclick"><img src="/installed_plugins/base-policy-management/images/icon_arrow_small_right.png"/></div></div>';
                }
            }
            //returnValue += ' treeclick"></div></div>';
            if (level == 0) {
              returnValue += '</div></div>';
              returnValue += '&nbsp&nbsp';
            }

            // propagate errors
            //error_level = 0;   // for testing
            if (error_level != -1) {         

              returnValue += "<span data-tooltip='" + me.cuid + "' style='margin-left: 0px; margin-right: 3px;'><div class=' "+me.policyManagementConstants.validation_icon[error_level].imgClass+" validate_icon' 'data-policy-id'="+recordCollection.policyID+  " 'data-error-level'="+error_level+  " 'data-row-id'="+options.rowId+  " 'data-cell-id'="+me.cuid+"></div></span>";

            }

            if (level == 0) {
              returnValue += "<b>" + ruleName.toUpperCase() + "</b>";
            } else {
              returnValue += ruleName;
            }

            returnValue += me.getCountText(rule);

            return returnValue + '</div>';

        } else {
          returnValue = '<span style="color: #989898">' + cellvalue + '</span>';
          return returnValue;
        }

        return cellvalue;
    },

    /**
     * It returns the rules count string while rendering the rule group name.
     * It displays the total count as '(Total <x>)'.
     * For custom rule group, the rule range is also displayed '(<x> - <y>, total <z>')
     * In case of filtered rules, it display '(Total <x>, filtered <y>)'
     */
    getCountText : function(rule) {
        var me = this,
            count =  rule.get('count'),
            countDisplayStr,
            isPredefined = rule.get('is-predefined'),
            sNoStart = rule.get('serial-number'),
            filteredCount = rule.get('filtered-count'),
            sNoEnd = sNoStart + count - 1,
            isFiltered = filteredCount !== undefined,
            rangeText, filteredText, filterDelimiter;


        if (count !== 0 && isFiltered) {
            filteredText = '<i>filtered: ' + filteredCount + ' of ' + count + '</i>';
            filterDelimiter = ', ';
        } else {
            filteredText = '';
            filterDelimiter = '';
        }

        if (!isPredefined && count !== 0) {
            if (sNoStart === sNoEnd) {
                rangeText = sNoStart;
                countDisplayStr = ' (Rule ';
            } else {
                rangeText = sNoStart + ' to ' + sNoEnd;
                countDisplayStr = ' (Rules ';
            }
            countDisplayStr += rangeText + filterDelimiter + filteredText + ')';
        } else {
            if (isFiltered && count !== 0) {
                countDisplayStr = ' (' + filteredText + ')';
            } else {
                countDisplayStr = ' (' + count;
                countDisplayStr += (count > 1) ? ' Rules)' : ' Rule)';
            }
        }

        return countDisplayStr;
    },
    // Latest structure for flat rules
    getConfiguration : function () {
      var me = this,
          context = me.context,
          ruleCollection = me.ruleCollection,
          actionButtons =  me.getActionButtons(context),
          columnConfig = me.getColumnConfiguration(),
          confirmationDialogConfig = me.getConfirmationDialogInfo(),
          policyManagementConstants = me.policyManagementConstants;
      if(new SMUtil().isDebugMode()){
        columnConfig.splice(4, 0,  {
            "index": "pageNum",
            "name": "pageNum",
            "label": "pageNum",
            "width": 30,
            "hidden": true,
            "formatter": $.proxy(function (a, b, c) {
            var r = this.ruleCollection;
            if(r.get(b.rowId).isRuleGroup()){
                return "";
            }
            return r.get(b.rowId).get('pageNum');
            }, me)
        },        {
          "index": "rowNum",
          "name": "rowNum",
          "label": "rowNum",
          "hidden": true,
          "width": 100,
          "formatter": $.proxy(function (a, b, c) {
            var r = this.ruleCollection;
            if(r.get(b.rowId).isRuleGroup()){
                return "";
            }
            return r.get(b.rowId).get('rowNum');
          }, me)
        });
      }

      return {
        "jsonRoot": "ruleCollection.rules",
        "jsonId": policyManagementConstants.JSON_ID,
        "height": me.tableHeight,
        "footer":false,
        "datatype": "local",
        "numberOfRows": policyManagementConstants.DEFAULT_PAGE_SIZE,
        "scroll": 1,
        "onSelectAll": false,
        "tableId": me.tableId,
        "multiselect": true,
        "editRow": {
            "showInline": true,
            "isRowEditable": me.isRowEditable,
            "onBeforeEdit": me.onBeforeEdit
        },
        "noResultMessage": " ",
        "contextMenu":{
//            "delete": context.getMessage('rulesGrid_contextMenu_delete')          
        }, //required to hide more menu
//        "filter": {
//          searchResult: function (value){
////            var data = self.data //data should contain the result of the search
//            console.log("serach enabled " + value);
//
//            return "";
//          }
//        },
        "actionButtons":actionButtons,
        "columns": columnConfig,
        "confirmationDialog": confirmationDialogConfig,
        "showWidthAsPercentage": false,
        "orderable": true
      };
    },

    //Features can override the same to return their desired buttons
    getActionButtons : function(context) {
        var me=this, 
        actionButtons = {
            "customButtons":[{
                "icon_type": true,
                "label": context.getMessage("rulesGrid_action_expandAll"),
                "key": "expandAllRules",
                "icon":{
                    "default": "icon_rulegrid_expandall",
                    "hover": "icon_rulegrid_expandall_hover"
//                    disabled: "icon_expandall_disable"
                }
            },{
                "icon_type": true,
                "label": context.getMessage("rulesGrid_action_collapseAll"),
                "key": "collapseAllRules",
                "icon":{
                    "default": "icon_rulegrid_collapseall",
                    "hover": "icon_rulegrid_collapseall_hover"
//                    disabled: "icon_expandall_disable"
                }
            }]
        };
        //
        if(me.showNavigationControls){
          actionButtons.customButtons.push({
            "icon_type": true,
            "label": "First",
            "key": "navigateToFirstRule",
            //"secondary": true,
            "disabledStatus": true,
            "icon":{
                "default": "block_icon_button_first",
                "hover": "block_icon_button_first_hover",
                "disabled": "block_icon_button_first_disable"
            }
          });
          //          
          actionButtons.customButtons.push({
            "icon_type": true,
            "label": "Previous",
            "key": "navigateToPreviousRule",
            //"secondary": true,
            "disabledStatus": true,
            "icon":{
                "default": "block_icon_button_previous",
                "hover": "block_icon_button_previous_hover",
                "disabled": "block_icon_button_previous_disable"
            }
          });
          //      
          actionButtons.customButtons.push({
            "icon_type": true,
            "label": "Next",
            "key": "navigateToNextRule",
            //"secondary": true,
            "disabledStatus": true,
            "icon":{
                "default": "block_icon_button_next",
                "hover": "block_icon_button_next_hover",
                "disabled": "block_icon_button_next_disable"
            }
          });
          //
          actionButtons.customButtons.push({
            "icon_type": true,
            "label": "Last",
            "key": "navigateToLastRule",
            //"secondary": true,
            "disabledStatus": true,
            "icon":{
                "default": "block_icon_button_last",
                "hover": "block_icon_button_last_hover",
                "disabled": "block_icon_button_last_disable"
            }
          });               
        }
        //        
        return actionButtons;
    },

    getConfirmationDialogInfo: function(){
        return "";
    }
  });

  return baseRulesConfiguration;
});
