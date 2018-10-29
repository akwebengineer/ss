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
                "multiselect": false,
                // "onSelectAll": false,
                "scroll": true,
                "sorting": false,
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
                        "label": context.getMessage('app_sig_proto_grid_column_context'),
                        "width": 90
                    },
                    {
                        "index": "ips_sig_proto_grid_direction",
                        "name": "direction",
                        "label": context.getMessage('app_sig_proto_grid_column_direction'),
                        "width": 90
                    },
                    {
                        "index": "ips_sig_proto_grid_pattern",
                        "name": "pattern",
                        "label": context.getMessage('app_sig_proto_grid_column_pattern'),
                        "width": 90
                    },
                    {
                        "index": "ips_sig_proto_grid_regex",
                        "name": "regex",
                        "label": "Regex",
                        "width": 90
                    },
                                        {
                        "index": "ips_sig_proto_grid_negated",
                        "name": "negated",
                        "label": context.getMessage('ips_sig_grid_column_negated'),
                        "sortable": false,
                        "width": 70
                    }                     
                ]
            };
        };

        this.getEvents = function() {
            
        };
    };

    return Configuration;
});
