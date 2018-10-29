/**
 * A Backbone model representing geniric-policy 
 *
 * @module AssignDevicesModel
 * @author Damodhar M <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {
    /**
     * AssignDevicesModel definition.
     */
    var AssignDevicesModel = SpaceModel.extend({

        initialize: function (options) {
            this.urlRoot = options.assignDevicesURLRoot;
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'assign-devices',
                contentType: options.assignDevicesContentType
            });
        }
    });

    return AssignDevicesModel;
});