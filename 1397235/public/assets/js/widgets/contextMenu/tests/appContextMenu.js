/**
 * A view that uses the Context Menu Widget to produce a Context Menu from a configuration file
 * The configuration file contains the label and values from which the Context Menu should be built.
 *
 * @module Context Menu View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/contextMenu/contextMenuWidget',
    'widgets/contextMenu/conf/configurationSample',
    'text!widgets/contextMenu/tests/templates/contextMenuExample.html',
    'lib/template_renderer/template_renderer'
], function (Backbone, ContextMenuWidget, configurationSample, example, render_template) {
    var ContextMenuView = Backbone.View.extend({

        events: {
            'click .destroy': 'destroyContextMenu'
        },

        initialize: function () {
            this.addContent(this.$el, example);
            !this.options.pluginView && this.render();
        },

        render: function () {
            this.contextMenu = new ContextMenuWidget({
                "elements": configurationSample.simpleContextMenu,
                "container": '.context-menu'
            });
            this.contextMenu.build();

            new ContextMenuWidget({
                "elements": configurationSample.positionMenu,
                "trigger": "left",
                "container": '.context-menu-position',
                "dynamic": true
            }).build();

            new ContextMenuWidget({
                "elements": configurationSample.completeContextMenu,
                "container": '.context-menu-sub'
            }).build();

            new ContextMenuWidget({
                "elements": configurationSample.dynamicContextMenu,
                "container": '.context-menu-dynamic',
                "dynamic": true
            }).build();

            new ContextMenuWidget({
                "elements": configurationSample.inputContextMenu,
                "container": '.context-menu-with-input',
                "dynamic": true
            }).build();

            new ContextMenuWidget({
                "elements": configurationSample.contextMenuWithMaxHeight,
                "container": '.context-menu-with-max-height'
            }).build();


            return this;
        },

        destroyContextMenu: function () {
            this.contextMenu.destroy();
        },
        addContent: function ($container, template) {
            $container.append((render_template(template)));

        }
    });

    return ContextMenuView;
});