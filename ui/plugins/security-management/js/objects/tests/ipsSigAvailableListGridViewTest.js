define([
      "../views/ipsSigAvailableListGridView.js"
], function(ipsSigAvailableListGridView ) {
    
    describe("Signatures - IPS - Available List Grid View", function() { 
        var stub,getMessage,activity = new Slipstream.SDK.Activity(),
        view = null , options = {} , context = new Slipstream.SDK.ActivityContext();

        options = {
            parentView: { context: context }, 
            formTitleMsgs: null, 
            uuid: '859222', 
            currentView: {uuid : '859222' ,sigGroupGridConf : {},
            gridContainerId : 'ips-sig-static-grid'}
        }
         
        before(function() {
            view = new ipsSigAvailableListGridView(options);
            getMessage = sinon.stub(view.context, 'getMessage');
        });

        after(function() {
            getMessage.restore();
        });

        it("view should exist", function() {
             view.should.exist;
        });
      
        describe("Method : updateSigFormLabel - to upadte the form Elements", function() {
            
            it("update form Elements with Value", function() {
                var formElement = { "title" : "Add IPS Signatures",
                                "title-help" : {
                                    "content" : 'Use this page to select one or more available IPS signatures from the Available column to include in the selected list for the policy rule.'
                                }};
                view.updateSigFormLabel(formElement).should.be.equal(formElement);
                expect(view).to.exist;
                getMessage.args[0][0].should.be.equal('ips_sig_static_group_form_title');
                getMessage.args[1][0].should.be.equal('ips_sig_static_group_add_title_tooltip');
         
            });
            it("update form elements without value", function() {
                var formElement = {"title" : "",
                                "title-help" : {
                                    "content" : "" } };
                view.updateSigFormLabel(formElement).should.be.equal(formElement);
                  expect(view).to.exist;
                getMessage.args[0][0].should.be.equal('ips_sig_static_group_form_title');
                getMessage.args[1][0].should.be.equal('ips_sig_static_group_add_title_tooltip');
         
            });
            
        });

        describe ("Method: updateSelectorGridConf - update the grid Elements",function() {

            it("update the grid Elements - with Values", function() {
                var gridElements = {} , data = {};
                    data = {
                    "ips-signatures" : { 
                        "ips-signature" : [],
                        "uri":"/api/juniper/sd/ips-signature-management/item-selector/752692/available-sigs",
                        "total":0
                        }
                    }
                    data["ips-signatures"]["total"] = "1700";
                    gridElements.url = '/api/juniper/sd/ips-signature-management/item-selector/'+ options.uuid + '/available-sigs';
                     gridElements.ajaxOptions = {
                        headers: {
                                'Accept': 'application/vnd.juniper.sd.ips-signature-management.signatures+json;version=1;q=0.01'
                            }
                     };
                     gridElements.jsonRecords= function(data) {
                        return data["ips-signatures"]["total"];
                    };    
                    gridElements.jsonRoot= "ips-signatures.ips-signature",
                    
                    view.updateSelectorGridConf(gridElements).should.be.equal(gridElements);
            });
        });
         
        describe("updatesigData" , function() {
            var stub,currentView ,selectedRowId = [];
             beforeEach(function () {
                currentView = {
                    uuid: '1212',
                    sigGroupGrid: {
                        reloadGrid: function () {
                    }
                }
                   
                };
                 stub = sinon.stub(currentView.sigGroupGrid, 'reloadGrid');
            });
             afterEach(function() {
                stub.restore();
                   $.mockjax.clear();
             })

            it("updatesigData - success", function( done) {
                
                $.mockjax({
                    url: '/api/juniper/sd/ips-signature-management/item-selector/'+ options.uuid ,
                    type: 'POST',
                    status: 200,
                    responseText: {
                    },
                     response: function (test, done2) {
                        done2();
                      stub.calledOnce.should.be.equal(true);
                      done();
                    }
                });
                view.updatesigData(options.uuid, selectedRowId ,currentView);

            }); 
            it("updatesigData - error", function( done) {
              
                $.mockjax({
                    url: '/api/juniper/sd/ips-signature-management/item-selector/'+ options.uuid ,
                    type: 'POST',
                    status: 404,
                    responseText: {
                    },
                     response: function (test, done2) {
                       done2();
                       done();

                    }
                });
                view.updatesigData(options.uuid, selectedRowId ,currentView);
            }); 
        });

    });

});