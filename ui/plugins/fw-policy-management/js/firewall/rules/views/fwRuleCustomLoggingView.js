/**
 * View for Logging Tab in Policy Rule Profile.
 *
 * @module LoggingView
 * @author Judy Nguyen <jnguyen@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../../profiles/conf/loggingFormConf.js'
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

            if(Object.keys(this.model.toJSON()).length !== 0){
                this.modifyForm();
            }   
            else{
                //set defaults for fields
                this.setDefaults();
            }

            this.initializelisteners();

            return this;
        },

        /*
            Incase of modify and clone fill the form values with the data of the selected profile
        */
        modifyForm : function(data){
            var customProfile = this.model.get("rule-profile")["custom-profile"];
            if (customProfile && customProfile["log-at-session-init-time"])
                this.$el.find('input[name=enable-log-session-init]').attr("checked", customProfile["log-at-session-init-time"]);
            if (customProfile && customProfile["log-at-session-close"])
                this.$el.find('input[name=enable-log-session-close]').attr("checked", customProfile["log-at-session-close"]);
            if (customProfile && customProfile["enable-count"])
                this.$el.find('input[name=enable-count]').attr("checked", customProfile["enable-count"]);
            if (customProfile && customProfile["per-second-alarm-threshold"])
                this.$el.find('#alarm-threshold-bytes-second').val(customProfile["per-second-alarm-threshold"]);
            if (customProfile && customProfile["per-minute-alarm-threshold"])
                this.$el.find('#alarm-threshold-kilo-minute').val(customProfile["per-minute-alarm-threshold"]);
        },

        // listeners

        initializelisteners : function(){
            var self = this;
            this.$el.find('input[name=enable-count]').click(function(d) {
                if(d.currentTarget.checked){
                   self.$el.find('.natproperties').show();
                }
                else{
                    self.$el.find('#alarm-threshold-bytes-second').val("");
                    self.$el.find('#alarm-threshold-kilo-minute').val("");
                    self.$el.find('.natproperties').hide();
                } 
           });
        },

        //set the defaults for the fields
        setDefaults : function(){

        },

        getViewData : function(){
            if (this.form && this.form.isValidInput()) {
                var data = Syphon.serialize(this);
                console.log("Logging data");
                console.log(data);
                return data;
            }
        }
    });

    return LoggingView;
});