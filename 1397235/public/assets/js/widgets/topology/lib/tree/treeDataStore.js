/**
 * A module that builds a tree data store on the provided JSON data.
 * @module TreeDataStore
 * @author Viswesh Subramanian <vissubra@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
    'widgets/topology/lib/tree/backbone.treemodel',
    'widgets/topology/lib/baseDataStore'
], function (TreeModel, BaseDataStore) {

    /**
     * TreeDataStore constructor
     *
     * @constructor
     * @class TreeDataStore - Builds a data store from the provided JSON object.
     *
     * @param data - JSON object
     *
     * @returns {Object} Current TreeDataStore's object.
     */
    var TreeDataStore = function (data) {
        BaseDataStore.call(this, data);

        this.TreeDataStoreErrorMsgs = {
            'noMatch': 'Node could not be found for id - '
        };

        this.treeModel = new TreeModel(data);
    };

    TreeDataStore.prototype = Object.create(BaseDataStore.prototype);
    TreeDataStore.prototype.constructor = TreeDataStore;

    /**
     * Returns data in datastore accounting for add, remove, put operations.
     * @param {String} id - node id
     * @returns {Object} JSON object
     */
    TreeDataStore.prototype.get = function (id) {
        if (id) {
            var node = this.treeModel.findWhere({'id': id});
            if (node) {
                return node.toJSON();
            } else {
                throw new Error(this.TreeDataStoreErrorMsgs.noMatch+id);
            }
        } else {
            return this.treeModel.toJSON();
        }

    };

    /**
     * Updates the provided object and triggers change event.
     * @param {Object} object - node
     */
    TreeDataStore.prototype.put = function (object) {
        var node = _.isObject(object) && object.id && this.treeModel.find(object.id);
        if (node) {
            node.set(object);
            $(this).trigger('dataStore.change', [node.attributes]);
        } else {
            throw new Error(this.TreeDataStoreErrorMsgs.noMatch+object.id);
        }
    };

    /**
     * Adds a child to a node identified by id and triggers add event.
     * @param {String} id - node id
     * @param {Object/Array} object - nodes array
     */
    TreeDataStore.prototype.add = function (id, object) {
        if (_.isArray(object) || _.isObject(object)){
            var node = id && this.treeModel.find(id);
            if (node) {
                node.add(object);
                $(this).trigger('dataStore.add', [object]);
            } else {
                throw new Error(this.TreeDataStoreErrorMsgs.noMatch+id);
            }
        }
    };

    /**
     * Removes node identified by id and triggers remove event.
     * @param {String} id - node id
     */
    TreeDataStore.prototype.remove = function (id) {
        var node = id && this.treeModel.find(id);
        if (node) {
            node.remove();
            $(this).trigger('dataStore.remove', [id]);
        } else {
            throw new Error(this.TreeDataStoreErrorMsgs.noMatch+id);
        }
    };

    return TreeDataStore;
});