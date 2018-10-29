/**
 * Module that implements the Extranet Device View.
 *
 * @module ExtranetDeviceView
 * @author Jangul Aslam <jaslam@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone.syphon',
    '../models/extranetDeviceModel.js',
    'widgets/overlay/overlayWidget',
    '../models/extranetDevicesCollection.js',
    '../conf/extranetDeviceFormConf.js',
    'widgets/form/formWidget',
    '../../../../ui-common/js/views/apiResourceView.js'
], function (
    Syphon,
    ExtranetDeviceModel,
    OverlayWidget,
    Collection,
    ExtranetDeviceFormConf,
    FormWidget,
    ResourceView
) {
    var ExtranetDeviceView = ResourceView.extend({
        events: {
            "click #ok" : 'onOk',
            "click #cancel" : 'onCancel'
        },

        /**
         * The constructor for the extranet device view using overlay.
         * 
         * @param {Object} options - The options containing the Slipstream's context
         */
        initialize: function(options) {
        ResourceView.prototype.initialize.call(this, options);
            this.activity = options.activity;
            this.activity.collection = new Collection();
            this.context = this.activity.context;

            var extras = this.activity.getIntent().getExtras();
            this.successMessageKey = 'extranet_create_success';
            this.editMessageKey = 'extranet_edit_success';
            this.fetchErrorKey = 'extranet_fetch_error';
            this.fetchCloneErrorKey = 'extranet_clone_error';
            this.model.on('error', this.onError, this);
        },

        /**
         * Renders the form view in a overlay.
         * 
         * returns this object
         */
        render: function() {
        var formElements = ExtranetDeviceFormConf.getConfiguration(this.activity.getContext(), this.activity.getIntent()['action']);
            this.form = new FormWidget({
                'elements': formElements,
                'container': this.el,
                'values': this.model.attributes
            });
            this.addDynamicFormConfig(formElements);
            this.form.build();
            return this;
        },
        addDynamicFormConfig: function(formConfiguration) {
           ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);
        },
        // View event handlers

        /**
         * Called when OK button is clicked on the overlay based form view.
         * 
         * @param {Object} event - The event object
         * returns none
         */
        onOk: function(event) {
            event.preventDefault();
            if (this.form.isValidInput(this.$el.find('form')) && this.$el.find('form').find("input[data-invalid]").length === 0) {
                this.bindModelEvents();
                this.model.set(Syphon.serialize(this));
                this.model.save();
            }
        },
        /**
         * Called when Cancel button is clicked on the overlay based form view.
         * 
         * @param {Object} event - The event object
         * returns none
         */
        onCancel: function(event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        }

    });

    return ExtranetDeviceView;
}); 