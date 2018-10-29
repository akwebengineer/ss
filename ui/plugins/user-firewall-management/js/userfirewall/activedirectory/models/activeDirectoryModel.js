/**
 * A Backbone model representing user firewall active directory
 *
 * @module ActiveDirectoryModel
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    '../../../../../ui-common/js/models/spaceModel.js',
    '../../constants/userFirewallConstants.js'
], function (SpaceModel, Constants) {
    /**
     * Active Directory Model definition.
     */
    var ActiveDirectoryModel = SpaceModel.extend({

        urlRoot: Constants.ACTIVE_DIRECTORY.URL_PATH_MODEL,

        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: Constants.ACTIVE_DIRECTORY.JSON_ROOT,
                accept: Constants.ACTIVE_DIRECTORY.ACCEPT_HEADER_MODEL,
                contentType: Constants.ACTIVE_DIRECTORY.CONTENT_TYPE_MODEL
            });
        },

    });

    return ActiveDirectoryModel;
});
