define([
    'backbone',
    'backbone.syphon'
], function (Backbone, Syphon) {

    var JobConfigurationTabView = Backbone.View.extend({

        initialize: function (options) {
            var me = this;

            // set context
            me.context = options.context;
        },

        /**
         * It sets the Iframe src
         * @param rec Row data
         */
        setIFrameURLParams: function (rec) {
            var me = this, jobId, deviceMoid, status;

            // get record status
            status = rec.status;

            if (status !== 'SUCCESS' && status !== 'FAILED' && status !== 'CONFIRMED_COMMIT_FAILURE') {
                me.$el.html('<div>' +
                    me.context.getMessage('job_no_config_text') + '</div>');
            }

            // get job id
            jobId = rec['job-instance-id'];

            // get device Moid
            deviceMoid = rec['device-moid'];

            // set iframe
            me.$el.html('<iframe src="/api/juniper/sd/configPreview?ejb=SDPreviewManagerEJB&amp;configOnly=true&amp;' +
                'jobid=' + jobId + '&amp;devicemoid=' + deviceMoid +
                '&amp;settings=cliConfiguration" name="cli-frame" width="100%" height="100%" frameborder="0">' +
                '</iframe>');

        }


    });

    return JobConfigurationTabView;
});