/**
 * A view that uses a configuration object to render a tab container with toggle buttons.
 * The configuration object contains the tabs name, the tabs content and other parameters required to build the widget.
 *
 * @module RightAlignView
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
    var ToggleView = Backbone.View.extend({

        initialize: function (){
            this.tabs = [{
                id:"create",
                name:"Create",
                content: new CreateView()
            },{
                id:"application",
                name:"Application",
                content: new ApplicationView({
                    model: new ZonePoliciesModel.application.collection()
                })
            },{
                id:"destination",
                name:"Destination",
                isDefault: true,
                content: new DestinationAddressView({
                    model: new ZonePoliciesModel.address.collection()
                })
            },{
                id:"sourceAddress",
                name:"Source Address",
                content: new SourceAddressView({
                    model: new ZonePoliciesModel.address.collection()
                }),
                isDefault: true
            }];
            this.actionEvents = {
                tabAddEvent: "tabAdd",
                tabNameEditEvent: "tabNameEdit"
            };
            this.ii=0;
        },

        render: function () {
            var yesButtonCallback = function(doNotShowAgain, tabId) {
                console.log('Yes button callback called with do not show checkbox', doNotShowAgain? 'selected': 'unselected');
            };

            var getBadgeContent = function(id) {
                if(id == "create") {
                    return "5";
                }
            };

            this.tabContainerWidget = new TabContainerWidget({
                "container": this.el,
                "tabs": this.tabs,
                "toggle": true,
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
                actionEvents: this.actionEvents,
                badge: function (tabId) {
                    return {
                        "class": tabId + "-badge all-bagdes",
                        "content": getBadgeContent
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
                    $(tab.content).append("Content "+this.ii++);
                }, this));

            this.$el
                .bind(this.actionEvents.tabNameEditEvent, function(e, tab){
                    console.log(tab);
                });
        }

    });

    return ToggleView;
});