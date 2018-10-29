/**
 * A configuration object with the parameters required to build
 * a grid for Template Name Drop down box.
 * @copyright Juniper Networks, Inc. 2015
 */

define([], 
  function (DropDownWidget,OverlayWidget,RuleNameTemplateConstantFormView) {
       var Configuration = function(context,getCustomDropdownElement,getCustomDropdownValue) {
      
        this.getValues = function() {
            isRowEditable = function (rowId){
                return true;
            };

            return {

                "tableId": "sdTemplateGrid",
                "height": "200px",
                "multiselect": "true",
                "scroll": true,
                "contextMenu": {},
                "numberOfRows":20,
                "footer":false,
                "jsonId": "id",
                "confirmationDialog": {
                    "delete": {
                        title: context.getMessage("template_builder_grid_confDialogue_delete_title"),
                        question: context.getMessage("template_delete_msg")
                    }
                },
                "columns": [
                        {
                        "index": "id",
                        "name": "id",
                        "hidden": true
                    },
                {
                    "index": "template_builder_column",
                    "name": "template_builder_column",
                    "label": context.getMessage("template_builder_column"),
                    "width": 270,
                    "sortable": false               
                }
                ]
            }
        };

        this.getEvents = function() {
            return {
                createEvent: "addTemplateAction",
                updateEvent: "modifyTemplateAction",
                deleteEvent: "deleteTemplateAction"
            };
        };
    };

    return Configuration;
});