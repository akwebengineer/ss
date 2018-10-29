define([
        '../../../../security-management/js/utm/views/webFilteringUrlCategoryFormView.js',
        '../../../../security-management/js/utm/models/webFilteringModel.js'
], function(WfUrlCategoryView, WfModel) {

    var activity = new Slipstream.SDK.Activity();

    describe("webFilteringUrlCategory unit-tests", function() {

        describe("View tests", function() {
                var view = null, intent, model = null, getMessage = null;
                var context = new Slipstream.SDK.ActivityContext();

                //executes once
                before(function () {
                    intent = sinon.stub(activity, 'getIntent', function() {
                         return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE);
                    });

                    model = new WfModel();

                    var viewParams = {
                        context: context,
                        activity: activity,
                        model: model,
                        title:''
                    };
                    view = new WfUrlCategoryView(viewParams);

                    getMessage = sinon.stub(context, "getMessage", function(key1, key2) {return key1+key2; })
                    view.wizardView = {addRemoteNameValidation: function(){console.log('Remote name check');}}
                });

                after(function () {
                    getMessage.restore();
                    intent.restore();
                });

                it("view should exist", function() {
                    view.should.exist;
                });

                it("view can be rendered successfully", function() {
                    view.render();
                    view.formWidget.should.exist;
                });

                it("view can be rendered successfully, 'profile-type' is 'WEBSENSE'", function() {
                    model.set("profile-type", "WEBSENSE");
                    view.render();

                    $('#main-content').append(view.$el);
                    $("#action-list-form:hidden").should.exist;
                });
                
                it("view can be rendered successfully, 'profile-type' is 'SURF_CONTROL'", function() {
                    model.set("profile-type", "SURF_CONTROL");
                    view.render();

                    $('#main-content').append(view.$el);
                    $(".quarantine-action-list-settings:hidden").should.exist;
                });

                it("view getTitle function works fine", function() {
                    var title = view.getTitle();
                    title.should.be.equal('');
                });

                it("view createAction function works fine", function() {
                    var logSpy = sinon.spy(console, "log");
                    var event = {
                            "data":{"action":"deny"}
                    };
                    model.set("deny-action-list", [{"label":"Clone_modified", "value":"96621"}]);
                    var startActivityForResult = sinon.stub(view.context, 'startActivityForResult', function(intent, option){
                        option({}, {id: 123, name: 'test'});
                    });

                    view.createAction(event);
                    assert(logSpy.calledWith('got result from select'));

                    logSpy.restore();
                    startActivityForResult.restore();
                });

                it("view createAction function works fine, duplicated items need to be deleted", function() {
                    var event = {
                            "data":{"action":"deny",
                                    "value":"96621"}
                    };
                    model.set("permit-action-list", [{"label":"Clone_modified", "value":"96621"}]);
                    var startActivityForResult = sinon.stub(view.context, 'startActivityForResult', function(intent, option){
                        option({}, [{"label":"Clone_modified", "value":"96621"}]);
                    });

                    view.createAction(event);
                    model.get("permit-action-list").length.should.be.equal(0);

                    startActivityForResult.restore();
                });

                it("view createAction function works fine, no duplicated item", function() {
                    var event = {
                            "data":{"action":"deny",
                                    "value":"96621"}
                    };
                    model.set("permit-action-list", [{"label":"test", "value":"123"}]);
                    var startActivityForResult = sinon.stub(view.context, 'startActivityForResult', function(intent, option){
                        option({}, [{"label":"Clone_modified", "value":"96621"}]);
                    });

                    view.createAction(event);
                    model.get("permit-action-list").length.should.be.equal(1);

                    startActivityForResult.restore();
                });

                it("view getSummary function works fine", function() {
                    model.set("deny-action-list", [{"label":"Clone_modified", "value":"96621"}]);
                    model.set("permit-action-list", [{"label":"Clone_modified", "value":"96621"}]);

                    var summary = view.getSummary();
                    summary[1].value.should.be.equal("utm_web_filtering_summary_title_category_selected1");
                    summary[2].value.should.be.equal('utm_web_filtering_summary_title_category_selected0');
                    summary[3].value.should.be.equal('utm_web_filtering_summary_title_category_selected1');
                });
                
                it("view getSummary function works fine, profile-type is JUNIPER_ENHANCED", function() {
                    model.set("deny-action-list", [{"label":"Clone_modified", "value":"96621"}]);
                    model.set("permit-action-list", [{"label":"Clone_modified", "value":"96621"}]);
                    model.set("profile-type", "JUNIPER_ENHANCED");
 
                    var summary = view.getSummary();
                    summary[1].value.should.be.equal("utm_web_filtering_summary_title_category_selected1");
                    summary[2].value.should.be.equal('utm_web_filtering_summary_title_category_selected0');
                    summary[3].value.should.be.equal('utm_web_filtering_summary_title_category_selected1');
                });

                it("view beforePageChange works fine", function() {
                    var ret = view.beforePageChange();
                    ret.should.be.equal(true);
                });

            });
    });
});