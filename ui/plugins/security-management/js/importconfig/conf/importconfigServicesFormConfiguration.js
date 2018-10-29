/**
 *  A configuration object Services Form Page
 *  
 *  @module services form
 *  @author nareshu<nareshu@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */

define([],
    function() {

        var Configuration = function(context) {

            this.getValues = function() {

                return {
                    "form_id": "services-form",
                    "form_name": "services_form",
                    //"on_overlay": true,
                    "title-help": {
                      
                        "ua-help-identifier": "alias_for_title_ua_event_binding"
                    },
                    "err_div_id": "errorDivImportWarning",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                    "err_div_link_text": context.getMessage("fw_policy_create"),
                    "err_timeout": "1000",
                    "valid_timeout": "5000",
                        "sections": [
                        {
                            //"heading_text": option.headingText,
                            "elements": [
                                {
                                    "element_text": true,
                                    "id": "services-action-buttons-placeholder",
                                    "class": "servicesactionbuttonsplaceholder",
                                    "name": "services_action_buttons_placeholder"
                                    
                                },
                               
                                {
                                    "element_text": true,
                                    "id": "services-grid-placeholder",
                                    "class": "servicesgridplaceholder",
                                    "name": "services_grid_placeholder"
                                   
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
