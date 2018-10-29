/**
 * A module that builds a flat data store on the provided JSON data.
 * @module FlatDataStore
 * @author Viswesh Subramanian <vissubra@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
    'widgets/topology/lib/baseDataStore',
    'backbone'
], function (BaseDataStore, Backbone) {

    /**
     * FlatDataStore constructor
     *
     * @constructor
     * @class FlatDataStore - Builds a data store from the provided JSON object.
     *
     * @param {Object} data - JSON object.
     *
     * @returns {Object} Current FlatDataStore's object.
     */
    var FlatDataStore = function (data) {
        BaseDataStore.call(this, data);

        this.flatDataStoreErrorMsgs = {
            'noMatch': 'Node or link could not be found for id - ',
            'unknownType': 'Type is unknown - '
        };

        this._nodes = (data.nodes && _.isArray(data.nodes)) ? new Backbone.Collection(data.nodes) : new Backbone.Collection([]);
        this._links = (data.links && _.isArray(data.links)) ? new Backbone.Collection(data.links) : new Backbone.Collection([]);
    };

    FlatDataStore.prototype = Object.create(BaseDataStore.prototype);
    FlatDataStore.prototype.constructor = FlatDataStore;

    /**
     * Returns data in datastore.
     * @param {String} id - node / link id
     * @returns {Object} JSON object
     */
    FlatDataStore.prototype.get = function (id) {
        if (id) {
            var model = this._nodes.findWhere({'id': id});
            if (!model) {
                model = this._links.findWhere({'id': id});
            }

            if (!_.isUndefined(model)) {
                return model.toJSON();
            } else {
                throw new Error(this.flatDataStoreErrorMsgs.noMatch+id);
            }
        } else {
            return {
                nodes: this._nodes.toJSON(),
                links: this._links.toJSON()
            }
        }
    };

    /**
     * Updates the provided object and triggers change event.
     * @param {Object} object - node / link
     */
    FlatDataStore.prototype.put = function (object) {
        if (_.isObject(object) && object.id) {
            var type = this._getType(object),
                collection = (type == "node" ? this._nodes : this._links),
                model = collection.findWhere({'id': object.id});

            if (model) {
                var updatedModel = model.set(object);
                //trigger a change event if attributes have changed since its last set.
                !_.isEqual(updatedModel.changed,{}) && $(this).trigger('dataStore.change', [model.attributes]);
                return model.toJSON();
            } else {
                throw new Error(this.flatDataStoreErrorMsgs.noMatch+object.id);
            }
        }
    };

    /**
     * Adds nodes or links and triggers add event.
     * @param {Object/Array} object - node / link
     */
    FlatDataStore.prototype.add = function (object) {
        if ((_.isArray(object) || _.isObject(object))) {
            if (!_.isArray(object)) {
                object = [object];
            }

            for (var index = 0, len = object.length; index < len; index++) {
                var type = this._getType(object[index]),
                    collection = (type == "node" ? this._nodes : this._links);

                object[index].id && collection.add(object[index]);
            }

            $(this).trigger('dataStore.add', [object]);
        }
    };

    /**
     * Removes node or link identified by id and triggers remove event.
     * @param {String} id - node / link id.
     */
    FlatDataStore.prototype.remove = function (id) {
        if (id) {
            var model = this._nodes.findWhere({'id': id});
            var collection = this._nodes;
            if (!model) {
                model = this._links.findWhere({'id': id});
                collection = this._links;
            }

            if (!_.isUndefined(model)) {
                collection.remove(model);
                $(this).trigger('dataStore.remove', [model.attributes]);
            } else {
                throw new Error(this.flatDataStoreErrorMsgs.noMatch+id);
            }
        }
    };

    /**
     * Returns filtered results
     * @param {Object} filterObject - filter object
     * @returns {Array} - An array of filtered objects.
     */
    FlatDataStore.prototype.filter = function (filterObject) {
        if (_.isObject(filterObject)) {
            var object = filterObject["attributes"] || {},
                type = filterObject["type"],
                results;
            if (type) {
                if (type != "node" && type != "link") {
                    throw new Error(this.flatDataStoreErrorMsgs.unknownType+type);
                }
                var collection = (type == "node" ? this._nodes : this._links);
                if (_.isEqual(object, {})) { // Newer Backbone versions (>1.0) provide all models for collection.where({}) but older versions don't. Hence, adding a fix.
                    results = _.map(collection.models, function (model) {
                        return model.toJSON();
                    });
                } else {
                    results = _.map(collection.where(object), function (model) {
                        return model.toJSON();
                    });
                }
            } else {
                var filteredNodes = _.map(this._nodes.where(object), function (model) {
                    return model.toJSON();
                });
                var filteredLinks = _.map(this._links.where(object), function (model) {
                    return model.toJSON();
                });
                results = filteredNodes.concat(filteredLinks);
            }
            return results;
        }
    };

    /**
     * Returns an object type
     * @param {Object} object - node / link
     * @returns {string}
     * @private
     */
    FlatDataStore.prototype._getType = function (object) {
        return (object['source'] && object['target']) ? "link" : "node";
    };

    return FlatDataStore;
});