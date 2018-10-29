/**
 * This files contains the filters that need to be appended to different URL for policy-management
 *
 * @module filters
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */
define([],
    function () {
        var filters = {};
        filters.addressIncludeFilterForGroupPolicy =
        [
                {
                    property: 'addressType',
                    modifier: 'ne',
                    value: 'ANY'
                }
        ];

        filters.addressExcludeFilterForGroupPolicy =
            [
                {
                    property: 'addressType',
                    modifier: 'ne',
                    value: 'ANY'
                },
                {
                    property: 'addressType',
                    modifier: 'ne',
                    value: 'ANY_IPV4'
                },
                {
                    property: 'addressType',
                    modifier: 'ne',
                    value: 'ANY_IPV6'
                },
                {
                    property: 'addressType',
                    modifier: 'ne',
                    value: 'ALL_IPV6'
                },
                {
                    property: 'addressType',
                    modifier: 'ne',
                    value: 'WILDCARD'
                },
                {
                    property: 'addressType',
                    modifier: 'ne',
                    value: 'DYNAMIC_ADDRESS_GROUP'
                }
            ];

        filters.addressIncludeFilterForDevicePolicy =
            [
                {
                    property: 'addressType',
                    modifier: 'ne',
                    value: 'ANY'
                },
                {
                    property: 'addressType',
                    modifier: 'ne',
                    value: 'POLYMORPHIC'
                }
            ];

        filters.addressExcludeFilterForDevicePolicy =
            [
                {
                    property: 'addressType',
                    modifier: 'ne',
                    value: 'ANY'
                },
                {
                    property: 'addressType',
                    modifier: 'ne',
                    value: 'ANY_IPV4'
                },
                {
                    property: 'addressType',
                    modifier: 'ne',
                    value: 'ANY_IPV6'
                },
                {
                    property: 'addressType',
                    modifier: 'ne',
                    value: 'ALL_IPV6'
                },
                {
                    property: 'addressType',
                    modifier: 'ne',
                    value: 'WILDCARD'
                },
                {
                    property: 'addressType',
                    modifier: 'ne',
                    value: 'DYNAMIC_ADDRESS_GROUP'
                },
                {
                    property: 'addressType',
                    modifier: 'ne',
                    value: 'POLYMORPHIC'
                }
            ];

        filters.addressFilterForNATPolicy =
            [
                {
                    property: 'addressType',
                    modifier: 'ne',
                    value: 'ANY'
                },
                {
                    property: 'addressType',
                    modifier: 'ne',
                    value: 'POLYMORPHIC'
                },
                {
                    property: 'addressType',
                    modifier: 'ne',
                    value: 'WILDCARD'
                },
                {
                    property: 'addressType',
                    modifier: 'ne',
                    value: 'DYNAMIC_ADDRESS_GROUP'
                }
            ];

        return filters;

    });
