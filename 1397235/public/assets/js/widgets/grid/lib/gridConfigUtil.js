/**
 * A util module that provides helper methods to facilitate the reading and writing of Grid configuration of the Grid Widget
 * The grid calls the onConfigUpdate callback when one of the following action has happened:
 * 1. The width of a column has been expanded or collapsed (event: slipstreamGrid.updateConf:columns is triggered)
 * 2. The order of the columns has been modified (event: slipstreamGrid.updateConf:columns is triggered)
 * 3. A column has been hidden or showed (event: slipstreamGrid.updateConf:columns is triggered)
 * 4. A column has been sort (event: slipstreamGrid.updateConf:sort is triggered)
 * 5. A token that filters the grid has been added or deleted (event: slipstreamGrid.updateConf:search is triggered)
 * The implementation of the onConfigUpdate callback could save the user preferences passed as a parameter of the callback.
 *
 *
 * @module GridConfigUtil
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define(['underscore', 'widgets/grid/conf/columnPreferencesTemplate'],  /** @lends GridConfigUtil */
    function(_, columnPreferencesTemplate) {
    /**
     * GridConfigUtil constructor
     *
     * @constructor
     * @class GridConfigUtil
     *
     * @returns {Object} Current GridConfigUtil's object: this
     */
    var GridConfigUtil = function(conf, gridConfigurationHelper) {
        var gridTable;

        // Help function to produce an key based index of all the object in the array of object passed in.
        var indexBy = function(arrayOfObjects, indexByKey) {
            var index = {};
            for ( var i = 0; arrayOfObjects && i < arrayOfObjects.length; i++ ) {
                var item = arrayOfObjects[i];
                var key = item[indexByKey];
                index[key] = item;
            }
            return index;
        };

        this.init = function (gridTableRef) {
            function getColumnSpec(columns, columnTemplate) {
                var columnSpecs = [];

                for (var i = 0; i < columns.length; i++) {
                    columnSpecs.push(_.pick(columns[i], columnTemplate));
                }   

                return columnSpecs; 
            }

            var configTemplate = {
                elements: {
                    columns: getColumnSpec(conf.elements.columns, columnPreferencesTemplate),
                    sorting: conf.elements.sorting
                },
                search: conf.search
            };

            gridTable = gridTableRef;

            if ((conf.onConfigUpdate && typeof(conf.onConfigUpdate) === "function") ||
                (conf.sid && typeof(conf.sid) === "string")) { 
               
                /**
                 * Persist the grid configuration
                 *
                 * @param The configuration object to be persisted
                 */
                function saveConfig(config) {
                    if (conf.onConfigUpdate) {
                        conf.onConfigUpdate(config);
                    }
                    else if (conf.sid) {
                        if (Slipstream && Slipstream.SDK && Slipstream.SDK.Preferences) {
                            Slipstream.SDK.Preferences.save(conf.sid, config);
                        }
                    }
                }

                gridTable
                    .bind("slipstreamGrid.updateConf:columns", function () {
                        var indexedColumns = indexBy(conf.elements.columns, 'name'),
                            columns = gridConfigurationHelper.getGridColumns(gridTable),
                            mergedColumns = [];

                        for (var i = 0; i < columns.length; i++) {
                            var item = columns[i],
                                origColumnConf = indexedColumns[item['name']];

                            if (origColumnConf) {
                                var col = _.extend({}, _.pick(origColumnConf, columnPreferencesTemplate), 
                                                   _.pick(columns[i], columnPreferencesTemplate));

                                mergedColumns.push(col);
                            }
                        }

                        configTemplate.elements.columns = mergedColumns;
                        saveConfig(configTemplate);
                    })
                    .bind("slipstreamGrid.updateConf:search", function (e, searchObj) {
                        configTemplate.search = searchObj["tokens"];
                        saveConfig(configTemplate);
                    })
                    .bind("slipstreamGrid.updateConf:sort", function (e, sortObj) {
                        configTemplate.elements.sorting = sortObj["config"];
                        saveConfig(configTemplate);
                    });
            }
        };

        this.destroy = function () {
            gridTable.unbind("slipstreamGrid.updateConf:columns");
            gridTable.unbind("slipstreamGrid.updateConf:search");
            gridTable.unbind("slipstreamGrid.updateConf:sort");
        };

    };

    return GridConfigUtil;
});