define([
    'widgets/help/helpWidget',
    'text!widgets/help/tests/templates/helpExample.html'
], function (HelpWidget, helpExample) {

    describe('HelpWidget - Unit tests:', function () {

        var $el = $('#test_widget'),
            containerId = 0,
            helpConfiguration = {
                "content": "Tooltip that shows how to access view help from the Help Widget",
                "ua-help-text": "More..",
                "ua-help-identifier": "alias_for_ua_event_binding"
            };

        var createContainer = function () {
            var $container = $("<div id = help-container-id" + containerId++ + "></div>");
            $el.append($container);
            return $container;
        };

        describe('Widget Interface', function () {
            before(function () {
                this.$helpContainer = createContainer();
                this.helpWidgetObj = new HelpWidget({
                    "container": this.$helpContainer[0],
                    "view": helpConfiguration
                }).build();
            });
            after(function () {
                this.helpWidgetObj.destroy();
                this.$helpContainer.remove();
            });
            it('should exist', function () {
                this.helpWidgetObj.should.exist;
            });
            it('build() should exist', function () {
                assert.isFunction(this.helpWidgetObj.build, 'The help widget must have a function named build');
            });
            it('destroy() should exist', function () {
                assert.isFunction(this.helpWidgetObj.destroy, 'The help widget must have a function named destroy');
            });
        });

        describe('Widget Incorrect Configuration', function () {
            before(function () {
                this.$helpContainer = createContainer();
            });
            after(function () {
                this.$helpContainer.remove();
            });
            it('should have configuration', function () {
                this.helpWidgetObj = new HelpWidget("test");
                assert.throws(this.helpWidgetObj.build, Error, 'The configuration object for the help widget is missing');
            });
            it('should have container parameter', function () {
                this.helpWidgetObj = new HelpWidget({
                    "view": {
                        "content": "Tooltip that shows how to access view help from the Help Widget"
                    }
                });
                assert.throws(this.helpWidgetObj.build, Error, 'The configuration for the help widget must include the container property');
            });
            it('should be built before using destroy method', function () {
                this.helpWidgetObj = new HelpWidget({
                    "container": this.$helpContainer[0]
                });
                assert.throws(this.helpWidgetObj.destroy, Error, 'The help widget was not built');
            });
        });

        describe('Template', function () {
            describe('View Help', function () {
                before(function () {
                    var $helpContainerWrapper = createContainer();
                    $helpContainerWrapper.append(helpExample);
                    this.$helpContainer = $helpContainerWrapper.find(".view-help");
                    this.helpWidgetObj = new HelpWidget({
                        "container": this.$helpContainer,
                        "view": helpConfiguration
                    }).build();
                });
                after(function () {
                    this.helpWidgetObj.destroy();
                    this.$helpContainer.remove();
                });
                it('should contain the help-widget class for help container', function () {
                    this.$helpContainer.find('>span').hasClass('help-widget').should.be.true;
                });
                it('should contain the input element with the id assigned in the help configuration', function () {
                    var $helpIcon = this.$helpContainer.find(".ua-field-help");
                    assert.equal($helpIcon.data("ua-id"), helpConfiguration["ua-help-identifier"], "the help identifier has been added as per the help configuration");
                });

                //PR-1358038
                //Tooltipster library can't render svg tooltip properly in the unit test.
                // it('should add a tooltip', function () {
                //     var $helpIcon = this.$helpContainer.find(".ua-field-help");
                //     assert.isTrue($helpIcon.hasClass("tooltipstered"), "the help icon has a tooltip");
                // });
            });
            describe('Inline Help', function () {
                before(function () {
                    var $helpContainerWrapper = createContainer();
                    $helpContainerWrapper.append(helpExample);
                    this.$helpContainer = $helpContainerWrapper.find(".inline-help");
                    this.$inlineHelpContainers = this.$helpContainer.find("[data-help-widget]");
                    this.helpWidgetObj = new HelpWidget({
                        "container": this.$helpContainer
                    }).build();
                });
                after(function () {
                    this.helpWidgetObj.destroy();
                    this.$helpContainer.remove();
                });
                it('should contain the help-widget class for help container', function () {
                    var $inlineHelpContainer = this.$inlineHelpContainers.eq(0);
                    $inlineHelpContainer.find('>span').hasClass('help-widget').should.be.true;
                });

                //PR-1358038
                //Tooltipster library can't render svg tooltip properly in the unit test.
                // it('should add a tooltip', function () {
                //     var $inlineHelpContainer = this.$inlineHelpContainers.eq(0),
                //         $helpIcon = $inlineHelpContainer.find(".ua-field-help");
                //     assert.isTrue($helpIcon.hasClass("tooltipstered"), "the help icon has a tooltip");
                // });
                it('should contain multiple inline help added for help container', function () {
                    assert.equal(this.$inlineHelpContainers.length, this.$helpContainer.find(".help-widget").length,"the help icon has a tooltip");
                });
                it('should add identifier for the tooltip', function () {
                    var $inlineHelpContainer = this.$inlineHelpContainers.eq(0),
                        $helpIcon = $inlineHelpContainer.find(".ua-field-help")
                    assert.isTrue(!_.isEmpty($helpIcon.eq(0).attr("data-ua-id")), "the help icon has a tooltip");
                });
            });
        });
        describe('Widget Size', function () {
            describe('Default Size', function () {
                before(function () {
                    this.$helpContainer = createContainer();
                    this.helpWidgetObj = new HelpWidget({
                        "container": this.$helpContainer[0],
                        "view": helpConfiguration
                    }).build();
                });
                after(function () {
                    this.helpWidgetObj.destroy();
                    this.$helpContainer.remove();
                });
                it('Default Class', function () {
                    assert.isTrue(this.$helpContainer.find(".ua-field-help").length > 0, "Help icon class is in the DOM");
                    assert.isTrue(this.$helpContainer.find(".ua-field-help.small").length == 0, "Help icon size is NOT small");
                });
            });
            describe('Small Size', function () {
                before(function () {
                    this.$helpContainer = createContainer();
                    this.helpWidgetObj = new HelpWidget({
                        "container": this.$helpContainer[0],
                        "view": helpConfiguration,
                        "size": "small"
                    }).build();
                });
                after(function () {
                    this.helpWidgetObj.destroy();
                    this.$helpContainer.remove();
                });
                it('Small Class', function () {
                    assert.isTrue(this.$helpContainer.find(".ua-field-help").length > 0, "Help icon class is in the DOM");
                    assert.isTrue(this.$helpContainer.find(".ua-field-help.small").length > 0, "Help icon size is small");
                });
            });
        });

        //PR-1358038
        //Tooltipster library can't render svg tooltip properly in the unit test.
        // describe('Method', function () {
        //     beforeEach(function () {
        //         this.$helpContainer = createContainer();
        //         this.helpWidgetObj = new HelpWidget({
        //             "container": this.$helpContainer[0],
        //             "view": helpConfiguration
        //         }).build();
        //     });
        //     afterEach(function () {
        //         this.helpWidgetObj.destroy();
        //         this.$helpContainer.remove();
        //     });
        //     describe('disable', function () {
        //         it('Disabled class is added when help widget is disabled', function () {
        //             assert.isTrue(this.$helpContainer.find(".ua-field-help").length > 0, "Help icon class is in the DOM");
        //             assert.isFalse(this.$helpContainer.find(".ua-field-help.disabled").length > 0, "Help icon is NOT disabled");
        //             this.helpWidgetObj.disable();
        //             assert.isTrue(this.$helpContainer.find(".ua-field-help.disabled").length > 0, "Help icon is disabled");
        //         });
        //     });
        //     describe('enable', function () {
        //         it('Disabled class is added when help widget is disabled', function () {
        //             assert.isTrue(this.$helpContainer.find(".ua-field-help").length > 0, "Help icon class is in the DOM");
        //             this.helpWidgetObj.disable();
        //             assert.isTrue(this.$helpContainer.find(".ua-field-help.disabled").length > 0, "Help icon is NOT enabled");
        //             this.helpWidgetObj.enable();
        //             assert.isFalse(this.$helpContainer.find(".ua-field-help.disabled").length > 0, "Help icon is enabled");
        //         });
        //     });
        // });
    });
});
