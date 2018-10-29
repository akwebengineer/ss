/**
 * A configuration object with the parameters required to build a form
 *
 * @module formConfiguration
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([], function () {

    var formConfiguration = {
        "sections": [
            {
                "elements": [
                    {
                        "element_toggleButton": true,
                        "id": "togglebutton_field_1",
                        "name": "togglebutton_field_1",
                        "on": true,
                        "label": "Toggle Button",
                        "inlineLabel": {
                            "on": "Active",
                            "off": "Inactive"
                        }
                    },
                    {
                        "element_toggleButton": true,
                        "id": "togglebutton_field_2",
                        "name": "togglebutton_field_2",
                        // "on": true,
                        "label": "Toggle Button Disabled",
                        "disabled": true
                    },
                    {
                        "element_email": true,
                        "id": "text_email",
                        "name": "text_email",
                        "label": "Text email",
                        "error": "Please enter a valid email"
                    },
                    {
                        "element_url": true,
                        "id": "text_url",
                        "name": "text_url",
                        "label": "Text url",
                        "placeholder": "http://www.juniper.net",
                        "error": "Please enter a valid URL"
                    },
                    {
                        "element_string": true,
                        "id": "text_string",
                        "class": "text_string_class",
                        "name": "text_string",
                        "label": "Text string",
                        "field-help": {
                            "content": "The string should contain only letters (a-zA-Z)",
                            "ua-help-identifier": "alias_for_ua_event_binding2"
                        },
                        "error": "Please enter a valid string that contains only letters (a-zA-Z)"
                    }
                ]
            }
        ],
        "buttons": [
            {
                "id": "get-form-value",
                "name": "get-form-value",
                "value": "Get Values"
            }
        ]
    };

    return formConfiguration;

});
