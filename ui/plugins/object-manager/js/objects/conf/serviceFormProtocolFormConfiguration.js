/**
 * A configuration object with the parameters required to build 
 * a form for protocols
 *
 * @module serviceFormProtocolFormConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
        './protocolTypes.js',
        './alg.js'
], function (protocolTypes, alg) {
    var Configuration = function(context) {
        var DESCRIPTION_MAX_LENGTH = 255;

        this.getValues = function() {
            return {
                "form_id": "application-protocol-create-form",
                "form_name": "application-protocol-create-form",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "basic-settings",
                        "elements": [
                            {
                                "element_text": true,
                                "id": "application-protocol-name",
                                "name": "name",
                                "label": context.getMessage('name'),
                                "value": "{{name}}",
                                "pattern": "^[a-zA-Z0-9][a-zA-Z0-9\\-_]{0,62}$",
                                "error": context.getMessage('application_protocol_form_name_error'),
                                "post_validation": "validateProtocolName",
                                "required": true,
                                "field-help": {
                                    "content": context.getMessage('application_form_name_infotip')
                                }
                            },
                            {
                                "element_textarea": true,
                                "id": "application-protocol-description",
                                "name": "description",
                                "value": "{{description}}",
                                "label": context.getMessage('description'),
                                "max_length": DESCRIPTION_MAX_LENGTH,
                                "post_validation": "lengthValidator",
                                "field-help": {
                                    "content": context.getMessage('application_protocol_form_description_infotip')
                                }
                            },
                            {
                                "element_dropdown": true,
                                "id": "application-protocol-type",
                                "name": "protocol-type",
                                "label": context.getMessage('type'),
                                "initValue": "{{protocol-type}}",
                                "values": [],
                                "data": protocolTypes,
                                "field-help": {
                                    "content": context.getMessage('application_protocol_form_type_infotip')
                                }
                            },
                            {
                                "element_text": true,
                                "id": "application-protocol-destination-port",
                                "name": "dst-port",
                                "value": "{{dst-port}}",
                                "label": context.getMessage('application_protocol_form_destination_port'),
                                "error": context.getMessage('application_protocol_form_port_error'),
                                "required": false,
                                "pattern": "^([\\-0-9])*$",
                                "post_validation": "validatePortRange",
                                "class": "tcp-protocol-settings other-protocol-settings destination-port-settings",
                                "field-help": {
                                    "content": context.getMessage('application_protocol_form_dstport_infotip')
                                }
                            }
                        ]
                    },
                    {
                        "heading": context.getMessage('application_protocol_form_advanced_settings'),
                        "section_id": "advanced-settings",
                        "elements": [
                            {
                                "element_checkbox": true,
                                "id": "disable-inactivity-timeout",
                                "label": context.getMessage('application_protocol_form_disable_inactivity_timeout'),
                                "values": [
                                    {
                                        "id": "check-inactivity-timeout",
                                        "name": "enable-timeout",
                                        "label": context.getMessage('checkbox_enable')
                                    }
                                ],
                                "field-help": {
                                    "content": context.getMessage('application_protocol_form_timeout_infotip')
                                }
                            },
                            {
                                "element_text": true,
                                "id": "inactivity-timeout",
                                "name": "inactivity-timeout",
                                "value": "{{inactivity-timeout}}",
                                "label": context.getMessage('application_protocol_form_inactivity_timeout'),
                                "placeholder": context.getMessage('application_protocol_form_inactivity_timeout_ghost_text'),
                                "required": false,
                                "error": context.getMessage('maximum_value_error', ["129600"]),
                                "post_validation": "validateProtocolInactivityTimeout",
                                "class": "left inactivity-timeout-settings",
                                "field-help": {
                                    "content": context.getMessage('application_protocol_form_timeout_value_infotip')
                                }
                            },
                            {
                                "element_dropdown": true,
                                "id": "inactivity-time-type",
                                "name": "inactivity-time-type",
                                "initValue": "{{inactivity-time-type}}",
                                "values": [],
                                "data": [{
                                    "text": context.getMessage('application_protocol_form_inactivity_time_second'),
                                    "id": "Seconds"
                                }, {
                                    "text": context.getMessage('application_protocol_form_inactivity_time_minute'),
                                    "id": "Minutes"
                                }],
                                "class": "inactivity-timeout-settings"
                            },
                            {
                                "element_dropdown": true,
                                "id": "application-protocol-alg",
                                "name": "alg",
                                "label": context.getMessage('application_protocol_form_alg'),
                                "initValue": "{{alg}}",
                                "values": [],
                                "data": alg,
                                "class": "tcp-protocol-settings other-protocol-settings",
                                "field-help": {
                                    "content": context.getMessage('application_protocol_form_alg_infotip')
                                }
                            },
                            {
                                "element_text": true,
                                "id": "application-protocol-source-port",
                                "name": "src-port",
                                "value": "{{src-port}}",
                                "label": context.getMessage('application_protocol_form_source_port'),
                                "error": context.getMessage('application_protocol_form_port_error'),
                                "required": false,
                                "pattern": "^([\\-0-9])*$",
                                "post_validation": "validatePortRange",
                                "placeholder": context.getMessage('application_protocol_form_source_port_ghost'),
                                "class": "tcp-protocol-settings other-protocol-settings",
                                "field-help": {
                                    "content": context.getMessage('application_protocol_form_srcport_infotip')
                                }
                            },
                            {
                                "element_text": true,
                                "id": "icmp-type",
                                "name": "icmp-type",
                                "value": "{{icmp-type}}",
                                "label": context.getMessage('application_protocol_form_icmp_type'),
                                "required": true,
                                "pattern": "^(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])$",
                                "error": context.getMessage('application_protocol_form_icmp_error'),
                                "class": "icmp-protocol-settings",
                                "field-help": {
                                    "content": context.getMessage('application_protocol_form_icmp_type_infotip')
                                }
                            },
                            {
                                "element_text": true,
                                "id": "icmp-code",
                                "name": "icmp-code",
                                "value": "{{icmp-code}}",
                                "label": context.getMessage('application_protocol_form_icmp_code'),
                                "required": true,
                                "pattern": "^(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])$",
                                "error": context.getMessage('application_protocol_form_icmp_error'),
                                "class": "icmp-protocol-settings",
                                "field-help": {
                                    "content": context.getMessage('application_protocol_form_icmp_code_infotip')
                                }
                            },
                            {
                                "element_checkbox": true,
                                "id": "rpc-enable-alg",
                                "label": context.getMessage('application_protocol_form_rpc_enable_alg'),
                                "values": [
                                    {
                                        "id": "check-rpc-alg",
                                        "name": "enable-alg",
                                        "label": context.getMessage('checkbox_enable')
                                    }
                                ],
                                "class": "sun-rpc-protocol-settings ms-rpc-protocol-settings",
                                "field-help": {
                                    "content": context.getMessage('application_protocol_form_rpc_alg_infotip')
                                }
                            },
                            {
                                "element_text": true,
                                "id": "sun-rpc-number",
                                "name": "rpc-program-number",
                                "value": "{{rpc-program-number}}",
                                "label": context.getMessage('application_protocol_form_sun_rpc_number'),
                                "error": context.getMessage('application_protocol_form_sun_rpc_number_error'),
                                "required": true,
                                "pattern": "^(0|[1-9][0-9]{0,9})(-(0|[1-9][0-9]{0,9}))?$",
                                "class": "sun-rpc-protocol-settings",
                                "field-help": {
                                    "content": context.getMessage('application_protocol_form_sun_rpc_number_infotip')
                                }
                            },
                            {
                                "element_text": true,
                                "id": "ms-rpc-uuid",
                                "name": "uuid",
                                "value": "{{uuid}}",
                                "label": context.getMessage('application_protocol_form_ms_rpc_uuid'),
                                "error": context.getMessage('application_protocol_form_ms_rpc_uuid_error'),
                                "placeholder": context.getMessage('application_protocol_form_ms_rpc_uuid_ghost'),
                                "required": true,
                                "pattern": "([A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12})$",
                                "class": "ms-rpc-protocol-settings",
                                "field-help": {
                                    "content": context.getMessage('application_protocol_form_ms_rpc_uuid_infotip')
                                }
                            },
                            {
                                "element_radio": true,
                                "id": "sunrpc-protocol-type",
                                "label": context.getMessage('application_protocol_form_rpc_protocol_type'),
                                "values": [
                                    {
                                        "id": "sunrpc-protocol-tcp",
                                        "name": "sunrpc-protocol-tcp",
                                        "label": context.getMessage('application_protocol_form_rpc_protocol_tcp'),
                                        "value": "TCP",
                                        "checked": true
                                    },
                                    {
                                        "id": "sunrpc-protocol-udp",
                                        "name": "sunrpc-protocol-tcp",
                                        "label": context.getMessage('application_protocol_form_rpc_protocol_udp'),
                                        "value": "UDP"
                                    }
                                ],
                                "class": "sun-rpc-protocol-settings",
                                "field-help": {
                                    "content": context.getMessage('application_protocol_form_rpc_protocol_infotip')
                                }
                            },
                            {
                                "element_radio": true,
                                "id": "msrpc-protocol-type",
                                "label": context.getMessage('application_protocol_form_rpc_protocol_type'),
                                "values": [
                                    {
                                        "id": "msrpc-protocol-tcp",
                                        "name": "msrpc-protocol-tcp",
                                        "label": context.getMessage('application_protocol_form_rpc_protocol_tcp'),
                                        "value": "TCP",
                                        "checked": true
                                    },
                                    {
                                        "id": "msrpc-protocol-udp",
                                        "name": "msrpc-protocol-tcp",
                                        "label": context.getMessage('application_protocol_form_rpc_protocol_udp'),
                                        "value": "UDP"
                                    }
                                ],
                                "class": "ms-rpc-protocol-settings",
                                "field-help": {
                                    "content": context.getMessage('application_protocol_form_rpc_protocol_infotip')
                                }
                            },
                            {
                                "element_text": true,
                                "id": "protocol-number",
                                "name": "protocol-number",
                                "value": "{{protocol-number}}",
                                "label": context.getMessage('application_protocol_form_protocol_number'),
                                "required": true,
                                "error": context.getMessage('application_protocol_form_protocol_number_error'),
                                "pattern": "^(\\d+)$",
                                "class": "other-protocol-settings",
                                "field-help": {
                                    "content": context.getMessage('application_protocol_form_protocol_number_infotip')
                                }
                            }
                         ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "application-protocol-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "application-protocol-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };
    return Configuration;
});
