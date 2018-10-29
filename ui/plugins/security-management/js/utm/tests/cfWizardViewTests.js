define([
    '../models/contentFilteringModel.js',
    '../views/contentFilteringWizardView.js'
], function(
    CfModel,
    CfWizardView
) {
    describe("contentFilteringWizardView.js unit-tests", function() {
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

           model = new CfModel();

           view = new CfWizardView({
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
    });
});