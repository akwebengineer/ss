/**
 * Source Ingress editor view extends from PacketEditorView
 * @module SourceIngressEditorView
 * @author Swathi Nagaraj<swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    './ruleGridPacketEditorView.js'
], function (PacketEditorView) {
    var SourceIngressEditorView = PacketEditorView.extend({
        initialize: function () {
            this.options.columnName == 'original-packet.src-traffic-match-type';
           // this.addressSelection = false;
            PacketEditorView.prototype.initialize.apply(this);
        },

        getTrafficMatchType : function() {
            return this.model.get("original-packet")["src-traffic-match-type"];
        },
        getTrafficMatchValues : function() {
            if(this.model.get("original-packet")["src-traffic-match-value"])
                return this.model.get("original-packet")["src-traffic-match-value"]["src-traffic-match-value"];
            return null;
        },

        getZoneSets : function() {
            if(this.model.get("original-packet")["src-zone-sets"])
                return this.model.get("original-packet")["src-zone-sets"]["reference"];
            return null;
        },

        setTrafficMatchType : function(value) {
            var _originalPacket = _.omit(this.model.get("original-packet"));
            _originalPacket["src-traffic-match-type"] = value;
            this.model.set("original-packet" , _originalPacket);
        },

        setTrafficMatchValues : function(valueArr) {
            var _originalPacket = _.omit(this.model.get("original-packet"));
            _originalPacket["src-traffic-match-value"] =  {
              "src-traffic-match-value" : valueArr
            };
            this.model.set("original-packet" , _originalPacket);
        },

        setZoneSets : function(valueArr) {
            var _originalPacket = _.omit(this.model.get("original-packet"));
            _originalPacket["src-zone-sets"] =  {
              "reference" : valueArr
            };
            this.model.set("original-packet" , _originalPacket);
        },

        getExcluded : function(){
        },

        setExcluded :function(flag){
           
        },

        getTitle:function(){
            return this.context.getMessage('nat_rulesgrid_editor_ingress_title');
        },
        getPacketTypeLabel : function() {
            return this.context.getMessage('nat_rulesgrid_editor_ingress_type_label');
        }

        /*getHeadingText :function(){
            return this.context.getMessage('fw_rules_editor_sourceAddress_description');
        }*/
    });

    return SourceIngressEditorView;
});
