/**
 *  @module EventViewer
 *  @author Anupama<athreyas@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define(['backbone', 'marionette', 'text!../templates/detailAggListItem.html'], function(Backbone, Marionette, DetailAggListItemTemplate){
	var ItemView = Marionette.ItemView.extend({
	    template: DetailAggListItemTemplate
	});
	return ItemView;
})