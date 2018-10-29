/** 
 * A module that implements a Slipstream Activity.  A Slipstream workflow is
 * composed of an ordered sequence of activities.  
 *
 * @module 
 * @name Slipstream/SDK/Activity
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define(['sdk/baseActivity'], function(BaseActivity) {
    Slipstream.module("SDK", /** @lends Activity */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
        // private 

        // public

        /**
         * Construct an Activity object.
         *
         * @constructor
         * @class Activity
         * @classdesc Represents a Slipstream activity.
         */
        SDK.Activity = function() {
            BaseActivity.call(this);
            this.dashboard = null;
        }

        SDK.Activity.prototype = Object.create(BaseActivity.prototype);
        SDK.Activity.prototype.constructor = SDK.Activity;

        /**
         * Set the view in the framework's content pane.
         *
         * @param {Slipstream.View} - the view object to be rendered into the framework's 
         *        content area.
         * @param {Object} options - A set of options related to rendering of the content view (optional)
         * @param {Object} options.title - The (optional) title that will be rendered in the content pane header.
         * @param {String} options.title.content - The help content associated with the title.
         * @param {Object} options.title.help - The (optional) help content associated with the title.
         * @param {Object} options.title.help.content - A string containing help text associated with the view title.
         * @param {Object} options.title.help.ua-help-text - (optional) The text that will be used in a link to an external help page.
         * @param {Object} options.title.help.ua-help-identifer - (optional) The help identifer used to create the link to an external help page.
         * @param {String} options.title.titlebar - (optional) The title to be used in the UI title bar.
         */
        SDK.Activity.prototype.setContentView = function(view, options) {
            Slipstream.vent.trigger("view:render", view, options, this.getContext().ctx_name);
            Slipstream.commands.execute("activity:primary:set", this);
        }

        SDK.Activity.prototype.getDashboard = function() {
            return this.dashboard;
        }

        /**
         * Set the view in framework header's right region.
         *
         * @param {Object} | {String} view - the view object or string to be rendered into the framework 
         * header's right region.
         *
         */
        SDK.Activity.prototype.setContentHeaderView = function(view) {
            Slipstream.vent.trigger("rightHeader:content:set", view, this.getContext().ctx_name);
        }

        /**
         * Set the logo in the UI.
         *
         * @param {Object} view - The view to be rendered as the product logo. 
         */
        SDK.Activity.prototype.setLogo = function(view) {
            Slipstream.commands.execute("ui:logo:set", view);
        }
    });


    return Slipstream.SDK.Activity;
});