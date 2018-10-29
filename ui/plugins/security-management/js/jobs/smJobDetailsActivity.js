/**
 * A module that works with update of device. Created by svaibhav on 09/22/15.
 * 
 * @module jobs
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([ './JobDetailedView.js', './conf/JobConfiguration.js', '../sdBaseActivity.js' ], function(JobDetailedView, JobConfiguration, SDDeviceActivity) {

  var JobDetailViewActivity = function() {
    SDDeviceActivity.call(this);
    this.onStart = function() {
      var self = this,
      extras = self.intent.getExtras(),
      jobId = extras.data.id || extras.data.job.id,
      conf = new JobConfiguration(),
      jobsUrl = conf.defaultConfigurations.jobsUrl + "/" + jobId;

      jQuery.ajax({
        url : jobsUrl,
        type : "GET",
        headers : {
          Accept : conf.defaultConfigurations.job_accept_header
        },
        success : function(res) {
          if (res) {
            var job = res.job,
              jobView = new JobDetailedView();
            if (job['job-type'].indexOf("Publish") !== -1) {
              jobView.showPublishJobDetailsScreen({
                job : job,
                activity : self
              });
            } else if (job['job-type'].indexOf("Preview") !== -1) {
              jobView.showPreviewJobDetailsScreen({
                job : job,
                activity : self
              });
            } else if (job['job-type'].indexOf("Snapshot") !== -1 || job['job-type'].indexOf("Import Addresses") !== -1 || job['job-type'].indexOf("Import Variables") !== -1) {
              jobView.showSnapshotJobDetailsScreen({
                job : job,
                activity : self
              });
            } else if (job['job-type'].includes("Access Profile") && job['name'].includes("Access Profile")) {
               jobView.showFirewallProxyJobDetailsScreen({
                 job : job,
                 activity : self
               });
            }else if (job['job-type'].includes("Active Directory") && job['name'].includes("Active Directory")) {
              jobView.showFirewallProxyJobDetailsScreen({
                job : job,
                activity : self
              });
            }else if (job['job-type'].indexOf("Update") !== -1) {
              jobView.showDeviceUpdateJobDetailsScreen({
                job : job,
                activity : self
              });
            } else if (job['job-type'].indexOf("Import VPN") !== -1) {
              jobView.showImportVPNJobDetailsScreen({
                job : job,
                activity : self
              });
            } else if (job['job-type'].indexOf("Refresh Certificate") !== -1) {
              jobView.showRefreshCertificateJobDetailsScreen({
                job : job,
                activity : self
              });
            } else if (job['job-type'].indexOf("Unpublish") !== -1) {
              jobView.showUnPublishJobDetailsScreen({
                job : job,
                activity : self
              });
            } else if (job['job-type'].indexOf("Hits") !== -1) {
              jobView.showHitCountJobWindow({
                job : job,
                activity : self
              });
            } else if (job['job-type'].indexOf("Import") !== -1  || job['job-type'].indexOf("Rollback") !== -1) {
              jobView.showImportJobWindow({
                job : job,
                activity : self
              });
            } else if (job['job-type'].indexOf("Probe IPS") !== -1) {
              jobView.showIdpProbeJobDetailsScreen({
                job : job,
                activity : self
              });
            } else if (job['job-type'].indexOf("Install IPS") !== -1) {
              jobView.showIdpInstallJobDetailsScreen({
                job : job,
                activity : self
              });
            }else {
              jobView.showJobWindow({
                job : job,
                activity : self
              });
            }
          }
        }
      });
    };
  };
  JobDetailViewActivity.prototype = new Slipstream.SDK.Activity();
  return JobDetailViewActivity;
});
