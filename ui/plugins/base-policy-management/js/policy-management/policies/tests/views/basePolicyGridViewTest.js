define([
    '../../views/basePolicyGridView.js',
    '../../../../../../fw-policy-management/js/firewall/policies/models/fwPolicyCollection.js',
    '../../views/basePolicyLockTooltipView.js'
], function (View, Collection, PolicyLockTooltipView) {

    describe('Base Policy Grid View UT', function () {
        var view, context, collection;
        before(function () {
            context = new Slipstream.SDK.ActivityContext();
            collection = new Collection();
        });


        describe('Basic functionality', function () {

            after(function () {
                view.policyManagementConstants = collection.policyManagementConstants;
                view.gridWidgetObject = {
                    getSelectedRows: function () {
                        return [
                            {id: 1234},
                            {id: 123}
                        ];
                    },
                    toggleRowSelection: function () {

                    },
                    addPageRows: function () {

                    },
                    search: function () {
                    }
                };
            });
            it('Checks if the view object is created successfully', function () {
                var stub1, stub2;

                stub1 = sinon.stub(View.prototype, 'subscribeNotifications');
                stub2 = sinon.stub(View.prototype, 'bindModelEvents');

                view = new View({
                    context: context,
                    collection: collection
                });

                view.should.exist;
                stub1.restore();
                stub2.restore();
            });

            it('Checks the close action', function () {
                var stub, stub2;

                stub = sinon.stub(view, 'resetFilterSearchSortOptions');
                stub2 = sinon.stub(view, 'unSubscribeNotifications');


                view.close();
                stub.called.should.be.equal(true);
                stub2.called.should.be.equal(true);

                stub.restore();
                stub2.restore();
            });
        });

        describe('Events', function () {

            before(function () {
                view.bindModelEvents();
            });

            it('Check if the model events are bind properly: policygridnodeexpand', function () {
                var stub = sinon.stub(view, 'groupExpandCollapseHandler');

                view.$el.trigger('policygridnodeexpand', ['fakePolicy']);
                stub.called.should.be.equal(true);
                stub.args[0][0].should.be.equal('fakePolicy');
                stub.args[0][1].should.be.equal('expand');

                stub.restore();
            });

            it('Check if the model events are bind properly: policygridnodecollapse', function () {
                var stub = sinon.stub(view, 'groupExpandCollapseHandler');

                view.$el.trigger('policygridnodecollapse', ['fakePolicy']);
                stub.called.should.be.equal(true);
                stub.args[0][0].should.be.equal('fakePolicy');
                stub.args[0][1].should.be.equal('collapse');

                stub.restore();
            });


            it('Check if the model events are bind properly: fetch complete', function () {
                var stub, stub2, stub3, stub4, stub5, policies = [
                    {}
                ], selectedRows = [
                    {id: 1234},
                    {id: 123}
                ], rows = 10;

                stub = sinon.stub(view, 'getPolicies', function () {
                    return policies;
                });

                stub2 = sinon.stub(view.collection, 'get', function (id) {
                    if (id === 1234) {
                        return {id: 1234}
                    }
                    return null;
                });

                stub3 = sinon.stub(view.gridWidgetObject, 'toggleRowSelection');
                stub4 = sinon.stub(view, 'addTreeViewRendering');
                stub5 = sinon.stub(view, 'clearGrid');

                view.collection.trigger('fetchComplete', view.collection, 'fakePolicy', {
                    rows: rows
                });

                stub.called.should.be.equal(true);

                stub2.called.should.be.equal(true);
                stub2.args[0].should.include(1234);
                stub2.args[0].should.not.include(123);

                stub2.args[1].should.include(123);
                stub2.args[1].should.not.include(1234);


                stub3.called.should.be.equal(true);
                stub3.args[0][1].should.be.equal('unselected');
                stub3.args[1][0].should.include(1234);
                stub3.args[1][0].should.not.include(123);
                stub3.args[1][1].should.be.equal('selected');

                stub4.called.should.be.equal(true);

                stub5.called.should.be.equal(true);

                stub.restore();
                stub2.restore();
                stub3.restore();
                stub4.restore();
                stub5.restore();
            });
        });

        describe('Render:', function () {
            var stubGrid, tableStub;
            before(function () {
                view.conf = {
                    columns: []
                };
                stubGrid = sinon.stub(view, 'buildGridWidget');
                tableStub = sinon.stub(view, 'getGridTable', function () {
                    return {
                        jqGrid: function () {

                            return [
                                {
                                    id: 1,
                                    name: 'sequence-number'
                                },
                                {
                                    id: 2,
                                    name: 'icons'
                                }
                            ]
                        }
                    }
                });
            });

            after(function () {
                stubGrid.restore();
                tableStub.restore();
            });

            it('checks the render method: Search defined', function () {
                var stub1, stub2, filter = 'fakeFilter';
                view.search = 'fakeSearch';
                view.filter = null;
                stub1 = sinon.stub(view, 'addSearchFilter', function () {
                    return filter;
                });
                stub2 = sinon.stub(view.gridWidgetObject, 'search');

                view.render();

                stub1.called.should.be.equal(true);
                view.conf.filter.should.be.equal(filter);
                stub2.args[0][0].should.include(view.search);

                stub1.restore();
                stub2.restore();


            });

            it('checks the render method: Filter defined', function () {
                var stub1, stub2, filter = 'fakeFilter';
                view.search = 'fakeSearch';
                view.filter = 'fakeSearch2';
                view.actionEvents = {
                    'update': 'UPDATE'
                };
                stub1 = sinon.stub(view, 'addSearchFilter', function () {
                    return filter;
                });
                stub2 = sinon.stub(view.gridWidgetObject, 'search');

                view.render();

                stub1.called.should.be.equal(true);
                view.conf.filter.should.be.equal(filter);
                stub2.args[0][0].should.include(view.filter);

                stub1.restore();
                stub2.restore();


            });

            it('checks the render method: Filter/Search not defined', function () {
                var stub1, stub2, filter = 'fakeFilter';
                view.search = null;
                view.filter = null;
                view.actionEvents = {
                    'update': 'UPDATE'
                };
                stub1 = sinon.stub(view, 'addSearchFilter', function () {
                    return filter;
                });
                stub2 = sinon.stub(view.collection, 'fetch');

                view.render();

                stub2.called.should.be.equal(true);

                stub1.restore();
                stub2.restore();


            });

            it('Check tree column position', function () {
                var position;

                position = view.getTreeColumnPosition();
                position.should.be.equal(0);
            });

            it('Check icon column position', function () {
                var position;

                position = view.getIconsColumnPosition();
                position.should.be.equal(1);
            });

            it('Checks cell tooltip', function (done) {
                var stub, cellData = {rawData: {
                    id: 123
                }}, isCalled;

                $.mockjax.clear();
                $.mockjax({
                    type: 'GET',
                    url: view.collection.url() + "123/locks",
                    status: 200,
                    responseText: {

                    },
                    response: function (settings, done2) {
                        done2();
                        stub.called.should.be.equal(true);
                        done();
                        stub.restore();
                        isCalled.should.be.equal(true);
                    }
                });

                stub = sinon.stub(PolicyLockTooltipView.prototype, 'render');

                view.cellTooltip(cellData, function () {
                    isCalled = true;
                });

            });

            it('Checks tree view rendering', function () {
                var stub;

                view.$el.append('<table id="ruleGrid">' +
                    '<tr id ="fakeId1">' +
                    '<td id ="treeId"/>' +
                    '<td id ="iconId"/>' +
                    '<td id ="groupnameId"/>' +
                    '</tr>' +
                    '<tr id ="fakeId2">' +
                    '<td id ="treeId">' +
                    '<div class="treeclick"/>' +
                    '</td>' +
                    '<td id ="iconId"/>' +
                    '<td id ="groupnameId"/>' +
                    '</tr>' +
                    '<tr id ="fakeId3">' +
                    '<td id ="treeId">' +
                    '<div class="treeclick"/>' +
                    '</td>' +
                    '<td id ="iconId"/>' +
                    '<td id ="groupnameId"/>' +
                    '</tr>' +
                    '<tr id ="fakeId4">' +
                    '<td id ="treeId"/>' +
                    '<td id ="iconId"/>' +
                    '<td id ="groupnameId"/>' +
                    '</tr>' +
                    '<tr id ="fakeId5">' +
                    '<td id ="treeId"/>' +
                    '<td id ="iconId"/>' +
                    '<td id ="groupnameId"/>' +
                    '</tr>' +
                    '</table>');

                var stubPosiTree, stubPosiIcon, stub3, stubGet, obj;

                stubPosiTree = sinon.stub(view, 'getTreeColumnPosition', function () {
                    return 0;
                });

                stubPosiIcon = sinon.stub(view, 'getIconsColumnPosition', function () {
                    return 1;
                });

                tableStub.restore();

                tableStub = sinon.stub(view, 'getGridTable', function () {
                    return view.$el.find('#ruleGrid')
                });

                obj = {

                    'fakeId1': {'name': 'fakeName1',
                        'rule-level': 1,
                        'rule-type': 'RULE'
                    },

                    'fakeId2': {'name': 'fakeName2',
                        'rule-level': 1,
                        'rule-type': 'RULE'
                    },
                    'fakeId3': {'name': 'fakeName3',
                        'rule-level': 0,
                        'rule-type': 'RULE'
                    },
                    'fakeId4': {'name': 'fakeName4',
                        'rule-level': 2,
                        'rule-type': 'RULE'
                    },
                    'fakeId5': {'name': 'fakeName5',
                        'rule-level': 2,
                        'rule-type': 'RULE'
                    }

                };

                stubGet = sinon.stub(view.collection, 'get', function (id) {
                    return {
                        id: id,
                        get: function (key) {
                        }
                    }
                });


                view.addTreeViewRendering();


                stubPosiTree.restore();
                stubPosiTree.restore();
                stubGet.restore();
            });

            it('Checks the click action of tree div', function() {

                var stub, stub2, treeEl, obj, selectionStub, isExpanded = true, collapse = false;

                selectionStub = sinon.stub(view, 'groupExpandCollapseHandler');
                obj = {
                    'name': 'fakeName1',
                    'rule-level': 2,
                    'rule-type': 'RULE'
                };

                stub = sinon.stub(view.collection, 'get', function (id) {
                    return {
                        id: id,
                        get: function (key) {
                            if(key === 'expanded') {
                                return isExpanded;
                            }
                            return true;
                        }
                    }
                });

                stub2 = sinon.stub(view, 'getDataIds', function() {
                    return [{},{}];
                });
                treeEl = view.$el.find("div.treeclick");


                // check collapse
                $(treeEl).trigger('click');

                // check expand
                isExpanded = false;
                $(treeEl).trigger('click');

                stub.restore();
                stub2.restore();

                selectionStub.restore();
            });
        });


        describe('Notifications:', function () {
            it('Checks notification subscription', function () {
                var stub, handler, expected, stub2, clock;
                stub = sinon.stub(view.smSSEEventSubscriber, 'startSubscription');
                view.delayedTask = true;
                stub2 = sinon.stub(view, 'handleNotification');

                view.policyManagementConstants = collection.policyManagementConstants;

                expected = [view.policyManagementConstants.BASE_POLICY_URL,
                    view.policyManagementConstants.getPolicyLockUrl(),
                    view.policyManagementConstants.getPolicyUnlockUrl()];

                view.subscribeNotifications();

                stub.called.should.be.equal(true);
                stub.args[0][0].toString().should.be.equal(expected.toString());
                handler = stub.args[0][1];


                clock = sinon.useFakeTimers();


                handler.call(view);
                clock.tick(1000);

                stub2.called.should.be.equal(true);
                stub.restore();
                stub2.restore();
                clock.restore();
            });

            it('Checks handle notification', function () {
                var stub;

                stub = sinon.stub(view.collection, 'fetch');

                view.handleNotification();

                stub.called.should.be.equal(true);

                stub.restore();

            });


            it('Checks stop notification', function () {
                var stub;

                stub = sinon.stub(view.smSSEEventSubscriber, 'stopSubscription');

                view.unSubscribeNotifications();

                stub.called.should.be.equal(true);
                (view.smSSEEventSubscriber === null).should.be.equal(true);
                (view.sseEventSubscriptions === null).should.be.equal(true);

                stub.restore();

            });
        });

        describe('Search/Sort:', function () {
            it('Checks if the search option is set properly', function () {
                var option = 'fakeSearch';

                view.setSearchOptions(option);
                view.filterSearchSortOptions["SEARCH"].should.be.equal(option);

            });

            it('Checks if the filter option is set properly', function () {
                var option = 'fakeFilter';

                view.setFilterOptions(option);
                view.filterSearchSortOptions["FILTER"].should.be.equal(option);

            });

            it('Checks if the sort option is set properly', function () {
                var option = 'fakeSort';

                view.setSortOptions(option);
                view.filterSearchSortOptions["SORT"].should.be.equal(option);
            });

            it('Checks if the sort, filter, sort options are reset properly', function () {

                view.resetFilterSearchSortOptions();

                (view.filterSearchSortOptions["SORT"] === undefined).should.be.equal(true);
                (view.filterSearchSortOptions["FILTER"] === undefined).should.be.equal(true);
                (view.filterSearchSortOptions["SEARCH"] === undefined).should.be.equal(true);
            });


            it('Checks if the sorting is handled properly', function () {

                var stub, stub2, columnIndex = 1, columnName = 'fakeName', sortOrder = 1;
                stub = sinon.stub(view.collection, 'fetch');
                stub2 = sinon.stub(view, 'setSortOptions');

                view.handleSorting(columnIndex, columnName, sortOrder);

                stub.called.should.be.equal(true);

                stub2.called.should.be.equal(true);
                stub2.args[0][0].columnName.should.be.equal(columnName);
                stub2.args[0][0].sortOrder.should.be.equal(sortOrder);

                stub.restore();
                stub2.restore();

            });

            it('Checks if the search/filter option is added properly', function () {
                var option, tokens = [], stub1, stub2;

                option = view.addSearchFilter();
                option.showFilter.quickFilters[0].key.should.be.equal(view.policyManagementConstants.HIDE_POLICIES_WITH_NO_DEVICES);
                option.showFilter.quickFilters[1].key.should.be.equal(view.policyManagementConstants.HIDE_POLICIES_WITH_NO_RULES);

                stub1 = sinon.stub(view.collection, 'formatSearchString', function (ar) {
                    return ar.toString();
                });
                stub2 = sinon.stub(view.collection, 'fetch');

                tokens.push(['t1', 't2']);
                tokens.push([',']);
                tokens.push('t3');
                tokens.push([',']);
                tokens.push(['t4', 't5']);


                option.searchResult(tokens, function () {
                });

                stub1.called.should.be.equal(true);

                stub2.called.should.be.equal(true);
                stub1.args[0][0].should.include('t1');
                stub1.args[0][0].should.include('t2');

                stub2.args[0][0].filterSearchSortOptions.FILTER.should.be.equal('t1,t2+and+t4,t5');
                stub2.args[0][0].filterSearchSortOptions.SEARCH.should.be.equal('t3');
                stub2.args[0][0].url.should.be.equal(view.collection.url());

                tokens.push([',']);
                tokens.push('t6');

                option.searchResult(tokens, function () {
                });

                stub2.args[1][0].filterSearchSortOptions.FILTER.should.be.equal('t1,t2+and+t4,t5');
                stub2.args[1][0].filterSearchSortOptions.SEARCH.should.be.equal('(t3 and t6)');


                stub1.restore();
                stub2.restore();

            });

        });

        describe('Grid and Selections:', function () {

            it('Check if the selections are toggled properly', function () {
                var spy, isExpanded = false, policy = {
                    get: function () {
                        return isExpanded;
                    },
                    set: function () {
                        isExpanded = !isExpanded;
                    }
                };
                spy = sinon.spy(policy, 'set');
                view.toggleSelections(policy);
                spy.called.should.be.equal(true);

                spy.args[0][0].should.be.equal('expanded');
                spy.args[0][1].should.be.equal(true);

                view.toggleSelections(policy);

                spy.args[1][0].should.be.equal('expanded');
                spy.args[1][1].should.be.equal(false);

                spy.restore();
            });


            it('Checks the get policy method', function () {
                var spy = sinon.spy(_, 'pluck'), stub;

                stub = sinon.stub(view.collection, 'toJSON', function () {
                    return ['fakeData'];
                });

                view.getPolicies(view.collection);

                spy.called.should.be.equal(true);

                spy.args[0][0].should.include('fakeData');
                spy.args[0][1].should.be.equal('policy');

                spy.restore();

                stub.restore();
            });

            it('Checks if the expand/collapse handler is called properly', function () {

                var policy = 'fakePolicy', stub;

                stub = sinon.stub(view, 'reloadGridData');

                view.groupExpandCollapseHandler(policy);

                stub.called.should.be.equal(true);

                stub.args[0][0].should.be.equal(policy);

                stub.restore();


            });

            it('Checks if the empty grid rows is called properly', function () {

                var stub;

                stub = sinon.stub(view, 'getGridTable', function () {
                    return {
                        jqGrid: function (key) {
                            key.should.be.equal('clearGridData');
                        }
                    }
                });

                view.emptyGridRows();

                stub.called.should.be.equal(true);


                stub.restore();

            });


            it('Checks if the reload grid data is called properly', function () {

                var policy = 'fakePolicy', stub, stub2, stub3, stub4, stub5, p1, p2;

                p1 = {
                    isStatic: true,
                    expanded: true,
                    'policy-position': 'POST'
                };

                p2 = {
                    expanded: true,
                    'policy-position': 'POST'
                };

                stub = sinon.stub(view, 'toggleSelections');
                stub2 = sinon.stub(view.collection, 'toJSON', function () {
                    return [
                        {policy: p1},
                        {policy: p2}
                    ]
                });
                stub3 = sinon.stub(view, 'emptyGridRows');
                stub4 = sinon.stub(view.gridWidgetObject, 'addPageRows');
                stub5 = sinon.stub(view, 'addTreeViewRendering');

                view.reloadGridData(policy);

                stub.called.should.be.equal(true);

                stub.args[0][0].should.be.equal(policy);
                stub3.called.should.be.equal(true);

                stub4.called.should.be.equal(true);
                stub4.args[0][1].numberOfPage.should.be.equal(1);
                stub4.args[0][1].totalPages.should.be.equal(1);

                view.collection.resetCollection.should.be.equal(false);
                stub5.called.should.be.equal(true);


                stub.restore();
                stub2.restore();
                stub4.restore();
                stub3.restore();
                stub5.restore();


            });
        });

        describe('Launch Views: ', function () {
            var spy;
            before(function () {
                view.options.context.startActivity = function () {
                };
            });

            beforeEach(function () {

                spy = sinon.spy(view.options.context, 'startActivity');

            });

            afterEach(function () {
                spy.restore();
            });
            it('Checks if the device view is launched properly', function () {
                var policy = '"fakePolicy"', wizard = '"fakeWizard"';

                view.$el.bind('launchDevicesView', $.proxy(view.launchDevicesView, view));
                view.$el.attr('data-policy-obj', policy);

                view.$el.trigger('launchDevicesView');

                spy.called.should.be.equal(true);
                spy.args[0][0].extras.data.should.be.equal(JSON.parse(policy));


            });


            it('Checks if the rules view is launched properly', function () {
                var policy = 'fakePolicy', wizard = 'fakeWizard';

                view.$el.bind('launchRulesView', $.proxy(view.launchRulesView, view));
                view.$el.attr('data-policy-obj', policy);
                view.$el.attr('launchWizard', wizard);

                view.$el.trigger('launchRulesView');

                spy.called.should.be.equal(true);
                spy.args[0][0].extras.objectId.should.be.equal(policy);
                spy.args[0][0].extras.launchWizard.should.be.equal(wizard);
                spy.args[0][0].extras.view.should.be.equal('rules');

            });


        });
    });
});