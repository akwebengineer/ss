/**
 *
 */
define([
        '../models/serviceModel.js',
        '../models/serviceCollection.js',
        '../views/serviceView.js'
],function( ServiceModel, ServiceCollection, ServiceView ){
    describe("ServiceView Unit Test",function(){
        var context, activity;
        before(function(){
            activity = new Slipstream.SDK.Activity();
            context = sinon.stub(activity, 'getContext', function(){
                return new Slipstream.SDK.ActivityContext();
            });
            activity.overlay = {
                destroy: function() {}
            };
        });

        after(function(){
            context.restore();
        });

        describe("View tests", function(){
            describe("ServiceView Create", function(){
                var view = null;
                var intent, model = null;

                before(function(){
                    intent = sinon.stub(activity, 'getIntent', function(){
                        return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE);
                    });
                    model = new ServiceModel();
                });

                after(function(){
                    intent.restore();
                    if (typeof console.log.restore == "function"){
                        console.log.restore();
                    }
                });

                beforeEach(function(){
                    $.mockjax.clear();
                    view = new ServiceView({
                        activity: activity,
                        model: model
                    });
                })

                it("View should exist", function(){
                    view.should.exist;
                });

                it("View.formMode should be CREATE", function(){
                    view.formMode.should.be.equal('CREATE');
                });

                it("View.formWidget should exist", function(){
                    view.render();
                    view.form.should.exist;
                });

                it("Error info should be shown if name is empty", function(){
                    view.render();
                    var logSpy = sinon.spy(console,"log");
                    view.$el.find('#service-group-choice').prop('checked',true).trigger('change');
                    view.$el.find('#application-name').val('').trigger('change');
                    view.submit(new $.Event());
                    assert(logSpy.calledWith('form is invalid'));
                    logSpy.restore();
                });

                it("Error info should be shown if selected list is empty and service is selected", function(){
                    view.render();
                    $('#main-content').empty();
                    $('#main-content').append(view.$el);
                    validationElements  = ".elementinput>input, .elementinput>textarea, .elementinput>select, .optionselection>input, .elementinput .fileupload-text:first";
                    view.$el.find(validationElements).off('.validator');
                    view.$el.find(validationElements).off('validateForm');
                    var logSpy = sinon.spy(console, "log");
                    var isValidInputStub = sinon.stub(view.form,"isValidInput",function(){
                        return true;
                    });
                    view.$el.find('#service-choice').prop('checked',true).trigger('change');
                    view.$el.find('#application-name').val('test1').trigger('change');
                    view.$el.find('#application-description').val('test for service').trigger('change');
                    view.submit(new $.Event());
                    assert(logSpy.calledWith('gridwidget has no items'));
                    logSpy.restore();
                    isValidInputStub.restore();
                });

                it("Error info should be shown if selected list is empty and service group is selected", function(){
                    view.render();
                    $('#main-content').empty();
                    $('#main-content').append(view.$el);
                    validationElements  = ".elementinput>input, .elementinput>textarea, .elementinput>select, .optionselection>input, .elementinput .fileupload-text:first";
                    view.$el.find(validationElements).off('.validator');
                    view.$el.find(validationElements).off('validateForm');
                    var isValidInputStub = sinon.stub(view.form,"isValidInput",function(){
                        return true;
                    });
                    view.$el.find('#service-group-choice').filter('[value=Service Group]').prop('checked', true);
                    view.$el.find('#service-choice').filter('[value=Service]').prop('checked',false);
                    view.showServiceOrGroup();
                    var logSpy = sinon.spy(console, "log");
                    var getSelectedItems = sinon.stub(view.listBuilder, "getSelectedItems",function(callback){
                        var obj = {
                            "services":{
                                "service":[],
                                "total":0
                            }
                        };
                        callback(obj);
                    });

                    view.$el.find('#application-name').val('test1').trigger('change');
                    view.$el.find('#application-description').val('test for service').trigger('change');
                    view.submit(new $.Event());
                    assert(logSpy.calledWith('listbuilder has no selections'));
                    logSpy.restore();
                    getSelectedItems.restore();
                    isValidInputStub.restore();
                });

                it("Data should be saved correctly when ok button is clicked and service is selected", function(done){
                    jsonObj = {"protocols":{
                        "protocol":[
                            {"name" : "protocol1", "description" : "protocol", "dst-port" : "100", "protocol-type" : "PROTOCOL_TCP"},
                            {"name" : "protocol2", "description" : "protocol", "dst-port" : "100", "protocol-type" : "PROTOCOL_TCP"}
                        ],
                    }};
                    view.model.set(jsonObj);
                    view.render();
                    $('#main-content').empty();
                    $('#main-content').append(view.$el);
                    validationElements  = ".elementinput>input, .elementinput>textarea, .elementinput>select, .optionselection>input, .elementinput .fileupload-text:first";
                    view.$el.find(validationElements).off('.validator');
                    view.$el.find(validationElements).off('validateForm');
                    var isValidInputStub = sinon.stub(view.form,"isValidInput",function(){
                        return true;
                    });
                    view.$el.find('#service-choice').prop('checked',true).trigger('change');
                    view.$el.find('#application-name').val('test1').trigger('change');
                    view.$el.find('#application-description').val('test for service').trigger('change');

                    $.mockjax({
                        url:"/api/juniper/sd/service-management/services",
                        type:'POST',
                        status: 200,
                        contentType:'text/json',
                        dataType: 'json',
                        response: function(settings){
                            this.responseText = settings.data;
                            var profile = $.parseJSON(settings.data);
                            profile['service'].name.should.be.equal('test1');
                            profile['service'].description.should.be.equal('test for service');
                            profile['service']['is-group'].should.be.false;
                            profile['service']['protocols'].should.have.property('protocol').with.length(2);
                            done();
                        }
                    });
                    view.submit(new $.Event());
                    isValidInputStub.restore();
                });

                it("Data should be saved correctly when ok button is clicked and service group is selected", function(done){
                    view.render();
                    $('#main-content').empty();
                    $('#main-content').append(view.$el);
                    validationElements  = ".elementinput>input, .elementinput>textarea, .elementinput>select, .optionselection>input, .elementinput .fileupload-text:first";
                    view.$el.find(validationElements).off('.validator');
                    view.$el.find(validationElements).off('validateForm');
                    var isValidInputStub = sinon.stub(view.form,"isValidInput",function(){
                        return true;
                    });
                    view.$el.find('#service-group-choice').prop('checked',true).trigger('change');
                    view.$el.find('#service-choice').prop('checked',false).trigger('change');
                    view.showServiceOrGroup();
                    view.$el.find('#application-name').val('test1').trigger('change');
                    view.$el.find('#application-description').val('test for service group').trigger('change');
                    var getSelectedItems = sinon.stub(view.listBuilder, 'getSelectedItems', function(callback) {
                        var availableLists = {"services": {
                            "service" :[
                                {"id": 163880, "name" : "service1", "domain-name" : "SYSTEM"},
                                {"id": 163905, "name" : "service2", "domain-name" : "SYSTEM"}
                            ],
                            "total":2
                        }}
                        callback(availableLists);
                    });

                    $.mockjax({
                        url: "/api/juniper/sd/service-management/services",
                        type: 'POST',
                        status: 200,
                        contentType: 'text/json',
                        dataType: 'json',
                        response: function(settings) {
                            this.responseText = settings.data;
                            var profile = $.parseJSON(settings.data);
                            profile['service'].name.should.be.equal('test1');
                            profile['service'].description.should.be.equal('test for service group');
                            profile['service']['is-group'].should.be.true;
                            profile['service']['members'].should.have.property('member').with.length(2);
                            done();
                        }
                    });
                    view.submit(new $.Event());
                    getSelectedItems.restore();
                    isValidInputStub.restore();
                });
            });

            describe("ServiceView Edit", function(){
                var view = null;
                var intent, model = null;

                before(function(){
                    intent = sinon.stub(activity, 'getIntent', function(){
                        return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_EDIT);
                    });
                });

                after(function(){
                    intent.restore();
                });

                beforeEach(function(){
                    $.mockjax.clear();
                    model = new ServiceModel();
                    view = new ServiceView({
                        activity: activity,
                        model: model
                    });
                });

                it("View.formMode should be EDIT", function(){
                    view.formMode.should.be.equal('EDIT');
                });

                it("View should be set with values correctly when service is selected", function(){
                    var jsonObj = {
                        "@uri" : "/api/juniper/sd/service-management/services/196910",
                        "name" : "test1",
                        "description": "This is a test",
                        "id": 196910,
                        "edit-version": 1,
                        "domain-name" : "Global",
                        "domain-id": 2,
                        "protocols": {
                            "protocol":[
                                {"name" : "protocol1", "description" : "protocol", "dst-port" : "100", "protocol-type" : "PROTOCOL_TCP"},
                                {"name" : "protocol2", "description" : "protocol", "dst-port" : "100", "protocol-type" : "PROTOCOL_TCP"}
                            ]
                        },
                        "is-group": false
                    };
                    model.set(jsonObj);
                    view.render();
                    view.$el.find('#application-name').val().should.be.equal('test1');
                    view.$el.find('#application-description').val().should.be.equal('This is a test');
                    view.$el.find('#service-choice').prop('checked').should.be.true;
                });

                it("View should be set with values correctly when service group is selected", function(){
                    var jsonObj = {
                        "@uri" : "/api/juniper/sd/service-management/services/196910",
                        "name" : "test2",
                        "description": "This is a test",
                        "id": 196910,
                        "edit-version": 1,
                        "domain-name" : "Global",
                        "domain-id": 2,
                        "members": {
                            "member" :[
                                {"id": 163880, "name" : "service1", "domain-name" : "SYSTEM"},
                                {"id": 163905, "name" : "service2", "domain-name" : "SYSTEM"}
                            ],
                            "total":2
                        },
                        "is-group": true
                    };
                    model.set(jsonObj);
                    view.render();
                    view.$el.find('#application-name').val().should.be.equal('test2');
                    view.$el.find('#application-description').val().should.be.equal('This is a test');
                    view.$el.find('#service-group-choice').prop('checked').should.be.true;
                });

                it("Updates should be saved correctly when ok button is clicked and service is selected", function(done){
                    var jsonObj = {
                        "created-by-user-name": "super",
                        "@uri" : "/api/juniper/sd/service-management/services/196910",
                        "name" : "test1",
                        "description": "This is a test",
                        "id": 196910,
                        "is-group": false,
                        "edit-version": 1,
                        "domain-name" : "Global",
                        "domain-id": 2,
                        "protocols": {
                            "protocol":[
                                {"name" : "protocol1", "description" : "protocol", "dst-port" : "100", "protocol-type" : "PROTOCOL_TCP"},
                                {"name" : "protocol2", "description" : "protocol", "dst-port" : "100", "protocol-type" : "PROTOCOL_TCP"}
                            ]
                        }
                    };
                    view.model.set(jsonObj);
                    view.render();
                    $('#main-content').empty();
                    $('#main-content').append(view.$el);
                    validationElements  = ".elementinput>input, .elementinput>textarea, .elementinput>select, .optionselection>input, .elementinput .fileupload-text:first";
                    view.$el.find(validationElements).off('.validator');
                    view.$el.find(validationElements).off('validateForm');
                    var isValidInputStub = sinon.stub(view.form,"isValidInput",function(){
                        return true;
                    });
                    view.$el.find('#application-name').val('test1-edited').trigger('change');
                    $.mockjax({
                        url: "/api/juniper/sd/service-management/services/196910",
                        type: 'PUT',
                        status: 200,
                        contentType: 'text/json',
                        dataType: 'json',
                        response: function(settings) {
                            this.responseText = settings.data;
                            var profile = $.parseJSON(settings.data);
                            profile['service'].name.should.be.equal('test1-edited');
                            profile['service'].description.should.be.equal('This is a test');
                            profile['service']['is-group'].should.be.false;
                            profile['service']['protocols'].should.have.property('protocol').with.length(2);
                            done();
                        }
                    });
                    view.submit(new $.Event());
                    isValidInputStub.restore();
                });

                it("Updates should be saved correctly when ok button is clicked and service group is selected", function(done){
                    var jsonObj = {
                        "@uri" : "/api/juniper/sd/service-management/services/196910",
                        "name" : "test1",
                        "description": "This is a test",
                        "id": 196910,
                        "edit-version": 1,
                        "domain-name" : "Global",
                        "domain-id": 2,
                        "members": {
                            "member" :[
                                {"id": 163880, "name" : "service1", "domain-name" : "SYSTEM"},
                                {"id": 163905, "name" : "service2", "domain-name" : "SYSTEM"}
                            ],
                            "total":2
                        },
                        "is-group": true
                    };
                    model.set(jsonObj);
                    view.render();
                    $('#main-content').empty();
                    $('#main-content').append(view.$el);
                    validationElements  = ".elementinput>input, .elementinput>textarea, .elementinput>select, .optionselection>input, .elementinput .fileupload-text:first";
                    view.$el.find(validationElements).off('.validator');
                    view.$el.find(validationElements).off('validateForm');
                    var isValidInputStub = sinon.stub(view.form,"isValidInput",function(){
                        return true;
                    });
                    view.$el.find('#application-name').val('test1-edited').trigger('change');
                    var getSelectedItems = sinon.stub(view.listBuilder, "getSelectedItems", function(callback){
                        data = {
                            "services":{
                                "service":[
                                    {"id": 163880, "name" : "service1", "domain-name" : "SYSTEM"},
                                    {"id": 163905, "name" : "service2", "domain-name" : "SYSTEM"},
                                    {"id": 163910, "name" : "service3", "domain-name" : "SYSTEM"}
                                ],
                                "total":3
                            }
                        }
                        callback(data);
                    });
                    view.listBuilder.buildCallback();
                    $.mockjax({
                        url: "/api/juniper/sd/service-management/services/196910",
                        type: 'PUT',
                        status: 200,
                        contentType: 'text/json',
                        dataType: 'json',
                        response: function(settings) {
                            this.responseText = settings.data;
                            var profile = $.parseJSON(settings.data);
                            profile['service'].name.should.be.equal('test1-edited');
                            profile['service'].description.should.be.equal('This is a test');
                            profile['service']['is-group'].should.be.true;
                            profile['service']['members'].should.have.property('member').with.length(3);
                            done();
                        }
                    });
                    view.submit(new $.Event());
                    isValidInputStub.restore();
                    getSelectedItems.restore();
                });

                it("Test createAction function",function(){
                    view.createAction();
                    view.overlay.should.be.exist;
                });

                it("Test updateAction function",function(){
                    var jsonObj = {
                        "created-by-user-name": "super",
                        "@uri" : "/api/juniper/sd/service-management/services/196910",
                        "name" : "test1",
                        "description": "This is a test",
                        "id": 196910,
                        "is-group": false,
                        "edit-version": 1,
                        "domain-name" : "Global",
                        "domain-id": 2,
                        "protocols": {
                            "protocol":[
                                {"name" : "protocol1", "description" : "protocol", "dst-port" : "100", "protocol-type" : "PROTOCOL_TCP"},
                                {"name" : "protocol2", "description" : "protocol", "dst-port" : "100", "protocol-type" : "PROTOCOL_TCP"}
                            ]
                        }
                    };
                    view.model.set(jsonObj);
                    view.render();
                    var getSelectedRows = sinon.stub(view.gridWidget, "getSelectedRows", function(){
                        return [{"name" : "protocol1", "description" : "protocol", "protocol-type" : "PROTOCOL_TCP"}];
                    })
                    var row = {
                        originalData:
                            {"name" : "protocol1", "description" : "protocol", "protocol-type" : "PROTOCOL_TCP"},
                        originalRow:
                            {"name" : "protocol1", "description" : "protocol", "protocol-type" : "PROTOCOL_TCP", "slipstreamGridWidgetRowId" : "jqg6"}
                    }
                    view.updateAction(null,row);
                    view.overlay.should.be.exist;
                });

                it("Test deleteAction function",function(){
                    var row = {
                        deletedRows:[
                            {"name" : "protocol1", "description" : "protocol", "dst-port" : "100", "protocol-type" : "PROTOCOL_TCP"}
                        ]
                    };
                    var remove = sinon.spy(view.protocolData, "remove");
                    view.deleteAction(null,row);
                    remove.calledOnce.should.be.true;
                    remove.restore();
                });

                it("Test CellToolTip function",function(){
                    var cellData = {
                        $cell:{
                            context:{
                                innerText: '123'
                            }
                        }
                    };
                    var renderTooltip = sinon.spy();
                    view.cellTooltip(cellData,renderTooltip);
                    renderTooltip.calledOnce.should.be.true;
//                    renderTooltip.restore();
                });
            });

            describe("ServiceView Clone", function(){
                var view = null;
                var intent, model, collection = null;
                before(function(){
                    $.mockjax.clear();
                    intent = sinon.stub(activity, 'getIntent', function() {
                        return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CLONE);
                    });
                    model = new ServiceModel();
                    collection = new ServiceCollection();

                    var jsonObj = {
                        "@uri" : "/api/juniper/sd/service-management/services/196910",
                        "name" : "test1",
                        "description": "This is a test",
                        "id": 196910,
                        "edit-version": 1,
                        "domain-name" : "Global",
                        "domain-id": 2,
                        "members": {
                            "member" : [
                                {"id": 163880, "name" : "service1", "domain-name" : "SYSTEM"},
                                {"id": 163905, "name" : "service2", "domain-name" : "SYSTEM"}
                            ],
                            "total":2
                        },
                        "is-group": true
                    };
                    model.set(jsonObj);
                });

                after(function(){
                    intent.restore();
                });

                beforeEach(function(){
                    $.mockjax.clear();
                    view = new ServiceView({
                        activity: activity,
                        model: model,
                        collection: collection
                    });
                })

                it("View.formMode should be CLONE", function(){
                    view.formMode.should.be.equal('CLONE');
                });

                it("View should be set with the values correctly", function(){
                    view.render();
                    view.$el.find('#application-name').val().should.be.equal('test1');
                    view.$el.find('#application-description').val().should.be.equal('This is a test');
                    view.$el.find('#service-group-choice').prop('checked').should.be.true;
                });
            });
        });
    })
})