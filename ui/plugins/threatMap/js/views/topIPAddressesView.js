/**
 *  View to display top Inbound/Outbound IP addresses in the tooltip
 *
 *  @module ThreatMap
 *  @author Shini <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2016
 * */

define(['backbone',
		'../conf/topIpAddressesGridConfig.js',
		'../models/RequestData.js',
		'../models/RequestConfig.js',
		'widgets/grid/gridWidget',
        '../utils/threatMapConstants.js',
        'text!../templates/toolTipTemplate.html',
        'lib/template_renderer/template_renderer',

	], function(Backbone, GridConfig, RequestData, RequestConfig, GridWidget, ThreatMapConstants,
	            ToolTipTemplate, template_renderer){
	
	var TopIPAddressesView = Backbone.View.extend({
        events: {
            'click [class^="reload-grid-"]': 'reloadGrid'
        },

		// Initialize Backbone view
		initialize: function(options){
			console.log('initialised');

			var me = this;
			me.flag     = me.options.flag;
			me.title    = me.options.title;
			me.model     = me.options.model;
			me.context   = me.options.context;
			me.activity  = me.options.activity;
			me.tableId   = me.options.tableId;
			me.customButtonKey = me.options.customButtonKey
			me.countryCode = me.model.countryDetails.get("countryCode");
			me.isRightPanel = me.options.isRightPanel;
		},
		// render Top IP addresses view
		render:function(){
			console.log('rendered');
			var me = this, toolTipConf = {
			    'flag'                       : me.flag,
                'threatmap_tooltip_view_all' : me.context.getMessage("threatmap_tooltip_view_all")
            },
            toolTipHtml = template_renderer(ToolTipTemplate, toolTipConf);
            me.$el.append(toolTipHtml);
            me.buildIPAddressesGrid();
            return this;
		},

        // build GridWidget for top IP addresses
		buildIPAddressesGrid: function() {
            var me = this, request = "",
                filter = RequestConfig.FILTER_TEMPLATE(),
                andFilter = [];
                filter.value = me.countryCode;
            me.startTime   = me.model.countryDetails.get('startTime').toJSON(),
            me.endTime     = me.model.countryDetails.get('endTime').toJSON();
            me.timeRange   = me.startTime.slice(0, me.startTime.length - 5) + 'Z' + '/' + me.endTime.slice(0, me.endTime.length - 5) + 'Z';

            if(me.countryCode === ThreatMapConstants.Country.UNKNOWN) {
                if(me.flag === ThreatMapConstants.FlagTypes.INBOUND) {
                    filter = RequestConfig.getUnknownDestCountryFilters();
                    andFilter.push(filter);
                    request = me.getInboundRequest(andFilter);
                } else if(me.flag === ThreatMapConstants.FlagTypes.OUTBOUND) {
                    filter = RequestConfig.getUnknownSourceCountryFilters();
                    andFilter.push(filter);
                    request = me.getOutboundRequest(andFilter);
                } else {
                    filter = RequestConfig.FILTER_TEMPLATE_UNKNOWN();
                    request = me.getNoDataRequest(filter);
                }
            } else {

                if(me.flag === ThreatMapConstants.FlagTypes.INBOUND) {
                    filter.key = 'dst-country-code2';
                    andFilter.push({ 'filter': filter });
                    request = me.getInboundRequest(andFilter);
                } else if(me.flag === ThreatMapConstants.FlagTypes.OUTBOUND) {
                    filter.key = 'src-country-code2';
                    andFilter.push({ 'filter': filter });
                    request = me.getOutboundRequest(andFilter);
                } else {
                    filter.key = 'dst-country-name';
                    request = me.getNoDataRequest(filter);
                }
            }
            var gridConfig = new GridConfig(me.title, me.context, request, me.tableId, me.customButtonKey, me),
                gridElements = gridConfig.getValues(),
                gridContainer = me.$el.find('#grid-container').addClass("elementinput-long");

            me.gridWidget = new GridWidget({
                container: gridContainer,
                elements: gridElements,
                actionEvents: {
                    blockIPAddress:"blockIPAddress"
                }
            });

            me.gridWidget.build();
            me.bindGridEvents();
		},

        // bind blockIPAddress event to the grid
    	bindGridEvents: function () {
            this.$el.off("blockIPAddress").on("blockIPAddress", $.proxy(this.onBlockIPAddress, this));
        },

        // BlockIPAddress event handler
        onBlockIPAddress: function(e, selectedObj){

            var me = this, ipAddresses = [],blockHeader, sourceName,
                    blockMessage, input, intent;

            $(selectedObj.selectedRows).each(function (i) {
                ipAddresses.push(selectedObj.selectedRows[i]['key']);
            });

            if(me.flag === ThreatMapConstants.FlagTypes.OUTBOUND) {
                blockHeader = me.context.getMessage('threatmap_tooltip_block_source_action_button');
                sourceName = "source_ip";
                blockMessage = me.context.getMessage('threatmap_tooltip_block_ip_addresses_message', ["outbound", "from", ipAddresses.join()]);
            } else if(me.flag === ThreatMapConstants.FlagTypes.INBOUND) {
                blockHeader = me.context.getMessage('threatmap_tooltip_block_destination_action_button');
                sourceName = "destination_ip";
                blockMessage = me.context.getMessage('threatmap_tooltip_block_ip_addresses_message', ["inbound", "to", ipAddresses.join()]);
            }

            input = {
                "selectedApplications": [],
                "startTime": new Date(me.startTime).getTime(),
                "endTime": new Date(me.endTime).getTime(),
                "blockHeader": blockHeader,
                "sourceName": sourceName,
                "sourceValues": ipAddresses.join(),
                "blockMessage": blockMessage
            };

            onAnalysisComplete = function(resultCode, jobId) {
                console.log('-- Block Work Flow initialized from ThreatMap --');
                console.log(jobId);
            }

            intent = new Slipstream.SDK.Intent('slipstream.intent.action.ACTION_RULES_CHANGELIST', {
                mime_type: 'vnd.juniper.net.firewall.rules.changelist'
            });
            intent.putExtras(input);
            me.activity.context.startActivityForResult(intent, $.proxy(onAnalysisComplete, me));
        },
        reloadGrid: function(e) {
            var me = this,
                gridTitleContainer =  $('#grid-container .slipstream-content-title > span'),
                rightPanelOutboundContainer = $('#displayOutboundGrid > span'),
                rightPanelInboundContainer = $('#displayInboundGrid > span');
            me.noOfRecords = 1000000;

            if(me.flag === ThreatMapConstants.FlagTypes.INBOUND) {
                if(me.isRightPanel) {
                    rightPanelInboundContainer.text('');
                    rightPanelInboundContainer.text(me.context.getMessage('threatmap_tooltip_grid_title_all_inbound'));
                } else {
                    gridTitleContainer.text('');
                    gridTitleContainer.text(me.context.getMessage('threatmap_tooltip_grid_title_all_inbound'));
                }
            } else if(me.flag === ThreatMapConstants.FlagTypes.OUTBOUND) {
                if(me.isRightPanel) {
                    rightPanelOutboundContainer.text('');
                    rightPanelOutboundContainer.text(me.context.getMessage('threatmap_tooltip_grid_title_all_outbound'));
                } else {
                    gridTitleContainer.text('');
                    gridTitleContainer.text(me.context.getMessage('threatmap_tooltip_grid_title_all_outbound'));
                }
            }
            me.gridWidget.reloadGrid();
            var currentTarget = $(e.currentTarget).prop('class');
            me.$el.find('.'+currentTarget).css('visibility', 'hidden');
        },

        getInboundRequest: function(andFilter) {
            return RequestData.getTopInboundIpAddresses(this.timeRange, andFilter);
        },

        getOutboundRequest: function(andFilter) {
            return RequestData.getTopOutboundIpAddresses(this.timeRange, andFilter);
        },

        getNoDataRequest: function(filter) {
            var andFilter = [];
            andFilter.push({ 'filter': filter });
            this.$el.find('[class^="reload-grid-"]').hide();
            return RequestData.getNoDataRequestBody(this.timeRange, andFilter);
        }


	});

	return TopIPAddressesView;
});