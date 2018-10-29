/**
 * UT for export rules view
 *
 * @author Tashi Garg<tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../views/exportRulesView.js',
    '../../views/exportRulesFormView.js'
], function (View, ExportRulesFormView) {

    var view, getMessage, setResult, finish, context, activity, initStub, exportStubAction, render;
    describe('Export Rules view UT', function () {

        before(function () {
            context = new Slipstream.SDK.ActivityContext();
            activity = new Slipstream.SDK.Activity()
            activity.context = context;
            initStub = sinon.stub(View.prototype, 'startExport');

            setResult = sinon.stub(activity, 'setResult', function (value) {
                return value;
            });
            getMessage = sinon.stub(context, 'getMessage', function (value) {
                return value;
            });
            finish = sinon.stub(activity, 'finish');
            exportStubAction = sinon.stub(ExportRulesFormView.prototype, 'exportPolicy');
            render = sinon.stub(ExportRulesFormView.prototype, 'render');

        });

        after(function () {
            getMessage.restore();
            setResult.restore();
            finish.restore();
            exportStubAction.restore();
            render.restore();
        });

        it('Checks if the Export Rules view object is created properly', function () {
            view = new View({
                context: context,
                params: {

                }
            });

            view.should.exist;
            initStub.called.should.be.equal(true);
            initStub.restore();
        });
        it('Checks if the Export Rules view object is created properly, with filter', function () {
            initStub = sinon.stub(View.prototype, 'createConfirmationDialog');
            view = new View({
                context: context,
                params: {
                    filter:  {
                        FilterParam: {
                            'dummyKey': 'dummyVal'
                        }
                    },
                    selectedPolicy: 'dummyPolicy',
                    fileType: 'XYZ'
                }

            });
            view.should.exist;
            initStub.called.should.be.equal(true);
            initStub.restore();
        });
        describe('Export Rules view UT: Confirmation dialog', function () {
            var exportStub;
            beforeEach(function () {
                exportStub = sinon.stub(view, 'startExport');
            });

            afterEach(function () {
                exportStub.restore();
            });

            it('Checks if the Export Rules view confirmation dialog is created properly', function () {
                view.createConfirmationDialog();
                view.confirmationDialogWidget.should.exist;
            });


            it('Confirmation Dialog export all action', function () {
                var stub, action;
                view.confirmationDialogWidget.vent.trigger('exportAll');
                exportStub.called.should.be.equal(true);
                action = exportStub.args[0][0];
                _.isUndefined(action).should.be.equal(true);
            });


            it('Confirmation Dialog export filtered action', function () {
                var stub, action;
                view.confirmationDialogWidget.vent.trigger('exportFiltered');
                exportStub.called.should.be.equal(true);
                action = exportStub.args[0][0];
                action.should.be.equal(true);
            });

            it('Confirmation Dialog destroy action', function () {
                var stub, action;
                stub = sinon.stub(view.confirmationDialogWidget, 'destroy');
                view.confirmationDialogWidget.vent.trigger('cancelEventTriggered');
                stub.called.should.be.equal(true);
                stub.restore();
            });


        });
        describe('Export Rules view UT: Export Action', function () {
            var spy;
            before(function () {
                spy = sinon.spy(ExportRulesFormView.prototype, 'initialize');
            });

            after(function () {
                spy.restore();
            });

            it('Checks the Export Rules view export action: start export without filter', function () {
                view.startExport();
                spy.called.should.be.equal(true);
                spy.args[0][0].params.fileType.should.be.equal('XYZ');
            });


            it('Checks the Export Rules view export action: start export with filter', function () {
                var stub2 = sinon.stub(view.confirmationDialogWidget, 'destroy');
                view.startExport(true);
                view.exportView.$el.bind('dummyEvent', $.proxy(view.exportView.close, view.exportView));
                view.exportView.$el.trigger('dummyEvent') ;

                stub2.called.should.be.equal(true);
            });


        });

    });
});
