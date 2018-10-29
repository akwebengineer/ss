/**
 * Configuration sample with form elements basic structure
 *
 * @module Form Sample
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @author Vidushi Gupta<vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'widgets/dropDown/tests/dataSample/sampleData',
    'widgets/form/tests/conf/gridConfiguration'
], function (sampleData, gridConfiguration) {
    var configurationSample = {};

    var callbackValue = function (inputValue) {
        if (inputValue['enable'] == true)
            return true;
        return {valid: false, error: "Callback Custom Error!"};
    };
    configurationSample.basicStructure = {
        "title": "Basic Structure Sample",
        "form_id": "basic_structure",
        "form_name": "basicStructure_form",
        "sections": [
            {
                "heading": "Empty Structure",
                "section_id": "emptySection",
                "elements": []
            }
        ],
        "buttons": [],
        "footer": []
    };

    configurationSample.basicStructureInfoError = {
        "title": "Basic Structure Sample",
        "form_id": "basic_structure_info_error",
        "form_name": "basic_structure_info_error",
        "form_info": {
            "content": "This device is being used by <i>root</i>. Please, refrain from using it.",
            "class": "test_title_info"
        },
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text":"Configuring Basic Settings",
        "sections": [
            {
                "section_id": "emptySection",
                "elements": []
            }
        ],
        "buttons": [],
        "footer": []
    };

    configurationSample.ipv4Orv6 = {
        "element_ip": true,
        "id": "text_ip_v4Orv6",
        "name": "text_ip_v4Orv6",
        "label": "Text ip v4 or v6",
        "placeholder": "",
        "error": "Please enter a valid IP either version 4 or version 6",
        "help": "Help for valid IP either version 4 or version 6",
        "inlineLinks": [{
            "id": "show_overlay",
            "class": "show_overlay",
            "value": "Show Form/Grid on Overlay"
        }]
    };

    configurationSample.dropdown1 = {
        "element_dropdown": true,
        "id": "dropdown_field_1",
        "name": "dropdown_field_1",
        "label": "Dropdown 1",
        "required": true,
        "width": 'small',
        "values": [ //to be deprecated, use data instead
            {
                "label": "Select an option",
                "value": ""
            },
            {
                "label": "Option 1",
                "value": "option1"
            },
            {
                "label": "Option 2",
                "value": "option2",
                "disabled": true
            },
            {
                "label": "Option 3",
                "value": "option3"
            }
        ],
        "help": "Dropdown with default parameter",
        "error": "Please make a selection"
    };

    configurationSample.dropdown2 = {
        "element_dropdown": true,
        "id": "dropdown_field_2",
        "name": "dropdown_field_2",
        "label": "Dropdown 4",
        "required": true,
        "initValue": "{{dropDown}}",
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
        "error": "Please make a selection",
        "width": 'large'
    };

    configurationSample.dropdown2_v2 = {
        "element_dropdown": true,
        "id": "dropdown_field_2_s",
        "name": "dropdown_field_2_s",
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
    };

    configurationSample.dropdown3 = {
        "element_dropdown": true,
        "id": "dropdown_field_3_s",
        "name": "dropdown_field_3_s",
        "label": "Dynamic Dropdown",
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
    };

    configurationSample.dropdown3_v2 = {
        "element_dropdown": true,
        "id": "dropdown_field_3",
        "name": "dropdown_field_3",
        "label": "Dropdown 3",
        "help": "Dropdown help text",
        "error": "Please make a selection",
        "initValue": "{{dropDown}}",
        "multipleSelection": {
            maximumSelectionLength: 2,
            createTags: true
        },
        "placeholder": "Select an option",
        "data": sampleData.short,
        "width": 350
    };

    configurationSample.dropdown4 = {
        "element_dropdown": true,
        "id": "dropdown_field_4",
        "name": "dropdown_field_4",
        "label": "Dropdown 2",
        "required": true,
        "width": 'medium',
        "values": [ //to be deprecated, use data instead
            {
                "label": "Select an option",
                "value": ""
            },
            {
                "label": "Option 1",
                "value": "option1"
            },
            {
                "label": "Option 2",
                "value": "option2",
                "disabled": true
            },
            {
                "label": "Option 3",
                "value": "option3"
            }
        ],
        "help": "Dropdown with default parameter",
        "error": "Please make a selection"
    };

    configurationSample.gridConfig = {
        "element_grid": true,
        "id": "text_grid",
        "name": "text_grid",
        "label": "Grid Integration",
        "elements": gridConfiguration.smallGrid.elements,
        "actionEvents": gridConfiguration.smallGrid.actions,
        "error": "Grid validation failed"
    };

    configurationSample.emailConfig = {
        "element_email": true,
        "id": "text_email",
        "name": "text_email",
        "label": "Text email",
        "placeholder": "",
//                        "required": true,
        "disabled": true,
        "error": "Please enter a valid email",
        "value": "{{email}}"
    };

    configurationSample.datePickerConfig = {
        "element_datePickerWidget": true,
        "id": "text_datepickerWidget",
        "name": "text_datepickerWidget",
        "label": "Date Picker Widget",
        "required": true,
        "placeholder": "MM/DD/YYYY",
        "dateFormat": "mm/dd/yyyy",
        "initValue": "{{datePicker}}",
        "pattern-error": [
            {
                "pattern": "length",
                "min_length": "10",
                "max_length": "10",
                "error": "Incomplete MM/DD/YYYY"
            },
            {
                "pattern": "date",
                "error": "Must be MM/DD/YYYY"
            },
            {
                "pattern": "validtext",
                "error": "This is a required field"
            }
        ],
        "error": true,
        "notshowvalid": true
    };

    configurationSample.timeConfig = {
        "element_timeWidget": true,
        "id": "text_timeWidget",
        "initValue": "{{time}}"
    };

    configurationSample.dateTimeConfig = {
        "element_dateTimeWidget": true,
        "id": "text_dateTimeWidget",
        "label": "Date Time Widget",
        "required": true,
        "initValue": "{{dateTime}}",
        "datePickerWidget": {
            "id": "text_dateTime_date_Widget",
            "name": "text_dateTime_date_Widget",
            "placeholder": "MM/DD/YYYY",
            "dateFormat": "mm/dd/yyyy",
            //"disabled": true,
            "pattern-error": [
                {
                    "pattern": "length",
                    "min_length": "10",
                    "max_length": "10",
                    "error": "Incomplete MM/DD/YYYY"
                },
                {
                    "pattern": "date",
                    "error": "Must be MM/DD/YYYY"
                },
                {
                    "pattern": "validtext",
                    "error": "This is a required field"
                }
            ],
            "error": true,
            "notshowvalid": true
        },
        "timeWidget": {
            "id": "text_dateTime_time_Widget",
            "name": "text_dateTime_time_Widget"
        }
    };

    configurationSample.ipCidrConfig = {
        "element_ipCidrWidget": true,
        "id": "text_ipCidrWidget1",
        "label": "IP/CIDR Widget",
        "ip_id": "text_ip1",
        "ip_name": "text_ip1",
        "ip_placeholder": "IP v4 or v6",
        "ip_field-help": {
            "content": "IP v6 example",
            "ua-help-identifier": "alias_for_title_ua_event_binding"
        },
        "ip_error": "Invalid IP address",
        "cidr_id": "text_cidr3",
        "cidr_name": "text_cidr3",
        "cidr_placeholder": "CIDR",
        "cidr_error": "Invalid CIDR",
        "subnet_label": "Subnet",
        "subnet_id": "text_subnet3",
        "subnet_name": "text_subnet3",
        "subnet_placeholder": "Subnet placeholder",
        "subnet_field-help": {
            "content": "subnet example",
            "ua-help-identifier": "alias_for_title_ua_event_binding"
        },
        "subnet_error": "Please enter a valid subnet mask",
        "initValue": "{{ipCidr}}"
//                        "hidden": true
    };

    configurationSample.ipCidrConfig_v2 = {
        "element_ipCidrWidget": true,
        "id": "text_ipCidrWidget",
        "label": "IP Label only"
    };

    configurationSample.checkboxConfig = {
        "element_checkbox": true,
        "id": "checkbox_field",
        "label": "Checkbox",
        "initValue": "{{checkBox}}",
        "values": [
            {
                "id": "checkbox_enable1",
                "name": "checkbox_enable",
                "label": "Option 1",
                "value": "enable",
                "checked": true
            },
            {
                "id": "checkbox_enable2",
                "name": "checkbox_enable",
                "label": "Option 2",
                "value": "disable",
                "checked": false
            },
            {
                "id": "checkbox_disable",
                "name": "checkbox_enable",
                "label": "Option 3",
                "value": "disable"
            }
        ],
        "help": "Check box help text",
        "error": "Please make a selection"
    };

    configurationSample.checkboxConfig_v2 = {
        "element_checkbox": true,
        "id": "checkbox_enable_s",
        "label": "Checkbox Serialize",
        "initValue": "{{checkBox_s.checkBox_s1.checkBox_s2}}",
        "values": [
            {
                "id": "checkbox_enable1_s",
                "name": "checkbox_enable_s",
                "label": "Option 1",
                "value": "enable1",
                "checked": true
            },
            {
                "id": "checkbox_enable2_s",
                "name": "checkbox_enable_s",
                "label": "Option 2",
                "value": "enable2"
            },
            {
                "id": "checkbox_enable3_s",
                "name": "checkbox_enable_s",
                "label": "Option 3",
                "value": "enable3"
            }
        ],
        "error": "Please make a selection"
    };

    configurationSample.radioFieldConfig = {
        "element_radio": true,
        "id": "radio_field",
        "label": "Radio Buttons",
        "required": true,
        "initValue": "{{radioButton}}",
        "values": [
            {
                "id": "radio1",
                "name": "radio_button",
                "label": "Option 1",
                "value": "option1"
//                                 "disabled": true
            },
            {
                "id": "radio2",
                "name": "radio_button",
                "label": "Option 2",
                "value": "option2"
            },
            {
                "id": "radio3",
                "name": "radio_button",
                "label": "Option 3",
                "value": "option3",
                "checked": true
            }
        ],
        "help": "Radio button help text",
        "error": "Please make a selection"
    };

    configurationSample.radioFieldConfigWithHelp = {
        "element_radio": true,
        "id": "radio_field",
        "label": "Radio Buttons",
        "required": true,
        "initValue": "{{radioButton}}",
        "field-help": {
            "content": "Tooltip for radio field",
            "ua-help-identifier": "alias_for_radio_ua_event_binding"
        },
        "values": [
            {
                "id": "radio1",
                "name": "radio_button",
                "label": "Option 1",
                "value": "option1"
//                                 "disabled": true
            },
            {
                "id": "radio2",
                "name": "radio_button",
                "label": "Option 2",
                "value": "option2"
            },
            {
                "id": "radio3",
                "name": "radio_button",
                "label": "Option 3",
                "value": "option3",
                "checked": true
            }
        ],
        "help": "Radio button help text",
        "error": "Please make a selection"
    };

    configurationSample.radioFieldConfig_v2 = {
        "element_radio": true,
        "id": "radio_button_s",
        "label": "Radio Buttons Serialize",
        "initValue": "{{radioButton_s.radioButton_s1}}",
        "values": [
            {
                "id": "radio1_s",
                "name": "radio_button_s",
                "label": "Option 1",
                "value": "option1"
            },
            {
                "id": "radio2_s",
                "name": "radio_button_s",
                "label": "Option 2",
                "value": "option2"
            },
            {
                "id": "radio3_s",
                "name": "radio_button_s",
                "label": "Option 3",
                "value": "option3",
                "checked": true
            }
        ],
        "error": "Please make a selection"
    };

    configurationSample.endpointConfig = {
        "element_string": true,
        "id": "endpointsetting_s",
        "name": "endpointsetting_s",
        "label": "Input Serialize 4",
        "value": "{{endpointsetting.endpointsetting1.endpointsetting2.endpointsetting3.port}}",
        "error": "Please enter a valid value"
    };

    configurationSample.urlConfig = {
        "element_url": true,
        "id": "text_url",
        "name": "text_url",
        "label": "Text url",
        "placeholder": "http://www.juniper.net",
        "error": "Please enter a valid URL",
        "value": "{{url}}"
    };

    configurationSample.requiredConfig = {
        "element_string": true,
        "id": "show_hide_element41",
        "name": "show_hide_element41",
        "label": "Show on ToggleOn1of2",
        "hidden": true,
        "required": true,
        "error": true
    };

    configurationSample.inlineConfig = {
        "element_text": true,
        "id": "text_field_inline",
        "name": "text_field_inline",
        "label": "Rate",
        "inlineLabels": [{
            "id":"show_units",
            "class":"show_units",
            "value":"of 10"
        },{
            "id":"show_dims",
            "class":"show_dims",
            "value":"m/s"
        }],
        "inlineLinks":[{
            "id": "show_overlay",
            "class": "show_overlay",
            "value": "Show Form/Grid on Overlay"
        }],
        "inlineIcons": [
            {
                "class": "test-elementicon1",
                "id": "add-element-icon"
            },
            {
                "icon": {
                    "default": {
                        icon_url: "#icon_inline_ok",
                        icon_class: "icon_inline_ok-dims"
                    },
                    "label": "Save"
                },
                "id": "test-element-icon2"
            }
        ]
    };

    configurationSample.slider = {
        "element_slider": true,
        "id": "text_slider",
        "name": "text_slider",
        "label": "Slider Integration",
        "handles": [{
            "value": 40,
            "connect": {
                "right": false
            }
        }],
        "scale": {
            "range": {
                "min": 0,
                "max": 100
            },
            "numberOfValues": 3
        }
    };

    configurationSample.nonRequiredInput = {
        "element_email": true,
        "id": "text_email_v_1",
        "name": "text_email_v_1",
        "label": "Email 1",
        "error": "Please enter a valid email"
    };

    configurationSample.requiredInput = {
        "element_email": true,
        "id": "text_email_v_2",
        "name": "text_email_v_2",
        "label": "Email 2",
        "error": "Please enter a valid email",
        "required": true
    };

    configurationSample.callbackUrlValidationConfig = {
        "element_checkbox": true,
        "id": "checkbox_field1",
        "label": "Checkbox",
        "required": true,
        "values": [
            {
                "id": "checkbox_enable11",
                "name": "checkbox_enable1",
                "label": "Option 1",
                "value": "enable"
            },
            {
                "id": "checkbox_enable21",
                "name": "checkbox_enable1",
                "label": "Option 2",
                "value": "enable2",
                "checked": false
            },
            {
                "id": "checkbox_disable31",
                "name": "checkbox_enable1",
                "label": "Option 3",
                "value": "enable3"
            }
        ],
        "error": "Please make a selection",
        "callbackValidation": callbackValue
    };

    return configurationSample;
});