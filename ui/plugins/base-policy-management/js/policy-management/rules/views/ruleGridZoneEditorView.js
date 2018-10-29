/**
 * Zone editor view that will be used for selecting the Source and Destination zones for zone and global rules
 *
 * @module ZoneEditorView
 * @author Mamata <mamatad@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */


define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/dropDown/dropDownWidget',
     './baseCellEditorView.js',
    '../conf/zoneEditorFormConfiguration.js',
    '../util/ruleGridConstants.js'
],function(Backbone, FormWidget, DropDownWidget, BaseCellEditor, ZoneFormConfiguration, RuleGridConstants){

    var ZoneEditorView = BaseCellEditor.extend({

        events: {
            'click #btnZoneOk': 'updateModelData',
            'click #linkCancel': 'closeOverlay'
        },

        initialize: function(){
            this.context = this.options.context;
            this.model = this.options.model;

            this.formConfiguration = new ZoneFormConfiguration(this.context).getConfig();

            this.formConfiguration.title = this.getTitle();
            this.formConfiguration.heading_text = this.getHeadingText();
            this.formConfiguration['title-help'] = this.getTitleHelp();

        },
        getTitleHelp : function(){
            return {
                    "content": this.context.getMessage("ruleGrid_add_zone"),
                    "ua-help-identifier": "alias_for_title_zones"
                };
        },
        render :function(){
            var self = this, rule = this.model;
            this.form = new FormWidget({
                "elements": self.formConfiguration,
                "container": self.el
            });

            this.form.build();
            this.$el.addClass('security-management');
            var alertBox = $(this.form.formTemplateHtml.find('form')).find('.alert-box');
            var errorMsg = this.context.getMessage("ruleGrid_no_zone_error");
            var warningBox = $("<div id='warningBox' class='warning-box alert-box warning'><div style='padding-left:20px;'>"+errorMsg+"</div></div>");
            warningBox.insertAfter($(alertBox));
            
            var zoneEditor = this.$el.find('#zone_editor').parent();
            $(zoneEditor).empty();
            var $span =  $(zoneEditor).append('<select class="zoneeditor"  style="width: 100%"></select>');
            var widgetConf = {
                "container": $span.find('.zoneeditor'),
                "data": [],
                "templateResult": self.templateResult,
                //"templateSelection": self.templateSelectionResult,
                "enableSearch": true
            };

            if (rule.get('global-rule') === true) {
                widgetConf.multipleSelection = { allowClearSelection: true };
            }
            

            widgetConf.placeholder = "Select an option";
            this.zoneDropDown = new DropDownWidget(widgetConf).build();

            this.loadZones();
            return this;
        },

        showNoZoneErrorMsg : function() {
            var warningBox = this.$el.find("#warningBox");
            warningBox.show();
        },

        templateSelectionResult: function(data) {
            // var $zone_name = $(data['name']);
            // return $zone_name;
            var zone_name = data.name;  //data['name'];
            console.log(zone_name);
            return zone_name;
        },

        templateResult: function(data) {
            var imageDir = '/installed_plugins/base-policy-management/images/';
            var zone_type = data.type;   // data['zone-type'];
            var zone_name = data.text;   // data['name'];
            var $new_zone = $("<span>" + zone_name + "</span>");
            if (zone_type) {                      
                var img = "";
                if (zone_type == 'ZONESET') {  
                    img = '<img width="14px" height="14px" src="' + imageDir + 'icon_zone_set.svg" />';
                } else if (zone_type == 'ZONE') { 
                    img = '<img width="14px" height="14px" src="' + imageDir + 'icon_zone.svg" />';
                } else if (zone_type == 'POLYMORPHIC') { 
                    img = '<img width="14px" height="14px" src="' + imageDir + 'icon_zone_variable.svg" />';
                }
                $new_zone = $('<div>' + img + '&nbsp&nbsp&nbsp' + zone_name + '</div>');
            }

            return $new_zone;
        },

        loadZones: function () {
            var self = this,zoneNamesArr = [];
            var zonesData = [],
                zonesSelected = [];

            self.zonesCollection.setGlobalRule(self.model.get('global-rule'));

            self.zonesCollection.fetch({
                success :function(collection, response, options){
                    var zoneEditor = self.zoneDropDown;

                    //get zones from model
                    var zonesArr = [];
                    //needed because when there is one zone backend does not return array
                    if (self.getZones() && !$.isArray(self.getZones())) {
                        zonesArr.push(self.getZones());
                    }else{
                        zonesArr = self.getZones()
                    }

                    if (zonesArr && $.isArray(zonesArr)) {
                        zonesArr.forEach(function (zone) {
                            zoneNamesArr.push(zone.name);
                            zonesSelected.push(zone);
                        });
                    }
                    // append the rest of the zones from backend on to the option list for zones
                    var zones = response.Zones.zone,
                        selectData = [];
                    if(zones.length === 0){
                        //if (zoneNamesArr.length !== 0) {
                        if (zonesSelected.length !== 0) {
                            //zoneNamesArr.forEach(function (zone){
                            zonesSelected.forEach(function (zone){
                                //selectData.push({id:zone,text:zone});
                                selectData.push({id:zone.name,text:zone.name,type:zone["zone-type"]});
                                //zonesData.push(zone);
                            });
                        }
                        self.showNoZoneErrorMsg();
                    }else{
                        for (var i=0; i < zones.length; i++) {
                            var zone = zones[i].name;
                            var zone_type = zones[i]["zone-type"];
                            //selectData.push({id:zone,text:zone});
                            selectData.push({id:zone,text:zone,type:zone_type});
                            //zonesData.push(zones[i]);
                        }
                    }
                    zoneEditor.addData(selectData);
                    zoneEditor.setValue(zoneNamesArr);
                    //zoneEditor.addData(zonesData);
                    //zoneEditor.setValue(zonesSelected);
                },
                error: function() {
                    console.log('zone collection not fetched');
                }
            });
        },

        updateModelData : function(e) {
            var self = this;
            var selectedZones = this.zoneDropDown.getValue();
            var zonesArr = [];
            if(selectedZones != null){
                if(!$.isArray(selectedZones)){
                  selectedZones = [selectedZones];
                }
                selectedZones.forEach(function (zone){
                    var zoneObj;
                    if(self.zonesCollection.findWhere({name: zone})){
                        zoneObj = self.zonesCollection.findWhere({name: zone}).toJSON().zone;
                    }else{
                        zoneObj = {"name":zone, "zone-type": "ZONE"};
                    }
                    zonesArr.push(zoneObj);
                });
            }

            this.setZones(zonesArr);
            this.editCompleted(e,this.model);
        },

        setCellViewValues: function (rowData) {
            // to get the values from the grid cell in this view
            this.model = this.options.ruleCollection.get(rowData.originalRowData[RuleGridConstants.JSON_ID]);
        }

    });
    return ZoneEditorView;

});