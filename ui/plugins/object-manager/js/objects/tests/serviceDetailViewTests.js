/**
 *
 */
define([
        '../models/serviceModel.js',
        '../views/serviceDetailView.js'
],function( ServiceModel, ServiceDetailView ){
    describe("ServiceDetailView Unit Test", function(){
        var context, activity;
        var view = null;
        var intent, model = null;
        before(function(){
            activity = new Slipstream.SDK.Activity();
            context = sinon.stub(activity, 'getContext', function(){
                return new Slipstream.SDK.ActivityContext();
            });
            model = new ServiceModel();
        });

        after(function(){
            context.restore();
        });

        beforeEach(function(){
            view = new ServiceDetailView({
                activity: activity,
                model: model
            });
        });

        it("View should exist", function(){
            view.should.exist;
        });

        it("View.form should exist", function(){
            view.render();
            view.form.should.exist;
        });

        describe("Test getFormConfig function", function(){
            it("When service is selected", function(){
                var jsonObj = {
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
                var ret = view.getFormConfig();
                ret.sections[0].elements[0].value.should.be.equal("test1");
                ret.sections[0].elements[2].id.should.be.equal('application-protocols');
            });

            it("When service group is selected", function(){
                var jsonObj = {
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
                var ret = view.getFormConfig();
                ret.sections[0].elements[0].value.should.be.equal("test2");
                ret.sections[0].elements[2].id.should.be.equal('application-members');
            });
        });

        describe("Test addGridWidget function", function(){
            it("When service is selected",function(){
                var jsonObj = {
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
                view.$el.find('#service-protocols').children().children().should.have.length(3);
            });

            it("When service group is selected",function(){
                var jsonObj = {
                    "name" : "test2",
                    "description": "This is a test",
                    "id": 196910,
                    "edit-version": 1,
                    "domain-name" : "Global",
                    "domain-id": 2,
                    "members": {
                        "member" :[
                            {"id": 163880, "name" : "service1", "domain-name" : "SYSTEM"},
                            {"id": 163905, "name" : "service2", "domain-name" : "SYSTEM"},
                            {"id": 163910, "name" : "service3", "domain-name" : "SYSTEM"},
                        ],
                        "total":3
                    },
                    "is-group": true
                };
                model.set(jsonObj);
                view.render();
                view.$el.find('#service-protocols').children().children().should.have.length(4);
            });
        });
    });
})