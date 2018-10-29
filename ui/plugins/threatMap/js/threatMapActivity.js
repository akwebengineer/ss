/**
 * Module that implements the ThreatMapActivity.
 *
 * @module ThreatMapActivity
 * @author Jangul Aslam <jaslam@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    './views/threatMapView.js'
], function(
    ThreatMapView
) {
    /**
     * Construct a ThreatMapActivity
     */
    var ThreatMapActivity = function() {
        //var messageResolver;
        //var subscriptions = [];

        this.onCreate = function() {
            console.log('ThreatMapActivity created');
            //messageResolver = new Slipstream.SDK.MessageResolver();
        };

        this.onStart = function() {
            console.log('ThreatMapActivity started');

            this.view = new ThreatMapView({
                context: this.getContext()
            });
            this.setContentView(this.view);

            // var self = this;
            // var handle = messageResolver.subscribe('topics://vnd.juniper.livethreats/', 'mockLiveThreatsProvider:live-threat-event', function(threat) {
                //console.log('<< Live Threat: ' + JSON.stringify(threat));
                //self.view.animateLine(threat);
            // });

            // subscriptions.push(handle);
        };

        this.onDestroy = function() {
            console.log('ThreatMapActivity destroyed');
        }
    };

    ThreatMapActivity.prototype = new Slipstream.SDK.Activity();

    return ThreatMapActivity;
});
