define(["../conf/configs.js"], function(Configs){
	//
	var QueryConfig = function(){
		var DEFAULT_AGGREGATION = "COUNT",
			DEFAULT_AGGREGATION_ATTR = "none",
			DEFAULT_SIZE = 100,
			DEFAULT_ORDER = "ascending",
			DEFAULT_SLOTS = 8,
			configs = new Configs();
		/**
		returns the base query for event viewer
		*/
		this.getBaseQueryForEventViewer = function(){
			return {
			  "request": {
			    "aggregation": DEFAULT_AGGREGATION,
			    "aggregation-attributes": DEFAULT_AGGREGATION_ATTR,
			    "time-interval": "",
			    "size": DEFAULT_SIZE,
			    "order": DEFAULT_ORDER,
			    "slots": DEFAULT_SLOTS
			  }
			};
		};
		/*
		*returns the event category filter
		*/
		this.getEventCategoryQuery = function(category){
			return {
				"key": "event-category",
				"operator": "EQUALS",
				"value": configs.getCategoryFilterString(category)
			};
		}
		//
	};
	return QueryConfig;
});