  /**
 * A view implementing content type form workflow for create content filtering profile wizard.
 *
 * @module ContentFilteringContentTypeFormView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'widgets/form/formWidget',
    '../conf/contentFilteringContentTypeFormConf.js',
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
            this.addReferenceLink(this.$el.find('#block-content-type-zip').parent());
            this.setPageData(this.pages.content_type);
            this.decoratePage(this.pages.content_type, formConfiguration.getValues());

            return this;
        },

        getTitle: function(){
            return this.context.getMessage('utm_content_filtering_content_types') + ':';
        },

        getSummary: function() {
             var summary = [], displayValue = '';

             summary.push({
                 label: this.context.getMessage('utm_content_filtering_content_types'),
                 value: ' '
             });
             this.getFormData();

             var formLabelHashmap = this.formLabel;
             var formDataHashmap = this.formData;

             if(_.values(formDataHashmap).length > 0){
                 for(key in formDataHashmap){
                     displayValue += formLabelHashmap[key] + '<br/>';
                 }
             }else{
                 displayValue = this.context.getMessage('none');
             }

             summary.push({
                 label: this.context.getMessage('utm_content_filtering_block_content_type'),
                 value: displayValue
             });
             return summary;
        },

        beforePageChange: function() {
            var jsonDataObj = {};
            if (! this.formWidget.isValidInput()) {
                 console.log('form is invalid');
                 return false;
             }
            this.model.set(this.getPageData(this.pages.content_type));
            return true;
        }
    });
    return FormView;
});