/**
 * A view that uses the card layout widget to card on a responsive layout from a configuration object
 *
 * @module Card Layout View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'marionette',
    'lib/template_renderer/template_renderer',
    'widgets/cardLayout/cardLayoutWidget',
    'widgets/cardLayout/conf/configurationSample',
    'widgets/cardLayout/tests/view/cardsView',
    'widgets/cardLayout/tests/view/barCardOverlayView',
    'widgets/cardLayout/tests/dataSample/groupedCardsDataMock',
    'text!widgets/cardLayout/tests/templates/cardLayoutExample.html'
], function (Marionette, render_template, CardLayoutWidget, configurationSample, CardsView, BarCardOverlayView, GroupedCardsDataMock, cardLayoutExample) {
    Marionette.Renderer.render = render_template;

    var CardLayout = Backbone.View.extend({

        events: {
            "click #get-carousel-card-selection": "getCarouselCardSelection",
            "click #set-carousel-card-selection": "setCarouselCardSelection",
            "click .bar-card-on-overlay": "showBarCardOnOverlay",
            "click #get-card-selection": "getCardSelection",
            "click #set-card-selection": "setCardSelection",
            "click #toggle-card-selection": "toggleCardSelection",
            "click #get-local-card-selection": "getLocalCardSelection",
            "click #set-local-card-selection": "setLocalCardSelection",
            "click #toggle-local-card-selection": "toggleLocalCardSelection",
            "click #enable-card": "enableCarouselCard",
            "click #disable-card": "disableCarouselCard",
            "click #search-all-cards": "searchAllCards",
            "click #search-old-cards": "searchOldCards",
            "click #search-new-cards": "searchNewCards",
            "click #get-grouped-card-selection": "getGroupedCardSelection"
        },

        initialize: function () {
            new GroupedCardsDataMock().init(); //sets API response
            this.addTemplates();
            this.bindEvents();
            !this.options.pluginView && this.render();
        },

        render: function () {
            //Card Layout with Responsive Cards and Carousel View
            this.carouselCardLayoutWidget = new CardLayoutWidget({
                "container": this.$carouselResponsiveWidthCards,
                "options": configurationSample.carouselResponsiveCards,
                "content": CardsView.CarouselLayoutView
            }).build();

            //Card Layout with Responsive Cards and Bar View
            this.carouselCardLayoutWidget = new CardLayoutWidget({
                "container": this.$barResponsiveWidthCards,
                "options": configurationSample.localBarResponsiveCards,
                "content": CardsView.BarLayoutView
            }).build();

            //Card Layout with Responsive Cards and Grid View
            this.cardLayoutWidget = new CardLayoutWidget({
                "container": this.$responsiveWidthCards,
                "options": configurationSample.responsiveCards,
                "content": CardsView.GridLayoutView1
            }).build();

            //Card Layout with Local Data, Responsive Cards and Grid View
            this.localCardLayoutWidget = new CardLayoutWidget({
                "container": this.$localresponsiveWidthCards,
                "options": configurationSample.localResponsiveCards,
                "content": CardsView.GridLayoutView1
            }).build();

            //Card Layout with Fixed Cards and Grid View
            new CardLayoutWidget({
                "container": this.$fixedWidthCards,
                "options": configurationSample.fixedCards,
                "content": CardsView.GridLayoutView2
            }).build();

            //Card Layout with Grouped Cards
            this.groupedCardsLayoutWidget = new CardLayoutWidget({
                "container": this.$groupedCards,
                "options": configurationSample.groupedCards,
                "content": CardsView.GridLayoutView1
            }).build();

            return this;
        },

        bindEvents: function () {
            this.$carouselResponsiveWidthCards.bind("slipstreamCardLayout.cardSelection", function (e, cardSelection) {
                console.log(cardSelection);
            });
            this.$responsiveWidthCards.bind("slipstreamCardLayout.cardsData:onLoadComplete", function (e, cardCollectionResponse) {
                console.log("remote response: " + cardCollectionResponse.status);
            });
            this.$responsiveWidthCards.bind("slipstreamCardLayout.cardSelection", function (e, cardSelection) {
                console.log(cardSelection);
            });
            this.$localresponsiveWidthCards.bind("slipstreamCardLayout.cardsData:onLoadComplete", function (e, cardCollectionResponse) {
                console.log("local response: " + cardCollectionResponse.status);
            });
            this.$fixedWidthCards.bind("slipstreamCardLayout.cardSelection", function (e, cardSelection) {
                console.log(cardSelection);
            });
        },

        searchAllCards: function () {
            this.groupedCardsLayoutWidget.removeFilter();
        },

        searchOldCards: function () {
            this.groupedCardsLayoutWidget.setFilter({
                "_search": "last"
            });
        },

        searchNewCards: function () {
            this.groupedCardsLayoutWidget.setFilter({
                "_search": "old"
            });
        },

        getGroupedCardSelection: function () {
            var cardSelection = this.groupedCardsLayoutWidget.getCardSelection();
            console.log(cardSelection);
        },

        getCarouselCardSelection: function () {
            var cardSelection = this.carouselCardLayoutWidget.getCardSelection();
            console.log(cardSelection);
        },

        setCarouselCardSelection: function () {
            this.carouselCardLayoutWidget.setCardSelection("Tenant1");
            this.carouselCardLayoutWidget.setCardSelection(["Tenant2", "Tenant5"], false);
        },

        disableCarouselCard: function () {
            var isCardDisabled = this.carouselCardLayoutWidget.isDisabled("Tenant2");
            console.log("Previous disabled state: " + isCardDisabled);
            // this.carouselCardLayoutWidget.disable("Tenant2");
            this.carouselCardLayoutWidget.disable(["Tenant2", "Tenant4"]);
            isCardDisabled = this.carouselCardLayoutWidget.isDisabled("Tenant2");
            console.log("Current disabled state: " + isCardDisabled);
        },

        enableCarouselCard: function () {
            // this.carouselCardLayoutWidget.enable("Tenant2");
            this.carouselCardLayoutWidget.enable(["Tenant2", "Tenant4"]);
        },

        getCardSelection: function () {
            var cardSelection = this.cardLayoutWidget.getCardSelection();
            console.log(cardSelection);
        },

        setCardSelection: function () {
            this.cardLayoutWidget.setCardSelection("Tenant1");
            this.cardLayoutWidget.setCardSelection(["Tenant2", "Tenant5"], false);
        },

        toggleCardSelection: function () {
            // this.cardLayoutWidget.toggleCardSelection("Tenant1");
            this.cardLayoutWidget.toggleCardSelection(["Tenant3", "Tenant5"]);
        },

        getLocalCardSelection: function () {
            var cardSelection = this.localCardLayoutWidget.getCardSelection();
            console.log(cardSelection);
        },

        setLocalCardSelection: function () {
            this.localCardLayoutWidget.setCardSelection("Tenant1");
            this.localCardLayoutWidget.setCardSelection(["Tenant2", "Tenant5"], false);
        },

        toggleLocalCardSelection: function () {
            // this.localCardLayoutWidget.toggleCardSelection("Tenant1");
            this.localCardLayoutWidget.toggleCardSelection(["Tenant3", "Tenant5"]);
        },

        showBarCardOnOverlay: function () {
            new BarCardOverlayView();
        },

        addTemplates: function () {
            this.$el.append(cardLayoutExample);
            this.$carouselResponsiveWidthCards = this.$el.find("#carousel-responsive-width-cards");
            this.$barResponsiveWidthCards = this.$el.find("#bar-responsive-width-cards");
            this.$responsiveWidthCards = this.$el.find("#responsive-width-cards");
            this.$localresponsiveWidthCards = this.$el.find("#local-data-responsive-width-cards");
            this.$fixedWidthCards = this.$el.find("#fixed-width-cards");
            this.$groupedCards = this.$el.find("#grouped-cards");
        }

    });

    return CardLayout;
});