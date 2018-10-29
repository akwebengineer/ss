/**
 * Created by wasima on 8/24/15.
 */

define([], function() {

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "tableId": "ips-sig-static-group-grid",
                "numberOfRows": 20,
                "height": "300px",
                "repeatItems": "false",
                "multiselect": "true",
                "scroll": true,
                "jsonId": "id",
                /*"getData": function () {
                    var self = this;
                    $(self).addRowData('', "");
                },*/
                "contextMenu": {

                 },
                "confirmationDialog": {
                    "delete": {
                        title: context.getMessage("ips_sig_grid_confDialogue_delete_title"),
                        question: context.getMessage("ips_sig_grid_confDialogue_delete_question")
                    }
                },
                "columns": [
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('ips_sig_grid_column_name'),
                        "width": 170
                    },
                    {
                        "index": "severity",
                        "name": "severity",
                        "label": context.getMessage('ips_sig_grid_column_severity'),
                        "width": 80
                    },
                    {
                        "index": "category",
                        "name": "category",
                        "label": context.getMessage('ips_sig_grid_column_category'),
                        "width": 110
                    },
                    {
                        "index": "sig-type",
                        "name": "sig-type",
                        "label": context.getMessage('ips_sig_grid_column_object_type'),
                        "width": 110,
                        "formatter": this.formatTypeObject
                    },
                    {
                        "index": "recommended",
                        "name": "recommended",
                        "label": context.getMessage('ips_sig_grid_column_recommended'),
                        "width": 100
                    },
                    {
                        "index": "definition-type",
                        "name": "definition-type",
                        "label": context.getMessage('ips_sig_grid_column_predefined_custom'),
                        "width": 130
                    },
                    {
                        "index": "id",
                        "name": "id",
                        "label": context.getMessage('app_sig_grid_column_id'),
                        "width": 186,
                        "hidden": true
                    },                   
                    {
                        "index": "domain-name",
                        "name": "domain-name",
                        "label": context.getMessage('ips_sig_grid_column_domain'),
                        "width": 70
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
