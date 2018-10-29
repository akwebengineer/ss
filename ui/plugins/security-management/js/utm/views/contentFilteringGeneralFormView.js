  /**
 * A view implementing general form workflow for create content filtering profile wizard.
 *
 * @module ContentFilteringGeneralFormView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'widgets/form/formWidget',
    '../conf/contentFilteringGeneralFormConf.js',
    '../views/contentFilteringStepView.js'
], function(FormWidget, Form, StepView) {

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

            this.form = new FormWidget({
                "container": this.el,
                elements: formElements,
                values: this.model.attributes
            });
            this.form.build();
            // It's a temporary workaround until <a> is integrated with form widget
            this.addReferenceLink(this.$el.find('#custom-notification-message'));
            this.setPageData(this.pages.general_information);
            this.decoratePage(this.pages.general_information, formConfiguration.getValues());
            return this;
        },

        getTitle: function(){
            return '';
        },

        getSummary: function() {
            var summary = [];
            var self = this;

            summary.push({
                label: self.context.getMessage('utm_content_filtering_title_general_information'),
                value: ' '
            });

            this.getFormData();
            var formLabelHashmap = this.formLabel;
            var formDataHashmap = this.formData;

            for(var key in formLabelHashmap){
                var value = '', label = '';
                switch (key)
                {
                    case 'notify-mail-sender':
                        label = self.context.getMessage('utm_content_filtering_notify_mail_sender');
                        if(formDataHashmap[key]){
                            value = self.context.getMessage('enabled');
                        }else{
                            value = self.context.getMessage('disabled');
                        }
                        break;
                    // This id is for the item that just showing the label
                    case 'utm-contentfiltering-notify-mail-sender':
                        continue;
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

        beforePageChange: function(currentStep, requestedStep) {
            if (currentStep > requestedStep) {
                return true; // always allow to go back
            }
            if (! this.form.isValidInput() || ! this.isTextareaValid()) {
                 console.log('form is invalid');
                 return false;
            }

            this.model.set(this.getPageData(this.pages.general_information));
            return true;
        }
    });
    return FormView;
});