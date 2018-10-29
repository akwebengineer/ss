/**
 * A module that reconciles a provided grid configuration
 * with a configuration stored in user preferences.
 *
 * @module PreferencesReconciler
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define(/* @lends PreferencesReconciler */ function() {
    var PreferencesReconciler = function(conf) {
        var finalConfig = conf;

        /**
         * Reconcile the stored preferences with the initial preferences config.  If a sid has been supplied in the
         * configuration provided to the widget constructor, then any stored
         * configuration will be fetched and merged into the provided configuration object.
         *
         * Additionally, if the configuration object contains preferences that need to be overridden, the returned object
         * replaces the retrieved preference with the corresponding value from the original configuration.
         * @returns A configuration object that can be used to configure the grid widget.
         */
        this.reconcilePreferences = function() {
            if (conf.sid && !conf.onConfigUpdate) {
                if (Slipstream && Slipstream.SDK && Slipstream.SDK.Preferences) {
                    // fetch the stored preferences and merge with the supplied conf
                    var retrievedConf = Slipstream.SDK.Preferences.fetch(conf.sid);

                    if (retrievedConf) {
                        // clone the original configuration so we don't modify the client's version
                        var clonedOriginalConf = $.extend(true, {}, conf),
                            runColumnReconciliation = true,                            
                            overriddenFinalPref = {},
                            reconciledColumnFinalPref = {};

                        /**
                         * Function that loops through preferences that need to be overridden and replaces the retrieved preferences with
                         * the ones in the original configuration
                         * @param {object} originalConf - Original configuration object used by the grid
                         * @param {object} retrievedConf  - Stored preferences object retrieved for the grid 
                         * @returns - Object that contains preferences after overriding
                         * @inner
                         */
                        function overridePrefWithOriginal(originalConf, retrievedConf){                            
                            var updatedPreferenceConf = {},
                                overriddenPref = originalConf.preferences.override,
                                currentOverriddenPrefPath = null;
                            
                            /**
                             * Function that traverses the provided object down to the last part of the provided object path and returns the 
                             * value of it
                             * @param {object} obj - The object that will be traversed until the provided path is reached
                             * @param {string} path - String representation of object path that contains the depth to which the provided "obj" needs to be traversed
                             * @returns object that is found in the deepest level of the provided path, in the provided object
                             * @inner
                             */
                            function findInPath(obj, path){
                                var pathArr = path.split('.');                            
                                for (var i = 0; i < pathArr.length; i++){
                                    obj = obj[pathArr[i]];
                                };
                                return obj;                            
                            }

                            /**
                             * Function that traverses the provided path down to the last part and sets the provided "obj" as its value                         
                             * @param {object} src - The object that will be set in the deepest level of the provided path
                             * @param {object} target - The object that will be the final result contaning the depth as mentioned in path and contains src at its deepest level
                             * @param {string} path - String representation of object path that contains the depth at which the provided "obj" needs to be set
                             * @returns a nested object that corelates to the provided path and contains the provided obj in its deepest level
                             * @inner
                             */                        
                            function setInTarget(src, target, path){
                                var tempObj = target, 
                                    pathArr = path.split('.');
                                    
                                for (var i = 0; i < pathArr.length; i++) {
                                    if ( i == pathArr.length - 1) {
                                        tempObj = tempObj[pathArr[i]] = src;
                                    }
                                    else {
                                        tempObj = tempObj[pathArr[i]] = {};
                                    }
                                }
                                return target;                            
                            }                              

                            // loop through overriddenPref and replace retrievedConf with its corresponding originalConf
                            for (var i = 0; i < overriddenPref.length; i++) {
                                currentOverriddenPrefPath = overriddenPref[i];
                                // Check if the stored preference (retrievedConf) contains data for the current overridden property
                                var retrievedObjVal = findInPath(retrievedConf, currentOverriddenPrefPath);
                                // If the stored preference (retrievedConf) contians data for the current overridden property,
                                // update it with the corresponding value from the original config provided to the grid (originalConf)                            
                                if (retrievedObjVal){
                                    var originalConfObjVal = findInPath(originalConf, currentOverriddenPrefPath) || null;
                                    var originalConfNestedObj = setInTarget(originalConfObjVal, {}, currentOverriddenPrefPath);
                                    updatedPreferenceConf = $.extend(retrievedConf, originalConfNestedObj);
                                }
                            }                            
                            return updatedPreferenceConf;
                        }                      

                        /**
                         * Function that merges column preferences between the original configuration and the ones form saved preferences                         
                         * @param {object} originalConf - Original configuration object used by the grid
                         * @param {object} retrievedConf  - Stored preferences object retrieved for the grid 
                         * @returns - Object that contains the configuration object with merged column configuration
                         * @inner
                         */
                        function reconcileColumnPreferences(originalConf, retrievedConf) {

                            var reconciledColumnPref = {},
                                columnConfigChanged = false;

                            function getColumnHashByName(columns) {
                                var columnHash = {};
                
                                columns.forEach(function(column) {
                                    columnHash[column.name] = column;
                                });
                
                                return columnHash;
                            }

                            var columnHash = getColumnHashByName(originalConf.elements.columns);

                            /*
                            * Merge the retrieved columns with the equivalent columns in the original configuration
                            * and use the result as the new column set.
                            */
                            var mergedColumns = [];

                            for (var i = 0; i < retrievedConf.elements.columns.length; i++) {
                                var column = retrievedConf.elements.columns[i];
                                if (columnHash[column.name]) { // only include columns from the preferences store that are in the columm config
                                    var mergedColumn = $.extend(true, {}, columnHash[column.name], column);
                                    mergedColumns.push(mergedColumn);
                                    columnHash[column.name]._merged = true;
                                }
                                else {
                                    columnConfigChanged = true;
                                }
                            }

                            // Now include columns from the config that haven't yet been merged with the columns in the preferences store
                            for (var j = 0; j < originalConf.elements.columns.length; j++) {
                                var column = originalConf.elements.columns[j];

                                if (!column._merged) {
                                    mergedColumns.push(column);
                                    columnConfigChanged = true;
                                }
                            }

                            retrievedConf.elements.columns = mergedColumns;

                            // Remove the original columns so they will be replaced with the new merged columns                            
                            delete originalConf.elements.columns;

                            reconciledColumnPref = $.extend(true, originalConf, retrievedConf);
                            reconciledColumnPref._configRestored = true; // flag the config as having been restored
                            reconciledColumnPref._columnConfigChanged = columnConfigChanged;                        

                            return reconciledColumnPref;
                            
                        }

                        if (clonedOriginalConf.preferences && clonedOriginalConf.preferences.override) {
                            overriddenFinalPref = overridePrefWithOriginal(clonedOriginalConf, retrievedConf);                        
                            // While reconciling preferences, elements.columns needs merging of columns between originalConf and retrievedConf which
                            // needs to be done ONLY when elements.columns is not expected to be overridden.
                            // So, if conf.preferences.override contains "elements.columns", setting runColumnReconciliation = false
                            // skips reconciling column preferences                            
                            if (clonedOriginalConf.preferences.override.indexOf("elements.columns") >= 0) {
                                runColumnReconciliation = false;
                            }
                        }

                        // Reconcile column preferences ONLY if conf.preferences.override does not contain "elements.columns"
                        if(runColumnReconciliation){
                            reconciledColumnFinalPref = reconcileColumnPreferences(clonedOriginalConf, retrievedConf);
                        }

                        // Perform the final merge of the original and saved config objects                            
                        finalConfig = $.extend(true, clonedOriginalConf, reconciledColumnFinalPref, overriddenFinalPref);
                    }
                }
            }

            return finalConfig;
        };

        /**
         * Persist the reconciled preferences to the preferences store if the restored column configuration
         * has changed as a result of the reconciliation process.
         *
         * @param {Object} gridTableRef - A reference to the grid table.  This will be used as the trigger point
         * for configuration update events.
         */
        this.persistReconciledPreferences = function(gridTableRef) {
            if (finalConfig._configRestored && finalConfig._columnConfigChanged) { // The stored column configuration was modified during config restore
                gridTableRef.trigger("slipstreamGrid.updateConf:columns");
            }
        }
    }

    return PreferencesReconciler;
});