/**
 * Collection for Generic Top N graph
 * @module TopNCollection
 * @author Dharma<adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/
define(['./spaceCollection.js', './topNBarWidgetModel.js'], function(SpaceCollection, TopNModel){
	var TopNCollection = SpaceCollection.extend({
		model: TopNModel,
        url:"/api/juniper/appvisibility/application-statistics",
        initialize: function() {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'response.result'
            });
        }		
	});
	return TopNCollection;
})