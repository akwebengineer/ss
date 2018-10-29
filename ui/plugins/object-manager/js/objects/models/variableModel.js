/**
 * Model for getting or updating a specific variable
 * 
 * @module VariableModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var VariableModel = SpaceModel.extend({

        urlRoot: '/api/juniper/sd/variable-management/variable-definitions',

        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'variable-definition',
                accept: 'application/vnd.juniper.sd.variable-management.variable-definition+json;version=1;q=0.01',
                contentType: 'application/vnd.juniper.sd.variable-management.variable-definition+json;version=1;charset=UTF-8'
            });
        }
    });

    return VariableModel;
});