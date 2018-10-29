/**
 * @copyright Juniper Networks, Inc. 2015
 */
define( [
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/exportPolicyViewConf.js',
    '../../../../../sd-common/js/common/widgets/exportProgressBarForm.js',
    'widgets/overlay/overlayWidget',
    '../../../../../ui-common/js/common/utils/SmNotificationUtil.js',
    '../../../../../ui-common/js/common/widgets/progressBarForm.js'
],
function( Backbone,
        Syphon,
        FormWidget,
        ExportPolicyViewConf,exportProgressBarForm,OverlayWidget,SmNotificationUtil,ProgressBarForm) {
    	
    	var exportPolicyView = Backbone.View.extend( {

        events: {
            "click #exportPolicy": 'exportPolicy',
            "click #cancelExportPolicy": "closeExportView"
        },
        
        initialize: function( options ) {	            
             this.activity = this.options.activity;
             this.params = this.options.params;
             this.context = this.activity.context;
             this.policyManagementConstants=this.params.policyManagementConstants;
        },
        
        render: function( ) {
        	var me = this, form, formElements;
            formElements = me.getFormElements();

            me.addDynamicFormConfig(formElements);
            form = new FormWidget( {
                "elements": formElements,
                "container": this.$el
            } ).build( );
            return this;
        },

            /**
             * Returns form elements
             * @returns {*}
             */
        getFormElements: function() {
            var me = this;
            var formConfiguration = new ExportPolicyViewConf( this.context );
            return formConfiguration.getExportPolicyFormElements();
        },

        addDynamicFormConfig: function(formConfiguration) {
             var dynamicProperties = {};
             switch (this.params.fileType) {
                 case "HTML_FORMAT":
                     dynamicProperties.title = this.context.getMessage('export_policy_to_html');
                     dynamicProperties.tooltip = this.context.getMessage('export_policy_to_html');
                     break;

                 case "PDF_FORMAT":
                     dynamicProperties.title = this.context.getMessage('export_policy_to_pdf');
                     dynamicProperties.tooltip = this.context.getMessage('export_policy_to_pdf');                 
                     break;

                 case "ZIP_FORMAT":
                     dynamicProperties["title-help"] = { "content": this.context.getMessage('policy_export_zip_tooltip'),
                                                         "ua-help-text": this.context.getMessage("more_link"),
                                                         "ua-help-identifier": this.context.getHelpKey("POLICY_EXPORTING")
                                                        };
                     dynamicProperties.title = this.context.getMessage('export_policy_zip_title');
                     dynamicProperties.tooltip = this.context.getMessage('export_policy_to_zip');                 
                     break;
             }
             _.extend(formConfiguration, dynamicProperties);
         },

        exportPolicy: function( event ) {
            var url = "", self = this;   
            if(this.params.fileType == "ZIP_FORMAT"){
                self.exportPolicyJson();
                return ;
            }
            event && event.preventDefault();
            var idArray = [];
            for(var i = 0; i <  this.params.selectedPolicies.length; i++){
                  idArray.push( this.params.selectedPolicies[i].id);
            }
             
            var postReqData = self.getPostData(idArray);
	         $.ajax( {
	               url: self.policyManagementConstants.EXPORT_POLICY_URL,
	               type: "post",
	               dataType: "json",
	               headers: {
	               	'content-type': self.policyManagementConstants.EXPORT_POLICY_CONTENT_HEADER,
		             'accept': self.policyManagementConstants.EXPORT_POLICY_ACCEPT_HEADER
	                },
	                data: JSON.stringify(postReqData),
	         
	                success: function(data, status) {
	                	var jobID = data["task"]["id"];
	                	self.closeExportView(event);
	                	self.showProgressBar(jobID);
                        console.log("Export Policy Job "+ jobID +"successfully triggered.");
                     },
                    error: function() {
                         console.log("Export policy failed");
                         self.closeExportView(event);
                     }
	           } );
        },

            /**
             * Sets data to be sent as post to teh request
             * @param idArray
             * @returns {{export-policy-request: {policy-ids: {policy-id: *}, export-format: (exportPolicyView.params.fileType|*)}}}
             */
        getPostData: function(idArray) {
            return  {
                "export-policy-request":{
                    "policy-ids": {
                        "policy-id":idArray
                    },
                    "export-format":this.params.fileType
                }
            };
        },

        exportPolicyJson: function() {
            var self = this;
             self.progressBar = new ProgressBarForm({
             statusText: self.context.getMessage("export_policy_zip"),
             title: self.context.getMessage("export_policy_zip_title"),
             hasPercentRate: true
             });

             self.progressBarOverlay = new OverlayWidget({
             view: self.progressBar,
             type: 'small',
             showScrollbar: false
             });
             self.progressBarOverlay.build();
             self.createZippedData();
        },

        createZippedData: function(){
          var self = this;
          self.subscribeNotifications();
          var dataObj;
            dataObj = {
                "create-snapshot-request": {
                    "comments": "Export Snapshot",
                    "browser-id": "",
                    "screen-id": self.screenId,
                    "total-services": "5",
                    "tag-comments": "No-Comments",
                    "job-instance-id": "",
                    "task-percentage-completed": "100",
                    "total-services-completed": "5",
                    "delete-oldest": true
                }
            };

          $.ajax({
                url: self.policyManagementConstants.getManageVersionURLRoot(self.params.selectedPolicies[0]["id"]),
                headers: {
                    Accept: self.policyManagementConstants.SNAPSHOT_CREATE_ACCEPT_HEADER
                },
                type: "POST",
                data: JSON.stringify(dataObj),
                contentType: self.policyManagementConstants.POLICY_CREATE_SNAPSHOT_CONTENT_HEADER,
                success: function(data, textStatus) {
                /*check notificatiosn and download policy*/
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                /*id snapshot is already presend download policy*/
                  self.downloadPolicy();
                }
            });

        },

        subscribeNotifications : function(){
        var self = this;
            this.smNotificationUtil = new SmNotificationUtil();
            self.screenId = Math.floor(Math.random() * 1000);
            uri = ['/api/juniper/sd/task-progress/'+"$"+self.screenId];
            $.proxy(this.smNotificationUtil.subscribeNotifications,self)(uri, self.getProgressUpdate);
        },

        downloadPolicy : function(){
        var self = this; 
            $.ajax({
              url: self.policyManagementConstants.DOWNLOAD_VERSION_DOC_URL+ this.params.selectedPolicies[0]["id"],
              type: 'GET',
              headers: {
                    'Accept': self.policyManagementConstants.DOWNLOAD_VERSION_DOC_ACCEPT,
                    },
              complete: function(response, status) {
              var fileName =  response.responseJSON['snapshot-version-document-response']['value'];
              self.progressBarOverlay.destroy();
              if(fileName != undefined){
              self.progressBarOverlay.destroy();
              self.getPolicy(fileName);
              self.activity.overlay.destroy();
              }
              },
              error: function() {
             }
            });
        },

        getPolicy : function(fileName){
             var self = this;
             filePath = self.policyManagementConstants.DOWNLOAD_VERSION_DOC_PATH+ fileName;
             location.href = filePath;
        },

        getProgressUpdate : function() {
            var self = this;
            onProgressUpdateSucsess = function(data, status){
                var progress = 0;
                    if(data['task-progress-response']) {
                       progress = data['task-progress-response']['percentage-complete']/100;
                       self.progressBar._progressBar.setStatusText(data['task-progress-response']['current-step']);
                       self.progressBar._progressBar.setProgressBar(progress);  
                        if(progress >= 1 )
                        {   self.progressBar._progressBar.setStatusText('Complete');;
                            self.downloadPolicy();
                        }
                    }
            };
            onProgressUpdateError = function(){
                console.log("Id retrieval failed");
            };
            this.smNotificationUtil.getTaskProgressUpdate(("$"+ self.screenId), onProgressUpdateSucsess, onProgressUpdateError )
        },

        closeExportView: function(event) {
           event.preventDefault();
           this.activity.overlay.destroy();
        },

        showProgressBar: function(jobID) {
           var textOptions = this.getProgressText();
           this.progressBar = new exportProgressBarForm({
            "statusText": this.context.getMessage("export_job_started", [jobID]),
            "title": textOptions.title,
            "fileType": textOptions.fileType,
            "hasPercentRate": true,
             "parentView": this,
            "jobID": jobID
              });

           this.progressBarOverlay = new OverlayWidget({
              view: this.progressBar,
              type: 'medium',
              height: '700px',
              showScrollbar: false
          });
            this.progressBarOverlay.build();
       },

        getProgressText: function() {
            return  {
                "title": this.context.getMessage("export_policy_job_window_title"),
                "fileType": this.context.getMessage("export_policy_file")
       }
        }

	});
	return exportPolicyView;
});
