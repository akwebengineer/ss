/**
 * Created by tgarg on 6/18/15.
 */


define(
    [
        'backbone',
        'backbone.syphon',
        'widgets/grid/gridWidget',
        '../conf/JobGridConfiguration.js'
    ],

    function (Backbone, Syphon, GridWidget, JobGridConfiguration) {
        /**
         * Creates Job details (Grid) Panel
         * @param configuration
         * @constructor
         */
        var JobDetailsPanel = function (configuration) {
            this.configuration = configuration;
        };

        // defines instance functions
        $.extend(JobDetailsPanel.prototype, {

            /**
             * Creates the grid panel
             */
            createGrid: function (job) {
                var me = this;
                // set the job id
                me.jobID = job.id;

                // set panelConfig
                me.panelConfig = me.configuration.options.panelConfig;

                if (!me.panelConfig) {
                    // get the job type. Based on job type, get the panel configuration
                    me.fetchPanelConfig(job);

                } else {
                    // build the details grid
                    me.buildJobGrid(job);
                }

            },

            /**
             * It fetches the job type and based on that, sets the panel config
             */
            fetchPanelConfig: function (job) {
                var me = this, jobType = job['job-type'] || job['gui-name'], TABLE_CONFIG = me.configuration.parentView.options.constansConf;
                if (jobType === 'Publish Policy' || jobType === 'Publish IPS Policy' || jobType === 'Publish NAT Policy'
                    || jobType === 'Publish VPN') {
                    me.panelConfig = TABLE_CONFIG.PUBLISH;
                } else if (jobType === 'Update Devices') {
                    me.panelConfig = TABLE_CONFIG.UPDATE;
                } else {
                    me.panelConfig = TABLE_CONFIG.SNAPSHOT;
                }

                me.configuration.container.empty();
                if (me.panelConfig) {
                    me.buildJobGrid(job);
                }

            },
            /*
            Build action events based on the panelconfig.
            */
            getActionEvents : function(){
                var me = this;
                if(me.panelConfig.showExportToCSV){
                    return {exportJobDetailsGridToCSV : "exportJobDetailsGridToCSV"};
                }
                else if(me.panelConfig.showDownloadLink){
                    return {downloadSummary : "downloadSummary"};
                }
                return undefined;

            },

            /**
             * Builds the grid
             */
            buildJobGrid: function (job) {
                var me = this, gridConf, jobGridConf, isIDPProbeJob = (job['job-type'] || job['gui-name'] || "").indexOf('Probe IPS') > -1;
                // load the grid configuration if any custom grid configuration provided then load that else load default grid conf
                if(me.panelConfig.customGridConf){
                    jobGridConf = new me.panelConfig.customGridConf (me.panelConfig, me.jobID, me.configuration.parentView);
                } else {
                    jobGridConf = new JobGridConfiguration (me.panelConfig, me.jobID, me.configuration.parentView);
                }

                /*if(me.panelConfig.tableTitle){
                    me.configuration.gridHeader.html('<h5>'+me.panelConfig.tableTitle+'</h5>');
                }*/
                //Here 180 is grid header/footer height substracted from the grid container height
                var gridHeight =  $(me.configuration.container).parent().parent().parent().height() - 180;
                gridConf = jobGridConf.getValues();
                gridConf['height'] = gridHeight + 'px';
                me.jobGrid = new GridWidget({
                    container: me.configuration.container,
                    actionEvents: me.getActionEvents(),
                    elements: gridConf 
                });

                me.jobGrid.build();
            },

            /**
             * Refresh the grid contents
             * @TODO
             */
            reloadData: function () {
                var me = this;
                me.jobGrid.reloadGrid();
            },

            /**
             *
             * @returns true if the configuration tab need to be shown on the message window
             */
            isConfigAvailable: function () {
                var me = this;
                if (me.panelConfig) {
                    return !!me.panelConfig.showConfigColumn;
                }
                return false;
            }
        });

        return JobDetailsPanel;
    }
);
