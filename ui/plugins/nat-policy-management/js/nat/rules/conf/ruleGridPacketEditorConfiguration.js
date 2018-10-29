/**
 * A form configuration object with the common parameters required to build packet ingress or egress editor for rules in NAT Policies
 *
 * @module packetIngressEgressConfiguration
 * @author Swathi Nagaraj <swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
   
    var packetIngressEgressConfiguration = function (context) {

        this.getElements = function () {
            return {
                "title": context.getMessage('nat_rulesgrid_editor_ingress_title'),
                "form_id": "edit_pkt_ingress_egress_form",
                "form_name": "edit_pkt_ingress_egress_form",
                "err_div_id": "errorDiv",
                "err_div_message": context.getMessage("form_error"),
                "err_div_link_text": context.getMessage("nat_rulesgrid_editor_ingress_title"),
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "cellEditor",
                        "section_class": "section_class",
                        "elements": [
                            {
                                "element_radio": true,
                                "id": "ingress_egress_type",
                               // "label": context.getMessage('nat_rulesgrid_editor_ingress_type_label'),
                                /*"field-help": {
                                    "content": context.getMessage('nat_rulesgrid_edit_translation_type_label_help'),
                                    "ua-help-identifier": "alias_for_title_ua_event_binding"
                                },*/
                                "values": [
                                    {
                                        "id": "ingress_egress_type",
                                        "name": "ingress_egress_type",
                                        "label": context.getMessage('nat_rulesgrid_editor_ingress_egress_zone'),
                                        "value": "ZONE",
                                        "checked": true
                                    },
                                    {
                                        "id": "ingress_egress_type",
                                        "name": "ingress_egress_type",
                                        "label": context.getMessage('nat_rulesgrid_editor_ingress_egress_interface'),
                                        "value": "INTERFACE"
                                    },
                                    {
                                        "id": "ingress_egress_type",
                                        "name": "ingress_egress_type",
                                        "label": context.getMessage('nat_rulesgrid_editor_ingress_egress_routing'),
                                        "value": "VIRTUAL_ROUTER"
                                    }
                                ],
                            }
                           ]
                    },    
                    {
                        "section_id": "nat-rule-edit-ingress-egress-zone",
                        "elements": [{
                                "element_text": true,
                                "id": "nat_rulesgrid_editor_pkt_zone_list_builder",
                                "name": "Zone",
                                "label": context.getMessage('nat_rulesgrid_editor_ingress_egress_zone'),
                                "placeholder": context.getMessage('loading'),
                                "error": context.getMessage('zone_set_zones_error'),
                                "class": "list-builder"
                            }
                        ]
                    },   
                    {
                        "section_id": "nat-rule-edit-ingress-egress-interface",
                        "elements": [{
                                "element_text": true,
                                "id": "nat_rulesgrid_editor_pkt_interface_list_builder",
                                "name": "Interface",
                                "label": context.getMessage('nat_rulesgrid_editor_ingress_egress_interface'),
                                "placeholder": context.getMessage('loading'),
                                "error": context.getMessage('zone_set_zones_error'),
                                "class": "list-builder"
                            }
                        ]
                    },
                    {
                        "section_id": "nat-rule-edit-ingress-egress-routing",
                        "elements": [{
                                "element_text": true,
                                "id": "nat_rulesgrid_editor_pkt_routing_list_builder",
                                "name": "Routing",
                                "label": context.getMessage('nat_rulesgrid_editor_ingress_egress_routing'),
                                "placeholder": context.getMessage('loading'),
                                "error": context.getMessage('zone_set_zones_error'),
                                "class": "list-builder"
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "btnOk",
                        "name": "btnOk",
                        "value": context.getMessage('ok')
                    }
                ],
                "cancel_link": {
                    "id": "linkCancel",
                    "value": context.getMessage("cancel")
                }
            }
        };
    };

    return packetIngressEgressConfiguration;

});
