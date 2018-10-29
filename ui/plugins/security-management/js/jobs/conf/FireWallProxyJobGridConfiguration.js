/**
 * @author vinayms
 */
define([ './JobGridConfiguration.js' ], function(JobGridConfiguration) {

  var FireWallJobConfig = function(panelConfig, id, jobView) {
    JobGridConfiguration.call(this, panelConfig, id, jobView);
    this.getColumns = function() {

      var cols = [], context = jobView.context;

      cols.push({
        index : 'id',
        name : 'id',
        hidden : true
      });
      cols.push({
        index : 'job-id',
        name : 'job-id',
        hidden : true
      });
      cols.push({
        label : 'CRID',
        index : 'cr-id',
        name : 'cr-id',
        hidden : true
      });
      cols.push({
        label : 'Device Id',
        index : 'device-id',
        name : 'device-id',
        hidden : true
      });
      cols.push({
        label : 'Device Ip',
        index : 'device-ip',
        name : 'device-ip',
        width: 150
      });
      cols.push({
        label : 'Device Name',
        index : 'device-name',
        name : 'device-name',
        width: 150
      });
      cols.push({
              index : 'xml-data',
              name : 'xml-data',
              hidden: true,
              width: 150
       });
      cols.push({
        label: context.getMessage('job_config_tab_title'),
        index: 'xml-data1',
        name:  'xml-data1',
        sortable: false,
        width: 100,
        align: 'center',
        bodyStyle: 'font-weight:bold',
      unformat: function( cellValue, options, rowObject ) {
          return cellValue;
      },
      formatter: function (val, meta, rec) {
          deviceViewConfiguration = function (id, name,objectId) {
              jobView.userFwManagmentDeviceViewConf({id:id,name:name});
          };

            val = rec['status'];
            if (val === 'SUCCESS' || val === 'FAILURE' || val === 'CONFIRMED_COMMIT_FAILURE') {
                return '<a class="job-view-link" onclick=deviceViewConfiguration('+rec['job-id']+',"'+rec['device-name']+'") style="color:black; font-weight:bold">'
                    + context.getMessage('job_cellvalue_view') + '</a>';
            }
            return context.getMessage('job_config_not_available');
        }
      });
      cols.push({
        label : context.getMessage('job_grid_column_status'),
        index : 'status',
        name : 'status',
        sortable : true,
        width : 100,
        searchCell : {
          "type" : 'dropdown',
          "values" : [ {
            "label" : "SUCCESS",
            "value" : "SUCCESS"
          }, {
            "label" : "FAILURE",
            "value" : "FAILURE"
          }, {
            "label" : "INPROGRESS",
            "value" : "INPROGRESS"
          }, {
            "label" : "UNDETERMINED",
            "value" : "UNDETERMINED"
          } ]
        },
        formatter : function(val) {

          if (val) {
              return context.getMessage(val);;
          }
          return "";
        }
      });
      cols.push({
        index : 'xml-data-reply',
        name : 'xml-data-reply',
        hidden: true
      });
      cols.push({
        label : 'Message',
        index : 'xml-data-reply1',
        name : 'xml-data-reply1',
        unformat: function( cellValue, options, rowObject ) {
          return cellValue;
        },
        formatter: function (val, meta, rec) {
            getMessageTab = function (rowId) {
                jobView.setUserFwManagementTabContents(0, $("#job-details-grid-table").jqGrid("getRowData",rowId));
            };
            if (rec['xml-data-reply']) {
                return '<a class="job-view-link" onclick=getMessageTab("'+meta.rowId+'") style="color:black; font-weight:bold">'
                    + context.getMessage('job_cellvalue_view') + '</a>';
            }
            return context.getMessage('job_config_not_available');
        }
      });
      return cols;
    };
  };
  return FireWallJobConfig;
});