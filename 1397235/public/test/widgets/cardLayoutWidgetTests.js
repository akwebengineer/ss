define([
    'widgets/cardLayout/cardLayoutWidget',
    'widgets/cardLayout/conf/configurationSample',
    'widgets/cardLayout/tests/dataSample/groupedCardsDataMock',
    'widgets/cardLayout/tests/view/cardsView'
], function (CardLayoutWidget, configurationSample, GroupedCardsDataMock, CardsView) {

    describe('CardLayoutWidget - Unit tests:', function () {

        var $el = $('#test_widget'),
            containerId = 0;

        var createContainer = function () {
            var $container = $("<div id = card-layout-container-id" + containerId++ + "></div>");
            $el.append($container);
            return $container;
        };

        new GroupedCardsDataMock().init(); //sets grouped card API response

        describe('Widget Interface', function () {
            before(function () {
                this.$cardLayoutContainer = createContainer();
                this.cardLayoutWidgetObj = new CardLayoutWidget({
                    "container": this.$cardLayoutContainer[0],
                    "options": configurationSample.responsiveCards,
                    "content": CardsView.GridLayoutView1
                }).build();
            });
            after(function () {
                this.cardLayoutWidgetObj.destroy();
            });
            it('should exist', function () {
                this.cardLayoutWidgetObj.should.exist;
            });
            it('build() should exist', function () {
                assert.isFunction(this.cardLayoutWidgetObj.build, 'The card layout widget must have a function named build.');
            });
            it('destroy() should exist', function () {
                assert.isFunction(this.cardLayoutWidgetObj.destroy, 'The card layout widget must have a function named destroy.');
            });
        });

        describe('Template', function () {
            before(function (done) {
                this.$cardLayoutContainer = createContainer();
                this.cardLayoutWidgetObj = new CardLayoutWidget({
                    "container": this.$cardLayoutContainer[0],
                    "options": configurationSample.responsiveCards,
                    "content": CardsView.CarouselLayoutView
                }).build();
                this.$cardLayoutContainer.bind("slipstreamCardLayout.cardsView:onRenderComplete", function () { //waits for cards view to be rendered
                    done();
                });
            });
            after(function () {
                this.cardLayoutWidgetObj.destroy();
            });
            it('should contain the card-layout-widget class for cardLayout container', function () {
                assert.isTrue(this.$cardLayoutContainer.find('.card-layout-widget').length > 0, "the card layout widget container is available");
            });
            it('should contain cards', function () {
                assert.isTrue(this.$cardLayoutContainer.find('.card-view').length == 12, "the card container is available");
            });
            it('should contain a card content', function () {
                assert.isTrue(this.$cardLayoutContainer.find('.card-content').length == 12, "the card content container is available");
            });

            //PR-1358038
            //Tooltipster library can't render svg tooltip properly in the unit test.
            // it('should contain a card title with help icon', function () {
            //     assert.isTrue(this.$cardLayoutContainer.find(".subtitle .tooltipstered").length == 1, "a subtitle with help tooltip is available");
            //     assert.isTrue(this.$cardLayoutContainer.find(".card-view#Tenant2 .tooltipstered").length == 1, "a card with a title with help tooltip is available");
            // });

        });

        describe('Card View', function () {
            before(function (done) {
                var self = this;
                this.$cardLayoutContainer = createContainer();
                this.cardLayoutWidgetObj = new CardLayoutWidget({
                    "container": this.$cardLayoutContainer[0],
                    "options": configurationSample.fixedCards,
                    "content": CardsView.GridLayoutView2
                }).build();
                this.$cardLayoutContainer.bind("slipstreamCardLayout.cardsView:onRenderComplete", function () { //waits for cards view to be rendered
                    self.cards = self.$cardLayoutContainer.find('.card-view');
                    done();
                });
            });
            after(function () {
                this.cardLayoutWidgetObj.destroy();
            });
            it('should contain the title defined in the getTitle method', function () {
                var $cardViewTitle = this.cards.eq(1).find(".card-title");
                assert.equal($cardViewTitle.text().trim(), "CardId card2", "the card title matches the one defined in the card view");
            });
            //PR-1358038
            //Tooltipster library can't render svg tooltip properly in the unit test.
            // it('should contain the help property defined in the getHelpConfiguration method', function () {
            //     var $cardViewHelp = this.cards.eq(1).find(".ua-field-help");
            //     assert.isTrue($cardViewHelp.hasClass("tooltipstered"), "the card help has a tooltip");
            //     assert.equal($cardViewHelp.attr("data-ua-id"), "alias_for_ua_event_binding_card2", "the card help has the assigned help identifier");
            // });
            it('should contain the icon (html) defined in the getTitleIcon method', function () {
                var $cardViewTitleIcon = this.cards.eq(1).find(".card-icon > svg");
                assert.isTrue($cardViewTitleIcon[0].className.baseVal == "card_icon_card_success", "the icon area of the card title was updated with the content provided by getTitleIcon method of the card view");
            });
        });

        describe('Card Layout', function () {
            describe('Carousel', function () {
                before(function (done) {
                    this.$cardLayoutContainer = createContainer();
                    this.cardLayoutWidgetObj = new CardLayoutWidget({
                        "container": this.$cardLayoutContainer[0],
                        "options": configurationSample.carouselResponsiveCards,
                        "content": CardsView.CarouselLayoutView
                    }).build();
                    this.$cardLayoutContainer
                        .bind("slipstreamCardLayout.cardsView:onRenderComplete", function () { //waits for cards view to be rendered
                            done();
                        });
                });
                after(function () {
                    this.cardLayoutWidgetObj.destroy();
                    this.$cardLayoutContainer.remove();
                });
                it('should contain the carousel-layout class for cardLayout container', function () {
                    assert.isTrue(this.$cardLayoutContainer.find('.carousel-layout').length > 0, "the card layout widget container is available");
                });
                it('should contain cards', function () {
                    assert.isTrue(this.$cardLayoutContainer.find('.card-view').length == 12, "the card container is available");
                });
                it('should contain a card content', function () {
                    assert.isTrue(this.$cardLayoutContainer.find('.card-content').length == 12, "the card content container is available");
                });
                it('should contain an enabled card', function () {
                    var tenant3 = this.$cardLayoutContainer.find('#Tenant3');
                    assert.isUndefined(tenant3.attr("disabled"), "the card is enabled");
                });
                it('should contain a disabled card', function () {
                    var tenant4 = this.$cardLayoutContainer.find('#Tenant4');
                    assert.equal(tenant4.attr("disabled"), "disabled", "the card is disabled");
                });
                it('should not contain footer when getFooter returns false', function () {
                    var tenant1 = this.$cardLayoutContainer.find('#Tenant1');
                    assert.equal(tenant1.find(".card-footer").length, 0, "the card does not have a footer");
                });
                it('should contain footer when getFooter returns a html string', function () {
                    var tenant1 = this.$cardLayoutContainer.find('#Tenant10');
                    assert.equal(tenant1.find(".card-footer").length, 1, "the card has a footer");
                });
            });
            describe('Bar', function () {
                before(function (done) {
                    this.$cardLayoutContainer = createContainer();
                    this.$cardLayoutContainer.bind("slipstreamCardLayout.cardsView:onRenderComplete", function () { //waits for cards view to be rendered
                        done();
                    });
                    this.cardLayoutWidgetObj = new CardLayoutWidget({
                        "container": this.$cardLayoutContainer[0],
                        "options": configurationSample.localBarResponsiveCards,
                        "content": CardsView.BarLayoutView
                    }).build();

                });
                after(function () {
                    this.cardLayoutWidgetObj.destroy();
                    this.$cardLayoutContainer.remove();
                });
                it('should contain the carousel-layout class for cardLayout container', function () {
                    assert.isTrue(this.$cardLayoutContainer.find('.carousel-bar').length > 0, "the card layout widget container is available");
                });
                it('should contain cards', function () {
                    assert.isTrue(this.$cardLayoutContainer.find('.card-view').length == 18, "the card container is available");
                });
                it('should contain a card content', function () {
                    assert.isTrue(this.$cardLayoutContainer.find('.card-content').length == 18, "the card content container is available");
                });
                it('should not contain footer', function () {
                    var tenant1 = this.$cardLayoutContainer.find('#summary1');
                    assert.equal(tenant1.find(".card-footer").length, 0, "the card does not have a footer");
                });
            });
            describe('Grid - Remote data', function () {
                before(function (done) {
                    this.$cardLayoutContainer = createContainer();
                    this.cardLayoutWidgetObj = new CardLayoutWidget({
                        "container": this.$cardLayoutContainer[0],
                        "options": configurationSample.responsiveCards,
                        "content": CardsView.GridLayoutView2
                    }).build();
                    this.$cardLayoutContainer
                        .bind("slipstreamCardLayout.cardsView:onRenderComplete", function () { //waits for cards view to be rendered
                            done();
                        });
                });
                after(function () {
                    this.cardLayoutWidgetObj.destroy();
                });
                it('should contain the grid-layout class for cardLayout container', function () {
                    assert.isTrue(this.$cardLayoutContainer.find('.grid-layout').length > 0, "the card layout widget container is available");
                });
                it('should contain cards', function () {
                    assert.isTrue(this.$cardLayoutContainer.find('.card-view').length == 12, "the card container is available");
                });
                it('should contain a card content', function () {
                    assert.isTrue(this.$cardLayoutContainer.find('.card-content').length == 12, "the card content container is available");
                });
            });
            describe('Grid - Local data', function () {
                before(function (done) {
                    this.$cardLayoutContainer = createContainer();
                    this.$cardLayoutContainer
                        .bind("slipstreamCardLayout.cardsView:onRenderComplete", function () { //waits for cards view to be rendered
                            done();
                        });
                    this.cardLayoutWidgetObj = new CardLayoutWidget({
                        "container": this.$cardLayoutContainer[0],
                        "options": configurationSample.localResponsiveCards,
                        "content": CardsView.GridLayoutView2
                    }).build();
                });
                after(function () {
                    this.cardLayoutWidgetObj.destroy();
                });
                it('should contain the grid-layout class for cardLayout container', function () {
                    assert.isTrue(this.$cardLayoutContainer.find('.grid-layout').length > 0, "the card layout widget container is available");
                });
                it('should contain cards', function () {
                    assert.isTrue(this.$cardLayoutContainer.find('.card-view').length == 12, "the card container is available");
                });
                it('should contain a card content', function () {
                    assert.isTrue(this.$cardLayoutContainer.find('.card-content').length == 12, "the card content container is available");
                });
            });
            describe('Grid - Grouped', function () {
                before(function (done) {
                    this.$cardLayoutContainer = createContainer();
                    this.cardLayoutWidgetObj = new CardLayoutWidget({
                        "container": this.$cardLayoutContainer[0],
                        "options": configurationSample.groupedCards,
                        "content": CardsView.GridLayoutView1
                    }).build();
                    this.$cardLayoutContainer
                        .bind("slipstreamCardLayout.cardsView:onRenderComplete", function () { //waits for cards view to be rendered
                            done();
                        });
                });
                after(function () {
                    this.cardLayoutWidgetObj.destroy();
                });
                it('should contain the grid-layout class for cardLayout container', function () {
                    assert.isTrue(this.$cardLayoutContainer.find(".grid-layout").length > 0, "the card layout widget container is available");
                });
                it('should contain grouped cards', function () {
                    var $cardGroups = this.$cardLayoutContainer.find(".card-group");
                    assert.equal($cardGroups.length, 3, "the cards are grouped");
                    assert.equal($cardGroups.eq(0).find(".grid-layout").length, 1, "each card has a grid layout applied");
                });
                it('should contain a card content', function () {
                    assert.equal(this.$cardLayoutContainer.find(".card-content").length, 12, "the card content container is available");
                });
                it('should contain cards with group tittle and help', function () {
                    var $groupTitle = this.$cardLayoutContainer.find(".card-group").eq(0).find(".group-title"),
                        $helpGroupTitle = $groupTitle.find(".help-widget");
                    assert.equal($groupTitle.text().trim(), "Group group1", "the card title is set");
                    assert.isTrue($helpGroupTitle.hasClass("help-widget"), "the help widget is available for the group title");
                });
                it('should contain groups with toggleable content', function () {
                    var $group = this.$cardLayoutContainer.find(".card-group").eq(0),
                        $groupTitleWrapper = $group.find(".card-group-title"),
                        $groupCarat = $groupTitleWrapper.find(".group-carat"),
                        $groupTitle = $groupTitleWrapper.find(".group-title"),
                        $groupContent = $group.find(".card-group-content");

                    assert.notEqual($groupContent.css("display"), "none", "the card content is visible");

                    //toggle group content (hide)
                    $groupCarat.trigger("click");
                    assert.equal($groupContent.css("display"), "none", "the card content is not visible after the group carat has been clicked");

                    //toggle group content (show)
                    $groupTitle.trigger("click");
                    assert.notEqual($groupContent.css("display"), "none", "the card content is visible after the group title has been clicked");
                });
            });
        });

        describe('Card Selection', function () {
            describe('Card Multi Selection', function () {
                before(function (done) {
                    var cardOptionsConfiguration = _.extend({}, configurationSample.responsiveCards);
                    cardOptionsConfiguration.cardSelection = "multi";
                    this.$cardLayoutContainer = createContainer();
                    this.cardLayoutWidgetObj = new CardLayoutWidget({
                        "container": this.$cardLayoutContainer[0],
                        "options": cardOptionsConfiguration,
                        "content": CardsView.GridLayoutView2
                    }).build();
                    this.$cardLayoutContainer
                        .bind("slipstreamCardLayout.cardsView:onRenderComplete", function () { //waits for cards view to be rendered
                            done();
                        });
                });
                after(function () {
                    this.cardLayoutWidgetObj.destroy();
                });
                it('should select a card', function () {
                    var cardsContainer = this.$cardLayoutContainer.find(".card-view-wrapper");
                    this.$cardLayoutContainer.bind("slipstreamCardLayout.cardSelection", function (e, cardSelection) {
                        assert.isTrue(_.isObject(cardSelection), "the Object with the cardSelection is available");
                        assert.isTrue(_.isObject(cardSelection.cardsSelected), "the Object with the cardSelection is available");
                        assert.isTrue(_.isNumber(cardSelection.numberOfCardsSelected), "the Object with the cardSelection is available");
                    });
                    var $card1 = cardsContainer.eq(0);
                    $card1.trigger("click");
                    assert.isTrue($card1.hasClass("selected"), "the card was selected");
                    $card1.trigger("click");
                    assert.isFalse($card1.hasClass("selected"), "the card was deselected");
                    this.$cardLayoutContainer.unbind("slipstreamCardLayout.cardSelection");
                });
                it('should select multiple cards', function () {
                    var cardsContainer = this.$cardLayoutContainer.find(".card-view-wrapper"),
                        $card1 = cardsContainer.eq(0),
                        $card2 = cardsContainer.eq(1);
                    $card1.trigger("click");
                    assert.isTrue($card1.hasClass("selected"), "the card was selected");
                    this.$cardLayoutContainer.bind("slipstreamCardLayout.cardSelection", function (e, cardSelection) {
                        assert.isTrue(_.isObject(cardSelection), "the Object with the cardSelection is available");
                        assert.isTrue(_.isObject(cardSelection.cardsSelected), "the Object with the cardSelection is available");
                        assert.isTrue(cardSelection.numberOfCardsSelected == 2, "the Object with the cardSelection is available");
                    });
                    $card2.trigger("click");
                    assert.isTrue($card2.hasClass("selected"), "the card was selected");
                    var numberOfCardsSelected = this.cardLayoutWidgetObj.getCardSelection().numberOfCardsSelected;
                    assert.isTrue(numberOfCardsSelected == 2, "the Object with the cardSelection is available");
                    this.$cardLayoutContainer.unbind("slipstreamCardLayout.cardSelection");
                });
                it('should select and deselect programmatically multiple cards', function () {
                    var initialNumberOfCardsSelected = this.cardLayoutWidgetObj.getCardSelection().numberOfCardsSelected;
                    //select cards (string)
                    this.cardLayoutWidgetObj.setCardSelection("Tenant5", true);
                    var currentNumberOfCardsSelected = this.cardLayoutWidgetObj.getCardSelection().numberOfCardsSelected;
                    assert.isTrue(initialNumberOfCardsSelected + 1 == currentNumberOfCardsSelected, "the cards were selected after setCardSelection, true status");
                    //deselect cards
                    this.cardLayoutWidgetObj.setCardSelection("Tenant5", false);
                    currentNumberOfCardsSelected = this.cardLayoutWidgetObj.getCardSelection().numberOfCardsSelected;
                    assert.isTrue(initialNumberOfCardsSelected == currentNumberOfCardsSelected, "the cards were deselected after setCardSelection, false status");
                    //select cards (array)
                    this.cardLayoutWidgetObj.setCardSelection(["Tenant6", "Tenant7"]);
                    currentNumberOfCardsSelected = this.cardLayoutWidgetObj.getCardSelection().numberOfCardsSelected;
                    assert.isTrue(initialNumberOfCardsSelected + 2 == currentNumberOfCardsSelected, "the cards were selected after setCardSelection, default (true) status");
                    //toggle cards (array)
                    initialNumberOfCardsSelected = this.cardLayoutWidgetObj.getCardSelection().numberOfCardsSelected;
                    this.cardLayoutWidgetObj.toggleCardSelection(["Tenant6", "Tenant7"]);
                    currentNumberOfCardsSelected = this.cardLayoutWidgetObj.getCardSelection().numberOfCardsSelected;
                    assert.isTrue(initialNumberOfCardsSelected - 2 == currentNumberOfCardsSelected, "the cards were toggled after toggleCardSelection");
                });
            });
            describe('Card Single Selection', function () {
                before(function (done) {
                    var cardOptionsConfiguration = _.extend({}, configurationSample.responsiveCards);
                    cardOptionsConfiguration.cardSelection = "single";
                    this.$cardLayoutContainer = createContainer();
                    this.cardLayoutWidgetObj = new CardLayoutWidget({
                        "container": this.$cardLayoutContainer[0],
                        "options": cardOptionsConfiguration,
                        "content": CardsView.GridLayoutView2
                    }).build();
                    this.$cardLayoutContainer
                        .bind("slipstreamCardLayout.cardsView:onRenderComplete", function () { //waits for cards view to be rendered
                            done();
                        });
                });
                after(function () {
                    this.cardLayoutWidgetObj.destroy();
                });
                it('should select a card', function () {
                    var cardsContainer = this.$cardLayoutContainer.find(".card-view-wrapper");
                    this.$cardLayoutContainer.bind("slipstreamCardLayout.cardSelection", function (e, cardSelection) {
                        assert.isTrue(_.isObject(cardSelection), "the Object with the cardSelection is available");
                        assert.isTrue(_.isObject(cardSelection.cardsSelected), "the Object with the cardSelection is available");
                        assert.isTrue(_.isNumber(cardSelection.numberOfCardsSelected), "the Object with the cardSelection is available");
                    });
                    var $card1 = cardsContainer.eq(0);
                    //select card
                    $card1.trigger("click");
                    assert.isTrue($card1.hasClass("selected"), "the card was selected");
                    var numberOfCardsSelected = this.cardLayoutWidgetObj.getCardSelection().numberOfCardsSelected;
                    assert.isTrue(numberOfCardsSelected == 1, "the Object with the cardSelection is available and one card was selected");
                    //deselect card
                    $card1.trigger("click");
                    assert.isFalse($card1.hasClass("selected"), "the card was deselected");
                    numberOfCardsSelected = this.cardLayoutWidgetObj.getCardSelection().numberOfCardsSelected;
                    assert.isTrue(numberOfCardsSelected == 0, "the Object with the cardSelection is available and none card was selected");
                    this.$cardLayoutContainer.unbind("slipstreamCardLayout.cardSelection");
                });
                it('should select single card', function () {
                    var cardsContainer = this.$cardLayoutContainer.find(".card-view-wrapper"),
                        $card1 = cardsContainer.eq(0),
                        $card2 = cardsContainer.eq(1);
                    $card1.trigger("click");
                    assert.isTrue($card1.hasClass("selected"), "the card was selected");
                    this.$cardLayoutContainer.bind("slipstreamCardLayout.cardSelection", function (e, cardSelection) {
                        assert.isTrue(_.isObject(cardSelection), "the Object with the cardSelection is available");
                        assert.isTrue(_.isObject(cardSelection.cardsSelected), "the Object with the cardSelection is available");
                        assert.isTrue(cardSelection.numberOfCardsSelected == 1, "the Object with the cardSelection is available");
                    });
                    $card2.trigger("click");
                    assert.isFalse($card1.hasClass("selected"), "the card was deselected");
                    assert.isTrue($card2.hasClass("selected"), "the card was selected");
                    this.$cardLayoutContainer.unbind("slipstreamCardLayout.cardSelection");
                });
                it('should select and deselect programmatically single card', function () {
                    //select card
                    this.cardLayoutWidgetObj.setCardSelection("Tenant5", true);
                    var currentNumberOfCardsSelected = this.cardLayoutWidgetObj.getCardSelection().numberOfCardsSelected;
                    assert.isTrue(currentNumberOfCardsSelected == 1, "the cards was selected after setCardSelection, true status");
                    //deselect card
                    this.cardLayoutWidgetObj.setCardSelection("Tenant5", false);
                    currentNumberOfCardsSelected = this.cardLayoutWidgetObj.getCardSelection().numberOfCardsSelected;
                    assert.isTrue(currentNumberOfCardsSelected == 0, "the cards were deselected after setCardSelection, false status");
                    //toggle card
                    this.cardLayoutWidgetObj.toggleCardSelection(["Tenant6"]);
                    currentNumberOfCardsSelected = this.cardLayoutWidgetObj.getCardSelection().numberOfCardsSelected;
                    assert.isTrue(currentNumberOfCardsSelected == 1, "a card was toggled after toggleCardSelection");
                });
            });
            describe('Card None Selection', function () {
                before(function (done) {
                    var cardOptionsConfiguration = _.extend({}, configurationSample.responsiveCards);
                    cardOptionsConfiguration.cardSelection = "none";
                    this.$cardLayoutContainer = createContainer();
                    this.cardLayoutWidgetObj = new CardLayoutWidget({
                        "container": this.$cardLayoutContainer[0],
                        "options": cardOptionsConfiguration,
                        "content": CardsView.GridLayoutView2
                    }).build();
                    this.$cardLayoutContainer
                        .bind("slipstreamCardLayout.cardsView:onRenderComplete", function () { //waits for cards view to be rendered
                            done();
                        });
                });
                after(function () {
                    this.cardLayoutWidgetObj.destroy();
                });
                it('should not select a card', function () {
                    var cardsContainer = this.$cardLayoutContainer.find(".card-view-wrapper");
                    var $card1 = cardsContainer.eq(0);
                    $card1.trigger("click");
                    assert.isFalse($card1.hasClass("selected"), "the card was not selected");
                });
            });
        });

        describe('Card More Details', function () {
            before(function (done) {
                var cardOptionsConfiguration = _.extend({}, configurationSample.responsiveCards);
                this.$cardLayoutContainer = createContainer();
                this.cardLayoutWidgetObj = new CardLayoutWidget({
                    "container": this.$cardLayoutContainer[0],
                    "options": cardOptionsConfiguration,
                    "content": CardsView.GridLayoutView1
                }).build();
                this.$cardLayoutContainer
                    .bind("slipstreamCardLayout.cardsView:onRenderComplete", function () { //waits for cards view to be rendered
                        done();
                    });
            });
            after(function () {
                this.cardLayoutWidgetObj.destroy();
            });
            it('should show more details view', function () {
                var cardsContainer = this.$cardLayoutContainer.find(".card-view-wrapper"),
                    cardView = new CardsView.GridLayoutView1(),
                    $card1 = cardsContainer.eq(0),
                    $cardContent1 = $card1.find(".card-content"),
                    $moreDetailsCard1 = $card1.find(".card-details"),
                    $moreLinkCard1 = $card1.find(".card-details-link"),
                    $cardMoreDetailsLink1 = $moreLinkCard1.find(".more-details"),
                    $cardLessDetailsLink1 = $moreLinkCard1.find(".less-details");

                assert.isTrue($cardContent1.css("display") != "none", "the regular card view is available for the card");
                assert.isTrue($moreDetailsCard1.css("display") == "none", "the more details view is NOT available for the card");

                assert.isFunction(cardView.getMoreDetails, "the card view implements the getMoreDetails method");
                assert.isTrue($cardMoreDetailsLink1.css("display") != "none", "the more details link is available for the card");
                assert.isTrue($cardLessDetailsLink1.css("display") == "none", "the less details link is NOT available for the card");

                $cardMoreDetailsLink1.trigger("click");
                assert.isFalse($cardContent1.css("display") != "none", "the regular card view is NOT available for the card");
                assert.isFalse($moreDetailsCard1.css("display") == "none", "the more details view is available for the card");
                assert.isFalse($cardMoreDetailsLink1.css("display") != "none", "the more details link is NOT available for the card");
                assert.isFalse($cardLessDetailsLink1.css("display") == "none", "the less details link is available for the card");

                $cardLessDetailsLink1.trigger("click");
            });
        });

        describe('Card Enable/Disable Programmatically', function () {
            before(function (done) {
                var cardOptionsConfiguration = _.extend({}, configurationSample.responsiveCards);
                this.$cardLayoutContainer = createContainer();
                this.cardLayoutWidgetObj = new CardLayoutWidget({
                    "container": this.$cardLayoutContainer[0],
                    "options": cardOptionsConfiguration,
                    "content": CardsView.GridLayoutView1
                }).build();
                this.$cardLayoutContainer
                    .bind("slipstreamCardLayout.cardsView:onRenderComplete", function () { //waits for cards view to be rendered
                        done();
                    });
            });
            after(function () {
                this.cardLayoutWidgetObj.destroy();
            });
            it('should disable a card', function () {
                var cardId = "Tenant1",
                    $card = this.$cardLayoutContainer.find("#" + cardId),
                    $cardContent = $card.find(".card-content");
                assert.isFalse(this.cardLayoutWidgetObj.isDisabled(cardId), "the card is enabled");
                assert.isFalse($card.find(".ua-field-help.disabled").length > 0, "Help icon is disabled");
                assert.isFalse($cardContent.find(".slipstream_card_widget_disabled").length > 0, "Card content is not marked as disabled");

                this.cardLayoutWidgetObj.disable(cardId);
                assert.isTrue(this.cardLayoutWidgetObj.isDisabled(cardId), "the card is disabled");

                //PR-1358038
                //Tooltipster library can't render svg tooltip properly in the unit test.
                // assert.isTrue($card.find(".ua-field-help.disabled").length > 0, "Help icon is disabled");
                assert.isTrue($cardContent.find(".slipstream_card_widget_disabled").length > 0, "Card content is marked as disabled");
            });
            it('should enable a card', function () {
                var cardId = "Tenant2",
                    $card = this.$cardLayoutContainer.find("#" + cardId),
                    $cardContent = $card.find(".card-content");
                this.cardLayoutWidgetObj.disable(cardId);
                assert.isTrue(this.cardLayoutWidgetObj.isDisabled(cardId), "the card is disabled");

                //PR-1358038
                //Tooltipster library can't render svg tooltip properly in the unit test.
                // assert.isTrue($card.find(".ua-field-help.disabled").length > 0, "Help icon is disabled");
                assert.isTrue($cardContent.find(".slipstream_card_widget_disabled").length > 0, "Card content is marked as disabled");

                this.cardLayoutWidgetObj.enable(cardId);
                assert.isFalse(this.cardLayoutWidgetObj.isDisabled(cardId), "the card is enabled");
                assert.isFalse($card.find(".ua-field-help.disabled").length > 0, "Help icon is enabled");
                assert.isFalse($cardContent.find(".slipstream_card_widget_disabled").length > 0, "Card content is not marked as disabled");

            });
        });
    });
});
