/**
 * Unit Tests for Right Panel Model
 *
 * @module ThreatMap
 * @author Shini <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */


define([
    '../../models/RightPanelModel.js',
    '../../models/RequestData.js'
      ], function(RightPanelModel, RequestData) {

         var model, context = new Slipstream.SDK.ActivityContext(), activity = new Slipstream.SDK.Activity(),
            getMessage;

        describe("Right Panel Model UT", function () {

            before(function () {
                model = new RightPanelModel();
                getMessage = sinon.stub(context, 'getMessage');
                $.mockjax({
                    url: "/api/juniper/ecm/log-scoop/aggregate",
                     type: 'POST',
                     status: 200,
                     contentType: 'application/json',
                     dataType: 'json',
                     responseText: true
                });
            });
            after(function() {
                getMessage.restore();
            });

            it('Checks if the Right Panel Model object is created properly', function () {
                model.should.exist;
            });

            it('Checks is the getTimeInterval is called', function () {
                var  startTime =  {toJSON: function(){ return "2016-08-21T18:30:00.000Z"; }},
                     endTime =  {toJSON: function(){ return "2016-08-22T10:18:21.000Z"; }};

                model.set('startTime', startTime);
                model.set('endTime', endTime);
                model.getTimeInterval();
            });

            it('Checks Right Panel model fetch function is called', function () {
                var options = {
                    now: new Date(),
                    pollInterval:  30 * 1000,
                    countryName: "United States",
                    countryCode: "us"
                },
                getTimeInterval = sinon.stub(model, "getTimeInterval", function() { console.log("getTimeInterval");}),
                getAggregatedCount = sinon.stub(RequestData, "getAggregatedCount", function() {});

                srcIpsCount = {
                    0: {response: {result: {
                        length: 1,
                        0: {value: 323 }
                       }
                      }
                    }
                },

                dstIpsCount= {
                    0: {response: {result: {
                         length: 1,
                         0: {value: 323 }
                        }
                       }
                    }
                };
                var when = sinon.stub($, 'when', function(){
                    return {'then': function(srcIpsCount, dstIpsCount,
                                             srcAvCount, dstAvCount,
                                             srcAsCount, dstAsCount,
                                             srcDaCount, dstDaCount){}
                    }
                });

                model.fetch(options);
                getTimeInterval.calledOnce.should.be.equal(true);
                getAggregatedCount.called.should.be.equal(true);
                when.calledOnce.should.be.equal(true);
                getTimeInterval.restore();
                getAggregatedCount.restore();
                when.restore();
            });

        });

});