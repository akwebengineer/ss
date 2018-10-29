define([
    '../importConfigActivity.js',
    '../../../../ui-common/js/common/intentActions.js',
    '../views/importConfigWizardView.js'
], function (Activity, IntentActions, View) {

    var importActivity;

    describe('Import Config Activity UT', function () {
        before(function () {
            importActivity = new Activity();
        });

        it('Checks if the activity object is created properly', function () {
            importActivity.should.exist;
            importActivity.should.be.instanceof(Slipstream.SDK.Activity);
        });

        it('Checks if the on start calls the correct on different actions: Import', function () {
            var stub = sinon.stub(importActivity, 'onImportIntent');
            Slipstream.SDK.Intent.action = {
                ACTION_IMPORT: 'ACTION_IMPORT'
            };
            importActivity.intent = {
                action: Slipstream.SDK.Intent.action.ACTION_IMPORT
            };
            importActivity.onStart();
            stub.called.should.be.equal(true);
            stub.restore();
        });

        it('Checks if the on start calls the correct on different actions: Import Zip', function () {
            var stub = sinon.stub(importActivity, 'onImportZipIntent');
            importActivity.intent = {
                action: IntentActions.ACTION_IMPORT_ZIP
            };
            importActivity.onStart();
            stub.called.should.be.equal(true);
            stub.restore();
        });

        it('Checks if the on start calls the correct on different actions: Import Device Change', function () {
            var stub = sinon.stub(importActivity, 'onImportDeviceChangeIntent');
            importActivity.intent = {
                action: IntentActions.ACTION_IMPORT_DEVICECHANGE
            };
            importActivity.onStart();
            stub.called.should.be.equal(true);
            stub.restore();
        });

        it('Checks if the on start calls the correct on different actions: Rollback', function () {
            var stub = sinon.stub(importActivity, 'onRollbackIntent');
            importActivity.intent = {
                action: IntentActions.ACTION_ROLLBACK
            };
            importActivity.onStart();
            stub.called.should.be.equal(true);
            stub.restore();
        });


        describe('Intents', function () {
            it('Checks if the import intent is defined properly', function () {
                var id = 123, stub, viewStub, initStub;
                importActivity.intent = {
                    action: Slipstream.SDK.Intent.action.ACTION_IMPORT,
                    getExtras: function () {
                        return { data: {
                            sdDeviceIds: [id]
                        }
                        }
                    }
                };

                stub = sinon.stub(importActivity, 'buildOverlay');
                viewStub= sinon.stub(View.prototype, 'init');
                initStub= sinon.stub(View.prototype, 'initialize');

                importActivity.onImportIntent();
                stub.called.should.be.equal(true);
                initStub.args[0][0].type.should.be.equal('IMPORT');
                initStub.args[0][0].selectedRecord.id.should.include(id);

                stub.restore();
                viewStub.restore();
                initStub.restore();
            });

            it('Checks if the import zip intent is defined properly', function () {
                var id = 123, stub, viewStub, initStub;
                importActivity.intent = {
                    action: IntentActions.ACTION_IMPORT_ZIP,
                    getExtras: function () {
                        return { data: {
                            fileName: 'file.zip',
                            service: 'service'
                        }
                        }
                    }
                };

                stub = sinon.stub(importActivity, 'buildOverlay');
                viewStub= sinon.stub(View.prototype, 'init');
                initStub= sinon.stub(View.prototype, 'initialize');

                importActivity.onImportIntent();
                stub.called.should.be.equal(true);

                stub.restore();
                viewStub.restore();
                initStub.restore();
            });

            it('Checks if the import device change intent is defined properly', function () {
                var id = 123, stub, viewStub, initStub;
                importActivity.intent = {
                    getExtras: function () {
                        return { data: {
                            sdDeviceIds: [id]
                        }
                        }
                    }
                };

                stub = sinon.stub(importActivity, 'buildOverlay');
                viewStub= sinon.stub(View.prototype, 'init');
                initStub= sinon.stub(View.prototype, 'initialize');

                importActivity.onImportDeviceChangeIntent();
                stub.called.should.be.equal(true);
                initStub.args[0][0].type.should.be.equal('IMPORT_DEVICE_CHANGE');
                initStub.args[0][0].selectedRecord.id.should.be.equal(id);

                stub.restore();
                viewStub.restore();
                initStub.restore();
            });



            it('Checks if the import device change intent is defined properly', function () {
                var selectedRecord = 123, stub, viewStub, initStub;
                importActivity.intent = {
                    getExtras: function () {
                        return { data: {
                            selectedRecord: selectedRecord,
                            service: 'service'
                        }
                        }
                    }
                };

                stub = sinon.stub(importActivity, 'buildOverlay');
                viewStub= sinon.stub(View.prototype, 'init');
                initStub= sinon.stub(View.prototype, 'initialize');

                importActivity.onRollbackIntent();
                stub.called.should.be.equal(true);
                initStub.args[0][0].type.should.be.equal('rollback');
                initStub.args[0][0].selectedRecord.should.be.equal(selectedRecord);
                initStub.args[0][0].service.should.be.equal('service');

                stub.restore();
                viewStub.restore();
                initStub.restore();
            });

        });

    });
});