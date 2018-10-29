/*global describe, define, Slnattream, it, beforeEach, $, before, sinon, console, afterEach, after*/

define([
    '../controller/natRulesController.js',
    '../../../../../base-policy-management/js/policy-management/rules/controller/baseRuleController.js',
    '../models/natRuleCollection.js',
    '../views/natRulesView.js',
    '../constants/natRuleGridConstants.js',
    
   
], function (NATRulesController,BaseController,natCollection,View,Constants) {
    describe('NAT Rules Controller UT', function() { 
        var natRulesController, context = new Slipstream.SDK.ActivityContext(),
            policy = {id: 123}, CUID = '';
        var response={};
        var status = "";
        var opt ={        
            policyObj:policy,
            launchWizard:"true",
            context: context,
            cuid: CUID,
            extras:{}      
        };
        var editModeRow ={
            currentRowData : {
                action : ''
            },
            currentRowFields:[],
            currentRow:[] 
        };    
        var editRow ={
            currentRowData : {
                action : ''
            },
            currentRowFields:[],
            currentRow:[]               
        };
                  
        editRow.currentRowFields["translated-packet.pool-addresses"]={
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
        editRow.currentRowFields["translated-packet.translated-address"]={
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
        editRow.currentRowFields["original-packet.src-ports"]={
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
        editRow.currentRowFields["original-packet.dst-traffic-match-value.dst-traffic-match-value"]={
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
        editRow.currentRowFields["original-packet.protocol.protocol-data"]={
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
        editRow.currentRowFields["original-packet.dst-traffic-match-value.dst-traffic-match-value"]={
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
        natRulesController = new NATRulesController(opt);
          natRulesController.actionEvents={
            sourceRule : {
                name:"source"
            },
            staticRule : {
                name:"static"
            },
            destinationRule  : {
                name:"destination"
            }
        };      
        natRulesController.ruleCollection = {
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
                        return "SOURCE";
                        }
                    }                
            },
            addRule : function (){
                return true;
            }

        };
        natRulesController.view= {        
           $el : {
                bind: function(){
                    return {
                            bind: function(){
                                return {
                                    bind: function(){
                                        return ""
                                    }
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

    describe('nat Rule Controller test:', function () {        
        before(function () {            
           bindGridEvents = sinon.stub(BaseController.prototype, 'bindGridEvents');          
                 
        });
        after(function () {
           bindGridEvents.restore();                    
        });      

        it('bindGridEvents', function () {        
                natRulesController.bindGridEvents();  
                /*bind = sinon.stub(natRulesController.view.$el,"bind");                           
                natRulesController.bindGridEvents(); 
                bind.restore();*/              
        });

        it('Handle Row Data Edit ', function () {        
                stub1 = sinon.stub(natRulesController, "checkEditors");                              
                natRulesController.handleRowDataEdit(editRow);                                
                stub1.called.should.be.equal(true);
                stub1.restore();       
        });      
  
        it('Create Rule Handler', function () {
            natRulesController.createRuleHandler();               
            sinon.spy(natRulesController.ruleCollection, "addRule");            
            natRulesController.ruleCollection.addRule.called.should.be.equal(false);                   
        }); 
        
        it('Check Editors SOURCE', function () {
            var currentRule ={
                    get : function (){                        
                        return "SOURCE"                            
                    }
                };
            stub2 =sinon.stub(natRulesController, "validateServicesProtocolsPortsEditors");         
            natRulesController.checkEditors(editRow,currentRule);            
            stub2.args[0][1].should.be.equal("SOURCE");
            stub2.called.should.be.equal(true);
            stub2.restore();              
        });

         it('Check Editors DESTINATION', function () {
            var currentRule ={
                    get : function (){                        
                        return "DESTINATION"                            
                    }
                };               
            stub2 =sinon.stub(natRulesController, "validateServicesProtocolsPortsEditors");         
            natRulesController.checkEditors(editRow,currentRule);
            
            stub2.args[0][1].should.be.equal("DESTINATION");
            stub2.called.should.be.equal(true);
            stub2.restore();              
        });

        it('Check Editors STATIC', function () {
            var currentRule ={
                    get : function (){                        
                        return "STATIC"                            
                    }
                };
            stub2 =sinon.stub(natRulesController, "validateServicesProtocolsPortsEditors");         
            natRulesController.checkEditors(editRow,currentRule);            
            stub2.args[0][1].should.be.equal("STATIC");
            stub2.called.should.be.equal(true);
            stub2.restore();
        }); 

        it('Remove Editors Notification ', function () {
            var keyValue = "translated-packet.pool-addresses";            
            natRulesController.removeEditor(editRow,keyValue);
              
        });

        it('Disable Editors Notification ', function () {
            var keyValue = "translated-packet.pool-addresses";                    
            var errorMsg ="";
            natRulesController.disableEditor(editRow,keyValue, errorMsg);              
        });

        it('Enable Editors Notification ', function () {
            var keyValue = "translated-packet.pool-addresses";            
            natRulesController.enableEditor(editRow,keyValue);              
        });

        it('Validate Services Protocols Ports Editors ', function () {           
            var natType ="SOURCE";
            var currentRule ={
                    get : function (){                        
                        return {
                            'protocol' : {},
                            'src-port-sets' : {},
                            'dst-port-sets' : {},
                            'src-ports' :"notEmpty",
                            'dst-ports' :{}
                        }                            
                    }
            };
            stub2 =sinon.stub(natRulesController, "enableEditor"); 
            stub1 =sinon.stub(natRulesController, "disableEditor");         
            natRulesController.validateServicesProtocolsPortsEditors(currentRule, natType, editRow);            
            stub1.args[0][1].should.be.equal("services.service-reference");            
            stub2.args[0][1].should.be.equal("original-packet.dst-ports");
            stub2.args[1][1].should.be.equal("original-packet.src-ports");
            stub2.args[2][1].should.be.equal("original-packet.protocol.protocol-data");
            stub2.called.should.be.equal(true);
            stub1.called.should.be.equal(true);
            stub2.restore();
            stub1.restore();  
        });

         it('Validate Services Protocols Ports Editors not Empty Services ', function () {                       
            var natType ="SOURCE";
            var currentRule ={
                    get : function (){                        
                        return {
                            'protocol' : {},
                            'src-port-sets' : {},
                            'dst-port-sets' : {},
                            'src-ports' :"notEmpty",
                            'dst-ports' :{},
                            'service-reference' :"notEmpty"
                        }                            
                    }
            };
            stub2 =sinon.stub(natRulesController, "enableEditor");  
            stub1 =sinon.stub(natRulesController, "disableEditor");       
            natRulesController.validateServicesProtocolsPortsEditors(currentRule, natType, editRow);           
            stub2.args[0][1].should.be.equal("services.service-reference");            
            stub1.args[0][1].should.be.equal("original-packet.dst-ports");
            stub1.args[1][1].should.be.equal("original-packet.src-ports");
            stub1.args[2][1].should.be.equal("original-packet.protocol.protocol-data");
            stub2.called.should.be.equal(true);
            stub1.called.should.be.equal(true);
            stub2.restore();
            stub1.restore();   
        }); 

        });   
    }); 
});
