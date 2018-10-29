define([], function () {

  var testMergedArray = [], testIsMerged = false,
    spyMergeObjectArrays = sinon.spy(function (a,b,c, retMergeArr) {
      $.each(testMergedArray, function(index, item){
        retMergeArr.push(item);
      });
      return testIsMerged;
    });
    var MockSmUtil = function () {
        this.mergeObjectArrays = spyMergeObjectArrays
    }
    var MockColumnMixin = function () {

    },
    testMockedParentHoverDrop,
    spyParentHoverDrop = sinon.spy(function() {
      return testMockedParentHoverDrop;
    }),
    context = {
      getMessage : function (msg) {
        return msg;
      }
    };
  MockColumnMixin.prototype = {
    hoverDrop : spyParentHoverDrop,
    beforeDrag :spyParentHoverDrop,
    afterDrop :spyParentHoverDrop
  };
  
  var stubs = {
   '/installed_plugins/sd-common/js/common/utils/SmUtil.js': MockSmUtil,
   '/installed_plugins/base-policy-management/js/policy-management/rules/conf/rulesGridColumnMixin.js': MockColumnMixin
  };
  var exceutecontext = createContext(stubs, 'testnatRulesGridServicesColumnMixin');
  exceutecontext(['/installed_plugins/nat-policy-management/js/nat/rules/conf/natRulesGridServiceColumnMixin.js'], function (ServiceColumnMixin) {
    describe('NAT Service Column Drag n Drop related mixin tests', function () {
 var serviceColumnMixin = new ServiceColumnMixin({context:context});   
    var testNatType,
        testgetServiceData,
        testgetServiceSourcePortSets,
        testgetServiceDestinationPortSets,
        testgetServiceProtocolData,
        testgetServices,
        testgetServiceDestinationPorts,
        testgetServiceSourcePorts,
        testgetOriginalPacket,
        testToJson,
        spySet,
        testGetRuleModel = function () {
          return {
            getNatType : function () {
              return testNatType;
            },
            getServiceData : function () {
              return testgetServiceData;
            },
            getServiceSourcePortSets : function () {
              return testgetServiceSourcePortSets;
            },
            getServiceDestinationPortSets : function () {
              return testgetServiceDestinationPortSets;
            },
            getServiceProtocolData : function () {
              return testgetServiceProtocolData;
            },
            getServices : function () {
              return testgetServices;
            },
            getServiceDestinationPorts : function () {
              return testgetServiceDestinationPorts;
            },
            getServiceSourcePorts : function () {
              return testgetServiceSourcePorts;
            },

            
            getOriginalPacket : function () {
              return testgetOriginalPacket;
            },
            toJSON : function () {
              return testToJson;
            },
            set : spySet
        };
      };


      it('Test getServiceDndConfig', function () {
       var testConfigObj = {
          'isDraggable': true,
         'isDroppable': true,
         'groupId': 'SERVICE'
       },testConfig = new ServiceColumnMixin().getServiceDndConfig();
        assert.isObject(testConfig);
       expect(testConfig.callbacks).to.include.keys('beforeDrag', 'hoverDrop', 'afterDrop');
        delete testConfig.callbacks;
        assert.deepEqual(testConfig, testConfigObj);     
      });

       function createDragHtmlItems(draggedAddressObjects, pNode) {
        $.each(draggedAddressObjects, function (index, item) {
          var tmpNode = $('<div/>');
          tmpNode.attr('data-tooltip', String(item.id));
          pNode.append(tmpNode);
        });
      }

       it('test dragItems',function() {
        var draggedServiceObjects = [{id:1,name:'a1'}],
        otherServiceObjects = [{id:1,name:'a1'}], 
        draggedItemsRowData = [{
        id: '1',       
        services: {
              'service-reference' : otherServiceObjects
        }          
        }];
        var pNode = $('<td aria-describedby="a_iamcolumn.test""/>');
        createDragHtmlItems(draggedServiceObjects, pNode);
        serviceColumnMixin.getRuleModel = sinon.spy(testGetRuleModel);
        testgetServiceData = [{id:1,name:'a1'}];
        testNatType = 'STATIC'
        dragvalues = serviceColumnMixin.getDragItems(draggedItemsRowData ,$('div[data-tooltip]', pNode[0]));
        assert.deepEqual(dragvalues, draggedServiceObjects);
      });
      it('Test validateItems -static type', function () {
        var draggedServices = [{'name' : 'Any', id:9987}] ,
        draggedServiceObjects = [{id:3},{id:4}], 
        hoveredData = {id:'121',
                        'nat-type':'STATIC',
                        'original-packet' : {
                          'src-port-sets':{
                            'reference': [{name:'port500'}]
                          },
                          'dst-port-sets':{
                            'reference': []
                          },
                          'protocol':{
                            'protocol-data': []
                          }, 
                          'dst-ports' : '',
                          'src-ports':''
                        },
                        services : {'service-reference': [{'name' : 'Any', id:9987}]}
                      };
                   

        serviceColumnMixin.getRuleModel = sinon.spy(testGetRuleModel);
        testgetServiceData = [{id:1,name:'a1'}];
        testNatType = 'STATIC';
        testgetOriginalPacket = {};
        testgetServiceSourcePortSets = [{name:'port500'}];
        testgetServiceDestinationPortSets = [];
        testgetServiceProtocolData= [];
        testgetServiceSourcePorts ='';
        testgetServiceDestinationPorts = '';

        var pNode = $('<td aria-describedby="a_iamcolumn.services"/>');
        createDragHtmlItems(draggedServiceObjects, pNode);
        var error = {isValid: false, errorMessage: 'nat_service_statictype_message'};
        var validateErr = serviceColumnMixin.validateItems(draggedServices, hoveredData, pNode);
        assert.deepEqual(validateErr, error);
         });
        it('Test validateItems -source type with failure message', function () {
        var draggedServices = [{'name' : 'Any', id:9987}] ,draggedServiceObjects = [{id:3},{id:4}], 
        hoveredData = {id:'121',
                        'nat-type':'SOURCE',
                        'original-packet' : {
                          'src-port-sets':{
                            'reference': [{name:'port500'}]
                          },
                          'dst-port-sets':{
                            'reference': []
                          },
                          'protocol':{
                            'protocol-data': []
                          }, 
                          'dst-ports' : '',
                          'src-ports':''
                        }
                      };   

        serviceColumnMixin.getRuleModel = sinon.spy(testGetRuleModel);
        testgetServiceData = [{id:1,name:'a1'}];
        testNatType = 'SOURCE';
        testgetOriginalPacket = {};
        testgetServiceSourcePortSets = [{name:'port500'}];
        testgetServiceDestinationPortSets = [];
        testgetServiceProtocolData= [];
        testgetServiceSourcePorts ='';
        testgetServiceDestinationPorts = '';
                     
        var pNode = $('<td aria-describedby="a_iamcolumn.services"/>');
        createDragHtmlItems(draggedServiceObjects, pNode);
        var error = {isValid: false, errorMessage: 'nat_rule_protocolport_message'};
        var validateErr = serviceColumnMixin.validateItems(draggedServices, hoveredData, pNode);
        assert.deepEqual(validateErr, error);
        
      });  
      it('Test validateItems -source type with success message', function () {
        var draggedServices = [{'name' : 'Any', id:9987}] ,draggedServiceObjects = [{id:3},{id:4}], 
        hoveredData = {id:'121',
                        'nat-type':'SOURCE',
                        'original-packet' : {
                          'src-port-sets':{
                            'reference': [{}]
                          },
                          'dst-port-sets':{
                            'reference': [{}]
                          },
                          'protocol':{
                            'protocol-data': [{}]
                          }, 
                          'dst-ports' : '23',
                          'src-ports':'231'
                        }
                      };   

        serviceColumnMixin.getRuleModel = sinon.spy(testGetRuleModel);
        testgetServiceData = [{}];
        testNatType = 'SOURCE';
        testgetOriginalPacket = {};
        testgetServiceSourcePortSets = [{}];
        testgetServiceDestinationPortSets = [];
        testgetServiceProtocolData= [];
        testgetServiceSourcePorts ='23';
        testgetServiceDestinationPorts = '231';
                     
        var pNode = $('<td aria-describedby="a_iamcolumn.services"/>');
        createDragHtmlItems(draggedServiceObjects, pNode);
        var error = {isValid: false, errorMessage: 'nat_rule_protocolport_message'};
        var validateErr = serviceColumnMixin.validateItems(draggedServices, hoveredData, pNode);
        assert.deepEqual(validateErr, error);
      
      });
      it('Test validateItems -Destination type with failure message', function () {
        var draggedServices = [{'name' : 'Any', id:9987}] ,draggedServiceObjects = [{id:3},{id:4}], 
        hoveredData = {id:'121',
                        'nat-type':'DESTINATION',
                        'original-packet' : {
                          'src-port-sets':{
                            'reference': [{name:'port500'}]
                          },
                          'dst-port-sets':{
                            'reference': []
                          },
                          'protocol':{
                            'protocol-data': []
                          }, 
                          'dst-ports' : '',
                          'src-ports':''
                        }
                      };   

       serviceColumnMixin.getRuleModel = sinon.spy(testGetRuleModel);
        testgetServiceData = [{}];
        testNatType = 'DESTINATION';
        testgetOriginalPacket = {};
        testgetServiceSourcePortSets = [{name:'port500'}];
        testgetServiceDestinationPortSets = [];
        testgetServiceProtocolData= [];
        testgetServiceSourcePorts ='';
        testgetServiceDestinationPorts = '';
                     
        var pNode = $('<td aria-describedby="a_iamcolumn.services"/>');
        createDragHtmlItems(draggedServiceObjects, pNode);
        var error = {isValid: false, errorMessage: 'nat_rule_protocolport_message'};
        var validateErr = serviceColumnMixin.validateItems(draggedServices, hoveredData, pNode);
        assert.deepEqual(validateErr, error);     
      
      });

      it('Test validateItems - with ports for Destiantion type - success message', function () {
        var draggedServices = [{'name' : 'Any', id:9987}] ,draggedServiceObjects = [{id:3},{id:4}], 
        hoveredData = {id:'121',
                        'nat-type':'SOURCE',
                        'original-packet' : {
                          'src-port-sets':{
                            'reference': [{}]
                          },
                          'dst-port-sets':{
                            'reference': [{}]
                          },
                          'protocol':{
                            'protocol-data': [{}]
                          }, 
                          'dst-ports' : '23',
                          'src-ports':'231'
                        }
                      };   

       serviceColumnMixin.getRuleModel = sinon.spy(testGetRuleModel);
        testgetServiceData = [{}];
        testNatType = 'DESTINATION';
        testgetOriginalPacket = {};
        testgetServiceSourcePortSets = [{}];
        testgetServiceDestinationPortSets = [];
        testgetServiceProtocolData= [];
        testgetServiceSourcePorts ='23';
        testgetServiceDestinationPorts = '231';
                     
        var pNode = $('<td aria-describedby="a_iamcolumn.services"/>');
        createDragHtmlItems(draggedServiceObjects, pNode);
        var error = {isValid: false, errorMessage: 'nat_rule_protocolport_message'};
        var validateErr = serviceColumnMixin.validateItems(draggedServices, hoveredData, pNode);
        assert.deepEqual(validateErr, error);     
      
      });
      it('Test validateItems -Any with other services not allowed', function () {
        var draggedServices = [{'name' : 'Any', id:9987},{'name' : 'aol', id:99877}] ,
        draggedServiceObjects = [{id:3},{id:4}], 
        hoveredData = {id:'121',
                        'nat-type':'SOURCE',
                        'original-packet' : {
                          'src-port-sets':{
                            'reference': []
                          },
                          'dst-port-sets':{
                            'reference': []
                          },
                          'protocol':{
                            'protocol-data': []
                          }
                         
                        }
                      };   

       serviceColumnMixin.getRuleModel = sinon.spy(testGetRuleModel);
        testgetServiceData = [{}];
        testNatType = 'DESTINATION';
        testgetOriginalPacket = {};
        testgetServiceSourcePortSets = [];
        testgetServiceDestinationPortSets = [];
        testgetServiceProtocolData= [];
        testgetServiceSourcePorts ='';
        testgetServiceDestinationPorts = '';
                     
        var pNode = $('<td aria-describedby="a_iamcolumn.services"/>');
        createDragHtmlItems(draggedServiceObjects, pNode);
        var error = {isValid: false, errorMessage: 'nat_any_withother_services_message'};
        var validateErr = serviceColumnMixin.validateItems(draggedServices, hoveredData, pNode);
        assert.deepEqual(validateErr, error);  
      });
        it('Test mergeItems if dragged service item is ANY', function () {

        var spyModifyRule = sinon.spy(), testRuleGridConfigInstance = {
            ruleCollection: {
              modifyRule : spyModifyRule
            }
          },
        otherServices = [{'name' : 'aol', id:9987}],
         draggedServicesObjects = [{id:3 ,name:'Any'}], draggedItemsRowData = {
          a: '1',
          id:'ruleId',
          b:12,
          c:'String',
          services: {
            'service-reference' : otherServices

          }
        };
        var pNode = $('<td aria-describedby="a_iamcolumn.services"/>');
        createDragHtmlItems(draggedServicesObjects, pNode);

        testNatType = 'SOURCE';
         testToJson = 'retVal';      
      
        testgetServices = {'service-reference' : otherServices} ;
        spySet = sinon.spy();
        serviceColumnMixin.getRuleModel = sinon.spy(testGetRuleModel);
        serviceColumnMixin.ruleGridConfigInstance = testRuleGridConfigInstance;
        serviceColumnMixin.mergeItems( draggedServicesObjects,draggedItemsRowData, pNode);
        assert(spySet.calledOnce);
        assert(spySet.calledWith('services', testgetServices));
        assert(spyModifyRule.calledOnce);
        assert(spyModifyRule.calledWithExactly('retVal', {'makeRowEditable': false}));
       
     });
  
      it('Test merge dragged address -  with mock mergeObjectsArray  ', function () {
        var spyModifyRule = sinon.spy(), testRuleGridConfigInstance = {
            ruleCollection: {
              modifyRule : spyModifyRule
            }
          },
          otherService = [{id:1}], 
          draggedServiceObjects = [{id:3}, {id:4}], 
         draggedItemsRowData = {
          a: '1',
          id:'ruleId',
          b:12,
          c:'String',
          services: {
              'service-reference' : otherService           
          }
        };
        var pNode = $('<td aria-describedby="a_iamcolumn.services"/>');
        createDragHtmlItems(draggedServiceObjects, pNode);
               
         testNatType = 'SOURCE';
         testToJson = 'retVal';
           testMergedArray = draggedServiceObjects;
        testIsMerged = true;
      
        testgetServices = {'service-reference' : otherService} ;
        spySet = sinon.spy();
        serviceColumnMixin.getRuleModel = sinon.spy(testGetRuleModel);
        serviceColumnMixin.ruleGridConfigInstance = testRuleGridConfigInstance;
        serviceColumnMixin.mergeItems( draggedServiceObjects,draggedItemsRowData, pNode);
        assert(spySet.calledOnce);
        assert(spySet.calledWith('services', testgetServices));
        assert(spyModifyRule.calledOnce);
        assert(spyModifyRule.calledWithExactly('retVal', {'makeRowEditable': false}));
        serviceColumnMixin.ruleGridConfigInstance = null;
        testIsMerged = false;
        testMergedArray = [];
        });
    

  });
  deleteContext('testnatRulesGridServicesColumnMixin');

//    mocha.run();
 });
});
