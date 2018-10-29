define([
  'backbone',
  'backbone.syphon',
  '../conf/certificateDetailsFormConfig.js',
  '../conf/noCertificateFormConfig.js',
  'widgets/form/formWidget',
  './wizardStepView.js'
  ], function(
    Backbone,
    Syphon,
    CertificateDetailsFormConfig,
    NoCertificateFormConfig,
    FormWidget,
    WizardStepView){

  var CertificateDetailsView = WizardStepView.extend({
         
        
    initialize:function(options){
            WizardStepView.prototype.initialize.call(this);
            var me=this;
                me.activity = options.activity;
            me.options = options;
            me.context = options.context
    },

    render: function(){

             console.log('AddLoggingNode Add View rendered');
             var me=this,formConfig,formElements,jsaCertificateDetails,jsaCertificateDetailsData;

             if (me.model.get("certificate") === 0){           

                 jsaCertificateDetails = me.model.get("jsaCertificateDetails");
                 jsaCertificateDetailsData = me.populateJSACertifcateData(jsaCertificateDetails);
                 formConfig = new CertificateDetailsFormConfig(me.context)
             }             
             else{
                  jsaCertificateDetailsData =null;
                  formConfig = new NoCertificateFormConfig(me.context)
             }; 
                      
                 formElements = formConfig.getValues();

                 me.form = new FormWidget({
                 container: me.el,
                 elements: formElements,
                 values:jsaCertificateDetailsData
                 });
                 me.form.build();                 

           return me;
    },
    
    populateJSACertifcateData: function(jsaCertificateDetails){
      var jsaCertificateDetailsData,arr,commonName,orgUnit,org,arr1,commonNameTo,orgTo,orgUnitTo;
      arr = jsaCertificateDetails['issued-by'].split(',');
      arr1 = jsaCertificateDetails['issued-to'].split(',');
      commonName = arr[0].split('=');
      org=  arr[1].split('=');
      orgUnit=  arr[2].split('=');
      commonNameTo = arr1[0].split('=');
      orgTo=  arr1[1].split('=');
      orgUnitTo=  arr1[2].split('=');
      
      jsaCertificateDetailsData ={
          'public-key' : jsaCertificateDetails['public-key'],
          'begins-on' : jsaCertificateDetails['begins-on'],
          'expires-on' : jsaCertificateDetails['expires-on'],
          'serial-number' : jsaCertificateDetails['serial-number'],
          'sha1-finger-print' : jsaCertificateDetails['sha1-finger-print'],
          'signature-algorithm' : jsaCertificateDetails['signature-algorithm'],
          'common-name': commonName[1],
          'org' : org[1],
          'orgUnit': orgUnit[1],
          'common-nameTo' : commonNameTo[1],
          'orgTo' : orgTo[1],
          'orgUnitTo' : orgUnitTo[1]
      }
      return jsaCertificateDetailsData;

    },

    getTitle: function () {
        return "Certificate Details";             
    }, 
        
    beforePageChange: function(currentStep, step ) {
        var me = this;
        if(currentStep < step){ 
          
          if ((me.model.get("deployment-Mode") === 0)&&(me.model.get("certificate") === 0)){
            var jsaData = me.model.attributes[0].nodes;
            console.log("Ajax call");
            me.showCertificateDetails(jsaData);                    
         }}              
     
        return true;
    },

    showCertificateDetails: function(jsaData){
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
                url: '/api/juniper/ecm/log-collector-nodes/jsa?custom-certificate=true',
                type: 'post',
                data: JSON.stringify(selectData),                    
                headers:{
                    'accept': 'application/vnd.juniper.ecm.jsa-management.jsa+json;version=2;q=0.02',
                    'content-type': "application/vnd.juniper.ecm.jsa-management.jsa+json;version=2;charset=UTF-8"

                },                   
                "success": function( data, textStatus, jQxhr ) {
                    console.log("Success");                                              
                   
                },
                "error": function( jqXhr, textStatus, errorThrown ) {
                    console.log( errorThrown );
                }
            });     
     }       
      
  });
return CertificateDetailsView;
});