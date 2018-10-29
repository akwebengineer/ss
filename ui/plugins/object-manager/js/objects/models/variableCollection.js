/**
 * Collection for getting variables 
 * 
 * @module VariableCollection
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    '../../../../ui-common/js/models/spaceCollection.js',
    './variableModel.js'
], function(Backbone, SpaceCollection, Model) {
    /**
     * VariableCollection definition.
     */
    var ServiceCollection = SpaceCollection.extend({
        model: Model,
        url: function(filter) {
            var baseUrl = "/api/juniper/sd/variable-management/variable-definitions";

            if (filter) {
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }
            return baseUrl;
        },

        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'variable-definitions.variable-definition',
                accept: 'application/vnd.juniper.sd.variable-management.variable-definitions+json;version=1;q=0.01'
            });
        }
  });

  return ServiceCollection;
});