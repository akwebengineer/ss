/**
 * A view that uses the colorPicker widget to render colorPicker elements from a configuration object
 *
 * @module ColorPicker View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define([
    'backbone',
    'widgets/colorPicker/colorPickerWidget',
    'text!widgets/colorPicker/tests/templates/colorPickerExample.html',
    'es6!widgets/colorPicker/react/tests/view/colorPickerReactView'
], function (Backbone, ColorPickerWidget, colorPickerExample, ColorPickerReactView) {
    var ColorPickerView = Backbone.View.extend({

        events: {
            "click .set-value-with-value": "setValue_colorPickerValue",
            "click .get-value-with-value": "getValue_colorPickerValue",
            "click .set-value-with-non-value": "setValue_colorPickerNonValue",
            "click .get-value-with-non-value": "getValue_colorPickerNonValue",
        },

        initialize: function () {
            this.addTemplates();
            !this.options.pluginView && this.render();
        },

        render: function () {
            this.addColorPickerReact();
            this.addColorPickerWidget();
            return this;
        },

        setValue_colorPickerValue: function () {
            this.colorPickerValue.setValue("348ccb");
        },

        getValue_colorPickerValue: function () {
            console.log(this.colorPickerValue.getValue());
        },

        setValue_colorPickerNonValue: function () {
            this.colorPickerNonValue.setValue("c95f18");
        },

        getValue_colorPickerNonValue: function () {
            console.log(this.colorPickerNonValue.getValue());
        },

        addTemplates: function () {
            this.$el.append(colorPickerExample);
            this.$colorPickerValue = this.$el.find(".color-picker-value");
            this.$colorPickerNonValue = this.$el.find(".color-picker-non-value");
            this.$colorPickerReactContainer = this.$el.find("#color-picker-react");
        },
        addColorPickerWidget: function() {
            this.colorPickerValue = new ColorPickerWidget({
                "container": this.$colorPickerValue,
                "value": "b988b9"
            }).build();
            this.colorPickerNonValue = new ColorPickerWidget({
                "container": this.$colorPickerNonValue
            }).build();
        },
        addColorPickerReact: function () {
            this.colorPickerComponentView = new ColorPickerReactView({
                $el: this.$colorPickerReactContainer
            }).render();
        }
    });

    return ColorPickerView;
});