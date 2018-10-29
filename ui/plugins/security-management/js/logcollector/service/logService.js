/**
* Log Service handles interaction with data APIs.
*
* @module Log Collector
* @author Orpheus Brahmos <orpheus-brahmos-team@juniper.net>, <aslama@juniper.net>
* @copyright Juniper Networks, Inc. 2015
**/

define([
    '../models/addLogNodeModel.js'
], function( LogModel) {

	var LogService = function() {
		   var me = this;
       me.model = new LogModel();
       

       me.addNode = function(data, onSuccess, onError) {
          $.ajax({
            url: me.model.urlRoot,
            type: 'POST',
            data: JSON.stringify(data),
            beforeSend: function(xhr) {
              xhr.setRequestHeader("Accept", me.model.requestHeaders.accept);
              xhr.setRequestHeader("Content-Type", me.model.requestHeaders.contentType);
            },
            success: function(response) {
              onSuccess(response);
              },
            error: function(jqXhr, textStatus, errorThrown) {
                onError(jqXhr, textStatus, errorThrown);
              }
          });
        };

		   me.changePassword = function(passWord, onSuccess, onError) {
    			$.ajax({
    				url: '/api/juniper/ecm/log-collector-nodes/change-password'+'?password='+passWord,
    				type: 'PUT',
    				beforeSend: function(xhr) {
    					xhr.setRequestHeader("Accept", "application/json");
    					xhr.setRequestHeader("Content-Type", "application/json");
    				},
    				success: function(response, status) {
    					onSuccess(response);
    			    },
    			    error: function(response) {
    			    	onError(response);
    			    }
    			});
    		};

		    me.logStats = function(onSuccess){

			     $.ajax({ 
                "url": '/api/juniper/ecm/eps-monitor/eps/overall/90',
                "type": 'get',
                "dataType" : 'json',
                headers: {
                         'accept': 'application/vnd.juniper.ecm.eps-monitor.eps.overall+json;version=1;q=0.01'
                },
          
                success: function(response, status) { 
                      onSuccess(response); 
                },
                "error": function(jqXhr, textStatus, errorThrown ) {
                       console.log(textStatus);
                }
                });


		    };

		    me.getNodeType = function(nodeIp , onSuccess, onError){

			     $.ajax({ 
                "url": "/api/juniper/ecm/log-collector-nodes/system-info?ip-address=" +nodeIp,
                "type": 'get',
                "dataType": 'json',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Accept", "application/json");
                    xhr.setRequestHeader("Content-Type", "application/json");
                },
                success: function(response, status) { 
                      onSuccess(response); 
                },
                "error": function(jqXhr, textStatus, errorThrown ) {
                      onError(jqXhr);
                }
                });


		    };
        
        me.deleteNode = function(data, onDeleteSuccess){

            $.ajax({
                "url": '/api/space/fabric-management/delete-fabric-node',
                "type": 'post',
                'contentType': 'application/vnd.api.space.fabric-management.fabric-node.delete-fabric-node-request+json;version=2;charset=UTF-8',
                headers:{                    
                 'accept' : 'application/vnd.net.juniper.space.job-management.task+json;version=1;q=0.01',
                },
                
                "processData": false,
                "data": JSON.stringify(data),
                "success": function(response) {
                  onDeleteSuccess(response); 
                 },    
                "error": function(jqXhr, textStatus, errorThrown) {
                  console.log(errorThrown);
                }
            });

        };

        me.deleteNodeJSA = function(data){

            $.ajax({
                "url": '/api/juniper/ecm/log-collector-nodes/jsas/delete',
                "type": 'post',
                'contentType': 'application/vnd.juniper.ecm.jsa-management.delete-jsa-nodes-request+json;version=2;charset=UTF-8',
                headers:{                    
                 'accept' : 'application/vnd.juniper.ecm.jsa-management.delete-jsa-nodes-request+json;version=2;charset=UTF-8',
                },                
                "processData": false,
                "data": JSON.stringify(data),
                "success": function(response) {
                  console.log(response); 
                 },    
                "error": function(jqXhr, textStatus, errorThrown) {
                  console.log(errorThrown);
                }
            });

        };

         me.getTotalNodes = function(onSuccess){

            $.ajax({
                "url": '/api/space/fabric-management/fabric-nodes/',
                "type": 'GET',
                "dataType": 'json',
                'contentType': 'application/vnd.api.space.fabric-management.fabric-nodes+json;q=0.02;version=2',
                 headers:{                    
                 'accept' : 'application/vnd.api.space.fabric-management.fabric-nodes+json;version=2;q=0.01',
                 },                                
                "success": function(response) {
                  onSuccess(response); 
                 },    
                "error": function(jqXhr, textStatus, errorThrown) {
                  console.log(errorThrown);
                }
            });

        };

        me.spaceJob = function(jobId , onSuccess, onError){

            $.ajax({
                "url": '/api/space/job-management/jobs/'+jobId,
                "type": 'GET',
                "dataType": 'json',
                 headers:{                    
                 'accept' : 'application/vnd.net.juniper.space.job-management.job+json;version=3;q=0.03',
                 },                                
                "success": function(response) {
                  onSuccess(response); 
                 },    
                "error": function(jqXhr, textStatus, errorThrown) {
                  onError(jqXhr, textStatus, errorThrown);
                }
            });

        };

        me.syslogForward  = function(type, data, onSuccess, onError){

           $.ajax({
            "url": '/api/juniper/ecm/log-collector-nodes/syslog-forwarding/',
            "type": type,
            'contentType': 'application/json',                   
            "processData": false,
            "data": JSON.stringify(data),
            "success": function(response) {
                  onSuccess(response); 
             },     
            "error": function(jqXhr, textStatus, errorThrown) {
                  onError(jqXhr, textStatus, errorThrown);
            }
            });

        };

        me.sysLogDetails = function(ipAddress, onSuccess, onError){

           $.ajax({
                "url": '/api/juniper/ecm/log-collector-nodes/'+ipAddress,
                "type": 'GET',
                "dataType": 'json',                             
                "success": function(response) {
                  onSuccess(response); 
                 },    
                "error": function(jqXhr, textStatus, errorThrown) {
                  onError(jqXhr, textStatus, errorThrown);
                }
            });

        };


      



	}

	return LogService;
});