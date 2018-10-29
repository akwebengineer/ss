/**
 * 
 */
define([
        '../widgets/serviceListBuilder.js'
], function( ListBuilder ){
    describe("ServiceListBuilder Unit Test", function(){
        var view;
        var context, activity;
        before(function(){
            context = new Slipstream.SDK.ActivityContext();
            activity = new Slipstream.SDK.Activity();
            activity.context = context;
            view = new ListBuilder({
                context : context
            });
        });

        it("ServiceListBuilder is created properly", function () {
            view.should.exist;
            view.listBuilderModel.should.exist;
        });

        it("Test excludeServiceByName function", function(){
            var nameArr = ["Any", "aaaaaaaaaaa"];
            var ret = view.excludeServiceByName(nameArr);
            ret[0].modifier.should.be.equal('ne');
            ret[0].property.should.be.equal('name');
            ret[0].value.should.be.equal('Any');
            ret[1].value.should.be.equal('aaaaaaaaaaa');
        });

        it("Test addDynamicFormConfig function with null value", function(){
            var elements = {
                    availableElements:{url:""},
                    selectedElements:{url:""},
                    search:{url:""},
                    columns:[{name:"id"},{name:"name"},{name:"domain-name"}]};
            var ret = view.addDynamicFormConfig(elements);
            ret.should.have.property('columns').with.length(3);
            ret.columns[0].name.should.be.equal('id');
            var ret2 = elements.search.url({_search:"test"}, null);
            ret2.filter.should.be.equal("(name ne 'Any')");
        });

        it("Test addDynamicFormConfig function with value", function(){
            view.conf.excludedNames = ["test"];
            var elements = {
                    availableElements:{url:""},
                    selectedElements:{url:""},
                    search:{url:""},
                    columns:[{name:"id"},{name:"name"},{name:"domain-name"}]};
            var ret = view.addDynamicFormConfig(elements);
            ret.should.have.property('columns').with.length(3);
            ret.columns[0].name.should.be.equal('id');
            var ret2 = elements.search.url({}, "test1");
            ret2.filter.should.be.equal("(name ne \'Any\' and name ne \'test\')");
            ret2._search.should.be.equal("test1");
        });

        it("Test roolTooltip function when service is selected", function(){
            var rowData = { "id": 164026, "name" : "testprotocol", "domain-name" : "SYSTEM"};
            var renderTooltip = function(data){
                console.log(data);
            };
            var response = { 
                service : {
                    "description" : "test service",
                    "domain-id" : 1,
                    "domain-name" : "Global",
                    "id" : 163908,
                    "is-group" : false,
                    "name" : "testprotocol",
                    "protocols" : {
                        "protocol" : [
                            {"protocol-type":"PROTOCOL_ICMP","protocol-number":1,"name":"ab","disable-timeout":true,"rpc-program-number":"0","icmp-code":1,"icmp-type":1,"description":""},
                            {"sunrpc-protocol-type":"TCP","msrpc-protocol-type":"TCP","protocol-number":6,"name":"ac","src-port":"","dst-port":"","disable-timeout":true,"protocol-type":"PROTOCOL_TCP","rpc-program-number":"0","icmp-code":0,"icmp-type":0,"description":""},
                            {"sunrpc-protocol-type":"UDP","msrpc-protocol-type":"UDP","protocol-number":17,"name":"ad","src-port":"","dst-port":"","disable-timeout":true,"protocol-type":"PROTOCOL_UDP","rpc-program-number":"0","icmp-code":0,"icmp-type":0,"description":""},
                            {"sunrpc-protocol-type":"TCP","msrpc-protocol-type":"TCP","protocol-number":6,"name":"ae","disable-timeout":true,"protocol-type":"PROTOCOL_SUN_RPC","rpc-program-number":"2","icmp-code":0,"icmp-type":0,"description":""},
                            {"sunrpc-protocol-type":"UDP","msrpc-protocol-type":"UDP","protocol-number":17,"name":"af","disable-timeout":true,"protocol-type":"PROTOCOL_MS_RPC","rpc-program-number":"0","icmp-code":0,"icmp-type":0,"description":"","uuid":"33333333-2222-2222-2222-111111111111"},
                            {"protocol-number":1,"name":"ag","src-port":"","dst-port":"","disable-timeout":true,"protocol-type":"PROTOCOL_OTHER","rpc-program-number":"0","icmp-code":0,"icmp-type":0,"description":""},
                            {"protocol-number":58,"name":"ah","disable-timeout":false,"protocol-type":"PROTOCOL_ICMPV6","rpc-program-number":"0","icmp-code":2,"icmp-type":2,"description":""}
                        ]
                    }
                }
            };
            var logSpy = sinon.spy(console,"log");
            var fetchByIdStub = sinon.stub(view.listBuilderModel, 'fetchById', function(id, callback){
                callback(null, response);
            });
            view.rowTooltip( rowData, renderTooltip);
            logSpy.args[0][0][0].title.should.be.equal('testprotocol');
            logSpy.args[0][0][1].label.should.be.equal('ICMP/ (+)');
            fetchByIdStub.restore();
            logSpy.restore();
        });

        it("Test roolTooltip function when service group is selected", function(){
            var rowData = { "id": 164026, "name" : "testgroup", "domain-name" : "SYSTEM"};
            var renderTooltip = function(data){
                console.log(data);
            };
            var response = { 
                service : {
                    "description" : "predefined service",
                    "domain-id" : 1,
                    "domain-name" : "SYSTEM",
                    "id" : 164026,
                    "is-group" : true,
                    "name" : "testgroup",
                    "members" : {
                        "member" : [
                            {id : 163881, "is-group" : true, name : "aol", description : "predefined service"},
                            {id : 163998, "is-group" : false, name : "apple-ichat-snatmap", description : "predefined service"},
                            {id : 163885, "is-group" : false, name : "dns-udp", description : "predefined service"},
                            {id : 163855, "is-group" : false, name : "http", description : "predefined service"},
                            {id : 163856, "is-group" : false, name : "https", description : "predefined service"},
                            {id : 163933, "is-group" : false, name : "sip", description : "predefined service"}
                        ]
                    }
                }
            };
            var logSpy = sinon.spy(console,"log");
            var fetchByIdStub = sinon.stub(view.listBuilderModel, 'fetchById', function(id, callback){
                callback(null, response);
            });
            view.conf.id = 164026;
            view.rowTooltip(rowData, renderTooltip);
            logSpy.args[0][0][0].title.should.be.equal('testgroup');
            logSpy.args[0][0][1].label.should.be.equal("aol: [tooltip_service_group]");
            logSpy.args[0][0][6].link.should.be.equal("[tooltip_more_link]");
            logSpy.args[0][0].length.should.be.equal(7);
            fetchByIdStub.restore();
            logSpy.restore();
        });

        it("Test moreLinkAction function", function(){
            var id = 164026;
            var name = "test";
            var link = $('a#service_list-tooltip-more-link');
            view.moreLinkAction(link,id,name);
            view.tooltipOverlay.should.be.exist;
        });
    });
})
