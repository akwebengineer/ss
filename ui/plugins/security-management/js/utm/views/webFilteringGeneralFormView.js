/**
 * A view implementing general form workflow for create web filtering profile wizard.
 *
 * @module WebFilteringGeneralFormView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/webFilteringGeneralFormConf.js',
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
            'change #engine-type': 'changeEngineType'
        },

        initialize: function(options) {
            StepView.prototype.initialize.call(this, options);
            this.wizardView = options.wizardView;
            return this;
        },

        render: function() {
            var formConfiguration = new Form(this.context),
                formElements = formConfiguration.getValues();
            // Add name remote validation
            this.wizardView.addRemoteNameValidation(formElements);
            this.formWidget = new FormWidget({
                "container": this.el,
                elements: formElements,
                values: this.model.attributes
            });
            this.formWidget.build();

            this.$el.addClass("security-management");

            this.afterBuild();

            return this;
        },

        afterBuild: function() {
            this.initComponent();
            this.showAdvancedInput();
            // bind specific post_validation for this form
            this.addSubsidiaryFunctions(this.formWidget.conf.elements);
        },

        getTitle: function(){
            return "";
        },

        getSummary: function() {
            var summary = [];
            var self = this;

            summary.push({
                label: self.context.getMessage('utm_web_filtering_title_general_information'),
                value: ' '
            });

            summary = this.getFormSummary(summary);

            if (this.model.get("profile-type") == ENGINE_TYPE_JUNIPER_ENHANCED) {
                if (this.model.get("safe-search")) {
                    summary.push({
                        label: self.context.getMessage('utm_web_filtering_safe_search'),
                        value: self.context.getMessage('utm_web_filtering_safe_search_checked')
                    });
                } else {
                    summary.push({
                        label: self.context.getMessage('utm_web_filtering_safe_search'),
                        value: self.context.getMessage('utm_web_filtering_safe_search_unchecked')
                    });
                }
            }

            return summary;
        },
        changeEngineType: function() {
            var self = this;

            if (this.model.get("wizard_reset_flag")) {
                if (self.model.get("profile-type") != self.$el.find("#engine-type").val()) {
                    var conf = {
                            title: self.context.getMessage('utm_web_filtering_confirmation_dialog_title'),
                            question: this.context.getMessage('utm_web_filtering_confirmation_dialog_question'),
                            yesEvent: function() {
                                // Reset values in the wizard
                                self.model.clear();
                                self.showAdvancedInput();
                                self.model.set("wizard_reset_flag", false);
                            },
                            noEvent: function() {
                                // Reset "engine type" change to previous selected value
                                var widgets = self.formWidget.getInstantiatedWidgets();
                                widgets["dropDown_engine-type"]["instance"].setValue(self.model.get("profile-type") || ENGINE_TYPE_JUNIPER_ENHANCED);
                            }
                    };

                    this.createConfirmationDialog(conf);
                }
            } else {
                this.showAdvancedInput();
            }
        },
        initComponent: function() {
            // set "Engine Type" dropdown
            var widgets = this.formWidget.getInstantiatedWidgets();
            widgets["dropDown_engine-type"]["instance"].setValue(this.model.get("profile-type") || ENGINE_TYPE_JUNIPER_ENHANCED);
            // set "Safe Search" checkbox
            if (this.model.get("safe-search") === false) {
                this.$el.find("#safe-search").attr("checked", false);
            } else {
                this.$el.find("#safe-search").attr("checked", true);
            }
            this.$el.find("#engine-type").on("select",function(){
                console.info(arguments)
            })
        },
        showAdvancedInput: function() {
            var selectedType = this.$el.find("#engine-type").children('option:selected').val();

            switch(selectedType) {
                case ENGINE_TYPE_JUNIPER_ENHANCED:
                    this.$el.find(".surf-control-settings").hide();
                    this.$el.find(".websense-redirect-settings").hide();
                    this.$el.find(".juniper-enhanced-settings").show();
                    break;

                case ENGINE_TYPE_SURF_CONTROL:
                    this.$el.find(".juniper-enhanced-settings").hide();
                    this.$el.find(".websense-redirect-settings").hide();
                    this.$el.find(".surf-control-settings").show();
                    break;

                case ENGINE_TYPE_WEBSENSE_REDIRECT:
                    this.$el.find(".surf-control-settings").hide();
                    this.$el.find(".juniper-enhanced-settings").hide();
                    this.$el.find(".websense-redirect-settings").show();
                    break;

                default:
                    this.$el.find(".surf-control-settings").hide();
                    this.$el.find(".websense-redirect-settings").hide();
                    this.$el.find(".juniper-enhanced-settings").show();
            }
        },
        /**
         * Save data according to specific class type defined in form conf
         */
        setSaveData: function(class_type, properties) {
            var sections = this.formWidget.conf.elements.sections;

            for (var i=0; i<sections.length; i++) {
                for (var j=0; j<sections[i].elements.length; j++) {
                    var element = sections[i].elements[j];
                    // Common inputs should be saved
                    if (!element.class && element.name) {
                        this.model.set(element.name, properties[element.name]);
                    // Inputs with the specified class should be saved
                    } else if (element.class.indexOf(class_type) != -1 && element.name && properties[element.name]) {
                        this.model.set(element.name, properties[element.name]);
                    // Unrelated inputs should not be saved
                    } else if (element.name) {
                        this.model.unset(element.name);
                    }
                }
            }
        },

        beforePageChange: function(currentStep, requestedStep) {
            if (currentStep > requestedStep) {
                return true; // always allow to go back
            }
            var form_id = this.formWidget.conf.elements.sections[0].section_id;

            if (! this.formWidget.isValidInput() || ! this.isFormValid(form_id) || !this.isTextareaValid()) {
                 console.log('form is invalid');
                 return false;
            }

            var properties = Syphon.serialize(this);

            // Set save data according to engine type
            switch(properties["profile-type"]) {
                case ENGINE_TYPE_JUNIPER_ENHANCED:
                    this.setSaveData("juniper-enhanced-settings", properties);
                    // Set "safe-search" checkbox
                    this.model.set("safe-search", properties["safe-search"]);
                    break;

                case ENGINE_TYPE_SURF_CONTROL:
                    this.setSaveData("surf-control-settings", properties);
                    break;

                case ENGINE_TYPE_WEBSENSE_REDIRECT:
                    this.setSaveData("websense-redirect-settings", properties);
                    break;
            }

            return true;
        }
    });

    return FormView;
});