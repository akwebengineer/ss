  /**
 * A view implementing Anti-Virus form workflow for create UTM policy wizard.
 *
 * @module policyAntiVirusFormView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'widgets/form/formWidget',
    '../conf/policyAntiVirusFormConf.js',
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

            this.setPageData(this.pages.anti_virus);
            this.decoratePage(this.pages.anti_virus);

            return this;
        },

        getTitle: function(){
            return this.context.getMessage('utm_policy_anti_virus_head') + ':';
        },

        getSummary: function() {
            var summary = [];
            var self = this;

            summary.push({
                label: self.context.getMessage('utm_policy_anti_virus_head'),
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
                    case 'dropdown_av_protocol_default':
                    case 'checkbox_apply_to_all_protocol':
                    case '':
                        break;
                    default:
                        label = formLabelHashmap[key];
                        if (isAllProtocolChecked)
                        {
                           key = 'dropdown_av_protocol_default';
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

        beforePageChange: function() {
            var jsonDataObj = {};
            if (! this.formWidget.isValidInput() || ! this.isTextareaValid()) {
                 console.log('form is invalid');
                 return false;
            }
            this.model.set(this.getPageData(this.pages.anti_virus));
            return true;
        }
    });
    return FormView;
});
