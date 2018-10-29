/**
 * A module that implements a view for displaying a card from the card model
 *
 * @module CardView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
    "marionette",
    "text!widgets/cardLayout/templates/card.html",
    "widgets/help/helpWidget"
], /** @lends CardsView*/
function (Marionette, card, HelpWidget) {

    //view for each card
    var CardView = Marionette.ItemView.extend({
        template: card,
        events: function () {
            var cardEvents = {
                "click .card-details-link a": "toggleDetailsView"
            };
            if (this.options.hasCardSelection) {
                _.extend(cardEvents, {
                    "click": "toggleCardSelection"
                });
            }
            return cardEvents;
        },
        initialize: function (options) {
            if (this.options.hasCardSelection) {
                this.listenTo(this.model, "selected", this.onCardSelected);
                this.listenTo(this.model, "deselected", this.onCardDeselected);
            }
        },
        onRender: function () {
            var cardData = this.options.model.attributes,
                CardContentView = this.options.content;
            this.cardContent = new CardContentView({
                id: cardData.cardId,
                data: cardData
            });
            this.cardContent.render();
            this.containers = {
                $cardView: this.$el.find(".card-view"),
                $cardTitle: this.$el.find(".card-title-wrapper"),
                $cardContentWrapper: this.$el.find(".card-content-wrapper"),
                $cardContent: this.$el.find(".card-content")
            };
            if (this.model.get("disabled")) {
                this.cardContent.$el.addClass("slipstream_card_widget_disabled");
            }
            this.containers.$cardContent.append(this.cardContent.$el);

            //update card content
            this.setTitle();
            this.updateTitleHelp();
            this.setTitleIcon();
            this.updateFooter();
        },
        setTitle: function () {
            if (this.cardContent.getTitle) {
                this.containers.$cardTitle.find(".card-title").empty().append(this.cardContent.getTitle());
            }
        },
        updateTitleHelp: function () {
            var helpConf = this.options.model.attributes.help,
                $help = this.containers.$cardTitle.find(".card-help");
            if (this.cardContent.getHelpConfiguration) { //if getHelpConfiguration is implemented, then it will be used instead of default help configuration
                var cardContentHelp = this.cardContent.getHelpConfiguration();
                if (_.isObject(cardContentHelp)) {
                    helpConf = cardContentHelp;
                }
            }
            if (!_.isEmpty(helpConf)) {
                this.helpInstance = new HelpWidget({
                    "container": $help,
                    "view": helpConf
                }).build();
                if (this.model.get("disabled")) {
                    this.helpInstance.disable();
                }
            } else {
                $help.hide();
            }
        },
        setTitleIcon: function () {
            if (this.cardContent.getTitleIcon) {
                var iconHtml = this.cardContent.getTitleIcon();
                if (!_.isUndefined(iconHtml)) {
                    this.containers.$cardTitle.find(".card-icon")
                        .addClass("icon-content")
                        .html(iconHtml);
                }
            }
        },
        updateFooter: function () {
            this.containers.$cardFooter = this.$el.find(".card-footer");
            this.containers.$cardDate = this.containers.$cardFooter.find(".card-date");
            this.containers.$cardDetails = this.containers.$cardFooter.find(".card-details-link");
            if (this.cardContent.getFooter) {
                var footer = this.cardContent.getFooter();
                if (_.isBoolean(footer)) {
                    if (!footer) {//if no footer is needed, then remove container, otherwise, no action is taken so the default card footer is kept
                        this.containers.$cardFooter.remove();
                        this.containers.$cardContentWrapper.addClass("no-footer");
                    }
                } else {
                    this.containers.$cardDate.empty().append(this.cardContent.getFooter());
                }
            }
            if (this.cardContent.getMoreDetails) {
                this.containers.$cardDetails = this.$el.find(".card-details");
            } else {
                this.containers.$cardDate.addClass("non-details");
                this.containers.$cardDetails.hide();
            }
        },
        toggleDetailsView: function (event) {
            if (!this.model.get("disabled")) {//if card is not disabled
                event.stopPropagation();
                var $cardDetailsLink = $(event.target),
                    cardData = this.options.model.attributes;
                if ($cardDetailsLink.hasClass("more-details")) {
                    if (this.containers.$cardDetails.is(":empty")) {
                        var cardDetailsView = this.cardContent.getMoreDetails(),
                            cardDetailsViewInstance = new cardDetailsView({
                                id: cardData.cardId,
                                data: cardData
                            });
                        cardDetailsViewInstance.render();
                        this.containers.$cardDetails.append(cardDetailsViewInstance.$el);
                    }
                }
                this.$el.toggleClass("card-details-view");
                this.$el.find(".card-content-wrapper > div").toggleClass("hide-container");
                this.containers.$cardFooter.find(".card-details-link > a").toggleClass("hide-container");
            }
        },
        toggleCardSelection: function () {
            if (!this.model.get("disabled")) { //if card is not disabled
                this.model.toggleSelected();
                this.model.collection.setCardSelectionHash(this.model);
                this.triggerCardSelection();
            }
        },
        onCardSelected: function () {
            this.$el.addClass("selected");
        },
        onCardDeselected: function () {
            this.$el.removeClass("selected");
        },
        triggerCardSelection: function () {
            var cardSelection = this.model.collection.getCardSelection();
            this.$el.trigger("slipstreamCardLayout.cardSelection", cardSelection);
        },
        setCardState: function (state) { //state true: disables a card
            this.containers.$cardView.attr("disabled", state);
            if (state) { //sets disable
                this.helpInstance && this.helpInstance.disable();
                this.containers.$cardContent.find("> div").addClass("slipstream_card_widget_disabled");
            } else {
                this.helpInstance && this.helpInstance.enable();
                this.containers.$cardContent.find("> div").removeClass("slipstream_card_widget_disabled");
            }
        }
    });

    return CardView;
});