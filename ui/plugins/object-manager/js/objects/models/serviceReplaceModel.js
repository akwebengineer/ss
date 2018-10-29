/**
 * Model for service replace
 * 
 * @module ServiceReplaceModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var ServiceReplaceModel = SpaceModel.extend({
        urlRoot: '/api/juniper/sd/service-management/services/replace',
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                "accept": "application/vnd.juniper.sd.service-management.services.replaces+json;version=2;q=0.02",
                "contentType": "application/vnd.juniper.sd.service-management.services.replace-request+json;version=2;charset=UTF-8"
            });
        }
    });

    return ServiceReplaceModel;
});