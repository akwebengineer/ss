/**
 * Firewall rule group view
 *
 * @module FirewallRuleGroupView
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
     'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/highlightRowFormConf.js'
], function (Backbone, Syphon, FormWidget, HighlightRuleFormConfiguration) {
    var HighlightRuleView = Backbone.View.extend({

        events: {
            'click #btnOk': 'highlightRule',
            'click #linkCancel': 'closeOverlay'
        },

        initialize: function () {
            this.context = this.options.context;
            this.formConfiguration = new HighlightRuleFormConfiguration(this.context);
        },

        render: function () {

            this.form = new FormWidget({
                "elements": this.formConfiguration.highlightRule(),
                "container": this.el
            });

            this.form.build();

            return this;
        },

        highlightRule: function (e) {
            e.preventDefault();
            var params = Syphon.serialize(this);
            this.options.highlightRule(params["ruleId"]);
            this.closeOverlay(e);
        },

        closeOverlay: function (e) {
            this.options.close(e);
        }

    });

    return HighlightRuleView;
});