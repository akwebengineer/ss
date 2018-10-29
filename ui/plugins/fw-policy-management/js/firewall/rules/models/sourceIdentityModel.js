/**
 * Model for getting or updating a specific Source Identity
 * 
 * @module SourceIdentityModel
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var SourceIdentityModel = SpaceModel.extend({

        urlRoot : '/api/juniper/sd/policy-management/firewall/policies/',


        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                //jsonRoot: 'SrcIdentityList',
                jsonRoot:'',
                accept: 'application/vnd.juniper.sd.firewall-policies.src-identity+json;version=1;q=0.01',
                contentType: 'application/vnd.juniper.sd.firewall-policies.src-identity+json;version=1;charset=UTF-8'
            });
        }
    });

    return SourceIdentityModel;
});