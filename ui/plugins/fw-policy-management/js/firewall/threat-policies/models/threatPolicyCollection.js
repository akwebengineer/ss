/**
 * Collection for getting threat management policies
 * 
 * @module ThreatManagementPolicyCollection
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
**/

define([
    'backbone',
    '../../../../../ui-common/js/models/spaceCollection.js',
    './threatPolicyModel.js',
    '../constants/threatManagementPolicyConstants.js'
], function(Backbone, SpaceCollection, Model, Constants) {
    /**
     * Threat Management Policy Collection definition.
     */
    var ThreatManagementPolicyCollection = SpaceCollection.extend({
        model: Model,

        /**
         * Returns url
         * @param filter
         * @returns {*}
         */
        url: function(filter) {
            var baseUrl = Constants.TMP_FETCH_URL;

            if (filter) {
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }
            return baseUrl;
        },

        /**
         * Handles initialization
         */
        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: Constants.TMP_JSON_ROOT,
                accept: Constants.TMP_ACCEPT_HEADER
            });
            
        }
  });

  return ThreatManagementPolicyCollection;
});
