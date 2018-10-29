/**
 * A view of the list grid
 *
 * @module ListGrid
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define([
    'backbone',
    'widgets/grid/gridWidget',
    'widgets/grid/conf/configurationSample'
], function(Backbone, GridWidget, configurationSample){
    var ListGrid = Backbone.View.extend({

        initialize: function () {
            this.render();
        },

        render: function () {
            $(this.el).addClass("slipstream_list_grid_sample");
            this.grid = new GridWidget({
                container: this.el,
                elements: configurationSample.listGrid
            });
            this.grid.build();
            return this;
        }
    });

    return ListGrid;
});