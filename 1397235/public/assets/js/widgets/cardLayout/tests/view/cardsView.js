/**
 * A set of views generated from templates and configuration object
 *
 * @module cardsView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'backbone',
    'widgets/cardLayout/tests/conf/cardsConfiguration',
    'lib/template_renderer/template_renderer',
    'text!widgets/cardLayout/tests/templates/cardType1.html',
    'text!widgets/cardLayout/tests/templates/cardType2.html',
    'text!widgets/cardLayout/tests/templates/cardMoreType1.html',
    'text!widgets/cardLayout/tests/templates/cardMoreLongType1.html',
    'text!widgets/cardLayout/tests/templates/cardMoreType2.html',
    'text!widgets/cardLayout/tests/templates/cardTitleIcon.html',
    'text!widgets/cardLayout/tests/templates/barType1.html',
    'lib/dateFormatter/dateFormatter'
], /** @lends CardsView*/
function (Backbone, cardsConfiguration, render_template, cardType1, cardType2, cardMoreType1, cardMorelongType1, cardMoreType2, cardTitleIcon, barType1, dateFormatter) {

    var CardsView = {};

    CardsView.CarouselLayoutView = Backbone.View.extend({

        render: function () {
            var cardId = this.options.data.cardId,
                cardType = this.options.data.cardType == "description" ? cardType1 : cardType2;
            this.$el.append((render_template(cardType, cardsConfiguration[cardId])));
        },

        getTitle: function () {
            var cardId = this.options.data.cardId,
                cardTitle = this.options.id,
                shortTitleIds = ["card3", "card4", "card5", "card6"];
            if (~shortTitleIds.indexOf(cardId)) {
                return cardTitle;
            }
            return cardTitle + " long long long long long long long long long long long long long" + cardTitle;
        },

        getFooter: function () {
            var cardId = this.options.data.cardId,
                cardDate = this.options.data.date;
            if (cardId == "card10") { //footer is available
                return "Last updated " + new Date(cardDate);
            }
            return false;//footer is not available
        },

        getTitleIcon: function () {
            var cardId = this.options.data.cardId,
                cardIcon = this.options.data.cardType == "description" ? "icon_card_success" : "icon_card_error",
                cardTitleIconHtml = render_template(cardTitleIcon, {"icon": cardIcon}),
                shortTitleIds = ["card1", "card2","card3", "card4", "card5"];
            if (~shortTitleIds.indexOf(cardId)) {
                return;
            }
            return cardTitleIconHtml;
        },

        getMoreDetails: function () {
            return CardsView.HoverView1;
        }

    });

    CardsView.BarLayoutView = Backbone.View.extend({

        render: function () {
            this.$el.append(render_template(barType1, {content: this.options.data.content}));
        },

        getTitle: function () {
            var cardId = this.options.data.cardId,
                cardTitle = this.options.data.title,
                shortTitleIds = ["summary1", "summary2", "summary3", "summary4"];
            if (~shortTitleIds.indexOf(cardId)) {
                return cardTitle;
            }
            return cardTitle + " long long long long long long long long long long long long long" + cardTitle;
        },

        getFooter: function () {
            return false;//footer is not available
        }

    });

    CardsView.GridLayoutView1 = Backbone.View.extend({

        render: function () {
            var cardId = this.options.data.cardId,
                cardType = this.options.data.cardType == "description" ? cardType1 : cardType2;
            this.$el.append((render_template(cardType, cardsConfiguration[cardId])));
        },

        getTitle: function () {
            var cardId = this.options.data.cardId,
                cardTitle = this.options.id,
                shortTitleIds = ["card3", "card4", "card5", "card6"];
            if (~shortTitleIds.indexOf(cardId)) {
                return cardTitle;
            }
            return cardTitle + " long long long long long long long long long long long long long" + cardTitle;
        },

        getTitleIcon: function () {
            var cardId = this.options.data.cardId,
                cardIcon = this.options.data.cardType == "description" ? "icon_card_success" : "icon_card_error",
                cardTitleIconHtml = render_template(cardTitleIcon, {"icon": cardIcon}),
                shortTitleIds = ["card2", "card4"];
            if (~shortTitleIds.indexOf(cardId)) {
                return;
            }
            return cardTitleIconHtml;
        },

        getMoreDetails: function () {
            return CardsView.HoverView1;
        }

    });

    CardsView.HoverView1 = Backbone.View.extend({

        render: function () {
            var cardId = this.options.data.cardId,
                cardType = this.options.data.cardType == "description" ? cardId != "card5" ? cardMoreType1 : cardMorelongType1 : cardMoreType2;
            this.$el.append((render_template(cardType, cardsConfiguration[cardId])));
        }

    });

    CardsView.GridLayoutView2 = Backbone.View.extend({

        render: function () {
            var cardId = this.options.data.cardId,
                cardType = this.options.data.cardType == "description" ? cardType1 : cardType2;
            this.$el.append((render_template(cardType, cardsConfiguration[cardId])));
        },

        getTitle: function () {
            var cardTitle = this.options.id;
            return "CardId " + cardTitle;
        },

        getHelpConfiguration: function () {
            if (this.options.data.cardId == "card3") {
                return {
                    "content": "Overwrites tooltip for: " + this.options.data.cardId,
                    "ua-help-text": "More..",
                    "ua-help-identifier": "alias_for_ua_event_binding_card2"
                };
            } else if (this.options.data.cardId == "card4") {
                return {
                    "content": "Overwrites tooltip for: " + this.options.data.cardId,
                    "ua-help-identifier": "alias_for_ua_event_binding_card2"
                };
            } else if (this.options.data.cardId == "card5") {
                return {
                    "content": "Overwrites tooltip for: " + this.options.data.cardId,
                };
            }
        },

        getTitleIcon: function () {
            var cardId = this.options.data.cardId,
                cardIcon = "icon_card_success",
                cardTitleIconHtml = render_template(cardTitleIcon, {"icon": cardIcon});
            if (cardId == "card2") {
                return cardTitleIconHtml;
            }
        },

        getFooter: function () {
            var cardDate = this.options.data.date;
            return "Last updated " + dateFormatter.format(new Date(cardDate), {format: "long"});
        }

    });

    return CardsView;
});