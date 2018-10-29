/**
 * View to create a Anti-Spam profile
 *
 * @module AntispamView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    './utmUtility.js',
    '../conf/antispamFormConfiguration.js',
    '../../../../ui-common/js/views/apiResourceView.js'
], function (Backbone, Syphon, FormWidget, UTMUtility, AntispamForm, ResourceView) {
    var BLACKLIST_TRUE = "Sophos Blacklist";
    var BLACKLIST_FALSE = "Local";

    var AntispamView = ResourceView.extend({

        events: {
            'click #utm-antispam-save': "submit",
            'click #utm-antispam-cancel': "cancel"
        },

        submit: function(event) {
            var self = this;

            event.preventDefault();

            if (! this.form.isValidInput() || !this.isTextareaValid()) {
                console.log('form is invalid');
                return;
            }

            var properties = Syphon.serialize(this);

            if (properties['default-sbl-server'])
            {
                properties['black-list'] = BLACKLIST_TRUE;
            } else {
                properties['black-list'] = BLACKLIST_FALSE;
            }

            this.bindModelEvents();
            this.model.set(properties);
            this.beforeSave(); // change definition-type if action is clone
            this.model.save();
        },

        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);
            switch (this.formMode) {
                case this.MODE_EDIT:
                    dynamicProperties.title = this.context.getMessage('utm_antispam_grid_edit');
                    break;
                case this.MODE_CREATE:
                    dynamicProperties.title = this.context.getMessage('utm_antispam_grid_create');
                    // Set the default value for tag-string
                    this.model.set('tag-string', this.context.getMessage('utm_antispam_custom_tag_placeholder'));
                    break;
                case this.MODE_CLONE:
                    dynamicProperties.title = this.context.getMessage('utm_antispam_grid_clone');
                    break;
            }
            _.extend(formConfiguration, dynamicProperties);
        },

        initialize: function(options) {
            ResourceView.prototype.initialize.call(this, options);

            this.successMessageKey = 'utm_antispam_create_success';
            this.editMessageKey = 'utm_antispam_edit_success';
            this.fetchErrorKey = 'utm_antispam_fetch_error';
            this.fetchCloneErrorKey = 'utm_antispam_fetch_clone_error';

            _.extend(this, UTMUtility);
        },

        render: function() {
            var self = this;
            var formConfiguration = new AntispamForm(this.context);
            var formElements = formConfiguration.getValues();

            this.addDynamicFormConfig(formElements);

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.attributes
            });

            this.form.build();

            this.addSubsidiaryFunctions(formElements);

            // Set value for checkbox
            if(this.formMode === this.MODE_EDIT || this.formMode === this.MODE_CLONE) {
                this.$el.find('#default-sbl-server').prop('checked',this.model.get('default-sbl-server'));
            }

            return this;
        }

    });

    return AntispamView;
});