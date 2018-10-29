/**
 * A module that implements a view representing the top n URLs visited.
 *
 * @module
 * @name Slipstream/SecondaryNavigationApp/List/View
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(["text!./templates/quicklinks.tpl"], function(itemTpl) {
    Slipstream.module("Navigation.Quicklinks", function(Quicklinks, Slipstream, Backbone, Marionette, $, _) {
        /**
         * Construct a Quicklinks view.
         * @constructor 
         * @class QuicklinksItemView
         */
        Quicklinks.QuicklinksItemView = Marionette.ItemView.extend({
            template: itemTpl
        });

        Quicklinks.QuicklinksCollectionView = Marionette.CollectionView.extend({
            itemView: Quicklinks.QuicklinksItemView
        });
    });    

    return Slipstream.Navigation.Quicklinks.QuicklinksCollectionView;
});