/**
 * Service for Block Workflow
 * @module BlockService
 * @author Dharma <adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
*/
define([], function(){
	var BlockService = function(){
	};

    BlockService.prototype.getPolicies = function(applicationNames, startTime, endTime, sourceName, sourceValues, deviceIds, lookUpEventAppTrack, onSuccess, onError){
        var url = "/api/juniper/ecm/policy-management/get-affected-policies",
            data={};
        //
        if(sourceValues.length === 0){
            if(sourceName === "user"){
                sourceValues = "All Users";
            }else if(sourceName === "application"){
                sourceValues = "All Applications";
            }else if(sourceName === "source_ip"){
                sourceValues = "All SourceIP"
            }else if(sourceName === "destination_ip"){
                sourceValues = "All DestinationIP"
            }
        };
        //
        data={
            "policy-template":{
                "end-time": endTime,
                "application-names": applicationNames,
                "start-time": startTime,
                "source-name": sourceName,
                "source-values": sourceValues,
                "lookup-event-apptrack": lookUpEventAppTrack === true ? true : false
            }
        };
        //
        if(deviceIds && deviceIds.length > 0){
            data["policy-template"]["device-id"] = deviceIds;
        };
        //
        $.ajax({
            "url": url,
            "type":"POST",
            headers:{
                'content-type' : "application/json"
            },
            "data": JSON.stringify(data)
        }).done(onSuccess).fail(onError);
    };

    /**
     * It returns the change list by UUID
     * @param uuid
     * @param onSuccess
     * @param onFailure
     */
    BlockService.prototype.getPolicyCLByUUID = function(uuid, onSuccess, onFailure) {
        $.ajax({
            url: '/api/juniper/sd/policy-management/firewall/policies/rule-placement-analysis-result?uuid=' + uuid,
            type: 'GET',
            headers: {
                Accept: 'application/vnd.juniper.sd.policy-management.firewall.policies+json'
            }
        }).done(onSuccess).fail(onFailure);

    };
    /**
     * Handles publish and update action
     * @param policyIds
     * @param updateFlag
     * @param onSuccess
     * @param onFailure
     * @param scope
     */
    BlockService.prototype.publishAndUpdate = function (policyIds, updateFlag, onSuccess, onFailure, scope) {
        var url, data;
        url = "/api/juniper/sd/policy-management/firewall/provisioning/publish-policy?update=" + updateFlag;
        if (scope.scheduleAt) {
            url += "&schedule=" + scope.scheduleAt;
        }

        data = {
            "publish": {
                "policy-ids": {
                    "policy-id": policyIds
                }
            }
        };

        $.ajax({
            "url": url,
            "type": "POST",
            "headers": {
                "Accept": "application/vnd.juniper.sd.fwpolicy-provisioning.monitorable-task-instances+json;version=1;q=0.01",
                "Content-Type": "application/vnd.juniper.sd.fwpolicy-provisioning.publish+json;version=1;charset=UTF-8"
            },
            data: JSON.stringify(data),
            context: scope
        }).done(onSuccess).fail(onFailure);
    };


    /**
     * Handles save policy action
     * @param uuid
     * @param callback
     * @param data
     * @param scope
     */
    BlockService.prototype.savePolicies = function (uuid, data, scope, onSuccess, onFailure) {
        var saveRequest = {
            'rule-analysis-result': {
                'fw-policy-change-list': data
            }
        };
        $.ajax({
            url: '/api/juniper/sd/policy-management/firewall/policies/save-policies?uuid=' + uuid,
            type: 'post',
            processData: false,
            data: JSON.stringify(saveRequest),
            headers: {
                'accept': 'application/vnd.juniper.sd.policy-management.firewall.policies+json',
                'content-type': "application/vnd.juniper.sd.policy-management.firewall.policies+json"
            },
            context: scope
        }).done(onSuccess).fail(onFailure);
    };
    /**
     * Calculate change list
     * @param appAccessDetails
     * @param onSuccess
     * @param onFailure
     */
    BlockService.prototype.calculateChangeList = function(appAccessDetails, uuid, onSuccess, onFailure) {
        var url = '/api/juniper/sd/policy-management/block-action/calculate-changelist?screen-id='+uuid;
        $.ajax({
            "url": url,
            "type":"POST",
            headers:{
                'content-type' : "application/vnd.juniper.sd.policy-management.calculate-changelist-request+json;version=2;charset=UTF-8",
                'accept': 'application/vnd.juniper.sd.policy-management.calculate-changelist-response+json;version=2;q=0.02'
            },
            "data": JSON.stringify(appAccessDetails)
        }).done(onSuccess).fail(onFailure);
    };

    /**
     * Delete change list from DB
     * @param uuid - Policy identifier on DB
     */
    BlockService.prototype.deleteChangeList = function(uuid) {
        var url = '/api/juniper/sd/policy-management/firewall/policies/delete-change-list/' + uuid;
        $.ajax({
            "url": url,
            "type":"DELETE",
            success: function() {
                console.log('Successfully change list');
            },
            failure : function() {
                console.log('Error in deleting change list');
            }
        });
    };

    //
    BlockService.prototype.getEffectiveChangeList = function(policyId, uuid, onSuccess, onFailure){
        $.ajax({
            url: "/api/juniper/sd/policy-management/firewall/policies/" + policyId + "/draft/effective-changelist?cuid=" + uuid,
            headers:{
                "accept": "application/vnd.juniper.sd.firewall-policies-draft.effective-changelist+json;version=1;q=0.01",
                "content-type": "application/vnd.juniper.sd.firewall-policies-draft.effective-changelist+json;version=1;charset=UTF-8"
            },
            success: onSuccess,
            failure : onFailure
        });
    };
    //
    BlockService.prototype.applyChangeListToStore = function(policyId, uuid, changeListData, onSuccess, onFailure){
        $.ajax({
            url: "/api/juniper/sd/policy-management/firewall/policies/" + policyId + "/draft/apply-changelist?cuid=" + uuid,
            type: 'post',
            headers:{
                'accept': "application/vnd.juniper.sd.firewall-policies-draft.apply-changelist+json;version=1;q=0.01",
                'content-type' : "application/vnd.juniper.sd.firewall-policies-draft.apply-changelist+json;version=1;charset=UTF-8"
            },
            data: JSON.stringify(changeListData)
        })
        .done(onSuccess)
        .fail(onFailure);
    };
    //
    BlockService.prototype.comparePolicy = function(callback,data,scope,screenId,ignoreUnchangedRules) {
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
    };
	return BlockService;
});