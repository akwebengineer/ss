/**
 * Defines App Firewall default action model
 */
define([
    '../../../../../../ui-common/js/models/spaceModel.js',
    '../../AppFwConstants.js'
], function (SpaceModel, AppFwConstants) {
    /**
     * App secure model definition.
     */
    var AppFwPolicyDetailsModel = SpaceModel.extend({

        urlRoot: AppFwConstants.POLICY_URL,

        /**
         * Initialize model
         */
        initialize: function () {
            var action, jsonRoot, accept, contentType;
            SpaceModel.prototype.initialize.call(this, {});
        },

        /**
         * Setting sync params
         * @param method method = update | delete | read | create | patch
         * @param model
         * @param options
         */
        sync: function (method, model, options) {
            this.requestHeaders = {};
            switch (method) { // method = update | delete | read | create | patch
                case "update" :
                    options.url = this.urlRoot + model.id + '/draft/modify-profile';
                    options.url += "?cuid="+ options.cuid;
                    options.type = 'POST';
                    this.requestHeaders.accept = 'application/vnd.juniper.sd.appfw-profile-draft.rules+json;version=1;q=0.01';
                    this.requestHeaders.contentType = 'application/vnd.juniper.sd.appfw-profile-draft.rules+json;version=1;charset=UTF-8';
                    this.jsonRoot = 'app-fw-policy';
                    break;
            }

            // call SpaceModel's sync method
            return SpaceModel.prototype.sync.call(this, method, model, options);
        }
    });

    return AppFwPolicyDetailsModel;
});