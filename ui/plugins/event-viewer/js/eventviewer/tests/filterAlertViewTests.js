/**
 *  A view implementing filter form workflow for Create Alert Wizard
 *
 * @module filterAlertView unit tests
 * @author shinig
 * @copyright Juniper Networks, Inc. 2016
 */

define([
	"../../../../event-viewer/js/eventviewer/views/filterAlertView.js",
	"../../../../event-viewer/js/eventviewer/models/alertDefinitionModel.js"
	], function(FilterAlertView, AlertDefinitionModel) {

	var activity = new Slipstream.SDK.Activity(), context,
        view, model;

	describe("Alert Wizard Data Criteria view unit tests", function() {
        describe("Alert Wizard initialization", function() {
            before(function(){
                model = new AlertDefinitionModel();
                context = new Slipstream.SDK.ActivityContext();
                var filterObj = {
                   "aggregation": "none",
                   "durationUnit": 0,
                   "duration": 300000,
                   "time-period": "Last 30 minute(s)",
                   "filter-string": "event-category = antispam",
                   "formatted-filter": {"and": [{"filter": {"key": "event-type", "operator": "EQUALS", "value": "AAMW_ACTION_LOG"}}]}
                };

                view = new FilterAlertView({
                    activity: activity,
                    context: context,
                    model: model,
                    filterObj: filterObj
                });
            });

            after(function () {

            });

            it("model exists ?", function() {
                model.should.exist;
            });

            it("Data Criteria View exists ?", function() {
                view.should.exist;
            });

            it("Data Criteria View rendered ?", function() {
                view.render();
                view.formWidget.should.exist;
            });

            it("Data Criteria View rendered on click of Back button", function() {
                var dataObj = {
                    "alertcriteria":{
                        "threshhold":  33
                    }
                };
                model.set(dataObj);
                view.render();
                view.formWidget.should.exist;
            });

            describe("Check Data Criteria View has Valid Input beforePageChange", function() {

                var isValidInput, setFilterInfo;
                beforeEach(function() {
                    isValidInput = sinon.stub(view.formWidget, "isValidInput", function() { return true;})
                    setFilterInfo = sinon.stub(view, "setFilterInfo", function() {return true; })
                });

                afterEach(function(){
                    isValidInput.restore();
                    setFilterInfo.restore();
                });

                it("Check is the form valid", function() {
                    view.beforePageChange();
                    isValidInput.called.should.be.equal(true);
                    setFilterInfo.called.should.be.equal(true);
                });

            });

            describe("Check Data Criteria View isn't have Valid Input beforePageChange", function() {

                var isValidInput;
                beforeEach(function() {
                    isValidInput = sinon.stub(view.formWidget, "isValidInput", function() { return false;})
                });

                afterEach(function(){
                    isValidInput.restore();
                });

                it("Check is the form valid", function() {
                    view.beforePageChange();
                    isValidInput.called.should.be.equal(true);
                });

            });

            it("Return Title of the view - getTitle", function() {
                view.getTitle();
            });

            it("Get Summary of Data Criteria view - getSummary", function() {
                view.getSummary();
            });

            it("Calling setFilterInfo to return json object", function() {
                var properties = {
                   "aggregation": "none",
                   "duration-unit": 1,
                   "duration": 300000,
                   "filter-string": "event-category = antispam",
                   "formatted--filter": {"and": [{"filter": {"key": "event-type", "operator": "EQUALS", "value": "AAMW_ACTION_LOG"}}]},
                   "threshhold":  33
                };

                view.setFilterInfo(properties);
            });


        });



	});
});