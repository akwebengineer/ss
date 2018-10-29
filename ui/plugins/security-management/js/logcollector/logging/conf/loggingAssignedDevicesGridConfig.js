
define([
    '../../../../../ui-common/js/common/restApiConstants.js',
    './../../utils/logConstants.js'
], function (RestApiConstants,
             LogConstants) {


 var Configuration = function(context) {
       

       this.generalConfig = function() {

       var covertToLocalTime = function (cellvalue, options, rowObject){
                
                  if(cellvalue != undefined){
                  
                  var date = new Date(cellvalue);
                  return date.toString()
                  
                  }

                  return LogConstants.NotAvailable.EMPTY;

       };
     
       return{    "title": context.getMessage( 'assinged_nodes_title' ),
                  "title-help": {
                    "content": context.getMessage( 'assigned_nodes_title_tooltip' ),
                    "ua-help-text": context.getMessage("more_link"),
                    "ua-help-identifier": context.getHelpKey("LOG_MGMT_DEVICE_MAIN_FIELD")
                   },
                  "tableId":"LogCollectorNodesAssignedDevices",
                  "numberOfRows":50,
                  "scroll": false,
                  "height": 'auto',        
                  "repeatItems": true,
                  "url": '/api/juniper/ecm/eps-monitor/eps/by-device-name', 
                  "type": 'GET',
                  "jsonId": "id",
                  "jsonRoot": "eps-monitor-list.eps-monitor",
                  "dataType": "json",
                  "jsonRecords": function(data) {
                   return data['eps-monitor-list'][RestApiConstants.SPACE_TOTAL_PROPERTY];
                   }, 
                  "ajaxOptions": {
                  "headers": {
                        "Accept": 'application/vnd.juniper.ecm.eps-monitor.eps.by-device-name+json;version=1;q=0.01'
                    }
                   }, 
                  "filter": {

                       searchUrl: true,
                       optionMenu: {
                        "showHideColumnsItem": {},
                        "customItems": []
                       }
                  
                   },
                  "contextMenu": {},
                  "actionButtons":{
                     
                      "customButtons":[
                      
                      // {
                      //     "icon_type": true,
                      //     "label": context.getMessage('assign_logging_devices'),
                      //     "icon": "log-assign-icon",
                      //     "key": "assigndevices",
                      //      "id": "assign_devices"
                      // },{
                      //     "icon_type": true,
                      //     "label": context.getMessage('unassign_logging_devices'),
                      //     "icon": "log-unassign-icon",
                      //     "key": "unassigndevices",
                      //     "id": "unassign_devices"
                      // }

                      ]
                  },
                  "columns": [{
                      "index": "id",
                      "name": "id",
                      "hidden": true
                  },
                  {
                      "index":"device-name",
                      "name":"device-name",
                      "label":context.getMessage('device_name'),
                      "width":"200px"
                  },
                  {
                      "index":"device-ip",
                      "name":"device-ip",
                      "label":context.getMessage('device_ip'),
                      "width":"200px"
                  },
                  {
                      "index":"log-server",
                      "name":"log-server",
                      "label":context.getMessage('sending_logs'),
                      "width":"230px"

                  },
                  {
                      "index":"count",
                      "name":"count",
                      "label":context.getMessage('average_eps'),
                      "width":"200px"
                  },
                  {
                      "index":"last-updated",
                      "name":"last-updated",
                      "label":context.getMessage('last-updated'),
                      "formatter":covertToLocalTime,
                      "width":"200px"
                  }

          
                 ]
       };
    };
  };   

    return Configuration;
});
