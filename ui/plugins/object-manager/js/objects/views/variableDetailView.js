/**
 * Detail View of a variable
 *
 * @module VariableDetailView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    '../../../../ui-common/js/views/detailView.js',
    '../conf/variableDetailValueGridConfiguration.js',
    'widgets/grid/gridWidget'
], function (Backbone, DetailView, groupGrid, GridWidget) {

    this.formatTypeObject = function (value, context) {
        if (value === 'ADDRESS')  return context.getMessage('variable_grid_type_address');
        if (value === 'ZONE')  return context.getMessage('variable_grid_type_zone');
    };
    var VariableDetailView = DetailView.extend({

        getFormConfig: function() {
            var conf = {},
                eleArr = [],
                values = this.model.attributes;

            eleArr.push({
                'label': this.context.getMessage('name'),
                'value': values.name
            });
            eleArr.push({
                'label': this.context.getMessage('description'),
                'value': values.description
            });
            eleArr.push({
                'label': this.context.getMessage('type'),
                'value': formatTypeObject(values.type, this.context)
            });
            eleArr.push({
                'label': this.context.getMessage('variable_grid_column_default_value'),
                'value': values['default-name']
            });
            eleArr.push({
                'label': this.context.getMessage('variable_detail_values'),
                'id': 'variable-grid-value',
                "class": "grid-widget"
            });
            conf.sections = [{elements: eleArr}];
            return conf;
        },

        initialize: function(options) {
            DetailView.prototype.initialize.call(this, options);

            this.fetchErrorKey = 'variable_fetch_error';
            this.objectTypeText = this.context.getMessage('variable_type_text');
        },

        render: function() {
            // Get form configuration
            var conf = this.getFormConfig();
            // Render form
            this.renderForm(conf);

            this.$el.addClass(this.context['ctx_name']);

            // Workaround until GridWidget is integrated with form widget
            this.addGridWidget('variable-grid-value', new groupGrid(this.context));

            return this;
        },

        addGridWidget: function(id, gridConf) {
            var gridContainer = this.$el.find('#' + id);

            this.$el.find('#' + id).after("<div id='"+id+"'></div>");
            gridContainer.remove();
            gridContainer = this.$el.find('#' + id);

            this.gridWidget = new GridWidget({
                container: gridContainer,
                elements: gridConf.getValues()
            });
            this.gridWidget.build();

            var variableList = this.model.attributes['variable-values-list'];

            var rowObj = {};
            if (variableList && variableList['variable-values']) {
                variableList['variable-values'] = [].concat(variableList['variable-values']);
                for (var i=0; i< variableList['variable-values'].length;i++)
                {
                    rowObj['context-value'] = variableList['variable-values'][i].device.name;
                    rowObj['variable-value'] = variableList['variable-values'][i]['variable-value-detail'].name;
                    this.gridWidget.addRow(rowObj, 'last');
                }
            }
        }
    });

    return VariableDetailView;
});