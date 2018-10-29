/**
 * Rule Grid Hit Count Per Device configuration object 
 *
 * @module FWRuleGridHitsPerDeviceFormConfiguration
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */


define([],
    function() {
        var FWRuleGridHitsPerDeviceFormConfiguration = function(context) {
            this.getElements = function() {
                return {
                    "title": context.getMessage("hits_per_device"),
                    "form_id": "hits_per_device_form",
                    "form_name": "hits_per_device_form",
                    "on_overlay": true,
                    "title-help": {
                        "content": context.getMessage("hits_per_device"),
                        "ua-help-identifier": "alias_for_title_hits_per_device"
                    },
                    
                    "err_div_id": "errorDiv",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link_text": context.getMessage("hits_per_device"),
                    "err_timeout": "1000",
                    "valid_timeout": "5000",

                    "sections": [
                          {
                            "section_id": "section_hits_per_device",
                            "elements": [
                                {
                                    "element_description": true,
                                    "id": "hits-per-device-grid",
                                    "name": "hits-per-device-grid",
                                    "class": "grid-widget"
                                }
                            ]
                        }
                    ],

                    "buttonsAlignedRight": true,
                    "buttons": [
                        {
                            "id": "btnHitsPerDeviceOk",
                            "name": "btnHitsPerDeviceOk",
                            "value": context.getMessage('ok')
                        }
                    ]
                };
            }
        };

        return FWRuleGridHitsPerDeviceFormConfiguration;
    }
);
