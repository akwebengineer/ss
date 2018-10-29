
define([
    '../../../../../ui-common/js/common/restApiConstants.js',
    './../../utils/logConstants.js',
    './../../utils/logUtils.js'
], function (RestApiConstants,
             LogConstants,
             LogUtils) {

 var Configuration = function(context) {

      var covertToLocalTime = function (cellvalue, options, rowObject){

                
            if(cellvalue){
               var date = new Date(cellvalue);
               return date.toString()
            }

            return LogConstants.NotAvailable.NULL;
       };
 
       var addTotalPercentage = function (cellvalue, options, rowObject){

                if(cellvalue != undefined){

                   return (cellvalue + "%");
                } 
                return LogConstants.NotAvailable.EMPTY;

       };


       
       var convertStatus = function (cellvalue, options, rowObject){

                return (cellvalue &&  cellvalue.toUpperCase()) || LogConstants.NotAvailable.NA;
       };

       var displayLCType = function(cellvalue, options, rowObject){

             return LogUtils.logCollectorType(cellvalue);
       };

       var displayNumber = function(cellvalue, options, rowObject){

            if(cellvalue == undefined  || 
                rowObject["display-name"] == LogConstants.LogTypesDisplay.STORAGE_NODE ||
                rowObject["display-name"] ==  LogConstants.LogTypesDisplay.MASTER_NODE ||
                rowObject["display-name"] == LogConstants.LogTypesDisplay.QUERY_NODE ||
                rowObject["display-name"] == LogConstants.LogTypesDisplay.MASTER_DATA){

               return LogConstants.NotAvailable.NA;
            }

            return (Math.round(cellvalue));

       };

       var convertBytesToClosestUnit = function(cellvalue, options, rowObject){
            if(cellvalue != undefined && cellvalue != "NA"){
                if(rowObject["node-type"] != LogConstants.LogTypes.LOG_RECEIVER){
                    var i = -1;
                    var byteUnits = [' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
                    do {
                        cellvalue = cellvalue / 1024;
                        i++;
                    } while (cellvalue > 1024);
                    return cellvalue.toFixed(2).toLocaleString() + byteUnits[i];
                }
                else{
                    return cellvalue;
                }
            }
            return LogConstants.NotAvailable.NA;
       };



       this.generalConfig = function() {
     
       return{    //"title": context.getMessage( 'statistics_details' ),
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
                  "contextMenu": {},
                  "actionButtons":{
                     
                      "customButtons":[
                      
                      {
                          "icon_type": true,
                          "label": context.getMessage('log_stat_refresh'),
                          "icon": "log-stat-refresh",
                          "key": "logStatRefresh",
                          "id": "log_stat_refresh"
                      }

                      ]
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
                      "width":"155px",
                      "sortable": false
                  },
                  {
                      "index":"display-name",
                      "name":"display-name",
                      "label":context.getMessage('node_type'),
                      "width":"155px",
                      "formatter":displayLCType,
                      "sortable": false
                  },
                  {
                      "index":"timestamp",
                      "name":"timestamp",
                      "label":context.getMessage('node_time_stamp'),
                      "width":"155px",
                      "formatter":covertToLocalTime,
                      "sortable": false
                  },
                  {
                      "index":"statistics.event-rate",
                      "name":"statistics.event-rate",
                      "label":context.getMessage('current_eps'),
                      "width":"150px",
                      "formatter":displayNumber,
                      "sortable": false

                  },
                  {
                      "index":"statistics.last-log-received",
                      "name":"statistics.last-log-received",
                      "label":context.getMessage('last_log_received_time_stamp'),
                      "formatter" : covertToLocalTime,
                      "Width":"100px",
                      "sortable": false
                  },
                  {
                      "index":"statistics.total-disc-size",
                      "name":"statistics.total-disc-size",
                      "label":context.getMessage('total_disc_size'),
                      "width":"140px",
                      "formatter" : convertBytesToClosestUnit,
                      "sortable": false
                  },
                  {
                      "index":"statistics.free-space",
                      "name":"statistics.free-space",
                      "label":context.getMessage('free_space'),
                      "formatter" : convertBytesToClosestUnit,
                      "width":"100px",
                      "sortable": false
                  },
                  {
                      "index":"statistics.status",
                      "name":"statistics.status",
                      "label":context.getMessage('health_status'),
                      "formatter" : convertStatus,
                      "width":"100px",
                      "sortable": false
                  },
                  {
                      "index":"cpu-usage",
                      "name":"cpu-usage",
                      "label":context.getMessage('cpu_usage'),
                      "formatter" : addTotalPercentage,
                      "width":"100px",
                      "sortable": false
                  },
                  {
                      "index":"memory-usage",
                      "name":"memory-usage",
                      "label":context.getMessage('memory_usage'),
                      "formatter" : addTotalPercentage,
                      "width":"120px",
                      "sortable": false
                  },
                  // {
                  //     "index":"disc-io-wait",
                  //     "name":"disc-io-wait",
                  //     "label":context.getMessage('disc_wait'),
                  //     "width":"100px",
                  //     "formatter" : convertBytesToClosestUnit,
                  //     "sortable": false
                  // }

          
                 ]
       };
    };
  };   

    return Configuration;
});
