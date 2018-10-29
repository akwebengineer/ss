/**
 * Created by ramesha on 8/31/15.
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
                "tableId": "app-sig-protocols-grid",
                "numberOfRows": 20,
                "height": "200px",
                "repeatItems": "true",
                "scroll": true,
                "jsonId": "id",
                "getData": function () {
                    var self = this;
                    $(self).addRowData('', "");
                },
                "contextMenu": {
              //  "edit"  : context.getMessage("app_sig_grid_edit")
                 },
                "actionButtons":{
                        "customButtons":
                             []
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
                    }/*,
                    {
                        "index": "definition-type",
                        "name": "definition-type",
                        "label": context.getMessage('app_sig_group_grid_column_predefined_custom'),
                        "width": 120
                    },
                    {
                        "index": "id",
                        "name": "id",
                        "label": context.getMessage('app_sig_group_grid_column_id'),
                        "width": 90
                    },
                    {
                        "index": "domain-name",
                        "name": "domain-name",
                        "label": context.getMessage('app_sig_group_grid_column_domain'),
                        "width": 90
                    }*/
                ]
            };
        };

        this.getEvents = function() {

            return {
            //     updateEvent: "updateEvent"
            };
        };
    };

    return Configuration;
});
