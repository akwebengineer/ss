/**
 * UT for Access Profile Collection
 *
 * @module accessProfileCollectionTest
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/
define(
    ['../../models/accessProfileCollection.js',
        '../../../constants/userFirewallConstants.js'],
    function (Collection, Constants) {

        describe('Check Access Profile Collection UT', function () {
            var collection;
            before(function () {
                collection = new Collection({
                });
            });

            it('Checks if the model exist', function () {
                collection.should.exist;
                collection.jsonRoot.should.be.equal(Constants.ACCESS_PROFILE.JSON_ROOT);
            });


            it('Checks if the url is created properly', function () {
                collection.url().should.be.equal(Constants.ACCESS_PROFILE.URL_PATH);

            });

            it('Checks if the url is created properly: Filter defined', function () {
                var filter = {
                    property: 'fakeProperty',
                    modifier: 'fakeModifier',
                    value: 'fakeValue'

                }, expectedVal = Constants.ACCESS_PROFILE.URL_PATH +
                    "?filter=(fakeProperty fakeModifier 'fakeValue')";
                collection.url(filter).should.be.equal(expectedVal);
            });

        });
    });