/**
 * Source Zone editor view that extends from base ruleGridZoneEditorView & is used to select source zone
 *
 * @module SourceZoneEditorView
 * @author Mamata <mamatad@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../base-policy-management/js/policy-management/rules/views/ruleGridZoneEditorView.js',
    '../constants/fwRuleGridConstants.js',
    '../../../../../base-policy-management/js/policy-management/rules/models/zonesCollection.js'
], function (ZoneEditorView, PolicyManagementConstants, ZonesCollection) {
    var SourceZoneEditorView = ZoneEditorView.extend({
        initialize: function () {            
            this.options.columnName == 'source-zone.zone';
             this.zonesCollection = new ZonesCollection({
                urlRoot: PolicyManagementConstants.POLICY_URL + this.options.policyObj.id + "/zones",
                acceptHeader: PolicyManagementConstants.RULE_ACCEPT_HEADER
                });
            ZoneEditorView.prototype.initialize.apply(this);

        },

        getZones :function(){
            if(this.model.get("source-zone")){
                return this.model.get("source-zone")["zone"];
            }
            return "";
        },

        setZones :function(zonesArr){
            this.model.set( {
                "source-zone" : {"zone": zonesArr}
            });
        },

        getTitle:function(){
            return this.context.getMessage("rulesGrid_column_sourceZone") + " " + this.context.getMessage("ruleGrid_editor");
        },

        getHeadingText :function(){
            return this.context.getMessage('ruleGrid_source_zone_desc');
        }
    });

    return SourceZoneEditorView;
});
