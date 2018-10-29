/**
 *  A configuration object for Update retry Device Grid
 *  @module Retry update
 *  @author vinay<vinayms@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define(
		['../../../../ui-common/js/common/restApiConstants.js'],
		function(RestApiConstants) {

			var Configuration = function(context) {

				this.getValues = function(jobId) {

					return {
						"tableId" : "retryupdatejobs",
						"numberOfRows" : 20,
						"height" : "300px",
						"url" : "/api/juniper/sd/job-management/jobs/"+jobId+"/device-results",
						"jsonRoot" : "device-results.device-result",
						"jsonRecords": function(data) {
		                    return data['device-results'][RestApiConstants.TOTAL_PROPERTY];
		                },
						"ajaxOptions" : {
							"headers" : {
								"Accept" : 'application/vnd.juniper.sd.job-management.device-results+json;version=1;q=0.01'
							}
						},
						"scroll" : true,
						"repeatItems" : "true",
						"contextMenu" : {},
						"columns" : [ {
							"label": context.getMessage('job_grid_column_name'),
		                    "index": 'device-name',
		                    "name": 'device-name',
		                    "sortable": true
						},
						{
							"label": context.getMessage('job_grid_column_ip'),
		                    "index": 'device-ip',
		                    "name": 'device-ip',
		                    "sortable": true
						},
						{
							"label": context.getMessage('id'),
		                    "index": 'security-device-id',
		                    "name": 'security-device-id',
		                    "hidden": true
						} ]
					};
				};
			};
			return Configuration;
		});
