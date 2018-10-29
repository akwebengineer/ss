/**
 * Unit Tests for threatMapActivity
 *
 * @module ThreatMap
 * @author Shini <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    "../threatMapActivity.js",
    "../views/threatMapView.js"
      ], function(ThreatMapActivity, ThreatMapView) {

    var threatMapActivity, context = new Slipstream.SDK.ActivityContext(), activity = new Slipstream.SDK.Activity(),
        getMessage;

    describe('Threat Map Activity UT', function () {

        before(function () {
            getMessage = sinon.stub(context, 'getMessage');
            threatMapActivity = new ThreatMapActivity();
        });

        after(function () {
            getMessage.restore();
        });

        it('Checks if the activity object is created properly', function () {
            threatMapActivity.should.exist;
        });

        it('Checks onCreate is called from the activity file', function () {
            threatMapActivity.onCreate();
        });

//        it('Checks onStart is called from the activity file', function () {
//            threatMapActivity.view = {ThreatMapView: function(){console.log('ThreatMapView');}}
//            sinon.spy(threatMapActivity.view, "ThreatMapView");
//
//            threatMapActivity.onStart();
//            threatMapActivity.view.ThreatMapView.calledOnce.should.be.equal(true);
//        });

        it('Checks onDestroy is called from activity', function () {
            threatMapActivity.onDestroy();
        });

    });

});