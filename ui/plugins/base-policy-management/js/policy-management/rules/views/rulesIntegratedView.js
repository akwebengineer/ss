/***
 * @author skesarwani
 * This is the container view for the rules objects grid like Address, Services etc
 */
define(['widgets/layout/layoutWidget',
  './ruleObjectsGridView.js'], function (LayoutWidget, RuleObjectsGridView) {
  var RulesIntegratedView = Backbone.View.extend({
    initialize: function (context, rulesView, objectsViewData) {
      var me = this;
      me.context = context;
      me.rulesView = rulesView;
      me.objectsViewData = objectsViewData;
    },
    callMethodForChildViews: function (methodName, args) {
      var me = this;
      $.each(me.childViews, function (i, view) {
        if(typeof view[methodName] === 'function') {
          view[methodName].apply(view, args);
        }
      });
    },
    close: function () {
      this.callMethodForChildViews('close', arguments);
    },

    afterRender: function () {
      this.callMethodForChildViews('afterRender', arguments);
    },
    onShow: function () {
      this.callMethodForChildViews('onShow', arguments);
    },
    beforeClose: function () {
      this.callMethodForChildViews('beforeClose', arguments);
    },
    afterClose: function () {
      this.callMethodForChildViews('afterClose', arguments);
    },
    render: function () {
      var me = this;
      return me.createLayout();
    },
     /*  bind the shared objects menu option values with the parent container  */
    bindSharedObjectsEvents: function(layoutWidget){
      var me = this;
        $.each(me.objectsViewData, function(index, item) {
          var id = item.id ;
          me.$el.bind(me.rulesView.actionEvents[id].name , function(){
            me.showObjectsGridPanel(layoutWidget, id);
        });
      }); 
      
    },
    showObjectsGridPanel : function (layoutWidget, objectId) {
      var me = this;
      me.addObjectsPanel(layoutWidget);
      //Save the User Prefs
      me.ruleObjectView.launchActivity(objectId);
      Slipstream.SDK.Preferences.save(me.rulesView.getObjectsPanelPreferenceKey(), [objectId]);
    },
    /* create objects panel using the updatePanel.
     this will be added at the end of the layout.  */
    addObjectsPanel: function (layoutWidget) {
      var me =this,ruleObjectView;

      if(me.ruleObjectView) {
         me.ruleObjectView.doClose();        
      }
      ruleObjectView = new RuleObjectsGridView(me.context, me.objectsViewData);
      ruleObjectView.setRuleGridId(me.rulesView.getGridTable().attr('id'));
        
      layoutWidget.updatePanel({
        id:"objectsPanel",
        content: ruleObjectView,
        isClosable: true,
        isExpandable: false,
        height: 40,
        width: 100
      }); 
      me.ruleObjectView =  ruleObjectView ;               
    },
    createLayout: function () {
      var me = this,
        pref,
        layoutWidget,
        contentArr = [
          {
            id: 'rulesPanel',
            content: me.rulesView,
            isClosable: false,
            isExpandable: false,
            height: 100,
            width: 100
          }
        ];
      me.childViews = [me.rulesView];
      layoutWidget= new LayoutWidget({
          container: me.el,
          panels: [
            {
              type: 'column',
              id: 'grids',
              content: contentArr
            }
          ]
        });

      //Call beforeRender
      me.callMethodForChildViews('beforeRender');
      //Now render
      layoutWidget.build();
      /* Load the shared objects grid - first option value as default option */
      me.bindSharedObjectsEvents(layoutWidget);

      //Based on User prefs check if the objects grid panel is to be shown
      if(!_.isEmpty(me.objectsViewData)) {
        pref = Slipstream.SDK.Preferences.fetch(me.rulesView.getObjectsPanelPreferenceKey());
        if(!_.isEmpty(pref)) {
          me.showObjectsGridPanel(layoutWidget, pref[0]);
        }
      }

      return me;
    }
  });
  return RulesIntegratedView;
});
