/**
 * UT for user Fw Management Job View
 *
 * @module userFwManagementJobView
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
        '../../views/userFwManagementJobView.js'
    ],
    function (View) {

        describe('Check user Fw Management Job View UT', function () {
            var view, context,  activity = new Slipstream.SDK.Activity();
            before(function () {
                Slipstream.SDK.Intent = function(){
                    this.action ={ACTION_EXPORT:'EXPORT'};
                    this.putExtras = function(){};
                };
                context = new Slipstream.SDK.ActivityContext();
                activity.getIntent = function(){
                    return {action : "slipstream.intent.action.ACTION_CREATE"};
                };
                activity.getContext = function(){
                    return context;
                }
                view = new View({activity:activity,context:context, jobInfo:{job:123}});
                view.progressBar = {destroy: function(){}};
            });

            it('Checks if the View exist', function () {
                view.should.exist;
            });

            it('Checks for setUserFwManagementTabContents ', function () {
                view.messageView = {setMessageContentsFromRecord: function(){}};
                var setMessageContentsFromRecord = sinon.stub(view.messageView, 'setMessageContentsFromRecord'),
                    updateTabSectionTitle = sinon.stub(view, 'updateTabSectionTitle');

                view.setUserFwManagementTabContents({},{'xml-data-reply': 'test'});
                updateTabSectionTitle.called.should.be.equal(true);
                updateTabSectionTitle.restore();

                setMessageContentsFromRecord.called.should.be.equal(true);
                setMessageContentsFromRecord.restore();
            });

            it('Checks for userFwManagmentDeviceViewConf 0', function () {
                var getDeployConfig = sinon.stub(view, 'getDeployConfig');

                view.userFwManagmentDeviceViewConf({id:123, name: 'test'});
                getDeployConfig.called.should.be.equal(true);
                getDeployConfig.restore();
            });

            it('Checks for userFwManagmentDeviceViewConf 1', function () {
                view.jobsTO = {'job-type': {includes:function(){ return true}}};//"Active Directory"};
                var getDeployConfig = sinon.stub(view, 'getDeployConfig');
                view.userFwManagmentDeviceViewConf({id:123, name: 'test'});
                getDeployConfig.called.should.be.equal(true);
                getDeployConfig.restore();
            });
            it('Checks for userFwManagmentDeviceViewConf 2', function () {
                view.jobsTO = {'job-type': {includes:function(){ return false}}};//"Active Directory"};
                var getDeployConfig = sinon.stub(view, 'getDeployConfig');
                view.userFwManagmentDeviceViewConf({id:123, name: 'test'});
                getDeployConfig.called.should.be.equal(true);
                getDeployConfig.restore();
            });
            it.skip('Checks for getDeployConfig ', function () {
                var buildProgressBar = sinon.stub(view, 'buildProgressBar');
                view.getDeployConfig({deviceName: 'test', jobId: 123, objType: 'Active Directory'});
                buildProgressBar.called.should.be.equal(true);
                buildProgressBar.restore();
            });
        });
    });