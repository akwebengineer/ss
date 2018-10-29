define([
    '../../../sd-common/js/signatures/conf/baseSigSelectorFormConf.js',
    "../../../sd-common/js/signatures/views/baseSigAvailableListGridView.js",
    '../../../security-management/js/objects/conf/ipsSigGridConfiguration.js',
      '../../../security-management/js/objects/views/ipsSigAvailableListGridView.js'
  
], function(SigGroupGridConf,baseSigAvailableListGridView, IpsSigGridConfiguration,ipsSigAvailableListGridView){
   describe("Signatures - IPS - Base Available List Grid View", function() { 
    var stub,stub1,getMessage,formElements,gridElements,
     
      activity = new Slipstream.SDK.Activity(),
      view = null ,gridConfig, options = {} ,config = { 'id' :"ips_static_sig"}, context = new Slipstream.SDK.ActivityContext();
   
      options = {
        parentView: { context: context }, 
        formTitleMsgs: null, 
        uuid: '859222', 
        currentView: {uuid : '859222' ,sigGroupGridConf : {},
        gridContainerId : 'ips-sig-static-grid'}
      }

        
      before(function() {
         var e= {},delegateEvent;
       
            view = new baseSigAvailableListGridView(options);
         
            view.config ={id:'ips_static_sig'};
            view.formTitleMsgs = null;
            formConfig = new SigGroupGridConf(context);
            formElements = formConfig.getValues(view.formTitleMsgs) ;
            
            view.gridConf = new IpsSigGridConfiguration(options.parentView.context)
           
            gridConfig = view.gridConf;
            gridElements = gridConfig.getValues(view.config);
           
           formElements = sinon.stub(view, 'updateSigFormLabel', function(formElements){return formElements;});
           gridElements = sinon.stub(view, 'updateSelectorGridConf', function(gridElements){return gridElements;});

           getMessage = sinon.stub(view.context, 'getMessage');
           

            obj = {
                empty : function(){
                    return $('<div class="siggroup"></div>');
                 } 
            } ;
            view.parentView.$el ={
                find : function() {     
                        return  obj;
                }
             };

      
        delegateEvents = sinon.stub(view, 'delegateEvents', function() {});
       
    });

        after(function() {
          getMessage.restore();
          formElements.restore();
          gridElements.restore();
           delegateEvents.restore();
        
        });
     
      it("view render data ", function() {
         view.should.exist;
         view.render();
         view.gridWidget.exist;
      
      });

      it("view render gridOnRowSelection", function() {
        var obj1,obj2,  status =true;
         view.$el = {
                find : function() {
                   return obj1;
                }
              };

              obj1 = {
                empty : function(){
                    return $('<div class="siggroupselector"></div>');
                 },
                bind : function (e,selectedRows) {
                  selectedRows(null,{numberOfSelectedRows : 2});
                  
                  return obj2;
                },
                addClass: function(){

                },
                removeClass : function() {

                }
              }

              obj2 = {
                  
                  gridOnRowSelection : function(e,selectedRows) {

                   },
                   gridOnSelectAll : function(e, status) {

                   }
              }
              view.render();
              view.delegateEvents.called.should.be.equal(true);
      });


      it("view render gridOnSelectAll ", function() {
        var obj1,obj2,status =false;;
         view.$el = {
                find : function() {
                   return obj1;
                }
              };

              obj1 = {
                empty : function(){
                    return $('<div class="siggroupselector"></div>');
                 },
                bind : function (e,selectedRows) {
                  selectedRows(null,{numberOfSelectedRows : 0});
                   
                  return obj2;
                },
                addClass: function(){

                },
                removeClass : function() {

                }
              }

              obj2 = {
                   gridOnRowSelection : function(e,selectedRows) {

                   },
                   gridOnSelectAll : function(e, status) {

                   }
              }
              view.render();
            
      });


      describe("cancel event", function() {
            it("cancel",function() {
                    var event = {
                    type: 'click',
                    preventDefault: function () {}
                };
                view.currentview.overlayLHS = {
                    destroy: function(){}
                };
              view.cancel(event);
              view.currentview.overlayLHS.destroy.should.exist;
            });
      });
       describe("getselectedRows ", function() {
        
        var selections, ids= ['34'];
       
          it("selected Rows - with records", function() {              
            
               var allRowIds = ['343'],ids=[] ,selections = {allRowIds:['343']};
            
                 view.gridWidget ={
                getSelectedRows: function(){
                   return selections['allRowIds'];
                }
            };
                view.getSelectedRows();    
                _.isEmpty(allRowIds).should.be.equal(false);           
          });
           it("selected Rows - with empty records", function() {              
            
               var allRowIds='',ids= ['23'] ,selections = {selectedRowIds:['5656']};
                allRowIds =  selections['allRowIds'];
                 view.gridWidget ={
                getSelectedRows: function(){
                   return ids;
                }
            };
                view.getSelectedRows(); 
                _.isEmpty(allRowIds).should.be.equal(true);              
          });
          
       });

       describe("update event", function() {
         var SelectedRows;
          before(function () {
            SelectedRows = sinon.stub(view, 'getSelectedRows');
         });
          after(function () {
                  SelectedRows.restore();
          });
          it("update",function(){
              var event = {
                    type: 'click',
                    preventDefault: function () {}
                };
                view.currentview.overlayLHS = {
                    destroy: function(){}
                };
            view.update(event);
            SelectedRows.called.should.be.equal(true);
          
          });
       });
        describe("get Row Ids", function() {
          var rowid,baseUrl = '/api/juniper/sd/ips-signature-management/item-selector/'+2323;
        
          
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

    });

});