define([
    '../../views/importConfigOCRGridView.js'
], function (View) {

    describe('Import Config OCR Grid View UT', function () {
        var view;
        describe('Basic functionality', function () {
            before(function () {
                $.mockjax.clear();
            });

            it('Checks the view object created properly', function () {
                var options = {
                    context: new Slipstream.SDK.ActivityContext(),
                    dataObject: {
                        uuid: 123,
                        lastScreen: 1
                    },
                    wizardView: {
                        wizard: {
                            gotoPage: function () {

                            }},
                        apiConfig: {
                            api: '123'
                        },
                        showMask: function () {

                        }, removeMask: function () {
                        }
                    },
                    api: {},
                    activity: {
                        overlay: {
                            getOverlayContainer: function () {

                            },

                            destroy: function () {

                            }
                        }
                    }
                };

                view = new View(options);
                view.should.exist;
            });

            it('Checks the initialization done properly', function () {

                view.page.should.be.equal('ocr');
                $.isEmptyObject(view.actionTypes).should.be.equal(false);
                $.isEmptyObject(view.actionKeys).should.be.equal(false);

            });

        });


        describe('Grid:', function () {
            var stubEvents;
            before(function () {
                stubEvents = sinon.stub(view, 'bindEvents');
            });

            after(function () {
                stubEvents.restore();
            });


            it('Checks if the render creates object properly based on pages', function () {
                var stub;

                stub = sinon.stub(view, 'createImportOCRGrid');

                view.render();
                stub.called.should.be.equal(true);
                view.dataObject.lastScreen.should.be.equal(2);
                view.formWidget.should.exist;
                view.progressBar.should.exist;
                stub.restore();

                view.completed = true;
                stub = sinon.stub(view, 'showNoRecordsMsg');

                view.render();
                stub.called.should.be.equal(true);
                stub.restore();

                view.dataObject.lastScreen = 3;
                stub = sinon.stub(view.wizardView.wizard, 'gotoPage');
                view.render();
                stub.called.should.be.equal(true);
                stub.args[0][0].should.be.equal(0);


                stub.restore();
            });


            it('Checks if the ocr grid is created properly', function () {
                var stub;
                stub = sinon.stub(view, 'createGrid');

                $.mockjax({
                    url: '/api/juniper/sd/policy-management/123/object-conflicts?*',
                    type: 'GET',
                    status: 200,
                    responseText: {
                        'object-conflicts': {
                            'object-conflict': ['conflict1', 'conflict2']
                        }
                    }
                });


                view.createImportOCRGrid();

                stubEvents.called.should.be.equal(true);

                view.importConfigOCRGrid.should.exist;

                stub.restore();
            });

            it('Checks if the action is permitted on the ocr grid', function () {
                var result, permittedResolution, currAction;
                result = view.isActionPermitted();
                result.should.be.equal(false);

                currAction = 'ActionToPass';
                permittedResolution = [
                    {'resolution-name': 'fakeAction'}
                ];

                result = view.isActionPermitted(permittedResolution, currAction);
                result.should.be.equal(false);

                permittedResolution = [
                    {'resolution-name': 'fakeAction'},
                    {'resolution-name': 'ActionToPass'}
                ];

                result = view.isActionPermitted(permittedResolution, currAction);
                result.should.be.equal(true);
            });

            it('Checks if the action is approved or not', function () {

                var result, action = 'fakeAction', approveStatus;

                view.conflictMap = [
                    {'permitted-resolutions': {
                        'object-resolution-action': [
                            {
                                'resolution-name': action
                            }
                        ]
                    }},
                    {'permitted-resolutions': {
                        'object-resolution-action': [
                            {
                                'resolution-name': 'anyOtherAction'
                            }
                        ]
                    }},
                    {'permitted-resolutions': {
                        'object-resolution-action': [
                            {
                                'resolution-name': 'RENAME_NEW'
                            }
                        ]
                    }}
                ];
                result = view.isApproved(0, action);
                result.should.be.equal(true);

                result = view.isApproved(1, action);
                result.should.be.equal(false);
            });


            it('Checks progress bar close callback', function () {
                var stub = sinon.stub(view.activity.overlay, 'destroy');
                view.onProgressBarTimeOut();
                stub.called.should.be.equal(true);
                stub.restore();
            });


            it('Check if the notifications are unsubscribe on close', function () {
                // nothing to check here.. not defined
                view.unSubscribeNotificationOnClose();
            });


            it('Returns the title properly', function () {
                var title = view.getTitle();
                title.should.be.equal("");
            });

            it('Sets the summary screen', function () {
                view.getSummary();
                view.dataObject.lastScreen.should.be.equal(3);
            });

            it('Checks if the correct message is shown when no records are available', function () {
                var stub = sinon.stub(view.formWidget, 'showFormError');
                view.showNoRecordsMsg();
                view.$el.find('.ocractionbuttonsplaceholder').html().should.be.equal('');

                stub.called.should.be.equal(true);

                stub.restore();
            });

        });


        describe('Bind event:', function () {
            var stub, stub1;
            before(function () {
                view.bindEvents();
            });

            beforeEach(function () {
                stub = sinon.stub(view.importConfigOCRGrid, 'editRow');
                stub1 = sinon.stub(view.importConfigOCRGrid, 'removeEditModeOnRow');
            });

            afterEach(function () {
                stub.restore();
                stub1.restore();
            });

            it('Checks if the rename action is triggered properly', function () {

                view.$el.trigger(view.actionEvents.renameobject, [
                    {selectedRows: [
                        {id: 2}
                    ] }
                ]);
                stub1.called.should.be.equal(true);
                stub.called.should.be.equal(true);
                stub.args[0][1].id.should.be.equal(2);
                stub.args[0][0].resolution.should.be.equal("RENAME_NEW");

                stub.args[0][0].id.should.be.equal(2);
                stub.args[0][1].resolution.should.be.equal("RENAME_NEW");


            });

            it('Checks if the keep new action is triggered properly', function () {
                view.conflictMap.push(
                    {'permitted-resolutions': {
                        'object-resolution-action': [
                            {
                                'resolution-name': 'KEEP_NEW'
                            }
                        ]
                    },
                        'new-name': 'newName'});
                view.$el.trigger(view.actionEvents.overwrite, [
                    {selectedRows: [
                        {id: 3,
                            'new-name': 'originalName'}
                    ] }
                ]);
                stub1.called.should.be.equal(true);
                stub.called.should.be.equal(true);
                stub.args[0][0].id.should.be.equal(3);
                stub.args[0][0]['new-name'].should.be.equal('newName');
                stub.args[0][0].resolution.should.be.equal("KEEP_NEW");

                stub.args[0][1].id.should.be.equal(3);
                stub.args[0][1]['new-name'].should.be.equal('newName');
                stub.args[0][1].resolution.should.be.equal("KEEP_NEW");

            });

            it('Checks if the keep original action is triggered properly', function () {
                view.conflictMap.push(
                    {'permitted-resolutions': {
                        'object-resolution-action': [
                            {
                                'resolution-name': 'KEEP_OLD'
                            }
                        ]
                    },
                        'new-name': 'originalName'});
                view.$el.trigger(view.actionEvents.keepobject, [
                    {selectedRows: [
                        {id: 4,
                            'new-name': 'newName'}
                    ] }
                ]);
                stub1.called.should.be.equal(true);
                stub.called.should.be.equal(true);
                stub.args[0][0].id.should.be.equal(4);
                stub.args[0][0]['new-name'].should.be.equal('originalName');
                stub.args[0][0].resolution.should.be.equal("KEEP_OLD");

                stub.args[0][1].id.should.be.equal(4);
                stub.args[0][1]['new-name'].should.be.equal('originalName');
                stub.args[0][1].resolution.should.be.equal("KEEP_OLD");

            });


            it('Checks the ocr tooltip', function() {

                view.$el.bind('tooltipTest', $.proxy(view.showObjectTooltip, view));
                view.$el.attr('datacell', '"test tooltip"');
                view.$el.attr('title', '"test title"');
                view.$el.trigger('tooltipTest', view);
                view.tooltipFormView.$el.find(".tooltipInfo").html().should.be.equal("test tooltip");
            });


        });

        describe('OCR Grid Data', function () {


            it('Checks if the ocr data is cached properly', function () {
                var stub, id = 3;
                view.dataObject.ocrRecords = [
                    {'object-resolution-action': [
                        {
                            'resolution-name': 'KEEP_NEW'
                        }
                    ]}
                ];

                stub = sinon.stub(view.importConfigOCRGrid, 'getAllVisibleRows', function () {
                    return [
                        {
                            id: id
                        }
                    ]
                });
                view.cacheOCRData();
                view.conflictMap[id].id.should.be.equal(id);

                stub.restore();
            });

            it('Checks if the conflicts are resolved properly: No conflicts', function () {

                view.apis = {
                    getGenerateSummaryReport: function () {

                    },
                    calculateConflicts: function () {
                    }
                };

                var stub;
                stub = sinon.stub(view.apis, 'getGenerateSummaryReport');
                view.resolveConflicts();
                stub.called.should.be.equal(true);

                stub.restore();
            });

            it('Checks if the conflicts are resolved properly: With conflicts- Success', function (done) {
                view.dataObject.conflicts = ['conflict1', 'conflict2'];

                var stub = sinon.stub(view.apis, 'calculateConflicts');
                $.mockjax.clear();
                $.mockjax({
                    url: '/api/juniper/sd/policy-management/import/object-conflicts?*',
                    type: 'post',
                    status: 200,
                    responseText: {
                        'object-conflicts': {
                            'object-conflict': ['conflict1', 'conflict2']
                        }
                    },
                    response: function (settings, done2) {
                        done2();
                        stub.called.should.be.equal(true);
                        done();
                        stub.restore();
                    }
                });
                view.resolveConflicts();
            });

            it('Checks if the conflicts are resolved properly: With conflicts- Error', function (done) {
                view.dataObject.conflicts = ['conflict1', 'conflict2'];
                $.mockjax.clear();
                var stub = sinon.stub(view.progressBar, 'destroy');
                $.mockjax({
                    url: '/api/juniper/sd/policy-management/import/object-conflicts?*',
                    type: 'post',
                    status: 404,
                    responseText: {
                        'object-conflicts': {
                            'object-conflict': ['conflict1', 'conflict2']
                        }
                    },
                    response: function (settings, done2) {
                        done2();
                        stub.called.should.be.equal(true);
                        done();
                        stub.restore();
                    }
                });
                view.resolveConflicts();
            });


        });

        describe('Page changes', function () {
            it('checks on the first page on progress', function () {
                view.completed = false;

                var stub, stub2, stub3, key = 'Rename Object';
                stub = sinon.stub(view.wizardView, 'showMask');
                stub3 = sinon.stub(view, 'resolveConflicts');
                stub2 = sinon.stub(view.importConfigOCRGrid, 'getAllVisibleRows', function () {
                    return [
                        {
                            id: 1,
                            resolution: key
                        }
                    ]
                });


                view.beforePageChange(1, 2);
                view.activity.overlay.progressBar.should.be.equal(view.progressBar);

                stub.calledWith(view.progressBar).should.be.equal(true);
                stub3.called.should.be.equal(true);
                view.dataObject.conflicts.length.should.be.equal(1);
                view.dataObject.conflicts[0].id.should.be.equal(1);
                view.dataObject.conflicts[0].resolution.should.be.equal(view.actionKeys[key]);

                stub.restore();
                stub2.restore();
                stub3.restore();
            });

            it('Checks if the close handles application gracefully', function () {

                var stub;
                stub = sinon.stub(view, 'unSubscribeNotificationOnClose');
                view.close();

                stub.called.should.be.equal(true);
                stub.restore();
            });


            it('checks on the first page on progress, next step incorrect', function () {

                var returnVal = view.beforePageChange(1, 0);
                returnVal.should.be.equal(true);
            });

            it('checks on the first page completed', function () {
                view.completed = true;

                var stub;
                stub = sinon.stub(view.wizardView, 'removeMask');

                view.beforePageChange(1, 2);

                stub.called.should.be.equal(true);
                stub.restore();
            });

        });

    });


});