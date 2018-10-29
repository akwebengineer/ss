define([
    'widgets/colorPicker/colorPickerWidget'
], function (ColorPickerWidget) {

    describe('ColorPickerWidget - Unit tests:', function () {

        var $el = $('#test_widget'),
            containerId = 0;

        var createContainer = function () {
            var $container = $("<div id = colorPicker-container-id" + containerId++ + "></div>");
            $el.append($container);
            return $container;
        };

        describe('Widget Interface', function () {
            before(function () {
                this.$colorPickerContainer = createContainer();
                this.colorPickerWidgetObj = new ColorPickerWidget({
                    "container": this.$colorPickerContainer[0],
                    "value": "b988b9"
                }).build();
            });
            after(function () {
                this.colorPickerWidgetObj.destroy();
                this.$colorPickerContainer.remove();
            });
            it('should exist', function () {
                this.colorPickerWidgetObj.should.exist;
            });
            it('build() should exist', function () {
                assert.isFunction(this.colorPickerWidgetObj.build, 'The color picker widget must have a function named build.');
            });
            it('destroy() should exist', function () {
                assert.isFunction(this.colorPickerWidgetObj.destroy, 'The color picker widget must have a function named destroy.');
            });
        });

        describe('Widget Incorrect Configuration', function () {
            before(function () {
                this.$colorPickerContainer = createContainer();
            });
            after(function () {
                this.$colorPickerContainer.remove();
            });
            it('should have configuration', function () {
                this.colorPickerWidgetObj = new ColorPickerWidget("test");
                assert.throws(this.colorPickerWidgetObj.build, Error, 'The configuration object for the color picker widget is missing');
            });
            it('should exist container parameter', function () {
                this.colorPickerWidgetObj = new ColorPickerWidget({
                    "value": "b988b9"
                });
                assert.throws(this.colorPickerWidgetObj.build, Error, 'The configuration for the color picker widget must include the container property');
            });
            it('should be built before using getValue method', function () {
                this.colorPickerWidgetObj = new ColorPickerWidget({
                    "container": this.$colorPickerContainer[0],
                    "value": "b988b9"
                });
                assert.throws(this.colorPickerWidgetObj.getValue, Error, 'The color picker widget was not built');
            });
            it('should be built before using setValue method', function () {
                this.colorPickerWidgetObj = new ColorPickerWidget({
                    "container": this.$colorPickerContainer[0],
                    "value": "b988b9"
                });
                assert.throws(this.colorPickerWidgetObj.setValue, Error, 'The color picker widget was not built');
            });
            it('should be built before using destroy method', function () {
                this.colorPickerWidgetObj = new ColorPickerWidget({
                    "container": this.$colorPickerContainer[0],
                    "value": "b988b9"
                });
                assert.throws(this.colorPickerWidgetObj.destroy, Error, 'The color picker widget was not built');
            });
        });

        describe('Template', function () {
            before(function () {
                this.$colorPickerContainer = createContainer();
                this.colorPickerConfiguration = {
                    "container": this.$colorPickerContainer[0],
                    "value": "b988b9"
                };
                this.colorPickerWidgetObj = new ColorPickerWidget(this.colorPickerConfiguration).build();
            });
            after(function () {
                this.colorPickerWidgetObj.destroy();
                this.$colorPickerContainer.remove();
            });
            it('should contain the colorPicker-widget class for color picker container', function () {
                this.$colorPickerContainer.find('>span').hasClass('color-picker-widget').should.be.true;
            });
            it('should contain the input element with the value assigned in the color picker configuration', function () {
                assert.equal(this.colorPickerConfiguration.value, this.$colorPickerContainer.find('input').val(), "the colorPicker has been created and the value has been assigned as per the color picker configuration");
            });
        });

        describe('Get and Set methods', function () {
            before(function () {
                this.$colorPickerContainer = createContainer();
                this.colorPickerConfiguration = {
                    "container": this.$colorPickerContainer[0],
                    "value": "b988b9"
                };
                this.colorPickerWidgetObj = new ColorPickerWidget(this.colorPickerConfiguration).build();
            });
            after(function () {
                this.colorPickerWidgetObj.destroy();
                this.$colorPickerContainer.remove();
            });
            it('should be updated to the value set in the configuration when built', function () {
                var colorPickerValue = this.colorPickerWidgetObj.getValue();
                assert.equal(this.colorPickerConfiguration.value, colorPickerValue, "the colorPicker has been created and the value property in the configuration has been assigned");
            });
            it('should be able to set a new value using the setValue method', function () {
                var newValue = "c95f18";
                this.colorPickerWidgetObj.setValue(newValue);
                assert.equal(newValue,  this.colorPickerWidgetObj.getValue(), "the colorPicker has been created and a new value has been assigned");
            });
        });

    });
});
