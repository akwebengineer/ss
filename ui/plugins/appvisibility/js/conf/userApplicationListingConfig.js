define([], 
    function () {

    var formConfig = function(context,sourceNameView) {

        this.getValues = function() {
            return {        
                "title": "Block",
                "title-help" :{
                    "content":context.getMessage("block_user_tooltip")
                },
                "on_overlay": true,
                "form_id": "applicationuserblock_form",
                "form_name": "applicationuserblock_form",
                "sections": [{
                    "elements": [{
                        "element_description": true,
                        "disabled": true,
                        "label": sourceNameView === "source_ip" ? context.getMessage("source_ip_vis_grid_column_name") : context.getMessage("user_vis_grid_column_name"),
                        "value": "{{name}}"
                    },{
                        "element_description": true,
                        "label": "Top 5 Applications",
                        "id": "block_applications_grid_list",
                        "class": "block_applications_grid_list",
                        "name": "block_applications_grid_list"
                    }]
                }],
                "buttonsAlignedRight": true,
                "buttons": [{
                    "id": "userapplicationblock-view-blockapplications",
                    "value": context.getMessage("block_applications_button")
                },{
                    "id": "userapplicationblock-view-blockuser",
                    "value": context.getMessage("block_user_button")
                }],
                "cancel_link": {
                    "id": "userapplicationblock-view-close",
                    "value": "Cancel"
                }
            }
        }
    };

    return formConfig;
});