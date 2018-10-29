/**
 * Custom Time Selection View
 * @module CustomTimeView
 * @author Dharma<adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/
define(['backbone', 'text!../templates/customTime.html', 'lib/template_renderer/template_renderer', 
	'../conf/appSecureConfigs.js', 'widgets/form/formValidator', 'widgets/datepicker/datepickerWidget'
], function(Backbone, CustomTimeTemplate, TemplateRenderer, AppSecureConfigs, FormValidator, DatepickerWidget){
	//
	var CustomTimeView = Backbone.View.extend({
		initialize:function(options){
			console.log("custom view initialised");
			var me=this;
			me.options = options;
			me.configs = new AppSecureConfigs(options.context);
			me.timeRange = options.timeRange;
			me.formValidatorWidget = new FormValidator();
			return this;
		},

		render:function(){
			var me=this,
				html = TemplateRenderer(CustomTimeTemplate, {
					"title":me.options.context.getMessage("app_secure_custom_time_title"),
					"error_msg":me.options.context.getMessage("app_secure_time_error_msg")
				});
			me.$el.append(html);
			if(!me.$el.hasClass("appvisibility")){
            me.$el.addClass("appvisibility");
            };
			me.containers = {
				"mainContainer": me.$el,
				"dateWidgetContainer": me.$el.find("app-secure-custom-time-container")
			};

			var fromDateElement = me.containers.mainContainer.find(".app-secure-custom-from-date");
			var toDateElement = me.containers.mainContainer.find(".app-secure-custom-to-date");

			me.fromDateWidget = new DatepickerWidget({
				container: fromDateElement
			}).build();
			me.fromDateWidget.maxDate(new Date());
			me.fromDateWidget.setDate(new Date(me.timeRange.startTime));
			me.toDateWidget = new DatepickerWidget({
				container: toDateElement
			}).build();
			me.toDateWidget.maxDate(new Date());
			me.toDateWidget.setDate(new Date(me.timeRange.endTime));
			//
            me.formValidatorWidget.validateForm(me.containers.mainContainer);
			return me;
		},
		getTime: function(){
			var me=this,
				endTime = new Date(me.toDateWidget.getDate());
			//
			endTime.setHours(23);
			endTime.setMinutes(59);
			endTime.setSeconds(00);
			//
			return{
				"startTime": me.fromDateWidget.getDate(),
				"endTime": endTime
			}
		}
	});
	//
	return CustomTimeView;
});