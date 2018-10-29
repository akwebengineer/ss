/**
 * Cell editor view that provides a basic view of list builder on the overlay.
 * this class is launched on top of overlay & acts as a base class which other rule column editors can extend.
 *
 * @module CellEditorView
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone'
], function (Backbone) {
    var GridCellEditorView = Backbone.View.extend({

        editCompleted :function(e, model){
            this.options.ruleCollection.modifyRule(model.toJSON());
            // close editor overlay
            this.closeOverlay(e);
        },

        closeOverlay: function (e) {
            // close editor overlay
            this.options.close(this.options.columnName, e);
        }

    });

    return GridCellEditorView;
});