/**
 * A Backbone model and collection that uses sample data to represent Zone Policies
 *
 * @module TreePoliciesModel
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define([
    'backbone'
], function (Backbone) {

    /**
     * Zone Model and Collection definition
     */
    var TreePoliciesModel = {},
        pages = [1, 2, 3],
        nodes = [1, 2, 4, 11, 15, 25, 55, 114, 125, 214, 1111, 1115, 1155, 2111, 2115, 2155],
        createModel = function (type, id) {
            var model = Backbone.Collection.extend({
                url: './dataSample/tree/' + type + id + '.json',
                model: Backbone.Model.extend({})
            });
            return model;
        };

    pages.forEach(function (index) {
        TreePoliciesModel["page" + index] = createModel("page", index);
    });

    nodes.forEach(function (index) {
        TreePoliciesModel["node" + index] = createModel("node", index);
    });

    return TreePoliciesModel;
});