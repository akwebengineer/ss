/**
 * The signature database landing page
 * 
 * @module SignatureDatabase
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'widgets/grid/gridWidget',
    'widgets/overlay/overlayWidget',
    '../conf/signatureDatabaseGridConf.js',
    '../models/activeDatabaseModel.js',
    '../models/scheduledDownloadIPSSigJobCollection.js',
    'text!../../../sd-common/js/templates/signatureDatabaseTemplate.html',
    './signatureDatabaseOverlayView.js',
    '../../../ui-common/js/common/intentActions.js'
], function (Backbone,
       GridWidget,
       OverlayWidget,
       GridConf,
       ActiveDatabaseModel,
       ScheduledDownloadIPSSigJobCollection,
       Template,
       OverlayView,
       IntentActions) {
    var OVERLAY_TYPE_UPDATE_SUMMARY = 'update_summary',
        OVERLAY_TYPE_DETECTORS = 'detectors';

    var createNewIntent = function(originalIntent, action) {
        var intent = $.extend(new Slipstream.SDK.Intent(), originalIntent);
        intent.action = action;
        // Fix mime_type, sometimes the value is set directly on data instead of data.mime_type
        // TODO - determine why that happens
        if (! intent.data.mime_type) {
            var mimeType = intent.data;
            intent.data = {mime_type: mimeType};
        }

        return intent;
    };

    var SignatureDatabase = Backbone.View.extend({

        events: {
            'click a[name="update-summary"]': "showUpdateSummary",
            'click a[name="detectors"]': "showDetectors",
            'click a[name="job-information"]': "jumpToJobPage",
            'click a[name="delta_download"]': "onDownloadSignatureDatabaseEvent",
            'click a[name="full_download"]': "onDownloadSignatureDatabaseEvent",
            'click #signature-database-install': "installSignatureDatabaseNow",
            'click a[name="scheduled-job-information"]': "jumpToJobPage"
        },

        initialize: function() {
            this.activity = this.options.activity;
            this.context = this.activity.context;
            this.activeDatabaseModel = new ActiveDatabaseModel();
            this.scheduledDownloadIPSSigJobCollection = new ScheduledDownloadIPSSigJobCollection();
            this.activeDatabaseActionEvents = {
                setInstallConfiguration: {
                    name: "setInstallConfiguration",
                    capabilities: ["installSig"]
                },
                setDownloadConfiguration: {
                    name: "setDownloadConfiguration",
                    capabilities: ["downloadSig"]
                },
                uploadFromFile: {
                    name: "uploadFromFile",
                    capabilities: ["downloadSig"]
                }
            };
            this.bindGridEvents();
        },

        showUpdateSummary: function(event) {
            var linkValue = $(event.target).attr('data-cell'),
                versionNo = $(event.target).attr('version-no');
            if(linkValue && versionNo){
                try {
                    var updateSummary = $.parseJSON(linkValue);
                    var view = new OverlayView({
                        activity: this.activity,
                        params: {'type': OVERLAY_TYPE_UPDATE_SUMMARY, 'version': versionNo, 'data': updateSummary}
                    });
                    this.activity.showOverlay(view);
                }catch(e){
                    console.log('parse error');
                }
            }
        },

        showDetectors: function(event) {
            var versionNo = $(event.target).attr('version-no');
            if(versionNo){
                var view = new OverlayView({
                    activity: this.activity,
                    params: {'type': OVERLAY_TYPE_DETECTORS, 'version': versionNo}
                });
                this.activity.showOverlay(view);
            }
        },

        // To support to jump to Job landing page, when the code of job management is finished, it can work.
        jumpToJobPage: function(event) {
            var jobId = $(event.target).attr('job-id');
            console.log(jobId);
            if(jobId){
                // Launch JOB management activity for associated job
                var intent = new Slipstream.SDK.Intent("slipstream.intent.action.ACTION_LIST", {
                    mime_type: 'vnd.net.juniper.space.job-management.jobs'
                });
                var data = {
                    filter: {
                        'jobid': jobId
                    }
                };
                intent.putExtras({data: data});
                Slipstream.vent.trigger("activity:start", intent);
            }
        },

        installSignatureDatabaseNow: function(event) {
            this.onInstallSignatureDatabaseEvent(true);
        },

        onInstallSignatureDatabaseEvent: function(withoutRepeat) {
            // active database exist
            if(this.activeDatabaseModel.attributes
                    && this.activeDatabaseModel.attributes.length > 0
                    && this.activeDatabaseModel.attributes[0]['version']){

                var versionNo = this.activeDatabaseModel.attributes[0]['version'],
                    supportedPlatform = this.activeDatabaseModel.attributes[0]['supported-platform'],
                    id = this.activeDatabaseModel.attributes[0]['id'];
                var intent = createNewIntent(this.activity.getIntent(), IntentActions.ACTION_INSTALL);
                intent.putExtras({'withoutRepeat': withoutRepeat, 'versionNo': versionNo, 'supportedPlatform': supportedPlatform, 'id': id});

                this.context.startActivity(intent);
            }
        },

        onDownloadConfigurationEvent: function() {
            var intent = createNewIntent(this.activity.getIntent(), IntentActions.ACTION_DOWNLOAD_CONFIGURATION);
            this.context.startActivity(intent);
        },

        onDownloadSignatureDatabaseEvent: function(event){
            var self = this,
                versionNo = $(event.target).attr('version-no'),
                isDeltaDownload = $(event.target).attr('delta-download')? 'true' : 'false';

            var intent = createNewIntent(self.activity.getIntent(), IntentActions.ACTION_DOWNLOAD);
            intent.putExtras({'versionNo': versionNo, 'isDeltaDownload': isDeltaDownload});
            this.context.startActivity(intent);
        },

        onUploadSignatureDatabaseEvent: function() {
            var intent = createNewIntent(this.activity.getIntent(), IntentActions.ACTION_UPLOAD);
            this.context.startActivity(intent);
        },

        render: function() {
            var gridConf = new GridConf(this.context, this.activeDatabaseModel);
            var page_data = {
                    button_name: this.context.getMessage('signature_database_upload_from_file_system')
                };
            this.$el.html(Slipstream.SDK.Renderer.render(Template, page_data));
            this.activeDatabaseGrid = this.addGridWidget('active_database', gridConf.getActiveDatabaseGrid(), this.activeDatabaseActionEvents);
            this.latestSigdbListGrid = this.addGridWidget('latest_sigdb_list', gridConf.getLatestSigdbListGrid());
            this.downloadHistoryListGrid = this.addGridWidget('download_history', gridConf.getDownloadHistoryGrid());
            // Show scheduled job link in the last column of active database grid
            this.fillScheduledJobData();
            // Hide more link
            this.$el.find('.more').hide();

            return this;
        },

        addGridWidget: function(id, gridConf, actionEvents) {
            var self = this;
            var gridContainer = this.$el.find('#' + id);
            var gridWidget = new GridWidget({
                container: gridContainer,
                elements: gridConf,
                actionEvents: actionEvents
            });
            gridWidget.build();
            return gridWidget;
        },

        bindGridEvents: function () {
            var self = this;
            this.$el
                .bind(this.activeDatabaseActionEvents.setInstallConfiguration.name, function(e, selectedRows){
                    console.log('start install intent');
                    self.onInstallSignatureDatabaseEvent(false);
                })
                .bind(this.activeDatabaseActionEvents.uploadFromFile.name, function(e, selectedRows){
                    console.log('start upload intent');
                    self.onUploadSignatureDatabaseEvent();
                })
                .bind(this.activeDatabaseActionEvents.setDownloadConfiguration.name, function(e, selectedRows){
                    console.log('start download intent');
                    self.onDownloadConfigurationEvent();
                });
        },

        fillScheduledJobData: function() {
            var self = this;
            var onFetch = function (collection, response, options) {
                if(collection && collection.models && collection.models.length > 0){
                    var model = collection.models[0],
                        jobId = model.get('id');
                    if(jobId){
                        var scheduledJobLink = self.$el.find('a[name="scheduled-job-information"]').eq(0);
                        scheduledJobLink.attr('job-id', jobId);
                        scheduledJobLink.text(jobId);
                    }
                }
            };
            var onError = function(collection, response, options) {
                console.log('collection not fetched');
            };
            self.scheduledDownloadIPSSigJobCollection.fetch({
                success: onFetch,
                error: onError
            });
        }
    });

    return SignatureDatabase;
});
