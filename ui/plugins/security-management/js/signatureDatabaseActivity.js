/**
 * A module that works with signature database.
 *
 * @module SignatureDatabaseActivity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'widgets/overlay/overlayWidget',
    'widgets/confirmationDialog/confirmationDialogWidget',
    '../../sd-common/js/models/downloadDatabaseModel.js',
    '../../sd-common/js/views/signatureDatabaseView.js',
    '../../ui-common/js/common/intentActions.js',
    '../../sd-common/js/views/signatureDatabaseUploadView.js',
    '../../sd-common/js/views/signatureDatabaseInstallView.js',
    '../../sd-common/js/views/signatureDatabaseDownloadConfigView.js',
    '../../sd-common/js/common/widgets/jobInformationForm.js'
], function(
        OverlayWidget,
        ConfirmationDialog,
        DownloadDatabaseModel,
        View,
        IntentActions,
        UploadView,
        InstallView,
        DownloadConfigView,
        JobInformationForm) {
    /**
     * Constructs a SignatureDatabaseActivity.
     */
    var SignatureDatabaseActivity = function() {

        this.onCreate = function() {
            console.log("Created SignatureDatabaseActivity");
        };

        this.onStart = function() {
            console.log("Started SignatureDatabaseActivity");
            switch(this.getIntent().action) {
                case IntentActions.ACTION_INSTALL:
                    this.onInstallIntent();
                    break;

                case IntentActions.ACTION_DOWNLOAD:
                    this.onDownIntent();
                    break;

                case IntentActions.ACTION_DOWNLOAD_CONFIGURATION:
                    this.onDownConfigurationIntent();
                    break;

                case IntentActions.ACTION_UPLOAD:
                    this.onUploadIntent();
                    break;

                case Slipstream.SDK.Intent.action.ACTION_LIST:
                default:
                    this.onListIntent();
            }
        };

        this.onListIntent = function() {
            this.view = new View({
                activity: this
            });
            this.setContentView(this.view);
        };

        this.onInstallIntent = function() {
            var extras = this.getIntent().getExtras();
            this.doInstallSignatureDatabase(extras);
        };

        this.onDownIntent = function() {
            var extras = this.getIntent().getExtras();
            this.doDownloadSignatureDatabase(extras);
        };

        this.onDownConfigurationIntent = function() {
            this.doDownloadConfiguration();
        };

        this.onUploadIntent = function() {
            this.doUploadSignatureDatabase();
        };

        this.doInstallSignatureDatabase = function(options) {
            var versionNo = options.versionNo,
                supportedPlatform = options.supportedPlatform,
                id =  options.id,
                withoutRepeat = options.withoutRepeat;
            var view = new InstallView({
                activity: this,
                params: {
                    'version': versionNo,
                    'supported-platform': supportedPlatform,
                    'id': id,
                    'withoutRepeat': withoutRepeat
                }
            });
            this.showOverlay(view, 'xlarge');
        },

        this.doDownloadConfiguration = function() {
            var view = new DownloadConfigView({
                activity: this
            });
            this.showOverlay(view);
        },

        this.doUploadSignatureDatabase = function() {
            var view = new UploadView({
                activity: this
            });
            this.showOverlay(view, 'small');
        },

        this.doDownloadSignatureDatabase = function(options){
            var self = this,
                versionNo = options.versionNo,
                isDeltaDownload = options.isDeltaDownload,
                downloadTypeText = this.context.getMessage('signature_database_download_confirmation_dialog_full_download');

            if(versionNo){
                if(isDeltaDownload === 'true'){
                    downloadTypeText = this.context.getMessage('signature_database_download_confirmation_dialog_delta_download');
                }
                var conf = {
                        title: self.context.getMessage('signature_database_download_confirmation_dialog_title'),
                        question: self.context.getMessage('signature_database_download_confirmation_dialog_question', [downloadTypeText]),
                        yesEvent: function() {
                            var downloadModel = new DownloadDatabaseModel();
                            downloadModel.set({
                                "download-idp-signature-request" : {
                                    "delta-download" : isDeltaDownload,
                                    "version-no" : versionNo
                                }
                            });
                            downloadModel.save(null, {
                                success: function(model, response) {
                                    self.showJobInformation(response.task);
                                },
                                error: function(model, response) {
                                    console.log("error");
                                }
                            });
                        },
                        noEvent: function() {
                            // Stay at the landing page
                            return;
                        }
                };

                this.createConfirmationDialog(conf);
            }
        },

        this.showJobInformation = function(task){
            var self = this;

            var jobInformation = new JobInformationForm({
                context: this.context,
                jobId: task.id,
                okButtonCallback: function() {
                    self.overlay.destroy();
                }
            });

            this.showOverlay(jobInformation, 'small');
        },

        this.createConfirmationDialog = function(option) {
            var self = this;

            this.confirmationDialogWidget = new ConfirmationDialog({
                title: option.title,
                question: option.question,
                yesButtonLabel: self.context.getMessage('yes'),
                noButtonLabel: self.context.getMessage('no'),
                yesButtonCallback: function() {
                    self.confirmationDialogWidget.destroy();
                },
                noButtonCallback: function() {
                    self.confirmationDialogWidget.destroy();
                },
                yesButtonTrigger: 'yesEventTriggered',
                noButtonTrigger: 'noEventTriggered',
                xIcon: false
            });

            this.bindConfirmationDialogEvents(option);
            this.confirmationDialogWidget.build();
        },

        this.bindConfirmationDialogEvents = function(option) {
            this.confirmationDialogWidget.vent.on('yesEventTriggered', function() {
                if (option.yesEvent) {
                    option.yesEvent();
                }
            });

            this.confirmationDialogWidget.vent.on('noEventTriggered', function() {
                if (option.noEvent) {
                    option.noEvent();
                }
            });
        },

        this.showOverlay = function(view, size) {
            this.overlay = new OverlayWidget({
                view: view,
                type: size || 'medium',
                showScrollbar: true
            });
            this.overlay.build();
        }
    }

    SignatureDatabaseActivity.prototype = new Slipstream.SDK.Activity();

    return SignatureDatabaseActivity;
});
