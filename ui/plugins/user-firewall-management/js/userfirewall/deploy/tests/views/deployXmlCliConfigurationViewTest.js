/**
 * UT for Deploy Xml Cli Config View
 *
 * @module deploy
 * @author svaibhav
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../views/deployXmlCliConfigurationView.js'
], function (DeployXmlCliConfigView ) {

    var view ;

    describe('Deploy Xml Cli Config View UT', function () {

        it('Checks if the Deploy Xml Cli Config View object is created properly', function () {
        view = new DeployXmlCliConfigView({
                                         isXml: false,
                                              objId:'1234',
                                              objType: 'ACTIVE_DIRECTORY'
                                         });
            view.should.exist;
             view.confViewUrl.should.be.equal("/api/juniper/sd/active-directory-management/active-directory-configs/1234?cli=true");
        });
        it('Checks updateConfigURL 0', function () {
                 view = new DeployXmlCliConfigView({
                                           isXml: true,
                                                objId:'1234',
                                                objType: 'ACTIVE_DIRECTORY'
                                           });
            view.updateConfigURL();
            view.confViewUrl.should.be.equal("/api/juniper/sd/active-directory-management/active-directory-configs/1234");
        });

    });
});