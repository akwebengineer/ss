define([
    'widgets/toggleButton/toggleButtonWidget',
    'widgets/form/formWidget',
    'widgets/toggleButton/tests/conf/formConfiguration'
], function (ToggleButtonWidget, FormWidget, formConfiguration) {

    describe('ToggleButtonWidget - Unit tests:', function () {

        var $el = $('#test_widget'),
            containerId = 0;

        var createContainer = function () {
            var $container = $("<div id = toggleButton-container-id" + containerId++ + "></div>");
            $el.append($container);
            return $container;
        };

        describe('Widget Interface', function () {
            before(function () {
                this.$toggleButtonContainer = createContainer();
                this.toggleButtonWidgetObj = new ToggleButtonWidget({
                    "container": this.$toggleButtonContainer[0],
                    "on": true,
                    "id": "test-toggle-button",
                    "name": "test-toggle-button"
                }).build();
            });
            after(function () {
                this.toggleButtonWidgetObj.destroy();
                this.$toggleButtonContainer.remove();
            });
            it('should exist', function () {
                this.toggleButtonWidgetObj.should.exist;
            });
            it('build() should exist', function () {
                assert.isFunction(this.toggleButtonWidgetObj.build, 'The toggle button widget must have a function named build.');
            });
            it('destroy() should exist', function () {
                assert.isFunction(this.toggleButtonWidgetObj.destroy, 'The toggle button widget must have a function named destroy.');
            });
        });

        describe('Widget Incorrect Configuration', function () {
            before(function () {
                this.$toggleButtonContainer = createContainer();
            });
            after(function () {
                this.$toggleButtonContainer.remove();
            });
            it('should have configuration', function () {
                this.toggleButtonWidgetObj = new ToggleButtonWidget("test");
                assert.throws(this.toggleButtonWidgetObj.build, Error, 'The configuration object for the toggle button widget is missing');
            });
            it('should exist container parameter', function () {
                this.toggleButtonWidgetObj = new ToggleButtonWidget({
                    "id": "test-toggle-button",
                    "name": "test-toggle-button"
                });
                assert.throws(this.toggleButtonWidgetObj.build, Error, 'The configuration for the toggle button widget must include the container parameter');
            });
            it('should exist id parameter', function () {
                this.toggleButtonWidgetObj = new ToggleButtonWidget({
                    "container": this.$toggleButtonContainer[0],
                    "on": true,
                    "name": "test-toggle-button"
                });
                assert.throws(this.toggleButtonWidgetObj.build, Error, 'The configuration for the toggle button widget must include the id parameter');
            });
            it('should be built before using getValue method', function () {
                this.toggleButtonWidgetObj = new ToggleButtonWidget({
                    "container": this.$toggleButtonContainer[0],
                    "on": true,
                    "id": "test-toggle-button",
                    "name": "test-toggle-button"
                });
                assert.throws(this.toggleButtonWidgetObj.getValue, Error, 'The toggle button widget was not built');
            });
            it('should be built before using setValue method', function () {
                this.toggleButtonWidgetObj = new ToggleButtonWidget({
                    "container": this.$toggleButtonContainer[0],
                    "on": true,
                    "id": "test-toggle-button",
                    "name": "test-toggle-button"
                });
                assert.throws(this.toggleButtonWidgetObj.setValue, Error, 'The toggle button widget was not built');
            });
            it('should be built before using destroy method', function () {
                this.toggleButtonWidgetObj = new ToggleButtonWidget({
                    "container": this.$toggleButtonContainer[0],
                    "on": true,
                    "id": "test-toggle-button",
                    "name": "test-toggle-button"
                });
                assert.throws(this.toggleButtonWidgetObj.destroy, Error, 'The toggle button widget was not built');
            });
        });

        describe('Template', function () {
            before(function () {
                this.$toggleButtonContainer = createContainer();
                this.toggleButtonConfiguration = {
                    "container": this.$toggleButtonContainer[0],
                    "on": true,
                    "id": "test-toggle-button",
                    "name": "test-toggle-button"
                };
                this.toggleButtonWidgetObj = new ToggleButtonWidget(this.toggleButtonConfiguration).build();
            });
            after(function () {
                this.toggleButtonWidgetObj.destroy();
                this.$toggleButtonContainer.remove();
            });
            it('should contain the toggleButton-widget class for toggle button container', function () {
                this.$toggleButtonContainer.find('>div').hasClass('toggle-button-widget').should.be.true;
            });
            it('should contain the input element with the id assigned in the toggle button configuration', function () {
                assert.equal(this.toggleButtonConfiguration.id, this.$toggleButtonContainer.find('input').attr('id'), "the toggleButton has been created and the id has been added as per the toggle button configuration");
            });
            it('should contain the value assigned in the on parameter in the toggle button configuration', function () {
                assert.equal(this.toggleButtonConfiguration.on, this.$toggleButtonContainer.find('input:checked').val() == 'true' ? true : false, "the toggleButton has been created and the on property in the configuration has been assigned");
            });
        });

        describe('Disabled', function () {
            before(function () {
                this.$toggleButtonContainer = createContainer();
                this.toggleButtonConfiguration = {
                    "container": this.$toggleButtonContainer[0],
                    "on": true,
                    "disabled": true,
                    "id": "test-toggle-button",
                    "name": "test-toggle-button"
                };
                this.toggleButtonWidgetObj = new ToggleButtonWidget(this.toggleButtonConfiguration).build();
            });
            after(function () {
                this.toggleButtonWidgetObj.destroy();
                this.$toggleButtonContainer.remove();
            });
            it('should contain the toggleButton-widget class for toggle button container', function () {
                this.$toggleButtonContainer.find('>div').hasClass('toggle-button-widget').should.be.true;
            });
            it('should contain the input element with the id assigned in the toggle button configuration', function () {
                assert.equal(this.toggleButtonConfiguration.id, this.$toggleButtonContainer.find('input').attr('id'), "the toggleButton has been created and the id has been added as per the toggle button configuration");
            });
            it('should be disabled as per the toggle button configuration', function () {
                assert.equal(this.toggleButtonConfiguration.disabled, !_.isUndefined(this.$toggleButtonContainer.find('input').attr('disabled')), "the toggleButton has been created and the on property in the configuration has been assigned");
            });
            it('should enable/disable the toggle button by using the enable/disable methods', function () {
                this.toggleButtonWidgetObj.enable();
                assert.equal(this.toggleButtonConfiguration.disabled, _.isUndefined(this.$toggleButtonContainer.find('input').attr('disabled')), "the toggleButton should be enabled after calling the enable method");
                this.toggleButtonWidgetObj.disable();
                assert.isTrue(!_.isUndefined(this.$toggleButtonContainer.find('input').attr('disabled')), "the toggleButton should be disabled after calling the disable method");
            });
            it('should allow to set a value of the toggle button even if the toggle button is disabled', function () {
                assert.equal(this.toggleButtonWidgetObj.getValue(), "true", "the toggleButton is on");
                assert.isTrue(this.toggleButtonWidgetObj.isDisabled(), "the toggleButton is disabled");
                this.toggleButtonWidgetObj.setValue(false);
                assert.isUndefined(this.toggleButtonWidgetObj.getValue(), "the toggleButton is set to off even if it was already disabled");
            });
        });

        describe('Inline Label', function () {
            beforeEach(function () {
                this.$toggleButtonContainer = createContainer();
                this.toggleButtonConfiguration = {
                    "container": this.$toggleButtonContainer[0],
                    "on": true,
                    "id": "test-toggle-button",
                    "name": "test-toggle-button"
                };
            });
            afterEach(function () {
                this.$toggleButtonContainer.remove();
            });
            it("should not show inline label by default", function () {
                var toogleButtonWidgetConfiguration = _.extend({}, this.toggleButtonConfiguration);
                var toggleButtonWidgetObj = new ToggleButtonWidget(toogleButtonWidgetConfiguration).build();
                assert.isFalse(_.isElement(this.$toggleButtonContainer.find(".toggle-inline-label")[0]), "inline label should not be available");
                toggleButtonWidgetObj.destroy();
            });
            it("should show inline label if inlineLabel is set to true with default values", function () {
                var toogleButtonWidgetConfiguration = _.extend({
                    "inlineLabel": true
                }, this.toggleButtonConfiguration),
                    toggleButtonWidgetObj = new ToggleButtonWidget(toogleButtonWidgetConfiguration).build(),
                    $toggleButtonLabel = this.$toggleButtonContainer.find(".toggle-inline-label");
                assert.isTrue(_.isElement(this.$toggleButtonContainer.find(".toggle-inline-label")[0]), "inline label should be available");

                //test on case
                assert.equal($toggleButtonLabel.text(), "On", "inline label should match the default 'On' inlineLabel");
                //test off case
                toggleButtonWidgetObj.setValue(false);
                assert.equal($toggleButtonLabel.text(), "Off", "inline label should match the default 'Off' inlineLabel");
                toggleButtonWidgetObj.destroy();
            });
            it("should show inline label if inlineLabel is set to true with configured values", function () {
                var inlineLabel = {
                        "on": "Active",
                        "off": "Inactive"
                    },
                    toogleButtonWidgetConfiguration = _.extend({
                        "inlineLabel": inlineLabel
                    }, this.toggleButtonConfiguration),
                    toggleButtonWidgetObj = new ToggleButtonWidget(toogleButtonWidgetConfiguration).build(),
                    $toggleButtonLabel = this.$toggleButtonContainer.find(".toggle-inline-label");
                assert.isTrue(_.isElement($toggleButtonLabel[0]), "inline label should not be available");

                //test on case
                assert.equal($toggleButtonLabel.text(), inlineLabel.on, "inline label should match the configured inlineLabel, on property");
                //test off case
                toggleButtonWidgetObj.setValue(false);
                assert.equal($toggleButtonLabel.text(), inlineLabel.off, "inline label should match the configured inlineLabel, off property");

                toggleButtonWidgetObj.destroy();
            });
        });

        describe('Get and Set methods', function () {
            before(function () {
                this.$toggleButtonContainer = createContainer();
                this.toggleButtonConfiguration = {
                    "container": this.$toggleButtonContainer[0],
                    "on": true,
                    "id": "test-toggle-button",
                    "name": "test-toggle-button"
                };
                this.toggleButtonWidgetObj = new ToggleButtonWidget(this.toggleButtonConfiguration).build();
            });
            after(function () {
                this.toggleButtonWidgetObj.destroy();
                this.$toggleButtonContainer.remove();
            });
            it('should be switched to the configuration state set in the configuration when built', function () {
                var toggleButtonValue = this.toggleButtonWidgetObj.getValue();
                assert.equal(this.toggleButtonConfiguration.on, toggleButtonValue == 'true' ? true : false, "the toggleButton has been created and the on property in the configuration has been assigned");
            });
            it('should be able to set a new value using the setValue method', function () {
                this.toggleButtonWidgetObj.setValue(false);
                (this.$toggleButtonContainer.find('input:checked').val() == 'true' ? true : false).should.be.false;
            });
        });

        describe('Form widget integration', function () {
            before(function () {
                this.$toggleButtonFormContainer = createContainer();
                this.toggleButtonElementConfiguration = {
                    "element_toggleButton": true,
                    "on": true,
                    "id": "test-toggle-button",
                    "name": "test-toggle-button"
                };

                formConfiguration.sections[0].elements.push(this.toggleButtonElementConfiguration);
                this.form = new FormWidget({
                    "elements": formConfiguration,
                    "container": this.$toggleButtonFormContainer[0]
                }).build();
            });
            after(function () {
                this.$toggleButtonFormContainer.remove();
            });
            it('should contain the toggle-button class for toggle button container', function () {
                this.$toggleButtonFormContainer.find('#' + this.toggleButtonElementConfiguration.id).hasClass('toggle-button').should.be.true;
            });
            it('should contain the input element with the id assigned in the toggle button configuration', function () {
                assert.equal(this.toggleButtonElementConfiguration.id, this.$toggleButtonFormContainer.find('#' + this.toggleButtonElementConfiguration.id).attr('id'), "the toggleButton has been created and the id has been added as per the toggle button and form configuration");
            });
        });

    });
});
