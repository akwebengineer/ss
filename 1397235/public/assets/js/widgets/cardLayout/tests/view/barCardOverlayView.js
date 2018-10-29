/**
 * A view that uses a configuration object to render a card layout widget on an overlay widget
 *
 * @module BarCardOverlayView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define([
    'widgets/overlay/overlayWidget',
    'widgets/cardLayout/cardLayoutWidget',
    'widgets/cardLayout/conf/configurationSample',
    'widgets/cardLayout/tests/view/cardsView',
    'text!widgets/cardLayout/tests/templates/cardLayoutOverlayExample.html'
], function (OverlayWidget, CardLayoutWidget, configurationSample, CardsView, cardLayoutOverlayExample) {
    var BarCardOverlayView = Backbone.View.extend({

        initialize: function () {
            this.addTemplates();
            this.overlay = new OverlayWidget({
                title: "Card Layout with Responsive Cards and Bar View",
                view: this,
                type: 'large'
            });
            this.overlay.build();
        },

        render: function () {
            //Card Layout with responsive cards, bar view and remote data
            this.barRemoteCardLayoutWidget = new CardLayoutWidget({
                "container": this.$barResponsiveWidthCardsRemote,
                "options": configurationSample.barShortResponsiveCards,
                "content": CardsView.BarLayoutView
            }).build();
            //Card Layout with responsive cards, bar view and local data
            var barLocalResponsiveCards = $.extend({}, configurationSample.localBarResponsiveCards, {
                "subTitle": "Local data"
            });
            this.barLocalCardLayoutWidget = new CardLayoutWidget({
                "container": this.$barResponsiveWidthCardsLocal,
                "options": barLocalResponsiveCards,
                "content": CardsView.BarLayoutView
            }).build();
            return this;
        },

        addTemplates: function () {
            this.$el.append(cardLayoutOverlayExample);
            this.$barResponsiveWidthCardsRemote = this.$el.find("#bar-responsive-width-cards-remote-overlay");
            this.$barResponsiveWidthCardsLocal = this.$el.find("#bar-responsive-width-cards-local-overlay");
        }

    });

    return BarCardOverlayView;
});