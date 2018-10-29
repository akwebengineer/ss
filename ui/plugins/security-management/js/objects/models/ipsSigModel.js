
define([
    '../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var IPSSigModel = SpaceModel.extend({
        defaults: {
            "definition-type":  "CUSTOM"
        },
        urlRoot: '/api/juniper/sd/ips-signature-management/ips-signatures',
        idAttribute: "id",
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                "accept": "application/vnd.juniper.sd.ips-signature-management.ips-signature+json;version=1;q=0.01",
                "contentType": "application/vnd.juniper.sd.ips-signature-management.ips-signature+json;version=1;charset=UTF-8",
                "jsonRoot": "ips-signature" //
            });
        }

    });

    return IPSSigModel;
});
