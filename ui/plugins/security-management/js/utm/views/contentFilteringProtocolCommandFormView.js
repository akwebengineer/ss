  /**
 * A view implementing protocol command form workflow for create content filtering profile wizard.
 *
 * @module ContentFilteringProtocolCommandFormView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'widgets/form/formWidget',
    '../conf/contentFilteringProtocolCommandFormConf.js',
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
            this.addReferenceLink(this.$el.find('#permit-command-list'));
            this.setPageData(this.pages.protocol_command);
            this.decoratePage(this.pages.protocol_command, formConfiguration.getValues());
            return this;
        },

        getTitle: function(){
            return this.context.getMessage('utm_content_filtering_protocol_commands') + ':';
        },

        getSummary: function() {
            return this.generateSummary('utm_content_filtering_protocol_commands', 'utm_content_filtering_protocol_commands_summary');
        },

        beforePageChange: function() {
            var jsonDataObj = {};
            if (! this.formWidget.isValidInput() || ! this.isTextareaValid()) {
                 console.log('form is invalid');
                 return false;
            }
            this.model.set(this.getPageData(this.pages.protocol_command));
            return true;
        }
    });
    return FormView;
});