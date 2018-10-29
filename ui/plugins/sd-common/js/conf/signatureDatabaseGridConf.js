/**
 * A configuration object with the parameters required to build 
 * a grid for signature database
 *
 * @module signatureDatabaseGridConf
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
        '../../../ui-common/js/common/restApiConstants.js',
        '../../../ui-common/js/common/gridConfigurationConstants.js',
        '../common/widgets/scheduleRecurrence/TimeZoneUtil.js'
], function (RestApiConstants, GridConfigurationConstants, TimeZoneUtil) {

    var Configuration = function(context, activeDatabaseModel) {
        var getActiveDatabaseData = function(){
            var self = this;
            var onFetch = function(model, response, options) {
                if (model['attributes']) {
                    model['attributes'] = [].concat(model['attributes']);
                    $(self).addRowData('', model['attributes']);
                }
            };

            var onError = function() {
                console.log('failed fetch');
            };
            activeDatabaseModel.fetch({
                success: onFetch,
                error: onError
            });
        };

        //Do install action
        var installActionFormatter = function(cellValue, options, rowObject){
            var retStr = '';
            if(rowObject && rowObject['version'])
                retStr = "<a href='#' id='signature-database-install'>" + context.getMessage('signature_database_action_install_link') + "</a>";
            return retStr;
        };

        // Show detector overlay
        var detectorsFormatter = function(cellValue, options, rowObject) {
            var retStr = '';
            if(cellValue) retStr = "<a href='#' name='detectors' version-no='" + rowObject['version'] + "'>" + cellValue + "</a>";
            return retStr;
        };

        // Jump to job page
        var jobFormatter = function(cellValue, options, rowObject){
            var retStr = '';
            if(cellValue) retStr = "<a href='#' name='job-information' job-id='" + cellValue + "'>" + cellValue + "</a>";
            return retStr;
        };

        // Jump to job page
        var scheduledJobFormatter = function(cellValue, options, rowObject){
            return "<a href='#' name='scheduled-job-information'></a>";
        };

        // Do download action
        var downloadActionFormatter = function(cellValue, options, rowObject){
            return "<a href='#' name='delta_download' version-no='" +
                JSON.stringify(rowObject['version']) + "' delta-download=true >" +
                context.getMessage('signature_database_action_delta_download') + "</a>&nbsp;&nbsp;|&nbsp;&nbsp;" +
                "<a href='#' name='full_download' version-no='" +
                JSON.stringify(rowObject['version']) + "'>" +
                context.getMessage('signature_database_action_full_download') + "</a>";
        };

        // Show summary overlay
        var updateSummaryFormatter = function(cellValue, options, rowObject){
            var retStr = '',
                version = rowObject['version'];
            if(cellValue && version){
                var preLength = version.toString().length + 1,
                    displayValue = cellValue.substring(preLength);
                retStr = "<a href='#' name='update-summary' data-cell='" +
                    JSON.stringify(rowObject['update-summary']) +
                    "' version-no='" + version + "'>" +
                    displayValue + "</a>";
            }
            return retStr;
        };

        // Show version no with latest tag
        var versionFormatter = function(cellValue, options, rowObject){
            var title = rowObject['title'].toString(),
                retStr = title,
                versionLength = cellValue.toString().length;
            if(title.length > versionLength){
                retStr = cellValue + '<span class="signature-database-latest-tag">' + title.substring(versionLength)+ '</span>';
            }
            return retStr;
        };

        // Show download time with special format
        var downloadTimeFormatter = function(cellValue, options, rowObject) {
            var date = new Date(cellValue);
            var timeZoneOffset = Slipstream.SDK.DateFormatter.format(date, "Z");
            var timeZoneInfo = TimeZoneUtil.getTimeZoneInfo(timeZoneOffset);
            return Slipstream.SDK.DateFormatter.format(date, "MMM D, YYYY h:mm:ss A") + ' ' + timeZoneInfo.timeZone;
        };

        // Show download IP
        var downloadIpFormatter = function(cellValue, options, rowObject) {
            var retStr = cellValue,
                pre = '';
            if(cellValue){
                pre = cellValue.substring(0, 1);
                if(pre === '/'){
                    retStr = cellValue.substring(1);
                }
            }
            return retStr;
        };

        this.getActiveDatabaseGrid = function() {

            return {
                "title": context.getMessage('signature_database_active_database_title'),
                "tableId": "signature_database_active_database",
                "title-help": {
                    "content": context.getMessage('signature_database_intro'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("SIGNATURE_DATABASE_USING")
                },
                "height": "50px",
                "getData": getActiveDatabaseData,
                "actionButtons":{
                    "customButtons":[{
                        "button_type": true,
                        "label": context.getMessage('signature_database_download_config_title'),
                        "key": "setDownloadConfiguration"
                    },{
                        "button_type": true,
                        "label": context.getMessage('signature_database_upload_from_file_system'),
                        "key": "uploadFromFile"
                    },{
                        "button_type": true,
                        "label": context.getMessage('signature_database_install_label'),
                        "key": "setInstallConfiguration"
                    }]
                },
                "filter": {
                    optionMenu: {
                        "showHideColumnsItem": {},
                        "customItems": []
                    }
                },
                "columns": [
                    {
                        "id": "version",
                        "name": "version",
                        "sortable": false,
                        "label": context.getMessage('signature_database_active_database_grid_database_version')
                    },
                    {
                        "id": "publish-date",
                        "name": "publish-date",
                        "sortable": false,
                        "label": context.getMessage('signature_database_active_database_grid_publish_date')
                    },
                    {
                        "id": "update-job-id",
                        "name": "update-job-id",
                        "sortable": false,
                        "label": context.getMessage('signature_database_active_database_grid_update_job'),
                        "formatter": jobFormatter,
                        "width": 100
                    },
                    {
                        "id": "install-device-count",
                        "name": "install-device-count",
                        "sortable": false,
                        "label": context.getMessage('signature_database_active_database_grid_installed_device_count')
                    },
                    {
                        "id": "detectors",
                        "name": "detectors",
                        "sortable": false,
                        "label": context.getMessage('signature_database_active_database_grid_detectors'),
                        "formatter": detectorsFormatter
                    },
                    {
                        "id": "install-action",
                        "name": "version",
                        "sortable": false,
                        "label": context.getMessage('signature_database_active_database_grid_action'),
                        "formatter": installActionFormatter
                    },
                    {
                        "id": "scheduled-job-id",
                        "name": "scheduled-job-id",
                        "sortable": false,
                        "label": 'Scheduled Download',
                        "formatter": scheduledJobFormatter
                    }
                ]
            };
        };

        this.getLatestSigdbListGrid = function() {

            return {
                "title": context.getMessage('signature_database_latest_list_title'),
                "tableId": "signature_database_latest_sigdb_list",
                "height": "300px",
                "scroll":"true",
                "url": "/api/juniper/sd/ips-management/latest-sigdb-update-list",
                "jsonRoot": "idp-sig-list.idp-sig",
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.ips-management.idp-update-items+json;version=1;q=0.01'
                    }
                },
                "filter": {
                    searchUrl: function (value, url){
                        return url + "?filter=(global eq '"+ value +"')";
                    },
                    columnFilter: false,
                    showFilter: false,
                    optionMenu: {
                        "showHideColumnsItem": {},
                        "customItems": []
                    }
                },
                "columns": [
                    {
                        "id": "version",
                        "name": "version",
                        "sortable": false,
                        "label": context.getMessage('signature_database_active_database_grid_database_version'),
                        "formatter": versionFormatter
                    },
                    {
                        "id": "publish-date",
                        "name": "publish-date",
                        "sortable": false,
                        "label": context.getMessage('signature_database_active_database_grid_publish_date')
                    },
                    {
                        "id": "description",
                        "name": "description",
                        "sortable": false,
                        "label": context.getMessage('signature_database_active_database_grid_update_summary'),
                        "formatter": updateSummaryFormatter
                    },
                    {
                        "id": "detector-displayed",
                        "name": "detector-displayed",
                        "sortable": false,
                        "label": context.getMessage('signature_database_active_database_grid_detectors'),
                        "formatter": detectorsFormatter
                    },
                    {
                        "id": "download-action",
                        "name": "download-action",
                        "sortable": false,
                        "width": 250,
                        "label": context.getMessage('signature_database_active_database_grid_action'),
                        "formatter": downloadActionFormatter
                    }
                ]
            };
        };

        this.getDownloadHistoryGrid = function() {

            return {
                "title": context.getMessage('signature_database_download_history_title'),
                "tableId": "signature_database_download_history_list",
                "height": "300px",
                "scroll":"true",
                "url": "/api/juniper/sd/ips-management/sigdb-download-history",
                "jsonRoot": "history.audit-log",
                "jsonRecords": function(data) {
                    return data['history'][RestApiConstants.TOTAL_PROPERTY];
                },
                "numberOfRows": GridConfigurationConstants.PAGE_SIZE,
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.ips-management.auditlogs+json;version=1;q=0.01'
                    }
                },
                "sorting": [
                    {
                        "column": "time-stamp-string",
                        "order": "asc"
                    }
                ],
                "repeatItems": "true",
                "filter": {
                    searchUrl: function (value, url){
                        return url + "?filter=(global eq '"+ value +"')";
                    },
                    columnFilter: false,
                    showFilter: false,
                    optionMenu: {
                        "showHideColumnsItem": {},
                        "customItems": []
                    }
                },
                "columns": [
                    {
                        "id": "user-name",
                        "name": "user-name",
                        "label": context.getMessage('signature_database_download_history_grid_column_user_name')
                    },
                    {
                        "id": "user-ip-addr",
                        "name": "user-ip-addr",
                        "formatter": downloadIpFormatter,
                        "label": context.getMessage('signature_database_download_history_grid_column_user_ip')
                    },
                    {
                        "id": "task-name",
                        "name": "task-name",
                        "label": context.getMessage('signature_database_download_history_grid_column_task_name'),
                        "width": 350
                    },
                    {
                        "id": "time-stamp-string",
                        "name": "time-stamp-string",
                        "label": context.getMessage('signature_database_download_history_grid_column_timestamp'),
                        "formatter": downloadTimeFormatter,
                        "width": 200
                    },
                    {
                        "id": "exec-result",
                        "name": "exec-result",
                        "label": context.getMessage('signature_database_download_history_grid_column_exec_result')
                    },
                    {
                        "id": "description",
                        "name": "description",
                        "label": context.getMessage('signature_database_download_history_grid_column_description'),
                        "width": 350
                    }
                ]
            };
        };
    };

    return Configuration;
});
