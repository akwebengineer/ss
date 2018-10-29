/**
 * Unit Tests for Country Details View
 *
 * @module ThreatMap
 * @author Shini <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */


define([
    "../../conf/topIpAddressesGridConfig.js"
      ], function(GridConfiguration) {

    describe('Top Inbound/Outbound IP Addresses Grid Configuration UT', function () {
        var conf, values, context, title, requestObj, tableId, customButtonLabel, view;
        before(function () {
            context = new Slipstream.SDK.ActivityContext();
            getMessage = sinon.stub(context, 'getMessage');
            title = "Top 5 Inbound IP Addresses";
            requestObj = {"request":{"time-interval":"2016-08-18T18:30:00Z/2016-08-19T12:31:17Z","aggregation":"COUNT","aggregation-attributes":["source-address"],"size":5,"slot":1,"order":"ascending","filters":{"or":[],"and":[{"filter":{"key":"dst-country-name","operator":"EQUALS","value":"CA"}}]}}};
            tableId = 'right-grid-conf';
            customButtonLabel = 'Block';
            view = {"noOfRecords": 20};
            conf = new GridConfiguration(title, context, requestObj,  tableId, customButtonLabel, view);
            values = conf.getValues();
        });

        it('Checks Top IP Addresses Grid Configuration object is created properly', function () {
            conf.should.exist;
        });

        it('Checks table defaults', function () {
//            values['numberOfRows'].should.be.equal(5);
            values['jsonRoot'].should.be.equal("response.result");
        });

        it('Check action button', function () {
            values.actionButtons.customButtons.length.should.be.equal(1);
            values.actionButtons.customButtons[0].button_type.should.be.equal(true);
            values.actionButtons.customButtons[0].key.should.be.equal("blockIPAddress");
            values.actionButtons.customButtons[0].disabledStatus.should.be.equal(true);
            values.actionButtons.customButtons[0].secondary.should.be.equal(true);

        });

        it('Check postData', function() {
            var data = {
                "page": 2
            }
            values.postData(data);
        });

        describe('Check table columns', function () {
            var columns;

            before(function () {
                columns = conf.getValues().columns;
            });

            it('Checks if the IP column if defined', function () {
                var col;
                _.each(columns, function (eachCol) {
                   if (eachCol.name === 'key') {
                       col = eachCol;
                   }
                });

                _.isUndefined(col).should.be.equal(false);
                col.index.should.be.equal('key');
                col.sortable.should.be.equal(false);
            });

            it('Checks if the Count column if defined', function () {
                var col;
                _.each(columns, function (eachCol) {
                   if (eachCol.name === 'value') {
                       col = eachCol;
                   }
                });

                _.isUndefined(col).should.be.equal(false);
                col.index.should.be.equal('value');
                col.sortable.should.be.equal(false);
            });

            it('json Records', function() {
                var values = conf.getValues();
                var data = {'response' : { }};
                arg = values.jsonRecords(data);
                assert(typeof arg === "undefined");
                values['jsonRoot'].should.be.equal("response.result");
            });



        });

    });
});