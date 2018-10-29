define([
    '../models/webFilteringModel.js',
    '../views/webFilteringWizardView.js'
], function(
    wfModel,
    wfWizardView
) {
    describe("webFilteringWizardView.js unit-tests", function() {
        var activity, stub, intent, view = null, model = null;
        before(function() {

           activity = new Slipstream.SDK.Activity();

           stub = sinon.stub(activity, 'getContext', function() {
                return new Slipstream.SDK.ActivityContext();
           });

           activity.overlay = {
                    destroy: function() {}
           };

           intent = sinon.stub(activity, 'getIntent', function() {
               return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE);
           });

           model = new wfModel();

           view = new wfWizardView({
               activity: activity,
               model: model
           });
        });

        after(function() {
           stub.restore();
           intent.restore();
        });

        it("view should exist", function() {
            view.should.exist;
        });

        it("view render works fine", function() {
            view.render();
            view.wizard.should.exist;
        });

        it("view.beforeSave works fine", function() {
            view.beforeSave();
            model.get("definition-type").should.be.equal("CUSTOM");
        });

        it("view.beforeSave works fine, 'enable-global-reputation' is true", function() {
            model.set("enable-global-reputation",true);
            view.beforeSave();
            model.get("site-reputation-actions").should.exist;
        });

        it("view.editUrlCategoryJsonData works fine", function() {
            var action = {
                "type":"log-and-permit",
                "value":"LOG_AND_PERMIT"
            };
            var urlCategoryList = [];

            var list = [{"label":"ddd", "value":426008},{"label":"Enhanced_General_Email", "value":65614}];
            model.set("log-and-permit-action-list",list);

            view.editUrlCategoryJsonData(action,urlCategoryList);
            expect(urlCategoryList).to.have.lengthOf(2);
        });
    });
});