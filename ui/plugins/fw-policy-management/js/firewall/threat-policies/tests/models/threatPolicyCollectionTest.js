/**
 * UT for Threat Management Policy Collection
 *
 * @module ThreatManagementPolicyCollectionTest
 * @author tgarg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/
define(
    ['../../models/threatPolicyCollection.js',
        '../../constants/threatManagementPolicyConstants.js'],
    function (Collection, Constants) {

        describe('Check Threat Management Policy Collection UT', function () {
            var collection;
            before(function () {
                collection = new Collection({
                });
            });

            it('Checks if the model exist', function () {
                collection.should.exist;
                collection.jsonRoot.should.be.equal(Constants.TMP_JSON_ROOT);
            });


            it('Checks if the url is created properly', function () {
                collection.url().should.be.equal(Constants.TMP_FETCH_URL);

            });

            it('Checks if the url is created properly: Filter defined', function () {
                var filter = {
                    property: 'fakeProperty',
                    modifier: 'fakeModifier',
                    value: 'fakeValue'

                }, expectedVal = Constants.TMP_FETCH_URL +
                    "?filter=(fakeProperty fakeModifier 'fakeValue')";
                collection.url(filter).should.be.equal(expectedVal);
            });

        });
    });