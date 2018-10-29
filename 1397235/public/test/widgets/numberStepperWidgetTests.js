define([
    'jquery',
    'widgets/numberStepper/numberStepperWidget'
], function ($, NumberStepperWidget) {
    describe('NumberStepperWidget - Unit tests:', function() {

        var $test_widget_container = $('#test_widget'),
            containerId = 0;

        var createContainer = function () {
            var $container = $("<div id = 'numberStepper-container-id" + containerId+ "'></div>");
            $test_widget_container.append($container);
            return $container;
        };

        describe('Widget Interface', function() {
            before(function(){
                this.$numberStepperContainer = createContainer();
                this.numberStepperWidgetObj = new NumberStepperWidget({
                    "container": this.$numberStepperContainer,
                    "min_value": -10,
                    "max_value": 10
                }).build();
            });
            after(function(){
                this.numberStepperWidgetObj.destroy();
                this.$numberStepperContainer.remove();
            });
            it('should exist', function() {
                this.numberStepperWidgetObj.should.exist;
            });
            it('build() should exist', function() {
                assert.isFunction(this.numberStepperWidgetObj.build, 'The number stepper widget must have a function named build.');
            });
            it('destroy() should exist', function() {
                assert.isFunction(this.numberStepperWidgetObj.destroy, 'The number stepper widget must have a function named destroy.');
            });
        });

        describe('Widget Incorrect Configuration', function () {
            before(function () {
                this.$numberStepperContainer = createContainer();
            });
            after(function () {
                this.$numberStepperContainer.remove();
            });
            it('should have configuration', function () {
                this.numberStepperWidgetObj = new NumberStepperWidget("test");
                assert.throws(this.numberStepperWidgetObj.build, Error, 'The configuration object for the number stepper widget is missing');
            });
            it('should exist container parameter', function () {
                this.numberStepperWidgetObj = new NumberStepperWidget({
                    "id": "test-number-stepper",
                    "name": "test-number-stepper"
                });
                assert.throws(this.numberStepperWidgetObj.build, Error, 'The configuration for the number stepper widget must include a container');
            });
            it('should be built before using getValue method', function () {
                this.numberStepperWidgetObj = new NumberStepperWidget({
                    "container": this.$numberStepperContainer,
                    "id": "test-number-stepper",
                    "name": "test-number-stepper"
                });
                assert.throws(this.numberStepperWidgetObj.getValue, Error, 'The number stepper widget was not built');
            });
            it('should be built before using setValue method', function () {
                this.numberStepperWidgetObj = new NumberStepperWidget({
                    "container": this.$numberStepperContainer,
                    "id": "test-number-stepper",
                    "name": "test-number-stepper"
                });
                assert.throws(this.numberStepperWidgetObj.setValue, Error, 'The number stepper widget was not built');
            });
            it('should be built before using enable method', function () {
                this.numberStepperWidgetObj = new NumberStepperWidget({
                    "container": this.$numberStepperContainer,
                    "id": "test-number-stepper",
                    "name": "test-number-stepper"
                });
                assert.throws(this.numberStepperWidgetObj.enable, Error, 'The number stepper widget was not built');
            });
            it('should be built before using disable method', function () {
                this.numberStepperWidgetObj = new NumberStepperWidget({
                    "container": this.$numberStepperContainer,
                    "id": "test-number-stepper",
                    "name": "test-number-stepper"
                });
                assert.throws(this.numberStepperWidgetObj.disable, Error, 'The number stepper widget was not built');
            });
            it('should be built before using destroy method', function () {
                this.numberStepperWidgetObj = new NumberStepperWidget({
                    "container": this.$numberStepperContainer,
                    "id": "test-number-stepper",
                    "name": "test-number-stepper"
                });
                assert.throws(this.numberStepperWidgetObj.destroy, Error, 'The number stepper widget was not built');
            });
        });

        describe('Disable/Enable functionality', function() {
            before(function(){
                this.$numberStepperContainer = createContainer();
                this.numberStepperWidgetObj = new NumberStepperWidget({
                    "container": this.$numberStepperContainer,
                    "min_value": -10,
                    "max_value": 10
                }).build();
            });
            after(function(){
                this.numberStepperWidgetObj.destroy();
            });
            it('disabled when disable() is called', function() {
                this.numberStepperWidgetObj.disable();
                assert.isTrue(this.$numberStepperContainer.find("input[type='text']").is(':disabled'), 'disabled field');
            });
            it('enabled when enable() is called', function() {
                this.numberStepperWidgetObj.enable();
                assert.isFalse(this.$numberStepperContainer.find("input[type='text']").is(':disabled'), 'enabled field');
            });
        });

        describe('Set Value/Get Value functionality', function() {
            before(function(){
                this.$numberStepperContainer = createContainer();
                this.numberStepperWidgetObj = new NumberStepperWidget({
                    "container": this.$numberStepperContainer,
                    "min_value": -10,
                    "max_value": 10
                }).build();
            });
            after(function(){
                this.numberStepperWidgetObj.destroy();
            });
            it('sets value when setValue() is called', function() {
                this.numberStepperWidgetObj.setValue(5);
                assert.equal(this.$numberStepperContainer.find("input[type='text']").val(), 5, 'setValue sets value in field');
            });
            it('gets value when getValue() is called', function() {
                var value = this.numberStepperWidgetObj.getValue();
                assert.equal(value, 5, 'getValue gets value');
            });
        });
    });
});
