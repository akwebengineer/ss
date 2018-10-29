/**
 * A module that builds a carousel of cards from a card configuration and a container of cards.
 *
 * @module CarouselBuilder
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
    'slick'
], /** @lends CarouselBuilder*/
function (slick) {

    /**
     * CarouselBuilder constructor
     *
     * @constructor
     * @class CarouselBuilder- Builds a carousel of cards
     * @param {Object} $cardsContainer - jQuery object a container of cards
     * @returns {Object} Current CarouselBuilder's object: this
     */
    var CarouselBuilder = function ($cardsContainer) {

        var defaults = {
            cardGutter: 20,
            cardHeight: 140,
            numberOfCards: 4
        };

        /**
         * Defines the responsive parameter required by the Slick library by defining the breakpoints where the carousel has to show less or more items
         * @param {int} numberOfCards - Number of items that the carousel has to render
         * @inner
         */
        var getResponsiveParameter = function (numberOfCards, cardWidth) {
            var responsiveParameter = [],
                cardResponsiveWidth = 2 * cardWidth; //initial breakpoint for only 1 card
            for (var i = 1; i <= numberOfCards; i++) {
                responsiveParameter.push({
                    breakpoint: cardResponsiveWidth,
                    settings: {
                        slidesToShow: i,
                        slidesToScroll: i
                    }
                });
                cardResponsiveWidth += cardWidth + defaults.cardGutter * (i + 1); //adds a card plus the card gutter offset
            }
            return responsiveParameter;
        };

        /**
         * Sets a carousel with cards from a card setting and a container with cards
         * @param {Object} cardSetting - Object with the settings required to set a carousel of cards: height, width, min-width, max-width, isWidthResponsive and cardSelector
         * @inner
         */
        this.setCardLayout = function (cardSetting) {
            //sets $cardsContainer with required classes and containers
            $cardsContainer.addClass('carousel-layout');
            $cardsContainer.find(".card-sizer").find("~ div").addClass(cardSetting.cardSelector);
            $cardsContainer.find(".card-sizer").detach();

            var $cardSelector = $cardsContainer.find("." + cardSetting.cardSelector)
                .height(cardSetting.cardHeight || defaults.cardHeight);

            //sets number of cards
            var numberOfCards = defaults.numberOfCards;
            if (cardSetting.isWidthResponsive) {
                var cardPercentage = parseInt(cardSetting.cardWidth.split("%")[0]);
                numberOfCards = Math.round(100 / cardPercentage);
            }

            //sets card library configuration
            var cardLibraryConfiguration = {
                dots: false,
                infinite: false,
                speed: 300,
                slidesToShow: numberOfCards,
                slidesToScroll: numberOfCards
            };

            if (cardSetting.cardMinWidth) {
                cardSetting.cardMaxWidth && $cardSelector.css("max-width", cardSetting.cardMaxWidth);
                _.extend(cardLibraryConfiguration, {
                    responsive: getResponsiveParameter(numberOfCards, cardSetting.cardMinWidth)
                })
            }

            $cardsContainer.slick(cardLibraryConfiguration);
        };

    };

    return CarouselBuilder;
});