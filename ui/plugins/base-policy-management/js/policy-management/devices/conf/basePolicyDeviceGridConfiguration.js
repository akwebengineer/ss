/**
 * A configuration object with the parameters required to build a Grid widget for devices having Rules
 *
 * @module basePolicyDeviceGridConfiguration
 * @author Vinamra <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
'../../../../../sd-common/js/devices/conf/devicesGridConfigurationColumn.js',
'../../../../../ui-common/js/common/restApiConstants.js'
], function (ColumnConfig, RestApiConstants) {
  var basePolicyDeviceGridConfiguration = function (context) {};

  _.extend(basePolicyDeviceGridConfiguration.prototype, {

    //defined to get the title for grid
    gridTitleString: undefined,
    //defined to get help content
    gridTitleHelpContentString: undefined,

    //External help (More..)
    gridUAHelp: undefined,

    //defined to get teh table Id
    tableId:undefined,
    //defined to get the rules link
    linkToRules:undefined,

    tableHeight: '700px',

    // selection
    singleselect: undefined,

    initialize: function(context,policyManagementConstants) {
      this.context = context;
      this.policyManagementConstants = policyManagementConstants;
    },

    getDeviceGridConfiguration : function () {
      var me = this,
          context = me.context,
          actionButtons =  me.getActionButtons(),
          columnConfig = (new ColumnConfig(context)).getValues(),
          policyManagementConstants = me.policyManagementConstants,
          linkToRules = me.linkToRules;

      columnConfig= _.filter(columnConfig, function(el) { 
        return (el.index === "id" || el.index === "device-id" || el.index === "name" || el.index === "domain-id" || el.index === "platform" || el.index === "device-ip" || el.index === "assigned-services" || el.index === "pending-services" || 
          el.index === "installed-services" || el.index === "domain-name");
      });

      columnConfig.splice(3, 0, {
          "index":"rule-count",
          "name" : "rule-count",
          "label": context.getMessage("grid_column_rules"),
          "width": 120,
          "formatter": me.linkToRules
      });

      var namedata = _.findWhere(columnConfig,{index:'name'});
      if (namedata) {
         namedata.width = 270;
      }   

      return {
        "title": me.context.getMessage(me.gridTitleString),
        "title-help": {
                    "content": context.getMessage(me.gridTitleHelpContentString),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey(me.gridUAHelp)
                },
        "tableId": me.tableId,
        "url" : policyManagementConstants.DEVICES_URL,
        "jsonRoot": "devices.device",
        "jsonId": "id",
        'singleselect': me.singleselect,
        "jsonRecords": function( data ) {
          return data [ 'devices' ] [ RestApiConstants.TOTAL_PROPERTY ];
        },

        "ajaxOptions": {
            headers: {                       
                "Accept": policyManagementConstants.DEVICES_MEDIATYPE
            }
        },

        "height": "auto",
        "numberOfRows": 20,
        "scroll": true,
        "actionButtons":actionButtons,
        "columns": columnConfig,
        "filter": {
            searchUrl: true,
            columnFilter: true,
            showFilter: false,
            optionMenu: {
                "showHideColumnsItem": {},
                "customItems": []
            }
        }        
      };
    },

    //Features can override the same to return their desired buttons
    getActionButtons : function() {
        var actionButtons = {
            "defaultButtons": { // overwrite default CRUD grid buttons
            }
            //"actionStatusCallback": this.setCustomActionStatus
        };
        return actionButtons;
    },

    setCustomActionStatus : function (selectedRows, updateStatusSuccess, updateStatusError) {
          if( !selectedRows || !selectedRows.selectedRows ){
            return;
          }
          var self = this;
          var first = true;
          var url = self.policyManagementConstants.DEVICES_URL + "?filter=(";
          selectedRows.selectedRows.forEach( function( device ) {
            if (first === true){
              first = false;
            } else {
              url = url + " or ";
            }
            url = url + "id eq " + device["device-id"];
          });
          url = url + ")";

           $.ajax({
               url: url,
               type: 'get',
               async: false,
               headers: {
                 'accept' : self.policyManagementConstants.DEVICES_MEDIATYPE
                 //'accept': 'application/vnd.net.juniper.space.device-management.devices+json;version="1"'
               },
               success: function(data, status) {
                 if(data && data.devices){
                   //deviceObjects = data.devices.device;
                 }
               },
               error: function() {
                   console.log('No Devices Found');
               }
           });
    }
  });

  return basePolicyDeviceGridConfiguration;
});
