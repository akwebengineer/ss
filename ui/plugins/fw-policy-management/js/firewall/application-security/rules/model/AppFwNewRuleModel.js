/**
 * Model for creating app fw new rule
 **/
define([
    '../../../../../../ui-common/js/models/spaceModel.js',
    '../../AppFwConstants.js'
], function (SpaceModel, AppFwConstants) {

    var AppFwNewRuleModel = SpaceModel.extend({
        defaults: {
            "definition-type": "CUSTOM"
        },
        urlRoot: AppFwConstants.POLICY_URL,
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                "accept": AppFwConstants.RULE_ACCEPT_HEADER,
                "contentType": AppFwConstants.RULE_CONTENT_HEADER,
                "jsonRoot": "app-fw-rule"
            });
        },
        sync: function (method, model, options) {
            options.url = this.urlRoot + options.policyID + AppFwConstants.RULE_DRAFT;
            if (options.initialTemplate) {
                options.url += "/new";
            }
            
            options.url += "?cuid="+options.cuid;

            // By default, for update the type is PUT. Overriding it to POST
            if (method === 'update') {
                options.type = 'POST';
            }
            // call SpaceModel's sync method
            return SpaceModel.prototype.sync.call(this, method, model, options);
        }
    });

    return AppFwNewRuleModel;
});