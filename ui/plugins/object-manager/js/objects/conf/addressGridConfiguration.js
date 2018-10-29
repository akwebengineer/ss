/**
 * A configuration object with the parameters required to build 
 * a grid for Addresses
 *
 * @module addressConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
'../../../../ui-common/js/common/restApiConstants.js',
'../../../../ui-common/js/common/gridConfigurationConstants.js'
], function (RestApiConstants, GridConfigurationConstants) {

    var Configuration = function(context) {

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
      this.unFormatTypeObject = function (formattedCellValue) {
        if (formattedCellValue === context.getMessage('address_grid_type_host'))  return 'IPADDRESS';
        if (formattedCellValue === context.getMessage('address_grid_type_group') )  return 'GROUP';
        if (formattedCellValue === context.getMessage('address_grid_type_range'))  return 'RANGE';
        if (formattedCellValue === context.getMessage('address_grid_type_network'))  return 'NETWORK';
        if (formattedCellValue === context.getMessage('address_grid_type_wildcard'))  return 'WILDCARD';
        if (formattedCellValue === context.getMessage('address_grid_type_dns'))  return 'DNS';
        if (formattedCellValue === context.getMessage('address_grid_type_polymorphic'))  return 'POLYMORPHIC';
        if (formattedCellValue === context.getMessage('address_grid_type_any'))  return 'ANY';
        if (formattedCellValue === context.getMessage('address_grid_type_any_ipv4'))  return 'ANY_IPV4';
        if (formattedCellValue === context.getMessage('address_grid_type_any_ipv6'))  return 'ANY_IPV6';
        if (formattedCellValue === context.getMessage('address_grid_type_all_ipv6'))  return 'ALL_IPV6';
        if (formattedCellValue === context.getMessage('address_grid_type_dynamic')) return 'DYNAMIC_ADDRESS_GROUP';
      };

        this.getNotificationConfig = function () {
          var notificationSubscriptionConfig = {
            'uri' : ['/api/juniper/sd/address-management/addresses'],
            'autoRefresh' : true,
            'callback' : function () {
              this.gridWidget.reloadGrid();
            }
          };
          return notificationSubscriptionConfig;
        };
        this.getValues = function() {

            return {
                "title": context.getMessage('address_grid_title'),
                "title-help": {
                    "content": context.getMessage('address_grid_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("SHARED_OBJECTS_ADDRESS_CREATING")
                },
                "tableId": "addresses",
                "numberOfRows": GridConfigurationConstants.PAGE_SIZE,
                "height": "auto",
                "sorting": [
                    {
                    "column": "name",
                    "order": "asc"
                    }
                ],
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": true,
                "url": "/api/juniper/sd/address-management/addresses",
                "jsonRoot": "addresses.address",
                "jsonId": "id",
                "jsonRecords": function(data) {
                    return data.addresses[RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.address-management.address-refs+json;version=1;q=0.01'
                    }
                },
                "contextMenu": {
                    "edit": context.getMessage('address_grid_edit'),
                    "delete": context.getMessage('address_grid_delete')
                },
                "reformatUrl": function(url) {
                    var addressAlwaysFilter = "addressType ne 'POLYMORPHIC'";
                    // check if this filter is there , if not add it
                    if (_.isEmpty(url.filter)) {
                        url.filter = "(" + addressAlwaysFilter + ")";
                    } else if ((typeof url.filter == "string") && 
                            (url.filter.indexOf("addressType") < 0)) {
                        // remove the parentheses around
                        var filters = url.filter.substr(1, url.filter.length-2);
                        filters += " and " + addressAlwaysFilter;
                        url.filter = "(" + filters + ")";
                    } else if (typeof url.filter == "object") {
                        //
                    } else if (_.isArray(url.filter)) {
                        //
                    }
                    return url;
                },
                "filter": {
                    searchUrl: true,
                    optionMenu: {
                        "showHideColumnsItem": {},
                        "customItems": []
                    }
                },
                "columns": [
                    {
                        "index": "id",
                        "name": "id",
                        "hidden": true
                    },
                    {
                        "index": "domain-id",
                        "name": "domain-id",
                        "hidden": true
                    },
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('grid_column_name'),
                        "width": 186
                    },
                    {
                        "index": "address-type",
                        "name": "address-type",
                        "label": context.getMessage('grid_column_type'),
                        "width": 186,
                        "formatter": this.formatTypeObject,
                        "unformat" : this.unFormatTypeObject
                    },
                    {
                        "index": "host-name",
                        "name": "host-name",
                        "label": context.getMessage('address_grid_column_hostname'),
                        "width": 186
                    },
                    {
                        "index": "ip-address",
                        "name": "ip-address",
                        "label": context.getMessage('address_grid_column_ipaddress'),
                        "width": 186
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage('grid_column_description'),
                        "collapseContent": {
                            "singleValue" : true
                        },
                        "width": 186
                    },
                    {
                        "index": "domain-name",
                        "name": "domain-name",
                        "label": context.getMessage('grid_column_domain'),
                        "width": 186
                    }
                ]
            }
        }
    };

    return Configuration;
});
