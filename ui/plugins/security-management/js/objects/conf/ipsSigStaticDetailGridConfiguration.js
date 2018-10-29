/**
 * Created by wasima on 8/24/15.
 */

define([], function() {

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "tableId": "ips-sig-static-detail-grid",
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

                 },
                "actionButtons":{

                        "customButtons":
                             [/*{
                                 "icon_type": true,
                                 "label": "Add",
                                 "icon": "/assets/images/create.png",
                                 "key": 'addEvent',
                                 "id" : 'Add'

                             }*/
                             ]
                },
                "columns": [
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('ips_sig_grid_column_name'),
                        "width": 90
                    },
                    {
                        "index": "severity",
                        "name": "severity",
                        "label": context.getMessage('ips_sig_grid_column_severity'),
                        "width": 90
                    },
                    {
                        "index": "category",
                        "name": "category",
                        "label": context.getMessage('ips_sig_grid_column_category'),
                        "width": 90
                    },
                    {
                        "index": "sig-type",
                        "name": "sig-type",
                        "label": context.getMessage('ips_sig_grid_column_object_type'),
                        "width": 90,
                        "formatter": this.formatTypeObject
                    },
                    {
                        "index": "recommended",
                        "name": "recommended",
                        "label": context.getMessage('ips_sig_grid_column_recommended'),
                        "width": 90
                    },
                    {
                        "index": "definition-type",
                        "name": "definition-type",
                        "label": context.getMessage('ips_sig_grid_column_predefined_custom'),
                        "width": 90
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
                        "width": 90
                    }
                ]
            };
        };

        this.getEvents = function() {

            
        };
    };

    return Configuration;
});
