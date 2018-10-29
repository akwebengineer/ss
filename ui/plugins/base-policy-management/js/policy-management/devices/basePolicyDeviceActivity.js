/**
 * A module that implements a Grid Activity for Policies
 *
 * @module BasePoliciesActivity
 * @author Mamata <mamatad@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    '../../../../ui-common/js/gridActivity.js',
    './constants/basePolicyDeviceConstants.js'
], function ( GridActivity, BasePolicyConstants) {
    /**
     * Constructs a BasePoliciesActivity.
     */

    var BasePoliciesActivity = function () {
        GridActivity.call(this);

        this.cuid = Slipstream.SDK.Utils.url_safe_uuid();
        this.controller = null;
        this.constants = BasePolicyConstants;

        //need this to call the parent method
        var baseOnListIntent = this.onListIntent;

        //overwrite the list Intent to show the rules view if the policyId is passed in the url
        //else show the policy view
        this.onListIntent = function() {
            var self = this,
            policyId = self.getIntent().getExtras().objectId;
            var view = self.getIntent().getExtras().view;
            if(policyId && view === 'rules'){

                //load the policy object using the policyId passed from the policy view
                //TODO add code to handle the filter being passed from the globalsearch
                $.ajax({
                    url: self.constants.DEVICE_URL + policyId,
                    type: 'GET',
                    headers: {
                    Accept: self.constants.DEVICE_ACCEPT_HEADER
                    },
                    success: function (data) {
//                        self.policyObj = data["policy"];
                        var controller = new self.controller({context:self.context, policyObj:data["device"], cuid:self.cuid});
                        self.setContentView(controller.view);
                    },
                    error: function () {
                        console.log("call to fetch policy in base rules activity failed");
                    }
                });
            }else{
                baseOnListIntent.call(this);
            }
        };
    };

    BasePoliciesActivity.prototype = Object.create(GridActivity.prototype);
    BasePoliciesActivity.prototype.constructor = BasePoliciesActivity;

    return BasePoliciesActivity;
});