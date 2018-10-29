/**
 * Created by vinutht on 5/14/15.
 */

/**
 * Model for getting application signatures
 *
 * @module Application Signature Model
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var AppSigModel = SpaceModel.extend({
        defaults: {
            "definition-type":  "CUSTOM"
        },
        urlRoot: '/api/juniper/sd/app-sig-management/app-sigs',
        idAttribute: "id",
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                "accept": "application/vnd.juniper.sd.app-sig-management.app-sig+json;version=1;q=0.01",
                "contentType": "application/vnd.juniper.sd.app-sig-management.app-sig+json;version=1;charset=UTF-8",
                "jsonRoot": "app-sig"
            });
        }

    });

    return AppSigModel;
});
