/**
 * A module that provides a base data store. This constructor needs to be extended with custom dataStore implementations.
 * @module BaseDataStore
 * @author Viswesh Subramanian <vissubra@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
], function () {

    /**
     * BaseDataStore constructor
     *
     * @constructor
     * @class BaseDataStore - Builds a data store from the provided JSON object.
     *
     * @param {Object} data - JSON object.
     *
     * @returns {Object} Current BaseDataStore's object.
     */
    var BaseDataStore = function (data) {

        var errorMessages = {
            'notAnObject': 'The provided data must be in JSON format'
        };

        if (!_.isObject(data)) {
            throw new Error(errorMessages.notAnObject);
        }

    };

    /**
     * Base method for returning data in dataStore.
     * @param {String} id - identifier.
     */
    BaseDataStore.prototype.get = function (id) {
    };

    /**
     * Base method to update data.
     * @param {Object} object.
     */
    BaseDataStore.prototype.put = function (object) {
    };

    /**
     * Base method to add node/link.
     * @param {Object/Array} object.
     */
    BaseDataStore.prototype.add = function (object) {
    };

    /**
     * Base method to remove node/link.
     * @param {String} id - identifier.
     */
    BaseDataStore.prototype.remove = function (id) {
    };

    return BaseDataStore;
});