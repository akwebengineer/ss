/**
 * A view to manage nat policy rules
 *
 * @module RulesView
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  '../../../../../base-policy-management/js/policy-management/rules/views/baseRulesView.js',
  '../conf/natRulesGridConfiguration.js',
  './ruleGridSourceAddressEditorView.js',
  './ruleGridDestinationAddressEditorView.js',
  './ruleGridSourcePortSetsEditorView.js',
  './ruleGridDestinationPortSetsEditorView.js',
  './ruleGridTranslatedDstnEditorView.js',
  './ruleGridServiceEditorView.js',
  './ruleGridProtocolEditorView.js',
  './ruleGridTranslatedSrcEditorView.js',
  './ruleGridPacketSourceIngressEditorView.js',
  './ruleGridPacketDestEgressEditorView.js',
  '../../../../../base-policy-management/js/policy-management/rules/views/ruleGridNameEditorView.js',
  '../../../../../base-policy-management/js/policy-management/rules/views/descriptionEditorView.js',
  '../conf/natRulesContextMenu.js',
  '../constants/natRuleGridConstants.js',
  '../../../../../event-viewer/js/eventviewer/policyjump/LogsToPoliciesSwitcher.js',
  './translatedPktTooltipView.js',
  './zoneSetTooltipView.js',
  './portSetTooltipView.js'
], function (BaseRulesView, RuleGrid, SourceAddressEditorView, DestinationAddressEditorView, 
  SourcePortSetsEditorView, DestinationPortSetsEditorView, TranslatedDstnEditorView,
  ServiceEditorView, ProtocolEditorView,TranlationSourceEditorView, PacketSrcIngressEditorView, PacketDestEgressEditorView,
  RuleNameEditorView, DescriptionEditorView, NatRulesContextMenu, PolicyManagementConstants, LogsToPoliciesSwitcher, 
  TranslatedToolTip, ZoneSetToolTip,PortSetToolTip) {

  var RulesView = BaseRulesView.extend({

    getRuleGridConfiguration: function() {
      var me = this,
      ruleGrid = new RuleGrid(me.context, me.ruleCollection, me.policyManagementConstants, me.policyObj),
        ruleGridConfiguration = ruleGrid.getConfiguration();
      var defaultButtons = {
        "create":{
            "label": me.context.getMessage('create'),
            "key":"createEvent",
            "items": [{
              "label":me.context.getMessage('addNatSourceRule'),
              "key":"sourceRule",
              "capabilities": [this.policyManagementConstants.CAPABILITY_MODIFY]
            },{
              "label":me.context.getMessage('addNatStaticRule'),
              "key":"staticRule",
              "capabilities": [this.policyManagementConstants.CAPABILITY_MODIFY]
            },{
              "label":me.context.getMessage('addNatDestinationRule'),
              "key":"destinationRule",
              "capabilities": [this.policyManagementConstants.CAPABILITY_MODIFY]
            }]
        }
      };
      ruleGridConfiguration.actionButtons.defaultButtons = defaultButtons;
      return ruleGridConfiguration;
    },
    /**
     * Provide rule grid level drag n drop configddd
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
    afterRender: function() {
      var policyVersionDetails = this.context.module.getExtras()['policy-version-details'];
      if(policyVersionDetails) {
        policyVersionDetails = JSON.parse(policyVersionDetails);
        new LogsToPoliciesSwitcher(this.options).processEventLog(policyVersionDetails, this);
      }
    },
    getContextMenu: function() {
      var me = this,
          contextMenu = new NatRulesContextMenu(me.context, me.ruleCollection, PolicyManagementConstants);
      return contextMenu;
    },

    /**
     * returns the gridTable object
     *
     * @returns {*}
     */
    getGridTable: function() {
      return this.$el.find("#natRuleGrid");
    },

    buildActionEvents: function(){
        this.actionEvents = $.extend(BaseRulesView.prototype.buildActionEvents.call(this),{
            sourceRule: {
                name: "sourceRule",
                capabilities: [this.policyManagementConstants.CAPABILITY_MODIFY]
            },
            staticRule: {
                name: "staticRule",
                capabilities: [this.policyManagementConstants.CAPABILITY_MODIFY]
            },
            destinationRule: {
              name: "destinationRule",
              capabilities: [this.policyManagementConstants.CAPABILITY_MODIFY]
            }
        });

      return this.actionEvents;
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
              'pattern':/^[a-zA-Z0-9][a-zA-Z0-9-_]{0,30}$/,
              'error':'nat_name_error',
              'ruleCollection': me.ruleCollection
            }),

            sourceAddressEditorView = new SourceAddressEditorView({
                'policyObj': me.policyObj,
                'close': _.bind(me.closeEditorOverlay, this),
                'context': me.context,
                'columnName': 'source-addresses.source-address',
                'ruleCollection': me.ruleCollection
            }),
            destinationAddressEditorView = new DestinationAddressEditorView({
                'policyObj': me.policyObj,
                'close': _.bind(me.closeEditorOverlay, this),
                'context': me.context,
                'columnName': 'destination-addresses.destination-address',
                'ruleCollection': me.ruleCollection
            }),
            sourcePortSetsEditorView = new SourcePortSetsEditorView({
                'policyObj': me.policyObj,
                'close': _.bind(me.closeEditorOverlay, this),
                'context': me.context,
                'columnName': 'source-ports.source-port',
                'ruleCollection': me.ruleCollection
            }),
            destinationPortSetsEditorView = new DestinationPortSetsEditorView({
                'policyObj': me.policyObj,
                'close': _.bind(me.closeEditorOverlay, this),
                'context': me.context,
                'columnName': 'destination-ports.destination-port',
                'ruleCollection': me.ruleCollection
            }),
            serviceEditorView = new ServiceEditorView({
                'close': _.bind(me.closeEditorOverlay, this),
                'context': me.context,
                'columnName': 'services.service',
                'ruleCollection': me.ruleCollection,
                'policyObj': me.policyObj
            }),
            protocolEditorView = new ProtocolEditorView({
                'close': _.bind(me.closeEditorOverlay, this),
                'context': me.context,
                'columnName': 'protocols.protocol',
                'ruleCollection': me.ruleCollection,
                'policyObj': me.policyObj
            }),
            packetIngressEditorView = new PacketSrcIngressEditorView({
                'close': _.bind(me.closeEditorOverlay, this),
                'context': me.context,
                'columnName': 'original-packet.src-traffic-match-type',
                'ruleCollection': me.ruleCollection,
                'policyObj': me.policyObj
            }),
            packetEgressEditorView = new PacketDestEgressEditorView({
                'close': _.bind(me.closeEditorOverlay, this),
                'context': me.context,
                'columnName': 'original-packet.dst-traffic-match-type',
                'ruleCollection': me.ruleCollection,
                'policyObj': me.policyObj
            }),
            translationSourceEditorView = new TranlationSourceEditorView({
                'policyObj': me.policyObj,
                'close': _.bind(me.closeEditorOverlay, this),
                'columnName': 'translated-packet.translated-address',
                'context': me.context,
                'ruleCollection': me.ruleCollection
            }),
            translatedDstnEditorView = new TranslatedDstnEditorView({
                'policyObj': me.policyObj,
                'close': _.bind(me.closeEditorOverlay, this),
                'context': me.context,
                'columnName': 'translated-packet.pool-addresses',
                'ruleCollection': me.ruleCollection
            }),
            descriptionEditorView = new DescriptionEditorView({
                'policyObj': me.policyObj,
                'close': _.bind(me.closeEditorOverlay, this),
                'context': me.context,
                'columnName': 'description',
                'ruleCollection': me.ruleCollection
            });

        var cellViews = {
            'name':ruleNameEditorView,
            'original-packet.src-address.address-reference': sourceAddressEditorView,
            'original-packet.dst-address.address-reference': destinationAddressEditorView,
            'original-packet.src-ports': sourcePortSetsEditorView,
            'original-packet.dst-ports': destinationPortSetsEditorView,
            'services.service-reference': serviceEditorView,
            'original-packet.protocol.protocol-data': protocolEditorView,
            'original-packet.src-traffic-match-value.src-traffic-match-value': packetIngressEditorView,
            'original-packet.dst-traffic-match-value.dst-traffic-match-value': packetEgressEditorView,
            'translated-packet.translated-address': translationSourceEditorView,
            'translated-packet.pool-addresses': translatedDstnEditorView,
            'description': descriptionEditorView
        };

        return cellViews;
    },
    /**
     * Tooltip for Translated Packet
     */
    cellTooltip: function(cellData, renderTooltip){
    var me  = this;
        if (cellData.columnName === "translated-packet.translated-address" || cellData.columnName === "translated-packet.pool-addresses") {
          var transCellData = cellData.rowData[cellData.columnName];
          if (transCellData) {
            var ruleModel = me.ruleCollection.get(cellData.rowId);
            var translatedTooltip = new TranslatedToolTip({ruleModel:ruleModel,  callback:renderTooltip, transCellData : transCellData});
            translatedTooltip.render();
          }
        } else if (cellData.columnName === "original-packet.src-traffic-match-value.src-traffic-match-value" || 
                   cellData.columnName === "original-packet.dst-traffic-match-value.dst-traffic-match-value") {
            console.log("ingress/egress column tooltip");
            if(_.isString(cellData.cellId) && !_.isEmpty(cellData.cellId)) {
                var formattedValue = "<span>" + cellData.cellId + "</span>";
                renderTooltip(formattedValue);
            }
            else {
              //Tooltip for zoneset showing zones
              var zonesetTooltip = new ZoneSetToolTip({ObjId:cellData.cellId, callback:renderTooltip});
              zonesetTooltip.render();
            }  
        } else if (cellData.columnName === "original-packet.src-ports" || 
                   cellData.columnName === "original-packet.dst-ports" ) {
          //Tooltip for Portset showing ports
          if(cellData.cellId) {
            var portsetTooltip = new PortSetToolTip({ObjId:cellData.cellId, callback:renderTooltip});
            portsetTooltip.render();
          }
        } else {
            BaseRulesView.prototype.cellTooltip.apply(this,[cellData, renderTooltip]);
        }
    },

      /**
       * Returns the SID for the policy
       * @returns {string} sid
       */
      getSID: function() {
          return 'juniper.net:nat-policy-management:nat-rules-grid';
      }


  });

  return RulesView;
});
