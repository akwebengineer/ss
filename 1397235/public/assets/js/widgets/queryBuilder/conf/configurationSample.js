/**
 * A sample configuration object that shows the parameters required to build a QueryBuilder widget
 *
 * @module configurationSample
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([], function () {
    /**
     * Advanced QueryBuilder Configuration - suggestion cards, explicit logical operators etc.
     */

    var getRemoteValue = function (currentToken, showSuggestion) {
        $.ajax({
            url: '/api/queryBuilder/getRemoteData',
            type: "GET",
            data: {query: currentToken},
            success: function (response) {
                showSuggestion(response);
            }
        });
    };

    var searchConf = {
        logicMenu: ['and', 'or', 'NOT'],
        filterMenu: {
            'OSVersionKey': {
                'label': 'OSVersion',
                'value': ['12.1', '12.2', '12.3', '12.4', '13.1', '13.2'],
                'operators': ['=', '!=', '<', '>', '<=', '>=']
            },
            'DeviceFamilyKey': {
                'label': 'DeviceFamily',
                'value': ['SRX', 'MX', 'EX']
            },
            'PlatformKey': {
                'label': 'Platform',
                'value': ['srx650', 'srx5800', 'mx2020', 'ex2200']
            },
            'ManagedStatusKey': {
                'label': 'Managed Status', //Example to show 'space' permitted in label as valid
                'value': ['In Sync', 'Out of Sync', 'Connecting']
            },
            'applicationServicesKey': {
                'label': 'application-services', //Example to show 'hyphen' permitted in label as valid
                'value': ['IDP', 'UTM', 'AppFW']
            },
            'ConnectionStatusKey': {
                'label': 'ConnectionStatus',
                'value': ['Down', 'Up']
            },
            'NameKey': {
                'label': 'Name',
                'value': [],
                'operators': ['=', '!=']
            },
            'IPAddressKey': {
                'label': 'IPAddress'
            }
        }
    };

    var searchConfForAutoComplete = {
        logicMenu: ['AND', 'OR', 'NOT'],
        filterMenu: {
            'OSVersionKey': {
                'label': 'OSVersion',
                'value': ['12.1', '12.2', '12.3', '12.4', '13.1', '13.2', "14.1"],
                'operators': ['=', '!=', '<', '>', '<=', '>=']
            },
            'DeviceFamilyKey': {
                'label': 'DeviceFamily',
                'value': ['SRX', 'MX', 'EX'],
                'operators': ['=', '!=']
            },
            'DeviceConfiguredKey': {
                'label': 'DeviceConfigured',
                'value': ['SRX', 'MX', 'EX'],
                'operators': ['=', '!=']
            },
            'applicationServicesKey': {
                'label': 'application-services', //Example to show 'hyphen' permitted in label as valid
                'value': ['IDP', 'UTM', 'AppFW'],
                'operators': ['<', '<=']
            },
            'PlatformKey': {
                'label': 'Platform',
                'value': ['srx650', 'srx5800', 'mx2020', 'ex2200']
            },
            'ManagedStatusKey': {
                'label': 'Managed Status',
                'value': ['Synced', 'Connecting']
            },
            'ConnectionStatusKey': {
                'label': 'ConnectionStatus',
                'value': ['Down', 'Up']
            },
            'NameKey': {
                'label': 'Name',
                'value': [],
                'operators': ['=', '!=']
            },
            'IPAddressKey': {
                'label': 'IPAddress'
            }
        }
    };

    var searchConfForAutoCompleteAjax = {
        logicMenu: ['AND', 'OR', 'NOT'],
        filterMenu: {
            'OSVersionKey': {
                'label': 'OSVersion',
                'value': ['12.1', '12.2', '12.3', '12.4', '13.1', '13.2'],
                'operators': ['=', '!=', '<', '>', '<=', '>='],
                'remoteValue': getRemoteValue
            },
            'DeviceFamilyKey': {
                'label': 'DeviceFamily',
                'value': ['SRX', 'MX', 'EX'],
                'operators': ['=', '!='],
                'remoteValue': getRemoteValue
            },
            'PlatformKey': {
                'label': 'Platform',
                'value': ['srx650', 'srx5800', 'mx2020', 'ex2200'],
                'remoteValue': getRemoteValue
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
                'value': []
            },
            'IPAddressKey': {
                'label': 'IPAddress'
            }
        }
    };

    var conf = {
        'searchConf': searchConf,
        'searchConfForAutoComplete': searchConfForAutoComplete,
        'searchConfForAutoCompleteAjax': searchConfForAutoCompleteAjax
    }
    return conf;
});