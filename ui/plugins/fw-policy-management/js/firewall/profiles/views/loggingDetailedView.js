/**
 * View for Logging Tab in Policy Profile.
 *
 * @module LoggingView
 * @author Damodhar M <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/loggingDetailedViewConf.js'
], function (Backbone, Syphon, FormWidget, LoggingFormConf) {

    var LoggingView = Backbone.View.extend({
        initialize : function(options){
            this.context = options.context;
            this.customGridData = new Backbone.Collection();
        },

        render : function(){
            var self = this;

            var formConfiguration = new LoggingFormConf(this.context);

            var formElements = formConfiguration.getValues();

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.toJSON()
            });
            this.form.build();
            this.$el.find('input[name=enable-log-session-init]').attr("checked", this.model.get("log-at-session-init-time"));
            this.$el.find('input[name=enable-log-session-close]').attr("checked", this.model.get("log-at-session-close")); 
            this.$el.find('input[name=enable-count]').attr("checked", this.model.get("enable-count")); 
            
            this.$el.find('input[name=enable-log-session-init]').attr('disabled',true);
            this.$el.find('input[name=enable-log-session-close]').attr('disabled',true);
            this.$el.find('input[name=enable-count]').attr('disabled',true);
            
            if(this.$el.find('input[name=enable-count]').checked){
                   this.$el.find('.natproperties').show();
            }else{
                    self.$el.find('.natproperties').hide();
            } 
            return this;
        }
    });

    return LoggingView;
});