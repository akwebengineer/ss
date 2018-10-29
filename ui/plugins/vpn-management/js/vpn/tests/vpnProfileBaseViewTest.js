define(['../views/vpnProfileBaseView.js','../models/vpnProfileModel.js'], function (vpnProfileBaseView, vpnModel) {
   describe("VPN - Modify / Profile view", function() {
        var activity, stub,stubs, view = null, intent, model = null,id = "tab-widget",
        context = new Slipstream.SDK.ActivityContext();

      
        before(function() {

            activity = new Slipstream.SDK.Activity();
            stub = sinon.stub(activity, 'getContext', function() {
               return new Slipstream.SDK.ActivityContext();
            });
           
            intent = sinon.stub(activity, 'getIntent', function() {
                return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE);
            });

            model = new vpnModel();
    
            view = new vpnProfileBaseView({
                activity: activity,
                model: model,
                formMode: "CREATE",
                context: stub
            });
          
            getMessage = sinon.stub(context, "getMessage", function(msg) {return msg;})
        });
        after(function() {
           stub.restore();
           intent.restore();
           getMessage.restore();
           //stubs.restore();
        });     
        
        it("spy view data", function() {
            view.form ={
                isValidInput  : function(){                        
                    return true;
                },
                showFormError : function() {
                    return true;
                }
            };
        });    

        it(" model exists ?", function() {
            view.model.should.exist;
        });

        it("view should exist", function() {
            view.should.exist;
        });

        it("view rendred, view form should exist", function() {
           view.render();
           view.form.should.exist;
        });
        
        it("view.formMode should be CREATE", function() {
            view.formMode.should.be.equal('CREATE');
        });
    
        describe("addDynamicFormConfig",function() {

            var ResourceView = {},addDynamicFormConfi,
                formConfiguration = {
                    "add_remote_name_validation": "name",
                    "buttonsAlignedRight": true,
                    "err_div_id": "errorDiv",
                    "form_id": "vpn-profile-configuration",
                    "form_name": "vpn-profile-configuration",
                    "on_overlay": true

                };
           
            it("call addDynamicFormConfig, to set the form title on - CREATE Mode", function() {
                
               view.addDynamicFormConfig(formConfiguration);
            });
        }); 

        describe("Tab Widgets", function() {
            it(" widget not exist", function() {
               view.$el.find(id).empty().should.exist;
            });

            describe ("widget - with activity", function() {
               
                before(function(){
                    contextVal  = view.activity ? view.activity.getContext() : view.context;
                });
                
                it("Tab with activity exist", function() {
                    view.addTabWidget("tab.widget");
                    view.tabContainerWidget.build.should.exist;
                });
            });

            describe (" widget - without activity", function() {
               
                before(function(){
                    view.activity = "";
                    contextVal  = view.activity ? view.activity.getContext() : view.context;
                });
               
                it("tab without activity exist", function() {
                    view.addTabWidget("tab.widget");
                });
            });
             describe ("widget- with no model", function() {
               
                before(function(){
                    view.model = null;
                    phase1Model = view.model ? new Backbone.Model(view.model.get("phase1-setting")) : new Backbone.Model(),
                    phase2Model = view.model ? new Backbone.Model(view.model.get("phase2-setting")) : new Backbone.Model();
                });
               
                it("Tab without model exist", function() {
                    view.addTabWidget("tab.widget");
                });
            });
            
            describe("destroy widget",function() {
                it("tabs widget destroyed", function() {
                    view.tabContainerWidget = {
                        destroy: function() {}
                    };
                    sinon.spy(view.tabContainerWidget, "destroy");
                    view.destroytabContainerWidget();
                    view.tabContainerWidget.destroy.calledOnce.should.be.equal(true);
                });
            });
        }) ;

        describe("check duplicate value",function(){
            it("checkDuplicateVal -when true", function() {
                var arrDuplicate = ['aa', 'aa'];                
                view.checkDuplicateVal(arrDuplicate).should.be.equal(true);
              
            });
            it("checkDuplicateVal -when false", function() {
                var arrDuplicate = [];                
                view.checkDuplicateVal(arrDuplicate).should.be.equal(false);

            });
        });

        describe("Tab-Validation",function() {
            var chkduplicate, profile = {
                    "phase1-setting": {
                        "dpd-interval": '',
                        "nat-traversal-keep-alive": '',
                        "phase1-proposal-type": 'CUSTOM',
                        "custom-phase1-proposals": {
                            "phase1-proposal": []
                        }
                    },
                    "phase2-setting": {
                        "idle-time": '',
                        "phase2-proposal-type": 'CUSTOM',
                        "custom-phase2-proposals": {
                            "phase2-proposal": []
                        }
                    }
                };
            before(function(){
                chkduplicate = sinon.stub(view, "checkDuplicateVal", function() {return true;});

            });
            after(function(){
                chkduplicate.restore();
            });

            it( "Phase1 - Custom - length:0",function() {
                   view.vpnTabValidation(profile, view).should.be.equal(false);
           
            var text=  getMessage('vpn_proposal_phase1_empty_list_error');
                   getMessage.args[0][0].should.be.equal('vpn_proposal_phase1_empty_list_error');
             });

            

                 
            it("Phase1 - custom - length >0",function() {
                profile["phase1-setting"]["custom-phase1-proposals"]["phase1-proposal"].push({name:'test'});
                profile["phase2-setting"]["custom-phase2-proposals"]["phase2-proposal"] = [];
                
                view.vpnTabValidation(profile, view).should.be.equal(false);
             });
            it("Phase2 - custom - length:0",function() {
               
                profile["phase1-setting"] = {};
                profile["phase2-setting"]["custom-phase2-proposals"]["phase2-proposal"] = [];
            
                view.vpnTabValidation(profile, view);
                   getMessage('vpn_proposal_phase2_empty_list_error');
                   getMessage.args[1][0].should.be.equal('vpn_proposal_phase2_empty_list_error');
                   

             });
            it("Phase2 - custom -lenght>0",function() {
                
                profile["phase1-setting"] = {};
                profile["phase2-setting"]["custom-phase2-proposals"]["phase2-proposal"].push({name:'test'});
                view.vpnTabValidation(profile, view).should.be.equal(false);
             });

            it( "Phase1 -nat-traversal-keep-alive check ",function() {
                profile["phase1-setting"]["nat-traversal-keep-alive"] = 20;
                profile["phase1-setting"]["phase1-proposal-type"]= "Default";                
                profile["phase2-setting"]["phase2-proposal-type"]= "Default";
                 profile["phase1-setting"]["dpd-interval"] = '';
                 profile["phase2-setting"]["idle-time"] = '';
                               
               
               
                profile["phase1-setting"]["nat-traversal-keep-alive"] = {
                    match: function() {
                        return false;
                    }
                };
               
                view.vpnTabValidation(profile, view).should.be.equal(false);
                 getMessage('vpn_profile_form_field_range_error', ["1", "300"]);
                 getMessage.args[2][0].should.be.equal('vpn_profile_form_field_range_error');
                  getMessage.args[2][1].should.be.instanceof(Array);
                    (getMessage.args[2][1].length > 0).should.be.equal(true);
                    getMessage.args[2][1][0].should.be.equal("1");
                getMessage.args[2][1][1].should.be.equal("300");
                   
             });
            
            it( "Phase1 -dpd-interval check ",function() {
             
                profile["phase1-setting"]["nat-traversal-keep-alive"] = '';
                profile["phase1-setting"]["dpd-interval"] = 20;
                profile["phase2-setting"]["idle-time"] = '';
                profile["phase1-setting"]["phase1-proposal-type"]= "Default";                
                profile["phase2-setting"]["phase2-proposal-type"]= "Default";                
               
                                
                profile["phase1-setting"]["dpd-interval"] = {
                    match: function() {
                        return false;
                    }
                };
                 

                view.vpnTabValidation(profile, view).should.be.equal(false);
                 getMessage('vpn_profile_form_field_range_error', ["10", "60"]);
                 getMessage.args[3][0].should.be.equal('vpn_profile_form_field_range_error');
                  getMessage.args[3][1].should.be.instanceof(Array);
                    (getMessage.args[3][1].length > 0).should.be.equal(true);
                    getMessage.args[3][1][0].should.be.equal("10");
                getMessage.args[3][1][1].should.be.equal("60");
             });
        
            it( "Phase2 -Idle Time check ",function() {
                profile["phase1-setting"]["phase1-proposal-type"]= "Default";                
                profile["phase2-setting"]["phase2-proposal-type"]= "Default";                
                profile["phase2-setting"]["idle-time"]= 20;                
                profile["phase1-setting"]["nat-traversal-keep-alive"] = '';
                profile["phase1-setting"]["dpd-interval"] = '';
                
                profile["phase2-setting"]["idle-time"] = {
                    match: function() {
                        return false;
                    }
                };
                
                view.vpnTabValidation(profile, view).should.be.equal(false);
                 getMessage('vpn_profile_form_field_range_error', ["60", "999999"]);
                 getMessage.args[4][0].should.be.equal('vpn_profile_form_field_range_error');
                  getMessage.args[4][1].should.be.instanceof(Array);
                    (getMessage.args[4][1].length > 0).should.be.equal(true);
                    getMessage.args[4][1][0].should.be.equal("60");
                getMessage.args[4][1][1].should.be.equal("999999");
             });
            
            it( "Tab Validation- success ",function() {
                profile = {
                    "phase1-setting": {
                        "dpd-interval": '',
                        "nat-traversal-keep-alive": '',
                        "phase1-proposal-type": 'default',
                        "custom-phase1-proposals": {
                            "phase1-proposal": []
                        }
                    },
                    "phase2-setting": {
                        "idle-time": '',
                        "phase2-proposal-type": 'Default',
                        "custom-phase2-proposals": {
                            "phase2-proposal": []
                        }
                    }
                };
                
                view.vpnTabValidation(profile, view).should.be.equal(true);
             });
        
        });
      
    });    

});