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
    'widgets/tabContainer/tests/view/standardTabContainerWidget',
    'widgets/tabContainer/tests/view/standardTabContainerWidgetWithDesc',
    'widgets/tabContainer/tests/view/standardVerticalView',
    'widgets/tabContainer/tests/view/standardVerticalViewWithDesc',
    'widgets/tabContainer/tests/view/standardAlignedRightView',
    'widgets/tabContainer/tests/view/toggleView',
    'widgets/layout/tests/view/simpleGridView',
    'text!widgets/tabContainer/tests/templates/tabContainerExample.html',
    'lib/template_renderer/template_renderer',
    'mockjax'
//    'widgets/layout/tests/view/smallGrid'
], function(Backbone, TabContainerWidget, FormView, TabView, TabViewWithDesc, TabVerticalView, TabVerticalViewWithDesc, TabRightView, ToggleView, SmallGridView,example, render_template, mockjax){
    var TabContainerView = Backbone.View.extend({

        initialize: function () {
            this.addContent(this.$el, example);
            var badgeCallback = function(tabId) {
                if(tabId == "createNav") {
                    return "2";
                }
            };
            this.tabs = [{
                id:"smallGrid",
                name:"GRID",
                content: new SmallGridView()
            },{
                id:"createNav",
                name:"FORM",
                content: new FormView(),
                badge: function (tabId) {
                    return {
                        "class": tabId + "-badge all-bagdes",
                        "content": badgeCallback
                    }
                }
            },{
                id:"zoneNav",
                name:"TABS",
                isDefault: true,
                content: new TabView()
            },{
                id:"rightTab",
                name:"RIGHT",
                content: new TabRightView()
            },{
                id:"verticalTab",
                name:"VERTICAL",
                content: new TabVerticalView()
            },{
                id:"zoneNavWithDesc",
                name:"TABS with Description",            
                content: new TabViewWithDesc()
            },{

                id:"verticalTabWithDesc",
                name:"VERTICAL with Description",
                content: new TabVerticalViewWithDesc()
            },{
                id:"toggleTab",
                name:"TOGGLE",
                content: new ToggleView()
            }];
            this.tabs1 = [{
                id:"zoneNav",
                name:"TABS",
                isDefault: true,
                content: new TabView({"small": true})
            },{
                id:"rightTab",
                name:"RIGHT",
                content: new TabRightView({"small": true})
            },{
                id:"verticalTab",
                name:"VERTICAL",
                content: new TabVerticalView({"small": true})
            },{
                id:"zoneNavWithDesc",
                name:"TABS with Description",
                content: new TabViewWithDesc({"small": true})
            },{

                id:"verticalTabWithDesc",
                name:"VERTICAL with Description",
                content: new TabVerticalViewWithDesc({"small": true})
            }];
            !this.options.pluginView && this.render();
        },

        render: function () {
            var $navigationContainer = this.$el.find('#navigationTab');
            new TabContainerWidget({
                "container": $navigationContainer,
                "tabs": this.tabs,
                "height": "auto",
                "navigation": true
            }).build();
            var $smallTabContainer = this.$el.find('#smallTab');
            new TabContainerWidget({
                "container": $smallTabContainer,
                "tabs": this.tabs1,
                "height": "auto",
                "navigation": true,
                "small": true
            }).build();
            return this;
        },
        addContent:function($container, template) {
            $container.append((render_template(template)));

        },
        mockApiResponse: function(){
            /* mocks REST API implementation for remote validation with callback */
            $.mockjax({
                url: /^\/form-test\/remote-validation\/callback\/developer-new-generation\/([a-zA-Z0-9\-\_]*)$/,
                urlParams: ["client"],
                response: function(settings) {
                    var client = settings.urlParams.client,
                        clients = ["Sujatha","Andrew","Miriam","Vidushi","Eva","Sanket","Arvind","Viswesh","Swena", "testRemote"];
                    this.responseText = "true";
                    if ($.inArray(client, clients) !== -1) {
                        this.responseText = "false";
                    }
                },
                responseTime: 10000
            });
        }
    });

    return TabContainerView;
});