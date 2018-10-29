/** 
 * A module that implements a Javascript
 * binding to the Slipstream preferences REST API.
 *
 * @module 
 * @name Slipstream/SDK/Preferences
 * @author Andrew Chasin <achasin@juniper.net>
 * @author Dennis Park <dpark@juniper.net> 
 * @copyright Juniper Networks, Inc. 2014
 */

define(function() {
    Slipstream.module("SDK", /** @lends Preferences */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
        // public

        /**
         * Base Preferences object
         */
        SDK.Preferences = {};

        /**
         * Store a value for a UI preference
         *
         * @param {String} path - The path to the preferences setting within the preferences
         * object.  It takes the form:
         *
         * "pathFrag1:pathFrag2:...pathFragn"
         *
         * Where pathFragn is the n-th fragment of the preference's path in the
         * preferences object.  For example the path
         *
         * "ui:nav:left:width"
         *
         * represents the path to the attribute in the preferences object representing the width of the UI's left navigation pane.  The 
         * preference will be stored at
         *
         * ui.nav.left.width
         *
         * in the user preferences object.
         *
         * @param {String} val - The new value for the preference.
         */
        SDK.Preferences.save = function(path, val) {
            Slipstream.vent.trigger("ui:preferences:change", path, val);
        }
        
        /**
         * Retrieve a user preference.
         *
         * @param {String} path - @param {String} path - The path to the preferences setting within the preferences
         * object.  It takes the form:
         *
         * @param prefs - A set of preferences into which the fetched preferences are to be merged.  This parameter is
         * optional.  If provided, this function will return the result of the merge operation.  Otherwise, the fetched preferences
         * are returned.
         *
         * "pathFrag1:pathFrag2:...pathFragn"
         *
         * Where pathFragn is the n-th fragment of the preference's path in the
         * preferences object.
         */
        SDK.Preferences.fetch = function(path, prefs) {
            var resultPrefs = Slipstream.reqres.request("ui:preferences:get", path);

            if (prefs) {  // deep merge the retrieved preferences with the provided prefs object
                resultPrefs = $.extend(true, {}, prefs, resultPrefs);
            }

            return resultPrefs;
        }
    });

    return Slipstream.SDK.Preferences;
});