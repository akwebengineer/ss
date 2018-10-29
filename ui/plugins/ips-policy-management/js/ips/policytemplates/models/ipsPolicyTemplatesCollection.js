/**
 * Collection for getting devices 
 * 
 * @module ipsPolicyTemplatesCollection
 * @copyright Juniper Networks, Inc. 2015
**/

define([
    'backbone',
    '../../../../../ui-common/js/models/spaceCollection.js',
    './ipsPolicyTemplatesModel.js',
    '../constants/ipsPolicyTemplatesConstants.js'
], function(Backbone, SpaceCollection, Model,IpsPolicyTemplatesConstants) {
    /**
     * ipsPolicyTemplatesCollection definition.
     */
    var ipsPolicyTemplatesCollection = SpaceCollection.extend({
        model: Model,
        url: function(filter) {
            var baseUrl = IpsPolicyTemplatesConstants.IPS_POLICY_TEMPLATE_URL;

            if (Array.isArray(filter)) {
                // Multiple filters support
                var tmpUrl = baseUrl + "?filter=(";

                for (var i=0; i<filter.length; i++) {
                    tmpUrl += filter[i].property + " " + filter[i].modifier + " '" + filter[i].value + "'";
                    if (i !== filter.length-1) {
                        tmpUrl += " and ";
                    }
                }
                tmpUrl += ")";

                return tmpUrl;
            } else if (filter) {
                // single filter
                return baseUrl += "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }

            return baseUrl;
        },
        initialize: function () {
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'policy-templates.policy-template',
                accept: IpsPolicyTemplatesConstants.IPS_POLICY_TEMPLATES_ACCEPT_HEADER
            });
            
        }
  });

  return ipsPolicyTemplatesCollection;
});
