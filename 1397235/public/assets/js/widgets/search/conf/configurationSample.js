/**
 * A sample configuration object that shows the parameters required to build a Search widget
 *
 * @module configurationSample
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {
    /** 
     * Standard Advanced Search Configuration - suggestion cards, explicit logical operators, enter key tokenization, etc.
     */
     
    var searchConf = {};

    searchConf.operators = ['=','!='];
        
    searchConf.filterMenu = {
        'OSVersionKey': {
            'label': 'OSVersion',
            'value': ['12.1', '12.2', '12.3', '12.4', '13.1', '13.2'],
            'operators': ['=','!=','<','>', '<=', '>=']
        },
        'DeviceFamilyKey': {
            'label': 'DeviceFamily',
            'value': ['SRX', 'MX', 'EX'],
            'operators': ['=','!=']
        },
        'PlatformKey': {
            'label': 'Platform',
            'value': ['srx650', 'srx5800', 'mx2020', 'ex2200']
        },
        'ManagedStatusKey': {
            'label': 'Managed Status',
            'value': ['In Sync', 'Out of Sync', 'Connecting']
        },
        'ConnectionStatusKey': {
            'label': 'ConnectionStatus',
            'value': ['Down', 'Up']
        },
        'NameKey': {
            'label': 'Name',
            'value': [] // if value property is empty or missing, there will be no suggestion card on the UI
        },
        'IPAddressKey': {
            'label': 'IPAddress'
        }
    };

    searchConf.logicMenu = ['AND', 'OR', 'NOT'];

    /**
     * Advanced Search-As-You-Type Configuration - inline key autocompletion via tab key, implicit logical operator, no enter key tokenization, etc
     */
     var autocompleteSearchConf = {
        allowPartialTokens: true,
        tokenizeOnEnter: false,
        
        afterPartialTagUpdated: function() {
            console.log("partial token updated");
        },

        autocomplete: {
            inline: true
        },
        implicitLogicOperator: true,
        keyTokens: {
            // maxNumber: 1,
            position: "any"
        }
    };
        
    autocompleteSearchConf.filterMenu = {
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

    autocompleteSearchConf.logicMenu = ['AND'];

    autocompleteSearchConf.operators = [];

    return {
        searchConf: searchConf,
        autocompleteSearchConf: autocompleteSearchConf
    };
});
