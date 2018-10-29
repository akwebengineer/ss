define([
      "../views/ipsSigSelectedListGridView.js",
      '../../../../sd-common/js/signatures/views/baseSelectedListGridView.js'
], function(ipsSigSelectedListGridView,BaseSelectedListGridViewRHS) {
    
    describe("Signatures - IPS - selected List Grid View", function() { 
        var stub1,stub,getMessage,activity = new Slipstream.SDK.Activity(),
        view = null , options = {} , context = new Slipstream.SDK.ActivityContext();

        options = {
            parentView: { context: context }, 
            formTitleMsgs: null, 
            uuid: '859222', 
            currentView: {uuid : '859222' ,sigGroupGridConf : {},
            gridContainerId : 'ips-sig-static-grid'}
        }
        
        it( "view objescts exist" , function() {
             stub1 = sinon.stub(BaseSelectedListGridViewRHS.prototype, 'createSigGroupGrid');
              
             view = new ipsSigSelectedListGridView(options); 
             view.should.exist;

             stub1.called.should.be.equal(true);
             stub1.restore();
          
        });

        it("view should exist", function() {
            view.should.exist; 
            
        });

        describe ("Method: updateSelectorGridConf - update the grid Elements",function() {

            it("update the grid Elements - with Values", function() {
                var gridElements = {} , data = {};
                    data = {
                    "ips-signatures" : { 
                        "ips-signature" : [],
                        "uri":"/api/juniper/sd/ips-signature-management/item-selector/752692/selected-sigs",
                        "total":0
                        }
                    }
                    data["ips-signatures"]["total"] = "1700";
                    gridElements.url = '/api/juniper/sd/ips-signature-management/item-selector/ 222 /selected-sigs';
                     gridElements.ajaxOptions = {
                        headers: {
                                'Accept': 'application/vnd.juniper.sd.ips-signature-management.signatures+json;version=1;q=0.01'
                            }
                     };
                     gridElements.jsonRecords= function(data) {
                        return data["ips-signatures"]["total"];
                    };    
                    gridElements.jsonRoot= "ips-signatures.ips-signature",
                    
                    view.updateGridConf(gridElements).should.be.equal(gridElements);
            });
        }); 

        describe("Method : deleteRecords", function() {
            it("deleteRecords - success", function(done) {
                var uuid= 123232, selectData = {},
                selectedRowId = ["232","232"];
                afterEach ( function() {
                     $.mockjax.clear();
                })

                $.mockjax({
                        url: '/api/juniper/sd/ips-signature-management/item-selector/'+ uuid ,
                        type: 'POST',
                        status: 200,
                        contentType: 'text/json',
                        dataType: 'json',
                        responseText: {
                        },
                         response: function (set,done2) {                           
                          done2();
                          done();
                        }
                    });
                    view.deleteRecords( uuid ,selectedRowId);
            });

            it("deleteRecords - error", function(done) {
                var uuid= 123232,
                selectedRowId = [];
               $.mockjax({
                        url: '/api/juniper/sd/ips-signature-management/item-selector/'+ uuid ,
                        type: 'POST',
                        status: 404,
                        contentType: 'text/json',
                        dataType: 'json',
                         responseText: {},
                   
                         response: function (set,done2) {
                          done2();
                          done();
                        }
                    });
                    view.deleteRecords(uuid ,selectedRowId);
            });
        });

        describe("updateDataRHS", function() {
            var uuid = 2323;
            afterEach(function(){
                $.mockjax.clear();
            });

            it("updateDataRHS - success" , function(done) {
                var customColData = [
                    {id: 2323},
                    {id: 2321}
                ];
                
                $.mockjax({
                        url: '/api/juniper/sd/ips-signature-management/item-selector/'+ uuid  +'/selected-ids/select-all' ,
                        type: 'get',
                        status: 200,
                        contentType: 'text/json',
                        dataType: 'json',
                        responseText: {
                        'select-ids': {
                            'select-id': customColData
                        }
                    },
                     response: function (set,done2) {
                       done2();
                       done();

                    }
                    });
                    view.updateDataRHS(uuid);
            });
            it("updateDataRHS - error" , function(done) {
               
                $.mockjax({
                        url: '/api/juniper/sd/ips-signature-management/item-selector/'+ uuid  +'/selected-ids/select-all' ,
                        type: 'get',
                        status: 404,
                        contentType: 'text/json',
                        dataType: 'json',
                        responseText: {
                        
                    },
                     response: function (set,done2) {
                       done2();
                       done();

                    }
                });
                view.updateDataRHS(uuid);
            });
        });

    });

});