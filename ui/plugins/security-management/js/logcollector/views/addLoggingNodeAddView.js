define([
  'backbone',
  'backbone.syphon',
  '../conf/addLoggingNodeFormConfig.js',
  'widgets/form/formWidget',
  './wizardStepView.js',
    '../conf/addDynamicNodes.js',
    '../conf/addJSAFormConfig.js',
    '../service/logService.js',
    '../utils/logUtils.js'
  ], function(
    Backbone,
    Syphon,
    AddLoggingNodeFormConfig,
    FormWidget,
    WizardStepView,
        dynamicNode,
        addJSAFormConfig,
        LogService,
        LogUtils){

  var AddLoggingNodeAddView = WizardStepView.extend({
         
        events:{ 
               "click [id*=addMoreNode]" : "addNode",
               "click [id*=removeNode]" : "removeNode",
               "click #use_node_1_pasword_status" : "setCredentials",
               "focusout [id*=ip]" : "displayNodeType"
        },

        displayNodeType : function(event){
               var me = this;
                if(!(me.model.get("deployment-Mode") === 0)){
                   var cursorElement = event.target.id, elementIp = "_ip",
                   attr = me.$el.find("#"+cursorElement).attr('data-invalid');
                   if (typeof attr == typeof undefined && 
                       me.$el.find("#"+cursorElement).val() != undefined &&
                       me.$el.find("#"+cursorElement).val() !=  "") {
                    if(cursorElement.indexOf(elementIp) != -1){
                   var service = new LogService(),index = cursorElement[4];
                   onGetNodeType = function(data){
                   var type = data.response.data["special-node-type"];
                   me.$el.find("#node_"+index+"ip_type").html(
                          "Type: "+LogUtils.logCollectorType(type)
                   );
                   me.$el.find("#node_"+index+"ip_type").show();
                   me.$el.find("#node_"+index+" .section_content").children(".row .log-collector-type").show();
                   console.log(data);

                   };

                   onGetNodeTypeError = function(error){
                   me.$el.find("#node_"+index+"ip_type").html(
                          "IP is not a Collector type or unreachable"
                   );
                   me.$el.find("#node_"+index+"ip_type").show();
                   me.$el.find("#node_"+index+" .section_content").children(".row .log-collector-type").show();
                   console.log(error);

                   }; 
                   var enteredIp = this.$el.find("#"+cursorElement).val();
                   service.getNodeType(enteredIp, onGetNodeType, onGetNodeTypeError);

                   }
                   }
              } 
               
        },


        setCredentials : function(){
               var me = this;
               me.setSimilarCredentials();
        },  

        setSimilarCredentials : function(){
                var me = this,isSimilarPassword = me.$el.find("#use_node_1_pasword_status").is(":checked"),nodes = me.model.get("total-nodes");
                if(isSimilarPassword){
                 
                 for(i = nodes; i > 1; i--){
                   me.$el.find("#node"+i+"_password").val(me.$el.find("#node1_password").val());
                   me.$el.find("#node_username"+i).val(me.$el.find("#node_username1").val())
                 }

                }
                else{
                 for(i = nodes; i > 1; i--){
                   me.$el.find("#node"+i+"_password").val("");
                   me.$el.find("#node_username"+i).val("")
                 }
                }
        },

        addNode: function () { 
                totalNodes = {               
                    "total-nodes" : this.model.get("total-nodes") + 1
                     }; 
                this.model.set(totalNodes);
                this.$el.find("[id*=addMoreNode]").hide(); 
                this.$el.find("[id*=removeNode]").hide();
                var node_no  =  this.model.get("total-nodes"),
                    sectionConfig = new dynamicNode(this.context),
                    sectionElements = sectionConfig.getValues(node_no);

                this.form.addSection(sectionElements, "#node_"+(totalNodes["total-nodes"]-1), false);
                this.setSimilarCredentials();
                this.$el.find(".optionselection").show();
                this.$el.find("#node_"+totalNodes["total-nodes"]+" .section_content").children(".row .log-collector-type").hide();

        },

        buildNodeSectionsDynamic : function(){

                var totalSections = this.model.get("total-nodes");
                var sectionConfig = new dynamicNode(this.context);
                for(i=2; i<=totalSections; i++){

                var sectionElements = sectionConfig.getValues(i);
                   
                this.form.addSection(sectionElements, "#node_"+(i-1), false);
               

                };
                this.$el.find("[id*=addMoreNode]").hide(); 
                this.$el.find("[id*=removeNode]").hide();
                this.$el.find("[id*=addMoreNode]").last().show(); 


        },
 
        removeNode: function(){
              this.$el.find("#node_"+this.model.get("total-nodes")).remove();
                this.$el.find("[id*=addMoreNode]").last().show(); 
                this.$el.find("[id*=removeNode]").last().show();
                totalNodes = {               
                    "total-nodes" : this.model.get("total-nodes") - 1
                     }; 
                this.model.set(totalNodes);
                if(this.initialNOdes == this.model.get("total-nodes")){
                 this.$el.find("[id*=removeNode]").remove()
                };
                if(this.model.get("total-nodes") == 1){
                this.$el.find(".optionselection").hide();
                }else{
                  this.$el.find(".optionselection").show();
                }

        },

    initialize:function(options){
            WizardStepView.prototype.initialize.call(this);
            var me=this;
                me.activity = options.activity;
            me.options = options;
            me.context = options.context
    },

    render: function(){
             var jsaCertificateDetails; 
             console.log('AddLoggingNode Add View rendered');
             var me=this,formConfig,formElements; 
             if (me.model.get("deployment-Mode") === 0){
                formConfig = new addJSAFormConfig(me.context);
              console.log("JSA");
             }
             else{
                formConfig = new AddLoggingNodeFormConfig(me.context)
             };             
                 formElements = formConfig.getValues();

                 me.form = new FormWidget({
                 container: me.el,
                 elements: formElements
                 });
                 me.form.build();
                 if(me.model.get("total-nodes") >= 2){
                 me.$el.find("[id*=addMoreNode]").hide();
                 me.buildNodeSectionsDynamic();
                 }

            for(var i=0; i < me.model.get("total-nodes"); i++){
                 if(me.model.attributes[i] != undefined){
                 me.$el.find("#node_name" +(i+1)).val(me.model.attributes[i]["nodes"]["node_name"]);
                 me.$el.find("#node"+(i+1)+"_ip").val(me.model.attributes[i]["nodes"]["node_ip"]);
                 me.$el.find("#node_username" + (i+1)).val(me.model.attributes[i]["nodes"]["node_username"]);
                 me.$el.find("#node"+(i+1)+'_password').val(me.model.attributes[i]["nodes"]["node_password"])
                 }
            };

            if(me.model.get("total-nodes") == 1){
                me.$el.find(".optionselection").hide();

            };

                 me.initialNOdes = me.model.get("total-nodes");
                 me.$el.find("#removeNode").remove();
                 me.$el.find("[id*=ip_type]").hide();        
                 me.$el.find(".section_content").children(".row .log-collector-type").hide();
            
                
            if(!me.$el.hasClass(me.context["ctx_name"])){
                me.$el.addClass(me.context["ctx_name"]);
            }

           return me;
    },
    
    getTitle: function () {
          var me = this;
            if (me.model.get("deployment-Mode") === 0){
               return "Add JSA Node";
             }
             else{
                 return "Add Collector Node";
             }
             
      },
     
      getSummary: function() {
                return this.generateSummary('Add Collector Node Information');
        },
        
        beforePageChange: function(currentStep, step ) {
                var me = this;
                var jsonNodeObj= [], value  =  this.model.get("total-nodes");
                this.getProperties(jsonNodeObj, value);
                var jsaData = jsonNodeObj[0].nodes; 
                if(currentStep < step){ 
                  if (! this.form.isValidInput()) {
                   console.log('form is invalid');
                   return false;
                  };
                  if (me.model.get("deployment-Mode") === 0){

                    console.log("Ajax call");
                    var certificate=false,jsonCertificateObj=[];                   

                     if(me.showCertificateDetails(certificate,jsaData)){
                         jsonCertificateObj["certificate"] = 0;
                         jsonCertificateObj["jsaCertificateDetails"] = jsaCertificateDetails;                         
                         me.model.set(jsonCertificateObj); 
                     }
                     else{
                         jsonCertificateObj["certificate"] = 1;
                         me.model.set(jsonCertificateObj);  
                     } 
                 }}               
             
                return true;
        },

        showCertificateDetails: function(certificate,jsaData){
          var me = this,val=false;
          var selectData = {
                      "jsa" :{
                              "user-name":jsaData.node_username,
                              "ip":jsaData.node_ip,
                              "password":jsaData.node_password,
                              "name":jsaData.node_name
                            }
                       };
           $.ajax({
                    url: '/api/juniper/ecm/log-collector-nodes/jsa?custom-certificate='+certificate,
                    type: 'post',
                    data: JSON.stringify(selectData),
                    async:false,
                    headers:{
                        'accept': 'application/vnd.juniper.ecm.jsa-management.jsa+json;version=2;q=0.02',
                        'content-type': "application/vnd.juniper.ecm.jsa-management.jsa+json;version=2;charset=UTF-8"

                    },                   
                    "success": function( data, textStatus, jQxhr ) {
                        console.log("Success");
                        if(!(_.isEmpty(data.jsa['jsa-certificate-details']))){
                          console.log("Success");
                          val = true; 
                          jsaCertificateDetails = data.jsa['jsa-certificate-details'];

                        }                        
                       
                    },
                    "error": function( jqXhr, textStatus, errorThrown ) {
                        console.log( errorThrown );
                    }
                });          
          return val;
          
        },

         
        getProperties: function(jsonNodeObj, value){
                var finalNodes = {}, properties = Syphon.serialize(this);

                for(var t =  1; t<= value ; t++){
                NodeInfo = this.setNodeInfo(properties, jsonNodeObj,t);
                this.model.set(NodeInfo); 
                }
        },

        setNodeInfo: function(properties, jsonNodeObj, finalValue) {

                jsonNodeObj.push({
                "nodes":{
                "node_name"     : properties['node_name'+finalValue],
                "node_ip"       : properties['node'+finalValue+'_ip'],
                "node_password" : properties['node'+finalValue+'_password'],
                "node_username" : properties['node_username'+finalValue ]
                }});

                return jsonNodeObj;
        
        }
  });

  return AddLoggingNodeAddView;
});