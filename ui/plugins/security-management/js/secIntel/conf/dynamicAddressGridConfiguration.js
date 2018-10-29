/**
 * A configuration object with the parameters required to build
 * a grid for dynamic address groups
 *
 * @module dynamicAddressGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'text!../../../../sd-common/js/templates/dynamicAddressProperty.html',
    '../../../../ui-common/js/common/restApiConstants.js',
    '../../../../ui-common/js/common/gridConfigurationConstants.js'
], function(propertyTemplate, RestApiConstants, GridConfigurationConstants) {

    var Configuration = function(context) {

        var convertData = function(rowObject) {
            var country_array = [], retValue = {};
            retValue["negate-selected-countries"] = rowObject["negate-selected-countries"];
            if (rowObject.countries && rowObject.countries.country.length > 0){
                $.each(rowObject.countries.country, function(index, country) {
                    country_array.push(country["display-name"]);
                });
                retValue["countries"] = country_array.join(', ');
            }
            return retValue;
        }

        var propertyFormatter = function(cellValue, options, rowObject) {
            return Slipstream.SDK.Renderer.render(propertyTemplate, convertData(rowObject));
        };

        var categoryFormatter = function(cellValue, options, rowObject){
            if (cellValue === 'CUSTOM_ADDRESS_LIST')  return context.getMessage('secintel_dynamic_address_category_custom_address_list');
            if (cellValue === 'GEO_IP')  return context.getMessage('secintel_dynamic_address_category_geo_ip');
            if (typeof cellValue === 'undefined')  return '';
        }

        this.getValues = function() {

            return {
                "title": context.getMessage('secintel_dynamic_address_grid_title'),
                "title-help": {
                    "content": context.getMessage('secintel_dynamic_address_grid_tooltip'),
                    "ua-help-identifier": "alias_for_ua_event_binding"
                },
                "tableId": "secintel-dynamic-addresses",
                "numberOfRows": GridConfigurationConstants.PAGE_SIZE,
                "height": "500px",
                "sortName": "name",
                "sortOrder": "asc",
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": true,
                "url": "/api/juniper/sd/dynamic-address-management/dynamic-addresses",
                "jsonRoot": "dynamic-addresses.dynamic-address",
                "jsonRecords": function(data) {
                    return data['dynamic-addresses'][RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.dynamic-address-management.dynamic-address-refs+json;version=1;q=0.01'
                    }
                },
                "contextMenu": {
                    "createAfter": context.getMessage('secintel_dynamic_address_grid_create'),
                    "edit": context.getMessage('secintel_dynamic_address_grid_edit'),
                    "delete": context.getMessage('secintel_dynamic_address_grid_delete')
                },
                "columns": [
                    {
                        "index": "id",
                        "name": "id",
                        "hidden": true
                    },
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('grid_column_name')
                    },
                    {
                        "index": "category",
                        "name": "category",
                        "label": context.getMessage('secintel_dynamic_address_grid_column_category'),
                        "formatter":categoryFormatter
                    },
                    {
                        "index": "negate-selected-countries",
                        "name": "negate-selected-countries",
                        "width": 300,
                        "label": context.getMessage('secintel_dynamic_address_grid_column_property'),
                        "formatter": propertyFormatter
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage('grid_column_description'),
                        "width": 200
                    },
                    {
                        "index": "domain-name",
                        "name": "domain-name",
                        "label": context.getMessage('grid_column_domain')
                    }
                ]
            }
        }
    };

    return Configuration;
});
