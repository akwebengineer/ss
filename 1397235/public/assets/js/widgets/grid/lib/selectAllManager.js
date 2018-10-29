/**
 * A module that manages a hashtable with all rows ids in a grid
 *
 * @module SelectAllManager
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([],  /** @lends SelectAllManager */
    function() {

    /**
     * SelectAllManager constructor
     *
     * @constructor
     * @class SelectAllManager - Reformats the grid json data.
     *
     * @returns {Object} Current SelectAllManager's object: this
     */
    var SelectAllManager = function(){

        /**
         * Builds the SelectAllManager
         * @returns {Object} Current "this" of the class
         */

        var allRowIdsHash = {},
            showSelectAllOverlayRowNum = 99999,
            isAllRowIdsSet = true;

        var setRowIdsHash = function (idsArray) {
            var rowIdsHash = {};
            idsArray.forEach( function (id) {
                rowIdsHash[id] = true; //row is selected by default
            });
            return rowIdsHash;
        };

        /**
         * Sets all the row ids of the grid by using a defer promise which allows to sync the response of a callback with all the row ids
         * @param {Object} callback that will be used to retrieve all the row ids
         * @param {Object} grid parameters applied to the current grid request
         * @param {Object} callback after getAllRowIds is done
         * @inner
         */
        this.setAllRowIds = function(getAllRowIds, tokens, gridParameters, getAllRowIdsDone) {
            if (typeof(getAllRowIds) == "function") {
                allRowIdsHash = {};
                isAllRowIdsSet = false;
                var getAllRowIdsPromise = function() {
                    var deferred = $.Deferred();
                    if (typeof(getAllRowIds)==='function') {
                        getAllRowIds(
                            function (allRowIds) {
                                deferred.resolve(allRowIds);
                            },
                            function (errorMessage) {
                                deferred.reject(errorMessage);
                            },
                            tokens,
                            gridParameters
                        );
                    }
                    return deferred.promise();
                };
                var promise = getAllRowIdsPromise();
                $.when(promise)
                    .done(function(allRowIds) {
                        allRowIdsHash = setRowIdsHash(allRowIds);
                        isAllRowIdsSet = true;
                        getAllRowIdsDone && getAllRowIdsDone(allRowIdsHash);
                        console.log(allRowIdsHash);
                    })
                    .fail(function(errorMessage) {
                        console.log(errorMessage);
                    });

            } else {
                allRowIdsHash =  setRowIdsHash(getAllRowIds);
            }
        };

        this.isAllRowIdsSet = function (){
            return isAllRowIdsSet;
        };

        this.extendRowIds = function(rowIds) {
            var extendedRowIdsHash =  setRowIdsHash(rowIds);
            allRowIdsHash = _.extend(allRowIdsHash, extendedRowIdsHash);
            console.log(allRowIdsHash);
        };

        /**
         * Provides all row ids available in the allRowIdsHash minus the row ids that are unselected
         * @param {unselectedRowIdsHash} unselectedRowIdsHash - hash with all unselected ids
         * @param {boolean} isHash - if set to true the function returns all selected ids in a hash data structure
         * @returns {Array} All selected ids
         */
        this.getAllRowIds = function(unselectedRowIdsHash, isHash) {
            var allRowIdsHashCopy = _.extend({}, allRowIdsHash);
            for (var unselectedId in unselectedRowIdsHash){
                delete allRowIdsHashCopy[unselectedId];
            }
            if (isHash)
                return allRowIdsHashCopy;

            return Object.keys(allRowIdsHashCopy);
        };

        /**
         * Show selectAll spinner and mask or overlay confirmation
         * @param {gridContainer} 
         * @param {Function} setAllRow: select all rows and submit API
         * @param {Function} unselectAll: unselect all rows 
         * @param {Function} updateSelectStatus: update the action status
         * @param {Integer} records: the current grid records
         * @param {Object} confirmationDialogBuilder
         * @param {Object} gridSpinner
         */
        this.showSelectAllMask = function(gridContainer, setAllRow, unselectAll, updateSelectStatus, records, confirmationDialogBuilder, gridSpinner){
            var selectAllOverlay;
            
            if (records > showSelectAllOverlayRowNum){
                selectAllOverlay = confirmationDialogBuilder.showSelectAllMsg(records, setAllRow, unselectAll, updateSelectStatus);
            }else{
                gridSpinner && gridSpinner.showSpinner(gridContainer, true);
                setAllRow();
            }
            return selectAllOverlay;
        };

        /**
         * Hide selectAll spinner and mask or overlay confirmation
         * @param {Object} selectAllOverlay: confirmation overlay object
         * @param {Integer} records: the current grid records
         * @param {Object} gridSpinner
         */
        this.hideSelectAllMask = function(selectAllOverlay, records, gridSpinner){            
            if (records > showSelectAllOverlayRowNum && selectAllOverlay){
                selectAllOverlay.destroy();
            }else{
                gridSpinner && gridSpinner.hideSpinner(true);
            }
        };

        /**
         * Reset allRowIdsHash method
         */
        this.resetAllRowIdsHash = function(){
            allRowIdsHash = {};
        }
    };

    return SelectAllManager;
});