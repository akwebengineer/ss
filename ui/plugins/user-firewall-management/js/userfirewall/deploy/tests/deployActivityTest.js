/**
 * UT for Deploy Activity
 *
 * @module deploy
 * @author svaibhav
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../deployActivity.js',
    '../../../../../ui-common/js/gridActivity.js',
    '../../constants/userFirewallConstants.js'
], function (DeployActivity,Constants) {

    var deployActivity;

    describe('Deploy Activity UT', function () {
    var deployActivity;
        before(function () {
            deployActivity = new DeployActivity();
            getExtras = sinon.stub(deployActivity, 'getExtras', function(){
                return {};
                });

        });

        after(function(){
            getExtras.restore();
        });

        it('Checks if the activity object is created properly', function () {
            deployActivity.should.exist;
        });

        describe('Checks the onStart of Deploy Activity', function () {
        var getIntent,deploy;
        beforeEach(function () {
           deploy = sinon.stub(deployActivity, 'deploy');
        });

        afterEach(function(){
            getIntent.restore();
            deploy.restore();
        });

        it('Checks the onStart of Deploy Activity 0', function () {
         getIntent = sinon.stub(deployActivity, 'getIntent', function(){
                       return {data:{mime_type:'vnd.juniper.net.userfirewall.activedirectory.deploy'} };
                       });
            deployActivity.onStart();
            deploy.called.should.be.equal(true);
        });

         it('Checks the onStart of Deploy Activity 1 ', function () {
            getIntent = sinon.stub(deployActivity, 'getIntent', function(){
                return {data:{mime_type:'vnd.juniper.net.userfirewall.accessprofile.deploy'} };
                });
            deployActivity.onStart();
            deploy.called.should.be.equal(true);
         });
        });
        describe('Checks the deploy of Deploy Activity', function () {
        var buildOverlay;
         before(function () {
                    deployActivity = new DeployActivity();
                    buildOverlay = sinon.stub(deployActivity, 'buildOverlay');
                });
         after(function(){
                    buildOverlay.restore();
         });

         it('Checks the deploy of Deploy Activity 0', function () {
                deployActivity.intent = { getExtras: function(){
                }}
                deployActivity.deploy({objType:'ACTIVE_DIRECTORY',
                                       objId: '1234'});
                buildOverlay.called.should.be.equal(true);
            });
         });

    });
});