/**
 * View to modify a content filtering profile profile
 *
 * @module ContentFilteringModifyView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'widgets/form/formWidget',
    '../conf/contentFilteringModifyFormConfiguration.js',
    '../conf/contentFilteringGeneralFormConf.js',
    '../conf/contentFilteringProtocolCommandFormConf.js',
    '../conf/contentFilteringContentTypeFormConf.js',
    '../conf/contentFilteringFileExtensionFormConf.js',
    '../conf/contentFilteringMIMEFormConf.js',
    '../../../../ui-common/js/views/apiResourceView.js',
    '../views/utmUtility.js',
    '../views/contentFilteringUtility.js'
], function (FormWidget, ModifyForm, GeneralForm, ProtocolCommandForm, ContentTypeForm, FileExtensionForm, MIMEForm, ResourceView, UTMUtility, ContentFilteringUtility) {

    var ContentFilteringModifyView = ResourceView.extend({

        events: {
            'click #utm-content-filtering-save': "submit",
            'click #utm-content-filtering-cancel': "cancel"
        },

        submit: function(event) {
            var self = this;

            event.preventDefault();

            if (! this.form.isValidInput() || ! this.isTextareaValid()) {
                console.log('form is invalid');
                return false;
            }
            var jsonDataObj = this.getPageData(this.pages.all);
            if(!this.mandatoryFieldsValidation(jsonDataObj)){
                this.form.showFormError(this.context.getMessage('utm_content_filtering_none_block_permit_list_error'));
                return false;
            }
            this.bindModelEvents();
            this.model.set(jsonDataObj);
            this.model.save();
        },

        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);
            switch (this.formMode) {
                case this.MODE_EDIT:
                    dynamicProperties.title = this.context.getMessage('utm_content_filtering_edit');
                    dynamicProperties["title-help"] = { "content": this.context.getMessage('clone_title_tooltip'),
                                                        "ua-help-text": this.context.getMessage('more_link'),
                                                        "ua-help-identifier": this.context.getHelpKey("UTM_CONTENT_FILTERING_PROFILE_CREATING")};
                    break;
                case this.MODE_CLONE:
                    dynamicProperties.title = this.context.getMessage('utm_content_filtering_clone');
                    dynamicProperties["title-help"] = { "content": this.context.getMessage('clone_title_tooltip'),
                            "ua-help-text": this.context.getMessage('more_link'),
                            "ua-help-identifier": this.context.getHelpKey("UTM_CONTENT_FILTERING_PROFILE_CREATING")};
                    break;
            }
            _.extend(formConfiguration, dynamicProperties);
        },

        initialize: function(options) {
            ResourceView.prototype.initialize.call(this, options);

            this.successMessageKey = 'utm_content_filtering_create_success';
            this.editMessageKey = 'utm_content_filtering_edit_success';
            this.fetchErrorKey = 'utm_content_filtering_fetch_error';
            this.fetchCloneErrorKey = 'utm_content_filtering_fetch_clone_error';
            _.extend(ContentFilteringUtility, UTMUtility);
            _.extend(this, ContentFilteringUtility);
        },

        render: function() {
            var self = this;
            var sections = [],
                formConfiguration = new ModifyForm(this.context),
                generalFormSections = new GeneralForm(this.context).getValues().sections,
                protocolCommandFormSections = new ProtocolCommandForm(this.context).getValues().sections,
                contentTypeFormSections = new ContentTypeForm(this.context).getValues().sections,
                fileExtensionFormSections = new FileExtensionForm(this.context).getValues().sections,
                mimeFormFormSections = new MIMEForm(this.context).getValues().sections;

            protocolCommandFormSections[0].state_expanded = true;
            protocolCommandFormSections[0].heading = this.context.getMessage('utm_content_filtering_protocol_commands');
            delete protocolCommandFormSections[0].heading_text;

            contentTypeFormSections[0].state_collapsed = true;
            contentTypeFormSections[0].heading = this.context.getMessage('utm_content_filtering_content_types');
            delete contentTypeFormSections[0].heading_text;

            fileExtensionFormSections[0].state_collapsed = true;
            fileExtensionFormSections[0].heading = this.context.getMessage('utm_content_filtering_file_extensions');
            delete fileExtensionFormSections[0].heading_text;

            mimeFormFormSections[0].state_collapsed = true;
            mimeFormFormSections[0].heading = this.context.getMessage('utm_content_filtering_mime');
            delete mimeFormFormSections[0].heading_text;

            sections = generalFormSections;
            sections.push(protocolCommandFormSections[0]);
            sections.push(contentTypeFormSections[0]);
            sections.push(fileExtensionFormSections[0]);
            sections.push(mimeFormFormSections[0]);

            var formElements = formConfiguration.getValues();
            formElements.sections = sections;

            this.addDynamicFormConfig(formElements);

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.attributes
            });

            this.form.build();

            this.setPageData(this.pages.all);

            this.decoratePage(this.pages.all, formElements);

            return this;
        }

    });

    return ContentFilteringModifyView;
});