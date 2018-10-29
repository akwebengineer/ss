/**
 * Model for displaying alarms
 * 
 * @module AlarmsModel
 * @author Ramesha<ramesha@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var AlarmsModel = SpaceModel.extend({
        defaults: {
            "definition-type":  "CUSTOM"
        },
        urlRoot: '/api/juniper/seci/alarms',
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
               "accept": "application/vnd.juniper.seci.alarm+json;version=1",
               "contentType": "application/vnd.juniper.seci.alarm+json;version=1;charset=UTF-8",
               "jsonRoot": "alarm"
            });
        }
    });

    return AlarmsModel;
});
