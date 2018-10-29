/**
 * Created by skesarwani on 7/25/16.
 */
define([], function() {
    var mockLayoutWidgetOptions, spyLayoutBuild,
        mockRuleObjectGridViewObject, spyGridId, spyLaunchActivity,
        spydoClose, spyUpdatePanel,spySharedObjectsPanel;

    spyGridId = sinon.spy(function() {
        return this;
    });
    spyLaunchActivity = sinon.spy(function() {
        return this;
    });
    spyUpdatePanel = sinon.spy(function() {
        return this;
    });
    spyLayoutBuild = sinon.spy(function() {
      return this;
     }); 
     spydoClose = sinon.spy(function() {
        return ;
    });
     spySharedObjectsPanel = sinon.spy(function() {
        return ;
    });
    var stubs = {
        'widgets/layout/layoutWidget': function(options) {
            console.log('Layout Widget mock class');
            this.options = options;
            mockLayoutWidgetOptions = options;
            this.build = spyLayoutBuild;
            this.updatePanel = spyUpdatePanel;
        },
        '/installed_plugins/base-policy-management/js/policy-management/rules/views/ruleObjectsGridView.js': function(options) {
            this.options = options;
            mockRuleObjectGridViewObject = this;
            this.setRuleGridId = spyGridId;
            this.launchActivity = spyLaunchActivity;
            this.doClose = spydoClose;
        }
    };

    var context = createContext(stubs, 'testRulesIntegratedView');
    context(['/installed_plugins/base-policy-management/js/policy-management/rules/views/rulesIntegratedView.js'], function(RulesIntegratedView) {
        describe('Rules Page Integrated View containing both Rules grid and Objects Grid View Tests', function() {
            var testContextObj1 = {
                    a: 1,
                    b: 3
                },
                testObjectsViewData = [{
                    id: 'ADDRESS',
                    text: 'Address',
                    action: 'slipstream.intent.action.ACTION_LIST_POLICY_RULES',
                    mime_type: 'vnd.juniper.net.addresses'
                }, {
                    id: 'SERVICE',
                    text: 'Service',
                    action: '',
                    mime_type: ''
                }],
                testRulesView = {};

            it('Test view initialize', function() {
                var rulesIntegratedView = new RulesIntegratedView(testContextObj1, testRulesView, testObjectsViewData);
                rulesIntegratedView.should.exist;
                assert.equal(rulesIntegratedView.context, testContextObj1);
                assert.equal(rulesIntegratedView.rulesView, testRulesView);
                assert.equal(rulesIntegratedView.objectsViewData, testObjectsViewData);
            });

            it('Test view callMethodForChildViews', function() {
                var rulesIntegratedView = new RulesIntegratedView(testContextObj1, testRulesView, testObjectsViewData),
                    spyAnyMethod = sinon.spy(),
                    testChildView = {
                        'anyMethod': spyAnyMethod
                    };

                rulesIntegratedView.childViews = [testChildView];
                rulesIntegratedView.callMethodForChildViews('anyMethod', ['a', 1, {
                    a: 1
                }]);
                assert(spyAnyMethod.calledOnce);
                assert(spyAnyMethod.calledOn(testChildView));
                assert(spyAnyMethod.calledWithExactly('a', 1, {
                    a: 1
                }));
            });

            it('Test view close', function() {
                var rulesIntegratedView = new RulesIntegratedView(testContextObj1, testRulesView, testObjectsViewData),
                    spyCallMethodForChildViews = sinon.spy();
                rulesIntegratedView.callMethodForChildViews = spyCallMethodForChildViews;
                rulesIntegratedView.close('a', 1);
                assert(spyCallMethodForChildViews.calledOnce);
                assert(spyCallMethodForChildViews.calledWith('close'));
                assert(spyCallMethodForChildViews.getCalls()[0].args[1][0] === 'a');
                assert(spyCallMethodForChildViews.getCalls()[0].args[1][1] === 1);
            });

            it('Test view afterRender', function() {
                var rulesIntegratedView = new RulesIntegratedView(testContextObj1, testRulesView, testObjectsViewData),
                    spyCallMethodForChildViews = sinon.spy();
                rulesIntegratedView.callMethodForChildViews = spyCallMethodForChildViews;
                rulesIntegratedView.afterRender('a', 1);
                assert(spyCallMethodForChildViews.calledOnce);
                assert(spyCallMethodForChildViews.calledWith('afterRender'));
                assert(spyCallMethodForChildViews.getCalls()[0].args[1][0] === 'a');
                assert(spyCallMethodForChildViews.getCalls()[0].args[1][1] === 1);
            });

            it('Test view onShow', function() {
                var rulesIntegratedView = new RulesIntegratedView(testContextObj1, testRulesView, testObjectsViewData),
                    spyCallMethodForChildViews = sinon.spy();
                rulesIntegratedView.callMethodForChildViews = spyCallMethodForChildViews;
                rulesIntegratedView.onShow('a', 1);
                assert(spyCallMethodForChildViews.calledOnce);
                assert(spyCallMethodForChildViews.calledWith('onShow'));
                assert(spyCallMethodForChildViews.getCalls()[0].args[1][0] === 'a');
                assert(spyCallMethodForChildViews.getCalls()[0].args[1][1] === 1);
            });

            it('Test view beforeClose', function() {
                var rulesIntegratedView = new RulesIntegratedView(testContextObj1, testRulesView, testObjectsViewData),
                    spyCallMethodForChildViews = sinon.spy();
                rulesIntegratedView.callMethodForChildViews = spyCallMethodForChildViews;
                rulesIntegratedView.beforeClose('a', 1);
                assert(spyCallMethodForChildViews.calledOnce);
                assert(spyCallMethodForChildViews.calledWith('beforeClose'));
                assert(spyCallMethodForChildViews.getCalls()[0].args[1][0] === 'a');
                assert(spyCallMethodForChildViews.getCalls()[0].args[1][1] === 1);
            });

            it('Test view afterClose', function() {
                var rulesIntegratedView = new RulesIntegratedView(testContextObj1, testRulesView, testObjectsViewData),
                    spyCallMethodForChildViews = sinon.spy();
                rulesIntegratedView.callMethodForChildViews = spyCallMethodForChildViews;
                rulesIntegratedView.afterClose('a', 1);
                assert(spyCallMethodForChildViews.calledOnce);
                assert(spyCallMethodForChildViews.calledWith('afterClose'));
                assert(spyCallMethodForChildViews.getCalls()[0].args[1][0] === 'a');
                assert(spyCallMethodForChildViews.getCalls()[0].args[1][1] === 1);
            });

            it('Test view render', function() {
                var rulesIntegratedView = new RulesIntegratedView(testContextObj1, testRulesView, testObjectsViewData),
                    spyCreateLayout = sinon.spy();
                rulesIntegratedView.createLayout = spyCreateLayout;
                rulesIntegratedView.render();
                assert(spyCreateLayout.calledOnce);
            });
            it('Test view createLayout with only rules grid', function() {

                var rulesIntegratedView = new RulesIntegratedView(testContextObj1,
                        testRulesView, []),
                    testPanelContent = {
                        type: 'column',
                        id: 'grids',
                        content: [{
                            id: 'rulesPanel',
                            content: testRulesView,
                            isClosable: false,
                            isExpandable: false,
                            height: 100,
                            width: 100
                        }]
                    },
                    spyCallMethodForChildViews = sinon.spy(),

                    spyCallbindsharedObjectsEvents = sinon.spy();


                rulesIntegratedView.callMethodForChildViews = spyCallMethodForChildViews;
                rulesIntegratedView.bindSharedObjectsEvents = spyCallbindsharedObjectsEvents;
                rulesIntegratedView.createLayout();

                assert.equal(mockLayoutWidgetOptions.panels[0].content.length, 1);
                assert.deepEqual(mockLayoutWidgetOptions.panels[0], testPanelContent);
                assert(spyLayoutBuild.calledOnce);
                assert(spyCallMethodForChildViews.calledOnce);
                assert(spyCallMethodForChildViews.calledWithExactly('beforeRender'));
                
            });

            it('Test view createLayout with both rules grid data', function() {
                
                var prefVal = 'sm:fw-rules:shared_object_panel_type';
                var stub = sinon.stub(Slipstream.SDK.Preferences, 'fetch', function () {
                            return prefVal;
                        });
                
                var testRulesView = {
                        a: 56,
                        getObjectsPanelPreferenceKey : function() {
                            return prefVal
                         },
                        getGridTable: function() {
                            return {
                                'attr': function() {
                                    return "gridTableId"
                                }
                            }
                        }
                    },
                    layoutwidget = { },
                    rulesIntegratedView = new RulesIntegratedView(testContextObj1, testRulesView, testObjectsViewData),
                    
                    spyCallMethodForChildViews = sinon.spy(),
                    spyCallbindsharedObjectsEvents = sinon.spy(),
                    spyshowObjectsGridPanel = sinon.spy(function() {
                        return this;
                    });
                
                rulesIntegratedView.callMethodForChildViews = spyCallMethodForChildViews;
                rulesIntegratedView.bindSharedObjectsEvents = spyCallbindsharedObjectsEvents;
                rulesIntegratedView.showObjectsGridPanel = spyshowObjectsGridPanel;
                
                rulesIntegratedView.createLayout();
                testPanelContent = {
                        type: 'column',
                        id: 'grids',
                        content: [{
                                id: 'rulesPanel',
                                content: testRulesView,
                                isClosable: false,
                                isExpandable: false,
                                height: 100,
                                width: 100
                            }
                            
                        ]
                    };
                
                mockLayoutWidgetOptions.container.should.exist;
                assert.equal(mockLayoutWidgetOptions.panels[0].content.length, 1);
                assert.deepEqual(mockLayoutWidgetOptions.panels[0], testPanelContent);
                assert(spyLayoutBuild.called);
                assert(spyCallMethodForChildViews.calledOnce);
                assert(spyCallMethodForChildViews.calledWithExactly('beforeRender'));
                testRulesView = {};
                stub.restore();
            });
            it("bind shared objects events - with objects ", function() {
                var   rulesView, rulesIntegratedView,ruleObjectView
                    layoutwidget = {};
                testRulesView = {
                    actionEvents: {
                        'ADDRESS': {
                            name: "ADDRESS"
                        },
                        'SERVICE': {
                            name: 'SERVICE'
                        }
                    }
                };
                
                rulesIntegratedView = new RulesIntegratedView(testContextObj1, testRulesView, testObjectsViewData);
               rulesIntegratedView.objectsViewData = testObjectsViewData;
               rulesIntegratedView.rulesView = testRulesView;
               var stub = sinon.stub(rulesIntegratedView, 'showObjectsGridPanel', function () {
                     return ;
                });
                 rulesIntegratedView.bindSharedObjectsEvents(layoutwidget);
                assert.equal(rulesIntegratedView.rulesView, testRulesView);
                assert.equal(rulesIntegratedView.objectsViewData, testObjectsViewData);
                assert.isObject(rulesIntegratedView.rulesView)
                testRulesView = {};
                stub.restore();
                
            });
            it("bind shared objects events - empty objects", function() {
                testRulesView = null;
                testObjectsViewData = [];
                
                var objectsViewData,  rulesView, layoutwidget, testRulesView = null,
                    rulesIntegratedView = new RulesIntegratedView(testContextObj1, testRulesView, testObjectsViewData);
                layoutwidget = {};               
                 rulesIntegratedView.bindSharedObjectsEvents(layoutwidget);
                assert.isNotObject(rulesIntegratedView.rulesView)
            });
            it("showObjectsGridPanel - with address", function() {
                var prefVal = 'sm:fw-rules:shared_object_panel_type',spyprefKey =  sinon.spy(function() {
                        return prefVal;
                    });
                testRulesView = {
                      getObjectsPanelPreferenceKey :  spyprefKey
                };
                var id = 'ADDRESS',
                    objectsViewData, spyObjectsPanel, ruleObjectView, layoutwidget,
                    rulesIntegratedView = new RulesIntegratedView(testContextObj1, testRulesView, testObjectsViewData);
                layoutwidget = {};
                spyObjectsPanel = sinon.spy();
                rulesIntegratedView.ruleObjectView = {
                    launchActivity: spyLaunchActivity
                };
                rulesIntegratedView.addObjectsPanel = spyObjectsPanel;
                rulesIntegratedView.showObjectsGridPanel(layoutwidget, id);
                assert(spyObjectsPanel.calledOnce);
                assert(spyObjectsPanel.calledWithExactly(layoutwidget));
                assert(spyprefKey.calledOnce);                
                assert(spyLaunchActivity.calledOnce);
                assert(spyLaunchActivity.calledWithExactly(id));

            });
            it("showObjectsGridPanel - with service", function() {
                var prefVal = 'sm:fw-rules:shared_object_panel_type',spyprefKey =  sinon.spy(function() {
                        return prefVal;
                    });
                testRulesView = {
                      getObjectsPanelPreferenceKey :  spyprefKey
                };
                var id = 'SERVICE',
                    objectsViewData, spyObjectsPanel, ruleObjectView, layoutwidget,
                    rulesIntegratedView = new RulesIntegratedView(testContextObj1, testRulesView, testObjectsViewData);
                layoutwidget = {};
                spyObjectsPanel = sinon.spy();
                rulesIntegratedView.ruleObjectView = {
                    launchActivity: spyLaunchActivity
                };
                rulesIntegratedView.addObjectsPanel = spyObjectsPanel;
                rulesIntegratedView.showObjectsGridPanel(layoutwidget, id);
                assert(spyObjectsPanel.calledOnce);
                assert(spyObjectsPanel.calledWithExactly(layoutwidget));
                assert(spyprefKey.called);                
                assert(spyLaunchActivity.called);
                assert(spyLaunchActivity.calledWithExactly(id));

            });

            it('update panel', function() {
                testRulesView = {
                        a: 56,
                        getGridTable: function() {
                            return {
                                'attr': function() {
                                    return "gridTableId"
                                }
                            }
                        }
                    },
                    layoutwidget = {
                        updatePanel: spyUpdatePanel
                    };
                var ruleObjectView,rulesIntegratedView = new RulesIntegratedView(testContextObj1, testRulesView, testObjectsViewData);
                rulesIntegratedView.ruleObjectView = testObjectsViewData; 
                rulesIntegratedView.ruleObjectView.doClose  = spydoClose;
                rulesIntegratedView.addObjectsPanel(layoutwidget);
                var testObjectPanelContent = {
                    id: "objectsPanel",
                    content: mockRuleObjectGridViewObject,
                    isClosable: true,
                    isExpandable: false,
                    height: 40,
                    width: 100
                }
                assert(spyGridId.calledOnce);
                assert(spyGridId.calledWithExactly('gridTableId'));
                assert(spyUpdatePanel.calledOnce);
                assert(spyUpdatePanel.calledWithExactly(testObjectPanelContent));
                assert(spydoClose.calledOnce);
                assert.isObject(rulesIntegratedView.ruleObjectView)
            });


        });
        //    mocha.run();
    });
    deleteContext('testRulesIntegratedView');

});