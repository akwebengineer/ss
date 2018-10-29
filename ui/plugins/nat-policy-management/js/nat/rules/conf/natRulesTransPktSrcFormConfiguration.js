/**
 * A form configuration object with the common parameters required to build translated packet source editor for rules in NAT Policies
 *
 * @module tranPktSrcEditorConfiguration
 * @author Swathi Nagaraj <swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var  INACTIVITY_TIMEOUT_MIN_VALUE = "60",
         INACTIVITY_TIMEOUT_MAX_VALUE = "7200",
         MAX_SESSION_MIN_VALUE = "8",
         MAX_SESSION_MAX_VALUE = "65536";

    var tranPktSrcEditorConfiguration = function (context) {

        this.getElements = function (policyType) {
            return {
                "title": context.getMessage('nat_rulesgrid_column_packet_source'),
                "form_id": "edit_transPktSrc_form",
                "form_name": "edit_transPktSrc_form",
                "title-help": {
                    "content": context.getMessage("nat_rulesgrid_column_packet_source"),
                    "ua-help-identifier": "alias_for_title_edit_profile_binding"
                },
                "err_div_id": "errorDiv",
                "err_div_message": context.getMessage("form_error"),
                "err_div_link_text": context.getMessage("nat_rulesgrid_column_packet_source"),
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
                                "id": "translation_type",
                                "label": context.getMessage('nat_rulesgrid_edit_translation_type_label'),
                                "values": this.getValues(policyType)
                            }
                           ]
                    },    
                    {
                        "section_id": "nat-rule-edit-pool-form",
                        "elements": [
                            {
                                "element_description": true,
                                "id": "nat_rulegrid_edit_source_pool",
                                "name": "nat_rulegrid_edit_source_pool ",
                                "label": context.getMessage('nat_rulesgrid_edit_translation_type_sourcepool'),
                                "required": true,
                                "error": context.getMessage('nat_rulesgrid_edit_translation_type_sourcepool_error')
                            },
                            {
                                "element_description": true,
                                "id": "nat_rulegrid_edit_pool_address",
                                "label": context.getMessage('nat_rulesgrid_edit_translation_type_pool_address'),
                                "value": ""
                            },
                            {
                                "element_description": true,
                                "id": "nat_rulegrid_edit_host_address_base",
                                "label": context.getMessage('nat_rulesgrid_edit_translation_type_host_address'),
                                "value": ""
                            },
                            {
                                "element_description": true,
                                "id": "nat_rulegrid_edit_port_translation",
                                "label": context.getMessage('nat_rulesgrid_edit_translation_type_port_translation'),
                                "value": "None"
                            },
                            {
                                "element_description": true,
                                "id": "nat_rulegrid_edit_overflow_pool_type",
                                "label": context.getMessage('nat_rulesgrid_edit_translation_type_overflow_pool_type'),
                                "value": ""
                            },
                            {
                                "element_description": true,
                                "id": "nat_rulegrid_edit_overflow_pool_name",
                                "label": context.getMessage('nat_rulesgrid_edit_translation_type_overflow_pool_name'),
                                "value": ""
                            },
                            {
                                "element_checkbox": true,
                                "id": "proxyARP_Chkbox",
                                "class": "proxyARP_Chkbox_conf",
                                "label": context.getMessage("nat_rulesgrid_edit_translation_type_proxy_ARP"),
                                "required": false,
                                "values": [
                                    {
                                        "id": "proxyARP_Chkbox",
                                        "name": "proxyARP_Chkbox",
                                        "label": "Configure",
                                        "value": "enable",
                                        "checked": true
                                    }
                                ],
                                "error": context.getMessage("error_make_selection")
                            },
                            {
                                "element_description": true,
                                "id": "nat_rulegrid_edit_proxyArp_label",
                                "class": "nat_rulegrid_proxyArp_conf",
                                "label": 'Pool Addresses',
                                "hidden":true,
                                "value": ""
                            },
                            {
                                "element_description": true,
                                "class": "nat_rulegrid_proxyArp_conf",
                                "id": "nat_rulegrid_edit_proxyArp_container"
                            }
                     ]
                    },   
                    {
                        "section_id": "nat-rule-edit-persistent-form",
                             "elements": [  
                            {
                                "element_checkbox": true,
                                "id": "persistent_Chkbox",
                                "label": context.getMessage("nat_rulesgrid_edit_translation_type_persistent"),
                                "required": false,
                                "values": [
                                    {
                                        "id": "persistent_Chkbox_enable",
                                        "name": "persistent_Chkbox",
                                        "label": context.getMessage("enable"),
                                        "value": "enable",
                                        "checked": false
                                    }
                                ],
                                "error": context.getMessage("error_make_selection")
                            },                           
                            {
                                "element_description": true,
                                "id": "persistent_nat_type",
                                "name": "persistent_nat_type",
                                "class": "nat-rulesgrid-persistent-conf",
                                "label": context.getMessage("nat_rulesgrid_edit_translation_type_persistent_nat_type"),
                                "required": false,
                                "error": context.getMessage("error_make_selection")
                            },
                            {
                                "element_number": true,
                                "id": "inactivity_timeout",
                                "name": "inactivity_timeout",
                                "value": "{{inactivity-timeout}}",
                                "label": context.getMessage('nat_rulesgrid_edit_translation_type_inactivity_timeout'),
                                "error": context.getMessage('nat_rulesgrid_edit_translation_type_inactivity_timeout_error'),
                                "required": true,
                                "class": "nat-rulesgrid-persistent-conf",
                                "min_value":INACTIVITY_TIMEOUT_MIN_VALUE,
                                "max_value":INACTIVITY_TIMEOUT_MAX_VALUE
                            },
                            {
                                "element_number": true,
                                "id": "max_session_number",
                                "name": "max_session_number",
                                "value": "{{max-session-number}}",
                                "label": context.getMessage('nat_rulesgrid_edit_translation_type_maxsession'),
                                "error": context.getMessage('nat_rulesgrid_edit_translation_type_maxsession_error'),
                                "required": true,
                                "class": "nat-rulesgrid-persistent-conf",
                                "min_value":MAX_SESSION_MIN_VALUE,
                                "max_value":MAX_SESSION_MAX_VALUE
                            },
                            {
                                "element_checkbox": true,
                                "id": "addressmapping_Chkbox",
                                "label": context.getMessage("nat_rulesgrid_edit_translation_type_address_mapping"),
                                "required": false,
                                "class": "nat-rulesgrid-persistent-conf nat-rulesgrid-address-mapping-conf",
                                "values": [
                                    {
                                        "id": "addressmapping_Chkbox",
                                        "name": "addressmapping_Chkbox",
                                        "label": context.getMessage("enable"),
                                        "value": "enable",
                                        "checked": false
                                    }
                                ],
                                "error": context.getMessage("error_make_selection")                            
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
            };
        };

        this.getValues = function(policyType) {
            var confArr = [];
            var noneConf = {
                                "id": "translation_type",
                                "name": "translation_type",
                                "label": context.getMessage('none'),
                                "value": "NO_TRANSLATION",
                                "checked": true
                            };
            var interfaceConf = {
                                "id": "translation_type",
                                "name": "translation_type",
                                "label": context.getMessage('nat_rulesgrid_edit_translation_type_interface'),
                                "value": "INTERFACE"
                            };
            var poolConf ={
                                "id": "translation_type",
                                "name": "translation_type",
                                "label": context.getMessage('nat_rulesgrid_edit_translation_type_pool'),
                                "value": "POOL",
                                "hidden": true
                            };
            if(policyType === "GROUP") {
                confArr.push(noneConf);
                confArr.push(interfaceConf);
            }
            else {
                confArr.push(noneConf);
                confArr.push(interfaceConf);
                confArr.push(poolConf);
            }            

            return confArr;
        };
    };

    return tranPktSrcEditorConfiguration;

});
