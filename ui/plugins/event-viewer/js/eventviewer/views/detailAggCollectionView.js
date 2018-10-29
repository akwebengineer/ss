/**
 *  @module EventViewer
 *  @author Anupama<athreyas@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define(['backbone', 'marionette', './detailAggListItemView.js', 'text!../templates/detailView.html'], function(Backbone, Marionette, ItemView, DetailViewTemplate){
	var detailAggListCollectionView = Marionette.CollectionView.extend({
		itemView: ItemView,
	    template: DetailViewTemplate,
	    itemViewContainer: ".aggList-itemview"
	});
	return detailAggListCollectionView;
})