define([
'../../../../ui-common/js/common/restApiConstants.js',
'../utils/logConstants.js',
'../utils/logUtils.js',
'../../../../ui-common/js/common/utils/SmUtil.js'
], function (RestApiConstants,
             LogConstants,
             LogUtils,
             SmUtil) {


  var Configuration = function(context) {      
       
       this.getValues = function() {    

       var setCustomActionStatus = function(selectedRows, updateStatusSuccess, updateStatusError){

             var permission = new SmUtil().checkPermission(LogConstants.Rules.NODE_SETTING_PERMISSION),
                 isEnableSysLogForward = enableSyslog(selectedRows);

             updateStatusSuccess({
                    "delete":  selectedRows.numberOfSelectedRows === 1 ? true : false,
                    "syslogforwarding" :permission ? isEnableSysLogForward :false,
                    "changepassword": (permission && selectedRows.numberOfSelectedRows === 0 )? true : false
             });
       };

       var enableSyslog = function(selectedRows){
          var isEnableSysLog=false;

         if(selectedRows.numberOfSelectedRows === 1){
            var nodeType =  selectedRows.selectedRows[0]["special-node-type"];
            if(nodeType){
             if(nodeType === LogConstants.LogTypesDisplay.LOG_RECEIVER || nodeType === LogConstants.LogTypesDisplay.COMBINED_NODE){
              isEnableSysLog = true;
             }
           }
          }
          return isEnableSysLog;
       };

       var displayLCType = function(cellvalue, options, rowObject){

             return LogUtils.logCollectorType(cellvalue);
       };


       var formatNA = function(cellvalue, options, rowObject)
       {             
             if(cellvalue == undefined || cellvalue == ""){               
                   return LogConstants.NotAvailable.NA;
                } 
              return cellvalue;               
       };
       var convertStatus = function (cellvalue, options, rowObject){

          return (cellvalue &&  cellvalue.toUpperCase()) || LogConstants.NotAvailable.NA;
       };

     
       return{  
                  "title": context.getMessage("log_director"),
                  "title-help": {
                    "content": context.getMessage("logging_management_title_help"),
                    "ua-help-text": context.getMessage("more_link"),
                    "ua-help-identifier": context.getHelpKey("LOG_MGMT_NODE_ADDING")
                   },
                     
                  "tableId":"AllLoggingNodes",
                  "numberOfRows":50,
                  "scroll": false,
                  "height": 'auto',        
                  "repeatItems": false,  
                  "url": '/api/juniper/ecm/log-collector-nodes/all', 
                  "type": 'GET',
                  "jsonId": "id",
                  "jsonRoot": "log-collector-nodes.log-collector-node",
                  "dataType": "json",
                  "jsonRecords": function(data) {
                   return data['log-collector-nodes'][RestApiConstants.SPACE_TOTAL_PROPERTY];
                   },
                   "ajaxOptions": {
                   "headers": {
                        "Accept": 'application/json'
                    }
                   },
                  "confirmationDialog": {
                    "delete": {
                        title: context.getMessage('log_collector_delete_title'),
                        question: context.getMessage('log_collector_def_delete_msg')
                    }
                  },
                  "contextMenu": {},
                  "actionButtons":{
                      "customButtons":[
                      {
                          "icon_type": true,
                          "label": context.getMessage('syslog_forwarding'),
                          "icon": {
                             default: "syslog-forward-enabled-icon",
                             hover: "syslog-forward-hover-icon",
                             disabled: "syslog-forward-disabled-icon"
                      },
                          "disabledStatus": true,
                          "key": "syslogforwarding",
                          "id": "syslog_forwarding"
                      },
                      {
                          "icon_type": true,
                          "label": context.getMessage('node_password_change'),
                          "icon": "change-password-icon",
                          "icon": {
                             default: "change-password-icon",
                             hover: "log-change-password-hover-icon",
                             disabled: "change-password-icon-disable"
                           },
                           "disabledStatus": !(new SmUtil().checkPermission(LogConstants.Rules.NODE_SETTING_PERMISSION)),
                          "key": "changepassword",
                          "id": "node_password_change"
                      }],
                      "actionStatusCallback": setCustomActionStatus
                  },
                  "columns": [{
                      "index": "id",
                      "name": "id",
                      "hidden": true
                  },
                  {
                      "index":"node-name",
                      "name":"node-name",
                      "label":context.getMessage('node_name'),
                      "width":"200px",                      
                      "formatter":formatNA
                  },
                  {
                      "index":"display-name",
                      "name":"display-name",
                      "label":context.getMessage('node_type'),
                      "formatter":displayLCType,
                      "width":"200px"
                  },
                  {
                      "index":"ip-address",
                      "name":"ip-address",
                      "label":context.getMessage('node_ipv4'),
                      "formatter":formatNA,
                      "width":"230px"

                  },
                  {
                      "index":"ip-address",
                      "name":"ip-address",
                      "label":context.getMessage('node_ipv6'),
                      "formatter":formatNA,
                      "width":"230px"

                  },
                  {
                      "index":"statistics.status",
                      "name":"statistics.status",
                      "label":context.getMessage('node_status'),
                      "formatter" : convertStatus,
                      "Width":"215px"
                  },
                  {
                      "index":"app-logic",
                      "name":"app-logic",
                      "label":context.getMessage('node_app_status'),
                      "Width":"215px",
                      "formatter":formatNA
                  },
                  {
                      "index":"software-version",
                      "name":"software-version",
                      "label":context.getMessage('node_version'),                      
                      "width":"215px",
                      "formatter":formatNA
                  },
                  {
                      "index":"last-boot-time",
                      "name":"last-boot-time",
                      "label":context.getMessage('node-boot-time'),                      
                      "width":"200px",
                      "formatter":formatNA
                  }
          
                 ]
       };
    };
  };   

    return Configuration;
});
