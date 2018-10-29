/**
 * A form configuration object with the parameters required for creating firewall/nat/ips policy
 * @module basePolicyFormConfiguration
 * @copyright Juniper Networks, Inc. 2015
 */
 

define([], function () {

    var BasePolicyFormConfiguration = function (context) {
        
        //Policy type section
        this.getPolicyTypeSection = function() {
            var policyTypeSection = {
                "section_id": "policy_type_form",
                "elements": [
                    {
                        "element_radio": true,
                        "id": "typeRadio",
                        "label": context.getMessage("type"),
                        "required": true,
                        "values": [
                            {
                                "id": "policy-type",
                                "name": "policy-type",
                                "label": context.getMessage("policy_group"),
                                "value": "GROUP",
                                "checked": true
                            },
                            {
                                "id": "policy-type",
                                "name": "policy-type",
                                "label": context.getMessage("policy_device"),
                                "value": "DEVICE"
                            }
                        ],
                        "error": context.getMessage("error_make_selection"),
                        "field-help": {
                            "content": context.getMessage("policy_type_tooltip")
                        }
                    }
                ]
            };
            return policyTypeSection;
       };

       //Group policy section
       this.getGroupDeviceSelectionSection = function() {
            var groupDeviceSelectionSection = 
                {
                    "heading": context.getMessage("policy_device_selection_heading"),
                    "section_id" : "policy_group_form",
                    "elements" : [
                    {
                        "element_checkbox": true,
                        "id": "showDevicesWithoutPolicy",
                        "label": "",
                        "values": [
                            {
                                "id": "showDevicesWithoutPolicy",
                                "name": "showDevicesWithoutPolicy",
                                "label": context.getMessage("assign_devices_show_only_devices"),
                                "value": "enable",
                                "checked" : false
                            }
                        ],
                        "help": context.getMessage("policy_select_devices_with_no_policy_help")
                    },
                    {
                        "element_text": true,
                        "id": "createPolicyDeviceListBuilder",
                        "class": "list-builder listBuilderPlaceHolder",
                        "placeholder": context.getMessage('loading'),
                        "name": "devices",
                        "label": context.getMessage('policy_device_selection'),
                        "field-help": {
                            "content": context.getMessage("policy_devices_listbuilder_toolip")
                        }
                    }
                    ]
                };
            return groupDeviceSelectionSection;
       };

       //Device policy section
       this.getSingleDeviceSelectionSection = function() {
            var singleDeviceSelectionSection = 
                {
                    "heading": context.getMessage("policy_device_selection_heading"),
                    "section_id" : "policy_device_form",
                    "elements" : [
                        {
                            "element_description": true,
                            "id": "device",
                            "name": "device",
                            "label": context.getMessage("device"),
                            "required": false,
                            "values": [
                                {
                                    "label": context.getMessage("select_option"),
                                    "value": ""
                                }
                            ],
                            "field-help": {
                                "content": context.getMessage("policy_devices_dropdown_tooltip")
                            }
                        }
                    ]
                };
            return singleDeviceSelectionSection;
       };

       //Policy Sequence section
       this.getPolicySequenceSection = function() {
            var policySequenceSection = {
                "heading": context.getMessage("policy_sequence_heading"),
                "section_id" : "policy_sequence_form",
                "elements" : [
                    {
                        "element_radio": true,
                        "id": "policy-position",
                        "name": "policy-position",
                        "label": context.getMessage("policy_placement"),
                        "values": [
                            {
                                "id": "policy-position",
                                "name": "policy-position",
                                "label": context.getMessage("policy_placement_before"),
                                "value": "PRE",
                                "checked": true
                            },
                            {
                                "id": "policy-position",
                                "name": "policy-position",
                                "label": context.getMessage("policy_placement_after"),
                                "value": "POST"
                            }
                        ],
                        "error": context.getMessage("error_make_selection"),
                        "field-help": {
                            "content": context.getMessage("policy_placement_tooltip")
                        }
                    },
                    {
                        "element_description": true,
                        "id": "policySeqNo",
                        "label": context.getMessage('policy_sequence_no'),
                        "value": "<a id='policy-sequence-no-select-link'>"+ "Select" +"</a>",
                        "field-help": {
                            "content": context.getMessage("policy_sequenceno_tooltip")
                        }
                    }
                ]
            };
            return policySequenceSection;
       };
    };
    return BasePolicyFormConfiguration;
});