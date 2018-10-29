/**
 * View to replace nat pools
 * 
 * @module NatPoolsReplaceView
 * @author Sandhya B <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget',
    '../conf/natPoolsReplaceFormConfiguration.js',
    '../conf/natPoolsReplaceFormGridConfiguration.js',
    '../models/natPoolsReplaceModel.js',
    '../views/natPoolsSelectionGridView.js',
    '../../../../../object-manager/js/objects/views/baseReplaceView.js'
], function (
    Backbone,
    FormWidget,
    OverlayWidget,
    FormConfiguration,
    NatPoolsGridConf,
    ReplaceModel,
    NatPoolsSelectionView,
    ReplaceView) {

    var NatPoolsReplaceView = ReplaceView.extend({
        events: {
            'click #replace-save': "submit",
            'click #replace-cancel': "cancel",
            'click #natpools-selection': "selectNatPool"
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

            this.activity.finish();
            this.activity.overlay.destroy();
        },

        cancel: function(event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        },

        initialize: function(options) {
            ReplaceView.prototype.initialize.call(this, options);

            this.replaceModel = new ReplaceModel();
            this.selectionFieldId = "natpools-selection";
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
            this.gridWidget = this.addGridWidget('replace-selection-grid', new NatPoolsGridConf(this.context));
            this.gridWidget.addRow(this.extras.selectedRows);

            // Use overlay to show address selection instead of direct input
            this.$el.find("#"+this.selectionFieldId).attr("readonly", "");

            this.selectedRowIds = [];
            for (var i=0; i<selections.length; i++) {
                this.selectedRowIds.push(selections[i].id);
            }

            return this;
        },

        selectNatPool: function(e) {
            //Check for all pools of the same type
            var selectedRows = this.extras.selectedRows;
            var poolType = selectedRows[0]["pool-type"];
            var isValid = true;
            for (var i=1; i<selectedRows.length; i++) {
                if(isValid){
                    isValid = (selectedRows[i]["pool-type"] == poolType)
                }
            }
            if(!isValid){
                var replaceField = this.$el.find("#"+this.selectionFieldId);
                replaceField.parent().addClass("error").siblings().addClass("error");
                replaceField.siblings('.error').show().text(this.context.getMessage('natpool_replace_error'));;
                return;  
            }             
            // View for setting specific values
            var natPoolsSelectionView = new NatPoolsSelectionView({
                parentView: this,
                includeType: poolType == "SOURCE"?"0":"1",
                containerId: e.currentTarget.id});

            this.overlay = new OverlayWidget({
                view: natPoolsSelectionView,
                type: 'large',
                showScrollbar: true,
                xIconEl: true
            });
            this.overlay.build();

            return this;
        }
    });

    return NatPoolsReplaceView;
});