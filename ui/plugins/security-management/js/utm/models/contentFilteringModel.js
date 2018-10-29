
/**
 * A Backbone model representing utm content-filtering profile (/api/juniper/sd/utm-management/content-filtering-profiles/).
 *
 * @module ContentFilteringModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/models/spaceModel.js'
], function(
    SpaceModel
) {
    /**
     * content filtering mode definition.
    */
    var ContentFilteringModel = SpaceModel.extend({

        urlRoot: '/api/juniper/sd/utm-management/content-filtering-profiles',

        initialize: function() {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'content-filtering-profile',
                accept: 'application/vnd.juniper.sd.utm-management.content-filtering-profile+json;version=1',
                contentType: 'application/vnd.juniper.sd.utm-management.content-filtering-profile+json;version=1;charset=UTF-8'
            });
        }
    });

    return ContentFilteringModel;
});