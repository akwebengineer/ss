/**
 * Destination Zone editor view that extends from base ruleGridZoneEditorView & is used to select destination zone
 *
 * @module DestinationZoneEditorView
 * @author Mamata <mamatad@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../base-policy-management/js/policy-management/rules/views/ruleGridZoneEditorView.js',
    '../constants/fwRuleGridConstants.js',
    '../../../../../base-policy-management/js/policy-management/rules/models/zonesCollection.js'
], function (ZoneEditorView, PolicyManagementConstants, ZonesCollection) {
    var DestinationZoneEditorView = ZoneEditorView.extend({
        initialize: function () {
            this.options.columnName == 'destination-zone.zone';
            this.zonesCollection = new ZonesCollection({
                urlRoot: PolicyManagementConstants.POLICY_URL + this.options.policyObj.id + "/zones",
                acceptHeader: PolicyManagementConstants.RULE_ACCEPT_HEADER
                });
            ZoneEditorView.prototype.initialize.apply(this);
        },

        getZones :function(){
            if(this.model.get("destination-zone")){
                return this.model.get("destination-zone")["zone"];
            }
            return "";
        },

        setZones :function(zonesArr){
            this.model.set( {
                "destination-zone" : {"zone": zonesArr}
            });
        },

        getTitle:function(){
            return this.context.getMessage("rulesGrid_column_destinationZone") + " " + this.context.getMessage("ruleGrid_editor");
        },

        getHeadingText :function(){
            return this.context.getMessage('ruleGrid_destination_zone_desc');
        }
    });

    return DestinationZoneEditorView;
});
