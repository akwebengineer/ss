/**
 * A module that loads data from API and build grid widget after API is done
 *
 * @module DataLoader
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([],  /** @lends DataLoader */
    function(conf) {

    /**
     * DataLoader constructor
     *
     * @constructor
     * @class DataLoader
     *
     * @returns {Object} Current DataLoader's object: this
     */
    var DataLoader = function(conf){
        /**
         * Initialize load data
         * @param {Object} gridConfiguration - configuration of the grid
         * @param {boolean} isSelectedPanel - if this is the panel2
         * @param {Function} buildGridFunc - buildGrid function from createGrid
         */
        this.init = function (gridConfiguration, isSelectedPanel, buildGrid){
            if (isSelectedPanel){
                if (gridConfiguration.selectedElements && gridConfiguration.selectedElements.url){
                    loadData(gridConfiguration, isSelectedPanel, buildGrid);
                }else{
                    gridConfiguration.selectedElements = {
                        data: []
                    };
                    buildGrid(gridConfiguration);
                }
            }else{
                if (gridConfiguration.availableElements && gridConfiguration.availableElements.url){
                    loadData(gridConfiguration, isSelectedPanel, buildGrid);
                }else{
                    gridConfiguration.availableElements = {
                        data: []
                    };
                    buildGrid(gridConfiguration);
                }
            }

        };

        /**
         * Retrieve child data from the data object in order to pass to configuration
         * @param {Object} data
         * @param {boolean} isSelectedPanel - if this is the panel2
         * @inner
         */
        var formatData = function(data, isSelectedPanel){
            var originalData = data,
                gridConfiguration = conf.elements,
                jsonRoot = (isSelectedPanel)?gridConfiguration.selectedElements.jsonRoot:gridConfiguration.availableElements.jsonRoot;

            if (jsonRoot.indexOf('.')>0){
                var nestedIndex = jsonRoot.split('.'),
                    initialData = data[nestedIndex[0]];

                for (var j=1; j<nestedIndex.length; j++){
                    initialData = initialData[nestedIndex[j]];
                    //means the index reaches to the end, then we should return the data
                    if (j === nestedIndex.length-1){
                        originalData = $.isArray(initialData)? initialData : [initialData];
                    }
                }
            } else {
                originalData = data[jsonRoot];
            }
            return originalData
        };

        /**
         * Load data from API and build grid widget after API is done
         * @param {Object} gridConfiguration - configuration of the grid
         * @param {boolean} isSelectedPanel - if this is the panel2
         * @param {Function} buildGridFunc - buildGrid function from createGrid
         * @inner
         */
        var loadData = function(gridConfiguration, isSelectedPanel, buildGridFunc){
            var ajaxOptions = gridConfiguration.ajaxOptions || {},
                gridParam = {},
                numberOfRows = gridConfiguration.pageSize? gridConfiguration.pageSize : 50,
                pagingParameter = "(start eq 0, limit eq " + numberOfRows +")",
                url = isSelectedPanel? gridConfiguration.selectedElements.url: gridConfiguration.availableElements.url;

            _.extend(gridParam, {page: 1, paging: pagingParameter, rows: numberOfRows});

            $.ajax($.extend({
                type: 'GET',
                url: url,
                data: $.param(gridParam),
                dataType: 'json',
                headers: gridConfiguration.ajaxOptions && gridConfiguration.ajaxOptions.headers,
                success: function(data) {
                    var formattedData = formatData(data, isSelectedPanel);
                    if (isSelectedPanel){
                        delete gridConfiguration.selectedElements.url;
                        delete gridConfiguration.selectedElements.jsonRoot;
                        delete gridConfiguration.selectedElements.totalRecords;
                        gridConfiguration.selectedElements.data = formattedData;
                    }else{
                        delete gridConfiguration.availableElements.url;
                        delete gridConfiguration.availableElements.jsonRoot;
                        delete gridConfiguration.availableElements.totalRecords;
                        gridConfiguration.availableElements.data = formattedData;
                    }
                    buildGridFunc(gridConfiguration);
                },
                error: function(xhr, ajaxOptions, thrownError){
                    console.log("An error occurred while requesting the data. Details:" + xhr.responseText);
                }
            },ajaxOptions));
        };
    };

    return DataLoader;
});
