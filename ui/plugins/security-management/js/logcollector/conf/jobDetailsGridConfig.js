define([
'../../../../ui-common/js/common/restApiConstants.js',
'../service/logService.js',
'../utils/logConstants.js',
'../utils/logUtils.js'
], function (RestApiConstants,
            LogService,
            LogConstants,
            LogUtils) {

 
  

  var Configuration = function(context,jobIds) {
       

         

          this.getValues = function() {

          var covertToLocalTime = function (cellvalue, options, rowObject){
                
                 return LogUtils.logTime(cellvalue);

          };

       
          var createToolTip = function (cellvalue, options, rowObject){
                
                if(cellvalue != undefined){
                  
                   cellvalue = cellvalue.replace(new RegExp("<br>","g"),"\n");
                   return '<a class="tooltip" data-cell="'+cellvalue+'" title="'+cellvalue+'">'+cellvalue+'</a>';
                  
                }

                return LogConstants.NotAvailable.EMPTY;

                

          };

          var getData = function (){

            var rowData = [], self = this ,successErrorCalls = 0;
            for(var i=0; i<jobIds.length; i++){
                var service = new LogService();
                onSuccess = function(data){
                  rowData.push(data["job"]);
                  ++successErrorCalls;
                  if(successErrorCalls == jobIds.length){
                  rowData = rowData.sort(function(prevRow, nextRow) {
                  return prevRow.id - nextRow.id;                   
                  });

                  $(self).addRowData('', rowData); 
   
                  }
                };
                onError = function (jqXhr, textStatus, errorThrown ){
                  ++successErrorCalls;
                  console.log(errorThrown);
                };
                  service.spaceJob(jobIds[i], onSuccess, onError )  
               };
                
            };
     
       return{    "title": context.getMessage( 'logging_nodes_jobs' ),
                  "tableId":"LogNodeJobDetails",
                  "getData": getData,
                  "numberOfRows":50,
                  "scroll": true,
                  "height": '350px',        
                  "repeatItems": true,  
                  "jsonId": "id",
                  "contextMenu": {},
                  "columns": [
                  {
                      "index": "id",
                      "name": "id",
                      "hidden": true
                  },
                  {
                      "index":"name",
                      "name":"name",
                      "label":context.getMessage('collector_job_name'),
                      "width":"150px",
                      "sortable": false
                  },
                  {
                      "index":"percent-complete",
                      "name":"percent-complete",
                      "label":context.getMessage('node_job_percent_complete'),
                      "width":"130px",
                      "sortable": false
                  },
                  {
                      "index":"mo-state",
                      "name":"mo-state",
                      "label":context.getMessage('node_status'),
                      "Width":"200px",
                      "sortable": false
                  },
                  {
                      "index":"job-type",
                      "name":"job-type",
                      "label":context.getMessage('node_job_type'),
                      "width":"130px",
                      "sortable": false
                  },
                  {
                      "index":"start-time",
                      "name":"start-time",
                      "label":context.getMessage('node_job_start_stime'),
                      "formatter":covertToLocalTime,
                      "width":"200px",
                      "sortable": false
                  },
                  {
                      "index":"summary",
                      "name":"summary",
                      "label":context.getMessage('node_job_summary'),
                      "formatter":createToolTip,
                      "width":"150px",
                      "sortable": false
                  }
          
                 ]
       };
    };
  };   

    return Configuration;
});
