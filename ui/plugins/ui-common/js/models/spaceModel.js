/**
 * A model superclass to be used for Space based applications.
 *
 * @module SpaceModel
 * @author Brian Duncan <bduncan@juniper.net>
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @author Jangul Aslam <jaslam@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone'
], function(
    Backbone 
) {
    var SpaceModel = Backbone.Model.extend({

        /** 
         * Derrived object calls this to set jsonRoot, accept and contentType
         * @param {Object} options -  containing jsonRoot, accept and contentType values for derived class 
         */
        initialize: function(options) {
            this.requestHeaders = {};
            this.requestHeaders.accept = options.accept;
            this.requestHeaders.contentType = options.contentType;
            this.requestHeaders['x-date'] = options['x-date'];
            this.jsonRoot = options.jsonRoot;
        },

        /** 
         * sync callback: before any ReST call
         * @param {String} method -  read (for GET) | create (for POST) | update (for PUT) | patch (for PATCH) | delete (for DELETE)
         * @param {Object} model -  backbone model being used for call
         * @options {Object} - internal options being used by Backbone 
         */
        sync: function(method, model, options) {
            var self = this;
            // add accept and content-type in request headers
            options.beforeSend = function(xhr) {
                if (self.requestHeaders.accept) {
                    xhr.setRequestHeader('Accept', self.requestHeaders.accept);
                }
                if (self.requestHeaders.contentType) {
                    xhr.setRequestHeader('Content-Type', self.requestHeaders.contentType);
                }              
                if (self.requestHeaders['x-date']) {
                    xhr.setRequestHeader('x-date', self.requestHeaders['x-date']);
                }              
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
            if (response && this.jsonRoot && response[this.jsonRoot]) {
                return response[this.jsonRoot];
            }

            return response;
        },

        /** 
         * toJSON callback before a create (POST) or update (PUT) or patch (PATCH) ReST call
         */
        toJSON: function() {
            // handle wrapped json
            if (this.jsonRoot) {
                var jsonObj = {};
                jsonObj[this.jsonRoot] = _.clone(this.attributes);
                return jsonObj;
            }

            return this.attributes;
        }

    });
    
    return SpaceModel;
});
