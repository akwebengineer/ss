/**
 *
 */
define([
        '../views/serviceSelectionView.js'
],function( ServiceSelectionView ){
    describe("ServiceSelectionView Unit Test", function(){
        var context, activity;
        var view = null;
        var intent, model = null;
        before(function(){
            activity = new Slipstream.SDK.Activity();
            context = sinon.stub(activity, 'getContext', function(){
                return new Slipstream.SDK.ActivityContext();
            });
            intent = sinon.stub(activity, 'getIntent', function(){
                return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE);
            });
        });

        after(function(){
            context.restore();
            intent.restore();
        });

        beforeEach(function(){
            view = new ServiceSelectionView({
                activity: activity
            });
        });

        it("View should exist", function(){
            view.should.exist;
        });

        it("View.form should exist", function(){
            view.render();
            view.form.should.exist;
        });

        describe("Test submit function", function(){
            it("When listbuilder has no selection", function(){
                view.render();
                var logSpy = sinon.spy(console, "log");
                var getSelectedItemsStub = sinon.stub(view.listBuilder, "getSelectedItems",function(callback){
                    var obj = {
                        "services":{
                            "service":[],
                            "total":0
                        }
                    };
                    callback(obj);
                });
                view.submit(new $.Event());
                assert(logSpy.calledWith('listbuilder has no selections'));
                logSpy.restore();
                getSelectedItemsStub.restore();
            });

            it("When listbuilder has selections", function(){
                view.render();
                activity.overlay = {
                    destroy: function() {}
                };
                var getSelectedItemsStub = sinon.stub(view.listBuilder, 'getSelectedItems', function(callback) {
                    var availableLists = {"services": {
                        "service" :[
                            {"id": 163880, "name" : "service1", "domain-name" : "SYSTEM"},
                            {"id": 163905, "name" : "service2", "domain-name" : "SYSTEM"}
                        ],
                        "total":2
                    }}
                    callback(availableLists);
                });
                var destroySpy = sinon.spy(view.activity.overlay, 'destroy');
                view.submit(new $.Event());
                destroySpy.calledOnce.should.be.true;
                destroySpy.restore();
                getSelectedItemsStub.restore();
            })
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

        it("Test render function", function(){
            view.render();
            view.listBuilder.renderListBuilder();
            view.listBuilder.buildCallback();
            view.$el.find('.new-list-builder-widget').parent()[0].nodeName.should.not.be.equal('INPUT');
            view.listBuilder.should.be.exist;
        });
    });
});