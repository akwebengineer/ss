
define([
'../../../../../ui-common/js/common/restApiConstants.js'
], function (RestApiConstants) {


  var Configuration = function(context) {
       

       this.generalConfig = function() {
     
       return{   
                  "tableId":"LogCollectorNodes",
                  "numberOfRows":50,
                  "scroll": false,
                  "height": '250px',        
                  "repeatItems": false,  
                  "url": '/api/juniper/ecm/eps-monitor/eps/by-logging-nodes', 
                  "type": 'GET',
                  "jsonId": "id",
                  "jsonRoot": "eps-monitor-list.eps-monitor",
                  "dataType": "json",
                  "jsonRecords": function(data) {

                   // Have to check to filter  
      
                   //var rows = data["fabric-nodes"]["fabric-node"];

                   // var filteredData = $.grep(rows, function(e){ 
                   //      if(e["special-node-type"] != undefined  && e["special-node-type"] == "collector-indexer"){
                   //             return true;
                   //      }
                   // });
                     
                   // data["fabric-nodes"]["fabric-node"] = filteredData;
                     
                   return data;

                   },
                  "ajaxOptions": {
                  "headers": {
                        "Accept": 'application/vnd.juniper.ecm.eps-monitor.eps-monitors+json;version=1;q=0.01'
                    }
                   },

                  "contextMenu": {},
                  "columns": [{

                      "index": "id",
                      "name": "id",
                      "hidden": true
                  },
                  {   
                      "index":"device-name",
                      "name":"device-name",
                      "label":context.getMessage('node_name'),
                      "width":"130px"
                  },
                  {
                      "index":"log-server",
                      "name":"log-server",
                      "label":context.getMessage('node_ip'),
                      "width":"130px"

                  },
                  // {
                  //     "index":"count",
                  //     "name":"count",
                  //     "label":context.getMessage('log_count'),
                  //     "width":"130px"
                  // },
                  {
                      "index":"average",
                      "name":"average",
                      "label":context.getMessage('average_eps'),
                      "width":"130px"
                  }
          
                 ]
       };
    };
  };   

    return Configuration;
});