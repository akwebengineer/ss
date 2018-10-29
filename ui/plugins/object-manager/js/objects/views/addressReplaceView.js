/**
 * View to replace addresses
 * 
 * @module AddressReplaceView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget',
    '../conf/addressReplaceFormConfiguration.js',
    '../conf/addressReplaceFormGridConfiguration.js',
    '../models/addressReplaceModel.js',
    '../views/addressSelectionGridView.js',
    '../views/baseReplaceView.js'
], function (
    Backbone,
    FormWidget,
    OverlayWidget,
    FormConfiguration,
    AddressGridConf,
    ReplaceModel,
    AddressSelectionView,
    ReplaceView) {

    var REPLACE_OBJECT_TYPE_ADDRESS = "address";
    var POLYMORPHIC = 'POLYMORPHIC',
        DYNAMIC_ADDRESS_GROUP = 'DYNAMIC_ADDRESS_GROUP',
        ANY = 'ANY',
        ANY_IPV4 = 'ANY_IPV4', 
        ANY_IPV6 = 'ANY_IPV6';

    var AddressReplaceView = ReplaceView.extend({
        events: {
            'click #replace-save': "submit",
            'click #replace-cancel': "cancel",
            'click #address-selection-replace': "selectAddress"
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
            this.objectType = REPLACE_OBJECT_TYPE_ADDRESS;
            this.selectionFieldId = "address-selection-replace";
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
            this.gridWidget = this.addGridWidget('replace-selection-grid', new AddressGridConf(this.context));
            this.gridWidget.addRow(this.extras.selectedRows);

            // Use overlay to show address selection instead of direct input
            this.$el.find("#"+this.selectionFieldId).attr("readonly", "");

            this.selectedRowIds = [];
            for (var i=0; i<selections.length; i++) {
                this.selectedRowIds.push(selections[i].id);
            }

            return this;
        },

        selectAddress: function(e) {
            // View for setting specific values
            var addressSelectionView = new AddressSelectionView({
                parentView: this,
                excludeTypes: [POLYMORPHIC, DYNAMIC_ADDRESS_GROUP, ANY, ANY_IPV4, ANY_IPV6],
                containerId: e.currentTarget.id});

            this.overlay = new OverlayWidget({
                view: addressSelectionView,
                type: 'medium',
                showScrollbar: true,
                xIconEl: false
            });
            this.overlay.build();

            return this;
        }
    });

    return AddressReplaceView;
});