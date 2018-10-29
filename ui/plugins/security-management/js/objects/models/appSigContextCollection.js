/***
 **
 * A Backbone collection representing all App Sig Contexts (/api/juniper/sd/app-sig-management/app-sigs/contexts).
 *
 * @module AppSigContextsCollection
 * @author Vinuth Tulasi <vinutht@juniper.net>
 * @copyright Juniper Networks, Inc. 2015


 * */
define(['../../../../ui-common/js/models/spaceCollection.js'],
    function (SpaceCollection) {
        /**
         * Categories Collection definition.
         */
        var ContextsCollection = SpaceCollection.extend({
            url: '/api/juniper/sd/app-sig-management/app-sigs/contexts',
            //model: AppSigCategoryModel,

            /**
             * Derived class constructor method
             * Provide following while deriving a collection from base collection:
             * jsonRoot: for wrapping collection's json before sending back in REST call
             * accept: accept request header in request header in REST call
             */
            initialize: function() {
                // initialize base object properly
                SpaceCollection.prototype.initialize.call(this, {
                    accept: 'application/vnd.juniper.sd.app-sig-management.app-sig-contexts+json;q=0.01;version=1'
                });
            }
        });

        return ContextsCollection;
    });


