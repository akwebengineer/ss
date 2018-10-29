define(['backbone', 'widgets/timeRange/timeRangeWidget', '../models/timeSpanCollection.js', "../utils/queryBuilder.js", "../utils/queryConfig.js"], function(Backbone, TimeRangeWidget, TimeSpanCollection, QueryBuilder, QueryConfig){
  var NO_OF_SLOTS = 8,
      DEFAULT_TIME_IN_MILLIS = 1800000;//30 min is the default time set in EV
  //
	var TimeSpanWidget = Backbone.View.extend({
    //
		initialize: function(options){
        var me = this, defaultData, endTime = new Date(), startTime = new Date(endTime - DEFAULT_TIME_IN_MILLIS),
            queryBuilder, eventCategoryFilter;
        /*startTime = new Date(startTime.setSeconds(0));
        endTime = new Date(endTime.setSeconds(0));*/
        me.options = options;

        if(me.options.startTime){
          startTime = me.getRequestFormatTimeString(me.options.startTime);
        } else {
          startTime = me.getRequestFormatTimeString(startTime);
        }
        if(me.options.endTime){
          endTime = me.getRequestFormatTimeString(me.options.endTime);
        } else {
          endTime = me.getRequestFormatTimeString(endTime);
        }
        //
        queryBuilder = new QueryBuilder({
          "request":{
            "time-interval": startTime + "/" + endTime,
            "slots": NO_OF_SLOTS
          }
        });
        //      
        if(options.eventCategory !== "ALL EVENTS"){
          eventCategoryFilter = new QueryConfig().getEventCategoryQuery(options.eventCategory);
          eventCategoryFilter = {
            "request":{
              "filters":{
                "filter": eventCategoryFilter
              }
            }
          };
        };
        //
        defaultData = queryBuilder.addFilter(eventCategoryFilter).getQuery();
        //
        me.mergedData = $.extend({}, options.inputData, defaultData);//merge defaultData with user sent options
        //
        me.render();
		},

    getRequestFormatTimeString : function(date){
        return Slipstream.SDK.DateFormatter.format(date, "YYYY-MM-DDTHH:mm:ss.000Z");
    },
    //gets the event data between start time and end time
		getEventData: function(){
        var me = this,
            timeSpanCollection = new TimeSpanCollection(), 
            onSuccess,
            onError,
            jsonData = JSON.stringify(me.mergedData);
        //
        onSuccess = function(collection, response, options){
            console.log(collection);
            var result = response.response.result, length;
            me.count = [];
            if(result){
              length = result.length;
              for(i = 0; i < length; i++){
                if(result[i]['time-value'].length != 0){
                  me.count.push(result[i]['time-value'][0].value)
                } else {
                  me.count.push(0);
                }
              }
            }
            getTimeStamps = me.getSlots();
            me.timeRangeWidget = new TimeRangeWidget({
                container: me.$el,
                options: {
                    afterSetTimeRange: me.options.afterSetTimeRange,
                    data:[{
                        name: 'eventCount',
                        color: '#007777',
                        points:getTimeStamps
                    }]
                }
            }).build();
            if(me.options.endTime && me.options.startTime){
              me.timeRangeWidget.setTimeRange(new Date(me.options.startTime), me.options.endTime);
            } else {
              me.timeRangeWidget.setTimeRange(new Date(getTimeStamps[0][0] - DEFAULT_TIME_IN_MILLIS), new Date(getTimeStamps[0][0]));
            }
        };
        //
        onError = function(collection, response, options){
            console.log(response.responseText);
        };
        //
        timeSpanCollection.fetch({
          data : jsonData, 
          method: 'POST',
          success: onSuccess,
          error: onError
        });
        //
        return timeSpanCollection;
		},
    //returns the slots between start time and end time
    getSlots: function(){
      var me=this,
          endTime = new Date().getTime(),
          slots=[],
          startTime = new Date(endTime - DEFAULT_TIME_IN_MILLIS).getTime(),//go back 30 min by default
          currentTimeStamp=endTime,
          diff=0,
          interval=0,
          len = me.count.length,
          i=0;
      //override the default start and end time from options, if exists
      if(me.options.startTime){
        startTime = me.options.startTime.getTime();
      }
      //
      if(me.options.endTime){
        endTime = me.options.endTime.getTime();
        currentTimeStamp = endTime;
      }
      //
      diff = endTime - startTime;
      interval = Math.floor(diff / NO_OF_SLOTS);
      //      
      i = NO_OF_SLOTS;
      while(i--){
        slots.push([currentTimeStamp, me.count[i]]);
        currentTimeStamp = currentTimeStamp - interval;
      };
      //
      return slots;      
    },
		render: function(){
			var me = this;
      me.getEventData();
			return this;
		}
	});

	return TimeSpanWidget;
})