/**
 *  @module EventViewer
 *  @author Anupama<athreyas@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define(['backbone', './aggListModel.js'], function(backbone, AggListModel){
	var AggListCollection = Backbone.Collection.extend({
        model: AggListModel,
    });
    return AggListCollection;
});