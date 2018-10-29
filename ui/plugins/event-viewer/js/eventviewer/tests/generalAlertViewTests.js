/**
 * A view implementing general form workflow for Create Alert Wizard
 *
 * @module generalAlertView unit tests
 * @author shinig
 * @copyright Juniper Networks, Inc. 2016
 */

define([
	"../../../../event-viewer/js/eventviewer/views/generalAlertView.js",
	"../../../../event-viewer/js/eventviewer/models/alertDefinitionModel.js"
	], function(GeneralAlertView, AlertDefinitionModel) {

	var activity = new Slipstream.SDK.Activity(), context,
        view, model;

	describe("Alert Wizard General Information unit tests", function() {

        describe("Alert Wizard initialization", function() {
            before(function(){
                model = new AlertDefinitionModel();
                context = new Slipstream.SDK.ActivityContext();

                view = new GeneralAlertView({
                    activity: activity,
                    context: context,
                    model: model
                });
            });

            after(function () {

            });

            it("AlertDefinitionModel model exists ?", function() {
                model.should.exist;
            });

            it("General Information View exists ?", function() {
                view.should.exist;
            });

            it("General Information View rendered ?", function() {
                view.render();
                view.formWidget.should.exist;
            });

            describe("Check General Information View has Valid Input beforePageChange", function() {

                var isValidInput, setGeneralInfo;
                beforeEach(function() {
                    isValidInput = sinon.stub(view.formWidget, "isValidInput", function() { return true;})
                    setGeneralInfo = sinon.stub(view, "setGeneralInfo", function() {return true; })
                });

                afterEach(function(){
                    isValidInput.restore();
                    setGeneralInfo.restore();
                });

                it("Check is the form valid", function() {
                    view.beforePageChange();
                    isValidInput.called.should.be.equal(true);
                    setGeneralInfo.called.should.be.equal(true);
                });

            });

            describe("Check General Information View isn't have Valid Input beforePageChange", function() {

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

            it("Get Summary of General Information view - getSummary", function() {
                view.getSummary();
            });

            it("Calling setGeneralInfo to return json object", function() {
                var properties = {
                    description : "test",
                    name : "new Alert Definition",
                    severity : "1",
                    status : true
                }

                view.setGeneralInfo(properties);
            });

        });
    });

});