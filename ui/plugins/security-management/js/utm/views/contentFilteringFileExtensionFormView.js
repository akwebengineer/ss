  /**
 * A view implementing file extension form workflow for create content filtering profile wizard.
 *
 * @module contentFilteringFileExtensionFormView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'widgets/form/formWidget',
    '../conf/contentFilteringFileExtensionFormConf.js',
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
            this.addReferenceLink(this.$el.find('#block-file-extension-list'));
            this.setPageData(this.pages.file_extension);
            this.decoratePage(this.pages.file_extension, formConfiguration.getValues());
            return this;
        },

        getTitle: function(){
            return this.context.getMessage('utm_content_filtering_file_extensions') + ':';
        },

        getSummary: function() {
            return this.generateSummary('utm_content_filtering_file_extensions', 'utm_content_filtering_file_extensions_summary');
        },

        beforePageChange: function() {
            var jsonDataObj = {};
            if (! this.formWidget.isValidInput() || ! this.isTextareaValid()) {
                console.log('form is invalid');
                return false;
            }
            this.model.set(this.getPageData(this.pages.file_extension));
            return true;
        }
    });
    return FormView;
});