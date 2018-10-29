/**
 * Unit Tests for Top IP Addresses view
 *
 * @module ThreatMap
 * @author Shini <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */


define([
    "../views/topIPAddressesView.js",
    '../models/RequestConfig.js',
    '../models/CountryDetailsModel.js'
      ], function(TopIPAddressesView, RequestConfig, CountryDetailsModel) {

    var view, context = new Slipstream.SDK.ActivityContext(), activity = new Slipstream.SDK.Activity(),
        getMessage, timeRange = {
            startTime: {toJSON: function(){ return "2016-08-21T18:30:00.000Z"; }},//"2016-08-09T18:30:00.000Z",
            endTime: {toJSON: function(){ return "2016-08-22T10:18:21.000Z"; }} //"2016-08-10T06:17:05.000Z"
        },
        startTime = "2016-08-09T18:30:00.000Z",
        endTime = "2016-08-10T06:17:05.000Z", countryCode = "CA";
        context.startActivityForResult = function(){};
        activity["context"] = context;

    describe("Top IP Addresses Grid View UT", function () {
        var model = {}, flag = "OUTBOUND", title = "Top 5 IP Addresses Outbound";

        model.countryDetails = new CountryDetailsModel();
        model.countryDetails.set({startTime: {toJSON: function(){ return "2016-08-21T18:30:00.000Z"; }}});
        model.countryDetails.set({endTime:  {toJSON: function(){ return "2016-08-22T10:18:21.000Z"; }}});
        before(function () {
            view = new TopIPAddressesView({
                context: context,
                activity: activity,
                flag: flag,
                title: title,
                model: model,
                tableId: 'outbound-grid-config',
                customButtonKey: 'Block',
                isRightPanel: false
            });
            getMessage = sinon.stub(context, 'getMessage');

            $.mockjax({
                url: "/api/juniper/ecm/log-scoop/aggregate",
                type: 'POST',
                status: 200,
                contentType: 'application/json',
                dataType: 'json',
                responseText: true
            });
        });
        after(function() {
           getMessage.restore();
        });

        it('Checks if the Top IP Addresses Grid view object is created properly', function () {
            view.should.exist;
        });

        it('Checks Top IP Addresses view rendered', function () {
            var buildIPAddressesGrid = sinon.stub(view, "buildIPAddressesGrid", function() { return true;});
            view.render();

            buildIPAddressesGrid.calledOnce.should.be.equal(true);
            buildIPAddressesGrid.restore();
        });

        describe('Top IP Addresses Grid view ', function () {
            var bindGridEvents, toJSON, FILTER_TEMPLATE;
            before(function () {
                bindGridEvents = sinon.stub(view, 'bindGridEvents');
                FILTER_TEMPLATE = sinon.stub(RequestConfig, 'FILTER_TEMPLATE', function() {return true;});
            });

            after(function () {
                bindGridEvents.restore();
                FILTER_TEMPLATE.restore();
            });
            it('Checks buildIPAddressesGrid for OUTBOUND IP(s)', function () {
                var result = view.buildIPAddressesGrid();
                bindGridEvents.called.should.be.equal(true);
                FILTER_TEMPLATE.called.should.be.equal(true);
            });
        });

        describe('Top IP Addresses Grid view ', function () {
            var off, on;
            before(function () {
                off = sinon.stub(view.$el, 'off', function() {return {on: function(val){return val;}}});
            });

            after(function () {
                off.restore();
            });
            it('Checks bindGridEvents', function () {
               view.bindGridEvents();
               off.called.should.be.equal(true);
            });
        });

        describe('Block IP Address action button', function () {
            var event,
                selectedObj = {
                    "selectedRows": []
                },
                request = {
                    input: [],
                    activity: activity
                } ;
            before(function(){
                event = { type: 'click'};
                selectedObj.selectedRows.push({"key": "14.0.0.1", "value": 15457});
                selectedObj.selectedRows.push({"key": "1.1.1.1", "value": 3865});
            });
            after(function(){
                //
            });
            it('Checks onBlockIPAddress for OUTBOUND flag', function() {
                view.timeRange = {
                    startTime: {toJSON: function(){ return "2016-08-21T18:30:00.000Z"; }},
                    endTime: {toJSON: function(){ return "2016-08-22T10:18:21.000Z"; }}
                };
                view.onBlockIPAddress(event, selectedObj);
            })
        });

    });

    describe.skip('Top IP Addresses Grid view ', function () {
        var model = {}, flag = "INBOUND", title = "Top 5 IP Addresses Inbound",
            FILTER_TEMPLATE;
        model.countryDetails = new CountryDetailsModel();
        model.countryDetails.set({startTime: {toJSON: function(){ return "2016-08-21T18:30:00.000Z"; }}});
        model.countryDetails.set({endTime:  {toJSON: function(){ return "2016-08-22T10:18:21.000Z"; }}});

        before(function () {
            view = new TopIPAddressesView({
                context: context,
                activity: activity,
                flag: flag,
                title: title,
                model: model,
                tableId: 'inbound-grid-config',
                customButtonKey: 'Block',
                isRightPanel: false
            });

            bindGridEvents = sinon.stub(view, 'bindGridEvents');
            FILTER_TEMPLATE = sinon.stub(RequestConfig, 'FILTER_TEMPLATE', function() {return true;});
        });

        after(function () {
            bindGridEvents.restore();
            FILTER_TEMPLATE.restore();
        });
        it('Checks buildIPAddressesGrid for INBOUND IP(s)', function () {
            view.buildIPAddressesGrid();
            bindGridEvents.called.should.be.equal(true);
            FILTER_TEMPLATE.called.should.be.equal(true);
        });

        describe('Block IP Address action button', function () {
            var event,
                selectedObj = {
                    "selectedRows": []
                },
                request = {
                    input: [],
                    activity: activity
                };

            before(function(){
                event = { type: 'click'};
                selectedObj.selectedRows.push({"key": "14.0.0.1", "value": 15457});
                selectedObj.selectedRows.push({"key": "1.1.1.1", "value": 3865});
            });
            after(function(){
            //
            });
            it('Checks onBlockIPAddress for INBOUND flag', function() {
                view.onBlockIPAddress(event, selectedObj);
            })
        });

       /* it('Check is reloadGrid getting called, when user clicks on View All', function() {
            view.reloadGrid(event)
        }); */

    });

    describe.skip('Top IP Addresses Grid view ', function () {
        var  model = {}, bindGridEvents, flag = "NODATA", title = "Top 5 IP Addresses (Inbound/Outbound)",
            FILTER_TEMPLATE;
        model.countryDetails = new CountryDetailsModel();
        model.countryDetails.set({startTime: {toJSON: function(){ return "2016-08-21T18:30:00.000Z"; }}});
        model.countryDetails.set({endTime:  {toJSON: function(){ return "2016-08-22T10:18:21.000Z"; }}});

        before(function () {
            view = new TopIPAddressesView({
                context: context,
                activity: activity,
                model: model,
                flag: flag,
                title: title,
                tableId: 'nodata-grid-config',
                customButtonKey: 'Block',
                isRightPanel: false
            });

            bindGridEvents = sinon.stub(view, 'bindGridEvents', function() {return true;});
            FILTER_TEMPLATE = sinon.stub(RequestConfig, 'FILTER_TEMPLATE', function() {return true;});

        });

        after(function () {
            bindGridEvents.restore();
            FILTER_TEMPLATE.restore();
        });
        it('Checks buildIPAddressesGrid for NODATA', function () {
            view.buildIPAddressesGrid();
            bindGridEvents.called.should.be.equal(true);
            FILTER_TEMPLATE.called.should.be.equal(true);
        });
    });

});


