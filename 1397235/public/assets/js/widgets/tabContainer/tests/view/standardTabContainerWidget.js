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
    'widgets/tabContainer/tests/view/nestedTabOverlayView',
    'widgets/tabContainer/tests/view/toggleOverlayView',
    'widgets/tabContainer/tests/view/tabsAlignedRightView',
    './../models/zonePoliciesModel'
], function(Backbone, TabContainerWidget, CreateView, ApplicationView, ZonePolicy, UTMPolicy, AddressView, SampleOverlayView, NestedTabOverlayView, ToggleOverlayView, TabsAlignedRightView, ZonePoliciesModel){
    var TestTabContainerView = Backbone.View.extend({

        events: {
            'click #tabContainer-widget_save': 'getTabsData',
            'click .tabOnOverlay': 'renderTabOnOverlay',
            'click .tabOnOverlayWithToggle': 'renderTabOnOverlayWithToggle',
            'click .tabOnOverlayWithNestedTab': 'renderTabOnOverlayWithNestedTab',
            'click .tabsAlignedRight': 'renderTabsAlignedRight',
            'click .addNewTab': 'addTab',
            'click .removeTab': 'removeTab'
        },

        initialize: function () {
            var badgeCallback = function(tabId) {
                if(tabId == "zone") {
                    return "10";
                }
            };
            this.tabs = [{
                            id:"create",
                            name: "Create",
                            content: new CreateView()
                        },{
                            id:"application",
                            name: "Application",
                            isDefault: true,
                            content: new ApplicationView({
                                model: new ZonePoliciesModel.application.collection()
                            })
                        },{
                            id:"zone",
                            name:"Zone Policy",
                            content: new ZonePolicy(),
                            badge: function (tabId) {
                                return {
                                    "class": tabId + "-badge all-bagdes",
                                    "content": badgeCallback
                                }
                            }
                        },{
                            id:"utm",
                            name:"UTM Policiy",
                            content: new UTMPolicy()
                        }];
            this.actionEvents = {
                tabClickEvent: "tabSelect",
                tabSwitchEvent: "tabSwitch",
                tabAddEvent: "tabAdd",
                tabNameEditEvent: "tabNameEdit"
            };
            this.i=0;
        },

        render: function () {
            var yesButtonCallback = function(doNotShowAgain, tabId) {
                console.log('Yes button callback called with do not show checkbox', doNotShowAgain? 'selected': 'unselected');
            };
            var getBadgeContent = function(id) {
                if(id == "create") {
                    return "5";
                } else if(id == "zone") {
                    return "2";
                } else if(id == "utm") {
                    return "<svg class='info-icon'><use href='#icon_info'/></svg>";
                }
            };
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
                },
                "controls": {
                    add: true,
                    edit: true,
                    remove: {
                        confirmDialogConfig: {
                            title: 'Remove Tab',
                            question: 'Are you sure you want to remove this tab?',
                            yesButtonLabel: 'Yes',
                            noButtonLabel: 'No',
                            yesButtonCallback: yesButtonCallback,
                            doNotShowAgainMessage: 'Do not show this message again'
                        }
                    }
                },
                badge: function (tabId) {
                    return {
                        "class": tabId + "-badge all-bagdes",
                        "content": getBadgeContent
                    }
                },
                error: function (tabId) {
                    if(tabId == "zone") {
                        return {
                            "class": "green-error"
                        };
                    } else if(tabId == "utm") {
                        return {
                            "class": "yellow-error"
                        };
                    }
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
            this.$el
                .bind(this.actionEvents.tabAddEvent, $.proxy(function(e, tab){
                    console.log(tab);
                    $(tab.content).append("Content "+this.i++);
                }, this));

            this.$el
                .bind(this.actionEvents.tabNameEditEvent, function(e, tab){
                    console.log(tab);
                });
        },

        addTabButtons: function () {
            var $submitContainer = this.$el.find("#tabContainer-widget_save");
            $submitContainer.after('<a class="tab-link tabOnOverlay">SimpleOverlay</a>');
            $submitContainer.after('<a class="tab-link tabOnOverlayWithNestedTab">OverlayWithNestedTab</a>');
            $submitContainer.after('<a class="tab-link tabOnOverlayWithToggle">OverlayWithToggle</a>');
            $submitContainer.after('<a class="tab-link tabsAlignedRight">TabsAlignedRight</a>');
            $submitContainer.after('<a class="tab-link removeTab">Remove Tab</a>');
            $submitContainer.after('<a class="tab-link addNewTab">Add New Tab</a>');
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

        renderTabOnOverlayWithNestedTab: function () {
            new NestedTabOverlayView();
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

    return TestTabContainerView;
});