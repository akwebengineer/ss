define([
    'backbone',
    'widgets/shortWizard/shortWizard',
    './addLoggingNodeAddView.js',
    './certificateDetailsView.js',
    './addNodeSlectDeploymentView.js',
    '../models/addLogNodeModel.js',
    'widgets/overlay/overlayWidget',
    './jobDetailsView.js',
    '../service/logService.js'
    ], function(
           Backbone,
           ShortWizard,
           AddLoggingNodeAddView,
           CertificateDetailsView,
           AddNodeSlectDeploymentView,
           addLogNodeModel,
           OverlayWidget,
           JobDetailedView,
           LogService
           ){
   
    var AddLoggingNodeView = Backbone.View.extend({

         
        'model': new addLogNodeModel(),

        initialize: function (options) {
                var me = this,pages = new Array();
                me.jobIds = [];
                me.ipAddress = [];
                me.errorMessage = "";
                this.activity = options.activity;
                this.context = me.activity.context;          
                this.model.clear();               

            pages.push({
                title: "Select Deployment",
                view: new AddNodeSlectDeploymentView({
                    "context": this.context,
                     "page": 0,
                     "wizardView" : me,
                      model: this.model,
                     "activity" : this.activity
                }),
            });
            
            pages.push({
                title: "Add Collector Node",
                view: new AddLoggingNodeAddView({
                    "context": this.context,
                    "activity": this.activity,
                    "page": 1,
                    "wizardView" : me,
                     model: this.model
                })
            });

           
            pages.push({
                title: "Certificate Details",
                view: new CertificateDetailsView({
                    "context": this.context,
                    "activity": this.activity,
                    "page": 2,
                    "wizardView" : me,
                     model: this.model
                })
            });


            this.wizard = new ShortWizard({
                showSummary : true,
                container: this.el,
                title: this.context.getMessage('add_logging_node'),
                titleHelp: {
                    "content": this.context.getMessage("add_logging_node_title_help"),
                    "ua-help-text":this.context.getMessage("more_link"),
                    "ua-help-identifier": this.context.getHelpKey("LOG_MGMT_NODE_ADDING")
                },
                pages: pages,
                type: "xlarge",
                model: this.model,
                
                save:  function(options) {
                	var totalNodes = this.model.get("total-nodes");
                    me.totalNodes = totalNodes;
                    me.saveModel(options, this.model, totalNodes);
                },
                onCancel: _.bind(function() {
                    this.activity.overlay.destroy();
                }, this),
                onDone: _.bind(function() {
                    this.activity.overlay.destroy();
                }, this),

            });

            return this;
            },          


             saveModel :function(options, model , totalNodes) { 
                var me = this;
                me.totalAjaxCalls = 0 ;

                for(var nodes=0; nodes <totalNodes; nodes++){
                var node_name = me.model.attributes[nodes].nodes.node_name,
                    node_ip = me.model.attributes[nodes].nodes.node_ip,
                    node_password = me.model.attributes[nodes].nodes.node_password,
                    node_username = me.model.attributes[nodes].nodes.node_username;
                me.ipAddress.push(node_ip);
                me.addModel(node_ip, node_name, node_password, node_username);
                };                             
            },

             addModel : function(node_ip, node_name, node_password, node_username ){
                var me = this,jsa;
                 if(me.model.get("deployment-Mode") === 0){
                    me.activity.getJSA();                                      
                    me.activity.overlay.destroy();
                 }
                 else{
                     me.ajaxCall( node_ip, node_name, node_password,node_username);
                 }  

             },

             ajaxCall:  function( node_ip, node_name, node_password, node_username){
                var me = this, service = new LogService();
                    data = {"add-special-fabric-node-request": { "ip": node_ip ,"name": node_name,"user-name": node_username,"password": node_password,"_uri": "string"}
                    };

                addNodeSuccess = function( data ) {
                ++me.totalAjaxCalls;   
                me.jobIds.push(data.task.id);
                me.invokeJobDetials(me);
                };

                addNodeError=  function( jqXhr, textStatus, errorThrown ) {
                   ++me.totalAjaxCalls; 
                    me.errorMessage = me.errorMessage + (node_name +": "+jqXhr.responseText+"</br>");
                    console.log(errorThrown);
                    me.invokeJobDetials(me);
                };
                service.addNode(data, addNodeSuccess, addNodeError );
             },

             invokeJobDetials : function (me){

              if(me.totalNodes == me.totalAjaxCalls){
                me.activity.overlay.destroy()
                  me.showJobDetails(me.jobIds);

                }

             },


             showJobDetails : function(jsonJobObj){
                
                var self = this;
                if(self.jobIds.length > 0){
                var View = new JobDetailedView({activity: this.activity, JobIds : self.jobIds, IpAddress : self.ipAddress});
                self.overlay = new OverlayWidget({
                view: View,
                type: "large",
                showScrollbar: false
                });
                self.activity.overlay.destroy();
                self.overlay.build();
                } else{
                self.activity.overlay.destroy(); 
                new Slipstream.SDK.Notification()
               .setText(self.errorMessage)
               .setType("error")
               .notify()
                }
             },

             render: function() {
               this.wizard.build();
               return this;
             }
    });

  return AddLoggingNodeView;
});