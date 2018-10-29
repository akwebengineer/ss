/**
 * A module that acts as a base class for Orpheus dashlet views
 *
 * @module top10SessionsDashletView
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../models/sessionsDataCollection.js',
    '../views/top10DeviceTrafficDashletView.js',
    '../conf/defaultDashletConf.js'
    ], function (DeviceDataCollection, Top10DashletView, DashletConf) {
       /**
     * Constructs a DashletView
     */
     var DashletView = Top10DashletView.extend({     
        initialize: function () {
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
            this.dataModel = new DeviceDataCollection();
            this.dataModel.on('sync', this.displayChart, this);

            return this;
        },

        displayTimeSeriesChart: function () {
            var seriesData = [];
            var applicationsCategories = _.map(_.pluck(this.dataModel.models, 'attributes'), function (x) { return x['key'] });
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
                        var timeValue = result[jj].time;
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

        getData: function (done) {
            var self = this;
            var queryParams = $.extend(true, {}, this.customData.queryParams);
            var rankBy = queryParams['rank-by'].split('-')[1];
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
                    if (filter.name === 'dashlet_viewby_filter') {
                        for (var jj = 0; jj < filter.values.length; jj++) {
                            if (filter.values[jj].selected) {
                                queryParams['rank-by'] = filter.values[jj].value.trim() + '-' + rankBy;
                            }
                        }
                    }                    
                }
            }
            if (queryParams['start-time'] === undefined) {
                queryParams['start-time'] = epoch - this.conf.getValues().defaults.timeRange;
            }
            if (this.customData.chartType === 'timeSeriesChart') {
                queryParams['sample-values'] = true;
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

        moreDetails: function() {
            var request = {
                'timeRange' : {
                    'startTime' : this.dataModel.startTime,
                    'endTime'   : this.dataModel.endTime
                },
                'filters': {'resource' : this.customData.queryParams.resource}
            };
            var mimeType = 'vnd.juniper.sd.device-management.devices';
            // start related activity for the clicked category
            var intent = new Slipstream.SDK.Intent(
                'slipstream.intent.action.ACTION_LIST',
                { mime_type: mimeType }
            );
            intent.putExtras(request);  // send the request obj containing startTime, endTime and filters
            this.context.startActivity(intent);            
        }     
     });

    return DashletView;
});