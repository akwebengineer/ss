/**
 * The PreferencesResolver module defines the interface between a plugin and a Preferences provider.
 *
 * @module
 * @name Slipstream/SDK/PreferencesResolver
 * @author Viswesh Subramanian <vissubra@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define(function() {
    Slipstream.module("SDK", /** @lends PreferencesResolver */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
        // private

        // public

        /**
         * Construct an PreferencesResolver
         *
         * @constructor
         * @class PreferencesResolver
         * @classdesc Represents a Slipstream PreferencesResolver
         */
        SDK.PreferencesResolver = function() {}

        /**
         * Save a set of preferences
         *
         * @param {Object} prefs - An object representing the set of preferences to be saved.
         * @param {Object} options - An object containing a set of save options.  Valid options are:
         *
         * storage: 'user' | 'session'.  The default is 'user'.
         * success: A function to be called if the preferences are saved successfully.
         * error:  A function to be called if the preferences fail to save correctly.  The function gets passed
         * a string describing the error condition.
         *
         * @returns response from the save operation.
         */
        SDK.PreferencesResolver.prototype.save = function (prefs, options) {
            return Slipstream.reqres.request("preferences_provider:save", prefs, options);
        }

        /**
         * Fetch the set of preferences.
         *
         * @param {Object} options - An object containing a set of fetch options.  Valid options are:
         *
         * storage: 'user' | 'session'.  The default is 'user'.
         * success: A function to be called if the preferences are fetched successfully.  The function gets passed
         * the fetched preferences object.
         * error:  A function to be called if the preferences fail to fetch correctly.  The function gets passed
         * a string describing the error condition.
         *
         * @returns response from the fetch operation.
         */
        SDK.PreferencesResolver.prototype.fetch = function (options) {
            return Slipstream.reqres.request("preferences_provider:fetch", options);
        }

        /**
         * Deletes preferences.
         *
         * @param {Object} options - An object containing a set of delete options.  Valid options are:
         *
         * storage: 'user' | 'session'.  The default is 'user'.
         * success: A function to be called if the preferences are deleted successfully.
         * error:  A function to be called if the preferences fail to delete correctly.  The function gets passed
         * a string describing the error condition.
         *
         * @returns response from the delete operation.
         */
        SDK.PreferencesResolver.prototype.delete = function (options) {
            return Slipstream.reqres.request("preferences_provider:delete", options);
        }

    });

    return Slipstream.SDK.PreferencesResolver;
});