/**
 * Model for getting alert definitions
 * 
 * @module AlertDefinitionModel
 * @author Slipstream Developers <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var AlertDefinitionModel = SpaceModel.extend({
        defaults: {
            "def-type":  "CUSTOM"
        },
        urlRoot: '/api/juniper/seci/alertdefinition-management/alert-definitions',
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
               "accept": "application/vnd.juniper.seci.alertdefinition-management.alert-definition+json;version=1",
               "contentType": "application/vnd.juniper.seci.alertdefinition-management.alert-definition+json;version=1;charset=UTF-8",       
               "jsonRoot": "alert-definition"
            });
        }
    });

    return AlertDefinitionModel;
});
