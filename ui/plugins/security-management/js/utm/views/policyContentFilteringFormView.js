  /**
 * A view implementing content filtering form workflow for create UTM policy wizard.
 *
 * @module policyContentFilteringFormView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'widgets/form/formWidget',
    '../conf/policyContentFilteringFormConf.js',
    '../views/policyStepView.js'
], function(FormWidget, Form, StepView) {

    var FormView = StepView.extend({
        render: function(){
            var paramArr = [];
            var formConfiguration = new Form(this.context);
            this.formWidget = new FormWidget({
                "container": this.el,
                elements: formConfiguration.getValues()
            });
            this.formWidget.build();

            this.setPageData(this.pages.content_filtering);
            this.decoratePage(this.pages.content_filtering);

            return this;
        },

        getTitle: function(){
            return this.context.getMessage('utm_policy_content_filtering_head') + ':';
            return '';
        },
        
        getSummary: function() {
            var summary = [];
            var self = this;

            summary.push({
                label: self.context.getMessage('utm_policy_content_filtering_head'),
                value: ' '
            });

            this.getFormData();
            var formLabelHashmap = this.formLabel;
            var formDataHashmap = this.formData;
            
            var isAllProtocolChecked = this.$el.find('#checkbox_apply_to_all_protocol').is(':checked');

            for(var key in formLabelHashmap){
                var value = '', label = '';
                switch (key)
                {
                    // Do not show default value in summary page
                    case 'dropdown_cf_protocol_default':
                    case 'checkbox_apply_to_all_protocol':
                    case '':
                        break;
                    default:
                        label = formLabelHashmap[key];
                        if (isAllProtocolChecked)
                        {
                           key = 'dropdown_cf_protocol_default';
                        }
                        value = formDataHashmap[key];
                        break;
                }

                summary.push({
                    label: label,
                    value: value
                });
            }
            return summary;
        },

        beforePageChange: function(currentStep, step) {
            var jsonDataObj = {};
            if (! this.formWidget.isValidInput() || ! this.isTextareaValid()) {
                 console.log('form is invalid');
                 return false;
            }
            this.model.set(this.getPageData(this.pages.content_filtering));
            if(step > currentStep){
                if(!this.mandatoryFieldsValidation(this.model.attributes)){
                    this.createConfirmationDialog({
                        title: this.context.getMessage('warning'),
                        question: this.context.getMessage('utm_policy_no_profile_error'),
                        withoutNoButton: true,
                        kind: 'warning'
                    });
                    return false;
                }
            }
            return true;
        }
    });
    return FormView;
});
