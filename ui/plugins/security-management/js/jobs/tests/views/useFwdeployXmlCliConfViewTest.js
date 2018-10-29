/**
 * UT forUser Fw Deploy xml and cli conf View
 *
 * @module userFwDeployXmlCliConfView
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
        '../../views/useFwdeployXmlCliConfView.js'
    ],


    function (View) {

        describe('Check user Fw Deploy Xml/Cli View UT', function () {
            var view, context;
            before(function () {
                context = new Slipstream.SDK.ActivityContext();
                view = new View(context);
            });

            it('Checks if the View exist', function () {
                view.should.exist;
            });

            it('Checks if the configuration xml', function () {
                view.isXml = true;
                view.options = {jobId : 123};
                view.updateConfigURL();
                view.confViewUrl.should.be.equal('/api/juniper/sd/access-profile-management/job/123/config-preview');
            });

            it('Checks if the configuration is cli', function () {
                view.isXml = false;
                view.options = {jobId : 123, objType: 'accessProfile'};
                view.updateConfigURL();
                view.confViewUrl.should.be.equal('/api/juniper/sd/access-profile-management/job/123/config-preview?cli=true&feature=accessProfile');
            });
        });
    });