/**
 * Firewall Rule Grid Hit Count configuration object 
 *
 * @module FWRuleGridHitCountFormConfiguration
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var FWRuleGridHitCountFormConfiguration = function (context) {

        this.gridHitCount = function() {
            return {
                
                "title": context.getMessage("hit_count_details"),
                "form_id": "hit_count_form",
                "form_name": "hit_count_form",
                "title-help": {
                    "content": context.getMessage("hit_count_details_tt"),
                    "ua-help-identifier": "alias_for_title_hit_count_details"
                },
                "err_div_id": "errorDiv",
                "err_div_message": context.getMessage("form_error"),
                "err_div_link_text": context.getMessage("hit_count_details"),
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "on_overlay": true,
                
                "sections": [
                    {
                        "section_id": "section_hits",
                        "section_class": "section_class label-top-align",
                        "heading": context.getMessage('hits'),
                        "elements": [
                            {
                                "element_description": true,
                                "id": "level",
                                "name": "level",
                                "label": context.getMessage("level"),
                                "value": ""
                            },
                            {
                                "element_description": true,
                                "id": "range",
                                "name": "range",
                                "label": context.getMessage("range"),
                                "value": ""
                            }
                        ]
                    }, {
                        "section_id": "section_current_count",
                        "section_class": "section_class label-top-align",
                        "heading": context.getMessage('current_count'),
                        "elements": [
                            {
                                "element_description": true,
                                "id": "current_hits",
                                "name": "current_hits",
                                "label": context.getMessage("hits"),
                                "value": ""
                            },
                            {
                                "element_description": true,
                                "id": "last_reset",
                                "name": "last_reset",
                                "label": context.getMessage("last_reset"),
                                "value": ""
                            }
                        ]
                    }, {
                        "section_id": "section_total_count",
                        "section_class": "section_class label-top-align",
                        "heading": context.getMessage('total_count'),
                        "elements": [
                            {
                                "element_description": true,
                                "id": "total_hits",
                                "name": "total_hits",
                                "label": context.getMessage("hits"),
                                "value": ""
                            }
                        ]
                    }, {
                        "section_id": "section_hits_last",
                        "section_class": "section_class",
                        "elements": [
                            {
                                "element_description": true,
                                "id": "last_hit_date",
                                "name": "last_hit_date",
                                "label": context.getMessage("last_hit_date"),
                                "value": ""
                            },{
                                "element_description": true,
                                "id": "hits_per_device",
                                "name": "hits_per_device",
                                "label": context.getMessage("hits_per_device"),
                                "value": "",
                                
                                "inlineLinks":[{
                                    "id": "hits_per_device_link",
                                    "class": "hits_per_device_link align-left-no-margin",
                                    "value": context.getMessage("view_devices")
                                }]
                                
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "btnHitOk",
                        "name": "btnHitOk",
                        "value": context.getMessage('ok')
                    }
                ]
            }
       };

    };

    return FWRuleGridHitCountFormConfiguration;

});
