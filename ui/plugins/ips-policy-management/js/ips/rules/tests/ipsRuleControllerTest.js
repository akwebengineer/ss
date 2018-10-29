/*global describe, define, Slipstream, it, beforeEach, $, before, sinon, console, afterEach, after*/

define([
    '../controller/ipsRulesController.js',
    '../../../../../base-policy-management/js/policy-management/rules/controller/baseRuleController.js',
    '../models/ipsRuleCollection.js',
    '../views/ipsRulesView.js',
    '../constants/ipsRuleGridConstants.js',
    'widgets/confirmationDialog/confirmationDialogWidget'
    
   
], function (IPSRulesController,BaseController,ipsCollection,View,Constants,ConfirmationDialogWidget) {
    describe ('IPS UT', function() {
        var ipsRulesController, context = new Slipstream.SDK.ActivityContext(),
            policy = {id: 123}, CUID = '';
        var response={'policy' : [""]};
        var collection={};
        var status = "";
        var opt ={        
            policyObj:policy,
            launchWizard:"true",
            context: context,
            cuid: CUID,
            extras:{},       
            actionEvents:{}
        };

        var editRow ={
                    currentRowData : {
                        action : 'PERMIT'
                    },
                    currentRowFields:[                    
                    ],
                    currentRow:[                    
                    ]
                }; 
              
        editRow.currentRowFields["services.service-reference"]={
            childNodes : [{
                nodeName:{
                    toLowerCase : function(){
                        return true;  
                    }
                },
                val : function(){
                return true;  
                }
            }]
        }
        editRow.currentRowFields["notification"]={
            childNodes : [{
                nodeName:{
                    toLowerCase : function(){
                        return true;  
                    }
                },
                val : function(){
                return true;  
                }
            }]
        }
        editRow.currentRowFields["additional"]={
            childNodes : [{
                nodeName:{
                    toLowerCase : function(){
                        return true;  
                    }
                },
                val : function(){
                return true;  
                }
            }]
        }
        editRow.currentRowFields["ipaction"]={
            childNodes : [{
                nodeName:{
                    toLowerCase : function(){
                        return true;  
                    }
                },
                val : function(){
                return true;  
                }
            }]
        }
        editRow.currentRowFields["action-data.action"]={
            childNodes : [{
                nodeName:{
                    toLowerCase : function(){
                        return true;  
                    }
                },
                val : function(){
                return true;  
                }
            }]
        }
        editRow.currentRow["services.service-reference"] = {};
        editRow.currentRow["notification"] = {};
        editRow.currentRow["ipaction"] = {};
        editRow.currentRow["additional"] = {};
        editRow.currentRow["action-data.action"] = {}; 

        var currentRule ={
                        get : function (){                        
                            return true;
                        }
                    };  

    before(function(){
        
        if(window.Juniper === undefined){
           window.Juniper={sm:{CURRENT_DOMAIN_ID:"2"}}; 
        }
              
        viewInitializeStub1 = sinon.stub(BaseController.prototype, 'initialize');       
        ipsRulesController = new IPSRulesController(opt);
        ipsRulesController.actionEvents={
            advancePolicy : {
                name:""
            },
            ipsRule : {
                name:""
            },
            exemptRule  : {
                name:""
            }
        };
        ipsRulesController.ruleCollection = {
            reloadHitCount : function (){
                return true;
            },
            getNewRule : function (){
                return true;
            },
            bind : function (){
                return true;
            },
            get : function (){
                return {
                    get : function(){
                        return {
                                toLowerCase :function(){
                                    return "ips"
                                }
                            }
                        }
                    }                
            },
            addRule : function (){
                return true;
            }

        };      
        ipsRulesController.view= {
           ruleGrid :
           {
             actionEditor :
             {
                conf : {
                        $container : {
                            type: 'change', 
                            jQuery : function(){
                                console.log("test");
                            },
                            selector:".ipsactioneditor",
                            off : function(){
                                return true;

                            },
                            on : function(){
                                return true;
                                
                            }
                        }
                       }
             }
           },
           $el : {
                bind : function(){
                    return {
                            bind : function(){
                                return true
                        }
                    }
                }
            }
        };      
        ipsRulesController.ENABLE_LOCKING = true;   
    });

    after(function () {    
            delete  window.Juniper;            
            viewInitializeStub1.restore();   
        });

    describe('ips Rule Controller test', function () {

        before(function () { 
                 
            bindGridEvents = sinon.stub(BaseController.prototype, 'bindGridEvents');            
            handleRowDataEdit = sinon.stub(BaseController.prototype, 'handleRowDataEdit');
            checkAction = sinon.stub(ipsRulesController, 'checkAction');
            formatAddressEditors = sinon.stub(ipsRulesController, 'formatAddressEditors');          
            
        });

        after(function () {           
            bindGridEvents.restore();            
            handleRowDataEdit.restore();
            checkAction.restore();
            formatAddressEditors.restore(); 
              
        });        

        it('bindGridEvents', function () {  
                ipsRulesController.bindGridEvents(); 
                 /*bind = sinon.stub(ipsRulesController.view.$el,"bind");                           
                ipsRulesController.bindGridEvents(); 
                bind.restore();*/                         
               
        });

        it('Handle Row Data Edit ', function () {             
                var editModeRow ={
                    currentRowData : {
                        action : ''
                    },
                    currentRowFields:[]
                } ;  
                 var currentRule ={
                    get : function (){                        
                        return {}
                            
                    }
                };
                          
                stub1 = sinon.stub(ipsRulesController.formatAddressEditors, "apply"); 
                stub2 = sinon.stub(ipsRulesController.checkEditors, "apply");               
                ipsRulesController.handleRowDataEdit(editModeRow);
                stub1.called.should.be.equal(true);
                stub2.called.should.be.equal(true);               
                stub2.restore();
                stub1.restore();              
        });
        

        it('Handler For Advance Button', function () {            
            
            var model={};
            var fetchSuccessSpy = sinon.spy(function (object) {                     
                    object.success(collection, response, opt)
                });           
            ipsRulesController.policyModel = {
                fetch : fetchSuccessSpy,
                set : function(){
                        return true;
                },
                save : function(){
                        return true;
                }               
            };
            var spy1 = sinon.spy(Backbone.Model.prototype, 'initialize');
            ipsRulesController.handlerForAdvanceButton();
            var conf = spy1.args[0][0];
            conf.yesButtonCallback.call(ipsRulesController);            
            assert(fetchSuccessSpy.called);
           // assert(fetchSaveSpy.called);           
            var confirmationDialogWidget = new ConfirmationDialogWidget(conf);
            sinon.spy(confirmationDialogWidget, "destroy");
            confirmationDialogWidget.destroy.called.should.be.equal(false);  
            conf.noButtonCallback.call(ipsRulesController);  
        });  

         it('Create Rule Handler', function () {
            ipsRulesController.createRuleHandler();               
            sinon.spy(ipsRulesController.ruleCollection, "addRule");            
            ipsRulesController.ruleCollection.addRule.called.should.be.equal(false);                    
            
        });   
    });
    
    describe('ips Rule Controller Format Address Editors test:', function () {

        it('Format Address Editors', function () {
            var currentRule ={
                    get : function (){
                       return {"exclude-list":true};
                    }
            }               
            editRow.should.exist;
            currentRule.should.exist;  
            ipsRulesController.formatAddressEditors(editRow,currentRule);                          
               
        });

        it('Check Action  ', function () {          
            var currentRule ={
                    get : function (){                         
                        return "DENY";
                    }
            }
            ipsRulesController.checkAction(editRow,currentRule);
              
        });


        it('Check Editors ', function () {          
            var currentRule ={
                    get : function (){                         
                        return "Exempt";
                    }
                }         
           ipsRulesController.checkEditors(editRow,currentRule);
              
        });
        it('Remove Editors Notification ', function () {            
            var keyValue = "notification";                  
            ipsRulesController.removeEditor(editRow,keyValue);
              
        });

        it('On Action Change', function () {
            var e ={};           
            var currentRule ={
                get : function (){                        
                    return "";
                },
                set : function (){                        
                    return "";
                }
            }                
            ipsRulesController.ruleCollection = {
                modifyRule : function(){
                    return true
                }
            };
            ipsRulesController.actionEditor.conf.$container =[{
               value : 'class-of-service' 
            }]; 
            ipsRulesController.onActionChange(currentRule);              
         });

        it('On Action Change', function () {
            var e ={};           
            var currentRule ={
                get : function (){                        
                    return "";
                },
                set : function (){                        
                    return "";
                }
            }                
            ipsRulesController.ruleCollection = {
                modifyRule : function(){
                    return true
                }
            };
            ipsRulesController.actionEditor.conf.$container =[{
               value : '' 
            }]; 
            stub1 = sinon.stub(ipsRulesController.ruleCollection,"modifyRule");
            ipsRulesController.onActionChange(currentRule); 
            stub1.called.should.be.equal(true);                  
            stub1.restore();                             
         });
      });
    });

});
