define(['../../../util/deviceConfigValidationUtility.js'], function(ValidationUtility) {

  var ZonesGridConfiguration = function(caller) {
    var context = caller.context;
    var validationUtility = new ValidationUtility;
    this.initerfaceCellRenderer = function (cellvalue,options,rowObject ) {
    if(cellvalue.indexOf("/security/zones/security-zone") !== -1){
      var i, l , interfaces = JSON.parse(cellvalue);
      for (i in interfaces) {
        if(interfaces.hasOwnProperty(i)) {
          interfaces = interfaces[i];
          break;
        }
      }
      for(i=0,l= interfaces.length; i < l ;++i) {
        interfaces[i] = interfaces[i].name || interfaces[i];
      }
      return interfaces.join(', ');
      }
      else
      {
        return cellvalue;
      }
    };
    this.getValues = function() {

      return {
        "tableId" : "zones-configuration-list",
        "numberOfRows" : 15,
        "height" : "auto",
        "width" : "auto",
        "scroll":true,
        "multiselect" : "true",
        "parent-data-path" : [caller.devicePathConfiguration + '/security/zones/security-zone'],
        "jsonId" : "row-id",
        "scope" : caller,
        "parent-scope" : caller,
        "activateAction" : {
            "enable" : true,
            "onSuccess" : caller.activateMetaDataOnSuccess,
            "onFailure" : caller.activateMetaDataOnSuccess
        },
        "deactivateAction" : {
            "enable" : true,
            "onSuccess" : caller.deActivateMetaDataOnSuccess,
            "onFailure" : caller.deActivateMetaDataOnSuccess
        },

        "toggleAction" : {
            "enable" : true,
            "onSuccess" : caller.toggleMetaDataOnSuccess,
            "onFailure" : caller.toggleMetaDataOnSuccess
        },
        "searchAction" : {
          "enable" : true,
          "fetch-type": "ALL"
        },
        "contextMenu" : {
        },
        "confirmationDialog" : {
          "delete" : {
            title : 'Warning',
            question : 'Are you sure you want to delete selected record'
          }
        },
        "columns" : [{
          "index" : "rowId",
          "name" : "row-id",
          "schema-path" : "id",
          "hidden" : true
        },
        {
          "index" : "name",
          "name" : "name",
          "schema-path" : "name",
            "label" : context.getMessage('juniper.sd.deviceconfig.zone.grid.column.name'),
            "width" : "200px"
          },
          {
            "index" : "interfaces",
            "name" : "interfaces",
            "schema-path" : "interfaces/",
            "formatter" : this.initerfaceCellRenderer,
            "label" : context.getMessage('juniper.sd.deviceconfig.zone.grid.column.interfaces'),
            "width" : "150px"
          },
          {
            "index" : "screen",
            "name" : "screen",
            "schema-path" : "screen",
            "label" : context.getMessage('juniper.sd.deviceconfig.zone.grid.column.screen'),
            "width" : "150px"
          },
          {
            "index" : "description",
            "name" : "description",
            "schema-path" : "description",
            "width" : "273px",
            "label" : context.getMessage('juniper.sd.deviceconfig.zone.grid.column.description')
          },
          {
            "index" : "status",
            "name" : "status",
            "sortable" : false,
            "formatter" : validationUtility.formatStatus,
            "schema-path" : "id-meta-data",
            "width" : "120px",
            "label" : context.getMessage('status_label')
          },
          {
            "index" : "id-meta-data",
            "name" : "id-meta-data",
            "sortable" : false,
            "formatter" : validationUtility.formatIdMetaData,
            "schema-path" : "id-meta-data",
            "label" : context.getMessage('row_id_label'),
            "hidden" : true
         }]
      };
    };
    this.getEvents = function() {
      return {
        createEvent : "createZone",
        updateEvent : "editZone",
        deleteEvent : "deleteZone",
        activateEvent : {capabilities : ['ConfigEditorCap'],
            name: "activateDeviceZone"},
        deActivateEvent : {capabilities : ['ConfigEditorCap'],
            name: "deActivateDeviceZone"},
        toggleEvent : {capabilities : ['ConfigEditorCap'],
            name: "toggleDeviceZone"}
      };
    };
  };
  return ZonesGridConfiguration;
});