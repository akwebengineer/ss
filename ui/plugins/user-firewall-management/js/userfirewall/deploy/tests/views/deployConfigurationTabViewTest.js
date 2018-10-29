/**
 * UT for Deploy Config Tab View
 *
 * @module deploy
 * @author svaibhav
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../views/deployConfigurationTabView.js'
], function (DeployConfigurationTabView ) {

    var view,getMessage,context = new Slipstream.SDK.ActivityContext();

    describe('Deploy Configuration Tab View UT', function () {
       before(function () {
        getMessage = sinon.stub(context, 'getMessage');
        view = new DeployConfigurationTabView({
                                             context: context,
                                             isXml: true,
                                             objId:'1234',
                                             objType: 'ACTIVE_DIRECTORY'
                                        });

        });

        after(function () {
        getMessage.restore();
        });

        it('Checks if the Deploy Configuration Tab View object is created properly', function () {
            view.should.exist;
        });
        it('Checks updateConfigURL of Deploy Configuration Tab View 0', function () {
            view.updateTabs();
        });

    });
});