/**
 * UT for Threat Management Policy Model
 *
 * @module threatPolicyModelTest
 * @author tgarg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/
define(
    ['../../models/threatPolicyModel.js',
        '../../constants/threatManagementPolicyConstants.js'],
    function (Model, Constants) {

        describe('Check Threat Management Policy Model UT', function () {
            var model;
            before(function () {
                model = new Model({
                });
            });

            it('Checks if the model exist', function () {
                model.should.exist;
                model.urlRoot.should.be.equal(Constants.TMP_FETCH_URL);
                model.jsonRoot.should.be.equal("threat-policy");
            });
        });
    }
);
