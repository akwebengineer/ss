define([
    'backbone',
    'lib/template_renderer/template_renderer',
    'widgets/progressBar/tests/appIndeterminateProgressBar',
    'widgets/progressBar/tests/appDeterminateProgressBar',
    'es6!widgets/progressBar/react/tests/views/determinateProgressBarComponentView',
    'es6!widgets/progressBar/react/tests/views/indeterminateProgressBarComponentView',
    'text!widgets/progressBar/tests/templates/progressBarExample.html'
], function(Backbone, render_template,IProgressBar,DProgressBar,DProgressBarComponent,IProgressBarComponent,example){

    var progressBarWidget = Backbone.View.extend({
        initialize: function(){
            this.addContent(this.$el, example);
            !this.options.pluginView && this.render();
        },
        render: function () {
            new IProgressBar({
                el: this.$el.find('#progressBar2')
            });
            new DProgressBar({
                el: this.$el.find('#progressBar1')
            });

            //React Spinner
            new DProgressBarComponent({
                $el: this.$el.find('#progressBar1_react')
            }).render();
            new IProgressBarComponent({
                $el: this.$el.find('#progressBar2_react')
            }).render();
            return this;
        },
        addContent:function($container, template) {
            $container.append((render_template(template)));
            
        } 
    });

    
    return progressBarWidget;
});