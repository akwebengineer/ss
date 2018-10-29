/**
 * The overlay for download configuration
 * 
 * @module SignatureDatabaseDownloadConfigView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([ 'backbone',
  'backbone.syphon',
  'widgets/form/formWidget',
  'widgets/grid/gridWidget',
  '../common/widgets/scheduleRecurrence/scheduleRecurrenceForm.js',
  '../models/signatureDatabaseSaveDownloadConfigModel.js',
  '../models/currentDownloadConfigurationModel.js',
  '../models/scheduledDownloadIPSSigJobCollection.js',
  '../models/signatureDatabaseCancelScheduledDownloadJob.js',
  '../conf/signatureDatabaseDownloadConfigFormConf.js',
  '../common/widgets/scheduleRecurrence/TimeZoneUtil.js',
  '../common/widgets/jobInformationForm.js',
  '../../../ui-common/js/common/widgets/progressBarForm.js',
  'widgets/overlay/overlayWidget' ], function(Backbone, Syphon, FormWidget, GridWidget, ScheduleRecurrenceForm,
                                              SaveDownloadConfigModel, CurrentDownloadConfigurationModel,
                                              ScheduledDownloadIPSSigJobCollection, SignatureDatabaseCancelScheduledDownloadJob,
                                              FormConf, TimeZoneUtil, JobInformationForm, progressBarForm, OverlayWidget) {
  var DOWNLOAD_URL = 'https://signatures.juniper.net',
  UPLOAD_URL = '/api/juniper/sd/file-management/upload-files?file-type=IPS_SERVER_CERTIFICATE',
  UPLOAD_ACCEPT = 'application/vnd.juniper.sd.upload-files-response+json;version=1;q=0.01';

  var SignatureDatabaseDownloadConfigView = Backbone.View.extend({

    events : {
      'click #signature-database-download-config-cancel' : "cancel",
      'click #signature-database-download-config-save' : "submit",
      'change #signature-database-download-server-proxy-enable' : "onProxyEnableChange"
    },

    onProxyEnableChange : function(event) {
      var comp = $(event.target), objects = this.$el.find('.signature-database-download-server-proxy-settings');
      if (comp.is(':checked')) {
        objects.show();
      } else {
        objects.hide();
      }
    },

    cancel : function(event) {
      event.preventDefault();
      this.activity.overlay.destroy();
    },

    submit : function(event) {
      var self = this;
      event.preventDefault();

      if (!this.form.isValidInput() || !this.isServerProxySectionValid()) {
        console.log('form is invalid');
        return;
      }
      var properties = Syphon.serialize(this);
      var input = this.$el.find("#signature-database-download-config-form").find(".fileupload")[0];
      var data;
      var file = input.files[0];
      if (file) {
        var formData = new FormData();
        formData.append("file", file);
        this.showProgressBar(file.name);
        $.ajax({
          url : UPLOAD_URL,
          headers : {
            Accept : UPLOAD_ACCEPT
          },
          type : "POST",
          data : formData,
          enctype : 'multipart/form-data',
          processData : false,
          contentType : false,
          success : function(data, textStatus) {
            self.progressBarOverlay.destroy();
            data = {
              "idp-download-request" : {
                "url" : properties["url"],
                "server-certificate-file" : properties["ips-server-certificate-upload-box"],
                "delta-download" : properties["delta-download-enable"],
                "proxy" : {
                  "enable" : properties["server-proxy-enable"] ? 'true' : 'false'
                }
              }
            };
            self.saveDownloadConfig(properties, data);
          },
          error : function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Failed to upload file.");
            self.progressBarOverlay.destroy();
            self.form.showFormError(errorThrown);
          }
        });
      } else {
        data = {
          "idp-download-request" : {
            "url" : properties["url"],
            "delta-download" : properties["delta-download-enable"],
            "proxy" : {
              "enable" : properties["server-proxy-enable"] ? 'true' : 'false'
            }
          }
        };
        self.saveDownloadConfig(properties, data);
      }
    },

    saveDownloadConfig : function(properties, data) {
      var self = this;
      if (properties["server-proxy-enable"]) {
        data["idp-download-request"]["proxy"]["port"] = properties["hostport"];
        data["idp-download-request"]["proxy"]["host"] = properties["hostname"];
        data["idp-download-request"]["proxy"]["user-name"] = properties["username"];
        data["idp-download-request"]["proxy"]["pass-word"] = properties["password"];
        data["idp-download-request"]["proxy"]["proxy-ip"] = '';
      }
      var scheduleInfo = this.scheduleRecurrenceWidget.getScheduleStartInfo();
      var repeatInfo = this.scheduleRecurrenceWidget.getScheduleRecurrenceInfo();
      var newScheduledJobTriggered = false, removeSchedule = false;
      if (scheduleInfo) {
        if (scheduleInfo.startDateTime) {
          var date = scheduleInfo.startDateTime,
              timeZoneOffset = Slipstream.SDK.DateFormatter.format(date, "Z"),
              timeZoneInfo = TimeZoneUtil.getTimeZoneInfo(timeZoneOffset),
              dateStr = Slipstream.SDK.DateFormatter.format(date, "ddd MMM D HH:mm:ss") + ' ' + Slipstream.SDK.DateFormatter.format(date, "YYYY");
          data["idp-download-request"]["schedule-later-time"] = dateStr;
          newScheduledJobTriggered = true;
        } else if (scheduleInfo.remove) {
          removeSchedule = true;
        }
      }
      if (repeatInfo) {
        data["idp-download-request"]["repeat"] = repeatInfo.repeatValue;
        data["idp-download-request"]["unit"] = repeatInfo.repeatUnit;
        if (repeatInfo.endInfo && repeatInfo.endInfo.endDateTime) {
          var endDate = repeatInfo.endInfo.endDateTime,
              timeZoneOffset = Slipstream.SDK.DateFormatter.format(endDate, "Z"),
              timeZoneInfo = TimeZoneUtil.getTimeZoneInfo(timeZoneOffset),
              endDateStr = Slipstream.SDK.DateFormatter.format(endDate, "ddd MMM D HH:mm:ss") + ' ' + Slipstream.SDK.DateFormatter.format(endDate, "YYYY");
          data["idp-download-request"]["end-time"] = endDateStr;
        }
        newScheduledJobTriggered = true;
      }
      if (removeSchedule) {
        var SaveConfigWithoutDownloadModel = SaveDownloadConfigModel.extend({
          urlRoot : "/api/juniper/sd/ips-management/save-download-config?download-now=false"
        });
        var saveModel = new SaveConfigWithoutDownloadModel();
        saveModel.set(data);
        saveModel.save(null, {
          success : function(model, response) {
            // Cancel the scheduled job
            self.cancelScheduledJob();
          },
          error : function(model, response) {
            console.log("save configuration error");
            self.form.showFormError(response.responseText);
          }
        });
      } else {
        var saveDownloadConfigModel = new SaveDownloadConfigModel();
        saveDownloadConfigModel.set(data);
        saveDownloadConfigModel.save(null, {
          success : function(model, response) {
            self.activity.overlay.destroy();
            self.showJobInformation(response.task);
            // If a new scheduled job is triggered, will reload the landing page
            if (newScheduledJobTriggered) {
              self.refreshLandingpage();
            }
          },
          error : function(model, response) {
            console.log("download error");
            self.form.showFormError(response.responseText);
          }
        });
      }
    },

    showProgressBar : function(fileName) {
      this.progressBar = new progressBarForm({
        statusText : this.context.getMessage("signature_database_server_certificate_upload_progress_bar_text", [ fileName ]),
        title : this.context.getMessage("signature_database_upload_progress_bar_overlay_title")
      });

      this.progressBarOverlay = new OverlayWidget({
        view : this.progressBar,
        type : 'small',
        showScrollbar : false
      });
      this.progressBarOverlay.build();
    },

    initialize : function(options) {
      this.activity = options.activity;
      this.context = options.activity.context;
      this.params = options.params;
      this.currentDownloadConfigurationModel = new CurrentDownloadConfigurationModel();
    },

    render : function() {
      var formConfiguration = new FormConf(this.context), formElements = formConfiguration.getValues(), data = {
        'download_url' : DOWNLOAD_URL
      };

      this.form = new FormWidget({
        container : this.el,
        elements : formElements,
        values : data
      });

      this.form.build();
      var scheduleSection = this.$el.find('#signature-database-download-scheduler-section');
      scheduleSection.empty();
      var container = $("<div></div>");
      this.scheduleRecurrenceWidget = new ScheduleRecurrenceForm({
        "container" : container,
        "context" : this.context,
        "introductionText" : this.context.getMessage('signature_database_download_schedule_text'),
        "scheduleTypeintroductionText" : this.context.getMessage('signature_database_download_schedule_type_tooltip'),
        "excludeRecurrenceUnits" : [ 'Minutes', 'Hours' ]
      });
      this.scheduleRecurrenceWidget.build();
      scheduleSection.append(container);

      this.pageInit();

      return this;
    },

    pageInit : function() {
      this.$el.find('.signature-database-download-server-proxy-settings').hide();
      this.$el.addClass("security-management");
      this.setData();
      this.getScheduledJobData();
    },

    setData : function() {
      var self = this;
      var onFetch = function(model, response, options) {
        var values = model['attributes']['current-download-config'];
        if (values) {
          if (values['url']) {
            self.$el.find('#signature-database-download-url').val(values['url']);
          }
          if (values['proxy']) {
            if (values['proxy']['enable']) {
              self.$el.find('#signature-database-download-server-proxy-enable').prop('checked', true);
              self.$el.find('.signature-database-download-server-proxy-settings').show();
              if (values['proxy']['host']) {
                self.$el.find('#signature-database-download-server-proxy-hostname').val(values['proxy']['host']);
              }
              if (values['proxy']['port']) {
                self.$el.find('#signature-database-download-server-proxy-hostport').val(values['proxy']['port']);
              }
              if (values['proxy']['user-name']) {
                self.$el.find('#signature-database-download-server-proxy-username').val(values['proxy']['user-name']);
              }
              if (values['proxy']['pass-word']) {
                self.$el.find('#signature-database-download-server-proxy-password').val(values['proxy']['pass-word']);
              }
            }
          }
          if (values['start-time']) {
            self.scheduleRecurrenceWidget.setScheduleStartInfo({
              'startDateTime' : values['start-time']
            });
          }
          if (values['interval'] && values['unit']) {
            var recurrenceInfo = {};
            recurrenceInfo.repeatUnit = values['unit'];
            recurrenceInfo.repeatValue = values['interval'];
            if (values['end-time']) {
              recurrenceInfo.endInfo = {};
              recurrenceInfo.endInfo.endDateTime = values['end-time'];
            }
            self.scheduleRecurrenceWidget.setScheduleRecurrenceInfo(recurrenceInfo);
          }
        }
      };

      var onError = function() {
        console.log('failed fetch download configuration');
      };

      this.currentDownloadConfigurationModel.fetch({
        success : onFetch,
        error : onError
      });
    },

    showJobInformation : function(task) {
      var self = this;
      var jobInformation = new JobInformationForm({
        context : this.context,
        jobId : task.id,
        okButtonCallback : function() {
          self.activity.overlay.destroy();
        }
      });

      this.activity.showOverlay(jobInformation, 'small');
    },

    cancelScheduledJob : function() {
      var self = this, cancelJobModel = new SignatureDatabaseCancelScheduledDownloadJob();
      cancelJobModel.set({
        "cancel-jobs-request" : {
          "jobs" : {
            "job" : [ {
              "@href" : this.existingScheduledJobHref
            } ]
          }
        }
      });
      cancelJobModel.save(null, {
        success : function(model, response) {
          self.activity.overlay.destroy();
          self.refreshLandingpage();
        },
        error : function(model, response) {
          console.log("cancel job error");
          self.form.showFormError(response.responseText);
        }
      });
    },

    refreshLandingpage : function() {
      var currentMimeType = this.activity.intent.data.mime_type;
      var newIntent = new Slipstream.SDK.Intent("slipstream.intent.action.ACTION_LIST", {
        mime_type : currentMimeType
      });
      Slipstream.vent.trigger("activity:start", newIntent);
    },

    /**
     * Use the function to workaround,
     * for fields (not required) in server proxy section cannot be checked by formWidget.isValidInput()
     */
    isServerProxySectionValid : function() {
      if (this.$el.find('#signature-database-download-server-proxy-enable').is(':checked')) {
        var inputFields = this.$el.find("#signature-database-download-server-proxy-section").find("input[data-invalid]");
        if (inputFields.length > 0) {
          return false;
        }
      }
      return true;
    },

    getScheduledJobData : function() {
      var self = this, scheduledDownloadIPSSigJobCollection = new ScheduledDownloadIPSSigJobCollection();
      var onFetch = function(collection, response, options) {
        if (collection && collection.models && collection.models.length > 0) {
          var model = collection.models[0];
          self.existingScheduledJobHref = model.get('@href');
          ;
          self.scheduleRecurrenceWidget.showRemoveOption();
        } else {
          self.$el.find("#signature-database-config-schedule-run-now").prop('checked', true).trigger("click");
        }
      };
      var onError = function(collection, response, options) {
        console.log('collection not fetched');
      };
      scheduledDownloadIPSSigJobCollection.fetch({
        success : onFetch,
        error : onError
      });
    }
  });

  return SignatureDatabaseDownloadConfigView;
});
