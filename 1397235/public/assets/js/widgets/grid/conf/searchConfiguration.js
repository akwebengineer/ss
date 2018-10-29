/**
 * A sample configuration object that shows the parameters required to build a Search widget
 *
 * @module configurationSample
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
], function () {

    var searchConf = {};

    searchConf.filterMenu = {
        'quickFilterKey': {
            'label':'quickFilter',
            'value':['juniper','nonJuniper'],
            'operators': ['=']
        },
        'OSVersionKey': {
            'label': 'OSVersion',
            'value': ['12.1', '12.2', '12.3', '12.4', '13.1', '13.2'],
            'operators': ['=', '!=', '<', '>', '<=', '>=']
        },
        'DeviceFamilyKey': {
            'label': 'DeviceFamily',
            'value': ['SRX', 'MX', 'EX']
        },
        'nameKey': {
            'label':'Name',
            'value':['SRX','MX','EX']
        },
        'sourceAddressKey': {
            'label':'Source Address',
            'value':['any','Sircon_Group','IP_DPW_10.10.10.10'],
            'operators': ['=']
        },
        'destinationAddressKey': {
            'label':'Destination Address',
            'value':['IP_LOT_10.10.10.10','IP_INS_1.1.1.1']
        },
        'dateKey': {
            'label':'date',
            'value':['2007-10-06','2008-20-06','2009-30-06']
        },
        'applicationServicesKey': {
            'label':'application-services',
            'value':['IDP','UTM','AppFW']
        },
        'PlatformKey': {
            'label':'Platform',
            'value':['srx650', 'srx5800', 'mx2020', 'ex2200']
        },
        'ManagedStatusKey': {
            'label':'ManagedStatus',
            'value':['In Sync','Out of Sync','Connecting']
        },
        'ConnectionStatusKey': {
            'label':'ConnectionStatus',
            'value':['Down', 'Up']
        },
        'IPAddressKey': {
            'label':'IPAddress',
            'value':['10.10.10.10','20.20.20.20']
        }
    };

    searchConf.logicMenu = ['AND','OR','NOT'];

    searchConf.autocompleteFilterMenu = {
        'USR': {
            'label': 'USR'
        },
        'ADDR': {
            'label': 'ADDR'
        },
        'SITE': {
            'label': 'SITE'
        },
        'APP': {
            'label': 'APP'
        }
    };

    searchConf.autocompleteLogicMenu = ['AND'];

    return searchConf;

});
