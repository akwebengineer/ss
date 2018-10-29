/**
 * Filter Manager for formatted-filterString
 *
 * @module FilterManagement
 * @author Shini <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/
define(['backbone'],
function( Backbone) {
    var FilterManager = function(){
        var me = this;

        me.parseFilter = function (filterString) {
            var andFilters = filterString.and, orFilters = filterString.or, filters = [], filterObj;

                if(filterString.filter){
                    filters.push(filterString);
                    filterObj = {
                        'or' : filters
                    }
                }

                if(andFilters){
                    for(var i = 0; i < andFilters.length; i++){
                        filters.push(andFilters[i]);
                    }
                    filterObj = {
                        'and' : filters
                    }
                }

                if(orFilters){
                    for(var i = 0; i < orFilters.length; i++){
                        filters.push(orFilters[i]);
                    }
                    filterObj = {
                        'or' : filters
                    }
                }

                return filterObj;
        };

    };
        //
        return FilterManager;
});
