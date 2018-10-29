/**
 *  A configuration object for Update retry form view
 *  @module Retry update form view
 *  @author vinay<vinayms@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define([], function(context) {

	var RetryDiscoveryJobsFormConfiguration = function(context) {

		this.getValues = function() {
			return {
				"title" : context.getMessage('retry_update_failed_devices_title'),
				"form_id" : "retry_update_form",
				"form_name" : "retry_update_form",
				"title-help" : {
					"content" : context.getMessage('retry_update_failed_devices_title'),
					"ua-help-identifier" : "alias_for_title_ua_event_binding"
				},
				"on_overlay" : true,
				"sections" : [ {
					"section_id" : "update-device-list-grid",
					"class": "",
					"height": "800px",
					"heading" : context.getMessage('retry_update_execute_message'),
					"elements" : []
				}, {
					"section_id" : "recurrence-schedule",
					"elements" : [{
                        "element_description": true,
                        "id": "update_schedule",
                        "class": "update_schedule",
                        "name": "schedulerLabel"
                    }]
				}
				],
				"buttons" : [ {
					"id" : "update_job_retry_ok_button",
					"name" : "update_job_retry_ok_button",
					"value" : context.getMessage("ok")
				} ],
				"cancel_link" : {
					"id" : "update_job_retry_cancel_button",
					"value" : context.getMessage("cancel")
				}
			};
		};
	};

	return RetryDiscoveryJobsFormConfiguration;

});