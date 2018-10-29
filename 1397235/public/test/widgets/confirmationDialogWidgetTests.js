define([
    'widgets/confirmationDialog/confirmationDialogWidget'
], function (ConfirmationDialogWidget) {
    describe('ConfirmationDialogWidget - Unit tests:', function () {
        var overlayContainer = "overlay_content";

        var CreateUnitTestContext = function (unitTestConf) {

            var defaultTestConf = {
                title: 'Test Confirmation Dialog'
            };

            var extendedTestConf = $.extend(true, defaultTestConf, unitTestConf);

            this.confirmationDialogObj = new ConfirmationDialogWidget(extendedTestConf);

            this.confirmationDialogObj.build();

            this.$overlayContainer = $('#' + overlayContainer);

            this.getDefaultTestConf = function () {
                return defaultTestConf;
            };

            this.destroy = function () {
                this.confirmationDialogObj.destroy();
            }
        };

        describe('Exposed methods exists', function () {

            var conf = {
                title: 'Unit Test Confirmation Dialog'
            };

            var confirmationDialogObj = new ConfirmationDialogWidget(conf);

            it('should exist', function () {
                confirmationDialogObj.should.exist;
            });

            it('should expose a vent', function () {
                confirmationDialogObj.vent.should.exist;
            });

            it('build() should exist', function () {
                assert.isFunction(confirmationDialogObj.build, 'The ConfirmationDialogWidget must have a function named build.');
            });

            it('destroy() should exist', function () {
                assert.isFunction(confirmationDialogObj.destroy, 'The ConfirmationDialogWidget must have a function named destroy.');
            });
        });

        describe('Exposed methods testing', function () {
            var $overlayContainer;

            var conf = {
                title: 'Unit Test Confirmation Dialog'
            };

            var confirmationDialogObj = new ConfirmationDialogWidget(conf);

            beforeEach(function () {
                confirmationDialogObj.build();
                // reference to container element is recreated by Overlay, hence getting th DOM element after build. 
                $overlayContainer = $('#' + overlayContainer);
            });

            afterEach(function () {
                confirmationDialogObj.destroy();
            });

            it('Message overlay should be created', function () {
                assert.equal($overlayContainer.find("div.modals-container").length, 1, "Overlay container should be created in dom");
            });

            it('Message overlay should be destroyed', function () {
                confirmationDialogObj.destroy();
                assert.equal($overlayContainer.find("div.modals-container").length, 0, "Overlay container should be removed from dom");
            });
        });

        describe('UI elements', function () {

            var testContext;

            afterEach(function () {
                testContext.destroy();
            });

            it('-default UI- when no config is provided, yes button be present', function () {
                testContext = new CreateUnitTestContext();
                var $yesElement = testContext.$overlayContainer.find("input.yesButton");
                assert.equal($yesElement.length, 1, "Only one Yes button should exist.");
                assert.equal($yesElement.val(), "Yes", "Label should match the provided config.");
            });

            it('-Title- as text should exist with provided config', function () {
                testContext = new CreateUnitTestContext();
                var $titleElement = testContext.$overlayContainer.find("div.title");
                assert.equal($titleElement.length, 1, "Only one title should exist.");
                var defaultTestConf = testContext.getDefaultTestConf();
                assert.equal($titleElement.text(), defaultTestConf.title, "Label should match the provided config.");
            });

            it('-Title- as HTML should exist with provided config', function () {
                testContext = new CreateUnitTestContext({
                    "title": "<span class='errorImg'></span>test"
                });
                var $titleElement = testContext.$overlayContainer.find("div.title");
                assert.equal($titleElement.length, 1, "Only one title should exist.");
                assert.equal($titleElement.find(".errorImg").length, 1, "Title is HTML");
            });

            it('-Yes- button should exist with provided config', function () {
                var unitTestConf = {
                    yesButtonLabel: 'Yes'
                };
                testContext = new CreateUnitTestContext(unitTestConf);
                var $yesElement = testContext.$overlayContainer.find("input.yesButton");
                assert.equal($yesElement.length, 1, "Only one Yes button should exist.");
                assert.equal($yesElement.val(), unitTestConf.yesButtonLabel, "Label should match the provided config.");
            });

            it('-No- button should exist with provided config', function () {
                var unitTestConf = {
                    noButtonLabel: 'No'
                };
                testContext = new CreateUnitTestContext(unitTestConf);
                var $noElement = testContext.$overlayContainer.find("input.noButton");
                assert.equal($noElement.length, 1, "Only one No button should exist.");
                assert.equal($noElement.val(), unitTestConf.noButtonLabel, "Label should match the provided config.");
            });

            it('-Question- should exist with provided config', function () {
                var unitTestConf = {
                    question: 'Are you sure?'
                };
                testContext = new CreateUnitTestContext(unitTestConf);
                var $questionElement = testContext.$overlayContainer.find("div.question");
                assert.equal($questionElement.length, 1, "Only one question element shhould exist");
                assert.equal($questionElement.text(), unitTestConf.question, "Text should match the provided config.");
            });

            it('-Cancel- link should exist with provided config', function () {
                var unitTestConf = {
                    cancelLinkLabel: 'Cancel'
                };
                testContext = new CreateUnitTestContext(unitTestConf);
                var $cancelLinkElement = testContext.$overlayContainer.find("span.cancelLink");
                assert.equal($cancelLinkElement.length, 1, "Only one cancel link should exist.");
                assert.equal($cancelLinkElement.text(), unitTestConf.cancelLinkLabel, "Label should match the provided config.");
            });

            it('-Warning- should highlight red', function () {
                var unitTestConf = {
                    kind: 'warning'
                };
                testContext = new CreateUnitTestContext(unitTestConf);
                var $warningElement = testContext.$overlayContainer.find("div.confirmationDialog.warning");
                assert.equal($warningElement.length, 1, "warning class should be existing");
            });

            it('-DoNotShowAgainMessage- should exist with provided config', function () {
                var unitTestConf = {
                    doNotShowAgainMessage: 'Do not show this message again'
                };
                testContext = new CreateUnitTestContext(unitTestConf);
                var $doNotShowElement = testContext.$overlayContainer.find("div.doNotShowAgain");
                assert.equal($doNotShowElement.length, 1, "DoNotShowAgainMessage container should be existing");
                assert.equal($doNotShowElement.find("input:checkbox").length, 1, "Checkbox should exist.");
                assert.equal($doNotShowElement.find("span.doNotShowAgainMessageText").length, 1, "Text message should be present.");
            });

            it('Combination of configuration', function () {

                var unitTestConf = {
                    yesButtonLabel: 'Yes',
                    noButtonLabel: 'No',
                    cancelLinkLabel: 'Cancel',
                    question: 'Are you sure?',
                    doNotShowAgainMessage: 'Do not show this message again'
                };

                testContext = new CreateUnitTestContext(unitTestConf);

                var $titleElement = testContext.$overlayContainer.find("div.title");
                var defaultTestConf = testContext.getDefaultTestConf();
                assert.equal($titleElement.text(), defaultTestConf.title, "Label should match the provided config.");
                var $yesElement = testContext.$overlayContainer.find("input.yesButton");
                assert.equal($yesElement.length, 1, "Only one Yes button should exist.");
                var $noElement = testContext.$overlayContainer.find("input.noButton");
                assert.equal($noElement.length, 1, "Only one No button should exist.");
                var $cancelLinkElement = testContext.$overlayContainer.find("span.cancelLink");
                assert.equal($cancelLinkElement.length, 1, "Only one cancel link should exist.");
                var $questionElement = testContext.$overlayContainer.find("div.question");
                assert.equal($questionElement.length, 1, "Only one question element shhould exist");
                var $doNotShowElement = testContext.$overlayContainer.find("div.doNotShowAgain");
                assert.equal($doNotShowElement.length, 1, "DoNotShowAgainMessage container should be existing");
            });
        });

        describe('Callback methods executed', function () {

            beforeEach(function () {
                callbackExecuted = 0;
            });

            afterEach(function () {
                testContext.destroy();
            });

            var testContext;
            var callbackExecuted;
            var callback = function () {
                ++callbackExecuted;
            };

            it('-yesButtonCallback- with "do not show again" checkbox as not checked', function () {

                var yesButtonCallback = function (doNotShowAgain) {
                    ++callbackExecuted;
                    assert.equal(doNotShowAgain, false, "Checkbox not checked, the value should be false");
                };

                var unitTestConf = {
                    yesButtonLabel: 'Yes',
                    yesButtonCallback: yesButtonCallback,
                    doNotShowAgainMessage: 'Do not show this message again'
                };

                testContext = new CreateUnitTestContext(unitTestConf);
                var $yesElement = testContext.$overlayContainer.find("input.yesButton");
                $yesElement.click();
                assert.equal(callbackExecuted, 1, "Callback should be executed.");
            });

            it('-yesButtonCallback- with "do not show again" checkbox as checked', function () {

                var yesButtonCallback = function (doNotShowAgain) {
                    ++callbackExecuted;
                    assert.equal(doNotShowAgain, true, "Checkbox checked, the value should be true");
                };

                var unitTestConf = {
                    yesButtonLabel: 'Yes',
                    yesButtonCallback: yesButtonCallback,
                    doNotShowAgainMessage: 'Do not show this message again'
                };

                testContext = new CreateUnitTestContext(unitTestConf);
                var $yesElement = testContext.$overlayContainer.find("input.yesButton");
                var $doNotShowCheckbox = testContext.$overlayContainer.find("div.doNotShowAgain input:checkbox");
                $doNotShowCheckbox.prop('checked', true);
                $yesElement.click();
                assert.equal(callbackExecuted, 1, "Callback should be executed.");
            });

            it('-yesButtonCallback- with other config elements', function () {

                var yesButtonCallback = function (doNotShowAgain) {
                    ++callbackExecuted;
                    assert.equal(doNotShowAgain, false, "Checkbox not checked, the value should be false");
                };

                var unitTestConf = {
                    yesButtonLabel: 'Yes',
                    noButtonLabel: 'No',
                    cancelLinkLabel: 'Cancel',
                    question: 'Are you sure?',
                    doNotShowAgainMessage: 'Do not show this message again',
                    yesButtonCallback: yesButtonCallback
                };

                testContext = new CreateUnitTestContext(unitTestConf);
                var $yesElement = testContext.$overlayContainer.find("input.yesButton");
                $yesElement.click();
                assert.equal(callbackExecuted, 1, "Callback should be executed.");
            });

            it('-noButtonCallback- should be executed', function () {
                var unitTestConf = {
                    noButtonLabel: 'No',
                    noButtonCallback: callback
                };
                testContext = new CreateUnitTestContext(unitTestConf);
                var $noElement = testContext.$overlayContainer.find("input.noButton");
                $noElement.click();
                assert.equal(callbackExecuted, 1, "Callback should be executed.");
            });

            it('-noButtonCallback- should be executed', function () {
                var unitTestConf = {
                    yesButtonLabel: 'Yes',
                    noButtonLabel: 'No',
                    cancelLinkLabel: 'Cancel',
                    question: 'Are you sure?',
                    doNotShowAgainMessage: 'Do not show this message again',
                    noButtonCallback: callback
                };
                testContext = new CreateUnitTestContext(unitTestConf);
                var $noElement = testContext.$overlayContainer.find("input.noButton");
                $noElement.click();
                assert.equal(callbackExecuted, 1, "Callback should be executed.");
            });

            it('-cancelLinkCallback- should be executed', function () {
                var unitTestConf = {
                    cancelLinkLabel: 'Cancel',
                    cancelLinkCallback: callback
                };
                testContext = new CreateUnitTestContext(unitTestConf);
                var $cancelLinkElement = testContext.$overlayContainer.find("span.cancelLink");
                $cancelLinkElement.click();
                assert.equal(callbackExecuted, 1, "Callback should be executed.");
            });

            it('-cancelLinkCallback- should be executed', function () {
                var unitTestConf = {
                    yesButtonLabel: 'Yes',
                    noButtonLabel: 'No',
                    cancelLinkLabel: 'Cancel',
                    question: 'Are you sure?',
                    doNotShowAgainMessage: 'Do not show this message again',
                    cancelLinkCallback: callback
                };
                testContext = new CreateUnitTestContext(unitTestConf);
                var $cancelLinkElement = testContext.$overlayContainer.find("span.cancelLink");
                $cancelLinkElement.click();
                assert.equal(callbackExecuted, 1, "Callback should be executed.");
            });
        });

        describe('Events triggered', function () {

            it('-yesButtonTrigger- without "do not show again" checkbox', function (done) {
                var unitTestConf = {
                    yesButtonLabel: 'Yes',
                    yesButtonTrigger: 'triggerEvent',
                    doNotShowAgainMessage: 'Do not show this message again'
                };
                var testContext = new CreateUnitTestContext(unitTestConf);
                var $yesElement = testContext.$overlayContainer.find("input.yesButton");

                testContext.confirmationDialogObj.vent.on("triggerEvent", function (doNotShowAgain) {
                    assert.equal(doNotShowAgain, false, "Checkbox not checked, the value should be false");
                    testContext.destroy();
                    done();
                });

                $yesElement.click();
            });

            it('-yesButtonTrigger- with "do not show again" checkbox', function (done) {
                var unitTestConf = {
                    yesButtonLabel: 'Yes',
                    yesButtonTrigger: 'triggerEvent',
                    doNotShowAgainMessage: 'Do not show this message again'
                };
                var testContext = new CreateUnitTestContext(unitTestConf);
                var $yesElement = testContext.$overlayContainer.find("input.yesButton");
                var $doNotShowCheckbox = testContext.$overlayContainer.find("div.doNotShowAgain input:checkbox");
                $doNotShowCheckbox.prop('checked', true);

                testContext.confirmationDialogObj.vent.on("triggerEvent", function (doNotShowAgain) {
                    assert.equal(doNotShowAgain, true, "Checkbox checked, the value should be true");
                    testContext.destroy();
                    done();
                });

                $yesElement.click();
            });

            it('-noButtonTrigger- should be triggered', function (done) {
                var unitTestConf = {
                    noButtonLabel: 'No',
                    noButtonTrigger: 'triggerEvent'
                };
                var testContext = new CreateUnitTestContext(unitTestConf);
                var $noElement = testContext.$overlayContainer.find("input.noButton");

                testContext.confirmationDialogObj.vent.on("triggerEvent", function () {
                    testContext.destroy();
                    done();
                });

                $noElement.click();
            });

            it('-cancelLinkTrigger- should be triggered', function (done) {
                var unitTestConf = {
                    cancelLinkLabel: 'Cancel',
                    cancelLinkTrigger: 'triggerEvent'
                };
                var testContext = new CreateUnitTestContext(unitTestConf);
                var $cancelLinkElement = testContext.$overlayContainer.find("span.cancelLink");

                testContext.confirmationDialogObj.vent.on("triggerEvent", function () {
                    testContext.destroy();
                    done();
                });

                $cancelLinkElement.click();
            });
        });
    });
});