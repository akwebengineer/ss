define([
    '../../views/importConfigServicesGridView.js'
], function (View) {

    describe('Import Config Service Grid View UT', function () {
        var view, context = new Slipstream.SDK.ActivityContext();
        before(function () {
            var options = {
                dataObject: {
                    uuid: 'UUID',
                    ocrSummaries: [],
                    selectedRecord: {
                        name: 'fakeName',
                        'device-ip': 'fakeIP'
                    },
                    params: {version: 'fakeVersion'}},
                context: context,
                activity: {
                    overlay: {
                        getOverlayContainer: function () {
                        },
                        destroy: function () {
                        },
                        progressBar: {
                            destroy: function () {
                            }
                        }
                    }
                },
                wizardView: {
                    apiConfig: {},
                    showMask: function () {
                    }
                },
                apis: {
                    postManagedServices: function () {
                    }
                }
            };
            view = new View(options);

            $.mockjax.clear();
            $.mockjax({
                "url": '/api/juniper/sd/policy-management/undefined/managed-services?*',
                "type": 'GET',
                status: 200,
                responseText: {
                }

            });

        });
        describe('Basic functionality', function () {


            it('Checks if the object is created successfully', function () {
                view.should.exist;
            });

            it('Checks if the title is created properly', function () {
                var title = view.getTitle();
                title.should.be.equal('');
            });

            it('Checks notifications are un subscribed properly on close', function () {
                view.unSubscribeNotificationOnClose();
                // nothing to test here.. no functionality defined
            });


            it('Checks if the render creates the services grid properly', function () {
                var stub = sinon.stub(view, 'createGrid');


                view.render();
                view.dataObject.isIpsMismatch.should.be.equal(false);
                view.progressBar.should.exist;
                view.formWidget.should.exist;
                view.messageContainer.html().should.be.equal('');
                view.importConfigServicesGrid.should.exist;

                stub.called.should.be.equal(true);
                stub.restore();

            });

        });

        describe('Grid functionality', function () {


            it('Checks if the selections are set properly on grid loaded', function () {
                var stub = sinon.stub(view.importConfigServicesGrid, 'toggleRowSelection'),
                    stub2 = sinon.stub(view, 'getDataIds');
                view.wizardView.contextType = 'IMPORT';
                view.onGridDataLoad();
                stub.called.should.be.equal(false);

                view.wizardView.contextType = 'XYZ';
                view.onGridDataLoad();

                stub.called.should.be.equal(true);
                stub.args[0][1].should.be.equal('selected');
                stub.restore();
                stub2.restore();
            });
        });

        describe('Navigations:', function () {
            it('Checks the close action:', function () {
                var stub = sinon.stub(view.activity.overlay.progressBar, 'destroy'),
                    stub2 = sinon.stub(view, 'unSubscribeNotificationOnClose');
                view.close();

                stub.called.should.be.equal(true);
                stub.restore();

                stub2.called.should.be.equal(true);
                stub2.restore();

            });

            it('Checks the navigation to SigDB', function () {
                view.$el.bind('fakeAction', $.proxy(view.navigateToSigDB, view));

                var stub = sinon.stub(view.activity.overlay, 'destroy'),
                    stub2 = sinon.stub(view.context, 'startActivity');

                view.$el.trigger('fakeAction');

                stub.called.should.be.equal(true);
                stub.restore();

                stub2.called.should.be.equal(true);

                stub2.args[0][0].action.should.be.equal(Slipstream.SDK.Intent.action.ACTION_LIST);
                stub2.args[0][0].data['mime_type'].should.be.equal('vnd.juniper.net.signature-database');

                stub2.restore();
            });

            it('Before page changes actions', function () {

                var stub, stub2;

                stub = sinon.stub(view, 'getSelectedRows', function () {
                    return [];
                });

                stub2 = sinon.stub(view.formWidget, 'showFormError');

                view.showIpsMismatchMsg();


                view.beforePageChange(0, 1);

                stub2.called.should.be.equal(true);
                stub2.restore();
                stub.restore();


                // disallow import
                stub = sinon.stub(view, 'getSelectedRows', function () {
                    return [
                        {'name': 'fakeName', 'service-type': 'IPSPOLICY'}
                    ];
                });

                stub2 = sinon.stub(view, 'showIpsMismatchMsg');

                view.dataObject.isIpsMismatch = true;

                view.beforePageChange(0, 1);

                stub.called.should.be.equal(true);
                stub.restore();
                stub2.called.should.be.equal(true);
                stub2.restore();


                stub = sinon.stub(view, 'getSelectedRows', function () {
                    return [
                        {'name': 'fakeName', 'service-type': 'POLICY'}
                    ];
                });

                stub2 = sinon.stub(view.apis, 'postManagedServices');

                view.dataObject.isIpsMismatch = false;

                view.beforePageChange(0, 1);
                view.postInitiated.should.be.equal(true);
                view.progressBar.should.exist;
                view.activity.overlay.progressBar.should.be.equal(view.progressBar);

                view.dataObject.readyForNext.should.be.equal(false);


                stub.called.should.be.equal(true);
                stub.restore();
                stub2.called.should.be.equal(true);
                stub2.restore();


            });


            it('Checks if the progress bar is destroyed properly', function () {

                var stub;
                stub = sinon.stub(view.activity.overlay, 'destroy');
                view.destroyProgressBar();

                stub.called.should.be.equal(true);
                stub.restore();
            });
        });

        describe('Data', function () {
            it('Check if the summary is properly added', function () {
                var summary;
                view.wizardView.contextType = "IMPORT";

                summary = view.getSummary();
                summary.length.should.be.equal(2);
                summary[0].label.should.be.equal('Selected Device');
                summary[0].value.should.be.equal('fakeName');

                summary[1].label.should.be.equal('Selected Device IP');
                summary[1].value.should.be.equal('fakeIP');


                view.wizardView.contextType = "ABC";

                summary = view.getSummary();
                summary.length.should.be.equal(2);

                summary[0].label.should.be.equal('Selected Policy');
                summary[0].value.should.be.equal('fakeName');

                summary[1].label.should.be.equal('Selected Version');
                summary[1].value.should.be.equal('fakeVersion');

            });

            it('Check no records message', function () {
                var stub = sinon.stub(view.formWidget, 'showFormError');

                view.showNoRecordsMsg();
                view.$el.find('.servicesgridplaceholder').html().should.be.equal('');
                view.$el.find('.servicesactionbuttonsplaceholder').html().should.be.equal('');

                stub.called.should.be.equal(true);
                stub.restore();

            });

            it('Check ips mismatch message', function () {
                var stub = sinon.stub(view.formWidget, 'showFormError');

                view.showIpsMismatchMsg();
                view.$el.find('.servicesactionbuttonsplaceholder').html().should.be.equal('');

                stub.called.should.be.equal(true);
                stub.restore();

            });

        });

    });

});
