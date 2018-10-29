define([
  '../views/ipsRulesView.js',
  '../constants/ipsRuleGridConstants.js',
  '../models/ipsRuleCollection.js',
  '../../../../../base-policy-management/js/policy-management/rules/views/baseRulesView.js',
], function (View,Constants, Collection,BaseRulesView) {

  var ipsRulesView, context = new Slipstream.SDK.ActivityContext(),
    policy = {'ips-policy-type' : ["IPSBASIC"]}, CUID = '', rulesView, domainPolicyStub, customButtons;

  describe('ips Rules View UT', function () {

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

        ipsRulesView = new View({
          context: context,
          actionEvents: {},
          ruleCollection: new Collection(CUID, policy, context),
          policyManagementConstants: Constants,
          cuid: CUID,
          extras: {
            filter: 'filter',
            operation : 'createRule'
          }

        });

        ipsRulesView.should.exist;
        stub1.restore();
        stub2.restore();
        stub3.restore();

        ipsRulesView.customActionKeys = {
          SAVE: 'save',
          DISCARD: 'discard',
          PUBLISH: 'publish',
          UPDATE: 'update'
        }

        ipsRulesView.gridWidgetObject = {
          updateActionStatus: function () {

          }
        }

        var div = $('<div id = "saveRules_button"/>');
        ipsRulesView.$el.append(div);

        div = $('<div id = "discardRules_button"/>');
        ipsRulesView.$el.append(div);
        div = $('<div id = "publishRules_button"/>');
        ipsRulesView.$el.append(div);
        div = $('<div id = "updatePublishedRules_button"/>');
        ipsRulesView.$el.append(div);


        domainPolicyStub = sinon.stub(ipsRulesView.ruleCollection, 'isSameDomainPolicy', function () {
          return true;
        });
      });

      it('get Context Menu', function () {
        var state;
        state = ipsRulesView.getContextMenu();
        assert(typeof state === "object");

      });

      it('Checks if the grid Table is configured properly', function () {

        var state;
        state = ipsRulesView.getGridTable();
        assert(typeof state === "object");
      });


      it('build Action Events', function () {

        stub1 = sinon.stub(BaseRulesView.prototype.buildActionEvents, "call");
        var state;
        state = ipsRulesView.buildActionEvents();
        assert(typeof state === "object");
        stub1.called.should.be.equal(true);
        stub1.restore();
      });

      it('Checks if the grid has save button', function () {

        var state;
        state = ipsRulesView.hasRuleGridSaveButton();
        assert(typeof state === "boolean");
      });

      it('Checks if the grid has discard button', function () {

        var state;
        state = ipsRulesView.hasRuleGridDiscardButton();
        assert(typeof state === "boolean");
      });

      it('Checks if the grid has publish button', function () {

        var state;
        state = ipsRulesView.hasRuleGridPublishUpdateButtons();
        assert(typeof state === "boolean");
      });

      it('Checks if the grid has publish button', function () {

        var state;
        state = ipsRulesView.hasRuleGridActionButtons();
        assert(typeof state === "boolean");
      });


      it('Get Custom Action Keys ', function () {

        var state;
        spy = sinon.spy(BaseRulesView.prototype.getCustomActionKeys, "apply");
        state = ipsRulesView.getCustomActionKeys();

        spy.called.should.be.equal(true);
        spy.restore();
        state["ADVANCE"].should.be.equal("advancePolicy");
        state["SAVE"].should.be.equal("saveRules");
        state["PUBLISH"].should.be.equal("publishRules");
        state["UPDATE"].should.be.equal("updatePublishedRules");
        state["DISCARD"].should.be.equal("discardRules");

      });

      it('Add Custom Buttons ', function () {
        var spy;
        spy = sinon.spy(BaseRulesView.prototype.addCustomButtons, "call");
        ipsRulesView.objectsViewData = [];
        ipsRulesView.addCustomButtons(customButtons);
        ipsRulesView.objectsViewData = undefined;
        customButtons[1].key.should.be.equal("publish");
        customButtons[2].key.should.be.equal("update");
        spy.called.should.be.equal(true);
        spy.restore();


      });

      it('Render ', function () {

        stub1 = sinon.stub(BaseRulesView.prototype.render, "apply");
        ipsRulesView.render();
        stub1.called.should.be.equal(true);
        stub1.restore();

      });

      it('showCodePointOverlays ', function () {
        var e={target : ''};
        ipsRulesView.showCodePointOverlay(e);
        ipsRulesView.Overlay.build.should.exist;

      });


      it('cellTooltip notification ', function () {

        var  renderTooltip = function(){
          return true
        };
        var cellData = {
          columnName :"notification",
          rowData :{
            "notification" : [""]
          },
          cellId :"cellid",
          rowId : null
        };
        var spy;
        spy = sinon.spy(ipsRulesView, "getTooltipForNotification");
        ipsRulesView.cellTooltip(cellData, renderTooltip);
        spy.called.should.be.equal(true);
        spy.restore();

      });

      it('cellTooltip ipaction ', function () {

        var  renderTooltip = function(){
          return true
        };
        var cellData = {
          columnName :"ipaction",
          rowData :{
            "ipaction" : [""]
          },
          cellId :"cellid",
          rowId : null
        };
        var spy;
        spy = sinon.spy(ipsRulesView, "getTooltipForIpAction");
        ipsRulesView.cellTooltip(cellData, renderTooltip);
        spy.called.should.be.equal(true);
        spy.restore();


      });

      it('cellTooltip additional ', function () {

        var  renderTooltip = function(){
          return true
        };
        var cellData = {
          columnName :"additional",
          rowData :{
            "additional" : [""]
          },
          cellId :"cellid",
          rowId : null
        };
        var spy;
        spy = sinon.spy(ipsRulesView, "getTooltipForAdditional");
        ipsRulesView.cellTooltip(cellData, renderTooltip);
        spy.called.should.be.equal(true);
        spy.restore();


      });

      it('cellTooltip source-zone ', function () {

        var  renderTooltip = function(){
          return true
        };
        var cellData = {
          columnName :"source-zone",
          rowData :{
            "source-zone" : ["source"]
          },
          cellId :"cellid",
          rowId : null
        };
        var state;
        state = ipsRulesView.cellTooltip(cellData, renderTooltip);


      });

      it('cellTooltip destination-zone ', function () {

        var  renderTooltip = function(){
          return true
        };
        var cellData = {
          columnName :"destination-zone",
          rowData :{
            "destination-zone" : ["destination"]
          },
          cellId :"cellid",
          rowId : null
        };
        var state;
        state = ipsRulesView.cellTooltip(cellData, renderTooltip);


      });

      it('cellTooltip others', function () {
        var  renderTooltip = function(){
          return true
        };
        var cellData = {
          columnName :"",
          rowData :{
            "destination-zone" : ["destination"]
          },
          cellId :"cellid",
          rowId : null
        };
        var stub;
        stub = sinon.stub(BaseRulesView.prototype.cellTooltip, "apply");
        ipsRulesView.cellTooltip(cellData, renderTooltip);
        stub.called.should.be.equal(true);
        stub.restore();
      });

      it('getTooltipRecord ', function () {
        var key ="",data="",value="";
        var state;
        state = ipsRulesView.getTooltipRecord(key, data, value);
        assert(typeof state === "string");

      });

      it('getTooltipForNotification logAttack', function () {
        var dataObj ={
          'logAttack' :[]
        };
        var state;
        state = ipsRulesView.getTooltipForNotification(dataObj);
        assert(typeof state === "string");
      });

      it('getTooltipForNotification packetLog', function () {
        var dataObj ={
          'packetLog' :[]
        };
        var state;
        state = ipsRulesView.getTooltipForNotification(dataObj);
        assert(typeof state === "string");
      });

      it('getTooltipForNotification pre-attack', function () {
        var dataObj ={
          'pre-attack' :[]
        };
        var state;
        state = ipsRulesView.getTooltipForNotification(dataObj);
        assert(typeof state === "string");
      });

      it('getTooltipForNotification post-attack', function () {
        var dataObj ={
          'post-attack' :[]
        };
        var state;
        state = ipsRulesView.getTooltipForNotification(dataObj);
        assert(typeof state === "string");
      });

      it('getTooltipForNotification post-attack-timeout', function () {
        var dataObj ={
          'post-attack-timeout' :[]
        };
        var state;
        state = ipsRulesView.getTooltipForNotification(dataObj);
        assert(typeof state === "string");
      });


      it('getTooltipForIpAction ', function () {
        var dataObj ={};
        var state;
        state = ipsRulesView.getTooltipForIpAction(dataObj);
        assert(typeof state === "string");
      });

      it('getTooltipForIpAction ip-action', function () {
        var dataObj ={
          'ip-action' :[]
        };
        var state;
        state = ipsRulesView.getTooltipForIpAction(dataObj);
        assert(typeof state === "string");

      });

      it('getTooltipForIpAction target ', function () {
        var dataObj ={
          'target' :[]
        };
        var state;
        state = ipsRulesView.getTooltipForIpAction(dataObj);
        assert(typeof state === "string");

      });
      it('getTooltipForIpAction refresh-timeout ', function () {
        var dataObj ={
          'refresh-timeout' :[]
        };
        var state;
        state = ipsRulesView.getTooltipForIpAction(dataObj);
        assert(typeof state === "string");

      });

      it('getTooltipForIpAction log', function () {
        var dataObj ={
          'log' :[]
        };
        var state;
        state = ipsRulesView.getTooltipForIpAction(dataObj);
        assert(typeof state === "string");

      });
      it('getTooltipForIpAction log-create ', function () {
        var dataObj ={
          'log-create' :[]
        };
        var state;
        state = ipsRulesView.getTooltipForIpAction(dataObj);
        assert(typeof state === "string");

      });

      it('getTooltipForAdditional ', function () {
        var dataObj ={};
        var state;
        state = ipsRulesView.getTooltipForAdditional(dataObj);
        assert(typeof state === "string");
      });

      it('getTooltipForAdditional severity', function () {
        var dataObj ={
          'severity' :[]
        };
        var state;
        state = ipsRulesView.getTooltipForAdditional(dataObj);
        assert(typeof state === "string");
      });

      it('getTooltipForAdditional terminal ', function () {
        var dataObj ={
          'terminal' :[]
        };

        var state;
        state = ipsRulesView.getTooltipForAdditional(dataObj);
        assert(typeof state === "string");
      });



    });


    describe('Basic Functionality Testing', function () {
      var stub1, stub2, stub3 ,policy = {};
      before(function () {

        stub1 = sinon.stub(View.prototype, 'buildActionEvents');
        stub2 = sinon.stub(View.prototype, 'subscribeNotifications');
        stub3 = sinon.stub(View.prototype, 'handleNavigateAway');
      });

      it('Creates the view object', function () {

        ipsRulesView = new View({
          context: context,
          actionEvents: {},
          ruleCollection: new Collection(CUID, policy, context),
          policyManagementConstants: Constants,
          cuid: CUID,
          extras: {filter: 'filter'}
        });

        ipsRulesView.should.exist;
        stub1.restore();
        stub2.restore();
        stub3.restore();

        ipsRulesView.customActionKeys = {
          SAVE: 'save',
          DISCARD: 'discard',
          PUBLISH: 'publish',
          UPDATE: 'update'
        }

        ipsRulesView.gridWidgetObject = {
          updateActionStatus: function () {

          }
        }

        var div = $('<div id = "saveRules_button"/>');
        ipsRulesView.$el.append(div);

        div = $('<div id = "discardRules_button"/>');
        ipsRulesView.$el.append(div);
        div = $('<div id = "publishRules_button"/>');
        ipsRulesView.$el.append(div);
        div = $('<div id = "updatePublishedRules_button"/>');
        ipsRulesView.$el.append(div);


        domainPolicyStub = sinon.stub(ipsRulesView.ruleCollection, 'isSameDomainPolicy', function () {
          return true;
        });
      });

      it('getTooltipForAdditional ', function () {
        var dataObj ={};
        var state;

        state = ipsRulesView.hasRuleGridAdvanceButton();


      });

      it('Checks if the grid is configured properly', function () {
        var state;
        state = ipsRulesView.getRuleGridConfiguration();
        assert(typeof state === "object");
        state.actionButtons.defaultButtons.create.key.should.be.equal("createEvent");
        state.actionButtons.defaultButtons.create.items[0].key.should.be.equal("ipsRule");
        state.actionButtons.defaultButtons.create.items[1].key.should.be.equal("exemptRule");

      });
      it('Checks if the grid has save button', function () {

        var state;
        state = ipsRulesView.hasRuleGridSaveButton();
        assert(typeof state === "boolean");
      });

      it('Checks if the grid has discard button', function () {

        var state;
        state = ipsRulesView.hasRuleGridDiscardButton();
        assert(typeof state === "boolean");
      });

      it('Checks if the grid has publish button', function () {

        var state;
        state = ipsRulesView.hasRuleGridPublishUpdateButtons();
        assert(typeof state === "boolean");
      });

      it('Checks if the grid has publish button', function () {

        var state;
        state = ipsRulesView.hasRuleGridActionButtons();
        assert(typeof state === "boolean");
      });


    });

  });
});