/**
 * A view to manage firewall policy rules
 *
 * @module RulesView
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  'widgets/overlay/overlayWidget',
  '../../../../../base-policy-management/js/policy-management/rules/views/baseRulesView.js',
  '../conf/fwRulesGridConfiguration.js',
  './fwRuleGridSourceZoneEditorView.js',
  '../../../../../base-policy-management/js/policy-management/rules/views/ruleGridNameEditorView.js',
  '../../../../../base-policy-management/js/policy-management/rules/views/ruleGridSourceAddressEditorView.js',
  './fwRuleGridDestinationZoneEditorView.js',
  '../../../../../base-policy-management/js/policy-management/rules/views/ruleGridDestinationAddressEditorView.js',
  '../../../../../base-policy-management/js/policy-management/rules/views/ruleGridServiceEditorView.js',
  './fwRuleSourceIdentityEditorView.js',
  './fwRuleGridAdvSecurityEditorView.js',
  './fwRuleGridHitCountView.js',
  './fwRuleOptionsEditorView.js',
  '../conf/fwRulesContextMenu.js',
  '../views/fwRuleGridVPNTunnelsView.js',
  '../../../../../base-policy-management/js/policy-management/rules/views/descriptionEditorView.js',
  '../../../../../event-viewer/js/eventviewer/policyjump/LogsToPoliciesSwitcher.js'
  // '../../../../../sd-common/js/common/policy-management/rules/views/addressObjectToolTipView.js',
  // '../../../../../sd-common/js/common/policy-management/rules/views/serviceObjectToolTipView.js'
], function (OverlayWidget, BaseRulesView, FirewallRuleGridConf, SourceZoneEditorView, RuleNameEditorView, SourceAddressEditorView, DestinationZoneEditorView, DestinationAddressEditorView, ServiceEditorView,
             SourceIdentityListBuilder, AdvancedSecurityView, HitCountView, RuleOptionsView,
             FirewallRulesContextMenu,RuleGridVPNTunnelView,DescriptionEditorView,LogsToPoliciesSwitcher) {  // AddressToolTip, ServiceToolTip) {

  var RulesView = BaseRulesView.extend({

    events : $.extend(BaseRulesView.prototype.events, {
        "click #hitCountCell": "showHitCountOverlay",
        "click #hitCountDetailsOuter": "showHitCountOverlay",
        "click #hitCountDetailsInner": "showHitCountOverlay",
        "click #vpnActionCell": "showVpnTunnelOverlay"
    }),
    afterRender: function() {
      var policyVersionDetails = this.context.module.getExtras()['policy-version-details'];
      if(policyVersionDetails) {
        policyVersionDetails = JSON.parse(policyVersionDetails);
        new LogsToPoliciesSwitcher(this.options).processEventLog(policyVersionDetails, this);
      }
    },
    /**
     * This method tells if predefined rules like Global/Zone are present in the rule grid or not
     * For FW rules grid this will return true; Else false; Need to be overriden in Fw rule grid
     * @returns {boolean}
     */
    isPredefinedRulesPresent : function () {
      return true;
    },
    /**
     * Provide rule grid level drag n drop config
     * @returns {{moveCell: {beforeDrag: *}}}
     */
    getDragNDropConfig : function () {
      var me = this;
      return {
        'moveRow' : {
          'beforeDrag' : _.bind(me.cellBeforeDrag, me),
          'hoverDrop' : _.bind(me.ruleHoverDrop, me),
          'afterDrop' : _.bind(me.ruleAfterDrop, me)
        },
        'moveCell' : {
          'beforeDrag' : _.bind(me.cellBeforeDrag, me)
        }
      };
    },

    getRuleGridConfiguration: function() {
      var me = this;
      me.fwRuleGridConf = new FirewallRuleGridConf(me.context, me.ruleCollection, me.policyManagementConstants, me.policyObj);
      return me.fwRuleGridConf.getConfiguration();
    },

    getContextMenu: function() {
      var me = this,
          contextMenu = new FirewallRulesContextMenu(me.context, me.ruleCollection);
      return contextMenu;
    },

    /*
      returns the parameters for the search filter
    */
    getSearchFilter : function(tokens){
        console.log("************tokens***********");
        console.log(tokens);
        var me = this,searchFilter = {"FilterParam":{}}, filter = [];
        if(!$.isEmptyObject(tokens)){
            for(var i = 0; i<tokens.length; i++){
                var token = tokens[i];
                if($.isArray(token)){
                    var column = token[0].column;
                    if(column === "quickFilter"){
                        if(token[0].value === "showScheduledRules"){
                            filter.push("Scheduler :  ( * )");
                        }else{
                            searchFilter.FilterParam[token[0].value] = true;
                        }
                    }
                    //handled as special case for hits because it is different from column filters
                    //it has to be directly added to filterParam instead of to filters
                    else if(column === "hitCountLevel"){
                        searchFilter.FilterParam[column] = me.formatHitCountFilter(token);
                    }
                    else{
                        filter.push(me.formatSearchString(token));
                    }
                }else{
                    if(!me.isOperator(token)){
                        filter.push(token);
                    }
                }
            }
        }
        searchFilter.FilterParam["filters"] = filter;
//        console.log("filter is " + searchFilter);
        return searchFilter;
    },

    formatSearchString: function(token){
        var me=this, column= token[0].column,filterVal = "";
        for(var i = 0; i<token.length;i++){
            var searchToken = token[i];
            if (!me.isOperator(searchToken)) {
              filterVal = !_.isEmpty(filterVal) ? filterVal + ", " + searchToken.value : searchToken.value;
            }
        }
        if(column === "AdvSecurity"){
            return "( UTM : " + filterVal + " or SSLForwardProxy : " + filterVal + " or AppFirewall : " + filterVal + " or SecIntel : " + filterVal + " or IPS : " + filterVal + " )";
        }else if(column === "RuleOptions"){
            return "( Profile : " + filterVal + " or Scheduler : " + filterVal + " )";
        }else{
            return column +  ": ( " + filterVal + " )";
        }
    },

    formatHitCountFilter :function(token){
        var me = this, filterValue =[];
        for(var i = 0; i<token.length;i++){
            var searchToken = token[i];
            if(!me.isOperator(searchToken)){
                filterValue.push(searchToken.value.toUpperCase());
            }
        }
        return filterValue;
    },

    getQuickFilters : function(){
      return $.merge(BaseRulesView.prototype.getQuickFilters.apply(this),
        [{
            "label":this.context.getMessage("show_scheduled_rules"),
            "key":"showScheduledRules"
        }]
      );
    },

    /**
     * returns the gridTable object
     *
     * @returns {*}
     */
    getGridTable: function() {
      return this.$el.find("#firewallRuleGrid");
    },

    /**
    * overriding base class function
    * @returns {boolean}
    */
    hasRuleGridSaveButton: function(){
        return true;
    },

    /**
    * overriding base class function
    * @returns {boolean}
    */
    hasRuleGridDiscardButton: function(){
        return true;
    },

    /**
    * overriding base class function
    * @returns {boolean}
    */
    hasRuleGridPublishUpdateButtons: function(){
        return true;
    },

    createViews: function () {

      var me = this,

      ruleNameEditorView = new RuleNameEditorView({
        'policyObj': me.policyObj,
        'close': _.bind(me.closeEditorOverlay, this),
        'context': me.context,
        'columnName': 'name',
        'pattern':/^[a-zA-Z0-9][a-zA-Z0-9-_]{0,62}$/,
        'error':'name_error',
        'ruleCollection': me.ruleCollection
      }),

      sourceAddressEditorView = new SourceAddressEditorView({
        'policyObj': me.policyObj,
        'close': _.bind(me.closeEditorOverlay, this),
        'context': me.context,
        'ruleCollection': me.ruleCollection
      }),

      destinationAddressEditorView = new DestinationAddressEditorView({
        'policyObj': me.policyObj,
        'close': _.bind(me.closeEditorOverlay, this),
        'context': me.context,
        'ruleCollection': me.ruleCollection
      }),

      sourceZoneEditorView = new SourceZoneEditorView({
        'policyObj': me.policyObj,
        'close': _.bind(me.closeEditorOverlay, this),
        'context': me.context,
        'ruleCollection': me.ruleCollection
      }),

      destinationZoneEditorView = new DestinationZoneEditorView({
        'policyObj': me.policyObj,
        'close': _.bind(me.closeEditorOverlay, this),
        'context': me.context,
        'ruleCollection': me.ruleCollection
      }),

      serviceEditorView = new ServiceEditorView({
        'close': _.bind(me.closeEditorOverlay, this),
        'context': me.context,
        'columnName': 'services.service-reference',
        'ruleCollection': me.ruleCollection
      }),

      sourceIdentityEditorView = new SourceIdentityListBuilder({
        'policyObj': me.policyObj,
        'close': _.bind(me.closeEditorOverlay, this),
        'context': me.context,
        'columnName': 'sourceidentities.sourceidentity',
        'ruleCollection': me.ruleCollection
      }),

      advSecurityView = new AdvancedSecurityView({
        'policyObj': me.policyObj,
        'close': _.bind(me.closeEditorOverlay, this),
        'columnName': 'ips-enabled',
        'context': me.context,
        'ruleCollection': me.ruleCollection
      }),

      ruleOptionsView = new RuleOptionsView({
        'policyObj': me.policyObj,
        'close': _.bind(me.closeEditorOverlay, this),
        'columnName': 'scheduler',
        'context': me.context,
        'ruleCollection': me.ruleCollection
      }),

      descriptionEditorView = new DescriptionEditorView({
        'policyObj': me.policyObj,
        'close': _.bind(me.closeEditorOverlay, this),
        'context': me.context,
        'columnName': 'description',
        'ruleCollection': me.ruleCollection
      }),

      cellViews = {
        'name':ruleNameEditorView,
        'source-zone.zone': sourceZoneEditorView,
        'source-address.addresses.address-reference': sourceAddressEditorView,
        'destination-zone.zone': destinationZoneEditorView,
        'destination-address.addresses.address-reference': destinationAddressEditorView,
        'sourceidentities.sourceidentity': sourceIdentityEditorView,
        'services.service-reference': serviceEditorView,
        'ips-enabled': advSecurityView,
        'scheduler': ruleOptionsView,
        'description':descriptionEditorView
      };

      return cellViews;
    },

    /**
     * Tooltip for advanced security and rule options
     */
    cellTooltip: function(cellData, renderTooltip){
    var me  = this, formattedValue, nameArr;
      // console.log("ColumnName : " + cellData.columnName);
        // console.log("RowId : " + cellData.rowId);
        // console.log("CellId : " + cellData.cellId);
        // console.log("row data : " + cellData.rowData);
        if (cellData.columnName === "ips-enabled") {
          console.log("advanced security tooltip");
          var advSec = cellData.rowData["ips-enabled"];
          if (advSec) {
            formattedValue = "<span>";
            if (cellData.cellId == "collapsed") {
              if (advSec["ips"])
                formattedValue += "<b>IPS</b>:  " + advSec["ips"] + "</br>";
              if (advSec["utm"])
                formattedValue += "<b>UTM</b>:  " + advSec["utm"] + "</br>";
              if (advSec["ssl-proxy"])
                formattedValue += "<b>SSL PROXY</b>:  " + advSec["ssl-proxy"] + "</br>";
              if (advSec["app-firewall"])
                formattedValue += "<b>APP FIREWALL</b>:  " + advSec["app-firewall"] + "</br>";
              if (advSec["threat-policy"])
                    formattedValue += "<b>THREAT POLICY</b>:  " + advSec["threat-policy"] + "</br>";
            } else {
              if (cellData.cellId == "IPS")
                formattedValue += "<b>IPS</b>:  " + advSec["ips"] + "</br>";
              if (cellData.cellId == "UTM")
                formattedValue += "<b>UTM</b>:  " + advSec["utm"] + "</br>";
              if (cellData.cellId == "SSL PROXY")
                formattedValue += "<b>SSL PROXY</b>:  " + advSec["ssl-proxy"] + "</br>";
              if (cellData.cellId == "APP FIREWALL")
                formattedValue += "<b>APP FIREWALL</b>:  " + advSec["app-firewall"] + "</br>";
              if (cellData.cellId == "THREAT POLICY")
                    formattedValue += "<b>THREAT POLICY</b>:  " + advSec["threat-policy"] + "</br>";
            }
            formattedValue += "</span>";
            renderTooltip(formattedValue);
          }
        } else if (cellData.columnName === "scheduler") {
          console.log("rule options tooltip");
          var profileOptions = cellData.rowData["scheduler"];
          if (profileOptions) {
            formattedValue = "<span>";
            if (cellData.cellId == "collapsed") {
              if (profileOptions["profile"])
                formattedValue += "<b>Profle</b>:  " + profileOptions["profile"] + "</br>";
              if (profileOptions["scheduler"])
                formattedValue += "<b>Schedule</b>:  " + profileOptions["scheduler"] + "</br>";
            } else {
              if (cellData.cellId == "Profile")
                formattedValue += "<b>Profile</b>:  " + profileOptions["profile"] + "</br>";
              if (cellData.cellId == "Schedule")
                formattedValue += "<b>Schedule</b>:  " + profileOptions["scheduler"] + "</br>";
            }
            formattedValue += "</span>";
            renderTooltip(formattedValue);
          }
        } else if (cellData.columnName === "source-zone.zone") {
            console.log("src zone column tooltip");
            nameArr = cellData.rowData["source-zone.zone"];
            if (nameArr && nameArr.length > 0 && nameArr[0].length > 0 && nameArr[0] != "-") {
              formattedValue = "<span>" + nameArr[0] + "</span>";
              renderTooltip(formattedValue);
            }
        } else if (cellData.columnName === "destination-zone.zone") {
            console.log("dst zone column tooltip");
            nameArr = cellData.rowData["destination-zone.zone"];
            if (nameArr && nameArr.length > 0 && nameArr[0].length > 0 && nameArr[0] != "-") {
              formattedValue = "<span>" + nameArr[0] + "</span>";
              renderTooltip(formattedValue);
            }
        } else if (cellData.columnName === "sourceidentities.sourceidentity") {
            console.log("source identity column tooltip");
            nameArr = cellData.rowData["sourceidentities.sourceidentity"];
            if (nameArr && nameArr.length > 0 && nameArr[0].length > 0 && nameArr[0] != "-") {
              formattedValue = "<span>" + nameArr[0] + "</span>";
              renderTooltip(formattedValue);
            }
        } else {
            BaseRulesView.prototype.cellTooltip.apply(this,[cellData, renderTooltip]);
        }
    },

    showHitCountOverlay: function(e) {
        // A cross browser compatible way to stop propagation of the event:
        if (!e) { e = window.event; }
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();

        var me = this;

        var ruleObject = JSON.parse($(e.target).attr('data-rule-obj'));

        var hitCountView = new HitCountView({
                'policyObj': me.policyObj,
                'close': function (e) {
                    hitCountOverlay.destroy();
                    if (e) { e.preventDefault(); }
                },
                'context': me.context,
                'ruleCollection': me.ruleCollection,
                'ruleObject': ruleObject,
                'cuid': me.cuid
            }),

            hitCountOverlay = new OverlayWidget({
                view: hitCountView,
                type: 'large',
                showScrollbar: true
            });

        hitCountOverlay.build();
    },

    showVpnTunnelOverlay: function(e) {
      var me = this;

      var ruleId = $(e.target).attr('data-rule-obj');

      var vpnTunnelView = new RuleGridVPNTunnelView({
        'close': function (e) {
          vpnTunnelOverlay.destroy();
          if (e) { e.preventDefault();}
        },
        'policyId': me.policyObj.id,
        'context': me.context,
        'ruleCollection': me.ruleCollection,
        "model": me.ruleCollection.get(ruleId) 
      }),

      vpnTunnelOverlay = new OverlayWidget({
        view: vpnTunnelView,
        type: 'medium',
        showScrollbar: true
      });
      vpnTunnelOverlay.build();
    },

      /**
       * Returns the SID for the policy
       * @returns {string} sid
       */
      getSID: function() {
        return 'juniper.net:fw-policy-management:firewall-rule-grid';
    }
  });

  return RulesView;
});
