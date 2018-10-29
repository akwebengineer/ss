define([
    'backbone',
    'widgets/spinner/spinnerWidget',
    'widgets/form/formWidget',
    '../conf/formConfiguration',
    'lib/template_renderer/template_renderer',
    'text!widgets/spinner/templates/loadingBackground.html'
], function (Backbone, SpinnerWidget, FormWidget, FormConfiguration, render_template, LoadingBackgroundTemplate) {
    var ActivityIndicatorView = Backbone.View.extend({

        events: {
            'click #add_policy_save': 'loadSpinner',
            'click #add_policy_cancel': 'closeOverlay'
        },
        initialize: function () {
            var indicatorOverlay;
        },
        render: function () {
            
            this.form = new FormWidget({
                    "elements": FormConfiguration.ZonePolicies,
                    "container": this.el
                });
                this.form.build();
            
            return this;
        },
        loadSpinner: function(){
            // Check is form valid
            if (! this.form.isValidInput()) {
                console.log('form is invalid');
            }else{
                var self = this,
                    spinner = new SpinnerWidget({
                        "container": this.options.myOverlay.getOverlayContainer(),
                        "statusText": 'Current stage of operation...'
                    }).build();

                //Add spinner and spinner background to the overlay element
                //We can use slipstream-indicator-background class to set up the default spinner background
                this.$el.append(spinner).append(render_template(LoadingBackgroundTemplate));

                indicatorOverlay = setTimeout(function () {
                    self.$el.trigger("spinner_timeout");
                }, 2000);
            }
        },
        closeOverlay: function(){
            this.$el.trigger("spinner_timeout");
            clearTimeout(indicatorOverlay);
        }
    });

    return ActivityIndicatorView;
});