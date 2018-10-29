/**
 * Model for getting or updating a specific service
 * 
 * @module ServiceModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var ServiceModel = SpaceModel.extend({

        urlRoot: '/api/juniper/sd/service-management/services',

        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'service',
                accept: 'application/vnd.juniper.sd.service-management.service+json;version=1;q=0.01',
                contentType: 'application/vnd.juniper.sd.service-management.service+json;version=1;charset=UTF-8'
            });
        }
    });

    return ServiceModel;
});