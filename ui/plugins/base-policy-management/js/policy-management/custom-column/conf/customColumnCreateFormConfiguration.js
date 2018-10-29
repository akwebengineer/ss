/**
 * @author Ashish<sriashish@juniper.net>
 */

define([],
    function() {
        var Configuration = function(context) {
            this.getValues = function() {
                return {
                    "on_overlay": true,
                    "title-help": {
                        "content": context.getMessage('create_custom_column_form_title_help')
                    },
                    "err_div_id": "errorDiv",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link_text": "Add Custom column name help",
                    "err_timeout": "1000",
                    "valid_timeout": "5000",
                    "sections": [
                        {
                            "elements": [                                
                                {
                                    "element_text": true,
                                    "id": "customColumn-name",
                                    "name": "name",
                                    "label": context.getMessage('custom_column_builder_name_label'), 
                                    "required": true,
                                    "error" : context.getMessage('sd.publish.customColumnName.name_required'),
                                    "field-help": {
                                       "content": context.getMessage('custom_column_builder_name_help')
                                    }
                                },
                                {
                                    "element_textarea": true,
                                    "name": "regex",
                                    "id": "regex",
                                    "label": context.getMessage('custom_column_validation'), 
                                    "field-help": {
                                       "content": context.getMessage('custom_column_validation_help')
                                    }
                                }
                                                              
                            ]
                        }
                    ],
                    "buttonsAlignedRight": true,
                    "buttonsClass":"buttons_row",
                    "cancel_link": {
                        "id": "custom-column-cancel",
                        "value": context.getMessage('cancel')
                    },
                    "buttons": [
                        {
                            "id": "custom-column-save",
                            "name": "create",
                            "value": context.getMessage('ok')
                        }
                    ]
                };
            }
        };

        return Configuration;
    }
);
