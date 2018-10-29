/**
 * A configuration object with the parameters required to build
 * @copyright Juniper Networks, Inc. 2015
 * @author Ashish<sriashish@juniper.net>
 */

define(['../../constants/basePolicyManagementConstants.js'], 
  function (PolicyManagementConstants) {
       var Configuration = function(context) {
      
        this.getValues = function() {
            isRowEditable = function (rowId){
                //return true;
            };

            return {
                
                "tableId": "sdCustomColumnGrid",
                "height": "200px",
                "multiselect": "true",
                "scroll": true,
                "contextMenu": {},
                "numberOfRows":20,
                "footer":false,
                "jsonId": "id",
                "confirmationDialog": {
                    "delete": {
                        title: context.getMessage("sm.services.custom_column.delete_title"),
                        question: context.getMessage("sm.services.custom_column.delete_msg")
                    }
                },
                "columns": [
                        {
                        "index": "id",
                        "name": "id",
                        "hidden": true
                    },
                {
                    "index": "name",
                    "name": "name",
                    "label": context.getMessage("custom_column_builder_name_label"),
                    "width": 270,
                    "sortable": false               
                },
                 {
                    "index": "regex",
                    "name": "regex", 
                    "label": context.getMessage("custom_column_validation"),
                    "width": 270,
                    "sortable": false               
                }
                ]
            }
        };

        this.getEvents = function() {
            return {
                createEvent: "addCustomColumnAction",
                updateEvent: "modifyCustomColumnAction",
                deleteEvent: "deleteCustomColumnAction"
            };
        };
    };

    return Configuration;
});