/**
 *  A view implementing data criteria form workflow for Create Report Wizard
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
	'./wizardStepView.js',
	'../../../../sd-common/js/common/widgets/timePicker/timePickerWidget.js'
	], function(
		Backbone,
	    Syphon,
		ReportConfigs,
		FormWidget,
		WizardStepView,
		TimePickerWidget
	){

	var DataCriteriaReportView = WizardStepView.extend({

		initialize:function(options){
		    WizardStepView.prototype.initialize.call(this);
			console.log(options);
			var me = this;
			me.options = options;
			me.context = options.context;
			me.model = options.model;
			me.filterObj = options.filterObj;
		},

		render: function(){
			console.log('Data Criteria report view rendered');
			var me = this, 
				formConfig = new ReportConfigs(me.context),
	            formElements = formConfig.filterConfig(),
	            sectionTitle = "", sectionDescription = "";

	            if (this.model.get(['name'])) {
                    sectionTitle = this.model.get(['name']);
                } if(this.model.get(['description'])) {
                    sectionDescription = this.model.get(['description']);
                }

            this.model.set({
                "section": {
                    "section-title": sectionTitle,
                    "section-description": sectionDescription,
                    "section-id": 1,
                    "chart-type": "BAR",
                    "time-period" : me.filterObj.timePeriod,
                    "time-duration" : me.filterObj.duration,
                    "time-unit": me.filterObj.durationUnit,
                    "aggregation": me.filterObj.aggregation,
                    "filter-string" : me.filterObj.filterString,
                    "formatted-filter": me.filterObj.formattedFilter,
                    "count": 10
                }
            });

			me.formWidget = new FormWidget({
               	container: me.el,
                elements: formElements,
                values: this.model.attributes
            });
			me.formWidget.build();

            timePickerContainer = this.$el.find('#add_timepicker_widget').addClass("elementinput-long");
            unit = me.model.get("section")["time-unit"];
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
                    TimePickerWidget.repeatUnits.HOURS,
                    TimePickerWidget.repeatUnits.DAYS,
                    TimePickerWidget.repeatUnits.WEEKS,
                    TimePickerWidget.repeatUnits.MONTHS
                ]
            }).build();

            var conf = {
                    "duration": me.model.get("section")["time-duration"],
                    "duration-unit": me.model.get("section")["time-unit"]
                };
            timePickerWidget.setValues(conf);

			return this;
		},
		//
		getTitle: function () {
	        return this.context.getMessage('ev_create_report_datacriteria_page_summary');
	    },
        //
        getSummary: function() {
            return this.generateSummary('ev_create_report_datacriteria_page_summary');
        },
        //
        beforePageChange: function() {
            if (! this.formWidget.isValidInput()) {
                console.log('form is invalid');
                return false;
            }
            var timeSpan = timePickerWidget.getValues(),
                duration = timeSpan["duration"],
                durationUnit = timeSpan["duration-unit"],
                DataCriteriaInfo = this.setDataCriteriaInfo(duration, durationUnit);

            this.model.set(DataCriteriaInfo);
            this.filterObj.duration = duration;
            this.filterObj.durationUnit = durationUnit;
            return true;
        },
        //
        /*getDataCriteriaInfo: function() {

        },*/
        //
        setDataCriteriaInfo: function(duration, durationUnit) {
            if (this.model.get(['section'])) {
                jsonDataObj = {
                    "sections": {
                        "section":{
                             "section-title": this.model.get(['section'])["section-title"],
                             "section-description": this.model.get(['section'])["section-description"],
                             "section-id": this.model.get(['section'])["section-id"],
                             "chart-type": this.model.get(['section'])["chart-type"],
                             "time-duration" : duration,
                             "time-unit": durationUnit,
                             "aggregation": this.model.get(['section'])["aggregation"],
                             "filter-string" : this.model.get(['section'])["filter-string"],
                             "formatted-filter": this.model.get(['section'])["formatted-filter"],
                             "count": 10
                        }
                    }
                };
            }
            this.model.unset("section", { silent: true });
            return jsonDataObj;
        }
        //
	});

	return DataCriteriaReportView;
});