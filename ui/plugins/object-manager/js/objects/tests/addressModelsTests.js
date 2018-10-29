define([
    '../models/addressCollection.js',
    '../models/addressModel.js',
    '../models/addressDnsModel.js',
    '../models/addressListBuilderModel.js',
    '../models/addressReplaceModel.js',
    '../models/duplicatedAddressesMergeModel.js',
    '../models/addressImportModel.js'
], function(AddressCollection, AddressModel, AddressDNSModel,
    AddressListBuilderModel, AddressReplaceModel, DuplicateAddressMergeModel,
    AddressImportModel) {

    describe("Address related Models and collections Unit Test", function() {
        describe("AddressCollection Unit Tests", function() {
            var baseURL = "/api/juniper/sd/address-management/addresses";
            it("should construct addressCollection object correctly", function() {
                var collection = new AddressCollection();
                collection.should.exist;
            });

            it("function url should return base url with empty param", function() {
                var collection = new AddressCollection();
                var result = collection.url();
                result.should.equal(baseURL);
            });
            it("function url should return url with filter when param is string", function() {
                var collection = new AddressCollection();
                var result = collection.url("name eq 'test'");
                result.should.equal(baseURL+"?filter=(name eq 'test')");
            });
            it("function url should return url with filter when param is object", function() {
                var collection = new AddressCollection();
                var filter = {
                        property: "type",
                        modifier: "ne",
                        value: "addressgroups"
                }
                var result = collection.url(filter);
                result.should.equal(baseURL+"?filter=(type ne 'addressgroups')");
            });
            it("function url should return base url when param is empty array", function() {
                var collection = new AddressCollection();
                var filter = []
                var result = collection.url(filter);
                result.should.equal(baseURL);
            });
            it("function url should return base url with filter when param is non-empty array", function() {
                var collection = new AddressCollection();
                var filter = [{
                        property: "type",
                        modifier: "ne",
                        value: "addressgroups"
                    }, {
                        property: "name",
                        modifier: "eq",
                        value: "test"
                    }];
                var result = collection.url(filter);
                result.should.equal(baseURL+"?filter=(type ne 'addressgroups' and name eq 'test')");
            });
        });

        describe("AddressModel Unit Tests", function() {
            it("should construct addressModel object correctly", function() {
                var model = new AddressModel();
                model.should.exist;
            });

            it("addressModel should have 'definition-type' with value 'CUSTOM'", function() {
                var model = new AddressModel();
                model.get("definition-type").should.equal("CUSTOM");
            });
        });

        describe("addressDNSModel Unit Tests", function() {
            it("should construct AddressDNSModel object correctly", function() {
                var model = new AddressDNSModel();
                model.should.exist;
            });

            it("addressDNSModel should have urlRoot with '/dns'", function() {
                var model = new AddressDNSModel();
                model.urlRoot.should.equal("/api/juniper/sd/address-management/addresses/dns-lookUp");
            });
        });

        describe("addressReplaceModel Unit Tests", function() {
            it("should construct AddressReplaceModel object correctly", function() {
                var model = new AddressReplaceModel();
                model.should.exist;
            });

            it("addressReplaceModel should have urlRoot with '/replace'", function() {
                var model = new AddressReplaceModel();
                model.urlRoot.should.equal("/api/juniper/sd/address-management/addresses/replace");
            });
        });

        describe("addressImportModel Unit Tests", function() {
            it("should construct AddressImportModel object correctly", function() {
                var model = new AddressImportModel();
                model.should.exist;
            });

            it("addressImportModel should have urlRoot with '/import'", function() {
                var model = new AddressImportModel();
                model.urlRoot.should.equal("/api/juniper/sd/address-management/addresses/import-address-csv");
            });
        });

        describe("duplicatedAddressesMergeModel Unit Tests", function() {
            it("should construct duplicatedAddressesMergeModel object correctly", function() {
                var model = new DuplicateAddressMergeModel();
                model.should.exist;
            });

            it("duplicatedAddressesMergeModel should have urlRoot with '/import'", function() {
                var model = new DuplicateAddressMergeModel();
                model.urlRoot.should.equal("/api/juniper/sd/address-management/addresses/merge");
            });
        });

        describe("addressListBuilderModel Unit Tests", function() {
            beforeEach(function() {
                $.mockjax.clear();
            })
            it("should construct addressListBuilderModel object correctly", function() {
                var model = new AddressListBuilderModel();
                model.should.exist;
            });

            it("addressListBuilderModel should have baseUrl", function() {
                var model = new AddressListBuilderModel();
                model.baseUrl.should.equal("/api/juniper/sd/address-management/item-selector/");
            });
            it("should invoke onsuccess funtion when fetch succeed", function(done) {
                var model = new AddressListBuilderModel();
                var onsuccess = sinon.spy();
                $.mockjax({
                    url: "/api/juniper/sd/address-management/addresses/100001",
                    type: "GET",
                    responseTime: 100,
                    responseText: true
                });
                model.fetchById("100001", onsuccess);
                setTimeout(function() {
                    onsuccess.calledOnce.should.be.true;
                    done();
                }, 200)
            });
            it("should invoke console.log when fetch error", function(done) {
                var model = new AddressListBuilderModel();
                sinon.spy(console, "log");
                model.fetchById("100001");
                setTimeout(function() {
                    console.log.calledOnce.should.be.true;
                    console.log.calledWith("Failed to fetch address").should.be.true;
                    console.log.restore();
                    done();
                }, 200);
            });
        });

    });
});