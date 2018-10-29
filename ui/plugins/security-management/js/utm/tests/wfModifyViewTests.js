define([
    '../models/webFilteringModel.js',
    '../views/webFilteringModifyView.js'
], function(
    wfModel,
    urlPatternView
) {

    describe("webFilteringModifyView unit-tests", function() {
        var activity, stub;
        before(function() {

           activity = new Slipstream.SDK.Activity();

           stub = sinon.stub(activity, 'getContext', function() {
                return new Slipstream.SDK.ActivityContext();
           });
           
           activity.overlay = {
                    destroy: function() {}
           };

        });

        after(function() {
           stub.restore();
        });

        describe("webFilteringModifyView edit", function() {
            var view = null, intent, model = null;

            before(function(){
                intent = sinon.stub(activity, 'getIntent', function() {
                    return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_EDIT);
                });

                model = new wfModel();

                view = new urlPatternView({
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

            it("view rendered，'profile-type' is 'JUNIPER_ENHANCED', 'site-reputation-actions' is set", function() {
                var wfObj = {
                        "name": "sss",
                        "safe-search": true,
                        "url-category-action-list": {
                            "url-category-action": [
                                {
                                    "action": "QUARANTINE", 
                                    "reputation-action": { }, 
                                    "url-category-list": {
                                        "name": "Enhanced_Abused_Drugs"
                                    }
                                }
                            ]
                        },
                        "site-reputation-actions": {
                            "moderately-safe": "PERMIT",
                            "harmful": "QUARANTINE",
                            "suspicious": "QUARANTINE", 
                            "very-safe": "PERMIT",
                            "fairly-safe": "LOG_AND_PERMIT"
                        },
                        "default-action": "LOG_AND_PERMIT",
                        "fallback-default-action": "BLOCK",
                        "profile-type": "JUNIPER_ENHANCED",
                        "timeout": 200,
                        "account": "count",
                        "server" : "muffin",
                        "port" : 200,
                        "sockets" : 256,
                        "custom-quarantine-message" : "test message"
                    };
                model.set(wfObj);
                view.render();
                view.form.conf.values['profile-type'].should.be.equal("JUNIPER_ENHANCED");
                view.form.conf.values['site-reputation-actions'].should.exist;
            });

            it("view rendered, 'profile-type' is 'JUNIPER_ENHANCED', 'site-reputation-actions' is unset", function() {
                var wfObj = {
                      "name": "sss",
                      "safe-search": false, 
                      "url-category-action-list": {
                          "url-category-action": [
                              {
                                  "action": "QUARANTINE",
                                  "reputation-action": { },
                                  "url-category-list": {
                                      "name": "Enhanced_Abused_Drugs"
                                  }
                              }
                          ]
                      }, 
                      "site-reputation-actions": {},
                      "default-action": "LOG_AND_PERMIT", 
                      "fallback-default-action": "BLOCK", 
                      "profile-type": "JUNIPER_ENHANCED", 
                      "timeout": 200,
                      "account": "count",
                      "server" : "muffin",
                      "port" : 200,
                      "sockets" : 256,
                      "custom-quarantine-message" : "test message"
                };
                model.set(wfObj);
                view.render();
                view.form.conf.values['profile-type'].should.be.equal("JUNIPER_ENHANCED");
            });

            it("view rendered, 'profile-type' is 'LOCAL'", function() {
                model.set("profile-type","LOCAL");
                view.render();
                view.form.conf.values['profile-type'].should.be.equal("LOCAL");
            });

            it("view rendered, 'profile-type' is 'SURF_CONTROL'", function() {
                model.set("profile-type","SURF_CONTROL");
                view.render();
                view.form.conf.values['profile-type'].should.be.equal("SURF_CONTROL");
            });

            it("view rendered, 'profile-type' is 'WEBSENSE'", function() {
                model.set("profile-type","WEBSENSE" );
                view.render();
                view.form.conf.values['profile-type'].should.be.equal("WEBSENSE");
            });

            it("view.submitted, form is invalid", function() {
                var logSpy = sinon.spy(console, "log"),
                    isTextareaValid = sinon.stub(view, 'isTextareaValid', function(){return false;});
                var event = {
                     type: 'click',
                     preventDefault: function () {}
                };

                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);

                $('#utm-webfiltering-name').val('');

                view.submit(event);
                assert(logSpy.calledWith('form is invalid'));
                isTextareaValid.called.should.be.equal(true);
                isTextareaValid.restore();
                logSpy.restore();
            });

            it("view.submitted, 'profile-type' is 'SURF_CONTROL'", function() {
                save = sinon.stub(view.model, 'save');
                var event = {
                     type: 'click',
                     preventDefault: function () {}
                };

                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);

                $('#utm-webfiltering-name').val('test');
                $('#engine-type').val('SURF_CONTROL');

                view.submit(event);
                save.called.should.be.equal(true);
                save.restore();
                model.get('profile-type').should.be.equal("SURF_CONTROL");
            });

            it("view.submitted, 'profile-type' is 'WEBSENSE'", function() {
                save = sinon.stub(view.model, 'save');
                var event = {
                     type: 'click',
                     preventDefault: function () {}
                };

                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);

                $('#utm-webfiltering-name').val('test');
                $('#engine-type').val('WEBSENSE');

                view.submit(event);
                save.called.should.be.equal(true);
                save.restore();
                model.get('profile-type').should.be.equal("WEBSENSE");
            });
                
            it("view.submitted, 'profile-type' is 'LOCAL'", function() {
                save = sinon.stub(view.model, 'save');
                var event = {
                     type: 'click',
                     preventDefault: function () {}
                };

                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);

                $('#utm-webfiltering-name').val('test');
                $('#engine-type').val('LOCAL');

                view.submit(event);
                save.called.should.be.equal(true);
                save.restore();
                model.get('profile-type').should.be.equal("LOCAL");
            });

            it("view.submitted, 'profile-type' is 'JUNIPER_ENHANCED'", function() {
                save = sinon.stub(view.model, 'save');
                var event = {
                     type: 'click',
                     preventDefault: function () {}
                };

                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);

                $('#utm-webfiltering-name').val('test');
                $('#engine-type').val('JUNIPER_ENHANCED');
                $('#enable-global-reputation').prop('checked', true).trigger('change');
                $('#moderately-safe').val('LOG_AND_PERMIT');
                $('#very-safe').val('LOG_AND_PERMIT');
                $('#suspicious').val('LOG_AND_PERMIT');
                $('#harmful').val('LOG_AND_PERMIT');
                $('#timeout').val('');
                view.submit(event);
                save.called.should.be.equal(true);
                save.restore();
                model.get('profile-type').should.be.equal("JUNIPER_ENHANCED");
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

            it("view.createAction works fine", function() {
                var action = "deny", data = [{"label":"Enhanced_Advertisements", "value":"65604"}];
                var startActivityForResult = sinon.stub(view.context, "startActivityForResult", function() { view.setSelectedList(action,data );});
                var event = {
                     type: 'click',
                     data: { 'action': 'deny'
                    }
                };
                view.createAction(event);
                startActivityForResult.called.should.be.equal(true);
                startActivityForResult.restore();
            });

            it("Callback of view.createAction works fine", function() {
                var action = "deny", data = [{"label":"Enhanced_Advertisements", "value":"65604"}];
                var isEditMode = sinon.stub(view, "isEditMode", function() { return true;});
                var startActivityForResult = sinon.stub(view.context, "startActivityForResult", function() { view.setSelectedList(action,data );});
                var event = {
                     type: 'click',
                     data: { 'action': 'deny'
                    }
                };
                view.createAction(event);
                startActivityForResult.called.should.be.equal(true);
                isEditMode.restore();
                startActivityForResult.restore();
            });
        });

        describe("webFilteringModifyView clone", function() {
            var view = null, intent, model = null;

            before(function(){
                intent = sinon.stub(activity, 'getIntent', function() {
                    return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CLONE);
                });

                model = new wfModel();

                view = new urlPatternView({
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