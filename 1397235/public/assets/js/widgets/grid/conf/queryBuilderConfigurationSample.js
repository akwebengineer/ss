/**
 * A sample configuration object that shows the parameters required to build advance search with queryBuilder Widget
 *
 * @module queryBuilderConfigurationSample
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define([
], function () {


    var modelGridSearchConf = {};

    modelGridSearchConf.filterMenu = {
        'quickFilterKey': {
            'label':'quickFilter',
            'value':['juniper','nonJuniper'],
            'operators': ['=']
        },
        'nameKey': {
            'label':'Name'
        },
        'sourceAddressKey': {
            'label':'SourceAddress',
            'value':['any','Sircon_Group','IP_DPW_10.10.10.10'],
            'operators': ['=']
        },
        'conditionKey': {
            'label':'Condition',
            'value':['Condition_001','Condition_002','Condition_003'],
            'operators': ['=']
        },
        'destinationAddressKey': {
            'label':'DestinationAddress',
            'value':['IP_LOT_10.10.10.10','IP_INS_1.1.1.1']
        },
        'descriptionKey': {
            'label':'description'
        },
    };

    modelGridSearchConf.logicMenu = ['AND','OR','NOT'];


    return {
        "modelGridSearchConf" : modelGridSearchConf
    };

});