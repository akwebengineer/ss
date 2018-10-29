/**
 * IPS Address editor view extends from ruleGridAddressEditorView
 * @module AddressEditorView
 * @author Ashish Vyawahare<avyaw@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../base-policy-management/js/policy-management/rules/views/ruleGridAddressEditorView.js',
    '../../../../../base-policy-management/js/policy-management/rules/models/urlFilters.js',
], function (AddressEditorView,URLFilters) {
    var IpsRuleGridAddressEditorView = AddressEditorView.extend({
        initialize: function () { 
            AddressEditorView.prototype.initialize.apply(this);
        },

        getExcludedTypes: function() {
            return ['ANY','DYNAMIC_ADDRESS_GROUP','POLYMORPHIC'];
         },

         getURLFilter: function(excluded) {
            var urlFilter = [];
            if (excluded) {
                urlFilter = URLFilters.addressExcludeFilterForDevicePolicy;
                
            } else {
                urlFilter = URLFilters.addressIncludeFilterForDevicePolicy;                
            }
            return urlFilter;
        }
    });

    return IpsRuleGridAddressEditorView;
});
