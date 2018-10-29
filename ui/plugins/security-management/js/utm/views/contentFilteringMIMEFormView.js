  /**
 * A view implementing MIME form workflow for create content filtering profile wizard.
 *
 * @module contentFilteringMIMEFormView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'widgets/form/formWidget',
    '../conf/contentFilteringMIMEFormConf.js',
    '../views/contentFilteringStepView.js'
], function(FormWidget, Form, StepView) {

    var FormView = StepView.extend({
        render: function(){
            var formConfiguration = new Form(this.context);
            this.formWidget = new FormWidget({
                "container": this.el,
                elements: formConfiguration.getValues()
            });
            this.formWidget.build();

            // It's a temporary workaround until <a> is integrated with form widget
            this.addReferenceLink(this.$el.find('#block-mime-exception-list'));
            this.setPageData(this.pages.mime);
            this.decoratePage(this.pages.mime, formConfiguration.getValues());

            return this;
        },

        getTitle: function(){
            return this.context.getMessage('utm_content_filtering_mime_types') + ':';
        },

        getSummary: function() {
            return this.generateSummary('utm_content_filtering_mime_types', 'utm_content_filtering_mime_types_summary');
        },

        beforePageChange: function(currentStep, step) {
            var jsonDataObj = {};
            if (! this.formWidget.isValidInput() || ! this.isTextareaValid()) {
                 console.log('form is invalid');
                 return false;
             }
            this.model.set(this.getPageData(this.pages.mime));
            if(step > currentStep){
                if(!this.mandatoryFieldsValidation(this.model.attributes)){
                    this.createConfirmationDialog({
                        title: this.context.getMessage('warning'),
                        question: this.context.getMessage('utm_content_filtering_none_block_permit_list_error'),
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