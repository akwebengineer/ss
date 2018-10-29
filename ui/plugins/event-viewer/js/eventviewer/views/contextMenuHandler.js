

/**
 *  A handler for EV right-click Context Menu options
 *  
 *  @module EventViewer
 *  @author athreyas<athreyas@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define(['widgets/overlay/overlayWidget', './showEventDetailsView.js', './showRawLogView.js'
], function (overlayWidget, showEventDetails, showRawLogs) {

    var ContextMenuFunctions = function(context) {

    	this.showEventDetailsFn = function(){
	        console.log("Show event details is selected");
	        var me = this, selectedRow = this.evGrid.getSelectedRows()[0],
	          eventDetailView = new showEventDetails({context:this.context, data:selectedRow}),
	          conf = {
	            view: eventDetailView,
	            cancelButton: false,
	            okButton: true,
	            showScrollbar: true,
	            type: 'large'
	          }; 
	        me.overLay = new overlayWidget(conf);
	        me.overLay.build();
	        if(!me.overLay.getOverlayContainer().hasClass("event-viewer")){
	            me.overLay.getOverlayContainer().addClass("event-viewer");
	        }
	    };

	    this.showRawLogsFn = function(){
            console.log("Show raw logs is selected");
            var me = this, selectedRow = this.evGrid.getSelectedRows()[0], selectedId = selectedRow.id, selectedIndex = selectedRow.index;
            var onSuccess = function(data){
              console.log(data);
              var result = data.responseJSON.response.result[0];
              if(result.length != 0){
                var showRawLogView = new showRawLogs({context:me.context, message:result.message}),
                conf = {
                  view: showRawLogView,
                  cancelButton: false,
                  okButton: true,
                  showScrollbar: true,
                  type: 'small'
                }; 
                overLay = new overlayWidget(conf);
                overLay.build();
              }
            };
            if(selectedRow["payload"].length > 0){
                $.proxy(onSuccess({
                    "responseJSON":{
                        "response":{
                            result:[{
                                "message": selectedRow["payload"]
                            }]
                        }
                    }
                }), me);
            }else{
                this.service.fetchRawLogInfo(selectedIndex, selectedId, onSuccess);
            };       
	    };

	    this.showExactMatchFn = function(){
	        console.log("Show exact match is selected");
	        var me = this, selectedRow = this.evGrid.getSelectedRows()[0],
	         	timeString = this.configs.postData['request']['time-interval'];

            me.model.set("filterList", []);
            me.model.set("andFilterList", []);
            me.model.set("orFilterList", []);

	        $.each(selectedRow, function(key, value) {
	          	if(key == "syslog-hostname")
	            	me.model.get("filterList").push(me.configs.formFilterString(key, value));
	          	if(key != "src-country-code2" && key != "dst-country-code2" && key != "timestamp" && key != "id" && key != "index" && key != "event-name-desc" && value != "" && key.indexOf("-hostname") == -1)
	            	me.model.get("filterList").push(me.configs.formFilterString(key, value));
            });

            me.model.save();
	    };

        this.filterOnCellDataFn = function(e, selectedRows){
            console.log("Filter on cell data is selected");
            var me = this;
            colName = selectedRows.cellColumn.name;
            cellVal = selectedRows.$rowAndTable[0].rawRow[selectedRows.cellColumn.name];
            
            /*if(me.evGrid.getSearchWidgetInstance().getAllTokens().length > 0){
                me.evGrid.getSearchWidgetInstance().addTokens(['AND', colName + ' = ' + cellVal]);
            } else {
                 me.evGrid.getSearchWidgetInstance().addTokens([colName + ' = ' + cellVal]);
            }*/

            me.model.get("andFilterList").push(me.configs.formFilterString(colName, cellVal, "="));
            me.model.save();
        };

        this.excludeCellDataFn = function(e, selectedRows){
            console.log("Exclude cell data is selected");
            var me = this;
            colName = selectedRows.cellColumn.name;
            cellVal = selectedRows.$rowAndTable[0].rawRow[selectedRows.cellColumn.name];
            
            /*if(me.evGrid.getSearchWidgetInstance().getAllTokens().length > 0){
                me.evGrid.getSearchWidgetInstance().addTokens(['AND', colName + ' != ' + cellVal]);
            } else {
                 me.evGrid.getSearchWidgetInstance().addTokens([colName + ' != ' + cellVal]);
            }*/

            me.model.get("andFilterList").push(me.configs.formFilterString(colName, cellVal, "!="));
            me.model.save();
        };

	    this.isGlobalRule = function (ruleName) {
	      	if (ruleName.indexOf("(") !== -1) {
        		ruleName = ruleName.substring(0, ruleName.indexOf("("));
      		}
      		return ruleName;
	    };

	    this.getDevice = function(deviceId, lsysName, onSuccess, onError) {
            $.ajax({
                url: '/api/juniper/sd/device-management/devices/device-from-logical-device/' + deviceId,
                headers: {
                    'Accept': 'application/vnd.juniper.sd.get-device-from-logical-device-id+json;version=1;q=0.01'
                },
                method:"GET",
                dataType:"json",
                success: function(response, status) {
                    onSuccess(response);
                },
                error: function(response, status) {
                    onError(response);
                }
            });
        };

        this.getLsysDevice = function(deviceId, lsysName, onSuccess, onError) {
            var lsysSuffix = lsysName ? '?lsys-device-name=' + lsysName : '';
            $.ajax({
                url: '/api/juniper/sd/device-management/devices/device-from-logical-device/' + deviceId + lsysSuffix,
                headers: {
                    'Accept': 'application/vnd.juniper.sd.get-device-from-logical-device-id+json;version=1;q=0.01'
                },
                method:"GET",
                dataType:"json",
                success: function(response, status) {
                    onSuccess(response);
                },
                error: function(response, status) {
                    onError(response);
                }
            });
        };

		this.getPolicyVersionDetails = function(requestObj, onSuccess, onError) {
	        var policyType = requestObj['policy-version-details']['policy-type'], requestHeaders = {};
	        switch(policyType) {
	            case 'firewall':
	                requestHeaders = {
	                    url: '/api/juniper/sd/policy-management/firewall/rule-version-handler/policy-version-details',
	                    contentType: 'application/vnd.juniper.sd.rule-version-handler.policy-version-details-request+json;version=1;charset=UTF-8',
	                    accept: 'application/vnd.juniper.sd.rule-version-handler.policy-version-details-response+json;version=1;q=0.01'
	                }; 
                    break;
	            case 'NAT':
	                requestHeaders = {
	                    url: '/api/juniper/sd/policy-management/nat/rule-version-handler/policy-version-details',
	                    contentType: 'application/vnd.juniper.sd.rule-version-handler.nat-version-details-request+json;version=1;charset=UTF-8',
	                    accept: 'application/vnd.juniper.sd.rule-version-handler.nat-version-details-response+json;version=1;q=0.01'
	                }; 
                    break;
                case 'ips':
                    requestHeaders = {
                        url: '/api/juniper/sd/policy-management/ips/rule-version-handler/policy-version-details',
                        contentType: 'application/vnd.juniper.sd.rule-version-handler.ips-version-details-request+json;version=1;charset=UTF-8',
                        accept: 'application/vnd.juniper.sd.rule-version-handler.ips-version-details-response+json;version=1;q=0.01'

                    }; 
                    break;
			}
	        $.ajax({
	          	url: requestHeaders.url,
	          	headers: {
	              	"Accept": requestHeaders.accept,
	              	"Content-Type": requestHeaders.contentType
	          	},
	          	method: "POST",
	          	data: JSON.stringify(requestObj),
	          	success: function(response, status) {
	            	onSuccess(response);
	          	},
	          	error: function(response, status) {
	            	onError(response);
	          	},
	        });
	    };

	    this.isPolicyVersionDetailsValid = function(response) {
	      	if(response['policy-version-details']['policy-name'] === undefined && response['policy-version-details']['error-msg']) {
            	new Slipstream.SDK.Notification().setText(response['policy-version-details']['error-msg']).setType('info').notify();
            	return false;
        	}
        	return true;
	    };
        this.showPolicyFirewallFn = function() {
            var activity = this,
                selectedRow = this.evGrid.getSelectedRows()[0],
                mimeType = 'vnd.juniper.net.firewall.policies',
                selectedID = selectedRow.id, deviceId, request,
                ruleName = selectedRow['policy-name'],
                fromZone = selectedRow['source-zone-name'],
                toZone = selectedRow['destination-zone-name'],
                domainId = selectedRow['domain-id'],
                logicalDeviceId = selectedRow['device-id'],
                policyType = typeof selectedRow['event-category'] === 'undefined' ? 'firewall' : selectedRow['event-category'],
                isGlobal = false,
                timeStamp = new Date(selectedRow['timestamp']).getTime(),
                tmpName = contextMenuHandler.isGlobalRule(ruleName);

            if(tmpName.length !== ruleName.length) {
                isGlobal = true;
                ruleName = tmpName;
            }

            getPolicyVersionDetails = function(response) {
                var deviceId = response['device']['id'].toString(), requestObj = {};
                requestObj['policy-version-details'] = {
                    "rule-name": ruleName,
                    "from-zone": fromZone,
                    "to-zone": toZone,
                    "device-id": logicalDeviceId,
                    "sd-device-id": deviceId,
                    "policy-type": policyType,
                    "is-global": isGlobal,
                    "time-stamp": timeStamp
                };
                contextMenuHandler.getPolicyVersionDetails(requestObj, onSuccessGetPolicyVersionDetails, onErrorGetPolicyVersionDetails);
            };

            onSuccessGetLsysDevice = function(response) {
                getPolicyVersionDetails(response);
            };
	        onSuccessGetDevice = function(response) {
				if(selectedRow['logical-system-name']) {
					contextMenuHandler.getLsysDevice(response['device']['id'].toString(), selectedRow['logical-system-name'], onSuccessGetLsysDevice, onErrorGetDevice);
	            }
	            else {
					getPolicyVersionDetails(response);
				}
	        };
	        onErrorGetDevice = function(response) {
	            if(response.status === 404) {
	                new Slipstream.SDK.Notification().setText('Device is not managed by SD.').setType('info').notify();
	            }
	        };

	        onSuccessGetPolicyVersionDetails = function(response) {
	            var deviceRuleVersion = response['policy-version-details']['device-rule-version'],
	                designRuleVersion = response['policy-version-details']['design-rule-version'];

                if(contextMenuHandler.isPolicyVersionDetailsValid(response)) {
                    deviceRuleVersion == designRuleVersion ? contextMenuHandler.showCurrentRule(response, activity) : contextMenuHandler.showRuleChangeView(response, activity);
                }
	        };
	        onErrorGetPolicyVersionDetails = function(response) {
                console.log(response);
	        };

	        contextMenuHandler.getDevice(logicalDeviceId, selectedRow['logical-system-name'],onSuccessGetDevice, onErrorGetDevice);
	    };
        //
	    this.createExemptRuleFn = function(){

            var me=this,
                selectedRow = this.evGrid.getSelectedRows()[0],
                mimeType = 'vnd.juniper.net.ips.policies',
                selectedID = selectedRow.id, 
                deviceId, 
                request,
                ruleName = selectedRow['rule-name'],
                fromZone = selectedRow['source-zone-name'],
                toZone = selectedRow['destination-zone-name'],
                domainId = selectedRow['domain-id'],
                logicalDeviceId = selectedRow['device-id'],
                policyType = typeof selectedRow['event-category'] === 'undefined' ? 'ips' : selectedRow['event-category'],
                isGlobal = false,
                timeStamp = new Date(selectedRow['timestamp']).getTime(), 
                tmpName;
                tmpName = contextMenuHandler.isGlobalRule(ruleName);

            if(tmpName.length !== ruleName.length) {
                isGlobal = true;
                ruleName = tmpName;
            }

            getPolicyVersionDetails = function(response) {
                var deviceId = response['device']['id'].toString(), requestObj = {};
                requestObj['policy-version-details'] = {
                    "rule-name": ruleName,
                    "from-zone": fromZone,
                    "to-zone": toZone,
                    "device-id": logicalDeviceId,
                    "sd-device-id": deviceId,
                    "policy-type": policyType,
                    "is-global": isGlobal,
                    "time-stamp": timeStamp
                };
                contextMenuHandler.getPolicyVersionDetails(requestObj, onSuccessGetPolicyVersionDetails, onErrorGetPolicyVersionDetails);
            };

            onSuccessGetLsysDevice = function(response) {
                getPolicyVersionDetails(response);
            };

            onErrorGetDevice = function(response) {
                if(response.status === 404) {
                    new Slipstream.SDK.Notification().setText('Device is not managed by SD.').setType('info').notify();
                }
            };

            onSuccessGetDevice = function(response) {
                if(selectedRow['logical-system-name']) {
                    contextMenuHandler.getLsysDevice(response['device']['id'].toString(), selectedRow['logical-system-name'], onSuccessGetLsysDevice, onErrorGetDevice);
                }
                else {
                    getPolicyVersionDetails(response);
                }
            };

            onSuccessGetPolicyVersionDetails = function(response) {
                if(contextMenuHandler.isPolicyVersionDetailsValid(response)) {
                    // start related activity for the clicked category
                    var intent = new Slipstream.SDK.Intent(
                        "slipstream.intent.action.ACTION_LIST",
                        { mime_type: mimeType }
                    );
                    //
                    //using createAddressObjectIfNotExists jQuery deferred objects to resolve the promises
                    $.when(me.service.createAddressObjectIfNotExists(selectedRow["source-address"]), me.service.createAddressObjectIfNotExists(selectedRow["destination-address"]))
                        .then(function(sourceAddressResponse, destAddressResponse){
                            intent.putExtras({
                                "objectId": response['policy-version-details']['policy-id'].split(':')[1],
                                "operation": "createRule",
                                "ruleType": "EXEMPT",
                                "view": "rules",
                                "ruleName": selectedRow["rule-name"],
                                "srcZone": selectedRow["source-zone-name"],
                                "dstZone": selectedRow["destination-zone-name"],
                                "ips-signature": selectedRow["attack-name"],
                                "srcAddressId": sourceAddressResponse["addresses"]["address"][0]["id"],
                                "destAddressId": destAddressResponse["addresses"]["address"][0]["id"],
                                "srcAddressName": sourceAddressResponse["addresses"]["address"][0]["name"],
                                "destAddressName": destAddressResponse["addresses"]["address"][0]["name"]
                            });
                            me.context.startActivity(intent);
                        })
                        .fail(function(){
                            console.log("Error occurred during implicit create object");
                        });
                    //
                };
            };
            onErrorGetPolicyVersionDetails = function(response) {
                console.log(response);
            };
            contextMenuHandler.getDevice(logicalDeviceId, selectedRow['logical-system-name'],onSuccessGetDevice, onErrorGetDevice);
	    };
	    //
        this.showPolicyNATFn = function(natType) {
            var activity = this,
                selectedRow = this.evGrid.getSelectedRows()[0],
                mimeType = 'vnd.juniper.net.firewall.policies',
                selectedID = selectedRow.id, deviceId, request,
                ruleName = natType === 'Source NAT' ? selectedRow['src-nat-rule-name'] : selectedRow['dst-nat-rule-name'],
                fromZone = "",//selectedRow['source-zone-name'],
                toZone = "",//selectedRow['destination-zone-name'],
                domainId = selectedRow['domain-id'],
                logicalDeviceId = selectedRow['device-id'],
                policyType = 'NAT',
                isGlobal = false,
                timeStamp = new Date(selectedRow['timestamp']).getTime(),
                tmpName = contextMenuHandler.isGlobalRule(ruleName);

            if(tmpName.length !== ruleName.length) {
                isGlobal = true;
                ruleName = tmpName;
            }

            getPolicyVersionDetails = function(response) {
                var deviceId = response['device']['id'].toString(), requestObj = {};
                requestObj['policy-version-details'] = {
	                "rule-name": ruleName,
	                "from-zone": fromZone,
	                "to-zone": toZone,
	                "device-id": logicalDeviceId ,
	                "sd-device-id": deviceId,
	                "policy-type": policyType,
	                "nat-type": natType,
	                "is-global": isGlobal,
	                "time-stamp": timeStamp
                };
                contextMenuHandler.getPolicyVersionDetails(requestObj, onSuccessGetPolicyVersionDetails, onErrorGetPolicyVersionDetails);
            };

            onSuccessGetLsysDevice = function(response) {
                getPolicyVersionDetails(response);
            };
	        onSuccessGetDevice = function(response) {
				if(selectedRow['logical-system-name']) {
					contextMenuHandler.getLsysDevice(response['device']['id'].toString(), selectedRow['logical-system-name'], onSuccessGetLsysDevice, onErrorGetDevice);
	            }
	            else {
					getPolicyVersionDetails(response);
				}
	        };
            onErrorGetDevice = function(response) {
                if(response.status === 404) {
                    new Slipstream.SDK.Notification().setText('Device is not managed by SD.').setType('info').notify();
                }
            };
            onSuccessGetPolicyVersionDetails = function(response) {
                var deviceRuleVersion = response['policy-version-details']['device-rule-version'],
                    designRuleVersion = response['policy-version-details']['design-rule-version'];

                if(contextMenuHandler.isPolicyVersionDetailsValid(response)) {
                    deviceRuleVersion === designRuleVersion ? contextMenuHandler.showCurrentRule(response, activity) : contextMenuHandler.showRuleChangeView(response, activity);
                }
            };
	        onErrorGetPolicyVersionDetails = function(response) {
	            console.log(response);
	        };

            contextMenuHandler.getDevice(logicalDeviceId, selectedRow['logical-system-name'], onSuccessGetDevice, onErrorGetDevice);
        };

        this.showCurrentRule = function(response, activity) {
            var policyType = response['policy-version-details']['policy-type'].toLowerCase(), filters = 'RuleName = ' + response['policy-version-details']['rule-name'];

            switch(policyType) {
                case 'firewall':
                    filters += false === response['policy-version-details']['is-global'] ? ' and SrcZone = ' + response['policy-version-details']['from-zone'] + ' and DstZone = ' + response['policy-version-details']['to-zone'] : '';
                    break;
                case 'nat':
                    if(response['policy-version-details']['nat-type'] === 'Source NAT') {
                        filters += ' and dcNatRuleType = STATIC, SOURCE';
                    }
                    else if(response['policy-version-details']['nat-type'] === 'Destination NAT') {
                        filters += ' and dcNatRuleType = STATIC, DESTINATION';
                    }
                    else if(response['policy-version-details']['nat-type'] === 'Static NAT') {
                        filters += ' and dcNatRuleType = STATIC';
                    }
                    break;
				default: break;
	        }
            this.startServiceActivity(response, activity, filters);
        };

        this.showRuleChangeView = function(response, activity) {
            this.startServiceActivity(response, activity);
        };

        this.startServiceActivity = function (response, activity, filter) {
            var extras, intent, mime_type, policyType = response['policy-version-details']['policy-type'].toLowerCase();
            if(policyType === "firewall") {
                mime_type = 'vnd.juniper.net.firewall.policies';
            } else if(policyType === "nat") {
                mime_type = 'vnd.juniper.net.nat.policies';
            }
            intent = new Slipstream.SDK.Intent(
                "slipstream.intent.action.ACTION_LIST",
                {mime_type: mime_type}
            );
            extras = {"objectId":response['policy-version-details']['policy-id'].split(':')[1], "view":"rules"};
            if(filter) {
                extras['filter'] = '(' + filter + ')';
            } else {
                extras['policy-version-details'] = JSON.stringify(response);
            }
            intent.putExtras(extras);
            activity.context.startActivity(intent);
        };
    };

    return ContextMenuFunctions;
});
