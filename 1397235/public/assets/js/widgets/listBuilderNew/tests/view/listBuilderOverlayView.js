/**
 * A view that uses the overlay widget to render a listBuilder widget
 *
 * @module ListBuilderOverlayView
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'backbone',
    'widgets/listBuilderNew/listBuilderWidget',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget',
    'widgets/listBuilderNew/conf/configurationSample',
    'widgets/listBuilderNew/tests/conf/formConfiguration'
], function(Backbone, ListBuilderWidget, FormWidget, OverlayWidget, listBuilderConf, formConf){
    var ListBuilderOverlayView = Backbone.View.extend({
        initialize: function (options){
            this.overlay = new OverlayWidget({
                view: this,
                type: "medium",
                title: "ListBuilder on the overlay",
                okButton: true
            });
            this.overlay.build();
            
        },

        render: function () {
            new FormWidget({
                "elements": formConf.overlay,
                "container": this.el,
                "values": {}
            }).build();

            var service = this.$el.find('#service_overlay');
            // Services List Builder
            new ListBuilderWidget({
                container: service.parent(),
                elements: listBuilderConf.fourthListBuilder
            }).build();
            service.remove();

            return this;
        }
    });

    return ListBuilderOverlayView;
});