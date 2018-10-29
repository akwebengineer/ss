/**
 * Packet Source Ingress editor view that extends 
 * @module PacketIngressEditorView
 * @author Swathi Nagaraj <swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'widgets/form/formWidget',
    'backbone.syphon',
    '../../../../../base-policy-management/js/policy-management/rules/views/baseCellEditorView.js',
    '../conf/ruleGridPacketEditorConfiguration.js',
    '../../widgets/zoneSetListBuilder.js',
    '../../widgets/interfaceListBuilder.js',
    '../../widgets/virtualRouterListBuilder.js',
    '../constants/natRuleGridConstants.js'
], function (Backbone, FormWidget, Syphon, BaseGridCellEditor, PacketEditorConfiguration, ZoneSetListBuilder,
                InterfaceListBuilder,VirtualRouterListBuilder,PolicyManagementConstants) {
    
    var PacketIngressEgressEditorView = BaseGridCellEditor.extend({

        events: {
            'click #btnOk': 'updateModel',
            'click #linkCancel': 'closeOverlay'
        },

        initialize: function () {
            this.context = this.options.context;

            this.packetEditorConfiguration = new PacketEditorConfiguration(this.context);
            this.editorFormConfig = this.packetEditorConfiguration.getElements();

        },
        render : function(){
            var self = this;

                this.editorFormConfig.title = this.getTitle();
                this.editorFormConfig['title-help'] = {
                    "content": this.getTitle(),
                    "ua-help-identifier": "alias_for_title_edit_profile_binding"
                };
                if(this.editorFormConfig.sections && this.editorFormConfig.sections[0].elements) {
                    this.editorFormConfig.sections[0].elements[0].label = this.getPacketTypeLabel();
                }

            this.form = new FormWidget({
                "elements": this.editorFormConfig,
                "container": this.el
            });

            this.form.build();

            var trafficType = this.getTrafficMatchType();
            var trafficValue = this.getTrafficMatchValues();
            var trafficValuesArr = $.isArray(trafficValue)?trafficValue:[trafficValue];
            var selectedItems = trafficValuesArr;
            if(trafficType == "ZONE")
                selectedItems = this.formatSelectedItemsForZones(trafficValuesArr);

            this.populateZoneListBuilder(trafficType,selectedItems);
            this.populateInterfaceListBuilder(trafficType,selectedItems);
            this.populateRoutingListBuilder(trafficType,selectedItems);

            self.$el.find("#nat-rule-edit-ingress-egress-interface").hide();
            self.$el.find("#nat-rule-edit-ingress-egress-routing").hide();
            
            self.$el.find("input[type=radio][name=ingress_egress_type][value=ZONE]").click(function() {
                self.$el.find("#nat-rule-edit-ingress-egress-zone").show();
                self.$el.find("#nat-rule-edit-ingress-egress-interface").hide();
                self.$el.find("#nat-rule-edit-ingress-egress-routing").hide();
                this.checked = true;
            });
            self.$el.find("input[type=radio][name=ingress_egress_type][value=INTERFACE]").click(function() {
                self.$el.find("#nat-rule-edit-ingress-egress-zone").hide();
                self.$el.find("#nat-rule-edit-ingress-egress-interface").show();
                self.$el.find("#nat-rule-edit-ingress-egress-routing").hide();
                this.checked = true;
            });
            self.$el.find("input[type=radio][name=ingress_egress_type][value=VIRTUAL_ROUTER]").click(function() {
               self.$el.find("#nat-rule-edit-ingress-egress-zone").hide();
                self.$el.find("#nat-rule-edit-ingress-egress-interface").hide();
                self.$el.find("#nat-rule-edit-ingress-egress-routing").show();
                this.checked = true;
            });       

            self.$el.find("input[type=radio][name=ingress_egress_type][value="+trafficType+"]").trigger('click');

            return this;
        },
        populateZoneListBuilder : function(trafficType, selectedItems) {
            var self = this, selectedListValues;
            if(trafficType == "ZONE")
                selectedListValues = selectedItems;
            var id = "nat_rulesgrid_editor_pkt_zone_list_builder";
            var listContainer = this.$el.find('#' + id);
            listContainer.attr("readonly", "");
            self.zoneListBuilder = new ZoneSetListBuilder({
              context: self.context,
              container: listContainer,
              selectedItems: selectedListValues,
              policyObj: this.options.policyObj
            });
            self.zoneListBuilder.build();
            listContainer.find('.new-list-builder-widget').unwrap();
        },
        populateInterfaceListBuilder : function(trafficType, selectedItems) {
             var self = this, selectedListValues;
             if(trafficType == "INTERFACE")
                selectedListValues = selectedItems;
            var id = "nat_rulesgrid_editor_pkt_interface_list_builder";
            var listContainer = this.$el.find('#' + id);
            listContainer.attr("readonly", "");
            self.interfaceListBuilder = new InterfaceListBuilder({
              context: self.context,
              container: listContainer,
              selectedItems: selectedListValues,
              policyObj: this.options.policyObj
            });
            self.interfaceListBuilder.build();
            listContainer.find('.new-list-builder-widget').unwrap();            
        },
        populateRoutingListBuilder : function(trafficType, selectedItems) {
             var self = this, selectedListValues;
              if(trafficType == "VIRTUAL_ROUTER")
                selectedListValues = selectedItems;

            var id = "nat_rulesgrid_editor_pkt_routing_list_builder";
            var listContainer = this.$el.find('#' + id);
            listContainer.attr("readonly", "");
            self.routingListBuilder = new VirtualRouterListBuilder({
              context: self.context,
              container: listContainer,
              selectedItems: selectedListValues,
              policyObj: this.options.policyObj
            });
            self.routingListBuilder.build();
            listContainer.find('.new-list-builder-widget').unwrap();             
        },
        formatSelectedItemsForZones : function(trafficValuesArr) {
            var selectedArr = [];
            var zoneSetSelected = this.getZoneSets();
            if(trafficValuesArr != null && trafficValuesArr != undefined && trafficValuesArr.length > 0)
            {
                for(var i=0;i<trafficValuesArr.length;i++){
                  if(trafficValuesArr[i]!=undefined && trafficValuesArr[i]!= "") {
                        selectedArr.push({
                        "name":trafficValuesArr[i],
                        "id":trafficValuesArr[i]
                        });
                   }     
                }
            }
            if(zoneSetSelected != null && zoneSetSelected != undefined && zoneSetSelected.length >0)
                selectedArr = selectedArr.concat(zoneSetSelected);
            return selectedArr;
        },
        updateModel: function (e) {
            this.getValuesFromEditor();
            this.editCompleted(e,this.model);
        },

        getValuesFromEditor: function () {
            var formValues = Syphon.serialize(this);
            var trafficMatchType = formValues.ingress_egress_type;

            if(formValues.ingress_egress_type == "ZONE") {
                this.selectedListBuilder = this.zoneListBuilder;
            }
            else if(formValues.ingress_egress_type == "INTERFACE") {
                this.selectedListBuilder = this.interfaceListBuilder;
            }
            else if(formValues.ingress_egress_type == "VIRTUAL_ROUTER") {
                this.selectedListBuilder = this.routingListBuilder;
            }

            var valuesForAPICall = [];
            var zoneSets = [];

           
            var selectedItems = this.selectedListBuilder.getSelectedItems();
            for (var index = 0; index < selectedItems.length; index++) {
                if((selectedItems[index].id == selectedItems[index].name) || formValues.ingress_egress_type == "INTERFACE")
                    valuesForAPICall.push(selectedItems[index].name);
                else 
                    zoneSets.push(selectedItems[index]);
            }
        
            this.setTrafficMatchType(trafficMatchType);
            this.setTrafficMatchValues(valuesForAPICall);
            if(formValues.ingress_egress_type == "ZONE")
                this.setZoneSets(zoneSets);
        },
      

        setCellViewValues: function (list) {
            // to get the values from the grid cell in this view
            this.rowData = list.originalRowData;
            this.model = this.options.ruleCollection.get(list.originalRowData[PolicyManagementConstants.JSON_ID]);
        }

    });

    return PacketIngressEgressEditorView;
});