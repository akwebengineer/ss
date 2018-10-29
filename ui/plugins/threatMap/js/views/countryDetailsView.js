/**
 *  View to display the tooltip content on hover each country in the mapWidget
 *
 *  @module ThreatMap
 *  @author Shini <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2016
 * */

define(['backbone',
        'widgets/tabContainer/tabContainerWidget',
        'lib/template_renderer/template_renderer',
        'text!../templates/countryDetailsTemplate.html',
		'../models/CountryDetailsModel.js',
        '../models/UnknownCountryDetailsModel.js',
        './topIPAddressesView.js',
        '../utils/threatMapConstants.js',
        '../utils/threatMapUtil.js',
	], function(Backbone, TabContainerWidget, TemplateRenderer, CountryDetailsTemplate, CountryDetailsModel,
	            UnknownCountryDetailsModel, TopIPAddressesView, ThreatMapConstants, ThreatMapUtil){

	var CountryDetailsView = Backbone.View.extend({
	    pollInterval: 30 * 1000,

		initialize: function(options){
			console.log('initialised');
			var me = this;
			me.model    = me.options.model;
			me.country  = me.options.geoJsonFeature;
			me.context  = me.options.context;
			me.activity = me.options.activity;

			me.threatMapConf = {
			    'threatmap_insight_bar_desc'                : me.context.getMessage("threatmap_insight_bar_desc"),
                'threatmap_tooltip_total'                   : me.context.getMessage("threatmap_tooltip_total"),
                'threatmap_tooltip_threat_events'           : me.context.getMessage("threatmap_tooltip_threat_events"),
                'threatmap_tooltip_threat_since_time'       : me.context.getMessage("threatmap_tooltip_threat_since_time"),
                'threatmap_tooltip_inbound'                 : me.context.getMessage("threatmap_tooltip_inbound"),
                'threatmap_tooltip_outbound'                : me.context.getMessage("threatmap_tooltip_outbound"),
                'threatmap_tooltip_view_details'            : me.context.getMessage("threatmap_tooltip_view_details"),
                'threatmap_legend_source'                   : me.context.getMessage("threatmap_legend_source"),
                'threatmap_legend_dest'                     : me.context.getMessage("threatmap_legend_dest"),
                'threatmap_tooltip_top_5_ip_address'        : me.context.getMessage("threatmap_tooltip_top_5_ip_address"),
                'threatmap_tooltip_button_block_inbound'    : me.context.getMessage("threatmap_tooltip_button_block_inbound"),
                'threatmap_tooltip_button_block_outbound'   : me.context.getMessage("threatmap_tooltip_button_block_outbound")
            };

            me.countryCode = me.country.properties.iso_a2.toUpperCase();
            // fetch data for popover
            if(me.countryCode === ThreatMapConstants.Country.UNKNOWN) {
                me.model.countryDetails = new UnknownCountryDetailsModel();
            } else {
                me.model.countryDetails = new CountryDetailsModel();
            }
            _.extend(this, ThreatMapUtil);
		},
		//
		render:function(){
			console.log('rendered');
			var me = this;

			me.threatMapConf.flagCode = me.country.properties.iso_a2.toLowerCase();
            me.threatMapConf.countryName = me.country.properties.name;
            me.threatMapConf.countryCode = me.country.properties.iso_a2.toUpperCase();

            me.$el.append(TemplateRenderer(CountryDetailsTemplate, me.threatMapConf));
            me.model.countryDetails.on('sync', $.proxy(me.modelSyncFn,me));
            me.model.countryDetails.fetch({
                pollInterval: me.pollInterval,
                countryName: me.country.properties.name,
                countryCode: me.country.properties.iso_a2.toUpperCase()
            });

            return me;
		},
        // Sync method
		modelSyncFn: function(){
             // update DOM for popover country details
            var me = this, updatedConf = _.extend(me.threatMapConf, me.model.countryDetails.toJSON()),
                srcTotalCount = parseInt(updatedConf["srcTotalCount"]),
                dstTotalCount = parseInt(updatedConf["dstTotalCount"]);

            for (prop in updatedConf) {
                if (typeof updatedConf[prop] === 'number') {
                    updatedConf[prop] = updatedConf[prop].toLocaleString();
                }
            }

            var html = TemplateRenderer(CountryDetailsTemplate, updatedConf);
            me.$el.find('#country-details').replaceWith(html);

            /*
             * Set the action buttons status and
             * set the traffic either inbound/outbound
             */
            me.getTheStatus(srcTotalCount, dstTotalCount, true);
            var inboundAddressesView, outboundAddressesView, tabsArray, tabsWidget,
                inboundTitle = me.context.getMessage("threatmap_tooltip_grid_title_inbound"),
                outboundTitle = me.context.getMessage("threatmap_tooltip_grid_title_outbound"),
                inboundTableID = "tooltip_inbound_grid_conf",
                outboundTableID = "tooltip_outbound_grid_conf";

            inboundAddressesView = me.getTopIPAddressView(me.inboundFlag, inboundTitle, inboundTableID);
            outboundAddressesView = me.getTopIPAddressView(me.outboundFlag, outboundTitle, outboundTableID);

            $('.actionSeparator').remove();
            tabsArray = [{
                id:"inbound",
                name: me.context.getMessage('threatmap_tooltip_tab_container_title_inbound', [dstTotalCount]),
                content: inboundAddressesView
            },{
                id:"outbound",
                name: me.context.getMessage('threatmap_tooltip_tab_container_title_outbound', [srcTotalCount]),
                content: outboundAddressesView
            }];

            tabsWidget = new TabContainerWidget({
                "container": me.$el.find("#tab-container"),
                "tabs": tabsArray
//                "height": "auto"
//                "height": "220px"
            }).build();
        },

        getTopIPAddressView: function(flag, title, tableId){
            var me = this;
            return new TopIPAddressesView ({
               "flag": flag,
               "title": title,
               "model": me.model,
               "context": me.context,
               "activity": me.activity,
               "tableId": tableId,
               "customButtonKey": me.context.getMessage('threatmap_tooltip_custom_button_block_ip'),
               "isRightPanel": false
           });
        }

	});

	return CountryDetailsView;
});