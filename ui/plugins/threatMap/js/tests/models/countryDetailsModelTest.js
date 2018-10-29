/**
 * Unit Tests for Country Details Model
 *
 * @module ThreatMap
 * @author Shini <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */


define([
    "../../models/CountryDetailsModel.js"
      ], function(CountryDetailsModel) {

         var model, context = new Slipstream.SDK.ActivityContext(), activity = new Slipstream.SDK.Activity(),
            getMessage;

        describe("Country Details Model UT", function () {

            before(function () {
                model = new CountryDetailsModel();
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

            it('Checks if the Country Details Model object is created properly', function () {
                model.should.exist;
            });

            it('Checks if the getTimeInterval is called', function () {
                var  startTime =  {toJSON: function(){ return "2016-08-21T18:30:00.000Z"; }},
                     endTime =  {toJSON: function(){ return "2016-08-22T10:18:21.000Z"; }};

                model.set('startTime', startTime);
                model.set('endTime', endTime);
                model.getTimeInterval();
            });

            it('Checks model fetch function is called', function () {
                var options = {
                    now: new Date(),
                    pollInterval:  30 * 1000,
                    countryName: "United States",
                    countryCode: "us"
                },
                getTimeInterval = sinon.stub(model, "getTimeInterval", function(){return true;}),
                srcTotalCount = {
                    0: {response: {result: {
                        length: 1,
                        0: {value: 323 }
                       }
                      }
                    }
                },

                dstTotalCount= {
                    0: {response: {result: {
                         length: 1,
                         0: {value: 323 }
                        }
                       }
                    }
                 };
                var when = sinon.stub($, 'when', function(){
                    return {'then': function(srcTotalCount, dstTotalCount){}
                    }
                });


                model.fetch(options);
                getTimeInterval.called.should.be.equal(true);
                when.calledOnce.should.be.equal(true);
                getTimeInterval.restore();
                when.restore();

            });

        });

});