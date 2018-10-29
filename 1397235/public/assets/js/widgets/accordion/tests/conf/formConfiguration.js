/**
 * A configuration object with the parameters required to build a form
 *
 * @module accordionViewConfiguration
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([], function () {

    var formConfiguration = {};

    formConfiguration.form1 = {
        "sections": [
            {
                "elements": [
                    {
                        "element_url": true,
                        "id": "text_url_view1",
                        "name": "text_url_view1",
                        "label": "Text url",
                        "placeholder": "http://www.juniper.net",
                        "error": "Please enter a valid URL"
                    },
                    {
                        "element_multiple_error": true,
                        "id": "hostname_view1",
                        "name": "hostname_view1",
                        "label": "Hostname",
                        "required": true,
                        "pattern-error": [
                            {
                                "pattern": "validtext",
                                "error": "This field is required."
                            },
                            {
                                "pattern": "length",
                                "min_length": "1",
                                "max_length": "64",
                                "error": "Must not exceed 64 characters."
                            },
                            {
                                "pattern": "hasalphanumericdashunderscore",
                                "error": "Only alphanumeric characters, dashes and underscores allowed."
                            }
                        ],
                        "error": true,
                        "notshowvalid": true,
                        "help": "Any combination of alphabetic characters, numbers, dashes, and underscores. No other special characters are allowed. 64 characters max.",
                        "inlineLinks": [{
                            "id": "show_overlay_view1",
                            "class": "show_overlay",
                            "value": "More"
                        }]
                    },
                    {
                        "element_multiple_error": true,
                        "id": "username_view1",
                        "name": "username_view1",
                        "label": "Username",
//                    "disableAutocomplete": true,
                        "pattern-error": [
                            {
                                "pattern": "hasnotspace",
                                "error": "Must not include a space."
                            },
                            {
                                "pattern": "validtext",
                                "error": "This field is required."
                            },
                            {
                                "regexId": "regex2",
                                "pattern": "^[_]{1}",
                                "error": "Must begin with underscore"
                            }
                        ],
                        "error": true,
                        "notshowvalid": true
                    }
                ]
            }
        ]
    };

    formConfiguration.form2 = {
        "sections": [
            {
                "elements": [
                    {
                        "element_dropdown": true,
                        "id": "dropdown_field_view2",
                        "name": "dropdown_field_view2",
                        "label": "Dropdown 2",
                        // "required": true,
                        "data": [
                            {
                                "id": "ftp",
                                "text": "junos-ftp"
                            },
                            {
                                "id": "tftp",
                                "text": "junos-tftp",
                                "disabled": true
                            },
                            {
                                "id": "rtsp",
                                "text": "junos-rtsp"
                            },
                            {
                                "id": "netbios",
                                "text": "junos-netbios-session",
                                "selected": true
                            }
                        ],
                        "help": "Dropdown with data parameter",
                        "error": "Please make a selection"
                    },
                    {
                        "element_checkbox": true,
                        "id": "checkbox_field",
                        "label": "Checkbox",
                        "required": true,
                        "values": [
                            {
                                "id": "checkbox_enable_view2",
                                "name": "checkbox_enable_view2",
                                "label": "Option 1",
                                "value": "enable",
                                "checked": true
                            },
                            {
                                "id": "checkbox_enable_view2",
                                "name": "checkbox_enable_view2",
                                "label": "Option 2",
                                "value": "disable",
                                "checked": false
                            },
                            {
                                "id": "checkbox_disable_view2",
                                "name": "checkbox_enable_view2",
                                "label": "Option 3",
//                                "disabled": true,
                                "value": "disable"
                            }
                        ],
                        "help": "Check box help text",
                        "error": "Please make a selection"
                    },
                    {
                        "element_radio": true,
                        "id": "radio_field_view2",
                        "label": "Radio Buttons",
//                        "required": true,
                        "values": [
                            {
                                "id": "radio1_view2",
                                "name": "radio_button_view2",
                                "label": "Option 1",
                                "value": "option1"
//                                "disabled": true
                            },
                            {
                                "id": "radio2_view2",
                                "name": "radio_button_view2",
                                "label": "Option 2",
                                "value": "option2"
                            },
                            {
                                "id": "radio3_view2",
                                "name": "radio_button_view2",
                                "label": "Option 3",
                                "value": "option3",
                                "checked": true
                            }
                        ],
                        "help": "Radio button help text",
                        "error": "Please make a selection"
                    }
                ]
            }
        ]
    };

    formConfiguration.form3 = {
        "sections": [
            {
                "elements": [
                    {
                        "element_email": true,
                        "id": "text_email_view3",
                        "name": "text_email_view3",
                        "label": "Text email",
                        "error": "Please enter a valid email"
                    },
                    {
                        "element_url": true,
                        "id": "text_url_view3",
                        "name": "text_url_view3",
                        "label": "Text url",
                        "placeholder": "http://www.juniper.net",
                        "error": "Please enter a valid URL"
                    },
                    {
                        "element_string": true,
                        "id": "text_string_view3",
                        "class": "text_string_class",
                        "name": "text_string_view3",
                        "label": "Text string",
                        "field-help": {
                            "content": "The string should contain only letters (a-zA-Z)",
                            "ua-help-identifier": "alias_for_ua_event_binding2"
                        },
                        "error": "Please enter a valid string that contains only letters (a-zA-Z)"
                    }
                ]
            },
            {
                "heading": "Secure Access",
                "progressive_disclosure": "expanded", //two possible values: expanded or collapsed
                "elements": [
                    {
                        "element_alphanumeric": true,
                        "id": "text_alphanumeric_view3",
                        "name": "text_alphanumeric_view3",
                        "label": "Text alphanumeric",
                        "class": "text_alphanumeric_class",
                        "error": "Please enter a string that contains only letters and numbers"
                    },
                    {
                        "element_hexadecimal": true,
                        "id": "text_hexadecimal_view3",
                        "name": "text_hexadecimal_view3",
                        "label": "Text hexadecimal",
                        "error": "Please enter a valid hexadecimal number"
                    },
                    {
                        "element_lowercase": true,
                        "id": "text_lowercase_view3",
                        "name": "text_lowercase_view3",
                        "label": "Text lowercase",
                        "error": "Please enter a valid string in lowercase"
                    },
                    {
                        "element_uppercase": true,
                        "id": "text_uppercase_view3",
                        "name": "text_uppercase_view3",
                        "label": "Text uppercase",
                        "error": "Please enter a valid string in uppercase"
                    }
                ]
            }
        ]
    };

    formConfiguration.form4 = {
        "sections": [
            {
                "elements": [
                    {
                        "element_ip": true,
                        "id": "text_ip_view4",
                        "name": "text_ip_view4",
                        "label": "IP address",
                        "error": "Please enter a valid IP address"
                    }
                ]
            }
        ]
    };

    formConfiguration.form5 = {
        "sections": [
            {
                "elements": [
                    {
                        "element_alphanumeric": true,
                        "id": "text_alphanumeric_view5",
                        "name": "text_alphanumeric_view5",
                        "label": "Text alphanumeric",
                        "class": "text_alphanumeric_class",
                        "error": "Please enter a string that contains only letters and numbers"
                    },
                    {
                        "element_hexadecimal": true,
                        "id": "text_hexadecimal_view5",
                        "name": "text_hexadecimal_view5",
                        "label": "Text hexadecimal",
                        "error": "Please enter a valid hexadecimal number"
                    },
                    {
                        "element_lowercase": true,
                        "id": "text_lowercase_view5",
                        "name": "text_lowercase_view5",
                        "label": "Text lowercase",
                        "error": "Please enter a valid string in lowercase"
                    },
                    {
                        "element_uppercase": true,
                        "id": "text_uppercase_view5",
                        "name": "text_uppercase_view5",
                        "label": "Text uppercase",
                        "error": "Please enter a valid string in uppercase"
                    }
                ]
            }
        ]
    };

    formConfiguration.form6 = {
        "sections": [
            {
                "elements": [
                    {
                        "element_url": true,
                        "id": "text_url_view1_6",
                        "name": "text_url_view1_6",
                        "label": "Text url 6",
                        "placeholder": "http://www.juniper.net",
                        "error": "Please enter a valid URL"
                    },
                    {
                        "element_multiple_error": true,
                        "id": "hostname_view1_6",
                        "name": "hostname_view1_6",
                        "label": "Hostname 6",
                        "required": true,
                        "pattern-error": [
                            {
                                "pattern": "validtext",
                                "error": "This field is required."
                            },
                            {
                                "pattern": "length",
                                "min_length": "1",
                                "max_length": "64",
                                "error": "Must not exceed 64 characters."
                            },
                            {
                                "pattern": "hasalphanumericdashunderscore",
                                "error": "Only alphanumeric characters, dashes and underscores allowed."
                            }
                        ],
                        "error": true,
                        "notshowvalid": true,
                        "help": "Any combination of alphabetic characters, numbers, dashes, and underscores. No other special characters are allowed. 64 characters max.",
                        "inlineLinks": [{
                            "id": "show_overlay_view1",
                            "class": "show_overlay",
                            "value": "More"
                        }]
                    },
                    {
                        "element_multiple_error": true,
                        "id": "username_view1_6",
                        "name": "username_view1_6",
                        "label": "Username 6",
//                    "disableAutocomplete": true,
                        "pattern-error": [
                            {
                                "pattern": "hasnotspace",
                                "error": "Must not include a space."
                            },
                            {
                                "pattern": "validtext",
                                "error": "This field is required."
                            },
                            {
                                "regexId": "regex2",
                                "pattern": "^[_]{1}",
                                "error": "Must begin with underscore"
                            }
                        ],
                        "error": true,
                        "notshowvalid": true
                    }
                ]
            }
        ]
    };

    formConfiguration.form7 = {
        "sections": [
            {
                "elements": [
                    {
                        "element_url": true,
                        "id": "text_url_view1_8",
                        "name": "text_url_view1_8",
                        "label": "Text url 8",
                        "placeholder": "http://www.juniper.net",
                        "error": "Please enter a valid URL"
                    },
                    {
                        "element_multiple_error": true,
                        "id": "hostname_view1_8",
                        "name": "hostname_view1_8",
                        "label": "Hostname 8",
                        "required": true,
                        "pattern-error": [
                            {
                                "pattern": "validtext",
                                "error": "This field is required."
                            },
                            {
                                "pattern": "length",
                                "min_length": "1",
                                "max_length": "64",
                                "error": "Must not exceed 64 characters."
                            },
                            {
                                "pattern": "hasalphanumericdashunderscore",
                                "error": "Only alphanumeric characters, dashes and underscores allowed."
                            }
                        ],
                        "error": true,
                        "notshowvalid": true,
                        "help": "Any combination of alphabetic characters, numbers, dashes, and underscores. No other special characters are allowed. 64 characters max.",
                        "inlineLinks": [{
                            "id": "show_overlay_view1",
                            "class": "show_overlay",
                            "value": "More"
                        }]
                    },
                    {
                        "element_multiple_error": true,
                        "id": "username_view1_8",
                        "name": "username_view1_8",
                        "label": "Username 8",
//                    "disableAutocomplete": true,
                        "pattern-error": [
                            {
                                "pattern": "hasnotspace",
                                "error": "Must not include a space."
                            },
                            {
                                "pattern": "validtext",
                                "error": "This field is required."
                            },
                            {
                                "regexId": "regex2",
                                "pattern": "^[_]{1}",
                                "error": "Must begin with underscore"
                            }
                        ],
                        "error": true,
                        "notshowvalid": true
                    }
                ]
            }
        ]
    };

    formConfiguration.form8 = {
        "sections": [
            {
                "elements": [
                    {
                        "element_dropdown": true,
                        "id": "dropdown_field_view2_7",
                        "name": "dropdown_field_view2_7",
                        "label": "Dropdown 7",
                        // "required": true,
                        "data": [
                            {
                                "id": "ftp",
                                "text": "junos-ftp"
                            },
                            {
                                "id": "tftp",
                                "text": "junos-tftp",
                                "disabled": true
                            },
                            {
                                "id": "rtsp",
                                "text": "junos-rtsp"
                            },
                            {
                                "id": "netbios",
                                "text": "junos-netbios-session",
                                "selected": true
                            }
                        ],
                        "help": "Dropdown with data parameter",
                        "error": "Please make a selection"
                    },
                    {
                        "element_checkbox": true,
                        "id": "checkbox_field_7",
                        "label": "Checkbox 7",
                        "required": true,
                        "values": [
                            {
                                "id": "checkbox_enable_view_1_7",
                                "name": "checkbox_enable_view2",
                                "label": "Option 1",
                                "value": "enable",
                                "checked": true
                            },
                            {
                                "id": "checkbox_enable_view_2_7",
                                "name": "checkbox_enable_view2",
                                "label": "Option 2",
                                "value": "disable",
                                "checked": false
                            },
                            {
                                "id": "checkbox_disable_view_3_7",
                                "name": "checkbox_enable_view2",
                                "label": "Option 3",
//                                "disabled": true,
                                "value": "disable"
                            }
                        ],
                        "help": "Check box help text",
                        "error": "Please make a selection"
                    },
                    {
                        "element_radio": true,
                        "id": "radio_field_view_7",
                        "label": "Radio Buttons 7",
//                        "required": true,
                        "values": [
                            {
                                "id": "radio1_view_1_7",
                                "name": "radio_field_view_7",
                                "label": "Option 1",
                                "value": "option1"
//                                "disabled": true
                            },
                            {
                                "id": "radio2_view_2_7",
                                "name": "radio_field_view_7",
                                "label": "Option 2",
                                "value": "option2"
                            },
                            {
                                "id": "radio3_view_3_7",
                                "name": "radio_field_view_7",
                                "label": "Option 3",
                                "value": "option3",
                                "checked": true
                            }
                        ],
                        "help": "Radio button help text",
                        "error": "Please make a selection"
                    }
                ]
            }
        ]
    };

    formConfiguration.form9 = {
        "sections": [
            {
                "elements": [
                    {
                        "element_dropdown": true,
                        "id": "dropdown_field_view2_9",
                        "name": "dropdown_field_view2_9",
                        "label": "Dropdown 9",
                        // "required": true,
                        "data": [
                            {
                                "id": "ftp",
                                "text": "junos-ftp"
                            },
                            {
                                "id": "tftp",
                                "text": "junos-tftp",
                                "disabled": true
                            },
                            {
                                "id": "rtsp",
                                "text": "junos-rtsp"
                            },
                            {
                                "id": "netbios",
                                "text": "junos-netbios-session",
                                "selected": true
                            }
                        ],
                        "help": "Dropdown with data parameter",
                        "error": "Please make a selection"
                    },
                    {
                        "element_checkbox": true,
                        "id": "checkbox_field_9",
                        "label": "Checkbox 9",
                        "required": true,
                        "values": [
                            {
                                "id": "checkbox_enable_view_1_9",
                                "name": "checkbox_enable_view2",
                                "label": "Option 1",
                                "value": "enable",
                                "checked": true
                            },
                            {
                                "id": "checkbox_enable_view_2_9",
                                "name": "checkbox_enable_view2",
                                "label": "Option 2",
                                "value": "disable",
                                "checked": false
                            },
                            {
                                "id": "checkbox_disable_view_3_9",
                                "name": "checkbox_enable_view2",
                                "label": "Option 3",
//                                "disabled": true,
                                "value": "disable"
                            }
                        ],
                        "help": "Check box help text",
                        "error": "Please make a selection"
                    },
                    {
                        "element_radio": true,
                        "id": "radio_field_view_9",
                        "label": "Radio Buttons 9",
//                        "required": true,
                        "values": [
                            {
                                "id": "radio1_view_1_9",
                                "name": "radio_field_view_9",
                                "label": "Option 1",
                                "value": "option1"
//                                "disabled": true
                            },
                            {
                                "id": "radio2_view_2_9",
                                "name": "radio_field_view_9",
                                "label": "Option 2",
                                "value": "option2"
                            },
                            {
                                "id": "radio3_view_3_9",
                                "name": "radio_field_view_9",
                                "label": "Option 3",
                                "value": "option3",
                                "checked": true
                            }
                        ],
                        "help": "Radio button help text",
                        "error": "Please make a selection"
                    }
                ]
            }
        ]
    };

    formConfiguration.form10 = {
        "sections": [
            {
                "elements": [
                    {
                        "element_dropdown": true,
                        "id": "dropdown_field_view2_10",
                        "name": "dropdown_field_view2_10",
                        "label": "Dropdown 10",
                        // "required": true,
                        "data": [
                            {
                                "id": "ftp",
                                "text": "junos-ftp"
                            },
                            {
                                "id": "tftp",
                                "text": "junos-tftp",
                                "disabled": true
                            },
                            {
                                "id": "rtsp",
                                "text": "junos-rtsp"
                            },
                            {
                                "id": "netbios",
                                "text": "junos-netbios-session",
                                "selected": true
                            }
                        ],
                        "help": "Dropdown with data parameter",
                        "error": "Please make a selection"
                    },
                    {
                        "element_checkbox": true,
                        "id": "checkbox_field_10",
                        "label": "Checkbox 10",
                        "required": true,
                        "values": [
                            {
                                "id": "checkbox_enable_view_1_10",
                                "name": "checkbox_enable_view2",
                                "label": "Option 1",
                                "value": "enable",
                                "checked": true
                            },
                            {
                                "id": "checkbox_enable_view_2_10",
                                "name": "checkbox_enable_view2",
                                "label": "Option 2",
                                "value": "disable",
                                "checked": false
                            },
                            {
                                "id": "checkbox_disable_view_3_10",
                                "name": "checkbox_enable_view2",
                                "label": "Option 3",
//                                "disabled": true,
                                "value": "disable"
                            }
                        ],
                        "help": "Check box help text",
                        "error": "Please make a selection"
                    },
                    {
                        "element_radio": true,
                        "id": "radio_field_view_10",
                        "label": "Radio Buttons 10",
//                        "required": true,
                        "values": [
                            {
                                "id": "radio1_view_1_10",
                                "name": "radio_field_view_10",
                                "label": "Option 1",
                                "value": "option1"
//                                "disabled": true
                            },
                            {
                                "id": "radio2_view_2_10",
                                "name": "radio_field_view_10",
                                "label": "Option 2",
                                "value": "option2"
                            },
                            {
                                "id": "radio3_view_3_10",
                                "name": "radio_field_view_10",
                                "label": "Option 3",
                                "value": "option3",
                                "checked": true
                            }
                        ],
                        "help": "Radio button help text",
                        "error": "Please make a selection"
                    }
                ]
            }
        ]
    };

    formConfiguration.form11 = {
        "sections": [
            {
                "elements": [
                    {
                        "element_dropdown": true,
                        "id": "dropdown_field_view2_11",
                        "name": "dropdown_field_view2_11",
                        "label": "Dropdown 11",
                        // "required": true,
                        "data": [
                            {
                                "id": "ftp",
                                "text": "junos-ftp"
                            },
                            {
                                "id": "tftp",
                                "text": "junos-tftp",
                                "disabled": true
                            },
                            {
                                "id": "rtsp",
                                "text": "junos-rtsp"
                            },
                            {
                                "id": "netbios",
                                "text": "junos-netbios-session",
                                "selected": true
                            }
                        ],
                        "help": "Dropdown with data parameter",
                        "error": "Please make a selection"
                    },
                    {
                        "element_checkbox": true,
                        "id": "checkbox_field_11",
                        "label": "Checkbox 11",
                        "required": true,
                        "values": [
                            {
                                "id": "checkbox_enable_view_1_11",
                                "name": "checkbox_enable_view2",
                                "label": "Option 1",
                                "value": "enable",
                                "checked": true
                            },
                            {
                                "id": "checkbox_enable_view_2_11",
                                "name": "checkbox_enable_view2",
                                "label": "Option 2",
                                "value": "disable",
                                "checked": false
                            },
                            {
                                "id": "checkbox_disable_view_3_11",
                                "name": "checkbox_enable_view2",
                                "label": "Option 3",
//                                "disabled": true,
                                "value": "disable"
                            }
                        ],
                        "help": "Check box help text",
                        "error": "Please make a selection"
                    },
                    {
                        "element_radio": true,
                        "id": "radio_field_view_11",
                        "label": "Radio Buttons 11",
//                        "required": true,
                        "values": [
                            {
                                "id": "radio1_view_1_11",
                                "name": "radio_field_view_11",
                                "label": "Option 1",
                                "value": "option1"
//                                "disabled": true
                            },
                            {
                                "id": "radio2_view_2_11",
                                "name": "radio_field_view_11",
                                "label": "Option 2",
                                "value": "option2"
                            },
                            {
                                "id": "radio3_view_3_11",
                                "name": "radio_field_view_11",
                                "label": "Option 3",
                                "value": "option3",
                                "checked": true
                            }
                        ],
                        "help": "Radio button help text",
                        "error": "Please make a selection"
                    }
                ]
            }
        ]
    };

    formConfiguration.dynamicSection = function (id) {
        return {
            "sections": [
                {
                    "elements": [
                        {
                            "element_lowercase": true,
                            "id": "text_lowercase_view_d" + id,
                            "name": "text_lowercase_view_d" + id,
                            "label": "Text lowercase " + id,
                            "error": "Please enter a valid string in lowercase"
                        }
                    ]
                }
            ]
        }
    };

    return formConfiguration;

});
