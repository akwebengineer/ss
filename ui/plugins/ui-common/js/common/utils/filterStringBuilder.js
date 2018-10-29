/**
 * Filter String Manager for formatted-filterString
 *
 * @module FilterManagement
 * @author Shini <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/
define(['backbone', 'jquery', './aggregationBuilder.js'],
function( Backbone, $, AggregationBuilder){

	var FilterStringBuilder = function(){
        var me = this,
            aggregationBuilder = new AggregationBuilder(),
            availableOperators = {"equals": "EQUALS"};

        me.parseFilter = function (filterString) {
            var me = this,
                tempFilterStr = filterString,
                operatorStr = "", arrFilterStr,
                arrOperatorStr, arrValues = [],
                jsonDataObj = {};

            if(filterString != null) {
                for(var i =0; i < filterString.length;i++)
                {
                    if(filterString.substr(i,4)==" OR ") {
                        operatorStr = operatorStr + "|" + "OR";
                    } else if(filterString.substr(i,5)==" AND ") {
                        operatorStr = operatorStr + "|" + "AND";
                    }
                }
                if(operatorStr.length > 0)
                {
                    tempFilterStr = tempFilterStr.replace(/ OR /g, " | ");
                    tempFilterStr = tempFilterStr.replace(/ AND /g, " | ");
                    arrFilterStr = tempFilterStr.split("|");
                    arrOperatorStr = operatorStr.split("|");

                    var matchOrPos,  arrMatchOrPos = [], matchAndPos, arrMatchAndPos = [];
                    for(var i=0;i<arrOperatorStr.length; i++)
                    {
                        // Finding the position of OR
                        if(arrOperatorStr[i].match(/OR/)) {
                            matchOrPos = i;
                            arrMatchOrPos.push(matchOrPos);
                        }
                        // Finding the position of AND
                        if(arrOperatorStr[i].match(/AND/)) {
                            matchAndPos = i;
                            arrMatchAndPos.push(matchAndPos);
                        }
                    }
                    // Generating JSON Object
                    jsonDataObj = {
                        "and" : [
                        ]

                    };
                    //
                    if(arrMatchOrPos.length > 0) {
                        var filter = [];
                        for(var i = 0;i <= arrMatchOrPos.length; i++)
                        {
                            var m = arrMatchOrPos[i], n = m - 1;
                            arrValues = arrFilterStr[n].trim().split(" ");
                            arrValuess = arrFilterStr[m].trim().split(" ");
                            jsonDataObj.and.push({"or":[me.formatFilter(arrValues), me.formatFilter(arrValues)]});
                        }
                    }
                    //
                    if(arrMatchAndPos.length > 0) {
                        var filter = [];
                        for(var i = 0;i <= arrMatchAndPos.length; i++)
                        {
                            //arrValues = arrFilterStr[arrMatchAndPos[i]].trim().split(" ");
                            arrValues = arrFilterStr[i].trim().split(" ");
                            jsonDataObj.and.push(me.formatFilter(arrValues));
                        }
                        //console.log(jsonDataObj);
                    }
                } //
                else
                {
                    if(typeof (filterString.trim) == "function"){
                    arrValues = filterString.trim().split(" ");
                    var value = me.formatValue(arrValues[2]);
                    jsonDataObj = {
                        "filter": {
                            "key" : aggregationBuilder.mapAggregation(arrValues[0]),
                            "operator": availableOperators[arrValues[1]],
                            "value" : value
                        }

                    };
                }
                }
                console.log(jsonDataObj)
                return jsonDataObj;
            }
        };
        //
        me.formatFilter = function (arrValues) {

            var filterObj = {},
                value = me.formatValue(arrValues[2]);

            filterObj = {
                "filter": {
                    "key" : aggregationBuilder.mapAggregation(arrValues[0]),
                    "operator": availableOperators[arrValues[1]],
                    "value" : value
                }
            };
            return filterObj;

        };

        me.formatValue = function (arrValues) {
            var value;

            if(arrValues != "" || (typeof(arrValues) !== 'undefined')) {
                matchPos = arrValues.search(/,/);
                if(matchPos != -1) {
                    values = arrValues.split(",");
                    value = [values[0], values[1]];
                } else {
                    value = [arrValues];
                }
            }

            return value;
        };
        //
        me.jsonString = function (jsonDataObj) {
            var jsonString = JSON.stringify(jsonDataObj);
            console.log(jsonString)
            return jsonString;
        };
    };
    //
    return FilterStringBuilder;
 });