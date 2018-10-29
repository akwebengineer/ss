define([
    'backbone',
    'lib/template_renderer/template_renderer',
    'text!widgets/datepicker/tests/templates/datepickerExample.html',
    'widgets/datepicker/tests/appTestDeclarative',
    'widgets/datepicker/tests/appTestDatepickerFormats',
    'widgets/datepicker/tests/appTestDateRange',
    'es6!widgets/datepicker/react/tests/view/datepickerComponentView'
], function (Backbone, render_template, example, DatepickerView1, DatepickerView2, DatepickerView3, DatepickerComponentView) {

    var datepickerWidget = Backbone.View.extend({

        initialize: function () {
            this.addContent(this.$el, example);
            !this.options.pluginView && this.render();
        },
        render: function () {
            new DatepickerView1({
                el: this.$el.find('#test_widget')
            });
            new DatepickerView2({
                el: this.$el.find('#test_date_formats')
            });
            new DatepickerView3({
                el: this.$el.find('#test_date_range')
            });
            this.datepickerComponentView = new DatepickerComponentView({
                $el: this.$el.find('#test_datepicker_react')
            }).render();
            return this;
        },
        addContent: function ($container, template) {
            $container.append((render_template(template)));
        }
    });
    return datepickerWidget;
});