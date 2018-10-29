/**
 * A view that uses a configuration object to render a tab container with toggle buttons
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
    'widgets/tabContainer/tests/view/destinationAddressView',
    'widgets/tabContainer/tests/view/sourceAddressView',
    'widgets/tabContainer/tests/view/formOverlayView',
    '../models/zonePoliciesModel'
], function(Backbone, TabContainerWidget, CreateView, ApplicationView, DestinationAddressView, SourceAddressView, FormOverlayView, ZonePoliciesModel){
    var TabContainerView = Backbone.View.extend({

        initialize: function () {
            this.tabs = [{
                            id:"createV",
                            name: "Create",
                            content: new CreateView()
                        },{
                            id:"applicationV",
                            name:"Application",
                            content: new ApplicationView({
                                model: new ZonePoliciesModel.application.collection()
                            })
                        },{
                            id:"destinationV",
                            name:"Destination",
                            isDefault: true,
                            content: new DestinationAddressView({
                                model: new ZonePoliciesModel.address.collection()
                            })
                        },{
                            id:"sourceAddressV",
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
                if(id == "createV") {
                    return "5";
                } else if(id == "destinationV") {
                    return "2";
                } else if(id == "sourceAddressV") {
                    return "<svg class='info-icon'><use href='#icon_info'/></svg>";
                }
            };
            this.tabContainerWidget = new TabContainerWidget({
                                            "container": this.el,
                                            "tabs": this.tabs,
                                            "orientation": "vertical",
                                            "height": "540px",
                                            "small": this.options.small,
                                            "actionEvents": this.actionEvents,
                                            "submit":{
                                                "id": "tabContainer-widget_save",
                                                "name": "save",
                                                "value": "Submit"
                                            },
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
                                                if(tabId == "destinationV") {
                                                    return {
                                                        "class": "green-error"
                                                    };
                                                } else if(tabId == "sourceAddressV") {
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

    return TabContainerView;
});