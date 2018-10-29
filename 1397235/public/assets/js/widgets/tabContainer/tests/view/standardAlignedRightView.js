/**
 * A view that uses a configuration object to render a tab container with right alignment.
 * The configuration object contains the tabs name, the tabs content and other parameters required to build the widget.
 *
 * @module RightTabContainerView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone',
    'widgets/tabContainer/tabContainerWidget',
    'widgets/tabContainer/tests/view/addView',
    'widgets/tabContainer/tests/view/applicationView',
    'widgets/tabContainer/tests/view/destinationAddressView',
    'widgets/tabContainer/tests/view/sourceAddressView',
    '../models/zonePoliciesModel'
], function(Backbone, TabContainerWidget, CreateView, ApplicationView, DestinationAddressView, SourceAddressView, ZonePoliciesModel){
    var RightTabContainerView = Backbone.View.extend({

        initialize: function () {
            this.tabs = [{
                            id:"createR",
                            name:"Create",
                            content: new CreateView()
                        },{
                            id:"applicationR",
                            name:"Application",
                            content: new ApplicationView({
                                model: new ZonePoliciesModel.application.collection()
                            })
                        },{
                            id:"destinationR",
                            name:"Destination",
                            isDefault: true,
                            content: new DestinationAddressView({
                                model: new ZonePoliciesModel.address.collection()
                            })
                        },{
                            id:"sourceAddressR",
                            name:"Source Address",
                            content: new SourceAddressView({
                                model: new ZonePoliciesModel.address.collection()
                            })
                        }];
            this.actionEvents = {
                tabAddEvent: "tabAdd",
                tabNameEditEvent: "tabNameEdit"
            };
            this.i=0;
        },

        render: function () {
            var getBadgeContent = function(id) {
                if(id == "createR") {
                    return "5";
                } else if(id == "destinationR") {
                    return "2";
                } else if(id == "sourceAddressR") {
                    return "<svg class='info-icon'><use href='#icon_info'/></svg>";
                }
            };
            this.tabContainerWidget = new TabContainerWidget({
                                            "container": this.el,
                                            "tabs": this.tabs,
                                            "actionEvents": this.actionEvents,
                                            "rightAlignment": true,
                                            "small": this.options.small,
                                            "controls": {
                                                add: true,
                                                edit: true
                                            },
                                            badge: function (tabId) {
                                                return {
                                                    "class": tabId + "-badge all-bagdes",
                                                    "content": getBadgeContent
                                                }
                                            },
                                            error: function (tabId) {
                                                if(tabId == "destinationR") {
                                                    return {
                                                        "class": "green-error"
                                                    };
                                                } else if(tabId == "sourceAddressR") {
                                                    return {
                                                        "class": "yellow-error"
                                                    };
                                                }
                                            }
                                        });
            this.tabContainerWidget.build();
            this.bindTabEvents();
            return this;
        },

        bindTabEvents: function () {
            this.$el
                .bind(this.actionEvents.tabAddEvent, $.proxy(function(e, tab){
                    console.log(tab);
                    $(tab.content).append("Content "+this.i++);
                }, this));

            this.$el
                .bind(this.actionEvents.tabNameEditEvent, function(e, tab){
                    console.log(tab);
                });
        }

    });

    return RightTabContainerView;
});