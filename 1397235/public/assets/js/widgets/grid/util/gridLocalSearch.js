/**
 * A module that contains jqGrid search query
 *
 * @module gridLocalSearch
 * @author Eva Wang<iwangi@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([], /** @lends GridLocalSearch */
function () {

    /**
     * Run the local search
     * GridLocalSearch constructor
     *
     * @param {Function} getSearchTokens function from filterOptions
     * @param {Object} gridTable
     * @param {Object} conf
     * @returns {Object} Current GridLocalSearch's object: this
     */
    var GridLocalSearch = function (gridTable, conf, searchColName) {
        /**
         * Generate AND query for the local search
         * @inner
         */
        var filterConfiguration = conf.elements.filter;

        /**
         * Builds an array with the column name provided in the configuration of the grid.
         * @param {Boolean} isSearchCell - only return searchCell: true
         * @returns {Array} Array with column name
         * @inner
         */
        var getSearchCell = function(isSearchCell) {
            var columns = conf.elements.columns,
                nameArray = [];
            for (var i=0; i<columns.length; i++){
                if (!columns[i]['hidden']){
                    if (!isSearchCell){
                        nameArray.push(columns[i].name);
                    }else if (isSearchCell && columns[i]['searchCell']){
                        nameArray.push(columns[i].name);
                    }
                }
            }
            return nameArray;
        };

        /**
         * Generate the search token for local search
         * @param {Array} search tokens
         * @inner
         */
        var generateSearchData = function(tokens){
            var searchValue = [];
            for (var i = 0; i< tokens.length; i++){
                var val = tokens[i].split(' = ');
                if (val.length > 1){
                    var obj = {
                        columnName : searchColName[val[0]],
                        value: val[1].split(',')
                    };
                    searchValue.push(obj);
                }else{
                    searchValue.push(val);
                }
            }
            return searchValue;
        };

        /**
         * Create multiple rules to search the list
         * @param {String} search value - value of the search
         * @param {Array} column name- defines what columns need to be searched
         * @inner
         */
        var createMultipleRules= function(searchValue, columns){
            var rules = [];

            for (var i = 0; i<columns.length; i++){
                for (var j = 0; j<searchValue.length; j++){
                    var rule = {
                        field: columns[i],
                        op: "cn",
                        data: searchValue[j]
                    };
                    rules.push(rule);
                }
            }
            return rules;
        };

        /**
         * Generate OR query for the local search
         * @param {Array} search token returns from search widget
         * @inner
         */
        var generateOrOperatorQuery = function(gridSearchTokens){
            var rules = [],
                columns = (filterConfiguration && filterConfiguration.columnFilter) ? getSearchCell(true) : getSearchCell();
            
            for (var i = 0; i < gridSearchTokens.length; i++){
                if (_.isArray(gridSearchTokens[i])){
                    rules.push.apply(rules, createMultipleRules(gridSearchTokens[i], columns));
                }else{
                    if (gridSearchTokens[i]['value'].length > 1){
                        var column = gridSearchTokens[i]['columnName'];

                        rules.push.apply(rules, createMultipleRules(gridSearchTokens[i]['value'], [column]));
                    }else{
                        var rule = {
                            field: gridSearchTokens[i]['columnName'],
                            op: "cn",
                            data: gridSearchTokens[i]['value'][0]
                        };
                        rules.push(rule);
                    }
                    
                }
            }
            return {groupOp: "OR", rules: rules};
        };

        /**
         * Generate AND query for the local search
         * @param {Array} search token returns from search widget
         * @inner
         */
        var generateAndOperatorQuery = function(gridSearchTokens){
            var rules = [],
                groups = [],
                group,
                columns = (filterConfiguration && filterConfiguration.columnFilter) ? getSearchCell(true) : getSearchCell();

            for (var i = 0; i < gridSearchTokens.length; i++){
                if (_.isArray(gridSearchTokens[i])){
                    group = {
                        groupOp: "OR",
                        rules: createMultipleRules(gridSearchTokens[i], columns)
                    };
                    groups.push(group);
                }else{
                    if (gridSearchTokens[i]['value'].length > 1){
                        group = {
                            groupOp: "OR",
                            rules: []
                        };
                        for (var j = 0; j < gridSearchTokens[i]['value'].length; j++){
                            var column = gridSearchTokens[i]['columnName'],
                                subRule = createMultipleRules([gridSearchTokens[i]['value'][j]], [column])
                            
                            group.rules.push.apply(group.rules, subRule);
                        }
                        groups.push(group);
                    }else{
                        var rule = {
                            field: gridSearchTokens[i]['columnName'],
                            op: "cn",
                            data: gridSearchTokens[i]['value'][0]
                        };
                        rules.push(rule);
                    }
                }
            }
            return {groupOp: "AND", rules: rules, groups: groups};
        };

        /**
         * When datatype is local, grid would use jqGrid search method 
         * @param {Function} getSearchTokens function from filterOptions
         * @inner
         */
        this.runLocalSearch = function(getSearchTokens){
            var filters,
                postData = gridTable.jqGrid('getGridParam','postData'),
                gridSearchTokens = generateSearchData(getSearchTokens()),
                logicOperator = filterConfiguration.readOnlySearch && filterConfiguration.readOnlySearch.logicOperator ? filterConfiguration.readOnlySearch.logicOperator.toUpperCase(): 'AND';

            switch (logicOperator) {
                case "OR":
                    filters = generateOrOperatorQuery(gridSearchTokens);
                    break;
                case "AND":
                    filters = gridSearchTokens.length > 1? generateAndOperatorQuery(gridSearchTokens): generateOrOperatorQuery(gridSearchTokens);
                    break;
            }
            _.extend(postData, {filters: JSON.stringify(filters), search: true});
            gridTable.jqGrid('setGridParam', { postData: postData, search: true });
            gridTable.trigger("reloadGrid",[{page:1}]);
        };
    };

    return GridLocalSearch;
});