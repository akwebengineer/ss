/**
 * Model for getting threat management policies
 * 
 * @module threatPolicyModel
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/
define([
    '../../../../../ui-common/js/models/spaceModel.js',
    '../constants/threatManagementPolicyConstants.js'
], function (SpaceModel, Constants) {

    var ThreatManagementPolicyModel = SpaceModel.extend({
        urlRoot: Constants.TMP_FETCH_URL,
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                "accept": Constants.TMP_FETCH_ACCEPT_HEADER,
                "contentType": Constants.TMP_FETCH_CONTENT_TYPE_HEADER,
                "jsonRoot": "threat-policy"
            });
        }
    });

    return ThreatManagementPolicyModel;
});
