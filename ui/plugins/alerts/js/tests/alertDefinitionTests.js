define([
    "../../../alerts/js/models/alertsModel.js"
    ], function(AlertModel) {

    //
    describe("Alert Definition unit test cases", function(){

        var activity, stub, stub2;
        before(function() {

            activity = new Slipstream.SDK.Activity();

            stub = sinon.stub(activity, 'getContext', function() {
                return new Slipstream.SDK.ActivityContext();
            });
            stub2 = sinon.stub(activity, 'getIntent', function() {
                return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE);
            });

        });

        after(function() {
            stub.restore();
            stub2.restore();
        });

        describe("Alert Definition Model test", function() {
            describe("Alert Model instantiation", function() {
                var model = new AlertModel();
                it("model should exist", function() {
                    model.should.exist;
                });
            });
        });
    });
    //
});