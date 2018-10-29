/**
 * @module ExportCSV
 * @author Anupama <athreyas@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function() {
    var Configuration = function(context) {
        this.getValues = function() {
            return {
                "form_id": "export_csv_form",
                "form_name": "export_csv_form",
                "title": "Export to CSV",
                "on_overlay": true,
                "sections": [
                {
                    "elements": [{
                        "element_description": true,
                        "id": "export_csv",
                        "name": "export_csv"
                    }]
                }],
                "buttonsAlignedRight": true,
                "buttons": [{
                    "id": "export_csv_cancel",
                    "name": "export_csv_cancel",
                    "value": context.getMessage('cancel')
                }]
            };
        };
    };
    return Configuration;
});
