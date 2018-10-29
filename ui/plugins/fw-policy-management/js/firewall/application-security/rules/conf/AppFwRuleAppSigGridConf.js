/**
 * Created by vinutht on 5/27/15.
 */

define([], function() {

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "tableId": "appfw-sig-grid",
                "numberOfRows": 20,
                "height": "100px",
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": true,
                "jsonId": "id",
                "getData": function () {
                    var self = this;
                    $(self).addRowData('', "");
                },
                "contextMenu": {},
                "confirmationDialog": {
                    "delete": {
                        title: 'Warning',
                        question: 'Are you sure you wish to delete selected Application Signatures?'
                    }
                },
                "columns": [
                    {
                        "index": "id",
                        "name": "id",
                        "label": context.getMessage('app_sig_grid_column_id'),
                        "hidden": true
                    },
                    {
                        "index": "domain-id",
                        "name": "domain-id",
                        "hidden": true
                    },
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
                        "width": 90
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
                        "width": 120
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
                        "width": 130
                    },
                    {
                        "index": "device-compatibility",
                        "name": "device-compatibility",
                        "label": context.getMessage('app_sig_group_grid_column_device_compatibility'),
                        "width": 160
                    }
                ]
            };
        };

        this.getEvents = function() {

            return {
                createEvent: "createAction",
                deleteEvent: "deleteEvent"
            };
        };
    };

    return Configuration;
});
