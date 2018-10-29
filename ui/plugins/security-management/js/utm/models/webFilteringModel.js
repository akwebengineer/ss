
/**
 * A Backbone model representing utm web-filtering profile (/api/juniper/sd/utm-management/web-filtering-profiles/).
 *
 * @module WebFilteringModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/models/spaceModel.js'
], function(
    SpaceModel
) {
    /**
     * web filtering mode definition.
    */
    var WebFilteringModel = SpaceModel.extend({

        urlRoot: '/api/juniper/sd/utm-management/web-filtering-profiles',

        initialize: function() {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'web-filtering-profile',
                accept: 'application/vnd.juniper.sd.utm-management.web-filtering-profile+json;version=1',
                contentType: 'application/vnd.juniper.sd.utm-management.web-filtering-profile+json;version=1;charset=UTF-8'
            });
        }
    });

    return WebFilteringModel;
});