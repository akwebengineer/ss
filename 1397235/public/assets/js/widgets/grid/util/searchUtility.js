/**
 * A module contains the utility method
 *
 * @module searchUtility
 * @author Vidushi Gupta<vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define([], /** @lends SearchUtility */
function () {

    /**
     * SearchUtility constructor
     *
     * @returns {Object} Current SearchUtility's object: this
     */
    var SearchUtility = function (conf) {

        var filterMenuHash;
        
        var initialize = function(){
            createAdvanceSearchFilterMenuHash();
        };
        
        /**
         * Create a hash from advance search filterMenu, making 'label' as the key to object
         */
        var createAdvanceSearchFilterMenuHash = function () {
            if (conf.filter && conf.filter.advancedSearch) {
                var filterMenu = conf.filter.advancedSearch.filterMenu;
                filterMenuHash = {};
                for (var configKey in filterMenu) {
                    filterMenuHash[filterMenu[configKey].label] = configKey;
                }
            }
            return filterMenuHash;
        };
        
        this.getAdvanceSearchFilterMenuHash = function(){
            return filterMenuHash;
        };
        
        initialize();
    };

    return SearchUtility;
});