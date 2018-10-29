/**
 * Defines the configuration for the job screen
 */

define([],
    function () {
        var Configuration = function (isMultiJob, context) {
          
          this.defaultConfigurations = {
              jobsUrl: "/api/space/job-management/jobs",
              job_accept_header: 'application/vnd.net.juniper.space.job-management.job+json;version="3"'
            };
          
            this.getValues = function () {


                return {
                    // overlay config
                    "form_id": "sd_job_overlay",
                    "form_name": "sd_job_overlay",
                    "on_overlay": true,
                    "sections": [

                        {

                            // section for job status in case of multi job
                            "section_id": "job_section_status",
                            "section_class": "job-status",
                            "elements": [

                                {

                                    "element_text": false,
                                    "id": "job-status",
                                    "hidden": !isMultiJob,
                                    "name": "job-status"
                                }

                            ]
                        },
                        {

                            // section for job summary
                            "section_id": "job_section_summary",
                            "section_class": "job-summary-section",
                            "elements": [

                                {

                                    "element_text": true,
                                    "id": "job-summary",
                                    "class": "job-summary",
                                    "name": "job-summary"
                                },
                                {
                                    "element_text": false,
                                    "id": "job-summary-note",
                                    "class": "job-summary-note",
                                    "name": "job-summary-note"
                                }

                            ]
                        },
                        {
                            "section_id": 'job-section-message-cli',
                            "heading": '',
                            'elements': [
                                {
                                    "element_text": false,
                                    "id": "job-tab-widget",
                                    "class": "job-tab-widget",
                                    "name": "job-tab-widget"
                                }
                            ]
                        },
                        {
                            // section for grid
                            "section_id": "job_section_grid",
                            "elements": [

                                {

                                    "element_text": true,
                                    "id": "job-grid-widget",
                                    "class": "job-grid-widget",
                                    "name": "job-grid-widget"
                                }

                            ]
                        }
                    ],

                    // buttons
                    "buttonsAlignedRight": true,
                    "buttonsClass": "buttons_row",
                    "buttons": [
                        {
                            "id": "sd-job-back",
                            "name": "back",
                            "value": context.getMessage('back')
                        },
                        {
                            "id": "sd-job-close",
                            "name": "close",
                            "value": context.getMessage('ok')
                        }
                    ]
                };
            };
        };

        return Configuration;
    });

