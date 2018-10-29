/**
 * View for Advanced Settings Tab in Policy Profile.
 *
 * @module AdvancedSettingsView
 * @author Wasim Afsar A <wasima@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/advancedSettingsConf.js',
    'widgets/dropDown/dropDownWidget'
], function (Backbone, Syphon, FormWidget, AdvancedSettingsConf,DropDownWidget) {

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
            this.$el.find('input[name=services-offload]').attr("checked", this.model.get("service-offload"));
            this.addrTranslationDropDown.setValue(this.model.get("destination-address-translation"));
            this.redirectDropDown.setValue(this.model.get("redirect"));
            this.$el.find('input[name=tcp-syn-check]').attr("checked", this.model.get("tcp-syn-check"));
            this.$el.find('input[name=tcp-seq-check]').attr("checked", this.model.get("tcp-seq-check"));
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