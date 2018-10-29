/**
 * A module that implements Base Topology
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'backbone',
    'widgets/topology/lib/tree/treeDataStore',
    'widgets/topology/lib/flat/flatDataStore',
    'widgets/topology/lib/constants'
], function (Backbone, TreeDataStore, FlatDataStore, topologyConstants) {

    /**
     * Construct a BaseView for child visualizations to inherit from.
     * @constructor
     * @class BaseView
     */
    var BaseView = Backbone.View.extend({
        /**
         * Initialize the view with passed in options.
         * @inner
         */
        initialize: function (options) {
            var self = this;
            this.options = options;
            if (options.dataStore instanceof TreeDataStore || options.dataStore instanceof FlatDataStore) {
                $(options.dataStore).on('dataStore.change dataStore.add dataStore.remove', function (e, obj) {
                    self.options.data = this.get();
                    self.updateVisual();
                });
                self.options.data = self.options.dataStore.get();
            }

        },

        /**
         * Attach the base SVG view to the container.
         * @inner
         */
        attachBaseView: function () {
            var options = this.options,
                width = options.viewerDimensions.width,
                height = options.viewerDimensions.height;

            this.baseViewSvg = d3.select(options.container[0]).append("svg")
                // Some browsers like IE will use a default size to SVG if we don't put a certain height and width.
                // To solve this we need both viewBox and width/height to be specified.
                .attr("viewBox", "50 100 "+width+" "+height)
                .attr("class", "topology-outer")
                .attr("preserveAspectRatio", "xMinYMin")
                .style("height", height + "px");
            return this;
        },

        /**
         * Renders the visualization.
         * @returns {BaseView}
         */
        render: function () {
            this.attachBaseView();
            this.renderVisual();
            return this;
        },

        /**
         * Updates visual.
         */
        updateVisual: function () {
            if(this.options.topologyType == topologyConstants.type.chord) {
                //Dont redraw on data store updates.
                this.update({redraw: false});
            }  else  {
                this.update({redraw: true});
            }
        },

        /**
         * Updates the visualization. Removes base SVG view and re-renders visual.
         * @param {Object} options - update configuration.
         * @returns {BaseView}
         */
        update: function (options) {
            //Get last seen location (transform attr) and events from children. Pass it as options back to child when updating visual.
            //This ensures that visual positions are retained during an update, events are reused.
            var renderOptions = {
                lastSeenLocation: this.getLastSeenLocation(),
                events: this.getEvents(),
                visualUpdates: this.getVisualUpdates()
            };

            _.extend(renderOptions, options);

            //if visual needs to be reset to initiate state, don't pass lastSeenLocation.
            if (options && options.reset) {
                delete renderOptions.lastSeenLocation
            }

            if (options && options.redraw) {
                $(this.options.container[0]).find('svg.topology-outer').remove();
                this.attachBaseView();
            }
            this.renderVisual(renderOptions);
            this.options.container.trigger(topologyConstants.events.viewRenderComplete, {}); // Private Event
            return this;
        },
        /**
         * Updates existing configuration.
         * @param {Object} configuration - topology configuration.
         */
        updateConfiguration: function (configuration) {
            _.extend(this.options, configuration);
            this.updateVisual();
        },
        /**
         * Override getLastSeenLocation in child views. The overrided method should return coordinates of the visualization.
         * During update operation, getLastSeenLocation will be used to retrieve coordinates and passed back into updateVisual method.
         */
        getLastSeenLocation: function () {},
        /**
         * Override getVisualUpdates in child views. The overrided method should return view update related config.
         */
        getVisualUpdates: function () {},
        /**
         * Override renderVisual to generate specific visualization in child views.
         */
        renderVisual: function () {}
    });

    return BaseView;
});
