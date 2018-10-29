/**
 * Model for app firewall rule
 *
 * @module AppFwRuleModel
 * @author tgarg
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../../../base-policy-management/js/policy-management/rules/models/baseRuleModel.js',
    '../../AppFwConstants.js'
], function (BaseModel, AppFwConstants) {

    var AppFwRuleModel = BaseModel.extend({
        idAttribute: AppFwConstants.JSON_ID,
        initialize: function () {
            // initialize base object
            BaseModel.prototype.initialize.call(this, {
                accept: AppFwConstants.RULE_ACCEPT_HEADER,
                contentType: AppFwConstants.RULE_CONTENT_HEADER
            });
        }
    });

    return AppFwRuleModel;
});