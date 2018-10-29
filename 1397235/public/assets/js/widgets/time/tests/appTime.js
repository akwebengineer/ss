define([
    'backbone',
    'lib/template_renderer/template_renderer',
    'widgets/time/tests/appTestDeclarative',
    'widgets/time/tests/appFormIntegration',
    'text!widgets/time/tests/templates/timeExample.html',
    'es6!widgets/time/react/tests/view/timeView'
], function (Backbone, render_template, TimeViewD, TimeViewF, example, TimeComponentView) {

    var timeWidget = Backbone.View.extend({
        initialize: function () {
            this.addContent(this.$el, example);
            !this.options.pluginView && this.render();
        },
        render: function () {
            new TimeViewD({
                el: this.$el.find('#test_widget_declarative')
            });
            new TimeViewF({
                el: this.$el.find('#test_integrated_timeWidget')
            });

            this.addReactComponent();

            return this;
        },
        addContent: function ($container, template) {
            $container.append((render_template(template)));
        },
        addReactComponent: function () {
            new TimeComponentView({
                $el: this.$el.find('#time_react')
            }).render();
        }
    });

    return timeWidget;
});