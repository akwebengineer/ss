/**
 *  to launch retry confirmation screen with all the faild devices listed
 *  @module Retry update view
 *  @author vinay<vinayms@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define([ 
	'backbone', 
	'widgets/grid/gridWidget', 
	'widgets/form/formWidget',
	'widgets/scheduleRecurrence/scheduleRecurrenceWidget', 
	'../conf/retryUpdateGridConf.js',
	'../conf/retryUpdateFormViewConf.js',
	'../../jobs/JobDetailedView.js',
    '../../../../sd-common/js/common/utils/TimeKeeper.js',
    './../../../../sd-common/js/publish/constants/publishConstants.js',
    '../../../../ui-common/js/common/utils/SmUtil.js'
	], 
	function(
		Backbone, 
		GridWidget, 
		FormWidget,
		ScheduleRecurrenceWidget, 
		GridConfiguration, 
		FormConfiguration,
		JobDetailedView,
		TimeKeeper,
		PublishConstants,
		SmUtil
	) {

	var RetryUpdateView = Backbone.View.extend({
		/**
         *   add event for
         *   closing,
         *   retry
         */
		events : {
			'click #update_job_retry_ok_button' : "retryUpdateJobs",
			'click #update_job_retry_cancel_button' : "closeOverlay"
		},
		/**
         *  Initialize all the view require params
         */
		initialize : function() {
			this.activity = this.options.activity;
			this.context = this.activity.context;
			this.model = this.model;

			this.retryURL = this.activity.getExtras().data.retryHREF;
			this.jobId = this.activity.getExtras().data.jobId;
		},
		/**
         *  Renders the form view in a overlay.
         *  returns this object
         */
		render : function() {
			this.createFormWiddget(new FormConfiguration(this.context).getValues());
			this.addGridWidget('update-device-list-grid', new GridConfiguration(this.context));
			return this;
		},
		/**
         *  builds the form 
         *   @params object(formConfig)
         */
		createFormWiddget : function(formConfig) {
			this.formWidget = new FormWidget({
				"elements" : formConfig,
				"container" : this.el
			});
			this.formWidget.build();
		},
		/**
         *  builds the grid and check for adding scheduler 
         *  @params string(id)
         *  @params object(gridConf)
         */
		addGridWidget : function(id, gridConf) {
			var self = this,
				gridContainer = self.$el.find('#' + id),
				configuration = gridConf.getValues(this.jobId);

			this.grid = new GridWidget({
				"container" : gridContainer,
				"elements" : configuration,
				"actionEvents" : {}
			});
			this.grid.build();

			// This is to build schedule recurrence widget
			jQuery.ajax({
				url : new SmUtil().buildDynamicURL(PublishConstants.RETRY_JOB_URL, [this.jobId]),
				type : 'GET',
				contentType : false,
				processData : false,
				headers : {
					Accept : PublishConstants.RETRY_UPDATE_ACCEPT_HEADER
				},
				success : function(response) {
					if (response && response['job']) {
						self.addScheduleWidget('update_schedule', response['job']);
					}
				},
				error : function(error) {
					console.log(error);
				}
			});
		},
		/**
         *  add scheduler for the form 
         *  @params string(id)
         *  @params object(job)
         */
		addScheduleWidget : function(id, job) {
			var self = this;
			var isRecurrenceDisabled = true;
			if (job) {
				if (job["supports-recurrence"]) {
					isRecurrenceDisabled = false;
				}
			}
			self.scheduleRecurrenceWidget = new ScheduleRecurrenceWidget({
				'title' : self.context.getMessage('update_job_retry_schedule_title'),
				"container" : self.$el.find('#'+id),
				'isFormSection' : true,
				disableRecurrenceSection : isRecurrenceDisabled
			}, self.context);

			 
			self.scheduleRecurrenceWidget.build();
			self.$el.find( '#'+id ).parent( ).css( 'width','75%' );

		},
		/**
         *  Retry job callback on success 
         *  @params string(jobid)
         */
		retryJobSuccessCallback: function(jobId){
			var intent = new Slipstream.SDK.Intent( PublishConstants.RETRY_UPDATE_INTENT_ACTION,{
                "mime_type": PublishConstants.RETRY_UPDATE_INTENT_MIME_TYPE
              });

          intent.putExtras({ data:{ job: { id: jobId } } });

          Slipstream.vent.trigger( "activity:start", intent );
		},
		/**
         *  retry final call
         *  @params event(mouse, keyboard)
         */
		retryUpdateJobs : function(e) {
			var self = this, 
			jsonData, deviceIds = [], selectedDevices = self.grid.getAllVisibleRows(),
			scheduleAtDate = self.scheduleRecurrenceWidget.getScheduleStartTime(),scheduleAt;
            if(!self.scheduleRecurrenceWidget.isValid()){
              return;
            }
            
            if(scheduleAtDate){
              scheduleAt = "schedule=(at("+scheduleAtDate.getSeconds()+" "+scheduleAtDate.getMinutes()+" "+scheduleAtDate.getHours()+" "+scheduleAtDate.getDate()+" "+(scheduleAtDate.getMonth()+1)+" ? "+scheduleAtDate.getFullYear()+")) ";
            }  

			jsonData = {
				'retry-failed-job' : {
					"all-failed-devices": true,
    				"job-id": self.jobId
				}
			};
			jQuery.ajax({
				url : PublishConstants.RETRY_UPDATE_FAILED_JOB_URL + (scheduleAtDate?'?'+scheduleAt:''),
				type : 'POST',
				dataType: "json",
				data : JSON.stringify(jsonData),
				headers : {
					"x-date": TimeKeeper.getXDate( ),
					"Accept" : PublishConstants.RETRY_UPDATE_FAILED_JOB_ACCEPT_HEADER,
					"Content-Type" : PublishConstants.RETRY_UPDATE_FAILED_JOB_CONTENT_TYPE_HEADER
				},
				success : function(response) {
					self.closeOverlay(e);
              		self.retryJobSuccessCallback(response.task.id);
				},
				error : function(error) {
					console.log(error);
				}
			});
		},
		/**
         *   destroy the overlay
         *   @params event(mouse, keyboard)
         */
		closeOverlay : function(event) {
			event.preventDefault();
			this.activity.overlay.destroy();
		}
	});
	return RetryUpdateView;
});
