
/**
 * A Backbone model representing custom address list (/api/juniper/sd/secintel-management/custom-address-lists/).
 *
 * @module CustomAddressListModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/models/spaceModel.js'
], function(
    SpaceModel
) {
    /**
     * CustomAddressListModel definition.
    */
    var CustomAddressListModel = SpaceModel.extend({

        urlRoot: '/api/juniper/sd/secintel-management/custom-address-lists',

        initialize: function() {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'custom-address-list',
                accept: 'application/vnd.juniper.sd.secintel-management.custom-address-list+json;version=1;q=0.01',
                contentType: 'application/vnd.juniper.sd.secintel-management.custom-address-list+json;version=1;charset=UTF-8'
            });
        }
    });

    return CustomAddressListModel;
});