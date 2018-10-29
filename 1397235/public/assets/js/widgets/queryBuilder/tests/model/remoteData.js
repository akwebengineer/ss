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
        { "value": "12.1" },
        { "value": "12.2" },
        { "value": "12.3" },
        { "value": "14.1" },
        { "value": "14.2" },
        { "value": "13.1" },
        { "value": "16.1" },
        { "value": "13.4" }
    ];

    var suggestionsForDeviceFamily = [
        { "value": "SRX" },
        { "value": "MX" },
        { "value": "EX" }
    ];

    var remoteCall = function () {
        $.mockjax({
            url: '/api/queryBuilder/getRemoteData',
            dataType: 'json',
            responseTime: 700,
            response: function (req) {
                var filteredSuggestions = [];
                // Get the query from req parameter
                if(req.data && req.data.query){
                    var query = req.data.query;
                    if(query.toLowerCase() === "devicefamily") {
                        filteredSuggestions = suggestionsForDeviceFamily;
                    } else {
                        filteredSuggestions = suggestions;
                    }
                }
                this.responseText = {
                    suggestions: filteredSuggestions
                }
            }
        });
    };


    var getLocalData = function() {

        return suggestions;
    }

    var data = {
        remoteCall: remoteCall,
        getLocalData: getLocalData
    };

    return data;
});