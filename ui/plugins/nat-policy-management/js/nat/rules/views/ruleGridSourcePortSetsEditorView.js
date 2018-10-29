/**
 * Port editor view that extends from base cellEditor & is used to select port & add new port for Source & Destination editors
 *
 * @module SourcePortSetsEditorView
 * @author Damodhar M <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    './ruleGridPortSetsEditorView.js'
], function (PortSetsEditorView) {
    var SourcePortSetsEditorView = PortSetsEditorView.extend({
        initialize: function () {
           this.options.columnName == 'original-packet.src-ports';

            PortSetsEditorView.prototype.initialize.apply(this);
        },

        getPortSets :function(){
            if(this.model.get("original-packet")["src-port-sets"])
                return this.model.get("original-packet")["src-port-sets"]["reference"];
            return null;
        },

        setPortSets :function(portsArr){
            var _originalPacket = _.omit(this.model.get("original-packet"));
            _originalPacket['src-port-sets'] = {
               "reference" : portsArr
            };
            this.model.set("original-packet" , _originalPacket);
        },

        getPorts : function() {
            return this.model.get("original-packet")["src-ports"];
        },

        setPorts : function(ports) {
            var _originalPacket = _.omit(this.model.get("original-packet"));
            _originalPacket['src-ports'] = ports;
            this.model.set("original-packet" , _originalPacket);
        },

        getTitle:function(){
            return this.context.getMessage('nat_rules_editor_sourcePort_title');
        },

        getHeadingText :function(){
            return this.context.getMessage('nat_rules_editor_sourcePort_description');
        }
    });

    return SourcePortSetsEditorView;
});
