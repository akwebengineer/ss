/**
 *  InSight Collection Class
 *  
 *  @module EventViewer
 *  @author dharma<adharmendran@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define(['backbone', './inSightModel.js'], function(backbone, InSightModel){
	var InSightCollection = Backbone.Collection.extend({
        model: InSightModel,
    });
    return InSightCollection;
});