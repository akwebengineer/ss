
/**
 * A Backbone model representing utm device
 *
 * @module DeviceModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function(
) {
    /**
     * DeviceModel definition.
    */
    var DeviceModel = Backbone.Model.extend({
        defaults: {
            'name':'',
            'moid': '',
            'domain-name': ''
        }
    });

    return DeviceModel;
});