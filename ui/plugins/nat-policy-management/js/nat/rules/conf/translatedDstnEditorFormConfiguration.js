/**
 * A form configuration object with the common parameters required to build
 * translated packet destination editor for rules in NAT Policies
 *
 * @module translatedDstnEditorFormConfiguration
 * @author Sandhya B <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var  INACTIVITY_TIMEOUT_MIN_VALUE = "60",
         INACTIVITY_TIMEOUT_MAX_VALUE = "7200",
         MAX_SESSION_MIN_VALUE = "8",
         MAX_SESSION_MAX_VALUE = "65536",
         PORT_MAX_VALUE="65535",
         PORT_MIN_VALUE="0";
    var translatedDstnEditorFormConfiguration = function (context) {
        /* if (translationTypes && $.isArray(translationTypes)) {
            var targets = translationTypes.join();
            var offHidden = true, poolHidden = true, addressHidden = true, ipv4Hidden = true;
            if (targets.search(/off/i) < 0) {
                offHidden = false;
            }
            if (targets.search(/pool/i) < 0) {
                poolHidden = false; 
            }
            if (targets.search(/address/i) < 0) {
                addressHidden = false;
            }
            if (targets.search(/ipv4/i) < 0) {
                ipv4Hidden = false;
            }
        }*/

        this.getElements = function (natType) {
            return {
                "title": context.getMessage('nat_rulesgrid_column_packet_destination'),
                "form_id": "nat_rulesgrid_editor_transPktDstn_form",
                "form_name": "nat_rulesgrid_editor_transPktDstn_form",
                "title-help": {
                    "content": context.getMessage("nat_rulesgrid_column_packet_destination"),
                    "ua-help-identifier": "alias_for_title_edit_profile_binding"
                },
                "err_div_id": "errorDiv",
                "err_div_message": context.getMessage("form_error"),
                "err_div_link_text": context.getMessage("nat_rulesgrid_column_packet_destination"),
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "nat_rulesgrid_editor_transPktDstn_type_form",
                        "section_class": "section_class",
                        "elements": [
                            {
                                "element_radio": true,
                                "id": "translation_type",
                                "label": context.getMessage('nat_rulesgrid_editor_transPktDstn_translation_type_label'),
                                /*"field-help": {
                                    "content": context.getMessage('nat_rulesgrid_edit_translation_type_label_help'),
                                    "ua-help-identifier": "alias_for_title_ua_event_binding"
                                },*/
                                "values": this.getValues(natType)
                            }
                           ]
                    },    
                    {
                        "section_id": "nat_rulesgrid_editor_transPktDstn_pool_form",
                        "elements": [
                            {
                                "element_description": true,
                                "id": "nat_rulesgrid_editor_transPktDstn_pool",
                                "name": "nat_rulesgrid_editor_transPktDstn_pool",
                                //"value": "{{pool-address.name}}",
                                "label": context.getMessage('nat_rulesgrid_editor_transPktDstn_destination_pool'),
                                "required": true,
                                "error": context.getMessage('nat_rulesgrid_editor_transPktDstn_destination_pool_error')
                            },
                            {
                                "element_description": true,
                                "id": "nat_rulesgrid_editor_transPktDstn_pool_address",
                                "name": "nat_rulesgrid_editor_transPktDstn_pool_address",
                                "label": context.getMessage('nat_rulesgrid_editor_transPktDstn_destination_pool_address'),
                                "value": ""
                            },
                            {
                                "element_description": true,
                                "id": "nat_rulesgrid_editor_transPktDstn_pool_port",
                                "name": "nat_rulesgrid_editor_transPktDstn_pool_port",
                                "label": context.getMessage('nat_rulesgrid_editor_transPktDstn_destination_pool_port'),
                                "value": ""
                            }
                        ]
                    },
                    {
                        "section_id": "nat_rulesgrid_editor_transPktDstn_address_form",
                        "elements": [
                            {
                                "element_description": true,
                                "id": "nat_rulesgrid_editor_transPktDstn_address",
                                "name": "nat_rulesgrid_editor_transPktDstn_address",
                                //"value": "{{pool-address.name}}",//TODO
                                "label": context.getMessage('nat_rulesgrid_editor_transPktDstn_translated_address'),
                                "required": true,
                                "error": context.getMessage('nat_rulesgrid_editor_transPktDstn_translated_address_error')
                            }
                        ]
                    },
                    {
                        "section_id": "nat_rulesgrid_editor_transPktDstn_routinginstance_form",
                        "elements": [
                            {
                                "element_description": true,
                                "id": "nat_rulesgrid_editor_transPktDstn_routing_instance",
                                "name": "nat_rulesgrid_editor_transPktDstn_routing_instance",
                                //"value": "{{pool-address.name}}",//TODO
                                "label": context.getMessage('nat_rulesgrid_editor_transPktDstn_routing_instance'),
                                "required": false
                            }
                        ]
                    },
                    {
                        "section_id" : "nat_rulesgrid_editor_transPktDstn_mapped_portType_form",
                        "elements" :[
                            {
                                "element_description": true,
                                "id": "nat_rulesgrid_editor_transPktDstn_mapped_portType",
                                "name": "nat_rulesgrid_editor_transPktDstn_mapped_portType",
                                //"value": "{{pool-type}}",//TODO
                                "label": context.getMessage('nat_rulesgrid_editor_transPktDstn_mapped_portType'),
                            }
                        ]
                    },
                    {
                        "section_id": "nat_rulesgrid_editor_transPktDstn_port_form",
                        "elements": [
                            {
                                "element_number": true,
                                "id": "nat_rulesgrid_editor_transPktDstn_port",
                                "name": "nat_rulesgrid_editor_transPktDstn_port",
                                "label": context.getMessage('nat_rulesgrid_editor_transPktDstn_destination_port'),
                                "value": "",
                                "required":true,
                                "error": context.getMessage('nat_rulesgrid_editor_transPktDstn_destination_port_error'),
                                "min_value":PORT_MIN_VALUE,
                                "max_value":PORT_MAX_VALUE
                            }
                        ]    
                    },
                    {
                        "section_id": "nat_rulesgrid_editor_transPktDstn_portrange_form",
                        "elements": [
                            {
                                "element_number": true,
                                "id": "nat_rulesgrid_editor_transPktDstn_portrange_start",
                                "name": "nat_rulesgrid_editor_transPktDstn_portrange_start",
                                "label": context.getMessage('nat_rulesgrid_editor_transPktDstn_portrange_start'),
                                "value": "",//TODO
                                "required":true,
                                "error": context.getMessage('nat_rulesgrid_editor_transPktDstn_destination_port_error'),
                                "min_value":PORT_MIN_VALUE,
                                "max_value":PORT_MAX_VALUE,
                                "post_validation": "isEndPortGreater"
                            },
                            {
                                "element_number": true,
                                "id": "nat_rulesgrid_editor_transPktDstn_portrange_end",
                                "name": "nat_rulesgrid_editor_transPktDstn_portrange_end",
                                "label": context.getMessage('nat_rulesgrid_editor_transPktDstn_portrange_end'),
                                "value": "",//TODO
                                "required": true,
                                "error": context.getMessage('nat_rulesgrid_editor_transPktDstn_destination_port_error'),
                                "min_value":PORT_MIN_VALUE,
                                "max_value":PORT_MAX_VALUE,
                                "post_validation": "isEndPortGreater"
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
        this.getValues = function(natType) {
            var confArr = [];
            var noneConf = {
                                "id": "translation_type",
                                "name": "translation_type",
                                "label": context.getMessage('none'),
                                "value": "NO_TRANSLATION",
                                "checked" : true
                            };
            var poolConf = {
                                "id": "translation_type",
                                "name": "translation_type",
                                "label": context.getMessage('nat_rulesgrid_editor_transPktDstn_translation_type_pool'),
                                "value": "POOL"
                            };
            var prefixConf = {
                                "id": "translation_type",
                                "name": "translation_type",
                                "label": context.getMessage('nat_rulesgrid_editor_transPktDstn_translation_type_address'),
                                "value": "PREFIX"
                            };
            var inetConf =  {
                                "id": "translation_type",
                                "name": "translation_type",
                                "label": context.getMessage('nat_rulesgrid_editor_transPktDstn_translation_type_correspondingIPV4'),
                                "value": "INET"
                            }; 
            if(natType === "DESTINATION") {
                confArr.push(noneConf);
                confArr.push(poolConf);
            }
            else if(natType === "STATIC" ) {
                confArr.push(prefixConf);
                confArr.push(inetConf);
            }            

            return confArr;
        };

    };

    return translatedDstnEditorFormConfiguration;

});