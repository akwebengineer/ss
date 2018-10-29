define(["../../../appvisibility/js/views/bubbleViewToolTip.js"], function(BubbleViewToolTip){

	describe("Bubble View Tool Tip Tests", function(){
		//
        var $el = $("#test_widget"),
        	activity = new Slipstream.SDK.Activity(),
        	context = new Slipstream.SDK.ActivityContext(),
			startTime = (new Date("2016-04-04T13:23:28.000+05:30")).getTime(),
			endTime = (new Date("2016-04-04T13:53:28.000+05:30")).getTime(),
        	toolTipView;		
        //
        activity.activityName = "baseVisibilityActivity";
        //
		before(function(){
			$.mockjax({
				"url": "/api/juniper/appvisibility/application-statistics/application-detail?application-name=HTTP-Test-Name&start-time=" + startTime + "&end-time=" + endTime,
				"contentType": "text/json",
				"responseText":{
				  "response": {
				    "result": [
				      {
				        "name": "HTTP-Test-Name",
				        "category": "Infrastructure",
				        "sub-category": "File-Servers",
				        "characteristics": [],
				        "risk-level": "low",
				        "session-count": 303241,
				        "volume": 18027070968,
				        "number-of-blocks": 0,
				        "users": [
				          {
				            "name": "N/A",
				            "session-count": 303241,
				            "volume": 18027070968,
				            "number-of-blocks": 0,
				            "applications": []
				          }
				        ],
				        "app-id": 0
				      }
				    ],
				    "start-time": 0,
				    "end-time": 0,
				    "error-code": "JUNIPER_APPLICATION_STATISTICS_000",
				    "error-message": "Everything works fine",
				    "total-records": 0,
				    "category": "unknown",
				    "sub-category": "unknown",
				    "characteristics": [],
				    "risk-level": "low"
				  }
				}
			});
			//
		});
		//
		describe("Bubble View Tool Tip creation", function(){
			toolTipView = new BubbleViewToolTip({
				"context": context,
				"activity": activity,
				"data":{
					"name": "HTTP-Test-Name",
					"device-ids": "",
					"startTime": startTime,
					"endTime": endTime,
					"isCustom": false,
					"selectedTimeSpanId": "7"
				}
			});			
			//
            it("BubbleView exists?", function(){
		    	toolTipView.render();
                toolTipView.should.exist;
                
		    });
		    //
		    describe("Bubble View member functions exists?", function(){
		    	//
		    	it("onViewAllUsers exists?", function(){
		    		assert.isFunction(toolTipView.onViewAllUsers, "the tooltipview must have a member function with name onViewAllUsers for Jump to other workspace.");
		    	})
		    	//		  
		    	it("Jump to Users/Application grid view test", function(){
		    		toolTipView.onViewAllUsers();
		    	})  	
		    	//
		    	it("Jump to EV on session count", function(){
		    		var clickEvent = {
                    	target : {
                        	'data-cell' : 'http'
                    	}
                	};
		    		toolTipView.jumpToEVonSessionCount(clickEvent);
		    	})    			    			    			    			    	
		    })  	    	    
		});

	});
});