/**
 * Model for Bubble Graph
 * @module BubbleModel
 * @author Dharma<adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/
define(['backbone'], function(Backbone){
	var BubbleModel = Backbone.Model.extend({
		inilialized:function(){
			console.log('App Secure bubble model inilialized');
		},
		defaults:{
			"name":"",
			"value":0,
			"risk":0
		}
	});
	return BubbleModel;
});