/** 
 * A module that implements a mediator for interacting with a Preferences provider
 *
 * @module Slipstream/PreferencesProviderMediator
 * @author Viswesh Subramanian <vissubra@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define(["sdk/preferencesProvider"], function(PreferencesProvider) {
    Slipstream.module("PreferencesProviderMediator", /** @namespace Slipstream.PreferencesProviderMediator */ function(PreferencesProviderMediator, Slipstream, Backbone, Marionette, $, _) {
        var preferencesProvider = new PreferencesProvider();  // default provider

        function onProviderLoad(providerModule, provider) {
           var context = preferencesProvider.getContext();
           //If app provider is already loaded, don't override it with private provider.
           if(context && provider.context.ctx_root.split('/').pop()[0] == "_") { //checking to see if this is a framework / private plugin based on the directory beginning with an '_'
               return;
           }
            preferencesProvider = providerModule;
        }

        PreferencesProviderMediator.addInitializer(function() {
             /** 
              * Preferences Provider discovered event
              *
              * @event preferences_provider:discovered
              * @type {Object}
              * @property {Object} provider - The Preferences provider that's been discovered
              */
             Slipstream.vent.on("preferences_provider:discovered", function(provider) {
                /** 
                 * When the PreferencesProvider instance is provided, just use it as preferencesProvider
                 * Note: for unit test only
                 */
                 if (provider instanceof Slipstream.SDK.PreferencesProvider){
                    onProviderLoad(provider);
                 }else{
                    console.log("got preferences_provider:discovered event", JSON.stringify(provider));
                    var options = {context: provider.context, type: PreferencesProvider, onLoad: onProviderLoad};
                    Slipstream.commands.execute("provider:load", provider, options);
                 }
             });

            /**
             * Event to save a set of preferences
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
            Slipstream.reqres.setHandler("preferences_provider:save", function(prefs, options) {
               return preferencesProvider.save(prefs, options);
            });

            /**
             * Event to fetch the set of preferences.
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
            Slipstream.reqres.setHandler("preferences_provider:fetch", function(options) {
                return preferencesProvider.fetch(options);
            });

            /**
             * Event to delete preferences
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
            Slipstream.reqres.setHandler("preferences_provider:delete", function(options) {
                return preferencesProvider.delete(options);
            });

         });
    });

    return Slipstream.PreferencesProviderMediator;
});