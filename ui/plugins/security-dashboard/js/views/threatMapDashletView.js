/**
 * Module that implements the ThreatMapDashletView.
 *
 * @module ThreatMapDashletView
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

 define([
    'backbone',
    'lib/template_renderer/template_renderer',
    '../models/threatMapDashletModel.js',
    '../models/RequestConfig.js',
    '../conf/defaultDashletConf.js',
    'widgets/map/mapWidget',
    'widgets/map/models/CountriesMap',
    'text!../../templates/threatMapTemplate.html',
    'text!../../templates/threatMapPopoverTemplate.html',
    'text!../../templates/threatMapLegendTemplate.html',
    'text!../../templates/threatMapLegendTitleTemplate.html',
    'text!../../templates/threatMapUnknownCountryTemplate.html',
    'text!../../templates/threatMapHoverTemplate.html'
    ], function (Backbone,
                 TemplateRenderer,
                 ThreatMapDashletModel,
                 RequestConfig,
                 DashletConf,
                 MapWidget,
                 CountriesMap,
                 ThreatMapTemplate,
                 PopoverThreatsTemplate,
                 LegendThreatsTemplate,
                 LegendTitleThreatsTemplate,
                 UnknownCountryTemplate,
                 HoverTemplate) {
    /**
     * Constructs a ThreatMapDashletView
     */
     var ThreatMapDashletView = Backbone.View.extend({
        events: {
            'click .threat-count-link': 'threatCountLink'
        },
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
            this.model = new ThreatMapDashletModel({
                'threatType' : this.customData.threatType
            });
            this.model.on('sync', this.displayMap, this);

            return this;
        },

        getData: function (done) {
            var self = this;
            var endTime = new Date();
            var startTime = new Date(endTime.getTime() - this.conf.getValues().defaults.timeRange);
            var viewBy = 'source';

            if (this.filters) {
                for (var ii = 0; ii < this.filters.length && ii < 3; ii++) {
                    var filter = this.filters[ii];
                    if (filter.name === 'dashlet_previous_filter') {
                        for (var jj = 0; jj < filter.values.length; jj++) {
                            if (filter.values[jj].selected) {
                                startTime = new Date(endTime.getTime() - filter.values[jj].value);
                            }
                        }
                    }
                    if (filter.name === 'dashlet_viewby_filter') {
                        for (var jj = 0; jj < filter.values.length; jj++) {
                            if (filter.values[jj].selected) {
                                viewBy = (filter.values[jj].value);
                            }
                        }
                    }
                }
            }

            this.model.fetch({
                startTime: startTime,
                endTime: endTime,
                viewBy: viewBy, //'source' or 'destination'
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

        /**
         * Render the DOM containing the threat map view.
         * 
         * returns this object
         */
        displayMap: function() {
            var self = this;
            var html = TemplateRenderer(ThreatMapTemplate, null);
            this.$el.html(html);

            // For getColor and legend
            var maxThreatCount = this.model.get('maxThreatCount');

            var tiers = 3,//5,
                max = (maxThreatCount >= tiers) ? maxThreatCount : tiers,
                rangeConst = Math.floor(max/tiers),
                colorArray = ['#9fd4fe','#58c7da', '#589bd5', '#4d597d'];

            var geoJsonCountries = new CountriesMap().get('geoJsonCountries');
            for (var i = 0; i < geoJsonCountries.features.length; ++i) {
                var countryCode2 = geoJsonCountries.features[i].properties.iso_a2;
                var country = this.model.get('countries').get(countryCode2);
                if (country) {
                    geoJsonCountries.features[i].properties.threatEventCount = country.get('threatCount');
                } else {
                    geoJsonCountries.features[i].properties.threatEventCount = 0;
                }
            }

            var mapWidgetObj = new MapWidget({
                'container': this.$el.find('.leaflet-map'),
                'geoJsonObject' : geoJsonCountries,
                'options' : {
                    'getUnknownCountryDataProperty' : function () {
                        var modelsArray = self.model.get('countries').models;
                        for ( var i = 0 ; i < modelsArray.length; i++ ) {
                            if(modelsArray[i].get('id').toLowerCase() === 'qq') {
                                return modelsArray[i].get('threatCount');
                            }
                        }
                       return 0;
                    },
                    'getPopoverContent' : function (countryObject) {
                        var country = countryObject.properties.iso_a2.toLowerCase();
                        if(country === 'qq') {
                            var countryObj = self.model.get('countries').get('QQ');
                            if(countryObj) {
                                var contentString = TemplateRenderer(UnknownCountryTemplate, {country_abbrev: 'qq', country_name: countryObj.get('countryName'), threat_event_ct: countryObj.get('threatCount') });
                                return contentString;
                            } else {
                                var contentString = TemplateRenderer(UnknownCountryTemplate, {country_abbrev: country, country_name: countryObject.properties.name, threat_event_ct: countryObject.properties.threatEventCount });
                                return contentString;
                            }
                        } else {
                            var contentString = TemplateRenderer(HoverTemplate, {country_abbrev: country, country_name: countryObject.properties.name, threat_event_ct: countryObject.properties.threatEventCount });
                            return contentString;
                        }
                    },
                    'highlightCountryStyle' : {
                        weight          : 1,
                        color           : 'white',        // outline color on highlight
                        dashArray       : '2',
                        fillOpacity     : 0.7,
                        fillColor       : '#aac712'        // fill color on highlight
                    },
                    'dataPropertyKey'  : 'threatEventCount',
                    'zoomLevel'        : 1.65,
                    'minZoom'          : 1.5,
                    'defaultCountryStyle' : {
                        weight          : 1,
                        opacity         : 1,
                        color           : 'white',         // outline color
                        dashArray       : '2',
                        fillOpacity     : 0.7
                    },
                    'getColor'          : function(threatCount) {      // color is based on 'threatEventCount per country.'
                        var color = colorArray[0];
                        if (threatCount === 0) {
                            return colorArray[0];
                        } else if ( threatCount > 1 && threatCount <= rangeConst*1 ) {
                            return colorArray[1];
                        } else if ( threatCount > rangeConst*1 && threatCount <= rangeConst * 2 ) {
                            return colorArray[2];
                        } else if ( threatCount > rangeConst * 2 ) {
                            return colorArray[3];
                        }
                        return color;
                    },
                    mapBackgroundColor: '#fff',
                    'legends' : [
                                    {
                                        'position' : 'bottomleft',
                                        'content'  : function(getColorFunction) {
                                            var grades = [0, rangeConst, rangeConst*2, rangeConst*3];
                                            var row = TemplateRenderer(LegendThreatsTemplate, {
                                                        color: getColorFunction(0),
                                                        range: 0
                                                    });
                                            var contentString = row;
                                            // loop through our density intervals and generate a label with a colored square for each interval
                                            for (var i = 1; i < grades.length; i++) {
                                                var color = getColorFunction(grades[i]);
                                                    var startRange = 1 + grades[i-1];   // the leading plus 1 is b/c the scale measurements begin at 1, not 0.
                                                    var endRange = '-' + (grades[i]);
                                                    if(i === grades.length-1){
                                                        endRange = '+';
                                                    }
                                                    var range = startRange + endRange;

                                                    row = TemplateRenderer(LegendThreatsTemplate, {
                                                        color: color,
                                                        range: range
                                                    });
                                                    contentString = row + contentString;
                                            }
                                            contentString = TemplateRenderer(LegendTitleThreatsTemplate, {title: 'Threat Count'}) + contentString;
                                            return contentString;
                                        }
                                    }
                    ]
                }
            });

            mapWidgetObj.build();
            return this;
        },

        threatCountLink: function (e) {
            e.preventDefault();
            var mimeType = '';
            var filterBy = 'src';
            if (this.model.get('viewBy') === 'destination') {
                filterBy = 'dst';
            }

            var countryCode = $($($(e.target.parentElement.parentElement).find('.flag-wrapper'))[0]).prop('class').split('flag-icon-')[1].toUpperCase();
            var request = {
                "dontPersistAdvancedSearch": true,
                'timeRange' : {
                    'startTime' : this.model.get('startTime'),
                    'endTime'   : this.model.get('endTime')
                },
                'aggregation-attributes' : filterBy + '-country-name',
                'filters': {}
            };

            switch (this.model.get('threatType')) {
                case 'ips':
                    mimeType = 'vnd.juniper.net.eventlogs.ips';
                    request.filters.or = RequestConfig.getIPSThreatFilters();
                    break;
                case 'antivirus':
                    mimeType = 'vnd.juniper.net.eventlogs.antivirus';
                    request.filters.or = RequestConfig.getAntivirusThreatFilters();
                    break;
                case 'antispam':
                    mimeType = 'vnd.juniper.net.eventlogs.antispam';
                    request.filters.or = RequestConfig.getAntispamThreatFilters();
                    break;
                case 'device-authentication':
                default:
                    mimeType = 'vnd.juniper.net.eventlogs.alleventcategories';
                    request.filters.or = RequestConfig.getDeviceAuthThreatFilters();
                    break;
            }

            var countryName = $($(e.target.parentElement.parentElement).find('.country-name')[0]).text().trim();
            request.filters.and = [];
            if(countryCode ==='QQ') {
                var unknown_AndFilters = {};
                if( this.model.get('viewBy') === 'source') {
                    if (this.model.get('threatType') === 'ips') {
                        unknown_AndFilters = RequestConfig.getUnknownSourceIPSFilters();
                    } else if (this.model.get('threatType') === 'antivirus') {
                        unknown_AndFilters = RequestConfig.getUnknownSourceAntiVirusFilters();
                    }
                } else if (this.model.get('viewBy') === 'destination') {
                    if (this.model.get('threatType') === 'ips') {
                        unknown_AndFilters = RequestConfig.getUnknownDestIPSFilters();
                    } else if (this.model.get('threatType') === 'antivirus') {
                        unknown_AndFilters = RequestConfig.getUnknownDestAntiVirusFilters();
                    }
                }
                request.filters.and.push(unknown_AndFilters['filters']['and'][0]);
            } else {
                request.filters.and.push({'filter':{
                        'key'       : filterBy + '-country-name',
                        'operator'  : 'EQUALS',
                        'value'     : countryName
                }});
            }

            // start related activity for the clicked category
            var intent = new Slipstream.SDK.Intent(
                'slipstream.intent.action.ACTION_LIST',
                { mime_type: mimeType }
            );
            intent.putExtras(request);  // send the request obj containing startTime, endTime abnd filters
            this.context.startActivity(intent);
        },

        refresh: function (done, proposedModel) {
            if (proposedModel) {
                var customInitData = proposedModel.get('customInitData');
                this.customData.chartType = customInitData.chartType;
                this.customData.auto_refresh = customInitData.auto_refresh;
                this.customData.queryParams.count = customInitData.show_top;
            }
            this.getData(done);
        },

        moreDetails: function() {
            var mimeType = '';
            var filterBy = 'src';
            if (this.model.get('viewBy') === 'destination') {
                filterBy = 'dst';
            }
            var request = {
                'timeRange' : {
                    'startTime' : this.model.get('startTime'),
                    'endTime'   : this.model.get('endTime')
                },
                'aggregation-attributes' : filterBy + '-country-name',
                'filters': {}
            };
            switch (this.model.get('threatType')) {
                case 'ips':
                    mimeType = 'vnd.juniper.net.eventlogs.ips';
                    request.filters.or = RequestConfig.getIPSThreatFilters();
                    break;
                case 'antivirus':
                    mimeType = 'vnd.juniper.net.eventlogs.antivirus';
                    request.filters.or = RequestConfig.getAntivirusThreatFilters();
                    break;
                case 'antispam':
                    mimeType = 'vnd.juniper.net.eventlogs.antispam';
                    request.filters.or = RequestConfig.getAntispamThreatFilters();
                    break;
                case 'device-authentication':
                default:
                    mimeType = 'vnd.juniper.net.eventlogs.alleventcategories';
                    request.filters.or = RequestConfig.getDeviceAuthThreatFilters();
                    break;
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

    return ThreatMapDashletView;
});