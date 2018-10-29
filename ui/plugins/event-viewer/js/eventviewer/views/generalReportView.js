/**
 *  A view implementing general form workflow for Create Report Wizard
 *
 *  @module CreateReport - EventViewer
 *  @author Shini <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define([
	'backbone',
	'backbone.syphon',
	'../conf/reportConfigs.js',
	'widgets/form/formWidget',
	'./wizardStepView.js'
	], function(
		Backbone,
	    Syphon,
		ReportConfigs,
		FormWidget,
		WizardStepView
	){

	var GeneralReportView = WizardStepView.extend({

		initialize:function(options){
		    WizardStepView.prototype.initialize.call(this);
			console.log(options);
			var me = this;
			me.options = options;
			me.context = options.context;
			me.model = options.model;
		},

		render: function(){
			console.log('General Information report view rendered');
			var me = this, 
				formConfig = new ReportConfigs(me.context),
	            formElements = formConfig.generalConfig();

			me.formWidget = new FormWidget({
               	container: me.el,
                elements: formElements,
                values: this.model.attributes
            });
			me.formWidget.build();			
            // get values from model for form elements
            this.getGeneralInfo();

			return this;
		},
		//
		getTitle: function () {
	      return this.context.getMessage('ev_create_report_general_page_summary');
	    },
	    //
	    getSummary: function() {
            return this.generateSummary('ev_create_report_general_page_summary');
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
               "report-content-type": "LOG"             
            };
            return jsonDataObj;
        }
        //
	});

	return GeneralReportView;
});