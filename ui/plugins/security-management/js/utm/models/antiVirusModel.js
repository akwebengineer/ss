
/**
 * A Backbone model representing utm Anti-Virus profile (/api/juniper/sd/utm-management/anti-virus-profiles/).
 *
 * @module antiVirusModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/models/spaceModel.js'
], function(
    SpaceModel
) {
    /**
     * Anti-Virus mode definition.
    */
    var antiVirusModel = SpaceModel.extend({

        urlRoot: '/api/juniper/sd/utm-management/anti-virus-profiles',

        initialize: function() {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'anti-virus-profile',
                accept: 'application/vnd.juniper.sd.utm-management.anti-virus-profile+json;version=1',
                contentType: 'application/vnd.juniper.sd.utm-management.anti-virus-profile+json;version=1;charset=UTF-8'
            });
        }
    });

    return antiVirusModel;
});