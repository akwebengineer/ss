/**
 * A collection superclass to be used for Space based applications.
 *
 * @module SpaceCollection
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone'
], function(Backbone) {

    var SpaceCollection = Backbone.Collection.extend({

        /** 
         * Derrived object calls this to set jsonRoot and accept
         * @param {Object} options -  containing jsonRoot and accept values for derived class 
         */
        initialize: function(options) {
            this.requestHeaders = {};
            this.requestHeaders.accept = options.accept;
            this.requestHeaders.contentType = options.contentType;
            this.jsonRoot = options.jsonRoot;
        },

        /** 
         * sync callback: before any ReST call
         * @param {String} method -  read (for GET)
         * @param {Object} collection -  backbone collection being used for call
         * @options {Object} - internal options being used by Backbone 
         */
        sync: function(method, collection, options) {
            var self = this;
            // add accept and content-type in request headers
            options.beforeSend = function(xhr) {
                //
                if (self.requestHeaders.accept) {
                    xhr.setRequestHeader('Accept', self.requestHeaders.accept);
                }
                //
                if (self.requestHeaders.contentType) {
                    xhr.setRequestHeader('Content-Type', self.requestHeaders.contentType);   
                }
                //
            };

            // call backbone's sync method
            return Backbone.sync.apply(this, arguments);
        },

        /** 
         * parse callback: after a read (GET) ReST call
         * @param {Object} response - JS object from ReST call
         */
        parse: function(response) {
            // handle wrapped json
            if (this.jsonRoot) {
                var props = this.jsonRoot.split('.');
                return response[props[0]][props[1]];
            }

            return response;
        }
    });

    return SpaceCollection;
});
