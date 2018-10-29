define([
    "widgets/slider/sliderWidget",
    "widgets/slider/conf/configurationSample"
], function (SliderWidget, configurationSample) {

    describe("SliderWidget - Unit tests:", function () {

        var $el = $("#test_widget"),
            containerId = 0;

        var createContainer = function () {
            var $container = $("<div id = slider-container-id" + containerId++ + "></div>");
            $el.append($container);
            return $container;
        };

        describe("Widget Interface", function () {
            before(function () {
                this.$sliderContainer = createContainer();
                var sliderConfiguration = $.extend(true, {
                    "container": this.$sliderContainer[0]
                }, configurationSample.oneRangeCloseStartOpenEnd);
                this.sliderWidgetObj = new SliderWidget(sliderConfiguration).build();
            });
            after(function () {
                this.sliderWidgetObj.destroy();
                this.$sliderContainer.remove();
            });
            it("should exist", function () {
                this.sliderWidgetObj.should.exist;
            });
            it("build() should exist", function () {
                assert.isFunction(this.sliderWidgetObj.build, "The slider widget must have a function named build.");
            });
            it("destroy() should exist", function () {
                assert.isFunction(this.sliderWidgetObj.destroy, "The slider widget must have a function named destroy.");
            });
        });

        describe("Widget Incorrect Configuration", function () {
            before(function () {
                this.$sliderContainer = createContainer();
            });
            after(function () {
                this.$sliderContainer.remove();
            });
            it("should have configuration", function () {
                this.sliderWidgetObj = new SliderWidget("test");
                assert.throws(this.sliderWidgetObj.build, Error, "The configuration object for the slider widget is missing");
            });
            it("should exist container property", function () {
                this.sliderWidgetObj = new SliderWidget(configurationSample.oneRangeOpenStartOpenEnd);
                assert.throws(this.sliderWidgetObj.build, Error, "The configuration for the slider widget must include the container property");
            });
            it("should exist handles property", function () {
                var noSectionConfiguration = $.extend(true, {
                    "container": this.$sliderContainer[0]
                }, configurationSample.oneRangeCloseStartOpenEnd);
                delete noSectionConfiguration.handles;
                this.sliderWidgetObj = new SliderWidget(noSectionConfiguration);
                assert.throws(this.sliderWidgetObj.build, Error, "The configuration for the slider widget must include the handles property");
            });
            it("should exist range property", function () {
                var noSectionConfiguration = $.extend(true, {
                    "container": this.$sliderContainer[0]
                }, configurationSample.oneRangeCloseStartOpenEnd);
                delete noSectionConfiguration.scale.range;
                this.sliderWidgetObj = new SliderWidget(noSectionConfiguration);
                assert.throws(this.sliderWidgetObj.build, Error, "The configuration for the slider widget must include the range property");
            });
            it("should be built before using setValues method", function () {
                this.sliderWidgetObj = new SliderWidget(_.extend(configurationSample.oneRangeCloseStartOpenEnd, {
                    "container": this.$sliderContainer[0]
                }));
                assert.throws(this.sliderWidgetObj.setValues, Error, "The slider widget was not built");
            });
            it("should be built before using getValues method", function () {
                this.sliderWidgetObj = new SliderWidget(_.extend(configurationSample.oneRangeCloseStartOpenEnd, {
                    "container": this.$sliderContainer[0]
                }));
                assert.throws(this.sliderWidgetObj.getValues, Error, "The slider widget was not built");
            });
            it("should be built before using destroy method", function () {
                this.sliderWidgetObj = new SliderWidget(_.extend(configurationSample.oneRangeCloseStartOpenEnd, {
                    "container": this.$sliderContainer[0]
                }));
                assert.throws(this.sliderWidgetObj.destroy, Error, "The slider widget was not built");
            });
        });

        describe("Template", function () {
            before(function () {
                this.$sliderContainer = createContainer();
            });
            after(function () {
                this.$sliderContainer.remove();
            });
            it("should contain the slider-widget class for slider container", function () {
                this.sliderConfiguration = $.extend(true, {
                    "container": this.$sliderContainer[0]
                }, configurationSample.oneRangeOpenStartOpenEnd);
                this.sliderWidgetObj = new SliderWidget(this.sliderConfiguration).build();
                this.$sliderContainer.find(">div").hasClass("slider-widget").should.be.true;
                this.sliderWidgetObj.destroy();
            });
            it("should contain the connector bar assigned in the slider configuration", function () {
                this.sliderConfiguration = $.extend(true, {
                    "container": this.$sliderContainer[0]
                }, configurationSample.threeRangeCloseStartCloseEnd);
                this.sliderWidgetObj = new SliderWidget(this.sliderConfiguration).build();
                var highlithedSegments = 0;
                this.sliderConfiguration.handles.forEach(function (handle) {
                    if (_.isUndefined(handle.connect) || _.isUndefined(handle.connect.left) || handle.connect.left !== false) {
                        highlithedSegments++;
                    }
                });
                var numberOfHandles = this.sliderConfiguration.handles.length,
                    lastHandle = this.sliderConfiguration.handles[numberOfHandles - 1];
                if (_.isUndefined(lastHandle.connect) || _.isUndefined(lastHandle.connect.right) || lastHandle.connect.right !== false) {
                    highlithedSegments++;
                }
                assert.equal(highlithedSegments, this.$sliderContainer.find(".noUi-connect").length, "the slider should contain the same number of connectors defined in the slider configuration");
                this.sliderWidgetObj.destroy();
            });
            it("should contain the handles assigned in the slider configuration", function () {
                this.sliderConfiguration = $.extend(true, {
                    "container": this.$sliderContainer[0]
                }, configurationSample.twoRangeOpenStartOpenEnd);
                this.sliderWidgetObj = new SliderWidget(this.sliderConfiguration).build();
                assert.equal(this.sliderConfiguration.handles.length, this.$sliderContainer.find(".noUi-tooltip").length, "the slider should contain the same number of handles defined in the slider configuration");
                this.sliderWidgetObj.destroy();
            });
            it("should contain the handles assigned in the slider configuration and invoke label formatters", function () {
                this.sliderConfiguration = $.extend(true, {
                    "container": this.$sliderContainer[0]
                }, configurationSample.fourRangeCloseStartCloseEnd);
                var callbackFlags = {
                    format: false,
                    unformat: false
                };
                this.sliderConfiguration.options.label = {
                    format: function (value, index) {
                        assert.isFalse(_.isUndefined(value), "value of the format callback should be available");
                        assert.isFalse(_.isUndefined(index), "index of the format callback should be available");
                        callbackFlags.format = true;
                        return "Handle #" + index + ": " + value;
                    },
                    unformat: function (value, index) {
                        assert.isFalse(_.isUndefined(value), "value of the unformat callback should be available");
                        assert.isFalse(_.isUndefined(index), "index of the unformat callback should be available");
                        callbackFlags.unformat = true;
                        var stringIndex = value.indexOf(index) + 3;
                        return value.substring(stringIndex);
                    }
                };
                assert.isFalse(callbackFlags.format, "format callback was not invoked");
                assert.isFalse(callbackFlags.unformat, "unformat callback was not invoked");
                this.sliderWidgetObj = new SliderWidget(this.sliderConfiguration).build();
                if (this.sliderConfiguration.scale.numberOfValues) {
                    assert.equal(this.sliderConfiguration.scale.numberOfValues, this.$sliderContainer.find(".noUi-value-large").length, "the slider should contain the same number of handles defined in the slider configuration");
                    assert.isTrue(callbackFlags.format, "format callback was invoked");
                    assert.isTrue(callbackFlags.unformat, "unformat callback was invoked");
                } else {
                    this.$sliderContainer.find(".slider-widget>div").hasClass("no-label").should.be.true;
                    assert.isTrue(false, "format/unformat callback were not tested");
                }
                this.sliderWidgetObj.destroy();
            });
        });

        describe("Read-Only Slider", function () {
            before(function () {
                this.$sliderContainer = createContainer();
                this.sliderConfiguration = $.extend(true, {
                    "container": this.$sliderContainer[0]
                }, configurationSample.oneRangeCloseStartOpenEndReadOnly);
                this.sliderWidgetObj = new SliderWidget(this.sliderConfiguration).build();
            });
            after(function () {
                this.sliderWidgetObj.destroy();
                this.$sliderContainer.remove();
            });
            it("should contain the slider-widget class for slider container", function () {
                this.$sliderContainer.find(">div").hasClass("slider-widget").should.be.true;
            });
            it("should contain no-handle and no-scale", function () {
                var $handles = this.$sliderContainer.find(".noUi-handle");
                assert.equal(this.sliderConfiguration.handles.length, $handles.find(".noUi-tooltip").length, "the slider should contain the same number of handles defined in the slider configuration");
                assert.equal("none", $handles.css("display"), "the handler is not available to be updated");
            });
            it("should contain the handles assigned in the slider configuration", function() {
                var $sliderWrapper = this.$sliderContainer.find(".slider-wrapper");
                assert.isTrue($sliderWrapper.hasClass("no-handle"), "the handler area is adjusted for non handles");
                assert.isTrue($sliderWrapper.hasClass("no-scale"), "the scale area is adjusted for non scale");
            });
        });

        describe("Get method", function () {
            before(function () {
                this.$sliderContainer = createContainer();
            });
            after(function () {
                this.$sliderContainer.remove();
            });
            it("should provide the current value of the handles of the slider", function () {
                this.sliderConfiguration = $.extend(true, {
                    "container": this.$sliderContainer[0]
                }, configurationSample.fourRangeOpenStartCloseEnd);
                this.sliderWidgetObj = new SliderWidget(this.sliderConfiguration).build();
                var configuredValues = this.sliderConfiguration.handles.map(function (handle) {
                    return handle.value;
                });
                var sliderValue = this.sliderWidgetObj.getValues();
                assert.equal(_.difference(configuredValues, sliderValue).length, 0, "the slider has been built and provides the values of the handles");
                this.sliderWidgetObj.destroy();
            });
        });

        describe("Set method", function () {
            before(function () {
                this.$sliderContainer = createContainer();
            });
            after(function () {
                this.$sliderContainer.remove();
            });
            it("should set new values for the handles of the slider", function () {
                this.sliderConfiguration = $.extend(true, {
                    "container": this.$sliderContainer[0]
                }, configurationSample.fourRangeOpenStartCloseEnd);
                this.sliderWidgetObj = new SliderWidget(this.sliderConfiguration).build();
                var configuredValues = this.sliderConfiguration.handles.map(function (handle) {
                    return handle.value;
                });
                var sliderNewValue = this.sliderWidgetObj.setValues([1, 2, 3, 4]);
                assert.equal(_.intersection(configuredValues, sliderNewValue).length, 0, "the slider has been built and sets new values for the handles");
                this.sliderWidgetObj.destroy();
            });
        });

    });
});