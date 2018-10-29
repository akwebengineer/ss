/**
 * Created by vinutht on 5/27/15.
 */

define([], function() {

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "tableId": "app-sig-protocols-grid",
                "numberOfRows": 20,
                "height": "200px",
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": true,
                "jsonId": "id",
                "getData": function () {
                    var self = this;
                    $(self).addRowData('', "");
                },
                "contextMenu": {
                  "edit": context.getMessage('app_sig_protocol_grid_edit'),
                  "delete": context.getMessage('app_sig_protocol_grid_delete')
                 },
                "columns": [
                    {
                        "index": "app_sig_proto_grid_context",
                        "name": "context",
                        "label": context.getMessage('app_sig_proto_grid_column_context'),
                        "width": 90
                    },
                    {
                        "index": "app_sig_proto_grid_direction",
                        "name": "direction",
                        "label": context.getMessage('app_sig_proto_grid_column_direction'),
                        "width": 90
                    },
                    {
                        "index": "app_sig_proto_grid_pattern",
                        "name": "pattern",
                        "label": context.getMessage('app_sig_proto_grid_column_pattern'),
                        "width": 90
                    }
                ]
            };
        };

        this.getEvents = function() {
            return {
                createEvent: "createAction",
                updateEvent: "modifyAction",
                deleteEvent: "deleteAction"
            };
        };
    };

    return Configuration;
});
