define(["../../../ui-common/js/common/utils/filterUtil.js"], function (FilterUtil) {

    var AppVisUtil = function() {
    	//
        var getFilterObj = function(options, data, linkValue){
            var me = this,
                filters = [], 
                filter, 
                filterObj, 
                filterUtil = new FilterUtil();
            //add the APPTRACK_SESSION_CLOSE event when clicking on a session link
            filter = {
                "filter":{
                    "key": filterUtil.LC_KEY.EVENT_TYPE,
                    "operator": "EQUALS",
                    "value": ["APPTRACK_SESSION_CLOSE", "APPTRACK_SESSION_CLOSE_LS"]
                }
            };
            //
            filters.push(filter);
            //
            if(linkValue){
                filter = {
                    "filter" : {
                        "key" : data.dataFilter,
                        "operator" : "EQUALS",
                        "value" : linkValue
                    }
                };
                filters.push(filter);
            };
            
            if(data.filterKey && options.name){
                //
                filter = {
                    "filter" : {
                        "key" : data.filterKey,
                        "operator" : "EQUALS",
                        "value" : options.name
                    }
                };
                //
                filters.push(filter);
            };
            
            filterObj = {
                'and' : filters
            }
            //
            /*dont take short cuts - ask framework to fix the precedence issue in advanced search
            if(data.filterKey && options.name && data.filterKey === filterUtil.LC_KEY.APPLICATION){//in case of filterKey is application needs to add the nested application too
                let nestedAppFilter = {
                        "filter":{
                            "key" : filterUtil.LC_KEY.NESTED_APPLICATION,
                            "operator" : "EQUALS",
                            "value" : options.name                            
                        }
                };
                filterObj["or"] = [nestedAppFilter];
            };
            if(linkValue && data.dataFilter === filterUtil.LC_KEY.APPLICATION){
                let nestedAppFilter = {
                        "filter":{
                            "key" : filterUtil.LC_KEY.NESTED_APPLICATION,
                            "operator" : "EQUALS",
                            "value" : linkValue                            
                        }
                };
                filterObj["or"] = [nestedAppFilter];
            };*/
            //
            return filterObj;
        };
        //
        var getLastCompletedTimeInMillis = function(timeInMillis){
            var timeToDate = new Date(timeInMillis),
                currentMinutes = timeToDate.getMinutes(),
                currentMillis = 0;
            //
            if(currentMinutes >= 0 && currentMinutes <=15){
                currentMillis = 0 * 60000;
            }else if(currentMinutes >=15 && currentMinutes <= 30){
                currentMillis = 15 * 60000;
            }else if(currentMinutes >=30 && currentMinutes <= 45){
                currentMillis = 30 * 60000;
            }else if(currentMinutes >=45 && currentMinutes <= 60){
                currentMillis = 45 * 60000;
            };
            //
            timeToDate.setMinutes(0);
            timeToDate = new Date(timeToDate.getTime() + currentMillis);
            return timeToDate.getTime();
        };
        //
        this.jumpToEVonSessionCount = function(e, options, data){
        	var me = this,
        		startTime = getLastCompletedTimeInMillis(options.time.startTime),
                endTime = getLastCompletedTimeInMillis(options.time.endTime), 
                aggregation = "none",		//no aggregation in this case
                linkValue = $(e.currentTarget).data('cell') || '',
                proxyFunction = $.proxy(getFilterObj, me),
                filterObj = proxyFunction(options, data, linkValue) || proxyFunction(options, data),
                request = {
                    'timeRange': {
                        'startTime': new Date(startTime),
                        'endTime': new Date(endTime)
                    },
                    'filters': filterObj,
                    'aggregation-attributes': aggregation,
                    "dontPersistAdvancedSearch": true
                };
            // start related activity for the clicked category
            var intent = new Slipstream.SDK.Intent('slipstream.intent.action.ACTION_LIST', { 
                mime_type: 'vnd.juniper.net.eventlogs.alleventcategories'
            });
            intent.putExtras(request);  // send the request obj containing startTime, endTime and filters
            options.context.startActivity(intent);
        };
        //
    }
    return AppVisUtil;
});