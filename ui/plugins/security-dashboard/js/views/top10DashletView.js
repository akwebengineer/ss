/**
 * A module that acts as a base class for Orpheus dashlet views
 *
 * @module DashletView
 * @author Kyle Huang <kyleh@juniper.net>
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'lib/template_renderer/template_renderer',
    'backbone',
    '../models/aggregateDataCollection.js',
    'widgets/barChart/barChartWidget',
    'widgets/timeSeriesChart/timeSeriesChartWidget',
    'widgets/grid/gridWidget',
    '../conf/defaultDashletConf.js',
    '../conf/top10ListConf.js',
    'text!../../templates/noDataAvailable.html'
], function (template_renderer, Backbone, AggregateDataCollection, BarChartWidget, TimeSeriesChartWidget, GridWidget, DashletConf, GridConf, NoDataTemplate) {
    /**
     * Constructs a DashletView
     */
    var DashletView = Backbone.View.extend({

        initialize: function () {
            var self = this;
            this.context = new Slipstream.SDK.ActivityContext(this.options.context.ctx_name, this.options.context.ctx_root);

            this.customData = this.options.customInitData;
            if (!this.customData) {
                return;
            }

            if (this.customData.template) {
                this.conf = new DashletConf(this.context);
                this.dashletConf = this.conf.getValues()[this.customData.template];
            }

            if (!(this.customData.chartType)) {
                var defaults = JSON.parse(JSON.stringify(this.conf.getValues().defaults));
                var dashletSettings = $.extend(true, defaults, this.dashletConf);

                this.customData.chartType = dashletSettings.chartType;
                this.customData.queryParams = dashletSettings.params;
                this.customData.show_top = dashletSettings.params.count;
            }

            if (this.options.filters) {
                this.filters = this.options.filters;
            }

            this.dataModel = new AggregateDataCollection({queryParams: self.options.customInitData.queryParams});
            this.dataModel.on('sync', this.displayChart, this);

            return this;
        },

        getData: function (done) {
            var self = this;
            var queryParams = $.extend(true, {}, this.customData.queryParams);
            var epoch = (new Date).getTime();
            queryParams['end-time'] = epoch;
            if (this.filters) {
                for (var ii = 0; ii < this.filters.length && ii < 3; ii++) {
                    var filter = this.filters[ii];
                    if (filter.name === 'dashlet_previous_filter') {
                        for (var jj = 0; jj < filter.values.length; jj++) {
                            if (filter.values[jj].selected) {
                                queryParams['start-time'] = epoch - filter.values[jj].value;
                            }
                        }
                    }
                }
            }
            if (queryParams['start-time'] === undefined) {
                queryParams['start-time'] = epoch - this.conf.getValues().defaults.timeRange;
            }
            queryParams['response-type'] = this.conf.getChartQueryParam(this.customData.chartType);
            // set attributes on dataModel from customData
            // then call fetch.
            this.dataModel.fetch({
                queryParams: queryParams,
                success: function(model, response, options) {
                    if (done) {
                        done();
                    }
                },
                error: function(model, response, options) {
                    if (done) {
                        done(new Error('Error getting data for ' + self.title));
                    }
                }
            });
        },

        displayNoData: function () {
            var self = this;
            var noData = template_renderer(NoDataTemplate, {message: self.context.getMessage('dashlet_no_data_available')});
            this.$el.empty();
            this.$el.append(noData);
        },

        // should only called when creating a new dashlet
        getCustomInitData: function (doneCallback) {
            doneCallback(this.customData);
        },

        getType: function () {
            if (this.customData && this.customData.chartType !== undefined) {
                return this.customData.chartType;
            } else if (this.dashletConf && this.dashletConf.chartType !== undefined) {
                return this.dashletConf.chartType;
            }
            return null;
        },

        displayChart: function () {
            var availableTypes = this.conf.getChartTypes();
            this.$el.empty();

            if (this.dataModel.length === 0){
                this.displayNoData();
            } else {
                switch (this.getType()) {
                    case availableTypes.barChart.id:
                        this.displayBarChart();
                        break;
                    case availableTypes.timeSeriesChart.id:
                        this.displayTimeSeriesChart();
                        break;
                    case availableTypes.listChart.id:
                        this.displayListChart();
                        break;
                    default:
                        break;
                }
            }
        },

        displayListChart: function () {
            GridConf.top10ListDashlet.columns = this.conf.getColumnConfig(this.dashletConf.listColumnHeader);
            GridConf.top10ListDashlet.numberOfRows = this.dataModel.models.length;

            this.listWidget = new GridWidget({
                'container': this.$el,
                'elements': GridConf.top10ListDashlet
            });
            this.listWidget.build();

            for (var ii = 0; ii < this.dataModel.models.length; ii++) {
                this.dataModel.models[ii].set('rank', ii + 1);
            }
            this.listWidget.addRow(this.dataModel.models, 'last');
        },

        displayBarChart: function() {
            this.chartCategories = this.dataModel.pluck('key');
            var getColor = function(datum){
                    return '#6398CF';
                },
                barChartThresholds = [],
                xAxisTitle = '',
                yAxisTitle = '',
                type = 'bar',
                getTooltip = null;


            if (this.dashletConf.barChartParams) {
                if (this.dashletConf.barChartParams.getColor) {
                    getColor = this.dashletConf.barChartParams.getColor;
                }
                if (this.dashletConf.barChartParams.barChartThresholds) {
                    barChartThresholds = this.dashletConf.barChartParams.barChartThresholds;
                    barChartThresholds.push(this.dataModel.at(0).get('threshold'));
                }
                if (this.dashletConf.barChartParams.xAxisTitle) {
                    xAxisTitle = this.dashletConf.barChartParams.xAxisTitle;
                }
                if (this.dashletConf.barChartParams.yAxisTitle) {
                    yAxisTitle = this.dashletConf.barChartParams.yAxisTitle;
                }
                if (this.dashletConf.barChartParams.type) {
                    type = this.dashletConf.barChartParams.type;
                }
                if (this.dashletConf.barChartParams.getTooltip) {
                    getTooltip = this.dashletConf.barChartParams.getTooltip;
                }
            }

            this.chartData = [];
            this.tooltipData = [];

            // Work in progress - stacked-bar chart will be removed 
            if (type == 'stacked-bar') {
                var stackedBarLegend = this.dashletConf.barChartParams.stackedBarLegend;
                var barLevels = Object.keys(stackedBarLegend);

                this.chartData = [];
                var obj = {};
                for (var ii = 0; ii < this.dataModel.length; ii++) {
                    // need an array for each level - that is the output of this loop.
                    for (var jj = 0; jj < barLevels.length; jj++ ) {

                        if (!obj[barLevels[jj]]) {
                            obj[barLevels[[jj]]] = [];
                        }
                        var o = this.dataModel.at(ii).get('barComponents')[barLevels[jj]];
                        obj[barLevels[jj]].push(o);
                    }
                    this.tooltipData.push(this.dataModel.at(ii).get('details'));
                }
                for (var ii = 0; ii < barLevels.length; ii++) {
                    this.chartData.push({
                        name: barLevels[ii],
                        color: stackedBarLegend[barLevels[ii]],
                        y: obj[barLevels[ii]]  // entire array of values must be added here as array.
                    });
                }
            } else {
                for (var ii = 0; ii < this.chartCategories.length; ii++) {
                    this.chartData[ii] = {
                        y: Number(this.dataModel.at(ii).get('value')),
                        color: getColor(this.dataModel.at(ii).get('value'), this.dataModel.at(ii).get('threshold'))
                    };

                    if ((getTooltip !== null) && this.dataModel.at(ii)) {
                        if (this.filters) {
                            var item = _.filter(this.filters[0].values, function(v){if(v.selected) return v;})
                            this.tooltipData[ii] = getTooltip(this.dataModel.at(ii), item[0].label);
                        } else {
                            this.tooltipData[ii] = getTooltip(this.dataModel.at(ii));
                        }
                       
                    }
                    else {
                        this.tooltipData[ii] = this.dataModel.at(ii).get('value').toLocaleString();
                    }
                }
            }

            var options = {
                type            : type,
                xAxisTitle      : xAxisTitle,
                yAxisTitle      : yAxisTitle,
                yAxisThreshold  : barChartThresholds,
                categories      : this.chartCategories,
                tooltip         : this.tooltipData,
                data            : this.chartData,
                maxLabelSize    : 16
            };

            if(this.dashletConf.barChartParams){
                if(this.dashletConf.barChartParams.yAxisLabelFormat){
                    options['yAxisLabelFormat'] = this.dashletConf.barChartParams.yAxisLabelFormat;
                }
            }

            var conf = {
                container: this.$el,
                options: options
            };

            this.renderBarChart(conf);
            return this;
        },

        renderBarChart: function(conf) {
            var chartWidgetObj = new BarChartWidget(conf);
            chartWidgetObj.build();
            return this;
        },

        renderTimeSeriesChart: function(conf){
            var timeSeriesChartWidgetObj = new TimeSeriesChartWidget(conf);
            timeSeriesChartWidgetObj.build();
            return this;
        },

        displayTimeSeriesChart: function () {
            var seriesData = [];
            var seriesLabels = _.pluck(this.dataModel.models[0].attributes['time-value'], 'key');
            for (var ii = 0; ii < seriesLabels.length; ii++) {
                var points = [];
                for (var jj = 0; jj < this.dataModel.models.length; jj++) {
                    var dm = this.dataModel.models[jj].attributes['time-value'];
                    var singleDataPoint = [];
                    for (var kk = 0; kk < dm.length; kk++) {
                        if (dm[kk].key === seriesLabels[ii]) {
                            // Backend sends dm[kk].time in this format: 2015-08-24T23:03:45.000Z-2015-08-24T23:08:33.000Z
                            // We need to first convert it to: 2015-08-24T23:03:45.000Z
                            // and send something like 1440457658000 to the time-series widget
                            if (dm[kk].time){
                                var timeValue = "";
                                if (typeof dm[kk].time === 'string') {
                                    var timeStr = (dm[kk].time).split('000Z');
                                    if (timeStr != null) {
                                        if (jj === (this.dataModel.models.length-1)) {
                                            var endTimeString = timeStr[1];
                                            timeValue = new Date(endTimeString.slice(1,endTimeString.length) + '000Z');
                                        } else {
                                            timeValue = new Date(timeStr[0] + '000Z');
                                        }
                                    }
                                } else {
                                    timeValue = dm[kk].time;
                                }
                                singleDataPoint.push(timeValue.getTime());
                                singleDataPoint.push(dm[kk].value);
                                break;
                            }
                        }
                    }
                    if(singleDataPoint.length > 0) {
                        points.push(singleDataPoint);
                    }
                }
                seriesData.push({name: seriesLabels[ii], points: points});
            }

            var options = {
                yAxisTitle: '',
                data: seriesData
            };

            var conf = {
                container: this.$el,
                options: options
            };

            this.renderTimeSeriesChart(conf);

            return this;
        },

        _displayTimeSeriesChart: function () {
            var seriesData = [];
            var applicationsCategories = _.pluck(this.dataModel.models[0].attributes['time-value'], 'key');

            for (var ii = 0; ii < applicationsCategories.length; ii++) {

                var seriesObj = {};
                seriesObj.name = applicationsCategories[ii];
                seriesObj.points = [];

                var result = this.dataModel.at(ii).get('time-value');
                if (result) {
                    // Backend sends result[jj].time in this format: 2015-08-24T23:03:45.000Z-2015-08-24T23:08:33.000Z
                    // We need to first convert it to: 2015-08-24T23:03:45.000Z
                    // and send something like 1440457658000 to the time-series widget
                    for (var jj = 0, len = result.length; jj < len; jj++) {
                        var timeValue = "";
                        if (typeof result[jj].time === 'string') {
                            var timeStr = (result[jj].time).split('000Z');
                            if (timeStr != null) {
                                timeValue = new Date(timeStr[0] + '000Z');
                            }
                        } else {
                            timeValue = result[jj].time;
                        }
                        seriesObj.points.push([
                            timeValue.getTime(),
                            Number(result[jj].value)
                        ]);
                    }
                    seriesData.push(seriesObj);
                }

            }

            var options = {
                yAxisTitle: '',
                data: seriesData
            };

            var conf = {
                container: this.$el,
                options: options
            };

            this.renderTimeSeriesChart(conf);

            return this;
        },

        refresh: function (done, proposedModel) {
            if (this.dataModel.length === 0) {
                this.$el.empty();
            }
            if (proposedModel) {
                var customInitData = proposedModel.get('customInitData');
                this.customData.chartType = customInitData.chartType;
                this.customData.auto_refresh = customInitData.auto_refresh;
                this.customData.queryParams.count = customInitData.show_top;
            }
            this.getData(done);
        },

        moreDetails: function() {
            var self = this;
            var mimeType = 'vnd.juniper.net.eventlogs.alleventcategories';
            if (this.dashletConf.params.mime_type) {
                mimeType = this.dashletConf.params.mime_type;
            }
            var aggregationAttributes = this.customData.queryParams['aggregation-attributes'] || [];
            if($.isArray(aggregationAttributes)) {
                if (aggregationAttributes.length > 0) {
                    aggregationAttributes = aggregationAttributes[0];
                }
            }
            var request = {
                "dontPersistAdvancedSearch": true,
                'timeRange' : {
                    'startTime' : this.dataModel.startTime,
                    'endTime'   : this.dataModel.endTime
                },
                'aggregation-attributes' : aggregationAttributes,
                'filters': {}
            };

            try {
                if (this.customData.queryParams.filters) {
                    if (this.customData.queryParams.filters.or) {
                        request.filters.or = [];
                        request.filters.or.push(self.customData.queryParams.filters);
                    }
                    else if (this.customData.queryParams.filters.and) {
                        request.filters.and = [];
                        request.filters.and.push(self.customData.queryParams.filters);
                    }
                    // else if (this.customData.queryParams.filters.filter) {
                    //     request.filters.filter = [];
                    //     request.filters.filter.push({'filter' : self.customData.queryParams.filters.filter});
                    // }
                }
            } catch(e) {
                // do nothing
            }
            // start related activity for the clicked category
            var intent = new Slipstream.SDK.Intent(
                'slipstream.intent.action.ACTION_LIST',
                { mime_type: mimeType }
            );
            intent.putExtras(request);  // send the request obj containing startTime, endTime abnd filters
            this.context.startActivity(intent);
        },

        close: function(deleteDashlet) {
            this.$el.remove();
            this.stopListening();
            this.customData = null;
            return this;
        }
    });

    return DashletView;
});
