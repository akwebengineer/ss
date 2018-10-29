/**
 * A view that uses the Tab Container Widget to render a tab container from a configuration object
 * The configuration object contains the tabs name, the tabs content and other parameters required to build the widget.
 *
 * @module TabContainer View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/tabContainer/tabContainerWidget',
    'widgets/tabContainer/tests/view/addView',
    'widgets/tabContainer/tests/view/applicationView',
    'widgets/tabContainer/tests/view/zonePolicyView',
    'widgets/tabContainer/tests/view/utmPolicyView',
    'widgets/tabContainer/tests/view/addressView',
    'widgets/tabContainer/tests/view/sampleOverlayView',
    'widgets/tabContainer/tests/view/toggleOverlayView',
    'widgets/tabContainer/tests/view/tabsAlignedRightView',
    './../models/zonePoliciesModel'
], function(Backbone, TabContainerWidget, CreateView, ApplicationView, ZonePolicy, UTMPolicy, AddressView, SampleOverlayView, ToggleOverlayView, TabsAlignedRightView, ZonePoliciesModel){
    var TestTabContainerViewWithDesc = Backbone.View.extend({

        events: {
            'click #tabContainer-widget_save': 'getTabsData',
            'click .tabOnOverlay': 'renderTabOnOverlay',
            'click .tabOnOverlayWithToggle': 'renderTabOnOverlayWithToggle',
            'click .tabsAlignedRight': 'renderTabsAlignedRight',
            'click .addTab': 'addTab',
            'click .removeTab': 'removeTab'
        },

        initialize: function () {
            this.tabs = [{
                            id:"create",
                            name:"Create",
                            content: new CreateView(),
                            description: "Create Description..."
                        },{
                            id:"application",
                            name:"Application",
                            isDefault: true,
                            content: new ApplicationView({
                                model: new ZonePoliciesModel.application.collection()
                            }),
                            description: "Application Description"
                        },{
                            id:"zone",
                            name:"Zone Policy",
                            content: new ZonePolicy(),
                            description: "Zone Description"
                        },{
                            id:"utm",
                            name:"UTM Policiy",
                            content: new UTMPolicy(),
                            description: "Policy Description"
                        }];
            this.actionEvents = {
                tabClickEvent: "tabSelect",
                tabSwitchEvent: "tabSwitch"
            };
        },

        render: function () {
            this.$tabContainer = this.$el.find('#standardTab');
            this.tabContainerWidget = new TabContainerWidget({
                "container": this.el,
                "tabs": this.tabs,
//                "height": "600px",
                "height": "auto",
                // "orientation": "vertical",
                actionEvents: this.actionEvents,
                "small": this.options.small,
                "submit":{
                    "id": "tabContainer-widget_save",
                    "name": "save",
                    "value": "Submit"
                }
            });
            this.tabContainerWidget.build();
            this.bindTabEvents();
            this.addTabButtons();
            return this;
        },

        bindTabEvents: function () {
            this.$el
                .bind(this.actionEvents.tabClickEvent, function(e, obj){
                    console.log(obj);
                });
            this.$el
                .bind(this.actionEvents.tabSwitchEvent, function(e, obj){
                    console.log(obj);
                });
        },

        addTabButtons: function () {
            var $submitContainer = this.$el.find("#tabContainer-widget_save");
            $submitContainer.after('<a class="tabOnOverlay">SimpleOverlay</a>');
            $submitContainer.after('<a class="tabOnOverlayWithToggle">OverlayWithToggle</a>');
            $submitContainer.after('<a class="tabsAlignedRight">TabsAlignedRight</a>');     $submitContainer.after('<a class="removeTab">Remove Tab</a>');
            $submitContainer.after('<a class="addTab">Add New Tab</a>');
        },

        getTabsData: function() {
            var tabsData = this.tabContainerWidget.getValidInput();
        },

        renderTabOnOverlay: function(){
            new SampleOverlayView();
        },

        renderTabOnOverlayWithToggle: function(){
            new ToggleOverlayView();
        },

        renderTabsAlignedRight: function(){
            new TabsAlignedRightView();
        },

        addTab: function(){
            var tab = {
                id:"address",
                name:"Address",
                content: new AddressView()
            };
            this.tabContainerWidget.addTab(tab);
            this.tabContainerWidget.setActiveTab("address");
            console.log(this.tabContainerWidget.getActiveTab());
        },

        removeTab: function(id){
            this.tabContainerWidget.removeTab('address');
        }

    });

    return TestTabContainerViewWithDesc;
});