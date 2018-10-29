define([
    "../util/gridUtility.js"
], function(GridUtility){
    describe("Grid Util Unit Tests", function() {
        var gridUtility = null;

        before(function() {
            gridUtility = new GridUtility();
            window.Juniper = {sm: {CURRENT_DOMAIN_ID: 2}};
        });
        after(function() {
            delete window.Juniper;
        });
        beforeEach(function() {
            //
        });
        afterEach(function() {
            $.mockjax.clear();
        });

        it("getRowIds success without filter", function(done) {
            var fakeData = {
                "select-ids" : {
                    "select-id": [{
                        "id": 1001,
                        "domain-id": "2"
                    }, {
                        "id": 1002,
                        "domain-id": "2"
                    }, {
                        "id": 1003,
                        "domain-id": "2"
                    }]
                }
            };
            var setIdsSuccess = sinon.spy(),
                setIdsError = $.noop,
                tokens = null,
                parameters = null,
                baseUrl = "/api/juniper/sd/address-management/addresses?filter=(address ne 'group')";

            $.mockjax({
                url: "/api/juniper/sd/address-management/addresses/select-all*",
                type: "GET",
                response: function(data, done2) {
                    this.responseText = fakeData;
                    done2();
                    setIdsSuccess.calledOnce.should.be.true;
                    setIdsSuccess.calledWith([1001, 1002, 1003], ["2", "2", "2"]).should.be.true;
                    done();
                }
            });
            gridUtility.getRowIds(setIdsSuccess, setIdsError, tokens, parameters, baseUrl);
        });

        it("getRowIds success with filter", function(done) {
            var fakeData = {
                "select-ids" : {
                    "select-id": [{
                        "id": 1001,
                        "domain-id": "2"
                    }, {
                        "id": 1002,
                        "domain-id": "2"
                    }, {
                        "id": 1003,
                        "domain-id": "2"
                    }]
                }
            };
            var setIdsSuccess = sinon.spy(),
                setIdsError = $.noop,
                tokens = null,
                parameters = {"_search": "test", "filter": "(address ne 'group')"},
                baseUrl = "/api/juniper/sd/address-management/addresses?filter=(address ne 'group')";

            $.mockjax({
                url: "/api/juniper/sd/address-management/addresses/select-all*",
                type: "GET",
                response: function(data, done2) {
                    this.responseText = fakeData;
                    done2();
                    setIdsSuccess.calledOnce.should.be.true;
                    setIdsSuccess.calledWith([1001, 1002, 1003], ["2", "2", "2"]).should.be.true;
                    done();
                }
            });
            gridUtility.getRowIds(setIdsSuccess, setIdsError, tokens, parameters, baseUrl);
        });

        it("getRowIds fail for loading error", function(done) {
            var setIdsSuccess = $.noop,
                setIdsError = sinon.spy(),
                tokens = null,
                parameters = {"_search": "test", "filter": "(address ne 'group')"},
                baseUrl = "/api/juniper/sd/address-management/addresses?filter=(address ne 'group')";

            $.mockjax({
                url: "/api/juniper/sd/address-management/addresses/select-all*",
                type: "GET",
                status: 500,
                response: function(data, done2) {
                    done2();
                    setIdsError.calledWith("Getting all row ids in the grid FAILED.").should.be.true;
                    done();
                }
            });
            gridUtility.getRowIds(setIdsSuccess, setIdsError, tokens, parameters, baseUrl);
        });

        it("getRowIds fail for no base url defined", function(done) {
            var setIdsSuccess = $.noop,
                setIdsError = sinon.spy(),
                tokens = null,
                parameters = {"_search": "test", "filter": "(address ne 'group')"},
                baseUrl = null;

            gridUtility.getRowIds(setIdsSuccess, setIdsError, tokens, parameters, baseUrl);
            setTimeout(function(){
                setIdsError.calledWith("Getting all row ids in the grid FAILED, no URL is defined.").should.be.true;
                done();
            }, 1000);
        });

        it("should return a function which is callable and return specified result", function() {
            var fn = gridUtility.getOnBeforeSearchFunction();
            var result = fn(["showUnused"]);
            result.should.be.instanceOf(Array);
            result[0].should.equal("showUnused eq 'true'");
        });

        it("should return a function which is callable and return exactly same object to param ", function() {
            var fn = gridUtility.getOnBeforeSearchFunction();
            var result = fn(["showunused"]);
            result.should.be.instanceOf(Array);
            result[0].should.equal("showunused");
        });

        it("should return specified result from specified extras", function() {
            var param = {" filter": "(name eq 'test_data')"};
            var result = gridUtility.getSearchParamsFromExtras(param);
            result.should.be.equal("test_data");
        });

        it("should return specified result from specified extras", function() {
            var param = {"filter": "(name eq 'test_data')"};
            var result = gridUtility.getSearchParamsFromExtras(param);
            result.should.be.equal("test_data");
        });

        it("should return undefined result from specified extras", function() {
            var param = null;
            var result = gridUtility.getSearchParamsFromExtras(param);
            expect(result).to.be.undefined;
        });

        it("should add context menu to conf object", function() {
            var conf = {}, item = {label: "test", key: "test"};
            gridUtility.addContextMenuItem(conf, item);
            conf.contextMenu.custom.should.be.instanceOf(Array);
            conf.contextMenu.custom[0].key.should.equal("test");
        });

        it("should return intent object", function() {
            var intent = gridUtility.createNewIntent({data: "address"}, "create");
            intent.data["mime_type"].should.equal("address");
            intent.action.should.equal("create");
        });

        it("should return object with predefined column index for empty config", function() {
            var conf = {};
            gridUtility.addColumnForPredefinedIdentifier(conf);
            conf.columns.should.be.instanceOf(Array);
            conf.columns[0].id.should.equal("definition-type")
            conf.columns[0].name.should.equal("definition-type")
            conf.columns[0].hidden.should.be.true;
        });

        it("should return object with predefined column index", function() {
            var conf = {
                columns: [{
                    "id": "test1",
                    "name": "test_name"
                }, {
                    "id": "test2",
                    "name": "test_name_2"
                }]
            };
            gridUtility.addColumnForPredefinedIdentifier(conf);
            conf.columns.should.be.instanceOf(Array);
            conf.columns.length.should.be.equal(3);
            conf.columns[2].id.should.equal("definition-type")
            conf.columns[2].name.should.equal("definition-type")
            conf.columns[2].hidden.should.be.true;
        });

        it("should return object with predefined column index which is defined in config", function() {
            var conf = {
                columns: [{
                    "id": "test1",
                    "name": "test_name"
                }, {
                    "id": "definition-type",
                    "name": "definition-type",
                    hidden: false
                }]
            };
            gridUtility.addColumnForPredefinedIdentifier(conf);
            conf.columns.should.be.instanceOf(Array);
            conf.columns.length.should.be.equal(2);
            conf.columns[1].id.should.equal("definition-type")
            conf.columns[1].name.should.equal("definition-type")
            conf.columns[1].hidden.should.be.false;
        });

        it("getDeleteErrorMsg for only one selected object", function() {
            var objectId = "10001",
                selectedRows = [{id: "10001"}],
                context = new Slipstream.SDK.ActivityContext();
            var msg = gridUtility.getDeleteErrorMsg(objectId, selectedRows, context);
            msg.should.equal("[delete_one_fail_error]");
        });
        it("getDeleteErrorMsg for more than 10 selected objects", function() {
            var objectId = "10001",
                selectedRows = [{id: "10001"}, {id: "10002"}, {id: "10003"}, {id: "10004"},
                                {id: "10005"},{id: "10006"}, {id: "10007"}, {id: "10008"},
                                {id: "10009"}, {id: "10010"}, {id: "10011"}],
                context = new Slipstream.SDK.ActivityContext();
            var msg = gridUtility.getDeleteErrorMsg(objectId, selectedRows, context);
            msg.should.equal("[delete_large_data_fail]");
        });
        it("getDeleteErrorMsg for first object delete failure", function() {
            var objectId = "10001",
                selectedRows = [{id: "10001", name: "10001"}, {id: "10002", name: "10002"}, {id: "10003", name: "10003"},
                            {id: "10004", name: "10004"}, {id: "10005", name: "10005"}, {id: "10006", name: "10006"},
                            {id: "10007", name: "10007"}, {id: "10008", name: "10008"}],
                context = new Slipstream.SDK.ActivityContext();
            var msg = gridUtility.getDeleteErrorMsg(objectId, selectedRows, context);
            msg.should.equal("[delete_error_msg_first_failed]");
        });
        it("getDeleteErrorMsg for last object delete failure", function() {
            var objectId = "10008",
                selectedRows = [{id: "10001", name: "10001"}, {id: "10002", name: "10002"}, {id: "10003", name: "10003"},
                            {id: "10004", name: "10004"}, {id: "10005", name: "10005"}, {id: "10006", name: "10006"},
                            {id: "10007", name: "10007"}, {id: "10008", name: "10008"}],
                context = new Slipstream.SDK.ActivityContext();
            var msg = gridUtility.getDeleteErrorMsg(objectId, selectedRows, context);
            msg.should.equal("[delete_error_msg_last_failed]");
        });
        it("getDeleteErrorMsg for single object delete success, others fail", function() {
            var objectId = "10002",
                selectedRows = [{id: "10001", name: "10001"}, {id: "10002", name: "10002"}, {id: "10003", name: "10003"},
                            {id: "10004", name: "10004"}, {id: "10005", name: "10005"}, {id: "10006", name: "10006"},
                            {id: "10007", name: "10007"}, {id: "10008", name: "10008"}],
                context = new Slipstream.SDK.ActivityContext();
            var msg = gridUtility.getDeleteErrorMsg(objectId, selectedRows, context);
            msg.should.equal("[delete_error_msg_single]");
        });
        it("getDeleteErrorMsg for more than one objects delete success and more than one fail", function() {
            var objectId = "10003",
                selectedRows = [{id: "10001", name: "10001"}, {id: "10002", name: "10002"}, {id: "10003", name: "10003"},
                            {id: "10004", name: "10004"}, {id: "10005", name: "10005"}, {id: "10006", name: "10006"},
                            {id: "10007", name: "10007"}, {id: "10008", name: "10008"}],
                context = new Slipstream.SDK.ActivityContext();
            var msg = gridUtility.getDeleteErrorMsg(objectId, selectedRows, context);
            msg.should.equal("[delete_error_msg_multiple]");
        });

        it("showDeleteErrMsg should build confirmation dialog widget", function() {
            var context = new Slipstream.SDK.ActivityContext();
            var error = "object is referred by other objects";
            sinon.stub(gridUtility, "createValidationConfirmationDialog");
            gridUtility.showDeleteErrMsg(error, context);

            gridUtility.createValidationConfirmationDialog.calledOnce.should.be.true;
            gridUtility.createValidationConfirmationDialog.restore();
        });
        it("showDeleteErrMsg should build confirmation dialog and invoke yesEvent function when yes button clicked", function() {
            var context = new Slipstream.SDK.ActivityContext();
            var error = "object is referred by other objects";
            gridUtility.showDeleteErrMsg(error, context);

            sinon.spy(gridUtility.validationConfirmationDialogWidget, "destroy");
            gridUtility.validationConfirmationDialogWidget.vent.trigger("yesEventTriggered");
            gridUtility.validationConfirmationDialogWidget.destroy.calledOnce.should.be.true;
        });

        it("createValidationConfirmationDialog should build dialog widget", function(){
            var options = {
                    title: "confirmation dialog",
                    question: "for testing",
                    yesEvent: function() {
                        console.log("on yes event");
                    }
            };
            var context = new Slipstream.SDK.ActivityContext();
            gridUtility.createValidationConfirmationDialog(options, context);
            gridUtility.validationConfirmationDialogWidget.should.not.be.null;
            sinon.spy(console, "log");
            gridUtility.validationConfirmationDialogWidget.vent.trigger("yesEventTriggered");
            console.log.calledWith("on yes event").should.be.true;
            console.log.restore();
        });

        it("parseReferenceResult should return specified object", function() {
            var referObjects = {
                    "objectType": "type",
                    "typeName": "NAT Pool",
                    "objectName": "<a class=\"jx-global-search-link\" href=\"/nat-policy-management/nat-pools? filter=(name eq 'p1')\" >p1 (Global)</a>",
                    "hasMore": false,
                    "objectDescription": "<br/>",
                    "objectMoid": "net.juniper.space.sd.natmanager.jpa.DCNatPoolEntity:196608",
                    "jumpLink": "<a class=\"jx-global-search-link\" href=\"/nat-policy-management/nat-pools? filter=(name eq 'p1')\" >p1 (Global)</a>",
                    "numOfHighlights":0
                };
            var result = gridUtility.parseReferenceResult(referObjects);
            result.should.be.instanceOf(Array);
            result[0]["type_name"].should.equal("NAT Pool");
            result[0]["object_name"].should.contain("p1 (Global)");
        });

        it("showDeleteReferenceError for find referece success", function(done) {
            var context = new Slipstream.SDK.ActivityContext();
            var response = {
                "title": "USED_DELETE",
                "message": "a1#</br>NAT Pool: <i>p1 <font color='blue'>(Global)</font>, p2 <font color='blue'>(Global)</font></i></br>","title":"USED_DELETE",
                "failedObjectId":131080
            };
            var referenceResponse = {
                    "response": {
                        "results": {
                            "total": 2,
                            "success": true,
                            "result": [{
                                "objectType": "type",
                                "typeName": "NAT Pool",
                                "objectName": "<a class=\"jx-global-search-link\" href=\"\/nat-policy-management\/nat-pools? filter=(name eq 'p1')\" >p1 (Global)<\/a>",
                                "hasMore": false,
                                "objectDescription": "<br\/>",
                                "objectMoid": "net.juniper.space.sd.natmanager.jpa.DCNatPoolEntity:196608",
                                "jumpLink": "<a class=\"jx-global-search-link\" href=\"\/nat-policy-management\/nat-pools? filter=(name eq 'p1')\" >p1 (Global)<\/a>",
                                "numOfHighlights":0
                            }, {
                                "objectType": "type",
                                "typeName": "NAT Pool",
                                "objectName": "<a class=\"jx-global-search-link\" href=\"\/nat-policy-management\/nat-pools? filter=(name eq 'p2')\" >p2 (Global)<\/a>",
                                "hasMore": false,
                                "objectDescription": "<br\/>",
                                "objectMoid": "net.juniper.space.sd.natmanager.jpa.DCNatPoolEntity:196609",
                                "jumpLink": "<a class=\"jx-global-search-link\" href=\"\/nat-policy-management\/nat-pools? filter=(name eq 'p2')\" >p2 (Global)<\/a>",
                                "numOfHighlights": 0
                            }]
                        }
                    }
                };
            sinon.stub(gridUtility, "showDeleteErrMsg", function(){
                console.log(arguments)
            });
            $.mockjax({
                url: "/api/space/search/query*",
                type: "GET",
                response: function(data, done2) {
                    this.responseText = referenceResponse;
                    done2();

                    gridUtility.showDeleteErrMsg.calledOnce.should.be.true;
                    gridUtility.showDeleteErrMsg.restore();
                    done();
                }
            });
            gridUtility.showDeleteReferenceError(response, context);
        });

        it("showDeleteReferenceError for unformatted response", function(done) {
            var context = new Slipstream.SDK.ActivityContext();
            var response = {
                "message": "a1#</br>NAT Pool: <i>p1 <font color='blue'>(Global)</font>, p2 <font color='blue'>(Global)</font></i></br>","title":"USED_DELETE",
                "failedObjectId":131080
            };
            sinon.spy(console, "log");

            $.mockjax({
                url: "/api/space/search/query*",
                type: "GET",
                response: function(data, done2) {
                    this.responseText = {"response":{"total":2,"success":true,"result":[]}};
                    done2();

                    console.log.called.should.be.true;
                    console.log.calledWith("failed to query reference object").should.be.true;
                    console.log.restore();
                    done();
                }
            });
            gridUtility.showDeleteReferenceError(response, context);
        });

        it("showDeleteReferenceError for load data failure", function(done) {
            var context = new Slipstream.SDK.ActivityContext();
            var response = {
                    "message": "a1#</br>NAT Pool: <i>p1 <font color='blue'>(Global)</font>, p2 <font color='blue'>(Global)</font></i></br>","title":"USED_DELETE",
                    "failedObjectId":131080
                };
            sinon.spy(console, "log");
            gridUtility.showDeleteReferenceError(response, context);
            setTimeout(function() {
                console.log.calledOnce.should.be.true;
                console.log.calledWith("reference not fetched").should.be.true;
                console.log.restore();
                done();
            }, 1000);
        });

    })
});