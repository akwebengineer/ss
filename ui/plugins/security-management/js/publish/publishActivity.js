/**
 * Publish Activity page
 *
 * @module PublishActivity
 * @author vinayms <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 * as the publish trigger logic is common across the policies just need to access
 * the service specific method to publish
 **/
define(
    [
        'backbone',
        './views/publishPolicyFormView.js',
        'widgets/confirmationDialog/confirmationDialogWidget',
         '../sdBaseActivity.js',
         './snapshot/views/snapShotMaxCountValidator.js',
        '../../../sd-common/js/publish/constants/publishConstants.js'
    ],

    function (Backbone, PublishView, ConfirmationDialog, BaseActivity, SnapShotMaxCountValidator, PublishConstants) {


        var PublishActivity = function() {
            var self = this;
            BaseActivity.call(self);
            self.onStart = function() {
              var data = this.getExtras(), mainIntent = this.getIntent();
              switch(this.getIntent().data['mime_type']) {

                case PUBLISH_SERVICE_TYPE.FW_PUBLISH_MIME_TYPE:
                    publishFWPolicy(data);
                    break;

                case PUBLISH_SERVICE_TYPE.IPS_PUBLISH_MIME_TYPE:
                     publishIPSPolicy(data);
                    break;

                case PUBLISH_SERVICE_TYPE.NAT_PUBLISH_MIME_TYPE:
                     publishNATPolicy(data);
                    break;

                case PUBLISH_SERVICE_TYPE.VPN_PUBLISH_MIME_TYPE:
                     publishVPNPolicy(data);
                    break;

                case PUBLISH_SERVICE_TYPE.FW_UPDATE_MIME_TYPE:
                     updateFWPolicy(data);
                    break;
                    
                case PUBLISH_SERVICE_TYPE.IPS_UPDATE_MIME_TYPE:
                     updateIPSPolicy(data);
                    break;
            
                case PUBLISH_SERVICE_TYPE.NAT_UPDATE_MIME_TYPE:
                     updateNATPolicy(data);
                    break;

                case PUBLISH_SERVICE_TYPE.VPN_UPDATE_MIME_TYPE:
                     updateVPNPolicy(data);
                    break;

            }
            };

            /**
             * Defines policy service type, Will be used by publish overlay
             */
            var PUBLISH_SERVICE_TYPE= {
                FW_POLICY: 'firewall',
                VPN_POLICY: 'vpn',
                NAT_POLICY: 'nat',
                IPS_POLICY: 'ips',
                FW_PUBLISH_MIME_TYPE : 'vnd.juniper.net.service.fw.publish',
                VPN_PUBLISH_MIME_TYPE : 'vnd.juniper.net.service.vpn.publish',
                NAT_PUBLISH_MIME_TYPE : 'vnd.juniper.net.service.nat.publish',
                IPS_PUBLISH_MIME_TYPE : 'vnd.juniper.net.service.ips.publish',
                FW_UPDATE_MIME_TYPE : 'vnd.juniper.net.service.fw.update',
                VPN_UPDATE_MIME_TYPE : 'vnd.juniper.net.service.vpn.update',
                NAT_UPDATE_MIME_TYPE : 'vnd.juniper.net.service.nat.update',
                IPS_UPDATE_MIME_TYPE : 'vnd.juniper.net.service.ips.update'
            },
            /**
             *  check for the policies state
             *  if any draft then launch the draftPolicyInformation
             */
            isPolicyStateDraftVPNCheck= function(policyOptions, isPublish){
                var returnValue = false, jsonData ={
                    "vpn-list-by-id-and-state-request":{
                        "vpn-id-list":{"ids":policyOptions.selectedPolicies},
                        "policy-state":"Draft"
                    }
                };

                $.ajax({
                    type: "POST",
                    url: PublishConstants.VPN_DRAFT_CHECK_URL,
                    dataType: "json",
                    data: JSON.stringify(jsonData),
                    headers : {
                        'content-type' : PublishConstants.VPN_DRAFT_CHECK_CONTENT_TYPE,
                        'accept': PublishConstants.VPN_DRAFT_CHECK_ACCEPT
                    },
                    success: function(data) {
                        var draftPolicies=[], i, vpnDraftPolicies = data['ipsec-vpns']['ipsec-vpn'];
                        // check for any of the policy is in DRAFT state
                        for(i in vpnDraftPolicies){
                            if(vpnDraftPolicies.hasOwnProperty(i)){
                                draftPolicies.push('</br>'+vpnDraftPolicies[i]['name']);
                            }
                        }
                        if(draftPolicies && draftPolicies.length > 0) {
                            // if any DRAFT policy then block from publish with msg listing all the DRAFT policies
                            draftPolicyInformation(draftPolicies, policyOptions.activity);
                        } else {
                            if(isPublish){
                                publishPolicyOverlayLaunch(PUBLISH_SERVICE_TYPE.VPN_POLICY, policyOptions, policyOptions.selectedPolicies);
                            } else {
                                updatePolicyOverlayLaunch(PUBLISH_SERVICE_TYPE.VPN_POLICY, policyOptions, policyOptions.selectedPolicies);
                            }
                        }
                    }
                });
            },

            isPolicyStateDraft= function(options){

                var draftPolicies=[], policyState,i;
                // check for any of the policy is in DRAFT state
                for(i in options.selectedPolicies){
                    if(options.selectedPolicies.hasOwnProperty(i)){
                        policyState = options.selectedPolicies[i]['policy-state'];
                        if(policyState && policyState.toLowerCase() != 'final'){
                            draftPolicies.push('</br>'+options.selectedPolicies[i]['name']);
                        }
                    }
                }
                if(draftPolicies && draftPolicies.length > 0){
                    // if any DRAFT policy then block from publish with msg listing all the DRAFT policies
                    draftPolicyInformation(draftPolicies,options.activity);
                }
                return (draftPolicies.length > 0);

            },
            /**
             *  build the Publish overlay
             *  @params serviceType String, policyActivity object
             */
            publishPolicyOverlayLaunch= function(serviceType, options, selectedPolicies, deleteOldestSnapshot){
                options.size = 'xlarge';
                self.buildOverlay(getPublishView(serviceType, options, selectedPolicies, deleteOldestSnapshot, false), options);
            },
            /**
             *  build the Update overlay
             *  @params serviceType String, policyActivity object
             */
            updatePolicyOverlayLaunch= function(serviceType, options, selectedPolicies, deleteOldestSnapshot){
                options.size = 'xlarge';
                self.buildOverlay(getPublishView(serviceType, options, selectedPolicies, deleteOldestSnapshot, true), options);
            },
            getPublishView= function(serviceType, options, selectedPolicies, deleteOldestSnapshot, isUpdate){
                return new PublishView({
                    activity: self,
                    serviceType: serviceType,
                    isUpdate: isUpdate,
                    deleteOldestSnapshot: deleteOldestSnapshot,
                    selectedPolicies: selectedPolicies
                });
            },
            /**
             * [launchPubliceOrUpdateOverlay trigger the update/ pblish overlay based on the options]
             * @param  {[type]}  policyOptions        [policy object]
             * @param  {Boolean} isUpdate             []
             * @param  {[type]}  serviceType          [policy service type]
             * @param  {boolean}  deleteOldestSnapshot [ boolean]
             */
            launchPubliceOrUpdateOverlay= function(policyOptions, isUpdate, serviceType, deleteOldestSnapshot){
                if(isUpdate){
                    updatePolicyOverlayLaunch(serviceType, policyOptions, policyOptions.selectedPolicies, deleteOldestSnapshot);
                }else {
                    publishPolicyOverlayLaunch(serviceType, policyOptions, policyOptions.selectedPolicies, deleteOldestSnapshot);
                }
            },
            /**
             *  build the information obj and launch the message overlay
             *  @params draftPolicies array object
             */
            draftPolicyInformation= function(draftPolicies){

                var options ={
                    title : 'Unable to Publish',
                    question : 'Following policies are in draft state : '+ draftPolicies
                };
                createConfirmationDialog(options);
            },
            /**
             *  Create a confirmation dialog with basic settings
             *  Need to specify title, question, and event handle functions in "option"
             *  @params option Object
             */
            createConfirmationDialog= function(option) {

                var confirmationDialogWidget = new ConfirmationDialog({
                    title: option.title,
                    question: option.question,
                    yesButtonLabel: self.context.getMessage('ok'),
                    yesButtonCallback: function() {
                        confirmationDialogWidget.destroy();
                    },
                    yesButtonTrigger: 'yesEventTriggered',
                    xIcon: true
                });

                confirmationDialogWidget.build();
            },

            /**
             *  show Firewall publish policy
             *  @params options object {policyActivity object, selectedPolicies array[objects]}
             */
            publishFWPolicy= function(policyOptions){

                if(policyOptions.selectedPolicies.length > 0){
                    // check for any of the policy is in DRAFT state
                    if(!isPolicyStateDraft(policyOptions)){
                        var smv = new SnapShotMaxCountValidator({
                            "context":self.context, 
                            "policyOptions": policyOptions, 
                            "serviceType": PUBLISH_SERVICE_TYPE.FW_POLICY,
                            "snapshotCallback": function (deleteOldestSnapshot) {
                                publishPolicyOverlayLaunch(PUBLISH_SERVICE_TYPE.FW_POLICY, policyOptions, policyOptions.selectedPolicies, deleteOldestSnapshot);
                            }});
                        smv.checkForSnapShotMaxCount();
                    }
                }

            },
             /**
             *  show IPS publish policy
             *  @params options object {policyActivity object, selectedPolicies array[objects]}
             */
            publishIPSPolicy= function(policyOptions){

                if(policyOptions.selectedPolicies.length > 0){
                    // check for any of the policy is in DRAFT state
                    if(!isPolicyStateDraft(policyOptions)){
                        var smv = new SnapShotMaxCountValidator({
                            "context":self.context, 
                            "policyOptions": policyOptions,  
                            "serviceType": PUBLISH_SERVICE_TYPE.IPS_POLICY,
                            "snapshotCallback": function (deleteOldestSnapshot) {
                                publishPolicyOverlayLaunch(PUBLISH_SERVICE_TYPE.IPS_POLICY, policyOptions, policyOptions.selectedPolicies, deleteOldestSnapshot);
                            }});
                        smv.checkForSnapShotMaxCount();
                    }
                }

            },
            /**
             *  show VPN publish policy
             *  @params options object {policyActivity object, selectedPolicies array[objects]}
             */
            publishVPNPolicy= function(policyOptions){

                if(policyOptions.selectedPolicies.length > 0){
                    // check for any of the policy is in DRAFT state, internally triggers Publish
                    isPolicyStateDraftVPNCheck(policyOptions,true);
                }

            },
            /**
             *  show NAT publish policy
             *  @params options object {policyActivity object, selectedPolicies array[objects]}
             */
            publishNATPolicy= function(policyOptions){

                if(policyOptions.selectedPolicies.length > 0){
                    // check for any of the policy is in DRAFT state
                    if(!isPolicyStateDraft(policyOptions)){
                        var smv = new SnapShotMaxCountValidator({
                            "context":self.context, 
                            "policyOptions": policyOptions, 
                            "serviceType": PUBLISH_SERVICE_TYPE.NAT_POLICY,
                            "snapshotCallback": function (deleteOldestSnapshot) {
                                publishPolicyOverlayLaunch(PUBLISH_SERVICE_TYPE.NAT_POLICY, policyOptions, policyOptions.selectedPolicies, deleteOldestSnapshot);
                            }});
                        smv.checkForSnapShotMaxCount();
                    }
                }

            },
            /**
             *  show Firewall update policy
             *  @params options object {policyActivity object, selectedPolicies array[objects]}
             */
            updateFWPolicy=function(policyOptions){

                if(policyOptions.selectedPolicies.length > 0){
                    // check for any of the policy is in DRAFT state
                    if(!isPolicyStateDraft(policyOptions)){
                        var smv = new SnapShotMaxCountValidator({
                            "context":self.context, 
                            "policyOptions": policyOptions, 
                            "serviceType": PUBLISH_SERVICE_TYPE.FW_POLICY,
                            "snapshotCallback": function (deleteOldestSnapshot) {
                                updatePolicyOverlayLaunch(PUBLISH_SERVICE_TYPE.FW_POLICY, policyOptions, policyOptions.selectedPolicies, deleteOldestSnapshot);
                            }});
                        smv.checkForSnapShotMaxCount();
                    }
                }

            },
            /**
             *  show IPS update policy
             *  @params options object {policyActivity object, selectedPolicies array[objects]}
             */
            updateIPSPolicy=function(policyOptions){

                if(policyOptions.selectedPolicies.length > 0){
                    // check for any of the policy is in DRAFT state
                    if(!isPolicyStateDraft(policyOptions)){
                        var smv = new SnapShotMaxCountValidator({
                            "context":self.context, 
                            "policyOptions": policyOptions,
                            "serviceType": PUBLISH_SERVICE_TYPE.IPS_POLICY,
                            "snapshotCallback": function (deleteOldestSnapshot) {
                                updatePolicyOverlayLaunch(PUBLISH_SERVICE_TYPE.IPS_POLICY, policyOptions, policyOptions.selectedPolicies, deleteOldestSnapshot);
                            }});
                        smv.checkForSnapShotMaxCount();
                    }
                }

            },
            /**
             *  show NAT update policy
             *  @params options object {policyActivity object, selectedPolicies array[objects]}
             */
            updateNATPolicy=function(policyOptions){

                if(policyOptions.selectedPolicies.length > 0){
                    // check for any of the policy is in DRAFT state
                    if(!isPolicyStateDraft(policyOptions)){
                        var smv = new SnapShotMaxCountValidator({
                            "context":self.context, 
                            "policyOptions": policyOptions, 
                            "serviceType": PUBLISH_SERVICE_TYPE.NAT_POLICY,
                            "snapshotCallback": function (deleteOldestSnapshot) {
                                updatePolicyOverlayLaunch(PUBLISH_SERVICE_TYPE.NAT_POLICY, policyOptions, policyOptions.selectedPolicies, deleteOldestSnapshot);
                            }});
                        smv.checkForSnapShotMaxCount();
                    }
                }

            },
            /**
             *  show VPN update policy
             *  @params options object {policyActivity object, selectedPolicies array[objects]}
             */
            updateVPNPolicy=function(policyOptions){

                if(policyOptions.selectedPolicies.length > 0){
                    // check for any of the policy is in DRAFT state
                    isPolicyStateDraftVPNCheck(policyOptions, false);
                }

            };

    };
    PublishActivity.prototype = new Slipstream.SDK.Activity();
    return PublishActivity;
});