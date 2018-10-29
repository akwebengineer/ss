define([
    'backbone',
    'lib/template_renderer/template_renderer',
    'widgets/spinner/tests/appDeterminateSpinner',
    'widgets/spinner/tests/appIndeterminateSpinner',
    'widgets/spinner/tests/appOverlaySpinner',
    'es6!widgets/spinner/react/tests/view/determinateSpinnerComponentView',
    'es6!widgets/spinner/react/tests/view/indeterminateSpinnerComponentView',
    'text!widgets/spinner/tests/templates/spinnerExample.html'
], function(Backbone, render_template,DSpinner,ISpinner,OSpinner,DSpinnerComponentView,ISpinnerComponentView,example){

    var spinnerWidget = Backbone.View.extend({
        initialize: function(){
            this.addContent(this.$el, example);
            !this.options.pluginView && this.render();
        },
        render: function () {
            //Spinner Widget
            new ISpinner({
                el: this.$el.find('#spinner2')
            });
            new DSpinner({
                el: this.$el.find('#spinner1')
            });
            new OSpinner({
                el: this.$el.find('#spinner3')
            });

            //React Spinner
            new DSpinnerComponentView({
                $el: this.$el.find('#spinner1_react')
            }).render();
            new ISpinnerComponentView({
                $el: this.$el.find('#spinner2_react')
            }).render();
            return this;
        },
        addContent:function($container, template) {
            $container.append((render_template(template)));
        } 
    });

    
    return spinnerWidget;
});