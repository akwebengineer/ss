/**
 *  Summary InSight Item View
 *  
 *  @module EventViewer
 *  @author dharma<adharmendran@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define(['backbone', 'marionette', 'text!../templates/summaryInSightBarItem.html'], function(Backbone, Marionette, SummaryInSightBarTemplate){
	var ItemView = Marionette.ItemView.extend({
		events:{
			"click .ev-event-highlight": "onEventItemClick"
		},
	    template: SummaryInSightBarTemplate,
	    onEventItemClick:function(event){
	    	Slipstream.vent.trigger("evsummary:eventitemclick", this.model);
	    }
	});
	return ItemView;
})