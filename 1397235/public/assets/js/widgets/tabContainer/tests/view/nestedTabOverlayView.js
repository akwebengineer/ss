/**
 * A view that uses a configuration object to render a form widget on a overlay to show the usage of tab on a form
 *
 * @module NestedOverlayView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/tabContainer/tabContainerWidget',
    'widgets/tabContainer/tests/view/gridTabView',
    'widgets/tabContainer/tests/view/addView',
    'widgets/tabContainer/tests/view/applicationView',
    'widgets/tabContainer/tests/view/destinationAddressView',
    'widgets/tabContainer/tests/view/sourceAddressView',
    '../models/zonePoliciesModel',
    'widgets/overlay/overlayWidget',
    'widgets/form/formWidget',
    '../conf/formConfiguration'
], function(Backbone, TabContainerWidget, GridTabView, CreateView, ApplicationView, DestinationAddressView, SourceAddressView,ZonePoliciesModel, OverlayWidget, FormWidget, formConfiguration){
    var NestedOverlayView = Backbone.View.extend({

        events: {
            'click #add_policy_save': 'addPolicy',
            'click #add_policy_cancel': 'closePolicy'
        },

        initialize: function (options){
            this.tabs = [{
                id:"grid",
                name: "Grid",
                content: new GridTabView(),
                isDefault: true
            },{
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
                id:"sourceAddress",
                name:"Source Address",
                content: new SourceAddressView({
                    model: new ZonePoliciesModel.address.collection()
                })
            }];
            this.overlay = new OverlayWidget({
                view: this,
                type: 'medium'
            });
            this.overlay.build();
        },

        render: function () {
            this.form = new FormWidget({
                "elements": formConfiguration.TabOnOverlay,
                "container": this.el
            });
            this.form.build();
            this.addTabs();
            return this;
        },

        addTabs: function (){
            var tabContainer = this.$el.find('.tabs-on-overlay').empty();
            tabContainer.css("max-height", 600);
            this.tabContainerWidget = new TabContainerWidget({
                "container": tabContainer,
                "tabs": this.tabs,
                "height": "80%"
            });
            this.tabContainerWidget.build();
        },

        addPolicy: function (e){
            var tabsData = this.tabContainerWidget.getValidInput(); 
            if(tabsData)
                this.closePolicy(e);

        },

        closePolicy: function (e){
            this.overlay.destroy();
            e.preventDefault();
            e.stopPropagation();
        }

    });

    return NestedOverlayView;
});