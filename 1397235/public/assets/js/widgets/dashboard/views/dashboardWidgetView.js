/**
 * A view of a widget (thumbnail + dashlet) in the dashboard.
 *
 * @module DashboardWidgetView
 * @author Sujatha <sujatha@juniper.net>
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(['backbone', "lib/utils"], /** @lends DashboardWidgetView */ function(Backbone, Utils){

    /**
     * Construct a dashboard widget view for use in dashboard
     * @constructor
     * @class DashboardWidgetView
     */
    var DashboardWidgetView = Backbone.View.extend({

        /**
         * Get the thumbnail ID of this dashboard widget
         */
        getThumbnailId: function(){
            return this.options.thumbnailId;
        },

        /**
         * Set the thumbnail ID of this dashboard widget
         */
        setThumbnailId: function(thumbnailId){
            this.options.thumbnailId = thumbnailId;
        },

        /**
         * Get the size set on this widget
         * @instance
         * #returns {String} Size of the widget
         */
        getSize: function(){
            return this.options.size;
        },

        /**
         * Get the title set on this widget
         * @instance
         * @returns {String} The title of the widget as passed by the plugin
         */
        getTitle: function(){
            return this.options.title;
        },

        /**
         * Get the details set on this widget
         * @instance
         * @returns {String} The details of the widget to be displayed in dashboard as passed by the plugin
         */
        getDetails: function(){
            return this.options.details;
        },

        /**
         * Get the thumbnail image for this widget
         * @instance
         * @returns {Object} The thumbnail image passed in by the plugin for this widget
         */
        getImage: function(){
            return this.options.image;
        },

        /**
         * Get the context for this widget
         * @instance
         * @returns {Object} The context object passed in by the plugin for this widget
         */
        getContext: function(){
            return this.options.context;
        },

        /**
         * Get the dashlet view set on this widget
         * @instance
         * @returns {Object} The view object passed in by the plugin for this widget
         */
        getView: function() {
            return this.options.view;
        },

        /**
         * Get the dashlet footer set on this widget
         * @instance
         * @returns {Date} The date set on this widget
         */
        getFooter: function() {
            return Slipstream.SDK.DateFormatter.format(new Date(), {format: "long", options: {seconds: true}})
        },

        /**
         * Get the customInitData set on this widget
         * @instance
         * @returns {String} The customInitData as passed by the plugin
         */
        getCustomInitData: function() {
            return this.options.customInitData;
        },

        /**
         * Get the filters set on this widget
         * @instance
         * @returns {String} The filters as passed by the plugin
         */
        getFilters: function() {
            return this.options.filters;
        },

        /**
         * If this is a default widget, get the container id or ids
         * @instance
         * #returns {Array} Container ids, if the widget is a default one, otherwise returns an empty array
         */
        getDefaultDashletContainerIds: function() {
            var defaultDashlets = this.options.default;
            if (defaultDashlets && !_.isEmpty(defaultDashlets)) {
                return defaultDashlets.containers;
            } else {
                return [];
            }
        },

        /**
         * Get the category id or ids
         * @instance
         * #returns {Array} Category ids, if the widget is associated with a category, otherwise returns an empty array
         */
        getCategoryIds: function() {
            var categoryIds = this.options.categories;
            if (categoryIds && !_.isEmpty(categoryIds)) {
                return categoryIds;
            } else {
                return [];
            }
        },

        /**
         * Verify if user has the required capabilities to access this widget
         * @instance
         * @returns {Boolean} true if the user has the required capabilities to access the widget, otherwise false
         */
        isAccessible: function() {
            // app can define capabilities for each widget in dashboard plugin.json
            // if capabilities are not defined, then access is unrestricted
            if (!this.options.capabilities) {
                return true;
            } else {
                // if capabilities are defined, then verify if access is permitted
                return Utils.userHasCapabilities(this.options.capabilities);
            }
        }

	});

    return DashboardWidgetView;
});

