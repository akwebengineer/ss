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
       
       
       this.getNotificationConfig = function () {
         var notificationSubscriptionConfig = {
           'uri' : ['/api/juniper/ecm/log-collector-nodes/nodes/', '/api/space/fabric-management/fabric-nodes']
           
         };
         return notificationSubscriptionConfig;
        };

       this.getValues = function() {

       var removeLogCollector = function(cellvalue, options, rowObject){

                 if(cellvalue != undefined){
                    
                    cellvalue = cellvalue.replace("Log_Collector_", "");
                    return cellvalue;
                 }
                 return LogConstants.NotAvailable.EMPTY;
       };

       var covertToLocalTime = function (cellvalue, options, rowObject){
                
                return LogUtils.logTime(cellvalue);
       };

       var setCustomActionStatus = function(selectedRows, updateStatusSuccess, updateStatusError){

             var permission = new SmUtil().checkPermission(LogConstants.Rules.NODE_SETTING_PERMISSION),
                 isEnableSysLogForward = enableSyslog(selectedRows);

                 var disableCreateForJSA =function(){
                        var i=0,arr=selectedRows.selectedRows;
                        for(var i=0; i<arr.length;i++){
                            if(arr[i]['node-type']=== 'JSA_CONSOLE'){
                            return true
                            }
                        }
                    };                     

             updateStatusSuccess({
                    "delete":  selectedRows.numberOfSelectedRows === 1 ? true : false,
                    "create": disableCreateForJSA() ? false : true,
                    "syslogforwarding" :permission ? isEnableSysLogForward :false,
                    "changepassword": (permission && selectedRows.numberOfSelectedRows === 0 )? true : false
             });
       };

       var enableSyslog = function(selectedRows){
          var isEnableSysLog=false;

         if(selectedRows.numberOfSelectedRows === 1){
            var nodeType =  selectedRows.selectedRows[0]["node-type"];
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

       var formatIPv6 = function(cellvalue, options, rowObject)
       {
             
             if(cellvalue == undefined || cellvalue == ""){               
                   return LogConstants.NotAvailable.NA;
                }

             return cellvalue;

       };

     
       return{    


                  "title": context.getMessage("log_director"),
                  "title-help": {
                    "content": context.getMessage("logging_management_title_help"),
                    "ua-help-text": context.getMessage("more_link"),
                    "ua-help-identifier": context.getHelpKey("LOG_MGMT_NODE_ADDING")
                   },
                  "tableId":"LogCollectorNodes",
                  "numberOfRows":50,
                  "scroll": true,
                  "height": 'auto',        
                  "repeatItems": "false",  
                  //"url": '/api/space/fabric-management/fabric-nodes', 
                  "url": '/api/juniper/ecm/log-collector-nodes/nodes/', 
                  "type": 'GET',
                  "sortorder": "asc",
                  "onSelectAll": false,
                  "sortname": "",
                  "singleselect":true,
                  "jsonRoot": "log-collector-nodes.log-collector-node",
                  "dataType": "json",
                  "jsonId": "id",
                  "jsonRecords": function(data) {
                   if(data != undefined){
                   var rows = data["log-collector-nodes"]["log-collector-node"];
                      if (rows != undefined){
                         var filteredData = $.grep(rows, function(e){ 
                              if(e["node-type"] != undefined ){
                                     return true;
                              }
                         });
                           
                         data["log-collector-nodes"]["log-collector-node"] = filteredData;
                         totalRecords = data["log-collector-nodes"]["log-collector-node"].length;
                       }    
                   return data;
                   }
                   },
                  "ajaxOptions": {
                  "headers": {
                         "Accept": 'application/vnd.juniper.ecm.log-collector-nodes+json;version=2;q=0.02'
                       // "Accept": 'application/vnd.api.space.fabric-management.fabric-nodes+json;version=2;q="0.01'
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
                      "width":"200px"
                  },
                  {
                      "index":"node-type",
                      "name":"node-type",
                      "label":context.getMessage('node_type'),
                      "formatter":displayLCType,
                      "width":"200px"
                  },
                  {
                      "index":"space-node-id",
                      "name":"space-node-id",                                          
                      "hidden": true 
                  },
                  {
                      "index":"special-node-type",
                      "name":"special-node-type",                                          
                      "hidden": true 
                  },
                  {
                      "index":"ip-address",
                      "name":"ip-address",
                      "label":context.getMessage('node_ipv4'),
                      "width":"230px"

                  },
                  {
                      "index":"management-ip-v6",
                      "name":"management-ip-v6",
                      "label":context.getMessage('node_ipv6'),
                      "formatter":formatIPv6,
                      "width":"230px"

                  },
                  {
                      "index":"status",
                      "name":"status",
                      "label":context.getMessage('node_status'),
                      "Width":"215px"
                  },
                  {
                      "index":"app-logic",
                      "name":"app-logic",
                      "label":context.getMessage('node_app_status'),
                      "Width":"215px"
                  },
                  {
                      "index":"node-version",
                      "name":"node-version",
                      "label":context.getMessage('node_version'),
                      "formatter":removeLogCollector,
                      "width":"215px"
                  },
                  {
                      "index":"last-boot-time",
                      "name":"last-boot-time",
                      "label":context.getMessage('node-boot-time'),
                      "formatter":covertToLocalTime,
                      "width":"200px"
                  }
          
                 ]
       };
    };
  };   

    return Configuration;
});
