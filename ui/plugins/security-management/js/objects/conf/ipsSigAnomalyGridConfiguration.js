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
                        "index": "ips_sig_anomaly_grid_number",
                        "name": "number",
                        "label": context.getMessage('ips_sig_grid_column_no'),
                        "sortable": false,
                        "width": 60,
                        "field-help": {
                           "content": context.getMessage('ips_sig_create_number_tooltip')
                        }            

                    },
                    {
                        "index": "ips_sig_anomaly",
                        "name": "anomaly",
                        "label": context.getMessage('ips_sig_grid_column_anomaly'),
                        "sortable": false,
                        "width": 370,
                        "field-help": {
                           "content": context.getMessage('ips_sig_create_add_anomaly_anomaly')
                        }        
                    },
                    {
                        "index": "ips_sig_anomaly_direction",
                        "name": "anomaly-direction",
                        "label": context.getMessage('ips_sig_grid_column_direction'),
                        "sortable": false,
                        "width": 200,
                        "field-help": {
                           "content": context.getMessage('ips_sig_create_add_anomaly_direction_tooltip')
                        }        
                    },
                    {
                        "index": "ips_sig_anomaly_id",
                        "name": "anomaly-id",
                        "label": context.getMessage('app_sig_grid_column_id'),
                        "sortable": false,
                        "width": 150,
                        "hidden": true
                    }
                ]
            };
        };

        this.getEvents = function() {
            return {
                createEvent: "createAnomalyAction",
                updateEvent: "updateAnomalyAction",                
                deleteEvent: "deleteAnomalyAction"
            };
        };
    };

    return Configuration;
});