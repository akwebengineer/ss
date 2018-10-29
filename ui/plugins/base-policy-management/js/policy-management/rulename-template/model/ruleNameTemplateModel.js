/**
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../ui-common/js/models/spaceModel.js',
    '../../constants/basePolicyManagementConstants.js'
], function (SpaceModel,PolicyManagementConstants) {
    /**
     * RuleNameTemplateModel definition.
     */
    var RuleNameTemplateModel = SpaceModel.extend({

        initialize: function (options) {
            this.urlRoot = options.urlRoot;
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'rule-name-template',
                contentType: PolicyManagementConstants.RULE_NAME_CONTENT_TYPE,
                accept: PolicyManagementConstants.RULE_NAME_ACCEPT_HEADER
            });
        }
    });

    return RuleNameTemplateModel;
});