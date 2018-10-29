/**
 * Source Address editor view that extends from base ruleGridAddressEditorView & is used to select address & add new address for Source
 *
 * @module SourceAddressEditorView
 * @author Ashish Vyawahare <avyaw@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    './ipsRuleGridAddressEditorView.js',
], function (AddressEditorView) {
    var SourceAddressEditorView = AddressEditorView.extend({
        initialize: function () {
           this.options.columnName == 'source-address.addresses.address-reference';

            AddressEditorView.prototype.initialize.apply(this);
        },

        getAddresses :function(){
            return this.model.get("source-address")["addresses"]["address-reference"];
        },

        setAddress :function(addressesArr, excluded){
            this.model.set( {
                "source-address" : {
                    "addresses": {
                        "address-reference": addressesArr
                    },
                    "exclude-list": excluded
                }
            });
        },

        getExcluded : function(){
            return this.model.get("source-address")["exclude-list"];
        },

        getTitle:function(){
            return this.context.getMessage('fw_rules_editor_sourceAddress_title');
        },

        getHeadingText :function(){
            return " ";
        },

        emptyAddressNotAllowed : function(){
            return false;
        },

        getAddressSelectionHelp: function() {
            return "rule_select_src_address_help";
        }
    });

    return SourceAddressEditorView;
});
