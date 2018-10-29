define([], function () {
    describe('Custom Column UT', function() {


  var stubs = {
    '/installed_plugins/base-policy-management/js/policy-management/custom-column/views/customColumnCreateFormView.js': function (options) {
      console.log('Yahoo');
    },

    //'backbone': requirejs.s.contexts._.defined.backbone,
    //'jquery': requirejs.s.contexts._.defined.jquery,
    //'backbone.marionette.modals' : requirejs.s.contexts._.defined['backbone.marionette.modals'],
    //'backbone.modal' : requirejs.s.contexts._.defined['backbone.modal'],
    //'marionette' : requirejs.s.contexts._.defined['marionette'],

    'widgets/overlay/overlayWidget': function () {
      console.log('Over lay widget mock class');
      this.state = 'not built';
      this.build = function () {
        this.state = 'built';
      };
      this.getState = function () {
        return this.state;
      };
    }};
  //Note after create in the end call deleteContext to delete the created context
  var context = createContext(stubs, "name2");

  context(['/installed_plugins/base-policy-management/js/policy-management/custom-column/views/customColumnBuilderFormView.js'], function (CustomColumnBuilderView) {

    var activity = new Slipstream.SDK.Activity();


    describe("Custom Column View unit tests", function () {

        sinon.stub(activity, 'getContext', function () {
            return new Slipstream.SDK.ActivityContext();

        });

      var view = null, intent;

      //executes once
      before(function () {
        console.log("Custom Column View unit tests: before");
        intent = sinon.stub(activity, 'getIntent', function () {
          return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE);
        });

      });

      //executes once
      after(function () {
        sinon.restore();
        console.log("Custom Column View unit tests: after");
      });

      //
      activity.context = activity.getContext();

      var view = new CustomColumnBuilderView({
        activity: activity,
        params: {
          formMode: "create",
        }
      });
      view.collection._byId = {
        '131096': {}
      };

      var row = {originalRow: Object, originalData: Object};

      var originalRow = {id: "229573", name: "cc1", regex: ""};


       it("view should exist", function() {
       view.render();
       view.should.exist;
       });

       it("Build Custom Column Grid", function() {
       var loadCustomColumnGrid1 = sinon.spy(view, 'loadCustomColumnGrid');
       view.buildCustomColumnGrid();
       assert(view.loadCustomColumnGrid.calledOnce);
       view.loadCustomColumnGrid.restore();
       var bindContextEvents1 = sinon.spy(view, 'bindContextEvents');
       view.buildCustomColumnGrid();
       assert(view.bindContextEvents.calledOnce);
       view.bindContextEvents.restore();
       view.customColumnGridWidget.build.should.exist;
       });

      it("add custom column", function () {
        var overlayGridForm = {
          parentView: view,
          params: {
          }
        };
        var addCustomColumnAction1 = sinon.spy(view, 'addCustomColumnAction');
        var returnedViewInstance = view.addCustomColumnAction();
        assert(addCustomColumnAction1.alwaysReturned(returnedViewInstance));
        expect(view.params.formMode).equal('create');
        view.overlay.build.should.exist;
        view.addCustomColumnAction.restore();

      });

      it("Modify custom column", function () {
        var e = {};
        var overlayGridForm = {
          parentView: view,
          params: {
            formMode: "edit",
          }
        };
        var model = {
          url: ""
        };
        var row = {
          originalRow: {
            id: "131096",
            name: "ee",
            regex: "333",
            slipstreamGridWidgetRowId: "131096"
          }
        };
        var modifyCustomColumnAction1 = sinon.spy(view, 'modifyCustomColumnAction');
        var returnedViewInstance1 = view.modifyCustomColumnAction(e, row);
        assert(modifyCustomColumnAction1.alwaysReturned(returnedViewInstance1));
        view.overlay.build.should.exist;
        expect(overlayGridForm.params.formMode).equal('edit');
        view.modifyCustomColumnAction.restore();

      });

      it("Load Custom Column", function () {
        view.customColumnGridWidget = {
          addPageRows: function () {
            return true;
          }
        }
        var collection = {}, options = {};
        var response = {
          'custom-columns': {
            'custom-column': [
              {
                id: '131091',
                name: "Costum Col123",
                regex: "inc[0-7]*",
                uri: "/api/juniper/sd/policy-management/custom-column-management/custom-columns/131091"
              }
            ],
            total: '3'
          }
        };
        var conf = {
          elements: {
            jsonRecords: function () {
              return true;
            }
          }
        };

        var fetchSuccessSpy = sinon.spy(function (object) {
          object.success(collection, response, options)
        });
        view.collection = {
          models: [
            {
              id: "131096",
              name: "ee",
              regex: "333"
            }
          ],
          fetch: fetchSuccessSpy
        };
        view.loadCustomColumnGrid();
        assert(fetchSuccessSpy.called);

      });

      it(" Error in Loading Custom Column", function () {

        var conf = {
          elements: {
            jsonRecords: function () {
              return true;
            }
          }
        };
        var fetchErrorSpy = sinon.spy(function (object) {
          object.error()
        });
        view.collection = {
          models: [
            {
              id: "131096",
              name: "ee",
              regex: "333"
            }
          ],
          fetch: fetchErrorSpy
        };
        view.loadCustomColumnGrid();
        assert(fetchErrorSpy.called);

      });

      it("overlay should be destroyed ", function () {
        var event = {
          type: 'click',
          preventDefault: function () {
          }
        };
        var preventDefaultSpy = sinon.spy(event, 'preventDefault');
        // Imitate overlay.destory
        view.activity.overlay = {destroy: function () {
          console.log('destroyed');
        }}
        sinon.spy(view.activity.overlay, "destroy");
        view.okClickHandler(event);
        view.activity.overlay.destroy.calledOnce.should.be.equal(true);
      });

      it("Delete Custom Column Success", function (done) {

        view.activity.view = {notify: function () {
          console.log('notify');
        }}
        var stub;
        stub = sinon.stub(view.activity.view, 'notify');
        var e = {};
        var selectedObj = {selectedRows: Object};

        $.mockjax.clear();

        $.mockjax({
          url: '/api/juniper/sd/policy-management/custom-column-management/custom-columns',
          type: 'POST',
          status: 200,
          responseText: {},
          response: function (settings, done2) {
            done2();
            stub.calledOnce.should.be.equal(true);
            stub.args[0][0].should.be.equal('success');
            done();
          }
        });
        view.deleteCustomColumnAction(e, selectedObj);
      });

      it("Delete Custom Column Error", function (done) {
        view.activity.view = {notify: function () {
          console.log('notify');
        }}
        var stub;
        stub = sinon.stub(view.activity.view, 'notify');
        var e = {};
        var selectedObj = {selectedRows: Object};
        $.mockjax.clear();

        $.mockjax({
          url: '/api/juniper/sd/policy-management/custom-column-management/custom-columns',
          type: 'POST',
          status: 500,
          responseText: {},
          response: function (settings, done2) {
            done2();
            stub.calledOnce.should.be.equal(true);
            stub.args[0][0].should.be.equal('error');
            done();
          }
        });
        view.deleteCustomColumnAction(e, selectedObj);
      });
      //This is to avoid memory leak and runtime slowness
      deleteContext('name2');
    });
    // mocha.run();

  });
});
});