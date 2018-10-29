/**
 * A form configuration object with the common parameters required to build source/destination address editors for rules in Nat Policies
 *
 * @module ruleGridAddressEditorConfiguration
 * @author Swathi Nagaraj <swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var ruleGridAddressEditorConfiguration = function (context) {
        this.getListBuilderSection = function(addressSelectionHelp) {
            var listBuilderSection = {
                        "section_id": "cellEditor",
                        "elements": [
                            {
                                "element_text": true,
                                "id": "list-builder-element",
                                "label": context.getMessage('fw_rules_editor_address_list_label'),
                                "name": "list-builder-element",
                                "placeholder": context.getMessage('loading'),
                                "class": "list-builder listBuilderPlaceHolderHigh",
                                "field-help": {
                                     "content": context.getMessage(addressSelectionHelp)
                                },
                                "inlineButtons": [{
                                    "id": "add-new-button",
                                    "class": "slipstream-primary-button slipstream-secondary-button",
                                    "name": "add-new_button",
                                    "value": "Add New"
                                }]
                            }
                        ]
                    };
          return listBuilderSection;
        },
        this.getSingleAddressSelectorSection = function() {
            return {
                        "section_id": "nat_rulesgrid_editor_staticDstnAddress_form",
                        "elements": [
                            {
                                "element_description": true,
                                "id": "nat_rulesgrid_editor_staticDstnAddress",
                                "name": "nat_rulesgrid_editor_staticDstnAddress",
                                //"value": "{{pool-address.name}}",//TODO
                                "label": context.getMessage('fw_rules_editor_destinationAddress_title'),
                                "required": true,
                                "error": context.getMessage('nat_rulesgrid_editor_transPktDstn_translated_address_error')
                            },
                            {
                                "element_checkbox": true,
                                "id": "natrules_dstaddress_proxyArp",
                                "class": "natrules_dstaddress_proxyArp_class",
                                "label": "Configure Proxy ARP",
                                "values": [
                                    {
                                        "id": "natrules_dstaddress_proxyArp",
                                        "name": "natrules_dstaddress_proxyArp",
                                        "label": 'Configure',
                                        "value": "enable",
                                        "checked": false
                                    }
                                ]
                            },
                            {
                                "element_checkbox": true,
                                "id": "natrules_dstaddress_proxyArp_override_interface",
                                "class": "natrules_dstaddress_proxyArp_conf",
                                "label": "Override Interface Selection",
                                "values": [
                                    {
                                        "id": "natrules_dstaddress_proxyArp_override_interface",
                                        "name": "natrules_dstaddress_proxyArp_override_interface",
                                        "label": 'Configure',
                                        "value": "enable",
                                        "checked": false
                                    }
                                ]
                            },
                            {
                                "element_description": true,
                                "id": "natrules_dstnaddress_proxyArp_interface",
                                "class": "natrules_dstaddress_proxyArp_override_interface_conf",
                                "name": "natrules_dstnaddress_proxyArp_interface",
                                "label": 'Interfaces',
                               // "required": true,
                                "error": context.getMessage('nat_rules_editor_dest_address_interface_error')
                            }
                        ]
                    };
        },

        this.getConfig = function(addressSelectionHelp) {
            return {
                "title": context.getMessage('editor_title'),
                "heading_text": context.getMessage('editor_description'),
                "form_id": "cellEditorForm",
                "form_name": "cellEditorForm",
                "on_overlay": true,
                "sections": [                   
                    this.getListBuilderSection(addressSelectionHelp),
                    this.getSingleAddressSelectorSection()
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ],
                "cancel_link": {
                    "id": "cancel",
                    "value": context.getMessage("cancel")
                }
            }
        };
    };

    return ruleGridAddressEditorConfiguration;

});
