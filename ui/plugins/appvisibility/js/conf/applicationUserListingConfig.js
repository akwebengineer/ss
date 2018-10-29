define([], 
    function () {

    var formConfig = function(context) {

        this.getValues = function() {
            return {        
                "title": "Block",
                "title-help" :{
                    "content":context.getMessage("block_application_tooltip")
                },
                "on_overlay": true,
                "form_id": "applicationuserblock_form",
                "form_name": "applicationuserblock_form",
                "sections": [{
                    "section_id": "crap_id",
                    "elements": [{
                        "element_description": true,
                        "label": "Application Name",
                        "value": "{{name}}"
                    },{
                        "element_description": true,
                        "label": "Top 5 Users",
                        "id": "block_users_grid_list",
                        "class": "block_users_grid_list",
                        "name": "block_users_grid_list"
                    }]
                }],
                "buttonsAlignedRight": true,
                "buttons": [{
                    "id": "applicationuserblock-view-blockusers",
                    "value": context.getMessage("block_users_button")
                },{
                    "id": "applicationuserblock-view-blockapplication",
                    "value": context.getMessage("block_application_button")
                }],
                "cancel_link": {
                    "id": "applicationuserblock-view-close",
                    "value": "Cancel"
                }
            }
        }
    };

    return formConfig;
});