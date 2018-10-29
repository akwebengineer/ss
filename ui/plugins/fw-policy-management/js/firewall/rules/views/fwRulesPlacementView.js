/**
 * Firewall rules placement view based on the rule wizard analysis result
 *
 * @module RulesPlacementView
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  'widgets/overlay/overlayWidget',
  'widgets/grid/gridWidget',
  '../conf/fwRulesGridConfiguration.js',
  '../models/fwRuleCollection.js',
  './fwRulesView.js'
], function (OverlayWidget, GridWidget, FirewallRuleGridConf, FWRuleCollection, FirewallRulesView) {

    var RulesPlacementView = FirewallRulesView.extend({

    initialize: function(options) {
        
        this.ruleCollection = new FWRuleCollection(options.placementRules,options.policyObj);
        this.context = options.context;
        this.policyObj = options.policyObj;
        
        this.policyManagementConstants = options.policyManagementConstants;
    },

    render: function () {
        var me = this,
            ruleGridConfiguration = me.getRuleGridConfiguration(),
            gridWidget;
          
        gridWidget = new GridWidget({
            container: me.el,
            elements: ruleGridConfiguration
        });

        $.when(gridWidget.build()).done(function(response) {
            me.gridWidgetObject = response;
        });
        
        var newRuleId = "";
        for (var i = me.options.placementRules.length-1; i >=0; i--) {
            if (me.options.placementRules[i].id < 0) {
                newRuleId = me.options.placementRules[i].id;
            }
            me.gridWidgetObject.addRow(me.options.placementRules[i]);
        }

        me.$el.find("#firewallRuleGrid").attr('id', 'firewallRulePlacementGrid');
        me.$el.find("#firewallRulePlacementGrid #"+newRuleId).addClass("selectedRow");

        me.$el.addClass("security-management");
        me.addTreeViewRendering();
        me.formatRulesGrid();

      return this;
    },

    getRuleGridConfiguration: function() {
        var me = this, conf;
      
        me.fwRuleGridConf = new FirewallRuleGridConf(me.context, me.ruleCollection, me.policyManagementConstants);
        conf = me.fwRuleGridConf.getConfiguration();
        delete conf["multiselect"];
        delete conf["editRow"];
        delete conf["singleselect"];

        return conf;
    },

    getGridTable: function() {
        return this.$el.find("#firewallRulePlacementGrid");
    },

    appendRulesGridTopSection: function () {
    }

  });

  return RulesPlacementView;
});
