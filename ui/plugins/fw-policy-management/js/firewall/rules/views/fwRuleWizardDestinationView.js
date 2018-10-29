/*Used for firewall rule create wizard*/
define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget',
    'widgets/dropDown/dropDownWidget',
    '../constants/fwRuleGridConstants.js',
    '../../../../../base-policy-management/js/policy-management/rules/models/zonesCollection.js',
    '../conf/fwRuleWizardDestinationConfig.js',
    './fwRuleWizardDestinationAddressEditorView.js',
    './fwRuleWizardServiceEditorView.js'
    ],function(Backbone, FormWidget, OverlayWidget, DropDownWidget, PolicyManagementConstants, ZonesCollection, FirewallRuleDestinationConf, FirewallRuleAddressEditorView, FirewallRuleServiceEditorView){
        var FirewallRuleDestinationView = Backbone.View.extend({
            events:{
                 "click #destn_address_overlay": "showAddressOverlay",
                 "click #service_overlay": "showServicesOverlay"
            },

            initialize: function(){
                this.context = this.options.context;
                this.policyObj = this.options.policyObj;
                this.model = this.options.model;
                this.zonesCollection = new ZonesCollection({
                    urlRoot: PolicyManagementConstants.POLICY_URL + this.policyObj.id + "/zones",
                    acceptHeader: PolicyManagementConstants.RULE_ACCEPT_HEADER
                    });
                this.formConfiguration = new FirewallRuleDestinationConf(this.context);

                this.model.on('change', this.setDefaultFormValues, this);

            },
            actionDropdownOnChange: function(){
                
                var self =this, value = self.destinationZoneDropdown.getValue(),  zone, zonesArr = [], selectedZones =[];
                if(value){
                    zonesArr = self.destinationZoneDropdown.getValue();
                    if(zonesArr.length > 0)
                    {
                        
                        zonesArr.forEach(function(zoneName){
                            zone = self.zonesCollection.findWhere({name: zoneName}).toJSON().zone;
                            selectedZones.push(zone);
                        });
                    }
                }
                self.model.set({"destination-zone" : {"zone" : selectedZones}});
            },
            render: function(){
                var self = this;
                this.form = new FormWidget({
                    "elements": self.formConfiguration.getElements(),
                    "container": this.el
                });
                this.form.build();
                var destinationZoneEditor = self.$el.find('#wizard-destn-zone').parent();
                $(destinationZoneEditor).empty();
                var $span =  $(destinationZoneEditor).append('<select class="ruledestinationzone" style="width: 100%"></select>');
                self.destinationZoneDropdown = new DropDownWidget({
                  "container": $span.find('.ruledestinationzone'),
                  "data": [],
                  "enableSearch": true,
                  "multipleSelection": {
                    allowClearSelection: true
                  },
                  "onChange": $.proxy(self.actionDropdownOnChange, self)
                }).build();
                this.getZones();

                this.$el.addClass("security-management");

                var destinationTextElem = this.$el.find("#wizard-destn-address");
                $(destinationTextElem).append("<div class=formatable-text-div id=wizard-destn-address-txt></div>");

                var serviceTextElem = this.$el.find("#wizard-service");
                $(serviceTextElem).append("<div class=formatable-text-div id=wizard-service-txt></div>");

                this.setDefaultFormValues();

                return this;
            },

            setDefaultFormValues : function(){
                    this.updateAddressValuesOnView();
                    this.updateServiceValuesOnView();
            },

            getZones : function () {
                console.log("get zones triggered");

                var self = this;

                //Get all zones and zone sets for wizard
                self.zonesCollection.setGlobalRule(true);

                self.zonesCollection.fetch({
                    success :function(collection, response, options){

                        var zones = response.Zones.zone,  selectData = [], zoneNamesArr=[],
                            zoneSetCount=0,
                            zonesArr = self.model.get("destination-zone")["zone"];

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
                            var originalZones = self.model.get("original-dest-zones");
                            self.zonesCollection.add(originalZones);
                            if (_.isArray(originalZones)) {
                                originalZones.forEach(function (zone){
                                    if (zone["zone-type"] !== "ZONESET") {
                                        selectData.push({id:zone.name, text:zone.name});
                                    }
                                });
                            }
                        }
                        self.destinationZoneDropdown.addData(selectData);
                        self.destinationZoneDropdown.setValue(zoneNamesArr);
                    },
                    error: function() {
                        console.log('zone collection not fetched');
                    }
                });
            },

            showAddressOverlay : function(){
                console.log("Address launching");
                var destinationAddressEditorView = new FirewallRuleAddressEditorView({
                    'policyObj': this.policyObj,
                    'save': _.bind(this.updateAddressValuesOnView, this),
                    'close': _.bind(this.closeAddressOverlay, this),
                    'context': this.context,
                    'columnName': 'destination-address.addresses.address-reference',
                    "isWizard": true,
                    "model" : this.model
                });
                this.addressOverlay = new OverlayWidget({
                    view: destinationAddressEditorView,
                    type: 'large',
                    showScrollbar: true
                });

                this.addressOverlay.build();
            },

            updateAddressValuesOnView : function(){
                var destinationText = this.$el.find("#wizard-destn-address-txt");

                var listStr = "",
                    list = {};

                if (this.model.get("destination-address")) {
                    list = this.model.get("destination-address")["addresses"]["address-reference"];
                }

                if (list.length){
                    for (var i=0; i<list.length; i++) {
                        listStr += list[i].name + "\n";
                    }
                } else {
                    listStr = list.name;
                }

                $(destinationText).text(listStr);
                $(destinationText).removeClass('lineThrough');
                if (this.model.get("destination-address")["exclude-list"] === true) {
                   $(destinationText).addClass('lineThrough');
                }
            },

            closeAddressOverlay : function (columnName, e) {
                this.addressOverlay.destroy();
                e && e.preventDefault();
            },

            showServicesOverlay : function(){
                console.log("Services launching");
                var serviceEditorView = new FirewallRuleServiceEditorView({
                    'policyObj': this.policyObj,
                    'save': _.bind(this.updateServiceValuesOnView, this),
                    'close': _.bind(this.closeServiceOverlay, this),
                    'context': this.context,
                    'columnName': 'services.service-reference',
                    "isWizard": true,
                    "model" : this.model
                });
                this.serviceOverlay = new OverlayWidget({
                  view: serviceEditorView,
                  type: 'large',
                  showScrollbar: true
                });

                this.serviceOverlay.build();
            },

            updateServiceValuesOnView : function(){
                var serviceText = this.$el.find("#wizard-service-txt");

                var listStr = "",list;
                if(this.model.get("services")){
                    list = this.model.get("services")["service-reference"];
                }
                if(list !== undefined){
                    if (list.length){
                        for (var i=0; i<list.length; i++) {
                            listStr += list[i].name + "\n";
                        }
                    } else{
                        listStr = list.name;
                    }
                }
                $(serviceText).text(listStr);

            },

            closeServiceOverlay : function (columnName, e) {
                this.serviceOverlay.destroy();
                e && e.preventDefault();
            },

            getSummary: function() {
                var summary = [];
                var self = this;

                summary.push({
                    label: self.context.getMessage('identify_traffic_dest'),
                    value: ' '
                });

                //Zone
                var list = this.model.get("destination-zone")["zone"],
                    listStr = "";
                
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

                //Address
                var addrListStr = "",
                    addrList = this.model.get("destination-address")["addresses"]["address-reference"];

                if (this.model.get("destination-address")["exclude-list"]) {
                    addrListStr = self.context.getMessage('exclude')+" ";
                }
                
                if (addrList.length) {
                    addrListStr += addrList[0]["name"];
                    if (addrList.length > 1) {
                        addrListStr += " <span>(+" + (addrList.length-1) + ")</span>";
                    }
                } else {
                    addrListStr += addrList["name"];
                }

                summary.push({
                        label: self.context.getMessage('address'),
                        value: addrListStr
                });

                var serviceListStr = "",serviceList;

                if(this.model.get("services")){
                    serviceList = this.model.get("services")["service-reference"];

                    if (serviceList.length) {
                        serviceListStr += serviceList[0]["name"];
                        if (serviceList.length > 1) {
                            serviceListStr += " <span>(+" + (serviceList.length-1) + ")</span>";
                        }
                    } else{
                        serviceListStr = serviceList.name;
                    }
                }


                summary.push({
                        label: self.context.getMessage('service'),
                        value: serviceListStr
                });
            
                return summary;
            },

            getTitle: function () {
                return this.context.getMessage('fw_rule_wizard_address_message');
            }

        });
        return FirewallRuleDestinationView;

    });