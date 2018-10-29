/**
 * A sample data that exercises all the elements and validation that
 * the Form Widget supports
 *
 * @module Form Sample
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'widgets/dropDown/tests/dataSample/sampleData',
    'widgets/form/tests/conf/gridConfiguration',
    'widgets/form/tests/conf/tabConfiguration',
    'widgets/form/conf/passwordStrengthConfiguration'
], function (sampleData, gridConfiguration, tabConfiguration, passwordStrengthConfiguration) {

    var buildNameUrl = function (inputvalue){
        var url = "/form-test/remote-validation/object/developer-first-generation/";
        url += inputvalue;
        return url;
    };

    var submitCallback1 = function(data, success, error){
        var url = "/form-test/submit-callback/spinner-build-test1/";
        console.log("form.getValues()outputs:");
        console.log(data);
        $.ajax({
            url: url,
            success: function (e, xhr, settings) {
                success();
            },
            error: function (e, xhr, settings) {
                error("Server Validation not successful!");
            }
        });
    };

    var submitCallback2 = function(data, success, error){
        var url = "/form-test/submit-callback/spinner-build-test2/";
        console.log("form.getValues()outputs:");
        console.log(data);
        $.ajax({
            url: url,
            success: function (e, xhr, settings) {
                success();
            },
            error: function (e, xhr, settings) {
                error("Please try again later, Your account is blocked!");
            }
        });
    };

    var remoteValidate = function (el, callback){
        var url = "/form-test/remote-validation/callback/developer-new-generation/";
        url += el.value;
        $.ajax({
            url: url,
            complete: function (e, xhr, settings) {
                var errorMsg = "Developer's name is invalid, try some other name!";
                var isValid = e.responseText;
                isValid = _.isEqual(isValid,"true");
                callback(isValid, errorMsg);
            }
        });
    };

    var callbackValue = function (inputValue){
        // inputValue will be Object in case of checkbox and radio and a string in case of other fields
        if (inputValue == "Test Callback Value")
            return true;
        return {valid: false, error: "Callback Custom Error!"};
    };

    var callbackValue1 = function (inputValue){
        // inputValue will be Object in case of checkbox and radio and a string in case of other fields
        if (inputValue['enable'] == true)
            return true;
        return {valid: false, error: "Callback Custom Error!"};
    };

    var callbackValue2 = function (inputValue){
        // inputValue will be Object in case of checkbox and radio and a string in case of other fields
        if (inputValue['option1'] == true)
            return true;
        return {valid: false, error: "Callback Custom Error!"};
    };

    var configurationSample = {};

    configurationSample.elements = {
        "title": "Sample Form Widget",
        "form_id": "sample_form",
        "form_name": "sample_form",
        "title-help": {
            "content": "Tooltip for the title of the Form Widget",
            "ua-help-text": "More..",
            "ua-help-identifier": "alias_for_title_ua_event_binding"
        },
        "form_info": {
            "content": "This device is being used by <i>root</i>. Please, refrain from using it.",
            "class": "test_title_info"
        },
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text":"Configuring Basic Settings",
        // "err_timeout": "1000",
        // "valid_timeout": "5000",
        "timeout": {
          "error": "1000",
          "valid": "5000",
          "remote_error": "1500"
        },
        "sections": [
            {
                "heading": "Widget Integration",
                "heading_text": "Integration with other form elements like the IpCidr, DatePicker, Date, DateTime and DropDown widgets.<br/> It also allows to show/hide the inline error for a form element",
                "section_id": "section_id_3",
                "section_class": "section_class",
                "progressive_disclosure": "expanded", //two possible values: expanded or collapsed
                "elements": [
                    {
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
                        "cidr_id": "text_cidr1",
                        "cidr_name": "text_cidr1",
                        "cidr_placeholder": "CIDR",
                        "cidr_error": "Invalid CIDR",
                        "subnet_label": "Subnet",
                        "subnet_id": "text_subnet1",
                        "subnet_name": "text_subnet1",
                        "subnet_placeholder": "Subnet placeholder",
                         "subnet_field-help": {
                                "content": "subnet example",
                                "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "subnet_error": "Please enter a valid subnet mask",
                        "initValue": "{{ipCidr}}"
                       // "hidden": true
                    },
                    {
                        "element_ipCidrWidget": true,
                        "id": "text_ipCidrWidget",
                        "label": "IP Label only"
                    },
                    {
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
                                "min_length":"10",
                                "max_length":"10",
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
                    {
                        "element_timeWidget": true,
                        "id": "text_timeWidget",
                        "initValue": "{{time}}"
//                        "initValue": {
//                            "time": "08:00:00",
//                            "period": "AM"
//                             }
                    },
                    {
                        "element_dateTimeWidget": true,
                        "id": "text_dateTimeWidget",
                        "label": "Date Time Widget with long long long label",
                        "required": true,
                        "initValue": "{{dateTime}}",
                        "field-help": {
                            "content": "The string should contain only letters (a-zA-Z)",
                            "ua-help-identifier": "alias_for_ua_event_binding2"
                        },
                        "datePickerWidget": {
                            "id": "text_dateTime_date_Widget",
                            "name": "text_dateTime_date_Widget",
                            "placeholder": "MM/DD/YYYY",
                            "dateFormat": "mm/dd/yyyy",
                            //"disabled": true,
                            "pattern-error": [
                                {
                                    "pattern": "length",
                                    "min_length":"10",
                                    "max_length":"10",
                                    "error": "Incomplete MM/DD/YYYY"
                                },
                                {
                                    "pattern": "date",
                                    "error": "Must be MM/DD/YYYY"
                                },
                                {
                                    "pattern": "validtext",
                                    "error": "This is a required field"
                                },
                                {
                                    "pattern": "afterdate",
                                    "after_date": "01/01/2010",
                                    "error": "Please enter a date after Jan 01, 2010"
                                }
                            ],
                            "error": true,
                            "notshowvalid": true
                        },
                        "timeWidget":{
                            "id": "text_dateTime_time_Widget",
                            "name": "text_dateTime_time_Widget"
                        }
                    },
                    {
                        "element_timeZoneWidget": true,
                        "class": "copy_timezone",
                        "id": "text_timeZoneWidget",
                        "name": "text_timeZoneWidget",
                        "label": "Timezone widget",
                        "initValue": "{{timeZone}}",
                        "field-help": {
                            "content": "The string should contain only letters (a-zA-Z)",
                            "ua-help-identifier": "alias_for_ua_event_binding2"
                        }
                    },
                    {
                        "element_toggleButton": true,
                        "id": "togglebutton_field_1",
                        "name": "togglebutton_field_1",
                        "label": "Toggle Button",
//                        "on": true
                        "initValue": "{{toggleButton}}"
                    },
                    {
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
                        },{
                            "class": "toggle_form_info",
                            "value": "Toggle Form Info"
                        },{
                            "class": "toggle_form_error",
                            "value": "Toggle Form Error"
                        }]
                    },
                    {
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
                    },
                    {
                        "element_grid": true,
                        "id": "text_grid",
                        "name": "text_grid",
                        "label": "Grid Integration",
                        "elements": gridConfiguration.smallGridOnAllPageForm.elements,
                        "actionEvents" : gridConfiguration.smallGrid.actions,
                        "error": "Grid validation failed"
                    },
                    {
                        "element_description": true,
                        "id": "grid_buttons",
                        "name": "grid_buttons",
                        "label": " ",
                        "inlineButtons":[{
                            "id": "show_inline_error",
                            "class": "show_inline_error",
                            "name": "show_inline_error",
                            "value": "Show inline error"
                        },{
                            "id": "hide_inline_error",
                            "class": "hide_inline_error",
                            "name": "hide_inline_error",
                            "value": "Hide inline error"
                        }],
                        "inlineLinks":[{
                            "id": "show_overlay",
                            "class": "show_overlay",
                            "value": "Show Form/Grid on Overlay"
                        }]
                    },
                    {
                        "element_tabContainer": true,
                        "id": "text_tab",
                        "name": "text_tab",
                        "label": "Tab Integration",
                        "tabs": tabConfiguration.withGrids,
                        "height": "15%"
                    },
                    {
                        "element_description": true,
                        "id": "tab_buttons",
                        "name": "tab_buttons",
                        "label": " ",
                        "inlineLinks":[{
                            "id": "show_tab_overlay",
                            "value": "Show Tab/Form/Grid on Overlay"
                        },{
                            "id": "show_form_tab_overlay",
                            "value": "Show Form/Tab/Form/Grid on Overlay"
                        }]
                    }
                ]
            },
            {
                "heading": "Multiple Value Form Elements",
                "heading_text": "Form elements like radio buttons, checkbox, and radio buttons",
                "section_id": "section_id_4",
//                "progressive_disclosure": "expanded", //two possible values: expanded or collapsed
                "elements": [
                    {
                        "element_checkbox": true,
                        "id": "checkbox_field",
                        "label": "Checkbox",
                       // "required": true,
                        "initValue": "{{checkBox}}",
//                        "initValue": [
//                             {
//                                 "id": "checkbox_enable1",
//                                 "checked": false
//                             },
//                             {
//                                 "id": "checkbox_disable",
//                                 "checked": true
//                             }
//                         ],
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
//                                "disabled": true,
                                "value": "disable"
                            }
                        ],
                        "help": "Check box help text",
                        "error": "Please make a selection"
                    },
                    {
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
                    }
                ]
            },
            {
                "heading": "Form dropdown elements",
                "heading_text": "Multiple dropdown elements with 'small', 'large', 'medium' and 'user-defined' width",
                "section_id": "section_id_9",
                "elements": [
                    {
                        "element_dropdown": true,
                        "id": "dropdown_field_1",
                        "name": "dropdown_field_1",
                        "label": "Small Width",
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
                    },
                    {
                        "element_dropdown": true,
                        "id": "dropdown_field_4",
                        "name": "dropdown_field_4",
                        "label": "Medium Width",
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
                    },
                    {
                        "element_dropdown": true,
                        "id": "dropdown_field_2",
                        "name": "dropdown_field_2",
                        "label": "Large Width",
                        "required": true,
                        "initValue": "{{dropDown}}",
                        "width": 'large',
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
                        "element_dropdown": true,
                        "id": "dropdown_field_3",
                        "name": "dropdown_field_3",
                        "label": "Fixed Width",
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
                    },
                    {
                        "element_dropdown": true,
                        "id": "dropdown_field_5",
                        "name": "dropdown_field_5",
                        "label": "Container Width",
                        "help": "Dropdown help text",
                        "error": "Please make a selection",
                        "initValue": "{{dropDown}}",
                        "multipleSelection": {
                            maximumSelectionLength: 2,
                            createTags: true
                        },
                        "placeholder": "Select an option",
                        "data": sampleData.short
                    }
                ]
            },
            {
                "heading": "Visibility for Non Input Form Elements",
                "heading_text": "Form elements like radio buttons, checkbox, and radio buttons can include elements that are enabled/disabled, showed/hided or required based on its visibility",
                "section_id": "section_id_5",
                "progressive_disclosure": "expanded", //two possible values: expanded or collapsed
                "elements": [
                    {
                        "element_dropdown": true,
                        "id": "dropdown_field_2_v",
                        "name": "dropdown_field_2_v",
                        "label": "Dropdown Visibility",
                        "required": true,
//                        "initValue": "{{dropDown_v}}",
                        "data": [
                            {
                                "id": "ftp_v",
                                "text": "junos-ftp-el5",
//                                "visibility": "show_hide_element5",
                                "visibility": {
                                    "visibilityIds": "show_hide_element5"
//                                    "required": true
                                },
                                "selected": true
                            },
                            {
                                "id": "tftp_v",
                                "text": "junos-tftp",
                                "disabled": true
                            },
                            {
                                "id": "rtsp_v",
                                "text": "junos-rtsp-el6&el7",
                                "visibility": ["show_hide_element6","show_hide_element7"]
                            },
                            {
                                "id": "netbios_v",
                                "text": "junos-netbios-session"
                            },
                            {
                                "id": "netbios_v1",
                                "text": "junos-netbios1-el6",
                                "visibility": ["show_hide_element6"]
                            }
                        ],
                        "help": "Dropdown with data parameter",
                        "error": "Please make a selection"
                    },
                    {
                        "element_string": true,
                        "id": "show_hide_element5",
                        "label": "Show on ftp el5",
                        "hidden": true,
                        "error": "This value is required on selection of junos-ftp in the dropdown"
                    },
                    {
                        "element_string": true,
                        "id": "show_hide_element6",
                        "name": "show_hide_element6",
                        "label": "Show on rtsp 1 el6",
                        "hidden": true
                    },
                    {
                        "element_string": true,
                        "id": "show_hide_element7",
                        "name": "show_hide_element7",
                        "label": "Show on rtsp 2 el7",
                        "hidden": true
                    },
                    {
                        "element_checkbox": true,
                        "id": "checkbox_enable_v",//name and id should match
                        "label": "Checkbox Visibility",
                        "required": true,
//                        "initValue": "{{checkBox_v}}",
                        "values": [
                            {
                                "id": "checkbox_enable1_v",
                                "name": "checkbox_enable_v",
                                "label": "Option 1",
                                "value": "option1",
//                                "visibility": "show_hide_element0",
                                "visibility": {
                                    "visibilityIds": "show_hide_element0"
                                },
                                "checked": true
                            },
                            {
                                "id": "checkbox_enable2_v",
                                "name": "checkbox_enable_v",
                                "label": "Option 2",
                                "value": "option2",
                                "visibility": ["show_hide_element1","show_hide_element2"]
//                                "visibility": "show_hide_element2",
                            },
                            {
                                "id": "checkbox_disable_v",
                                "name": "checkbox_enable_v",
                                "label": "Option 3",
                                "value": "option3"
                            }
                        ],
                        "help": "Check box that updates other elements",
                        "error": "Please make a selection"
                    },
                    {
                        "element_string": true,
                        "id": "show_hide_element0",
                        "name": "show_hide_element0",
                        "label": "Show on Option1",
                        "hidden": true
                    },
                    {
                        "element_string": true,
                        "id": "show_hide_element1",
                        "name": "show_hide_element1",
                        "label": "Show on Option2a",
                        "hidden": true
                    },
                    {
                        "element_string": true,
                        "id": "show_hide_element2",
                        "name": "show_hide_element2",
                        "label": "Show on Option2b",
                        "hidden": true
                    },
                    {
                        "element_radio": true,
                        "id": "radio_button_v",
                        "label": "Radio Buttons Visibility",
                        "required": true,
//                        "initValue": "{{radioButton_v}}",
                        "values": [
                            {
                                "id": "radio1_v",
                                "name": "radio_button_v",
                                "label": "Option 1",
                                "value": "option1",
                                "visibility": {
                                    "visibilityIds": ["show_hide_element31","show_hide_element32"]
                                }
                            },
                            {
                                "id": "radio2_v",
                                "name": "radio_button_v",
                                "label": "Option 2",
                                "value": "option2"
                            },
                            {
                                "id": "radio3_v",
                                "name": "radio_button_v",
                                "label": "Option 3",
                                "value": "option3",
                                "checked": true,
                                "visibility": {
                                    "visibilityIds": "show_hide_element34",
                                    "disabled": true
                                }
                            }
                        ],
                        "help": "Radio button help text",
                        "error": "Please make a selection"
                    },
                    {
                        "element_string": true,
                        "id": "show_hide_element31",
                        "name": "show_hide_element31",
                        "label": "Show on Option1a",
                        "hidden": true
                    },
                    {
                        "element_string": true,
                        "id": "show_hide_element32",
                        "name": "show_hide_element32",
                        "label": "Show on Option1b",
                        "hidden": true
                    },
                    {
                        "element_string": true,
                        "id": "show_hide_element34",
                        "name": "show_hide_element34",
                        "label": "Disabled on Option2",
                        "value": "Test"
                    },
                    {
                        "element_toggleButton": true,
                        "id": "toggle_button_v",
                        "name": "toggle_button_v",
                        "label": "Toggle Button V",
                        // "on": true
                        "initValue": "{{toggleButton}}",
                        // "visibility": "show_hide_element41",
                        "visibility": ["show_hide_element41","show_hide_element42"]
                    },
                    {
                        "element_string": true,
                        "id": "show_hide_element41",
                        "name": "show_hide_element41",
                        "label": "Show on ToggleOn1of2",
                        "hidden": true,
                        "required": true,
                        "error": "Please enter a valid text",
                        "field-help": {
                            "content": "The string should contain only letters (a-zA-Z)",
                            "ua-help-identifier": "alias_for_ua_event_binding2"
                        }
                    },
                    {
                        "element_string": true,
                        "id": "show_hide_element42",
                        "name": "show_hide_element42",
                        "label": "Show on ToggleOn2of2",
                        "hidden": true
                    },
                    {
                        "element_toggleButton": true,
                        "id": "toggle_button_v_1",
                        "name": "toggle_button_v_1",
                        "label": "Toggle Button V_Op",
                        "visibility": {
                            "visibilityIds": "show_hide_element43",
                            "isExpectedValue": function (data) {
                                return !data[0].value;
                            }
                        }
                    },
                    {
                        "element_string": true,
                        "id": "show_hide_element43",
                        "name": "show_hide_element43",
                        "label": "Hide on ToggleOff",
                        "hidden": true
                    },
                    {
                        "element_radio": true,
                        "id": "radio_button_v_section",
                        "label": "For Section Visibility",
                        "required": true,
                        "values": [
                            {
                                "id": "radio1_v1",
                                "name": "radio_button_v_section",
                                "label": "No Section",
                                "value": "option1_v"
                            },
                            {
                                "id": "radio2_v1",
                                "name": "radio_button_v_section",
                                "label": "Show Section 1",
                                "value": "option2_v",
                                "visibility": {
                                    "visibilityIds": ["section_visibility_id_1"]
                                }
                            },
                            {
                                "id": "radio3_v1",
                                "name": "radio_button_v_section",
                                "label": "Show Section 2",
                                "value": "option3_v",
                                "checked": true,
                                "visibility": "section_visibility_id_2"
                            }
                        ],
                        "help": "Select 'No Section' to Remove Section 1 or Section 2",
                        "error": "Please make a selection"
                    }
                ]
            },
            {
                "heading": "Section 1 Visibility",
                "section_id": "section_visibility_id_1",
                "progressive_disclosure": "collapsed",
                "hidden": true,
                "elements": [
                    {
                        "element_string": true,
                        "id": "text_email_s_v",
                        "name": "text_email_s_v",
                        "label": "Text email",
                        "required": true,
                        "error": "Please enter a valid text"
                    }
                ]
            },
            {
                "heading": "Section 2 Visibility",
                "heading_text": "Section available if 'Show Section 2' radio button from the 'For Section Visibility' is selected",
                "section_id": "section_visibility_id_2",
                "hidden": true,
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
                "heading": "Visibility for Input Form Elements",
                "heading_text": "Form elements like input can be linked to other elements and make them enabled/disabled, showed/hided or required based on the visibility property",
                "section_id": "section_id_6",
                "progressive_disclosure": "collapsed", //two possible values: expanded or collapsed
                "elements": [
                    { //next 3 elements cover the visibility (show/hide) for an array or a string of hidden elements defined in a visibility property
                        "element_email": true,
                        "id": "text_email_v_1",
                        "name": "text_email_v_1",
                        "label": "Email x ShowHide",
                        "error": "Please enter a valid email",
//                        "visibility": "text_string_v_1"
                        "visibility": ["text_string_v_1_1","text_string_v_1_2"]
                    },
                    {
                        "element_string": true,
                        "id": "text_string_v_1_1",
                        "name": "text_string_v_1_1",
                        "label": "Text email Show1",
                        "error": "Please enter a valid value",
                        "hidden": true
                    },
                    {
                        "element_string": true,
                        "id": "text_string_v_1_2",
                        "name": "text_string_v_1_2",
                        "label": "Text email Show2",
                        "error": "Please enter a valid value",
                        "hidden": true
                    },
                    { //next elements cover the enabled/disabled option for a element id defined in a visibilityIds property inside a visibility Object property
                        "element_email": true,
                        "id": "text_email_v_2",
                        "name": "text_email_v_2",
                        "label": "Email x EnableDisable",
                        "error": "Please enter a valid email",
                        "visibility": {
                            "visibilityIds": "text_string_v_2_1",
                            "disabled": true
                        }
                    },
                    {
                        "element_string": true,
                        "id": "text_string_v_2_1",
                        "name": "text_string_v_2_1",
                        "label": "Text email Show1",
                        "value": "test",
                        "error": "Please enter a valid value"
                    },
                    { //next elements cover the required option for a element id defined in a visibilityIds property inside a visibility Object property
                        "element_email": true,
                        "id": "text_email_v_3",
                        "name": "text_email_v_3",
                        "label": "Email x Required",
                        "error": "Please enter a valid email",
//                        "value": "{{email}}",
                        "visibility": {
                            "visibilityIds": "text_string_v_3_1",
                            "required": true
                        }
                    },
                    {
                        "element_string": true,
                        "id": "text_string_v_3_1",
                        "name": "text_string_v_3_1",
                        "label": "Text email Show1",
                        "value": "test",
                        "error": "Please enter a valid value"
                    },
                    {
                        "element_email": true,
                        "id": "text_email_v_4",
                        "name": "text_email_v_4",
                        "label": "Email x ShowHide nxn",
                        "error": "Please enter a valid email",
//                        "value": "{{email}}",
                        "visibility": {
                            "linkedIds": "text_url_v_1",
//                            "visibilityIds": "text_string_v_4_1",
                            "visibilityIds": ["text_string_v_4_1","text_string_v_4_2"]
//                            "required": true,
//                            "required": function (data) {
//                                console.log(data);
//                                for (var i=0; i<data.length; i++){
//                                    var elementData = data[i];
//                                    if (elementData.value=="test")
//                                        return false;
//                                }
//                                return true;
//                            },
//                            "disabled": true,
//                            "isExpectedValue": function (data) {
//                                console.log(data);
//                                for (var i=0; i<data.length; i++){
//                                    var elementData = data[i];
//                                    if (!elementData.isValidValue || elementData.value=="test")
//                                        return false;
//                                }
//                                return true;
//                            }
                        }
                    },
                    {
                        "element_string": true,
                        "id": "text_url_v_1",
                        "name": "text_url_v_1",
                        "label": "Text",
                        "error": "Please enter a valid value",
                        "visibility": {
                            "linkedIds": "text_email_v_4",
//                            "visibilityIds": "text_string_v_4_1",
                            "visibilityIds": ["text_string_v_4_1","text_string_v_4_2"]
//                            "isExpectedValue": function (data) {
//                                console.log(data);
//                                for (var i=0; i<data.length; i++){
//                                    var elementData = data[i];
//                                    if (!elementData.isValidValue || elementData.value=="test")
//                                        return false;
//                                }
//                                return true;
//                            }
                        },
                        "help": "Do not use the word test if you want to show more elements"
                    },
                    {
                        "element_string": true,
                        "id": "text_string_v_4_1",
                        "name": "text_string_v_4_1",
                        "label": "Text email Show nxn 1",
                        "error": "Please enter a valid value",
//                        "required": true
                        "hidden": true
                    },
                    {
                        "element_string": true,
                        "id": "text_string_v_4_2",
                        "name": "text_string_v_4_2",
                        "label": "Text email Show nxn 2",
                        "error": "Please enter a valid value",
//                        "required": true
                        "hidden": true
                    }
                ]
            },
            {
                "heading": "Visibility Element Inside Toggle Section",
                "section_id": "section_id_11",
                "section_class": "section_class",
                "toggle_section":{
                    "label": "Select to show the form elements of the multiple validation section",
                    "status": "hide" //two possible values: show or hide
//                    "checked": true
                },
                "elements": [
                    {
                        "element_toggleButton": true,
                        "id": "toggle_button_v5",
                        "name": "toggle_button_v5",
                        "label": "Toggle Button V",
                        // "on": true
                        "initValue": "{{toggleButton}}",
                        // "visibility": "show_hide_element41",
                        "visibility": ["show_hide_element415","show_hide_element425"]
                    },
                    {
                        "element_string": true,
                        "id": "show_hide_element415",
                        "name": "show_hide_element415",
                        "label": "Show on ToggleOn1of2",
                        "hidden": true,
                        "required": true,
                        "error": "Please enter a valid text",
                        "field-help": {
                            "content": "The string should contain only letters (a-zA-Z)",
                            "ua-help-identifier": "alias_for_ua_event_binding2"
                        }
                    },
                    {
                        "element_string": true,
                        "id": "show_hide_element425",
                        "name": "show_hide_element425",
                        "label": "Show on ToggleOn2of2",
                        "hidden": true
                    }
                ]
            },
            {
                "heading": "Serialize form values",
                "heading_text": "Form elements like input can be linked to other elements and make them enabled/disabled, showed/hided or required based on the visibility property",
                "section_id": "section_id_7",
                "progressive_disclosure": "expanded", //two possible values: expanded or collapsed
                "elements": [
                    {
                        "element_string": true,
                        "id": "name_s",
                        "name": "name_s",
                        "label": "Input Simple",
                        "value": "{{name}}",
                        "error": "Please enter a valid value"
                    },
                    {
                        "element_string": true,
                        "id": "servicesetting_s",
                        "name": "servicesetting_s",
                        "label": "Input Serialize 1",
                        "value": "{{servicesetting.bandwidth}}",
                        "error": "Please enter a valid value"
                    },
                    {
                        "element_string": true,
                        "id": "endpointsetting_s",
                        "name": "endpointsetting_s",
                        "label": "Input Serialize 4",
                        "value": "{{endpointsetting.endpointsetting1.endpointsetting2.endpointsetting3.port}}",
                        "error": "Please enter a valid value"
                    },
                    {
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
                    },
                    {
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
                    },
                    {
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
                    },
                    {
                        "element_timeWidget": true,
                        "id": "text_time_s",
                        "name": "text_time_s",
                        "placeholder": "",
                        "initValue": "{{time_s.time_s1}}",
                        "error": "Please enter a valid time"
                    }
                ]
            },
            {
                "heading": "Form Elements - Number Type",
                "heading_text": "Form element - various combination for number type field",
                "section_id": "section_id_8",
                "progressive_disclosure": "collapsed", //two possible values: expanded or collapsed
                "elements": [
                    {
                        "element_number": true,
                        "id": "text_number_1",
                        "name": "text_number_1",
                        "label": "Invalid value(w/o numberStepper property)",
                        "required": false,
                        "min_value":"2",
                        "max_value":"8",
                        "error": "Please enter a number between 2 and 8",
                        "value": 1
                        // "hidden": true
                    },
                    {
                        "element_number": true,
                        "id": "text_number_2",
                        "name": "text_number_2",
                        "label": "Valid value(with numberStepper true)",
                        "required": false,
                        "min_value":"2",
                        "max_value":"8",
                        "error": "Please enter a number between 2 and 8",
                        "value": 4,
                        "numberStepper": true
                    },
                    {
                        "element_number": true,
                        "id": "text_number_3",
                        "name": "text_number_3",
                        "label": "Empty field(with numberStepper false)",
                        "numberStepper": false,
                        "min_value":"2",
                        "max_value":"5",
                        "error":"Enter a value between 2 to 5"
                    },
                    {
                        "element_number": true,
                        "id": "text_number_4",
                        "name": "text_number_4",
                        "label": "Empty field (with no min-max)",
                        "required": true,
                        "error": "Please enter a number",
                        "numberStepper": true
                    },
                    {
                        "element_number": true,
                        "id": "text_number_5",
                        "name": "text_number_5",
                        "label": "Valid value (with only min)",
                        "required": true,
                        "min_value":"2",
                        "error": "Please enter a number greater than or equal to 2",
                        "value": 4,
                        "numberStepper": true
                    },
                    {
                        "element_number": true,
                        "id": "text_number_6",
                        "name": "text_number_6",
                        "label": "Invalid value (with only max)",
                        "required": true,
                        "max_value":"8",
                        "error": "Please enter a number less than or equal to 8",
                        "value": 9,
                        "numberStepper": true
                    },
                    {
                        "element_float": true,
                        "id": "text_float1",
                        "name": "text_float1",
                        "label": "Text float(w/o numberStepper property)",
                        "placeholder": "",
                        "error": "Please enter a valid float",
                        "value": "1.15"
                    },
                    {
                        "element_float": true,
                        "id": "text_float2",
                        "name": "text_float2",
                        "label": "Text float(with numberStepper true)",
                        "placeholder": "",
                        "error": "Please enter a valid float between 2.00 and 5.15",
                        "min_value": "2.00",
                        "max_value": "5.15",
                        "numberStepper": true,
                        "value": "2.11"
                    },
                    {
                        "element_float": true,
                        "id": "text_float3",
                        "name": "text_float3",
                        "label": "Text float(with numberStepper false)",
                        "placeholder": "",
                        "error": "Please enter a valid float between 2.00 and 5.15",
                        "min_value": "2.00",
                        "max_value": "5.15",
                        "numberStepper": false,
                        "value": "1.15"
                    }
                ]
            },
            {
                "heading": "Description text",
                "heading_text": "The Form Widget supports description text also",
                "section_id": "section_id_1",
                "section_class": "section_class",
               "progressive_disclosure": "collapsed", //two possible values: expanded or collapsed
//                 "toggle_section": {
//                     "label": "Select to show the form elements of the description text section",
//                     "status": "show" //two possible values: show or hide
// //                    "checked": true
//                 },
                "elements": [
                    {
                        "element_description": true,
                        "id": "text_description",
                        "label": "Description",
                        "value": "Simple line",
                        "hidden": true
                    },
                    {
                        "element_description": true,
                        "id": "text_description",
                        "label": "Description",
                        "value": "Description loremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsum <b>HTML rendered</b>",
                        "inlineLinks":[{
                            "id": "show_overlay",
                            "class": "show_overlay",
                            "value": "Show Form/Grid on Overlay"
                        }]
                    },
                    {
                        "element_description": true,
                        "id": "text_description",
                        "value": "Description loremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsum <b>HTML rendered</b>"
                    }
                ]
            },
            {
                "heading": "Other Form Elements",
                "heading_text": "Form elements like checkbox, radio buttons and different type of inputs",
                "section_id": "section_id_10",
                "progressive_disclosure": "expanded", //two possible values: expanded or collapsed
                "elements": [
                    {
                        "element_email": true,
                        "id": "text_email",
                        "name": "text_email",
                        "label": "Text email",
                        "placeholder": "",
//                        "required": true,
                        "disabled": true,
                        "error": "Please enter a valid email",
                        "value": "{{email}}"
                    },
                    {
                        "element_url": true,
                        "id": "text_url",
                        "required": true,
                        "name": "text_url",
                        "label": "Text url",
                        "placeholder": "http://www.juniper.net",
                        "error": "Please enter a valid URL",
                        "value": "{{url}}"
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
                        "placeholder": "",
                        "error": "Please enter a valid string that contains only letters (a-zA-Z)",
                        "value": "{{text}}"
                    },
                    {
                        "element_number": true,
                        "id": "text_number",
                        "name": "text_number",
                        "label": "Text number",
                        // "numberStepper": true,
                        "min_value":"2",
                        "max_value":"8",
                        "placeholder": "",
                        "error": "Please enter a number between 2 and 8"
                    },
                    {
                        "element_alphanumeric": true,
                        "id": "text_alphanumeric",
                        "name": "text_alphanumeric",
                        "label": "Text alphanumeric",
                        "required": true,
                        "class": "text_alphanumeric_class",
                        "placeholder": "",
                        "error": "Please enter a string that contains only letters and numbers"
                    },
                    {
                        "element_hexadecimal": true,
                        "id": "text_hexadecimal",
                        "name": "text_hexadecimal",
                        "label": "Text hexadecimal",
                        "required": true,
                        "hidden": true,
                        "placeholder": "",
                        "error": "Please enter a valid hexadecimal number"
                    },
                    {
                        "element_color": true,
                        "id": "text_color",
                        "name": "text_color",
                        "class": "text_color_class",
                        "label": "Text color",
                        "placeholder": "",
                        "error": "Please enter a valid hexadecimal color"
                    },
                    {
                        "element_lowercase": true,
                        "id": "text_lowercase",
                        "name": "text_lowercase",
                        "label": "Text lowercase",
                        "placeholder": "",
                        "error": "Please enter a valid string in lowercase"
                    },
                    {
                        "element_uppercase": true,
                        "id": "text_uppercase",
                        "name": "text_uppercase",
                        "label": "Text uppercase",
                        "placeholder": "",
                        "error": "Please enter a valid string in uppercase"
                    },
                    {
                        "element_integer": true,
                        "id": "text_integer",
                        "name": "text_integer",
                        "label": "Text integer",
                        "placeholder": "",
                        "error": "Please enter a valid integer"
                    },
                    {
                        "element_float": true,
                        "id": "text_float",
                        "name": "text_float",
                        "label": "Text float",
                        "placeholder": "",
                        "error": "Please enter a valid float"
                    },
                    {
                        "element_divisible": true,
                        "divisible_by":"5",
                        "id": "text_divisible",
                        "name": "text_divisible",
                        "label": "Text divisible",
                        "placeholder": "",
                        "error": "Please enter a number that is divisible by 5"
                    },
                    {
                        "element_length": true,
                        "min_length":"2",
                        "max_length":"5",
                        "id": "text_length",
                        "name": "text_length",
                        "label": "Text length",
                        "placeholder": "",
                        "error": "Please enter a string that is greater than or equal to 2 but less than or equal to 5"
                    },
                    {
                        "element_minlength": true,
                        "length":"3",
                        "id": "text_min_length",
                        "name": "text_min_length",
                        "label": "Text min length",
                        "placeholder": "",
                        "error": "Please enter a string that is greater than or equal to 3"
                    },
                    {
                        "element_multiple_error": true,
                        "id": "min_max_length",
                        "name": "min_max_length",
                        "label": "Multiple length error",
                        "pattern-error": [
                            {
                                "pattern": "length",
                                "min_length":"2",
                                "max_length":"8",
                                "error": "Must be 8 characters or less."
                            },
                            {
                                "pattern": "minlength",
                                "length":"2",
                                "error": "Must be 2 characters or more."
                            }
                        ],
                        "error": true,
                        "notshowvalid": true
                    },
                    {
                        "element_date": true,
                        "id": "text_date",
                        "name": "text_date",
                        "label": "Text date",
                        "placeholder": "",
                        "error": "Please enter a valid date"
                    },
                    {
                        "element_afterdate": true,
                        "after_date":"05/28/2014",
                        "id": "text_afterdate",
                        "name": "text_afterdate",
                        "label": "Text afterdate",
                        "placeholder": "",
                        "error": "Please enter a date after May 28, 2014"
                    },
                    {
                        "element_beforedate": true,
                        "before_date":"06/20/2014",
                        "id": "text_beforedate",
                        "name": "text_beforedate",
                        "label": "Text beforedate",
                        "placeholder": "",
                        "error": "Please enter a date before June 20, 2014"
                    },
                    {
                        "element_time": true,
                        "id": "text_time",
                        "name": "text_time",
                        "label": "Text time",
                        "placeholder": "",
                        "error": "Please enter a valid time"
                    },
                    {
                        "element_inarray": true,
                        "id": "text_inarray",
                        "name": "text_inarray",
                        "label": "Text inarray",
                        "placeholder": "",
                        "values": [
                            {"value": "4"},
                            {"value": "5"},
                            {"value": "6"}
                        ],
                        "error": "Please enter one of the allowed values: 4, 5 or 6"
                    },
                    {
                        "element_creditcard": true,
                        "id": "text_creditcard",
                        "name": "text_creditcard",
                        "label": "Text creditcard",
                        "placeholder": "",
                        "error": "Please enter a valid credit card"
                    },
                    {
                        "element_ip": true,
                        "ip_version": "4",
                        "id": "text_ip_v4",
                        "name": "text_ip_v4",
                        "label": "Text IP v4",
                        "placeholder": "",
                        "error": "Please enter a valid IP address version 4"
                    },
                    {
                        "element_ip": true,
                        "ip_version": "6",
                        "id": "text_ip_v6",
                        "name": "text_ip_v6",
                        "label": "Text IP v6",
                        "placeholder": "",
                        "error": "Please enter a valid IP address version 6"
                    },
                    {
                        "element_cidr": true,
                        "id": "text_cidr2",
                        "name": "text_cidr2",
                        "label": "Text CIDR",
                        "class": "text_cidr_class",
                        "placeholder": "",
                        "error": "Please enter a valid CIDR"
                    },
                    {
                        "element_subnet": true,
                        "id": "text_subnet2",
                        "name": "text_subnet2",
                        "label": "Text subnet mask",
                        "placeholder": "",
                        "error": "Please enter a valid subnet mask"
                    },
                    {
                        "element_file": true,
                        "id": "text_file",
                        "name": "text_file",
                        "label": "File Upload",
                        "placeholder": "",
                        "class": "text_file_class",
//                        "value": "{{{text}}}",
                        "fileupload_button_label": "Browse",
                        "error": "Please select a valid file"
                    },
                    {
                        "element_fingerprint": true,
                        "id": "text_fingerprint",
                        "name": "text_fingerprint",
                        "label": "Text fingerprint",
                        "placeholder": "",
//                        "value": "{{{text}}}",
                        "error": "Please enter a valid fingerprint"
                    },
                    {
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
                    },
                    {
                        "element_float": true,
                        "id": "text_field_sec_label",
                        "name": "text_field_sec_label",
                        "label": "Rate",
                        "inlineLabels": [{
                            "value":"of 10",
                            "id": false
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
                        "error": "Please enter a value for this field",
                        "field-help": {
                            "content": "Tooltip for text field",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                    }
                ]
            },
            {
                "heading": "Text Area Element and Regex Validation",
                "heading_text": "Form elements with text area and regex validation",
                "section_class": "section_class",
                "section_id": "section_id_2",
                "progressive_disclosure": "collapsed", //two possible values: expanded or collapsed
                "elements": [
                    {
                        "element_description": true,
                        "id": "text_description",
                        "label": "Description",
                        "value": "Description <b>HTML rendered</b>"
                    },
//                     {
//                         "element_description": true,
//                         "id": "text_description",
                    //     "value": "Description loremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsum <b>HTML rendered</b>"
//                     },
                    {
                        "element_description_encode": true,
                        "id": "text_description_encode",
                        "label": "Description Encode",
                        "value": "Description <b>Encode</b>"
                    },
                    {
                        "element_textarea": true,
                        "id": "text_area",
                        "name": "text_area",
                        "label": "Textarea",
                        "pattern": "^([0-9]){3,4}$",
//                        "required": true,
                        "rows": 5,
                        "placeholder": "",
                        "error": "Enter a number with 3 or 4 digits",
                        "post_validation": "validTextarea"
                    },
                    {
                        "element_textarea": true,
                        "id": "default_text_area",
                        "name": "default_text_area",
                        "label": "Default textarea",
                        "value": "{{{text}}}"
                    },
                    {
                        "element_text": true,
                        "id": "text_field",
                        "name": "text_feld",
                        "label": "Text",
                        "placeholder": "required",
//                        "required": true,
                        "error": "Please enter a value for this field",
                        "field-help": {
                            "content": "Tooltip for text field",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                    },
                    {
                        "element_text": true,
                        "id": "custom_pattern",
                        "name": "custom_pattern",
                        "label": "Custom Pattern",
                        "class": "class1 class2  element_delete",
                        "field-help": {
                            "content": "The pattern is a 3 o 4 digits",
                            "ua-help-identifier": "alias_for_ua_event_binding"
                        },
                        "placeholder": "1234",
                        "pattern": "^([0-9]){3,4}$",
                        "error": "Enter a number with 3 or 4 digits",
                        "inlineButtons":[{
                            "id": "input_button",
                            "class": "input_button",
                            "name": "input_button",
                            "value": "Test"
//                        },{
//                             "id": "input_button1",
//                            "name": "input_button2",
//                            "value": "Test2",
//                            "isInactive": true
                        }]
                    },
                    {
                        "element_text": true,
                        "id": "custom_pattern_regexObj",
                        "name": "custom_pattern_regexObj",
                        "label": "Custom Regex Object",
                        "class": "class1 class2  element_delete",
                        "placeholder": "https://localhost",
                        "pattern": /^(http(s?):[/][/])(www\.)?(\S)+$/,
                        //"pattern": new RegExp("^(http(s?):[/][/])(www\\.)?(\\S)+$"),
                        "error": "Enter valid url string",
                        "inlineButtons":[{
                            "id": "input_button1",
                            "class": "input_button",
                            "name": "input_button1",
                            "value": "Test"
                        }]
                    },
                    {
                        "element_lowercase": true,
                        "id": "custom_callback_Obj",
                        "name": "custom_callback_Obj",
                        "label": "Custom Callback",
                        "class": "class1 class2  element_delete",
                        "field-help": {
                            "content": "'Test Callback Value' is valid"
                        },
                        "error": "Default Error",
                        "required": true,
                        "callbackValidation": callbackValue
                    },
                    {
                        "element_checkbox": true,
                        "id": "checkbox_field1",
                        "label": "Checkbox",
                        // "required": true,
                        "values": [
                            {
                                "id": "checkbox_enable11",
                                "name": "checkbox_enable1",
                                "label": "Option 1",
                                "value": "enable"
                                // "checked": true
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
                        "callbackValidation": callbackValue1
                    },
                    {
                        "element_radio": true,
                        "id": "radio_field1",
                        "label": "Radio Buttons",
                        "required": true,
                        // "initValue": "{{radioButton}}",
                        "values": [
                            {
                                "id": "radio11",
                                "name": "radio_button1",
                                "label": "Option 1",
                                "value": "option1"
//                                 "disabled": true
                            },
                            {
                                "id": "radio22",
                                "name": "radio_button1",
                                "label": "Option 2",
                                "value": "option2"
                            },
                            {
                                "id": "radio33",
                                "name": "radio_button1",
                                "label": "Option 3",
                                "value": "option3"
                            }
                        ],
                        "error": "Please make a selection",
                        "callbackValidation": callbackValue2
                    }
                ]
            },
            {
                "heading": "Multiple Validation",
                "heading_text": "The Form Widget supports multiple validation",
                "section_id": "section_id_1",
                "section_class": "section_class",
//                "progressive_disclosure": "collapsed", //two possible values: expanded or collapsed
                "toggle_section":{
                    "label": "Select to show the form elements of the multiple validation section",
                    "status": "hide" //two possible values: show or hide
//                    "checked": true
                },
                "elements": [
                    {
                        "element_multiple_error": true,
                        "id": "username",
                        "name": "username",
                        "label": "Username",
                        "disableAutocomplete": true,
//                        "onfocus": "true",
//                         "required": true,
//                         "notshowrequired": true,
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
                                "regexId":"regex1",
                                "pattern": "^([a-zA-Z0-9_]){3,10}$",
                                "error": "Must be alphanumeric with 3 to 10 characters."
                            },
                            {
                                "regexId":"regex2",
                                "pattern": "^[_]{1}",
                                "error": "Must begin with underscore"
                            }
                        ],
                        "error": true,
                        "help": "Must only contain alphanumerics &amp; underscores or hyphens and begin with an alphanumeric or an underscore character."
                    },
                    {
                        "element_password": true,
                        "id": "password_pattern",
                        "name": "password_pattern",
                        "label": "Password Pattern",
                        "placeholder": "Sp0g-Sp0g",
                        "required": true,
                        "notshowrequired": true,
                        "pattern-error": [
                            {
                                "pattern": "length",
                                "min_length":"6",
                                "max_length":"8",
                                "error": "Must be more than 6 characters but less than 8 characters."
                            },
                            {
                                "pattern": "hasnumbersymbol",
                                "error": "At least one number and one symbol is required."
                            },
                            {
                                "pattern": "hasmixedcasenumber",
                                "error": "A combination of mixed case letters and one number is required."
                            },
                            {
                                "pattern": "hasmixedcasesymbol",
                                "error": "A combination of mixed case letters and one symbol is required."
                            },
                            {
                                "pattern": "hassymbol",
                                "error": "At least one symbol is required."
                            },
                            {
                                "pattern": "hasnumber",
                                "error": "At least one number is required."
                            },
                            {
                                "pattern": "hasmixedcase",
                                "error": "A combination of mixed case letters is required."
                            },
                            {
                                "pattern": "validtext",
                                "error": "A combination of mixed case letters, numbers, and symbols is required."
                            }
                        ],
                        "error": true,
                        "help": "Must be 6 characters or more. A combination of mixed case letters, numbers, and symbols is required."
                    },
                    {
                        "element_password": true,
                        "id": "confirm_password_pattern",
                        "name": "confirm_password_pattern",
                        "label": "Confirm Password",
                        "placeholder": "Sp0g-Sp0g",
                        "required": true,
                        "notshowrequired": true,
                        "error": "Passwords must match"
                    },
                    {
                        "element_password": true,
                        "id": "confirm_password_pattern1",
                        "name": "confirm_password_pattern1",
                        "label": "Confirm Password",
                        "placeholder": "Sp0g-Sp0g",
                        "required": true,
                        "notshowrequired": true,
                        "error": "Passwords must match",
                        "hidden": true
                    },
                    {
                        "element_password": true,
                        "id": "password_strength",
                        "name": "password_strength",
                        "placeholder": "Enter password",
                        "required": true,
                        "label": "Password with strength-meter",
                        "showPasswordStrength": passwordStrengthConfiguration,
                        "pattern-error": [
                            {
                                "pattern": "validtext",
                                "error": "required"
                            }
                        ],
                        "error": true,
                        "notshowvalid": true
                    },
                    {
                        "element_multiple_error": true,
                        "id": "hostname",
                        "name": "hostname",
                        "label": "Hostname",
                        "required": true,
                        "pattern-error": [
                            {
                                "pattern": "validtext",
                                "error": "This field is required."
                            },
                            {
                                "pattern": "length",
                                "min_length":"1",
                                "max_length":"64",
                                "error": "Must not exceed 64 characters."
                            },
                            {
                                "pattern": "hasalphanumericdashunderscore",
                                "error": "Only alphanumeric characters, dashes and underscores allowed."
                            }
                        ],
                        "error": true,
                        "notshowvalid": true,
                        "help":"Any combination of alphabetic characters, numbers, dashes, and underscores. No other special characters are allowed. 64 characters max."
                    }
                ]
            },
            {
                "heading": "Remote Validation",
                "heading_text": "The Form Widget supports different types of remote/client validation",
                "section_id": "section_id_0",
                "section_class": "section_class",
                "toggle_section":{
                    "label": "Select to show the form elements of the multiple validation section",
                    "status": "hide" //two possible values: show or hide
//                    "checked": true
                },
                "elements": [
                    {
                        "element_text": true,
                        "id": "remote_validation",
                        "name": "remote_validation",
                        "label": "Remote URL Validation",
                        "remote": {
                            "url": buildNameUrl, //should return url string
                            "type": "GET",
                            //"response": processResponse //should return "true" if isValid
                            "headers": {
                                "Authorization": 'Basic c3VwZXI6am5wcjEyMyE=',
                                "Accept": 'application/vnd.net.juniper.space.job-management.jobs+json;version="3";q=0.03'
                            },
                            "error": "Must not contain the name of a developer"
                        },
                        "error": "Enter Valid Text",
                        "required": true
                    },
                    {
                        "element_text": true,
                        "id": "remote_validation2",
                        "name": "remote_validation2",
                        "label": "Remote Callback Validation",
                        "remote": remoteValidate,
                        "error": "Enter Valid Text",
                        "value": "testRemote", //Invalid value of the field
                        "field-help": {
                            "content": "'testRemote1' and 'testRemote' are examples of valid and invalid values, respectively. ",
                            "ua-help-identifier": "remote_validation_field_help"
                        }
                    },
                    {
                        "element_multiple_error": true,
                        "id": "remote_and_client_validation",
                        "name": "remote_and_client_validation",
                        "label": "Remote URL + Client Validation",
                        "required": true,
                        "field-help": {
                            "content": "Tooltip for a field in the Form Widget",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "pattern-error": [
                            {
                                "pattern": "validtext",
                                "error": "Must not be empty."
                            },
                            {
                                "pattern": "hasnotsymbol",
                                "error": "Must not include a symbol."
                            },
                            {
                                "pattern": "hasnotspace",
                                "error": "Must not include a space."
                            },
                            {
                                "regexId":"regex1",
                                "pattern": "^([a-zA-Z0-9_]){3,10}$",
                                "error": "Must be alphanumeric with 3 to 10 characters."
                            }
                        ],
                        "remote": {
                            "url": buildNameUrl, //should return url string
                            "type": "GET",
                            "headers": {
                                "Authorization": 'Basic c3VwZXI6am5wcjEyMyE=',
                                "Accept": 'application/vnd.net.juniper.space.job-management.jobs+json;version="3";q=0.03'
                            },
                            "error": "Must not contain the name of a developer"
                        },
                        "pattern": "^[a-zA-Z_][a-zA-Z0-9-_]{0,28}$",
                        "error": "Must only contain alphanumerics &amp; underscores or hyphens and begin with an alphanumeric or an underscore character.", // @TODO - refactor so we don't need this for remote and multiple validation
                        "inlineIcons":[
                            {
                                "class": "test-elementicon1",
                                "id": "add-element-icon"
                            },
                            {
                                "icon": {
                                    "default": {
                                        icon_url: "#icon_collapse_all",
                                        icon_class: "icon_collapse_all-dims"
                                    }
                                },
                                "id": "test-element-icon2"
                            },
                            {
                                "icon": {
                                    "default": {
                                        icon_url: "#icon_inline_ok",
                                        icon_class: "icon_inline_ok-dims"
                                    },
                                    "label": "Save"
                                },
                                "id": "test-element-icon3"
                            },
                            {
                                "icon": {
                                    "default": {
                                        icon_url: "#icon_inline_cancel",
                                        icon_class: "icon_inline_cancel-dims"
                                    },
                                    "label": "Cancel"
                                },
                                "id": "test-element-icon4"
                            }
                        ]
                    }
                ]
            }
        ],
//        "buttonsAlignedRight":true,
//        "unlabeled":true,
        "buttonsClass":"buttons_row",
        "buttons": [
            {
                "id": "insert_json_dropdown",
                "name": "insert_json_dropdown",
                "value": "Insert JSON to the dropdown",
                "type": "button",
                "isInactive": true
            },
            {
                "id": "remove_elements",
                "name": "remove_elements",
                "value": "Remove Elements",
                "type": "button",
                "isInactive": true
            },
            {
                "id": "add_elements",
                "name": "add_elements",
                "value": "Add Elements",
                "type": "button",
                "isInactive": true
            },
            {
                "id": "add_section_l",
                "name": "add_section_l",
                "value": "Add Last Section",
                "type": "button",
                "isInactive": true
            },
            {
                "id": "add_section",
                "name": "add_section",
                "value": "Add Section on Id",
                "type": "button",
                "isInactive": true
            },
            {
                "id": "toggle_section",
                "name": "toggle_section",
                "value": "Toggle Section",
                "isInactive": true
            },
            {
                "id": "get_isvalid_and_wait",
                "name": "get_isvalid_and_wait",
                "onSubmit": submitCallback1,
                "value": "Submit With Callback1",
                "type": "button"
            },
            {
                "id": "get_isvalid_and_spin",
                "name": "get_isvalid_and_spin",
                "onSubmit": submitCallback2,
                "value": "Submit With Callback2",
                "type": "button"
            },
            {
                "id": "get_values",
                "name": "get_values",
                "value": "Get Values"
            },
            {
                "id": "get_isvalid",
                "name": "get_isvalid",
                "value": "Submit",
                "type": "button"
            }
        ],
        "cancel_link": {
            "id": "cancel_form",
            "value": "Cancel"
        },
        "footer": [
            {
                "text":"More examples are available at: "
            },
            {
                "url":"Form with rows that can be copied",
                "href":"/assets/js/widgets/form/tests/testForm.html#copy"
            },
            {
                "url":"Declarative form",
                "href":"/assets/js/widgets/form/tests/testForm.html#declarative"
            },
            {
                "url":"Form without data binding",
                "href":"/assets/js/widgets/form/tests/testForm.html#nobinding"
            }
        ]
    };

    configurationSample.values = {
        "text": "SampleFormWidget",
        "email": "mvilitanga@gmail.com",
        "url": "gmailcom", //wrong value to show case form validation when the form is built
        "datePicker": "11/20/2010",
        "time": {
            "time": "06:11:00",
            "period": "24 hour"
        },
        "timeZone": "America/New_York",
        "dateTime": {
            "date": "12/11/2010",
            "time": "03:11:00",
            "period": "PM"
        },
        "ipCidr": {
            "ip": "1.2.3.4",
            "cidr": "12"
        },
        "dropDown": {
            "id": "rtsp",
            "text": "junos-rtsp"
        },
        "checkBox": [
            {
                "id": "checkbox_enable2",
                "checked": true
            },
            {
                "id": "checkbox_disable",
                "checked": true
            }
        ],
        "radioButton": [
            {
                "id": "radio1",
                "checked": false
            },
            {
                "id": "radio2",
                "checked": true
            }
        ],
        "toggleButton": true,
        "dropDown_v": {
            "id": "ftp_v",
            "text": "junos-ftp"
        },
        "checkBox_v": [
            {
                "id": "checkbox_enable1_v",
                "checked": true
            }
        ],
        "radioButton_v": [
            {
                "id": "radio1_v2",
                "checked": true
            }
        ],
        "name": "actualname",
        "servicesetting": {
            "bandwidth": "bwvalue"
        },
        "endpointsetting": {
            "endpointsetting1": {
                "endpointsetting2": {
                    "endpointsetting3": {
                        "port": "actualport"
                    }
                }
            }
        },
        "dropDown_s": {
            "dropDown_s1": {
                "dropDown_s2": {
                    "dropDown_s3": "ftp_s"
//                    "dropDown_s3": {
//                        "id": "ftp_s",
//                        "text": "junos-ftp"
//                    }
                }
            }
        },
        "checkBox_s": {
            "checkBox_s1": {
//                "checkBox_s2": "checkbox_enable2_s"
                "checkBox_s2": ["checkbox_enable1_s","checkbox_enable2_s"]
//                "checkBox_s2": [{
//                    "id": "checkbox_enable2_s",
//                    "checked": true
//                }]
            }
        },
        "radioButton_s": {
//            "radioButton_s1": [{
//                "id": "radio1_s",
//                "checked": true
//            }]
            "radioButton_s1": "radio1_s"
        },
        "time_s": {
            "time_s1":  {
                "time": "06:11:00",
                "period": "PM"
            }
        }
    };

    return configurationSample;

});