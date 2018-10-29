/*
Generic view for custom items while editing a 'Top-10' dashlet
 */

define([
    'backbone',
    'widgets/form/formWidget',
    '../conf/top10EditConfListBar.js',
    '../conf/defaultDashletConf.js'
], function (Backbone, FormWidget, FormConf, DashletConf) {
    var Top10EditView = Backbone.View.extend({
        initialize: function(options) {
            this.context = new Slipstream.SDK.ActivityContext(this.options.context.ctx_name, this.options.context.ctx_root);
            this.formConf = new FormConf(this.context);
            this.formWidget = new FormWidget({
                'elements': this.formConf.getValues().formSections,
                'container': this.el
            });
            if (this.options && this.options.customInitData) {
                this.customInitData = this.options.customInitData;
            }
            return this;
        },

        render: function() {
            this.formWidget.build();

            this.formWidget.getInstantiatedWidgets().dropDown_show_top.instance.setValue(this.customInitData.show_top);
            this.formWidget.getInstantiatedWidgets().dropDown_chartType.instance.setValue(this.customInitData.chartType);

            // set form elements to match stored settings
            this.toggleSelection(this.$el, this.customInitData, 'chartType');
            this.toggleSelection(this.$el, this.customInitData, 'auto_refresh');
            this.toggleSelection(this.$el, this.customInitData, 'show_top');

            return this;
        },

        /**
         * Set dropdown box to stored selection
         */
        toggleSelection: function(el, data, id) {
            if (data.hasOwnProperty(id)) {
                el.find('#' + id).val(data[id]);
            }
        },

        /**
         * Serialize data for consumption by framework edit-view
         */
        serialize: function() {
            var conf = new DashletConf(),
                type = conf.getChartId('default'),
                showTop = 10,
                autoRefresh = 30,
                size = conf.getChartSize(type),
                values = this.formWidget.getValues();

            for (var ii = 0; ii < values.length; ii++) {
                switch (values[ii].name) {
                    case 'chartType':
                        if (type !== values[ii].value) {
                            type = values[ii].value;
                            size = conf.getChartSize(type);
                        }
                        break;
                    case 'auto_refresh':
                        autoRefresh = values[ii].value;
                        break;
                    case 'show_top':
                        showTop = values[ii].value;
                        break;
                    default:
                        break;
                }
            }
            return {
                'size': size,
                'customInitData': {
                    'chartType': type,
                    'show_top': showTop,
                    'auto_refresh': autoRefresh
                }
            };
        }
    });
    return Top10EditView;
});

