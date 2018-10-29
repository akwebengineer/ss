/**
 *  A configuration object Services Form Page
 *  
 *  @module vpn import endpoint grid form
 *  @author Anuran<anuranc@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define([],
    function() {
        var Configuration = function(context) {
            this.getValues = function() {
                return {
                    "form_id": "endpoint-form",
                    "form_name": "endpoint_form",
                    "title-help": {
                        "ua-help-identifier": "alias_for_title_ua_event_binding"
                    },
                    "err_div_id": "errorDivEndpointWarning",
                    "err_div_message": context.getMessage("form_error"),
                    "err_timeout": "1000",
                    "valid_timeout": "5000",
                        "sections": [
                        {
                            "elements": [
                                {
                                    "element_text": true,
                                    "id": "endpoint-grid-placeholder",
                                    "class": "endpointgridplaceholder",
                                    "name": "endpoint_grid_placeholder"
                                   
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
