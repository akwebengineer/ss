/**
 * A form configuration object with the parameters required to build a Form for Firewall Policies
 *
 * @module formConfiguration
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'widgets/form/tests/conf/gridConfiguration'
], function (gridConfiguration) {

    var formConfiguration = {};

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

    formConfiguration.Filter = {
        "form_id": "filter_grid_form",
        "form_name": "filter_grid_form",
        "sections": [
            {
                "section_class": "left",
                "elements": [
                    {
                        "element_dropdown": true,
                        "id": "from_zone_filter",
                        "name": "from_zone_filter",
                        "label": "From Zone:",
                        "class": "elements-filter left",
                        "values": [
                                {
                                    "label": "Loading ...",
                                    "disabled": "true",
                                    "value": ""
                                }
                            ],
                        "error": "Please make a selection"
                    },{
                        "element_dropdown": true,
                            "id": "to_zone_filter",
                            "name": "to_zone_filter",
                            "label": "To Zone:",
                            "class": "elements-filter left",
                            "values": [
                                {
                                    "label": "Loading ...",
                                    "disabled": "true",
                                    "value": ""
                                }
                            ],
                        "error": "Please make a selection"
                    }
                ]
            }]
    };

    formConfiguration.SourceAddress = {
        "title": "Source Address",
        "form_id": "source_address_view",
        "form_name": "source_address_view",
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text":"Configuring Basic Settings",
        "err_timeout": "1000",
        "valid_timeout": "5000",
        "sections": [
            {
                "heading_text": "Select the Source Address for the policy. You can choose an address book entry from the list bellow or you can create a new address book entry by selecting the \"Create Address\" button",
                "elements": [
                    {
                        "element_text": true,
                        "id": "source_address",
                        "class": "list-builder",
                        "name": "source-address",
                        "placeholder": "Loading ..."
                    }
                ]
            }
        ]
    };

    formConfiguration.DestinationAddress = {
        "title": "Destination Address",
        "form_id": "source_address_view",
        "form_name": "source_address_view",
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text":"Configuring Basic Settings",
        "err_timeout": "1000",
        "valid_timeout": "5000",
        "sections": [
            {
                "heading_text": "Select the Destination Address for the policy. You can choose an address book entry from the list bellow or you can create a new address book entry by selecting the \"Create Address\" button",
                "elements": [
                    {
                        "element_text": true,
                        "id": "destination_address",
                        "class": "list-builder",
                        "name": "destination-address",
                        "placeholder": "Loading ..."
                    }
                ]
            }
        ]
    };

    formConfiguration.Application = {
        "title": "Applications",
        "form_id": "source_address_view",
        "form_name": "source_address_view",
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text":"Configuring Basic Settings",
        "err_timeout": "1000",
        "valid_timeout": "5000",
        "sections": [
            {
                "heading_text": "Select the Application/Set to permit or deny. You can choose an Application/Set from the list bellow or you can create a new Application/Set by selecting the \"Add Application\" button",
                "elements": [
                    {
                        "element_text": true,
                        "id": "application",
                        "class": "list-builder",
                        "name": "application",
                        "placeholder": "Loading ..."
                    }
                ]
            }
        ]
    };
    formConfiguration.zonePolicy = {
        "title": "Zone Policy",
        "form_id": "zone_policy",
        "form_name": "zone_policy",
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text":"Configuring Basic Settings",
        "err_timeout": "1000",
        "valid_timeout": "5000",
        "sections": [
            {
                "section_id": "section_id",
                "toggle_section":{
                    "label": "Select to show the form elements of the multiple validation section",
                    "status": "show" //two possible values: show or hide
                },
                "elements": [
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
                        "element_text": true,
                        "id": "remote_validation5",
                        "name": "remote_validation5",
                        "label": "Remote Callback Validation",
                        "remote": remoteValidate,
                        "error": "Enter Valid Text",
                        "value": "testRemote", //Invalid value of the field
                        "field-help": {
                            "content": "'testRemote' is an example of invalid value",
                            "ua-help-identifier": "remote_validation_tab_field_help"
                        }
                    },
                    {
                        "element_radio": true,
                        "id": "policy_type",
                        "label": "Type",
                        "required": true,
                        "values": [
                            {
                                "id": "type_group1",
                                "name": "type_group",
                                "label": "Group",
                                "value": "Group",
                                "checked": "true"
                            },
                            {
                                "id": "type_group2",
                                "name": "type_group",
                                "label": "Device",
                                "value": "Device"
                            }
                        ],
                        "error": "Please make a selection"
                    },
                    {
                        "element_text": true,
                        "id": "context",
                        "name": "context",
                        "value": "{{context}}",
                        "label": "Name",
                        "required": true,
                        "error": "Name is a required field"
                    },
                    {
                        "element_textarea": true,
                        "id": "policy_description",
                        "name": "policy_description",
                        "value": "{{policy_description}}",
                        "label": "Description"
                    },
                    {
                        "element_radio": true,
                        "id": "policy_manage",
                        "label": "Manage",
                        "ua-help": "alias_for_ua_event_binding",
                        "tooltip": "Tooltip for manage field",
                        "values": [
                            {
                                "id": "manage_group1",
                                "name": "manage_group",
                                "label": "Zone Policy",
                                "value": "Zone Policy",
                                "checked": "true"
                            },
                            {
                                "id": "manage_group2",
                                "name": "manage_group",
                                "label": "Global Policy",
                                "value": "Global Policy"
                            },
                            {
                                "id": "manage_group3",
                                "name": "manage_group",
                                "label": "Both Zone & Global Policy",
                                "value": "Both Zone & Global Policy"
                            }
                        ]
                    },
                    {
                        "element_dropdown": true,
                        "id": "policy_priority",
                        "name": "policy_priority",
                        "label": "Policy Priority",
                        "values": [
                            {
                                "label": "Low",
                                "value": "Low"
                            },
                            {
                                "label": "Medium",
                                "value": "Medium",
                                "selected": "true"
                            },
                            {
                                "label": "High",
                                "value": "High"
                            }
                        ]
                    },
                    {
                        "element_dropdown": true,
                        "id": "policy_profile",
                        "name": "policy_profile",
                        "label": "Profile",
                        "values": [
                            {
                                "label": "Select profile",
                                "value": ""
                            },
                            {
                                "label": "Log Session Init (SYSTEM)",
                                "value": "Log Session Init (SYSTEM)"
                            },
                            {
                                "label": "Log Session Close (SYSTEM)",
                                "value": "Log Session Close (SYSTEM)"
                            },
                            {
                                "label": "All Logging Enabled (SYSTEM)",
                                "value": "All Logging Enabled (SYSTEM)"
                            },
                            {
                                "label": "All Logging Disabled (SYSTEM)",
                                "value": "All Logging Disabled (SYSTEM)"
                            }
                        ]
                    }
                ]
            }
        ]
    };
    formConfiguration.utmPolicy = {
        "title": "UTM Policy",
        "form_id": "utm_policy",
        "form_name": "utm_policy",
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text":"Configuring Basic Settings",
        "err_timeout": "1000",
        "valid_timeout": "5000",
        "sections": [
            {
                "section_id": "section_id",
                "elements": [
                    {
                        "element_radio": true,
                        "id": "utm_policy_type",
                        "label": "Type",
                        "required": true,
                        "values": [
                            {
                                "id": "type_group1",
                                "name": "type_group",
                                "label": "Group",
                                "value": "Group",
                                "checked": "true"
                            },
                            {
                                "id": "utm_type_group2",
                                "name": "type_group",
                                "label": "Device",
                                "value": "Device"
                            }
                        ],
                        "error": "Please make a selection"
                    },
                    {
                        "element_text": true,
                        "id": "utm_context",
                        "name": "utm_context",
                        "value": "{{context}}",
                        "label": "Name"
                        
                    },
                    {
                        "element_textarea": true,
                        "id": "utm_policy_description",
                        "name": "utm_policy_description",
                        "value": "{{policy_description}}",
                        "label": "Description",
                        "required": true,
                        "error": "Name is a required field"
                    },
                    {
                        "element_radio": true,
                        "id": "utm_policy_manage",
                        "label": "Manage",
                        "ua-help": "alias_for_ua_event_binding",
                        "tooltip": "Tooltip for manage field",
                        "values": [
                            {
                                "id": "manage_group1",
                                "name": "manage_group",
                                "label": "Zone Policy",
                                "value": "Zone Policy",
                                "checked": "true"
                            },
                            {
                                "id": "manage_group2",
                                "name": "manage_group",
                                "label": "Global Policy",
                                "value": "Global Policy"
                            },
                            {
                                "id": "manage_group3",
                                "name": "manage_group",
                                "label": "Both Zone & Global Policy",
                                "value": "Both Zone & Global Policy"
                            }
                        ]
                    },
                    {
                        "element_dropdown": true,
                        "id": "utm_policy_priority",
                        "name": "utm_policy_priority",
                        "label": "Policy Priority",
                        "values": [
                            {
                                "label": "Low",
                                "value": "Low"
                            },
                            {
                                "label": "Medium",
                                "value": "Medium",
                                "selected": "true"
                            },
                            {
                                "label": "High",
                                "value": "High"
                            }
                        ]
                    },
                    {
                        "element_dropdown": true,
                        "id": "utm_policy_profile",
                        "name": "utm_policy_profile",
                        "label": "Profile",
                        "values": [
                            {
                                "label": "Select profile",
                                "value": ""
                            },
                            {
                                "label": "Log Session Init (SYSTEM)",
                                "value": "Log Session Init (SYSTEM)"
                            },
                            {
                                "label": "Log Session Close (SYSTEM)",
                                "value": "Log Session Close (SYSTEM)"
                            },
                            {
                                "label": "All Logging Enabled (SYSTEM)",
                                "value": "All Logging Enabled (SYSTEM)"
                            },
                            {
                                "label": "All Logging Disabled (SYSTEM)",
                                "value": "All Logging Disabled (SYSTEM)"
                            }
                        ]
                    }
                ]
            }
        ]
    };
    formConfiguration.FirewallPolicies = {
        "title": "Create Policy",
        "form_id": "create_policy",
        "form_name": "create_policy",
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text":"Configuring Basic Settings",
        "err_timeout": "1000",
        "valid_timeout": "5000",
        "sections": [
            {
                "section_id": "section_id",
                "elements": [
                    {
                        "element_radio": true,
                        "id": "policy_type",
                        "label": "Type",
                        "required": true,
                        "values": [
                            {
                                "id": "type_group1",
                                "name": "type_group",
                                "label": "Group",
                                "value": "Group",
                                "checked": "true"
                            },
                            {
                                "id": "type_group2",
                                "name": "type_group",
                                "label": "Device",
                                "value": "Device"
                            }
                        ],
                        "error": "Please make a selection"
                    },
                    {
                        "element_text": true,
                        "id": "context",
                        "name": "context",
                        "value": "{{context}}",
                        "label": "Name",
                        "required": true,
                        "error": "Name is a required field"
                    },
                    {
                        "element_textarea": true,
                        "id": "policy_description",
                        "name": "policy_description",
                        "value": "{{policy_description}}",
                        "label": "Description"
                    },
                    {
                        "element_radio": true,
                        "id": "policy_manage",
                        "label": "Manage",
                        "ua-help": "alias_for_ua_event_binding",
                        "tooltip": "Tooltip for manage field",
                        "values": [
                            {
                                "id": "manage_group1",
                                "name": "manage_group",
                                "label": "Zone Policy",
                                "value": "Zone Policy",
                                "checked": "true"
                            },
                            {
                                "id": "manage_group2",
                                "name": "manage_group",
                                "label": "Global Policy",
                                "value": "Global Policy"
                            },
                            {
                                "id": "manage_group3",
                                "name": "manage_group",
                                "label": "Both Zone & Global Policy",
                                "value": "Both Zone & Global Policy"
                            }
                        ]
                    },
                    {
                        "element_dropdown": true,
                        "id": "policy_priority",
                        "name": "policy_priority",
                        "label": "Policy Priority",
                        "values": [
                            {
                                "label": "Low",
                                "value": "Low"
                            },
                            {
                                "label": "Medium",
                                "value": "Medium",
                                "selected": "true"
                            },
                            {
                                "label": "High",
                                "value": "High"
                            }
                        ]
                    },
                    {
                        "element_dropdown": true,
                        "id": "policy_profile",
                        "name": "policy_profile",
                        "label": "Profile",
                        "values": [
                            {
                                "label": "Select profile",
                                "value": ""
                            },
                            {
                                "label": "Log Session Init (SYSTEM)",
                                "value": "Log Session Init (SYSTEM)"
                            },
                            {
                                "label": "Log Session Close (SYSTEM)",
                                "value": "Log Session Close (SYSTEM)"
                            },
                            {
                                "label": "All Logging Enabled (SYSTEM)",
                                "value": "All Logging Enabled (SYSTEM)"
                            },
                            {
                                "label": "All Logging Disabled (SYSTEM)",
                                "value": "All Logging Disabled (SYSTEM)"
                            }
                        ]
                    }
                ]
            }
        ]
    };

    formConfiguration.TabOnOverlay = {
        "title": "Tab Container Widget in a Form on Overlay",
        "form_id": "create_zone_policy",
        "form_name": "create_zone_policy",
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text":"Configuring Basic Settings",
        "err_timeout": "1000",
        "valid_timeout": "5000",
        "on_overlay": true,
        "sections": [
            {
                "elements": [
                    {
                        "element_text": true,
                        "id": "policy_name",
                        "name": "name",
                        "label": "Policy Name",
                        "placeholder": "required",
                        "ua-help": "alias_for_ua_event_binding",
                        "error": "Please enter a value for this field",
                        "required": true,
                        "tooltip": "Tooltip for text field"
                    },
                    {
                        "element_description": true,
                        "id": "tab-container",
                        "class": "tabs-on-overlay",
                        "name": "tab-container",
                        "label": "Tabs",
                        "placeholder": "Loading ..."
                    }
                ]
            }
        ],
        "buttons": [
            {
                "id": "add_policy_save",
                "name": "save",
                "value": "OK"
            }
        ],
        "cancel_link": {
            "id": "add_policy_cancel",
            "value": "Cancel"
        }
    };

    formConfiguration.Address = {
        "title": "Address",
        "form_id": "address_view",
        "form_name": "address_view",
        "sections": [
            {
                "heading_text": "Use the Addresses page to create addresses that can be used across all devices managed by Security Director. Addresses are used in firewall, NAT, IPS, and VPN services and apply to corresponding SRX Series devices.",
                "elements": [
                    {
                        "element_text": true,
                        "id": "addresses",
                        "class": "list-builder",
                        "name": "addresses",
                        "placeholder": "Loading ..."
                    }
                ]
            }
        ]
    };

    formConfiguration.GridSample = {
        "form_id": "grid_view",
        "sections": [
            {
                "elements": [
                    {
                        "element_grid": true,
                        "id": "text_grid",
                        "name": "text_grid",
                        "label": "Grid Integration",
                        "elements": gridConfiguration.smallGridOnForm.elements,
                        // "actionEvents" : gridConfiguration.smallGrid.actions,
                        "error": "Grid validation failed"
                    }
                ]
            }
        ]
    };

    formConfiguration.GridSampleOnOverlay = {
        "form_id": "test_form_widget_on_overlay_grid",
        "on_overlay": true,
        "sections": [
            {
                "elements": [
                    {
                        "element_grid": true,
                        "id": "text_grid",
                        "label": "FormGrid Integration",
                        "elements": gridConfiguration.smallGridOnTabOverlay.elements,
                        // "actionEvents" : gridConfiguration.smallGrid.actions,
                    }
                ]
            }
        ]
    };

    formConfiguration.GridSampleOnTab = {
        "form_id": "test_form_widget_on_overlay_grid",
        "sections": [
            {
                "elements": [
                    {
                        "element_grid": true,
                        "id": "text_grid",
                        "label": "FormGrid Integration",
                        "elements": gridConfiguration.smallGridOnTabOverlay.elements,
                        // "actionEvents" : gridConfiguration.smallGrid.actions,
                    }
                ]
            }
        ]
    };

return formConfiguration;

});
