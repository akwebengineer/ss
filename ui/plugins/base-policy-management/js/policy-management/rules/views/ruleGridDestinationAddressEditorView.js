/**
 * Destination Address editor view that extends from base ruleGridAddressEditorView & is used to select address & add new address for Destination
 *
 * @module DestinationAddressEditorView
 * @author Mamata <mamatad@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    './ruleGridAddressEditorView.js'
], function (AddressEditorView) {
    var DestinationAddressEditorView = AddressEditorView.extend({
        initialize: function () {
           this.options.columnName == 'destination-address.addresses.address-reference';

            AddressEditorView.prototype.initialize.apply(this);
        },

        getAddresses :function(){
            return this.model.get("destination-address")["addresses"]["address-reference"];
        },

        setAddress :function(addressesArr, excluded){
            this.model.set({
                "destination-address" : {
                    "addresses": {
                        "address-reference": addressesArr
                    },
                    "exclude-list": excluded
                }
            });
        },

        getExcluded : function(){
            return this.model.get("destination-address")["exclude-list"];
        },

        getTitle:function(){
            return this.context.getMessage('fw_rules_editor_destinationAddress_title');
        },

        getHeadingText :function(){
            return this.context.getMessage('fw_rules_editor_destinationAddress_description');
        },

        getAddressSelectionHelp: function() {
            return "rule_select_dest_address_help";
        }
    });

    return DestinationAddressEditorView;
});
