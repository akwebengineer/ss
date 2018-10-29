/**
 *  A View file required to build
 *  the Create/Edit Alert Definition
 *
 *  @module alertDefinitions
 *  @author Shini <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */

define([
    'backbone', 'backbone.syphon', 'jquery', 'widgets/form/formWidget', 'widgets/form/formValidator',
    'widgets/overlay/overlayWidget', 'widgets/dropDown/dropDownWidget',
    '../conf/alertDefinitionFormConfiguration.js',
    '../widgets/filterpicker/filterPickerWidget.js',
    'lib/template_renderer/template_renderer',
    'text!../templates/timeSpanTemplate.html',
    '../../../ui-common/js/views/apiResourceView.js',
    '../service/alertDefinitionService.js',
    '../../../ui-common/js/common/utils/filterUtil.js',
    '../../../ui-common/js/common/utils/SmProgressBar.js',
    '../../../sd-common/js/common/widgets/filterWidget/conf/filterConfig.js',
    '../../../ui-common/js/common/utils/validationUtility.js',
    '../../../sd-common/js/common/widgets/filterWidget/filterWidget.js',
    '../../../sd-common/js/common/widgets/timePicker/timePickerWidget.js'
], function (Backbone, Syphon, $, FormWidget, FormValidator, OverlayWidget, DropDownWidget, DefinitionForm, FilterPickerWidget,
             render_template, TimeSpanTemplate, ResourceView, AlertService, FilterUtil, SmProgressBar,
             FilterConfigs, ValidationUtility, FilterWidget, TimePickerWidget) {

    var AlertDefinitionView = ResourceView.extend({
        events: {
            'click #filters': "showFilter",
            'click #definition-save': "submit",
            'click #definition-cancel': "cancel"
        },

        submit: function(event) {
            event.preventDefault();
            var  me = this, status = false,
                 emailsArray = [], jsonDataObj = {},
                 properties  = {}, filterStr, filterId, duration, jsonFilter = {}, aggregation, duration_unit, filterStr, timeSpan
                 spinner = new SmProgressBar({
                     "container": $('.overlay-wrapper'),
                     "hasPercentRate": false,
                     "isSpinner" : true,
                     "statusText": me.context.getMessage("save_conf")
                 });

            // Check is form valid
            if (! this.form.isValidInput()) {
                console.log('form is invalid');
                return;
            }

            // set the form values
            aggregation = me.groupByDropDown.getValue();
            properties  = Syphon.serialize(this);
            timeSpan    = timePickerWidget.getValues();
            duration    = timeSpan["duration"];
            duration_unit = timeSpan["duration-unit"];
            filterStr   = me.filterWidget.getFilterString();

            if(aggregation == "none") {
                me.form.showFormError(me.context.getMessage('alert_def_form_aggregation_field_error_msg'));
                return false;
            }
            if(duration > 86400000) {
                me.form.showFormError(me.context.getMessage('alert_def_form_time_span_field_error_msg'));
                return false;
            }
            if(typeof me.filterWidget.getFilters() === "undefined") {
                me.form.showFormError(me.context.getMessage('alert_def_form_filter_data_empty_error'));
                return false;
            }
            spinner.showLoadingMask();

            emailsArray = me.dropDown.getValue() || "";
            filterId    =  me.$el.find('#filter-id').val();

            jsonDataObj = {
                "name"  : properties['name'],
                "description"   : properties['description'],
                "status"    : properties['status'],
                "severity"  : properties['severity'],
                "additional-emails" : emailsArray.toString(),
                "custom-message"    : properties['custom-message'],

                "alertcriteria" : {
                    "aggregation"   : aggregation,
                    "duration"      : duration,
                    "duration-unit" : duration_unit,
                    "filter-string" : filterStr,
                    "threshhold"    : properties['threshhold'],
                    "formatted-filter": me.filterWidget.getFilters()
                }
            };

            this.bindModelEvents();
            this.model.set(jsonDataObj);
            this.model.save(null, {
                success:function(){
                    if(this.formMode !== this.MODE_EDIT){
                        $.ajax({
                            url: '/api/juniper/seci/filter-management/filter-usage-by-user?event-filter-id='+filterId,
                            method: "PUT"
                        });
                    }
                },
                error:function(){
                    spinner.hideLoadingMask();
                }
            });
        },
        //
        cancel: function(event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        },

        initialize: function(options){
            _.extend(this, ValidationUtility);
            ResourceView.prototype.initialize.call(this, options);
            var me = this;
            me.activity = options.activity;
            me.context = options.activity.getContext();
            me.successMessageKey = 'alert_def_create_success';
            me.editMessageKey = 'alert_def_edit_success';
            me.service = new AlertService();
            me.util = new FilterUtil();
            me.configs = new FilterConfigs(this.context);
        },

        render: function(){
            var me = this,
                formConfiguration   = new DefinitionForm(this.context),
                formElements        = formConfiguration.getValues(),
                groupByList = me.configs.getGroupByDropDown(true), conf;

            me.addDynamicFormConfig(formElements);
            me.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.attributes
            });
            me.form.build();
            me.$el.find("#add_data_criteria_template").removeClass();
            me.$el.find("#add_data_criteria_template").append('<select class="add_aggregation" style="width: 100%"></select>');
            me.groupByDropDown = new DropDownWidget({
              "container": this.$el.find(".add_aggregation"),
              "data": groupByList
            }).build();

            if(me.model.get("alertcriteria")) {
                var durationDet = me.util.preciseTimeSpan(me.model.get("alertcriteria")["duration-unit"], me.model.get("alertcriteria")["duration"]),
                duration    = me.model.get("alertcriteria")["duration"],
                unit        = durationDet["unit"];
                if(unit > 1) {
                    duration = 86400000;
                    unit = 1;
                }
                conf = {
                    "duration":duration,
                    "duration-unit": unit
                };
            }

            timePickerContainer = this.$el.find('#add_timepicker_widget').addClass("elementinput-long");
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

            if(conf) {
                 timePickerWidget.setValues(conf);
            }

            timeSpan = render_template(TimeSpanTemplate);
            me.$el.find("#add_filter_bar_template").append(timeSpan);
            filterContainer = me.$el.find("#filter_bar_container").addClass("elementinput-long");

            me.filterWidget = new FilterWidget({
                "el":  filterContainer,
                "activity": me.activity ,
                "context": me.context
            }).render();

            me.showOrHideSections();      // Show or Hide sections
            me.$el.find('#threshhold').bind('isThreshholdEmpty', function(e, isValid) {
                me.checkThreshholdEmpty(isValid, me);
            });
            me.createEmailDropDownWidget();
            if(me.formMode === me.MODE_EDIT || me.formMode === me.MODE_CLONE) {
                me.modifyForm();
            }

            return this;
        },

        /**
         * This populates users in drop down by fetching the values from the server.
         * URL: /api/space/user-management/users
         * */
        createEmailDropDownWidget: function() {
            var me = this,
                comp = me.$el.find('#additional-emails').append('<select class="alert-def-email-field" style="width: 100%"></select>'),
                additionalEmails  = me.model.get('additional-emails') || "",
                emailsDataNotSpaceUsers = [];

            $.when(me.service.getUsers()).done(function(collection){
                var emailsData = [],
                    emailsFromInput = additionalEmails ? additionalEmails.split(",") : ''; // Use split correctly

                collection.each(function(model, index){
                    if(model.get('primaryEmail')) {
                        emailsData.push({
                            "id": model.get('primaryEmail'),
                            "text": model.get('primaryEmail'),
                            "selected": additionalEmails.indexOf(model.get('primaryEmail')) > -1 ? true : false
                        });
                    }
                });

                for(var i = 0; i < emailsFromInput.length; i++) {
                    emailsDataNotSpaceUsers.push({
                        "id": emailsFromInput[i],
                        "text": emailsFromInput[i],
                        "selected": true
                    });
                }
                emailsData = _.uniq(emailsData.concat(emailsDataNotSpaceUsers), function(x) {
                    return x.id;
                });

                me.dropDown = new DropDownWidget({
                    "container": me.$el.find('.alert-def-email-field'),
                    "data": JSON.stringify(emailsData),
                    "placeholder": "Enter/Select valid emails",
                    "multipleSelection": {
                        maximumSelectionLength: 10,
                        createTags: true,
                        allowClearSelection: true
                    }
                }).build();

                $("#additional-emails").change(function(event){
                   event.preventDefault();
                   var arrValues = me.dropDown.getValue();

                   if(arrValues) {
                   for(var i = 0 ; i < arrValues.length; i++) {
                       var email = arrValues [i] ,
                           isValid = me.isValidEmail(email);

                       if(!isValid) {
                           comp.attr("data-invalid", "").parent().addClass('error');
                           comp.parent().prev().addClass('error');
                           comp.parent().find("small[class*='error']").html(me.context.getMessage("alert_def_form_recipients_validation_error"));
                       }
                   }
                   }
               });
            });
        },

        // Show Filter Data
        showFilter: function(e) {
            var me = this,
                filterPickerWidget = new FilterPickerWidget({context:me.context}),
                conf = {
                    view: filterPickerWidget,
                    showScrollbar: true,
                    type: 'large'
                };
            me.overlayWidgetObj = new OverlayWidget(conf);
            me.overlayWidgetObj.build();

            //listen for OK click
            me.overlayWidgetObj.getOverlay().$el.find('#save-filters').on('click', function(event){
                var selectedFilter = filterPickerWidget.getSelectedFilters();

                // Adding validation for filters
                if(selectedFilter.length < 1) {
                    filterPickerWidget.formWidget.showFormError(me.context.getMessage('filter_grid_validation_msg'));
                    event.preventDefault();
                    return false;
                } else {
                    me.overlayWidgetObj.destroy();
                }
                me.populateDataCriteria(selectedFilter);
                me.$el.find('#add_filter').hide();
                me.$el.find('#edit_filter').show();
            });

            me.overlayWidgetObj.getOverlay().$el.find('#cancel-filters').on('click', function(event){
                me.overlayWidgetObj.destroy();
            });
        },

        // Find the Time Span data from the selected Filter
        /*getFilterData: function(selectedFilter) {
            var me = this, returnVal = 'default', duration_unit, duration;
            if (selectedFilter != null) {
                if(selectedFilter.length != null) {
                    duration_unit = parseInt(selectedFilter[0]['time-unit']),
                    duration      = parseInt(selectedFilter[0]['duration']);
                } else {
                    duration_unit = parseInt(selectedFilter['duration-unit']),
                    duration = parseInt(selectedFilter['duration']);
                }
                returnVal = me.util.getDurationBasedOnUnit(duration_unit, duration);
            }
            return returnVal;
        },*/

        // Set form title dynamically
        addDynamicFormConfig: function(formConfiguration) {
            var me = this, dynamicProperties = {};
            ResourceView.prototype.addDynamicFormConfig.call(me, formConfiguration);

            switch (me.formMode) {
                case me.MODE_EDIT:
                    dynamicProperties.title = me.context.getMessage('alert_def_form_edit');
                    dynamicProperties['title-help'] = {
                        "content": me.context.getMessage("alert_def_form_edit_title_help"),
                        "ua-help-text":me.context.getMessage("more_link"),
                        "ua-help-identifier": me.context.getHelpKey("ALERT_ALARM_DEFINITION_EDITING")
                    };
                    break;
                case me.MODE_CLONE:
                    dynamicProperties.title = me.context.getMessage('alert_def_form_clone');
                    dynamicProperties['title-help'] = {
                        "content": me.context.getMessage("alert_def_form_clone_title_help"),
                        "ua-help-text":me.context.getMessage("more_link"),
                        "ua-help-identifier": me.context.getHelpKey("ALERT_ALARM_DEFINITION_EDITING")
                    };
                    break;
                case me.MODE_CREATE:
                    dynamicProperties.title = me.context.getMessage('alert_def_form_create');
                    dynamicProperties['title-help'] = {
                        "content": me.context.getMessage("alert_def_form_create_title_help"),
                        "ua-help-text":me.context.getMessage("more_link"),
                        "ua-help-identifier": me.context.getHelpKey("ALERT_ALARM_DEFINITION_CREATING")
                    };
                    break;
            }
            _.extend(formConfiguration, dynamicProperties);
        },
        /*
         * explicitly set the few inputs.
         */
        modifyForm: function () {
            var me = this, timeSpan,
                filter_by,
                severity = me.model.get('severity');
            me.$el.find("#status").attr("checked", this.model.get('status'));
            switch(severity){
                case 1:
                    me.$el.find("#info").attr("checked", true);
                    break;
                case 2:
                    me.$el.find("#minor").attr("checked", true);
                    break;
                case 3:
                    me.$el.find("#major").attr("checked", true);
                    break;
                case 4:
                    me.$el.find("#critical").attr("checked", true);
                    break;
            }
            if (me.model.get('alertcriteria')) {
                me.groupByDropDown.setValue(me.model.get('alertcriteria')['aggregation']);
                me.$el.find('#filter-string').val(me.model.get('alertcriteria')['filter-string']);

                filterString = me.model.get('alertcriteria')['filter-string'];
                me.filterWidget.addFilterTokens(filterString);
            }
        },

        checkThreshholdEmpty: function (isValid, me){
            var threshhold      = this.$el.find('#threshhold'),
                threshholdVal   = threshhold.val(),
                filter  = this.$el.find('#add_filter'),
                error   = filter.siblings('.error');

            if (threshholdVal.length == 0){
                var treshholdError = me.context.getMessage('alert_def_form_addfilter_field_error');
                filter.addClass("error");
                error.show().text(treshholdError);
            }else{
                filter.removeClass("error");
            }
        },

        // Hide/Show sections
        showOrHideSections: function () {
        var me = this;
            me.$el.find('#submit_filter').hide();
            switch (me.formMode) {
                case me.MODE_EDIT:
                    me.$el.find('#add_filter').hide();
                    me.$el.find('#edit_filter').show();
                    break;
                case me.MODE_CREATE:
                    me.$el.find('#edit_filter').hide();
                    break;
            }
        },

        populateDataCriteria: function (selectedFilter) {
            var me = this, values, value, unit,
                duration    = parseInt(selectedFilter[0]['duration']),
                unit        = parseInt(selectedFilter[0]['time-unit']),
                timeSpan    = me.util.preciseTimeSpan(unit, duration),
                filterString = selectedFilter[0]['filter-string'];

            value = duration;
            unit = timeSpan["unit"];
            if(unit > 1) {
                value = 86400000;
                unit = 1;
            }
            conf = {
                "duration":value,
                "duration-unit": unit
            };
            timePickerWidget.widgetConf.values = {
                "duration_unit": {
                    "id": TimePickerWidget.unitMapping[unit],
                    "text": TimePickerWidget.unitMapping[unit]
                }
            };
            timePickerWidget.destroyForm();
            timePickerWidget.build();
            timePickerWidget.setValues(conf);
            me.filterWidget.removeFilters();
            me.filterWidget.addFilterTokens(filterString);
            me.groupByDropDown.setValue(selectedFilter[0]['aggregation']);
            me.$el.find('#filter-string').val(selectedFilter[0]['filter-string']);
            me.$el.find('#filter-id').val(selectedFilter[0]['id']);
        }

    });
    return AlertDefinitionView;

});
