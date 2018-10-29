/**
 * View for Advanced Settings Tab in Policy Profile.
 *
 * @module AdvancedSettingsView
 * @author Damodhar M <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/advancedSettingsDetailedViewConf.js'
], function (Backbone, Syphon, FormWidget, AdvancedSettingsConf) {

    var AdvancedSettingsView = Backbone.View.extend({
        initialize : function(options){
            this.context = options.context;
            this.customGridData = new Backbone.Collection();
        },

        render : function(){
            var self = this;

            var formConfiguration = new AdvancedSettingsConf(this.context);

            var formElements = formConfiguration.getValues();

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.toJSON()
            });
            this.form.build();
            this.$el.find('input[name=services-offload]').attr("checked", this.model.get("service-offload"));
            this.$el.find('input[name=tcp-syn-check]').attr("checked", this.model.get("tcp-syn-check"));
            this.$el.find('input[name=tcp-seq-check]').attr("checked", this.model.get("tcp-seq-check"));            

            this.$el.find('input[name=services-offload]').attr("disabled",true);
            this.$el.find('input[name=tcp-syn-check]').attr("disabled",true);
            this.$el.find('input[name=tcp-seq-check]').attr("disabled",true);            
            return this;
        }
        
    });

    return AdvancedSettingsView;
});