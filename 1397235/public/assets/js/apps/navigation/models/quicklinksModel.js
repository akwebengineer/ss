/** 
 * A module that implements a quicklinks model object
 *
 * @module 
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define(/** @lends QuicklinksModel */ function() {
    Slipstream.module("Navigation.Entities", function(Entities, Slipstream, Backbone, Marionette, $, _) {
        /**
         * Construct a base navigation model
         * @constructor 
         * @class BaseModel
         */
        Entities.QuicklinksModel = Backbone.Model.extend({
        });

        Entities.QuicklinksCollection = Backbone.Collection.extend({
        	model: Entities.QuicklinksModel,
        	url: "/_p13n/url/referred/topn?number=5"
        })
    });

    return Slipstream.Navigation.Entities.QuicklinksCollection;
});