define([
    "../models/schedulerModel.js",
    "../models/schedulerCollection.js",
    "../views/schedulersView.js"
], function( SchedulerModel, SchedulerCollection, SchedulerView){
    var activity = new Slipstream.SDK.Activity();
    var collection = new SchedulerCollection();
    var testName = "testName",
        testDescription = "schedule data for testing";

    // use this to provide URL for duplicate name check (also used in clone)
    activity.collection = collection;
    activity.overlay = {
        destroy: function() {
            console.log("overlay destroy function invoked");
        }
    };
    activity.buildOverlay = function() {
        console.log("build overlay mock function invoked");
    };

    var checkDuplicateNameURL = "/api/juniper/sd/scheduler-management/schedulers?filter=(name eq 'testName')",
        saveScheduleURL = "/api/juniper/sd/scheduler-management/schedulers";

    // fake data 
    var testScheduleData = {
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
                    "day": "SUNDAY"
                }, {
                    "all-day": true,
                    "exclude": false,
                    "day": "MONDAY"
                }, {
                    "all-day": false,
                    "exclude": false,
                    "start-time1": "08:30 AM",
                    "stop-time1": "11:30 AM",
                    "start-time2": "01:30 PM",
                    "stop-time2": "05:30 PM",
                    "day": "TUESDAY"
                }],
                "uri": "/api/juniper/sd/scheduler-management/schedulers/262263/schedules"
            },
            "definition-type": "CUSTOM",
            "domain-name": "Global",
            "uri": "/api/juniper/sd/scheduler-management/schedulers/262263",
            "href": "/api/juniper/sd/scheduler-management/schedulers/262263"
        };

    var emptyScheduleData = {
            "schedulers": {
                "scheduler":[],
                "uri":"/api/juniper/sd/scheduler-management/schedulers",
                "total":0
            }
        };

    describe("FW Schedule creation view Unit Tests", function() {
        this.timeout(3000);
        var view = null;

        before(function() {
            sinon.stub(activity, 'getContext', function() {
                return new Slipstream.SDK.ActivityContext();
            });
            sinon.stub(activity, "getIntent", function() {
                return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE);
            });
            $.mockjaxSettings.logging = false;
            // this is defined in domainProvider but we need it to check duplicate name
            window.Juniper = {sm: {CURRENT_DOMAIN_ID:2}};
        });

        after(function() {
            activity.getIntent.restore();
            activity.getContext.restore();
            $("#main-content").empty();
            $("#datepicker_wrapper").remove();
            $.mockjaxSettings.logging = true;
            delete window.Juniper;
        });

        beforeEach(function() {
            $.mockjax.clear();
            var model = new SchedulerModel();
            view = new SchedulerView({
                activity: activity,
                model: model
            });
            view.render();
            $("#main-content").empty();
            $("#main-content").append(view.$el);
        });

        afterEach(function() {
            if (typeof activity.overlay.destroy.restore == "function") {
                activity.overlay.destroy.restore();
            }
            if (typeof activity.buildOverlay.restore == "function") {
                activity.buildOverlay.restore();
            }
        });

        it("should exist schedule creation view object with 'CREATE' formMode", function() {
            view.should.exist;
            view.formMode.should.be.equal("CREATE");
        });

        it("should check the ongoing date-range option by default", function() {
            expect($("input#date-forever").is(":checked")).to.be.true;
            expect($("#time-range-specify").is(":checked")).to.be.false;
            $("div#scheduler_times").attr("style").should.contain("display: none;");
        });

        /*validation*/
        it("should show invalid error message with empty name input", function() {
            $("#scheduler-name").val("").trigger("change");
            expect($("#scheduler-name").parent().hasClass("error")).to.be.true;
            $("#scheduler-name~small").text().should.contain("[name_require_error]");
        });

        it("should show invalid error message with invalid name input", function() {
            $("#scheduler-name").val("testScheduleNamewith$").trigger("change");
            expect($("#scheduler-name").parent().hasClass("error")).to.be.true;
            $("#scheduler-name~small").text().should.contain("[scheduler_name_error]");
        });

        it("should show invalid error message with a name which exceeds max length", function() {
            var longScheduleName = "schedulenamewithoutnotallowedcharactersbutexceedmaxlengthofsixtythree";
            console.log("long schedule name with length of :"+longScheduleName.length);
            $("#scheduler-name").val(longScheduleName).trigger("change");
            expect($("#scheduler-name").parent().hasClass("error")).to.be.true;
            $("#scheduler-name~small").text().should.contain("[scheduler_name_error]");
        });

        /*duplicate name validation*/
        it.skip("should show duplicate name message with duplicate name input", function(done) {
            $.mockjax({
                url: checkDuplicateNameURL,
                type: "GET",
                status: 200,
                contentType: 'text/json',
                dataType: 'json',
                response: function(settings, done2) {
                    var resp = {
                        "schedulers": {
                            "scheduler": [testScheduleData],
                            "uri":"/api/juniper/sd/scheduler-management/schedulers",
                            "total": 1
                        }
                    };
                    this.responseText = resp;
                    done2();
                    $("#scheduler-name ~ small").text().should.equal("[name_duplicate_error]");
                    done();
                }
            });

            $("#scheduler-name").val(testName).trigger("change");
        });

        // check tooltip configurations
        it("should show tooltip for name", function(done) {
            $(".ua-field-help.form-element.tooltip.tooltipstered:first").mouseenter();
            setTimeout(function() {
                $(".tooltipster-base.tooltipster-shadow .tooltipster-content").text().should.equal("[fw_scheduler_create_name_tooltip]");
                done();
            }, 1000);
        });

        it("should show field required message if date-range is custom but time-range is not specified", function() {
            $.mockjax({
                url: checkDuplicateNameURL,
                type: "GET",
                responseText: emptyScheduleData
            });
            $("#scheduler-name").val(testName).trigger("change");
            $("input#date-range").prop("checked", true);
            $("input#date-forever").prop("checked", false);
            $("input#date-range").click();

            $("input#scheduler-save").click();
            $("input#start-date1").parent().hasClass("error").should.be.true;
            $("input#start-date1 ~ small").text().should.equal("[require_error]");
        });

        it("should build time-options view with specify param by clicking on any of day", function() {
            sinon.spy(activity, "buildOverlay");
            $("#time-range-specify").click();
            $("#scheduler-weekly-monday").click();
            activity.buildOverlay.calledOnce.should.be.true;
        });

        it("should build time-options view by clicking the 'apply_to_all' link", function() {
            sinon.spy(activity, "buildOverlay");
            $("#time-range-specify").click();
            $("#apply_to_all_days").click();// click event not triggered? or not bound
            activity.buildOverlay.calledOnce.should.be.true;
        });

        it("should change all day's time option to excluded", function() {
            var result = {
                day: "apply_to_all",
                value: "exclude"
            };
            $("#time-range-specify").click();
            // check value before change
            expect($("div#monday-value").text()).to.be.equal("[scheduler_day_option_allday]");
            expect($("div#tuesday-value").text()).to.be.equal("[scheduler_day_option_allday]");
            expect($("div#wednesday-value").text()).to.be.equal("[scheduler_day_option_allday]");
            view.onTimeOptionsChange(result);
            expect($("div#monday-value").text()).to.be.equal("[scheduler_day_option_excluded]");
            expect($("div#tuesday-value").text()).to.be.equal("[scheduler_day_option_excluded]");
            expect($("div#wednesday-value").text()).to.be.equal("[scheduler_day_option_excluded]");
            expect($("div#thursday-value").text()).to.be.equal("[scheduler_day_option_excluded]");
            expect($("div#friday-value").text()).to.be.equal("[scheduler_day_option_excluded]");
        });

        it("should display error msg if start-date has some value but end-date not", function(done) {
            $.mockjax({
                url: checkDuplicateNameURL,
                type: "GET",
                responseText: emptyScheduleData
            });

            $("#scheduler-name").val(testName).trigger("change");
            $("#description").val(testDescription).trigger("change");
            $("input#date-range").prop("checked", true).click();
            $("#start-date1").val("12/09/2017");
            $("#stop-date1").val("");
            $("#start-date2").val("12/09/2018");
            $("#stop-date2").val("");
            $("#time-range-specify").click();
            $("input#scheduler-save").click();
            setTimeout(function() {
                // form invalid
                $("div.alert-box.errdivimage").text().should.equal("[scheduler_form_date_range_error]");
                $("div.alert-box.errdivimage").attr("style").should.contain("display: block;");
                done();
            }, 1000);
        });

        it("should save schedule object successfully if date-range is custom and time-range is specified", function(done) {
            // mock ajax request
            $.mockjax({
                url: checkDuplicateNameURL,
                type: "GET",
                responseText: emptyScheduleData
            });
            sinon.spy(activity.overlay, "destroy");

            $("input#date-range").prop("checked", true).click();
            // Don't put date-range and time-range check event trigger too close,
            // Put them several line apart to get some time legacy for code running
            $("#scheduler-name").val(testName).trigger("change");
            $("#description").val(testDescription).trigger("change");
            $("#time-range-specify").click();
            view.onTimeOptionsChange({day:"sunday", value: "exclude"});

            $.mockjax({
                url: saveScheduleURL,
                type: "POST",
                status: 200,
                contentType: 'text/json',
                dataType: 'json',
                response: function(settings, done2) {
                    this.responseText = settings.data;
                    var response = $.parseJSON(settings.data);
                    response["scheduler"]["name"].should.be.equal(testName);
                    response["scheduler"]["description"].should.be.equal(testDescription);
                    done2();
                    activity.overlay.destroy.calledOnce.should.be.true;
                    done();
                }
            });
            $("input#scheduler-save").click();
        });

        it("should save successfully with only name field filled", function(done) {
            $.mockjax({
                url: "/api/juniper/sd/scheduler-management/schedulers?filter=(name eq 'testName')",
                type: "GET",
                status: 200,
                contentType: 'text/json',
                dataType: 'json',
                responseText: emptyScheduleData
            });
            $("#scheduler-name").val(testName).trigger("change");
            // mock ajax request
            sinon.spy(activity.overlay, "destroy");
            setTimeout(function() {
                $.mockjax({
                    url: saveScheduleURL,
                    type: "POST",
                    status: 200,
                    contentType: 'text/json',
                    dataType: 'json',
                    response: function(settings, done2) {
                        this.responseText = settings.data;
                        var response = $.parseJSON(settings.data);
                        response["scheduler"].name.should.be.equal(testName);
                        response["scheduler"].description.should.be.equal("");
                        done2();
                        activity.overlay.destroy.calledOnce.should.be.true;
                        done();
                    }
                });
                $("input#scheduler-save").click();
            }, 1000);
        });

        // always fail when run all cases together
        it("should save schedule successfully with all fields filled correctly", function(done) {
            $.mockjax({
                url: checkDuplicateNameURL,
                type: "GET",
                responseText: emptyScheduleData
            });
            sinon.spy(activity.overlay, "destroy");

            $("input#date-range").prop("checked", true).click();
            $("#scheduler-name").val(testName).trigger("change");
            $("#description").val(testDescription).trigger("change");
            $("#start-date1").val("02/19/2017");
            $("#stop-date1").val("12/19/2017");
            $("#start-date2").val("02/19/2018");
            $("#stop-date2").val("12/19/2018");

            $("#time-range-specify").click();
            view.onTimeOptionsChange({day:"sunday", value: "exclude"});
            view.onTimeOptionsChange({day:"monday", value: "all-day"});
            view.onTimeOptionsChange({day:"tuesday", value: "08:30 AM, 11:30 AM; 02:30 PM, 06:30 PM"});

            $.mockjax({
                url: saveScheduleURL,
                type: "POST",
                status: 200,
                contentType: 'text/json',
                dataType: 'json',
                response: function(settings, done2) {
                    this.responseText = settings.data;
                    var schedule = $.parseJSON(settings.data);
                    schedule = schedule["scheduler"];
                    var schedules = schedule.schedules;
                    schedule["name"].should.be.equal(testName);
                    schedule["description"].should.be.equal(testDescription);
                    schedule["start-date1"].should.equal("2017-02-19.00:00");
                    schedule["stop-date1"].should.equal("2017-12-19.00:00");
                    schedule["start-date2"].should.equal("2018-02-19.00:00");
                    schedule["stop-date2"].should.equal("2018-12-19.00:00");
                    console.log(schedule)
                    schedules.schedule[0].exclude.should.be.true; // sunday exclude
                    schedules.schedule[1].exclude.should.be.false; // monday allday
                    schedules.schedule[1]["all-day"].should.be.true;
                    schedules.schedule[2]["start-time1"].should.equal("08:30");
                    schedules.schedule[2]["stop-time1"].should.equal("11:30");
                    schedules.schedule[2]["start-time2"].should.equal("14:30");
                    schedules.schedule[2]["stop-time2"].should.equal("18:30");
                    done2();

                    activity.overlay.destroy.calledOnce.should.be.true;
                    done();
                }
            });
            $("input#scheduler-save").click();
        });
    });

    describe("FW Schedule edit view Unit Tests", function() {
        this.timeout(3000);
        var view = null, model = null;

        before(function() {
            sinon.stub(activity, 'getContext', function() {
                return new Slipstream.SDK.ActivityContext();
            });
            sinon.stub(activity, "getIntent", function() {
                return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_EDIT);
            });
            $.mockjaxSettings.logging = false;
        });

        after(function() {
            $.mockjaxSettings.logging = true;
            activity.getIntent.restore();
            activity.getContext.restore();
            $("#main-content").empty();
            $("#datepicker_wrapper").remove();
        });

        beforeEach(function() {
            $.mockjax.clear();
            model = new SchedulerModel();
            model.set(testScheduleData);
            view = new SchedulerView({
                activity: activity,
                model: model
            });
            view.render();
            $("#main-content").empty();
            $("#main-content").append(view.$el);
        });

        afterEach(function() {
            if (typeof activity.overlay.destroy.restore == "function") {
                activity.overlay.destroy.restore();
            }
            if (typeof activity.buildOverlay.restore == "function") {
                activity.buildOverlay.restore();
            }
        });

        it("should exist schedule editing view with 'EDIT' formMode", function() {
            view.should.exist;
            view.formMode.should.be.equal("EDIT");
        });

        //  set model with sunday-exclude, monday-allday, friday:timerange(08:00)
        // but still i cannot assert if the new view is built with specified params.
        // refactor code to return model for the new view, so that the function could be tested
        it("should build time-options view with time-range options", function() {
            sinon.spy(activity, "buildOverlay");
            $("#scheduler-weekly-tuesday").click();
            activity.buildOverlay.calledOnce.should.be.true;
        });

        it("should change day's time option to time range", function() {
            // invoke function with value (monday, excluded)
            var result = {
                day: "monday",
                value: "08:30 AM, 11:30 AM; 02:30 PM, 06:30 PM"
            };
            $("#time-range-specify").click();
            expect($("div#monday-value").text()).to.be.equal("[scheduler_day_option_allday]");
            view.onTimeOptionsChange(result);
            $("div#monday-value").text().should.equal("08:30 AM [scheduler_day_option_range_to] 11:30 AM");
            $("div#monday-value-second").text().should.contain("02:30 PM [scheduler_day_option_range_to] 06:30 PM");
        });

        it("should save the updated object successfully", function(done) {
            sinon.spy(activity.overlay, "destroy");
            $.mockjax({
                url: checkDuplicateNameURL,
                type: "GET",
                responseText: emptyScheduleData
            });
            // keep same name, but change the description
            $("#description").val(testDescription+"edit").trigger("change");
            view.onTimeOptionsChange({day:"monday", value: "exclude"});
            $.mockjax({
                url: saveScheduleURL+"/262263",
                type: "PUT",
                status: 200,
                contentType: 'text/json',
                dataType: 'json',
                response: function(settings, done2) {
                    this.responseText = settings.data;
                    var response = $.parseJSON(settings.data);
                    response["scheduler"].name.should.be.equal(testName);
                    response["scheduler"].description.should.be.equal(testDescription+"edit");
                    response["scheduler"].schedules.schedule[1].exclude.should.be.true;
                    done2();
                    activity.overlay.destroy.calledOnce.should.be.true;
                    done();
                }
            });
            $("input#scheduler-save").click();
        });
    });

    describe("FW Schedule clone view Unit Tests", function() {
        this.timeout(3000);
        var view = null, model = null;

        before(function() {
            sinon.stub(activity, 'getContext', function() {
                return new Slipstream.SDK.ActivityContext();
            });
            sinon.stub(activity, "getIntent", function() {
                return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CLONE);
            });
            $.mockjaxSettings.logging = false;
        });

        after(function() {
            $.mockjaxSettings.logging = true;
            activity.getIntent.restore();
            activity.getContext.restore();
            $("#main-content").empty();
            $("#datepicker_wrapper").remove();
        });

        beforeEach(function(done) {
            $.mockjax.clear();

            model = new SchedulerModel();
            model.set(testScheduleData);

            view = new SchedulerView({
                activity: activity,
                model: model
            });
            view.render();
            $("#main-content").empty();
            $("#main-content").append(view.$el);
            setTimeout(function(){
                done();
            }, 1000);
        });

        afterEach(function() {
            if (typeof activity.overlay.destroy.restore == "function")
                activity.overlay.destroy.restore();
        });

        it("should exist schedule editing view with 'CLONE' formMode", function() {
            view.should.exist;
            view.formMode.should.be.equal("CLONE");
        });

        // add cases to cover: (totally 5?)
        // 1. date-range changed from range to forever
        // 2. start date is bigger than stop date 
        //    2.1 stop date is less than start date (both 1 and 2)
        //    2.2.stop date == start date, but the stop time value is less than start time (both 1 and 2) 
        it("should save the cloned object successfully", function(done) {
            $.mockjax({
                url: checkDuplicateNameURL,
                type: "GET",
                responseText: emptyScheduleData
            });
            sinon.spy(activity.overlay, "destroy");
            $("#description").val(testDescription+"edit").trigger("change");
            view.onTimeOptionsChange({day:"monday", value: "exclude"});

            $.mockjax({
                url: "/api/juniper/sd/scheduler-management/schedulers/*",
                type: "PUT",
                status: 200,
                contentType: 'text/json',
                dataType: 'json',
                response: function(settings, done2) {
                    this.responseText = settings.data;
                    var schedule = $.parseJSON(settings.data);
                    schedule["scheduler"].name.should.be.equal(testName);
                    schedule["scheduler"].description.should.be.equal(testDescription+"edit");
                    schedule["scheduler"].schedules.schedule[1].exclude.should.be.true;
                    done2();
                    activity.overlay.destroy.calledOnce.should.be.true;
                    done();
                }
            });

            $("input#scheduler-save").click();
        });

    });
});