/**
 * A configuration object with the parameters required to build 
 * a grid for protocols
 *
 * @module addressDetailGroupConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
'../../../../ui-common/js/common/gridConfigurationConstants.js'
], function (GridConfigurationConstants) {
    var Configuration = function(context) {
        this.formatDomainNameCell = function(cellValue, options, rowObject) {
            return Juniper.sm.DomainProvider.getDomainName(rowObject["domain-id"]);
        };

        this.formatTypeObject = function (cellValue, options, rowObject) {
            if (cellValue === 'IPADDRESS')  return context.getMessage('address_grid_type_host');
            if (cellValue === 'GROUP')  return context.getMessage('address_grid_type_group');
            if (cellValue === 'RANGE')  return context.getMessage('address_grid_type_range');
            if (cellValue === 'NETWORK')  return context.getMessage('address_grid_type_network');
            if (cellValue === 'WILDCARD')  return context.getMessage('address_grid_type_wildcard');
            if (cellValue === 'DNS')  return context.getMessage('address_grid_type_dns');
            if (cellValue === 'POLYMORPHIC')  return context.getMessage('address_grid_type_polymorphic');
            if (cellValue === 'ANY')  return context.getMessage('address_grid_type_any');
            if (cellValue === 'ANY_IPV4')  return context.getMessage('address_grid_type_any_ipv4');
            if (cellValue === 'ANY_IPV6')  return context.getMessage('address_grid_type_any_ipv6');
            if (cellValue === 'ALL_IPV6')  return context.getMessage('address_grid_type_all_ipv6');
            if (cellValue === 'DYNAMIC_ADDRESS_GROUP')  return context.getMessage('address_grid_type_dynamic');
        };

        this.getValues = function() {

            return {
                "tableId": "address-group-grid",
                "numberOfRows": GridConfigurationConstants.OVERLAY_PAGE_SIZE,
                "height": "200px",
                "repeatItems": "true",
                "scroll": true,
                "jsonId": "id",
                "columns": [
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('grid_column_name'),
                        "width": 90
                    },
                    {
                        "index": "ip-address",
                        "name": "ip-address",
                        "label": context.getMessage('address_grid_column_ipaddress'),
                        "width": 120
                    },
                    {
                        "index": "host-name",
                        "name": "host-name",
                        "label": context.getMessage('address_grid_column_hostname'),
                        "width": 120
                    },
                    {
                        "index": "address-type",
                        "name": "address-type",
                        "label": context.getMessage('grid_column_type'),
                        "width": 100,
                        "formatter": this.formatTypeObject
                    },
                    {
                        "index": "domain-id",
                        "name": "domain-id",
                        "hidden" : true
                    },
                    {
                        "index": "domain",
                        "name": "domain",
                        "label": context.getMessage('grid_column_domain'),
                        "formatter" : this.formatDomainNameCell,
                        "width": 100
                    }
                ]
            };
        };
    };

    return Configuration;
});
