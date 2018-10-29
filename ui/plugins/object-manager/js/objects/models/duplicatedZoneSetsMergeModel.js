/**
 * Model for merging duplicated zone-set groups
 * 
 * @module DuplicatedZoneSetsMergeModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var DuplicatedZoneSetsMergeModel = SpaceModel.extend({
        urlRoot: '/api/juniper/sd/zoneset-management/zone-sets/merge',
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                accept: 'application/vnd.juniper.sd.zoneset-management.zone-set.merges+json;version=2;q=0.02',
                contentType: 'application/vnd.juniper.sd.zoneset-management.zone-set.merge-request+json;version=2;charset=UTF-8'
            });
        }
    });

    return DuplicatedZoneSetsMergeModel;
});