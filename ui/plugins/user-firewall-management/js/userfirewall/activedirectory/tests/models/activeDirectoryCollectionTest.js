/**
 * UT for Active Directory Collection
 *
 * @module ActiveDirectoryCollectionTest
 * @author tgarg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/
define(
    ['../../models/activeDirectoryCollection.js',
        '../../../constants/userFirewallConstants.js'],
    function (Collection, Constants) {

        describe('Check Active Directory Collection UT', function () {
            var collection;
            before(function () {
                collection = new Collection({
                });
            });

            it('Checks if the collection exist', function () {
                collection.should.exist;
                collection.jsonRoot.should.be.equal( Constants.ACTIVE_DIRECTORY.GRID_JSON_ROOT);
            });


            it('Checks if the url is created properly', function () {
                collection.url().should.be.equal(Constants.ACTIVE_DIRECTORY.URL_PATH);

            });

            it('Checks if the url is created properly: Filter defined', function () {
                var filter = {
                    property: 'fakeProperty',
                    modifier: 'fakeModifier',
                    value: 'fakeValue'

                }, expectedVal = Constants.ACTIVE_DIRECTORY.URL_PATH +
                    "?filter=(fakeProperty fakeModifier 'fakeValue')";
                collection.url(filter).should.be.equal(expectedVal);
            });

        });
    });
