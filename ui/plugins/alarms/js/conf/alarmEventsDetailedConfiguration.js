/**
 * Created by ramesha on 11/6/15.
 */
define([],
    function() {
        var Configuration = function(context) {
            this.getValues = function() {
                return {
                    "form_id": "sd_alarm_events_form",
                    "form_name": "sd_alarm_events_form",
                    "title" : "View Event Details",
                    "on_overlay": true,
                    "title-help": {
                        "content": context.getMessage("alarm_event_details"),
                        "ua-help-identifier": "alias_for_title_ua_event_binding"
                    },
                    "err_div_id": "errorDiv",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                    "err_div_link_text": "Alarm Events",
                    "err_timeout": "1000",
                    "valid_timeout": "5000",
                    "sections": [{
                            "elements": [{
                                    "element_description": true,
                                    "name": "eventName",
                                    "label": "Event Name",
                                    "id": "event-name",
                                    "value": "{{eventName}}"
                                }]
                    }],
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
