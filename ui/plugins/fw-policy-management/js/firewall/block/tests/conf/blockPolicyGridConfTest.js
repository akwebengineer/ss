/**
 * UT for grid configurations block policy grid
 *
 * @module BlockPolicyGridConfTest
 * @author tgarg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define(
    ['../../conf/blockPolicyGridConf.js'],
    function (Configuration) {

        describe('Check Block Policy Grid Configuration UT', function () {
            var conf, context;
            before(function () {
                context = new Slipstream.SDK.ActivityContext();
                conf = new Configuration(context);
            });

            after(function () {
            });

            it('Checks if the configuration exist', function () {
                conf.should.exist;
            });

            describe('Check Table properties', function () {
                before(function () {
                });

                it('Checks table defaults', function () {

                    _.isUndefined(conf.gridTitleHelp).should.be.equal(true);
                    _.isUndefined(conf.gridTitleString).should.be.equal(true);
                    _.isUndefined(conf.multiselect).should.be.equal(true);
                    conf.tableId.should.exist;


                });


            });

            describe('Check table columns', function () {

                var columns;

                before(function () {
                    conf.showRulesColumn = true;
                    columns = conf.getColumnConfiguration();
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


                it('Checks if the icon column if defined', function () {
                    var col;
                    _.each(columns, function (eachCol) {
                        if (eachCol.name === 'icons') {
                            col = eachCol;
                        }
                    });

                    _.isUndefined(col).should.be.equal(false);
                    col.index.should.be.equal('icons');
                    _.isEmpty(col.label).should.be.equal(true);
                    col.formatter.should.exist;
                    col.fixed.should.be.equal(true);
                });

                it('Checks if the domain name column if defined', function () {
                    var col;
                    _.each(columns, function (eachCol) {
                        if (eachCol.name === 'domain-name') {
                            col = eachCol;
                        }
                    });

                    _.isUndefined(col).should.be.equal(false);
                    col.index.should.be.equal('domain');
                    col.sortable.should.be.equal(false);
                    col.formatter.should.exist;
                });


                it('Checks if the sequence number column if defined', function () {
                    var col;
                    _.each(columns, function (eachCol) {
                        if (eachCol.name === 'sequence-number') {
                            col = eachCol;
                        }
                    });

                    _.isUndefined(col).should.be.equal(false);
                    col.index.should.be.equal('sequenceNumber');
                    col.formatter.should.exist;
                    col.sortable.should.be.equal(false);
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
                    col.formatter.should.exist;
                    col.sortable.should.be.equal(false);
                    col.hideHeader.should.be.equal(true);
                    col.searchCell.should.be.equal(false);
                });


                it('Checks if the devices column if defined', function () {
                    var col;
                    _.each(columns, function (eachCol) {
                        if (eachCol.name === 'device-count') {
                            col = eachCol;
                        }
                    });

                    _.isUndefined(col).should.be.equal(false);
                    col.index.should.be.equal('devices');
                    col.formatter.should.exist;
                    col.sortable.should.be.equal(false);
                    col.searchCell.should.be.equal(false);
                });

                it('Checks if the rules changes count column if defined', function () {
                    var col;
                    _.each(columns, function (eachCol) {
                        if (eachCol.name === 'rules') {
                            col = eachCol;
                        }
                    });

                    _.isUndefined(col).should.be.equal(false);
                    col.index.should.be.equal('rules');
                    col.formatter.should.exist;
                    col.sortable.should.be.equal(false);
                    col.searchCell.should.be.equal(false);
                    col.hidden.should.be.equal(!conf.showRulesColumn);
                });

                it('Checks if the name formatter is defined properly', function () {
                    var col, formatVal, stub1, stub2, isGroupNode = true, expectedVal;
                    _.each(columns, function (eachCol) {
                        if (eachCol.name === 'name') {
                            col = eachCol;
                        }
                    });
                    console.log(conf);
                    stub1 = sinon.stub(conf, 'getPolicyRecord', function () {
                        return {
                            get: function () {
                                return 'dummyName'
                            }
                        }
                    });
                    stub2 = sinon.stub(conf, 'isGroupNode', function () {
                        return isGroupNode;
                    });

                    formatVal = col.formatter.call(conf, null, null, {
                        id: 123
                    });
                    _.isEmpty(formatVal).should.be.equal(true);


                    isGroupNode = false;
                    formatVal = col.formatter.call(conf, null, null, {
                        id: 123
                    });
                    _.isEmpty(formatVal).should.be.equal(false);
                    expectedVal = '<a id="blockAppLink" class="cellLink" data-policy-obj="' + 123 + '" >' +
                        'dummyName' + '</a>';

                    formatVal.should.be.equal(expectedVal);

                    stub1.restore();
                    stub2.restore();
                });

                it('Checks if the rules count formatter is defined properly', function () {
                    var col, formatVal, stub1, stub2, isGroupNode = false, expectedVal, data;
                    _.each(columns, function (eachCol) {
                        if (eachCol.name === 'rules') {
                            col = eachCol;
                        }
                    });
                    stub1 = sinon.stub(conf, 'getPolicyRecord', function () {
                        return {
                            get: function () {
                                return data;
                            }
                        }
                    });
                    stub2 = sinon.stub(conf, 'isGroupNode', function () {
                        return isGroupNode;
                    });


                    formatVal = col.formatter.call(conf, null, null, {
                        id: 123
                    });
                    _.isEmpty(formatVal).should.be.equal(true);


                    isGroupNode = true;

                    data = {
                        'change-list': {}
                    };

                    formatVal = col.formatter.call(conf, null, null, {
                        id: 123
                    });
                    _.isEmpty(formatVal).should.be.equal(true);

                    isGroupNode = false;

                    data = {
                        'change-list': {
                            'rule-change-list': {}
                        }
                    };

                    formatVal = col.formatter.call(conf, null, null, {
                        id: 123
                    });
                    _.isEmpty(formatVal).should.be.equal(true);


                    data = {
                        'rule-change-list': {
                            'added-rules': {
                                'added-rule': []
                            },
                            'modified-rules': {
                                'modified-rule': []
                            },
                            'deleted-rules': {
                                'deleted-rule': []
                            }
                        }
                    };

                    formatVal = col.formatter.call(conf, null, null, {
                        id: 123
                    });
                    _.isEmpty(formatVal).should.be.equal(false);
                    expectedVal = '<a id="blockAppLink" class="cellLink" data-policy-obj="123" >-</a>';

                    formatVal.should.be.equal(expectedVal);


                    // 1 rule added, 1 rule modified, 1 rule deleted
                    data = {
                        'rule-change-list': {
                            'added-rules': {
                                'added-rule': ['Rule1']
                            },
                            'modified-rules': {
                                'modified-rule': ['Rule1']
                            },
                            'deleted-rules': {
                                'deleted-rule': ['Rule1']
                            }
                        }
                    };

                    formatVal = col.formatter.call(conf, null, null, {
                        id: 123
                    });
                    _.isEmpty(formatVal).should.be.equal(false);
                    expectedVal = '<a id="blockAppLink" class="cellLink" data-policy-obj="123" >1 Rule Added, 1 Rule Modified, 1 Rule Deleted</a>';

                    formatVal.should.be.equal(expectedVal);



                    // Multiple rules
                    data = {
                        'rule-change-list': {
                            'added-rules': {
                                'added-rule': ['Rule1', 'Rule2']
                            },
                            'modified-rules': {
                                'modified-rule': ['Rule1', 'Rule2']
                            },
                            'deleted-rules': {
                                'deleted-rule': ['Rule1', 'Rule2']
                            }
                        }
                    };

                    formatVal = col.formatter.call(conf, null, null, {
                        id: 123
                    });
                    _.isEmpty(formatVal).should.be.equal(false);
                    expectedVal = '<a id="blockAppLink" class="cellLink" data-policy-obj="' + 123 + '" >' +
                        '2 Rules Added, 2 Rules Modified, 2 Rules Deleted' + '</a>';

                    formatVal.should.be.equal(expectedVal);

                    stub1.restore();
                    stub2.restore();
                });

            });

        });
    });