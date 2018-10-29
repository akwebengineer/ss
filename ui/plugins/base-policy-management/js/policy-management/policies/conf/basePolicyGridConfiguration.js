/**
 * A configuration object with the parameters required to build a Grid widget for policies
 *
 * @module basePolicyGridConfiguration
 * @author Sandhya B <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../ui-common/js/common/restApiConstants.js',
    '../../../../../sd-common/js/publish/constants/publishConstants.js'
], function (RestApiConstants, PublishConstants) {
  var basePolicyGridConfiguration = function (context) {};

  _.extend(basePolicyGridConfiguration.prototype, {

    //defined to get the title for grid
    gridTitleString: undefined,
    //defined to get the tableId for grid
    tableId:undefined,
    //defined to get the rules link
    linkToRules:undefined,

    tableHeight: '700px',

    multiselect: true,

      /**
       * Sets the dropdown for publish state column filter
       * @returns {Array} Filter options
       */
    publishSearchData : function(){
        var me = this, publishSearchValues = [], key;

        for (key in PublishConstants.PUBLISH_STATE) {

            if (PublishConstants.PUBLISH_STATE.hasOwnProperty(key) && key !== 'DELETED') {
                publishSearchValues.push({
                    'label': me.context.getMessage(PublishConstants.PUBLISH_STATE[key]),
                    'value': key
                });
            }
        }
       return publishSearchValues;
    },

    initialize: function(context,collection,policyManagementConstants) {
      this.context = context;
      this.collection = collection;
      this.policyManagementConstants = policyManagementConstants;
    },

    isGroupNode : function(rowObject){
      var me = this,policy = me.getPolicyRecord(rowObject.id);
      return policy.get("isStatic");
    },

    getPolicyRecord : function(id) {
      var me = this,recordCollection = me.collection;
      return recordCollection.get(id);
    },

    formatDeviceCountCell : function(cellvalue,options,rowObject){
      var me = this;
      if (me.isGroupNode(rowObject)) {
        return "";
      }
      var policy = me.getPolicyRecord(rowObject.id),
          deviceCount = policy? policy.get('device-count') : 0,
          isDevicePolicy = policy? policy.isDevicePolicy() : false;

      if (deviceCount === 0) {
        return "";
      }

      cellvalue = isDevicePolicy? policy.get('device-list').devices[0].name : deviceCount;

      return Slipstream.SDK.Renderer.render(me.policyTemplate, {"policyId": rowObject.id,
        "cellValue": cellvalue,
        "id":"device-count",
        "launchWizard":false});
    },

    formatPublishStateCell : function(cellvalue,options,rowObject){
        var me = this, policy = me.getPolicyRecord(rowObject.id), state, cellValue = '';

        if (me.isGroupNode(rowObject)) {
            return "";
        }
        // get the state
        state = policy.get('publish-state');
        // return te formatted value
        cellValue = me.context.getMessage(PublishConstants.PUBLISH_STATE[state]);
        return cellValue;
    },

    formateDateCell : function (cellValue, options, rowObject) {
      var me = this,policy=me.getPolicyRecord(rowObject.id);
      if (me.isGroupNode(rowObject)) {
        return "";
      }
      var date = new Date(policy.get('last-modified-time'));
      return Slipstream.SDK.DateFormatter.format(date, "ddd MMM DD,YYYY h:mm A"); 
    },

    formatNameCell : function (cellValue, options, rowObject) {
        var me = this,policy=me.getPolicyRecord(rowObject.id);
      if (me.isGroupNode(rowObject)) {
        return "";
      }
      return Slipstream.SDK.Renderer.render(me.policyTemplate, {"policyId": rowObject.id,
        "cellValue": policy.get('name'),
        "id":"ruleLink",
        "launchWizard":false});
    },

    formatUserNameCell : function(cellValue, options, rowObject) {
      var me = this,policy=me.getPolicyRecord(rowObject.id);
      if (me.isGroupNode(rowObject)) {
        return "";
      } 
      return policy.get("last-modified-by-user-name")?policy.get("last-modified-by-user-name"):"";  
    },

    formatCreatedByUserNameCell : function(cellValue, options, rowObject) {
      var me = this,policy=me.getPolicyRecord(rowObject.id);
      if (me.isGroupNode(rowObject)) {
        return "";
      } 
      var createdBy = policy.get("created-by-user-name")?policy.get("created-by-user-name"):"";
      createdBy = policy.get("policy-type") === "GLOBAL"?"System":createdBy;
      return createdBy;  
    },

    formatDomainNameCell : function(cellValue, options, rowObject) {
      var me = this;
      if (me.isGroupNode(rowObject)) {
        return "";
      } 
      return Juniper.sm.DomainProvider.getDomainName(rowObject["domain-id"]);
    },

    formatRuleCountCell : function(cellValue, options, rowObject) {
        return "";
    },

    formatSequenceNumberCell: function (cellvalue, options, rowObject) {
      var me = this,policy=me.getPolicyRecord(rowObject.id),
          level = 1,
          isExpanded = policy.get("expanded"),
          offSet = 10 * level,
          returnValue;
      if (me.isGroupNode(rowObject)) {
        returnValue =  '<div class="tree-wrap tree-wrap-ltr" style="width:';
        returnValue += (18 + offSet);
        returnValue += 'px; margin-left: -55px;"><div style="left:';
        returnValue += offSet;
        returnValue += 'px;" class="ui-icon ';
        if (isExpanded) {
          returnValue += ' ui-icon-triangle-1-s tree-minus  ';
        } else {
          returnValue += ' ui-icon-triangle-1-e tree-plus ';
        }
        returnValue += ' treeclick"></div></div><span class="cell-wrapper" style = "margin-left: -25px;"><b>';
        returnValue += policy.get("name");
        returnValue += '</b></span>';
        return returnValue;
      }

      return policy.get('sequence-number') ?  policy.get('sequence-number') : "";
     },

     formatIconsCell: function (cellvalue,options, rowObject) {
      var me = this,policy=me.getPolicyRecord(rowObject.id);
      var formattedCellValue;
      formattedCellValue = "<span>";
      formattedCellValue += "<span data-tooltip='" + rowObject.id + 
          "' style='margin-left: 0px; margin-right: 3px;'><div class='icon_lock_policy'></div></span>";   
      formattedCellValue += "</span>";
      if (me.isGroupNode(rowObject)) { 
        return "";
      } else{
        return policy.get("locked-for-edit")? formattedCellValue : "";
      }
    },

      /**
       * Sets title help if required
       * @returns {*}
       */
    getTitleHelp: function() {
        var me = this , help;
        if (me.gridTitleHelp) {
            help = {
                "content": me.context.getMessage(me.gridTitleHelp),
                "ua-help-text": me.context.getMessage('more_link'),
                "ua-help-identifier": me.context.getHelpKey(me.gridUAHelp)
            }
        }
        return help;

    },

    getPolicyGridConfiguration : function () {
      var me = this,
          context = me.context,
          contextName =this.context.ctx_name,

          actionButtons =  me.getActionButtons(),
          columnConfig = me.getColumnConfiguration(),
          
          
          policyManagementConstants = me.policyManagementConstants,
          confirmationDialog = me.getConfirmationDialog();
          contextMenu = me.getContextMenu();

      return {
        "footer": {
          getTotalRows: function() {
            return 0;
          }
        },
        "title": me.gridTitleString ? me.context.getMessage(me.gridTitleString): undefined,
        "title-help": me.getTitleHelp(),
        "tableId": me.tableId,
        "datatype": "local",
        "multiselect": me.multiselect,
        "jsonRoot": "policies.policy",
        "numberOfRows": 9999,
        "jsonId": "id",
        "ajaxOptions": {
            headers: {
              "Accept":policyManagementConstants.POLICIES_ACCEPT_HEADER
          }
        },
        "scroll": true,
        "height": policyManagementConstants.TABLE_HEIGHT,
        "actionButtons":actionButtons,
        "columns": columnConfig,
        "contextMenu": contextMenu,
        "confirmationDialog": confirmationDialog,
        "noResultMessage": " ",
        "orderable": true,
        "contextMenuStatusCallback" :function(selectedRows, updateStatusSuccess, updateStatusError){
          //If user is doing a right click on the Group row in the policy page then context menu should not appear
          if(selectedRows.selectedRowIds[0] <= 0) {
            updateStatusSuccess();
          } else {
            updateStatusSuccess({
              "edit": selectedRows.numberOfSelectedRows == 1 && selectedRows.isRowEnabled ? true : false,
              "copy": selectedRows.numberOfSelectedRows > 2
            });
          }
        }
      };
    },

    //Features can override the same to return their desired buttons
    getActionButtons : function() {
        var actionButtons = {
            "customButtons":[{
                "button_type": true,
                "label": this.context.getMessage("publish_context_menu_title"),
                "key": "publishEvent",
                "disabledStatus": true,
                "secondary": true
            },
            {
                "button_type": true,
                "label": this.context.getMessage("update_context_menu_title"),
                "key": "updatePolicyEvent",
                "disabledStatus": true,
                "secondary": true
            }]
        };
        return actionButtons;
     },

     //Features can override the same to return their desired confirmation messages for delete
     getConfirmationDialog : function() {},
     
     //Features can override the same to return their desired menus
     getContextMenu : function() {
           
        var context = this.context,me = this,
        menuItemEnablehandler = $.proxy(function(eventName, selectedItems) {
          return !Juniper.sm.DomainProvider.isInGlobalDomain();
        },me),
        contextMenu = {
                "edit": context.getMessage('grid_edit_policy'),
                "delete": context.getMessage('grid_delete_policy'),
                "custom":[
                    {
                        "label":context.getMessage('nat_policyGrid_contextMenu_assignDevices'),
                        "key":"assignDevicesEvent",
                        "scope": me,
                        "isDisabled": $.proxy(function(eventName, selectedItems) {
                            if (selectedItems.length === 1) {
                              var policy = me.collection.get(selectedItems[0]["id"]);
                              return (policy.isDevicePolicy() && policy.get("device-count") == 1) ||
                               policy.isPolicyLocked() || policy.isDifferentDomainPolicy() || policy.isGlobalPolicy();
                            }
                            return true;
                        },me)                        
                    },
                    {
                        "label": context.getMessage('nat_policyGrid_contextMenu_comparePolicy'),
                        "key": "comparePolicyEvent",
                        "scope": me,
                        "isDisabled": $.proxy(function(eventName, selectedItems) {
                            if (selectedItems.length == 1) {
                              return false;
                            }
                            return true;
                        },me)
                    },
                    {
                        "label": context.getMessage('manage_rollback_policy'),
                        "key": "manageRollbackEvent",
                        "scope": me,
                        "isDisabled": $.proxy(function(eventName, selectedItems) {
                            if (selectedItems.length == 1) {
                              return false;
                            }
                            return true;
                        },me)

                    },
                    {
                      "label": context.getMessage('export_policy_to_pdf'),
                      "key":"exportPolicyEvent",
                      "scope": me,
                      "isDisabled": $.proxy(function(eventName, selectedItems) {
                            if (selectedItems.length === 0 || selectedItems.length > 1) {
                              return true;
                            }
                            var policy = me.collection.get(selectedItems[0]["id"]);
                            return (!policy.get('rule-count')) || policy.get('rule-count') === 0;
                        },me)
                    },
                    {
                        "label": context.getMessage('export_policy_to_json'),
                        "key": "exportPolicyEventJson",
                        "scope": me,
                        "isDisabled": $.proxy(function(eventName, selectedItems) {
                            if (selectedItems.length == 1) {
                              return false;
                            }
                            return true;
                        },me)

                    },
                    {
                        "label": context.getMessage('import_policy_from_json'),
                        "key": "importPolicyEvent",
                        "scope": me,
                        "isDisabled": $.proxy(function(eventName, selectedItems) {
                            return false;
                        },me)

                    },
                    {
                        label: context.getMessage('grid_template_builder'),
                        key: 'ruleNameTemplateBuilderEvent',
                        "isDisabled": menuItemEnablehandler
                    },

                    {
                        "label":context.getMessage('policyGrid_contextMenu_unlockPolicy'),
                        "key":"unlockPolicyEvent",
                        "scope": me,
                        "isDisabled": $.proxy(function(eventName, selectedItems) {
                            if (selectedItems.length === 1) {
                                var policy = me.collection.get(selectedItems[0]["id"]);
                                return !policy.isPolicyLocked() || policy.isDifferentDomainPolicy();
                            }
                            return true;
                        },me)                        
                    },
                    {
                        "label":context.getMessage('policyGrid_contextMenu_unassignDevice'),
                        "key":"unassignDeviceEvent",
                        "scope": me,
                        "isDisabled": $.proxy(function(eventName, selectedItems) {
                            if (selectedItems.length == 1) {
                                var policy = me.collection.get(selectedItems[0]["id"]);
                                return !(policy.get("device-count") == 1 && policy.get("policy-type") === "DEVICE") ||
                                policy.isPolicyLocked() || policy.isDifferentDomainPolicy();
                            }
                            return true;
                        },me)                        
                    }
                ]
            };
        return contextMenu;
          
       },

       getColumnConfiguration : function() {
          var context = this.context;
          var me = this;
          var columns = [
              {
                  "index": "id",
                  "name": "id",
                  "hidden": true,
                  "width": 50
              },
              {
                "index": "icons",
                "name":  "icons",
                "label": "",
                "width": 30,
                "formatter": $.proxy(me.formatIconsCell, me),
                "fixed": true,
                "resizable": false,
                "sortable": false
              },
              {
                "index": "sequenceNumber",
                "name": "sequence-number",
                "classes": "rule-grid-group-object",
                "label": context.getMessage("rulesGrid_column_serialNumber"),
                "width": 50,
                "formatter": $.proxy(me.formatSequenceNumberCell, me),
                "sortable":true,
                 "fixed": true,
                 "resizable": false
              },
              {
                  "index": "name",
                  "name": "name",
                  "hideHeader": "true",
                  "label": context.getMessage("grid_column_name"),
                  "width": 200,
                  "formatter": $.proxy(me.formatNameCell, me),
                  "searchCell": true,
                  "sortable":true
              },
              {
                  "index":"ruleCount",
                  "name" : "rule-count",
                  "label": context.getMessage("grid_column_rules"),
                  "width": 100,
                  "formatter" : $.proxy(me.formatRuleCountCell, me),
                  "sortable":false
              },
              {
                  "index":"devices",
                  "name" : "device-count",
                  "label": context.getMessage("grid_column_devices"),
                  "width": 100,
                  "formatter" : $.proxy(me.formatDeviceCountCell,me),
                  "searchCell": true,
                  "sortable":false
              },
              {
                  "index": "publishState",
                  "name": "publish-state",
                  "label": context.getMessage("policy_service_grid_column_publish_state"),
                  "width": 120,
                  "formatter" : $.proxy(me.formatPublishStateCell,me),
                  "searchCell": {
                       "type": 'dropdown',
                       "values":me.publishSearchData()
                  },
                  "sortable":false
              },
              {
                  "index": "lastModifiedTime",
                  "name": "last-modified-time",
                  "label": context.getMessage("grid_column_last_modified_time"),
                  "width": 200,
                  "formatter" : $.proxy(me.formateDateCell,me),
                  "searchCell":{
                      "type": "date"
                  },
                  "sortable":false
              },
              {
                  "index": "createdByUserName",
                  "name": "created-by-user-name",
                  "label": context.getMessage("grid_column_created_by"),
                  "width": 120,
                  "searchCell": true,
                  "formatter" : $.proxy(me.formatCreatedByUserNameCell,me),
                  "sortable":false
              },
              {
                  "index": "lastModifiedByUserName",
                  "name": "last-modified-by-user-name",
                  "label": context.getMessage("grid_column_last_modified_by"),
                  "width": 120,
                  "searchCell": true,
                  "formatter" : $.proxy(me.formatUserNameCell,me),
                  "sortable":false
              },
              {
                  "index": "domain",
                  "name": "domain-name",
                  "label": context.getMessage('grid_column_domain'),
                  "width": 100,
                  "formatter" : $.proxy(me.formatDomainNameCell,me),
                  "sortable":false
              },
              {
                  "index":"policy-position",
                  "name" : "policy-position",
                  "hidden": true,
                  "label": context.getMessage("grid_column_policyState"),
                  "width": 200,
                  "sortable":false
              },
              {
                  "index":"policy-type",
                  "name" : "policy-type",
                  "hidden": true,
                  "label": context.getMessage("grid_column_policyState"),
                  "width": 200,
                  "sortable":false
              }
          ];
          return columns;
       }
  });

  return basePolicyGridConfiguration;
});
