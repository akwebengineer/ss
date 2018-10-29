/**
 * A form configuration object with the parameters required to build a Form for Firewall Policies
 *
 * @module formConfiguration
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'widgets/form/tests/conf/gridConfiguration'
], function (gridConfiguration) {

    var formConfiguration = {};

    formConfiguration.ZonePolicies = {
        "form_id": "test_form_widget_on_overlay",
        "form_name": "test_form_widget_on_overlay",
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text":"Configuring Basic Settings",
        "err_timeout": "1000",
        "valid_timeout": "5000",
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
                        "onfocus": true,
                        "required": true,
                        "tooltip": "Tooltip for text field"
                    },
                    {
                        "element_grid": true,
                        "id": "text_grid",
                        "name": "text_grid",
                        "label": "Grid Integration",
                        "elements": gridConfiguration.smallGridOnWizardOverlay.elements,
                        "actionEvents" : gridConfiguration.smallGridOnWizardOverlay.actions,
                        "error": "Grid validation failed"
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
                        "element_text": true,
                        "class": "list-builder",
                        "id": "service",
                        "name": "services",
                        "label": "Services",
                        "placeholder": "Loading ..."
                    }
//                    {
//                        "element_dropdown": true,
//                        "id": "from-zone-name",
//                        "name": "from-zone-name",
//                        "label": "From Zone",
//                        "class": "dropdown-collection",
//                        "values": [
//                            {
//                                "label": "Loading ...",
//                                "disabled": "true",
//                                "value": ""
//                            }
//                        ],
//                        "error": "Please make a selection"
//                    },
//                    {
//                        "element_dropdown": true,
//                        "id": "to-zone-name",
//                        "name": "to-zone-name",
//                        "label": "To Zone",
//                        "class": "dropdown-collection",
//                        "values": [
//                            {
//                                "label": "Loading ...",
//                                "value": ""
//                            }
//                        ],
//                        "error": "Please make a selection"
//                    },
//                    {
//                        "element_text": true,
//                        "id": "source-address",
//                        "class": "list-builder",
//                        "name": "source-address",
//                        "label": "Source Address",
//                        "placeholder": "Loading ..."
//                    },
//                    {
//                        "element_text": true,
//                        "id": "destination-address",
//                        "class": "list-builder",
//                        "name": "destination-address",
//                        "label": "Destination Address",
//                        "placeholder": "Loading ..."
//                    },
//                    {
//                        "element_text": true,
//                        "id": "application",
//                        "class": "list-builder",
//                        "name": "application",
//                        "label": "Application",
//                        "placeholder": "Loading ..."
//                    },
//                    {
//                        "element_text": true,
//                        "id": "policy_name1",
//                        "name": "name1",
//                        "label": "Policy Name1",
//                        "error": "Please enter a value for this field",
//                        "tooltip": "Tooltip for text field"
//                    }
                ]
            }
        ]
    };

return formConfiguration;

});
