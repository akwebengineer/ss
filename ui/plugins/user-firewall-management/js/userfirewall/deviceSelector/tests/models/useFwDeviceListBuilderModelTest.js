/**
 * UT for Access Profile useFwDeviceListBuilderModel
 *
 * @module useFwDeviceListBuilderModelTest
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/
define(
    ['../../models/useFwDeviceListBuilderModel.js'],
    function (Model) {

        describe('Check Access Profil assign device  UT', function () {
            var model;
            before(function () {
                model = new Model({
                });
            });

            it('Checks if the model exist', function () {
                model.should.exist;
                model.baseUrl.should.be.equal('/api/juniper/sd/active-directory-management/devices/item-selector/');
            });
        });
    }
);