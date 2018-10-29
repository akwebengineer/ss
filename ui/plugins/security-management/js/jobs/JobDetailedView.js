define(
    [
        './views/JobView.js',
        './conf/IdpDeviceProbeJobGridConfiguration.js',
        './conf/FireWallProxyJobGridConfiguration.js',
        './views/userFwManagementJobView.js'

    ],

    function (JobView, IdpProbeJobConfig,FireWallJobConfig, UserFwManagementJobView) {

        var JobDetailedView = function(){

            /**
             * Defines table config, Will be used by the multi job window
             */
          var TABLE_CONFIG = {
                SNAPSHOT: {
                    tableTitle: 'Policy Snapshot Details',
                    showTaskColumn: true,
                    showDetailsColumn: true,
                    showNameColumn: false,
                    showMessageColumn: false,
                    isFilterAvailable: false,
                    urlPath : '/api/juniper/sd/job-result-management/{id}/job-results',
                    jsonRoot: "job-results.task-result",
                    acceptHeader: 'application/vnd.juniper.sd.job-result-management.job-results+json;version=1',
                    getTotalRecords: function (data) {
                        if (data['job-results'] && data['job-results']['task-result']) {
                            return Number(data['job-results']['total']);
                        }
                        return 0;
                    }
                },
                IMPORT: {
                    //tableTitle : 'Import Job Details',
                    showDownloadLink: true,
                    showTaskColumn: true,
                    showDetailsColumn: true,
                    showNameColumn: false,
                    showMessageColumn: false,
                    isFilterAvailable: false,
                    urlPath : '/api/juniper/sd/job-result-management/{id}/job-results',
                    jsonRoot: "job-results.task-result",
                    acceptHeader: 'application/vnd.juniper.sd.job-result-management.job-results+json;version=1',
                    getTotalRecords: function (data) {
                        if (data['job-results'] && data['job-results']['task-result']) {
                            return Number(data['job-results']['total']);
                        }
                        return 0;
                    }
                },
                PUBLISH: {
                    tableTitle: 'Device Publishing Details',
                    configGridTitle: 'Configuration to be updated on the device',
                    errorPanelTitle: 'Error/Warning messages during Publish to device',
                    showExportToCSV : true,
                    showServicesColumn: true
                },
                UNPUBLISH: {
                    tableTitle: 'Device Unpublish Details',
                    errorPanelTitle: 'Error/Warning messages during Unpublish on device',
                    showExportToCSV : true,
                    showServicesColumn: true
                },
                UPDATE: {
                    tableTitle: 'Device Update Details',
                    configGridTitle: 'Configuration Updated on the device',
                    errorPanelTitle: 'Error/Warning messages during Update to device',
                    showExportToCSV : true,
                    showServicesColumn: true,
                    showConfigColumn: true,
                    commitTimeColumnVisible: true        
                },
               PREVIEW: {
                 tableTitle: "Device Publishing Details",
                 configGridTitle: "Configuration to be updated on the device",
                 errorPanelTitle: "Error/Warning messages on device",
                 showExportToCSV : true,
                 showServicesColumn: true,
                 showConfigColumn: true,
                 commitTimeColumnVisible: true
               },
                POLICYHITS: {
                    tableTitle: 'Probe Latest Policy Hits',
                    showTaskColumn: true,
                    showDetailsColumn: false,
                    showNameColumn: false,
                    showMessageColumn: false,
                    showSummaryColumn: true,
                    isFilterAvailable: true,
                    filterHelpText: 'Search Devices By Name',
                    deviceColumnName: 'Device Name',
                    urlPath : '/api/juniper/sd/policy-hit-count-manager/polling-job-results/{id}',
                    jsonRoot: "polling-job-results.task-result",
                    acceptHeader: 'application/vnd.juniper.sd.policy-hit-count-manager.polling-job-results+json;version=1;q=0.01',
                    getTotalRecords: function (data) {
                        if (data['polling-job-results'] && data['polling-job-results']['task-result']) {
                            return Number(data['polling-job-results']['total']);
                        }
                        return 0;
                    }
                },
                IDP_PROBE : {
                	tableTitle: 'IPS Device Probe',
                    isFilterAvailable: true,
                    urlPath : '/api/juniper/sd/ips-management/jobs/{id}/device-probe-results',
                    jsonRoot: "device-probe-results.device-result",
                    acceptHeader: 'application/vnd.juniper.sd.ips-management.device-probe-results+json;version=1;q=0.01',
                    filterHelpText: 'Search Devices By Name',
                    customGridConf: IdpProbeJobConfig, // if any custom grid counfiguration required
                    getTotalRecords: function (data) {
                        if (data['device-probe-results'] && data['device-probe-results']['total']) {
                            return Number(data['device-probe-results']['total']);
                        }
                        return 0;
                    }
                },
                IDP_INSTALL: {
                  tableTitle: 'IPS Device Installation',
                  urlPath : '/api/juniper/sd/ips-management/jobs/{id}/device-results',
                  jsonRoot: "device-results.device-result",
                  acceptHeader: 'application/vnd.juniper.sd.ips-management.device-results+json;version=1;q=0.01',
                  filterHelpText: 'Search Devices By Name',
                  getTotalRecords: function (data) {
                      if (data['device-results'] && data['device-results']['total']) {
                          return Number(data['device-results']['total']);
                      }
                      return 0;
                  }
                },
                IMPORT_VPN: {
                    showTaskColumn: true,
                    showDetailsColumn: true,
                    showNameColumn: false,
                    showMessageColumn: false,
                    tabTitle: 'Summary',
                    tableTitle: 'Import VPN Details',
                    errorPanelTitle: 'VPN Configuration Imported: ',
                    showSummaryInTab: true,
                    isFilterAvailable: true,
                    urlPath : '/api/juniper/sd/job-result-management/{id}/job-results',
                    jsonRoot: "job-results.task-result",
                    acceptHeader: 'application/vnd.juniper.sd.job-result-management.job-results+json;version=1',
                    getTotalRecords: function (data) {
                        if (data['job-results'] && data['job-results']['task-result']) {
                            return Number(data['job-results']['total']);
                        }
                        return 0;
                    }
                },
                FIREWALL_PROXY: {
                    showDetailsColumn: true,
                    showMessageColumn: true,
                    showConfigColumn: true,
                    tabTitle: 'Message',
                    tableTitle: 'Firewall Job Details',
                    showSummaryInTab: true,
                    isFilterAvailable: true,
                    errorPanelTitle: 'Error/Warning messages during Update',
                    customGridConf: FireWallJobConfig,
                    urlPath : '/api/space/config-template-management/templates/deploy-template-result/jobs/{id}',
                    jsonRoot: "template-requests.template-request",
                    acceptHeader: 'application/vnd.net.juniper.space.config-template-management.template-request-refs+json;version=4;q=0.04',
                    getTotalRecords: function (data) {
                        if (data['template-requests']) {
                            return Number(data['template-requests']['@total']);
                        }
                        return 0;
                    }
                }
            };
            
            this.getTableConfig = function( ) {
              return TABLE_CONFIG;
            };
          

            /**
             * Show Snapshot job details
             * @param jobInfo
             */
            this.showSnapshotJobDetailsScreen= function (jobInfo) {
                showJobDetailsScreen(jobInfo, TABLE_CONFIG.SNAPSHOT);
            };

                      /**
             * Show Policy Hits job details
             * @param jobInfo
             */
            this.showPolicyHitsJobDetailsScreen= function (jobInfo) {
                showJobDetailsScreen(jobInfo, TABLE_CONFIG.POLICYHITS);
            };
            
            this.showIdpProbeJobDetailsScreen = function (jobInfo) {
              showJobDetailsScreen(jobInfo, TABLE_CONFIG.IDP_PROBE);
            };
            this.showIdpInstallJobDetailsScreen = function (jobInfo) {
              showJobDetailsScreen(jobInfo, TABLE_CONFIG.IDP_INSTALL);
            };
            
            /**
             * Show Preview job details
             * @param jobInfo
             */
            this.showPreviewJobDetailsScreen= function (jobInfo) {
                showJobDetailsScreen(jobInfo, TABLE_CONFIG.PREVIEW);
            };

            /**
             * Show publish job details
             * @param jobInfo
             */
            this.showPublishJobDetailsScreen= function (jobInfo) {
                showJobDetailsScreen(jobInfo, TABLE_CONFIG.PUBLISH);
            };

            /**
             * Show unpublish job details
             * @param jobInfo
             */
            this.showUnPublishJobDetailsScreen= function (jobInfo) {
                showJobDetailsScreen(jobInfo, TABLE_CONFIG.UNPUBLISH);
            };

            /**
             * Show device update job details
             * @param jobInfo
             */
            this.showDeviceUpdateJobDetailsScreen= function (jobInfo) {
                showJobDetailsScreen(jobInfo, TABLE_CONFIG.UPDATE);
            };

            /**
             * It launches multi job window
             * @param jobInfo
             */
            this._launchPublishMultiJobDetailsScreen = function (jobInfo) {
                showJobDetailsScreen(jobInfo);
            };

            /**
             * Show device change job details
             * @param jobInfo
             */
            this.showDeviceChangeJobDetailScreen= function (jobInfo) {
                showJobDetailsScreen(jobInfo, {
                    tableTitle: 'Device Config Change',
                    configGridTitle: 'Configuration Change on the device',
                    errorPanelTitle: 'Error/Warning messages during Configuration Change on device',
                    showServicesColumn: true,
                    showConfigColumn: true
                });
            };
            /**
             * Show refresh certificate job details
             * @param jobInfo
             */
            this.showRefreshCertificateJobDetailsScreen= function (jobInfo) {
                showJobDetailsScreen(jobInfo, {
                    tableTitle: 'Device Certificate Refresh Details',
                    errorPanelTitle: 'Error/Warning messages during Certification on device'
                });
            };

            /**
             * Shows import vpn job details
             * @param jobInfo
             */
            this.showImportVPNJobDetailsScreen= function (jobInfo) {
                showJobDetailsScreen(jobInfo, TABLE_CONFIG.IMPORT_VPN);
            };

            /**
             * Shows firewall proxy job details
             * @param jobInfo
            */
            this.showFirewallProxyJobDetailsScreen= function (jobInfo) {
                var customJobView = new UserFwManagementJobView({
                    activity: jobInfo.activity,
                    jobInfo: jobInfo,
                    constansConf: TABLE_CONFIG,
                    panelConfig: TABLE_CONFIG.FIREWALL_PROXY
                });
                showJobDetailsScreen(jobInfo, TABLE_CONFIG.FIREWALL_PROXY, customJobView);
            };

            /**
             * Shows all common job details
             * @param jobInfo
             */
            this.showJobWindow= function (jobInfo) {
                showJobDetailsScreen(jobInfo, {
                   showExportToCSV : true
                });
            };

            this.showHitCountJobWindow= function (jobInfo) {
                showJobDetailsScreen(jobInfo, TABLE_CONFIG.POLICYHITS);
            };

            this._launchImportJob= function (jobInfo) {
                showJobDetailsScreen(jobInfo, TABLE_CONFIG.IMPORT);
            };

            /**
             * Shows the job details window.
             * @param jobInfo  component id where screen will be shown
             * @param panelConfig config to be passed to constructor of Juniper.space.sd.JobDetailsPanel
             */
            var showJobDetailsScreen= function (jobInfo, panelConfig, customJobView) {

                var me = this, jobView = customJobView;
                if(!customJobView){
                    // Creates job view
                    jobView = new JobView({
                        activity: jobInfo.activity,
                        jobInfo: jobInfo,
                        constansConf: TABLE_CONFIG,
                        panelConfig: panelConfig
                    });
                }

                jobInfo.activity.buildOverlay(jobView, {});
            };
        };


        JobDetailedView.prototype.showImportJobWindow = function (jobInfo) {
            this._launchImportJob(jobInfo);
        };


        JobDetailedView.prototype.showPublishMultiJobDetailsScreen = function (jobInfo) {
            this._launchPublishMultiJobDetailsScreen(jobInfo);
        };

        return JobDetailedView;
    }
);

