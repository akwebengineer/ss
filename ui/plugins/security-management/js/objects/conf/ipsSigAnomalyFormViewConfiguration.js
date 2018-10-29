/**
 * Created by vinamra on 8/21/15.
 */

define([],
    function() {
        var Configuration = function(context) {
            this.getValues = function() {
                return {
                    "on_overlay": true,
                    "title-help": {
                        "content": context.getMessage("ips_sig_anomaly_form_title_help"),
                        "ua-help-identifier": "alias_for_title_ua_event_binding"
                    },
                    "err_div_id": "errorDiv",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                    "err_div_link_text": "Add Anomaly help",
                    "err_timeout": "1000",
                    "valid_timeout": "5000",
                    "sections": [
                        {
                            "heading_text": context.getMessage('ips_sig_protocol_create_intro'),
                            "elements": [
                                {
                                    "element_description": true,
                                    "id": "ips-sig-no",
                                    "name": "number",
                                    "label": context.getMessage('ips_sig_grid_column_anomalyno'),
                                    "value":"{{number}}",
                                    "field-help": {
                                       "content": context.getMessage('ips_sig_create_number_tooltip')
                                    }          
                                },
                                {
                                    "element_description": true,
                                    "name": "anomaly",
                                    "id" : "ips-sig-anomaly",
                                    "label": context.getMessage('ips_sig_grid_column_anomaly'),
                                    "required": true,
                                    "error": context.getMessage('ips_sig_anomaly_form_error') ,
                                    "field-help": {
                                       "content": context.getMessage('ips_sig_create_add_anomaly_anomaly')
                                    }                           
                                },
                                {
                                    "element_description": true,
                                    "name": "anomaly-direction",
                                    "label": context.getMessage('ips_sig_grid_column_direction'),
                                    "id": "ips-sig-anomaly-direction",
                                    "field-help": {
                                       "content": context.getMessage('ips_sig_create_add_anomaly_direction_tooltip')
                                    }        
                                }                               
                            ]
                        }
                    ],
                    "buttonsAlignedRight": true,
                    "buttonsClass":"buttons_row",
                    "cancel_link": {
                        "id": "ips-sig-grid-cancel",
                        "value": context.getMessage('cancel')
                    },
                    "buttons": [
                        {
                            "id": "ips-sig-anomaly-save",
                            "name": "create",
                            "value": "OK"
                        }
                    ]
                };
            }
        };

        return Configuration;
    }
);
