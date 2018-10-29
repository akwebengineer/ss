/**
 * View to provide an nat pools grid for selection
 * 
 * @module NatPoolsSelectionGridView
 * @author Sandhya B<sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',
    '../conf/natPoolsSelectionGridFormConfiguration.js',
    '../conf/natPoolsSelectionGridFormGridConfiguration.js'
], function (Backbone, Syphon, FormWidget, GridWidget, NatPoolsSelectionFormConf, NatPoolsSelectionGridConf) {

    var NatPoolsSelectionGridView = Backbone.View.extend({
        events: {
            'click #nat-pool-selection-save': "submit",
            'click #nat-pool-selection-cancel': "cancel"
        },
        submit: function(event) {
            event.preventDefault();

            // Check if form is valid
            var selectedRow = this.gridWidget.getSelectedRows();
            // Workaround until the form widget can support listBuilder as well as its validation
            if (selectedRow && selectedRow.length === 0) {
                console.log('grid has no selections');
                this.form.showFormError(this.context.getMessage('select_option'));
                return;
            }
            console.log('ready to save');

            var container = this.parentView.$el.find("#" + this.containerId);
            container.val(selectedRow[0].name);
            container.attr("dataId", selectedRow[0].id);
            container.trigger("change");

            this.parentView.overlay.destroy();
        },
        cancel: function(event) {
            event.preventDefault();
            this.parentView.overlay.destroy();
        },
        addGridWidget: function(id, gridConf) {
            var gridContainer = this.$el.find('#' + id);
            this.$el.find('#' + id).after("<div id='"+id+"'></div>");
            gridContainer.remove();
            gridContainer = this.$el.find('#' + id);

            var gridWidget = new GridWidget({
                container: gridContainer,
                elements: gridConf.getValues(this.getNatPoolsByType(this.includeType))
            });
            gridWidget.build();

            this.$el.find(".grid-widget").addClass("elementinput-long");

            return gridWidget;
        },
        setSelectedNatPool: function () {
            var container = this.parentView.$el.find("#" + this.containerId);
            if (container.attr("dataId") !== "" && container.attr("dataId") !== undefined) {
                this.gridWidget.toggleRowSelection(container.attr("dataId"));
            }
        },

        getNatPoolsByType: function(type) {
            if (!type) return;

            var filterArr = [];

                var urlFilter = {
                    property: 'poolType',
                    modifier: 'eq',
                    value: type
                };
                filterArr.push(urlFilter);

            return filterArr;
        },
        initialize: function(options) {
            this.parentView = options.parentView;
            this.context = options.parentView.context;
            this.containerId = options.containerId;
            this.includeType = options.includeType;
        },
        render: function() {
            var self = this;

            var formConfiguration = new NatPoolsSelectionFormConf(this.context);

            var formElements = formConfiguration.getValues();

            this.form = new FormWidget({
                container: this.el,
                elements: formElements
            });
            this.form.build();

            this.$el.addClass("security-management");

            // Workaround until gridWidget is integrated with form widget
            this.gridWidget = this.addGridWidget('nat-pool-selection', new NatPoolsSelectionGridConf(self.context));
            // Initialize selected item if the previous selection exists
            this.setSelectedNatPool();

            return this;
        }

    });
    return NatPoolsSelectionGridView;
});