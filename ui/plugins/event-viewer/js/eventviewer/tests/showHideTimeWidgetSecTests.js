/**
 * UT for Show/Hide section in EventViewer module
 *
 * @module showHideTimeWidget unit test
 * @author shinig
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    "../../../../event-viewer/js/eventviewer/views/eventViewer.js"
    ], function(EventViewer) {

    var activity, view, stub,
        event = {
             type: 'click',
             preventDefault: function () {},
             currentTarget: function () {}
        };

    describe("Event Viewer Show/Hide time widget section Unit Tests", function() {

        before(function(){
            activity = new Slipstream.SDK.Activity();
            activity.context = sinon.stub(activity, 'getContext', function() {
                return new Slipstream.SDK.ActivityContext();
            });

            activity.context.getMessage = function (key) {
                return key; // return as per requirement
            }

            view = new EventViewer.View({activity:activity});
        });

        after(function(){
            activity.context.restore();
        });


        it("Event Viewer view exists ?", function() {
            view.should.exist;
        });

        it("showHideTimeWidgetSection", function() {
            var ret = view.showHideTimeWidgetSection(event);
            expect(ret).to.not.be.null;
        });

    });

});