/**
 * Created by skesarwani on 7/25/16.
 */
define([], function () {
  var stubs =  {
    'widgets/dropDown/dropDownWidget' : function (options) {
      console.log('Drop down widget mock class');
      this.options = options;
      this.build = function() {
        return this;
      };
    }
  };
  var context = createContext(stubs, 'testRuleObjectsGridView');
  context(['/installed_plugins/base-policy-management/js/policy-management/rules/views/ruleObjectsGridView.js'], function (RuleObjectsGridView) {
    describe('Rules Objects Container Grid View Tests', function () {
      var testContextObj1 = {a:1,b:3},  testObjectsViewData = [{
        id : 'ADDRESS',
        text : 'Address',
        action :  'slipstream.intent.action.ACTION_LIST_POLICY_RULES',
        mime_type : 'vnd.juniper.net.addresses',
        dragNDrop : {
          'groupId' : 'ADDRESS'
        }
      },{
        id : 'SERVICE',
        text : 'Service',
        action :  '',
        mime_type : '',
        dragNDrop : {
          'groupId' : 'SERVICE'
        }
      }];
      it('Test view initialize', function () {
        var ruleObjectsGridView = new RuleObjectsGridView(testContextObj1, testObjectsViewData);
        ruleObjectsGridView.should.exist;
        assert.equal(ruleObjectsGridView.context, testContextObj1);
        assert.equal(ruleObjectsGridView.objectsViewData, testObjectsViewData);
      });


      it('Test view render', function () {
        var ruleObjectsGridView = new RuleObjectsGridView(testContextObj1, testObjectsViewData),
        spy = sinon.spy(), spyAppend = sinon.spy(ruleObjectsGridView.$el, 'append');
        ruleObjectsGridView.render();
        assert(spyAppend.calledOnce);
      });

      it('Test view close', function () {
        var ruleObjectsGridView = new RuleObjectsGridView(testContextObj1, testObjectsViewData),
          closeSpy = sinon.spy(ruleObjectsGridView, 'close');
        ruleObjectsGridView.doClose = sinon.spy();
        ruleObjectsGridView.close();
        assert(closeSpy.calledOnce);
      });
      it('Test view doClose', function () {
        var ruleObjectsGridView = new RuleObjectsGridView(testContextObj1, testObjectsViewData),
          closeSpy = sinon.spy(ruleObjectsGridView, 'doClose'), viewCloseSpy = sinon.spy();
        ruleObjectsGridView.gridDivEl = {};
       
        assert(false === viewCloseSpy.calledOnce);

        ruleObjectsGridView.gridDivEl.__view = {
          'close' : viewCloseSpy
        }
        ruleObjectsGridView.doClose();
        assert(viewCloseSpy.calledOnce);
        assert(ruleObjectsGridView.gridDivEl.__view === undefined);
      });

      it( 'test gridId', function() {
         var ruleObjectsGridView = new RuleObjectsGridView(testContextObj1, testObjectsViewData);
         ruleObjectsGridView.setRuleGridId('gridIdSelector');
      });
      it('Test view findObjectById', function () {
        var ruleObjectsGridView = new RuleObjectsGridView(testContextObj1, testObjectsViewData);
        assert.isObject(ruleObjectsGridView.findObjectById('ADDRESS')[0]);
        assert.isObject(ruleObjectsGridView.findObjectById('SERVICE')[0]);
        assert.isNotObject(ruleObjectsGridView.findObjectById('ADDRESS_')[0]);
      });
      it('before drag call back',function() {
        var callbackData = { data : [], draggableRows :[] ,
                            helper :[{'draggedItems':[]}]

                          },
          testRetObj = {
            dragNDrop : {
              dragObjectType : 'ADDRESS'
            }
          },
         
          spyFindObjectById = sinon.spy(function () {
            return [testRetObj];
          }),

        ruleObjectsGridView = new RuleObjectsGridView(testContextObj1, testObjectsViewData);
        ruleObjectsGridView.findObjectById = spyFindObjectById;
        ruleObjectsGridView.objectViewId ='ADDRESS';
        ruleObjectsGridView.beforeDragCallback (callbackData).should.be.equal(true);
        assert(spyFindObjectById.calledWith(ruleObjectsGridView.objectViewId));
        assert.deepEqual(callbackData.helper[0].dragObjectType, testRetObj.dragNDrop.dragObjectType );
      });

      it('Test view launch activity', function () {
        var ruleGridId , testIntent, 
        ruleObjectsGridView = new RuleObjectsGridView(testContextObj1, testObjectsViewData);
        ruleObjectsGridView.ruleGridId ='gridIdSelector';
        ruleObjectsGridView.objectViewId ='ADDRESS';
        var startActivitySpy = sinon.spy(function (intent) {
          testIntent = intent;
        }), testExtras = {
            'containerDiv' : 'ruleObjectGridPanel',
            'colConfig' : [{
            "name": "name",
            dragNDrop : {
              isDraggableHelperData : true
            }
          }],
          'gridConfig' : {
            'title' : undefined,
            'title-help': undefined,
            'dragNDrop' : {
              'connectWith' : {
                selector: '#'+ruleObjectsGridView.ruleGridId,
                groupId: 'ADDRESS'
              },
               'moveRow' : {
                  'beforeDrag' : ruleObjectsGridView.beforeDragCallback
                }
            }
          }};
         
        ruleObjectsGridView.launchActivity();
      
        ruleObjectsGridView.context.startActivity = startActivitySpy;
        ruleObjectsGridView.launchActivity('ADDRESS');
        assert(startActivitySpy.calledOnce);
        assert(testIntent.getExtras()['containerDiv'] === 'ruleObjectGridPanel');
        //assert.deepEqual(testIntent.getExtras(),testExtras);
        assert(testIntent.data.mime_type === testObjectsViewData[0].mime_type);
        assert(testIntent.action === testObjectsViewData[0].action);
      });
    });
    //mocha.run();
  });
  deleteContext('testRuleObjectsGridView');
});
