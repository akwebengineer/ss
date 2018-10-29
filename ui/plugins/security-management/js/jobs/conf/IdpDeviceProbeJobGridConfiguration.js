/**
 * @author skesarwani
 */
define([ './JobGridConfiguration.js' ], function(JobGridConfiguration) {

  var IdpProbeJobConfig = function(panelConfig, id, jobView) {
    JobGridConfiguration.call(this, panelConfig, id, jobView);
    this.getColumns = function() {

      var cols = [], context = jobView.context;

      cols.push({
        index : 'security-device-id',
        name : 'security-device-id',
        hidden : true
      });
      cols.push({
        index : 'device-moid',
        name : 'device-moid',
        hidden : true
      });

      cols.push({
        label : context.getMessage('job_grid_column_name'),
        index : 'device-name',
        name : 'device-name',
        sortable : true,
        searchCell : true,
        formatter : function(cellvalue, options, record) {

          var hub, name = record['device-name'];
          hub = record['hub'];
          if (hub) {
            name = name + ' [Hub]';
          }
          return name;
        }
      });
      cols.push({
        label : 'Platform',
        index : 'platform',
        name : 'platform'
      });
      cols.push({
        label : 'OS Version',
        index : 'os-version',
        name : 'os-version'
      });
      cols.push({
        label : 'Attack Version',
        index : 'attack-version',
        name : 'attack-version'
      });
      cols.push({
        label : 'App Version',
        index : 'app-version',
        name : 'app-version'
      });
      cols.push({
        label : 'Detector Version',
        index : 'detector-version',
        name : 'detector-version'
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
            "label" : "FAILED",
            "value" : "FAILED"
          }, {
            "label" : "INPROGRESS",
            "value" : "INPROGRESS"
          }, {
            "label" : "UNDETERMINED",
            "value" : "UNDETERMINED"
          } ]
        },
        formatter : function(val) {
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
      return cols;
    };
  };
  return IdpProbeJobConfig;
});