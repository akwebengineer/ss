/**
 * Collection for getting custom address lists
 *
 * @module CustomAddressListCollection
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
**/

define([
    '../../../../ui-common/js/models/spaceCollection.js',
    './customAddressListModel.js'
], function(SpaceCollection, Model) {
    /**
     * CustomAddressListCollection defination.
     */
    var CustomAddressListCollection = SpaceCollection.extend({
        model: Model,
        url: function(filter) {
            var baseUrl = "/api/juniper/sd/secintel-management/custom-address-lists";

            if (filter) {
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }
            return baseUrl;
        },
        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'custom-address-lists.custom-address-list',
                accept: 'application/vnd.juniper.sd.secintel-management.custom-address-lists+json;version=1;q=0.01'
            });
        }
  });

  return CustomAddressListCollection;
});