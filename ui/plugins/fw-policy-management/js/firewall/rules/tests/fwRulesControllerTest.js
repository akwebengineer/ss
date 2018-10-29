/*global describe, define, Slipstream, it, beforeEach, $, before, sinon, console, afterEach, after*/
define([
    '../controller/fwRulesController.js',
    '../../../../../base-policy-management/js/policy-management/rules/controller/baseRuleController.js',
    '../models/fwRuleCollection.js',
    '../views/fwRulesView.js',
    '../constants/fwRuleGridConstants.js',   
    
   
], function (FirewallRulesController,BaseController,FwCollection,View,Constants) {
    describe('FW Rules Controller UT', function() {
        var fwRulesController, context = new Slipstream.SDK.ActivityContext(),
        policy = {id: 123}, CUID = ''; 
        var response={};
        var status = "";
        var opt ={
            
            policyObj:policy,
            launchWizard:"true", 
            context: context,
            cuid: CUID,
            extras:{},       

        };
        var editRow ={
                        currentRowData : {
                            action : 'PERMIT'
                        },
                        currentRowFields:[                    
                        ]
                    } ; 
                   
        editRow.currentRowFields["ips-enabled"]={
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
        editRow.currentRowFields["scheduler"]={
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
   
    before(function(){  
     
        if(window.Juniper === undefined){
           window.Juniper={sm:{CURRENT_DOMAIN_ID:"2"}}; 
        }    
        viewInitializeStub1 = sinon.stub(BaseController.prototype, 'initialize');     
        fwRulesController = new FirewallRulesController(opt);
        fwRulesController.ruleCollection = {
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
                return true;
            }
        };fwRulesController.ENABLE_LOCKING = true;
        fwRulesController.view= {
           fwRuleGridConf :
           {
             actionEditor :
             {
                conf : {
                        $container : {                        

                            type: 'change', 
                            jQuery : function(){
                                console.log("test");
                            },
                            selector:".fwactioneditor",
                            off : function(){
                                return true;

                            },
                            on : function(){
                                return true
                                
                            }
                        }
                    }
             }
           }
        };
    });

    after(function () { 
            delete  window.Juniper;
            viewInitializeStub1.restore();
    });

    describe('Fw Rule Controller test:', function () {


        before(function () {            
            handleFetchStub = sinon.stub(BaseController.prototype, 'handleFetchComplete');
            afterResetStoreOnDiscard = sinon.stub(BaseController.prototype, 'afterResetStoreOnDiscard');
            handleRowDataEdit = sinon.stub(BaseController.prototype, 'handleRowDataEdit');
            checkAction = sinon.stub(fwRulesController, 'checkAction');
            formatAddressEditors = sinon.stub(fwRulesController, 'formatAddressEditors');
            handleAfterCreateRule = sinon.stub(BaseController.prototype, 'handleAfterCreateRule');
            
        });

        after(function () {
            handleFetchStub.restore();
            afterResetStoreOnDiscard.restore();
            handleRowDataEdit.restore();
            checkAction.restore();
            formatAddressEditors.restore();
            handleAfterCreateRule.restore();
        });

        it('Check Launch wizard', function () {  
               
                fwRulesController.launchWizard.should.be.equal('true');

                sinon.spy(fwRulesController.ruleCollection, "reloadHitCount");
                fwRulesController.ruleCollection.reloadHitCount.called.should.be.equal(false);
                sinon.spy(fwRulesController, "createRuleHandler");
                fwRulesController.createRuleHandler.called.should.be.equal(false);            
                fwRulesController.handleFetchComplete(FwCollection, response, opt);
                              
                fwRulesController.launchWizard.should.be.equal('false');            
               
        });     


        it('Check After Reset ', function () { 
        
                fwRulesController.reloadHitDone.should.be.equal(true);                               
                fwRulesController.afterResetStoreOnDiscard(response, status) ; 
                fwRulesController.reloadHitDone.should.be.equal(false);           
               
        });

        it('Handle Row Data Edit on DENY action ', function () { 
         
                var editModeRow ={
                    currentRowData : {
                        action : 'DENY'
                    },
                    currentRowFields:[]
                } ;                             
                stub2 =sinon.stub(fwRulesController.checkAction, "apply");  
                stub1 =sinon.stub(fwRulesController.formatAddressEditors, "apply");                         
                fwRulesController.handleRowDataEdit(editModeRow);
                stub2.called.should.be.equal(true);
                stub1.called.should.be.equal(true);
                stub2.restore();
                stub1.restore();                           
               
        });


        it('Handle Row Data Edit on PERMIT action', function () { 
        
                var editModeRow ={
                    currentRowData : {
                        action : 'PERMIT'
                    },
                    currentRowFields:[]
                } ;                             
                stub2 =sinon.stub(fwRulesController.checkAction, "apply");  
                stub1 =sinon.stub(fwRulesController.formatAddressEditors, "apply");                         
                fwRulesController.handleRowDataEdit(editModeRow);
                stub2.called.should.be.equal(true);
                stub1.called.should.be.equal(true);
                stub2.restore();
                stub1.restore();                           
               
        });

        it('Handle After Create Rule', function () { 
                var data ="";                 
                sinon.spy(fwRulesController.overlay, "destroy");
                fwRulesController.overlay.destroy.calledOnce.should.be.equal(false);                    
                fwRulesController.handleAfterCreateRule(data) ;                 
                fwRulesController.overlay.destroy.calledOnce.should.be.equal(true);
        });        
       

    });
    
    describe('Fw Rule Controller Format Address Editors test:', function () {

        it('Format Address Editors', function () {
             var currentRule ={
                    get : function (){
                       return {"exclude-list":true};
                    }
                }
            fwRulesController.formatAddressEditors(editRow,currentRule);                           
               
        });

        it('Check Action ', function () {         
            var currentRule ={
                    get : function (){                         
                        return "DENY";
                    }
                }                
            fwRulesController.checkAction(editRow,currentRule);           
        });

        it('Check Action PERMIT', function () {
            var e ={};           
            var currentRule ={
                    get : function (){                        
                        return "PERMIT";
                    }
                }
                fwRulesController.checkAction(editRow,currentRule);                                 
        }); 

        it('On Action PERMIT', function () {
                var e ={};           
                 var currentRule ={
                    get : function (){                        
                        return "PERMIT";
                    },
                    set : function (){                        
                        return "PERMIT";
                    }
                }
                fwRulesController.ruleCollection = {
                    modifyRule : function(){
                        return true
                    }
                };
                fwRulesController.actionEditor.conf.$container =[{
                   value : "PERMIT" 
                }];
                stub1 = sinon.stub(fwRulesController.ruleCollection,"modifyRule");
                fwRulesController.onActionChange(currentRule); 
                stub1.called.should.be.equal(true);                  
                stub1.restore();                                     
               
        });
         it('On Action TUNNEL', function () {
                var e ={};           
                 var currentRule ={
                    get : function (){                        
                        return "TUNNEL";
                    },
                    set : function (){                        
                        return "TUNNEL";
                    }
                }
                fwRulesController.ruleCollection = {
                    modifyRule : function(){
                        return true
                    }
                };
                fwRulesController.actionEditor.conf.$container =[{
                   value : "TUNNEL" 
                }];
                fwRulesController.onActionChange(currentRule);                                                                   
               
        }); 
         it('On Action DENY', function () {
                var e ={};           
                 var currentRule ={
                    get : function (){                        
                        return "DENY";
                    },
                    set : function (){                        
                        return "DENY";
                    }
                }                
                fwRulesController.ruleCollection = {
                    modifyRule : function(){
                        return true
                    }
                };
                fwRulesController.actionEditor.conf.$container =[{
                   value : "DENY" 
                }];                
                stub1 = sinon.stub(fwRulesController.ruleCollection,"modifyRule");
                fwRulesController.onActionChange(currentRule); 
                stub1.called.should.be.equal(true);                  
                stub1.restore();                 
               
        });  

    });

 });
});
