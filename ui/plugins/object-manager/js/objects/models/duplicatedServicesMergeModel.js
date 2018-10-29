/**
 * Model for merging duplicated service groups
 * 
 * @module DuplicatedServicesMergeModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var DuplicatedServicesMergeModel = SpaceModel.extend({
        urlRoot: '/api/juniper/sd/service-management/services/merge',
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                accept: 'application/vnd.juniper.sd.service-management.services.merges+json;version=2;q=0.02',
                contentType: 'application/vnd.juniper.sd.service-management.services.merge-request+json;version=2;charset=UTF-8'
            });
        }
    });

    return DuplicatedServicesMergeModel;
});