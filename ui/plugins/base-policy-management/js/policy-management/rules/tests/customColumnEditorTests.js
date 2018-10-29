define(['../../rules/views/customColumnEditorView.js',
    '../../rules/conf/customColumnEditorFormConfiguration.js'], function(customColumnEditorView,CustomColumnEditorFormConfiguration) {



    describe("Custom Column Editor View unit tests", function() {

        var activity = new Slipstream.SDK.Activity();       
        var view = null,intent;

        sinon.stub(activity, 'getContext', function() {
                return new Slipstream.SDK.ActivityContext();
            });
        
        //executes once
        before(function(){
            console.log("Custom Column Editor unit tests: before");
            intent = sinon.stub(activity, 'getIntent', function() {
                return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE);
            });
            
        });

        //executes once
        after(function(){
            sinon.restore();
            console.log("Custom Column View unit tests: after");
        });
       
        
         var view = new customColumnEditorView({
                context: activity.getContext(),
                activity: activity,
                model:{},                
            });
               

            it("view should exist", function() {
                view.should.exist;
            });

            it("Update Form Values", function() {
               view.model = {
                    set: function(){
                        console.log('set')
                    }, 
                    get: function(){
                        console.log('get');
                    }
                }
                view.updateFormValuesForEditor();
            });

            it("Update Form Values customColData", function() {
                view.model = {
                    set: function(){
                        return true;
                        console.log('set')
                    },
                    toJSON: function(){
                        console.log('toJSON')
                    }, 
                    get: function(){
                        return true;
                        console.log('get');
                    }
                }
                var customColData = '{"message":"error"}';
                view.updateFormValuesForEditor();
            });

            it("view.formWidget should exist", function() {
                    view.render();
                    view.form.should.exist;
                });

            it("Update model data", function() {
                var e={};
               
                
                 view.model = {
                    set: function(){
                        console.log('set')
                    },
                    toJSON: function(){
                        console.log('toJSON')
                    }, 
                    get: function(){
                        console.log('get');
                    }
                }
                view.options ={
                        close : function(){                        
                        console.log('close')
                    }
                };
                view.options.ruleCollection ={
                        modifyRule : function(){                        
                        console.log('modifyRule')
                    }
                };              
                  view.updateModelData(e);
            });

             it("Update model data without customColData ", function() {
                var e={};                
                  view.model = {
                    set: function(){
                        return true;
                        console.log('set')
                    },
                    toJSON: function(){
                        console.log('toJSON')
                    }, 
                    get: function(){
                        return true;
                        console.log('get');
                    }
                }
                var customColData = '{"message":"error"}';                
                customColData = view.model.set('test');
                view.options ={
                        close : function(){                        
                        console.log('close')
                    }
                };
                view.options.ruleCollection ={
                        modifyRule : function(){                        
                        console.log('modifyRule')
                    }
                };                             
                  view.updateModelData(e);
            });  
             it("Update model data with isFormValid ", function() {
                var e={};                
                  view.model = {
                    set: function(){
                        return true;
                        console.log('set')
                    },
                    toJSON: function(){
                        console.log('toJSON')
                    }, 
                    get: function(){
                        return true;
                        console.log('get');
                    }
                }
                var customColData = '{"message":"error"}';                
                customColData = view.model.set('test');
                view.options ={
                        close : function(){                        
                        console.log('close')
                    }
                };
                view.options.ruleCollection ={
                        modifyRule : function(){                        
                        console.log('modifyRule')
                    }
                }; 
                view.form ={
                        isFormValid : function(){                        
                        console.log('isFormValid')
                    },
                    isValidInput  : function(){                        
                        console.log('isValidInput ')
                    }
                };             
                  view.updateModelData(e);
            });       
    });

   
   
});