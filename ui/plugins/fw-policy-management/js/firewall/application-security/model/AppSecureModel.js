/**
 * Defines App secure model
 */
define([
    '../../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {
    /**
     * App secure model definition.
     */
    var AppSecureModel = SpaceModel.extend({
        defaults: {
            // "definition-type":  "CUSTOM"
        },
        urlRoot: '/api/juniper/sd/policy-management/firewall/app-fw-policy-management/app-fw-policies',
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                "accept": "application/vnd.juniper.sd.app-fw-policy-management.app-fw-policy+json;version=1;q=0.01",
                "contentType": "application/vnd.juniper.sd.app-fw-policy-management.app-fw-policy+json;version=1;charset=UTF-8",
                "jsonRoot": "app-fw-policy"
            });
        }
    });
    return AppSecureModel;

});