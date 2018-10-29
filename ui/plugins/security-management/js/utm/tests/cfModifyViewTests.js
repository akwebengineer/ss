define([
    '../models/contentFilteringModel.js',
    '../views/contentFilteringModifyView.js'
], function(
    cfModel,
    cfModifyView
) {
    describe("contentFilteringModifyView unit-tests", function() {
        var activity, getContextStub;
        before(function() {

           activity = new Slipstream.SDK.Activity();

           getContextStub = sinon.stub(activity, 'getContext', function() {
                return new Slipstream.SDK.ActivityContext();
           });

           activity.overlay = {
               destroy: function() {}
           };
        });

        after(function() {
            getContextStub.restore();
        });

        describe("contentFilteringModifyView edit", function() {
            var view = null, intent, model = null;

            before(function(){
                intent = sinon.stub(activity, 'getIntent', function() {
                    return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_EDIT);
                });

                model = new cfModel();

                view = new cfModifyView({
                    activity: activity,
                    model: model
                });
            });

            after(function() {
                intent.restore();
            });

            it("view should exist", function() {
                view.should.exist;
            });

            it("view.formMode should be EDIT", function() {
                view.render();
                view.formMode.should.be.equal('EDIT');
            });

            it("view rendered，'permit-command-list' is empty", function() {
                var cfObj = {
                        "name": "test",
                        "description": "This is a test",
                        "definition-type": "CUSTOM",
                        "permit-command-list": {},
                        "block-content-type-list": {"block-content-type": []},
                        "block-file-extension-list": {},
                        "notification-options": {
                            "custom-notification-message": "MMM PPP",
                            "notification-type": "MESSAGE",
                            "notify-mail-sender": true
                        },
                        "block-command-list": {},
                        "block-mime-list": {},
                        "block-mime-exception-list": {}
                    };
                model.set(cfObj);
                view.render();

               $('#main-content').empty();
               $('#main-content').append(view.$el);
               $('#permit-command-list').val().should.be.equal("");
            });

            it("view rendered，'permit-command-list' is not empty", function() {
                var cfObj = {
                        "name": "testaacc",
                        "description": "This is a test",
                        "definition-type": "CUSTOM",
                        "permit-command-list": {
                            "permit-command": [
                                "get",
                                "head"
                            ]
                        },
                        "block-content-type-list": {
                            "block-content-type": [
                                "ACTIVEX",
                                "EXE",
                                "JAVA_APPLET",
                                "HTTP_COOKIE",
                                "ZIP"
                            ]
                        },
                        "block-file-extension-list": {
                            "block-file-extension": [
                                "pdf",
                                "word"
                            ]
                        },
                        "notification-options": {
                            "custom-notification-message": "MMM PPP",
                            "notification-type": "MESSAGE",
                            "notify-mail-sender": true
                        },
                        "block-command-list": {
                            "block-command": [
                                "bbb",
                                "ccc"
                            ]
                        },
                        "block-mime-list": {
                            "block-mime": [
                                "video/kk"
                            ]
                        },
                        "block-mime-exception-list": {
                            "block-mime-exception": [
                                "image/mm"
                            ]
                        }
                    };
                model.set(cfObj);
                view.render();

                $('#main-content').empty();
                $('#main-content').append(view.$el);
                $('#permit-command-list').val().should.be.equal("get, head");
            });

            it("view.submitted, form is invalid", function() {
                var logSpy = sinon.spy(console, "log");
                var event = {
                     type: 'click',
                     preventDefault: function () {}
                };

                var validationStub = sinon.stub(view.form, 'isValidInput', function() {
                    return false;
                });

                view.submit(event);
                assert(logSpy.calledWith('form is invalid'));

                logSpy.restore();
                validationStub.restore();
            });

            it("view.submitted successfully, block permit list validation check passed", function() {
                var save = sinon.stub(view.model, 'save');
                var validationStub = sinon.stub(view, 'mandatoryFieldsValidation', function() {
                    return true;
                });
                var event = {
                     type: 'click',
                     preventDefault: function () {}
                };

                view.submit(event);
                save.called.should.be.equal(true);

                save.restore();
                validationStub.restore();
            });

            it("view.submitted failed, block permit list validation check failed", function() {
                var save = sinon.stub(view.model, 'save');
                var validationStub = sinon.stub(view, 'mandatoryFieldsValidation', function() {
                    return false;
                });
                var event = {
                     type: 'click',
                     preventDefault: function () {}
                };

                view.submit(event);
                save.called.should.be.equal(false);

                save.restore();
                validationStub.restore();
            });
        });

        describe("contentFilteringModifyView clone", function() {
            var view = null, intent, model = null;

            before(function(){
                intent = sinon.stub(activity, 'getIntent', function() {
                    return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CLONE);
                });

                model = new cfModel();

                view = new cfModifyView({
                    activity: activity,
                    model: model
                });
            });

            after(function() {
                intent.restore();
            });

            it("view.formMode should be CLONE", function() {
                view.render();
                view.formMode.should.be.equal('CLONE');
            });
        });
    });
});