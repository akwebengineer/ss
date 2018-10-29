define(["./queryConfig.js"], function(QueryConfig){
	//
	var QueryBuilder = function(baseQueryOptions){
		var me=this,
			baseQuery;
		//
		me.queryConfig = new QueryConfig();
		baseQuery = me.queryConfig.getBaseQueryForEventViewer();
		me.query = $.extend(true, baseQuery, baseQueryOptions);
		//
	};
	/**
	* returns the query object
	*/
	QueryBuilder.prototype.getQuery = function(){
		return this.query;
	};
	//
	/**
	* adds the filter object to the query
	*/
	QueryBuilder.prototype.addFilter = function(filterObject){
		var me=this;
		me.query = $.extend(true, me.query, filterObject);//merge the options
		return me; //for chaining
	};
	//appends OR to the query
	QueryBuilder.prototype.appendOR = function(ORObject){};
	//appends AND to the query
	QueryBuilder.prototype.appendAND = function(ANDObject){};
	//
	return QueryBuilder;
});