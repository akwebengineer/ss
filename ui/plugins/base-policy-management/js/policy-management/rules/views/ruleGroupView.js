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
    '../conf/ruleGroupFormConfiguration.js'
], function (Backbone, Syphon, FormWidget, RuleGroupFormConfiguration) {
    var RuleGroupEditorView = Backbone.View.extend({

        events: {
            'click #btnOk': 'saveRuleGroup',
            'click #linkCancel': 'closeOverlay'
        },

        initialize: function () {
            this.context = this.options.context;
            this.formConfiguration = new RuleGroupFormConfiguration(this.options.type, this.context);
        },

        render: function () {
            var self = this,
                values = {},
                rule = {};

            if (this.options.type === "modify") {
                rule = this.options.ruleCollection.get(this.options.selections.selectedRowIds[0]);
                values = rule ? rule.toJSON() : {};
            }

            this.form = new FormWidget({
                "elements": this.formConfiguration.ruleGroup(),
                "container": this.el,
                "values": values
            });

            this.form.build();

            return this;
        },

        saveRuleGroup: function (e) {

            e.preventDefault();
            if (this.form.isValidInput(this.$el.find('form'))) {
                var params = Syphon.serialize(this);

                if (this.options.type === "create") {
                    this.options.addRuleGroup(params["name"], params["description"]);
                } else if (this.options.type === "modify") {
                    this.options.modifyRuleGroup(params["name"], params["description"]);
                }
                this.closeOverlay(e);
            }
        },

        closeOverlay: function (e) {
            this.options.close(e);
        }

    });

    return RuleGroupEditorView;
});