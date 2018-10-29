define([
    '../models/zoneSetModel.js',
    '../models/zoneSetCollection.js'
], function(ZoneSetModel, ZoneSetCollection) {

    describe("ZoneSet Models and Collections unit-tests", function() {
        var baseUrl = "/api/juniper/sd/zoneset-management/zone-sets";
        describe("ZoneSetModel instantiation", function() {
            it("model should exist", function() {
                var model = new ZoneSetModel();
                model.should.exist;
            });

            it("model should have specified urlRoot", function() {
                var model = new ZoneSetModel();
                model.urlRoot.should.equal(baseUrl);
            });

            it("toJSON should serialize zones array into string", function() {
                var model = new ZoneSetModel();
                model.set("zones", [{label: "zone1", value: "zone1"}, {label: "zone2", value: "zone2"}]);
                model.set("name", "fortest");
                var result = model.toJSON();
                console.log(result);
                result["zone-set"]["name"].should.equal("fortest");
                result["zone-set"]["zones"].should.equal("zone1,zone2");
            });

            it("parse should parse zones string into zone objects array", function() {
                var model = new ZoneSetModel();
                var response = {
                        zones: "zone1,zone2,zone3"
                };
                var result = model.parse(response);
                result.zones.should.be.instanceOf(Array);
                result.zones.should.have.lengthOf(3);
                result.zones[0].label.should.equal("zone1");
                result.zones[0].value.should.equal("zone1");
            });
        });

        describe("ZoneSetCollection instantiation", function() {
            it("collection should exist", function() {
                var collection = new ZoneSetCollection();
                collection.should.exist;
            });
            it("function url should return baseUrl when param is empty", function() {
                var collection = new ZoneSetCollection();
                var url = collection.url();
                url.should.equal(baseUrl);
            });
            it("function url should return Url with filter when param is not empty", function() {
                var collection = new ZoneSetCollection();
                var filter = {
                        property: "name",
                        modifier: "eq",
                        value: "fortest"
                }
                var url = collection.url(filter);
                url.should.equal(baseUrl+"?filter=(name eq 'fortest')");
            });
        });

    });
});