define([
    "../models/schedulerModel.js",
    "../views/schedulerDetailView.js"
], function( SchedulerModel, SchedulerDetailView){
    var activity = new Slipstream.SDK.Activity();
    activity.getContext = function() {
        return new Slipstream.SDK.ActivityContext();
    };
    // fake data start-date1
    var scheduleObj = {
        "schedulers": {
            "scheduler": [{
                "id": 262263,
                "name": "testName",
                "description": "schedule data for testing",
                "domain-id": 2,
                "start-date1": "2017-01-23.08:30",
                "stop-date1": "2018-11-26.18:30",
                "start-date2": "2018-01-23.08:30",
                "stop-date2": "2019-11-25.18:30",
                "schedules": {
                    "schedule": [{
                        "all-day": false,
                        "exclude": true,
                        "day": "sunday"
                    }, {
                        "all-day": true,
                        "exclude": false,
                        "day": "monday"
                    }, {
                        "all-day": false,
                        "exclude": false,
                        "start-time1": "08:30 AM",
                        "stop-time1": "11:30 AM",
                        "start-time2": "01:30 PM",
                        "stop-time2": "05:30 PM",
                        "day": "tuesday"
                    }],
                    "uri": "/api/juniper/sd/scheduler-management/schedulers/262263/schedules"
                },
                "definition-type": "CUSTOM",
                "domain-name": "Global",
                "uri": "/api/juniper/sd/scheduler-management/schedulers/262263",
                "href": "/api/juniper/sd/scheduler-management/schedulers/262263"
            }],
            "uri": "/api/juniper/sd/scheduler-management/schedulers",
            "total": 1
        }
    };

    describe("FW Schedule Detail View Unit Tests", function() {
        var view = null;

        afterEach(function() {
            $('#main-content').empty();
            $.mockjax.clear();
        });

        it("Should render detail view correctly with specified values in", function(done) {
            var model = new SchedulerModel();
            $.mockjax({
                url: "/api/juniper/sd/scheduler-management/schedulers/262263",
                type: "GET",
                responseText: scheduleObj
            });
            model.id = "262263";
            model.fetch({
                success: function(req, res, options) {
                    model.attributes = res.schedulers.scheduler[0];
                    view = new SchedulerDetailView({
                        activity: activity,
                        model: model
                    });
                    view.render();
                    $('#main-content').append(view.$el);
                    $("span#text_description_0_0 label").text().should.equal("testName")
                    $("span#text_description_0_2 label").text().should.equal("2017-01-23.08:30")
                    $("span#text_description_0_5 label").text().should.equal("2019-11-25.18:30")
                    $("span#schedules-detail label").text().should.contain("sunday - [scheduler_day_option_excluded]");
                    $("span#schedules-detail label").text().should.contain("monday - [scheduler_day_option_allday]");
                    done();
                }
            });
        });

        it("Should render detail view with date-range ongoing if no date specified", function(done) {
            var model = new SchedulerModel();
            scheduleObj.schedulers.scheduler[0]["start-date1"] = "";
            scheduleObj.schedulers.scheduler[0]["stop-date1"] = "";
            scheduleObj.schedulers.scheduler[0]["start-date2"] = "";
            scheduleObj.schedulers.scheduler[0]["stop-date2"] = "";
            scheduleObj.schedulers.scheduler[0].schedules.schedule = [{
                "all-day": false,
                "exclude": true,
                "day": "DAILY"
            }];
            $.mockjax({
                url: "/api/juniper/sd/scheduler-management/schedulers/262263",
                type: "GET",
                responseText: scheduleObj
            });
            model.id = "262263";
            model.fetch({
                success: function(req, res, options) {
                    model.attributes = res.schedulers.scheduler[0];
                    view = new SchedulerDetailView({
                        activity: activity,
                        model: model
                    });
                    view.render();
                    $('#main-content').append(view.$el);
                    $("span#text_description_0_0 label").text().should.equal("testName")
                    $("span#text_description_0_2 label").text().should.equal("[fw_scheduler_dates_type_forever]")
                    $("span#schedules-detail label").text().should.equal("");
                    done();
                }
            });
        });
    })
});