/**
 *
 */
define([
        '../models/serviceReplaceModel.js',
        '../views/serviceSelectionGridView.js',
        '../views/serviceReplaceView.js'
],function( ServiceReplaceModel, ServiceSelectionGridView, ServiceReplaceView ){
    describe("ServiceSelectionGridView Unit Test", function(){
        var context, activity;
        var view = null;
        var intent, model = null;
        var parentView;
        before(function(){
            activity = new Slipstream.SDK.Activity();
            contextStub = sinon.stub(activity, 'getContext', function(){
                return new Slipstream.SDK.ActivityContext();
            });
            intentStub = sinon.stub(activity, "getIntent", function() {
                return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_EDIT);
            });
            model = new ServiceReplaceModel();
            var extras = activity.getIntent().getExtras();
            extras.selectedRows = [{ "domain-id ": "2", "domain-name": "Global", "id":"393477", "is-group":"Service", "name":"111111111111" }];
            parentView = new ServiceReplaceView({
                activity: activity,
                model: model,
                extras:extras,
                context: activity.getContext()
            });
        });

        after(function(){
            contextStub.restore();
            intentStub.restore();
        });

        beforeEach(function(){
            view = new ServiceSelectionGridView({
                activity : activity,
                parentView : parentView,
                context : parentView.context,
                containerId : "service-selection-replace"
            });
        });

        it("View should exist", function(){
            view.should.exist;
        });

        it("View.form should exist and gridWidget is properly built", function(){
            view.render();
            view.gridWidget.should.exist;
            view.form.should.exist;
        });

        it("Test submit function with no selection", function(){
            view.render();
            var getSelectedRowsStub = sinon.stub(view.gridWidget, "getSelectedRows", function(){
                return [];
            });
            var logSpy = sinon.spy(console,'log');
            view.submit(new $.Event());
            assert(logSpy.calledWith("grid has no selections"));
            logSpy.restore();
            getSelectedRowsStub.restore();
        })

        it("Test submit function with proper selection", function(){
            view.render();
            var getSelectedRowsStub = sinon.stub(view.gridWidget, "getSelectedRows", function(){
                return [{"id":393477, "name":"test", "domain-name":'Global'}];
            });
            parentView.overlay = {
                destroy: function() {}
            };
            var destroySpy = sinon.spy(parentView.overlay, 'destroy');
            view.submit(new $.Event());
            destroySpy.calledOnce.should.be.true;
            destroySpy.restore();
            getSelectedRowsStub.restore();
        });

        it("Test cancel function", function(){
            view.render();
            parentView.overlay = {
                destroy: function() {}
            };
            var destroySpy = sinon.spy(parentView.overlay, 'destroy');
            view.cancel(new $.Event());
            destroySpy.calledOnce.should.be.true;
            destroySpy.restore();
        });

        it("Test excludeService function", function(){
            var nameArr = ["Any", "aaaaaaaaaaa"];
            var ret = view.excludeService(nameArr);
            ret[0].modifier.should.be.equal('ne');
            ret[0].property.should.be.equal('name');
            ret[0].value.should.be.equal('Any');
            ret[1].value.should.be.equal('aaaaaaaaaaa');
        });

        it("Test setSelectedService function", function(){
            parentView.render();
            view.render();
            var container = view.parentView.$el.find('#service-selection-replace');
            container.attr('dataId', 393477);
            var toggleRowSelectionSpy = sinon.spy(view.gridWidget,"toggleRowSelection");
            view.setSelectedService();
            toggleRowSelectionSpy.calledOnce.should.be.true;
            toggleRowSelectionSpy.restore();
        });
    });
})