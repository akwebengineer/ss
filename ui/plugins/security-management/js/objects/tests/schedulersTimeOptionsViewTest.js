define([
    "../views/schedulersTimeOptionsView.js"
], function(SchedulerTimeOptionsView){
    var activity = new Slipstream.SDK.Activity();
    activity.overlay = {
        destroy: function() {console.log("destroy overlay");}
    };

    describe("FW Schedule Weekly Day's time-options view Unit Tests", function() {
        var view = null,
            parentView = {},
            model = new Backbone.Model(),
            addOnResult = sinon.spy();

        before(function() {
            sinon.stub(activity, 'getContext', function() {
                return new Slipstream.SDK.ActivityContext();
            });
            sinon.stub(activity, "getIntent", function() {
                return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE);
            });
        });

        after(function() {
            activity.getIntent.restore();
            activity.getContext.restore();
        });

        beforeEach(function() {
            $.mockjax.clear();
        });

        afterEach(function() {
            $("#main-content").empty();
            if (typeof activity.overlay.destroy.restore == "function") {
                activity.overlay.destroy.restore();
            }
        });

        it("should show time options view for apply_to_all and with value all-day", function() {
            model.set("title", "apply_to_all");
            model.set("day", "apply_to_all");
            model.set("time-options", "all-day");

            view = new SchedulerTimeOptionsView({
                model: model,
                activity : activity,
                parentView: parentView,
                addOnResult: addOnResult
            });
            view.render();
            $('#main-content').append(view.$el);
            $("#time-options-allday").is(":checked").should.be.true;
            $("#time-options-exclude").is(":checked").should.be.false;
            $("#time-options-timerange").is(":checked").should.be.false;
            $(".slipstream-content-title div").text().should.contain("apply_to_all");
        });

        it("should show time options view for Sunday with value excluded", function() {
            model.set("title", "Sunday");
            model.set("day", "sunday");
            model.set("time-options", "exclude");
            view = new SchedulerTimeOptionsView({
                model: model,
                activity : activity,
                parentView: parentView,
                addOnResult: addOnResult
            });
            view.render();
            $('#main-content').append(view.$el);

            $("#time-options-exclude").is(":checked").should.be.true;
            $("#time-options-allday").is(":checked").should.be.false;
            $("#time-options-timerange").is(":checked").should.be.false;
        });

        it("should show time options view for Monday with time range value", function() {
            model.set("title", "Monday");
            model.set("day", "moday");
            model.set("time-options", "timerange");
            model.set("start-time1", "07:30 AM");
            model.set("stop-time1", "11:30 AM");
            model.set("start-time2", "01:30 PM");
            model.set("stop-time2", "06:30 PM");

            view = new SchedulerTimeOptionsView({
                model: model,
                activity : activity,
                parentView: parentView,
                addOnResult: addOnResult
            });
            view.render();
            $('#main-content').append(view.$el);

            $("#time-options-timerange").is(":checked").should.be.true;
            $("#time-options-allday").is(":checked").should.be.false;
            $("#time-options-exclude").is(":checked").should.be.false;
            $("#time_range_start1 input").val().should.equal("07:30:00");
            $("#time_range_start1 select").val().should.equal("AM");
            $("#time_range_stop1 input").val().should.equal("11:30:00");
            $("#time_range_stop1 select").val().should.equal("AM");
            $("#time_range_start2 input").val().should.equal("01:30:00");
            $("#time_range_start2 select").val().should.equal("PM");
            $("#time_range_stop2 input").val().should.equal("06:30:00");
            $("#time_range_stop2 select").val().should.equal("PM");
        });

        it("should submit the excluded time-options to parent view", function() {
            model.set("title", "friday");
            model.set("day", "friday");
            model.set("time-options", "all-day");
            // click on all-day
            // then submit
            view = new SchedulerTimeOptionsView({
                model: model,
                activity : activity,
                parentView: parentView,
                addOnResult: addOnResult
            });
            view.render();
            $('#main-content').append(view.$el);

            sinon.spy(activity.overlay, "destroy");
            //result
            // change some fields
            $("#time-options-exclude").click();

            var result = {
                "day": "friday",
                "value": "exclude"
            };
            $('#time-options-save').click();
            addOnResult.calledWith(result).should.be.true;
            activity.overlay.destroy.calledOnce.should.be.true;
        });

        it("should submit the updated time-options to parent view", function() {
            model.set("title", "Monday");
            model.set("day", "monday");
            model.set("time-options", "exclude");

            view = new SchedulerTimeOptionsView({
                model: model,
                activity : activity,
                parentView: parentView,
                addOnResult: addOnResult
            });
            view.render();
            $('#main-content').append(view.$el);

            sinon.spy(activity.overlay, "destroy");
            var result = {
                "day": "monday",
                "value": "07:30 AM,11:30 AM;01:30 PM,06:30 PM"
            }

            $("#time-options-timerange").click();
            $("#time_range_start1 input").val("07:30:00");
            $("#time_range_start1 select").val("AM");
            $("#time_range_stop1 input").val("11:30:00");
            $("#time_range_stop1 select").val("AM");

            $("#add_time_range_button").click();
            $("#time_range_start2 input").val("01:30:00");
            $("#time_range_start2 select").val("PM");
            $("#time_range_stop2 input").val("06:30:00");
            $("#time_range_stop2 select").val("PM");

            $('#time-options-save').click();
            addOnResult.calledWith(result).should.be.true;
            activity.overlay.destroy.calledOnce.should.be.true;
        });

        it("should submit time options view for Wednesday with only one time range", function() {
            model.set("title", "Wednesday");
            model.set("day", "wednesday");
            model.set("time-options", "timerange");
            model.set("start-time1", "07:30 AM");
            model.set("stop-time1", "11:30 AM");
            model.set("start-time2", "01:30 PM");
            model.set("stop-time2", "06:30 PM");

            view = new SchedulerTimeOptionsView({
                model: model,
                activity : activity,
                parentView: parentView,
                addOnResult: addOnResult
            });
            view.render();
            $('#main-content').append(view.$el);

            $("#time-options-timerange").is(":checked").should.be.true;
            $("#time-options-allday").is(":checked").should.be.false;

            $("#remove_time_range_button").click(); // remove one time-range
            sinon.spy(activity.overlay, "destroy");
            var result = {
                "day": "wednesday",
                "value": "07:30 AM,11:30 AM"
            }
            $('#time-options-save').click();
            addOnResult.calledWith(result).should.be.true;
            activity.overlay.destroy.calledOnce.should.be.true;
        });

        // to add cases to cover: invalid input, like time is invalid
        it("should destroy overlay view when clicking on cancel button", function() {
            sinon.spy(activity.overlay, "destroy");
            model.set("title", "tuesday");
            model.set("exclude", "true");

            view = new SchedulerTimeOptionsView({
                model: model,
                activity : activity,
                parentView: parentView,
                addOnResult: addOnResult
            });
            view.render();
            view.cancel($.Event());
            activity.overlay.destroy.calledOnce.should.be.true;
        });
    })
});