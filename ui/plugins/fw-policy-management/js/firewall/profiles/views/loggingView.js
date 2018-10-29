/**
 * View for Logging Tab in Policy Profile.
 *
 * @module LoggingView
 * @author Vinamra Jaiswal <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/loggingFormConf.js'
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
            this.$el.find('input[name=enable-log-session-init]').attr("checked", this.model.get("log-at-session-init-time"));
            this.$el.find('input[name=enable-log-session-close]').attr("checked", this.model.get("log-at-session-close"));
            this.$el.find('input[name=enable-count]').attr("checked", this.model.get("enable-count"));
            this.$el.find('#alarm-threshold-bytes-second').val(this.model.get("per-second-alarm-threshold"));
            this.$el.find('#alarm-threshold-kilo-minute').val(this.model.get("per-minute-alarm-threshold"));
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