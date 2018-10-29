/**
 * Unit Tests for Country Details View
 *
 * @module ThreatMap
 * @author Shini <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */


define([
    "../views/countryDetailsView.js",
    '../models/CountryDetailsModel.js'
      ], function(CountryDetailsView, CountryDetailsModel) {

    var model = {}, view, context = new Slipstream.SDK.ActivityContext(), activity = new Slipstream.SDK.Activity(),
            getMessage;

    describe("Country Details view UT", function () {
        var flag = "OUTBOUND", title = "Top 5 IP Addresses Outbound",
            geoJsonFeature = {
                properties: {
                    name:"United States",
                    iso_a2:"US"
                }
            };
        model.countryDetails = new CountryDetailsModel();
        model.countryDetails.set({startTime: {toJSON: function(){ return "2016-08-21T18:30:00.000Z"; }}});
        model.countryDetails.set({endTime:  {toJSON: function(){ return "2016-08-22T10:18:21.000Z"; }}});
        before(function () {
            view = new CountryDetailsView({
                context: context,
                activity: activity,
                model: model,
                geoJsonFeature: geoJsonFeature
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
        it('Checks if the Country Details view object is created properly', function () {
            view.should.exist;
        });

        it('Checks if the Country Details view rendered ?', function () {
            var request = {
                pollInterval: 30 * 1000,
                countryName: geoJsonFeature.properties.name,
                countryCode:geoJsonFeature.properties.iso_a2.toUpperCase()
            },
            fetch = sinon.stub(view.model.countryDetails, "fetch", function(request) {return true;});

            view.render();
            fetch.called.should.be.equal(true);
            fetch.restore();
        });

       /* it('Checks Country Details sync method is called - NO DATA ?', function () {
            view.modelSyncFn();
        }); */

        it('Checks Country Details sync method is called - Outbound ?', function () {
            var countryDetailsObj = {
                "countryCode": "CN",
                "countryName": "China",
                "dstTotalCount": 0,
                "flagCode": "cn",
                "srcTotalCount": 2,
                "totalCount": 2,
                "viewType": "view-source-country"
            },
            srcTotalCount = 1012, dstTotalCount = 20,
            inboundFlag = "INBOUND", outboundFlag = "OUTBOUND",
            toJson = sinon.stub(view.model.countryDetails, "toJSON", function() {
                return countryDetailsObj;
            }),
//            updatedConf = _.extend(view.threatMapConf, view.model.countryDetails.toJson),
            getTheStatus = sinon.stub(view, "getTheStatus", function() {}),
            getTopIPAddressView =  sinon.stub(view, 'getTopIPAddressView', function(){
                return {render: function(){ return {el:{}}}}
            });

            view.modelSyncFn();
            toJson.called.should.be.equal(true);
            getTheStatus.called.should.be.equal(true);
            getTopIPAddressView.called.should.be.equal(true);

            toJson.restore();
            getTheStatus.restore();
            getTopIPAddressView.restore();
        });

        it('Checks Country Details sync method is called - Inbound ?', function () {
            var countryDetailsObj = {
                "countryCode": "US",
                "countryName": "United States",
                "dstTotalCount": 4500,
                "flagCode": "us",
                "srcTotalCount": 2,
                "totalCount": 4502,
                "viewType": "view-destination-country"
            },
            srcTotalCount = 1012, dstTotalCount = 20,
            inboundFlag = "INBOUND", outboundFlag = "OUTBOUND",
            toJson = sinon.stub(view.model.countryDetails, "toJSON", function() {
                return countryDetailsObj;
            }),
//            updatedConf = _.extend(view.threatMapConf, view.model.countryDetails.toJson),
            getTheStatus = sinon.stub(view, "getTheStatus", function() {}),
            getTopIPAddressView =  sinon.stub(view, 'getTopIPAddressView', function(){
                return {render: function(){return {el:{}}}}
            });

            view.modelSyncFn();
            toJson.called.should.be.equal(true);
            getTheStatus.called.should.be.equal(true);
            getTopIPAddressView.called.should.be.equal(true);

            toJson.restore();
            getTheStatus.restore();
            getTopIPAddressView.restore();
        });

        it('Checks Country Details sync method is called - Unknown ?', function () {
            var countryDetailsObj = {
                "countryCode": "QQ",
                "countryName": "Unknown Geo IP Location",
                "dstTotalCount": 20930,
                "flagCode": "qq",
                "srcTotalCount": 20930,
                "totalCount": 41860,
                "viewType": "view-destination-country"
            },
            srcTotalCount = 1012, dstTotalCount = 20,
            inboundFlag = "INBOUND", outboundFlag = "OUTBOUND",
            toJson = sinon.stub(view.model.countryDetails, "toJSON", function() {
                return countryDetailsObj;
            }),
//            updatedConf = _.extend(view.threatMapConf, view.model.countryDetails.toJson),
            getTheStatus = sinon.stub(view, "getTheStatus", function() {}),
            getTopIPAddressView =  sinon.stub(view, 'getTopIPAddressView', function(){
                return {render: function(){return {el:{}}}}
            });

            view.modelSyncFn();
            toJson.called.should.be.equal(true);
            getTheStatus.called.should.be.equal(true);
            getTopIPAddressView.called.should.be.equal(true);

            toJson.restore();
            getTheStatus.restore();
            getTopIPAddressView.restore();
        });

    });

    describe("Country Details view UT for Unknown", function () {
        var flag = "INBOUND", title = "Top 5 IP Addresses Inbound",
            model = {},
            geoJsonFeature = {
                properties: {
                    name: "Unknown Geo IP Location",
                    iso_a2:"qq"
                }
            };
            model.countryDetails = new CountryDetailsModel();
            model.countryDetails.set({startTime: {toJSON: function(){ return "2016-08-21T18:30:00.000Z"; }}});
            model.countryDetails.set({endTime:  {toJSON: function(){ return "2016-08-22T10:18:21.000Z"; }}});
        before(function () {
            view = new CountryDetailsView({
                context: context,
                activity: activity,
                model: model,
                geoJsonFeature: geoJsonFeature
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

        it('Checks if the Country Details view rendered ?', function () {
            var request = {
                now: new Date(),
                pollInterval: 30 * 1000,
                countryName: geoJsonFeature.properties.name,
                countryCode:geoJsonFeature.properties.iso_a2.toUpperCase()
            },
            fetch = sinon.stub(view.model.countryDetails, "fetch"),
            on = sinon.stub(view.model.countryDetails, "on");
            view.render();
            fetch.called.should.be.equal(true);
            on.called.should.be.equal(true);

            fetch.restore();
            on.restore();
        });


        it('Checks Country Details sync method is called - Unknown ?', function () {
            var countryDetailsObj = {
                "countryCode": "QQ",
                "countryName": "Unknown Geo IP Location",
                "dstTotalCount": 20930,
                "flagCode": "qq",
                "srcTotalCount": 20930,
                "totalCount": 41860,
                "viewType": "view-destination-country"
            },
            srcTotalCount = 1012, dstTotalCount = 20,
            inboundFlag = "INBOUND", outboundFlag = "OUTBOUND",
            toJson = sinon.stub(view.model.countryDetails, "toJSON", function() {
                return countryDetailsObj;
            }),
//            updatedConf = _.extend(view.threatMapConf, view.model.countryDetails.toJson),
            getTheStatus = sinon.stub(view, "getTheStatus", function() {}),
            getTopIPAddressView =  sinon.stub(view, 'getTopIPAddressView', function(){
                return {render: function(){return {el:{}}}}
            });

            view.modelSyncFn();
            toJson.called.should.be.equal(true);
            getTheStatus.called.should.be.equal(true);
            getTopIPAddressView.called.should.be.equal(true);

            toJson.restore();
            getTheStatus.restore();
            getTopIPAddressView.restore();
        });

    });

});
