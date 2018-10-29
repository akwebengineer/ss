/**
 * UT for Domain LDAP Grid Configuration
 *
 * @module domainLDAPGridConfTest
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../conf/domainLDAPGridConf.js',
    '../../../constants/userFirewallConstants.js'
], function (GridConfiguration, Constants) {


    describe('Domain LDAP  Grid Configuration UT', function () {
        var conf, values, context;
        before(function () {
            context = new Slipstream.SDK.ActivityContext()
            conf = new GridConfiguration(context);
            values = conf.getValues();
        });

        it('Checks if the Domain LDAP Grid Configuration object is created properly', function () {
            conf.should.exist;
        });

        it('Checks table defaults', function () {
            values['tableId'].should.be.equal('domain_ldap_grid');
            values['numberOfRows'].should.be.equal(10);
            values['jsonRoot'].should.be.equal(Constants.ACTIVE_DIRECTORY.DOMAIN_LDAP.GRID_JSON_ROOT);
            values['multiselect'].should.be.equal('true');
        });

        it('Checks table context menu', function () {
            var menu = values.contextMenu;

            menu['edit'].should.exist;
            menu['delete'].should.exist;
        });

        it('Checks table actions', function () {
            var menu = values.createRow;

            menu['addLast'].should.be.equal(true);
            menu['showInline'].should.be.equal(true);

            menu = values.editRow;
            menu['showInline'].should.be.equal(true);

            values.confirmationDialog.delete.should.exist;
        });

        it('Checks the Json records', function () {
            var result, total = Math.random();
            result = values['jsonRecords']({records: 1, 'ldap-addresses': {'total': total}});
            result.should.be.equal(total);
        });


        describe('Check table columns', function () {

            var columns;

            before(function () {
                columns = conf.getValues().columns;
            });

            it('Checks if the id column if defined', function () {
                var col;
                _.each(columns, function (eachCol) {
                    if (eachCol.name === 'id') {
                        col = eachCol;
                    }
                });

                _.isUndefined(col).should.be.equal(false);
                col.index.should.be.equal('id');
                col.hidden.should.be.equal(true);
            });

            it('Checks if the user-grp-ip-address column is defined', function () {
                var col;
                _.each(columns, function (eachCol) {
                    if (eachCol.name === 'user-grp-ip-address') {
                        col = eachCol;
                    }
                });
                _.isUndefined(col).should.be.equal(false);
                col.index.should.be.equal('user-grp-ip-address');
                col.sortable.should.be.equal(false);

                col.editCell.type.should.be.equal('input');
                col.editCell.pattern.should.be.equal("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$");
                col.editCell.required.should.be.equal(true);
            });

            it('Checks if the user-grp-port column if defined', function () {
                var col;
                _.each(columns, function (eachCol) {
                    if (eachCol.name === 'user-grp-port') {
                        col = eachCol;
                    }
                });

                _.isUndefined(col).should.be.equal(false);
                col.index.should.be.equal('user-grp-port');
                col.sortable.should.be.equal(false);

                col.editCell.type.should.be.equal('input');
                col.editCell.pattern.should.be.equal('^(([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9]|[1-6][0-5][0-5][0-3][0-5])$|^$)');
                col.editCell.required.should.be.equal(false);
            });


        });

    });
});