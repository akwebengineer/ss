/**
 *  A view implementing filter form workflow for Create Alert Wizard
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
	'widgets/grid/gridWidget',
	'./wizardStepView.js',
    '../../../../sd-common/js/common/widgets/timePicker/timePickerWidget.js'
	], function(
		Backbone,
		Syphon,
		AlertConfigs,
		FormWidget,
		GridWidget,
		WizardStepView,
		TimePickerWidget
	){

	var FilterAlertView = WizardStepView.extend({

		initialize:function(options){
		    WizardStepView.prototype.initialize.call(this);
			console.log(options);
			var me=this;
			me.options = options;
			me.context = options.context;
			me.model = options.model;
			me.filterModel = options.filterModel;
			me.filterObj = options.filterObj;
		},
		//
		render: function(){
			console.log('data criteria alert view rendered');
			var me=this, 
				formConfig = new AlertConfigs(me.context),
	            formElements = formConfig.filterConfig(),
	            threshHold = "";
	            if (this.model.get(['alertcriteria'])) {
	                threshHold = this.model.get(['alertcriteria']).threshhold;
	            }
	            if(me.filterObj.durationUnit > 1) {
                    me.filterObj.duration = 86400000;
                    me.filterObj.durationUnit = 1;
                }

                me.model.set({
                    "alertcriteria": {
                        "aggregation" : me.filterObj.aggregation,
                        "filter-string" : me.filterObj.filterString,
                        "formatted-filter": me.filterObj.formattedFilter,
                        "time-period" : me.filterObj.timePeriod,
                        "duration" : me.filterObj.duration,
                        "durationUnit": me.filterObj.durationUnit,
                        "threshhold": threshHold
                    }
                });


			me.formWidget = new FormWidget({
			    container: me.el,
                elements: formElements,
                values: this.model.attributes
            });
			me.formWidget.build();

            timePickerContainer = this.$el.find('#add_timepicker_widget').addClass("elementinput-long");
            unit = me.model.get("alertcriteria")["durationUnit"];
            timePickerWidget = new TimePickerWidget({
                "container": timePickerContainer,
                "values": {
                    "duration_unit": {
                        "id": TimePickerWidget.unitMapping[unit],
                        "text": TimePickerWidget.unitMapping[unit]
                    }
                },
                "units": [
                    TimePickerWidget.repeatUnits.MINUTES,
                    TimePickerWidget.repeatUnits.HOURS
                ]
            }).build();

            var conf = {
                    "duration": me.model.get("alertcriteria")["duration"],
                    "duration-unit": me.model.get("alertcriteria")["durationUnit"]
                };
            timePickerWidget.setValues(conf);
			// get values from model for form elements
            this.getFilterInfo();
			return this;
		},
		//
		getTitle: function () {
	        return this.context.getMessage('ev_create_alert_filter_page_summary');
	    },
	    //
	    getSummary: function() {
            return this.generateSummary('ev_create_alert_filter_page_summary');
        },
        //
        beforePageChange: function() {

            if (! this.formWidget.isValidInput()) {
                console.log('form is invalid');
                return false;
            }
            var properties = Syphon.serialize(this),
                timeSpan = timePickerWidget.getValues(),
                duration = timeSpan["duration"],
                durationUnit = timeSpan["duration-unit"]

            if(duration > 86400000) {
                this.formWidget.showFormError(this.context.getMessage('alert_def_form_time_span_field_error_msg'));
                return false;
            }
            FilterInfo = this.setFilterInfo(properties, duration, durationUnit);

            this.model.set(FilterInfo);
            this.filterObj.duration = duration;
            this.filterObj.durationUnit = durationUnit;

            return true;
        },
        //
        getFilterInfo: function() {

        },
        //
        setFilterInfo: function(properties, duration, durationUnit) {
             var filterStr, filters;

             filterStr = properties['filter-string'];
             filters = this.model.get(['alertcriteria'])["formatted-filter"];
             
             var jsonDataObj = {};
             jsonDataObj = {
                "alertcriteria":{
                    "aggregation" : properties['aggregation'],
                    "duration" : duration,
                    "duration-unit" : durationUnit,
                    "filter-string" : properties['filter-string'],
                    "threshhold":  properties['threshhold'],
                    "formatted-filter":filters
                }
            };
            return jsonDataObj;
        }
        //
	});

	return FilterAlertView;
});