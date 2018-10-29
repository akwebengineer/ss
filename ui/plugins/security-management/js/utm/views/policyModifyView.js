/**
 * View to modify a content filtering profile profile
 *
 * @module ContentFilteringModifyView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'widgets/form/formWidget',
    '../conf/policyModifyFormConfiguration.js',
    '../conf/policyGeneralFormConf.js',
    '../conf/policyWebFilteringFormConf.js',
    '../conf/policyAntiVirusFormConf.js',
    '../conf/policyAntiSpamFormConf.js',
    '../conf/policyContentFilteringFormConf.js',
    '../../../../ui-common/js/views/apiResourceView.js',
    '../views/utmUtility.js',
    '../views/policyUtility.js'
], function (FormWidget,
        ModifyForm,
        GeneralForm,
        WebFilteringForm,
        AntiVirusForm,
        AntiSpamForm,
        ContentFilteringForm,
        ResourceView,
        UTMUtility,
        PolicyUtility) {

    var ContentFilteringModifyView = ResourceView.extend({

        events: {
            'click #utm-policy-save': "submit",
            'click #utm-policy-cancel': "cancel"
        },

        submit: function(event) {
            var self = this;

            event.preventDefault();

            if (! this.formWidget.isValidInput() || ! this.isTextareaValid()) {
                console.log('form is invalid');
                return false;
            }
            var jsonDataObj = this.getPageData(this.pages.all);

            if(!this.mandatoryFieldsValidation(jsonDataObj)){
                this.formWidget.showFormError(this.context.getMessage('utm_policy_no_profile_error'));
                return false;
            }
            this.bindModelEvents();
            this.model.set(jsonDataObj);
            this.beforeSave();
            this.model.save();
        },

        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);
            switch (this.formMode) {
                case this.MODE_EDIT:
                    dynamicProperties.title = this.context.getMessage('utm_policy_edit');
                    break;
                case this.MODE_CLONE:
                    dynamicProperties.title = this.context.getMessage('utm_policy_clone');
                    break;
            }
            _.extend(formConfiguration, dynamicProperties);
        },

        initialize: function(options) {
            ResourceView.prototype.initialize.call(this, options);

            this.successMessageKey = 'utm_policy_create_success';
            this.editMessageKey = 'utm_policy_edit_success';
            this.fetchErrorKey = 'utm_policy_fetch_error';
            this.fetchCloneErrorKey = 'utm_policy_fetch_clone_error';
            _.extend(PolicyUtility, UTMUtility);
            _.extend(this, PolicyUtility);
        },

        render: function() {
            var self = this;
            var sections = [],
                formConfiguration = new ModifyForm(this.context),
                generalFormSections = new GeneralForm(this.context).getValues().sections,
                webFilteringFormSections = new WebFilteringForm(this.context).getValues().sections,
                antiVirusFormSections = new AntiVirusForm(this.context).getValues().sections,
                antiSpamFormSections = new AntiSpamForm(this.context).getValues().sections,
                contentFilteringFormSections = new ContentFilteringForm(this.context).getValues().sections;

            delete generalFormSections[0].heading_text;
            generalFormSections[0].heading = this.context.getMessage('utm_policy_title_general_information');
            generalFormSections[1].heading = this.context.getMessage('utm_policy_title_traffic_options');

            webFilteringFormSections[0].state_expanded = true;
            webFilteringFormSections[0].heading = this.context.getMessage('utm_policy_web_filtering_profile');
            delete webFilteringFormSections[0].heading_text;

            antiVirusFormSections[0].state_collapsed = true;
            antiVirusFormSections[0].heading = this.context.getMessage('utm_policy_anti_virus_profile');
            delete antiVirusFormSections[0].heading_text;

            antiSpamFormSections[0].state_collapsed = true;
            antiSpamFormSections[0].heading = this.context.getMessage('utm_policy_anti_spam_profile');
            delete antiSpamFormSections[0].heading_text;

            contentFilteringFormSections[0].state_collapsed = true;
            contentFilteringFormSections[0].heading = this.context.getMessage('utm_policy_content_filtering_profile');
            delete contentFilteringFormSections[0].heading_text;

            sections = generalFormSections;
            sections.push(webFilteringFormSections[0]);
            sections.push(antiVirusFormSections[0]);
            sections.push(antiSpamFormSections[0]);
            sections.push(contentFilteringFormSections[0]);

            var formElements = formConfiguration.getValues();
            formElements.sections = sections;

            this.addDynamicFormConfig(formElements);

            this.formWidget = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.attributes
            });

            this.formWidget.build();

            this.setPageData(this.pages.all);

            this.decoratePage(this.pages.all, formElements);

            return this;
        }

    });

    return ContentFilteringModifyView;
});