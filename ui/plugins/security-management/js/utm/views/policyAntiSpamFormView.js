  /**
 * A view implementing Anti Spam form workflow for create UTM policy wizard.
 *
 * @module policyAntiSpamFormView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'widgets/form/formWidget',
    '../conf/policyAntiSpamFormConf.js',
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

            this.setPageData(this.pages.anti_spam);
            this.decoratePage(this.pages.anti_spam);

            return this;
        },

        getTitle: function(){
            return this.context.getMessage('utm_policy_anti_spam_head') + ':';
        },

        getSummary: function() {
            return this.generateSummary('utm_policy_anti_spam_head');
        },

        beforePageChange: function() {
            var jsonDataObj = {};
            if (! this.formWidget.isValidInput() || ! this.isTextareaValid()) {
                 console.log('form is invalid');
                 return false;
            }
            this.model.set(this.getPageData(this.pages.anti_spam));
            return true;
        }
    });
    return FormView;
});
