/**
 * UT for Threat Management Policy constants
 *
 * @module threatPolicyConstantsTest
 * @author tgarg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/
define(
    ['../../constants/threatManagementPolicyConstants.js'],
    function (Constants) {

        describe('Check Threat Management Policy Constants UT', function () {
            var constants;
            before(function () {
                constants = Constants;
            });

            it('Checks if the constants exist', function () {
                constants.should.exist;
            });

            it('Checks collection constants', function () {
                constants.TMP_FETCH_URL.should.be.equal('/api/juniper/sd/policy-management/threat-policy-management/threat-policies');
                constants.TMP_ACCEPT_HEADER.should.be.equal('application/vnd.sd.policy-management.threat-policy-management.threat-policies+json;version=4;q=0.04');
                constants.TMP_JSON_ROOT.should.be.equal('threat-policies.threat-policy');
            });

            it('Checks model constants', function () {
                constants.TMP_FETCH_CONTENT_TYPE_HEADER.should.be.equal("application/vnd.sd.policy-management.threat-policy-management.threat-policy-ref+json;version=4;charset=UTF-8");
                constants.TMP_FETCH_ACCEPT_HEADER.should.be.equal("application/vnd.sd.policy-management.threat-policy-management.threat-policy+json;version=4;q=0.04");
            });
        });

    });
