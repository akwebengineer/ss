/**
 * Source address editor view extends from AddressEditorView
 * @module AddressEditorView
 * @author Sandhya B<sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    './ruleGridAddressEditorView.js',
    '../conf/ruleGridAddressEditorFormConfiguration.js'
], function (AddressEditorView, AddressEditorFormConfiguration) {
    var SourceAddressEditorView = AddressEditorView.extend({
      
        getAddresses :function(){
            if(this.model.get('original-packet')['src-address'])
                return this.model.get('original-packet')['src-address']["address-reference"];
            return null;
        },

        setAddress :function(addressesArr){
            var _originalPacket = _.omit(this.model.get("original-packet"));
            _originalPacket["src-address"] = {
               "address-reference" : addressesArr
            };
            this.model.set("original-packet" , _originalPacket);
        },

        getTitle:function(){
            return this.context.getMessage('fw_rules_editor_sourceAddress_title');
        },

        getHeadingText :function(){
            return this.context.getMessage('fw_rules_editor_sourceAddress_description');
        },

        getAddressSelectionHelp: function() {
            return "rule_select_src_address_help";
        }
    });

    return SourceAddressEditorView;
});
