define([
    '../views/certificateDetailsView.js',
    '../conf/certificateDetailsFormConfig.js',
    '../conf/noCertificateFormConfig.js'
], function (CertificateView,CertificateDetailsFormConfig,NoCertificateFormConfig) {
   
              
    describe('Certificate View UT', function () {       
            var activity, stub;
             before(function() {
                 activity = new Slipstream.SDK.Activity();
                 stub = sinon.stub(activity, 'getContext', function() {
                     return new Slipstream.SDK.ActivityContext();
                 });
             });

             after(function() {
                 stub.restore();
        });        

        describe("View tests", function() {

         describe(" create", function() {

             var view = null, intent, model = null;

             before(function(){

                 intent = sinon.stub(activity, 'getIntent', function() {

                     return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE);
                 });                 

             });


             after(function() {

                 intent.restore();

             });


             beforeEach(function() {

                 $.mockjax.clear();

                 view = new CertificateView({
                     activity: activity
                 });

             });


             afterEach(function() {

             });


             it("view should exist", function() {                
                 view.should.exist;

             });

              it("Render jsaCertificateDetails", function() {                
                var stub1;
                view.context = {
                    getMessage : function(){
                        return true
                    }
                } ;
                view.model = {
                    get : function(){
                        return 0
                    },
                    'certificate' : true,
                    'jsaCertificateDetails': true
                };
                stub1 = sinon.stub(view, "populateJSACertifcateData"); 
                view.render(); 
                stub1.called.should.be.equal(true);
                stub1.restore(); 
                               

             });

             it("Render No Certificate", function() {                
                var stub1;
                view.context = {
                    getMessage : function(){
                        return true
                    }
                } ;
                view.model = {
                    get : function(){

                        return false
                    },
                    'certificate' : true,
                    'jsaCertificateDetails': true
                };
                stub1 = sinon.stub(view, "populateJSACertifcateData"); 
                view.render(); 
                stub1.called.should.be.equal(false);
                stub1.restore(); 
                               

             }); 

             it("populateJSACertifcateData", function() {                
                var state,jsaCertificateDetails = {
                  'public-key' : "RSA",
                  'begins-on' : "Tue 20",
                  'expires-on' : "Thu 22",
                  'serial-number' : "213123",
                  'sha1-finger-print' : "abc",
                  'signature-algorithm' : "aaab",
                  'issued-by': "CN=BadSSL Intermediate Certificate Authority, O=BadSSL, L=San Francisco, ST=California, C=US",
                  'issued-to': "CN=badssl-fallback-unknown-subdomain-or-no-sni, O=BadSSL Fallback. Unknown subdomain or no SNI., L=San Francisco, ST=California, C=US"
                   
                };             
                state =  view.populateJSACertifcateData(jsaCertificateDetails); 
                assert(typeof state === "object"); 
                              

             });

              it("beforePageChange", function() {               
                view.model = {
                    get : function(){
                          return 0
                    },
                    attributes : [{ 'nodes' : 0                        
                  }]
                };              
                var state;
                state =  view.beforePageChange(1, 2);                
                assert(typeof state === "boolean");  
                assert(state === true);                 

             });  

              it("beforePageChange false", function() {  
                var state;
                state = view.beforePageChange(3, 2); 
                assert(typeof state === "boolean");
                assert(state === true);                    

             }); 

              it("getTitle", function() {          
                var state;
                state =  view.getTitle();
                assert(typeof state === "string");                

             });

              it("showCertificateDetails Success", function() {                
                var stub, jsaData ={
                    'node_username' : "JSA",
                    'node_ip' : "10.33.3.5",
                    'node_password': "123",
                    'node_name' : "super"
                };                 
               view.showCertificateDetails(jsaData); 
          

             });

             it("showCertificateDetails Failure", function() {                
                var stub, jsaData ={
                    'node_username' : "JSA",
                    'node_ip' : "10.33.3.5"                   

                };                 
               view.showCertificateDetails(jsaData); 
          

             }); 
                     

    });
 });
 });
 });