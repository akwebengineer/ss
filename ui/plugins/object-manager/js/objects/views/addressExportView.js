/**
 * View to export address CSV file
 * 
 * @module AddressExportView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'widgets/overlay/overlayWidget',
    'widgets/confirmationDialog/confirmationDialogWidget',
    '../../../../sd-common/js/common/widgets/exportProgressBarForm.js',
    '../conf/addressImportFormConfiguration.js',
    'text!../../../../sd-common/js/templates/csvSampleLink.html'
], function (Backbone, OverlayWidget, ConfirmationDialog, progressBarForm, FormConfiguration, SampleLinkTemplate) {
    var EXPORT_URL = '/api/juniper/sd/address-management/addresses/export-addresses';
    var EXPORT_ACCEPT = 'application/vnd.net.juniper.space.job-management.task+json;version=1;q=0.01';
    var EXPORT_CONTENT = 'application/vnd.juniper.sd.address-management.address-export+json;version=1;charset=UTF-8';

    var AddressExportView = Backbone.View.extend({

        initialize: function(options) {
            var self = this;
            this.activity = options.activity;
            this.context = options.activity.getContext();
            this.exportIDArr = options.extras.idArr;

            var conf = {
                    title: this.context.getMessage('address_export'), 
                    question: this.context.getMessage('address_export_confirm'),
                    yesButtonLabel: this.context.getMessage('export_selected'),
                    noButtonLabel: this.context.getMessage('export_all'),
                    yesEvent: function() {
                        self.startExport(self.exportIDArr);
                    }, 
                    noEvent: function() {
                        self.startExport([]);
                    },
                    cancleEvent: function() {
                        self.confirmationDialogWidget.destroy();
                    }
            }; 

            this.createConfirmationDialog(conf); 
        },

        startExport: function(idArr) {
            var self = this;

            var dataObj = {"id-list": 
                              {
                                  "ids": idArr
                              }
                          };

            $.ajax({
                type: 'POST',
                url: EXPORT_URL,
                headers: {
                    "Accept": EXPORT_ACCEPT,
                    "Content-Type": EXPORT_CONTENT
                },
                data: JSON.stringify(dataObj),
                dataType: "json",
                success: function(data, textStatus) {
                    var jobID = data["task"]["id"];
                    self.confirmationDialogWidget.destroy();
                    self.showProgressBar(jobID);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log("Failed to upload file.");
                    self.notify('error', self.context.getMessage('export_csv_file_error'));
                    self.confirmationDialogWidget.destroy();
                }
            });
        },

        showProgressBar: function(jobID) {
            this.progressBar = new progressBarForm({
                "statusText": this.context.getMessage("export_job_started", [jobID]),
                "title": this.context.getMessage("address_export_window_title"),
                "fileType": this.context.getMessage("address_export_file"),
                "hasPercentRate": true,
                "parentView": this,
                "jobID": jobID
            });

            this.progressBarOverlay = new OverlayWidget({
                view: this.progressBar,
                type: 'medium',
                showScrollbar: false
            });
            this.progressBarOverlay.build();
        },

        /**
         * Create a confirmation dialog with basic settings
         * Need to specify title, question, and event handle functions in "option"
         */
        createConfirmationDialog: function(option) {

            this.confirmationDialogWidget = new ConfirmationDialog({
                title: option.title,
                question: option.question,
                yesButtonLabel: option.yesButtonLabel,
                noButtonLabel: option.noButtonLabel,
                cancelLinkLabel: 'Cancel',
                yesButtonTrigger: 'yesEventTriggered',
                noButtonTrigger: 'noEventTriggered',
                cancelLinkTrigger: 'cancelEventTriggered',
                xIcon: true
            });

            this.bindDialogEvents(option);
            this.confirmationDialogWidget.build();
        },

        bindDialogEvents: function(option) {
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
            
            this.confirmationDialogWidget.vent.on('cancelEventTriggered', function() {
                if (option.cancleEvent) {
                    option.cancleEvent();
                }
            });
        },

        /**
         *  Helper method to display a toast/non-persistent notification
         */
        notify: function(type, message) {
            new Slipstream.SDK.Notification()
                .setText(message)
                .setType(type)
                .notify();
        }
    });

    return AddressExportView;
});