/**
 * Monitors Graph View Service
 *
 * @module MonitorsGraphView[EventViewer]
 * @author Shini <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/
define(["backbone",
        "../models/topNMonitorsCollection.js"
       ], function(Backbone, TopNMonitorsCollection){

	var MonitorsService = function(){

		var me=this;
		//
        me.getTopMonitors = function(onSuccess, onError, jsonData){
			var me = this,
				monitorsCollection = new TopNMonitorsCollection(),
				success,
				error;
				//
				success = function(collection, response, options){
					onSuccess(collection, response, options);
				};
				//
	            error = function(collection, response, options) {
	                console.log('Top monitors collection is not fetched');
	                onError(collection, response, options);
	            };
	            //
				monitorsCollection.fetch({
				    data : jsonData,
                    method: 'POST',
					success: success,
					error: error
				});
				//
				return me;
		};
		//

		// Returns default query for Monitors
		me.getDefaultData = function(aggregation, category, startTime, endTime) {
             var defaultData = {
                "request":{
                    "aggregation":"COUNT",
                    "aggregation-attributes":aggregation,
                    "time-interval": "P1D/2015-08-05T21:00:15+05:30",
                    "size":"5",
                    "order":"ascending",
                    "filters": {
                        "filter": {
                            "key": "category",
                            "operator": "EQUALS",
                            "value": category
                        }
                    }
                }
             };
             //
             return defaultData;
		}
		//
	}
	//
	return MonitorsService;
});