/**
 * UT for Active Directory Grid Configuration
 *
 * @module activeDirectoryGridConfTest
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
        '../../conf/activeDirectoryGridConfiguration.js',
        '../../../constants/userFirewallConstants.js'
    ],


    function (Configuration, Constants) {

        describe('Check Active Directory Grid Configuration UT', function () {
            var conf, context;
            before(function () {
                context = new Slipstream.SDK.ActivityContext();
                conf = new Configuration(context);
            });

            it('Checks if the configuration exist', function () {
                conf.should.exist;
            });
            describe('check formatters for domains defined', function(){
                var resp;
                it('Checks the formatDomains check 0', function () {
                    resp = conf.format();
                    resp.should.be.equal("");
                });
                it('Checks the formatDomains check 1', function () {
                    resp = conf.format([{'domain-name':"test"}]);
                    resp[0].should.be.equal("test");
                });
                it('Checks the formatDomains check2', function () {
                    resp = conf.format({'domain-name':"test"});
                    resp[0].should.be.equal("test");
                });
                it('Checks the formatDomains check 3', function () {
                    resp = conf.format([{'name':"test"}]);
                    resp[0].should.be.equal("test");
                });
                it('Checks the formatDomains check 4', function () {
                    resp = conf.format({'name':"test"});
                    resp[0].should.be.equal("test");
                });

                it('Checks the formatDomainsCell check 0', function () {
                    resp = conf.formatCell("");
                    resp.should.be.equal("");
                });

                it('Checks the formatDomainsCell check 1', function () {
                    resp = conf.formatCell([{'domain-name':"test"},{}],["Test"]);
                    resp[0]['domain-name'].should.be.equal("test");
                });

            });

            describe('Check Table properties', function () {
                var values;
                before(function () {
                    values = conf.getValues();
                });

                it('Checks table defaults', function () {
                    values['tableId'].should.be.equal('active-directory-ilp');
                    values['url'].should.be.equal(Constants.ACTIVE_DIRECTORY.URL_PATH);
                    values['jsonRoot'].should.be.equal(Constants.ACTIVE_DIRECTORY.GRID_JSON_ROOT);
                    values['multiselect'].should.be.equal('true');
                    values['repeatItems'].should.be.equal('true');
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
                    menu.edit.should.exist;
                    menu['custom'].should.exist;
                    menu['custom'][0].isDisabled('test', [{'domain-id':123}]).should.be.equal(true);
                    menu['custom'][0].isDisabled('test', []).should.be.equal(true);
                });

                it('Checks grid json records', function () {
                    var fakeData, total = '12333432'; // any dummy number

                    fakeData = {
                        'active-directories': {
                            'total': total
                        }
                    };
                    values.jsonRecords(fakeData).should.be.equal(total);
                });

                it('Checks the filter', function () {
                    values.filter.should.exist;
                    values.filter.searchUrl.should.be.equal(true);
                    values.filter.columnFilter.should.be.equal(true);
                    values.filter.optionMenu.should.exist;
                    _.isEmpty(values.filter.optionMenu.showHideColumnsItem).should.be.equal(true);
                    _.isEmpty(values.filter.optionMenu.customItems).should.be.equal(true);
                });

                it('Check action buttons', function () {
                    values.actionButtons.customButtons.length.should.be.equal(2);
                    values.actionButtons.customButtons[0].button_type.should.be.equal(true);
                    values.actionButtons.customButtons[0].key.should.be.equal('deployEvent');
                    values.actionButtons.customButtons[0].disabledStatus.should.be.equal(true);
                    values.actionButtons.customButtons[0].secondary.should.be.equal(true);

                    values.actionButtons.customButtons[1].button_type.should.be.equal(true);
                    values.actionButtons.customButtons[1].key.should.be.equal('deleteADEvent');
                    values.actionButtons.customButtons[1].disabledStatus.should.be.equal(true);
                    values.actionButtons.customButtons[1].secondary.should.be.equal(true);

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
                    col.sortable.should.be.equal(true);
                });

                it('Checks if the domain name column if defined', function () {
                    var col;
                    _.each(columns, function (eachCol) {
                        if (eachCol.name === 'domain-name') {
                            col = eachCol;
                        }
                    });

                    _.isUndefined(col).should.be.equal(false);
                    col.index.should.be.equal('domain-name');
                    col.searchCell.should.be.equal(false);
                    col.sortable.should.be.equal(true);
                });


                it('Checks if the domains column if defined', function () {
                    var col;
                    _.each(columns, function (eachCol) {
                        if (eachCol.name === 'domains.domain') {
                            col = eachCol;
                        }
                    });

                    _.isUndefined(col).should.be.equal(false);
                    col.index.should.be.equal('domains');
                    col.collapseContent.should.exist;
                    col.sortable.should.be.equal(false);
                    col.collapseContent.formatData.should.exist;
                    col.collapseContent.formatCell.should.exist;
                });
                it('Checks if the devices column if defined', function () {
                    var col;
                    _.each(columns, function (eachCol) {
                        if (eachCol.name === 'devices.device') {
                            col = eachCol;
                        }
                    });
                    _.isUndefined(col).should.be.equal(false);
                    col.index.should.be.equal('device');
                    col.collapseContent.should.exist;
                    col.collapseContent.formatData.should.exist;
                    col.collapseContent.formatCell.should.exist;
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
                    col.searchCell.should.be.equal(false);
                    col.sortable.should.be.equal(false);
                });

            });


        });
    });