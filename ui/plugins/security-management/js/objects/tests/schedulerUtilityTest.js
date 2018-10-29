define([
    "../views/schedulerUtility.js"
], function(scheduleUtilty){
    describe("FW Schedule utility file Unit Tests", function() {
        after(function() {
            if (typeof console.log.restore == "function") {
                console.log.restore();
            }
        });
        it("should convert time with PM tag to 24-hour format (not 12PM)", function() {
            var result = scheduleUtilty.getTime24("09:23:23 PM");
            expect(result).to.be.equal("21:23:23");
        });

        it("should convert time with PM tag to 24-hour format (12PM)", function() {
            var result = scheduleUtilty.getTime24("12:23:23 PM");
            expect(result).to.be.equal("12:23:23");
        });

        it("should convert time with AM tag to 24-hour format (not 12AM)", function() {
            var result = scheduleUtilty.getTime24("11:23 AM");
            expect(result).to.be.equal("11:23");
        });

        it("should convert time with AM tag to 24-hour format (12AM)", function() {
            var result = scheduleUtilty.getTime24("12:23:45 AM");
            expect(result).to.be.equal("00:23:45");
        });

        it("should log error if time is invalid", function() {
            var logSpy = sinon.spy(console, "log");
            var result = scheduleUtilty.getTime24("sf:23432 PM");
            logSpy.calledWith("parse time error");
            logSpy.restore();
        });

        it("should convert 24-hour to time with AM tag", function() {
            var result = scheduleUtilty.getTimeAMPM("11:23");
            expect(result).to.be.equal("11:23 AM");
        });

        it("should convert 24-hour to time with AM tag (12AM)", function() {
            var result = scheduleUtilty.getTimeAMPM("00:23");
            expect(result).to.be.equal("12:23 AM");
        });

        it("should convert 24-hour to time with PM tag", function() {
            var result = scheduleUtilty.getTimeAMPM("20:23");
            expect(result).to.be.equal("08:23 PM");
        });

        it("should convert 24-hour to time with PM tag (12PM)", function() {
            var result = scheduleUtilty.getTimeAMPM("12:23");
            expect(result).to.be.equal("12:23 PM");
        });

        it("should return date in YYYY-MM-DD format by default", function() {
            var result = scheduleUtilty.formatDate("03/22/2016");
            expect(result).to.be.equal(Slipstream.SDK.DateFormatter.format(new Date(Date.parse("03/22/2016")), scheduleUtilty.DATE_SAVE_FORMAT));
        });

        it("should return date in MM/DD/YYYY with param specified", function() {
          var format = "MM/DD/YYYY";
          var result = scheduleUtilty.formatDate("2015-03-22", format);
          expect(result).to.be.equal(Slipstream.SDK.DateFormatter.format(new Date(Date.parse("2015-03-22")), format));
        });

        it("should return the day before today in MM/DD/YYYY format", function() {
            var result = scheduleUtilty.getAfterDate();
            var today = (new Date()).getTime(); // today - 1 day = yesterday
            var yesterday = new Date(today - 24 * 60 * 60 * 1000);
            yesterday = Slipstream.SDK.DateFormatter.format(yesterday, "MM/DD/YYYY");
            expect(result).to.be.equal(yesterday);
        });

        it("should return object with specify labels", function() {
            var context = new Slipstream.SDK.ActivityContext();
            var result = scheduleUtilty.getFieldLabels(context);
            expect(result.exclude).to.contain("scheduler_day_option_excluded");
        });
    })
});