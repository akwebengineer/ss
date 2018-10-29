/**
 * Model for getting Users
 * 
 * @module UsersModel
 * @author Slipstream Developers <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    '../../../../../../ui-common/js/models/spaceModel.js'
], function(
    SpaceModel
) {
    /**
     * UsersModel definition.
    */
    var UsersModel = SpaceModel.extend({

        urlRoot: '/api/space/user-management/users',

        initialize: function() {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'users.user',
                accept: 'application/vnd.net.juniper.space.user-management.users+json;version=1'
               // contentType: ''
            });
        }
    });

    return UsersModel;
});









