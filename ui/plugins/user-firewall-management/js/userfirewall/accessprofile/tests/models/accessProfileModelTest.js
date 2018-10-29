/**
 * UT for Access Profile Model
 *
 * @module accessProfileModelTest
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/
define(
    ['../../models/accessProfileModel.js',
        '../../../constants/userFirewallConstants.js'],
    function (Model, Constants) {

        describe('Check Access Profil Model UT', function () {
            var model;
            before(function () {
                model = new Model({
                });
            });

            it('Checks if the model exist', function () {
                model.should.exist;
                model.urlRoot.should.be.equal(Constants.ACCESS_PROFILE.URL_PATH);
                model.jsonRoot.should.be.equal(Constants.ACCESS_PROFILE.JSON_ROOT2);
            });
        });
    }
);