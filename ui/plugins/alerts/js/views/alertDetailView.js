/**
* Alert detail view.
* This view opens up when viewing detail of an Alert item.
* 
* @module Alerts
* @author Orpheus Brahmos <orpheus-brahmos-team@juniper.net>, <anshuls@juniper.net>
* @copyright Juniper Networks, Inc. 2015
**/

define([
    'widgets/form/formWidget',
    '../../../ui-common/js/views/detailView.js',
    '../conf/alertDetailFormConfiguration.js',
    '../../../ui-common/js/common/utils/filterUtil.js'
	], function (FormWidget, DetailView, FormConfig, FilterUtil) {

    var AlertsDetailView = DetailView.extend({

	    initialize: function(options) {
	    	DetailView.prototype.initialize.call(this, options);
			return this;
	    },

	    render: function() {
	        var me = this, aggregation = me.model.get('aggregation'), source = me.model.get('source');
	    	me.model.set('generated-time', me.getDateTimeFormat(me.model.get('generated-time')));
	    	me.model.set('start-time', me.getDateTimeFormat(me.model.get('start-time')));
	    	me.model.set('end-time', me.getDateTimeFormat(me.model.get('end-time')));
	    	me.model.set('severity', me.getSeverityText(me.model.get('severity')));
            me.model.set('aggregation', me.getAggregationText(me.model.get('aggregation')));
            formWidget = new FormWidget({
                container: this.el,
                elements: new FormConfig(this.context).getValues(),
                values: this.model.attributes
            }).build();

            me.$el.find('#target').html('<label style="font-weight: normal;">'+me.formatSource(source, aggregation)+'</label>');

	    	return this;
	    },

	    getDateTimeFormat: function(raw) {
	        return raw ? Slipstream.SDK.DateFormatter.format(new Date(raw), "llll") : "";
		},

		getSeverityText: function(raw) {
	    	switch(raw) {
	        	case 1: returnVal = 'Info'; break;
	        	case 2: returnVal = 'Minor'; break;
	        	case 3: returnVal = 'Major'; break;
	        	case 4: returnVal = 'Critical'; break;
	        	default: returnVal = 'Unknown'; break;
	    	}
	    	return returnVal;
		},

		getAggregationText: function(raw) {
		    this.util = new FilterUtil();
		    return this.context.getMessage(this.util.getUIKey(raw));
		},

		formatSource: function(raw, aggregation) {
		    var str= this.context.getMessage('alertdetail_filter_condition') + raw[aggregation]+"<br /><br/>"
		            +this.context.getMessage('alertdetail_time_duration') + raw["Time Duration"]+"<br/><br/>"
		            +this.context.getMessage('alertdetail_threshhold') + raw["Threshhold"];
		    return str;
		}


	});

	return AlertsDetailView;
});