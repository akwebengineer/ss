/**
 * Created by honglijin on 7/22/16.
 *
 * AntiVirus Wizard View Unit Test
 */
define([
    '../models/antiVirusModel.js',
    '../views/antiVirusWizardView.js'
], function (atVirusModel,
             atVirusWizardView
) {
    describe('AntiVirus Wizard View Unit Test', function () {
        var activity, stubContext, stubIntent, view = null, model = null;
        before(function () {
            activity = new Slipstream.SDK.Activity();
            activity.overlay = {
                destroy: function () {}
            };
            stubContext = sinon.stub(activity, 'getContext', function () {
                return new Slipstream.SDK.ActivityContext();
            });
            stubIntent = sinon.stub(activity, 'getIntent', function () {
                return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE);
            });
        });
        after(function () {
            stubContext.restore();
            stubIntent.restore();
        });
        beforeEach(function(){
            model = new atVirusModel();
            view = new atVirusWizardView({
                activity: activity,
                model: model
            });
        });
        afterEach(function(){
            model=null;
            view=null;
        });

        it('Wizard View should exist', function () {
            view.should.exist;
        });

        it('Wizard View render correctly', function () {
            view.render();
            view.wizard.should.exist;
            console.log(view.wizard)
        });

        
    });
});