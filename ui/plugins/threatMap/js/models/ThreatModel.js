/** 
 * A Backbone model for a threat.
 *
 * @module ThreatModel
 * @author Jangul Aslam <jaslam@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    './RequestConfig.js',
], function(
    Backbone,
    RequestConfig
) {
    /** 
     * ThreatModel defination.
     */
    var ThreatModel = Backbone.Model.extend({
        parse: function(data) {
            data['uiModel'] = {
                id: data['id'],
                timestamp: function() {
                    var time = new Date(data['timestamp']);
                    time.setMilliseconds(0);
                    return time;
                }(),
                src: {
                    lat: data['src-latitude'],
                    lng: data['src-longitude'],
                    ip: data['src-ip'],
                    country: data['src-country-name'],
                    countryCode2: data['src-country-code2'],
                },
                dest: {
                    lat: data['dst-latitude'],
                    lng: data['dst-longitude'],
                    ip: data['dst-ip'],
                    country: data['dst-country-name'],
                    countryCode2: data['dst-country-code2'],
                },
                attackType: function() {
                    if (RequestConfig.getIPSThreatEventTypes().indexOf(data['event-type']) >= 0) {
                        return 'ips';
                    } else if (RequestConfig.getAntivirusThreatEventTypes().indexOf(data['event-type']) >= 0) {
                        return 'antivirus';
                    } else if (RequestConfig.getAntispamThreatEventTypes().indexOf(data['event-type']) >= 0) {
                        return 'antispam';
                    } else if (RequestConfig.getDeviceAuthThreatEventTypes().indexOf(data['event-type']) >= 0) {
                        return 'device-authentication';
                    }
                }()
            };
            data['milliseconds'] = data['uiModel'].timestamp.getTime();   // used for time comparisions

            //console.log('data: ' + JSON.stringify(data));
            return data;
        }
    });

    return ThreatModel;
});