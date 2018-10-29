define([
        '../../../../security-management/js/utm/views/webFilteringGeneralFormView.js',
        '../../../../security-management/js/utm/models/webFilteringModel.js',
        'backbone.syphon'
], function(WfGeneralView, WfModel,Syphon) {

    describe("webFilteringGeneralView unit-tests", function() {
                var view = null, wizardView = null, model = null, getMessage = null;
                var activity = new Slipstream.SDK.Activity();
                var context = new Slipstream.SDK.ActivityContext();

                //executes once
                before(function () {
                    model = new WfModel();

                    var viewParams = {
                        context: context,
                        activity: activity,
                        model: model,
                        title:''
                    };
                    view = new WfGeneralView(viewParams);

                    getMessage = sinon.stub(context, "getMessage", function(msg) {return msg; })
                    view.wizardView = {addRemoteNameValidation: function(){}}
                });

                after(function () {
                    getMessage.restore();
                });

                it("view should exist", function() {
                    view.should.exist;
                });

                it("view can be rendered successfully", function() {
                    view.render();
                    view.formWidget.should.exist;
                });

                it("view getTitle function works fine", function() {
                    var title = view.getTitle();
                    title.should.be.equal('');
                });

                it("view getSummary function works fine, safe-search is false", function() {
                    var jsonObj = {
                            "name": "wfProfileName", 
                            "description": "wfProfileDiscription", 
                            "id": 327795, 
                            "safe-search": false,
                            "custom-block-message": "block message", 
                            "quarantine-custom-message": "qqq Custom Quarantine Message",
                            "profile-type": "JUNIPER_ENHANCED"
                    };
                    model.set(jsonObj);
                    var summary = view.getSummary();

                    summary[1].value.should.be.equal('wfProfileName');
                    summary[2].value.should.be.equal('wfProfileDiscription');
                    summary[6].value.should.be.equal('utm_web_filtering_safe_search_unchecked');
                });

                it("view getSummary function works fine, safe-search is true", function() {
                    var jsonObj = {
                            "name": "wfProfileName", 
                            "description": "wfProfileDiscription", 
                            "id": 327795, 
                            "safe-search": true,
                            "custom-block-message": "block message", 
                            "quarantine-custom-message": "qqq Custom Quarantine Message",
                            "profile-type": "JUNIPER_ENHANCED"
                    };
                    model.set(jsonObj);
                    var summary = view.getSummary();
                    summary[1].value.should.be.equal('wfProfileName');
                    summary[2].value.should.be.equal('wfProfileDiscription');
                    summary[6].value.should.be.equal('utm_web_filtering_safe_search_checked');
                });

                it("changeEngineType works fine, previous options need reset", function() {
                    var stub = sinon.spy(view, "createConfirmationDialog");

                    model.set("wizard_reset_flag", true);
                    model.set("profile-type", "WEBSENSE");
                    view.changeEngineType();
                    stub.called.should.be.true
                    stub.restore();
                    model.clear();
                });

                it("changeEngineType works fine, change engine type, previous options does not need reset", function() {
                    var stub = sinon.spy(view, "showAdvancedInput");

                    model.set("wizard_reset_flag", false);
                    view.changeEngineType();
                    stub.called.should.be.true;
                    stub.restore();
                });

                it("Test beforePageChange, current step is larger than request step", function() {
                    var ret = view.beforePageChange(2,1);
                    ret.should.be.true;
                });

                it("Test beforePageChange, form invalid check", function() {
                    var logSpy = sinon.spy(console, "log"),
                        isTextareaValid = sinon.stub(view, 'isTextareaValid', function(){return false;});

                    model.set("name", "");

                    var ret = view.beforePageChange(1,2).should.be.false;

                    assert(logSpy.calledWith('form is invalid'));
                    isTextareaValid.called.should.be.equal(true);
                    isTextareaValid.restore();
                    logSpy.restore();
                });

                it("Test beforePageChange, profile-type is JUNIPER_ENHANCED", function() {
                    model.set("name", "test");
                    view.render();

                    var stub = sinon.stub(Syphon, 'serialize', function () {
                        var jsonObj = {
                                "name": "wfProfileName", 
                                "description": "wfProfileDiscription", 
                                "id": 327795, 
                                "safe-search": true,
                                "custom-block-message": "block message", 
                                "quarantine-custom-message": "mmm Custom Quarantine Message",
                                "profile-type": "JUNIPER_ENHANCED"
                        };
                        return jsonObj;
                    });

                    var ret = view.beforePageChange(1,2);
                    ret.should.be.true;

                    model.get("profile-type").should.be.equal('JUNIPER_ENHANCED');
                    model.get("safe-search").should.be.true;

                    stub.restore();
                });

                it("Test beforePageChange, profile-type is SURF_CONTROL", function() {
                    model.set("name", "test");
                    view.render();

                    var stub = sinon.stub(Syphon, 'serialize', function () {
                        var jsonObj = {
                                "name": "wfProfileName", 
                                "description": "wfProfileDiscription", 
                                "id": 327795, 
                                "safe-search": true,
                                "custom-block-message": "block message surf", 
                                "profile-type": "SURF_CONTROL"
                        };
                        return jsonObj;
                    });

                    var ret = view.beforePageChange(1,2);
                    ret.should.be.true;

                    model.get("profile-type").should.be.equal('SURF_CONTROL');
                    model.get("custom-block-message").should.be.equal('block message surf');

                    stub.restore();
                });

                it("Test beforePageChange, profile-type is WEBSENSE", function() {
                    model.set("name", "test");
                    view.render();

                    var stub = sinon.stub(Syphon, 'serialize', function () {
                        var jsonObj = {
                                "name": "wfProfileName", 
                                "description": "wfProfileDiscription", 
                                "id": 327795, 
                                "safe-search": true,
                                "custom-block-message": "block message", 
                                "profile-type": "WEBSENSE"
                        };
                        return jsonObj;
                    });

                    var ret = view.beforePageChange(1,2);
                    ret.should.be.true;

                    model.get("profile-type").should.be.equal('WEBSENSE');
                    model.get("custom-block-message").should.be.equal('block message');

                    stub.restore();
                });

                it("showAdvancedInput works fine, change engine type to be DEFAULT", function() {
                    view.render();
                    $('#main-content').empty();
                    $('#main-content').append(view.$el);

                    $('#engine-type').val('DEFAULT').trigger('change');
                    view.showAdvancedInput();
                    expect($(".websense-redirect-settings:hidden")).to.have.lengthOf(4);
                });

                it("view render works fine, 'safe-search' is unchecked", function() {
                    model.set("safe-search", false);

                    view.render();
                    $('#main-content').empty();
                    $('#main-content').append(view.$el);

                    $('#safe-search').is(':checked').should.be.equal(false);
                });
            });
});