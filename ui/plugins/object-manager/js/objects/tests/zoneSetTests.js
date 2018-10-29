define([
    '../models/zoneSetModel.js',
    '../models/zoneSetCollection.js',
    '../views/zoneSetView.js'
], function(
    ZoneSetModel,
    ZoneSetCollection,
    ZoneSetView
) {

    describe("ZoneSet profile unit-tests", function() {
        this.timeout(3000);
        var activity, stub;
        var selectedZones = {
            "zone-list" : {
                "zones" : [],
                "total" : 0
            }
        };
        var availableZones = {
            "zone-list" : {
                "zones" : [{
                    "name" : "114_Int"
                }, {
                    "name" : "APPL-MGMT-CID"
                }, {
                    "name" : "APPL-MGMT-NONCID"
                }],
                "total" : 3
            }
        };

        before(function() {
            if (console.log.restore) {
                console.log.restore();
            }
            activity = new Slipstream.SDK.Activity();
            stub = sinon.stub(activity, 'getContext', function() {
                return new Slipstream.SDK.ActivityContext();
            });
        });

        after(function() {
            stub.restore();
            if (console.log.restore) {
                console.log.restore();
            }
        });

        describe("View tests", function() {
            describe("ZoneSetView create", function() {
                var view = null, intent, model = null;
                before(function(){
                    intent = sinon.stub(activity, 'getIntent', function() {
                        return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE);
                    });
                    model = new ZoneSetModel();
                });
                after(function() {
                    intent.restore();
                    $.mockjax.clear();
                });
                beforeEach(function(done) {
                    $.mockjax({
                        url: "/api/juniper/sd/zoneset-management/zone-sets/zones/item-selector/*",
                        type: 'DELETE',
                        status: 200,
                        contentType: 'text/json',
                        dataType: 'json',
                        responseText: true
                    });

                    view = new ZoneSetView({
                        activity: activity,
                        model: model
                    });
                    view.render();
                    $('#main-content').empty();
                    $('#main-content').append(view.$el);

                    $.mockjax({
                        url: "/api/juniper/sd/zoneset-management/zone-sets/zones/item-selector/*",
                        type: 'GET',
                        status: 200,
                        contentType: 'text/json',
                        dataType: 'json',
                        responseText: selectedZones
                    });
                    setTimeout(function() {
                        done();
                    }, 2000)
                });
                afterEach(function() {
                    $('#main-content').empty();
                    $.mockjax.clear();
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
                    validationElements  = ".elementinput>input, .elementinput>textarea, .elementinput>select, .optionselection>input, .elementinput .fileupload-text:first";
                    view.$el.find(validationElements).off('.validator');
                    view.$el.find(validationElements).off('validateForm');
                    var isValidInputStub = sinon.stub(view.form,"isValidInput",function(){
                        return true;
                    });
                    $('#zone-set-name').val('my-zone-set').trigger('change');
                    $('#zone-set-description').val('created from ui').trigger('change');

                    var stub = sinon.stub(view.listBuilder, 'getSelectedItems', function(callback) {
                        callback(availableZones);
                    });
                    activity.overlay = {
                        destroy: function() {}
                    };

                    $.mockjax({
                        url: "/api/juniper/sd/zoneset-management/zone-sets",
                        type: 'POST',
                        status: 200,
                        contentType: 'text/json',
                        dataType: 'json',
                        response: function(settings, done2) {
                            this.responseText = settings.data;
                            var profile = $.parseJSON(settings.data);
                            profile['zone-set'].name.should.be.equal('my-zone-set');
                            profile['zone-set'].description.should.be.equal('created from ui');

                            done2();
                            done();
                        }
                    });
                    view.submit(new $.Event());
                    stub.restore();
                    isValidInputStub.restore();
                });
                
                it("Error info should be shown if name is empty", function() {
                    var logSpy = sinon.spy(console, "log");
                    $('#zone-set-name').val('').trigger('change');
                    $('#zone-set-save').click();
                    assert(logSpy.calledWith('form is invalid'));
                    logSpy.restore();
                });
                it("Error info should be shown if selected zones is empty", function(done) {
                    validationElements  = ".elementinput>input, .elementinput>textarea, .elementinput>select, .optionselection>input, .elementinput .fileupload-text:first";
                    view.$el.find(validationElements).off('.validator');
                    view.$el.find(validationElements).off('validateForm');
                    var isValidInputStub = sinon.stub(view.form,"isValidInput",function(){
                        return true;
                    });
                    var logSpy = sinon.spy(console, "log");
                    $('#zone-set-name').val('my-zone-set').trigger('change');
                    view.submit(new $.Event());
                    setTimeout(function() {
                        assert(logSpy.calledWith('listbuilder has no selections'));
                        logSpy.restore();
                        done();
                    }, 1000);
                    isValidInputStub.restore();
                });
            });
            describe("ZoneSetView edit", function() {
                var view = null, intent, model = null;
                before(function() {
                    intent = sinon.stub(activity, 'getIntent', function() {
                        return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_EDIT);
                    });
                    model = new ZoneSetModel();
                    var jsonObj = {
                        "@uri": "/api/juniper/sd/zoneset-management/zone-sets/426178",
                        "edit-version": 5,
                        "zone-type": "ZONESET",
                        "zones": [{value: "dmz"}],
                        "id": 426178,
                        "last-modified-by-user-name": "super",
                        "description": "test zone1",
                        "domain-id": 2,
                        "name": "testZone1"
                    };
                    model.set(jsonObj);
                });
                after(function() {
                    intent.restore();
                });
                beforeEach(function(done) {
                    $.mockjax.clear();
                    $.mockjax({
                        url: "/api/juniper/sd/zoneset-management/zone-sets/zones/item-selector/*",
                        type: 'DELETE',
                        status: 200,
                        contentType: 'text/json',
                        dataType: 'json',
                        responseText: true
                    });

                    $.mockjax({
                        url: "/api/juniper/sd/zoneset-management/zone-sets/zones/item-selector/*",
                        type: 'GET',
                        status: 200,
                        contentType: 'text/json',
                        dataType: 'json',
                        responseText: selectedZones
                    });
                    view = new ZoneSetView({
                        activity: activity,
                        model: model
                    });
                    sinon.stub(view, 'notify', function() {
                        return console.log('success');
                    });
                    view.render();
                    $('#main-content').empty();
                    $('#main-content').append(view.$el);
                    setTimeout(function() {
                        done();
                    }, 2000)
                });
                afterEach(function() {
                    $('#main-content').empty();
                });
                it("view.formMode should be EDIT", function() {
                    view.formMode.should.be.equal('EDIT');
                });
                it("view should be set with values correctly", function() {
                    $('#zone-set-name').val().should.be.equal("testZone1");
                    $('#zone-set-description').val().should.be.equal("test zone1");
                });
                it("Updates should be saved correctly when ok button clicked(using mockjax)", function(done) {
                    validationElements  = ".elementinput>input, .elementinput>textarea, .elementinput>select, .optionselection>input, .elementinput .fileupload-text:first";
                    view.$el.find(validationElements).off('.validator');
                    view.$el.find(validationElements).off('validateForm');
                    var isValidInputStub = sinon.stub(view.form,"isValidInput",function(){
                        return true;
                    });
                    $('#zone-set-name').val('my-zone-set').trigger('change');
                    $('#zone-set-description').val('updated from ui').trigger('change');
                    var stub = sinon.stub(view.listBuilder, 'getSelectedItems', function(callback) {
                        callback(availableZones);
                    });
                    activity.overlay = {
                        destroy: function() {}
                    };
                    $.mockjax({
                        url: "/api/juniper/sd/zoneset-management/zone-sets/426178",
                        type: 'PUT',
                        status: 200,
                        contentType: 'text/json',
                        dataType: 'json',
                        response: function(settings, done2) {
                            this.responseText = settings.data;
                            var profile = $.parseJSON(settings.data);
                            profile['zone-set'].name.should.be.equal('my-zone-set');
                            profile['zone-set'].description.should.be.equal('updated from ui');
                            done2();
                            done();
                        }
                    });
                    view.submit(new $.Event());
                    isValidInputStub.restore();
                });
            });
            describe("ZoneSetView clone", function() {
                var view = null, intent, destroyStub, model = null, collection = null;
                before(function() {
                    $.mockjax.clear();
                    intent = sinon.stub(activity, 'getIntent', function() {
                        return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CLONE);
                    });
                    model = new ZoneSetModel();
                    collection = new ZoneSetCollection();
                    var jsonObj = {
                            "@uri": "/api/juniper/sd/zoneset-management/zone-sets/426178",
                            "edit-version": 5,
                            "zone-type": "ZONESET",
                            "zones": [{value: "dmz"}],
                            "id": 426178,
                            "last-modified-by-user-name": "super",
                            "description": "test zone1",
                            "domain-id": 2,
                            "name": "testZone1"
                    };
                    model.set(jsonObj);
                });
                after(function() {
                    intent.restore();
                });
                beforeEach(function() {
                    $.mockjax.clear();
                    view = new ZoneSetView({
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
                    $('#zone-set-name').val().should.be.equal("testZone1");
                });
            });
        });
    });
});