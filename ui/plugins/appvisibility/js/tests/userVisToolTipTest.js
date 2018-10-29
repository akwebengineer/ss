define(["../../../appvisibility/js/views/uservisibility/userVisibilityToolTip.js"], function(UserVisToolTip){

	describe("User Visibility Bubble View Tool Tip Tests", function(){
		//
        var $el = $("#test_widget"),
        	activity = new Slipstream.SDK.Activity(),
        	context = new Slipstream.SDK.ActivityContext(),
			startTime = (new Date("2016-04-04T13:23:28.000+05:30")).getTime(),
			endTime = (new Date("2016-04-04T13:53:28.000+05:30")).getTime(),
        	toolTipView;		
        //
		before(function(){
			$.mockjax({
				"url": "/api/juniper/appvisibility/application-statistics/user-detail?user-name=super&start-time=" + startTime + "&end-time=" + endTime,
				"contentType": "text/json",
				"responseText": {  
				   "response": {  
				      "result":[  
				        {  
				            "name":"super",
				            "session-count":1,
				            "volume":1020,
				            "number-of-blocks":0,
				            "applications":[  
				               {  
				                  	"name":"SSL",
				                  	"category":"Infrastructure",
				                  	"sub-category":"Encryption",
				                  	"characteristics":[  
				                    	"Capable of Tunneling"
				                  	],
				                  	"risk-level":"Low",
				                  	"session-count":1,
				                  	"volume":1020,
				                  	"users":[],
				                  	"app-id":232155
				               	}
				            ]}
				        ],
					    "start-time":0,
					    "end-time":0,
					    "error-code":"JUNIPER_APPLICATION_STATISTICS_000",
					    "error-message":"Everything works fine",
					    "total-records":0,
					    "applications":null
					}
				}
			});
			//
		});
		//
		describe("User Visibility Bubble View Tool Tip creation", function(){

			toolTipView = new UserVisToolTip({
												"context": context,
												"activity": activity,
												"data":{
													"name": "super",
													"device-ids": "",
													"startTime": startTime,
													"endTime": endTime,
													"isCustom": false,
													"selectedTimeSpanId": "7"
												}});			
			//
            it("BubbleView exists?", function(){
		    	toolTipView.render();
                toolTipView.should.exist;
                
		    });
		    //
		    describe("Bubble View member functions exists?", function(){
		    	//
		    	it("onViewAllApplications exists?", function(){
		    		assert.isFunction(toolTipView.onViewAllApplications, "the tooltipview must have a member function with name onViewAllApplications for Jump to other workspace.");
		    	})
		    	//  
		    	it("Jump to Users/Application grid view test", function(){
		    		toolTipView.onViewAllApplications();
		    	})  	
		    	//
		    	it("Jump to EV on session count", function(){
		    		toolTipView.jumpToEVonSessionCount({});
		    	})    			    			    			    			    	
		    })  	    	    
		});
	});
});