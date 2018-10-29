/**
 * Model for getting alert definitions
 *
 * @module Log Collector
 * @author Aslam <aslama@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    '../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var AddNodeModel = SpaceModel.extend({

      

        urlRoot: '/api/space/fabric-management/add-fabric-node',

        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
               "accept": 'application/vnd.net.juniper.space.job-management.task+json;version=1;q=0.01',
               "contentType": 'application/vnd.api.space.fabric-management.fabric-nodes.add-special-fabric-node-request+json;version=2;charset=UTF-8'
            });
        }
    });

    return AddNodeModel;
});
