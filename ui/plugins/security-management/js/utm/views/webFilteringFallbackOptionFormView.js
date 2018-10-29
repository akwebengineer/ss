/**
 * A view implementing fallback Option form workflow for create web filtering profile wizard.
 *
 * @module WebFilteringFallbackOptionFormView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/webFilteringFallbackOptionFormConf.js',
    '../views/webFilteringStepView.js'
], function(Backbone, Syphon, FormWidget, Form, StepView) {
    // Engine Type
    var ENGINE_TYPE_JUNIPER_ENHANCED = "JUNIPER_ENHANCED",
        ENGINE_TYPE_SURF_CONTROL = "SURF_CONTROL",
        ENGINE_TYPE_WEBSENSE_REDIRECT = "WEBSENSE";
    // Action
    var ACTION_LOG_AND_PERMIT = "LOG_AND_PERMIT",
        ACTION_BLOCK = "BLOCK",
        ACTION_PERMIT = "PERMIT",
        ACTION_QUARANTINE = "QUARANTINE";

    var FormView = StepView.extend({
        events: {
            'click #enable-global-reputation': 'showGlobalReputation'
        },
        render: function(){
            var formConfiguration = new Form(this.context);
            this.formWidget = new FormWidget({
                "container": this.el,
                elements: formConfiguration.getValues(),
                values: this.model.attributes
            });
            this.formWidget.build();

            this.$el.addClass("security-management");

            this.afterBuild();

            return this;
        },

        afterBuild: function() {
            this.initComponent();
            this.showGlobalReputation();
        },
        initComponent: function() {
            var widgets = this.formWidget.getInstantiatedWidgets();
            this.model.set("wizard_reset_flag", true);
            // set "Default Action" dropdown
            widgets["dropDown_default-action"]["instance"].setValue(this.model.get("default-action") || ACTION_LOG_AND_PERMIT);
            if (this.model.get("profile-type") == ENGINE_TYPE_WEBSENSE_REDIRECT) {
                this.$el.find("#default-action").parent().parent().hide();
            } else {
                this.$el.find("#default-action").parent().parent().show();
            }
            // Set initial values
            if (this.model.get('fallback-default-action')) {
                widgets["dropDown_utm-webfiltering-fallback-default-action"]["instance"].setValue(this.model.get('fallback-default-action'));
            } else {
                widgets["dropDown_utm-webfiltering-fallback-default-action"]["instance"].setValue(ACTION_LOG_AND_PERMIT);
            }

            if (this.model.get("profile-type") == ENGINE_TYPE_SURF_CONTROL) {
                this.$el.find("#default-action option[value='"+ACTION_QUARANTINE+"']").remove();
            } 

            if (this.model.get("profile-type") == ENGINE_TYPE_JUNIPER_ENHANCED) {
                this.$el.find("#global-reputation-action-form").show();
            } else {
                this.$el.find("#global-reputation-action-form").hide();

                return;
            }

            if (this.model.get("enable-global-reputation") === false) {
                this.$el.find("#enable-global-reputation").attr("checked", false);
            } else {
                this.$el.find("#enable-global-reputation").attr("checked", true);
            }

            if (this.model.get('very-safe')) {
                widgets["dropDown_very-safe"]["instance"].setValue(this.model.get('very-safe'));
            } else {
                widgets["dropDown_very-safe"]["instance"].setValue(ACTION_PERMIT);
            }

            if (this.model.get('moderately-safe')) {
                widgets["dropDown_moderately-safe"]["instance"].setValue(this.model.get('moderately-safe'));
            } else {
                widgets["dropDown_moderately-safe"]["instance"].setValue(ACTION_LOG_AND_PERMIT);
            }

            if (this.model.get('fairly-safe')) {
                widgets["dropDown_fairly-safe"]["instance"].setValue(this.model.get('fairly-safe'));
            } else {
                widgets["dropDown_fairly-safe"]["instance"].setValue(ACTION_LOG_AND_PERMIT);
            }

            if (this.model.get('suspicious')) {
                widgets["dropDown_suspicious"]["instance"].setValue(this.model.get('suspicious'));
            } else {
                widgets["dropDown_suspicious"]["instance"].setValue(ACTION_QUARANTINE);
            }

            if (this.model.get('harmful')) {
                widgets["dropDown_harmful"]["instance"].setValue(this.model.get('harmful'));
            } else {
                widgets["dropDown_harmful"]["instance"].setValue(ACTION_BLOCK);
            }
        },

        showGlobalReputation: function() {
            if(this.$el.find("#enable-global-reputation").is(':checked')) {
                this.$el.find(".global-reputation-settings").show();
            } else {
                this.$el.find(".global-reputation-settings").hide();
            }
        },
        getTitle: function(){
            return "";
        },

        getSummary: function() {
            var summary = [];
            var self = this;

            summary.push({
                label: self.context.getMessage('utm_web_filtering_title_fallback_option_information'),
                value: ' '
            });

            if (this.model.get("enable-global-reputation")) {
                summary = this.getFormSummary(summary);
            } else {
                if (this.model.get("profile-type") !== ENGINE_TYPE_WEBSENSE_REDIRECT) {
                    summary.push({
                        label: self.context.getMessage('utm_web_filtering_default_action'),
                        value: this.model.get("default-action")
                    });
                }
                summary.push({
                    label: self.context.getMessage('utm_web_filtering_fallback_default_action'),
                    value: this.model.get("fallback-default-action")
                });
            }

            return summary;
        },

        beforePageChange: function() {
            if (! this.formWidget.isValidInput()) {
                 console.log('form is invalid');
                 return false;
            }

            var properties = Syphon.serialize(this);

            this.model.set(properties);

            return true;
        }
    });

    return FormView;
});