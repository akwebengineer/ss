/**
 * Unit Tests for Right Panel View
 *
 * @module ThreatMap
 * @author Shini <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */


define([
    "../views/rightPanelView.js",
    '../models/CountryDetailsModel.js',
    '../models/RightPanelModel.js',
    '../models/UnknownCountryDetailsModel.js'
    ], function(RightPanelView, CountryDetailsModel, RightPanelModel, UnknownCountryDetailsModel) {

    var view, context = new Slipstream.SDK.ActivityContext(), activity = new Slipstream.SDK.Activity(),
        getMessage;

    describe("Right Panel view UT", function () {
        var model = {},
            timeRange = {
                startTime: {toJSON: function(){ return "2016-08-21T18:30:00.000Z"; }},
                endTime: {toJSON: function(){ return "2016-08-22T10:18:21.000Z"; }}
            },
            el = '<div class="right-panel-container"><div class="childPanel"></div></div>',
            e = {
                 type: 'click',
                 preventDefault: function() {},
                 currentTarget: '<div class="show-grid-section"></div>'
            };

        model.countryDetails = new CountryDetailsModel();
        model.rightPanel = new RightPanelModel();

        before(function () {
            view = new RightPanelView({
                context: context,
                activity: activity,
                model: model,
                el: el
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

        it('Checks if the Right Panel view object is created properly', function () {
            view.should.exist;
        });

        it("Checks Model exists ?", function() {
            view.model.should.exist;
        });

        it('Checks if the Right Panel view rendered ?', function () {
            view.el = {append: function(){console.log('append');}}
            sinon.spy(view.el, "append");
            var addGridView = sinon.stub(view, "addGridView", function() {
                return true;
            }),
            geoJsonFeature = {
                properties: {
                    name:"United States",
                    iso_a2:"US"
                }
            },
            request = {
                now: new Date(),
                pollInterval: 30 * 1000,
                countryName: geoJsonFeature.properties.name,
                countryCode:geoJsonFeature.properties.iso_a2.toUpperCase()
            },
            fetch = sinon.stub(model.rightPanel, "fetch");

            view.render();
            view.el.append.calledOnce.should.be.equal(true);
            view.addGridView.calledOnce.should.be.equal(true);
            fetch.calledOnce.should.be.equal(true);

            view.addGridView.restore();
            fetch.restore();
        });

        it('Checks addGridView is called from view ', function () {
            var setLayout = sinon.stub(view, "setLayout", function(){}),
                getTopIPAddressView =  sinon.stub(view, 'getTopIPAddressView', function(){
                    return {render: function(){}}
                });

            view.addGridView();
            setLayout.called.should.be.equal(true);
            getTopIPAddressView.called.should.be.equal(true);

            setLayout.restore();
            getTopIPAddressView.restore();
        });
        it('Checks getTopIPAddressView is called from view ', function () {
            var flag = "INBOUND", title = "Top 5 Inbound IP Addresses", tableId = "inbound-grid-config";
            view.getTopIPAddressView(flag, title, tableId);
        });

        it('Checks onRightPanelModelSync is getting called ', function() {
            var get = sinon.stub(view.model.rightPanel, "get", function() {
                return {toLocaleString: function() {}, toLocaleTimeString: function() {}, };
            }),
            srcTotalCount = 10, dstTotalCount = 2020,
            getTheStatus = sinon.stub(view, "getTheStatus", function(srcTotalCount, dstTotalCount) {});

            view.onRightPanelModelSync();
            get.called.should.be.equal(true);
            getTheStatus.called.should.be.equal(true);
            get.restore();
            getTheStatus.restore();
        });

        it('Checks showHideInboundGrid is getting called om click of Top Inbound ', function() {
            view.showHideInboundGrid(e);
        });

        it('Checks showHideOutboundGrid is getting called on click of Top Outbound ', function() {
            view.showHideOutboundGrid(e);
        });

        it('Checks right panel view is getting removed on click of close', function() {
            view.closeRightPanel(e);
        });

        it('Checks setLayout is getting called', function() {
            view.setLayout();
        });


    });


    describe("Right Panel view UT for Unknown", function () {
        var model = {},
            timeRange = {
                startTime: {toJSON: function(){ return "2016-08-21T18:30:00.000Z"; }},
                endTime: {toJSON: function(){ return "2016-08-22T10:18:21.000Z"; }}
            },
            el = '<div class="right-panel-container"><div class="childPanel"></div></div>',
            e = {
                 type: 'click',
                 preventDefault: function() {},
                 currentTarget: '<div></div>'
            };

        model.countryDetails = new CountryDetailsModel();
        model.rightPanel = new RightPanelModel();
        model.countryDetails.set({
            "countryCode": "QQ",
            "countryName": "Unknown Geo IP Location",
            "dstTotalCount": 20930,
            "flagCode": "qq",
            "srcTotalCount": 20930,
            "totalCount": 41860
        });

        before(function () {
            view = new RightPanelView({
                context: context,
                activity: activity,
                model: model,
                timeRange: timeRange,
                el: el,
                now: new Date()
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

        it('Checks if the Right Panel view object is created properly', function () {
            view.should.exist;
        });

        it('Checks if the Right Panel view rendered ?', function () {
            view.el = {append: function(){console.log('append');}}
            sinon.spy(view.el, "append");
            var addGridView = sinon.stub(view, "addGridView", function() {
                return true;
            }),
            geoJsonFeature = {
                properties: {
                    name:"Unknown Geo IP Location",
                    iso_a2:"QQ"
                }
            },
            request = {
                now: new Date(),
                pollInterval: 30 * 1000,
                countryName: geoJsonFeature.properties.name,
                countryCode:geoJsonFeature.properties.iso_a2.toUpperCase()
            },
            fetch = sinon.stub(model.rightPanel, "fetch");

            view.render();
            view.el.append.calledOnce.should.be.equal(true);
            view.addGridView.calledOnce.should.be.equal(true);
            fetch.calledOnce.should.be.equal(true);

            view.addGridView.restore();
            fetch.restore();
        });

        it('Checks showHideInboundGrid is getting called om click of Top Inbound ', function() {
            view.showHideInboundGrid(e);
        });

        it('Checks showHideOutboundGrid is getting called on click of Top Outbound ', function() {
            view.showHideOutboundGrid(e);
        });

    });


});