define([
    '../../../../security-management/js/utm/models/antispamModel.js',
    '../../../../security-management/js/utm/models/antispamCollection.js',
    '../../../../security-management/js/utm/views/antispamView.js'
], function(
    AntispamModel,
    AntispamCollection,
    AntispamView
) {
    describe("Antispam profile unit-tests", function() {

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
        describe("Model tests", function() {
            describe("AntispamModel instantiation", function() {
                var model = new AntispamModel();

                it("model should exist", function() {
                    model.should.exist;
                });
            });

            describe("AntispamCollection instantiation", function() {
                var collection = new AntispamCollection();

                it("collection should exist", function() {
                    collection.should.exist;
                });
            });
        });

        describe("View tests", function() {
            describe("AntispamView create", function() {
                var view = null, intent, model = null;

                before(function(){
                    intent = sinon.stub(activity, 'getIntent', function() {
                        return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE);
                    });

                    model = new AntispamModel();
                });

                after(function() {
                    intent.restore();
                });

                beforeEach(function() {
                    $.mockjax.clear();
                    view = new AntispamView({
                        activity: activity,
                        model: model
                    });
                });

                afterEach(function() {
                });

                it("view should exist", function() {
                    view.should.exist;
                });

                it("view.formMode should be CREATE", function() {
                    view.formMode.should.be.equal('CREATE');
                });

                it("view.formWidget should exist", function() {
                    view.render();
                    view.form.should.exist;
                });

                it("Data should be saved correctly when ok button clicked(using mockjax)", function(done) {
                    view.render();
                    $('#main-content').empty();
                    $('#main-content').append(view.$el);

                    $('#utm-antispam-name').val('my-antispam').trigger('change');
                    $('#utm-antispam-description').val('created from ui').trigger('change');
                    $('#default-sbl-server').prop('checked', true).trigger('change');
                    $('#default-action').val('TAG_SUBJECT').trigger('change');
                    $('#tag-string').val('***SPAM***').trigger('change');

                    $.mockjax({
                        url: "/api/juniper/sd/utm-management/anti-spam-profiles",
                        type: 'POST',
                        status: 200,
                        contentType: 'text/json',
                        dataType: 'json',
                        response: function(settings, done2) {
                            this.responseText = settings.data;
                            var profile = $.parseJSON(settings.data);
                            profile['anti-spam-profile'].name.should.be.equal('my-antispam');
                            profile['anti-spam-profile'].description.should.be.equal('created from ui');
                            profile['anti-spam-profile']['default-action'].should.be.equal('TAG_SUBJECT');
                            profile['anti-spam-profile']['tag-string'].should.be.equal('***SPAM***');
                            profile['anti-spam-profile']['default-sbl-server'].should.be.true;
                            done2();
                            done();
                        }
                    });

                    $('#utm-antispam-save').click();
                });

                it("Error info should be shown if form is invalid when ok button clicked", function() {
                    view.render();
                    $('#main-content').append(view.$el);
                    var logSpy = sinon.spy(console, "log"),
                        isTextareaValid = sinon.stub(view, 'isTextareaValid', function(){return false;});

                    view.submit({preventDefault:function(){}});
                    logSpy.calledWith('form is invalid').should.be.equal(true);
                    isTextareaValid.called.should.be.equal(true);
                    logSpy.restore();
                    isTextareaValid.restore();
                });

            });

            describe("AntispamView edit", function() {
                var view = null, intent, model = null;

                before(function() {
                    intent = sinon.stub(activity, 'getIntent', function() {
                        return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_EDIT);
                    });

                    model = new AntispamModel();
                    var jsonObj = {
                        "@uri": "/api/juniper/sd/utm-management/anti-spam-profiles/33077",
                        "name": "test1",
                        "description": "",
                        "id": 33077,
                        "edit-version": 1,
                        "definition-type": "CUSTOM",
                        "default-action": "TAG_SUBJECT",
                        "tag-string": "***SPAM***",
                        "default-sbl-server": true,
                        "domain-name": "Global",
                        "domain-id": 2
                    };
                    model.set(jsonObj);
                });

                after(function() {
                    intent.restore();
                });

                beforeEach(function() {
                    $.mockjax.clear();
                    view = new AntispamView({
                        activity: activity,
                        model: model
                    });
                });

                afterEach(function() {
                });

                it("view.formMode should be EDIT", function() {
                    view.formMode.should.be.equal('EDIT');
                });

                it("view should be set with values correctly", function() {
                    view.render();
                    $('#main-content').empty();
                    $('#main-content').append(view.$el);

                    $('#utm-antispam-name').val().should.be.equal("test1");
                    $('#default-sbl-server').prop('checked').should.be.equal(true);
                    $('#default-action').val().should.be.equal("TAG_SUBJECT");
                    $('#tag-string').val().should.be.equal("***SPAM***");
                });

                it("Updates should be saved correctly when ok button clicked(using mockjax)", function(done) {
                    view.render();
                    $('#main-content').append(view.$el);

                    $('#utm-antispam-name').val('my-antispam').trigger('change');
                    $('#utm-antispam-description').val('created from ui').trigger('change');

                    $.mockjax({
                        url: "/api/juniper/sd/utm-management/anti-spam-profiles/33077",
                        type: 'PUT',
                        status: 200,
                        contentType: 'text/json',
                        dataType: 'json',
                        response: function(settings, done2) {
                            this.responseText = settings.data;
                            var profile = $.parseJSON(settings.data);
                            profile['anti-spam-profile'].name.should.be.equal('my-antispam');
                            profile['anti-spam-profile'].description.should.be.equal('created from ui');
                            done2();
                            done();
                        }
                    });

                    $('#utm-antispam-save').click();
                });

            });

            describe("AntispamView clone", function() {
                var view = null, intent, destroyStub, model = null, collection = null;

                before(function() {
                    $.mockjax.clear();
                    intent = sinon.stub(activity, 'getIntent', function() {
                        return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CLONE);
                    });
                    model = new AntispamModel();
                    collection = new AntispamCollection();
                    var jsonObj = {
                        "@uri": "/api/juniper/sd/utm-management/anti-spam-profiles/33077",
                        "name": "test1",
                        "description": "",
                        "id": 33077,
                        "edit-version": 1,
                        "definition-type": "CUSTOM",
                        "default-action": "TAG_SUBJECT",
                        "tag-string": "***SPAM***",
                        "default-sbl-server": true,
                        "domain-name": "Global",
                        "domain-id": 2
                    };
                    model.set(jsonObj);
                });

                after(function() {
                    intent.restore();
                });

                beforeEach(function() {
                    $.mockjax.clear();
                    view = new AntispamView({
                        activity: activity,
                        model: model,
                        collection: collection
                    });
                });

                afterEach(function() {
                });

                it("view.formMode should be CLONE", function() {
                    view.formMode.should.be.equal('CLONE');
                });

                it("view should be set with values correctly", function() {
                    view.render();
                    $('#main-content').empty();
                    $('#main-content').append(view.$el);

                    $('#utm-antispam-name').val().should.be.equal("test1");
                });

            });
        });
    });
});