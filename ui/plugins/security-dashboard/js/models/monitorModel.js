/**
 * A module that implements a BackboneJS model for
 * generic widgets
 *
 * @module MonitorModel
 * @author Kyle Huang <kyleh@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    './spaceModel.js'
], function (SpaceModel) {

    /**
     * MonitorModel definition
     */
    var MonitorModel = SpaceModel.extend({
        urlRoot: '/api/juniper/ecm/monitor-management',
        idAttribute: 'moid',
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'monitordefinition',
                accept: 'application/vnd.juniper.seci.monitor-management+json;q=0.01;version=1',
                contentType: 'application/vnd.juniper.seci.monitor-management+json;version=1;charset=UTF-8'
            });
        }
    });

    return MonitorModel;

});
