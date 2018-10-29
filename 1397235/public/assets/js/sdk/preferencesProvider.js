/** 
 * The PreferencesProvider module defines the interface between a preference provider and the
 * Slipstream framework.
 * 
 * @module 
 * @name Slipstream/SDK/PreferencesProvider
 * @author Viswesh Subramanian <vissubra@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define(['sdk/baseActivity'], function(BaseActivity) {
    Slipstream.module("SDK", /** @lends PreferencesProvider */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
        // private 

        // public

        /**
         * Construct a PreferencesProvider
         *
         * @constructor
         * @class PreferencesProvider
         * @classdesc Represents a Slipstream PreferencesProvider
         */
        SDK.PreferencesProvider = function() {
            BaseActivity.call(this);
        };

        SDK.PreferencesProvider.prototype = Object.create(BaseActivity.prototype);
        SDK.PreferencesProvider.prototype.constructor = SDK.PreferencesProvider;

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
         */
        SDK.PreferencesProvider.prototype.save = function (prefs, options) {};

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
         */
        SDK.PreferencesProvider.prototype.fetch = function (options) {};

        /**
         * Deletes preferences.
         *
         * @param {Object} options - An object containing a set of delete options.  Valid options are:
         *
         * storage: 'user' | 'session'.  The default is 'user'.
         * success: A function to be called if the preferences are deleted successfully.
         * error:  A function to be called if the preferences fail to delete correctly.  The function gets passed
         * a string describing the error condition.
         */
        SDK.PreferencesProvider.prototype.delete = function (options) {};

    });

    return Slipstream.SDK.PreferencesProvider;
});