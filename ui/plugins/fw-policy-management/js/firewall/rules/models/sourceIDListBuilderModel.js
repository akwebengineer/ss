/**
 * Model for listBuilder operation
 * 
 * @module SourceIDListBuilderModel
 * @author Judy Nguyen <jnguyen@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../../ui-common/js/models/baseListBuilderModel.js'
], function (BaseModel) {

    var SourceIDListBuilderModel = BaseModel.extend({

        baseUrl: '/api/juniper/sd/policy-management/firewall/policies/' + this.policyId + '/srcid-item-selector/',
        availableUrl: '/available',
        selectedUrl: '/selected',
        availableAccept: "application/vnd.juniper.sd.firewall-policies-draft.src-identities+json;version=1;q=0.01",
        selectAccept: "application/vnd.juniper.sd.firewall-policies-draft.src-identities+json;version=1;q=0.01",
        selectContentType: "application/vnd.juniper.sd.firewall-policies-draft.select-src-identities+json;version=1;charset=UTF-8",
        deselectContentType: "application/vnd.juniper.sd.firewall-policies-draft.deselect-src-identities+json;version=1;charset=UTF-8",

        // use for getting selectAll and unselectAll ids
        availableAllUrl:"/available-src-identities-ids",
        selectedAllUrl:"/selected-src-identities-ids",
        availableAllAccept:"application/vnd.juniper.sd.firewall-policies-draft.src-identities-ids+json;version=1;q=0.01",
        selectAllAccept:"application/vnd.juniper.sd.firewall-policies-draft.src-identities-ids+json;version=1;q=0.01",

        initialize: function(options) {
            this.policyId = options.policyObj.id;
            this.baseUrl = '/api/juniper/sd/policy-management/firewall/policies/' + this.policyId + '/srcid-item-selector/';
            BaseModel.prototype.initialize.call(this, this.options);
        }

    });

    return SourceIDListBuilderModel;
});