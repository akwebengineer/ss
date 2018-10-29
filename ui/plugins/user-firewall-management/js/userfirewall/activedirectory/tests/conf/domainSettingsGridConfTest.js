/**
 * UT for Active Directory Domain Settings Grid Configuration
 *
 * @module domainSettingsGridConfTest
 * @author Vinay M S <vianyms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../conf/domainSettingsGridConf.js'
], function (Conf ) {

    var conf,getMessage, context = new Slipstream.SDK.ActivityContext();

    describe('Active Directory domain settings grid Configuration UT', function () {
        before(function () {
            conf = new Conf(context);
            getMessage = sinon.stub(context, 'getMessage', function(value){
                return value;
            });
        });

        after(function () {
            getMessage.restore();
        });

        it('Checks if the Active Directory domain settings grid Configuration object is created properly', function () {
            conf.should.exist;
        });
        it('Checks if the Active Directory domain settings grid Configuration object is created properly', function () {
            var gridConf = conf.getValues();
            gridConf.tableId.should.be.equal('access_profile_ldpa_server');
            gridConf.height.should.be.equal('150px');
            gridConf.repeatItems.should.be.equal('true');
            gridConf.multiselect.should.be.equal('true');
            gridConf.jsonId.should.be.equal('slipstreamGridWidgetRowId');
            gridConf.scroll.should.be.equal(true);
            gridConf.contextMenu.edit.should.be.equal('active_directory_edit_domain_settings');
            gridConf.contextMenu.delete.should.be.equal('active_directory_delete_domain_settings');
            gridConf.confirmationDialog.delete.title.should.be.equal('active_directory_delete_domain_settings');
            gridConf.confirmationDialog.delete.question.should.be.equal('active_directory_delete_domain_settings_message');
        });
        describe('check formatters defined', function(){
            var resp;
            it('Checks the formatDomainControllers check 0', function () {
                resp = conf.formatDomain();
                resp.should.be.equal("");
            });
            it('Checks the formatDomainControllers check 1', function () {
                resp = conf.formatDomain([{'domain-controller-ip-address':"test"}]);
                resp[0].should.be.equal("test");
            });
            it('Checks the formatDomainControllers check2-1', function () {
                resp = conf.formatDomain({'domain-controller-ip-address':"test"});
                resp[0].should.be.equal("test");
            });
            it('Checks the formatDomainControllers check2-1', function () {
                resp = conf.formatDomain({"user-grp-ip-address":"test"});
                resp[0].should.be.equal("test");
            });
            it('Checks the formatDomainControllersCell check 0', function () {
                resp = conf.formatDomainCells("");
                resp.should.be.equal("");
            });
            it('Checks the formatDomainControllersCell check 1', function () {
                resp = conf.formatDomainCells([{'domain-controller-ip-address':"test"},{}],["Test"]);
                resp[0]['domain-controller-ip-address'].should.be.equal("test");
            });
            it('Checks the formatDomainControllersCell check2', function () {
                resp = conf.formatDomainCells([{'domain-controller-ip-address':"test"},{}],["Test"]);
                resp[0]['domain-controller-ip-address'].should.be.equal("test");
            });
        });

        describe('Check table columns', function () {

            var columns;

            before(function () {
                columns = conf.getValues().columns;
            });

            it('Checks if the domain-name column if defined', function () {
                var col;
                _.each(columns, function (eachCol) {
                    if (eachCol.name === 'domain-name') {
                        col = eachCol;
                    }
                });

                _.isUndefined(col).should.be.equal(false);
                col.index.should.be.equal('domain-name');
                col.label.should.be.equal('active_directory_grid_column_domainName');
            });
            it('Checks if the ldap-addresses column if defined', function () {
                var col;
                _.each(columns, function (eachCol) {
                    if (eachCol.name === 'ldap-addresses.ldap-address') {
                        col = eachCol;
                    }
                });

                _.isUndefined(col).should.be.equal(false);
                col.index.should.be.equal('ldap-addresses');
                col.label.should.be.equal('active_directory_user_group_mapping');
                col.collapseContent.formatData.should.exist;
                col.collapseContent.formatCell.should.exist;
            });
            it('Checks if the domain-controllers column if defined', function () {
                var col;
                _.each(columns, function (eachCol) {
                    if (eachCol.name === 'domain-controllers.domain-controller') {
                        col = eachCol;
                    }
                });

                _.isUndefined(col).should.be.equal(false);
                col.index.should.be.equal('domain-controllers');
                col.label.should.be.equal('active_directory_domain_contorller_ip');
                col.collapseContent.formatData.should.exist;
                col.collapseContent.formatCell.should.exist;
            });
        });

        });
});