/*Used for firewall rule create wizard*/
define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget',
    'widgets/dropDown/dropDownWidget',
    '../constants/fwRuleGridConstants.js',
    '../../../../../base-policy-management/js/policy-management/rules/models/zonesCollection.js',
    '../conf/fwRuleWizardSourceConfig.js',
    './fwRuleWizardSourceAddressEditorView.js',
    './fwRuleWizardSourceIdentityView.js'
    ],function(Backbone, FormWidget, OverlayWidget, DropDownWidget, PolicyManagementConstants, ZonesCollection, FirewallRuleSourceConf,
        SourceAddressEditorView, SourceIdentityView) {

        var FirewallRuleAddressView = Backbone.View.extend({
            events:{
                 "click #src_address_overlay": "showAddressOverlay",
                 "click #source_identity_overlay": "showSourceIdentityOverlay"
            },

            initialize: function(){
                var me = this;
                this.context = this.options.context;
                this.policyObj = this.options.policyObj;
                this.zonesCollection = new ZonesCollection({
                    urlRoot: PolicyManagementConstants.POLICY_URL + this.policyObj.id + "/zones",
                    acceptHeader: PolicyManagementConstants.RULE_ACCEPT_HEADER
                    });
                this.formConfiguration = new FirewallRuleSourceConf(this.context);

                this.model.on('change', function() {
                    me.setDefaultFormValues();
                });

            },
            actionDropdownOnChange: function(){
                var self = this, value = self.sourceZoneDropdown.getValue(), zone, zonesArr = [], selectedZones =[];
                if(value){
                    zonesArr = self.sourceZoneDropdown.getValue();
                    if (zonesArr.length > 0) {
                        zonesArr.forEach(function(zoneName){
                            zone = self.zonesCollection.findWhere({name: zoneName}).toJSON().zone;
                            selectedZones.push(zone);
                        });
                    }
                }
                self.model.set({"source-zone" : {"zone" : selectedZones}});
            },

            render: function(){
                var self = this;
                console.log(self.model);
                this.form = new FormWidget({
                     "elements": self.formConfiguration.getElements(),
                     "container": this.el
                });
                this.form.build();
                var sourceZoneEditor = self.$el.find('#wizard-src-zone').parent();
                $(sourceZoneEditor).empty();
                var $span =  $(sourceZoneEditor).append('<select class="rulesourcezone" style="width: 100%"></select>');
                self.sourceZoneDropdown = new DropDownWidget({
                    "container": $span.find('.rulesourcezone'),
                    "data": [],
                    "enableSearch": true,
                    "multipleSelection": {
                        allowClearSelection: true
                    },

                    "onChange": $.proxy(self.actionDropdownOnChange, self)
                }).build();

                this.getZones();

                this.$el.addClass("security-management");

                var sourceTextElem = this.$el.find("#wizard-src-address");
                $(sourceTextElem).append("<div class=formatable-text-div id=wizard-src-address-txt></div>");

                var sourceIdentityElem = this.$el.find("#wizard-src-identity");
                $(sourceIdentityElem).append("<div class=formatable-text-div id=wizard-src-identity-txt></div>");

                this.setDefaultFormValues();

                return this;
            },

            setDefaultFormValues : function(){
                this.updateAddressValuesOnView();
                this.updateSourceIdentityOnView();
            },

            getZones : function () {

                var self = this;

                //Get all zones and zone sets for wizard
                self.zonesCollection.setGlobalRule(true);

                self.zonesCollection.fetch({
                    success : function(collection, response, options){
                        var zones = response.Zones.zone, selectData = [], zoneNamesArr=[], 
                            zoneSetCount=0,
                            zonesArr = self.model.get("source-zone")["zone"];

                        if (_.isArray(zonesArr)) {
                            zonesArr.forEach(function (zone){
                                zoneNamesArr.push(zone.name);
                            });
                        }

                        if (zones.length !== 0) {
                            for (var i=0; i < zones.length; i++) {
                                var zoneName = zones[i].name;
                                selectData.push({id:zoneName, text:zoneName});
                                if (zones[i]["zone-type"] === "ZONESET") {
                                    zoneSetCount++;
                                }
                            }
                        }

                        //For a policy that doesn't have devices assigned to it, backend returns some default zone
                        if (zoneSetCount === zones.length) {
                            var originalZones = self.model.get("original-source-zones");
                            self.zonesCollection.add(originalZones);
                            if (_.isArray(originalZones)) {
                                originalZones.forEach(function (zone){
                                    if (zone["zone-type"] !== "ZONESET") {
                                        selectData.push({id:zone.name, text:zone.name});
                                    }
                                });
                            }
                        }
                        self.sourceZoneDropdown.addData(selectData);
                        self.sourceZoneDropdown.setValue(zoneNamesArr);
                    },
                    error: function() {
                        console.log('Zone collection not fetched');
                    }
                });
            },

            showAddressOverlay : function(){
 
                var sourceAddressEditorView = new SourceAddressEditorView({
                    'policyObj': this.policyObj,
                    'save': _.bind(this.updateAddressValuesOnView, this),
                    'close': _.bind(this.closeAddressOverlay, this),
                    'context': this.context,
                    'columnName': 'source-address.addresses.address-reference',
                    "model" : this.model
                });
                this.addressOverlay = new OverlayWidget({
                    view: sourceAddressEditorView,
                    type: 'large',
                    showScrollbar: true
                });

                this.addressOverlay.build();
            },

            updateAddressValuesOnView : function(){

                var listStr = "",
                    list = {},
                    rule = this.model;
              if (rule.get("source-address")) {
                    list = rule.get("source-address")["addresses"]["address-reference"];
                }

                if (list.length){
                    for (var i=0; i<list.length; i++) {
                     listStr += list[i].name + "\n";
                    }
                } else{
                    listStr = list.name;
                }


                var sourceText = this.$el.find("#wizard-src-address-txt");
                $(sourceText).text(listStr);
                $(sourceText).removeClass('lineThrough');

                if (rule.get("source-address")["exclude-list"] === true) {
                    $(sourceText).addClass('lineThrough');
                }
            },

            closeAddressOverlay : function (columnName, e) {
                this.addressOverlay.destroy();
                e && e.preventDefault();
            },

            showSourceIdentityOverlay : function() {

                var sourceIdentityView = new SourceIdentityView({
                    'policyObj': this.policyObj,
                    'save': _.bind(this.updateSourceIdentityOnView, this),
                    'close': _.bind(this.closeSourceIdentityOverlay, this),
                    'context': this.context,
                    "model" : this.model
                });
                this.sourceIdentityOverlay = new OverlayWidget({
                    view: sourceIdentityView,
                    type: 'large',
                    showScrollbar: true
                });

                this.sourceIdentityOverlay.build();
            },

            closeSourceIdentityOverlay : function (columnName, e) {
                this.sourceIdentityOverlay.destroy();
                e && e.preventDefault();
            },

            updateSourceIdentityOnView : function() {

                var listStr = "",
                    list = this.model.get("sourceidentities")["sourceidentity"];

                if (list) {
                    if (list.length) {
                        for (var i=0; i<list.length; i++) {
                            listStr += list[i] + "\n";
                        }
                    } else {
                        listStr = list.name;
                    }
                }

                var sourceText = this.$el.find("#wizard-src-identity-txt");
                $(sourceText).text(listStr);
                
            },

            getSummary: function() {
                var summary = [], listStr = "", list=[],
                    self = this;

                summary.push({
                    label: self.context.getMessage('identify_traffic_source'),
                    value: ' '
                });

                //Zone
                list = this.model.get("source-zone")["zone"];
                
                if (list) {
                    if (list.length >= 1) {
                        listStr += list[0].name;
                        if (list.length > 1) {
                            listStr += " <span>(+" + (list.length-1) + ")</span>";
                        } 
                    }
                }
                summary.push({
                        label: self.context.getMessage('zone'),
                        value: listStr
                });
               
                //Source Address
                listStr = "";
                list = this.model.get("source-address")["addresses"]["address-reference"];

                if (this.model.get("source-address")["exclude-list"]) {
                    listStr = self.context.getMessage('exclude')+" ";
                }
                
                if (list) {
                    if (list.length) {
                        listStr += list[0]["name"];
                        if (list.length > 1) {
                            listStr += " <span>(+" + (list.length-1) + ")</span>";
                        } 
                    } else {
                        listStr += list["name"];
                    }
                }

                summary.push({
                        label: self.context.getMessage('address'),
                        value: listStr
                });

                //Source Identity
                listStr = "";
                list = this.model.get("sourceidentities")["sourceidentity"];
                
                if (list) {
                    if (list.length >= 1) {
                        listStr += list[0];
                        if (list.length > 1) {
                            listStr += " <span>(+" + (list.length-1) + ")</span>";
                        } 
                    }
                }

                summary.push({
                        label: self.context.getMessage('source_identity'),
                        value: listStr
                });
            
                return summary;
            },

            getTitle: function () {
                return this.context.getMessage('fw_rule_wizard_address_message');
            }

        });
        return FirewallRuleAddressView;

    });
