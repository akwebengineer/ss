/**
 * Created by vinutht on 5/27/15.
 */

define([], function() {

    var Configuration = function(context) {
           this.formatTypeObject = function(cellValue, options, rowObject) {
                if(cellValue === 'application') {
                    return context.getMessage('app_sig_grid_cell_value_application');
                }
                else if(cellValue === 'protocol') {
                    return context.getMessage('app_sig_grid_cell_value_protocol');
                }
                else if(cellValue === 'group') {
                    return context.getMessage('app_sig_grid_cell_value_group');
                }
                else{
                    return cellValue;
                }
            };

        this.getValues = function() {

            return {
                "tableId": "app-sig-groups-grid",
                "numberOfRows": 20,
                "height": "200px",
                "repeatItems": "false",
                "multiselect": "true",
                "scroll": true,
                "jsonId": "id",
                "contextMenu": {

                 },
                 "filter": {
                    optionMenu: {
                        "showHideColumnsItem": {},
                        "customItems":[]
                    }
                },
                 "confirmationDialog": {
                        "delete": {
                            title: context.getMessage("appsig_grid_confDialogue_delete_title"),
                            question: context.getMessage("app_sig_Profile_grid_confDialogue_delete_question")
                        }
                },
                "columns": [
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('app_sig_group_grid_column_name'),
                        "width": 90
                    },
                    {
                        "index": "type",
                        "name": "type",
                        "label": context.getMessage('app_sig_group_grid_column_type'),
                        "width": 90,
                        "formatter": this.formatTypeObject
                    },
                    {
                        "index": "category",
                        "name": "category",
                        "label": context.getMessage('app_sig_group_grid_column_category'),
                        "width": 90
                    },
                    {
                        "index": "sub-category",
                        "name": "sub-category",
                        "label": context.getMessage('app_sig_group_grid_column_subCategory'),
                        "width": 100
                    },
                    {
                        "index": "risk",
                        "name": "risk",
                        "label": context.getMessage('app_sig_group_grid_column_risk'),
                        "width": 90
                    },
                    {
                        "index": "characteristic",
                        "name": "characteristic",
                        "label": context.getMessage('app_sig_group_grid_column_characteristic'),
                        "width": 110
                    },
                    {
                        "index": "device-compatibility",
                        "name": "device-compatibility",
                        "label": context.getMessage('app_sig_group_grid_column_device_compatibility'),
                        "width": 150
                    },
                    {
                        "index": "definition-type",
                        "name": "definition-type",
                        "label": context.getMessage('app_sig_group_grid_column_predefined_custom'),
                        "width": 120,
                        "hidden": true
                    },
                    {
                        "index": "id",
                        "name": "id",
                        "label": context.getMessage('app_sig_group_grid_column_id'),
                        "width": 90,
                        "hidden": true
                    },
                    {
                        "index": "domain-name",
                        "name": "domain-name",
                        "label": context.getMessage('app_sig_group_grid_column_domain'),
                        "width": 90,
                        "hidden": true
                    }
                ]
            };
        };

        this.getEvents = function() {

            return {
                 createEvent: "createEvent",
                 deleteEvent: "deleteEvent"
            };
        };
    };

    return Configuration;
});
