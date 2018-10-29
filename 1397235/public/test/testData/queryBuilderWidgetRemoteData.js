/**
 * Model that spawns mockjax instances for getting remote data to be used with queryBuilder widget.
 *
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */


define([
    'mockjax'
], function ( mockjax) {

     var suggestions = [
        { "value": "OSVersion=12.1" },
        { "value": "OSVersion=12.2" },
        { "value": "AND" },
        { "value": "OR" }
    ];

    var remoteCall = function () {
            $.mockjax({
                url: '/api/queryBuilder/getRemoteData',
                dataType: 'json',
                responseTime: 700,
                response: function (req) {
                    this.responseText = {
                        suggestions: suggestions
                    }
                }
            });
        }

    return remoteCall;
});