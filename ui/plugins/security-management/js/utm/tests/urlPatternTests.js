define([
    '../models/urlPatternModel.js',
    '../models/urlPatternsCollection.js',
    '../views/urlPatternView.js'
], function(
    urlPatternModel,
    urlPatternCollection,
    urlPatternView
) {

    describe("url pattern unit-tests", function() {
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
            describe("urlPatternModel instantiation", function() {
                var model = new urlPatternModel();

                it("model should exist", function() {
                    model.should.exist;
                });
            });

            describe("urlPatternCollection instantiation", function() {
                var collection = new urlPatternCollection();

                it("collection should exist", function() {
                    collection.should.exist;
                });
            });
        });

        describe("View tests", function() {
            describe("urlPatternView create", function() {
                var view = null, intent, model = null;

                before(function(){
                    intent = sinon.stub(activity, 'getIntent', function() {
                        return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE);
                    });

                    model = new urlPatternModel();
                });

                after(function() {
                    intent.restore();
                });

                beforeEach(function() {
                    $.mockjax.clear();
                    view = new urlPatternView({
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

                it("Form InValid check(submit): empty url list grid can not be submitted ", function() {
                    view.render();
                    $('#main-content').empty();
                    $('#main-content').append(view.$el);

                    view.form.showFormError = function(){console.log('Empty url list grid can not be submitted');}
                    sinon.spy(view.form, "showFormError");

                    $('#utm-urlpattern-name').val('Tuesday').trigger('change');

                    $('#utm-urlpattern-save').click();
                    view.form.showFormError.calledOnce.should.be.equal(true);
                });

                it("Empty url can not be added to url Grid", function() {
                    view.render();
                    $('#main-content').empty();
                    $('#main-content').append(view.$el);

                    $('#utm-urlpattern-name').val('Tuesday').trigger('change');

                    $('#utm-urlpattern-addurl').val('').trigger('change');
                    $('#utm-urlpattern-addurl-to-grid').click();

                    expect($("small.error.errorimage.errorbreakword")).to.have.lengthOf(1);
                });
  
                it("Duplicated url can not be added to url Grid", function() {
                    view.render();
                    $('#main-content').empty();
                    $('#main-content').append(view.$el);

                    $('#utm-urlpattern-name').val('Tuesday').trigger('change');

                    $('#utm-urlpattern-addurl').val('111').trigger('change');
                    $('#utm-urlpattern-addurl-to-grid').click();
                    
                    $('#utm-urlpattern-addurl').val('111').trigger('change');
                    $('#utm-urlpattern-addurl-to-grid').click();

                    expect($("small.error.errorimage.errorbreakword")).to.have.lengthOf(1);
                });

                it("URL list grid inline edit, edit grid cell data should not be empty", function() {
                    view.render();
                    $('#main-content').empty();
                    $('#main-content').append(view.$el);

                    $('#utm-urlpattern-name').val('Tuesday').trigger('change');

                    $('#utm-urlpattern-addurl').val('111');
                    $('#utm-urlpattern-addurl-to-grid').click();

                    $("#utm-urlpattern-url-list tr.ui-widget-content td:last").click();
                    $("#utm-urlpattern-url-list input[type='text']").val("").trigger('customValidation',[true]);

                    expect($("small.error.errorimage.errorbreakword")).to.have.lengthOf(1);
                });

                it("URL list grid inline edit, edit grid cell data should not be duplicate", function() {
                    view.render();
                    $('#main-content').empty();
                    $('#main-content').append(view.$el);

                    $('#utm-urlpattern-name').val('Tuesday').trigger('change');

                    $('#utm-urlpattern-addurl').val('111');
                    $('#utm-urlpattern-addurl-to-grid').click();

                    $('#utm-urlpattern-addurl').val('222');
                    $('#utm-urlpattern-addurl-to-grid').click();

                    $("#utm-urlpattern-url-list tr.ui-widget-content td:last").click();
                    $("#utm-urlpattern-url-list input[type='text']").val("222").trigger('customValidation',[true]);
                    expect($("small.error.errorimage.errorbreakword")).to.have.lengthOf(1);
 
                    $("#utm-urlpattern-url-list tr.ui-widget-content td:last").click();
                    $("#utm-urlpattern-url-list input[type='text']").val("333").trigger('customValidation',[true]);
                    expect($("small.error.errorimage.errorbreakword")).to.have.lengthOf(0);
                });

                it("URL list grid support filter function", function() {
                    view.render();
                    $('#main-content').empty();
                    $('#main-content').append(view.$el);

                    $('#utm-urlpattern-addurl').val('test1').trigger('change');
                    $('#utm-urlpattern-addurl-to-grid').click();

                    $('#utm-urlpattern-addurl').val('test2').trigger('change');
                    $('#utm-urlpattern-addurl-to-grid').click();

                    $('#utm-urlpattern-addurl').val('abc').trigger('change');
                    $('#utm-urlpattern-addurl-to-grid').click();

                    $("#utm-urlpattern-url-list .filter").val("abc").trigger('change');
                    $("#utm-urlpattern-url-list .search-icon").click();
                    expect($("#utm-urlpattern-url-list tr.ui-widget-content")).to.have.lengthOf(1);
                });

                it("Data should be saved correctly when ok button clicked(using mockjax)", function(done) {
                    view.render();
                    $('#main-content').empty();
                    $('#main-content').append(view.$el);

                    $('#utm-urlpattern-name').val('my-url-pattern').trigger('change');
                    $('#utm-urlpattern-description').val('created from ui').trigger('change');

                    $('#utm-urlpattern-addurl').val('test1').trigger('change');
                    $('#utm-urlpattern-addurl-to-grid').click();
 
                    $.mockjax({
                        url: "/api/juniper/sd/utm-management/url-patterns",
                        type: 'POST',
                        status: 200,
                        contentType: 'text/json',
                        dataType: 'json',
                        response: function(settings, done2) {
                            this.responseText = settings.data;
                            var profile = $.parseJSON(settings.data);

                            profile['url-pattern'].name.should.be.equal('my-url-pattern');
                            profile['url-pattern'].description.should.be.equal('created from ui');
                            profile['url-pattern']['address-patterns']['address-pattern'][0].should.be.equal('test1');
                            done2();
                            done();
                        }
                    });

                    $('#utm-urlpattern-save').click();
                });

                it("Error info should be shown if form is invalid when ok button clicked", function() {
                    view.render();
                    $('#main-content').empty();
                    $('#main-content').append(view.$el);
                    var logSpy = sinon.spy(console, "log"),
                        removeEditModeOnRow= sinon.stub(view.gridWidget, 'removeEditModeOnRow'),
                        isUrlListValid= sinon.stub(view, 'isUrlListValid', function(){return false;});
                    view.submit({preventDefault: function(){}});
                    assert(logSpy.calledWith('form is invalid'));
                    removeEditModeOnRow.called.should.be.equal(true);
                    isUrlListValid.called.should.be.equal(true);
                    removeEditModeOnRow.restore();
                    isUrlListValid.restore();
                    logSpy.restore();
                });

                it("Error info should be shown when name length greater than 29", function() {
                    view.render();
                    $('#main-content').empty();
                    $('#main-content').append(view.$el);

                    $('#utm-urlpattern-name').val('012345678901234567890123456789').trigger('change');

                    $('#utm-urlpattern-save').click();
                    expect($("small.error.errorimage")).to.have.lengthOf(1);
                });

                it("URL list grid support delete function", function() {
                    view.render();
                    $('#main-content').empty();
                    $('#main-content').append(view.$el);

                    $('#utm-urlpattern-addurl').val('test1').trigger('change');
                    $('#utm-urlpattern-addurl-to-grid').click();

                    var deleteRowArr = [{
                      "id": "",
                      "url": "test1"
                    }];

                    var row = {
                      "deletedRows":deleteRowArr
                    };

                    var event = {
                    };

                    var logSpy = sinon.spy(view.urlListCollection, "remove");

                    view.deleteAction(event, row);

                    view.urlListCollection.remove.calledOnce.should.be.equal(true);
                });

                it("URL list grid support update function", function() {
                    view.render();
                    $('#main-content').empty();
                    $('#main-content').append(view.$el);

                    $('#utm-urlpattern-addurl').val('test1').trigger('change');
                    $('#utm-urlpattern-addurl-to-grid').click();

                    var row = {
                            "originalData":{"url": "test1"},
                            "updatedRow":{"url": "test2"}
                    };

                    var event = {
                    };

                    view.updateAction(event, row);
                    row.originalData.url.should.be.equal('test2');
                });
            });

            describe("urlPatternView edit", function() {
                var view = null, intent, model = null;

                before(function() {
                    intent = sinon.stub(activity, 'getIntent', function() {
                        return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_EDIT);
                    });

                    model = new urlPatternModel();
                    var jsonObj = {
                        "@uri": "/api/juniper/sd/utm-management/url-patterns/33077",
                        "name": "test1",
                        "description": "",
                        "id": 33077,
                        "edit-version": 1,
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
                    view = new urlPatternView({
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

                    $('#utm-urlpattern-name').val().should.be.equal("test1");
                });

                it("Updates should be saved correctly when ok button clicked(using mockjax)", function(done) {
                    view.render();
                    $('#main-content').empty();
                    $('#main-content').append(view.$el);

                    $('#utm-urlpattern-name').val('my-url-pattern').trigger('change');
                    $('#utm-urlpattern-description').val('created from ui').trigger('change');

                    $('#utm-urlpattern-addurl').val('test-url').trigger('change');
                    $('#utm-urlpattern-addurl-to-grid').click();

                    $.mockjax({
                        url: "/api/juniper/sd/utm-management/url-patterns/33077",
                        type: 'PUT',
                        status: 200,
                        contentType: 'text/json',
                        dataType: 'json',
                        response: function(settings, done2) {
                    	console.log("444");
                            this.responseText = settings.data;
                            var profile = $.parseJSON(settings.data);
                            profile['url-pattern'].name.should.be.equal('my-url-pattern');
                            profile['url-pattern'].description.should.be.equal('created from ui');
                            console.log(done2);
                            done2();
                            done();
                        }
                    });
                    $('#utm-urlpattern-save').click();
                });
            });

            describe("urlPatternView clone", function() {
                var view = null, intent, destroyStub, model = null, collection = null;

                before(function() {
                    $.mockjax.clear();
                    intent = sinon.stub(activity, 'getIntent', function() {
                        return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CLONE);
                    });
                    model = new urlPatternModel();
                    collection = new urlPatternCollection();
                    var jsonObj = {
                            "@uri": "/api/juniper/sd/utm-management/url-patterns/33077",
                            "name": "test1",
                            "description": "",
                            "id": 33077,
                            "edit-version": 1,
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
                    view = new urlPatternView({
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

                    $('#utm-urlpattern-name').val().should.be.equal("test1");
                });

            });
        });
    });
});