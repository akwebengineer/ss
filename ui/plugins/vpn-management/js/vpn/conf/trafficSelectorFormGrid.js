/**
 * Module that implements the local and remote IP for tunnel selector view.
 *
 * @module trafficSelectorFormGrid
 * @author Venkata Swaroop <vswaroop@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([], function() {

    var Configuration = function(context) {
        
        this.getValues = function() {

            return {
                "tableId": "traffic-selector-grid",
                "numberOfRows": 20,
                "height": "100px",
                "repeatItems": "true",
                "multiselect": "true",
                "showWidthAsPercentage" : false,
                "scroll": true,
                "jsonId": "id",
                "contextMenu": {
                    "delete": "Delete it"
                },
                "noResultMessage":" ",
                "confirmationDialog": {
                    "delete": {
                        title: context.getMessage('warning'),
                        question: "Are you sure you want to delete the selected item..?"
                    }
                },
                "columns": [
                    {
                        "index"           : "name",
                        "name"            : "name",
                        "sortable"        : false,
                        "width"           : 225,
                        "label"           : "Name"
                    },
                    {
                        "index"           : "local-ip",
                        "name"            : "local-ip",
                        "sortable"        : false,
                        "width"           : 125,
                        "label"           : "Local IP"
                    },
                    {
                        "index"           : "remote-ip",
                        "name"            : "remote-ip",
                        "sortable"        : false,
                        "width"           : 125,
                        "label"           : "Remote IP"
                    }
                ]
            };
        };
        this.getEvents = function() {
            return {
           //     updateEvent: "modifyAction",
                deleteEvent: "deleteAction"
            };
        };
    };

    return Configuration;
});
