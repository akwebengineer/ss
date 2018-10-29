define([
    "../models/schedulerModel.js",
    "../models/schedulerCollection.js"
], function(schedulerModel, schedulerCollection){
    describe("FW Scheduler model Unit Tests", function() {
        it("should exist scheduler model object", function() {
            var model = new schedulerModel();
            model.should.exist;
        });
    });

    describe("FW Scheduler model collection Unit Tests", function() {
        var baseURL = "/api/juniper/sd/scheduler-management/schedulers";
        var collection;
        //models and collections
        it("should exist scheduler collection object", function() {
            collection = new schedulerCollection();
            collection.should.exist;
        });
        it("should return base url if filter is undefined", function() {
            var filter = undefined;
            var result = collection.url(filter);
            expect(result).to.be.equal(baseURL);
        });
        it("should return url with sepecified filter", function() {
            var filter = {
                    property: "name",
                    modifier: "eq",
                    value: "demo_test"
            };
            var result = collection.url(filter);
            expect(result).to.be.equal(baseURL+"?filter=(name eq 'demo_test')");
        });
    });
});