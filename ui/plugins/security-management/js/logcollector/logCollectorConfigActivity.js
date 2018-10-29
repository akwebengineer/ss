/**
 * A module that works with Log Collector Configuration
 *
 * @module LogCollectorConfigActivity
 * 
 **/
define([
    'backbone',
    '../../../ui-common/js/gridActivity.js',
    './conf/manageLoggingNodesGridConfig.js',
    './conf/manageLoggingNodesIntegratedGridConfig.js',
    './views/addLoggingNodeView.js',
    './../jobs/JobDetailedView.js',
    './views/generalSettingView.js',
    'widgets/overlay/overlayWidget',
    './views/changePasswordView.js',
    './utils/logConstants.js',
    './service/logService.js',
    '../../../ui-common/js/common/utils/SmUtil.js',
    './models/addLogNodeModel.js'
], function(Backbone, 
            GridActivity, 
            ManageLoggingNodesGridConfig,
            ManageLoggingNodesIntegratedGridConfig, 
            LoggingNodeWzardView, 
            JobDetailedView,
            GeneralSettingView,
            OverlayWidget,
            ChangePasswordView,
            LogConstants,
            LogService,
            SmUtil,
            Model) {
    /**
     * Constructs a LogCollectorConfigActivity.
     */

    var LogCollectorConfigActivity = function() {

             this.capabilities = {
            "create": {
                view: LoggingNodeWzardView,
                rbacCapabilities: ["AddNode"]
            },
            "delete": {
                rbacCapabilities: ["DeleteNode"]
            },
            "select": {}
            }; 

            this.getJSA = function(){  
                    
                    var disableCreateForJSA =function(data){
                        var i=0,arr=data['log-collector-nodes']['log-collector-node'];
                        for(var i=0; i<arr.length;i++){
                            if(arr[i]['node-type']=== 'JSA_CONSOLE'){
                                $('.create').addClass('disabled');
                            //return true
                            }
                        }
                    }; 
                             
                   $.ajax({
                    url: '/api/juniper/ecm/log-collector-nodes/nodes/',
                    type: 'get',                    
                    headers:{
                        'accept': 'application/vnd.juniper.ecm.log-collector-nodes+json;version=2;q=0.02'
                    },                                      
                    "success": function( data, textStatus, jQxhr ) {
                        console.log("Success");  
                        if (data['log-collector-nodes']['total']>0){                                                      
                                disableCreateForJSA(data); 
                        }                                            
                       
                    },
                    "error": function( jqXhr, textStatus, errorThrown ) {
                        console.log( errorThrown );
                    }
                }); 
                              
            };           

            //check for deployment type Integrated PR 1193562            
            this.deploymentTypes = function (){           
                var deploymentType;
                $.ajax({
                    "url": '/api/juniper/ecm/log-collector-nodes/deploymentType',
                    "type": 'GET',
                    "dataType": 'json',                                              
                    "success": function(response) {                  
                      deploymentType = response['response']['data']['deploymentType'];
                    },  
                    "error": function() {
                      console.log("error");
                    },
                    async: false
                });
                
              return deploymentType;
            };
            
            if(this.deploymentTypes() === "integrated"){                    
                this.gridConf = ManageLoggingNodesIntegratedGridConfig ;
             }else{
               this.gridConf = ManageLoggingNodesGridConfig; 
             } 
            //this.gridConf = ManageLoggingNodesGridConfig;
            
            this.model = Model;
            this.bindEvents = function() {
            GridActivity.prototype.bindEvents.call(this);

            this.events.syslogforwarding = "generalSettingsOverlay";
            this.events.changepassword = "changePassword";

            this.view.$el.bind(this.events.changepassword, $.proxy(this.changePassword, this));
            this.view.$el.bind(this.events.syslogforwarding, $.proxy(this.generalSettingsOverlay, this));
            this.getJSA();                   
            
        };       


       this.changePassword = function(event){
            if(new SmUtil().checkPermission(LogConstants.Rules.NODE_SETTING_PERMISSION)){
                var self = this,
                    selectedRow = self.view.gridWidget.getSelectedRows();
                if(selectedRow.length === 0){
                    var View = new ChangePasswordView({activity: self});
                    self.overlay = new OverlayWidget({
                        view: View,
                        type: "small",
                        showScrollbar: false
                    });
                    self.overlay.build();
                };//if(selectedRow === 0){
            };//if(new SmUtil().checkPermission(LogConstants.Rules.NODE_SETTING_PERMISSION))
        };

       this.generalSettingsOverlay = function(){
            if(new SmUtil().checkPermission(LogConstants.Rules.NODE_SETTING_PERMISSION)){
            var self = this , selectedRow = {};
            selectedRow = this.view.gridWidget.getSelectedRows();
            if(selectedRow.length === 1 && (selectedRow[0]["node-type"] === LogConstants.LogTypesDisplay.LOG_RECEIVER
               || selectedRow[0]["node-type"] === LogConstants.LogTypesDisplay.COMBINED_NODE)) {
            var View = new GeneralSettingView({activity: this});
            self.overlay = new OverlayWidget({
                view: View,
                type: "small",
                showScrollbar: false
            });
            self.overlay.build(); 
            }
            }
        };


       /*this.onDelete = function (idArr, onDeleteSuccess, onDeleteError){

            var self = this, service = new LogService();
            var data = {"delete-fabric-node-request": {
                         "fabric-node": {"id": self.context.module.getSelectedRows()[0]["id"],"name": self.context.module.getSelectedRows()[0]["name"],"_href": "string"
                       },"_uri": "string"
            }
            };

            onDeleteSuccess = function(response){
            jobId = response.task.id;
            onSuccess = function(response){

                self.showJobDetails(response);
            };
            onError = function (jqXhr, textStatus, errorThrown ){
                console.log(errorThrown);
            };
                service.spaceJob(jobId, onSuccess, onError)            
            };

            service.deleteNode(data, onDeleteSuccess);  
        };*/

        this.onDelete = function (idArr, onDeleteSuccess, onDeleteError){
            var self = this, service = new LogService();
            if(self.context.module.getSelectedRows()[0]['node-type']=== 'JSA_CONSOLE'){
                var data = {"delete-jsa-nodes-request": {
                                      "jsa-id-list": {
                                         "jsa-ids": self.context.module.getSelectedRows()[0]["id"]
                                      }
                                   }
                                };
                service.deleteNodeJSA(data);

            }
            else{
                var data = {"delete-fabric-node-request": {
                         "fabric-node": {"id": self.context.module.getSelectedRows()[0]["space-node-id"],"name": self.context.module.getSelectedRows()[0]["node-name"],"_href": "string"
                       },"_uri": "string"
                }
                };

                onDeleteSuccess = function(response){
                jobId = response.task.id;
                onSuccess = function(response){

                    self.showJobDetails(response);
                };
                onError = function (jqXhr, textStatus, errorThrown ){
                    console.log(errorThrown);
                };
                    service.spaceJob(jobId, onSuccess, onError)            
                };

                service.deleteNode(data, onDeleteSuccess); 

            }            

        };


        this.showJobDetails= function(jobId){

             var detailedViewActionIntent = new Slipstream.SDK.Intent( "Space.Intent.action.DETAILED_JOB_VIEW",
                        {
                          "mime_type": "vnd.net.juniper.space.job-management.jobs.job"
                        } );

                    detailedViewActionIntent.putExtras( {
                      data:
                        {
                        job: jobId.job
                        }
                    } );

             Slipstream.vent.trigger( "activity:start", detailedViewActionIntent );

          };
    };


    LogCollectorConfigActivity.prototype = new GridActivity();

    return LogCollectorConfigActivity;
});