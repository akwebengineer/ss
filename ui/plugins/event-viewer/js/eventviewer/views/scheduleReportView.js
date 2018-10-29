/**
 *  A view implementing schedule form workflow for Create Report Wizard
 *  
 *  @module CreateReport - EventViewer
 *  @author Slipstream Developers <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define([
	'backbone',
	'backbone.syphon',
    './wizardStepView.js',
	'widgets/form/formWidget',
	'../../../../sd-common/js/common/widgets/scheduler/schedulerWidget.js',
	'../../../../sd-common/js/common/widgets/scheduler/models/schedulerModel.js'
	], function(
		Backbone,
		Syphon,
		WizardStepView,
		FormWidget,
	    SchedulerWidget,
	    SchedulerModel
	){

	var ScheduleReportView = WizardStepView.extend({

        initialize:function(options){
            WizardStepView.prototype.initialize.call(this);
            console.log(options);
            var me = this;
            me.options = options;
            me.context = options.context;
            me.model = options.model;
            me.schedulerModel = new SchedulerModel({
                "scheduler":{
                    "start-time": new Date()//initialize again at the time of invoke
                }
            });
        },

        render: function(){
            console.log('Schedule Report Widget view rendered');
            var me = this;

            me.schedulerWidget = new SchedulerWidget({
                "context": me.context,
                "model": me.schedulerModel
            });
            me.$el.append(me.schedulerWidget.render().$el);

            return this;
        },

        getTitle: function () {
            return this.context.getMessage('ev_create_report_schedule_page_summary');
        },
        //
        getSummary: function() {
            return this.generateSummary('ev_create_report_schedule_page_summary');
        },

        /*
         * Handles back and next button clicks on the short wizard.
         */
        beforePageChange: function() {

            var me = this;
            if(me.schedulerWidget.isValid() === false) {
                return false;
            }
            me.schedulerWidget.getValues();
            me.model.set("scheduler", me.schedulerModel.get("scheduler"));
            me.schedulerWidget && me.schedulerWidget.destroy();
            return true;
        },
        getFormData: function() {
            var self = this;
            self.formData = {};
            self.formLabel = {};

            self.formLabel["recurrence_unit_id"]    = self.context.getMessage('ev_create_report_form_schedule_type');
            self.formLabel["recurrence_value_id"]   = self.context.getMessage('ev_create_report_form_occurence');
            self.formLabel["recurrence_start_id"]   = self.context.getMessage('ev_create_report_form_start_date');
            self.formLabel["recurrence_days_id"]    = self.context.getMessage('ev_create_report_form_date_of_month');
            self.formLabel["recurrence_end_id"]     = self.context.getMessage('ev_create_report_form_end_date');

            if(self.schedulerModel && self.schedulerModel.get('scheduler')['start-time']){

                self.formData["recurrence_unit_id"] = self.schedulerModel.get('scheduler')["schedule-type"];
                self.formData["recurrence_value_id"] = self.schedulerModel.get('scheduler')["re-occurence"];
                self.formData["recurrence_start_id"] = self.getMilliseconds(self.schedulerModel.get('scheduler')["start-time"]);
                if(self.schedulerModel.get('scheduler')["schedule-type"] === "Monthly"){
                    self.formData["recurrence_days_id"] = self.schedulerModel.get('scheduler')["date-of-month"];
                }
                if(self.schedulerModel.get('scheduler')["schedule-type"] === "Weekly"){
                    self.formData["recurrence_days_id"] = self.schedulerModel.get('scheduler')["days-of-week"]["day-of-week"].toString();
                }

                if(self.schedulerModel.get('scheduler')["end-time"] !== null && self.schedulerModel.get('scheduler')["end-time"] !== 10445221800000){
                    self.formData["recurrence_end_id"] = self.getMilliseconds(self.schedulerModel.get('scheduler')["end-time"]);
                }else{
                    self.formData["recurrence_end_id"] = "Never";
                }
            }

            return this.formData;
        },
        getMilliseconds: function(date) {
            var d = new Date(date);
            var ms = d.toString();
            return ms;
        }


	});

	return ScheduleReportView;
});