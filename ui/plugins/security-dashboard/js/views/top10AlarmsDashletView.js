/**
 * A module that acts as a base class for Orpheus dashlet views
 *
 * @module top10AlarmsDashletView
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../models/alarmsDataCollection.js',
    '../views/top10DeviceDashletView.js',
    '../conf/defaultDashletConf.js'
    ], function (AlarmsDataCollection, Top10DashletView, DashletConf) {
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
            this.dataModel = new AlarmsDataCollection();
            this.dataModel.on('sync', this.displayChart, this);

            return this;
        },

        moreDetails: function() {
            var self = this;
            var mimeType = 'vnd.juniper.net.alarms';
            if (this.dashletConf.params.mime_type) {
                mimeType = this.dashletConf.params.mime_type;
            }
            var aggregationAttributes = this.customData.queryParams['aggregation-attributes'] || [];
            var request = {
                'timeRange' : {
                    'startTime' : this.dataModel.startTime,
                    'endTime'   : this.dataModel.endTime
                },
                'aggregation-attributes' : aggregationAttributes,
                'filters': {}
            };

            if (this.customData.selectedFilter) {
                request.filters = { 'severity' : this.customData.selectedFilter };
            }
            // start related activity for the clicked category
            var intent = new Slipstream.SDK.Intent(
                'slipstream.intent.action.ACTION_LIST',
                { mime_type: mimeType }
            );
            intent.putExtras(request);  // send the request obj containing startTime, endTime abnd filters
            this.context.startActivity(intent);
        },

        getData: function (done) {
            var self = this;
            var queryParams = $.extend(true, {}, this.customData.queryParams);
            var epoch = (new Date).getTime();
            queryParams['end-time'] = epoch;
            if (this.filters) {
                for (var ii = 0; ii < this.filters.length && ii < 3; ii++) {
                    var filter = this.filters[ii];
                    if (filter.name === 'dashlet_alarms_severity_filter') {
                        for (var jj = 0; jj < filter.values.length; jj++) {
                            if (filter.values[jj].selected) {
                                queryParams['severity'] = filter.values[jj].value;
                                this.customData.selectedFilter = filter.values[jj].value;
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
        }  
     });

    return DashletView;
});