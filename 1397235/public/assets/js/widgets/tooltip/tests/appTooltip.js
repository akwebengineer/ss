/**
 * A view that uses the Tooltip Widget to render tooltips from a configuration object
 * The configuration object contains the label and values from which the tooltip should be built.
 *
 * @module Tooltip View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/tooltip/tooltipWidget',
    'widgets/tooltip/conf/configurationSample',
    'lib/template_renderer/template_renderer',
    'text!widgets/tooltip/tests/templates/tooltipSample.html',
    'widgets/tooltip/tests/view/addView',
    'text!widgets/tooltip/tests/templates/tooltipExample.html',
    'es6!widgets/tooltip/react/tests/views/tooltipView'
], function(Backbone, TooltipWidget, configurationSample, render_template, tooltipTemplate, AddView, example, TooltipComponent){
    var TooltipView = Backbone.View.extend({

        events: {
            'click .destroy': 'destroyTooltip',
            'click .destroyTooltipStringView': 'destroyTooltipStringView'
        },

        initialize: function () {
            this.addContent(this.$el, example);
            this.containers = {
                stringTooltip: this.$el.find('#stringTooltip'),
                linkTooltip: this.$el.find('#linkTooltip'),
                formTooltip: this.$el.find('#formTooltip'),
                tooltipOnClick: this.$el.find('#tooltipOnClick')
            };
            !this.options.pluginView && this.render();
        },

        render: function () {
            this.tooltipWidget = new TooltipWidget({
                "container": this.$el.find(".tooltip-widget-examples")
            }).build();

            // test a long string
            // var stringView  = "build:buildinformationbuild:buildinformationbuild:buildinformationbuild:buildinformationbuild:buildinformationbuild:buildinformationbuild:buildinformationbuild:buildinformationbuild:buildinformationbuild:buildinformationbuild:buildinformationbuild:buildinformationbuild:buildinformationbuild:buildinformationbuild:buildinformationbuild:buildinformationbuild:buildinformationbuild:buildinformationbuild:buildinformationbuild:buildinformationbuild:buildinformationbuild:buildinformationbuild:buildinformationbuild:buildinformationbuild:buildinformationbuild:buildinformationbuild:buildinformationbuild:buildinformationEnd";
            var stringView  = "build: build information";
            this.tooltipWidgetStringView = new TooltipWidget({
                "elements": configurationSample.stringContent,
                "container": this.containers.stringTooltip,
                "view": stringView
            });
            this.tooltipWidgetStringView.build();

            var templateView  = render_template(tooltipTemplate);
            new TooltipWidget({
                "elements": configurationSample.templateContent,
                "container": this.containers.linkTooltip,
                "view": templateView
            }).build();

            var formView =  new AddView().render().el;
            new TooltipWidget({
                "elements": configurationSample.formContent,
                "container": this.containers.formTooltip,
                "view": formView
            }).build();

            var sampleView  = "Sample tooltip on click";
            this.tooltipWidgetOnClick = new TooltipWidget({
                "elements": configurationSample.triggerExample,
                "container": this.containers.tooltipOnClick,
                "view": sampleView
            });
            this.tooltipWidgetOnClick.build();
            
            //React Tooltip
            this.tooltipComponent = new TooltipComponent({
                $el: this.$el.find('.tooltip-component-examples')
            }).render();
            return this;
        },

        destroyTooltip: function () {
            this.tooltipWidget.destroy();
        },

        destroyTooltipStringView: function () {
            this.tooltipWidgetStringView.destroy();
        },

        addContent:function($container, template) {
            $container.append((render_template(template)));    
        }
    });

    return TooltipView;
});