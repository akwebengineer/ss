/**
 * View to replace services
 * 
 * @module ServiceReplaceView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget',
    '../conf/serviceReplaceFormConfiguration.js',
    '../conf/serviceReplaceFormGridConfiguration.js',
    '../models/serviceReplaceModel.js',
    '../views/serviceSelectionGridView.js',
    '../views/baseReplaceView.js'
], function (
    Backbone,
    FormWidget,
    OverlayWidget,
    FormConfiguration,
    ServiceGridConf,
    ReplaceModel,
    ServiceSelectionView,
    ReplaceView) {

    var REPLACE_OBJECT_TYPE_SERVICE = "service";
    var ANY = 'ANY';

    var ServiceReplaceView = ReplaceView.extend({
        events: {
            'click #replace-save': "submit",
            'click #replace-cancel': "cancel",
            'click #service-selection-replace': "selectService"
        },

        submit: function(event) {
            event.preventDefault();

            var self = this;

            // Check is form valid
            if (! this.form.isValidInput()) {
                console.log('form is invalid');
                return;
            }

            // Check if the selected items have been referred by others.
            this.validateReplaceObject();
        },

        cancel: function(event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        },

        initialize: function(options) {
            ReplaceView.prototype.initialize.call(this, options);

            this.replaceModel = new ReplaceModel();
            this.objectType = REPLACE_OBJECT_TYPE_SERVICE;
            this.selectionFieldId = "service-selection-replace";
            this.selectedRowIds = [];
        },

        render: function() {
            var self = this;
            var formConfiguration = new FormConfiguration(this.context);
            var selections = this.extras.selectedRows;

            this.form = new FormWidget({
                container: this.el,
                elements: formConfiguration.getValues()
            });
            this.form.build();

            // Workaround until GridWidget is integrated with form widget
            this.gridWidget = this.addGridWidget('replace-selection-grid', new ServiceGridConf(this.context));
            this.gridWidget.addRow(this.extras.selectedRows);

            // Use overlay to show service selection instead of direct input
            this.$el.find("#"+this.selectionFieldId).attr("readonly", "");

            for (var i=0; i<selections.length; i++) {
                this.selectedRowIds.push(selections[i].id);
            }

            return this;
        },

        selectService: function(e) {
            // View for setting specific values
            var serviceSelectionView = new ServiceSelectionView({
                parentView: this,
                excludeTypes: [ANY],
                containerId: e.currentTarget.id});

            this.overlay = new OverlayWidget({
                view: serviceSelectionView,
                type: 'medium',
                showScrollbar: true,
                xIconEl: false
            });
            this.overlay.build();

            return this;
        }
    });

    return ServiceReplaceView;
});