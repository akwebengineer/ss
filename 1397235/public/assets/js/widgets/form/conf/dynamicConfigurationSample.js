/**
 * A sample configuration for creating sections and elements using the form widget
 *
 * @module Form Sample
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var dynamicConfigurationSample = {};

    dynamicConfigurationSample.section1 =
        {
            "heading": "Appended Section",
            "heading_text": "Subtitle for appended section",
            "section_id": "appended_section_id_1",
            "elements": [
                {
                    "element_description": true,
                    "id": "text_description_sec_1",
                    "label": "Appended Description",
                    "value": "Description 1"
                },
                {
                    "element_textarea": true,
                    "id": "text_area_1_sec_1",
                    "name": "text_area_1_sec_1",
                    "label": "Textarea",
                    "pattern": "^([0-9]){3,4}$",
                    "placeholder": "",
                    "error": "Enter a number with 3 or 4 digits",
                    "post_validation": "validTextarea"
                },
                {
                    "element_multiple_error": true,
                    "id": "username_1_sec_1",
                    "name": "username_1_sec_1",
                    "label": "Username",
                    "pattern-error": [
                        {
                            "pattern": "hassymbol",
                            "error": "Must include a symbol."
                        },
                        {
                            "pattern": "hasnotspace",
                            "error": "Must not include a space."
                        },
                        {
                            "pattern": "validtext",
                            "error": "This field is required."
                        }
                    ],
                    "error": true,
                    "help": "Must only contain alphanumerics, underscores or hyphens and begin with an alphanumeric or an underscore character."
                }
            ]
        };

    dynamicConfigurationSample.section2 =
        {
            "heading": "Appended Section 2",
            "section_id": "appended_section_id_2",
            "toggle_section": {
                "label": "Toggle show/hide Section 2",
                "status": "hide"
            },
            "elements": [
                {
                    "element_email": true,
                    "id": "text_email_1_sec_2",
                    "name": "text_email_1_sec_2",
                    "label": "Text email",
                    "placeholder": "",
                    "disabled": true,
                    "error": "Please enter a valid email"
                },
                {
                    "element_url": true,
                    "id": "text_url_1_sec_2",
                    "name": "text_url_1_sec_2",
                    "label": "Text url",
                    "placeholder": "http://www.juniper.net",
                    "error": "Please enter a valid URL"
                },
                {
                    "element_string": true,
                    "id": "text_string_v_1_sec_2",
                    "name": "text_string_v_1_sec_2",
                    "label": "Text",
                    "error": "Please enter a valid value",
                    "value": "bry123",
                    "visibility": "text_string_v_4_1_sec_2"
                },
                {
                    "element_string": true,
                    "id": "text_string_v_4_1_sec_2",
                    "name": "text_string_v_4_1_sec_2",
                    "label": "Text email Show nxn 1",
                    "error": "Please enter a valid value",
                    "hidden": true
                },
                {
                    "element_dropdown": true,
                    "id": "dropdown_field_sec_3",
                    "name": "dropdown_field_sec_3",
                    "label": "Dropdown Serialize",
                    "required": true,
                    "initValue": "{{dropDown_s.dropDown_s1.dropDown_s2.dropDown_s3}}",
                    "data": [
                        {
                            "id": "ftp_s",
                            "text": "junos-ftp"
                        },
                        {
                            "id": "tftp_s",
                            "text": "junos-tftp",
                            "selected": true
                        },
                        {
                            "id": "rtsp_s",
                            "text": "junos-rtsp"
                        },
                        {
                            "id": "netbios_s",
                            "text": "junos-netbios-session"
                        }
                    ],
                    "error": "Please make a selection"
                }
            ]
        };

    dynamicConfigurationSample.section3 =
        {
            "heading": "Appended Section 3 with Show Visibility",
            "section_id": "appended_section_id_3",
            "elements": [
                {
                    "element_checkbox": true,
                    "id": "checkbox_field_2_sec_3",
                    "label": "Checkbox 2",
                    "required": true,
                    "values": [
                        {
                            "id": "checkbox_enable_sec_3",
                            "name": "checkbox_field_2_sec_3",
                            "label": "Show ele0",
                            "value": "enable",
                            "visibility": "show_hide_element0_sec_3",
                            "checked": true
                        },
                        {
                            "id": "checkbox_disable_sec_3",
                            "name": "checkbox_field_2_sec_3",
                            "label": "Show ele1 & ele2",
                            "visibility": ["show_hide_element1_sec_3", "show_hide_element2_sec_3"],
                            "value": "disable"
                        },
                        {
                            "id": "checkbox_none_sec_3",
                            "name": "checkbox_field_2_sec_3",
                            "label": "No visibility",
                            "value": "none"
                        }
                    ],
                    "error": "Please make a selection"
                },
                {
                    "element_string": true,
                    "id": "show_hide_element0_sec_3",
                    "name": "show_hide_element0_sec_3",
                    "label": "Show on Option1",
                    "hidden": true
                },
                {
                    "element_string": true,
                    "id": "show_hide_element1_sec_3",
                    "name": "show_hide_element1_sec_3",
                    "label": "Show on Option2a",
                    "hidden": true
                },
                {
                    "element_string": true,
                    "id": "show_hide_element2_sec_3",
                    "name": "show_hide_element2_sec_3",
                    "label": "Show on Option2b",
                    "hidden": true
                },
                {
                    "element_radio": true,
                    "id": "radio_field_sec_3",
                    "label": "Radio Buttons 2",
                    "values": [
                        {
                            "id": "radio1_sec_3",
                            "name": "radio1_sec_3",
                            "label": "Option 12",
                            "value": "option12"
                        },
                        {
                            "id": "radio2_sec_3",
                            "name": "radio2_sec_3",
                            "label": "Option 22",
                            "disabled": true,
                            "value": "option22"
                        }
                    ],
                    "help": "Radio Buttons help text",
                    "error": "Please make a selection"
                },
                {
                    "element_dropdown": true,
                    "id": "dropdown_field_sec_3",
                    "name": "dropdown_field_sec_3",
                    "label": "Dropdown Serialize",
                    "required": true,
                    "initValue": "{{dropDown_s.dropDown_s1.dropDown_s2.dropDown_s3}}",
                    "data": [
                        {
                            "id": "ftp_s",
                            "text": "junos-ftp"
                        },
                        {
                            "id": "tftp_s",
                            "text": "junos-tftp",
                            "selected": true
                        },
                        {
                            "id": "rtsp_s",
                            "text": "junos-rtsp"
                        },
                        {
                            "id": "netbios_s",
                            "text": "junos-netbios-session"
                        }
                    ],
                    "error": "Please make a selection"
                }
            ]
        };

    dynamicConfigurationSample.elements1 =
        [
            {
                "element_alphanumeric": true,
                "id": "text_alphanumeric_1",
                "name": "text_alphanumeric_1",
                "label": "Text alphanumeric Dyn1",
                "required": true,
                "placeholder": "",
                "error": "Please enter a string that contains only letters and numbers"
            },
            {
                "element_hexadecimal": true,
                "id": "text_hexadecimal_1",
                "name": "text_hexadecimal_1",
                "label": "Text hexadecimal Dyn1",
                "placeholder": "",
                "error": "Please enter a valid hexadecimal number"
            }
        ];

    dynamicConfigurationSample.elements2 =
        [
            {
                "element_alphanumeric": true,
                "id": "text_alphanumeric_2",
                "name": "text_alphanumeric_2",
                "label": "Text alphanumeric Dyn2",
                "field-help": {
                    "content": "Tooltip for Text alphanumeric Dyn2",
                    "ua-help-identifier": "alias_for_title_ua_event_binding2"
                },
                "placeholder": "",
                "error": "Please enter a string that contains only letters and numbers"
            },
            {
                "element_hexadecimal": true,
                "id": "text_hexadecimal_2",
                "name": "text_hexadecimal_2",
                "label": "Text hexadecimal Dyn2",
                "placeholder": "",
                "error": "Please enter a valid hexadecimal number"
            }
        ];

    dynamicConfigurationSample.sectionWithVisibility =
        [{
            "heading": "Visibility for Input Form Elements",
            "progressive_disclosure": "expanded", //two possible values: expanded or collapsed
            "elements": [
                {
                    "element_toggleButton": true,
                    "id": "toggle_button_v_1",
                    "name": "toggle_button_v_1",
                    "label": "Toggle Button V_Op",
                    "visibility": "show_hide_element43"
                },
                {
                    "element_string": true,
                    "id": "show_hide_element43",
                    "name": "show_hide_element43",
                    "label": "Hide on ToggleOff",
                    "hidden": true,
                    "error": true
                }
            ]
        }];

    dynamicConfigurationSample.twoSections =
        [{
                "heading": "Section 1",
                "section_id": "section_id_1",
                "hidden": true,
                "elements": [
                    {
                        "element_string": true,
                        "id": "text_email_s_v",
                        "name": "text_email_s_v",
                        "label": "Text email",
                        "error": "Please enter a valid text"
                    }
                ]
            },
            {
                "heading": "Section 2",
                "section_id": "section_id_2",
                "elements": [
                    {
                        "element_url": true,
                        "id": "text_url_s_v",
                        "name": "text_url_s_v",
                        "label": "Text url",
                        "placeholder": "http://www.juniper.net",
                        "error": "Please enter a valid URL"
                    }
                ]
            },
            {
                "heading": "Section 3",
                "section_id": "section_id_3",
                "elements": [
                    {
                        "element_url": true,
                        "id": "text_url_check",
                        "name": "text_url_check",
                        "label": "Text url test",
                        "hidden": true,
                        "placeholder": "http://www.juniper.net",
                        "error": "Please enter a valid URL"
                    }
                ]
            }
        ];


    return dynamicConfigurationSample;

});
