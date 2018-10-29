/**
 * A form configuration object with the parameters required to build a Form for Firewall Policies
 *
 * @module formConfiguration
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

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
    var submitCallback = function(data, success, error){
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
                    },
                    {
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
            }
        ],
        "unlabeled": true,
        "buttonsClass": "elements-filter left",
        "buttons": [
            {
                "id": "filter_grid",
                "name": "filter_grid",
                "value": "Filter"
            }
        ]
    };

    formConfiguration.ZonePolicies = {
        "title": "{{operation}} Policy",
        "form_id": "create_zone_policy",
        "form_name": "create_zone_policy",
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text": "Configuring Basic Settings",
        "err_timeout": "1000",
        "valid_timeout": "5000",
        "on_overlay": true,
        "sections": [
            {
                "elements": [
                    // {
                    //     "element_text": true,
                    //     "id": "remote_validation2",
                    //     "name": "remote_validation2",
                    //     "label": "Remote Callback Validation",
                    //     "remote": remoteValidate,
                    //     "error": "Enter Valid Text"
                    // },
                    {
                        "element_text": true,
                        "id": "policy_name",
                        "name": "name",
                        "label": "Policy Name",
                        "placeholder": "required",
                        "ua-help": "alias_for_ua_event_binding",
                        "error": "Please enter a value for this field",
                        "required": true,
                        "tooltip": "Tooltip for text field",
                        "value": "{{name}}"
                    },
                    {
                        "element_dropdown": true,
                        "id": "action",
                        "name": "action",
                        "label": "Policy Action",
                        "required": true,
                        "values": [
                            {
                                "label": "Select an option",
                                "value": ""
                            },
                            {
                                "label": "Permit",
                                "value": "permit"
                            },
                            {
                                "label": "Deny",
                                "value": "deny"
                            },
                            {
                                "label": "Reject",
                                "value": "reject"
                            }
                        ],
                        "error": "Please make a selection"
                    },
                    {
                        "element_dropdown": true,
                        "id": "from-zone-name",
                        "name": "from-zone-name",
                        "label": "From Zone",
                        "class": "dropdown-collection",
                        "values": [
                            {
                                "label": "Loading ...",
                                "disabled": "true",
                                "value": ""
                            }
                        ],
                        "error": "Please make a selection"
                    },
                    {
                        "element_dropdown": true,
                        "id": "to-zone-name",
                        "name": "to-zone-name",
                        "label": "To Zone",
                        "class": "dropdown-collection",
                        "values": [
                            {
                                "label": "Loading ...",
                                "value": ""
                            }
                        ],
                        "error": "Please make a selection"
                    },
                    {
                        "element_text": true,
                        "id": "source-address",
                        "class": "list-builder",
                        "name": "source-address",
                        "label": "Source Address",
                        "placeholder": "Loading ..."
                    },
                    {
                        "element_text": true,
                        "id": "destination-address",
                        "class": "list-builder",
                        "name": "destination-address",
                        "label": "Destination Address",
                        "placeholder": "Loading ..."
                    },
                    {
                        "element_text": true,
                        "id": "application",
                        "class": "list-builder",
                        "name": "application",
                        "label": "Application",
                        "placeholder": "Loading ..."
                    }
                ]
            }
        ],
        "buttons": [
            {
                "id": "add_policy_save",
                "name": "save",
                "value": "OK",
                "onSubmit": submitCallback
            }
        ],
        "cancel_link": {
            "id": "add_policy_cancel",
            "value": "Cancel"
        }
    };

    formConfiguration.SourceAddress = {
        "title": "Source Address",
        "form_id": "source_address_view",
        "form_name": "source_address_view",
        "on_overlay": true,
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text": "Configuring Basic Settings",
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
        ],
        "buttons": [
            {
                "id": "source_address_save",
                "name": "save",
                "value": "OK"
            }
        ],
        "cancel_link": {
            "id": "source_address_cancel",
            "value": "Cancel"
        }
    };

    formConfiguration.DestinationAddress = {
        "title": "Destination Address",
        "form_id": "source_address_view",
        "form_name": "source_address_view",
        "on_overlay": true,
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text": "Configuring Basic Settings",
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
        ],
        "buttons": [
            {
                "id": "source_address_save",
                "name": "save",
                "value": "OK"
            }
        ],
        "cancel_link": {
            "id": "source_address_cancel",
            "value": "Cancel"
        }
    };

    formConfiguration.DestinationAddressTree = {
        "title": "Destination Address",
        "form_id": "source_address_view",
        "form_name": "source_address_view",
        "on_overlay": true,
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text": "Configuring Basic Settings",
        "err_timeout": "1000",
        "valid_timeout": "5000",
        "sections": [
            {
                "heading_text": "Select the Destination Address for the policy. You can choose an address book entry from the list bellow or you can create a new address book entry by selecting the \"Create Address\" button",
                "elements": [
                    {
                        "element_radio": true,
                        "id": "radio_field",
                        "label": "Type",
                        "values": [
                            {
                                "id": "radio1",
                                "name": "radio_button",
                                "label": "Include",
                                "checked": true,
                                "value": "select"
                            },
                            {
                                "id": "radio2",
                                "name": "radio_button",
                                "label": "Exclude",
                                "value": "unselect"
                            }
                        ]
                    },
                    {
                        "element_text": true,
                        "id": "destination_address",
                        "label": "Address",
                        "class": "list-builder",
                        "name": "destination-address",
                        "placeholder": "Loading ..."
                    }
                ]
            }
        ],
        "buttons": [
            {
                "id": "source_address_save",
                "name": "save",
                "value": "OK"
            }
        ],
        "cancel_link": {
            "id": "source_address_cancel",
            "value": "Cancel"
        }
    };

    formConfiguration.Application = {
        "title": "Applications",
        "form_id": "source_address_view",
        "form_name": "source_address_view",
        "on_overlay": true,
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text": "Configuring Basic Settings",
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
        ],
        "buttons": [
            {
                "id": "source_address_save",
                "name": "save",
                "value": "OK"
            }
        ],
        "cancel_link": {
            "id": "source_address_cancel",
            "value": "Cancel"
        }
    };

    formConfiguration.AdvancedSecurity = {
        "title": "Advanced Security",
        "form_id": "advanced_security_view",
        "form_name": "advanced_security_view",
        "on_overlay": true,
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text": "Configuring Basic Settings",
        "err_timeout": "1000",
        "valid_timeout": "5000",
        "sections": [
            {
                "elements": [
                    {
                        "element_dropdown": true,
                        "id": "idp",
                        "name": "idp",
                        "label": "IDP",
                        "values": [
                            {
                                "label": "true",
                                "value": "true"
                            },
                            {
                                "label": "false",
                                "value": "false"
                            }
                        ]
                    },
                    {
                        "element_dropdown": true,
                        "id": "utm-policy",
                        "name": "utm-policy",
                        "label": "UTM",
                        "values": [
                            {
                                "label": "junos-vf-profile",
                                "value": "junosv"
                            },
                            {
                                "label": "junos-df-profile",
                                "value": "junosd"
                            }
                        ]
                    },
                    {
                        "element_dropdown": true,
                        "id": "application-firewall",
                        "name": "application-firewall",
                        "label": "AppFW",
                        "values": [
                            {
                                "label": "rules-set",
                                "value": "rules-set"
                            },
                            {
                                "label": "rules-set1",
                                "value": "rules-set1"
                            }
                        ]
                    },
                    {
                        "element_dropdown": true,
                        "id": "application-traffic-control",
                        "name": "application-traffic-control",
                        "label": "AppTC",
                        "values": [
                            {
                                "label": "rules-set",
                                "value": "rules-set"
                            },
                            {
                                "label": "rules-set1",
                                "value": "rules-set1"
                            }
                        ]
                    }
                ]
            }
        ],
        "buttons": [
            {
                "id": "source_address_save",
                "name": "save",
                "value": "OK"
            }
        ],
        "cancel_link": {
            "id": "source_address_cancel",
            "value": "Cancel"
        }
    };

    formConfiguration.FirewallPolicies = {
        "title": "Create Policy",
        "form_id": "create_policy",
        "form_name": "create_policy",
        "on_overlay": true,
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text": "Configuring Basic Settings",
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
        ],
        "buttons": [
            {
                "id": "add_policy_save",
                "name": "save",
                "value": "Save"
            }
        ],
        "cancel_link": {
            "id": "add_policy_cancel",
            "value": "Cancel"
        }
    };

    formConfiguration.QuickView = {
        "title": "Detailed View",
        "form_id": "quick_view_form",
        "form_name": "quick_view_form",
        "on_overlay": true,
        "sections": [
            {
                "elements": [
                    {
                        "element_description": true,
                        "id": "quick_view_name",
                        "label": "Name",
                        "value": "{{name}}"
                    },
                    {
                        "element_description": true,
                        "id": "quick_view_source_address",
                        "label": "Source Addresss",
                        "value": "{{source-address}}"
                    },
                    {
                        "element_description": true,
                        "id": "quick_view_destination_address",
                        "label": "Destination Addresss",
                        "value": "{{destination-address}}"
                    },
                    {
                        "element_description": true,
                        "id": "quick_view_application",
                        "label": "Application",
                        "value": "{{application}}"
                    },
                    {
                        "element_description": true,
                        "id": "quick_view_action",
                        "label": "Action",
                        "value": "{{action}}"
                    },
                    {
                        "element_description": true,
                        "id": "quick_view_date",
                        "label": "Date",
                        "value": "{{date}}"
                    }
                ]
            }
        ],
        "buttons": [
            {
                "id": "quick_view_ok",
                "name": "quick_view_ok",
                "value": "Close"
            }
        ]
    };

    formConfiguration.Description = {
        "title": "Description View",
        "form_id": "description_form",
        "form_name": "description_form",
        "on_overlay": true,
        "sections": [
            {
                "elements": [
                    {
                        "element_textarea": true,
                        "id": "text_area_id",
                        "name": "text_area",
                        "label": "Description",
                        "rows": 5
                    }
                ]
            }
        ],
        "buttons": [
            {
                "id": "description_save",
                "name": "save",
                "value": "OK"
            }
        ],
        "cancel_link": {
            "id": "description_cancel",
            "value": "Cancel"
        }
    };

    formConfiguration.Simplified = {
        "form_id": "create_zone_policy",
        "sections": [
            {
                "section_class": "left create_column",
                "elements": [
                    {
                        "element_description": true,
                        "class": "simplified_source",
                        "id": "simplified_source_row",
                        "value": "<span class='description'>Click for List Nested Grid</span>"
                    }
                ]
            },
            {
                "section_class": "left create_column",
                "elements": [
                    {
                        "element_description": true,
                        "class": "simplified_destination",
                        "id": "simplified_destination_row",
                        "value": "<span class='description'>Click for List Nested Grid</span>"
                    }
                ]
            },
            {
                "section_class": "left create_column",
                "elements": [
                    {
                        "element_text": true,
                        "id": "policy_name",
                        "class": "simplified_name",
                        "name": "name",
                        "placeholder": "required",
                        "ua-help": "alias_for_ua_event_binding",
                        "error": "Please enter a value for this field",
                        "required": true,
                        "tooltip": "Tooltip for text field",
                        "value": "{{name}}"
                    }
                ]
            }
        ],
        "buttonsAlignedRight": true,
        "buttons": [
            {
                "id": "row_save",
                "name": "save",
                "value": "OK"
            }
        ],
        "cancel_link": {
            "id": "row_cancel",
            "value": "Cancel"
        }
    };

    formConfiguration.DeleteRows = {
        "title": "Delete Rows",
        "form_id": "delete_row_form",
        "form_name": "delete_row_form",
        "on_overlay": true,
        "sections": [
            {
                "elements": [
                    {
                        "element_description": true,
                        "value": "Are you sure you want to delete {{ruleNumber}} rule(s) for the Firewall Policies grid?"
                    },
                    {
                        "element_grid": true,
                        "id": "text_grid",
                        "name": "text_grid"
                    },
                    {
                        "element_toggleButton": true,
                        "id": "togglebutton_field_1",
                        "name": "togglebutton_field_1",
                        "label": "Force Delete?",
                        "on": true
                    }
                ]
            }
        ],
        "buttons": [
            {
                "id": "delete_row_save",
                "name": "save",
                "value": "OK"
            }
        ],
        "cancel_link": {
            "id": "delete_row_cancel",
            "value": "Cancel"
        }
    };

    return formConfiguration;

});
