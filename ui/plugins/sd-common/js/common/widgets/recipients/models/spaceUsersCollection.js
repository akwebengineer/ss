/**
 * A Backbone collection representing all Space-Users (/api/space/user-management/users)
 *
 * @module spaceUsersCollection
 * @author Slipstream Developers  <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define(['../../../../../../ui-common/js/models/spaceCollection.js',  './usersModel.js'
       ], function (SpaceCollection, UsersModel) {
    /**
     *  UsersCollection definition.
     */
    var UsersCollection = SpaceCollection.extend({
        url: '/api/space/user-management/users',
        model: UsersModel,

        /** 
         * Derrived class constructor method
         * Provide following while deriving a collection from base collection:
         * jsonRoot: for wrapping collection's json before sending back in ReST call
         * accept: accept request header in request header in ReST call
         */
        initialize: function() {
            // initialize base object properly
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'users.user',
                accept: 'application/vnd.net.juniper.space.user-management.users+json;version=1'
            });
        }
    });

    return UsersCollection;
});
