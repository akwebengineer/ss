/**
 * Service for App Visiblity
 * @module AppSecureService
 * @author Dharma<adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/
define(["backbone", "../models/bubbleCollection.js", "../models/topNBarWidgetCollection.js", "../models/applicationDetailModel.js"], function(Backbone, BubbleCollection, TopNCollection, ApplicationDetailModel){
	var AppSecureService = function(){
		var me=this;
		/**
		Checks for appvisibility system status
		*/
		me.getAppVisSystemStatus = function(onSuccess, onError){
			var url = "/api/juniper/appvisibility/application-statistics/signature-status";
			$.ajax({
				"url": url
			})
			.done(onSuccess)
			.fail(onError);
		};
		//
		me.getPlatformDeviceIds = function(deviceIds, onSuccess, onError){
			var url = "/api/juniper/sd/device-management/id-map",
				jsonData = {
				  "device-id-list": {
				    "device-ids": deviceIds
				  }
				};
			$.ajax({
				"url": url,
				"type":"POST",
				"beforeSend":function(xhr){
                	xhr.setRequestHeader("Content-Type","application/vnd.juniper.sd.device-management.id-map-request+json;version=2;charset=UTF-8");
                	xhr.setRequestHeader("Accept","application/vnd.juniper.sd.device-management.id-map+json;version=2;q=0.02");					
				},
				"data": JSON.stringify(jsonData)
			})
			.done(onSuccess)
			.fail(onError);
		};
		//
		me.getApplicationDetails = function(id, onSuccess, onError){
			var appDetailModel = new ApplicationDetailModel({"id": id});
			appDetailModel.fetch({
				"success": onSuccess,
				"error": onError
			});
		};
		//returns data for an application
		me.getApplicationData = function(applicationName, startTime, endTime, deviceIds, onSuccess, onError){
			var url = "/api/juniper/appvisibility/application-statistics/application-detail?application-name=" + applicationName + "&start-time=" + startTime + "&end-time=" + endTime;
			url = url + (deviceIds !== "" ? "&device-ids=" + deviceIds : "");
			$.get(url).done(function(data){
				var users = data.response.result[0]['users'];
				if(users.length > 5){
					users.splice(5, users.length - 5);//back end does not support paging. stop gap for now	
				}
				onSuccess(data);
			}).fail(onError);
		};

		//returns data for a user
		me.getUserData = function(userName, startTime, endTime, deviceIds, onSuccess, onError){
			var url = "/api/juniper/appvisibility/application-statistics/user-detail?user-name=" + userName + "&start-time=" + startTime + "&end-time=" + endTime;
			url = url + (deviceIds !== "" ? "&device-ids=" + deviceIds : "");
			$.get(url).done(function(data){
				var applications = data.response.result[0]['applications'];
				if(applications.length > 5){
					applications.splice(5, applications.length - 5);//back end does not support paging. stop gap for now	
				}
				onSuccess(data);
			}).fail(onError);
		};
		//
		/*
		me.getPolicies = function(applicationNames, startTime, endTime,users, onSuccess, onError){
			var url = "/api/juniper/appvisibility/policy-management/get-affected-policies?application-names=" + applicationNames + "&start-time=" + startTime + "&end-time=" + endTime + "&user-names="+users;
			$.get(url).done(onSuccess).fail(onError);
		};*/
		me.getPublishDeviceList = function(uuid,policyIds,onSuccess,onFailure,scope){
			var url = "/api/juniper/sd/policy-management/firewall/provisioning/devices-for-publish?";
            url += "publish_policy_uuid=" + uuid;
            url += "&rows=50000&page=1&sidx=&sord=asc&paging=(start+eq+0%2C+limit+eq+50000)";
            var policyIdString = "";
            _.each(policyIds,function(pid){
            	policyIdString += "&policyId=" + pid;
            });
            url += policyIdString;
            $.ajax({
				"url": url,
				"type":"GET",
				"beforeSend":function(xhr){
                	xhr.setRequestHeader("Accept","application/vnd.juniper.sd.provisioning.deployment-device-list+json;version=1;q=0.01");					
				},
				context : scope
			}).done(onSuccess).fail(onFailure);
		};

		me.publishAndUpdate = function(policyIds,updateFlag,onSuccess,onFailure,scope){
			var url = "/api/juniper/sd/policy-management/firewall/provisioning/publish-policy?update=" + updateFlag;
			if(scope.scheduleAt){
				url += "&schedule=" + self.scheduleAt;
			}
			var data = {
				"publish" :{
					"policy-ids" : {
						"policy-id" : policyIds
					}
				}
			};
			$.ajax({
				"url": url,
				"type":"POST",
				"beforeSend":function(xhr){
                	xhr.setRequestHeader("Accept","application/vnd.juniper.sd.fwpolicy-provisioning.monitorable-task-instances+json;version=1;q=0.01");					
                	xhr.setRequestHeader("Content-Type","application/vnd.juniper.sd.fwpolicy-provisioning.publish+json;version=1;charset=UTF-8");					
				},
				data: JSON.stringify(data),
				context : scope
			}).done(onSuccess).fail(onFailure);
		};

		me.savePolicies = function(callback,data,scope) {
			var saveRequest = {
				'save-policies-request':{
					'app-access-policies' : {
						'app-access-policy-details' : data
					}
				}
			};
            $.ajax({
           		url: '/api/juniper/sd/policy-management/block-action/save-policies',
                type: 'post',
                processData: false,
                data: JSON.stringify(saveRequest),
                headers:{
                    'accept': 'application/vnd.juniper.sd.policy-management.block-action.save-policies-response+json;version=2;q=0.02',
                    'content-type' : "application/vnd.juniper.sd.policy-management.block-action.save-policies-request+json;version=2;charset=UTF-8"
                }, 
                success: callback,
                failure : callback,
                context : scope
            });
        },

        me.comparePolicy = function(callback,data,scope,screenId,ignoreUnchangedRules) {
        	var compareRequest = {
				'compare-policy-changes-request':{
					'app-access-policy-details' : data,
					'screen-id' : screenId,
					"ignore-unchanged-rules":ignoreUnchangedRules
				}
			};
        	$.ajax({
           		url: '/api/juniper/sd/policy-management/block-action/compare-policy-changes',
                type: 'post',
                headers:{
                    'accept': 'application/vnd.juniper.sd.policy-management.block-action.compare-policy-changes-response+json;version=2;q=0.02',
                    'content-type' : "application/vnd.juniper.sd.policy-management.block-action.compare-policy-changes-request+json;version=2;charset=UTF-8"
                }, 
                processData: false,
                data: JSON.stringify(compareRequest),
                success: callback,
                failure : callback,
                context : scope
            });
        },
		//
		//calls the rest api and returns a jquery promise
		me.getBubbleData = function(url, onSuccess, onError){
			var me = this,
				success,
				error,
				bubbleCollection = new BubbleCollection();
			//
			bubbleCollection.url = bubbleCollection.url + url;//bubbleCollection.url + "/application" + me.configs.getSelectedGroupBy(filters.groupBy)['url'];
			//bubbleCollection.url = //bubbleCollection.url + "?start-time=" + filters.time.startTime + "&end-time=" + filters.time.endTime;
			//
			success = function(collection, response, options){
				onSuccess(collection, response, options);
			};
			//
            error = function(collection, response, options) {
                console.log('app secure bubble collection not fetched');
                onError(collection, response, options);
            };
            // /
			bubbleCollection.fetch({
				success: success,
				error: error
			});
			//
			return me;
		};
		//
		me.getTopNData = function(url, onSuccess, onError){
			var me=this,
				topNCollection = new TopNCollection(),
				success,
				error;
				//
				topNCollection.url = topNCollection.url + url;
				success = function(collection, response, options){
					//In case of risks sort by sortIndex
					if(url.indexOf("risk") > -1){
						collection.each(function(item){
							var name = item.get("name") || "UNKNOWN";
							switch (name.toLowerCase()){
								case "critical":
									item.attributes.sortIndex = 4;
									break;
								case "high":
									item.attributes.sortIndex = 3;
									break;
								case "unsafe":
									item.attributes.sortIndex = 2;
									break;
								case "moderate":
									item.attributes.sortIndex = 1;
									break;
								case "low":
									item.attributes.sortIndex = 0;
									break;
								default:
									item.attributes.sortIndex = 0;
									break;
							}
						});
						topNCollection.comparator = function(collection){
							return -collection.get("sortIndex");
						};
						//
						topNCollection.sort();
					}
					//
					onSuccess(collection, response, options);
				};
				//
	            error = function(collection, response, options) {
	                console.log('top N collection not fetched');
	                onError(collection, response, options);
	            };
	            //
				topNCollection.fetch({
					success: success,
					error: error
				});
				//
				return me;
		};
		//
		//
	}
	//
	return AppSecureService;
});