/**
 * Module that implements the ThreatMapView.
 *
 * This view implements an insight bar showing various threat counts since mid-night 
 * and a sudo-real time animation for showing when a recent attack happened in what
 * part of the world. Since we don't have server pushed events (or using web-sockets), 
 * currently this view (client) polls at regular intervals (eg. 30 seconds). Since just 
 * polling and getting delta (new threats just happened in last 30 seconds) would not 
 * animate well to resemble real time activity, when the view is rendered for the first 
 * time, the data is obtained since midnight and now -minus 30 seconds behind time. Then 
 * insight bar is updated with these threat counts and also a fresh query to get delta
 * data for last 30 seconds is issued, which when obtained, the animation begins using a 
 * second timer and if at particular second a recent (in last 30 seconds) threat is found 
 * is animated and insight bar is updated with this new threat information. So the animation
 * is always running 30 seconds behind from the current now time. Since polling and animation 
 * consumes a lot of resources (network and cpu) and processing, polling occurs only when the 
 * view is rendered. As soon as another view (different than this threat-map) is displayed,
 * all polling and involved timers (intervals) are stopped.
 *
 * Note: a threat when detected by an SRX has already happened in recent times and for the 
 * backend (SD, LogCollector, ElasticSearch, etc) takes some time to make this threat available 
 * for UI consumption.  
 *
 * @module ThreatMapView
 * @author Jangul Aslam <jaslam@juniper.net>
 * @author Dennis Park <dpark@juniper.net> 
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'marionette',
    'lib/template_renderer/template_renderer',
    'text!../templates/threatMapTemplate.html',
    'widgets/map/mapWidget',
    'widgets/map/models/CountriesMap',
    'text!../templates/legendsTemplate.html',
    'text!../templates/countryDetailsTemplate.html',
    'text!../templates/topDevicesTemplate.html',
    'text!../templates/topCountriesTemplate.html',
    '../models/InsightBarModel.js',
    '../models/LiveMapModel.js',
    '../models/CountryDetailsModel.js',
    '../models/UnknownCountryDetailsModel.js',
    '../models/RequestConfig.js',
    '../models/RequestData.js',
    "text!../../../ui-common/js/common/templates/helpToolTip.html",
    'widgets/tooltip/tooltipWidget',
    './countryDetailsView.js',
    './rightPanelView.js'
], function (
    Marionette,
    TemplateRenderer,
    threatMapTemplate,
    MapWidget,
    CountriesMap,
    legendsTemplate,
    countryDetailsTemplate,
    topDevicesTemplate,
    topCountriesTemplate,
    InsightBarModel,
    LiveMapModel,
    CountryDetailsModel,
    UnknownCountryDetailsModel,
    RequestConfig,
    RequestData,
    HelpTemplate,
    TooltipWidget,
    CountryDetailsView,
    RightPanelView
) {
    var ThreatMapView = Marionette.ItemView.extend({
        pollInterval: 30 * 1000,    // every 30 seconds

        events: {
            'click .play-button'    : 'togglePlayPause',
            'click .pause-button'   : 'togglePlayPause',
            'click .total-threat-count'     : 'onClickThreatCount',
            'click .individual-threat-count': 'onClickThreatCount',
            'click .device'     : 'onClickDevice',
            'click .country'    : 'onClickCountry',
            'click #layout-view': 'showRightPanel',
            'click #block-inbound' : 'invokeInboundBlock',
            'click #block-outbound' : 'invokeOutboundBlock',
            'click #block-traffic': 'invokeBlockAllTraffic',
            'click .total-events-count': 'onTotalEventsClick'
        },
        animationDelayBuffer: {},
        /**
         * The constructor for the threats landing page view.
         * 
         * @param {Object} options - The options containing the Slipstream's context
         */
        initialize: function(options) {
            this.context = options.context;
            this.geoJsonCountries = new CountriesMap().get('geoJsonCountries');
            this.model = {};
            this.model.insightBar = new InsightBarModel();
            this.model.insightBar.on('sync', this.onInsightBarModelSync.bind(this));
            this.model.liveMap = new LiveMapModel();
            this.model.liveMap.on('sync', this.onLiveMapModelSync.bind(this));

            this.threatMapConf = {
                'threatmap_insight_bar_title'               : this.context.getMessage("threatmap_insight_bar_title"),
                'threatmap_insight_bar_desc'                : this.context.getMessage("threatmap_insight_bar_desc"),
                'threatmap_insight_bar_total_count'         : this.context.getMessage("threatmap_insight_bar_total_count"),
                'threatmap_insight_bar_total_threats'       : this.context.getMessage("threatmap_insight_bar_total_threats"),
                'threatmap_insight_bar_ips'                 : this.context.getMessage("threatmap_insight_bar_ips"),
                'threatmap_insight_bar_antivirus'           : this.context.getMessage("threatmap_insight_bar_antivirus"),
                'threatmap_insight_bar_spam'                : this.context.getMessage("threatmap_insight_bar_spam"),
                'threatmap_insight_bar_auth'                : this.context.getMessage("threatmap_insight_bar_auth"),
                'threatmap_insight_bar_top_dest_devices'    : this.context.getMessage("threatmap_insight_bar_top_dest_devices"),
                'threatmap_insight_bar_top_dest_cntry'      : this.context.getMessage("threatmap_insight_bar_top_dest_cntry"),
                'threatmap_insight_bar_top_src_cntry'       : this.context.getMessage("threatmap_insight_bar_top_src_cntry"),
                'threatmap_legend_source'                   : this.context.getMessage("threatmap_legend_source"),
                'threatmap_legend_dest'                     : this.context.getMessage("threatmap_legend_dest")
            };
        },

        getToolTipView: function(help){
            var tooltipView  = TemplateRenderer(HelpTemplate,{
                'help-content':help['content'],
                'ua-help-text':help['ua-help-text'],
                'ua-help-identifier':help['ua-help-identifier']
            });
            return $(tooltipView);
        },

        addToolTipHelp: function(help){
            new TooltipWidget({
                "elements": {
                    "interactive": true,
                    "maxWidth": 300,
                    "minWidth": 300,
                    "position": "right"
                },
                "container": this.$el.find('.threatmap-title-help'),
                "view": this.getToolTipView(help)
            }).build();
        },

        /**
         * Render the DOM containing the threats map view.
         * 
         * returns this object
         */
        render: function() {
            var self = this,
                html = TemplateRenderer(threatMapTemplate, this.threatMapConf);
            this.now = new Date();
            this.$el.append(html);
            this.$el.addClass('threatMap');
            var heading = {
                "title": self.context.getMessage("threatmap_insight_bar_title"),
                "title-help":{
                    "content" : self.context.getMessage("threatmap_help_tooltip"),
                    "ua-help-text": self.context.getMessage("more_link"),
                    "ua-help-identifier": self.context.getHelpKey("THREAT_MAP_OVERVIEW")
                }
            };
            this.intent = new Slipstream.SDK.Intent('slipstream.intent.action.ACTION_LIST', { mime_type: 'vnd.juniper.net.eventlogs.alleventcategories'});
            this.intent["context"] = this.context;

            this.now.setMilliseconds(0);
            this.endTime     = new Date(this.now.getTime() - this.pollInterval);       // ends at poll interval behind
            this.startTime   = new Date(this.endTime.getFullYear(), this.endTime.getMonth(), this.endTime.getDate());    // start at midnight
            this.timeRange   = {
                "startTime": this.startTime,
                "endTime": this.endTime
            };

            this.addToolTipHelp(heading['title-help']);
            // add map widget
            this.map = new MapWidget({
                'container': this.$el.find('.leaflet-map'),
                'geoJsonObject' : this.geoJsonCountries,
                'popupMinWidth': 340,
                'options' : {
                    'zoomLevel' : 2.35,
                    'unknownCountry' : {
                        'defaultImage' : "/installed_plugins/threatMap/images/icon_unknown_live.svg"
                    },
                    //'getHoverContent' : function(country) {
                    'getPopoverContent' : function(country) {
                        self.rightPanelView && self.rightPanelView.remove();
                        var countryDetailsView = new CountryDetailsView({
                            model: this.model,
                            geoJsonFeature: country,
                            context: this.context,
                            activity: this.intent,
                            now: this.now,
                            timeRange: this.timeRange
                        });
                        countryDetailsView.render();
                        return countryDetailsView.el;

                    }.bind(this),
                    mapBackgroundColor: 'black',
                    defaultCountriesColor : 'black',
                    isDraggable : true,
                    zoomControl: true,
                    defaultCountryStyle: {
                        weight          : 2,
                        color           : '#95c1e7',
                        dashArray       : '',
                        fillOpacity     : 1
                    },
                    highlightCountryStyle: {
                        weight          : 3,
                        color           : '#95c1e7',
                        dashArray       : '',
                        fillOpacity     : 1
                    },
                    legends: [
                        {
                            position: 'bottomleft',
                            content: function() {
                                return TemplateRenderer(legendsTemplate, self.threatMapConf);
                            }
                        }
                    ]
                }
            });
            this.map.build();

            // create source and destination markers
            this.map.createMarkerType("srcMarker", "/installed_plugins/threatMap/images/source.svg");
            this.map.createMarkerType("destMarker", "/installed_plugins/threatMap/images/destination.svg");

            this.$totalThreatCount = this.$el.find('#total-threats');
            this.$ipsThreatCount = this.$el.find('#ips-threats');
            this.$avThreatCount = this.$el.find('#antivirus-threats');
            this.$asThreatCount = this.$el.find('#antispam-threats');
            this.$daThreatCount = this.$el.find('#device-authentication-threats');
            this.$currentTime = this.$el.find('#current-time');

            this.$playButton = this.$el.find('.play-button');
            this.$playButton.hide();
            this.$pauseButton = this.$el.find('.pause-button');
            this.$pauseButton.show();

            this.startPolling();

            return this;
        },

        onClickThreatCount: function(e) {
            var eventType = $(e.currentTarget).prop('id'), isRightPanel = false,
                isInbound = false, targetID = $(e.currentTarget).prop('id');
            if(targetID.indexOf('dst-') > -1) {
                eventType = eventType.replace('dst-', '');
                isInbound = false;
                isRightPanel = true;
            }
            if(targetID.indexOf('src-') > -1) {
                eventType = eventType.replace('src-', '');
                isInbound = true;
                isRightPanel = true;
            }
            eventType = eventType.replace('-threats', '');

            var mimeType = '';
            var request = {
                'timeRange': {
                    'startTime': this.model.insightBar.get('startTime'),
                    'endTime': this.model.insightBar.get('endTime')
                },
                'filters': {}
            };
            switch (eventType) {
                case 'total':
                    mimeType = 'vnd.juniper.net.eventlogs.alleventcategories';
                    request.filters.or = RequestConfig.getAllThreatFilters();
                    break;
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
            if(isRightPanel) {
                var countryName = this.model.countryDetails.get('countryName');
                request.filters.and = RequestConfig.getCountryNameFilters(countryName, isInbound);
            }

            intent.putExtras(request);  // send the request obj containing startTime, endTime and filters
            this.context.startActivity(intent);
        },

        onClickDevice: function(e) {
            // get clicked device name
            var attrVal = e.currentTarget.textContent.trim();
            var device = attrVal.slice(0, attrVal.indexOf(' ('));

            var request = {
                'timeRange': {
                    'startTime': this.model.insightBar.get('startTime'),
                    'endTime': this.model.insightBar.get('endTime')
                },
                'filters': {}
            };

            request.filters.and = RequestConfig.getDeviceFilters([device]);
            request.filters.or = RequestConfig.getAllThreatFilters();

            // start related activity for the clicked category
            var intent = new Slipstream.SDK.Intent(
                'slipstream.intent.action.ACTION_LIST', 
                { mime_type: 'vnd.juniper.net.eventlogs.alleventcategories' }
            );
            intent.putExtras(request);  // send the request obj containing startTime, endTime abnd filters
            this.context.startActivity(intent);
        },

        onClickCountry: function(e) {
            // get clicked country code
            var attrVal = $(e.currentTarget).find('div').prop('class');
            var countryCode = attrVal.slice(attrVal.length - 2).toUpperCase();
            var request = {
                'dontPersistAdvancedSearch': true,
                'timeRange': {
                    'startTime': this.model.insightBar.get('startTime'),
                    'endTime': this.model.insightBar.get('endTime')
                },
                'filters': {}
            };

            // get source or destination
            attrVal = $(e.target).parent().parent().prop('id');
            if (attrVal.indexOf('source') != -1) {
                request.filters.and = RequestConfig.getCountryFilters([countryCode], true);
            } else {
                request.filters.and = RequestConfig.getCountryFilters([countryCode], false);
            }

            // get all threats filter
            request.filters.or = RequestConfig.getAllThreatFilters();
//            request.aggregation = 'src-country-code2';

            // start related activity for the clicked category
            var intent = new Slipstream.SDK.Intent(
                'slipstream.intent.action.ACTION_LIST', 
                { mime_type: 'vnd.juniper.net.eventlogs.alleventcategories' }
            );
            intent.putExtras(request);  // send the request obj containing startTime, endTime abnd filters
            this.context.startActivity(intent);
        },

        onTotalEventsClick: function(e) {
            // get clicked country code
            var countryName = this.model.countryDetails.get('countryName'),
                request = RequestData.getFiltersRequestBody(this.timeRange, countryName);

            // start related activity for the clicked category
            var intent = new Slipstream.SDK.Intent(
                'slipstream.intent.action.ACTION_LIST',
                { mime_type: 'vnd.juniper.net.eventlogs.alleventcategories' }
            );
            intent.putExtras(request);  // send the request obj containing startTime, endTime and filters
            this.context.startActivity(intent);
        },

        onShow: function() {
            // hide secondary navigation
            Slipstream.commands.execute("ui:setSecondaryNavigationVisibility", false);

            this.map.invalidateSize();
        },

        startPolling: function() {
            // start refresh interval for every 5 minutes to pull data from backend
            this.onPollInterval();   // invoke once to fetch data initially
            this.pollIntervalID = setInterval(this.onPollInterval.bind(this), this.pollInterval);
            // start seconds timer for running a clock with seconds precision
            this.everySecondsIntervalID = setInterval(this.onEverySecondInterval.bind(this), 1000);
        },

        stopPolling: function() {
            // stop both intervals
            clearInterval(this.pollIntervalID);
            clearInterval(this.everySecondsIntervalID);
            var keys = Object.keys(this.animationDelayBuffer);
            for (var i = 0; i < keys.length; i++) {
                clearInterval(this.animationDelayBuffer[keys[i]]);
                delete this.animationDelayBuffer[keys[i]];                
            }
        },

        togglePlayPause: function(e) {
            if (this.$playButton.is(":visible")) {
                this.startPolling();
                this.$playButton.hide();
                this.$pauseButton.show();
            } else {
                this.stopPolling();
                this.$playButton.show();
                this.$pauseButton.hide();
            }
        },

        onInsightBarModelSync: function() {
            console.log('insightbar-model synced for time-range: ' 
                + this.model.insightBar.get('startTime').toLocaleTimeString() 
                + '/' + this.model.insightBar.get('endTime').toLocaleTimeString()
                + ', threat-count: ' + this.model.insightBar.get('totalCount'));

            this.updateInsightBarCounts();
            this.updateInsightBarTops();
        },

        onLiveMapModelSync:  function() {
            console.log('livemap-model synced for time-range: ' 
                + this.model.liveMap.get('startTime').toLocaleTimeString() 
                + '/' + this.model.liveMap.get('endTime').toLocaleTimeString()
                + ', delta threat-count: ' + this.model.liveMap.get('threats').size());
        },

        onPollInterval: function() {
            var now = new Date();
            now.setMilliseconds(0);

            this.model.insightBar.fetch({
                now: now,
                pollInterval: this.pollInterval
            });
            this.model.liveMap.fetch({
                now: now,
                pollInterval: this.pollInterval
            });
        },

        /**
         * Every seconds interval handler.
         */
         onEverySecondInterval: function() {
            // get the 30 seconds behind time from now
            var start = this.model.liveMap.get('animationStartTime');
            if (start === 0) {
                return;
            }
            start = start;
            var end = new Date( this.model.liveMap.get('endTime') ).getTime();

            this.$currentTime.text(new Date(start).toLocaleString());

            // do nothing until 30 seconds delta threats are available
            if (this.model.liveMap.get('threats').size() === 0) {
                return;
            }

            // search for all threats in this delta 30 seconds with timestamp at this behind time (1 seconds precision)
            var threats =  _.filter( this.model.liveMap.get('threats').models, function(threatEvent) {
                var threatEventTime = threatEvent.get('milliseconds');
                if( threatEventTime >= start  && (threatEventTime < start + 1000 ) ) {
                    return threatEventTime;
                }
            } );

            var animTime = this.model.liveMap.get('animationStartTime');
            this.model.liveMap.set('animationStartTime', animTime + 1000 );

            if (threats.length === 0) {
                return;
            }

            // console.log('length:' + threats.length + ' for this one second interval ');

            var animationInterval = ( 1000 ) / threats.length;
            var self = this;
            var i = 0;
            function animationLoopDelayer(){
                var animationHandle = setTimeout(function(){  
                    if(i < threats.length){
                        var threat = threats[i].get('uiModel');
                        self.updateInsightBar(threat);
                        if (! (threat.src.lat === undefined && threat.dest.lat === undefined)) {
                            self.animateLine(threat);
                            delete self.animationDelayBuffer[animationHandle];
                        }                        
                        animationLoopDelayer();
                    }
                    i++;
                },animationInterval);
                self.animationDelayBuffer[animationHandle] = animationHandle; 
            };
            animationLoopDelayer();
        },

        updateInsightBar: function(threat) {
            var count = this.model.insightBar.get('totalCount');
            this.model.insightBar.set('totalCount', ++count);
 
            if (threat.attackType === 'ips') {
                count = this.model.insightBar.get('ipsCount');
                this.model.insightBar.set('ipsCount', ++count);
            } else if (threat.attackType === 'antivirus') {
                count = this.model.insightBar.get('avCount');
                this.model.insightBar.set('avCount', ++count);
            } else if (threat.attackType === 'antispam') {
                count = this.model.insightBar.get('asCount');
                this.model.insightBar.set('asCount', ++count);
            } else if (threat.attackType === 'device-authentication') {
                count = this.model.insightBar.get('daCount');
                this.model.insightBar.set('daCount', ++count);
            }
            this.updateInsightBarCounts();
        },

        updateInsightBarCounts: function() {
            // update various threat-counts
            this.$totalThreatCount.text(this.model.insightBar.get('totalCount').toLocaleString());
            this.$ipsThreatCount.text(this.model.insightBar.get('ipsCount').toLocaleString());
            this.$avThreatCount.text(this.model.insightBar.get('avCount').toLocaleString());
            this.$asThreatCount.text(this.model.insightBar.get('asCount').toLocaleString());
            this.$daThreatCount.text(this.model.insightBar.get('daCount').toLocaleString());
        },

        updateInsightBarTops: function() {
            // update top destination devices
            var html = TemplateRenderer(topDevicesTemplate, {'topDevices': this.model.insightBar.get('topDestDevices').toJSON()});
            this.$el.find('#top-destination-devices').empty().append(html);

            // update top destination countries
            html = TemplateRenderer(topCountriesTemplate, {'topCountries': this.model.insightBar.get('topDestCountries').toJSON()});
            this.$el.find('#top-destination-countries').empty().append(html);

            // update top source countries
            html = TemplateRenderer(topCountriesTemplate, {'topCountries': this.model.insightBar.get('topSrcCountries').toJSON()});
            this.$el.find('#top-source-countries').empty().append(html);
        },

        animateLine: function(threat) {
            //console.log('>> Live Threat: ' + JSON.stringify(threat));

            var source = {};
            source.lat = threat.src.lat ? threat.src.lat : null;
            source.lng = threat.src.lng ? threat.src.lng : null;
            source.marker = "srcMarker";
            source.cityName = threat.src.city;

            var destination = {};
            destination.lat = threat.dest.lat ? threat.dest.lat : null;
            destination.lng = threat.dest.lng ? threat.dest.lng : null;
            destination.marker = "destMarker";
            destination.cityName = threat.dest.city;

            var colors = {
                'ips': '#f9d854',
                'antivirus': '#aa4ace',
                'antispam': '#ff6666',
                'device-authentication': '#24a39e'
            };

            try {
                this.map.animateSprite(source, destination, colors[threat.attackType]);
            } catch (e) {
                console.log('Exception gracefully handled for animateSprite:  ' + e);
            }
        },

        remove: function() {
            // view is being removed, stop polling (all intervals)
            this.stopPolling();

            // show secondary navigation
            Slipstream.commands.execute("ui:setSecondaryNavigationVisibility", true);
            this.map.destroy();
            this.map = null;
            this.threatMapConf = null;
        },

        // On click of 'view details' show right panel
        showRightPanel: function(e){
            e.preventDefault();
            var me = this,
                panelContainer = this.$el.find('.right-panel-container').empty().append('<div class="childPanel" style="height:inherit;"></div>');
                me.rightPanelView = new RightPanelView({
                    "el": panelContainer.find(".childPanel"),
                    "now": me.now,
                    "model": me.model,
                    "context": me.context,
                    "activity": me.intent
                }).render();
        },

        invokeInboundBlock: function(e) {
            e.preventDefault();
            var me = this,
                blockHeader = me.context.getMessage('threatmap_tooltip_block_inbound_action_button'),
                sourceName = "DESTINATION_COUNTRY",
                blockMessage = me.context.getMessage('threatmap_tooltip_block_inbound_outbound_traffic_message', ["inbound", "to",  me.model.countryDetails.get("countryName")]);

            me.invokeBlockWorkFlow(blockHeader, sourceName, blockMessage);
        },

        invokeOutboundBlock: function(e) {
            e.preventDefault();
            var me = this,
                blockHeader = me.context.getMessage('threatmap_tooltip_block_outbound_action_button'),
                sourceName = "SOURCE_COUNTRY",
                blockMessage = me.context.getMessage('threatmap_tooltip_block_inbound_outbound_traffic_message', ["outbound", "from",  me.model.countryDetails.get("countryName")]);
            me.invokeBlockWorkFlow(blockHeader, sourceName, blockMessage);
        },

        invokeBlockAllTraffic: function(e) {
            e.preventDefault();
            var me = this,
                blockHeader = me.context.getMessage('threatmap_tooltip_block_all_traffic_action_button'),
                sourceName = "BIDIRECTIONAL",
                blockMessage = me.context.getMessage('threatmap_tooltip_block_inbound_outbound_traffic_message', ["", "from",  me.model.countryDetails.get("countryName")]);
            me.invokeBlockWorkFlow(blockHeader, sourceName, blockMessage);
        },

        invokeBlockWorkFlow: function(blockHeader, sourceName, blockMessage) {
            var me = this,
                sourceValues = me.model.countryDetails.get("countryCode"), intent,
                input = {
                    "selectedApplications": [],
                    "startTime": new Date(me.timeRange.startTime).getTime(),
                    "endTime": new Date(me.timeRange.endTime).getTime(),
                    "blockHeader": blockHeader,
                    "sourceName": sourceName,
                    "sourceValues": sourceValues,
                    "blockMessage": blockMessage
                };

            onAnalysisComplete = function(resultCode, jobId) {
                console.log('-- Block Work Flow initialized from ThreatMap --');
                console.log(jobId);
            }

            intent = new Slipstream.SDK.Intent('slipstream.intent.action.ACTION_RULES_CHANGELIST', {
                mime_type: 'vnd.juniper.net.firewall.rules.changelist'
            });
            intent.putExtras(input);
            me.intent.context.startActivityForResult(intent, $.proxy(onAnalysisComplete, me));
        }
    }); 

    return ThreatMapView;
}); 