/**
 * ListBuilder for Device selection
 *
 * @module DeviceListBuilder
 * @author Judy Nguyen <jnguyen@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    '../../../../../sd-common/js/common/widgets/baseListBuilder.js',
    '../models/deviceCollection.js'
], function (Backbone, ListBuilder, Collection) {

    var defaultConf = {
        list: {
                availableElements: []
        }
    };

    /**
     * SourceIdentityListBuilder definition.
     */
    var DeviceListBuilder = ListBuilder.extend({

        initialize: function() {
            this.conf = _.extend(defaultConf, this.options);
            this._listBuilder = null;
            this.policyObj = this.options.policyObj;

            this.collection = new Collection({url: '/api/juniper/sd/policy-management/firewall/policies/' + this.policyObj.id + '/devices'});
        },

        /**
         * Specify a collection
         */
//        collection: new Collection(),

        /**
         * Edit items in the list for display
         */
        buildList: function (collection) {
            var deviceList = [];

            collection.models.forEach(function (model) {
                deviceList.push({
                    'label': model.get("name"),
                    'value': model.get("id")
                    // 'label': model.keys()[0],
                    // 'value': model.keys()[0]
                   // 'valueDetails': "",
                   // 'extraData' : ""

                });
            });

            return deviceList;
        }
    });

    return DeviceListBuilder;
});
