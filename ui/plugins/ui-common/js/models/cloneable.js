/** 
 * Clonable functionality for a backbone model based on Space
 *
 * @module Cloneable
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function() {

    // Cache 
    var names = {};

    var cleanIdentifiers = function(model) {
        model.unset('id');
        model.unset('href');
        model.unset('uri');
        model.unset('created-by-user-name');
        model.unset('edit-version');
        model.unset('last-modified-by-user-name');
    };

    var resetCache = function() {
        names = {};
    };

    var nameExists = function(name, models) {
        // Cache names if empty
        if ($.isEmptyObject(names)) {
            for (var i =0, j = models.length; i < j; i++) {
                names[models[i].get('name')] = true;
            }
        }

        if (names[name]) {
            return true;
        }

        return false;
    }

    var createName = function(name, modifier) {
        return name + '_copy_' + modifier;
    };

    /**
     * @returns Promise
     */
    var generateClonedName = function(model) {
        var urlFilter = {
            property: 'name', 
            modifier: 'starts-with', 
            value: model.get('name')
        };

        var onFetch = function(collection, response, options) {
            var test;
            resetCache();

            for (var i = 1; /** Max attempts? **/ ; i++) {
                test = createName(model.get('name'), i);
                if (! nameExists(test, collection.models)) {
                    model.set('name', test);
                    return;
                }
            }
        };

        var onError = function(collection, response, options) {
            console.log('error');
        };

        cleanIdentifiers(model);

        return model.collection.fetch({
            headers: {  // Remove after start using SpaceCollection
                accept: model.collection.accept 
            },
            url: model.collection.url(urlFilter),
            success: onFetch,
            error: onError
        });

    };

    var cloneMe = function() {
        return generateClonedName(this);
    }

    return {
        cloneMe: cloneMe
    };
});