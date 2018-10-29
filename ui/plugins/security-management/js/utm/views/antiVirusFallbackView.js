  /**
 * A view implementing fallback form workflow for create UTM Anti-Virus Profile wizard.
 *
 * @module antiVirusFallbackView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/antiVirusFallbackFormConf.js',
    '../views/antiVirusStepView.js'
], function(Backbone, Syphon, FormWidget, Form, StepView) {

    var FormView = StepView.extend({  
     render: function(){
       var formConfiguration = new Form(this.context);
        this.form = new FormWidget({
            "container": this.el,
            elements: formConfiguration.getValues(),
            values: this.model.attributes
        });
        this.form.build();

        this.model.set("wizard_reset_flag", true);

        if ("KASPERSKY" != this.model.get('profile-type')) {
            this.$el.find('#dropdown_engine_error option[value="PERMIT"]').remove();
            this.$el.find('#dropdown_content_size option[value="PERMIT"]').remove();
            this.$el.find('#dropdown_default_action option[value="PERMIT"]').remove();
        }

        // Add unit for content size(temporary workaround)
        var content_unit = "<span id='content_unit' class='optionselection inline'>"+ 
            "<label>"+ '&nbsp;' +this.context.getMessage('utm_antivirus_kb') +"</label></span>";
        this.$el.find("#anti_virus_content_size_limit").parent().after(content_unit);

        // bind some validation for current page
        this.fallbackInfoValidation(formConfiguration.getValues());

        // get values from model for form elements
        this.getFallbackInfo();

        return this;
     },

     getTitle: function(){
         return this.context.getMessage('utm_antivirus_fallback_heading');
     },

    getSummary: function() {
        return this.generateSummary('utm_antivirus_fallback_heading');
    },

    beforePageChange: function() {
        if (! this.form.isValidInput() || ! this.isTextareaValid() || ! this.isFormValid("anti-virus-fallback-form")) {
             console.log('form is invalid');
             return false;
         }

        var properties = Syphon.serialize(this);
        var fallbackInfo = this.setFallbackInfo(properties);

        this.model.set(fallbackInfo);
        return true;
    },

    fallbackInfoValidation: function(formElements) {
        // Bind blur event
        this.bindBlur(['anti_virus_file_extension'], function(comp){
            this.separateValuesWithBlank(comp);
        });

        this.addSubsidiaryFunctions(formElements);
    },

    getFallbackInfo: function() {
        

        // Set value for dropdown items 
        if (this.model.get('fallback-options')) {
            var widgets = this.form.getInstantiatedWidgets();
            var fallbackOptions = this.model.get('fallback-options');
            if(fallbackOptions["fallback-option"] && fallbackOptions["fallback-option"]["engine-error"]) {
                widgets["dropDown_dropdown_engine_error"]["instance"].setValue(fallbackOptions["fallback-option"]["engine-error"]);
            }

            if(fallbackOptions["fallback-option"] && fallbackOptions["fallback-option"]["default-action"]) {
                widgets["dropDown_dropdown_default_action"]["instance"].setValue(fallbackOptions["fallback-option"]["default-action"]);
            }

            if(fallbackOptions["content-size"]) {
                widgets["dropDown_dropdown_content_size"]["instance"].setValue(fallbackOptions["content-size"]);
            }

            if(fallbackOptions["password-file"]) {
                widgets["dropDown_dropdown_password"]["instance"].setValue(fallbackOptions["password-file"]);
            }

            if(fallbackOptions["corrupt-file"]) {
                widgets["dropDown_dropdown_corrupt"]["instance"].setValue(fallbackOptions["corrupt-file"]);
            }

            if(fallbackOptions["decompress-layer"]) {
                widgets["dropDown_dropdown_decompress"]["instance"].setValue(fallbackOptions["decompress-layer"]);
            }
        } else {
            // set default value for dropdown list
            var widgets = this.form.getInstantiatedWidgets();
            var BLOCK = "BLOCK";
            widgets["dropDown_dropdown_password"]["instance"].setValue(BLOCK);
            widgets["dropDown_dropdown_corrupt"]["instance"].setValue(BLOCK);
            widgets["dropDown_dropdown_decompress"]["instance"].setValue(BLOCK);
            widgets["dropDown_dropdown_engine_error"]["instance"].setValue(BLOCK);
            widgets["dropDown_dropdown_content_size"]["instance"].setValue(BLOCK);
            widgets["dropDown_dropdown_default_action"]["instance"].setValue(BLOCK);
        }
        
        if ("KASPERSKY" != this.model.get('profile-type')) {
            // remove password protected, corrupt file, decompress layer and file extensions
            this.$el.find(".kaspersky-type-specific-settings").remove();
        }
    },

    setFallbackInfo: function(properties) {
        var jsonDataObj = {};

        jsonDataObj["scan-options"] = {};

        if (properties["anti_virus_content_size_limit"])
        {
            jsonDataObj["scan-options"]["content-size-limit"] = properties["anti_virus_content_size_limit"];
        }
        if (properties["anti_virus_file_extension"])
        {
            jsonDataObj["scan-options"]["scan-file-extension"] = properties["anti_virus_file_extension"];
        }

        jsonDataObj["fallback-options"] = {};
        if (properties["dropdown_engine_error"] || properties["dropdown_default_action"])
        {
            jsonDataObj["fallback-options"]["fallback-option"] = {};
            if (properties["dropdown_engine_error"])
            {
                jsonDataObj["fallback-options"]["fallback-option"]["engine-error"] = properties["dropdown_engine_error"];
            } 
            if (properties["dropdown_default_action"])
            {
                jsonDataObj["fallback-options"]["fallback-option"]["default-action"] = properties["dropdown_default_action"];
            }
        }

        if (properties["dropdown_content_size"])
        {
            jsonDataObj["fallback-options"]["content-size"] = properties["dropdown_content_size"];
        }
        if (properties["dropdown_password"])
        {
            jsonDataObj["fallback-options"]["password-file"] = properties["dropdown_password"];
        }
        if (properties["dropdown_corrupt"])
        {
            jsonDataObj["fallback-options"]["corrupt-file"] = properties["dropdown_corrupt"];
        }
        if (properties["dropdown_decompress"])
        {
            jsonDataObj["fallback-options"]["decompress-layer"] = properties["dropdown_decompress"];
        }

        return jsonDataObj;
    }

  });

  return FormView;
});