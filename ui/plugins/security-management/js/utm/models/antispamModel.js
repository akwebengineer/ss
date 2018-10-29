
/**
 * A Backbone model representing utm anti-spam profile (/api/juniper/sd/utm-management/anti-spam-profiles/).
 *
 * @module AntispamModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/models/spaceModel.js'
], function(
    SpaceModel
) {
    /**
     * AntispamModel definition.
    */
    var AntispamModel = SpaceModel.extend({

        urlRoot: '/api/juniper/sd/utm-management/anti-spam-profiles',

        initialize: function() {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'anti-spam-profile',
                accept: 'application/vnd.juniper.sd.utm-management.anti-spam-profile+json;version=1',
                contentType: 'application/vnd.juniper.sd.utm-management.anti-spam-profile+json;version=1;charset=UTF-8'
            });
        }
    });

    return AntispamModel;
});