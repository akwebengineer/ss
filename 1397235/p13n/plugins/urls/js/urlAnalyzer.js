/**
 * Analyze and publish URL referral data.
 * 
 * @module 
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 * 
 */
var piwik = require('piwik');
var config = require('../conf/config.js');

var topURLsKey = "topURLsByTime";
var client = piwik.setup(config.piwik_url, config.piwik_auth_token);

function processAnalyticsData(store) {
    piwik.api({
	  method:   'Live.getLastVisitsDetails',
	  idSite:   1,
	  period:   'year',
	  date:     'yesterday',
	  flat: 1, 
	  filter_sort_column: 'userId',
	  filter_sort_order: 'desc'
	}, function (err, responseObject) {
        if (err) {
            console.log(err);
            return;
        }

        var userToURLData = {};
        var visits = responseObject;

        // Compute URLs by time per user
        for (var i = 0; i < visits.length; i++) {
        	var actions = visits[i].actionDetails;
            var userId = visits[i].userId;

            if (!userToURLData[userId]) {
                userToURLData[userId] = {};    
            }

        	actions.filter(function(action) {
        		return action.eventAction == 'URL';
        	}).forEach(function(urlAction) {
        		// accumulate time spent per URL
                var url = urlAction.eventName;
                var timeSpent = 0;

                if (userToURLData[userId][url]) {
                    timeSpent = userToURLData[userId][url]
                }

                if (urlAction.timeSpent) {
                    userToURLData[userId][url] = timeSpent + parseInt(urlAction.timeSpent);
                }
        	});
        }

        // Create serializable URL data per user
        var userId;

        for (userId in userToURLData) {
            var url;
            var urlArray = [];

            for (url in userToURLData[userId]) {
                urlArray.push({
                    'url': url,
                    'timeSpent': userToURLData[userId][url]
                })
            }   

            urlArray.sort(function(url1, url2) {
                return url2.timeSpent - url1.timeSpent;
            });

            storeURLData(store, userId, urlArray);
        }
	});	
}

function makeStoreKey(userId) {
    return userId + "." + topURLsKey;
}

/**
 * Store URL data in the data store
 *
 * @param {Object} store - The store into which the data should be written.
 * @param {Object} userId - The user associated with the data to be stored.
 * @param {Object} urlData - The data to be stored.
 */
function storeURLData(store, userId, urlData) {
    var storeKey = makeStoreKey(userId);

	store.set(storeKey, urlData, function(err) {
		if (err) {
	        console.log("Error writing to the p13n store", err);	
	    }
	});
}

module.exports = function(options) {
    this.store = options.store;

    /**
     * Fetch the top referred URLs 
     * 
     * @param (Object} params - A hash of parameters that define the set of URLs will be returned.
     * @param {Function} callback - A callback to be invoked in order to return the set of URLs.  The function
     * must have the form:
     *
     * function (err, value) {
	 *     ...  
     * }
     *
     * Where 'err' is an error string if an error occurred while returning the URLs and 'value' is an Array containing
     * the returned URLs.  If no error has occurred then 'err' will be falsey.
     */
    this.topURLs = function(userId, params, callback) {
    	var defaultNumber = config.default_topn;
    	var numberToReturn = (params.number && params.number > 0) ? params.number : defaultNumber;
        var storeKey = makeStoreKey(userId);

    	this.store.get(storeKey, function(err, value) {
    		var val = value;

    		if (!err && val) {
    		    val.splice(numberToReturn);
    		}

    		callback(err, val);
    	});
    }

    /**
     * Process the latest URL analytics data and persist it to the datastore.
     */
    this.process = function() {
        processAnalyticsData(this.store);
    }
}