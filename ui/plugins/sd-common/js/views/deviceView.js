/**
 * 
 * @author WASIM AFSAR A 
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',
    '../devices/conf/deviceConf.js',
    '../devices/conf/deviceGridConf.js'
], function (Backbone, FormWidget, GridWidget, FormConf, DeviceGridConf) {

    var DeviceView = Backbone.View.extend({

        events: {
            'click #ok': "ok"
        },

        ok: function(event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        },

        initialize: function(options) {
            this.activity = options.activity;
            this.context = options.activity.context;
            this.params = options.params;
        },

        render: function() {
            var self = this;
            var formConfiguration = new FormConf(this.context);
            var formElements = formConfiguration.getValues();
            

            this.form = new FormWidget({
                container: this.el,
                elements: formElements
            });

            this.form.build();
            this.addGridWidget();
            return this;
        },

        addGridWidget: function() {
            var gridContainer = this.$el.find('#device-list');
            gridContainer.empty();
            var gridConf = new DeviceGridConf(this.context,this.params);
            var gridElements = gridConf.getValues();
            this.gridWidget = new GridWidget({
                container: gridContainer,
                elements: gridElements
            });
            this.gridWidget.build();
        }
    });

    return DeviceView;
});
