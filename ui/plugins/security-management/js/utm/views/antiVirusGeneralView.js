  /**
 * A view implementing general form workflow for create UTM Anti-Virus Profile wizard.
 * @module antiVirusGeneralView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/antiVirusGeneralFormConf.js',
    '../views/antiVirusStepView.js'
], function(Backbone, Syphon, FormWidget, Form, StepView) {

    var FormView = StepView.extend({
     events: {
         'change #dropdown_engine_type': 'changeEngineType' 
     },

     initialize: function() {
         StepView.prototype.initialize.call(this);
         this.wizardView = this.options.wizardView;
         return this;
     },

     render: function(){
        var formConfiguration = new Form(this.context),
            formElements = formConfiguration.getValues();
        // Add name remote validation
        this.wizardView.addRemoteNameValidation(formElements);
        this.form = new FormWidget({
            "container": this.el,
            elements: formElements,
            values: this.model.attributes
        });
        this.form.build();

        // bind some validation for current page
        this.addSubsidiaryFunctions(formConfiguration.getValues());

        // get values from model for form elements
        this.getGeneralInfo();

        return this;
     },

     getTitle: function(){
         return this.context.getMessage('utm_antivirus_general_heading');
     },

     getSummary: function() {
          return this.generateSummary('utm_antivirus_general_heading');
     },

     beforePageChange: function(currentStep, requestedStep) {
         if (currentStep > requestedStep) {
             return true; // always allow to go back
         }
        if (! this.form.isValidInput() || ! this.isTextareaValid()) {
             console.log('form is invalid');
             return false;
         }
        var properties = Syphon.serialize(this);
        var generalInfo = this.setGeneralInfo(properties);

        this.model.set(generalInfo);
        return true;
    },

    getGeneralInfo: function() {
        var widgets = this.form.getInstantiatedWidgets()["dropDown_dropdown_engine_type"];
        if (!widgets || !widgets["instance"]) {
            return false; // no such dropdown
        }
        widgets["instance"].setValue(this.model.get('profile-type') || "JUNIPER_EXPRESS");
    },

    setGeneralInfo: function(properties) {
        var jsonDataObj = {};

        jsonDataObj = {
            "name" : properties["name"],
            "description": properties["description"],
            "profile-type": properties["dropdown_engine_type"]
          };
        return jsonDataObj;
    },

    changeEngineType: function() { 
        var self = this; 

        if (this.model.get("wizard_reset_flag")) {
            if (self.model.get("profile-type") != self.$el.find("#dropdown_engine_type").val()) {
                var conf = { 
                        title: self.context.getMessage('utm_antivirus_confirmation_dialog_title'), 
                        question: this.context.getMessage('utm_antivirus_confirmation_dialog_question'),
                        yesEvent: function() { 
                            // Reset values in the wizard 
                            self.model.clear(); 
                            self.model.set("wizard_reset_flag", false); 
                        }, 
                        noEvent: function() { 
                            // Reset "engine type" change to previous selected value 
                            self.form.getInstantiatedWidgets()["dropDown_dropdown_engine_type"]["instance"].setValue(self.model.get('profile-type'));
                        } 
                }; 

                this.createConfirmationDialog(conf); 
            }
         }
    }

  });

  return FormView;
});