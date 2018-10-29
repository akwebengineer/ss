/**
 *
 */
define([
        '../models/serviceReplaceModel.js',
        '../views/serviceReplaceView.js'
],function( ServiceReplaceModel, ServiceReplaceView ){
    describe("ServiceReplaceView Unit Test", function(){
        var context, activity;
        var view = null;
        var intent, model = null;
        before(function(){
            activity = new Slipstream.SDK.Activity();
            contextStub = sinon.stub(activity, 'getContext', function(){
                return new Slipstream.SDK.ActivityContext();
            });
            intentStub = sinon.stub(activity, "getIntent", function() {
                return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_EDIT);
            });
            model = new ServiceReplaceModel();
        });

        after(function(){
            contextStub.restore();
            intentStub.restore();
        });

        beforeEach(function(){
            var extras = activity.getIntent().getExtras();
            extras.selectedRows = [{ "domain-id ": "2", "domain-name": "Global", "id":"393477", "is-group":"Service", "name":"111111111111" }];
            view = new ServiceReplaceView({
                activity: activity,
                model: model,
                extras: extras
            });
        });

        it("View should exist", function(){
            view.should.exist;
        });

        it("View.form should exist", function(){
            view.render();
            view.form.should.exist;
        });

        it("Test submit funtion with invalid input", function(){
            view.render();
            var logSpy = sinon.spy(console,"log");
            view.$el.find('#service-selection-replace').val('').trigger('change');
            view.submit(new $.Event());
            assert(logSpy.calledWith('form is invalid'));
            logSpy.restore();
        });

        it("Test submit funtion with valid input", function(){
            view.render();
            var validateReplaceObjectSpy = sinon.spy(view,'validateReplaceObject');
            view.$el.find('#service-selection-replace').val('abc').trigger('change');
            view.submit(new $.Event());
            validateReplaceObjectSpy.calledOnce.should.be.true;
            validateReplaceObjectSpy.restore();
        });

        it("Test cancel function", function(){
            view.render();
            activity.overlay = {
                destroy: function() {}
            };
            var destroySpy = sinon.spy(view.activity.overlay, 'destroy');
            view.cancel(new $.Event());
            destroySpy.calledOnce.should.be.true;
            destroySpy.restore();
        });

        it("Test selectService function", function(){
            view.render();
            var e = new $.Event();
            e = {
                currentTarget : { id :'service-selection-replace' }
            }
            view.selectService(e);
            view.overlay.should.be.exist;
        });
    });
})