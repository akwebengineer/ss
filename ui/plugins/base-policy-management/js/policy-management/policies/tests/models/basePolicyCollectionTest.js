define(
    ['../../models/basePolicyCollection.js',
        '../../../constants/basePolicyManagementConstants.js',
        '../../../../../../fw-policy-management/js/firewall/policies/models/fwPolicyCollection.js'],
    function (Collection, Constants, FWCollection) {

        describe('Base policy collection UT', function () {
            var collection, UUID = 'fakeUUID', seq1 = 10, seq2 = 20;
            before(function () {

            });

            it('Checks if the collection exist', function () {
                collection = new FWCollection({
                    uuid: UUID,
                    id: 123
                });

                collection.should.exist;

                collection.jsonRoot.should.be.equal("policies.policy");
            });

            it('Checks if the url is created properly', function () {
                collection.url().should.be.equal(collection.policyManagementConstants.POLICY_URL);

            });

            it('Checks if the url is created properly: Object', function () {
                var filter = {
                    property: 'fakeProperty',
                    modifier: 'fakeModifier',
                    value: 'fakeValue'

                }, expectedVal = collection.policyManagementConstants.POLICY_URL + "?filter=(fakeProperty fakeModifier 'fakeValue')";
                collection.url(filter).should.be.equal(expectedVal);
            });


            it('Checks if the url is created properly: Array', function () {
                var filter = [
                    {
                        property: 'fakeProperty1',
                        modifier: 'fakeModifier1',
                        value: 'fakeValue1'

                    },
                    {
                        property: 'fakeProperty2',
                        modifier: 'fakeModifier2',
                        value: 'fakeValue2'

                    }
                ], expectedVal = collection.policyManagementConstants.POLICY_URL + "?filter=(fakeProperty1 fakeModifier1 'fakeValue1' " +
                    "and fakeProperty2 fakeModifier2 'fakeValue2')";
                collection.url(filter).should.be.equal(expectedVal);

            });

            it('Checks if the policy count is added properly to the group name', function () {

                var name = collection.getFormattedGroupName({
                    get: function () {
                        return 'fakeName'
                    }
                }, 0);
                name.should.be.equal('fakeName (0 policy)');

                name = collection.getFormattedGroupName({
                    get: function () {
                        return 'fakeName'
                    }
                }, 1);
                name.should.be.equal('fakeName (1 policy)');


                name = collection.getFormattedGroupName({
                    get: function () {
                        return 'fakeName'
                    }
                }, 10);
                name.should.be.equal('fakeName (10 policies)');

            });

            it('Checks if the search option is added properly to url', function () {
                var url = 'fakeUrl', returnVal = '', expectedVal = '', search = 'fakeSearch';
                returnVal = collection.addSearchOptionsToURL(url, search);

                expectedVal = url.concat("&_search=" + search);
                expectedVal.should.be.equal(returnVal);

            });


            it('Checks if the filter option is added properly to url', function () {
                var url = 'fakeUrl', returnVal = '', expectedVal = '', filter = 'fakeFilter';

                returnVal = collection.addFilterOptionsToURL(url);
                expectedVal = url.concat("?paging=(start eq 1, limit eq 1000)");
                expectedVal.should.be.equal(returnVal);

                returnVal = collection.addFilterOptionsToURL(url, filter);
                expectedVal = url.concat("?paging=(start eq 1, limit eq 1000)&filter=(" + filter + ")");
                expectedVal.should.be.equal(returnVal);

            });

            it('Checks if the sort option is added properly to url', function () {
                var url = 'fakeUrl', returnVal = '', expectedVal = '', sortingOptions;

                sortingOptions = {
                    columnName: 'policy-order',
                    sortOrder: 'asc'
                };
                returnVal = collection.addSortOptionsToURL(url, sortingOptions);
                expectedVal = url.concat("&sortby=(policy-order(ascending))");
                expectedVal.should.be.equal(returnVal);

                sortingOptions = {
                    columnName: 'name',
                    sortOrder: 'desc'
                };
                returnVal = collection.addSortOptionsToURL(url, sortingOptions);
                expectedVal = url.concat("&sortby=(name(descending))");
                expectedVal.should.be.equal(returnVal);
            });


            it('Checks if the column name is returned properly', function () {
                var url = 'fakeUrl', returnVal = '', expectedVal = '', filter = 'fakeFilter';

                returnVal = collection.getFilterColumnName(filter);
                expectedVal = filter;
                expectedVal.should.be.equal(returnVal);

                filter = 'devices';
                returnVal = collection.getFilterColumnName(filter);
                expectedVal = 'device-list';
                expectedVal.should.be.equal(returnVal);

            });

            it('Checks if the connector is returned properly', function () {
                var returnVal, eqColumns, operators;

                returnVal = collection.getConnector('fakeName', '=');
                returnVal.should.be.equal(" contains ");

                eqColumns = ["publishState", "id", "devices", "lastModifiedTime"];
                $.each(eqColumns, function (i, col) {
                    returnVal = collection.getConnector(col, '=');
                    returnVal.should.be.equal(collection.policyManagementConstants.OPERATOR_CONNECTOR_MAP['=']);
                });

                operators = [">=", "=<", ">", "<"];
                $.each(operators, function (i, op) {
                    returnVal = collection.getConnector('fakeNAME', op);
                    (returnVal === undefined).should.be.equal(false);
                    returnVal.should.be.equal(collection.policyManagementConstants.OPERATOR_CONNECTOR_MAP[op]);
                });

            });

            it('Checks if the policy ids are returned properly', function () {
                var stub1, stub2, val;
                stub1 = sinon.stub(collection, 'get', function (id) {
                    return {
                        isPredefinedGroupSelected: function () {
                            if (id === 123) {
                                return true;
                            }
                            return false;
                        }
                    }
                });
                stub2 = sinon.stub(collection, 'pluck', function () {
                    return [12, 123, 1234];
                });
                val = collection.getAllPolicyIds();
                val.should.include(12);
                val.should.include(1234);
                val.should.not.include(123);

                stub1.restore();
                stub2.restore();
            });


            it('Checks if the global policy sequence number is returned properly', function () {
                var stub, stub2, isGlobalPolicy, val;

                stub = sinon.stub(collection.models[0], 'isGlobalPolicy', function () {
                    return isGlobalPolicy;
                });

                stub2 = sinon.stub(collection.models[0], 'get', function () {
                    return seq1;
                });

                isGlobalPolicy = false;
                val = collection.getGlobalPolicySeqNo();
                val.should.be.equal(-1);


                isGlobalPolicy = true;
                val = collection.getGlobalPolicySeqNo();
                val.should.be.equal(seq1);

            });


            it('Checks if the search string is formatted properly: quick filter', function () {
                var token, val, expected;

                token = [
                    {
                        column: 'quickFilter',
                        value: collection.policyManagementConstants.HIDE_POLICIES_WITH_NO_DEVICES
                    }
                ];
                val = collection.formatSearchString(token);
                expected = "(device-count eq 'not-empty')";
                val.should.be.equal(expected);

                token = [
                    {
                        column: 'quickFilter',
                        value: collection.policyManagementConstants.HIDE_POLICIES_WITH_NO_RULES
                    }
                ];
                val = collection.formatSearchString(token);
                expected = "(rule-count eq 'not-empty')";
                val.should.be.equal(expected);


            });


            it('Checks if the search string is formatted properly: lastModifiedTime', function () {
                var token, val, expected, stub1, stub2, colName, connector;

                token = [
                    {
                        column: 'lastModifiedTime',
                        value: 'fakeVal'
                    },
                    'AND',
                    {
                        value: 'fakeVal'
                    },
                    'OR',
                    {
                        value: 'March 31, 2016'
                    }
                ];

                stub1 = sinon.stub(collection, 'getFilterColumnName', function () {
                    return colName;
                });

                stub2 = sinon.stub(collection, 'getConnector', function () {
                    return connector;
                });

                connector = 'fakeConnector';
                colName = 'fakeColName';
                val = collection.formatSearchString(token);
                expected = "(fakeColNamefakeConnector0 and fakeColNamefakeConnector0 " +
                    "or fakeColNamefakeConnector";

                (val.indexOf(expected) !== -1).should.be.equal(true);

                stub1.restore();
                stub2.restore();

            });


            it('Checks if the search string is formatted properly', function () {
                var token, val, expected, stub1, stub2, colName, connector;

                token = [
                    {
                        column: 'fakeCol',
                        value: 'fakeVal'
                    },
                    'AND',
                    {
                        value: 'fakeVal'
                    },
                    'OR',
                    {
                        value: 'March 31, 2016'
                    }
                ];

                stub1 = sinon.stub(collection, 'getFilterColumnName', function () {
                    return colName;
                });

                stub2 = sinon.stub(collection, 'getConnector', function () {
                    return connector;
                });

                connector = 'fakeConnector';
                colName = 'fakeColName';
                val = collection.formatSearchString(token);
                expected = "(fakeColNamefakeConnector'fakeVal' " +
                    "and fakeColNamefakeConnector'fakeVal' or fakeColNamefakeConnector'March 31, 2016')";
                val.should.be.equal(expected);

                stub1.restore();
                stub2.restore();

            });

            it('Check if the policies are added properly to collection', function () {

                var group = {
                    set: function () {
                    }
                }, policies = [], stub, spy1, spy2;

                stub = sinon.stub(collection, 'getFormattedGroupName', function () {
                    return 'fakeName';
                });

                spy1 = sinon.spy(group, 'set');
                spy2 = sinon.spy(collection, 'add');

                collection.addPoliciesToCollection(group, policies);

                spy1.calledTwice.should.be.equal(true);
                spy1.args[0][0].should.be.equal('name');
                spy1.args[0][1].should.be.equal('fakeName');

                spy1.args[1][0].should.be.equal('expanded');
                spy1.args[1][1].should.be.equal(false);

                spy2.called.should.be.equal(true);

                stub.restore();
                spy2.restore();
                spy1.restore();

            });

            it('Checks if the fetch functionality is called properly: Success defined', function () {

                var stub1, stub2, stub3, stub4, stub5;

                stub1 = sinon.stub(collection, 'addFilterOptionsToURL', function () {
                    return 'fakeFilter';
                });
                stub2 = sinon.stub(collection, 'addSortOptionsToURL', function () {
                    return 'fakeSort';
                });
                stub3 = sinon.stub(collection, 'addSearchOptionsToURL', function () {
                    return 'fakeSearch';
                });
                stub4 = sinon.stub(collection, 'reset');
                stub5 = sinon.stub(Backbone.Collection.prototype, 'fetch');

                collection.fetch({
                    success: function () {
                    }
                });

                stub1.called.should.be.equal(true);
                stub2.called.should.be.equal(true);
                stub3.called.should.be.equal(true);
                stub4.called.should.be.equal(true);
                stub5.called.should.be.equal(true);

                stub1.restore();
                stub3.restore();
                stub2.restore();
                stub4.restore();
                stub5.restore();


            });


            it('Checks if the fetch functionality is called properly: Success not defined', function () {

                var stub1, stub2, stub3, stub4, stub5, spy6, spy7, handler, options = {
                    filterSearchSortOptions: {
                        FILTER: 'fakeFilter',
                        SORT: 'fakeSort',
                        SEARCH: 'fakeSearch'
                    }
                };

                stub1 = sinon.stub(collection, 'addFilterOptionsToURL', function () {
                    return 'fakeFilter';
                });
                stub2 = sinon.stub(collection, 'addSortOptionsToURL', function () {
                    return 'fakeSort';
                });
                stub3 = sinon.stub(collection, 'addSearchOptionsToURL', function () {
                    return 'fakeSearch';
                });
                stub4 = sinon.stub(collection, 'reset');
                stub5 = sinon.stub(Backbone.Collection.prototype, 'fetch');

                collection.fetch(options);

                stub1.called.should.be.equal(true);
                stub2.called.should.be.equal(true);
                stub3.called.should.be.equal(true);
                stub4.called.should.be.equal(true);
                stub5.called.should.be.equal(true);

                stub5.args[0][0].filterSearchSortOptions.should
                    .be.equal(options.filterSearchSortOptions);


                stub1.args[0][1].should.be.equal('fakeFilter');
                stub2.args[0][1].should.be.equal('fakeSort');
                stub3.args[0][1].should.be.equal('fakeSearch');


                stub1.restore();
                stub3.restore();
                stub2.restore();

                stub5.restore();

                handler = stub5.args[0][0].success;
                spy6 = sinon.stub(collection, 'addPoliciesToCollection');
                spy7 = sinon.spy(collection, 'trigger');

                handler.call(collection, collection, 'fakeResponse', 'fakeOptions');

                stub4.calledTwice.should.be.equal(true);
                spy6.calledThrice.should.be.equal(true);
                spy7.args[0][0].should.be.equal('beforeFetchComplete');
                spy7.args[0][1].should.be.equal(collection);
                spy7.args[0][2].should.be.equal('fakeResponse');
                spy7.args[0][3].should.be.equal('fakeOptions');

                spy7.args[1][0].should.be.equal('fetchComplete');
                spy7.args[1][1].should.be.equal(collection);
                spy7.args[1][2].should.be.equal('fakeResponse');
                spy7.args[1][3].should.be.equal('fakeOptions');


                assert(spy6.args[0][0].get('policy-position') ===
                    collection.policyManagementConstants.POLICY_GROUP.PRE_GROUP['policy-position']);


                assert(spy6.args[1][0].get('policy-position') ===
                    collection.policyManagementConstants.POLICY_GROUP.DEVICE_GROUP['policy-position']);


                assert(spy6.args[2][0].get('policy-position') ===
                    collection.policyManagementConstants.POLICY_GROUP.POST_GROUP['policy-position']);

                spy6.restore();
                spy7.restore();
                stub4.restore();
            });

        });

    });
