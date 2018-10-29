
/**
 * A Backbone model representing utm url pattern
 *
 * @module UrlPatternModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/models/spaceModel.js'
], function(
    SpaceModel
) {
    /**
     * UrlPatternModel definition.
    */
    var UrlPatternModel = SpaceModel.extend({

        urlRoot: '/api/juniper/sd/utm-management/url-patterns',

        initialize: function() {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'url-pattern',
                accept: 'application/vnd.juniper.sd.utm-management.url-patterns+json;version=1',
                contentType: "application/vnd.juniper.sd.utm-management.url-patterns+json;version=1;charset=UTF-8"
            });
        }
    });

    return UrlPatternModel;
});