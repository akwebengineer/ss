define([
    '../../../../security-management/js/logcollector/views/addLoggingNodeAddView.js',
    '../../../../security-management/js/logcollector/conf/addJSAFormConfig.js',
    '../../../../security-management/js/logcollector/conf/addLoggingNodeFormConfig.js'
], function (AddLoggingNodeAddView,AddJSAFormConfig,AddLoggingNodeFormConfig) {
   
              
    describe('Add Logging Node View UT', function () {       
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

                 view = new AddLoggingNodeAddView({
                     activity: activity
                 });

             });


             afterEach(function() {

             });


             it("view should exist", function() {                
                 view.should.exist;

             });

              it("Render jsa", function() {                
                var stub1;
                view.context = {
                    getMessage : function(){
                        return true
                    }
                } ;
                view.model = {
                    get : function(){
                        return 0
                    }                    
                };
                view.$el = {
                    find : function(){
                        return {
                            remove : function(){
                                return true
                            },
                            hide : function(){
                                return true
                            },
                            children : function(){
                                return {
                                    hide : function(){
                                        return true
                                    }
                                }
                            }

                        }
                    },
                    hasClass :function(){
                        return true
                    },
                    addClass :function(){
                        return true
                    }
                };                
                view.render();              
                               

             });             

             it("display Node Type", function() {              
               
                view.context = {
                    getMessage : function(){
                        return true
                    }
                } ;
                view.model = {
                    get : function(){
                        return 0
                    }                    
                };                
                view.displayNodeType();                 

             });         
             it("getTitle JSA", function() {          
                var state;
                view.model = {
                    get : function(){
                        return 0
                    }                    
                };
                state =  view.getTitle();
                assert(typeof state === "string");                

             });

              it("getTitle Collector", function() {          
                var state;
                view.model = {
                    get : function(){
                        return false
                    }                    
                };
                state =  view.getTitle();
                assert(typeof state === "string");                

             });              
                     

    });
 });
 });
 });