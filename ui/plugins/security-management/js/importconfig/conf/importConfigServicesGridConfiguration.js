/**
 * author : nareshu
 *
 */

define(
    [],
    function() {
        var Configuration = function(grid) {
            var context = grid.context,uuid = grid.dataObject.uuid,apiConfig=grid.wizardView.apiConfig;
            this.summaryFormatter = function(cellvalue, options, rowObject) {
            var sigDBSummary = "No signature database available in space.",
                installSigInstall = "Signature version mismatch with device.",
                version = 0,message="",downloadMessage ="";

               if(cellvalue){
                if(cellvalue.indexOf("<Mismatch_SigDB>")>=0){
                    version = cellvalue.replace("/<Mismatch_SigDB>/g","");
                    downloadMessage = 'Download ' + version + ' version Now'
                    message = sigDBSummary;
                }
                else if(cellvalue.indexOf("Mismatch_SigInstall")>=0){
                      version =cellvalue.replace("/<Mismatch_SigInstall>/g","");
                    downloadMessage = 'Install ' + version + ' version on device'
                      message = installSigInstall;
                }

                if(version!=0){
//                     grid.dataObject.isIpsMismatch = true; // commented as per discussion with shrikanta 29/01/2016
                     return '<a class = "Juniper_space_sm_imports_navigateToSigDBWorkspace_SigDB">'+ downloadMessage +'</a><br/>'+message;
                }
                else{
                   
                     return  '<a class="cellLink tooltip" data-cell="'+cellvalue+'" title="'+cellvalue+'">'+cellvalue+'</a>'
                }

               }

               return cellvalue;
            
            };


            this.getValues = function() {
                var api = apiConfig.api;
                if (apiConfig.api === 'import-zip') {
                    api = apiConfig.serviceType + '/rollback';
                }
        return {
        "tableId": "services-ilp",    
        "url": "/api/juniper/sd/policy-management/"+ api+"/managed-services?uuid="+uuid,
        "ajaxOptions": {
            "complete":function(data){
                        var services = data.responseJSON['managed-services'];
                        if(services && services['service-summary'].length == 0){
                            grid.showNoRecordsMsg();
                        }
                        else{
                            grid.dataObject.services = data.responseJSON["managed-services"]["service-summary"];
                        }
                        console.log("Completed grid data fetch" + data);
                        /*grid.progressBar.destroy();
                        grid.wizardView.removeMask();*/
                    },
            headers: {
                "Accept": 'application/vnd.juniper.sd.policy-import-management.managed-services+json;version=1;q=0.01'
            }
        },
        "jsonRoot": "managed-services.service-summary",
        "jsonRecords": function(data) {
            var recordsCount = data['managed-services']['total-records'],services =[];
            return recordsCount;
        },
        "numberOfRows": 50,
        "scroll": "true",
        "multiselect": "true",
        "contextMenu": {
           
        },
      
        "grouping":{
            "columns":[{
                "column":"type",
                "order": "desc",
                "show": false,
                "text": "<b>{0}</b>"
            }],
            "collapse":false
        },
        "columns": [
            {
                "index": "name",
                "name": "name",
                "label": "Name"
            }, 
            {
                "index": "type",
                "name": "type",
                "label": "Type",
                "hidden" : true
            },
            {
                 "index": "service-type",
                 "name": "service-type",
                 "label": "Service Type",
                 "hidden" : true
             }, {
                 "index": "policy-type",
                 "name": "policy-type",
                 "label": "Policy Type",
                 "hidden" : true

            }, {
                "index": "total-lines",
                "name": "total-lines",
                "width": "60px",
                "label": "Rules"
            }, {
                "index": "errors",
                "name": "errors",
                "width": "60px",
                "label": "Errors"
            }, {
                "index": "description",
                "name": "description",
                "label": "Summary",
                //"collapseContent":true
                "formatter" : this.summaryFormatter,
                "width":"300px"
              
            },
            {
                "index": "MOID",
                "name": "MOID",
                "label": "MOID", 
                "hidden":true
            }
        ]

                };
            }
        };


        return Configuration;
    }
);
