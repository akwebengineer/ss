/**
 * A module that implements BackboneJS collections for
 * generic widgets
 *
 * @module WidgetDataCollection
 * @author Kyle Huang <kyleh@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone'
], function (Backbone) {

    /**
     * WidgetDataCollection collections definition
     */
    var WidgetDataCollection = Backbone.Collection.extend({
        urlRoot: '/api/juniper/ecm/monitordata-management/',
        url: function () {
            return this.urlRoot + this.id;
        },
        idAttribute: 'monitorid',
        fetch: function (options) {
            var self = this;
            var epoch = (new Date).getTime();
            var params = {
                '_dc': epoch,
                'page': 1,
                'start': 0,
                'limit': 25
            };
            options ||  (options = {});
            options.data = $.param(params);
            Backbone.Collection.prototype.fetch.apply(self, [options]);
        },
        sync: function (method, model, options) {
            options.beforeSend = function (xhr) {
                xhr.setRequestHeader('Accept', 'application/vnd.juniper.seci.monitordata-management+json;version=1')
            };
            return Backbone.sync.apply(this, arguments);
        },
        parse: function (response) {
            return response.monitordataresult.monitorresult.results.nwresult;
        }
    });

    return WidgetDataCollection;
});
