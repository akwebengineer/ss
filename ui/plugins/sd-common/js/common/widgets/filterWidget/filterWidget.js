    define(['backbone', 'widgets/search/searchWidget', './conf/filterConfig.js', "../../../../../ui-common/js/common/utils/filterUtil.js"],
        function(Backbone, SearchWidget, FilterConfigs, FilterUtil) {

	    var FilterWidget = Backbone.View.extend({

            initialize: function(options){
                var me = this;
                me.activity = options.activity;
                me.context = options.context;
                me.filterUtil = new FilterUtil()
            },

            trimValues : function(val){
                if(val){
                    if(val.charAt(0) == " " || val.charAt(val.length - 1) == " ") {
                        val = val.replace(/^\s+|\s+$/g, "");
                    }
                    if(val.charAt(0) == "," || val.charAt(val.length - 1) == ","){
                        val = val.replace(/(^,)|(,$)/g, "");
                    }
                }
                return val;
            },
            //
            getOpertor : function(filterStr){
                operIndex = filterStr.indexOf(" ") + 1;
                operator = filterStr.substring(operIndex, operIndex + filterStr.substr(operIndex).indexOf(" "));
                return operator;
            },
            //returns the selected filter criteria as an array of filter objects
            getFilters: function(){
                var filtersArr = this.filterWidget.getAllTokens(), orFilterList = [], andFilterList = [], operatorToken;
                if(filtersArr.length > 0){
                var filterArray = filtersArr, noOfFilters = filterArray.length, i, j, filterCriteria;
                    for(i = 0; i < noOfFilters; i++){
                        if(filterArray[i].indexOf(" ") != -1){
                            operator = this.getOpertor(filterArray[i]);
                        }

                        if(filterArray[i].indexOf(operator) != -1){        
                            filterStr = filterArray[i].split(" " + operator + " ");
                            key = filterStr[0];
                            key = this.trimValues(key);

                            val = filterStr[1];
                            val = this.trimValues(val);

                            if(val){
                                if(val.indexOf(",") != -1){
                                    val = val.split(",");     //multiple values
                                    for(j = 0; j < val.length; j++){
                                        val[j] = this.trimValues(val[j]);
                                    }
                                }
                            }
                            
                            if(i == 0){
                                var firstFilterCriteria = this.formFilterString(key, val, operator);
                                if(noOfFilters == 1){
                                    andFilterList.push(firstFilterCriteria);
                                }
                            } else if(i == 2){
                                if(operatorToken == "OR"){
                                    orFilterList.push(firstFilterCriteria);
                                    if(val){
                                        orFilterList.push(this.formFilterString(key, val, operator));
                                    }
                                } else {
                                    andFilterList.push(firstFilterCriteria);
                                    if(val){
                                        andFilterList.push(this.formFilterString(key, val, operator));
                                    }
                                }
                            } else {
                                if(operatorToken == "OR"){
                                    if(val){
                                        orFilterList.push(this.formFilterString(key, val, operator));
                                    }
                                } else {
                                    if(val){
                                        andFilterList.push(this.formFilterString(key, val, operator));
                                    }
                                }
                            }
                        } else {
                            operatorToken = filterArray[i];
                        }
                    }
                }
                return this.getFilterStructure([], andFilterList, orFilterList);
            },            

            //to form the required format of filter string
            formFilterString : function(key, value, operator){
                operStr = "EQUALS";
                if(operator){
                  operStr = this.getOperatorString(operator);
                }
                return {
                    "filter" : {
                      "key": key,
                      "operator": operStr,
                      "value": value
                    }
                };
            },

            getOperatorString : function(operator){
                switch(operator){
                  case '=':
                      return 'EQUALS';
                      break;
                  case '!=':
                      return 'NOT_EQUALS';
                      break;
                }
            },
            //
            replaceEquals : function(filterStr){
                var str = filterStr;
                if(filterStr.indexOf(" equals ") != -1){
                    str = filterStr.replace(" equals ", " = ");
                }
                if(filterStr.indexOf(" Equals ") != -1){
                    str = filterStr.replace(" Equals ", " = ");
                }
                if(filterStr.indexOf(" EQUALS ") != -1){
                    str = filterStr.replace(" EQUALS ", " = ");
                }
                if(filterStr.indexOf(" not_equals ") != -1){
                    str = filterStr.replace(" not_equals ", " != ");
                }
                if(filterStr.indexOf(" Not_Equals ") != -1){
                    str = filterStr.replace(" Not_Equals ", " != ");
                }
                if(filterStr.indexOf(" NOT_EQUALS ") != -1){
                    str = filterStr.replace(" NOT_EQUALS ", " != ");
                }
                return str;
            },

            // Takes filterString as parameter and populates the tokens into the Filter Bar
            addFilterTokens : function(filterString){
                var me = this, orFilterList, andFilterList, filterTokens = [], tmpTokens = [];
                andFilterList = filterString.split("AND");

                for(var i = 0; i < andFilterList.length; i++){
                    orFilterList = andFilterList[i].split("OR");
                    tmpTokens = [];
                    for(var j = 0; j < orFilterList.length; j++){
                        orFilterList[j] = this.trimValues(orFilterList[j]);
                        orFilterList[j] = this.replaceEquals(orFilterList[j]);
                        tmpTokens.push(orFilterList[j]);
                        if(j != orFilterList.length - 1){
                            tmpTokens.push("OR");
                        }
                    }
                    for(var k = 0; k < tmpTokens.length; k++){
                        tmpTokens[k] = this.trimValues(tmpTokens[k]);
                        tmpTokens[k] = this.replaceEquals(tmpTokens[k]);
                        filterTokens.push(tmpTokens[k]);
                    }
                    if(i != andFilterList.length - 1){
                        filterTokens.push("AND");
                    }
                }
                filterTokens = me.filterUtil.getLCLabels(me.context, filterTokens);
                this.filterWidget.addTokens(filterTokens);
            },

            //returns the selected filter criteria as a string
            getFilterString : function(){

                var filtersArr = this.filterWidget.getAllTokens(), filterStr = filtersArr.toString();
                    filterStr = filterStr.replace(new RegExp(",OR,", 'g'), " OR ");
                    filterStr = filterStr.replace(new RegExp(",AND,", 'g'), " AND ");
                return filterStr;
            },

            // Remove all the tokens
            removeFilters: function(){
              this.filterWidget.removeAllTokens();
            },

            //takes filter object as parameter and populates the search bar with the filters
            addFilters: function(filterObj){
                var i, filterStr, filterList = [], andFilterList = [], orFilterList = [], otherFilterList = [], ANDfiltersLen, ORfiltersLen, ANDfilters, ORfilters;

                if(filterObj.and && filterObj.and.length > 0 && filterObj.and.length <=2){
                    if(filterObj.and.length == 1){
                        ANDfilters = filterObj.and[0].and;
                        ORfilters = filterObj.and[0].or
                    } else {
                        ANDfilters = filterObj.and[0].and || filterObj.and[1].and;
                        ORfilters = filterObj.and[1].or || filterObj.and[0].or;
                    }
                } else {
                    ANDfilters = filterObj.and;
                    ORfilters = filterObj.or;
                }

                if(filterObj.and && !ANDfilters && !ORfilters && filterObj.and.length > 0){
                    ANDfilters = filterObj.and;
                }

                if(filterObj.or && !ORfilters && !ANDfilters && filterObj.or.length > 0){
                    ORfilters = filterObj.or;
                }

                if(filterObj.filter || (filterObj.and && filterObj.and[0] && filterObj.and[0].and && filterObj.and[0].filter) || (filterObj.and && filterObj.and[1] && filterObj.and[1].and && filterObj.and[1].filter)){
                    var criteria = filterObj.filter;
                    if(filterObj.and[0].and && filterObj.and[0].filter){
                        criteria = filterObj.and[0].filter;
                    }
                    if(filterObj.and[1].and && filterObj.and[1].filter){
                        criteria = filterObj.and[1].filter
                    }
                    var filter = {
                        "filter" : criteria
                    }
                    ANDfilters.push(filter);
                }

                if(ANDfilters)
                    ANDfiltersLen = ANDfilters.length;
                if(ORfilters)
                    ORfiltersLen = ORfilters.length;

                if(ANDfiltersLen){
                    for(i = 0; i < ANDfiltersLen; i++){
                        if(i != 0){
                            filterList.push("AND");
                        }
                        operator = this.getOpertorForString(ANDfilters[i].filter.operator);
                        filterStr = ANDfilters[i].filter.key + operator + ANDfilters[i].filter.value;
                        andFilterList.push(this.formFilterString(ANDfilters[i].filter.key, ANDfilters[i].filter.value, operator));
                        filterList.push(filterStr);
                    }
                }

                if(ORfiltersLen){
                    for(i = 0; i < ORfiltersLen; i++){
                        if(ORfilters[i].filter){
                            if(i != 0){
                                filterList.push("OR");
                            }
                            operator = this.getOpertorForString(ORfilters[i].filter.operator);
                            filterStr = ORfilters[i].filter.key + operator + ORfilters[i].filter.value;
                            orFilterList.push(this.formFilterString(ORfilters[i].filter.key, ORfilters[i].filter.value, operator));
                            if(filterList.length > 0 && i == 0){
                                filterList.push("OR");
                            }
                            filterList.push(filterStr);
                        }
                    }
                }
                this.filterWidget.addTokens(filterList);
            },
            //
            getOpertorForString : function(string){
                switch(string){
                  case 'EQUALS':
                      return '=';
                      break;
                  case 'NOT_EQUALS':
                      return '!=';
                      break;
                }
            },

            //returns the final filter structure as expected by the backend
            getFilterStructure: function(filterList, andFilterList, orFilterList){
                if(filterList.length > 0 && andFilterList.length > 0){
                  var len = filterList.length, i;
                  for(i = 0; i < len; i++){
                    andFilterList.push(filterList[i]);
                  }
                }

                if(filterList.length > 0 || andFilterList.length > 0 || orFilterList.length > 0){
                  if(andFilterList.length > 0){
                    if(orFilterList.length > 0){
                        var filters = {
                            "and" : [{
                                "and" : andFilterList
                            },{
                                "or" : orFilterList
                            }]
                        }
                    } else {
                        var filters = {
                            "and" : andFilterList
                        }
                    }
                  } else {
                    if(orFilterList.length > 0){
                        if(filterList.length < 1){
                            var filters = {
                                "and" : [{
                                    "or" : orFilterList
                                }]
                            }
                        } else {
                            var filters = {
                                "and" : [{
                                    "and" : filterList
                                },{
                                    "or" : orFilterList
                                }]
                            }
                        }
                    } else {
                        var filters = {
                            "and" : filterList
                        }
                    }
                  }
                }
                return filters;
            },

            render: function(){
                var me = this,
                    filterConfigs = new FilterConfigs(me.context);
                $.when(filterConfigs.getFilterList()).done(function(filterMenu){
                    me.filterWidget = new SearchWidget({
                        "container": me.$el,
                        "filterMenu": filterMenu,
                        "logicMenu": filterConfigs.getOperatorsList(),
                        "operators": ["=", "!="]
                    }).build();
                });
                return me;
            }
	    });

	return FilterWidget;
});
