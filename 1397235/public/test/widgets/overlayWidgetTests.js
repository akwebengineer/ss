define([
    'jquery',
    'widgets/overlay/tests/views/smallView',
    'widgets/overlay/tests/views/testView',
    'widgets/overlay/overlayWidget',
    'widgets/overlay/overlaySingletonLayout'
], function ($, SmallView, TestView, OverlayWidget, overlaySingletonLayout) {
    describe('overlayWidget - Unit tests:', function () {

        describe('overlayWidget', function () {

            var overlayWidgetObj = null;
            var overlayType = null;
            var $el = null;
            var widgetObj = null;
            var overlayObj = null;

            beforeEach(function () {
                var smallViewObj = new SmallView({});

                overlayType = "small";

                var config = {
                    view: smallViewObj,
                    xIconEl: true,
                    cancelButton: true,
                    okButton: true,
                    type: overlayType
                };

                overlayWidgetObj = new OverlayWidget(config);
                widgetObj = overlayWidgetObj.build();
                overlayObj = overlayWidgetObj.getOverlay();
                $el = overlayObj.$el;
            });

            afterEach(function () {
                overlayWidgetObj.destroyAll();
            });

            it('overlay_content should exist', function () {
                $('#overlay_content').should.exist;
            });
            it('overlay_content should contain overlay', function () {
                assert.equal($el.parent().parent().parent().attr('id'), "overlay_content");
            });
            it('should exist', function () {
                overlayWidgetObj.should.exist;
            });
            it('build() function should exist', function () {
                (typeof overlayWidgetObj.build == 'function').should.be.true;
            });
            it('build() should return overlayWidget object', function () {
                // var widgetObj = overlayWidgetObj.build();
                assert.equal(widgetObj, overlayWidgetObj);
            });
            it('destroy() function should exist', function () {
                (typeof overlayWidgetObj.destroy == 'function').should.be.true;
            });
            it('destroy() function should close the current overlay', function () {
                $el.find("#callNestedOverlay").click();
                assert.equal($('body').find(".bbm-wrapper").length, 2);
                overlayWidgetObj.destroy();
                overlayWidgetObj.destroy();
                assert.equal($('body').find(".bbm-wrapper").length, 0);
                assert.equal($('body').find(".modals-container").length, 0);

            });
            it('destroyAll() function should exist', function () {
                (typeof overlayWidgetObj.destroyAll == 'function').should.be.true;
            });
            it('destroyAll() function should close all overlays', function () {
                $el.find("#callNestedOverlay").click();
                assert.equal($('body').find(".bbm-wrapper").length, 2);
                overlayWidgetObj.destroyAll();
                assert.equal($('body').find(".bbm-wrapper").length, 0);
                assert.equal($('body').find(".modals-container").length, 0);
            });
            it('getOverlay() should exist', function () {
                (typeof overlayWidgetObj.getOverlay == 'function').should.be.true;
            });
            it('getOverlay() should return overlay Object', function () {
                var overlayObj = overlayWidgetObj.getOverlay();
                overlayObj.should.not.be.null;
            });
            it('should have correct overlayType assigned', function () {
                assert.equal($el.find(".overlay-" + overlayType).length, 1);
            });
            it('should be able to create 2-level nested overlay', function () {
                $el.find("#callNestedOverlay").click();
                assert.equal($('body').find(".bbm-wrapper").length, 2);
            });
            it('should be able to create 3-level nested overlay', function () {
                $el.find("#callNestedOverlay").click();
                assert.equal($('body').find(".bbm-wrapper").length, 2);
                $el.find("#callNestedOverlay").click();
                assert.equal($('body').find(".bbm-wrapper").length, 3);
            });
        });

        describe('overlayWidget callback functions', function () {

            beforeEach(function () {
                var self = this;

                var testViewObj = new TestView({});

                var config = {
                    view: testViewObj,
                    xIconEl: true,
                    cancelButton: true,
                    okButton: true,
                    type: "small",
                    beforeSubmit: function () {
                        var numberVal = this.$el.find('#field_number').val();
                        var valid = numberVal && !isNaN(parseFloat(numberVal)) && isFinite(numberVal);
                        self.testBeforeSubmit++;
                        return valid;
                    },
                    submit: function () {
                        self.testSubmit++;
                    },
                    beforeCancel: function () {
                        self.testBeforeCancel++;
                    },
                    cancel: function () {
                        self.testCancel++;
                    }
                };

                this.overlayWidgetObj = new OverlayWidget(config).build();
                this.$el = this.overlayWidgetObj.getOverlay().$el;

                this.$okButton = this.$el.find('#ok');
                this.$cancelButton = this.$el.find('#cancel');
            });


            it('beforeSubmit callback exists', function () {
                this.testBeforeSubmit = 0;
                this.$okButton.click();
                assert.equal(this.testBeforeSubmit, 1, "beforeSubmit callback is missing");
            });

            it('submit callback exists', function () {
                this.testSubmit = 0;
                this.$okButton.click();
                assert.equal(this.testSubmit, 1, "submit callback is missing");
            });

            it('beforeSubmit & submit callback executed', function () {
                this.testBeforeSubmit = 0;
                this.testSubmit = 0;
                this.$el.find('#field_number').val('123');
                this.$okButton.click();
                assert.equal(this.testBeforeSubmit, 1, "beforeSubmit should be executed");
                assert.equal(this.testSubmit, 1, "submit callback should be executed");
            });

            it('submit callback not executed', function () {
                // if the beforeCancel callback returns false, submit is not expected to execute.
                this.testBeforeSubmit = 0;
                this.testSubmit = 0;
                this.$el.find('#field_number').val('test');
                this.$okButton.click();
                assert.equal(this.testBeforeSubmit, 1, "beforeSubmit should be executed");
                assert.equal(this.testSubmit, 0, "submit callback should Not be executed");
                // Only this test case need explicit call to destroy, internally submit & cancel destroys the overlays.
                this.overlayWidgetObj.destroy();
            });

            it('beforeCancel callback exists', function () {
                this.testBeforeCancel = 0;
                this.$cancelButton.click();
                assert.equal(this.testBeforeCancel, 1, "beforeCancel callback is missing");
            });

            it('cancel callback exists', function () {
                this.testCancel = 0;
                this.$cancelButton.click();
                assert.equal(this.testCancel, 1, "cancel callback is missing");
            });

            it('beforeCancel & cancel callback executed', function () {
                this.testBeforeCancel = 0;
                this.testCancel = 0;
                this.$cancelButton.click();
                assert.equal(this.testBeforeCancel, 1, "beforeCancel should be executed");
                assert.equal(this.testCancel, 1, "cancel callback should be executed");
            });

            it('validation failed, submit callback not executed, cancel button clicked', function () {
                this.testBeforeSubmit = 0;
                this.testSubmit = 0;
                this.testBeforeCancel = 0;
                this.testCancel = 0;
                this.$el.find('#field_number').val('test');
                this.$okButton.click();
                assert.equal(this.testBeforeSubmit, 1, "beforeSubmit should be executed");
                assert.equal(this.testSubmit, 0, "submit callback should Not be executed");
                this.$cancelButton.click();
                assert.equal(this.testBeforeCancel, 1, "beforeCancel should be executed");
                assert.equal(this.testCancel, 1, "cancel should be executed");
            });

        });

        describe('overlaySingletonLayout', function () {

            it('\'new\' operator can not be used to instantiate object', function () {
                var fn = function () {
                    new overlaySingletonLayout()
                };
                expect(fn).to.throw(TypeError);
            });
            it('getInstance() function should exist', function () {
                (typeof overlaySingletonLayout.getInstance == 'function').should.be.true;
            });
            it('getInstance should always return same object', function () {
                var singletonObj_1 = overlaySingletonLayout.getInstance();
                var singletonObj_2 = overlaySingletonLayout.getInstance();
                expect(singletonObj_1).to.equal(singletonObj_2);
            });

        });

        describe('Class Attribute', function () {
            var overlayWidgetObj, $el, config;
            before(function () {
                var testViewObj = new TestView({});
                config = {
                    view: testViewObj,
                    okButton: true,
                    type: "small",
                    class: "test_overlay_widget"
                };

                overlayWidgetObj = new OverlayWidget(config).build();
                $el = overlayWidgetObj.getOverlay().$el;
                this.$okButton = $el.find('#ok');
            });
            after(function () {
                overlayWidgetObj.destroyAll();
                overlayWidgetObj = null;
                $el = null;
                config = null;
            });
            it('If overlay namespace is defined', function () {
                var $contentSection = $el.find('.'+config.class);
                assert.equal($contentSection.length, 1, "wrapper class is defined");
            });
            it('If overlay wrapper class is defined', function () {
                var $contentSection = $el.find('.'+config.class).find(".overlay-wrapper");
                assert.isTrue($contentSection.hasClass("slipstream-overlay-widget-border"), "exposed border class is defined");
            });
            it('If overlay content class is defined', function () {
                var $contentSection = $el.find('.bbm-modal__section > div');
                assert.isTrue($contentSection.hasClass("slipstream-overlay-widget-content"), "exposed content class is defined");
            });
        });

        describe('Type Attribute', function () {
            var overlayWidgetObj, $el, config;
            before(function () {
                var testViewObj = new TestView({});
                config = {
                    view: testViewObj,
                    okButton: true,
                    class: "test_overlay_widget"
                };
            });
            var buildOverlay = function(){
                overlayWidgetObj = new OverlayWidget(config).build();
                $el = overlayWidgetObj.getOverlay().$el;
            };
            after(function () {
                overlayWidgetObj.destroyAll();
                overlayWidgetObj = null;
                $el = null;
                config = null;
            });
            it('If overlay type = xsmall', function () {
                config.type = "xsmall";
                buildOverlay();
                var $contentSection = $el.find('.bbm-modal.overlay-xsmall');
                assert.equal($contentSection.length, 1, "wrapper class is defined");
            });
            it('If overlay type = small', function () {
                config.type = "small";
                buildOverlay();
                var $contentSection = $el.find('.bbm-modal.overlay-small');
                assert.equal($contentSection.length, 1, "wrapper class is defined");
            });
            it('If overlay type = medium', function () {
                config.type = "medium";
                buildOverlay();
                var $contentSection = $el.find('.bbm-modal.overlay-medium');
                assert.equal($contentSection.length, 1, "wrapper class is defined");
            });
            it('If overlay type = large', function () {
                config.type = "large";
                buildOverlay();
                var $contentSection = $el.find('.bbm-modal.overlay-large');
                assert.equal($contentSection.length, 1, "wrapper class is defined");
            });
            it('If overlay type = fullpage', function () {
                config.type = "fullpage";
                buildOverlay();
                var $contentSection = $el.find('.bbm-modal.overlay-fullpage');
                assert.equal($contentSection.length, 1, "wrapper class is defined");
            });
        });

        describe('Title Attribute', function() {
            var overlayWidgetObj, $el,
                config = {
                    view: new TestView({}),
                    type: "small"
                };
            var buildOverlay = function(){
                overlayWidgetObj = new OverlayWidget(config).build();
                $el = overlayWidgetObj.getOverlay().$el;
            };
            var cleanUp = function(){
                overlayWidgetObj.destroyAll();
                overlayWidgetObj = null;
                $el = null;
            };
            describe('Text Title Defined', function () {
                before(function () {
                    var titleConfig = {
                        title: "test"
                    };
                    $.extend(config, titleConfig, true);

                    buildOverlay();
                });
                after(function () {
                    cleanUp();
                });
                it('If overlay text title is defined', function () {
                    var titleText = $el.find('.slipstream-content-title').text();
                    assert.equal($.trim(titleText), "test", "title is correct");
                });
            });
            describe('HTML Title Defined', function () {
                before(function () {
                    var titleConfig = {
                        title: "<span class='errorImg'></span>test"
                    };
                    $.extend(config, titleConfig, true);

                    buildOverlay();
                });
                after(function () {
                    cleanUp();
                });
                it('If overlay html title is defined', function () {
                    var $titleHtml = $el.find('.slipstream-content-title');
                    assert.equal($titleHtml.find(".errorImg").length, 1, "title is correct");
                });
            });
        });
        describe('Title Help Attribute', function () {
            var overlayWidgetObj, $el, 
                config = {
                    view: new TestView({}),
                    type: "small"
                };
            var buildOverlay = function(){
                overlayWidgetObj = new OverlayWidget(config).build();
                $el = overlayWidgetObj.getOverlay().$el;
            };
            var cleanUp = function(){
                overlayWidgetObj.destroyAll();
                overlayWidgetObj = null;
                $el = null;
            };
            describe('Title Help NOT Defined', function () {
                before(function () {
                    buildOverlay();
                });
                after(function () {
                    cleanUp();
                });
                it('If overlay titleHelp is defined', function () {
                    assert.equal($el.find('.ua-field-help').length, 0, "help identiier attribute is NOT defined");
                });
            });
            describe('Title Help Defined', function () {
                before(function () {
                    var titleConfig = {
                        title: "test",
                        titleHelp: {
                            "content": "Tooltip for the title of Overlay",
                            "ua-help-identifier": "alias_for_title_ua_event_binding",
                            "ua-help-text": "More..."
                        }
                    };
                    $.extend(config, titleConfig, true);

                    buildOverlay();
                });
                after(function () {
                    cleanUp();
                });
                it('If overlay titleHelp is defined', function () {
                    assert.equal($el.find('.ua-field-help').length, 1, "help identiier attribute is defined");
                });
            });
        });
    });
});
