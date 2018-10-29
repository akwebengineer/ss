/**
 * A configuration object with the parameters required to build 
 * a form for Creating Nat Pool
 *
 * @module natPoolsCreateFormConfiguration
 * @author mdamodhar <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([],
    function() {
        var  PORT_OVERLODING_MIN_VALUE = "2",
        PORT_OVERLODING_MAX_VALUE = "32",
        PORT_RANGE_MIN_VALUE="1024",
        PORT_RANGE_MAX_VALUE="65535",
        PORT_MAX_VALUE="65535",
        PORT_MIN_VALUE="0";
                
        var Configuration = function(context) {
            this.getValues = function() {
                return {
                      "form_id": "sd_natpool_form",
                      "form_name": "sd_natpool_form",
                      "on_overlay": true,
                      "title-help": {
                        "content": context.getMessage("natpool_create_title_tooltip"),
                         "ua-help-text": context.getMessage('more_link'),
                         "ua-help-identifier": context.getHelpKey("NAT_POOL_CREATING")
                       },
                      "add_remote_name_validation": 'natpool-name',
                    "sections": [
                        {
                            "heading": "General Information",
                            "elements": [{
                                "element_text": true,
                                "id": "natpool-name",
                                "name": "name",
                                "value": "{{name}}",
                                "label": context.getMessage('name'),
                                "pattern": "^[a-zA-Z0-9][a-zA-Z0-9\-_]{0,30}$",
                                "error": context.getMessage('natpoolname_error'),
                                "required": true,
                                "field-help": {
                                    "content": context.getMessage('natpool_name_tooltip')
                                 }
                            },
                            {
                                "element_textarea": true,
                                "id": "natpool-description",
                                "name": "description",
                                "value": "{{description}}",
                                "label": context.getMessage('description'),
                                "max_length": 1024,
                                "post_validation": "descriptionValidator",
                                "field-help": {
                                    "content": context.getMessage('natpool_description_tooltip')
                                 }
                            },
                            {
                                "element_description": true,
                                "id": "natpool-type",
                                "name": "natpool-type",
                                "label": context.getMessage('natpool_create_pool_type'),
                                "field-help": {
                                    "content": context.getMessage('natpool_type_tooltip')
                                 }
                                
                            },
                            {
                                "element_description": true,
                                "id": "natpool-address",
                                "name": "address ",
                                "label": context.getMessage('natpool_create_pool_address'),
                                "required": true,
                                "error": context.getMessage('natpool_create_pool_address_error'),
                                "field-help": {
                                    "content": context.getMessage('natpool_address_tooltip')
                                 },
                                "values": [
                                    {
                                        "label": context.getMessage("select_option"),
                                        "value": ""
                                    }
                                ]
                            },
                            ]
                        },
                        {
                            "heading": "Routing Instance",
                            "section_id": "natpool-routing-form",
                            "elements": [
                                   {
                                "element_description": true,
                                "id": "natpool-device",
                                "name": "device",
                                "label": context.getMessage('natpool_create_pool_device'),
                                "field-help": {
                                    "content": context.getMessage('natpool_device_tooltip')
                                 },
                                "values": [
                                    {
                                        "label": context.getMessage("select_option"),
                                        "value": ""
                                    }
                                ]

                            },
                            {
                                "element_description": true,
                                "id": "natpool-routing",
                                "name": "routing",
                                "required": true,
                                "error": context.getMessage('natpool_create_pool_routing_error'),
                                "label": context.getMessage('natpool_create_pool_routing'),
                                "field-help": {
                                    "content": context.getMessage('natpool_routing_tooltip')
                                 },
                                "values": [
                                    {
                                        "label": context.getMessage("select_option"),
                                        "value": ""
                                    }
                                ]
                            }
                            ]
                        },
                        {
                            "heading": "Advanced",
                            "progressive_disclosure": "expanded",
                            "section_id": "natpool-adavanced-form",
                            "elements": [
                                {
                                "element_ip": true,
                                "id": "natpool-host",
                                "name": "host",
                                "value": "{{host-address-base}}",
                                "label": context.getMessage('natpool_create_pool_host'),
                                "error": context.getMessage('natpool_create_pool_host_error'),
                                "pattern": "^.{1,1024}$",
                                "field-help": {
                                    "content": context.getMessage('natpool_host_tooltip')
                                 }
                            },
                            {
                                "element_description": true,
                                "id": "natpool-translation",
                                "name": "translation",
                                "label": context.getMessage('natpool_create_pool_translation'),
                                "error": context.getMessage('natpool_create_pool_translation_error'),
                                "post_validation":"isTranslationValueAllowed",
                                "field-help": {
                                    "content": context.getMessage('natpool_translation_tooltip')
                                 }
                            },
                            {
                               "element_description": true,
                                "id": "natpool-pooling",
                                "name": "pooling",
                                "label": context.getMessage('natpool_create_pool_pooling'),
                                "error": context.getMessage('natpool_create_pool_pooling_error'),
                                "class": "natpool-pooling-conf",
                                "field-help": {
                                    "content": context.getMessage('natpool_pooling_tooltip')
                                 }
                            },
                            {
                                "element_checkbox": true,
                                "id": "natpool-address-sharing-Chkbox",
                                "label": context.getMessage("natpool_create_pool_sharing"),
                                "required": false,
                                "class": "natpool-no-translation-conf",
                                "field-help": {
                                    "content": context.getMessage('natpool_sharing_tooltip')
                                 },
                                "values": [
                                    {
                                        "id": "natpool-address-sharing",
                                        "name": "natpool-sharing",
                                        "value": "enable",
                                        "checked": false
                                    }
                                ],
                                "error": context.getMessage("error_make_selection")
                            },
                            {
                                "element_description": true,
                                "id": "natpool-overflow-type",
                                "name": "overflow",
                                "label": context.getMessage('natpool_create_pool_overflow_type'),
                                "error": context.getMessage('natpool_create_pool_overflow_error'),
                                "class": "natpool-no-translation-conf",
                                "field-help": {
                                    "content": context.getMessage('natpool_overflow_tooltip')
                                 }
                            },
                            {
                                "element_description": true,
                                "id": "natpool-overflow",
                                "name": "natpool-overflow",
                                "label": context.getMessage('natpool_create_pool_overflow'),
                                "class": "natpool-no-translation-conf natpool-overflow-conf",
                                "required": true,
                                "error": context.getMessage('natpool_create_pool_overflow_error'),                                
                                "values": [
                                    {
                                        "label": context.getMessage("select_option"),
                                        "value": ""
                                    }
                                ]
                            },
                             {
                                "element_description": true,
                                "id": "natpool-port-range",
                                "name": "natpool-port-range",
                                "label": context.getMessage('natpool_create_pool_port-range'),
                                "class": "natpool-port-range-conf"
                            },
                            {
                                "element_number": true,
                                "id": "natpool-port-single",
                                "name": "natpool-port-single",
                                "value": "{{port-range}}",
                                "class": "natpool-port-range-conf natpool-port-single-conf",
                                "label": context.getMessage('natpool_create_pool_port'),
                                "error": context.getMessage('natpool_create_pool_port_error'),
                                "required": true,
                                "min_value":PORT_RANGE_MIN_VALUE,
                                "max_value":PORT_RANGE_MAX_VALUE
                            },
                             {
                                "element_number": true,
                                "id": "natpool-port-range-start",
                                "name": "natpool-port-range-start",
                                "value": "{{start}}",
                                "label": context.getMessage('natpool_create_pool_port-range-start'),
                                "class": "natpool-port-range-conf natpool-port-range-params-conf",
                                "error": context.getMessage('natpool_create_pool_port_error'),
                                "required": true,
                                "min_value":PORT_RANGE_MIN_VALUE,
                                "max_value":PORT_RANGE_MAX_VALUE,
                                "post_validation": "isEndPortGreater"
                            },
                            {
                                "element_number": true,
                                "id": "natpool-port-range-end",
                                "name": "natpool-port-range-end",
                                "value": "{{end}}",
                                "label": context.getMessage('natpool_create_pool_port-range-end'),
                                "class": "natpool-port-range-conf natpool-port-range-params-conf",
                                "error": context.getMessage('natpool_create_pool_port_error'),
                                "required": true,
                                "min_value":PORT_RANGE_MIN_VALUE,
                                "max_value": PORT_RANGE_MAX_VALUE,
                                "post_validation": "isEndPortGreater"
                            },
                            {
                                "element_number": true,
                                "id": "natpool-overloading",
                                "name": "natpool-overloading",
                                "value": "{{port-overloading-factor}}",
                                "label": context.getMessage('natpool_create_pool_overloading'),
                                "class": "natpool-overload-conf",
                                "error": context.getMessage('natpool_create_pool_overloading_error'),
                                "min_value":PORT_OVERLODING_MIN_VALUE,
                                "max_value":PORT_OVERLODING_MAX_VALUE,
                                "required": true
                            }
                            ]
                        },
                        
                        {
                            "section_id": "natpool-port-form",
                            "elements": [
                                {
                                "element_number": true,
                                "id": "natpool-port",
                                "name": "natpool-port",
                                "value": "{{port-range}}",
                                "label": context.getMessage('natpool_create_pool_port'),
                                "error": context.getMessage('natpool_create_pool_dst_port_error'),
                               // "pattern": "^[0-9\-]+$",
                                "min_value":PORT_MIN_VALUE,
                                "max_value":PORT_MAX_VALUE,
                                "post_validation": "isPortRangeValueAllowed"
                            }
                            
                            ]
                        }
         
                    ],
                    "buttonsAlignedRight": true,
                    "buttonsClass":"buttons_row",
                    "cancel_link": {
                        "id": "natpool-cancel",
                        "value": context.getMessage('cancel')
                    },
                    "buttons": [
                        {
                            "id": "natpool-save",
                            "name": "create",
                            "value": "OK"
                        }
                    ]
                };
            }
        };
        return Configuration;
    }
);

