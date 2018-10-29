define([
  "../gridActivity.js",
  "../../../rbacProvider/js/domainProvider.js",
  "../common/intentActions.js",
], function(GridActivity, DomainProvider, IntentActions){
  // Test on schedule
  describe("GridActivity Unit Tests", function() {
    var gridActivity;
    var currentDomainID = 2;
    var mime_type = "vnd.juniper.net.addresses";
    before(function(done) {
        $.mockjax({
            url: "/api/space/user-management/user-domain",
            type: "GET",
            responseTime: 100,
            response: function(data, done2) {
                this.responseText = {
                    "user-domain": {
                        "id": currentDomainID,
                        "name": "Global",
                        "domain-type": "GLOBAL"
                    }
                };
                done2();
                done()
            }
        });
        DomainProvider = new DomainProvider()
        DomainProvider.initiateDomainCache();
    });
    after(function() {
        $.mockjax.clear()
    });
    beforeEach(function() {
      gridActivity = new GridActivity();
      sinon.stub(gridActivity, "getContext", function() {
        return new Slipstream.SDK.ActivityContext();
      });
    });
    afterEach(function() {
      $.mockjax.clear();
      if (typeof gridActivity.getContext.restore == "function")
        gridActivity.getContext.restore();
      if (typeof gridActivity.getIntent.restore == "function")
        gridActivity.getIntent.restore();
      delete gridActivity;
    });

    it("isDifferentDomain should return false for same domain objects", function() {
      var selectedRows = [{
        "domain-id": currentDomainID
      }]
      var result = gridActivity.isDifferentDomain(selectedRows);
      expect(result).to.be.false;
    });

    it("isDifferentDomain should return true for different domain objects", function() {
      var selectedRows = [{
        "domain-id": 3
      }]
      var result = gridActivity.isDifferentDomain(selectedRows);
      expect(result).to.be.true;
    });

    /**
     * This function will return true if there is at least one rows has PREDEFINED value
     */
    it("isPredefinedObject should return true for predefined objects", function() {
      var selectedRows = [{
        "definition-type": "PREDEFINED"
      }, {
        "definition-type": "predefined"
      }, {
        "definition-type": "abcd"
      }]
      var result = gridActivity.isPredefinedObject(selectedRows);
      expect(result).to.be.true;
    });

    it("isPredefinedObject should return false for non-predefined objects", function() {
      var selectedRows = [{
        "definition-type": "abcd"
      }, {
        "definition-type": "predefined"
      }, {
        "definition-type": "non-predefined"
      }]
      var result = gridActivity.isPredefinedObject(selectedRows);
      expect(result).to.be.false;
    });

    it("isEditButton should return true", function() {
      var result = gridActivity.isEditButton("edit");
      result.should.be.true;
    });
    it("isEditButton should return false", function() {
      var result = gridActivity.isEditButton("EDIT");
      result.should.be.false;
    });
    it("isDeleteButton should return true", function() {
      var result = gridActivity.isDeleteButton("delete");
      result.should.be.true;
    });
    it("isDeleteButton should return false", function() {
      var result = gridActivity.isDeleteButton("Delete");
      result.should.be.false;
    });

    it("isDisabledFindUsage should return true for empty param", function() {
      var selectedRows = [];
      var result = gridActivity.isDisabledFindUsage("eventName", selectedRows);
      result.should.be.true;
    });
    it("isDisabledFindUsage should return true for array with length of 2", function() {
      var selectedRows = [1001, 1002];
      var result = gridActivity.isDisabledFindUsage("eventName", selectedRows);
      result.should.be.true;
    });
    it("isDisabledFindUsage should return false for array with length of 1", function() {
      var selectedRows = [1001];
      var result = gridActivity.isDisabledFindUsage("eventName", selectedRows);
      result.should.be.false;
    });

    it("isDisabledEdit should return true for empty array", function() {
      var selectedRows = [];
      var result = gridActivity.isDisabledEdit("eventName", selectedRows);
      result.should.be.true;
    });
    it("isDisabledEdit should return true for array with more than one element", function() {
      var selectedRows = [{"id": 10001, "definition-type": "non-predefined", "domain-id": 2},
        {"id": 10002, "definition-type": "non-predefined", "domain-id": 2}];
      var result = gridActivity.isDisabledEdit("eventName", selectedRows);
      result.should.be.true;
    });
    it("isDisabledEdit should return true for predefined objects", function() {
      var selectedRows = [{"id": 1234, "definition-type": "PREDEFINED", "domain-id": 2}];
      var result = gridActivity.isDisabledEdit("eventName", selectedRows);
      result.should.be.true;
    });
    it("isDisabledEdit should return true for different domain objects", function() {
      var selectedRows = [{"id": 1234, "definition-type": "non-predefined", "domain-id": 3}];
      var result = gridActivity.isDisabledEdit("eventName", selectedRows);
      result.should.be.true;
    });
    it("isDisabledEdit should return false for only one non-predefined object in the same domain", function() {
      var selectedRows = [{"id": 1234, "definition-type": "non-predefined", "domain-id": 2}];
      var result = gridActivity.isDisabledEdit("eventName", selectedRows);
      result.should.be.false;
    });

    it("isDisabledClone should return true for empty array or undefined params", function() {
      var selectedRows = [];
      var result = gridActivity.isDisabledClone("eventName", selectedRows);
      result.should.be.true;
    });
    it("isDisabledClone should return true for array with more than one elements", function() {
      var selectedRows = [{"id": 1234, "definition-type": "non-predefined", "domain-id": 2},
        {"id": 4321, "definition-type": "non-predefined", "domain-id": 2}];
      var result = gridActivity.isDisabledClone("eventName", selectedRows);
      result.should.be.true;
    });
    it("isDisabledClone should return false for only one element", function() {
      var selectedRows = [{"id": 1234, "definition-type": "non-predefined", "domain-id": 2}];
      var result = gridActivity.isDisabledClone("eventName", selectedRows);
      result.should.be.false;
    });

    it("isDisabledReplace should return true for empty array", function() {
      var selectedRows = [];
      var result = gridActivity.isDisabledReplace("eventName", selectedRows);
      result.should.be.true;
    });
    it("isDisabledReplace should return true undefined param", function() {
      var selectedRows;
      var result = gridActivity.isDisabledReplace("eventName", selectedRows);
      result.should.be.true;
    });
    it("isDisabledReplace should return false for array with at least one element", function() {
      var selectedRows = [{"id": 1234, "definition-type": "non-predefined", "domain-id": 2}];
      var result = gridActivity.isDisabledReplace("eventName", selectedRows);
      result.should.be.false;
    });
    it("isDisabledReplace should return true for predefined objects", function() {
      var selectedRows = [{"id": 1234, "definition-type": "PREDEFINED", "domain-id": 2}];
      var result = gridActivity.isDisabledReplace("eventName", selectedRows);
      result.should.be.true;
    });
    it("isDisabledReplace should return true for different domain objects", function() {
      var selectedRows = [{"id": 1234, "definition-type": "non-predefined", "domain-id": 3}];
      var result = gridActivity.isDisabledReplace("eventName", selectedRows);
      result.should.be.true;
    });
    it("isDisabledReplace should return false for only one non-predefined and same domain object", function() {
      var selectedRows = [{"id": 1234, "definition-type": "non-predefined", "domain-id": 2}];
      var result = gridActivity.isDisabledReplace("eventName", selectedRows);
      result.should.be.false;
    });

    it("isDisabledAssignToDomain should return true for empty array", function() {
      var selectedRows = [];
      var result = gridActivity.isDisabledAssignToDomain("eventName", selectedRows);
      result.should.be.true;
    });
    it("isDisabledAssignToDomain should return true undefined param", function() {
      var selectedRows;
      var result = gridActivity.isDisabledAssignToDomain("eventName", selectedRows);
      result.should.be.true;
    });
    it("isDisabledAssignToDomain should return false for array with at least one element", function() {
      var selectedRows = [{"id": 1234, "definition-type": "non-predefined", "domain-id": 2}];
      var result = gridActivity.isDisabledAssignToDomain("eventName", selectedRows);
      result.should.be.false;
    });
    it("isDisabledAssignToDomain should return true for predefined objects", function() {
      var selectedRows = [{"id": 1234, "definition-type": "PREDEFINED", "domain-id": 2}];
      var result = gridActivity.isDisabledAssignToDomain("eventName", selectedRows);
      result.should.be.true;
    });
    it("isDisabledAssignToDomain should return true for different domain objects", function() {
      var selectedRows = [{"id": 1234, "definition-type": "non-predefined", "domain-id": 3}];
      var result = gridActivity.isDisabledAssignToDomain("eventName", selectedRows);
      result.should.be.true;
    });
    it("isDisabledAssignToDomain should return false for non-predefined and in same domain objects", function() {
      var selectedRows = [{"id": 1234, "definition-type": "non-predefined", "domain-id": 2},
        {"id": 1234, "definition-type": "non-predefined", "domain-id": 2}];
      var result = gridActivity.isDisabledAssignToDomain("eventName", selectedRows);
      result.should.be.false;
    });

    it("isDisabledShowDetailView should return true for non-array", function() {
      var selectedRows = null;
      var result = gridActivity.isDisabledShowDetailView("eventName", selectedRows);
      result.should.be.true;
    });
    it("isDisabledShowDetailView should return true for empty array", function() {
      var selectedRows = [];
      var result = gridActivity.isDisabledShowDetailView("eventName", selectedRows);
      result.should.be.true;
    });
    it("isDisabledShowDetailView should return true for array with more than one elements", function() {
      var selectedRows = [{"id": 1234, "definition-type": "non-predefined", "domain-id": 3},
        {"id": 4321, "definition-type": "non-predefined", "domain-id": 3}];
      var result = gridActivity.isDisabledShowDetailView("eventName", selectedRows);
      result.should.be.true;
    });
    it("isDisabledShowDetailView should return false for just one element in array", function() {
      var selectedRows = [{"id": 1234, "definition-type": "non-predefined", "domain-id": 2}];
      var result = gridActivity.isDisabledShowDetailView("eventName", selectedRows);
      result.should.be.false;
    });

    it("isDisabledDelete should return false for non-predefined and same domain objects", function() {
      var selectedRows = [{"id": 1234, "definition-type": "non-predefined", "domain-id": 2}];
      var result = gridActivity.isDisabledDelete("eventName", selectedRows);
      result.should.be.false;
    });
    it("isDisabledDelete should return true for predefined objects", function() {
      var selectedRows = [{"id": 1234, "definition-type": "PREDEFINED", "domain-id": 2}];
      var result = gridActivity.isDisabledDelete("eventName", selectedRows);
      result.should.be.true;
    });
    it("isDisabledDelete should return true for different domain objects", function() {
      var selectedRows = [{"id": 1234, "definition-type": "non-predefined", "domain-id": 3}];
      var result = gridActivity.isDisabledDelete("eventName", selectedRows);
      result.should.be.true;
    });

    it("isDisabledEditButton should return true for empty object", function() {
      var selectedRows = [];
      var result = gridActivity.isDisabledEditButton(selectedRows);
      result.should.be.true;
    });
    it("isDisabledEditButton should return true for array with more than one elements", function() {
      var selectedRows = [{"id": 1234, "definition-type": "non-predefined", "domain-id": 2},
        {"id": 1235, "definition-type": "non-predefined", "domain-id": 2}];
      var result = gridActivity.isDisabledEditButton(selectedRows);
      result.should.be.true;
    });
    it("isDisabledEditButton should return true for just one but predefined element", function() {
      var selectedRows = [{"id": 1234, "definition-type": "PREDEFINED", "domain-id": 2}];
      var result = gridActivity.isDisabledEditButton(selectedRows);
      result.should.be.true;
    });
    it("isDisabledEditButton should return true for just one but different domain object", function() {
      var selectedRows = [{"id": 1234, "definition-type": "unPREDEFINED", "domain-id": 3}];
      var result = gridActivity.isDisabledEditButton(selectedRows);
      result.should.be.true;
    });
    it("isDisabledEditButton should return false for just one non-predefined and same domain object", function() {
      var selectedRows = [{"id": 1234, "definition-type": "non-predefined", "domain-id": 2}];
      var result = gridActivity.isDisabledEditButton(selectedRows);
      result.should.be.false;
    });

    it("isDisabledDeleteButton should return true for empty array or undefined param", function() {
      var selectedRows = [];
      var result = gridActivity.isDisabledDeleteButton(selectedRows);
      result.should.be.true;
    });
    it("isDisabledDeleteButton should return true for more than one elements but with at least one predefined", function() {
      var selectedRows = [{"id": 1231, "definition-type": "non-predefined", "domain-id": 2},
        {"id": 1232, "definition-type": "PREDEFINED", "domain-id": 2},
        {"id": 1234, "definition-type": "non-predefined", "domain-id": 2}];
      var result = gridActivity.isDisabledDeleteButton(selectedRows);
      result.should.be.true;
    });
    it("isDisabledDeleteButton should return true for more than one elements but with different domain", function() {
      var selectedRows = [{"id": 1231, "definition-type": "non-predefined", "domain-id": 3},
        {"id": 1232, "definition-type": "non-PREDEFINED", "domain-id": 2},
        {"id": 1234, "definition-type": "non-predefined", "domain-id": 2}];
      var result = gridActivity.isDisabledDeleteButton(selectedRows);
      result.should.be.true;
    });
    it("isDisabledDeleteButton should return true for only one element but with different domain", function() {
      var selectedRows = [{"id": 1231, "definition-type": "non-predefined", "domain-id": 3}];
      var result = gridActivity.isDisabledDeleteButton(selectedRows);
      result.should.be.true;
    });
    it("isDisabledDeleteButton should return false for only one non-predefined element with same domain", function() {
      var selectedRows = [{"id": 1231, "definition-type": "non-predefined", "domain-id": 2}];
      var result = gridActivity.isDisabledDeleteButton(selectedRows);
      result.should.be.false;
    });

    it("onEditResult should do nothing if resultCode is Cancel but action is not create", function() {
      gridActivity.getContext.restore();
      var context = new Slipstream.SDK.ActivityContext();
      sinon.stub(gridActivity, "getContext");

      sinon.stub(context, "startActivityForResult");
      var resultCode = Slipstream.SDK.BaseActivity.RESULT_OK;
      var data = {action: Slipstream.SDK.Intent.action.ACTION_EDIT};
      gridActivity.onEditResult(resultCode, data);
      context.startActivityForResult.called.should.be.false;
      context.startActivityForResult.restore();
    });
    it("onEditResult should start a new activity if resultCode is Cancel and action is create", function() {
      gridActivity.getContext.restore();
      var context = new Slipstream.SDK.ActivityContext();
      sinon.stub(gridActivity, "getContext", function() {
        return context;
      });
      sinon.stub(context, "startActivityForResult", function(intent, callback){
        console.log(intent)
      });
      sinon.stub(gridActivity, "getIntent", function(){
        return new Slipstream.SDK.Intent("create", {"mime_type": mime_type, model: new Backbone.Model()});
      });
      var resultCode = Slipstream.SDK.BaseActivity.RESULT_CANCELLED;
      var data = {action: Slipstream.SDK.Intent.action.ACTION_CREATE}
      gridActivity.onEditResult(resultCode, data);

      context.startActivityForResult.called.should.be.true;
      context.startActivityForResult.restore();
      gridActivity.getIntent.restore();
    });

    it("bindEvents", function(done) {
      var View = Backbone.View.extend({
        conf: {}
      });

      var capabilities = {
        "create": {
          view: View,
          rbacCapabilities: ["createAddress"]
        },
        "edit": {
          view: View,
          rbacCapabilities: ["ModifyAddress"]
        },
        "select": {
          view: View
        },
        "clone": {
          view: View,
          rbacCapabilities: ["createAddress"]
        },
        "delete": {
          rbacCapabilities: ["DeleteAddresses"]
        },
        "import": {
          view: View,
          rbacCapabilities: ["createAddress", "ModifyAddress"]
        },
        "replace": {
          view: View,
          rbacCapabilities: ["ReplaceAddresses"]
        },
        "export": {
          view: View,
          rbacCapabilities: ["readAddress"]
        },
        "showUnused": {
          rbacCapabilities: ["readAddress"]
        },
        "findUsage": {
          rbacCapabilities: ["findUsageAddress"]
        },
        "showDuplicates": {
          rbacCapabilities: ["readAddress"],
          gridconfiguration: {},
          mergeModel: {},
          mergeRbacCapabilities: ["createAddress", "ModifyAddress", "DeleteAddresses"],
          deleteRbacCapabilities: ["DeleteAddresses"]
        },
        "deleteUnused": {
          rbacCapabilities: ["DeleteAddresses"]
        },
        "assignToDomain": {
          rbacCapabilities: ["AssignAddressToDomainCap"]
        },
        "showDetailView": {
          view: View,
          rbacCapabilities: ["readAddress"]
        },
        "clearAllSelections": {
          rbacCapabilities: ["clearSelect"]
        }
      };
      var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE, mime_type);
      sinon.stub(gridActivity, "startDeleteActivity", $.noop);
      gridActivity.view = new View();
      gridActivity.intent = intent;
      gridActivity.context = gridActivity.getContext();
      gridActivity.capabilities = capabilities;

      sinon.spy(gridActivity, "onCreateEvent");

      gridActivity.bindEvents();

      gridActivity.view.$el.trigger("createAction");
      setTimeout(function(){
        gridActivity.onCreateEvent.calledOnce.should.be.true;
        gridActivity.onCreateEvent.restore();
        done();
      }, 500);
    });

    it("onCreateEvent should start gridActivity with create intent", function(done) {
      sinon.stub(gridActivity, "getIntent", function(){
        return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE, mime_type);
      });
      gridActivity.getContext.restore();
      var context = new Slipstream.SDK.ActivityContext();
      sinon.stub(gridActivity, "getContext", function() {
        return context;
      });
      sinon.stub(context, "startActivity", function(intent, callback){
        intent.action.should.equal(Slipstream.SDK.Intent.action.ACTION_CREATE);
        intent.data.mime_type.should.equal(mime_type);
        done();
      });
      gridActivity.onCreateEvent();
    });

    it("onEditEvent should start gridActivity with edit intent", function(done) {
      sinon.stub(gridActivity, "getIntent", function(){
        return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_EDIT, mime_type);
      });
      gridActivity.getContext.restore();
      var context = new Slipstream.SDK.ActivityContext();
      sinon.stub(gridActivity, "getContext", function() {
        return context;
      });
      sinon.stub(context, "startActivityForResult", function(intent, callback){
        intent.action.should.equal(Slipstream.SDK.Intent.action.ACTION_EDIT);
        intent.data.mime_type.should.equal(mime_type);
        var extras = intent.getExtras();
        extras.id.should.equal(10001);
        done();
      });
      var event = $.Event(),
        selectedRow = {originalRow: {id: 10001}};
      gridActivity.onEditEvent(event, selectedRow);
    });

    it("onCloneEvent should start gridActivity with clone intent", function(done) {
      sinon.stub(gridActivity, "getIntent", function(){
        return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CLONE, mime_type);
      });
      gridActivity.getContext.restore();
      var context = new Slipstream.SDK.ActivityContext();
      sinon.stub(gridActivity, "getContext", function() {
        return context;
      });
      sinon.stub(context, "startActivity", function(intent, callback){
        intent.action.should.equal(Slipstream.SDK.Intent.action.ACTION_CLONE);
        intent.data.mime_type.should.equal(mime_type);
        var extras = intent.getExtras();
        extras.id.should.equal(10001);
        done();
      });
      gridActivity.onCloneEvent($.Event(), {selectedRows: [{id: 10001}]});
    });

    it("onDeleteEvent should invoke startDeleteActivity with specified params", function(done) {
      sinon.stub(gridActivity, "startDeleteActivity", function(selectedRows, isSelectAll, allRowIds){
        selectedRows.should.be.instanceOf(Array);
        selectedRows[0].id.should.equal(10001);
        allRowIds.should.be.instanceOf(Array);
        allRowIds.length.should.equal(2);
        isSelectAll.should.be.false;
        gridActivity.startDeleteActivity.restore();
        done();
      });
      var selectedRows = {deletedRows: [{id:10001}], selectedRows: {allRowIds: [10001, 20001]}, isSelectAll: false};
      gridActivity.onDeleteEvent($.Event(), selectedRows);
    });

    it("deleteRow should invoke startDeleteActivity with isSelectAll true", function(done) {
      sinon.stub(gridActivity, "startDeleteActivity", function(selectedRows, isSelectAll, allRowIds, selectedRowIds){
        isSelectAll.should.be.true;
        selectedRows.should.be.instanceOf(Array);
        selectedRows.length.should.equal(3);
        gridActivity.startDeleteActivity.restore();
        done();
      });
      var selectedRows = {
        selectedRowsIds: [10001, 10002, 10003],
        allRowIds: [10001, 10002, 10003],
        selectedRows: [{id: 10001}, {id:10002}, {id:10003}]
      };
      gridActivity.deleteRow(selectedRows);
    });

    it("deleteRow should invoke startDeleteActivity with isSelectAll false", function(done) {
      sinon.stub(gridActivity, "startDeleteActivity", function(selectedRows, isSelectAll, allRowIds, selectedRowIds){
        isSelectAll.should.be.false;
        selectedRows.should.be.instanceOf(Array);
        selectedRows.length.should.equal(3);
        gridActivity.startDeleteActivity.restore();
        done();
      });
      var selectedRows = {
        selectedRowsIds: [10001, 10002, 10003],
        selectedRows: [{id: 10001}, {id:10002}, {id:10003}]
      };
      gridActivity.deleteRow(selectedRows);
    });

    it("startDeleteActivity with isSelectAll false", function(done) {
      sinon.stub(gridActivity, "getIntent", function(){
        return new Slipstream.SDK.Intent(IntentActions.ACTION_DELETE, mime_type);
      });

      var view = new Backbone.View();
      view.gridWidget = {
        toggleRowSelection: function(rowsId) {
          console.log(rowsId);
        }
      };
      gridActivity.view = view;

      gridActivity.getContext.restore();
      var context = new Slipstream.SDK.ActivityContext();
      sinon.stub(gridActivity, "getContext", function() {
        return context;
      });
      sinon.stub(context, "startActivity", function(intent) {
        var extras = intent.getExtras();
        extras.selectedRows.length.should.equal(3);
        extras.selectedRows[2].id.should.equal(10003);
        expect(extras.isSelectAll).to.be.undefined;
        done();
      });
      var selectedRows = [{id: 10001}, {id:10002}, {id:10003}];
      var selectedRowIds = [10001, 10002, 10003];
      var isSelectAll = false, allRowIds = [];

      gridActivity.startDeleteActivity(selectedRows, isSelectAll, allRowIds, selectedRowIds);
    });
    it("startDeleteActivity with isSelectAll true", function(done) {
      sinon.stub(gridActivity, "getIntent", function(){
        return new Slipstream.SDK.Intent(IntentActions.ACTION_DELETE, mime_type);
      });

      var View = Backbone.View.extend({
        initialize: function() {
          this.gridWidget = {
            toggleRowSelection: function(rowsId) {
              console.log(rowsId);
            }
          };
        }
      });
      var view = new View();
      gridActivity.view = view;

      gridActivity.getContext.restore();
      var context = new Slipstream.SDK.ActivityContext();
      sinon.stub(gridActivity, "getContext", function() {
        return context;
      });
      sinon.stub(context, "startActivity", function(intent) {
        var extras = intent.getExtras();
        extras.selectedRows.length.should.equal(3);
        extras.selectedRows[2].id.should.equal(10003);
        extras.isSelectAll.should.be.true;
        extras.allRowIds.length.should.equal(3);
        extras.allRowIds[0].should.equal(10001);
        done();
      });
      var selectedRows = [{id: 10001}, {id:10002}, {id:10003}];
      var selectedRowIds = [10001, 10002, 10003];
      var isSelectAll = true, allRowIds = [10001, 10002, 10003];

      gridActivity.startDeleteActivity(selectedRows, isSelectAll, allRowIds, selectedRowIds);
    });

    it("startDeleteActivity should invoke onDeleteSuccess when delete success", function(done) {
      sinon.stub(gridActivity, "getIntent", function(){
        return new Slipstream.SDK.Intent(IntentActions.ACTION_DELETE, mime_type);
      });

      var View = Backbone.View.extend({
        initialize: function() {
          this.notify = function(msg) {
            console.log(msg);
          };
          this.gridWidget = {
            toggleRowSelection: function(rowsId) {
              console.log(rowsId);
            }
          };
        }
      });
      var view = new View();
      gridActivity.view = view;

      gridActivity.getContext.restore();
      var context = new Slipstream.SDK.ActivityContext();
      sinon.stub(gridActivity, "getContext", function() {
        return context;
      });
      sinon.spy(console, "log");
      sinon.stub(context, "startActivity", function(intent) {
        intent.getExtras().onDeleteSuccess();
        console.log.calledWith("success").should.be.true;
        console.log.restore();
        done();
      });
      var selectedRows = [{id: 10001}, {id:10002}, {id:10003}];
      var selectedRowIds = [10001, 10002, 10003];
      var isSelectAll = false, allRowIds = [];

      gridActivity.startDeleteActivity(selectedRows, isSelectAll, allRowIds, selectedRowIds);
    });
    it("startDeleteActivity should invoke onDeleteError when delete fails due to object used", function(done) {
      sinon.stub(gridActivity, "getIntent", function(){
        return new Slipstream.SDK.Intent(IntentActions.ACTION_DELETE, mime_type);
      });

      var view = new Backbone.View();
      view.gridWidget = {
        toggleRowSelection: function(rowsId) {
          console.log("toggleRowSelection:" + rowsId);
        },
        reloadGrid: function() {
          console.log("reloadGrid");
        }
      };
      gridActivity.view = view;

      gridActivity.getContext.restore();
      var context = new Slipstream.SDK.ActivityContext();
      sinon.stub(gridActivity, "getContext", function() {
        return context;
      });
      sinon.spy(console, "log");
      sinon.stub(context, "startActivity", function(intent) {
        var xhr = {
          responseText: '{"title":"USED_DELETE", "message":"address1#FW_Policy_1"}'
        };
        var textStatus, errorThrown;
        intent.getExtras().onDeleteError(xhr, textStatus, errorThrown);
        console.log.calledWith("failed delete").should.be.true;
        console.log.restore();
        done();
      });
      gridActivity.context = context;

      var selectedRows = [{id: 10001}, {id:10002}, {id:10003}];
      var selectedRowIds = [10001, 10002, 10003];
      var isSelectAll = false, allRowIds = [];

      gridActivity.startDeleteActivity(selectedRows, isSelectAll, allRowIds, selectedRowIds);
    });
    it("startDeleteActivity should invoke onDeleteError when delete fails due to other reason", function(done) {
      sinon.stub(gridActivity, "getIntent", function(){
        return new Slipstream.SDK.Intent(IntentActions.ACTION_DELETE, mime_type);
      });

      var view = new Backbone.View();
      view.gridWidget = {
        toggleRowSelection: function(rowsId) {
          console.log("toggleRowSelection:" + rowsId);
        },
        reloadGrid: function() {
          console.log("reloadGrid");
        }
      };
      gridActivity.view = view;

      gridActivity.getContext.restore();
      var context = new Slipstream.SDK.ActivityContext();
      sinon.stub(gridActivity, "getContext", function() {
        return context;
      });
      sinon.spy(console, "log");
      sinon.stub(context, "startActivity", function(intent) {
        var xhr = {
          responseText: '{"message":"address1#FW_Policy_1"}'
        };
        var textStatus, errorThrown;
        intent.getExtras().onDeleteError(xhr, textStatus, errorThrown);
        console.log.calledWith("failed delete").should.be.true;
        console.log.restore();
        done();
      });
      gridActivity.context = context;

      var selectedRows = [{id: 10001}, {id:10002}, {id:10003}];
      var selectedRowIds = [10001, 10002, 10003];
      var isSelectAll = false, allRowIds = [];

      gridActivity.startDeleteActivity(selectedRows, isSelectAll, allRowIds, selectedRowIds);
    });

    it("onImportEvent should start gridActivity with import intent", function(done) {
      sinon.stub(gridActivity, "getIntent", function(){
        return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_IMPORT, mime_type);
      });
      gridActivity.getContext.restore();
      var context = new Slipstream.SDK.ActivityContext();
      sinon.stub(gridActivity, "getContext", function() {
        return context;
      });
      sinon.stub(context, "startActivity", function(intent, callback){
        intent.action.should.equal(Slipstream.SDK.Intent.action.ACTION_IMPORT);
        intent.data.mime_type.should.equal(mime_type);
        done();
      });
      gridActivity.onImportEvent();
    });

    it("onExportEvent should start gridActivity with export intent", function(done) {
      sinon.stub(gridActivity, "getIntent", function(){
        return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_EXPORT, mime_type);
      });
      gridActivity.getContext.restore();
      var context = new Slipstream.SDK.ActivityContext();
      sinon.stub(gridActivity, "getContext", function() {
        return context;
      });
      sinon.stub(context, "startActivity", function(intent, callback){
        intent.action.should.equal(Slipstream.SDK.Intent.action.ACTION_EXPORT);
        intent.data.mime_type.should.equal(mime_type);
        var extras = intent.getExtras();
        extras.idArr.should.be.instanceOf(Array);
        extras.idArr.length.should.equal(3);
        extras.idArr[0].should.equal(10001);
        done();
      });
      var selectedObj = {selectedRowIds: [10001, 10002, 10003]};
      gridActivity.onExportEvent($.Event(), selectedObj);
    });

    it("onShowDetailViewEvent should start gridActivity with show_detail intent", function(done) {
      sinon.stub(gridActivity, "getIntent", function(){
        return new Slipstream.SDK.Intent(IntentActions.ACTION_SHOW_DETAIL_VIEW, mime_type);
      });
      gridActivity.getContext.restore();
      var context = new Slipstream.SDK.ActivityContext();
      sinon.stub(gridActivity, "getContext", function() {
        return context;
      });
      sinon.stub(context, "startActivity", function(intent, callback){
        intent.action.should.equal(IntentActions.ACTION_SHOW_DETAIL_VIEW);
        intent.data.mime_type.should.equal(mime_type);
        var extras = intent.getExtras();
        extras.id.should.equal(10001);
        done();
      });
      var selectedRows = {selectedRowIds: [10001]};
      gridActivity.onShowDetailViewEvent($.Event(), selectedRows);
    });

    it("onReplaceEvent should start gridActivity with replace intent", function(done) {
      sinon.stub(gridActivity, "getIntent", function(){
        return new Slipstream.SDK.Intent(IntentActions.ACTION_REPLACE, mime_type);
      });
      gridActivity.getContext.restore();
      var context = new Slipstream.SDK.ActivityContext();
      sinon.stub(gridActivity, "getContext", function() {
        return context;
      });
      sinon.stub(context, "startActivity", function(intent, callback){
        intent.action.should.equal(IntentActions.ACTION_REPLACE);
        intent.data.mime_type.should.equal(mime_type);
        var extras = intent.getExtras();
        extras.selectedRows.length.should.equal(3);
        extras.selectedRows[2].id.should.equal(10003);
        done();
      });
      var selectedRows = {
        selectedRows: [{id: 10001}, {id: 10002}, {id: 10003}]
      };
      gridActivity.onReplaceEvent($.Event(), selectedRows);
    });

    it("onShowUnusedEvent should invoke grid search function with showUnused", function(done) {
      var view = {
        gridWidget: {
          search: $.noop
        }
      };
      gridActivity.view = view;
      sinon.stub(gridActivity.view.gridWidget, "search", function(key, boolean){
        key.should.equal("showUnused");
        boolean.should.be.false;
        done();
      });
      gridActivity.onShowUnusedEvent();
    });

    it("onFindUsageEvent should start gridActivity with find_usage intent", function(done) {
      gridActivity.capabilities = {
        findUsage: {}
      };
      gridActivity.getContext.restore();
      var context = new Slipstream.SDK.ActivityContext();
      sinon.stub(gridActivity, "getContext", function() {
        return context;
      });
      Slipstream.SDK.URI = function(query) {
        this.query = query;
        return this;
      };
      sinon.stub(context, "startActivity", function(intent, callback){
        intent.action.should.equal(Slipstream.SDK.Intent.action.ACTION_SEARCH);
        intent.data.uri.query.should.equal("search://");
        var extras = intent.getExtras();
        extras.query.should.equal("fordemo AND referenceIds:(10001)");
        done();
      });
      var selectedRows = {
        selectedRows: [{key: "name", name: "fordemo", id: 10001}]
      };
      gridActivity.onFindUsageEvent($.Event(), selectedRows);
    });

    it("onDeleteUnusedEvent should start gridActivity with delete_unused intent", function(done) {
      sinon.stub(gridActivity, "getIntent", function(){
        return new Slipstream.SDK.Intent(IntentActions.ACTION_DELETE_UNUSED, mime_type);
      });
      gridActivity.getContext.restore();
      var context = new Slipstream.SDK.ActivityContext();
      sinon.stub(gridActivity, "getContext", function() {
        return context;
      });
      gridActivity.context = context;
      gridActivity.view = {
        gridWidget: {
          reloadGrid: $.noop
        },
        notify: $.noop
      };
      sinon.spy(gridActivity.view.gridWidget, "reloadGrid");
      sinon.spy(gridActivity.view, "notify");
      sinon.stub(context, "startActivity", function(intent, callback){
        intent.action.should.equal(IntentActions.ACTION_DELETE_UNUSED);
        intent.data.mime_type.should.equal(mime_type);
        var extras = intent.getExtras();
        extras.onDeleteUnusedSuccess.should.be.instanceOf(Function);
        extras.onDeleteUnusedError.should.be.instanceOf(Function);
        extras.onDeleteUnusedSuccess();
        extras.onDeleteUnusedError();
        gridActivity.view.notify.calledTwice.should.be.true;
        gridActivity.view.gridWidget.reloadGrid.calledOnce.should.be.true;
        done();
      });
      var selectedRows = {
        selectedRows: [{id: 10001}, {id: 10002}, {id: 10003}]
      };
      gridActivity.onDeleteUnusedEvent();
    });

    it("onShowDuplicatesEvent should start gridActivity with show_duplicates intent", function(done) {
      sinon.stub(gridActivity, "getIntent", function(){
        return new Slipstream.SDK.Intent(IntentActions.ACTION_SHOW_DUPLICATES, mime_type);
      });
      gridActivity.getContext.restore();
      var context = new Slipstream.SDK.ActivityContext();
      sinon.stub(gridActivity, "getContext", function() {
        return context;
      });
      sinon.stub(context, "startActivity", function(intent, callback){
        intent.action.should.equal(IntentActions.ACTION_SHOW_DUPLICATES);
        intent.data.mime_type.should.equal(mime_type);
        done();
      });
      gridActivity.onShowDuplicatesEvent();
    });

    it("onAssignToDomainEvent should start gridActivity with assign_to_domain intent", function(done) {
      sinon.stub(gridActivity, "getIntent", function(){
        return new Slipstream.SDK.Intent(IntentActions.ACTION_ASSIGN_TO_DOMAIN, mime_type);
      });
      gridActivity.getContext.restore();
      var context = new Slipstream.SDK.ActivityContext();
      sinon.stub(gridActivity, "getContext", function() {
        return context;
      });
      sinon.stub(context, "startActivity", function(intent, callback){
        intent.action.should.equal(IntentActions.ACTION_ASSIGN_TO_DOMAIN);
        intent.data.mime_type.should.equal(mime_type);
        var extras = intent.getExtras();
        extras.selectedRows.length.should.equal(2);
        extras.selectedRows[1].should.equal(10002);
        extras.featureRelatedConf.should.equal("featureRelatedConf");
        done();
      });
      var event = $.Event();
      event.data = {
        featureRelatedConf: "featureRelatedConf"
      };
      var selectedRows = [10001, 10002];
      gridActivity.onAssignToDomainEvent(event, selectedRows);
    });

    it("onStart for create action", function() {
      var capabilities = {
        "create": {
          view: Backbone.View,
          rbacCapabilities: ["createAddress"]
        }
      };
      sinon.stub(gridActivity, "buildOverlay", function() {
        console.log("buildOverlay")
      });
      var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE, mime_type);
      gridActivity.intent = intent;
      gridActivity.capabilities = capabilities;
      gridActivity.model = Backbone.Model;
      gridActivity.onStart();
      gridActivity.buildOverlay.called.should.be.true;
      gridActivity.buildOverlay.restore();
    });

    it("onStart for edit action load data fail", function(done) {
      var View = Backbone.View.extend({
        notify : function(error, text) {
          error.should.equal("error");
          text.should.equal("[undefined]")
          done();
        }
      });
      var capabilities = {
        "edit": {
          view: View,
          rbacCapabilities: ["editAddress"]
        }
      };
      gridActivity.capabilities = capabilities;

      var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_EDIT, mime_type);
      intent.putExtras({id: 100001});
      gridActivity.intent = intent;

      var Model = Backbone.Model.extend({
        url: "/api/juniper/sd/address-management/addresses"
      });
      gridActivity.model = Model;
      gridActivity.onStart();
    });

    it("onStart for edit action load data success", function(done) {
      var View = Backbone.View.extend({});
      var capabilities = {
        "edit": {
          view: View,
          rbacCapabilities: ["editAddress"]
        }
      };
      gridActivity.capabilities = capabilities;

      var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_EDIT, mime_type);
      intent.putExtras({id: 100001});
      gridActivity.intent = intent;

      var Model = Backbone.Model.extend({
        url: "/api/juniper/sd/address-management/addresses"
      });
      gridActivity.model = Model;
      sinon.stub(gridActivity, "buildOverlay", function() {
        console.log("buildOverlay")
      });
      $.mockjax({
        url: "/api/juniper/sd/address-management/addresses",
        type: "GET",
        responseTime: 100,
        response: function(data, done2) {
          this.responseText = {};
          done2();
          gridActivity.buildOverlay.calledOnce.should.be.true;
          gridActivity.buildOverlay.restore();
          done();
        }
      });
      gridActivity.onStart();
    });

    it("onStart for clone action load data success", function(done) {
      var View = Backbone.View.extend({});
      var capabilities = {
        "clone": {
          view: View,
          rbacCapabilities: ["cloneAddress"]
        }
      };
      gridActivity.capabilities = capabilities;

      var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CLONE, mime_type);
      intent.putExtras({id: 100001});
      gridActivity.intent = intent;

      var Model = Backbone.Model.extend({
        url: "/api/juniper/sd/address-management/addresses/10001"
      });

      var collection = new Backbone.Collection(null, {
        url: function(filter) {
          return "/api/juniper/sd/address-management/addresses";
        }
      });
      collection.model = Model;
      gridActivity.collection = collection;

      sinon.stub(gridActivity, "buildOverlay", function() {
        console.log("buildOverlay")
      });
      $.mockjax({
        url: "/api/juniper/sd/address-management/addresses",
        type: "GET",
        responseTime: 100,
        responseText: [{name: "test_copy_1"}, {name: "test_copy_2"}, {name: "test"}]
      });
      $.mockjax({
        url: "/api/juniper/sd/address-management/addresses/10001",
        type: "GET",
        responseTime: 100,
        responseText: {name: "test"}
      });
      gridActivity.onStart();
      setTimeout(function() {
        gridActivity.buildOverlay.calledOnce.should.be.true;
        gridActivity.buildOverlay.restore();
        done();
      }, 1000);
    });
    it("onStart for clone action load model data fail", function(done) {
      sinon.spy(console, "log");
      var View = Backbone.View.extend({
        notify : function(error, text) {
          console.log(error);
        }
      });
      var capabilities = {
        "clone": {
          view: View,
          rbacCapabilities: ["cloneAddress"]
        }
      };
      gridActivity.capabilities = capabilities;

      var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CLONE, mime_type);
      intent.putExtras({id: 100001});
      gridActivity.intent = intent;

      var Model = Backbone.Model.extend({
        url: "/api/juniper/sd/address-management/addresses/10001"
      });

      var collection = new Backbone.Collection();
      collection.model = Model;
      gridActivity.collection = collection;

      $.mockjax({
        url: "/api/juniper/sd/address-management/addresses/10001",
        type: "GET",
        status: 500,
        responseTime: 100,
        responseText: true
      });
      gridActivity.onStart();
      setTimeout(function() {
        console.log.calledWith('failed fetch').should.be.true;
        console.log.restore();
        done();
      }, 1000);
    });
    it("onStart for clone action load collection data fail", function(done) {
      sinon.spy(console, "log");
      var View = Backbone.View.extend({
        notify : function(error, text) {
          console.log(error);
        }
      });
      var capabilities = {
        "clone": {
          view: View,
          rbacCapabilities: ["cloneAddress"]
        }
      };
      gridActivity.capabilities = capabilities;

      var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CLONE, mime_type);
      intent.putExtras({id: 100001});
      gridActivity.intent = intent;

      var Model = Backbone.Model.extend({
        url: "/api/juniper/sd/address-management/addresses/10001"
      });

      var collection = new Backbone.Collection(null, {
        url: function(filter) {
          return "/api/juniper/sd/address-management/addresses";
        }
      });
      collection.model = Model;
      gridActivity.collection = collection;

      $.mockjax({
        url: "/api/juniper/sd/address-management/addresses",
        type: "GET",
        status: 500,
        responseTime: 100,
        responseText: true
      });
      $.mockjax({
        url: "/api/juniper/sd/address-management/addresses/10001",
        type: "GET",
        responseTime: 100,
        responseText: {name: "test"}
      });
      gridActivity.onStart();
      setTimeout(function() {
        console.log.calledWith('error').should.be.true;
        console.log.restore();
        done();
      }, 1000);
    });

    it("onStart for select action", function(done) {
      var View = Backbone.View.extend({});
      var capabilities = {
        "select": {
          view: View,
          rbacCapabilities: ["selectAddress"]
        }
      };
      gridActivity.capabilities = capabilities;

      var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_SELECT, mime_type);
      gridActivity.intent = intent;

      gridActivity.onStart();
      setTimeout(function() {
        gridActivity.overlay.should.not.be.null;
        gridActivity.overlay.build.should.be.instanceOf(Function)
        done();
      }, 500);
    });

    it("onstart for import intent", function(done) {
      var View = Backbone.View.extend({});
      var capabilities = {
        "import": {
          view: View,
          rbacCapabilities: ["importAddress"]
        }
      };
      gridActivity.capabilities = capabilities;

      var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_IMPORT, mime_type);
      gridActivity.intent = intent;

      gridActivity.onStart();
      setTimeout(function() {
        gridActivity.overlay.should.not.be.null;
        gridActivity.overlay.build.should.be.instanceOf(Function);
        done();
      }, 1000);
    });

    it("onstart for export intent", function(done) {
      var View = Backbone.View.extend({
        initialize: function(){
          $("#main-content").append("<div id='export_view'></div>");
        }
      });
      var capabilities = {
        "export": {
          view: View,
          rbacCapabilities: ["exportAddress"]
        }
      };
      gridActivity.capabilities = capabilities;

      var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_EXPORT, mime_type);
      gridActivity.intent = intent;
      gridActivity.onStart();
      setTimeout(function() {
        $("#export_view").should.have.lengthOf(1);
        $("#main-content").empty();
        done();
      }, 1000);
    });

    it("onstart for replace intent", function(done) {
      var View = Backbone.View.extend({});
      var capabilities = {
        "replace": {
          view: View,
          rbacCapabilities: ["replaceAddress"]
        }
      };
      gridActivity.capabilities = capabilities;

      var intent = new Slipstream.SDK.Intent(IntentActions.ACTION_REPLACE, mime_type);
      gridActivity.intent = intent;

      gridActivity.onStart();
      setTimeout(function() {
        gridActivity.overlay.should.not.be.null;
        gridActivity.overlay.build.should.be.instanceOf(Function);
        done();
      }, 1000);
    });

    it("onstart for show_duplicate intent", function(done) {
      var View = Backbone.View.extend({});
      var capabilities = {
        "showDuplicates": {
          view: View,
          gridconfiguration: function(context){
            this.getValues = function() {
              return {
                "columns": [{
                  "index": "id",
                  "name": "id",
                  "hidden": true
                }]
              };
            }
          },
          mergeModel: Backbone.Model,
          mergeRbacCapabilities: "mergeRbac",
          deleteRbacCapabilities: "deleteRbac",
          rbacCapabilities: ["replaceAddress"]
        }
      };
      gridActivity.capabilities = capabilities;

      var intent = new Slipstream.SDK.Intent(IntentActions.ACTION_SHOW_DUPLICATES, mime_type);
      gridActivity.intent = intent;

      gridActivity.onStart();
      setTimeout(function() {
        gridActivity.overlay.should.not.be.null;
        gridActivity.overlay.build.should.be.instanceOf(Function);
        done();
      }, 1000);
    });

    it("onstart for assing_to_domain intent", function(done) {
      var intent = new Slipstream.SDK.Intent(IntentActions.ACTION_ASSIGN_TO_DOMAIN, mime_type);
      var extras = {
        featureRelatedConf: {},
        selectedRows: {
          selectedRows: [10001, 10002]
        }
      };
      intent.putExtras(extras);
      gridActivity.intent = intent;
      gridActivity.context = gridActivity.getContext();

      var capabilities = {
        "assignToDomain": {
          size: "large"
        }
      };
      gridActivity.capabilities = capabilities;

      gridActivity.onStart();
      setTimeout(function() {
        gridActivity.overlay.should.not.be.null;
        gridActivity.overlay.build.should.be.instanceOf(Function);
        done();
      }, 500);
    });

    it("onstart for show_detail intent load data success", function(done) {
      var View = Backbone.View.extend({
        initialize: function() {
          this.notify = $.noop;
          $("#main-content").append("<div id='detail_view'></div>");
        }
      });
      var capabilities = {
        "showDetailView": {
          view: View,
          rbacCapabilities: ["showDetailViewAddress"]
        }
      };
      gridActivity.capabilities = capabilities;

      gridActivity.model = Backbone.Model.extend({
        url: "/api/juniper/sd/address-management/addresses"
      });
      var intent = new Slipstream.SDK.Intent(IntentActions.ACTION_SHOW_DETAIL_VIEW, mime_type);
      intent.putExtras({
        id: 10001
      });
      gridActivity.intent = intent;
      sinon.stub(gridActivity, "buildOverlay");
      $.mockjax({
        url: "/api/juniper/sd/address-management/addresses",
        type: "GET",
        responseTime: 100,
        response: function(data, done2) {
          this.responseText = true;
          done2();
          gridActivity.buildOverlay.calledOnce.should.be.true;
          gridActivity.buildOverlay.restore();
          done();
        }
      });

      gridActivity.onStart();
    });

    it("onstart for show_detail intent load data fail", function(done) {
      var View = Backbone.View.extend({
        initialize: function() {
          this.notify = function(error, key){
            console.log("show detail view load data fail");
          };
        }
      });
      var capabilities = {
        "showDetailView": {
          view: View,
          rbacCapabilities: ["showDetailViewAddress"]
        }
      };
      gridActivity.capabilities = capabilities;

      gridActivity.model = Backbone.Model.extend({
        url: "/api/juniper/sd/address-management/addresses"
      });
      var intent = new Slipstream.SDK.Intent(IntentActions.ACTION_SHOW_DETAIL_VIEW, mime_type);
      intent.putExtras({
        id: 10001
      });
      gridActivity.intent = intent;

      sinon.spy(console, "log");
      $.mockjax({
        url: "/api/juniper/sd/address-management/addresses",
        type: "GET",
        responseTime: 100,
        status: 500,
        response: function(data, done2) {
          this.responseText = true;
          done2();
          console.log.calledWith("show detail view load data fail").should.be.true;
          console.log.restore();
          done();
        }
      });

      gridActivity.onStart();
    });

    it("onstart for delete intent and delete success", function(done) {
      var intent = new Slipstream.SDK.Intent(IntentActions.ACTION_DELETE, mime_type);
      gridActivity.intent = intent;
      var extras = {
        onDeleteSuccess: $.noop,
        onDeleteError: $.noop,
        allRowIds: [],
        isSelectAll: false
      };
      intent.putExtras(extras);
      sinon.spy(extras, "onDeleteSuccess");
      sinon.spy(extras, "onDeleteError");

      gridActivity.model = Backbone.Model.extend({
        urlRoot: "/api/juniper/sd/address-management/addresses"
      });
      $.mockjax({
        url: "/api/juniper/sd/address-management/addresses/delete",
        type: "POST",
        responseTime: 100,
        response: function(settings, done2) {
          this.responseText = true;
          done2();
          extras.onDeleteSuccess.calledOnce.should.be.true;
          extras.onDeleteError.calledOnce.should.be.false;
          done();
        }
      });
      gridActivity.onStart();
    });

    it("onstart for delete intent and delete failure", function(done) {
      var intent = new Slipstream.SDK.Intent(IntentActions.ACTION_DELETE, mime_type);
      gridActivity.intent = intent;
      var extras = {
        onDeleteSuccess: $.noop,
        onDeleteError: $.noop,
        allRowIds: [],
        isSelectAll: false
      };
      intent.putExtras(extras);
      sinon.spy(extras, "onDeleteSuccess");
      sinon.spy(extras, "onDeleteError");

      gridActivity.model = Backbone.Model.extend({
        urlRoot: "/api/juniper/sd/address-management/addresses"
      });
      $.mockjax({
        url: "/api/juniper/sd/address-management/addresses/delete",
        type: "POST",
        status: 500,
        responseTime: 100,
        response: function(settings, done2) {
          this.responseText = true;
          done2();
          extras.onDeleteError.calledOnce.should.be.true;
          extras.onDeleteSuccess.calledOnce.should.be.false;
          done();
        }
      });
      gridActivity.onStart();
    });

    it("onstart for delete_unused intent", function() {
      var intent = new Slipstream.SDK.Intent(IntentActions.ACTION_DELETE_UNUSED, mime_type);
      gridActivity.intent = intent;
      gridActivity.context = gridActivity.getContext();
      gridActivity.onStart();
      gridActivity.confirmationDialogWidget.should.not.be.null;
      gridActivity.confirmationDialogWidget.build.should.be.instanceOf(Function);
    });

    it("onstart for list intent", function(done) {
      var gridConfiguration = function(){
        this.getValues = function() {
          return {
            url: "/api/juniper/sd/address-management/addresses",
            columns: [{
              id: "name",
              text: "name"
            }, {
              id: "id",
              text: "",
              hidden: true
            }]
          };
        };
        return this;
      };
      gridActivity.gridConf = gridConfiguration;

      var View = Backbone.View.extend({
        initialize: function(options) {
          this.conf = options.conf;
          this.render();
        },
        render: function() {
          $("#main-content").append("<div id='list_view'></div>");
        }
      });
      var capabilities = {
        "list": {
          view: View
        }
      };
      gridActivity.capabilities = capabilities;
      sinon.stub(gridActivity, "subscribeNotifications");
      var intent = new Slipstream.SDK.Intent("list", mime_type);
      gridActivity.intent = intent;
      gridActivity.onStart();
      setTimeout(function() {
        $("#list_view").should.have.lengthOf(1);
        $("#main-content").empty();
        done();
      }, 500);
    });

    it("addSelectAllCallback should add onSelectAll for conf if onSelectAll is not defined", function(done) {
      var setIdsError = $.noop, tokens, parameters;
      var setIdsSuccess = function() {
        console.log("load all id success");
      };
      var conf = {
        url: "/api/juniper/sd/address-management/addresses/select-all"
      };
      sinon.spy(console, "log");

      gridActivity.addSelectAllCallback(conf)
      conf.onSelectAll.should.be.instanceOf(Function);

      $.mockjax({
        url: "/api/juniper/sd/address-management/addresses/select-all*",
        type: "GET",
        responseTime: 100,
        responseText: true
      });
      conf.onSelectAll(setIdsSuccess, setIdsError, tokens, parameters);
      setTimeout(function(){
        console.log.calledWith("load all id success").should.be.true;
        console.log.restore();
        done();
      }, 1000);
    });
    it("addSelectAllCallback should not add onSelectAll for conf if onSelectAll is defined", function() {
      sinon.spy(console, "log");

      var conf = {
        url: "/api/juniper/sd/address-management/addresses/select-all",
        onSelectAll: function() {
          console.log("predefined onSelectAll is invoked");
        }
      };
      gridActivity.addSelectAllCallback(conf)
      conf.onSelectAll();
      console.log.calledWith("predefined onSelectAll is invoked").should.be.true;
      console.log.restore();
    });

    it("setItemStatus should return true for isItemDisabled=true whatever other two params values are", function() {
      var key = 'test', selectedRows = [];
      var isItemDisabled = true;
      var result = gridActivity.setItemStatus(key, isItemDisabled, selectedRows);
      result.should.be.true;
    });
    it("setItemStatus should return true for key=edit, isItemDisabled=false but isDisabledEdit return true", function() {
      var key = 'edit', selectedRows = [], isItemDisabled = false;
      sinon.stub(gridActivity, "isDisabledEdit", function(){
        return true;
      });
      var result = gridActivity.setItemStatus(key, isItemDisabled, selectedRows);
      result.should.be.true;
      gridActivity.isDisabledEdit.restore();
    });
    it("setItemStatus should return false for key=edit, isItemDisabled=false but isDisabledEdit return false", function() {
      var key = 'edit', selectedRows = [], isItemDisabled = false;
      sinon.stub(gridActivity, "isDisabledEdit", function(){
        return false;
      });
      var result = gridActivity.setItemStatus(key, isItemDisabled, selectedRows);
      result.should.be.false;
      gridActivity.isDisabledEdit.restore();
    });
    it("setItemStatus should return true for key=delete, isItemDisabled=false but isDisabledDelete return true", function() {
      var key = 'delete', selectedRows = [], isItemDisabled = false;
      sinon.stub(gridActivity, "isDisabledDelete", function(){
        return true;
      });
      var result = gridActivity.setItemStatus(key, isItemDisabled, selectedRows);
      result.should.be.true;
      gridActivity.isDisabledDelete.restore();
    });
    it("setItemStatus should return false for key=delete, isItemDisabled=false but isDisabledDelete return false", function() {
      var key = 'delete', selectedRows = [], isItemDisabled = false;
      sinon.stub(gridActivity, "isDisabledDelete", function(){
        return false;
      });
      var result = gridActivity.setItemStatus(key, isItemDisabled, selectedRows);
      result.should.be.false;
      gridActivity.isDisabledDelete.restore();
    });
    it("setItemStatus should return true for key=quickView, isItemDisabled=false but isDisabledShowDetailView return true", function() {
      var key = 'quickView', selectedRows = [], isItemDisabled = false;
      sinon.stub(gridActivity, "isDisabledShowDetailView", function(){
        return true;
      });
      var result = gridActivity.setItemStatus(key, isItemDisabled, selectedRows);
      result.should.be.true;
      gridActivity.isDisabledShowDetailView.restore();
    });
    it("setItemStatus should return false for key=quickView, isItemDisabled=false but isDisabledShowDetailView return false", function() {
      var key = 'quickView', selectedRows = [], isItemDisabled = false;
      sinon.stub(gridActivity, "isDisabledShowDetailView", function(){
        return false;
      });
      var result = gridActivity.setItemStatus(key, isItemDisabled, selectedRows);
      result.should.be.false;
      gridActivity.isDisabledShowDetailView.restore();
    });
    it("setItemStatus should return true for key=clearAll, isItemDisabled=false and selectedRows=[]", function() {
      var key = 'clearAll', selectedRows = [], isItemDisabled = false;
      var result = gridActivity.setItemStatus(key, isItemDisabled, selectedRows);
      result.should.be.true;
    });
    it("setItemStatus should return false for key=clearAll, isItemDisabled=false and selectedRows is not empty", function() {
      var key = 'clearAll', selectedRows = [{id: 10001}], isItemDisabled = false;
      var result = gridActivity.setItemStatus(key, isItemDisabled, selectedRows);
      result.should.be.false;
    });

    it("setButtonStatus should enable edit and delete when isDisabledEditButton and isDisabledDeleteButton return false", function(done) {
      var successUpdate = function(result) {
        result.edit.should.be.true;
        result.delete.should.be.true;
        done();
      };
      sinon.stub(gridActivity, "isDisabledEditButton", function(){
        return false;
      });
      sinon.stub(gridActivity, "isDisabledDeleteButton", function(){
        return false;
      });
      gridActivity.setButtonStatus([], successUpdate, $.noop);
    });
    it("setButtonStatus should not enable edit and delete when isDisabledEditButton and isDisabledDeleteButton return true", function(done) {
      var successUpdate = function(result) {
        result.edit.should.be.false;
        result.delete.should.be.false;
        done();
      };
      sinon.stub(gridActivity, "isDisabledEditButton", function(){
        return true;
      });
      sinon.stub(gridActivity, "isDisabledDeleteButton", function(){
        return true;
      });
      gridActivity.setButtonStatus([], successUpdate, $.noop);
    });

    it("setContextMenuItemStatus should add contextMenuItemStatus to conf object", function() {
      var conf = {};
      sinon.stub(gridActivity, "setItemStatus", function(){
        console.log("setItemStatus");
      });
      sinon.spy(console, "log");
      gridActivity.setContextMenuItemStatus(conf);
      conf.contextMenuItemStatus.should.be.instanceOf(Function);
      conf.contextMenuItemStatus();
      console.log.calledWith("setItemStatus").should.be.true;
      console.log.restore();
    });
    it("setContextMenuItemStatus should add actionStatusCallback to conf object", function() {
      var conf = {};
      sinon.stub(gridActivity, "setButtonStatus", function(){
        console.log("setButtonStatus");
      });
      sinon.spy(console, "log");
      gridActivity.setContextMenuItemStatus(conf);
      conf.actionButtons.actionStatusCallback.should.be.instanceOf(Function);
      conf.actionButtons.actionStatusCallback();
      console.log.calledWith("setButtonStatus").should.be.true;
      console.log.restore();
    });

    it("decorateGridConf should not add filter if it is already defined", function() {
      var conf = {
        filter: {
          onBeforeSearch: function(){
            console.log("predefined onBeforeSearch");
          }
        }
      };
      sinon.spy(console, "log");
      gridActivity.decorateGridConf(conf);
      conf.filter.onBeforeSearch();
      console.log.restore();
    });

    it("subscribeNotifications should return array with specified value", function() {
      var gridConfiguration = function(){
        this.getValues = function() {
          return {
            url: "/api/juniper/sd/address-management/addresses",
            columns: [{
              id: "name",
              text: "name"
            }]
          };
        };
        this.getNotificationConfig = function() {
          return {};
        };
        return this;
      };
      gridActivity.gridConf = gridConfiguration;
      sinon.stub(Slipstream.SDK.MessageResolver.prototype, "subscribe", function(msg, uri, callback) {
        return msg + uri;
      });
      var result = gridActivity.subscribeNotifications();
      result.length.should.equal(1);
      result[0].should.equal("topics://vnd.juniper.sm.sse//api/juniper/sd/address-management/addresses");
      Slipstream.SDK.MessageResolver.prototype.subscribe.restore();
    });
    it("subscribeNotifications should invoke callback when event triggered", function() {
      var gridConfiguration = function(){
        this.getValues = function() {
          return {
            url: "/api/juniper/sd/address-management/addresses",
            columns: [{
              id: "name",
              text: "name"
            }]
          };
        };
        this.getNotificationConfig = function() {
          return {};
        };
        return this;
      };
      gridActivity.gridConf = gridConfiguration;
      sinon.stub(Slipstream.SDK.MessageResolver.prototype, "subscribe", function(msg, uri, callback) {
        callback.call(gridActivity);
        return true;
      });
      gridActivity.gridWidget = {reloadGrid: function(){}};
      sinon.spy(gridActivity.gridWidget, "reloadGrid");
      var result = gridActivity.subscribeNotifications();
      gridActivity.gridWidget.reloadGrid.calledOnce.should.be.true;
      Slipstream.SDK.MessageResolver.prototype.subscribe.restore();
    });
    it("unSubscribeNotification should remove all subscribtions", function() {
      // build smSseEventSubscribe first
      var gridConfiguration = function(){
        this.getValues = function() {
          return {
            url: "/api/juniper/sd/address-management/addresses",
            columns: [{
              id: "name",
              text: "name"
            }]
          };
        };
        this.getNotificationConfig = function() {
          return {};
        };
        return this;
      };
      gridActivity.gridConf = gridConfiguration;
      sinon.stub(Slipstream.SDK.MessageResolver.prototype, "subscribe", function(msg, uri, callback) {
        return msg + uri;
      });
      sinon.stub(Slipstream.SDK.MessageResolver.prototype, "unsubscribe", function(msg) {
        return "";
      });
      sinon.spy(console, "log");
      var result = gridActivity.subscribeNotifications();
      gridActivity.unSubscribeNotification(result);
      console.log.calledWith("Sm SSE event Un Subscription called for").should.be.true;
      console.log.calledWith("In Stop Subscription Total Subscriptions 0").should.be.true;
      console.log.restore();
      Slipstream.SDK.MessageResolver.prototype.subscribe.restore();
      Slipstream.SDK.MessageResolver.prototype.unsubscribe.restore();
    });

    it("buildOverlay should build overlay element with specify class", function() {
      var View = Backbone.View.extend({
        initialize: function(options) {
          $("#main-content").append("<div id='overlay_content' class='overlay-wrapper'></div>");
        }
      });
      var view = new View({});

      gridActivity.getContext.restore();
      var context = new Slipstream.SDK.ActivityContext();
      context["ctx_name"] = "For_Unit_Testing";
      sinon.stub(gridActivity, "getContext", function() {
        return context;
      });

      gridActivity.buildOverlay(view, {});
      gridActivity.overlay.getOverlayContainer().hasClass("For_Unit_Testing").should.be.true;
      $("#main-content").empty();
    });

    it("createConfirmationDialog should log 'yes' when Yes button clicked", function(done) {
      var options = {
        onYesEvent: function() {
          console.log("yes button clicked");
        },
        onNoEvent: $.noop,
        title: "confirmation dialog",
        question: "for testing"
      };
      sinon.spy(console, "log");
      gridActivity.context = gridActivity.getContext();

      gridActivity.createConfirmationDialog(options);
      gridActivity.confirmationDialogWidget.vent.trigger("yesEventTriggered");
      setTimeout(function() {
        console.log.calledWith("yes button clicked").should.be.true;
        console.log.restore();
        done();
      }, 1000);
    });
    it("createConfirmationDialog should log 'no' when No button is clicked", function(done) {
      var options = {
        onYesEvent: $.noop,
        onNoEvent: function() {
          console.log("no button clicked");
        },
        title: "confirmation dialog",
        question: "for testing"
      };
      sinon.spy(console, "log");
      gridActivity.context = gridActivity.getContext();

      gridActivity.createConfirmationDialog(options);
      gridActivity.confirmationDialogWidget.vent.trigger("noEventTriggered");
      setTimeout(function() {
        console.log.calledWith("no button clicked").should.be.true;
        console.log.restore();
        done();
      }, 1000);
    });
    it("closeConfirmationDialog should destroy widget", function() {
      var options = {
        title: "confirmation dialog",
        question: "for closeConfirmationDialog testing"
      };
      gridActivity.context = gridActivity.getContext();

      gridActivity.createConfirmationDialog(options);
      sinon.spy(gridActivity.confirmationDialogWidget, "destroy");

      gridActivity.closeConfirmationDialog();
      gridActivity.confirmationDialogWidget.destroy.calledOnce.should.be.true;
      gridActivity.confirmationDialogWidget.destroy.restore();
    });

    it("onCreate should show \"Created GridActivity\" in console", function() {
      sinon.spy(console, "log");
      gridActivity.onCreate();
      console.log.calledWith("Created GridActivity").should.be.true;
      console.log.restore();
    });
    it("getDeleteIDListObject", function() {
      var result = gridActivity.getDeleteIDListObject([10001, 10002, 10003]);
      result["id-list"].ids.length.should.equal(3);
      result["id-list"].ids[2].should.equal(10003);
    });
    it("deleteUnused should invoke the success callback", function(done) {
      var intent = new Slipstream.SDK.Intent(IntentActions.ACTION_DELETE_UNUSED, mime_type);
      sinon.stub(gridActivity, "getIntent", function(done){
        return intent;
      });

      gridActivity.context = gridActivity.getContext();
      gridActivity.model = Backbone.Model.extend({
        urlRoot: "/api/juniper/sd/address-management/addresses"
      });

      sinon.stub(gridActivity, "closeConfirmationDialog");

      var onSuccess = function() {
        console.log("delete unused success");
      };
      var extras = {
        onDeleteUnusedSuccess: onSuccess,
        onDeleteUnusedError: $.noop
      };
      intent.putExtras(extras);
      sinon.spy(extras, "onDeleteUnusedSuccess");
      sinon.spy(extras, "onDeleteUnusedError");

      $.mockjax({
        url: "/api/juniper/sd/address-management/addresses/delete-unused",
        type: "DELETE",
        responseTime: 100,
        response: function(data, done2) {
          this.responseText = true;
          done2();
          extras.onDeleteUnusedSuccess.called.should.be.true;
          extras.onDeleteUnusedError.called.should.be.false;
          done();
        }
      });
      gridActivity.deleteUnused();
    });
    it("deleteUnused should invoke the error callback", function(done) {
      var intent = new Slipstream.SDK.Intent(IntentActions.ACTION_DELETE_UNUSED, mime_type);
      sinon.stub(gridActivity, "getIntent", function(done){
        return intent;
      });
      gridActivity.context = gridActivity.getContext();

      gridActivity.model = Backbone.Model.extend({
        urlRoot: "/api/juniper/sd/address-management/addresses"
      });
      sinon.stub(gridActivity, "closeConfirmationDialog");
      var onError = function() {
        console.log("delete unused error");
      };
      var extras = {
        onDeleteUnusedSuccess: $.noop,
        onDeleteUnusedError: onError
      };
      intent.putExtras(extras);
      sinon.spy(extras, "onDeleteUnusedSuccess");
      sinon.spy(extras, "onDeleteUnusedError");

      $.mockjax({
        url: "/api/juniper/sd/address-management/addresses/delete-unused",
        type: "DELETE",
        status: 500,
        responseTime: 100,
        response: function(data, done2) {
          this.responseText = true;
          done2();
          extras.onDeleteUnusedError.called.should.be.true;
          extras.onDeleteUnusedSuccess.called.should.be.fales;
          done();
        }
      });
      gridActivity.deleteUnused();
    });

    it('Test ListIntent Action With Custom Container', function () {
      var getViewConfOriginal = {
          a: 1,
          'def-ed': 'merge_ME',
          c: 4
        },
        spyViewRender = sinon.spy(), getViewStub = sinon.stub(gridActivity, 'getView', function () {
          return {
            'conf': getViewConfOriginal,
            render: spyViewRender
          };
        }),
        getIntentStub = sinon.stub(gridActivity, 'getIntent', function () {
          return {
            getExtras: function () {
              return {
                gridConfig: {
                  a: 23,
                  b: 34,
                  'def-ed': 'merge_ME_Final'
                },
                containerDiv: 'myInternalDiv'
              }
            }
          }
        }), testConf = {
          a: 23,
          b: 34,
          'def-ed': 'merge_ME_Final',
          c: 4
        };
      $(document.body).append('<div id="myInternalDiv"/>');
      gridActivity.onListIntentWithCustomContainer();
      assert(spyViewRender.calledOnce);
      assert.deepEqual(getViewConfOriginal, testConf);
      assert.isObject($.find('#myInternalDiv')[0].__view);
      getViewStub.restore();
      getIntentStub.restore();

    });
    it('Test ListIntent with custom conatiner Action called from onStart', function () {
      var  _DelayStub = sinon.stub(_,'delay', function (func) {
          func();
        }), getIntentStub = sinon.stub(gridActivity, 'getIntent', function () {
          return {
            action: 'sd.intent.action.ACTION_LIST_CUSTOM_CONTAINER'
          }
        }),
        onListIntentWithCustomContainerStub = sinon.stub(gridActivity, 'onListIntentWithCustomContainer');
      gridActivity.onStart();

      assert(onListIntentWithCustomContainerStub.calledOnce);
      getIntentStub.restore();
      _DelayStub.restore();
    });
  })
});