define([
    '../../views/exportRulesFormView.js',
    '../../../../../../fw-policy-management/js/firewall/rules/constants/fwRuleGridConstants.js'
], function (View, Constants) {

    describe('Export Policy View UT', function () {
        var policyOptions, selectedRecord, view, context;
        before(function () {
            policyOptions = {
                activity: new Slipstream.SDK.Activity()
            };
            context = new Slipstream.SDK.ActivityContext();
            policyOptions.activity.context = context;
            selectedRecord = [
                {"id": 4 }
            ];
            view = new View({activity: policyOptions.activity,
                context: context,
                params: {
                    fileType: "ZIP_FORMAT",
                    selectedPolicies: selectedRecord,
                    policyManagementConstants: Constants
                }
            });
            context.getMessage = function (key) {
                return key;
            };

            context.getHelpKey = function () {
            }

            context.startActivityForResult = function () {
            }

        });

        it('Checks if the view exists', function () {
            view.should.exist;
        });

        it('Checks dynamic form configuration', function () {
            var conf = {};
            view.params.fileType = 'HTML_FORMAT';
            view.addDynamicFormConfig(conf);

            conf.title.should.exists;
            conf.tooltip.should.exists;

            conf = {};
            view.params.fileType = 'PDF_FORMAT';
            view.addDynamicFormConfig(conf);

            conf.title.should.exists;
            conf.tooltip.should.exists;

            conf = {};
            view.params.fileType = 'ZIP_FORMAT';
            view.addDynamicFormConfig(conf);

            conf.title.should.exists;
            conf.tooltip.should.exists;
        });

        it('Checks the close action', function () {
            var event = {
                preventDefault: function () {
                }
            };
            view.options.close = function () {
            };
            var stub1, stub2;
            stub1 = sinon.stub(event, 'preventDefault');
            stub2 = sinon.stub(view.options, 'close');
            view.closeExportView(event);

            stub1.called.should.be.equal(true);
            stub2.called.should.be.equal(true);

            stub1.restore();
            stub2.restore();
        });

        it('Checks the progress text', function () {
            var text = view.getProgressText();
            text.title.should.exist;
            text.fileType.should.exist;
        });

        it('Checks the data to be posted', function () {
            view.params.fileType = 'PDF';
            view.params.filter = 'filter';

            var data = {
                "export-policy-request": {
                    "policy-ids": {
                        "policy-id": '123'
                    },
                    "export-format": 'PDF',
                    "FilterParam": 'filter'
                }
            };
            var text = view.getPostData('123');

            _.isEqual(data, text).should.be.equal(true);

        })


    });

});
