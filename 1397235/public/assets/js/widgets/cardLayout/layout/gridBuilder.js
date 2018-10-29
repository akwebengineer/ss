/**
 * A module that builds a grid of cards from a card configuration and a container of cards.
 *
 * @module GridBuilder
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
    'masonry', 'jQueryBridget'
], /** @lends GridBuilder*/
function (masonry, jQueryBridget) {

    /**
     * GridBuilder constructor
     *
     * @constructor
     * @class GridBuilder- Builds a carousel of cards
     * @param {Object} $cardsContainer - jQuery object with a container of cards
     * @returns {Object} Current GridBuilder's object: this
     */
    var GridBuilder = function ($cardsContainer) {

        var defaults = {
            cardGutter: 20
        };

        // make Masonry a jQuery plugin
        jQueryBridget('masonry', masonry, $);

        /**
         * Sets a grid of cards from a card setting and a container with cards
         * @param {Object} cardSetting - Object with the settings required to set a grid of cards: height, width, min-width, max-width, isWidthResponsive and cardSelector
         * @inner
         */
        this.setCardLayout = function (cardSetting) {
            //sets $cardsContainer with required classes and containers
            $cardsContainer.addClass('grid-layout');
            $cardsContainer.find(".card-sizer").find("~ div").addClass(cardSetting.cardSelector);
            var $cardSelector = $cardsContainer.find("." + cardSetting.cardSelector);

            var cardWidth = cardSetting.isWidthResponsive ? cardSetting.cardWidth.split("%")[0] / 100 : cardSetting.cardWidth;

            //sets the card size to a user value that is a percentage of the cards container but it is more than the min width and less than the max width
            var setCardSize = function () {
                var newCardWidth = cardWidth;
                if (cardSetting.isWidthResponsive) {
                    newCardWidth = this.$element.width() * cardWidth - defaults.cardGutter;
//                    console.log("suggested width:" + newCardWidth);

                    if (cardSetting.cardMinWidth && newCardWidth < cardSetting.cardMinWidth) {
                        newCardWidth = cardSetting.cardMinWidth;
                    } else if (cardSetting.cardMaxWidth && newCardWidth > cardSetting.cardMaxWidth) {
                        newCardWidth = cardSetting.cardMaxWidth;
                    }
                }
//                console.log("final width:" + newCardWidth);
                $cardSelector.css({
                    "height": cardSetting.cardHeight,
                    "width": newCardWidth
                });
                return newCardWidth;
            };

            $cardsContainer.masonry({
                itemSelector: "." + cardSetting.cardSelector,
                gutter: defaults.cardGutter, //horizontal margin between cards
                columnWidth: setCardSize
            });
        };


        /**
         * Destroy the card layout from the $cardsContainer
         */
        this.destroy = function () {
            $cardsContainer.masonry('destroy');
        };
    };

    return GridBuilder;
});