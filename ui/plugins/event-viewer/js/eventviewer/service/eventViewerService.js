/**
 * @module Event Viewer Service
 * @author Anupama<athreyas@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/
define(["backbone", 
      "../models/topNMonitorsCollection.js", 
      "../models/addressSearchModel.js", 
      "../../../../object-manager/js/objects/models/addressModel.js",
      '../../../../ui-common/js/common/utils/filterUtil.js'],
    function(Backbone, TopNMonitorsCollection, AddressSearchModel, AddressModel, FilterUtil){

	var EventViewerService = function(options){
		var me = this;
        me.configs = options.configs;
        me.filterUtil = new FilterUtil();
        /**
        Checks for ECM system status
        */
        me.getECMSystemStatus = function(onSuccess, onError){
            var url = "/api/juniper/ecm/log-scoop/logcollector-status";
            $.ajax({
                "url": url
            })
            .done(onSuccess)
            .fail(onError);
        };
        //
		me.fetchRawLogInfo = function(index, id, onSuccess){
			$.ajax({
            	url: '/api/juniper/ecm/log-scoop/raw-log?index=' + index + '&id=' + id,
            	method:"GET",
            	dataType:"json",
            	beforeSend:function(xhr){
                	xhr.setRequestHeader("Content-Type", "application/json");
            	},
            	complete: function(data, status){
                	onSuccess(data);
            	}
        	});
		};
        //
        me.getCSVfileName = function(postData, onSuccess) {
            $.ajax({
                url: '/api/juniper/ecm/log-scoop/csv-export',
                type: 'POST',
                data: JSON.stringify(postData),
                dataType: 'json',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Accept", "text/plain");
                    xhr.setRequestHeader("Content-Type", "application/json");
                },
                complete: function(response, status) {
                    onSuccess(response);
                }
            });
        };
        //
        me.getCSVfile = function(fileName, onSuccess, onError) {
            $.ajax({
                url: "/api/juniper/ecm/log-scoop/download-csv?file-name=" + fileName,
                type: 'GET',
                contentType : 'text/plain',
                complete: function(response, status) {
                    onSuccess(response);
                },
                error: function() {
                    onError();
                }
            });
        };
        //
        me.getAddressObject = function(ipAddress){
            var addressModel = new AddressSearchModel();
            addressModel.urlRoot = "/api/juniper/sd/address-management/addresses?filter=(addressType ne 'POLYMORPHIC')&_search=" + ipAddress;
            return addressModel.fetch();
        };
        //creates Address Object if SD address object does not exists for the ipAddress...
        //TODO check for IPV4 or IPV6
        me.createAddressObjectIfNotExists = function(ipAddress){
            var me=this,
                def = $.Deferred();
                me.resolveIPAddresses(ipAddress, function(response){
                    if(response["responseJSON"]["addresses"]["address"].length > 0){//if address object exist resolve the deferred object
                        return def.resolve(response["responseJSON"]);
                    }else{//else create an implicit address bject and then resolve the deferred object
                        var addressModel = new AddressModel({
                                                "name": ipAddress,
                                                "description": "",
                                                "address-type": "IPADDRESS",
                                                "address-version": "IPV4",
                                                "host-name": "",
                                                "ip-address": ipAddress
                                          });
                        //
                        addressModel.save(null, {
                            success:function(saveResponse){
                                var returnResponse = {
                                    "addresses":{
                                        "address":[]
                                    }
                                }
                                returnResponse["addresses"]["address"].push(saveResponse.attributes);
                                def.resolve(returnResponse);
                            },
                            error:function(errorResponse){//reject the deferred object in case of error
                                def.reject();
                            }
                        });
                    };                    
                });
            return def.promise();
        };
        //
        me.resolveIPAddresses = function(ipList, onSuccess){
            var postData = {
                "addresses-by-ips-request" : {
                    "ips" : {
                        "ip" : ipList
                    }
                }
            };
            $.ajax({
                url: '/api/juniper/sd/address-management/addresses',
                method:"POST",
                data: JSON.stringify(postData),
                dataType:"json",
                beforeSend:function(xhr){
                    xhr.setRequestHeader("Content-Type", "application/vnd.juniper.sd.addresses-by-ips-request+json;version=1;charset=UTF-8");
                    xhr.setRequestHeader("Accept", "application/vnd.juniper.sd.addresses+json;version=1;q=0.01");
                },
                complete: function(data, status){
                    onSuccess(data);
                }
            });
        };
        //
		me.fetchAggregatedData = function(postData, onSuccess){
			$.ajax({
            	url: '/api/juniper/ecm/log-scoop/aggregate',
            	method:"POST",
            	data: JSON.stringify(postData),
            	dataType:"json",
            	beforeSend:function(xhr){
                	xhr.setRequestHeader("Content-Type", "application/json");
            	},
            	complete: function(data, status){
                	onSuccess(data);
            	}
        	});
		};
        //filter.aggregation, filter.startTime, filter.endTime, filter.category - must pass as an object
        me.getTopMonitors = function(onSuccess, onError, filter){
			var me = this,
				monitorsCollection = new TopNMonitorsCollection(),
				success,
                defaultData = {
                    "request":{
                        "aggregation":"COUNT",
                        "aggregation-attributes":filter.aggregation,
                        "time-interval": me.configs.getRequestFormatTimeString(filter.startTime) + "/" + me.configs.getRequestFormatTimeString(filter.endTime),
                        "size":"5",
                        "order":"ascending",
                        "filters": {
                            "filter": {
                                "key": me.filterUtil.LC_KEY.EVENT_CATEGORY,
                                "operator": "EQUALS",
                                "value": me.configs.getCategoryFilterString(filter.category)
                            }
                        }
                    }
                },
				error;
				//
            jsonData = JSON.stringify(defaultData);
            //
            success = function(collection, response, options){
                onSuccess(collection, response, options);
            };
            //
            error = function(collection, response, options) {

                console.log('Top monitors collection is not fetched');
                onError(collection, response, options);
            };
            //
            monitorsCollection.fetch({
                data : jsonData,
                method: 'POST',
                success: success,
                error: error
            });
            //
            return me;
		};
        //filter.aggregation, filter.startTime, filter.endTime, filter.category - must pass as an object
        me.getTopURLsBlocked = function(onSuccess, onError, defaultData){
            var me = this,
                monitorsCollection = new TopNMonitorsCollection(),
                success,
                error;
                //
            jsonData = JSON.stringify(defaultData);
            //
            success = function(collection, response, options){
                onSuccess(collection, response, options);
            };
            //
            error = function(collection, response, options) {

                console.log('Top monitors collection is not fetched');
                onError(collection, response, options);
            };
            //
            monitorsCollection.fetch({
                data : jsonData,
                method: 'POST',
                success: success,
                error: error
            });
            //
            return me;
        };
        me.getBaseTimeAggregateData = function(startTimeInISO, endTimeInISO){
            return {
                    "request":
                      {
                        "aggregation":"COUNT",
                        "aggregation-attributes":"none",
                        "time-interval":startTimeInISO + "/" + endTimeInISO,
                        "size":"1",
                        "order":"ascending",
                        "slots":30
                      }
            };
        }
        //
        me.spanMultiRequestForSwimLane = function(eventCategory, filterArray, legendArray, onSuccess){
            var requests = [],
                eventCatDisplayName,
                eventCategories;
            //
            filterArray.forEach(function(filter){
                requests.push($.ajax({
                    url : '/api/juniper/ecm/log-scoop/time-aggregate',
                    type : 'POST',
                    data : JSON.stringify(filter.filter),
                    contentType : "application/json"
                }));
            });
            //
            eventCategories = {
                    "swimlane-categories":[]
            };
            //
            eventCategories['swimlane-categories'].push({
                "swimlane-category": me.configs.getEventCategoryDisplayName(eventCategory),
                "event-category-id":eventCategory,
                "time-lines":[]
            })
            //
            $.when.apply($, requests).done(function(){
                $.each(arguments, function(i, data){
                    //
                    var response = $.isArray(data) ? data[0].response : data.response;
                        timelinesObj = {
                                        "time-line":[]
                                       };
                    //
                    if(response){
                        //
                        timelinesObj["name"] = legendArray[i]['name'];
                        timelinesObj["color"] = legendArray[i]['color'];
                        timelinesObj["showLegend"] = legendArray[i]["showLegend"];
                        timelinesObj["isSuper"] = legendArray[i]["isSuper"];
                        //
                        var header = response.header.value;                  
                        //
                        if(response.header['response-code'] !== 400){
                            timelinesObj['time-line'] = [];
                            header.forEach(function(value, index){
                                timelinesObj['time-line'].push({
                                    "time": new Date(Date.parse(value.substring(0, value.indexOf("Z") + 1))),
                                    "rawTime": value,
                                    "value": response.result[index].hasOwnProperty("time-value") && response.result[index]['time-value'].length > 0 ? response.result[index]['time-value'][0]['value'] : 0
                                });
                            });
                            eventCategories['swimlane-categories'][0]['time-lines'].push(timelinesObj);
                        }
                        //
                    };
                    //
                });
                onSuccess(eventCategories);
            });
        };
        me.getSwimLaneDataForAllCategories = function(eventCategory, startTimeInISO, endTimeInISO, onSuccess){
            var categories = ["FIREWALL", "WEB-FILTERING", "VPN", "CONTENT-FILTERING", "ANTI-SPAM", "ANTI-VIRUS", "IPS"],
                swimLaneData = {
                    "swimlane-categories":[]
                };
            //
            var length = categories.length,
                i=0;

            categories.forEach(function(category, index){
                me.getSwimLaneData(category, startTimeInISO, endTimeInISO, function(data, startTime, endTime){
                    var returnedEVCat = data['swimlane-categories'][0]['event-category-id'];
                    if(returnedEVCat === "FIREWALL"){
                        swimLaneData['swimlane-categories'].splice(0, 0, data['swimlane-categories'][0]);
                    }else if(returnedEVCat === "WEB-FILTERING"){
                        swimLaneData['swimlane-categories'].splice(1, 0, data['swimlane-categories'][0]);
                    }else if(returnedEVCat === "VPN"){
                        swimLaneData['swimlane-categories'].splice(6, 0, data['swimlane-categories'][0]);
                    }else if(returnedEVCat === "CONTENT-FILTERING"){
                        swimLaneData['swimlane-categories'].splice(3, 0, data['swimlane-categories'][0]);
                    }else if(returnedEVCat === "ANTI-SPAM"){
                        swimLaneData['swimlane-categories'].splice(4, 0, data['swimlane-categories'][0]);
                    }else if(returnedEVCat === "ANTI-VIRUS"){
                        swimLaneData['swimlane-categories'].splice(5, 0, data['swimlane-categories'][0]);
                    }else if(returnedEVCat === "IPS"){
                        swimLaneData['swimlane-categories'].splice(2, 0, data['swimlane-categories'][0]);
                    }
                    //
                    i++;
                    if(i === length){
                        onSuccess(swimLaneData, startTime, endTime);
                    }
                })
            });
            //
        };
        //returns the swimlane data as per the swimlanewidget
        me.getSwimLaneData = function(eventCategory, startTimeInISO, endTimeInISO, onSuccess){
            //form requests array for $.ajax
            var requests=[],
                reqBaseData = me.getBaseTimeAggregateData(startTimeInISO, endTimeInISO),
                spanMultiRequestForSwimLaneOnSuccess;
            //
            spanMultiRequestForSwimLaneOnSuccess = function(data){
                onSuccess(data, startTimeInISO, endTimeInISO);
            };
            //
            switch (eventCategory){
                case "IPS":
                    var criticalFilter = {
                                          "and": [
                                            {
                                              "or": [
                                                {
                                                  "filter": {
                                                    "key": me.filterUtil.LC_KEY.EVENT_TYPE,
                                                    "operator": "EQUALS",
                                                    "value": "IDP_ATTACK_LOG_EVENT"
                                                  }
                                                },
                                                {
                                                  "filter": {
                                                    "key": me.filterUtil.LC_KEY.EVENT_TYPE,
                                                    "operator": "EQUALS",
                                                    "value": "IDP_ATTACK_LOG_EVENT_LS"
                                                  }
                                                }
                                              ]
                                            },
                                            {
                                              "filter": {
                                                "key": me.filterUtil.LC_KEY.THREAT_SEVERITY,
                                                "operator": "EQUALS",
                                                "value": "CRITICAL"
                                              }
                                            }
                                          ]
                                        };
                    var highFilter = {
                                          "and": [
                                            {
                                              "or": [
                                                {
                                                  "filter": {
                                                    "key": me.filterUtil.LC_KEY.EVENT_TYPE,
                                                    "operator": "EQUALS",
                                                    "value": "IDP_ATTACK_LOG_EVENT"
                                                  }
                                                },
                                                {
                                                  "filter": {
                                                    "key": me.filterUtil.LC_KEY.EVENT_TYPE,
                                                    "operator": "EQUALS",
                                                    "value": "IDP_ATTACK_LOG_EVENT_LS"
                                                  }
                                                }
                                              ]
                                            },
                                            {
                                              "filter": {
                                                "key": me.filterUtil.LC_KEY.THREAT_SEVERITY,
                                                "operator": "EQUALS",
                                                "value": "HIGH"
                                              }
                                            }
                                          ]
                                        };
                    var mediumFilter = {
                                          "and": [
                                            {
                                              "or": [
                                                {
                                                  "filter": {
                                                    "key": me.filterUtil.LC_KEY.EVENT_TYPE,
                                                    "operator": "EQUALS",
                                                    "value": "IDP_ATTACK_LOG_EVENT"
                                                  }
                                                },
                                                {
                                                  "filter": {
                                                    "key": me.filterUtil.LC_KEY.EVENT_TYPE,
                                                    "operator": "EQUALS",
                                                    "value": "IDP_ATTACK_LOG_EVENT_LS"
                                                  }
                                                }
                                              ]
                                            },
                                            {
                                              "filter": {
                                                "key": me.filterUtil.LC_KEY.THREAT_SEVERITY,
                                                "operator": "EQUALS",
                                                "value": "MEDIUM"
                                              }
                                            }
                                          ]
                                        };                    
                                        //
                    reqBaseData["request"]["filters"] = {};//add filter object to the base
                    //
                    var criticalIPSData = $.extend(true, {}, reqBaseData);//pass true for deep copy
                    var highIPSData = $.extend(true, {}, reqBaseData);
                    var mediumIPSData = $.extend(true, {}, reqBaseData);
                    //append the filter
                    criticalIPSData["request"]["filters"] = criticalFilter;
                    highIPSData["request"]["filters"] = highFilter;
                    mediumIPSData["request"]["filters"] = mediumFilter;
                    //
                    me.spanMultiRequestForSwimLane(eventCategory, [{
                        "filter": criticalIPSData
                    }, {
                        "filter": highIPSData
                    }, {
                        "filter": mediumIPSData
                    }], [{"name": "Critical", "color": me.configs.getIPSSeveritiesColorCodes()["CRITICAL"], "showLegend": true, "isSuper": true}, {"name": "High", "color": me.configs.getIPSSeveritiesColorCodes()["HIGH"], "showLegend": true, "isSuper": true}, {"name": "Medium", "color": me.configs.getIPSSeveritiesColorCodes()["MEDIUM"], "showLegend": true, "isSuper": true}], spanMultiRequestForSwimLaneOnSuccess);
                    //
                    break;


                    var filter = {
                                  "key": me.filterUtil.LC_KEY.EVENT_CATEGORY,
                                  "operator": "EQUALS",
                                  "value": "ips"//webfilter, vpn or vpn_cp, contentfilter, antispam, antivirus, ips
                                 };
                    //
                    reqBaseData["request"]["filters"] = {};//add filter object to the base
                    //
                    var allFirewallData = $.extend(true, {}, reqBaseData);//pass true for deep copy
                    //append the filter
                    allFirewallData["request"]["filters"]["filter"] = filter;
                    //
                    me.spanMultiRequestForSwimLane(eventCategory, [{
                        "filter": allFirewallData
                    }], [{"name": "All", "color": "#9FD4FE", "showLegend": true, "isSuper": true}], spanMultiRequestForSwimLaneOnSuccess);
                    //
                    break;
                case 'ANTI-VIRUS':                    
                    var filter = {
                                  "key": me.filterUtil.LC_KEY.EVENT_CATEGORY,
                                  "operator": "EQUALS",
                                  "value": "antivirus"//webfilter, vpn or vpn_cp, contentfilter, antispam, antivirus, ips
                                };
                    //
                    reqBaseData["request"]["filters"] = {};//add filter object to the base
                    //
                    var allFirewallData = $.extend(true, {}, reqBaseData);//pass true for deep copy
                    //append the filter
                    allFirewallData["request"]["filters"]["filter"] = filter;
                    //
                    me.spanMultiRequestForSwimLane(eventCategory, [{
                        "filter": allFirewallData
                    }], [{"name": "All", "color": "#9FD4FE", "showLegend": true, "isSuper": true}], spanMultiRequestForSwimLaneOnSuccess);
                    //
                    break;
                case 'ANTI-SPAM':                    
                    var filter = {
                                  "key": me.filterUtil.LC_KEY.EVENT_CATEGORY,
                                  "operator": "EQUALS",
                                  "value": "antispam"//webfilter, vpn or vpn_cp, contentfilter, antispam, antivirus, ips
                                };
                    //
                    reqBaseData["request"]["filters"] = {};//add filter object to the base
                    //
                    var allFirewallData = $.extend(true, {}, reqBaseData);//pass true for deep copy
                    //append the filter
                    allFirewallData["request"]["filters"]["filter"] = filter;
                    //
                    me.spanMultiRequestForSwimLane(eventCategory, [{
                        "filter": allFirewallData
                    }], [{"name": "All", "color": "#9FD4FE", "showLegend": true, "isSuper": true}], spanMultiRequestForSwimLaneOnSuccess);
                    //
                    break;
                case 'CONTENT-FILTERING':
                    var filter = {
                                  "key": me.filterUtil.LC_KEY.EVENT_CATEGORY,
                                  "operator": "EQUALS",
                                  "value": "contentfilter"//webfilter, vpn or vpn_cp, contentfilter, antispam, antivirus, ips
                                };
                    //
                    reqBaseData["request"]["filters"] = {};//add filter object to the base
                    //
                    var allFirewallData = $.extend(true, {}, reqBaseData);//pass true for deep copy
                    //append the filter
                    allFirewallData["request"]["filters"]["filter"] = filter;
                    //
                    me.spanMultiRequestForSwimLane(eventCategory, [{
                        "filter": allFirewallData,
                    }], [{"name": "All", "color": "#9FD4FE", "showLegend": true, "isSuper": true}], spanMultiRequestForSwimLaneOnSuccess);
                    //
                    break;
                case "VPN":
                    var filter = {      
                                    "or":[{
                                    "filter":{
                                      "key": me.filterUtil.LC_KEY.EVENT_CATEGORY,
                                      "operator": "EQUALS",
                                      "value": "vpn"
                                    }
                                  }, {
                                    "filter":{
                                      "key": me.filterUtil.LC_KEY.EVENT_CATEGORY,
                                      "operator": "EQUALS",
                                      "value": "vpn_cp"
                                    }
                                  }]
                                };
                    //
                    reqBaseData["request"]["filters"] = {};//add filter object to the base
                    //
                    var filterData = $.extend(true, {}, reqBaseData);
                    //append the filter
                    filterData["request"]["filters"] = filter;
                    //
                    me.spanMultiRequestForSwimLane(eventCategory, [{
                        "filter": filterData
                    }], [{"name": "All", "color": "#9FD4FE", "showLegend": true, "isSuper": true}], spanMultiRequestForSwimLaneOnSuccess);
                    //
                    break;
                case "WEB-FILTERING":
                    var allFilter = {
                                      "key": me.filterUtil.LC_KEY.EVENT_CATEGORY,
                                      "operator": "EQUALS",
                                      "value": "webfilter"//vpn or vpn_cp, contentfilter, antispam, antivirus, ips
                                    };
                    var blockedFilter = {      
                                            "or":[{
                                            "filter":{
                                              "key": me.filterUtil.LC_KEY.EVENT_TYPE,
                                              "operator": "EQUALS",
                                              "value": "WEBFILTER_URL_BLOCKED"
                                            }
                                          }, {
                                            "filter":{
                                              "key": me.filterUtil.LC_KEY.EVENT_TYPE,
                                              "operator": "EQUALS",
                                              "value": "WEBFILTER_URL_BLOCKED_LS"
                                            }
                                          }]
                                        };
                    //
                    reqBaseData["request"]["filters"] = {};//add filter object to the base
                    //
                    var allFirewallData = $.extend(true, {}, reqBaseData);//pass true for deep copy
                    var blockedFirewallData = $.extend(true, {}, reqBaseData);
                    //append the filter
                    allFirewallData["request"]["filters"]["filter"] = allFilter;
                    blockedFirewallData["request"]["filters"] = blockedFilter;
                    //
                    me.spanMultiRequestForSwimLane(eventCategory, [{
                        "filter": allFirewallData
                    }, {
                        "filter": blockedFirewallData
                    }], [{"name": "All", "color": "#9FD4FE", "showLegend": true, "isSuper": true}, {"name": "Blocked", "color": "#56638B", "showLegend": true, "isSuper": false}], spanMultiRequestForSwimLaneOnSuccess);
                    //
                    break;
                case "FIREWALL"://form 2 requests one for All and other for Blocked
                    var allFirewallFilter = {
                                              "key": me.filterUtil.LC_KEY.EVENT_CATEGORY,
                                              "operator": "EQUALS",
                                              "value": "firewall"//webfilter, vpn or vpn_cp, contentfilter, antispam, antivirus, ips
                                            };
                    var blockedFirewallFilter = {      
                                                    "or":[{
                                                    "filter":{
                                                      "key": me.filterUtil.LC_KEY.EVENT_TYPE,
                                                      "operator": "EQUALS",
                                                      "value": "RT_FLOW_SESSION_DENY"//WEBFILTER_URL_BLOCKED
                                                    }
                                                  }, {
                                                    "filter":{
                                                      "key": me.filterUtil.LC_KEY.EVENT_TYPE,
                                                      "operator": "EQUALS",
                                                      "value": "RT_FLOW_SESSION_DENY_LS"//WEBFILTER_URL_BLOCKED_LS
                                                    }
                                                  }]
                                                };
                    //
                    reqBaseData["request"]["filters"] = {};//add filter object to the base
                    //
                    var allFirewallData = $.extend(true, {}, reqBaseData);//pass true for deep copy
                    var blockedFirewallData = $.extend(true, {}, reqBaseData);
                    //append the filter
                    allFirewallData["request"]["filters"]["filter"] = allFirewallFilter;
                    blockedFirewallData["request"]["filters"] = blockedFirewallFilter;
                    //
                    me.spanMultiRequestForSwimLane(eventCategory, [{
                        "filter": allFirewallData
                    }, {
                        "filter": blockedFirewallData
                    }], [{"name": "All", "color": "#9FD4FE", "showLegend": true, "isSuper": true/**there can be only one super in a data set*/}, {"name": "Blocked", "color": "#56638B", "showLegend": true, "isSuper": false}], spanMultiRequestForSwimLaneOnSuccess);
                    //
                    break;
                default:
                    break;
            };
            //
        };
        me.fetchFilterData = function(id, onSuccess){
            $.ajax({
                url: '/api/juniper/seci/filter-management/filters/' + id,
                method:"GET",
                dataType:"json",
                beforeSend:function(xhr){
                    xhr.setRequestHeader("Accept", "application/vnd.juniper.seci.filter-management.event-filter+json;version=1;q=0.01");
                },
                complete: function(data, status){
                    onSuccess(data);
                }
            });
        };

       
	}
	//
	return EventViewerService;
});