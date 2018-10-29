/**
 * UT for Active Directory Model
 *
 * @module ActiveDirectoryModelTest
 * @author tgarg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/
define(
    ['../../models/activeDirectoryModel.js',
        '../../../constants/userFirewallConstants.js'],
    function (Model, Constants) {

        describe('Check Active Directory Model UT', function () {
            var model;
            before(function () {
                model = new Model({
                });
            });

            it('Checks if the model exist', function () {
                model.should.exist;
                model.urlRoot.should.be.equal(Constants.ACTIVE_DIRECTORY.URL_PATH_MODEL);
                model.jsonRoot.should.be.equal(Constants.ACTIVE_DIRECTORY.JSON_ROOT);
                model.requestHeaders.accept.should.be.equal(Constants.ACTIVE_DIRECTORY.ACCEPT_HEADER_MODEL);
                model.requestHeaders.contentType.should.be.equal(Constants.ACTIVE_DIRECTORY.CONTENT_TYPE_MODEL);
            });
        });
    }
);
