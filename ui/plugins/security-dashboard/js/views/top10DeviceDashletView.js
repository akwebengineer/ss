/**
 * A module that acts as a base class for Orpheus dashlet views
 *
 * @module top10DeviceDashletView
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../models/deviceDataCollection.js',
    '../views/top10DashletView.js',
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

        getData: function (done) {
            var self = this;
            var queryParams = this.customData.queryParams;
            if(this.customData.queryParams.moreDetails){
                this.moreDetailsParams = this.customData.queryParams.moreDetails;
            }
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
            var maxResults = queryParams.count;            
            queryParams['max-results'] = maxResults;

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

            if (this.moreDetailsParams) {
                if (this.moreDetailsParams.sortBy) {
                    request.sortBy = this.moreDetailsParams.sortBy;
                }
                if (this.moreDetailsParams.filterBy) {
                    request.filterBy = this.moreDetailsParams.filterBy;
                }
            }

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