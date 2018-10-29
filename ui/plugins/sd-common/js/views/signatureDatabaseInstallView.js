/**
 * The overlay for install
 * 
 * @module SignatureDatabaseInstallView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',
    'widgets/overlay/overlayWidget',
    'widgets/tooltip/tooltipWidget',
    '../common/widgets/scheduleRecurrence/scheduleRecurrenceForm.js',
    '../common/widgets/scheduleRecurrence/TimeZoneUtil.js',
    '../models/deviceProbeModel.js',
    '../models/signatureDatabaseInstallModel.js',
    '../conf/signatureDatabaseInstallFormConf.js',
    '../conf/signatureDatabaseDeviceGridConf.js',
    'text!../../../sd-common/js/templates/probeDeviceTooltipTemplate.html',
    '../common/widgets/jobInformationForm.js'
], function (Backbone, FormWidget, GridWidget, OverlayWidget, TooltipWidget, ScheduleRecurrenceForm, 
        TimeZoneUtil, DeviceProbeModel, SignatureDatabaseInstallModel, FormConf, DeviceGridConf, 
        ProbeDeviceTooltipTemplate, JobInformationForm) {

    var SignatureDatabaseInstallView = Backbone.View.extend({

        events: {
            'click #signature-database-install-cancel': "cancel",
            'click #signature-database-install-save': "submit"
        },

        cancel: function(event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        },

        submit: function(event) {
            var self = this;
            var selectedRows = this.gridWidget.getSelectedRows(true),
                deviceIdArr = [];
            event.preventDefault();

            if (! this.form.isValidInput()) {
                console.log('form is invalid');
                return;
            }
            console.log(selectedRows);
            if($.isEmptyObject(selectedRows.selectedRowIds)){
                console.log('grid has no selections');
                this.form.showFormError(this.context.getMessage('signature_database_install_device_select_require'));
                return;
            }else{
                if (_.isEmpty(selectedRows.allRowIds)) {
                    deviceIdArr = selectedRows.selectedRowIds;
                } else { // select-all
                    deviceIdArr = selectedRows.allRowIds;
                }
            }
            var data = {
                    "install-signature-request": {
                        "incremental-update": this.$el.find('#signature-database-enable-incremental-update').is(':checked')? 'true' : 'false',
                        "install-latest": "true",
                        "summary": {
                            "sig-version": this.params.version,
                            "id": this.params.id
                        }
                    }
                };
            if(deviceIdArr.length > 0){
                data["install-signature-request"]["sd-device-id"] = deviceIdArr;
            }
            var scheduleInfo = this.scheduleRecurrenceWidget.getScheduleStartInfo();
            var repeatInfo = this.scheduleRecurrenceWidget.getScheduleRecurrenceInfo();
            if(scheduleInfo && scheduleInfo.startDateTime){
                var date = scheduleInfo.startDateTime,
                    timeZoneOffset = Slipstream.SDK.DateFormatter.format(date, "Z"),
                    timeZoneInfo = TimeZoneUtil.getTimeZoneInfo(timeZoneOffset),
                    dateStr = Slipstream.SDK.DateFormatter.format(date, "ddd MMM D HH:mm:ss") + ' ' + Slipstream.SDK.DateFormatter.format(date, "YYYY");
                data["install-signature-request"]["start-time"] = dateStr;
            }
            if(repeatInfo){
                data["install-signature-request"]["repeat"] = repeatInfo.repeatValue;
                data["install-signature-request"]["unit"] = repeatInfo.repeatUnit;
                if(repeatInfo.endInfo && repeatInfo.endInfo.endDateTime){
                    var endDate = repeatInfo.endInfo.endDateTime,
                        timeZoneOffset = Slipstream.SDK.DateFormatter.format(endDate, "Z"),
                        timeZoneInfo = TimeZoneUtil.getTimeZoneInfo(timeZoneOffset),
                        endDateStr = Slipstream.SDK.DateFormatter.format(endDate, "ddd MMM D HH:mm:ss") + ' ' + Slipstream.SDK.DateFormatter.format(endDate, "YYYY");
                    data["install-signature-request"]["end-time"] = endDateStr;
                }
            }
            this.signatureDatabaseInstallModel.set(data);
            this.signatureDatabaseInstallModel.save( null, {
                success: function(model, response) {
                    self.activity.overlay.destroy();
                    self.showJobInformation(response.task);
                },
                error: function(model, response) {
                    console.log("download error");
                    self.form.showFormError(response.responseText);
                }
            });
        },

        initialize: function(options) {
            this.activity = options.activity;
            this.context = options.activity.context;
            this.params = options.params;
            this.signatureDatabaseInstallModel = new SignatureDatabaseInstallModel();
            this.actionEvents = {
                fullProbeEvent: "fullProbeDevice",
                deltaProbeEvent: "deltaProbeDevice"
            };
            this.bindGridEvents();
        },

        render: function() {
            var self = this;
            var formConfiguration = new FormConf(this.context);
            var formElements = formConfiguration.getValues();
            var data = {
                    'version-no': this.params.version,
                    'supported-platform': this.params['supported-platform']
                };
            // In common install configuration page, change the title
            if(! this.params.withoutRepeat) {
                formElements.title = this.context.getMessage('signature_database_install_label');
            }

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: data
            });

            this.form.build();
            this.addGridWidget();
            this.$el.addClass("security-management");
            this.$el.find("#moreMenu").hide();
            this.$el.find("#probe").addClass('signature-database-probe-device-menu').after('<span class="ua-field-help tooltip" id="probe-help"></span>');
            var templateContent = {
                    "maxWidth": 300,
                    "minWidth": 300,
                    "position": 'right',
                    "interactive": true
                };

            var help_data = {data: [{
                label: this.context.getMessage('signature_database_install_full_probe'),
                details: this.context.getMessage('signature_database_install_full_probe_tooltip')
            },{
                label: this.context.getMessage('signature_database_install_delta_probe'),
                details: this.context.getMessage('signature_database_install_delta_probe_tooltip')
            }]};
            var probeHelpInfomation = Slipstream.SDK.Renderer.render(ProbeDeviceTooltipTemplate, help_data);
            var tooltipContainer = this.$el.find("#probe-help").addClass('signature-database-probe-device-help');
            new TooltipWidget({
                "elements": templateContent,
                "container": tooltipContainer,
                "view": this.context.getMessage('signature_database_install_probe_devices_tooltip')
            }).build();
            var scheduleSection = this.$el.find('#signature-database-install-scheduler-section');
            scheduleSection.empty();
            var container = $("<div></div>");
            // This is an workaround, when the widget in framework is ok, will be replaced with that.
            self.scheduleRecurrenceWidget = new ScheduleRecurrenceForm({
                "container": container,
                "context": this.context,
                "withoutRepeat": this.params.withoutRepeat,
                "introductionText": this.context.getMessage('signature_database_install_schedule_text'),
                "scheduleTypeintroductionText": this.context.getMessage('signature_database_install_schedule_type_tooltip'),
                "excludeRecurrenceUnits": ['Minutes', 'Hours']
            });
            self.scheduleRecurrenceWidget.build();
            scheduleSection.append(container);
            this.$el.find(".elementlabel").addClass("signature-database-install-label");

            return this;
        },

        initDate: function() {
            var date = '', date_fmt = "MM-DD-YYYY";
            var scheduleDate = this.$el.find("#signature-database-schedule-date");

            var datetime = new Date();
            date = Slipstream.SDK.DateFormatter.format(datetime, date_fmt);
            scheduleDate.val(date);
        },

        addGridWidget: function() {
            var gridContainer = this.$el.find('#signature-database-device-list');
            gridContainer.empty();
            var gridConf = new DeviceGridConf(this.context);
            var gridElements = gridConf.getValues();
            this.gridWidget = new GridWidget({
                container: gridContainer,
                elements: gridElements,
                actionEvents:this.actionEvents,
                cellTooltip: this.cellTooltip
            });
            this.gridWidget.build();
        },

        cellTooltip: function (cellData, renderTooltip){
            console.log("cell tooltip");
            renderTooltip(cellData.cellId);
        },

        bindGridEvents: function () {
            var self = this;
            this.$el
                .bind(this.actionEvents.fullProbeEvent, function(){
                    console.log('fullProbeEvent');
                    self.probeDevice(true);
                })
                .bind(this.actionEvents.deltaProbeEvent, function(){
                    console.log('deltaProbeEvent');
                    self.probeDevice(false);
                });
        },

        probeDevice: function(isFullProbe) {
            var self = this,
                deviceProbeModel = new DeviceProbeModel({'isFullProbe': isFullProbe});
            deviceProbeModel.save(null, {
                success: function(model, response) {
                    self.showJobInformation(response.task, true);
                },
                error: function(model, response) {
                    console.log("error");
                }
            });
        },

        showJobInformation:function(task, isProbe){
            var self = this;
            var conf = {
                    context: this.context,
                    jobId: task.id,
                    okButtonCallback: function() {
                        self.jobInformationOverlay.destroy();
                    }
                };
            if(isProbe){
                conf.titleHelp = {
                    "content": this.context.getMessage('signature_database_download_job_information_intro'),
                    "ua-help-text": this.context.getMessage('more_link'),
                    "ua-help-identifier": this.context.getHelpKey("SIGNATURE_DATABASE_INSTALLING")
                };
                conf.beforeJumpCallback = function() {
                    self.jobInformationOverlay.destroy();
                    self.activity.overlay.destroy();
                };
            }
            var jobInformation = new JobInformationForm(conf);
            this.jobInformationOverlay = new OverlayWidget({
                view: jobInformation,
                type: 'small',
                showScrollbar: false
            });
            this.jobInformationOverlay.build();
        }
    });

    return SignatureDatabaseInstallView;
});
