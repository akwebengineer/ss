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
                            name:"Create",
                            content: new CreateView(),
                            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
                        },{
                            id:"applicationV",
                            name:"Application",
                            description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                            content: new ApplicationView({
                                model: new ZonePoliciesModel.application.collection()
                            })
                        },{
                            id:"destinationV",
                            name:"Destination",
                            description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
                            isDefault: true,
                            content: new DestinationAddressView({
                                model: new ZonePoliciesModel.address.collection()
                            })
                        },{
                            id:"sourceAddressV",
                            name:"Source Address",
                            description: "Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.",
                            content: new SourceAddressView({
                                model: new ZonePoliciesModel.address.collection()
                            })
                        }];
        },

        render: function () {
            this.tabContainerWidget = new TabContainerWidget({
                                            "container": this.el,
                                            "tabs": this.tabs,
                                            "orientation": "vertical",
                                            "height": "540px",
                                            "small": this.options.small,
                                            "submit":{
                                                "id": "tabContainer-widget_save",
                                                "name": "save",
                                                "value": "Submit"
                                            }
                                        });
            this.tabContainerWidget.build();
            return this;
        }

    });

    return TabContainerView;
});