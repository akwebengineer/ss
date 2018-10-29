/**
 *  Summary InSight Composite View
 *  
 *  @module EventViewer
 *  @author dharma<adharmendran@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define(['backbone', 'marionette', './summaryInSightBarItemView.js', 'text!../templates/summaryInSightBar.html'], function(Backbone, Marionette, ItemView, SummaryTemplate){
	var SummaryInSightBarCompositeView = Marionette.CompositeView.extend({
		itemView: ItemView,
	    template: SummaryTemplate,
	    itemViewContainer:".ev-insightbar-itemview",
	    initialize:function(){
	    	this.collection = this.model.get('list');
	    }
	});
	return SummaryInSightBarCompositeView;
})