/**
 *  A view implementing general form workflow for Create Alert Wizard
 *
 *  @module EventViewer
 *  @author Shini <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define([
	'backbone',
	'backbone.syphon',
	'../conf/alertConfigs.js',
	'widgets/form/formWidget',
	'./wizardStepView.js'
	], function(
		Backbone,
	    Syphon,
		AlertConfigs,
		FormWidget,
		WizardStepView
		){

	var GeneralAlertView = WizardStepView.extend({

		initialize:function(options){
		    WizardStepView.prototype.initialize.call(this);
			console.log(options);
			var me=this;
			me.options = options;
			me.context = options.context;
			me.model = options.model;
		},

		render: function(){
			console.log('General alert view rendered');
			var me=this, 
				formConfig = new AlertConfigs(me.context),
	            formElements = formConfig.generalConfig();

			me.formWidget = new FormWidget({
               	container: me.el,
                elements: formElements,
                values: this.model.attributes
            });
			me.formWidget.build();			
            // get values from model for form elements
            this.getGeneralInfo();

			// bind some validation for current page
          //  this.addSubsidiaryFunctions(formConfig.generalConfig());
			return this;
		},
		//
		getTitle: function () {
	      return this.context.getMessage('ev_create_alert_general_page_summary');
	    },
	    //
	    getSummary: function() {
            return this.generateSummary('ev_create_alert_general_page_summary');
        },
        //
        beforePageChange: function() {

            if (! this.formWidget.isValidInput()) {
                 console.log('form is invalid');
                 return false;
             }
            var properties = Syphon.serialize(this);
            GeneralInfo = this.setGeneralInfo(properties);

            this.model.set(GeneralInfo);
            return true;
        },
        //
        getGeneralInfo: function() {

        },
        //
        setGeneralInfo: function(properties) {
            var jsonDataObj = {};

            jsonDataObj = {
               "name" : properties['name'],
               "description": properties['description'],
               "status": properties['status'],
               "severity": properties['severity']
            };
            return jsonDataObj;
        }
        //
	});

	return GeneralAlertView;
});