/**
 *
 */
define(
    [
        'backbone',

        // status template
        'text!../template/jobStatusTemplate.html',
        '../../../../sd-common/js/common/utils/TimeKeeper.js'
    ],

    function (Backbone, StatusTemplate, TimeKeeper) {

        /**
         * Creates job status panel class
         * @param configuration
         * @constructor
         */
        var JobStatusPanel = function (configuration) {
            this.configuration = configuration;
        };

        /**
         * defines instance functions
         */
        $.extend(JobStatusPanel.prototype, {

            /**
             * creates the job summary panel
             */
            createJobStatusPanel: function (jobsTO) {
                var me = this;
                me.jobsTO = jobsTO;
                me.response = jobsTO;
                me.stopChaining = false;
                me.loadDataInTemplate();
                me.response = [];
                me.fetchJobDetails(0);
            },

            fetchJobDetails: function (i) {
                var me = this;


                $.ajax({
                    url: '/api/space/job-management/jobs/' + me.jobsTO[i].id + '?fields=(id,job-type,job-state,job-status,percent-complete)',
                    "headers": {
                        "Accept": 'application/vnd.net.juniper.space.job-management.job+json;version=3;q=0.03',
                        "x-date" : TimeKeeper.getXDate( )
                    },
                    dataType: "json",
                    success: function (data) {
                        me.response[i] = data.job;
                        if (i < me.jobsTO.length - 1) {
                            me.fetchJobDetails(i + 1);
                        } else {
                            if (!me.stopChaining) {
                                me.handleJobChaining();
                            }
                            me.loadDataInTemplate();
                        }
                    }
                });



            },


            loadDataInTemplate: function () {
                var me = this, container, message;

                // get the container
                container = me.configuration.container;

                // empty the container
                container.empty();

                //update response to handle template rendering
                me.updateResponse();

                // build the template
                message = Slipstream.SDK.Renderer.render(StatusTemplate, {"jobsTO": me.response});

                // update the template in the container
                this.configuration.container.append(message);

            },

            handleJobChaining: function () {
                var me = this, currentJob, jobObject, jobView, nextJobId;

                // get the main job panel
                jobView = me.configuration.parentView;

                // get the current job id
                currentJob = jobView.currentJobID;

                // get the current job id and the next job id
                me.response.forEach(function (element, index) {
                    if (me.response[index].id === currentJob) {
                        // current job object
                        jobObject = me.response[index];

                        // if not the last job, get the next job id
                        if (index !== me.response.length - 1) {
                            nextJobId = me.response[index + 1].id;
                        }

                        return;
                    }
                });

                // launch the next job window.
                if (nextJobId && jobObject['percent-complete'] === 100 ){
                    jobView.updateJobScreen(nextJobId);
                }
            },

            /**
             * Updates the response in accordance to the template
             */
            updateResponse: function () {
                var me = this, isAllJobsLoaded = true;

                me.response.forEach(function (job, index) {
                    if (job['percent-complete'] === 100 && job['job-state'] === "DONE") {
                        job.iconUrlClass = job['job-status'] === 'SUCCESS' ? 'jobIconSuccess' : 'jobIconFailure';
                        job.jobStatusClass = 'jobStatusComplete';
                    } else if (job['job-status'] === 'FAILURE') {
                        job.iconUrlClass = 'jobIconFailure';
                        job.jobStatusClass = 'jobStatusComplete';
                    }else {
                        isAllJobsLoaded = false;
                        job.jobStatusClass = 'jobStatusPending';
                    }
                    job.index = index + 1;
                    if (job.index !== me.response.length) {
                        // is the last job, arrow need not to be shown
                        job.jobArrowClass = 'job-arrow';
                    }
                });

                // check if all jobs are loaded. If yes, don't call the reload of panels
                // later to be removed, will be only on notification
                me.configuration.parentView.isAllJobsLoaded = isAllJobsLoaded;
            },

            /**
             * Refresh data -> Will be called on reload notification
             * @TODO
             */
            reloadData: function () {
                var me = this;
                me.response = [];
                me.fetchJobDetails(0);
            }

        });

        return JobStatusPanel;
    }
);

