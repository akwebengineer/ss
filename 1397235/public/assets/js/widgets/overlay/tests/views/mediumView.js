define([
    'backbone',
    'widgets/overlay/tests/conf/config',
    'text!widgets/overlay/tests/templates/exampleTemplate.html',
    'widgets/overlay/tests/views/smallView',
    'widgets/overlay/overlayWidget'
], function (Backbone, Conf, ExampleTemplate, SampleView, OverlayWidget) {
    var AppView = Backbone.View.extend({

        events: {
            'click #callNestedOverlay': 'createNestedOverlay',
            'click #yes': 'eventClicked'
        },

        render: function () {
            var template = Hogan.compile(ExampleTemplate);
            var elementsTemplateHtml = template.render(Conf.elements);
            $(this.el).append(elementsTemplateHtml);
            return this;
        },

        createNestedOverlay: function () {
            var sampleViewObj = new SampleView({});

            var conf = {
                view: sampleViewObj,
                xIconEl: true,
                cancelButton: false,
                okButton: false,
                type: 'small'
            };
            this.overlayWidgetObj = new OverlayWidget(conf);
            this.overlayWidgetObj.build();
        },

        eventClicked: function () {
            console.log("event clicked from mediumView");
        }
    });

    return AppView;
});