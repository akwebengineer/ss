/**
 * View for Advanced Settings Tab in Policy Rule Profile.
 *
 * @module AdvancedSettingsView
 * @author Judy Nguyen <jnguyen@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../../profiles/conf/advancedSettingsConf.js',
    'widgets/dropDown/dropDownWidget'
], function (Backbone, Syphon, FormWidget, AdvancedSettingsConf, DropDownWidget) {

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

            this.addrTranslationDropDown = this.createDropDown('address-translation',
                [{"text": "None","id": "NONE"},
                {"text": "Drop Translated","id": "DROP_TRANSLATED"},
                {"text": "Drop Untranslated","id": "DROP_UNTRANSLATED"}],
                'Select Translation');
            this.redirectDropDown = this.createDropDown('redirect',
                [{"text": "None","id": "NONE"},
                {"text": "Redirect Wx","id": "REDIRECT_WX"},
                {"text": "Reverse Redirect Wx","id": "REVERSE_REDIRECT_WX"}],
                'Select Redirect');

            if(Object.keys(this.model.toJSON()).length !== 0){
                this.modifyForm();
            }   
            else{
                //set defaults for fields
                this.setDefaults();
            }

            return this;
        },

        createDropDown: function(container,data,placeholder,onchange){
              var self = this;
              this.$el.find('#'+container).append('<select class="'+container+'" style="width: 100%"></select>');
              return new DropDownWidget({
                  "container": this.$el.find("."+container),
                  "data": JSON.stringify(data),
                  "placeholder": placeholder,
                  "enableSearch": true,
                  "onChange": function(event) {
                      if (onchange) {onchange($(this).val(),self);}
                   }
              }).build();
            },

        /*
            Incase of modify and clone fill the form values with the data of the selected profile
        */
        modifyForm : function(data){
            var customProfile = this.model.get("rule-profile")["custom-profile"];
            if (customProfile && customProfile["service-offload"])
                this.$el.find('input[name=services-offload]').attr("checked", customProfile["service-offload"]);
            if (customProfile && customProfile["destination-address-translation"])
                this.addrTranslationDropDown.setValue(customProfile["destination-address-translation"]||"NONE");
            if (customProfile && customProfile["redirect"])
                this.redirectDropDown.setValue(customProfile["redirect"]||"NONE");
            if (customProfile && customProfile["tcp-syn-check"])
                this.$el.find('input[name=tcp-syn-check]').attr("checked", customProfile["tcp-syn-check"]);
            if (customProfile && customProfile["tcp-seq-check"])
                this.$el.find('input[name=tcp-seq-check]').attr("checked", customProfile["tcp-seq-check"]);                
        },

        //set the defaults for the fields
        setDefaults : function(){

        },

        getViewData : function(){
            if (this.form && this.form.isValidInput()) {
                var data = Syphon.serialize(this);
                console.log("AdvancedSettings Data");
                console.log(data);
                return data;
            }
        }
    });

    return AdvancedSettingsView;
});