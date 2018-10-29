define([
	'backbone',
	'../conf/selectDeploymentFormConfig.js',
	'widgets/form/formWidget',
	'./wizardStepView.js',
	], function(
		Backbone,
		SelectDeploymentFormConfig,
		FormWidget,
		WizardStepView
		){

	var AddNodeSlectDeploymentView = WizardStepView.extend({

        events:{
               "click #deployment_type" : "setDescription"
        },


		initialize:function(options){
		    WizardStepView.prototype.initialize.call(this);
			var me=this;
			me.options = options;
			me.context = options.context
		},

		setDescription : function(){

			this.model.set({

               "deployment_text_description" : this.$el.find('#deployment_text_description').text(),
               "deployment_type" : this.$el.find('#deployment_type').val()

	        });
        },

		render: function(){
			console.log('AddLoggingNode Add View rendered');
			var me=this, 
				formConfig = new SelectDeploymentFormConfig(me.context,me),
	            formElements = formConfig.getValues();

			me.formWidget = new FormWidget({
               	container: me.el,
                elements: formElements,
                values: me.model.attributes
            });
			me.formWidget.build();
			me.deploymentModeVal = me.formWidget.getInstantiatedWidgets()['dropDown_log_collector_type'].instance;
			me.deploymentTypeVal = me.formWidget.getInstantiatedWidgets()['dropDown_deployment_type'].instance;


			if(me.model.get("deployment-Type")){	
			me.$el.find("#deployment_type").val(me.model.get("deployment-Type"));}
			if(me.model.get("deployment_text_description") != undefined){
			me.$el.find("#deployment_text_description").html("<label>"+me.model.get("deployment_text_description")+"</label>");
            };
            
			return me;
		},

		fetchDeploymentTypeDropDown : function(){
			var me = this,arr =  [{
                                            "label": "Single Node",
                                            "value": 1,
                                            "id":"1",
                                            "text": "Single Node"                                           
                                        },{
                                            "label": "Two Nodes",
                                            "value": 2,
                                            "id":"2",
                                            "text": "Two Nodes"
                                        },
                                        {
                                            "label": "Three Nodes",
                                            "value": 3,
                                            "id":"3",
                                            "text": "Three Nodes"
                                        },
                                        {
                                            "label": "Four Nodes",
                                            "value": 4,
                                            "id":"4",
                                            "text": "Four Nodes"
                                        },
                                        {
                                            "label": "Five Nodes",
                                            "value": 5,
                                            "id":"5",
                                            "text": "Five Nodes"
                                        },
                                        {
                                            "label": "Six Nodes",
                                            "value": 6,
                                            "id":"6",
                                            "text": "Six Nodes"
                                        }],
                                        arr1 =  [{
                                            "label": "Juniper Secure Appliance Console",
                                            "value": 1,
                                            "id":"1",
                                            "text": "Juniper Secure Appliance Console"                                           
                                        }] ;   
			if (me.deploymentModeVal.getValue()==="1"){
				console.log("Not JSA");
				me.deploymentTypeVal.addData(arr,true);			
			}
			else
			{
				me.deploymentTypeVal.addData(arr1,true);
			}
			//me.deploymentTypeVal.addData(arr,true);
			console.log("fetchDeploymentTypeDropDown");
		},

		getTitle: function () {
	        return "";
	    },
	   
	    getSummary: function() {
            return this.generateSummary('Deployment Information');
        },

        getCollectorNodes: function(){
        	var collectorNodes= 0;
            $.ajax({
                    url: '/api/juniper/ecm/log-collector-nodes/nodes/',
                    type: 'get',                    
                    headers:{
                        'accept': 'application/vnd.juniper.ecm.log-collector-nodes+json;version=2;q=0.02'
                    }, 
                    async : false,                                      
                    "success": function( data, textStatus, jQxhr ) {
                        console.log("Success"); 
                        collectorNodes = data['log-collector-nodes']['total'];                                                             
                       
                    },
                    "error": function( jqXhr, textStatus, errorThrown ) {
                        console.log( errorThrown );
                    }
                });            
           return collectorNodes; 
        },
        
        beforePageChange: function() {

        	var me = this,collectorNodes=0;
            if (! this.formWidget.isValidInput()) {
            console.log('form is invalid');
            return false;
            }; 

            var jsonDataObj = {}, deploymentType = parseInt(this.$el.find('#deployment_type').val()),deploymentMode = parseInt(this.$el.find('#log_collector_type').val());

            if (deploymentMode===0)
            {
            	collectorNodes=me.getCollectorNodes();
            	if (parseInt(collectorNodes) > 0){
            		me.formWidget.showFormError("Cannot add Juniper Secure Appliance ")
            		 console.log('Cannot add JSA');
            		 return false;
            	}
            }                               
            
            
            jsonDataObj = {               
            	"deployment-Type" : deploymentType,
            	"deployment-Mode" : deploymentMode

             }; 

            if(deploymentType != undefined || deploymentType != "") {
                jsonDataObj["total-nodes"] =  deploymentType; 
            } 
             
            this.model.set(jsonDataObj);
            return true;
        }
       
	});

	return AddNodeSlectDeploymentView;
});
