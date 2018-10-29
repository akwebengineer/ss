/**
 * Collection for getting Alert Definitions
 *
 * @module AlertDefinitionCollection
 * @author Shini <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
**/

define([
    'backbone',
    '../../../ui-common/js/models/spaceCollection.js',
    './alertDefinitionModel.js'
], function(Backbone, SpaceCollection, Model) {
    /**
     * Alert Definition Collection definition.
     */
    var appSecureCollection = SpaceCollection.extend({
        model: Model,
        url: function(filter, connective) {
            var baseUrl = "/api/juniper/seci/alertdefinition-management/alert-definitions";

            if (Object.prototype.toString.call(filter) === "[object String]") {
                return baseUrl + "?filter=(" + filter + ")";
            } else if (filter) {
                // single filter
                return baseUrl += "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }

            return baseUrl;
        },
        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
               "accept": "application/vnd.juniper.seci.alertdefinition-management.alert-definitions+json;version=1",
//               "contentType": "application/vnd.juniper.seci.alertdefinition-management.alert-definitions+json;version=1;charset=UTF-8",
               "jsonRoot": "alert-definitions.alert-definition"
            });

        }
  });

  return appSecureCollection;
});
