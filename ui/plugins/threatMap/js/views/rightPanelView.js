/**
 *  The view to display Right Panel details window in Threatmap
 *
 *  @module ThreatMap
 *  @author Shini <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2016
 * */

define(['lib/template_renderer/template_renderer',
        'text!../templates/rightPanelTemplate.html',
        './topIPAddressesView.js',
        '../utils/threatMapConstants.js',
        '../models/RightPanelModel.js',
        '../models/UnknownCountryDetailsModel.js',
        '../utils/threatMapUtil.js'
],function (
    TemplateRenderer, RightPanelTemplate, TopIPAddressesView, ThreatMapConstants,
    RightPanelModel, UnknownCountryDetailsModel, ThreatMapUtil) {

    var RightPanelView = Backbone.View.extend({

        pollInterval: 30 * 1000,    // every 30 seconds
        events: {
            'click .close-button': 'closeRightPanel',
            'click #displayInboundGrid': 'showHideInboundGrid',
            'click #displayOutboundGrid': 'showHideOutboundGrid'
        },

         // The constructor for the right panel view.
        initialize: function(options) {
            var me = this;
            me.el       = options.el;
            me.context  = options.context;
            me.activity = options.activity;
            me.model    = options.model;

            if(me.model.countryDetails.get('countryCode') === ThreatMapConstants.Country.UNKNOWN) {
                me.model.rightPanel = new UnknownCountryDetailsModel();
            } else {
                me.model.rightPanel = new RightPanelModel();
            }
            me.model.rightPanel.on('sync', $.proxy(me.onRightPanelModelSync, me));

            // Text messages for the template
            me.rightPanelConf = {
               'threatmap_right_panel_outbound'            : me.context.getMessage("threatmap_right_panel_outbound"),
               'threatmap_right_panel_inbound'             : me.context.getMessage("threatmap_right_panel_inbound"),
               'threatmap_right_panel_total_count'         : me.context.getMessage("threatmap_right_panel_total_count"),
               'threatmap_right_panel_view_all'            : me.context.getMessage("threatmap_right_panel_view_all"),
               'threatmap_tooltip_grid_title_inbound'      : me.context.getMessage('threatmap_tooltip_grid_title_inbound'),
               'threatmap_tooltip_grid_title_outbound'     : me.context.getMessage('threatmap_tooltip_grid_title_outbound'),
               'threatmap_tooltip_grid_no_events_label'    : me.context.getMessage('threatmap_tooltip_grid_no_events_label'),
               'threatmap_tooltip_button_block_inbound'    : me.context.getMessage("threatmap_tooltip_button_block_inbound"),
               'threatmap_tooltip_button_block_outbound'   : me.context.getMessage("threatmap_tooltip_button_block_outbound"),
               'threatmap_tooltip_threat_events'           : me.context.getMessage("threatmap_tooltip_threat_events"),
               'threatmap_right_panel_events'              : me.context.getMessage("threatmap_right_panel_events"),
               'threatmap_tooltip_threat_since_time'       : me.context.getMessage("threatmap_tooltip_threat_since_time"),

               'countryCode'                               : me.model.countryDetails.get('countryCode'),
               'countryName'                               : me.model.countryDetails.get('countryName'),
               'dstTotalCount'                             : me.model.countryDetails.get('dstTotalCount').toLocaleString(),
               'flagCode'                                  : me.model.countryDetails.get('flagCode'),
               'srcTotalCount'                             : me.model.countryDetails.get('srcTotalCount').toLocaleString(),
               'totalCount'                                : me.model.countryDetails.get('totalCount').toLocaleString(),

               'threatmap_insight_bar_ips'                 : me.context.getMessage("threatmap_insight_bar_ips"),
               'threatmap_insight_bar_antivirus'           : me.context.getMessage("threatmap_insight_bar_antivirus"),
               'threatmap_insight_bar_spam'                : me.context.getMessage("threatmap_insight_bar_spam"),
               'threatmap_insight_bar_auth'                : me.context.getMessage("threatmap_insight_bar_auth")
            };
            _.extend(this, ThreatMapUtil);
        },

        render: function() {
            var me = this,
                html =  TemplateRenderer(RightPanelTemplate, me.rightPanelConf);

            me.model.rightPanel.fetch({
               pollInterval: me.pollInterval,
               countryName: me.model.countryDetails.get('countryName'),
               countryCode: me.model.countryDetails.get('countryCode')
            });
            me.el.append(html);

            me.$totalThreatCount    = me.$el.find('#total-threats');
            me.$dstTotalCount       = me.$el.find('#dstTotalCount');
            me.$srcTotalCount       = me.$el.find('#srcTotalCount');

            me.$ipsThreatCountDst   = me.$el.find('#dst-ips-threats');
            me.$avThreatCountDst    = me.$el.find('#dst-antivirus-threats');
            me.$asThreatCountDst    = me.$el.find('#dst-antispam-threats');
            me.$daThreatCountDst    = me.$el.find('#dst-device-authentication-threats');

            me.$ipsThreatCountSrc   = me.$el.find('#src-ips-threats');
            me.$avThreatCountSrc    = me.$el.find('#src-antivirus-threats');
            me.$asThreatCountSrc    = me.$el.find('#src-antispam-threats');
            me.$daThreatCountSrc    = me.$el.find('#src-device-authentication-threats');
            me.addGridView();       // Add Inbound/Outbound grid
            me.$el.find('.reload-grid-link').text(me.context.getMessage('threatmap_right_panel_view_all'));

            return this;
        },

        // Append Inbound/Outbound Grid View to the panel
        addGridView: function(){
            var me = this,
                inboundContainer    = me.$el.find('#inbound-grid-container'),
                outboundContainer   = me.$el.find('#outbound-grid-container'),
                dstCount = me.model.countryDetails.get("dstTotalCount"),
                srcCount = me.model.countryDetails.get("srcTotalCount"),
                outboundFlag = (srcCount) ? ThreatMapConstants.FlagTypes.OUTBOUND : "",
                inboundFlag  = (dstCount) ? ThreatMapConstants.FlagTypes.INBOUND : "";

            // Outbound Grid
            var outBoundGridView = me.getTopIPAddressView(outboundFlag,"rightPanel_outbound_grid_conf" );
            outBoundGridView.render();
            outboundContainer.append(outBoundGridView.el);
            me.setLayout();

            // Inbound Grid
            var inBoundGridView = me.getTopIPAddressView(inboundFlag,"rightPanel_inbound_grid_conf" );
            inBoundGridView.render();
            inboundContainer.append(inBoundGridView.el);
            me.setLayout();
        },

        getTopIPAddressView: function(flag, tableId){
            var me = this;
            return new TopIPAddressesView ({
               "flag": flag,
               "title": "",
               "model": me.model,
               "context": me.context,
               "activity": me.activity,
               "tableId": tableId,
               "customButtonKey": me.context.getMessage('threatmap_tooltip_custom_button_block'),
               "isRightPanel": true
           });
        },

        // Right Panel Callback
        onRightPanelModelSync: function() {
            console.log('insightbar-model synced for time-range: '
                + this.model.rightPanel.get('startTime').toLocaleTimeString()
                + '/' + this.model.rightPanel.get('endTime').toLocaleTimeString()
                + ', threat-count: ' + this.model.rightPanel.get('totalCount'));
            var me = this, totalCount = me.model.rightPanel.get('totalCount'),
                srcTotalCount = me.model.rightPanel.get('srcTotalCount'),
                dstTotalCount = me.model.rightPanel.get('dstTotalCount');

            // update various threat-counts
            me.$totalThreatCount.text(me.model.rightPanel.get('totalCount').toLocaleString());
            me.$dstTotalCount.text(me.model.rightPanel.get('dstTotalCount').toLocaleString());
            me.$srcTotalCount.text(me.model.rightPanel.get('srcTotalCount').toLocaleString());

            me.$ipsThreatCountDst.text(me.model.rightPanel.get('dstIpsCount').toLocaleString());
            me.$avThreatCountDst.text(me.model.rightPanel.get('dstAvCount').toLocaleString());
            me.$asThreatCountDst.text(me.model.rightPanel.get('dstAsCount').toLocaleString());
            me.$daThreatCountDst.text(me.model.rightPanel.get('dstDaCount').toLocaleString());

            me.$ipsThreatCountSrc.text(me.model.rightPanel.get('srcIpsCount').toLocaleString());
            me.$avThreatCountSrc.text(me.model.rightPanel.get('srcAvCount').toLocaleString());
            me.$asThreatCountSrc.text(me.model.rightPanel.get('srcAsCount').toLocaleString());
            me.$daThreatCountSrc.text(me.model.rightPanel.get('srcDaCount').toLocaleString());

            /*
             * Set the action button's status using util method
             */
            me.getTheStatus(srcTotalCount, dstTotalCount, false);
        },

        // Close event of right panel view
        closeRightPanel: function(e) {
            e.preventDefault();
            this.remove();
        },

        // Handling Show/Hide of Inbound Grid view in the right panel
        showHideInboundGrid: function(e) {
            e.preventDefault();
            var appliedClass = $(e.currentTarget).hasClass('show-grid-section') ? true: false;
            switch(appliedClass) {
                case true:
                    $('#inbound-details').show();
                    $("#displayInboundGrid").removeClass("show-grid-section").addClass("hide-grid-section");
                    $('#outbound-details').hide();
                    $("#displayOutboundGrid").removeClass("hide-grid-section").addClass("show-grid-section");
                    break;
                case false:
                    $('#inbound-details').hide();
                    $("#displayInboundGrid").removeClass("hide-grid-section").addClass("show-grid-section");
                    break;
            }
        },

        // Handling Show/Hide of Outbound Grid view in the right panel
        showHideOutboundGrid: function(e) {
            e.preventDefault();
            var appliedClass = $(e.currentTarget).hasClass('show-grid-section') ? true: false;
            switch(appliedClass) {
                case true:
                    $('#outbound-details').show();
                    $("#displayOutboundGrid").removeClass("show-grid-section").addClass("hide-grid-section");
                    $('#inbound-details').hide();
                    $("#displayInboundGrid").removeClass("hide-grid-section").addClass("show-grid-section");
                    break;
                case false:
                    $('#outbound-details').hide();
                    $("#displayOutboundGrid").removeClass("hide-grid-section").addClass("show-grid-section");
                    break;
            }
        },

        setLayout: function() {
            $('.actionSeparator').remove();
            $('.right-panel-grid').children().css('position', 'initial');
        }

    });

       return RightPanelView;
});