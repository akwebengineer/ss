/**
 * View to provide an address grid for selection
 * 
 * @module AddressSelectionGridView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',
    '../conf/addressSelectionGridFormConfiguration.js',
    '../conf/addressSelectionGridFormGridConfiguration.js'
], function (Backbone, Syphon, FormWidget, GridWidget, AddressSelectionFormConf, AddressSelectionGridConf) {

    var AddressSelectionGridView = Backbone.View.extend({
        events: {
            'click #variable-address-selection-save': "submit",
            'click #variable-address-selection-cancel': "cancel"
        },
        submit: function(event) {
            event.preventDefault();

            // Check if form is valid
            var selectedRow = this.gridWidget.getSelectedRows();
            // Workaround until the form widget can support listBuilder as well as its validation
            if (selectedRow && selectedRow.length === 0) {
                console.log('grid has no selections');
                this.form.showFormError(this.context.getMessage('address_select_require'));
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
                elements: gridConf.getValues(this.excludeAddressByType(this.excludeTypes))
            });
            gridWidget.build();
            return gridWidget;
        },
        setSelectedAddress: function () {
            var container = this.parentView.$el.find("#" + this.containerId);
            if (container.attr("dataId") !== "" && container.attr("dataId") !== undefined) {
                this.gridWidget.toggleRowSelection(container.attr("dataId"));
            }
        },
        excludeAddressByType: function(typeArr) {
            if (!typeArr) return;

            var filterArr = [];

            for (var i=0; i<typeArr.length; i++)
            {
                var urlFilter = {
                    property: 'addressType',
                    modifier: 'ne',
                    value: typeArr[i]
                };
                filterArr.push(urlFilter);
            }

            return filterArr;
        },
        initialize: function(options) {
            this.parentView = options.parentView;
            this.context = options.parentView.context;
            this.containerId = options.containerId;
            this.excludeTypes = options.excludeTypes;
        },
        render: function() {
            var self = this;

            var formConfiguration = new AddressSelectionFormConf(this.context);

            var formElements = formConfiguration.getValues();

            this.form = new FormWidget({
                container: this.el,
                elements: formElements
            });
            this.form.build();

            this.$el.addClass(this.context['ctx_name']);

            // Workaround until gridWidget is integrated with form widget
            this.gridWidget = this.addGridWidget('address-selection', new AddressSelectionGridConf(self.context));
            // Initialize selected item if the previous selection exists
            this.setSelectedAddress();

            return this;
        }

    });
    return AddressSelectionGridView;
});