define([
    '../logCollectorConfigActivity.js',
    '../../../../ui-common/js/common/intentActions.js'
], function (Activity, IntentActions) {

    var importActivity;

    describe('Log Collector Config Activity UT', function () {
        before(function () {
                    
            importActivity = new Activity();            
            importActivity.view = {
                    $el: {
                        bind: function () {
                        }
                    }
                };                      
               
        });         

        it('Checks if the activity object is created properly', function () {
            importActivity.should.exist;
            importActivity.should.be.instanceof(Slipstream.SDK.Activity);
        });

        it('Checks if the on start calls the correct on different actions: Import', function () {
            var stub = sinon.stub(importActivity, 'onImportIntent');
            importActivity.intent = {
                action: Slipstream.SDK.Intent.action.ACTION_IMPORT
            };
            importActivity.onStart();
            stub.called.should.be.equal(true);
            stub.restore();
        });

        it('Checks if the on start calls the correct on different actions: Import Device Change', function () {
            var stub = sinon.stub(Activity.prototype.bindEvents, 'call');
            importActivity.intent = {
                action: IntentActions.ACTION_IMPORT_DEVICECHANGE
            };
            importActivity.bindEvents();
            stub.called.should.be.equal(true);
            stub.restore();
        });    
     
        
        it("deploymentType Success", function (done) {
            importActivity.intent = {
                action: IntentActions.ACTION_ROLLBACK
            };
            $.mockjax.clear();
            
            $.mockjax({
              url: '/api/juniper/ecm/log-collector-nodes/deploymentType',
              type: 'GET',
              status: 200,
              responseText: {response : { data : {deploymentType : 'Integrated'} }},              
              response: function (settings, done2) {
                done2();               
                done();
              }
            });
            importActivity.deploymentTypes();
        });
        
        
    });
});