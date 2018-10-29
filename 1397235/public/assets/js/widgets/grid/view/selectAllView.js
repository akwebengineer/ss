/**
 * Select All Overlay View. 
 * The view only uses when the row number is above 100k, then grid widget will show the overlay confirmation
 *
 * @module SelectAllView
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone',
    'text!widgets/grid/templates/selectAllConfirmation.html',
    'lib/template_renderer/template_renderer'
], function (Backbone, OverlayView, template_renderer) {
    var SelectAllView = Backbone.View.extend({

        /**
         * Initiallize the overlay view
         * @param {Object} options - it contains the content of the view
         * @inner
         */

        initialize: function (options) {
            var elementsTemplateHtml = template_renderer(OverlayView, {content: options.content});

            this.$el.append(elementsTemplateHtml);
            return this;
        }
    });

    return SelectAllView;
});