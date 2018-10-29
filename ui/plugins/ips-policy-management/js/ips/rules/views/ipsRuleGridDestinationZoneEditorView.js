/**
 * Destination Zone editor view that extends from base ruleGridZoneEditorView & is used to select destination zone
 *
 * @module DestinationZoneEditorView
 * @author Mamata <mamatad@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../base-policy-management/js/policy-management/rules/views/ruleGridZoneEditorView.js',
    '../constants/ipsRuleGridConstants.js',
    '../../../../../base-policy-management/js/policy-management/rules/models/zonesCollection.js'
], function (ZoneEditorView, PolicyManagementConstants, ZonesCollection) {
    var DestinationZoneEditorView = ZoneEditorView.extend({
        initialize: function () {
            this.options.columnName == 'destination-zone';
            this.zonesCollection = new ZonesCollection({
                urlRoot: PolicyManagementConstants.POLICY_URL + this.options.policyObj.id + "/zones",
                acceptHeader: PolicyManagementConstants.RULE_ACCEPT_HEADER
                });
            ZoneEditorView.prototype.initialize.apply(this);
        },

        getZones :function(){
            if(this.model.get("destination-zone")){
                return this.model.get("destination-zone");
            }
            return "";
        },

        setZones :function(zonesArr){
            this.model.set( {
                "destination-zone" : zonesArr[0]
            });
        },

        getTitle:function(){
            return this.context.getMessage("rulesGrid_column_destinationZone") + " " + this.context.getMessage("ruleGrid_editor");
        },

        getHeadingText :function(){
            return "";
        },

        getTitleHelp : function(){
            return {
                    "content": this.context.getMessage("rulegrid_column_destzone_title_info_tip"),
                    "ua-help-text":this.context.getMessage("more_link"),
                    "ua-help-identifier": this.context.getHelpKey("IPS_POLICY_CREATING")
                };
        },

        loadZones: function () {
            var self = this,zoneName,zoneType;
            self.zonesCollection.setGlobalRule(self.model.get('global-rule'));
            self.zonesCollection.fetch({
                success :function(collection, response, options){
                    var zoneEditor = self.zoneDropDown;

                    //get zones from model
                    var currentZone;
                    //needed because when there is one zone backend does not return array
                    if (self.getZones()) {
                        currentZone = self.getZones();
                    }
                    if (currentZone) {
                        zoneName = currentZone.name;
                        zoneType = currentZone["zone-type"];
                    }
                    // append the rest of the zones from backend on to the option list for zones
                    var zones = response.Zones.zone,
                        selectData = [];
                    //We are not getting "any" zone from backend so adding "any" zone in dropdown data   
                    selectData.push({id:"Any",text:"Any",type:"ZONE"});
                    if(zones.length === 0){
                         if(zoneName && zoneName != 'Any'){
                            selectData.push({id:zonneName,text:zoneName,type:zoneType});
                         } else {
                            if (zoneName == undefined) {
                                selectData.push({id:"",text:"",type:zoneType});
                            }
                         }                        
                    }else{
                        for (var i=0; i < zones.length; i++) {
                            var zone = zones[i].name;
                            var zone_type = zones[i]["zone-type"];
                            if (zone != undefined)
                                selectData.push({id:zone,text:zone,type:zone_type});
                        }
                    }
                    zoneEditor.addData(selectData);
                    zoneEditor.setValue(zoneName);
                },
                error: function() {
                    console.log('zone collection not fetched');
                }
            });
        }
    });

    return DestinationZoneEditorView;
});
