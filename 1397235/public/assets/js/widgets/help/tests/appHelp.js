/**
 * A view that uses the help widget to render help elements from a configuration object
 *
 * @module Help View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'backbone',
    'widgets/help/helpWidget',
    'text!widgets/help/tests/templates/helpExample.html',
    'es6!widgets/help/react/tests/views/helpComponent'
], function (Backbone, HelpWidget, helpExample, HelpComponent) {
    var HelpView = Backbone.View.extend({

        events: {
            "click .add-view-help": "addViewHelp",
            "click .add-inline-help": "addInlineHelp",
            "click .destroy-view-help": "destroyViewHelp",
            "click .destroy-inline-help": "destroyInlineHelp",
            "click .disable-help": "disableHelp",
            "click .enable-help": "enableHelp"
        },

        initialize: function () {
            this.addTemplates();
            !this.options.pluginView && this.render();
        },

        render: function () {
            //React Help
            new HelpComponent({
                $el: this.$el.find('.help_component')
            }).render();
            return this;
        },

        addViewHelp: function () {
            var config = {
                "content": "Tooltip that shows how to access view help from the Help Widget",
                "ua-help-text": "More..",
                "ua-help-identifier": "alias_for_ua_event_binding"
            };
            this.viewHelp = new HelpWidget({
                "container": this.$viewHelpContainer,
                "view": config
            }).build();
            this.smallViewHelp = new HelpWidget({
                "container": this.$smallViewHelpContainer,
                "view": config,
                "size": "small"
            }).build();
        },

        addInlineHelp: function () {
            this.inlineHelp = new HelpWidget({
                "container": this.$inlineHelpContainer
            }).build();
            this.smallInlineHelp = new HelpWidget({
                "container": this.$smallInlineHelpContainer,
                "size": "small"
            }).build();
        },

        destroyHelp: function (instance, type) {
            if (instance) {
                instance.destroy();
            } else {
                console.log(type + " has not been built");
            }
        },

        destroyViewHelp: function () {
            this.destroyHelp(this.viewHelp, "viewHelp");
            this.destroyHelp(this.smallViewHelp, "smallViewHelp");
        },

        destroyInlineHelp: function () {
            this.destroyHelp(this.inlineHelp, "inlineHelp");
            this.destroyHelp(this.smallInlineHelp, "smallInlineHelp");
        },

        updateStatus: function (instance, type, enable) {
            if (instance) {
                if (enable) {
                    instance.enable();
                } else {
                    instance.disable();
                }
            } else {
                console.log(type + " has not been built");
            }
        },

        disableHelp: function () {
            this.updateStatus(this.inlineHelp, "inlineHelp", false);
            this.updateStatus(this.smallInlineHelp, "smallInlineHelp", false);
            this.updateStatus(this.viewHelp, "viewHelp", false);
            this.updateStatus(this.smallViewHelp, "smallViewHelp", false);
        },

        enableHelp: function () {
            this.updateStatus(this.inlineHelp, "inlineHelp", true);
            this.updateStatus(this.smallInlineHelp, "smallInlineHelp", true);
            this.updateStatus(this.viewHelp, "viewHelp", true);
            this.updateStatus(this.smallViewHelp, "smallViewHelp", true);
        },

        addTemplates: function () {
            this.$el.append(helpExample);
            this.$viewHelpContainer = this.$el.find(".view-help");
            this.$inlineHelpContainer = this.$el.find(".inline-help");
            this.$smallViewHelpContainer = this.$el.find(".view-help-small");
            this.$smallInlineHelpContainer = this.$el.find(".inline-help-small");
        }

    });

    return HelpView;
});