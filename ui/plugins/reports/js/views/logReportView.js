/**
 * A superclass for Report Definition
 *
 * @module ReportsDefinition
 * @author Aslam a <aslama@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget',
    '../models/reportsModel.js',
    './filtersGridView.js',
    '../conf/logDynamicFiltersConfig.js',
    './baseReportDefCreateView.js',
    '../conf/logReportCreateFormConfig.js',
    '../service/reportsService.js',
    '../../../ui-common/js/common/utils/filterUtil.js',
    'lib/template_renderer/template_renderer',
    'text!../../../alerts/js/templates/dataCriteriaTemplate.html',
    'text!../../../alerts/js/templates/timeSpanTemplate.html',
    '../../../sd-common/js/common/widgets/filterWidget/filterWidget.js',
    '../../../ui-common/js/common/utils/filterManager.js',
    '../../../sd-common/js/common/widgets/filterWidget/conf/filterConfig.js',
    '../../../sd-common/js/common/widgets/timePicker/timePickerWidget.js'
], function (FormWidget, 
             OverlayWidget, 
             ReportsModel,
             FiltersGridView, 
             DynamicFiltersConfig, 
             BaseReportDefCreateView, 
             LogReportCreateFormConfig, 
             ReportService,
             FilterUtil,
             render_template,
             DataCriteria,
             TimeSpan,
             FilterWidget,
             FilterManager,
             FilterConfigs,
             TimePickerWidget
             ) {

      var  LogReportView = BaseReportDefCreateView.extend({

        events: function(){
            return _.extend({},BaseReportDefCreateView.prototype.events,{
               'click #choose-filter' : 'showFiltersOverlay',
               'click #show-filters-cancel' : "cancelFilters"
            });
        },

        initialize:function(options){
            var me=this;
            me.context = me.options.activity.context;
            BaseReportDefCreateView.prototype.initialize.call(me,options);
            me.util = new FilterUtil();
            me.service = new ReportService();
            me.filterManager = new FilterManager();
            me.configs = new FilterConfigs(me.context);
        },


        render: function(){
            var me=this;
            BaseReportDefCreateView.prototype.render.call(me);
            me.buildSections();
            return me;
        },
        //
        buildSections: function(){

            var self=this, duration,
                formConfig = new LogReportCreateFormConfig(self.context),
                sectionConfig = new DynamicFiltersConfig(self.context),
                dynamicSection = formConfig.getValues();

            self.filterWidget = [];
            self.timePickerWidget = [];

            //
            self.form.addSection(dynamicSection, "#report-create-content-section", true);
            //
            if(self.model.get("sections")){
                this.sections = self.model.get("sections").section.length;
                for(j = 0; j< self.model.get("sections").section.length; j++){
                    sectionElements = sectionConfig.getValues(self.model.get("sections").section[j] , j+1);
                    sectionElements1 = sectionConfig.getValues1(self.model.get("sections").section[j] , j+1);
                    self.form.addSection(sectionElements1, '#schedule-info', true);
                    self.form.addSection(sectionElements, '#schedule-info', true);
                    var ID = {  "id" : (j+1)  },
                        aggregationArr = self.getAggregation();

                    aggregationObj = {'groupby-dropdown': aggregationArr ,  "id" : (j+1) };
                    var dataCriteria = render_template(DataCriteria, aggregationObj),
                        timeSpan = render_template(TimeSpan, ID),
                        timePickerContainer = self.$el.find('#add_timepicker_widget'+(j+1)).addClass("elementinput-long"),
                        group_by = self.model.get("sections").section[j]['aggregation'],
                        time_unit = self.model.get("sections").section[j]["time-unit"],
                        duration = self.model.get("sections").section[j]["time-duration"],
                        conf = {
                            "duration":duration,
                            "duration-unit": time_unit
                        };

                    self.timePickerWidget[j+1] = new TimePickerWidget({
                        "container": timePickerContainer,
                        "values": {
                            "duration_unit": {
                                "id": TimePickerWidget.unitMapping[time_unit],
                                "text": TimePickerWidget.unitMapping[time_unit]
                            }
                        },
                        "units": [
                            TimePickerWidget.repeatUnits.MINUTES,
                            TimePickerWidget.repeatUnits.HOURS,
                            TimePickerWidget.repeatUnits.DAYS,
                            TimePickerWidget.repeatUnits.WEEKS,
                            TimePickerWidget.repeatUnits.MONTHS
                        ],
                        "id" : j+1
                    }).build();

                    self.$el.find("#report_data_criteria_"+(j+1)).append(dataCriteria);
                    self.$el.find("#report_time_span_"+(j+1)).append(timeSpan);
                    self.$el.find("#report_section_title_"+(j+1)).attr("value" , self.model.get("sections").section[j]["section-title"]);
                    self.$el.find("#report_description_"+(j+1)).attr("value" , self.model.get("sections").section[j]["section-description"]);
                    self.$el.find("#bandwidth_count_"+(j+1)).attr("value" , self.model.get("sections").section[j]["count"]);
                    self.$el.find("#report_chart_"+(j+1)).val(self.model.get("sections").section[j]["chart-type"]);
                    if(conf) {
                        self.timePickerWidget[j+1].setValues(conf);
                    }
                    var filterString = self.model.get("sections").section[j]["filter-string"],
                        filterContainer = self.$el.find("#filter_bar_container"+(j+1)).addClass("elementinput-long");

                    self.filterWidget[j+1] = new FilterWidget({
                        "el":  filterContainer,
                        "activity": this.activity ,
                        "context": this.context
                    });
                    self.filterWidget[j+1].render();

                    if(filterString) {
                        self.filterWidget[j+1].addFilterTokens(filterString);
                    }
                    self.$el.find("#aggregation"+(j+1)).val(group_by);
                }
                self.$el.find("[id^=report_section_filter_id]").hide();
                self.buildSectionCount(this.sections , "edit");
            }
            //            
        },
        //
        /**
        override the base isValid
        */
        isValid: function(){
            var me=this, filterLen = me.filterWidget.length,
                isValid = BaseReportDefCreateView.prototype.isValid.call(me);
            if(isValid){
                if(me.$el.find("#report_data_criteria_1").length === 0) {
                    me.form.showFormError(me.context.getMessage("report_def_field_log_report_filter_empty_error"));
                    isValid = false;
                }
                for( i = 1; i <= filterLen; i++ ){
                   if(me.filterWidget[i] &&  typeof me.filterWidget[i].getFilters() === "undefined"){
                        me.form.showFormError(me.context.getMessage('report_def_log_report_filter_data_empty_error'));
                        isValid = false;
                    }
                }
            }
            return isValid;
        },
        //        
        getJsonReportObj : function(successCallBack){ 
            var self = this, 
                section = [], 
                requestCount = 0, 
                //def = BaseReportDefCreateView.prototype.getJsonReportObj.call(this, [false])
                increment = 0;
            //
            this.increment = "";
        
            var onFilterSuccess,
                onFilterError;
            //
            var success = function(jsonDataObj){
                onFilterSuccess = function(response){
                    ++requestCount;

                    if(self.formMode !== self.MODE_CREATE  && increment == 0 && 
                        self.model.get("sections")["section"] != undefined){
                        if(section != undefined || section != ""){
                            increment   = self.model.get("sections")["section"].length;
                        }
                    };
                    var jsonFormattedFilter = self.filterWidget[requestCount+increment].getFilters(),
                        filterString = self.filterWidget[requestCount+increment].getFilterString(),
                        timeSpan    = self.timePickerWidget[requestCount+increment].getValues(),
                        timeDuration = timeSpan["duration"],
                        timeUnit    = timeSpan["unit"];

                    var section_data = {
                        "section-title": self.$el.find("#report_section_title_"+(requestCount+increment)).val(),
                        "filter-string": filterString,
                        "formatted-filter": jsonFormattedFilter,
                        "section-description": self.$el.find("#report_description_"+(requestCount+increment)).val(),
                        "aggregation": self.$el.find("#aggregation"+(requestCount+increment)).val(),
                        "time-unit": timeUnit,
                        "time-duration": timeDuration,
                        "section-id": self.$el.find("#report_section_count_"+(requestCount+increment)).val(),
                        "chart-type": self.$el.find("#report_chart_"+(requestCount+increment)).val(),                   
                        "count": self.$el.find("#bandwidth_count_"+(requestCount+increment)).val()
                    };
                    section.push(section_data);
                    if(requestCount == self.filters_id.length){
                        jsonDataObj.sections = {};
                        jsonDataObj.sections["section"] = section ;
                        successCallBack(jsonDataObj);
                    }
                    if(requestCount <= (self.filters_id.length-1)){
                        self.service.getFormatedFilter(self.filters_id[requestCount], onFilterSuccess, onFilterError);
                    }
                } 

                if(self.filters_id !== undefined && self.filters_id != ""){
                    if(self.formMode !== self.MODE_CREATE){
                        section = self.buildSectionData(section);
                    };
                    self.service.getFormatedFilter(self.filters_id[0], onFilterSuccess, onFilterError);
                }else {

                    if(self.formMode !== self.MODE_CREATE){
                         section = self.buildSectionData(section);
                         jsonDataObj.sections = {};
                         jsonDataObj.sections["section"] = section;
                    };  
                    successCallBack(jsonDataObj);
                }
            }
            BaseReportDefCreateView.prototype.getJsonReportObj.call(this, success)
        },

        buildSectionData : function(section){

           var self = this;
           for(i=0 ; i<(self.model.get("sections")["section"].length); i++){
            var timeSpan = self.timePickerWidget[i+1].getValues(),
                timeDuration = timeSpan["duration"],
                timeUnit = timeSpan["duration-unit"],
                jsonFormattedFilter = self.filterWidget[i+1].getFilters(),
                filterString = self.filterWidget[i+1].getFilterString();

            var section_data = {
                "section-title": self.$el.find("#report_section_title_"+(i+1)).val(),
                "filter-string": filterString,
                "formatted-filter": jsonFormattedFilter,
                "section-description": self.$el.find("#report_description_"+(i+1)).val(),
                "aggregation": self.$el.find("#aggregation"+(i+1)).val(),
                "time-unit": timeUnit,
                "time-duration": timeDuration,
                "section-id": self.$el.find("#report_section_count_"+(i+1)).val(),
                "chart-type": self.$el.find("#report_chart_"+(i+1)).val(),
                "count": self.$el.find("#bandwidth_count_"+(i+1)).val()
            };
             section.push(section_data);
           }
           return section;
        },
        showFiltersOverlay: function () {

            var self = this,
            filtersView = new FiltersGridView({activity: self, context:self.context}),
            conf = {
                view: filtersView,
                showScrollbar: true,
                type: 'large'
            };
            if(self.filters_id == undefined){
            self.filters_id = [];
            }
            self.overlayWidgetObj = new OverlayWidget(conf);
            self.overlayWidgetObj.build();

            self.overlayWidgetObj.getOverlay().$el.find('#show-filters-save').on('click', function(event){
                var selectedFilter = filtersView.getSelectedFilters();

                if(selectedFilter.length < 1) {
                    filtersView.formWidget.showFormError("Please select at least one filter");
                    event.preventDefault();
                    return false;
                } else {
                    self.overlayWidgetObj.destroy();
                    for (var i = 0; i < selectedFilter.length; i++) {
                        var filter_name = selectedFilter[i]['filter-name'],
                            filter_description  = selectedFilter[i]['filter-description'],
                            aggregation  = selectedFilter[i]['aggregation'],
                            id           = selectedFilter[i]['id'],
                            group_by     = "Group By:" + selectedFilter[i]['aggregation'],
                            time_unit    = selectedFilter[i]['time-unit'],
                            duration     = selectedFilter[i]['duration'],
                            filter_string = selectedFilter[i]['filter-string'],
                            secId = i+1,

                            filters = {
                                "filter_name" : filter_name,
                                "filter_description" : filter_description,
                                "aggregation"   : aggregation,
                                "time_unit"     : time_unit,
                                "duration"      : duration,
                                "filter_string" : filter_string,
                                "id"            : id,
                                "sec_id"        : i+1
                            };
                            self.filters_id.push(id);

                        self.loadDynamicFiltersSection(filters , i+1);
                    };
                        self.buildSectionCount(selectedFilter.length , "add")
                }
            });

            self.overlayWidgetObj.getOverlay().$el.find('#show-filters-cancel').on('click', function(event){
                self.overlayWidgetObj.destroy();

            });            
        },


        buildSectionCount : function(totalSections , addDelete){
            var self = this;
            if(this.sections == undefined || this.sections == ""){
                this.sections = totalSections;
            }
            else if(addDelete == "add") {
                this.sections = this.sections + totalSections;
            }
            self.$el.find("[id^=report_section_count]").empty(); 
            for(i =1; i <= (this.sections); i++  ){
                self.$el.find("[id^=report_section_count]").append( "<option value="+i+">"+i+"</option>");            
            }
            //
            for(i =1; i <= (this.sections); i++  ){
                if(self.$el.find("#report_section_count_"+i).attr("id") === undefined){
                    self.swapIDS((i+1), i);
                    self.$el.find("#report_section_count_"+(i)).val(i);
                }
                self.$el.find("#report_section_count_"+i).val(i);            
            }  
        },

        swapSections : function(event){
    
            var sectionId = $(event.target).closest(".form_section").prop("id"),
            sectionChosen = sectionId[sectionId.length -1],
            sectionToSwap = event.target.value;
            this.swapValues(sectionChosen, sectionToSwap);
            this.$el.find("#report_section_count_"+sectionChosen).val(sectionChosen);

            if(sectionToSwap > sectionChosen){
                this.swapIDS(sectionChosen, sectionToSwap);
                this.swapIDS(sectionToSwap, sectionChosen);}
            else{
                this.swapIDS(sectionToSwap, sectionChosen);
                this.swapIDS(sectionChosen, sectionToSwap);
            }

        },

        swapIDS : function(sectionChosen, sectionToSwap){
            var self = this;
            self.$el.find("#report_section_count_"+sectionChosen).attr("id", ("report_section_count_"+sectionToSwap));
            self.$el.find("#appended_section_count_id_"+sectionChosen).attr("id", ("appended_section_count_id_"+sectionToSwap));  
            self.$el.find("#appended_section_id_"+sectionChosen).attr("id" ,("appended_section_id_"+sectionToSwap));
            self.$el.find("#report_section_filter_id_"+sectionChosen).attr("id" ,("report_section_filter_id_"+sectionToSwap));
            self.$el.find("#report_section_title_"+sectionChosen).attr("id",("report_section_title_"+sectionToSwap));
            self.$el.find("#report_description_"+sectionChosen).attr("id",("report_description_"+sectionToSwap));
            self.$el.find("#report_data_criteria_"+sectionChosen).attr("id",("report_data_criteria_"+sectionToSwap));
            self.$el.find("#report_chart_"+sectionChosen).attr("id",("report_chart_"+sectionToSwap));
            self.$el.find("#bandwidth_count_"+sectionChosen).attr("id",("bandwidth_count_"+sectionToSwap));
            self.$el.find("#aggregation"+sectionChosen).attr("id",("aggregation"+sectionToSwap));
            self.$el.find("#add_timepicker_widget"+sectionChosen).attr("id",("add_timepicker_widget"+sectionToSwap));
            self.$el.find("#filter_bar_container"+sectionChosen).attr("id",("filter_bar_container"+sectionToSwap));
        },

        swapValues : function(sectionChosen, sectionToSwap){
            var self = this;
            var sectionTitle = self.$el.find("#report_section_title_"+sectionChosen).val(),
                description = self.$el.find("#report_description_"+sectionChosen).val(),
                chart = self.$el.find("#report_chart_"+sectionChosen).val(),
                bandwidthCount = self.$el.find("#bandwidth_count_"+sectionChosen).val();
                aggregation = self.$el.find("#aggregation"+sectionChosen).val(),
                timeSpan = self.timePickerWidget[sectionChosen].getValues(),
                durationConf = {
                    "duration" : timeSpan["duration"],
                    "duration-unit" : timeSpan["duration-unit"]
                },
                filterString = self.filterWidget[sectionChosen].getFilterString();
                self.timePickerWidget[sectionToSwap].widgetConf.values = {
                    "duration_unit": {
                        "id": TimePickerWidget.unitMapping[timeSpan["duration-unit"]],
                        "text": TimePickerWidget.unitMapping[timeSpan["duration-unit"]]
                    }
                };

            var sectionTitleSwap = self.$el.find("#report_section_title_"+sectionToSwap).val(),
                descriptionSwap = self.$el.find("#report_description_"+sectionToSwap).val(),
                chartSwap = self.$el.find("#report_chart_"+sectionToSwap).val(),
                bandwidthCountSwap = self.$el.find("#bandwidth_count_"+sectionToSwap).val(),
                aggregationSwap = self.$el.find("#aggregation"+sectionToSwap).val(),
                timeSpan = self.timePickerWidget[sectionToSwap].getValues(),
                durationSwap = {
                    "duration" : timeSpan["duration"],
                    "duration-unit" : timeSpan["duration-unit"]
                },
                filterStringSwap = self.filterWidget[sectionToSwap].getFilterString();
                self.timePickerWidget[sectionChosen].widgetConf.values = {
                    "duration_unit": {
                        "id": TimePickerWidget.unitMapping[timeSpan["duration-unit"]],
                        "text": TimePickerWidget.unitMapping[timeSpan["duration-unit"]]
                    }
                };

            self.$el.find("#report_section_title_"+sectionToSwap).val(sectionTitle);
            self.$el.find("#report_description_"+sectionToSwap).val(description);
            self.$el.find("#report_chart_"+sectionToSwap).val(chart);
            self.$el.find("#bandwidth_count_"+sectionToSwap).val(bandwidthCount);
            self.$el.find("#aggregation"+sectionToSwap).val(aggregation);
            self.timePickerWidget[sectionToSwap].destroyForm();
            self.timePickerWidget[sectionToSwap].build();
            self.timePickerWidget[sectionToSwap].setValues(durationConf);
            self.filterWidget[sectionToSwap].removeFilters();
            self.filterWidget[sectionToSwap].addFilterTokens(filterString);

            self.$el.find("#report_section_title_"+sectionChosen).val(sectionTitleSwap);
            self.$el.find("#report_description_"+sectionChosen).val(descriptionSwap);
            self.$el.find("#report_chart_"+sectionChosen).val(chartSwap);
            self.$el.find("#bandwidth_count_"+sectionChosen).val(bandwidthCountSwap);
            self.$el.find("#aggregation"+sectionChosen).val(aggregationSwap);
            self.timePickerWidget[sectionChosen].destroyForm();
            self.timePickerWidget[sectionChosen].build();
            self.timePickerWidget[sectionChosen].setValues(durationSwap);
            self.filterWidget[sectionChosen].removeFilters();
            self.filterWidget[sectionChosen].addFilterTokens(filterStringSwap);
        },
        // Load Dynamic Filters Section based on Filter selection
        loadDynamicFiltersSection: function(filters, i){

            if(this.sections != undefined){
               i = this.sections+i;
            }
            var self = this,
                sectionConfig = new DynamicFiltersConfig(self.context),
                sectionElements = sectionConfig.getValues(filters , i),
                sectionElements1 = sectionConfig.getValues1(filters , i),
                onFilterError;
           
            self.form.addSection(sectionElements1, '#schedule-info', true);
            self.form.addSection(sectionElements, '#schedule-info', true);
            var ID = {  "id" : i  },
                aggregationArr = self.getAggregation();

            aggregationObj = {'groupby-dropdown': aggregationArr ,  "id" : i };
            var dataCriteria = render_template(DataCriteria, aggregationObj),
                timeSpan = render_template(TimeSpan, ID),
                timeSpanDet = self.util.getTimeSpanFromMS(filters.duration),
                filterString = filters.filter_string,
                duration    = filters.duration,
                unit        = timeSpanDet["unit"],
                conf = {
                    "duration":duration,
                    "duration-unit": unit
                },
                timePickerContainer = self.$el.find('#add_timepicker_widget'+i).addClass("elementinput-long");

            self.timePickerWidget[i] = new TimePickerWidget({
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
                ],
                "id" : i
            }).build();

            self.$el.find("#report_data_criteria_"+i).append(dataCriteria);
            self.$el.find("#report_time_span_"+i).append(timeSpan);
            self.$el.find("#aggregation"+i).val(filters.aggregation);
            self.timePickerWidget[i].setValues(conf);
            self.$el.find("[id^=report_section_filter_id]").hide();

            var filterContainer = self.$el.find("#filter_bar_container"+i).addClass("elementinput-long");

            self.filterWidget[i] = new FilterWidget({
                "el":  filterContainer,
                "activity": this.activity ,
                "context": this.context
            });

            self.filterWidget[i].render();
            self.filterWidget[i].addFilterTokens(filterString);
        },

        deleteSection : function(event){
            
            var self = this,
            sectionId = $(event.target).closest(".form_section").prop("id");
            sectionChosen = sectionId[sectionId.length -1];
            filterid = self.$el.find("#report_section_filter_id_"+sectionChosen).val();
            if(this.filters_id != undefined && this.filters_id != ""){
            this.filters_id =$.grep(this.filters_id, function(e,index){
            if(self.formMode === self.MODE_EDIT){
                index = index + (self.model.get("sections")["section"].length);
            } 
            if(sectionChosen == (index+1)){
                        return false;
            };
                        return true;
            });}
            this.filterWidget =$.grep(this.filterWidget, function(e,index){
            
            if(sectionChosen == (index)){
                        return false;
            };
                        return true;
            });
            this.$el.find("#appended_section_id_"+sectionChosen).remove();
            this.$el.find("#appended_section_count_id_"+sectionChosen).remove();
            self.buildSectionCount(--this.sections, "delete");
            if(self.formMode === self.MODE_EDIT){
            self.deleteModelSection(sectionChosen);   

            }
        },

        deleteModelSection : function(sectionChosen){
            var self = this;
            var length = self.model.get("sections")["section"].length;
            self.model.get("sections")["section"] = $.grep(self.model.get("sections")["section"], function(e , index){
                if((sectionChosen - 1) == index ){
                    return false ;
                }
                return true;
            });

            console.log(sectionChosen);

        },

        cancelFilters: function(event) {
            event.preventDefault();
            this.options.activity.overlayWidgetObj.destroy();
        },

        getAggregation: function() {
            var aggregationArr = [],
                aggregation = this.configs.getGroupByDropDown(true);

            if(aggregation) {
                for (var i = 0; i < aggregation.length; i++) {
                    aggregationArr.push({
                        'id': aggregation[i].id,
                        'text': aggregation[i].text
                    });
                }
            }
            return aggregationArr;
        }

    });


    return LogReportView;
});

