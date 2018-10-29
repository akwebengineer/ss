
/**
 * A Backbone model representing active database (/api/juniper/sd/ips-management/active-db).
 *
 * @module ActiveDatabaseModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../ui-common/js/models/spaceModel.js'
], function(
    SpaceModel
) {
    /**
     * ActiveDatabaseModel definition.
    */
    var ActiveDatabaseModel = SpaceModel.extend({

        urlRoot: '/api/juniper/sd/ips-management/active-db',

        initialize: function() {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'idp-manifest',
                accept: 'application/vnd.juniper.sd.ips-management.idp-manifest-ref+json;version=1;q=0.01'
            });
        }
    });

    return ActiveDatabaseModel;
});
