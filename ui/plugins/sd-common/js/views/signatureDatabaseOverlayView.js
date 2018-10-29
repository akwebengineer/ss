/**
 * The overlay for update summary and detectors
 * 
 * @module SignatureDatabaseOverlayView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',
    '../conf/signatureDatabaseOverlayFormConf.js',
    '../conf/signatureDatabaseDetectorsGridConf.js',
    '../conf/signatureDatabaseUpdateSummaryGridConf.js'
], function (Backbone, FormWidget, GridWidget, FormConf, DetectorsGridConf, UpdateSummaryGridConf) {
    var OVERLAY_TYPE_UPDATE_SUMMARY = 'update_summary',
        OVERLAY_TYPE_DETECTORS = 'detectors';

    var SignatureDatabaseOverlayView = Backbone.View.extend({

        events: {
            'click #signature-database-overlay-close': "close"
        },

        close: function(event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        },

        initialize: function(options) {
            this.activity = options.activity;
            this.context = options.activity.context;
            this.params = options.params;
        },

        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            if(this.params.type === OVERLAY_TYPE_DETECTORS){
                dynamicProperties.title = this.context.getMessage('signature_database_detectors_title', [this.params.version]);
            }else if(this.params.type === OVERLAY_TYPE_UPDATE_SUMMARY){
                dynamicProperties.title = this.context.getMessage('signature_database_update_summary_title', [this.params.version]);
            }
            _.extend(formConfiguration, dynamicProperties);
        },

        render: function() {
            var self = this;
            var formConfiguration = new FormConf(this.context);
            var formElements = formConfiguration.getValues();
            this.addDynamicFormConfig(formElements);

            this.form = new FormWidget({
                container: this.el,
                elements: formElements
            });

            this.form.build();
            this.addGridWidget();
            return this;
        },

        addGridWidget: function() {
            var type = this.params.type,
                versionNo = this.params.version,
                data = this.params.data,
                gridContainer = this.$el.find('#signature-database-overlay-form').children().eq(1),
                gridConf = null;
            gridContainer.empty();
            if(type === OVERLAY_TYPE_DETECTORS){
                gridConf = new DetectorsGridConf(this.context, versionNo);
            }else if(type === OVERLAY_TYPE_UPDATE_SUMMARY){
                gridConf = new UpdateSummaryGridConf(this.context);
            }
            var gridElements = gridConf.getValues();
            this.gridWidget = new GridWidget({
                container: gridContainer,
                elements: gridElements
            });
            this.gridWidget.build();
            if (type === OVERLAY_TYPE_UPDATE_SUMMARY && data && data['idp-update-change-item']) {
                data['idp-update-change-item'] = [].concat(data['idp-update-change-item']);
                this.gridWidget.addRow(data['idp-update-change-item'], 'last');
            }
        }

    });

    return SignatureDatabaseOverlayView;
});
