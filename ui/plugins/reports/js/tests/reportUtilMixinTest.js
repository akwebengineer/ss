/**
 * Unit test file for Report Util Mixin
 *
 * @module reports
 * @author Shini <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    "../utils/reportUtilMixin.js"
    ], function(ReportUtilMixin) {

    describe("Unit test cases for Report Util Mixin ", function() {
        var util;
        before(function(){
            util = ReportUtilMixin;
        });

        after(function() {
            //
        });

        it("Check reports util exists ?", function() {
            util.should.exist;
        });

        it("Check isEnableRunReport is called ?", function() {
            var selectedRows = {},
                response = util.isEnableRunReport(selectedRows);
            response.should.be.equals(false);
        });

        it("Check isEnableRunReport is called and returns true ?", function() {
            var selectedRows = {length:1},
                reportType = sinon.stub(util, "notPolicyAnalysisReport", function(selectedRows) {return true;});
            var response = util.isEnableRunReport(selectedRows);
            reportType.called.should.be.equal(true);
            reportType.restore();
            response.should.be.equals(true);
        });

        it("Check notPolicyAnalysisReport is called ?", function() {
            var selectedRows = {0: {"report-content-type": "POLICY_ANOMALY"}, "length":1},
                response = util.notPolicyAnalysisReport(selectedRows);
            response.should.be.equals(false);
        });


        it("Check notPolicyAnalysisReport is called and returns true ?", function() {
            var selectedRows = {0: {"report-content-type": "BANDWIDTH"}, "length":1},
                response = util.notPolicyAnalysisReport(selectedRows);
            response.should.be.equals(true);
        });

    });

});