/**
 * Collection for Bubble Graph
 * @module BubbleCollection
 * @author Dharma<adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/
define(['./spaceCollection.js', './bubbleModel.js'], function(SpaceCollection, BubbleModel){
	var BubbleCollection = SpaceCollection.extend({
		model: BubbleModel,
		url:"/api/juniper/appvisibility/application-statistics",
        initialize: function() {
            // initialize base object properly
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'response.result'
            });
        }		
	})
	return BubbleCollection;
})