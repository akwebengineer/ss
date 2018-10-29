/**
 * A view that uses the formWidget to a produce a form from a configuration file
 * The configuration file contains the title, labels, element types, validation types and buttons of the form
 *
 * @module Quick View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/grid/tests/conf/formConfiguration',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget'
], function(Backbone, formConf, FormWidget, OverlayWidget){
    var FormView = Backbone.View.extend({

        events: {
            'click #quick_view_ok': 'closeQuickView',
            'click #quick_view_cancel': 'closeQuickView'
        },

        initialize: function () {
            this.overlay = new OverlayWidget({
                view: this,
                xIconEl: true,
                showScrollbar: true,
                type: 'medium'
            });
            this.overlay.build();
        },

        render: function () {
            var rowData = this.options.rowData;
            this.form = new FormWidget({
                "elements": formConf.QuickView,
                "container": this.el,
                "values": rowData
            });
            this.form.build();
            return this;
        },

        closeQuickView: function (e){
            this.overlay.destroy();
            this.options.removeQuickView && this.options.removeQuickView();
            e.preventDefault();
            e.stopPropagation();
        }

    });

    return FormView;
});