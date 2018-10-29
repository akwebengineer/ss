define([
    '../../views/exportPolicyFormView.js',
    '../../../../../../fw-policy-management/js/firewall/policies/constants/fwPolicyManagementConstants.js'
], function (View, Constants) {

    describe('Export Policy View UT', function () {

         before(function () {
            policyOptions = {
              activity : new Slipstream.SDK.Activity()
            };
            policyOptions.activity.context = new Slipstream.SDK.ActivityContext();
            selectedRecord = [{"id" : 4 }];
            exportPolicyView = new View({activity: policyOptions.activity,
            params : {
              fileType:"ZIP_FORMAT",
              selectedPolicies: selectedRecord,
              policyManagementConstants : Constants
            }
            });
            context.getMessage = function (key) {
                return key;
            };

            context.getHelpKey = function () {
            }

            context.startActivityForResult = function () {
            }

        });

        it('render', function () {            
            exportPolicyView.render();
            expect(exportPolicyView.$el).to.not.be.null;         
        });
        
        it('export policy to zip file 1', function () {            
            var event = {
                 type: 'click'
            };
            var stub = sinon.stub(View.prototype, "exportPolicyJson"); 
            exportPolicyView.exportPolicy(event);       
            stub.called.should.be.equal(true);
            stub.restore();
        });
        
        describe('verify exportPolicy to zip ', function() {
        it('verify snapshot is getting created', function () {            
            var stub = sinon.stub(View.prototype, "createZippedData"); 
            exportPolicyView.exportPolicyJson();       
            stub.called.should.be.equal(true);
            stub.restore();
        });

        it('verify download policy', function () {   
            var stub = sinon.stub(View.prototype, 'subscribeNotifications');
            $.mockjax.clear();
            $.mockjax({
                "url": '/api/juniper/sd/policy-management/firewall/policies/'+selectedRecord[0]['id'] + '/versions',
                "type": 'post',
                status: 200,
                responseText: {},
                response: function (settings, done2) {
                    done2();
                    stub.called.should.be.equal(true);
                    stub.restore();
                }
            });
            exportPolicyView.exportPolicyJson();       
        });

        it('verify download policy ', function () {   
            var fileName = 'Test.zip';
            policyOptions.activity.overlay = {destroy: function(){console.log('destroyed');}}
            var stub = sinon.stub(View.prototype, 'getPolicy'),
                overlayStub = sinon.stub(policyOptions.activity.overlay, "destroy");  
            $.mockjax.clear(),

            response = {'snapshot-version-document-response' :{
                           'value' : fileName
                       }};
            $.mockjax({
                "url": '/api/juniper/sd/policy-management/firewall/snapshot-version-documents?service-id='+selectedRecord[0]['id'],
                "type": 'get',
                status: 200,
                responseText:response,
                response: function (settings, done2) {
                    done2();
                    stub.called.should.be.equal(true);
                    stub.restore();
                    overlayStub.called.should.be.equal(true);
                    overlayStub.restore();

                }
            });
            exportPolicyView.downloadPolicy();       
        });

        it('verify download policy if snapshot is already present', function () {   
            var stub = sinon.stub(View.prototype, 'downloadPolicy');
            $.mockjax.clear();
            $.mockjax({
                "url": '/api/juniper/sd/policy-management/firewall/policies/'+selectedRecord[0]['id'] + '/versions',
                "type": 'post',
                status: 403,
                responseText: 'Snapshot is already taken',
                response: function (settings, done2) {
                    done2();
                    stub.called.should.be.equal(true);
                    stub.restore();
                }
            });
            exportPolicyView.exportPolicyJson();       
        });

        });

    });

});