/**
 * Created by ramesha on 11/6/15.
 */
define([],
    function() {
        var Configuration = function(context) {
            this.getValues = function() {
                return {
                    "form_id": "sd_alarms_form",
                    "form_name": "sd_alarms_form",
                    "on_overlay": true,
                    "title" : "View Alarm Details",
                    "title-help": {
                        "content": context.getMessage("alarm_details"),
                        "ua-help-text": context.getMessage("more_link"),
                        "ua-help-identifier": context.getHelpKey("ALERT_ALARM_VIEWING")
                    },
                    "err_div_id": "errorDiv",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                    "err_div_link_text": "Alarms",
                    "err_timeout": "1000",
                    "valid_timeout": "5000",
                    "sections": [{
                            "elements": [{
                                    "element_description": true,
                                    "name": "alarmName",
                                    "label": context.getMessage("alarm_form_name"),
                                    "id": "alarm-name",
                                    "value": "{{name}}"
                                },
                                {
                                    "element_description": true,
                                    "name": "description",
                                    "label": context.getMessage("alarm_form_description"),
                                    "id": "alarm-description",
                                    "value": "{{alarmDescription}}"
                                },
                                {
                                    "element_description": true,
                                    "name": "alarmSeverity",
                                    "label": context.getMessage("alarm_form_severity"),
                                    "id": "alarm-severity",
                                    "value": "{{severity}}"
                                },
                                {
                                    "element_description": true,
                                    "name": "entityId",
                                    "label": context.getMessage("alarm_form_entityId"),
                                    "id": "entityId",
                                    "value": "{{entityId}}"
                                },
                                {
                                    "element_description": true,
                                    "name": "lastUpdated",
                                    "label": context.getMessage("alarm_form_lastUpdated"),
                                    "id": "lastUpdated",
                                    "value": "{{lastUpdated}}"
                                }
                                ]
                    },
                    {
                       "section_id": "sd_alarmDetailsSection",
                                "elements": [
                            {
                                "element_description": true,
                                "id": "alarm-events-grid",
                                "class": "hide grid-widget",
                                "name": "alarm-grid",
                                "label": context.getMessage('alarm_events')
                            }

                        ]
                    }
                    ],
                    "buttonsAlignedRight": true,
                    "buttonsClass":"buttons_row",
                    "buttons": [
                        {
                            "id": "sd-alarm-cancel",
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
