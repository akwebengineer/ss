/**
 * job export to csv activity
 * 
 * @module job export
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([ '../sdBaseActivity.js', 
  '../../../sd-common/js/common/widgets/exportProgressBarForm.js',
  'widgets/overlay/overlayWidget',
  'widgets/confirmationDialog/confirmationDialogWidget'

     ], 
    function(BaseActivity, 
      progressBarForm, 
      OverlayWidget, 
      ConfirmationDialog) {
  /**
   * Constructs an job export Activity.
   */
  var JobExportActivity = function() {
    BaseActivity.call(this);

     /**
         * [trigger the job for fetching task ID]
         */
        this.exportJobDetails = function() {
            var self = this, jobId = self.getExtras().data.jobID;          
             
            $.ajax( {
                   url: "/api/juniper/sd/job-management/jobs/"+jobId+"/export-results",
                   type: "GET",
                   headers: {
                     'accept': "application/vnd.net.juniper.space.job-management.task+json;version=1;q=0.01"
                    },
                    success: function(data, status) {
                        var jobID = data["task"]["id"];
                        self.showProgressBar(jobID);
                        console.log("Export Job Details "+ jobID +" successfully triggered.");
                     },
                    error: function() {
                         console.log("Export job failed");
                     }
            } );
        };

        this.close = function(event) {
           event.preventDefault();
           this.overlay.destroy( );
        };

        this.showProgressBar = function(jobID) {
           this.progressBar = new progressBarForm({
            "statusText": this.context.getMessage("export_job_details_started", [jobID]),
            "title": this.context.getMessage("export_job_details_window_title"),
            "fileType": this.context.getMessage("export_job_details_file"),
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
       };
        this.createConfirmationDialog = function() {

            var self = this;
            this.confirmationDialogWidget = new ConfirmationDialog({
                title: self.context.getMessage('export_job_details'),
                question: self.context.getMessage('export_job_details_heading'),
                yesButtonLabel: self.context.getMessage('job_details_export'),
                noButtonLabel: self.context.getMessage('cancel'),
                yesButtonCallback: function() {
                    self.confirmationDialogWidget.destroy();
                },
                noButtonCallback: function() {
                    self.confirmationDialogWidget.destroy();
                },
                yesButtonTrigger: 'yesEventTriggered',
                noButtonTrigger: 'noEventTriggered',
                xIcon: true
            });

            this.bindEvents();
            this.confirmationDialogWidget.build();
        };
        /**
         *  bind the confirmation overlay yes and no events
         *  @params option Object
         */
        this.bindEvents = function() {
            var self = this;
            self.confirmationDialogWidget.vent.on('yesEventTriggered', function() {
                if (self.exportJobDetails) {
                    self.exportJobDetails();
                }
            });

            self.confirmationDialogWidget.vent.on('noEventTriggered', function() { });

        };
    this.onStart = function() {
     this.createConfirmationDialog();

    };
  };
  JobExportActivity.prototype = new Slipstream.SDK.Activity();
  return JobExportActivity;
});