/**
 * Port editor view that extends from base cellEditor & is used to select portsets & add new port for Source & Destination editors
 *
 * @module  DestinationPortSetsEditorView
 * @author Damodhar M <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    './ruleGridPortSetsEditorView.js'
], function (PortSetsEditorView) {
    var DestinationPortSetsEditorView = PortSetsEditorView.extend({
        initialize: function () {
           this.options.columnName == 'destination-ports.destination-port';
            PortSetsEditorView.prototype.initialize.apply(this);
        },

        getPorts :function(){
            return this.model.get("original-packet")["dst-ports"];
        },

        setPorts :function(ports){
            var _originalPacket = _.omit(this.model.get("original-packet"));
            _originalPacket["dst-ports"] =  ports;
            this.model.set("original-packet" , _originalPacket);
        },

        getPortSets :function(){
            if(this.model.get("original-packet")["dst-port-sets"])
                return this.model.get("original-packet")["dst-port-sets"]["reference"];
            return null;
        },

        setPortSets :function(portsArr){
            var _originalPacket = _.omit(this.model.get("original-packet"));
            _originalPacket["dst-port-sets"] = {
               "reference" : portsArr
            };
            this.model.set("original-packet" , _originalPacket);
        },

        updateFormValuesForEditor : function() {
            if(this.model.get('nat-type') == "STATIC") {
                this.hideListBuilder(true);
                this.$el.find('#natrules-ports').attr('data-pattern', "^[0-9\-]+$");
                this.$el.find('#natrules-ports').siblings('.inline-help').show().text(this.context.getMessage('nat_rules_editor_dstports_help'));
            }
            PortSetsEditorView.prototype.updateFormValuesForEditor.apply(this);
        },
        isValidStaticPort: function(val) {
            if(!val) {
                return true;
            }
            if(val.indexOf("-") > 0) {
                var port = val.split("-");
                if(port.length !== 2) {
                    return false;
                }
                if(parseInt(port[0], 10) > parseInt(port[1], 10)) {
                    return false;
                }
                if((port[0] >=0 && port[0]<=65535) && (port[1] >= 0 && port[1] <=65535)) {
                    return true;
                }
            }
            else {
                if(val >=0 && val <= 65535) {
                    return true;
                }
            }
            return false;
        },
        validatePorts: function(id) {
             if(this.model.get('nat-type') == "STATIC") {

                // Validating ports for STATIC rule
                var comp = this.$el.find('#'+id);
                var errMsg = this.context.getMessage('nat_rules_editor_dstports_error');

                if (comp.attr("data-invalid") === undefined) {             
                    if (!this.isValidStaticPort(comp.val())) {
                        this.showErrorMessage(id, errMsg);
                    }
                } else {
                    this.showErrorMessage(id, errMsg);
                }
             }
             else {
                PortSetsEditorView.prototype.validatePorts.apply(this,[id]);
             }   
        },

        getTitle:function(){
            return this.context.getMessage('nat_rules_editor_destinationPort_title');
        },

        getHeadingText :function(){
            return this.context.getMessage('nat_rules_editor_destinationPort_description');
        }
    });

    return DestinationPortSetsEditorView;
});
