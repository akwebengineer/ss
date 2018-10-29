/**
 * A configuration object with the parameters required to build 
 * a form for Creating Address
 *
 * @module addressCreateFormConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {
    var Configuration = function(context) {
        var DESCRIPTION_MAX_LENGTH = 1024,
        HOST_NAME_MAX_LENGTH = 69;

        this.getValues = function(options) {
            var addressTypes = [{
                        "text": "Host",
                        "id": "IPADDRESS"
                    },  {
                        "text": "Range",
                        "id": "RANGE"
                    }, {
                        "text": "Network",
                        "id": "NETWORK"
                    }, {
                        "text": "Wildcard",
                        "id": "WILDCARD"
                    }, {
                        "text": "DNS Host",
                        "id": "DNS"
                    } ];
            /**
             * For NAT Pool creation view, should only display address types which are applicable.
             */
            if (!$.isEmptyObject(options) && $.isArray(options.addressTypes)) {
                var tempTypes = [];
                addressTypes.forEach(function(type, idx, array) {
                    var key = type.text.toLowerCase();
                    if (options.addressTypes.indexOf(key) > -1) {
                        tempTypes.push(type);
                    }
                });
                addressTypes = tempTypes;
            }
            return {
                "form_id": "address-create-form",
                "form_name": "address-create-form",
                "err_timeout": "1000",
                "on_overlay": true,
                "title-help": {
                    "content": context.getMessage('address_create_view_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("SHARED_OBJECTS_ADDRESS_CREATING")
                },
                "add_remote_name_validation": 'address-name',
                "sections": [
                    {
                        "section_id": "address-basic-form",
                        "elements": [
                            {
                                "label": context.getMessage("address_create_obj_type"),
                                "element_radio": true,
                                "id": "address-object",
                                "field-help": {
                                    "content": context.getMessage('address_object_type_tooltip')
                                },
                                "values": [
                                    {
                                        "id": "address-radio",
                                        "name": "address-object-type",
                                        "label": context.getMessage("address_create_obj_type_address"),
                                        "value": "IPADDRESS",
                                        "checked": true
                                    },
                                    {
                                        "id": "address-group-radio",
                                        "name": "address-object-type",
                                        "label": context.getMessage("address_create_obj_type_address_group"),
                                        "value": "GROUP"
                                    }
                                ]
                            },
                            {
                                "element_multiple_error": true,
                                "id": "address-name",
                                "name": "name",
                                "value": "{{name}}",
                                "label": context.getMessage('name'),
                                "field-help": {
                                    "content": context.getMessage('address_name_tooltip')
                                },
                                "required": true,
                                "error": true,
                                "pattern-error": [
                                    {
                                        "pattern": "validtext",
                                        "error": context.getMessage('name_require_error')
                                    },
                                    {
                                        "regexId": "regex1",
                                        "pattern": "^[a-zA-Z0-9][a-zA-Z0-9-_.:\/]{0,62}$",
                                        "error": context.getMessage('address_name_error')
                                    }
                                ]
                            },
                            {
                                "element_textarea": true,
                                "id": "address-description",
                                "name": "description",
                                "value": "{{description}}",
                                "label": context.getMessage('description'),
                                "max_length": DESCRIPTION_MAX_LENGTH,
                                "post_validation": "descriptionValidator",
                                "field-help": {
                                    "content": context.getMessage('address_description_tooltip')
                                }
                            }
                        ]
                    },
                    {
                        "section_id": "address-form",
                        "elements": [
                            {
                                "element_dropdown": true,
                                "id": "address-type",
                                "name": "address-type",
                                "label": context.getMessage('grid_column_type'),
                                "initValue": "{{address-type}}",
                                "values": [],
                                "data": addressTypes,
                                "field-help": {
                                    "content": context.getMessage('address_create_type_tooltip')
                                }
                            }
                        ]
                    },
                    {
                        "section_id": "address-type-section",
                        "elements": [
                        {
                            "element_ip": true,
                            "id": "address-ip-address",
                            "name": "address-ip-address",
                            "label": context.getMessage('address_create_host_ip'),
                            "placeholder": context.getMessage('address_create_host_ip_placeholder'),
                            "required": true,
                            "field-help": {
                                "content": context.getMessage('address_grid_type_host_tooltip')
                            },
                            "inlineLinks":[{
                                "id": "host-ip-link",
                                "value": context.getMessage("address_host_name_lookup")
                            }],
                            "error": context.getMessage('address_host_ip_error')
                        },
                        {
                            "element_text": true,
                            "id": "address-host-name",
                            "name": "address-host-name",
                            "label": context.getMessage('address_create_host_name'),
                            "field-help": {
                                "content": context.getMessage('address_grid_type_host_name_tooltip')
                            },
                            "pattern": "(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$",
                            "inlineLinks":[{
                                "id": "host-name-link",
                                "value": context.getMessage("address_ip_lookup")
                            }],
                            "pattern": "^[a-zA-Z0-9\\-\\.]*$",
                            "max_length": HOST_NAME_MAX_LENGTH,
                            "post_validation": "dnsNameValidator",
                            "error": context.getMessage('address_host_name_error')
                        },
                        {
                            "element_ip": true,
                            "id": "address-range-start-address",
                            "name": "address-range-start-address",
                            "label": context.getMessage('address_create_range_start_address'),
                            "placeholder": context.getMessage('address_create_host_ip_placeholder'),
                            "required": true,
                            "field-help": {
                                "content": context.getMessage('address_grid_type_range_start_tooltip')
                            },
                            "class": "hide",
                            "error": context.getMessage('address_range_ip_start_error')
                        },
                        {
                            "element_ip": true,
                            "id": "address-range-end-address",
                            "name": "address-range-end-address",
                            "label": context.getMessage('address_create_range_end_address'),
                            "placeholder": context.getMessage('address_create_host_ip_placeholder'),
                            "required": true,
                            "class": "hide",
                            "field-help": {
                                "content": context.getMessage('address_grid_type_range_end_tooltip')
                            },
                            "error": context.getMessage('address_range_ip_end_error'),
                            "post_validation": "isEndAddressGreater"
                        },
                        {
                            "element_ipCidrWidget": true,
                            "id": "address-network-ip",
                            "label": context.getMessage('address_network_ip'),
                            "ip_id": "address-network-ip-address",
                            "ip_name": "address-network-ip-address",
                            "ip_placeholder": context.getMessage('address_create_host_ip_placeholder'),
                            "ip_required": "true",
                            "ip_field-help": {
                                "content": context.getMessage('address_grid_type_network_tooltip')
                            },
                            "ip_error": context.getMessage('address_ip_error'),
                            "cidr_id": "address-network-mask",
                            "cidr_name": "mask",
                            "cidr_placeholder": context.getMessage('cidr_placeholder'),
                            "subnet_placeholder": context.getMessage('submask_placeholder'),
                            "cidr_error": context.getMessage('address_network_submask_error'),
                            "subnet_label": context.getMessage('address_network_subnet'),
                            "subnet_id": "address-network-subnet",
                            "subnet_error": context.getMessage('address_network_submask_error'),
                            "subnet-help": {//not supported
                                "content": context.getMessage('address_grid_type_network_mask_tooltip')
                            },
                            "subnet_name": "address-network-subnet",
                            "class": "hide"
                        },
                        {
                            "element_ip": true,
                            "id": "address-wildcard-ip-address",
                            "name": "address-wildcard-ip-address",
                            "label": context.getMessage('address_network_ip'),
                            "placeholder": context.getMessage('address_wildcard_ip_placeholder'),
                            "required": true,
                            "field-help": {
                                "content": context.getMessage('address_grid_type_wildcard_tooltip')
                            },
                            "class": "hide",
                            "ip_version": "4",
                            "error": context.getMessage('address_wildcard_ip_error')
                        },
                        {
                            "element_ip": true,
                            "ip_version": "4",
                            "id": "address-wildcard-subnet",
                            "name": "address-wildcard-subnet",
                            "label": context.getMessage('address_wildcard_subnet'),
                            "placeholder": context.getMessage('address_wildcard_subnet_placeholder'),
                            "field-help": {
                                "content": context.getMessage('address_grid_type_wildcard_subnet_tooltip')
                            },
                            "required": true,
                            "class": "hide",
                            "error": context.getMessage('address_wildcard_subnet_error'),
                            "pattern": "^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$"
                        },
                        {
                            "element_text": true,
                            "id": "address-dns-name",
                            "name": "address-dns-name",
                            "label": context.getMessage('address_dns_name'),
                            "placeholder": context.getMessage('address_dns_placeholder'),
                            "required": true,
                            "field-help": {
                                "content": context.getMessage('address_grid_type_dns_tooltip')
                            },
                            "class": "hide",
                            "pattern": "^[a-zA-Z0-9\\-\\.]*$",
                            "max_length": HOST_NAME_MAX_LENGTH,
                            "post_validation": "dnsNameValidator",
                            "error": context.getMessage('address_dns_error')
                        }
                        ]
                    },
                    {
                        "section_id": "address-group-form",
                        "elements": [
                            {
                                "element_text": true,
                                "id": "address-group-addresses",
                                "name": "address-group-addresses",
                                "label": context.getMessage('address_grid_title'),
                                "error": context.getMessage('application_services_error'),
                                "placeholder": context.getMessage('loading'),
                                "field-help": {
                                    "content": context.getMessage('address_group_addresses_tooltip')
                                },
                                "class": "list-builder listBuilderPlaceHolder"
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "address-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "address-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            }
        };
    };

    return Configuration;
});
