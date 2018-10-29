/**
 * Created by wasima on 5/27/15.
 */

define([], function() {

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "tableId": "ips-sig-anomaly-grid",
                "numberOfRows": 20,
                "height": "200px",
                "repeatItems": "true",
                "multiselect": false,
                "scroll": true,
                "jsonId": "id",
                "sorting" : false,
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
                        "index": "ips_sig_anomaly_grid_number",
                        "name": "number",
                        "label": context.getMessage('ips_sig_grid_column_no'),
                        "sortable": false,
                        "width": 60
                    },
                    {
                        "index": "ips_sig_anomaly",
                        "name": "anomaly",
                        "label": "Anomaly",
                        "width": 270
                    },
                    {
                        "index": "ips_sig_anomaly_direction",
                        "name": "anomaly-direction",
                        "label": context.getMessage('app_sig_proto_grid_column_direction'),
                        "width": 150
                    },
                    {
                        "index": "ips_sig_anomaly_id",
                        "name": "anomaly-id",
                        "label": context.getMessage('app_sig_grid_column_id'),
                        "width": 150,
                        "hidden": true
                    }                                        
                ]
            };
        };

        this.getEvents = function() {
            
        };
    };

    return Configuration;
});