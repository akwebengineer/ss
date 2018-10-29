define(["../../../../event-viewer/js/eventviewer/views/summaryView.js"], function(SummaryView) {

    describe("Event Viewer summary view unit tests", function() {
        var activity, stub;
        before(function() {

            activity = new Slipstream.SDK.Activity();

            stub = sinon.stub(activity, 'getContext', function() {
                return new Slipstream.SDK.ActivityContext();
            });

        });

        after(function() {
            stub.restore();
        });

        var summaryView, intent, filter;
        var stringify = JSON.stringify;
        //executes once
        before(function(){
            intent = sinon.stub(activity, 'getIntent', function() {
                return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE);
            });
            //thiis is to solve the serialize cyclic structure issue with stringify
            JSON.stringify = function(obj) {
                var seen = [];

                var result = stringify(obj, function(key, val) {
                  if (val instanceof HTMLElement) { return val.outerHTML }
                  if (typeof val == "object") {
                    if (seen.indexOf(val) >= 0) { return "[Circular]"; }
                    seen.push(val);
                  }
                  return val;
                });
                return result;
            };
        });

        //executes once
        after(function(){
            JSON.stringify = stringify;
        });

        //executes before every it()
        beforeEach(function(){
            console.log("Event Viewer summary view unit tests: beforeEach");
            $.mockjax({
                "url": "/api/juniper/ecm/log-scoop/aggregate",
                "contentType": 'application/json',
                proxy: "../../../../event-viewer/js/eventviewer/tests/data/aggregate.json"
            })
            //
            $.mockjax({
                "url": "/api/juniper/ecm/log-scoop/time-aggregate",
                "contentType": 'application/json',
                proxy: "../../../../event-viewer/js/eventviewer/tests/data/time-aggregate.json"
            })
            //
            var endTime = new Date();
            filter = {
                "timeRange":{
                    "endTime": endTime,
                    "startTime": new Date(endTime - (7200000/4))
                }
            };
            //
            summaryView = new SummaryView({
                "activity": activity,
                "eventCategory": "ALL EVENTS",
                "filter": filter
            });
        });
        //
        it("summary view exists ?", function(){
            summaryView.should.exist;
        });
        //
        it("summary view rendered ?", function(){
            expect(summaryView.$el).to.not.be.null;
        });
        //
        it("insight bar inside summary view rendered ?", function(){
            var inSightBar = summaryView.$el.find(".ev-insight-bar-container");
            expect(inSightBar).to.not.be.null;
        });
        //
        it("Summary View ALL Events Render", function(){
            summaryView.render();
            summaryView.refreshContentView({
                "filter":filter
            });
        })
        //
        it("Summary View firewall events Render", function(){
            summaryView.options.eventCategory = "FIREWALL";
            summaryView.render();
            summaryView.refreshContentView({
                "filter":filter
            });
        })
        
        //
        it("Summary View web filtering events Render", function(){
            summaryView.options.eventCategory = "WEB-FILTERING";
            summaryView.render();
            summaryView.refreshContentView({
                "filter":filter
            });
        })
        //
        it("Summary View vpn events Render", function(){
            summaryView.options.eventCategory = "VPN";
            summaryView.render();
            summaryView.refreshContentView({
                "filter":filter
            });
        })
        //
        it("Summary View content filtering Render", function(){
            summaryView.options.eventCategory = "CONTENT-FILTERING";
            summaryView.render();
            summaryView.refreshContentView({
                "filter":filter
            });
        })
        //
        it("Summary View anti spam Render", function(){
            summaryView.options.eventCategory = "ANTI-SPAM";
            summaryView.render();
            summaryView.refreshContentView({
                "filter":filter
            });
        })
        //
        it("Summary View anti virus Render", function(){
            summaryView.options.eventCategory = "ANTI-VIRUS";
            summaryView.render();
            summaryView.refreshContentView({
                "filter":filter
            });
        })
        //
        it("Summary View IPS Render", function(){
            summaryView.options.eventCategory = "IPS";
            summaryView.render();
            summaryView.refreshContentView({
                "filter":filter
            });
        })
        //
    });
});