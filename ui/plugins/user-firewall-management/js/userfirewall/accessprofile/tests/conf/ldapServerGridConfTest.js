/**
 * UT for Access Profile LDAP Server Grid Configuration
 *
 * @module ldapServerGridConfigurationTest
 * @author Vinay M S <vianyms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../conf/ldapServerGridConf.js'
], function (LdapServerGridConf ) {

    var conf, values, getMessage, context = new Slipstream.SDK.ActivityContext();

    describe('Access Profile Grid Configuration UT', function () {

        before(function () {
            conf = new LdapServerGridConf(context);
            values = conf.getValues();
            getMessage = sinon.stub(context, 'getMessage', function(value){
                return value;
            });
        });

        after(function () {
            getMessage.restore();
        });

        it('Checks if the Access ProfileGrid Configuration object is created properly', function () {
            conf.should.exist;
        });

        it('Checks table defaults', function () {
            values['tableId'].should.be.equal('access_profile_ldpa_server');
            values['jsonId'].should.be.equal("slipstreamGridWidgetRowId");
            values['repeatItems'].should.be.equal('true');
            values['scroll'].should.be.equal(true);
            values['multiselect'].should.be.equal('true');
            values['filter']['optionMenu']['showHideColumnsItem']['setColumnSelection'].should.exist;
        });

        it('Checks table context menu', function () {
            var menu = values.contextMenu;

            menu['edit'].should.exist;
            menu['delete'].should.exist;
        });

        it('Checks setShowHideColumnSelection', function () {
            conf.setShowHideColumnSelection("TEST").should.be.equal('TEST');
        });
        it('Checks intigerFormatter zero ', function () {
            conf.intigerFormatter(0).should.be.equal('');
        });
        it('Checks intigerFormatter 3 ', function () {
            conf.intigerFormatter(3).should.be.equal(3);
        });


        describe('Check table columns', function () {

            var columns;

            before(function () {
                columns = conf.getValues().columns;
            });

            it('Checks if the address column if defined', function () {
                var col;
                _.each(columns, function (eachCol) {
                    if (eachCol.name === 'address') {
                        col = eachCol;
                    }
                });

                _.isUndefined(col).should.be.equal(false);
                col.index.should.be.equal('address');
            });

            it('Checks if the retry column if defined', function () {
                var col;
                _.each(columns, function (eachCol) {
                    if (eachCol.name === 'retry') {
                        col = eachCol;
                    }
                });
                _.isUndefined(col).should.be.equal(false);
                col.index.should.be.equal('retry');
            });

            it('Checks if the port column if defined', function () {
                var col;
                _.each(columns, function (eachCol) {
                    if (eachCol.name === 'port') {
                        col = eachCol;
                    }
                });
                _.isUndefined(col).should.be.equal(false);
                col.index.should.be.equal('port');
            });

            it('Checks if the routing-instance column if defined', function () {
                var col;
                _.each(columns, function (eachCol) {
                    if (eachCol.name === 'routing-instance') {
                        col = eachCol;
                    }
                });
                _.isUndefined(col).should.be.equal(false);
                col.index.should.be.equal('routing-instance');
            });

            it('Checks if the time-out column if defined', function () {
                var col;
                _.each(columns, function (eachCol) {
                    if (eachCol.name === 'time-out') {
                        col = eachCol;
                    }
                });
                _.isUndefined(col).should.be.equal(false);
                col.index.should.be.equal('time-out');
            });

        });
    });
});