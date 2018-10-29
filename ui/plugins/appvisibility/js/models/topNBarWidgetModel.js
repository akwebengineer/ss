/**
 * Model for TopNModel
 * @module TopNModel
 * @author Dharma<adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/
define([
    './spaceModel.js'
], function (SpaceModel) {

    var TopNModel = SpaceModel.extend({
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {                      
               //"accept": "application/vnd.juniper.seci.alertdefinition-management.alert-definition+json;version=1",                   
               "jsonRoot": "response.result"
            });
        }
    });

    return TopNModel;
});