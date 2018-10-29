define(["../../../../event-viewer/js/eventviewer/widgets/swimLaneWidget.js"], function(SwimLaneWidget) {

    describe("SwimLane widget - Unit Tests", function(){
        //
        describe("SwimLane Widget Creation", function(){
            var $el = $("#test_widget"),
                startTime = new Date("2016-04-04T13:23:28.000+05:30"),
                endTime = new Date("2016-04-04T13:53:28.000+05:30"),
                swimLaneWidget = new SwimLaneWidget({
                    "container": $el[0],
                    "timeRange": {"startTime": startTime, "endTime": endTime}
                });
                //
            //
            it("Should exist", function(){
                swimLaneWidget.should.exist;
            });

            it("build() should exist", function(){
                assert.isFunction(swimLaneWidget.build, "Thw SwimLane Widget must have a function with name build.");
                swimLaneWidget.should.exist;
            });

            describe("SwimLane Widget functions check", function(){
            	//
                beforeEach(function(){
                    sinon.spy(swimLaneWidget, "renderPeakValues");
                });
                //
                afterEach(function(){
                    swimLaneWidget.renderPeakValues.restore();
                })
                //
                it("Swim Lane built and rendered successfully", function(done){
                    //
                    //
                    $.mockjax({
                        "url": "/getSwimLaneData",
                        "contentType": "text/json",
                        "responseText":{
                          "swimlane-categories": [
                            {
                              "swimlane-category": "Antivirus",
                              "event-category-id": "ANTI-VIRUS",
                              "time-lines": [
                                {
                                  "time-line": [
                                    {
                                      "time": "2016-04-04T08:07:28.000Z",
                                      "rawTime": "2016-04-04T08:07:28.000Z-2016-04-04T08:08:28.000Z",
                                      "value": 0
                                    }
                                  ],
                                  "name": "All",
                                  "color": "#9FD4FE",
                                  "showLegend": true,
                                  "isSuper": true
                                }
                              ]
                            }
                          ]
                        }
                    });
                    //
                    $.ajax({
                        "url": "/getSwimLaneData",
                        "contentType": "text/json",
                        "success": function(jsonData){
                            swimLaneWidget.build(jsonData);
                            done();
                        }
                    });
                    //
                });
                //
                
                it("Peak Values display check", function(done){
                    //
                    $.ajax({
                        "url": "/getSwimLaneData",
                        "dataType": "json",
                        "success": function(jsonData){
                            swimLaneWidget.build(jsonData);
                            assert(swimLaneWidget.renderPeakValues.calledOnce.should.be.equal(true));
                            done();
                        }
                    });
                    //
                });
                //
            })
            
            describe("SwimLane Widget elements check", function(){
                it("SwimLane Main Container should exists", function(done){
                    $.ajax({
                        "url": "/getSwimLaneData",
                        "dataType": "json",
                        "success": function(jsonData){
                            swimLaneWidget.build(jsonData);
                            var swimLaneContainer = $el.find(".swim-lane");
                            expect(swimLaneContainer).to.not.be.null;
                            done();
                        }
                    });
                    //
                });
                //
            });
        });
    });
});