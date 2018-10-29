/**
 * Module that implements the ImportWizardView
 *
 * @module ImportWizardView
 * @author Naresh Uppada <nareshu@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define(
    [
        'backbone',
        'widgets/shortWizard/shortWizard',
        'widgets/confirmationDialog/confirmationDialogWidget',
        '../models/managedServicesCollection.js',
        './importConfigServicesGridView.js',
        './importConfigSummaryReportView.js',
        '../../jobs/JobDetailedView.js',
        './importConfigOCRGridView.js',
        './ImportConfigAPIs.js',
        'lib/template_renderer/template_renderer',
        'text!widgets/spinner/templates/loadingBackground.html',
        '../../../../ui-common/js/common/utils/SmProgressBar.js'
    ],

    function(Backbone, ShortWizard, ConfirmationDialogWidget, ManagedServicesCollection, ServicesGrid, ImportConfigSummaryReportView, JobDetailedView, ImportConfigOCRGridView,ImportConfigAPIs, render_template, LoadingBackgroundTemplate, SmProgressBar) {

        var ImportWizard = Backbone.View.extend({

            initialize: function(options) {
                var me = this, pages = [], dataObject = {}, progress = {}, importConfigAPIs,
                servicetypeMapping = {
                    "firewall" : "FWROLLBACK",
                    "ips" : "IPSROLLBACK",
                    "nat" : "NATROLLBACK"
                };
                this.activity = options.activity;
                this.context = options.activity.getContext();
                /**
                 * apiConfiguration will provide the current api Configuration for the api calls 
                 * based on the contextType which is used for rollback and import.
                 */
                this.apiConfiguration = {
                    "IMPORT" :{
                        api:"import",
                        type:"policy-import-management",
                        introText:"<B>Import Device Configuration</B></br></br>IX will give the introductory text.",
                        title:"Import Configuration",
                        titleHelp: {
                            "content": this.context.getMessage("import_config_title_help"),
                            "ua-help-text":this.context.getMessage("more_link"),
                            "ua-help-identifier": this.context.getHelpKey("SECURITY_DIRECTOR_DEVICE_IMPORTING")
                        }
                    },
                    "IMPORT_ZIP" :{
                        api:"import-zip",
                        type:options.serviceType === 'firewall'? 'fw' : options.serviceType,
                        serviceType:options.serviceType,
                        fileName: options.fileName,
                        introText:"<B>Import Device Configuration</B></br></br>IX will give the introductory text.",
                        title:"Import Configuration",
                        titleHelp: {
                            "content": this.context.getMessage("import_config_title_help"),
                            "ua-help-text":this.context.getMessage("more_link"),
                            "ua-help-identifier": this.context.getHelpKey("SECURITY_DIRECTOR_DEVICE_IMPORTING")
                        }
                    },
                    "IMPORT_DEVICE_CHANGE" :{
                        api:"import",
                        type:"policy-import-management",
                        introText:"<B>Import Device Configuration</B></br></br>IX will give the introductory text.",
                        title:"Import Device Change",
                        titleHelp: {
                            "content": this.context.getMessage("import_config_device_change_title_help"),
                            "ua-help-text":this.context.getMessage("more_link"),
                            "ua-help-identifier": this.context.getHelpKey("SECURITY_DIRECTOR_DEVICE_CHANGE_IMPORTING")
                        }
                    },
                    "FWROLLBACK":{
                        api:"firewall/rollback",
                        type:"fw-rollback-management",
                        introText:"<B>FW Rollback</B></br></br>IX will give the introductory text.",
                        title:"Firewall Policy Rollback",
                        titleHelp: {
                         "content": this.context.getMessage("import_firewall_rollback_title_help"),
                         "ua-help-text":this.context.getMessage("more_link"),
                         "ua-help-identifier": this.context.getHelpKey("POLICY_MANAGE_ROLLBACK_VERSIONING")
                        }
                    },
                    "NATROLLBACK" :{
                        api:"nat/rollback",
                        type:"nat-rollback-management",
                        introText:"<B>NAT Rollback</B></br></br>IX will give the introductory text.",
                        title:"NAT Policy Rollback",
                        titleHelp: {
                         "content": this.context.getMessage("import_nat_rollback_title_help"),
                         "ua-help-text":this.context.getMessage("more_link"),
                         "ua-help-identifier": this.context.getHelpKey("POLICY_MANAGE_ROLLBACK_VERSIONING")
                        }
                    },
                    "IPSROLLBACK" :{
                        api:"ips/rollback",
                        type:"ips-rollback-management",
                        introText:"<B>IPS Rollback</B></br></br>IX will give the introductory text.",
                        title:"IPS Policy Rollback",
                        titleHelp: {
                         "content": this.context.getMessage("import_ips_rollback_title_help"),
                         "ua-help-text":this.context.getMessage("more_link"),
                         "ua-help-identifier": this.context.getHelpKey("POLICY_MANAGE_ROLLBACK_VERSIONING")
                        }
                    }

                };

                this.uuid = this.getUUId();
                dataObject.selectedRecord = options.selectedRecord;
                this.dataObject = dataObject;
                this.dataObject.isInitiated = false;
                this.progress = progress;
                this.options = options;
                //Import or Rollback(FW, NAT, IPS)
                if(options.type == "rollback"){
                    this.contextType = servicetypeMapping[options.service];
                    this.fileName = options.fileName;
                }
                else{
                this.contextType = options.type;
                }
                //place holder for all current api Config.
                this.apiConfig = this.apiConfiguration[this.contextType];
                if(options.type == "rollback"){
                    if(this.fileName){
                       this.apiConfig["title"] = "Import Policy";
                    }
                }              
                importConfigAPIs = new ImportConfigAPIs(this);
                //DataObject carries values between screens. It is like a cache between screens.
                dataObject.uuid = this.uuid;
                dataObject.managedServicesCache = {
                    "model": new ManagedServicesCollection({"uuid":this.uuid})
                };

                dataObject.ocrCache = {};

                pages.push({
                    title: "Managed Services",
                    view: new ServicesGrid({
                        "context": this.context,
                        "dataObject": dataObject,
                        "wizardView" : me,
                        "activity" : this.activity,
                        "apis" : importConfigAPIs
                    })
                });

                pages.push({
                    title: "Conflict Resolution",
                    view: new ImportConfigOCRGridView({
                        "context": this.context,
                        "dataObject": dataObject,
                        "activity" : this.activity,
                        "wizardView" : me,
                        "apis" : importConfigAPIs

                    })
                });

                /**
                 * Create ShortWizard for Import Or Rollback.
                 */

                this.wizard = new ShortWizard({
                    container: this.el,
                    title: this.apiConfig.title,
                    titleHelp: this.apiConfig.titleHelp,
                    pages: pages,
                    save:  _.bind(me.onWizardSave, me),
                    onCancel: _.bind(me.onWizardClose, me),
                    onDone: _.bind(me.onWizardDone, me)
                });

                this.pages= pages;

                return this;
            },

            onWizardClose:  function() {
                var me = this;
                me.activity.setResult(Slipstream.SDK.BaseActivity.RESULT_CANCELLED);
                me.activity.finish();
                me.activity.overlay.destroy();
            },

            onWizardSave: function(options) {
                var me = this;
                me.triggerImport();
            },

            onWizardDone: function() {
                var me = this;
                me.activity.setResult(Slipstream.SDK.BaseActivity.RESULT_CANCELLED);
                me.activity.finish();
                me.activity.overlay.destroy();
            },


             close: function(){
                console.log('Import main wizard view close');
                //each page close
                for(var i in this.pages){
                    this.pages[i].view.close();
                }
                
            },

            render: function() {
                //Params passed on for current import of rollback.
                
                this.dataObject.lastScreen=0;
                

                return this;
            },

            init:function(){
                var params = {};
                params["id"] = this.dataObject.selectedRecord.id;
                // params["id"] = this.dataObject.selectedRecord['@key'];
                params["type"] = this.contextType;
                if(this.options.type==="rollback"){
                       params["service-id"] = this.dataObject.selectedRecord["service-id"];
                      
                }
                this.dataObject.params = params;
             
                this.initiateImport(params);
            },

            /**
             *  generate Unique Id for each Import Configuration action.
             *  returns unique identifier String
             */
            getUUId: function () {

                var d = new Date().getTime();
                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = (d + Math.random()*16)%16 | 0;
                    d = Math.floor(d/16);
                    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
                });
                return uuid;
            },

            /**
             * Initiate Import (This call to backend gets sets ready back end to proceed with import.)
             */
            initiateImport: function(params) {
                var self = this, data = { }, url, contentType;
                url = '/api/juniper/sd/policy-management/'+this.apiConfig.api+'/initiate-import?uuid='+this.uuid;
                contentType = 'application/vnd.juniper.sd.'+this.apiConfig.type+'.device-import-context+json;version=1;charset=UTF-8';

                if(params.type&&params.type==="IMPORT"){
                    data = {
                    "device-import-context": {
                        "id": params.id,
                        "import-oob-changes": false
                    }
                };
                }
                else if(params.type&&params.type==="IMPORT_DEVICE_CHANGE"){
                    data = {
                    "device-import-context": {
                        "id": params.id,
                        "import-oob-changes": true
                    }
                };
                }
                else if(params.type&&params.type==="IMPORT_ZIP"){
                    url = '/api/juniper/sd/policy-management/' + this.apiConfig.serviceType + '/' +this.apiConfig.api
                        +'/initiate-import?file-name=' + this.apiConfig.fileName + '&uuid='+this.uuid;
                    contentType = 'application/vnd.juniper.sd.' + this.apiConfig.type +
                        '-import-zip-management.device-import-context+json;version=1;charset=UTF-8'
                }
                else {
                    data={
                        "rollback-context":{
                            "service-id":params["service-id"],
                            "version-id":params.id,
                            "file-name": this.fileName                           
                        }

                    };
                }

                self.dataObject.isInitiated = false;
                $.ajax({
                    "url": url,
                    "type": 'post',
                    "contentType": contentType,
                    "data": JSON.stringify(data),
                    "processData": false,
                    "beforeSend": function() {
                        console.log("call init");   
                        self.progressBar =  new SmProgressBar({
                         "container": self.getOverlayContainer(),
                         "hasPercentRate": false,
                         "isSpinner" : true,
                         "statusText": "Initiate"
                     });
                   
                        self.progressBar.build();
                        self.showMask(self.progressBar);
                     },
                    "success": function( data, textStatus, jQxhr ) {
                        console.log("Initiate Import - Success");
                        self.progressBar.destroy();
                        self.removeMask();
                        self.wizard.build();

                      

                    },
                    "error": function( jqXhr, textStatus, errorThrown ) {
                        console.log( errorThrown );
                        self.progressBar.destroy();
                        self.removeMask();
                        self.wizard.destroy();
                        self.onWizardClose();
                        var confirmationDialogWidget, conf;
                        conf = {
                            title: "Error",
                            question: jqXhr.responseText,
                            yesButtonLabel: self.context.getMessage('ok'),
                            yesButtonTrigger: 'yesEventTriggered',
                            kind: 'error'
                        };

                        confirmationDialogWidget = new ConfirmationDialogWidget(conf);

                        // On confirm trigger handler
                        confirmationDialogWidget.vent.on('yesEventTriggered', function () {
                            // destroy the dialog
                            confirmationDialogWidget.destroy();
                        });
                        self.confirmationDialogWidget = confirmationDialogWidget;

                        // creates the dialog
                        confirmationDialogWidget.build();
                    }
                });
            },

            /** 
             * Utility method to remove Mask for wizard
             */

            removeMask: function(){
                this.activity.overlay.getOverlayContainer().find(".slipstream-indicator-background").remove();
            },
            /**
             * Utility method to mask the wizard. This will obstruct the user from doing any operation durning this time.
             */
            showMask : function(progressBar){
                this.activity.overlay.getOverlayContainer().append(progressBar).append('<div class="slipstream-indicator-background"></div>');

            },

            getOverlayContainer : function (){
            var overlayContainer;
            if ($('#overlay_content .overlay-wrapper').length > 0) {
                overlayContainer = $('#overlay_content .overlay-wrapper');
            } else {
                throw new Error("The overlay widget has to be built first");
            }
            return overlayContainer;
            },


            /**
            @private
            This api will trigger the import job.
            On success of this api, the import job would be triggered and
            on success imports all the managed services from a device

            @return void
            */
            triggerImport: function() {
                var me = this, url;

                url = '/api/juniper/sd/policy-management/'+me.apiConfig.api+'/trigger-import?uuid='+me.uuid;
                if (me.apiConfig.api === 'import-zip') {
                    url = '/api/juniper/sd/policy-management/'+me.apiConfig.serviceType + '/' +
                        me.apiConfig.api+'/trigger-import?uuid='+me.uuid;
                }

                $.ajax({
                    "url": url,
                    "type": 'post',
                    headers:{
                        'accept': 'application/vnd.juniper.sd.policy-import-management.monitorable-task-instances+json;version=1;q=0.01',
                        'content-type': "application/vnd.juniper.sd.policy-import-management+json;version=1;charset=UTF-8"

                    },
                    "processData": false,
                    "success": function( data, textStatus, jQxhr ) {

                        console.log("Trigger Import - Success");
                        var jsonJobObj = data['monitorable-task-instance-managed-object'];
                        setTimeout(me.showJobDetails.bind(me),10000,jsonJobObj);
                    },
                    "error": function( jqXhr, textStatus, errorThrown ) {
                        console.log( errorThrown );
                    }
                });
            },

            showJobDetails:function(jsonJobObj){
                var me = this;

                // if from rolback view then destroy the manage rolback overlay.
                if(me.activity.intent.action === "sd.intent.action.ACTION_ROLLBACK"){
                    me.activity.overlay.destroy();
                }
                /*
                 * launches the Job Details overlay
                 */
                me.activity.overlay.destroy();
                var jobView = new JobDetailedView();
                jobView.showImportJobWindow({ 
                  job : jsonJobObj,
                  activity : me.activity
                });
//                Backbone.JobDetailedView.showJobWindow({
//                        job: jsonJobObj,
//                        activity: me.activity
//                    }
//                );
            }

        });

        return ImportWizard;
});
