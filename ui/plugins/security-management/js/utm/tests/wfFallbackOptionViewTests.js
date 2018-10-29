define([
        '../../../../security-management/js/utm/views/webFilteringFallbackOptionFormView.js',
        '../../../../security-management/js/utm/models/webFilteringModel.js'
], function(webFilteringFallbackView, WfModel) {

    var activity = new Slipstream.SDK.Activity();

    describe("webFilteringFallbackView unit-tests", function() {

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
                    view = new webFilteringFallbackView(viewParams);

                    getMessage = sinon.stub(context, "getMessage", function(key1) {return key1; })
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
                    model.set("fallback-default-action", true);
                    view.render();

                    $('#main-content').empty();
                    $('#main-content').append(view.$el);
                    $("#utm-webfiltering-fallback-default-action option")[0].value.should.be.equal("LOG_AND_PERMIT");
                    $("#utm-webfiltering-fallback-default-action option")[1].value.should.be.equal("BLOCK");
                });

                it("view can be rendered successfully, 'profile-type' is 'SURF_CONTROL'", function() {
                    model.set("profile-type", "SURF_CONTROL");
                    view.render();

                    $('#main-content').empty();
                    $('#main-content').append(view.$el);
                    $("#utm-webfiltering-fallback-default-action option")[0].value.should.be.equal("LOG_AND_PERMIT");
                    $("#utm-webfiltering-fallback-default-action option")[1].value.should.be.equal("BLOCK");
                });

                it("view can be rendered successfully, 'profile-type' is 'JUNIPER_ENHANCED'", function() {
                    model.set("profile-type", "JUNIPER_ENHANCED");
                    model.set("enable-global-reputation", true);
                    model.set("very-safe", "BLOCK");
                    model.set("moderately-safe", "BLOCK");
                    model.set("fairly-safe", "BLOCK");
                    model.set("suspicious", "BLOCK");
                    model.set("harmful", "PERMIT");
                    view.render();

                    $('#main-content').empty();
                    $('#main-content').append(view.$el);
                    $("#enable-global-reputation")[0].checked.should.be.equal(true);
                    $("#very-safe")[0].value.should.be.equal("BLOCK");
                    $("#moderately-safe")[0].value.should.be.equal("BLOCK");
                    $("#fairly-safe")[0].value.should.be.equal("BLOCK");
                    $("#suspicious")[0].value.should.be.equal("BLOCK");
                    $("#harmful")[0].value.should.be.equal("PERMIT");
                });

                it("view can be rendered successfully, 'profile-type' is 'JUNIPER_ENHANCED', different initial value", function() {
                    model.set("profile-type", "JUNIPER_ENHANCED");
                    model.set("enable-global-reputation", false);
                    model.set("very-safe", false);
                    model.set("moderately-safe", false);
                    model.set("fairly-safe", false);
                    model.set("suspicious", false);
                    model.set("harmful", false);
                    view.render();

                    $('#main-content').empty();
                    $('#main-content').append(view.$el);
                    $("#enable-global-reputation")[0].checked.should.be.equal(false);
                    $("#very-safe")[0].value.should.be.equal("PERMIT");
                    $("#moderately-safe")[0].value.should.be.equal("LOG_AND_PERMIT");
                    $("#fairly-safe")[0].value.should.be.equal("LOG_AND_PERMIT");
                    $("#suspicious")[0].value.should.be.equal("QUARANTINE");
                    $("#harmful")[0].value.should.be.equal("BLOCK");
                });

                it("view getTitle function works fine", function() {
                    var title = view.getTitle();
                    title.should.be.equal('');
                });

                it("view getSummary function works fine, profile-type is WEBSENSE, 'enable-global-reputation' is true", function() {
                    model.set("profile-type", "WEBSENSE");
                    model.set("enable-global-reputation", true);
                    model.set("fallback-default-action", "BLOCK");
                    var summary = view.getSummary();
                    summary[0].value.should.be.equal(' ');
                    summary[1].value.should.be.equal('utm_web_filtering_default_action_block');
                });

                it("view getSummary function works fine, profile-type is WEBSENSE, 'enable-global-reputation' is false", function() {
                    model.set("profile-type", "WEBSENSE");
                    model.set("enable-global-reputation", false);
                    model.set("default-action", "BLOCK");
                    var summary = view.getSummary();
                    summary[0].value.should.be.equal(' ');
                    summary[1].value.should.be.equal("BLOCK");
                });

                it("view getSummary function works fine, profile-type is SURF_CONTROL, 'enable-global-reputation' is false", function() {
                    model.set("profile-type", "SURF_CONTROL");
                    model.set("enable-global-reputation", false);
                    model.set("default-action", "BLOCK");
                    var summary = view.getSummary();
                    summary[0].value.should.be.equal(' ');
                    summary[1].value.should.be.equal("BLOCK");
                });

                it("view beforePageChange works fine", function() {
                    var ret = view.beforePageChange();
                    ret.should.be.equal(true);
                });

                it("view beforePageChange works fine when form is invalid", function() {
                    view.render();
                    var logSpy = sinon.spy(console, "log");
                    var isValidInput = sinon.stub(view.formWidget, 'isValidInput', function() {
                        return 0;
                    });
                    view.beforePageChange();
                    assert(logSpy.calledWith('form is invalid'));
                    isValidInput.restore();
                    logSpy.restore();
                });

            });
    });
});