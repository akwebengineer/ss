define([], 
    function () {

    var customColumnFormConfiguration = function(context) {

        this.getValues = function() {
            return {
                "title": context.getMessage("create_custom_column_builder"),
                "form_id": "custom_column_builder_form",
                "form_name": "custom_column_builder_form",
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "on_overlay": true,    
                "title-help": {
                  "content": context.getMessage("custom_column_title_tooltip"),
                  "ua-help-text": context.getMessage("more_link"),
                  "ua-help-identifier": context.getHelpKey("CUSTOM_COLUMN_HELP")
                },           
                "sections": [                   
                    {
                        "section_id": "customColumn_id",
                        "elements": [
                            
                            {
                                "element_description": true,
                                "id": "sdCustomColumnGrid",
                                "name": "template_builder_dis",
                                "placeholder": context.getMessage('loading'),
                                "class": "sd-template-builder gridWidgetSmallPlaceHolder"
                            }

                        ]
                    }
                ],
                "buttons": [
                            {
                                "id": "custom-column-ok",
                                "name": "Ok",
                                "value": context.getMessage('ok')
                            }
                        ]
            }
        }
    };
    return customColumnFormConfiguration;
});