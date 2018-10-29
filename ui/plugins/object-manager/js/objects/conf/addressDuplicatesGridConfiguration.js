/**
 * A configuration object with the parameters required to build 
 * a grid for duplicate groups of address
 *
 * @module addressDuplicatesGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
'../../../../ui-common/js/common/restApiConstants.js',
'../../../../ui-common/js/common/gridConfigurationConstants.js'
], function (RestApiConstants, GridConfigurationConstants) {

    var Configuration = function(context) {
        var buildSubgridUrl = function (rowObject){
            var url = '/api/juniper/sd/address-management/addresses';
            url += "?domainContext=(filterDomainIds eq " + Juniper.sm.DomainProvider.getCurrentDomain() + ")&filter=(hashKey eq '" + rowObject['hashKey'] + "')";
            return url;
        };

        var showSubtitle = function (cellvalue, options, rowObject){
            return rowObject.name + '(' + rowObject.size + ' ' + context.getMessage('members_lowercase') + ')';
        };

        this.formatTypeObject = function (cellValue, options, rowObject) {
            if (cellValue === 'IPADDRESS')  return context.getMessage('address_grid_type_host');
            if (cellValue === 'GROUP')  return context.getMessage('address_grid_type_group');
            if (cellValue === 'RANGE')  return context.getMessage('address_grid_type_range');
            if (cellValue === 'NETWORK')  return context.getMessage('address_grid_type_network');
            if (cellValue === 'WILDCARD')  return context.getMessage('address_grid_type_wildcard');
            if (cellValue === 'DNS')  return context.getMessage('address_grid_type_dns');
            if (cellValue === 'POLYMORPHIC')  return context.getMessage('address_grid_type_polymorphic');
            if (cellValue === 'DYNAMIC_ADDRESS_GROUP')  return context.getMessage('address_grid_type_dynamic');
            return '';
        };

        var showName = function(cellvalue, options, rowObject) {
            var css = 'address-host-column';
            if (rowObject['address-type'] === 'IPADDRESS')  css = 'address-host-column';
            if (rowObject['address-type'] === 'GROUP')  css = 'address-group-column';
            if (rowObject['address-type'] === 'RANGE')  css = 'address-range-column';
            if (rowObject['address-type'] === 'NETWORK')  css = 'address-Network-column';
            if (rowObject['address-type'] === 'WILDCARD')  css = 'address-wildcard-column';
            if (rowObject['address-type'] === 'DNS')   css = 'address-dns-column';
            return '<span class="' + css + '">' + rowObject['name'] + '</span>';
        }

        this.getValues = function() {

            return {
                "tableId":"address-duplicate-groups",
                "height": "310px",
                "url": "/api/juniper/sd/address-management/addresses/show-duplicates",
                "numberOfRows": GridConfigurationConstants.OVERLAY_PAGE_SIZE,
                "jsonRoot": "duplicate-list.duplicates",
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.show-duplictaes+json;version=1;q=0.01'
                    }
                },
                "scroll": true,
                "footer": false,
                "sorting": false,
                "jsonRecords": function(data) {
                    return data['duplicate-list'][RestApiConstants.TOTAL_PROPERTY];
                },
                "multiselect": "true",
                "contextMenu": {
                    "delete": context.getMessage('action_delete'),
                    "custom":[{
                            "label":context.getMessage('action_merge'),
                            "key":"mergeEvent"
                        },{
                            "label":context.getMessage('action_find_usage'),
                            "key":"findUsageEvent"
                        }]
                },
                "subGrid": {
                    "url": buildSubgridUrl,
                    "jsonRoot": "addresses.address",
                    "showRowNumbers":true,
                    "scroll": "true",
                    "height": "200px",
                    "numberOfRows": GridConfigurationConstants.SUBGRID_PAGE_SIZE,
                    "ajaxOptions": {
                        "headers": {
                            "Accept": 'application/vnd.juniper.sd.address-management.address-refs+json;version=1;q=0.01'
                        }
                    },
                    "jsonRecords": function(data) {
                        return data.addresses['total'];
                    }
                },
                "columnDefs": [{ "targets": 'no-sort', "orderable": false }],
                "columns": [
                    {
                        "index": "context",
                        "name": "context",
                        "label": context.getMessage('name'),
                        "width": 150,
                        "formatter":showSubtitle,
                        "groupBy":"true"
                    }, {
                        "index": "id",
                        "name": "id",
                        "hidden": true
                    }, {
                        "index": "hash-key",
                        "name": "hash-key",
                        "hidden": true
                    }, {
                        "index": "definition-type",
                        "name": "definition-type",
                        "hidden": true
                    }, {
                        "name": "name",
                        "id": "name",
                        "hidden": true
                    }, {
                        "name": "displayName",
                        "label": context.getMessage('name'),
                        "width": 150,
                        "formatter":showName,
                        "hideHeader": "true"
                    }, {
                        "index": "address-type",
                        "name": "address-type",
                        "label": context.getMessage('grid_column_type'),
                        "width": 150,
                        "formatter": this.formatTypeObject
                    }, {
                        "index": "host-name",
                        "name": "host-name",
                        "label": context.getMessage('address_grid_column_hostname'),
                        "width": 180
                    }, {
                        "index": "ip-address",
                        "name": "ip-address",
                        "label": context.getMessage('address_grid_column_ipaddress'),
                        "width": 180
                    }, {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage('description'),
                        "width": 140
                    }
                ]
            };
        };
        this.objectType = 'address';
    };

    return Configuration;
});
