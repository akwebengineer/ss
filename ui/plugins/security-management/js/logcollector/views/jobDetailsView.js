
define(['backbone',
    'widgets/form/formWidget',
    '../conf/jobDetailsFormConfig.js',
    '../conf/jobDetailsGridConfig.js',
     'widgets/grid/gridWidget',
     '../service/logService.js',
     '../utils/logConstants.js',
     'widgets/confirmationDialog/confirmationDialogWidget'
    ], 
    function(Backbone,
        FormWidget,
        JobDetailsFormConfig,
        JobDetailsGridConfig,
        GridWidget,
        Service,
        LogConstants,
        ConfirmationDialogWidget
        ){

    
    var timer;
    var IPs;
    var JobDetailsView = Backbone.View.extend({

        
        events: {

            'click #node_job_details_ok': "gridRefresh",
            'click #refreshJobDetailGrid' : "jobDetailGridRfresh",
            'click #device_navigate' : "jumptoDevices"


        },

        gridRefresh: function(event){
            event.preventDefault();
            var self = this;
            
            self.activity.overlay.destroy();

           // self.activity.view.gridWidget.reloadGrid();
            clearTimeout(timer);

        },

        jobDetailGridRfresh : function(){
            var jobCompleted ; 
            jobCompleted =  this.verifyJobStatus();
            if(!jobCompleted){
            this.jobGridWidget.reloadGrid();
            this.verifyJobStatus();
            }
            else {
            clearTimeout(timer);
            }
         
        },

        verifyJobStatus : function(){
            var visible, me = this;
            visible = me.jobGridWidget.getAllVisibleRows();

            for(var i = 0; i < visible.length; i++){

            if(visible[i]["percent-complete"] != 100){

                return false;
            }
            };
            service = new Service();
            onSuccess = function(data){
            var nodes = data["fabric-nodes"]["fabric-node"];
            for(i=0; i<nodes.length; i++){
            var ipAddress =  nodes[i]["management-ip-v4"];
            for(j=0; j<IPs.length; j++){
                if(ipAddress == IPs[j]){

                    if((nodes[i]["special-node-type"] == LogConstants.LogTypes.LOG_RECEIVER) || (nodes[i]["special-node-type"] == LogConstants.LogTypes.COMBINED_NODE)){

                        me.$el.find("#device_navigate").removeClass("slipstream-small-primary-button slipstream-small-secondary-button disabled")
                        .addClass("slipstream-primary-button");
                        me.$el.find("#device_navigate").removeAttr('disabled');
                    }
                }

            };

            };
            console.log(data);

            };
            service.getTotalNodes(onSuccess);         
            return true;

        },

        initialize: function(options){
            this.activity = options.activity;
            this.context = options.activity.context;
            this.Jobs = options.JobIds;
            this.IpAddress = options.IpAddress
        },
        
        render: function(){
            var me = this, jobs = me.Jobs, jobDetailsFormConfig = new JobDetailsFormConfig(me.context);
            IPs = me.IpAddress;
            formElements = jobDetailsFormConfig.getValues();
            bobDetailsGridConfig = new JobDetailsGridConfig(me.context,jobs),
            gridElements = bobDetailsGridConfig.getValues();

            me.formWidget = new FormWidget({
            "elements": formElements,
            "container": me.el
            });

            me.formWidget.build();

            var gridContainer = me.$el.find('.log_job_details_list').empty();
            me.jobGridWidget = new GridWidget({
            container: gridContainer,
            elements: gridElements,
            actionEvents:{}
            });
            me.jobGridWidget.build();

            timer = setInterval(function() {me.jobDetailGridRfresh(); },4000);
            me.$el.find("#device_navigate").removeClass("slipstream-primary-button")
            .addClass("slipstream-small-primary-button slipstream-small-secondary-button disabled");
            me.$el.find("#device_navigate").attr('disabled','disabled');
            return me;
        },

        jumptoDevices : function(event){
             
             var me = this,
             conf = {
                title: me.context.getMessage('log_device_navigation'),
                question: me.context.getMessage('log_device_navigation_question'),
                yesButtonLabel: 'Yes',
                noButtonLabel: 'No',
                yesButtonTrigger: 'yesEventTriggered',
                noButtonTrigger: 'noEventTriggered'
             },

             confirmationDialogObj = new ConfirmationDialogWidget(conf);
             confirmationDialogObj.build();

             confirmationDialogObj.vent.on('yesEventTriggered', function() {
             event.preventDefault();   
             mimeType = 'vnd.juniper.sd.device-management.devices';
             me.activity.overlay.destroyAll();
             clearTimeout(timer);
             var intent = new Slipstream.SDK.Intent('slipstream.intent.action.ACTION_LIST', { 
                        mime_type: mimeType 
                    });
             me.context.startActivity(intent);
             });

             confirmationDialogObj.vent.on('noEventTriggered', function() {
             confirmationDialogObj.destroy();
           });
             
        }
       
    });

    return JobDetailsView;
})