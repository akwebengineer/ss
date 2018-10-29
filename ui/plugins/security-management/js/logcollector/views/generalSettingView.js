
define(['backbone',
	'widgets/form/formWidget',
	'../conf/generalSettingsFormConfig.js',
    'widgets/overlay/overlayWidget',
    '../models/addLogNodeModel.js',
    '../service/logService.js',
    'widgets/spinner/spinnerWidget'
    ], 
	function(Backbone,
		FormWidget,
		GeneralSettingsFormConfig,
        OverlayWidget,
        addLogNodeModel,
        LogService,
        SpinnerWidget){

	var GeneralSettingsView = Backbone.View.extend({
		
		events: {
           'click #general-settings-cancel': 'cancel',
           'click #node-password-change': 'changePassword',
           'click #general-settings-save' : 'syslogForward',
           'change #syslog_forwarding_status': 'logForwardEnableDisable'

        },

        'model'  : new addLogNodeModel(),

        initialize: function(options){

    		this.activity = options.activity;
            this.context = options.activity.context;
            var selectedNode;
            var rowId ;
         
    	},


		render: function(){
            var me = this, service = new LogService();
            rowId = "";
    		generalSettingsFormConfig = new GeneralSettingsFormConfig(this.context);
    		this.formWidget = new FormWidget({
                "elements" : generalSettingsFormConfig.getValues(),
                "container" : this.el
            });
            this.formWidget.build();

            selectedNode = this.activity.view.gridWidget.getSelectedRows();
            collectorIp = selectedNode[0]["management-ip-v4"];
            // var spinner = new SpinnerWidget({
            //                     "container": me.el,
            //                     "statusText": "Please wait fetching the details"
            //                 }).build();
            onSyslogFetchSuccess = function(data){
            // spinner.destroy();
             if(data["log-collector-nodes"]["log-collector-node"][0]["syslog-forwarding"] != undefined){
             var syslogRecord = data["log-collector-nodes"]["log-collector-node"][0]["syslog-forwarding"][0];
             if(syslogRecord != undefined)
             {  
               me.$el.find("#syslog_forwarding_status").prop("checked", syslogRecord["enabled"]);
               me.$el.find("#port_number").val(syslogRecord["syslogportnumber"]);
               me.$el.find("#protocol").val(syslogRecord["syslogprotocol"]);
               me.$el.find("#destination_ip").val(syslogRecord["syslogipaddress"]);
               if(syslogRecord["id"] != undefined){
               rowId = syslogRecord["id"];}
             }
             }
              me.logForwardEnableDisable();
            };

            onSyslogFetchError = function(error){
                // spinner.destroy();
               console.log(error);

            }; 
           
            service.sysLogDetails(collectorIp, onSyslogFetchSuccess, onSyslogFetchError);
            
            return this;

    	},
        cancel: function(event) {
            
            event.preventDefault();
            this.activity.overlay.destroy();
        },

        logForwardEnableDisable : function() {

            if(this.$el.find("#syslog_forwarding_status").prop("checked")){

                this.$el.find("#destination_ip").prop('disabled', false);
                this.$el.find("#port_number").prop('disabled', false);
                this.$el.find("#protocol").prop('disabled', false);
                this.$el.find(".elementlabel > label").addClass("required");
                this.$el.find(".elementinput > input").addClass("required");
                this.$el.find(".elementinput > select").addClass("required");
                this.$el.find(".elementlabel > lable").prop("required", true);
                this.$el.find(".elementinput > input").prop("required", true);
                this.$el.find(".elementinput > select").prop("required", true);
                this.$el.find(".elementlabel:first > .left:first").prop("required", false);
                this.$el.find(".elementlabel:first > .left:first").removeClass("required");

            }
            else{

                this.$el.find("#destination_ip").prop('disabled', 'disabled');
                this.$el.find("#port_number").prop('disabled', 'disabled');
                this.$el.find("#protocol").prop('disabled', 'disabled');
                this.$el.find(".elementlabel").removeClass("error");
                this.$el.find(".elementinput").removeClass("error");
                this.$el.find(".elementlabel > .required").removeClass("required");
                this.$el.find(".elementinput > .required").removeClass("required");
                this.$el.find(".elementlabel > lable").prop("required", false);
                this.$el.find(".elementinput > input").prop("required", false);
                this.$el.find(".elementinput > select").prop("required", false);
            }

        },

        syslogForward : function(){

             var me = this, service = new LogService(), destDetial= [];
            
             collectorIp = selectedNode[0]["management-ip-v4"];
             destinationIp = me.$el.find("#destination_ip").val();
             protocol = me.$el.find("#protocol").val();
             port = me.$el.find("#port_number").val();
             enableDisable = me.$el.find("#syslog_forwarding_status").is(':checked');
             if(rowId != undefined && rowId != ""){
             destDetial   = [{"ip-address": destinationIp,"port":port, "id": rowId ,"protocol":protocol}]
             }else{
                destDetial   = [{"ip-address": destinationIp,"port":port ,"protocol":protocol}]
             };

             if(me.formWidget.isValidInput()){
             var data = {
             "request":{  "log-node-details":[{"ip-address":collectorIp,
             "dst-detail":destDetial,
             "status":enableDisable
             }]
             }
             };
             
             logForwardSuccess = function(response) {
             me.activity.overlay.destroy();
             if(enableDisable == false){            
                 service.syslogForward("PUT", data);
                 me.notify("Syslog Forwading Disabled" , "success");
             }else{
                 me.notify("Syslog Forwading Enabled" , "success");
             }                     
             },    
             logForwardNoData = function(response){
                 me.activity.overlay.destroy();
                 console.log(response);
                 me.notify("Syslog Forwading Disabled Success" , "success");
             },
             logForwardError = function( jqXhr, textStatus, errorThrown ) {
                console.log(errorThrown);
                me.notify(jqXhr.responseText, "error");
             }
             if(destinationIp !== ""){
                  service.syslogForward("POST" , data, logForwardSuccess, logForwardError);
             } 
             else
             {
                service.syslogForward("PUT" , data,logForwardNoData,logForwardError);
             } 
             }
        },

        notify : function(textStatus, setype){
            new Slipstream.SDK.Notification()
            .setText(textStatus)
            .setType(setype)
            .notify();
        },

	});

	return GeneralSettingsView;
})