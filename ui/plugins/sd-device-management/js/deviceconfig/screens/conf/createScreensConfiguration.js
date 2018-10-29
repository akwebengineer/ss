/**
 * Created by ramesha on 11/12/15.
 */
define(['../../../util/deviceConfigValidationUtility.js'], function(ValidationUtility) {

    var DeviceScreensConfiguration = function(caller) {
        var context = caller.context;
        var validationUtility = new ValidationUtility;
        this.getValues = function() {
            return {
                "tableId" : "device-screen-configuration-list",
                "numberOfRows" : 15,
                "height" : "auto",
                "scroll" : true,
                "width" : "auto",
                "multiselect" : "true",
                "parent-data-path" : caller.devicePathConfiguration + '/security/screen/ids-option',
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
                    "fetch-type" : "ALL"
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
                    "label" : context.getMessage('juniper.sd.deviceconfig.screen.grid.column.id'),
                    "hidden" : true
                }, {
                    "index" : "name",
                    "name" : "name",
                    "schema-path" : "name",
                    "label" : context.getMessage('juniper.sd.deviceconfig.screen.grid.column.name'),
                    "width" : "200px"
                },{
                    "index" : "description",
                    "name" : "description",
                    "schema-path" : "description",
                    "width" : "273px",
                    "label" : context.getMessage('juniper.sd.deviceconfig.screen.grid.column.description')
                },{
                    "index" : "status",
                    "name" : "status",
                    "sortable" : false,
                    "formatter" : validationUtility.formatStatus,
                    "schema-path" : "id-meta-data",
                    "width" : "120px",
                    "label" : context.getMessage('status_label')
                },{
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
                createEvent : "createDeviceScreen",
                updateEvent : "updateDeviceScreen",
                deleteEvent : "deleteDeviceScreen",
                activateEvent : {capabilities : ['ConfigEditorCap'],
                    name: "activateDeviceScreen"},
                deActivateEvent : {capabilities : ['ConfigEditorCap'],
                    name: "deActivateDeviceScreen"},
                toggleEvent : {capabilities : ['ConfigEditorCap'],
                    name: "toggleDeviceScreen"}
            };
        };
    };
    return DeviceScreensConfiguration;
});