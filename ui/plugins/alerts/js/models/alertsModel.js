/**
 * Model for getting alerts
 * 
 * @module AlertsModel
 * @author Slipstream Developers <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var AlertsModel = SpaceModel.extend({
        defaults: {
            "def-type":  "CUSTOM"
        },
        urlRoot: '/api/juniper/seci/alert-management/alerts',
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {                      
               "accept": "application/vnd.juniper.seci.alert-management.alert+json;version=1",
               "jsonRoot": "alert"
            });
        }
    });

    return AlertsModel;
});