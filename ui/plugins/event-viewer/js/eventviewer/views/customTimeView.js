/**
 * Custom Time Selection View
 * @module CustomTimeView
 * @author Anupama<athreyas@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/
define(['backbone', 'text!../templates/customTimeTemplate.html', 'lib/template_renderer/template_renderer', 
	'widgets/form/formValidator', 'widgets/datepicker/datepickerWidget', 'widgets/form/formWidget', '../conf/configs.js'
], function(Backbone, CustomTimeTemplate, TemplateRenderer, FormValidator, DatepickerWidget, FormWidget, Configs){
	//
	var CustomTimeView = Backbone.View.extend({
		initialize:function(options){
			console.log("custom view initialised");
			var me = this;
			me.formValidatorWidget = new FormValidator();
			me.configs = new Configs(options.context);
			me.currentTimeRange = options.currentTimeSelection;
			return this;
		},

		render:function(){
			var me = this,
				html = TemplateRenderer(CustomTimeTemplate, {
					"title":"Custom Time Range Selection", 
					"error_msg":me.options.context.getMessage("ev_custom_time_error_msg")
				});
			me.$el.append(html);
			me.containers = {
				"mainContainer": me.$el,
				"dateWidgetContainer": me.$el.find("event-viewer-custom-time-container")
			};

			var fromDateElement = me.containers.mainContainer.find(".event-viewer-custom-from-date");
			var toDateElement = me.containers.mainContainer.find(".event-viewer-custom-to-date");
			var fromTimeElement = me.containers.mainContainer.find(".event-viewer-custom-from-time");
			var toTimeElement = me.containers.mainContainer.find(".event-viewer-custom-to-time");

			me.fromDateWidget = new DatepickerWidget({
				container: fromDateElement
			}).build();
			me.fromDateWidget.setDate(me.currentTimeRange.startTime);

			me.toDateWidget = new DatepickerWidget({
				container: toDateElement
			}).build();
			me.toDateWidget.setDate(me.currentTimeRange.endTime);

			me.fromTimeWidget = new FormWidget({
				container: fromTimeElement,
				elements: me.configs.getCustomTimeFormElements()
			}).build();
			var startHours = me.currentTimeRange.startTime.getHours(),
				startMinutes = me.currentTimeRange.startTime.getMinutes(),
				startSeconds = me.currentTimeRange.startTime.getSeconds(),
				startPeriod = "AM";
			if(startHours >= 12){
				startPeriod = "PM";
				if(startHours > 12){
					startHours = startHours - 12;
				}
			}
			startHours = me.appendZero(startHours);
			startMinutes = me.appendZero(startMinutes);
			startSeconds = me.appendZero(startSeconds);
			me.$el.find('#from_time').val(startHours+":"+startMinutes+":"+startSeconds);
			me.$el.find('#from_time_period').val(startPeriod);
			
			me.toTimeWidget = new FormWidget({
				container: toTimeElement,
				elements: me.configs.getCustomTimeFormElements()
			}).build();
			var endHours = me.currentTimeRange.endTime.getHours(),
				endMinutes = me.currentTimeRange.endTime.getMinutes(),
				endSeconds = me.currentTimeRange.endTime.getSeconds(),
				endPeriod = "AM";
			if(endHours >= 12){
				endPeriod = "PM";
				if(endHours > 12){
					endHours = endHours - 12;
				}
			}
			endHours = me.appendZero(endHours);
			endMinutes = me.appendZero(endMinutes);	
			endSeconds = me.appendZero(endSeconds);
			me.$el.find('#to_time').val(endHours+":"+endMinutes+":"+endSeconds);
			me.$el.find('#to_time_period').val(endPeriod);
			//
            me.formValidatorWidget.validateForm(me.containers.mainContainer);
			return me;
		},

		appendZero: function(time){
			return time < 10 ? "0"+time : time; 
		},

		getDateTime: function(date, time, period){
			var hrs = time.split(":")[0], hrsInMS,
				mins = time.split(":")[1], minsInMS = mins * 60 * 1000, 
				secs = time.split(":")[2], secsInMS = secs * 1000;
			if(period == "PM"){
				if(hrs != "12"){
					hrs = parseInt(hrs) + 12;
				}
			}
			if(period == "AM" && hrs == "12"){
				hrs = parseInt(hrs) - 12;
			}
			hrsInMS = hrs * 60 * 60 * 1000;
			totalMS = hrsInMS + minsInMS + secsInMS;
			return new Date(date.getTime() + totalMS);
		},

		getTime: function(){
			var me = this,
				fromDate = me.fromDateWidget.getDate(),
				toDate = me.toDateWidget.getDate(),
				fromTime = me.$el.find('#from_time').val(),
				toTime = me.$el.find('#to_time').val(),
				fromTimePeriod = me.$el.find('#from_time_period').val(),
				toTimePeriod = me.$el.find('#to_time_period').val();
			if(fromTime == "")
				fromTime = "00:00:00";
			if(toTime == "")
				toTime = "00:00:00";
            return{
				"startTime": me.getDateTime(fromDate, fromTime, fromTimePeriod),
				"endTime": me.getDateTime(toDate, toTime, toTimePeriod)
			}
		}
	});
	//
	return CustomTimeView;
});