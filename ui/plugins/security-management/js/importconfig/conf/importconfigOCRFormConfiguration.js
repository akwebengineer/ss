/**
 *  A configuration object OCR Form Page
 *  
 *  @module ocr form
 *  @author nareshu<nareshu@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */

define([],
    function() {

        var Configuration = function(context) {

            this.getValues = function() {

                return {
                    "form_id": "ocr-form",
                    "form_name": "ocr_form",
                    //"on_overlay": true,
                    "title-help": {
                      
                        "ua-help-identifier": "alias_for_title_ua_event_binding"
                    },
                    "err_div_id": "importOcrMessage",
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
                                    "id": "ocr-action-buttons-placeholder",
                                    "class": "ocractionbuttonsplaceholder",
                                    "name": "ocr_action_buttons_placeholder"
                                    
                                },
                               
                                {
                                    "element_text": true,
                                    "id": "ocr-grid-placeholder",
                                    "class": "ocrgridplaceholder",
                                    "name": "ocr_grid_placeholder"
                                   
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
