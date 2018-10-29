define(['../../custom-column/views/customColumnCreateFormView.js', 'widgets/grid/gridWidget','../conf/customColumnGridConf.js'], function(CustomColumnCreateView,GridWidget,CustomColumnGridConf) {


    describe("Custom Column Create View unit tests", function() {

        var activity = new Slipstream.SDK.Activity();  
          sinon.stub(activity, 'getContext', function() {
                return new Slipstream.SDK.ActivityContext();
            });
        //executes once
        before(function(){
            console.log("Custom Column Create View unit tests: before");
          
            intent = sinon.stub(activity, 'getIntent', function() {
                return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE);
            });
        });

        after(function() {
          sinon.restore();          
        });

        activity.context = activity.getContext();
       
            var view = new CustomColumnCreateView({
                parentView: activity,                
                params: {
                    formMode: "create",
                }
            });  
            
	        view.context = {        	
	        getMessage : function () {
	            var msg ="";
	            return msg;
	        	}
	        };   
            
            
            activity.customColumnGridWidget = {
                reloadGrid : function () {
                    console.log('Dummy Mocked Test reloadgrid');
                }
            };
            activity.notify = sinon.spy(function(type, msg){
              console.log('notify');
            });
            activity.loadCustomColumnGrid = function (){};

            it("view should exist", function() {
                view.should.exist;
            });

            it("view.formMode should be CREATE", function() {
                view.params.formMode.should.be.equal('create');
            });

           it("view.formWidget should exist", function() {
                    view.render();
                    view.form.should.exist;
                });

           it("overlay should be destroyed ", function() {
                    view.render();
                  $('#overlay_content').append(view.$el);
                    // Imitate overlay.destory
                    view.parentView.overlay = {destroy: function(){console.log('destroyed');}}

                    sinon.spy(view.parentView.overlay, "destroy");

                    $('#custom-column-cancel').click();
                    view.parentView.overlay.destroy.calledOnce.should.be.equal(false);
                });


            it("overlay should be destroyed when cancel button clicked", function() {
                    view.cancel('click #custom-column-cancel');
                  $('#overlay_content').append(view.$el);
                    // Imitate overlay.destory
                    view.parentView.overlay = {destroy: function(){console.log('destroyed');}}

                    sinon.spy(view.parentView.overlay, "destroy");

                    $('#custom-column-cancel').click();
                    view.parentView.overlay.destroy.calledOnce.should.be.equal(false);
                });
             
            it("Checking Validation of form", function() {
                    
                    view.$el.find('#customColumn-name').val('% ').trigger('change');
                    view.$el.find('#regex').val('').trigger('change');
                    view.validateForm("% ","");
                  });

            it("Validation check for Incorrect Regex", function() {
                    view.validateForm("name","*");
                  });


            it("Data should be not be saved in case of Invalid name when ok button clicked", function(done) {
                done();              
                view.render();
               /* var stub;                    
                    stub = sinon.stub(view, 'onSuccess');    */              
                var e ={};
                view.$el.find('#customColumn-name').val('%').trigger('change');
                view.$el.find('#regex').val('').trigger('change');
              
                view.saveCustomColumn(e);             
               
            });
            

            it("Data should be saved in case Success", function() {
                view.render();
                var e ={},
                  model = {
                    set : sinon.spy(function (obj) {
                      
                    }),
                    save : sinon.spy(function (data, options) {
                      options.success();
                    })
                  };
                view.model = model;
                view.$el.find('#customColumn-name').val('name').trigger('change');
                view.$el.find('#regex').val('regex').trigger('change');
                
                sinon.stub(view, 'onSuccess', sinon.spy());
                sinon.stub(view, 'onErr', sinon.spy());
                view.saveCustomColumn(e);
                assert(view.model.set.calledWith({
                  'regex' : 'regex',
                  'name' : 'name' 
                }));
                assert(view.model.save.calledWith(null));
                view.onSuccess.restore();
                view.onErr.restore();
                view.model = null;
            });

              it("Data should not be saved in case of Error", function() {
                view.render();
                
                                
                var e ={},
                model = {
                    set : sinon.spy(function (obj) {
                      
                    }),
                    save : sinon.spy(function (data, options) {
                      options.error('a',{responseText:'test response'});
                    })
                  };
                view.model = model;
                view.$el.find('#customColumn-name').val('name').trigger('change');
                view.$el.find('#regex').val('regex').trigger('change');
                sinon.stub(view, 'onSuccess', sinon.spy());
                sinon.stub(view, 'onErr', sinon.spy());
                view.saveCustomColumn(e);  
                assert(view.model.set.calledWith({
                  'regex' : 'regex',
                  'name' : 'name' 
                }));
                assert(view.model.save.calledWith(null));
                view.onSuccess.restore();
                view.onErr.restore();
                view.model = null;
            });

            it("On Successful Save", function() {
              var testMap = {
                'name' : 'Col1'
              },
              model = {
                get : function (key) {
                  return testMap[key];
                }
              };
              view.model = model;
              view.onSuccess();
              assert(view.parentView.notify.calledWith('success'));
              view.model = null;
            }); 

            it("Error during Save", function() {
                
                var text = '{"message":"error"}';

                view.parentView = {notify: function(){console.log('notify');}} 
                 sinon.spy(view.parentView, "notify"); 
                 view.parentView.customColumnGridWidget = {
                reloadGrid : function () {
                    console.log('Dummy Mocked Test reloadgrid');
                }
            };

                view.onErr(text);           
               
            });

                      
         
    });

    describe("Custom Column Edit View unit tests", function() {
        var activity = new Slipstream.SDK.Activity();
        activity.context = activity.getContext();
        activity.customColumnGridWidget = {
            reloadGrid : function () {
                console.log('Dummy Mocked Test reloadgrid');
            }
        };
        activity.notify = sinon.spy(function(type, msg){
          console.log('notify');
        });
        
        var view = new CustomColumnCreateView({
                
                parentView: activity,
                params: {
                    id: "229534",
                    originalRow :{
                        id: "229534",
                        name: "CC2",
                        regex: "//"

                    },
                    formMode: "edit",
                    flatValues: {
                        id: "229534",
                        name: "CC2",
                        regex: "//"

                    }                
                   
               }

            });
        view.context = {        	
    	        getMessage : function () {
    	            var msg ="";
    	            return msg;
    	        	}
    	        };
        
        view.render();
        it("view should exist", function() {
            view.should.exist;
        });

        it("view.formMode should be EDIT", function() {
            view.params.formMode.should.be.equal('edit');
        });
        it("On Successful Save", function() {
          var testMap = {
            'name' : 'Col1'
          },
          model = {
            get : function (key) {
              return testMap[key];
            }
          };
          view.model = model;
          activity.loadCustomColumnGrid = sinon.spy();
          view.onSuccess();
          assert(view.parentView.notify.calledWith('success'));
          assert(view.parentView.loadCustomColumnGrid.calledOnce);
          view.model = null;
        });
    });

   
});