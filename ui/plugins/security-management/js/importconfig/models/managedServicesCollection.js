/***
  **
 * A Backbone collection representing all Managed Services of a particular device
 *
 * @module ManagedServicesCollection
 * @author Vinuth Tulasi <vinutht@juniper.net>
 * @copyright Juniper Networks, Inc. 2015


* */
define(
    ['../../../../ui-common/js/models/spaceCollection.js'],
    function (SpaceCollection) {
        /**
         * Managed Services Collection definition.
         */
        var ManagedServicesCollection = SpaceCollection.extend(
            {
                url: '/api/juniper/sd/policy-management/import/managed-services?uuid=',

                /**
                 * Derived class constructor method
                 * Provide following while deriving a collection from base collection:
                 * jsonRoot: for wrapping collection's json before sending back in REST call
                 * accept: accept request header in request header in REST call
                 */
                initialize: function(options) {
                    this.url = this.url + options.uuid;
                    // initialize base object properly
                    SpaceCollection.prototype.initialize.call(this, {
                        "accept": "application/vnd.juniper.sd.policy-import-management.managed-services+json;version=1;q=0.01",
                        "contentType": "application/vnd.juniper.sd.policy-import-management.managed-services+json;version=1;charset=UTF-8",
                        "jsonRoot": "managed-services"
                    });
                }
            }
        );

        return ManagedServicesCollection;
    }
);

