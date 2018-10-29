  /**
 * A view implementing web filtering form workflow for create UTM policy wizard.
 *
 * @module policyWebFilteringFormView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'widgets/form/formWidget',
    '../conf/policyWebFilteringFormConf.js',
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

            this.setPageData(this.pages.web_filtering);
            this.decoratePage(this.pages.web_filtering);

            return this;
        },

        getTitle: function(){
            return this.context.getMessage('utm_policy_web_filtering_head') + ':';
        },

        getSummary: function() {
            return this.generateSummary('utm_policy_web_filtering_head');
        },

        beforePageChange: function() {
            var self = this;
            if (! this.formWidget.isValidInput() || ! this.isTextareaValid()) {
                 console.log('form is invalid');
                 return false;
            }

            this.model.set(this.getPageData(this.pages.web_filtering));
            return true;
        }
    });
    return FormView;
});
