/**
 *  A configuration object Services Form Page
 *  
 *  @module device grid form
 *  @author Anuran<anuranc@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define([],
    function() {
        var Configuration = function(context) {
            this.getValues = function() {
                return {
                    "form_id": "device-form",
                    "form_name": "device_form",
                    "title-help": {
                        "ua-help-identifier": "alias_for_title_ua_event_binding"
                    },
                    "err_div_id": "errorDivImportWarning",
                    "err_div_message": context.getMessage("form_error"),
                    "err_timeout": "1000",
                    "valid_timeout": "5000",
                        "sections": [
                        {
                            "elements": [
                                {
                                    "element_text": true,
                                    "id": "device-grid-placeholder",
                                    "class": "devicegridplaceholder",
                                    "name": "device_grid_placeholder"
                                   
                                }                                
                            ]
                        }
                    ]
                };

            };

        };
        return Configuration;
    }
);
