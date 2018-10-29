/**
 * The form test page.
 * @copyright Juniper Networks, Inc. 2014
 * @author Miriam Hadfield <mhadfield@juniper.net>
 */


define([
    '/assets/js/widgets/baseWidgetTest.js',
], function (BaseWidgetTest) {

    var WidgetTest = function () {
        BaseWidgetTest.call(this);
        this.init(function () {
            require([
                'backbone',
            ], function (Backbone) {
                var FormView = Backbone.View.extend({

                    render: function () {
                        var formExample = window.location.hash.substring(1);
                        switch (formExample) {
                            case 'copy':
                                // Renders a form that provides cloning of rows
                                this.createView('widgets/form/tests/appCopyRowsForm');
                                break;
                            case 'declarative':
                                // Renders a declarative form from the declarativeFormSample.html in template folder
                                this.createView('widgets/form/tests/appDeclarativeFormValidator');
                                break;
                            case 'nobinding':
                                // Renders a form from the elements configuration file without data binding
                                this.createView('widgets/form/tests/appElementsForm');
                                break;
                            default:
                                // Renders a form from two configuration Objects: the elements and the values
                                this.createView('widgets/form/tests/appForm');
                                break;
                        }
                    },

                    createView: function (viewPath) {
                        var formContainer = this.el;
                        require([viewPath], function (FormView) {
                            new FormView({
                                el: formContainer
                            });
                        });
                    }

                });

                new FormView({
                    el: '#test_form_widget'
                }).render();

            });
        });
    };
    WidgetTest.prototype = Object.create(BaseWidgetTest.prototype);
    WidgetTest.prototype.constructor = WidgetTest;

    new WidgetTest();

    return WidgetTest;
});

