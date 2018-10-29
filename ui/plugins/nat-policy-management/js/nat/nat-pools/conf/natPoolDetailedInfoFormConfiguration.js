/**
 * A configuration object with the parameters required to build 
 * a form for Detailed Info Nat Pool
 *
 * @module natpoolDetailedInfoFormConfiguration
 * @author mdamodhar <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([],
    function() {
        var Configuration = function(context) {
            this.getValues = function() {
                return {
                    "title": context.getMessage('natpool_detailed_info_title'),
                    "form_id": "sd_natpool_form",
                    "form_name": "sd_natpool_form",
                    "on_overlay": true,
                    "add_remote_name_validation": 'natpool-name',
                    "title-help": {
                        "content": context.getMessage("detail_view_tooltip"),
                        "ua-help-text": context.getMessage('more_link'),
                        "ua-help-identifier": context.getHelpKey("POLICY_OBJECT_DETAIL_VIEW")
                    },
                    "sections": [
                        {
                            "elements": [
                            {
                                    "element_description": true,
                                    "name": "name",
                                    "label": context.getMessage('name'),
                                    "id": "natpool-name",
                                    "value": "{{name}}"
                            },
                            {
                                    "element_description": true,
                                    "name": "description",
                                    "label": context.getMessage('description'),
                                    "id": "natpool-description",
                                    "value": "{{description}}"
                            },
                            {
                                    "element_description": true,
                                    "name": "natpool-type",
                                    "label": context.getMessage('natpool_create_pool_type'),
                                    "id": "natpool-type",
                                    "value": "{{pool-type}}"
                            },
                            {
                                    "element_description": true,
                                    "name": "natpool-address-name",
                                    "label": context.getMessage('natpool_create_pool_address'),
                                    "id": "natpool-address-name",
                                    "value": "{{pool-address.name}}"
                            }/*,
                            {
                                    "element_description": true,
                                    "name": "natpool-address-type",
                                    "label": context.getMessage('natpool_pool_address_type'),
                                    "id": "natpool-address-type",
                                    "value": "{{pool-address.address-type}}"
                            },
                            {
                                    "element_description": true,
                                    "name": "natpool-address-ip",
                                    "label": context.getMessage('natpool_pool_address_ip'),
                                    "id": "natpool-address-ip",
                                    "value": "{{pool-address.ip-address}}"
                            }*/
                             ]
                        },
                        {
                            "heading": "Routing Instance",
                            "section_id": "natpool-routing-form",
                            "elements": [
                            {
                                "element_description": true,
                                "id": "natpool-device",
                                "name": "natpool-device",
                                "value": "{{device.name}}",
                                "label": context.getMessage('natpool_create_pool_device')

                            },
                            {
                                "element_description": true,
                                "id": "natpool-routing",
                                "name": "natpool-routing",
                                "value": "{{routing-instance-name}}",
                                "label": context.getMessage('natpool_create_pool_routing')
                            }
                            
                            ]
                        },
                        {
                            "heading": "Advanced",
                            "section_id": "natpool-advanced-form",
                            "elements": [
                            {
                                    "element_description": true,
                                    "name": "natpool-host",
                                    "label": context.getMessage('natpool_create_pool_host'),
                                    "id": "natpool-host",
                                    "value": "{{host-address-base}}"
                            },
                            {
                                    "element_description": true,
                                    "name": "translation",
                                    "label": context.getMessage('natpool_port_translation'),
                                    "id": "natpool-translation",
                                    "value": "{{disable-port-translation}}"
                            },
                            {
                                    "element_description": true,
                                    "name": "natpool-address-pooling",
                                    "label": context.getMessage('natpool_create_pool_pooling'),
                                    "id": "natpool-address-pooling",
                                    "value": "{{address-pooling}}"
                            },
                            {
                                    "element_description": true,
                                    "name": "natpool-over-flow-pool-type",
                                    "label": context.getMessage("natpool_create_pool_sharing"),
                                    "id": "natpool-over-flow-pool-type",
                                    "value": "{{address-shared}}"
                            },
                            {
                                    "element_description": true,
                                    "name": "natpool-over-flow-pool-type",
                                    "label": context.getMessage('natpool_port_range'),
                                    "id": "natpool-over-flow-pool-type",
                                    "value": "{{port-range}}"
                            },
                            {
                                    "element_description": true,
                                    "name": "natpool-over-flow-pool-type",
                                    "label": context.getMessage('natpool_port_overloading'),
                                    "id": "natpool-over-flow-pool-type",
                                    "value": "{{port-overloading-factor}}"
                            },
                            {
                                    "element_description": true,
                                    "name": "natpool-over-flow-pool-type",
                                    "label": context.getMessage('natpool_create_pool_overflow_type'),
                                    "id": "natpool-over-flow-pool-type",
                                    "value": "{{over-flow-pool-type}}"
                            },
                            {
                                "element_description": true,
                                "id": "natpool-description",
                                "name": "natpool-overflow-pool-name",
                                "value": "{{overflow-pool-address.name}}",
                                "label": context.getMessage('natpool_pool_overflow_name')
                            }
                             ]
                        },
                        {
                            "section_id": "natpool-port-form",
                            "elements": [
                                {
                                "element_description": true,
                                "id": "natpool-port",
                                "name": "natpool-port",
                                "value": "{{port-range}}",
                                "label": context.getMessage('natpool_create_pool_port'),
                            }
                            
                            ]
                        }
                        
                    ],
                    "buttonsAlignedRight": true,
                    "buttonsClass": "buttons_row",
                    "buttons": [{
                        "id": "natpool-cancel",
                        "name": "create",
                        "value": "OK"
                    }]
                };
            }
        };
        return Configuration;
    }
);

