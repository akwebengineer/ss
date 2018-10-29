/**
 * A view that uses a configuration object to render a grid widget
 *
 * @module GridView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/grid/gridWidget',
    'widgets/grid/conf/configurationSample',
    'widgets/grid/tests/view/createPolicyView',
    'widgets/grid/tests/models/zonePoliciesModel',
    'widgets/grid/tests/dataSample/firewallPoliciesData',
    'mockjax'
], function(Backbone, GridWidget, configurationSample, ZonePoliciesAddView, ZonePoliciesModel, firewallPoliciesData, mockjax){
    var GridView = Backbone.View.extend({

        events: {
            "click .getSelection": "getSelection"
        },

        initialize: function () {
            this.render();
        },

        render: function () {
            configurationSample.smallGrid.footer = false;
            this.grid = new GridWidget({
                container: this.el,
                elements: configurationSample.smallGrid
            });
            this.grid.build();
            this.$el.append('<input type="button" class="slipstream-primary-button  getSelection" value="Get Selection">');
            return this;
        },

        getSelection: function(){
            console.log(this.grid.getSelectedRows());
        }

    });

    return GridView;
});