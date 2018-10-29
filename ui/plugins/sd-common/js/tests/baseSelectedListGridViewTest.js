define([
    "../../../sd-common/js/signatures/views/baseSelectedListGridView.js",
    '../../../security-management/js/objects/conf/ipsSigStaticGridConfiguration.js',
     '../../../security-management/js/objects/views/ipsSigAvailableListGridView.js'
 
   
], function(baseSelectedListGridView, IpsSigStaticGridConfiguration ,ipsSigAvailableListGridViewLHS){
   describe("Signatures - IPS - Base selected List Grid View", function() { 
      
        var stub,stub1,bindEvent,getMessage,activity = new Slipstream.SDK.Activity(),gridElements,view = null ,
         options = {} ,config = { 'id' :"ips_static_sig"}, 
         context = new Slipstream.SDK.ActivityContext();
     
      options = {
          parentView: { context: context,formMode : 'CREATE' }, 
          formTitleMsgs: null, 
          uuid: '859222', 
          currentView: {uuid : '859222' ,sigGroupGridConf : {}}
        }
 
       before(function() {
            var actionEvnt = {};              
        view = new baseSelectedListGridView({
          parentView : options.parentView,
          uuid : '3433',
          formTitleMsgs: null, 
          context : context,
          selectedSig:[{id:10}]         
        });
       
        view.gridContainerId = 'ips-sig-static-grid';
        view.sigGroupGridConf = new IpsSigStaticGridConfiguration(view.parentView.context);
        view.sigSelectorView =  new ipsSigAvailableListGridViewLHS({"parentView": view.parentView, "formTitleMsgs": view.formTitleMsgs, "uuid":view.uuid,"currentView" :view});
        
        gridElements = view.sigGroupGridConf;
        gridElements = sinon.stub(view, 'updateGridConf',function(gridElements){return gridElements});        
    
        obj = {
                empty : function(){
                   return $('<span id="ips-sig-static-grid"></span>');
                 } 
            } ;
            view.parentView.$el ={
                find : function() {     
                        return  obj;
                }
             }; 
              
            stub1 = sinon.stub(view.sigSelectorView, 'updatesigData',function() {}) ;  
       });

       after(function() {
           gridElements.restore();  
           stub1.restore();
       });


    it("create signature grid",function() {  
      
      view.options.isDefined = true; 
      bindEvent = sinon.stub(view, 'bindEvents');     
        
      view.should.exist;  
      
      view.createSigGroupGrid();

      bindEvent.restore();
      
    });
    it("create signature grid",function() {  
      view.options.isDefined = false; 
      bindEvent = sinon.stub(view, 'bindEvents');     
        
      view.should.exist;  
      
      view.createSigGroupGrid();

      bindEvent.restore();
      
    });

    describe("get Row Ids", function() {
          var rowid,baseUrl = '/api/juniper/sd/ips-signature-management/item-selector/'+ 2323 +'/selected-ids';
        
          
          it("rowId - with params",function() {
            view.gridUtility ={
                getRowIds: function(baseUrl){
                  return true;
                }};
              view.getRowIds().should.be.equal(true);
             
          });
          it("rowId - without params",function() {
            view.gridUtility ={
                getRowIds: function(){
                  return false;
                }};
              view.getRowIds().should.be.equal(false);
             
          });
        });
        describe("Create Action",function() {
          it("create event",function() {
        view.createAction();
      });
        });        
       describe("Bind events",function() {
          var bindEvnt;         
          before(function () {
            var definedEvents = {createEvent:"createAction",deleteEvent:"deleteAction"};
            
                view.parentView.$el= {
                    bind:function(definedEvents){
                      return true;
                    }
                };
                bindEvnt = sinon.stub(view.parentView.$el, 'bind')
            });

            after(function () {
                bindEvnt.restore();
            });
            
            it("Bind Event - createAction",function() {
              var definedEvents = {createEvent:"createAction"};
            
              view.bindEvents(definedEvents);
              bindEvnt.called.should.be.equal(true); 
          });
          it("Bind Event  - deleteAction",function() {
              var definedEvents = {deleteEvent:"deleteAction"};
            
              view.bindEvents(definedEvents);
              bindEvnt.called.should.be.equal(true); 
          });
        });
    describe("deleteAction",function() {
      
      before(function() {
        stub = sinon.stub(view,'deleteRecords');
      });
      after(function() {
        stub.restore();
      })
      it("delete records - with empty data",function() {
        var stub ,e={},selectedObj={};
        view.deleteAction(e,selectedObj);
        view.deleteRecords.called.should.be.equal(true);
      });

      it("delete Action check1 - with less records",function() {
        var stub ,e={},selectedObj={isSelectAll :true, selectedRows: {allRowIds:['2323,5353']}};
        view.deleteAction(e,selectedObj);
      })
      it("delete Action check2 - with more records",function() {
        var stub ,e={},selectedObj={isSelectAll :false,deletedRows:[{id:'232'}], selectedRows: {allRowIds:['2323,5353']}};
        view.deleteAction(e,selectedObj);
     })   
    

    })

  });

});