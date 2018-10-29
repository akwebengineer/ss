  /**
 * A view implementing general form workflow for create UTM policy wizard.
 *
 * @module PolicyGeneralFormView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'widgets/form/formWidget',
    '../conf/policyGeneralFormConf.js',
    '../views/policyStepView.js',
    'widgets/tooltip/tooltipWidget'
], function(FormWidget, Form, StepView, TooltipWidget) {

    var FormView = StepView.extend({
        initialize: function() {
            StepView.prototype.initialize.call(this);
            this.wizardView = this.options.wizardView;
            return this;
        },

        render: function(){
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

            this.setPageData(this.pages.general_information);
            this.decoratePage(this.pages.general_information, formElements);

            return this;
        },

        getTitle: function(){
            return this.context.getMessage('utm_policy_title_general_information') ;
        },

        getSummary: function() {
            var summary = [];
            var self = this;

            summary.push({
                label: self.context.getMessage('utm_policy_title_general_information'),
                value: ' '
            });

            this.getFormData();
            var formLabelHashmap = this.formLabel;
            var formDataHashmap = this.formData;

            for(var key in formLabelHashmap){
                var value = '', label = '';
                switch (key)
                {
                    case 'radio_action':
                        label = self.context.getMessage('utm_policy_action_label');
                        value = this.$el.find('input[type=radio][name=radio_action][value='+ this.model.get('session-over-limit-action')+']').next("label").text();
                        break;
                    case 'action_none':
                    case 'action_log_and_permit':
                    case 'action_block':
                        break;
                    default:
                        label = formLabelHashmap[key];
                        value = formDataHashmap[key];
                        break;
                }

                summary.push({
                    label: label,
                    value: _.escape(value)
                });
            }
            return summary;
        },
        

        checkFieldStatus: function() {     
            // Work around: Check those fields that are not required
            var connectionLimit = this.$el.find('#utm_policy_connection_limit');
            if (connectionLimit.is(":visible") && connectionLimit.parent().hasClass("error")) {return true;}

            return false;
        },

        beforePageChange: function(currentStep, requestedStep) {
            if (currentStep > requestedStep) {
                return true; // always allow to go back
            }
            var self = this;
            if (! this.formWidget.isValidInput() || ! this.isTextareaValid() || this.checkFieldStatus()) {
                 console.log('form is invalid');
                 return false;
            }

            this.model.set(this.getPageData(this.pages.general_information));
            return true;
        }
    });
    return FormView;
});
