define(
    ['../../models/managedServicesCollection.js'],
    function (Collection) {

        describe('Check Managed Service collection UT', function () {
            var collection, UUID = 'fakeUUID';
            before(function () {
                collection = new Collection({
                    uuid: UUID
                });
            });

            it('Checks if the collection exist', function () {
                collection.should.exist;
                collection.url.should.be.equal("/api/juniper/sd/policy-management/import/managed-services?uuid=" + UUID);
                collection.jsonRoot.should.be.equal("managed-services");
            });
        });
    }
);
