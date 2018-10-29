/**
 * Configuration for dashboard categories
 *
 * @module categoriesConfiguration
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define(['lib/i18n/i18n'], function (i18n) {

    var categoriesConfiguration = {};

    categoriesConfiguration = {
        'category_devices': {
            'id': 'category_devices',
            'text':  i18n.getMessage('category_devices') //Devices
        },
        'category_zones': {
            'id': 'category_zones',
            'text':  i18n.getMessage('category_zones') //Zones
        },
        'category_events': {
            'id': 'category_events',
            'text':  i18n.getMessage('category_events') //Events & Threats
        },
        'category_ip': {
            'id': 'category_ip',
            'text':  i18n.getMessage('category_ip') //IP Addresses
        }
    };

    return categoriesConfiguration;

});