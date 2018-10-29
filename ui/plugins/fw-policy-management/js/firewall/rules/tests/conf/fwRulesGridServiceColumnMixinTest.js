define([], function () {
  
 var testMergedArray = [], testIsMerged = false, spyMergeObjectArrays = sinon.spy(function (a,b,c, retMergeArr) {
   $.each(testMergedArray, function(index, item){
     retMergeArr.push(item);
   });
    return testIsMerged;
  });
  var stubs = {
    '/installed_plugins/ui-common/js/common/utils/SmUtil.js': function () {
     this.mergeObjectArrays = spyMergeObjectArrays
   }
  };
  var context = createContext(stubs, 'testfwRulesGridServiceColumnMixin');
  context(['/installed_plugins/fw-policy-management/js/firewall/rules/conf/fwRulesGridServiceColumnMixin.js'], function (ServiceColumnMixin) {
    describe.skip('Service Column Drag n Drop related mixin tests', function () {
      var serviceColumnMixin = new ServiceColumnMixin({ 
        context : {
            getMessage : function () {
                var msg = 'Any service cannot be added with other services';
              return msg;}
          }
        });

      it('Test ruleGridConfigInstance is set', function () {
          var testRuleGridConfigInstance = 'testRuleGrid', serviceMixin = new ServiceColumnMixin(testRuleGridConfigInstance);
         assert.deepEqual(serviceMixin.ruleGridConfigInstance, testRuleGridConfigInstance);
       });
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


      function createDragHtmlItems(draggedServiceObjects, pNode) {
        $.each(draggedServiceObjects, function (index, item) {
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

        dragvalues = new ServiceColumnMixin().getDragItems(draggedItemsRowData ,$('div[data-tooltip]', pNode[0]));
        assert.deepEqual(dragvalues, draggedServiceObjects);
      });

      it('Test getDraggedServices dragged items match', function () {

           var draggedServiceObjects = [{id:1,name:'a1'}, {id:2,name:'a1'}], otherServiceObjects = [{id:3,name:'a1'}, {id:4,name:'a1'}], draggedItemsRowData = [{
          a: '1',
          b:12,
          c:'String',
          services: {
              'service-reference' : otherServiceObjects.concat(draggedServiceObjects)
         }
        }];
        var pNode = $('<td aria-describedby="a_iamcolumn.service-reference"/>');
        createDragHtmlItems(draggedServiceObjects, pNode);

        var draggedService = new ServiceColumnMixin().getDraggedItems(draggedItemsRowData, $('div[data-tooltip]', pNode[0]));
        assert.deepEqual(draggedService, draggedServiceObjects);
        pNode.remove();
      });
      it('Test getDraggedervice no items match for drag', function () {
         var draggedServiceObjects = [{id:1,name:'a1'}, {id:2,name:'a1'}], otherServiceObjects = [{id:3,name:'a1'}, {id:4,name:'a1'}], draggedItemsRowData = [{
          a: '1',
          b:12,
          c:'String',
          services: {            
              'service-reference' : otherServiceObjects           
          }
        }];
        var pNode = $('<td aria-describedby="a_iamcolumn.test""/>');
        createDragHtmlItems(draggedServiceObjects, pNode);

        var draggedService = new ServiceColumnMixin().getDraggedItems(draggedItemsRowData, $('div[data-tooltip]', pNode[0]));
        assert.deepEqual(draggedService, []);
        pNode.remove();
      });
      it('Test validateItems can not have ANY service with any other service', function () {

           var Any_Service = {'name' : 'Any'},
          draggedItemsRowData = {
             id:'ruleId',
             'is-group':false
          }, otherService = {'name' : 'ab'};
           var pNode = $('<td aria-describedby="a_iamcolumn.test""/>');
        createDragHtmlItems(Any_Service, pNode);

        
        var validateErr =  serviceColumnMixin.validateItems([Any_Service, otherService], draggedItemsRowData, pNode);
        var error = {isValid: false, errorMessage: 'Any service cannot be added with other services'};
        assert.deepEqual(validateErr, error);
      });
      it('Test mergeItems if dropped row services item is ANY', function () {

        var otherServices = [{'name' : 'Any', id:9987}], 
        draggedServiceObjects = [{id:3},{id:4}], 
        draggedItemsRowData = {
          a: '1',
          id:'ruleId',
          b:12,
          c:'String',
         services: {            
              'service-reference' : otherServices           
          }
        };
        var pNode = $('<td aria-describedby="a_iamcolumn.test""/>');
        createDragHtmlItems(draggedServiceObjects, pNode);


        var setSpy = sinon.spy(), toJsonSpy = sinon.spy( function () {
          return 'abc';
        }), modifyRuleSpy = sinon.spy();
        var serviceMixin = new ServiceColumnMixin({
          ruleCollection : {
            get : sinon.spy(function () {return {
              set : setSpy,
              toJSON: toJsonSpy
            }}),
            modifyRule : modifyRuleSpy
          }
        });
        serviceMixin.mergeItems(draggedServiceObjects, draggedItemsRowData, pNode);
        assert.deepEqual(draggedItemsRowData['services']['service-reference'], draggedServiceObjects);
        assert(setSpy.calledOnce);
        assert(setSpy.calledWith({'services' : draggedItemsRowData['services']}));

        assert(toJsonSpy.calledOnce);
        assert(modifyRuleSpy.calledOnce);
        assert(modifyRuleSpy.calledWithExactly('abc', {'makeRowEditable': false}));
      });
    

      it('Test mergeItems if dragged service item is ANY', function () {

        var otherServices = [{'name' : 'aol', id:9987}], draggedServicesObjects = [{id:3 ,name:'Any'}], draggedItemsRowData = {
          a: '1',
          id:'ruleId',
          b:12,
          c:'String',
          services: {
            'service-reference' : otherServices

          }
        };
        var setSpy = sinon.spy(), toJsonSpy = sinon.spy( function () {
          return 'abc';
        }), modifyRuleSpy = sinon.spy();
        var serviceMixin = new ServiceColumnMixin({
          ruleCollection : {
            get : sinon.spy(function () {return {
              set : setSpy,
              toJSON: toJsonSpy
            }}),
            modifyRule : modifyRuleSpy
          }
        });
        var pNode = $('<td aria-describedby="a_iamcolumn.test""/>');
        createDragHtmlItems(draggedServicesObjects, pNode);

        serviceMixin.mergeItems(draggedServicesObjects, draggedItemsRowData, pNode);
        assert.deepEqual(draggedItemsRowData['services']['service-reference'], draggedServicesObjects);
        assert(setSpy.calledOnce);
        assert(setSpy.calledWith({'services' : draggedItemsRowData['services']}));

        assert(toJsonSpy.calledOnce);
        assert(modifyRuleSpy.calledOnce);
        assert(modifyRuleSpy.calledWithExactly('abc', {'makeRowEditable': false}));
      });
      it('Test merge with mock mergeObjectsArray method call', function () {

         var otherService = [{id:1}], draggedServiceObjects = [{id:3}, {id:4}], 
         draggedItemsRowData = {
          a: '1',
          id:'ruleId',
          b:12,
          c:'String',
          services: {
              'service-reference' : otherService           
          }
        };
        var pNode = $('<td aria-describedby="a_iamcolumn.test""/>');
        createDragHtmlItems(draggedServiceObjects, pNode);


        var setSpy = sinon.spy(), toJsonSpy = sinon.spy( function () {
          return 'abc';
        }), modifyRuleSpy = sinon.spy();

        var serviceMixin = new ServiceColumnMixin({
          ruleCollection : {
            get : sinon.spy(function () {return {
              set : setSpy,
              toJSON: toJsonSpy
            }}),
            modifyRule : modifyRuleSpy
          }
        });
        testMergedArray = draggedServiceObjects;
        testIsMerged = true;
        serviceMixin.mergeItems(draggedServiceObjects, draggedItemsRowData, pNode);
        assert.deepEqual(draggedItemsRowData['services']['service-reference'], draggedServiceObjects);
        assert(setSpy.calledOnce);
        assert(setSpy.calledWith({'services' : draggedItemsRowData['services']}));

        assert(toJsonSpy.calledOnce);
        assert(modifyRuleSpy.calledOnce);
        assert(modifyRuleSpy.calledWithExactly('abc', {'makeRowEditable': false}));
        serviceMixin.ruleGridConfigInstance = null;
        testIsMerged = false;
        testMergedArray = [];       
      });

 

     }); 
  });

});