/**
 * Model for Application Detail
 * @module AppDetailModel
 * @author Dharma<adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/
define(['./spaceModel.js'], function(SpaceModel){
	var AppDetailModel = SpaceModel.extend({
        urlRoot: '/api/juniper/sd/app-sig-management/app-sigs',
        idAttribute: "id",
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
               "accept": "application/vnd.juniper.sd.app-sig-management.app-sig+json;version=1;q=0.01",
               "contentType": "application/vnd.juniper.sd.app-sig-management.app-sig+json;version=1;charset=UTF-8",       
               "jsonRoot": "app-sig"
            });
        }
	});
	return AppDetailModel;
});