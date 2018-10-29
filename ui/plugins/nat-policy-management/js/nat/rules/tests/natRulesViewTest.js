define([
    '../../rules/views/natRulesView.js',
    '../constants/natRuleGridConstants.js',
    '../models/natRuleCollection.js',
    '../../../../../base-policy-management/js/policy-management/rules/views/baseRulesView.js',
   
], function (View,Constants, Collection,BaseRulesView) {

    var natRulesView, context = new Slipstream.SDK.ActivityContext(),
        policy = {id: 123}, CUID = '', rulesView, domainPolicyStub, customButtons;
      
    describe('NAT Rules View UT', function () {
       
        before(function () {
            customButtons = [];
            $.mockjax.clear();
            $.mockjax({
                url: '/api/juniper/sd/policy-management/firewall/policies/draft/rules/save-comments',
                type: 'GET',
                responseText: true
            });
            $.mockjax({
                url: '/api/juniper/sd/policy-management/firewall/policies/123/draft/rules/filter?*',
                type: 'POST',
                responseText: true
            });


        });

        after(function () {
            $.mockjax.clear();
            domainPolicyStub.restore();
        });

        describe('Basic Functionality Testing', function () {
            var stub1, stub2, stub3;
            before(function () {
                
                stub1 = sinon.stub(View.prototype, 'buildActionEvents');
                stub2 = sinon.stub(View.prototype, 'subscribeNotifications');
                stub3 = sinon.stub(View.prototype, 'handleNavigateAway');
            });

            it('Creates the view object', function () {
                
                natRulesView = new View({
                    context: context,
                    actionEvents: {},
                    ruleCollection: new Collection(CUID, policy, context),
                    policyManagementConstants: Constants,
                    cuid: CUID,
                    extras: {filter: 'filter'}
                });

                natRulesView.should.exist;
                stub1.restore();
                stub2.restore();
                stub3.restore();

                natRulesView.customActionKeys = {
                    SAVE: 'save',
                    DISCARD: 'discard',
                    PUBLISH: 'publish',
                    UPDATE: 'update'
                }

                natRulesView.gridWidgetObject = {
                    updateActionStatus: function () {

                    }
                }

                var div = $('<div id = "saveRules_button"/>');
                natRulesView.$el.append(div);

                div = $('<div id = "discardRules_button"/>');
                natRulesView.$el.append(div);
                div = $('<div id = "publishRules_button"/>');
                natRulesView.$el.append(div);
                div = $('<div id = "updatePublishedRules_button"/>');
                natRulesView.$el.append(div);


                domainPolicyStub = sinon.stub(natRulesView.ruleCollection, 'isSameDomainPolicy', function () {
                    return true;
                });
            });

            it('Checks if the grid is configured properly', function () {                
                var state;
                state = natRulesView.getRuleGridConfiguration();
                assert(typeof state === "object");
                state.actionButtons.defaultButtons.create.key.should.be.equal("createEvent");
                state.actionButtons.defaultButtons.create.items[0].key.should.be.equal("sourceRule");
                state.actionButtons.defaultButtons.create.items[1].key.should.be.equal("staticRule");
                state.actionButtons.defaultButtons.create.items[2].key.should.be.equal("destinationRule");

            }); 

            it('Checks if the grid is configured properly', function () {
                natRulesView.context.module = {
                    getExtras : function(){
                            var arr = {
                                'policy-version-details' : '"policy"'
                            };
                            return arr
                    }
                };                
                natRulesView.afterRender();               

            });   

            it('get Context Menu', function () {               
                var state;
                state = natRulesView.getContextMenu();
                assert(typeof state === "object");

            }); 

            it('Checks if the grid Table is configured properly', function () {
                
                var state;
                state = natRulesView.getGridTable();
                assert(typeof state === "object");             
            });   

             
            it('build Action Events', function () {
                 
                stub1 = sinon.stub(BaseRulesView.prototype.buildActionEvents, "call");
                var state;
                state = natRulesView.buildActionEvents();
                assert(typeof state === "object");
                stub1.called.should.be.equal(true);
                stub1.restore(); 
            }); 
              
            it('Checks if the grid has save button', function () {
                
                var state;
                state = natRulesView.hasRuleGridSaveButton();
                assert(typeof state === "boolean");             
            }); 

            it('Checks if the grid has discard button', function () {
                
                var state;
                state = natRulesView.hasRuleGridDiscardButton();
                assert(typeof state === "boolean");             
            }); 

            it('Checks if the grid has publish button', function () {
                
                var state;
                state = natRulesView.hasRuleGridPublishUpdateButtons();
                assert(typeof state === "boolean");             
            });  
            
            it('Checks cellTooltip translated-packet.translated-address', function () {
                
                var  renderTooltip = function(){
                    return true
                };
                natRulesView.ruleCollection = {
                    get : function(){
                        return {
                            get : function(){
                                return true
                            }
                        };
                    }
                }
                var cellData = {
                    columnName :"translated-packet.translated-address",
                    rowData :{
                        "translated-packet.translated-address" : [""]
                    },
                    rowId : null
                }; 
                natRulesView.cellTooltip(cellData, renderTooltip);
               

            });  

            it('Checks cellTooltip original-packet.src-traffic-match 1', function () {
                 
                var  renderTooltip = function(){ 
                    
                };
                var cellData = {
                    columnName :"original-packet.src-traffic-match-value.src-traffic-match-value",
                    rowData :[],
                    cellId :"cellid"
                }; 
                natRulesView.cellTooltip(cellData, renderTooltip);
               

            });
            

            it('Checks cellTooltip original-packet.src-ports', function () {
                 
                var  renderTooltip = function(){
                    return true
                };
                var cellData = {
                    columnName :"original-packet.src-ports",
                    rowData :[],
                    cellId :{}
                }; 
                natRulesView.cellTooltip(cellData, renderTooltip);
               

            });

             it('Checks cellTooltip Other', function () {
                
                var  renderTooltip = function(){
                    return true
                };
                var cellData = {
                    columnName :"",
                    rowData :[]
                }; 
                stub1 = sinon.stub(BaseRulesView.prototype.cellTooltip, "apply"); 
                natRulesView.cellTooltip(cellData, renderTooltip);
                stub1.called.should.be.equal(true);
                stub1.restore();

            });  




    });
 });
 });
