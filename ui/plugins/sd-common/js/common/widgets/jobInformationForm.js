/**
 * A form with a job information for generic use.
 *
 * @module jobInformationFrom
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'widgets/form/formWidget'
], function (Backbone, FormWidget) {

    var JobInformationFrom = Backbone.View.extend({

        events: {
            'click #job_id': "jumpToJobPage",
            'click #job-information-ok': "closeView"
        },

        initialize: function(options) {
            this.conf = options;
            this.context = this.conf.context;
        },

        render: function() {
            var formElements = {
                    "title": this.conf.title ? this.conf.title : this.context.getMessage('import_job_information_title'),
                    "form_id": "job-information-form",
                    "form_name": "job-information-form",
                    "on_overlay": true,
                    "sections": [
                        {
                            "section_id": "job-information-content",
                            "heading_text": this.context.getMessage('signature_database_download_job_information_text') + '&nbsp;<a id="job_id">' + this.conf.jobId + '</a>',
                            "elements": [
                            ]
                        }
                    ],
                    "buttonsAlignedRight": true,
                    "buttons": [
                        {
                            "id": "job-information-ok",
                            "name": "ok",
                            "value": this.context.getMessage('ok')
                        }
                    ]
            };
            // If introText is configured
            if(this.conf.titleHelp){
                formElements["title-help"] = this.conf.titleHelp;
            }

            this.form = new FormWidget({
                container: this.el,
                elements: formElements
            });
            this.form.build();
            this.$el.addClass("security-management");

            return this;
        },

        // To support to jump to Job landing page, when the code of job management is finished, it can work.
        jumpToJobPage: function(event) {
            var jobId = $(event.target).text();
            console.log(jobId);
            // Close overlays before jump
            if(this.conf.beforeJumpCallback && typeof(this.conf.beforeJumpCallback) == "function"){
                this.conf.beforeJumpCallback();
            }else if(this.conf.okButtonCallback && typeof(this.conf.okButtonCallback) == "function"){
                this.conf.okButtonCallback();
            }
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

        closeView: function(event) {
        	if (event) {
                event.preventDefault();
        	}
            console.log("Close job information");
            if(this.conf.okButtonCallback && typeof(this.conf.okButtonCallback) == "function"){
                this.conf.okButtonCallback();
            }
        }
    });

    return JobInformationFrom;
});
