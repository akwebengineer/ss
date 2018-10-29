/**
 * Create Alert Definition Short Wizard
 *
 * @module alertWizardView unit test
 * @author shinig
 * @copyright Juniper Networks, Inc. 2016
 */

define([
	"../../../../event-viewer/js/eventviewer/models/alertDefinitionModel.js",
	"../../../../event-viewer/js/eventviewer/views/alertWizardView.js",
	"widgets/shortWizard/shortWizard"
	], function(AlertDefinitionModel, AlertWizardView, ShortWizard) {

	var activity = new Slipstream.SDK.Activity(),
        view, model, filterObj, pages = new Array(), save;


	describe("Event Viewer - Alert Definition Create Wizard unit tests", function() {

        describe("Alert Wizard initialization", function() {
            before(function(){
                model = new AlertDefinitionModel();
                filterObj   = {
                  "aggregation": "none",
                   "durationUnit": 0,
                   "duration": 7200000,
                   "timePeriod": "Last 30 minute(s)",
                   "filterString": "event-category = antispam",
                   "formattedFilter": {"and": [{"filter": {"key": "event-type", "operator": "EQUALS", "value": "AAMW_ACTION_LOG"}}]}
                };

                view = new AlertWizardView({
                    activity: activity,
                    context: new Slipstream.SDK.ActivityContext(),
                    model: model,
                    filterObj:filterObj

                });
            });
            after(function () {
            });

            it("AlertDefinitionModel model exists ?", function() {
                model.should.exist;
            });

            it("Alert Wizard View exists ?", function() {
                view.should.exist;
            });

            it("Start Short Wizard view rendered ?", function() {
                view.render();
            });

        });
    });

});