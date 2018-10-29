/**
 * A module that overrides Backbone.TreeModel methods.
 * @module TopologyTreeModel
 * @author Viswesh Subramanian <vissubra@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
    'vendor/backbone/backbone.treemodel'
], function () {

    /**
     * TopologyTreeModel constructor
     *
     * @constructor
     * @class TopologyTreeModel - Overriders methods from Backbone.TreeModel.
     *
     * @returns {Object} Current TopologyTreeModel's object: this
     */
    var TopologyTreeModel = Backbone.TreeModel.extend({
        constructor: function tree(node) {
            Backbone.Model.prototype.constructor.apply(this, arguments);
            this._nodes = new this.collectionConstructor([], {
                model: this.constructor
            });
            this._nodes.parent = this;
            if (node && node.children) this.add(node.children);
        },
        toJSON: function () {
            var jsonObj = _.clone(_.omit(this.attributes, 'children'));
            var children = this._nodes.toJSON();
            if (children.length) jsonObj.children = children;
            return jsonObj;
        }
    });

    return TopologyTreeModel;
});
