/**
 * UT for Access Profile Grid Configuration
 *
 * @module accessProfileGridConfigurationTest
 * @author Vinay M S <vianyms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../conf/accessProfileGridConfiguration.js',
    '../../../constants/userFirewallConstants.js'
], function (AccessProfileGridConfiguration, Constants ) {

    var conf, values, getMessage,  context = new Slipstream.SDK.ActivityContext();

    describe('Access Profile Grid Configuration UT', function () {
        before(function () {
            conf = new AccessProfileGridConfiguration(context);
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
            values['tableId'].should.be.equal('access_profile_ilp');
            values['url'].should.be.equal(Constants.ACCESS_PROFILE.URL_PATH);
            values['sortName'].should.be.equal('name');
            values['sortOrder'].should.be.equal('asc');
            values['jsonRoot'].should.be.equal(Constants.ACCESS_PROFILE.JSON_ROOT);
            values['multiselect'].should.be.equal('true');
            values['filter']['searchUrl'].should.be.equal(true);
            values['filter']['columnFilter'].should.be.equal(true);
            values['ajaxOptions']['headers']['Accept'].should.be.equal(Constants.ACCESS_PROFILE.ACCEPT);
        });

        it('Checks table context menu', function () {
            var menu = values.contextMenu;
            Juniper = {
                sm: {
                    DomainProvider: {
                        isNotCurrentDomain: function(){
                            return true;
                        }
                    }
                }
            };
            menu['edit'].should.exist;
            menu['custom'].should.exist;
            menu['custom'][0].isDisabled('test', [{'domain-id':123}]).should.be.equal(true);
            menu['custom'][0].isDisabled('test', []).should.be.equal(true);

        });

        it('Checks the getValues', function () {
            var resp = conf.getValues();
            resp['jsonRecords']({'access-profiles':{'@total':2}});
        });
        describe('check formatters defined', function(){
            var resp;
            it('Checks the formatAddress check 0', function () {
                resp = conf.formatAddress();
                resp.should.be.equal("");
            });
            it('Checks the formatAddress check 1', function () {
                resp = conf.formatAddress([{'address':"test"}]);
                resp[0].should.be.equal("test");
            });
            it('Checks the formatAddress check2', function () {
                resp = conf.formatAddress({'address':"test"});
                resp[0].should.be.equal("test");
            });
            it('Checks the formatAddressCell check 0', function () {
                 resp = conf.formatAddressCell("");
                resp.should.be.equal("");
            });
            it('Checks the formatAddressCell check 1', function () {
                resp = conf.formatAddressCell([{address:"test"},{}],["Test"]);
                resp[0].address.should.be.equal("test");
            });
            it('Checks the formatAddressCell check2', function () {
                resp = conf.formatAddressCell([{address:"test"},{}],["Test"]);
                resp[0].address.should.be.equal("test");
            });
        });
        describe('check formatters defined', function(){
            var resp;
            it('Checks the formatDevices check 0', function () {
                resp = conf.formatDevices();
                resp.should.be.equal("");
            });
            it('Checks the formatDevices check 1', function () {
                resp = conf.formatDevices([{'name':"test"}]);
                resp[0].should.be.equal("test");
            });
            it('Checks the formatDevices check2', function () {
                resp = conf.formatDevices({'name':"test"});
                resp[0].should.be.equal("test");
            });
            it('Checks the formatDevicesCell check 0', function () {
                 resp = conf.formatDevicesCell("");
                resp.should.be.equal("");
            });
            it('Checks the formatDevicesCell check 1', function () {
                 resp = conf.formatDevicesCell([{name:"test"},{}],["Test"]);
                resp[0].name.should.be.equal("test");
            });
            it('Checks the formatDevicesCell check2', function () {
                 resp = conf.formatDevicesCell([{name:"test"},{}],["Test"]);
                resp[0].name.should.be.equal("test");
            });
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

            it('Checks if the name column if defined', function () {
                var col;
                _.each(columns, function (eachCol) {
                    if (eachCol.name === 'name') {
                        col = eachCol;
                    }
                });
                _.isUndefined(col).should.be.equal(false);
                col.index.should.be.equal('name');
                col.searchCell.should.be.equal(true);
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
            });


            it('Checks if the authentication-order1 column if defined', function () {
                var col;
                _.each(columns, function (eachCol) {
                    if (eachCol.name === 'authentication-order1') {
                        col = eachCol;
                    }
                });

                _.isUndefined(col).should.be.equal(false);
                col.index.should.be.equal('authentication-order1');
                col.searchCell.type.should.be.equal("dropdown");
                col.searchCell.values[0].value.should.be.equal("NONE");
                col.searchCell.values[1].value.should.be.equal("LDAP");
                col.searchCell.values[2].value.should.be.equal("RADIUS");
                col.searchCell.values[3].value.should.be.equal("SECURID");
                col.searchCell.values[4].value.should.be.equal("PASSWORD");
                //col.searchCell.type.should.be.equal("dropdown");
            });

            it('Checks if the authentication-order2 column if defined', function () {
                var col;
                _.each(columns, function (eachCol) {
                    if (eachCol.name === 'authentication-order2') {
                        col = eachCol;
                    }
                });

                _.isUndefined(col).should.be.equal(false);
                col.index.should.be.equal('authentication-order2');
                col.searchCell.type.should.be.equal("dropdown");
                col.searchCell.values[0].value.should.be.equal("NONE");
                col.searchCell.values[1].value.should.be.equal("LDAP");
                col.searchCell.values[2].value.should.be.equal("RADIUS");
                col.searchCell.values[3].value.should.be.equal("SECURID");
                col.searchCell.values[4].value.should.be.equal("PASSWORD");
                //col.searchCell.type.should.be.equal("dropdown");
            });

            it('Checks if the description column if defined', function () {
                var col;
                _.each(columns, function (eachCol) {
                    if (eachCol.name === 'description') {
                        col = eachCol;
                    }
                });

                _.isUndefined(col).should.be.equal(false);
                col.index.should.be.equal('description');
            });

            it('Checks if the ldap-servers column if defined', function () {
                var col;
                _.each(columns, function (eachCol) {
                    if (eachCol.name === 'ldap-servers.ldap-server') {
                        col = eachCol;
                    }
                });

                _.isUndefined(col).should.be.equal(false);
                col.index.should.be.equal('ldap-servers');
                col.collapseContent.should.exist;
                col.collapseContent.formatData.should.exist;
                col.collapseContent.formatCell.should.exist;
            });

            it('Checks if the ldap-options column if defined', function () {
                var col;
                _.each(columns, function (eachCol) {
                    if (eachCol.name === 'ldap-options.base-dn') {
                        col = eachCol;
                    }
                });
                _.isUndefined(col).should.be.equal(false);
                col.index.should.be.equal('baseDN');
            });
            it('Checks if the devices-list column if defined', function () {
                var col;
                _.each(columns, function (eachCol) {
                    if (eachCol.name === 'device-list.device-lite') {
                        col = eachCol;
                    }
                });
                _.isUndefined(col).should.be.equal(false);
                col.index.should.be.equal('device-list');
                col.collapseContent.should.exist;
                col.collapseContent.formatData.should.exist;
                col.collapseContent.formatCell.should.exist;
            });

        });

    });
});