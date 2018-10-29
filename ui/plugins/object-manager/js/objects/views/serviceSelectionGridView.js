/**
 * View to provide an service grid for selection
 * 
 * @module ServiceSelectionGridView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',
    '../conf/serviceSelectionGridFormConfiguration.js',
    '../conf/serviceSelectionGridFormGridConfiguration.js'
], function (Backbone, Syphon, FormWidget, GridWidget, ServiceSelectionFormConf, ServiceSelectionGridConf) {

    var ServiceSelectionGridView = Backbone.View.extend({
        events: {
            'click #service-selection-save': "submit",
            'click #service-selection-cancel': "cancel"
        },
        submit: function(event) {
            event.preventDefault();

            // Check if form is valid
            var selectedRow = this.gridWidget.getSelectedRows();
            // Workaround until the form widget can support listBuilder as well as its validation
            if (selectedRow && selectedRow.length === 0) {
                console.log('grid has no selections');
                this.form.showFormError(this.context.getMessage('service_select_require'));
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
                elements: gridConf.getValues(this.excludeService(this.excludeTypes))
            });
            gridWidget.build();


            //this.$el.find(".grid-widget").addClass("elementinput-long");

            return gridWidget;
        },
        setSelectedService: function () {
            var container = this.parentView.$el.find("#" + this.containerId);
            if (container.attr("dataId") !== "" && container.attr("dataId") !== undefined) {
                this.gridWidget.toggleRowSelection(container.attr("dataId"));
            }
        },
        excludeService: function(typeArr) {
            if (!typeArr) return;

            var filterArr = [];

            for (var i=0; i<typeArr.length; i++)
            {
                var urlFilter = {
                    property: 'name',
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

            var formConfiguration = new ServiceSelectionFormConf(this.context);

            var formElements = formConfiguration.getValues();

            this.form = new FormWidget({
                container: this.el,
                elements: formElements
            });
            this.form.build();

            this.$el.addClass(this.context['ctx_name']);

            // Workaround until gridWidget is integrated with form widget
            this.gridWidget = this.addGridWidget('service-selection', new ServiceSelectionGridConf(self.context));
            // Initialize selected item if the previous selection exists
            this.setSelectedService();

            return this;
        }

    });
    return ServiceSelectionGridView;
});