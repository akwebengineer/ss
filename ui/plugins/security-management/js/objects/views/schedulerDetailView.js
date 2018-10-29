/**
 * Detail View of a Scheduler
 *
 * @module SchedulerDetailView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    '../../../../ui-common/js/views/detailView.js',
    './schedulerUtility.js',
    'text!../templates/scheduleDetail.html'
], function (Backbone, DetailView, SchedulerUtility, scheduleTemplate) {

    var SchedulerDetailView = DetailView.extend({
        getFormConfig: function() {
            var conf = {},
                eleArr = [],
                values = this.model.attributes;

            eleArr.push({
                'label': this.context.getMessage('name'),
                'value': values.name
            });

            eleArr.push({
                'label': this.context.getMessage('description'),
                'value': values.description
            });

            var firstDateRangeEmpty = secondDateRangeEmpty = true;
            if (values["start-date1"] && values["stop-date1"])
            {
                firstDateRangeEmpty = false;
                eleArr.push({
                    'label': this.context.getMessage('scheduler_grid_column_start_date'),
                    'value': values["start-date1"]
                });
                eleArr.push({
                    'label': this.context.getMessage('scheduler_grid_column_stop_date'),
                    'value': values["stop-date1"]
                });
            }

            if (values["start-date2"] && values["stop-date2"])
            {
                secondDateRangeEmpty = false;
                eleArr.push({
                    'label': this.context.getMessage('scheduler_grid_column_start_date_2'),
                    'value': values["start-date2"]
                });
                eleArr.push({
                    'label': this.context.getMessage('scheduler_grid_column_stop_date_2'),
                    'value': values["stop-date2"]
                });
            }
            if (firstDateRangeEmpty && secondDateRangeEmpty) {
                eleArr.push({
                    'label': this.context.getMessage('fw_scheduler_dates_type'),
                    'value': this.context.getMessage('fw_scheduler_dates_type_forever')
                });
            }

            if (values.schedules && values.schedules.schedule)
            {
                eleArr.push({
                    'label': this.context.getMessage('scheduler_grid_column_schedules'),
                    'id': "schedules-detail",
                    'value': ""
                });
            }

            conf.sections = [{elements: eleArr}];
            return conf;
        },

        initialize: function(options) {
            DetailView.prototype.initialize.call(this, options);
            this.fetchErrorKey = 'scheduler_fetch_error';
            this.objectTypeText = this.context.getMessage('scheduler_type_text');
        },

        render: function() {
            // Get form configuration
            var conf = this.getFormConfig();
            // Render form
            this.renderForm(conf);
            this.afterBuild();
            return this;
        },

        // add schedule details afert render, otherwise the html tags will be translated during render
        afterBuild: function() {
            var values = this.model.attributes,
                schedules = values.schedules ? values.schedules.schedule : [];
            if (schedules) {
                for (var i = 0, len = schedules.length; i < len; i++) {
                    if (schedules[i]["day"] == "DAILY") { // here DAILY means no specified schedules
                        return false;
                    }
                }
                values.schedules.fieldLabels = SchedulerUtility.getFieldLabels(this.context);
                var schedules = Slipstream.SDK.Renderer.render(scheduleTemplate, values.schedules);
                this.$el.find("#schedules-detail>label").html(schedules);
            }
        }
    });

    return SchedulerDetailView;
});