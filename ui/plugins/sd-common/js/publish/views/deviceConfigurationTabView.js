/**
 * A view that uses the Tab Container Widget to render a tab container.
 *
 * @module deviceConfigurationTabContainer View
 * @author Vinay <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    './xmlcliConfigurationView.js',
    'widgets/tabContainer/tabContainerWidget'
],  function (Backbone, 
        Syphon, 
        FormWidget,  
        XmlCliView, 
        TabContainerWidget) {

        var TabContainerView = Backbone.View.extend({
            /**
             *  Initialize all the view require params
             */
            initialize: function () {

                this.context = this.options.context;
                this.container = this.options.tabContainer;
                this.activity = this.options.activity;
                this.updateTabs();
                this.render();
            },

            updateTabs: function(){
             // construct each tab body
                this.tabs = [{
                     id:"cliConfiguration",
                     name:"CLI",
                     content: new XmlCliView({'activity': this, context:this.context, isXml: false, viewConfJobId: this.options.viewConfJobId, deviceMoId: this.options.deviceMoId, selectedSecurityDeviceId : this.activity.selectedSecurityDeviceId})
                },{
                    id:"xmlConfiguration",
                    name:"XML",
                    content: new XmlCliView({'activity': this, context: this.context, isXml: true, viewConfJobId: this.options.viewConfJobId, deviceMoId: this.options.deviceMoId, selectedSecurityDeviceId : this.activity.selectedSecurityDeviceId})
                }];
            },

            render: function () {

                // construct the tab container
                this.tabContainerWidget = new TabContainerWidget({
                    "container": this.container,
                    "tabs": this.tabs
                });
                this.tabContainerWidget.build();

                return this;
            },

            getTabsData: function() {
                var tabsData = this.tabContainerWidget.getTabsData();
                console.log(tabsData);

            }

        });

    return TabContainerView;
});