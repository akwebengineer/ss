/**
 * Created by wasima on 5/27/15.
 */

define([], function() {

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "tableId": "ips-sig-grid",
                "numberOfRows": 20,
                "height": "200px",
                "repeatItems": "true",
                "singleselect": "true",
                "footer":false,
                "scroll": true,
                "jsonId": "id",
                "getData": function () {
                    var self = this;
                    $(self).addRowData('', "");
                },
                "contextMenu": {
                    "edit": context.getMessage('ips_sig_protocol_grid_edit'),
                    "delete": context.getMessage('ips_sig_protocol_grid_delete')
                },
                "columns": [
                    {
                        "index": "ips_sig_proto_grid_number",
                        "name": "number",
                        "label": context.getMessage('ips_sig_grid_column_no'),
                        "sortable": false,
                        "width": 50
                    },
                    {
                        "index": "ips_sig_proto_grid_context",
                        "name": "context",
                        "label": context.getMessage('ips_sig_grid_column_context'),
                        "sortable": false,
                        "width": 170
                    },
                    {
                        "index": "ips_sig_proto_grid_direction",
                        "name": "direction",
                        "label": context.getMessage('ips_sig_grid_column_direction'),
                        "sortable": false,
                        "width": 100
                    },
                    {
                        "index": "ips_sig_proto_grid_pattern",
                        "name": "pattern",
                        "label": context.getMessage('ips_sig_grid_column_pattern'),
                        "sortable": false,
                        "width": 120
                    },
                    {
                        "index": "ips_sig_proto_grid_regex",
                        "name": "regex",
                        "label": context.getMessage('ips_sig_grid_column_regex'),
                        "sortable": false,
                        "width": 120
                    },
                    {
                        "index": "ips_sig_proto_grid_negated",
                        "name": "negated",
                        "label": context.getMessage('ips_sig_grid_column_negated'),
                        "sortable": false,
                        "width": 70,
                        "field-help": {
                           "content": context.getMessage('ips_sig_create_negated_tooltip')
                        }
                    }                     
                ]
            };
        };

        this.getEvents = function() {
            return {
                createEvent: "createContextAction",
                updateEvent: "updateContextAction",                
                deleteEvent: "deleteContextAction"
            };
        };
    };

    return Configuration;
});
