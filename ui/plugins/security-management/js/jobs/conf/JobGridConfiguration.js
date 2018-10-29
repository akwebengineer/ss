/**
 * Defines grid configuration
 */

define([
'../../../../ui-common/js/common/restApiConstants.js',
'../../../../sd-common/js/common/utils/TimeKeeper.js'
], function (RestApiConstants, TimeKeeper) {

    var Configuration = function (panelConfig, id, jobView) {
        var context, defaultConf, isMultiJob, gridHeight, actionsButtonsCustom, formatServicesObject;

        /**
         *  format service object before display of the servies 
         *  @params cell cellValue, options, rowObject
         *  returns services string
         */
         formatServicesObject = function (cell, cellValue, options, rowObject) {
            if (rowObject && cellValue ) {
                var formattedCell = '';
                $(cell).each(function (i, ele) {
                  formattedCell += $(ele)[0].outerHTML;
                });
                cell = formattedCell;
            }
          return cell;
        };

        // set context
        context = jobView.context;
        if(panelConfig.showExportToCSV){
            actionsButtonsCustom ={
                "customButtons":[{
                    "button_type": true,
                    "label": "Export to CSV",
                    "id": "exportJobDetailsGridToCSV",
                    "key": "exportJobDetailsGridToCSV"
                }]
            };
        }
        else if(panelConfig.showDownloadLink){
            actionsButtonsCustom ={
                "customButtons":[{
                    "button_type": true,
                    "disabledStatus": true,
                    "label": "Download Summary",
                    "id": "downloadSummary",
                    "key": "downloadSummary"
                }]
            };
        }

        defaultConf = {
            tableTitle: '',
            configGridTitle: '',
            errorPanelTitle: '',
            jobID: -1,
            commitTimeColumnVisible: false,
            exportCSVAvailable: true,
            searchAvailable: true,
            showServicesColumn: false,
            showNameColumn: true,
            showTaskColumn: false,

            showDetailsColumn: false,
            showConfigColumn: false,
            showMessageColumn: true,
            urlPath: "/api/juniper/sd/job-management/jobs/{id}/device-results",
            jsonRoot: "device-results.device-result",
            acceptHeader: 'application/vnd.juniper.sd.job-management.device-results+json;version=1;q=0.01',
            getTotalRecords: function (data) {
                columnData = {};
                return Number(data['device-results'][RestApiConstants.TOTAL_PROPERTY]);
            },
            isFilterAvailable: true,
            filterHelpText: context.getMessage('job_filter_help_text'),
            showSummaryInTab: false
        };

        isMultiJob = jobView.jobWindowMode === jobView.mode.MULTI;
        if (isMultiJob) {
            gridHeight = '100px';
        } else {
            gridHeight = defaultConf.tableTitle ? '140px' : '150px';
        }

        _.extend(defaultConf, panelConfig);

        this.getValues = function () {

            return {
                //title: defaultConf.tableTitle,
                "tableId": "job-details-grid-table",
                "numberOfRows": 15,
                "height": gridHeight,
                "scroll": true,
                "jsonId": "id",
                "url": defaultConf.urlPath.replace("{id}", id),
                "jsonRoot": defaultConf.jsonRoot,
                "jsonRecords": defaultConf.getTotalRecords,
                "ajaxOptions": {
                    "headers": {
                        "Accept": defaultConf.acceptHeader
                    }
                },
                "actionButtons": actionsButtonsCustom,
                "contextMenu":{},
                "filter-help": defaultConf.isFilterAvailable ? {
                    "content": defaultConf.filterHelpText,
                    "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
                }: undefined,

                "filter": defaultConf.isFilterAvailable ? {
                    columnFilter: true,
                    searchUrl: true
                } : {},
                "columns": this.getColumns()
            };
        };


        this.getColumns = function () {
            var cols = [];

            if (defaultConf.showNameColumn) {
                cols.push({
                    index: 'security-device-id',
                    name: 'security-device-id',
                    hidden: true
                });
                cols.push({
                    index: 'device-moid',
                    name: 'device-moid',
                    hidden: true
                });
                
                cols.push({
                    label: context.getMessage('job_grid_column_name'),
                    index: 'device-name',
                    name: 'device-name',
                    sortable: true,
                    searchCell: true,
                    formatter: function (cellvalue, options, record) {

                        var hub, name = record['device-name'];
                        hub = record['hub'];
                        if (hub) {
                            name = name + ' [Hub]';
                        }
                        return name;
                    }
                });
            }


            if (defaultConf.showTaskColumn) {
                cols.push({
                    label: defaultConf.deviceColumnName || 'Task Name',
                    index: 'task-name',
                    name: 'task-name',
                    sortable: false,
                    width: 240,
                    formatter: function (val) {
                        return '<span style="white-space: normal;">' + val + '</span>';
                    }
                });
            }

            cols.push({
                label: context.getMessage('job_grid_column_status'),
                index: 'status',
                name: 'status',
                sortable: defaultConf.showTaskColumn,
                width: 100,
                searchCell: {
                  "type": 'dropdown',
                  "values": [{
                     "label" : "Success",
                     "value" : "Success"
                   },
                   {
                     "label" : "Failed",
                     "value" : "Failed"
                   },
                   {
                     "label" : "Inprogress",
                     "value" : "Inprogress"
                   },
                   {
                     "label" : "Undetermined",
                     "value" : "Undetermined"
                   }]
                },
                formatter: function (val) {
                    // return formatted text
                    var statusVal;

                    if (val) {
                        statusVal = context.getMessage(val);
                        if (statusVal) {
                            return statusVal;
                        }
                        return val;
                    }
                    return "";
                }
            });

            if (defaultConf.showServicesColumn) {
                cols.push({
                    label: context.getMessage('job_grid_column_services'),
                    index: 'associated-service-name-list.associated-service-name-list',
                    name: 'associated-service-name-list.associated-service-name-list',
                    hidden: !defaultConf.showServicesColumn,
                    width: 160,
                    sortable: false,
                    "collapseContent": {
                        "name": "name",
                        "formatCell": formatServicesObject,
                        "overlaySize": "large"
                    }
                });
            }


            if (defaultConf.showDetailsColumn) {
                cols.push({
                    label: 'Details',
                    index: 'details',
                    name: 'details',
                    "sortable": false,
                    width: 360,
                    formatter: function (val,cell,options) {
                        if(options.time){
                            return '<span style="white-space: normal;">' + val + Slipstream.SDK.DateFormatter.format(new Date(parseInt(options.time)), "ddd, DD MMM YYYY HH:mm:ss")+ ' ' + TimeKeeper.getTZStringForTimeOfYear(true, true, false) + '</span>';
                        }else {
                             return '<span style="white-space: normal;">' + val + '</span>';
                        }
                    }
                });
            }

            if (defaultConf.showSummaryColumn) {
                cols.push({
                    label: context.getMessage('job_grid_column_summary'),
                    index: 'summary',
                    name: 'summary',
                    "sortable": false,
                    width: 360,
                    formatter: function (val) {
                        return '<span style="white-space: normal;">' + val + '</span>';
                    }
              });
            }


            if (defaultConf.showSummaryInTab) {
                cols.push({
                    hidden: true,
                    index: 'summary',
                    name: 'summary'
                });

                cols.push({
                    label: context.getMessage('job_grid_column_summary'),
                    index: 'summary-report',
                    name: 'summary-report',
                    "sortable": false,
                    width: 100,
                    formatter: function (val, meta, rec) {
                        getMessageTab = function (rowId) {
                            jobView.setTabContents(0, $("#job-details-grid-table").jqGrid("getRowData",rowId), 'summary');
                        };
                        if (rec['summary']) {
                            return '<a class="job-view-link" onclick=getMessageTab("'+meta.rowId+'") style="color:black; font-weight:bold">'
                                + context.getMessage('job_cellvalue_view') + '</a>';
                        }
                        return "";

                    }
                });
            }


            if (defaultConf.showMessageColumn) {
                cols.push({
                    hidden: true,
                    index: 'warning-messages.warning-message',
                    name: 'warning-messages.warning-message',
                    "formatter": function( cellValue, options, rowObject ) {
                        var value = "",i;
                        for(i in cellValue){
                            if(i>0){
                                value += "#&&#";
                            }
                           value += cellValue[i];     
                        }
                        return value;
                    },
                    "unformat": function( cellValue, options, rowObject ) {
                      return cellValue;
                    }
                });
                cols.push({
                    hidden: true,
                    index: 'error-message',
                    name: 'error-message'
                });
                cols.push({
                    hidden: true,
                    index: 'message',
                    name: 'message'
                });
                cols.push({
                    hidden: true,
                    index: 'rpc-response',
                    name: 'rpc-response'
                });
                cols.push({
                    label: context.getMessage('job_message_tab_title'),
                    index: 'warning-messages-view',
                    name: 'warning-messages-view',
                    sortable: false,
                    width: 100,
                    align: 'center',
                    bodyStyle: 'font-weight:bold',
                    formatter: function (val, meta, rec) {
                        getMessageTab = function (rowId) {
                            jobView.setTabContents(0, $("#job-details-grid-table").jqGrid("getRowData",rowId));
                        };
                        if ((rec['warning-messages'] && rec['warning-messages']['warning-message'])
                            || rec['error-message'] || rec['message']) {
                            return '<a class="job-view-link" onclick=getMessageTab("'+meta.rowId+'") style="color:black; font-weight:bold">'
                                + context.getMessage('job_cellvalue_view') + '</a>';
                        }
                        return "";
                    }
                });
            }


            if (defaultConf.showConfigColumn) {
                cols.push({
                    hidden: true,
                    index: 'job-instance-id',
                    name: 'job-instance-id'
                });
                cols.push({
                    label: context.getMessage('job_config_tab_title'),
                    index: 'confg-view',
                    name: 'confg-view',
                    sortable: false,
                    width: 100,
                    align: 'center',
                    bodyStyle: 'font-weight:bold',
                    formatter: function (val, meta, rec) {
                        getConfTab = function (rowId) {
                            jobView.viewConfiguration(1, $("#job-details-grid-table").jqGrid("getRowData",rowId));
                        };
                        val = rec['status'];
                        if (val === 'SUCCESS' || val === 'FAILED' || val === 'CONFIRMED_COMMIT_FAILURE') {
                            return '<a class="job-view-link" onclick=getConfTab("'+meta.rowId+'") style="color:black; font-weight:bold">'
                                + context.getMessage('job_cellvalue_view') + '</a>';
                        }
                        return context.getMessage('job_config_not_available');
                    }
                });
            }


            if (defaultConf.commitTimeColumnVisible) {
                cols.push({
                    label: context.getMessage('job_grid_column_commit_time'),
                    index: 'commit-time',
                    name: 'commit-time',
                    "sortable": true,
                    width: 200,
                    align: 'center',
                    bodyStyle: 'font-weight:bold',
                    /*"searchCell":{
                      "type": "date"
                    },*/
                    formatter: function (val) {
                        //If input is not valid or zero, return blank.
                        if (!val || !isFinite(val)) {
                            return '-';
                        }
                        return Slipstream.SDK.DateFormatter.format(new Date(parseInt(val)), "ddd, DD MMM YYYY HH:mm:ss")+ ' ' + TimeKeeper.getTZStringForTimeOfYear(true, true, false);
                    }
                });
            }
            return cols;
        };
    };

    return Configuration;
});
