/**
 * A module that implements a view for displaying cards from the card collection using a responsive layout
 *
 * @module CardsView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
    "marionette",
    'lib/template_renderer/template_renderer',
    "widgets/cardLayout/views/cardView",
    "text!widgets/cardLayout/templates/cards.html",
    "text!widgets/cardLayout/templates/cardsGroup.html",
    "widgets/cardLayout/layout/carouselBuilder",
    "widgets/cardLayout/layout/gridBuilder",
    "widgets/help/helpWidget"
], /** @lends CardsView*/
function (Marionette, render_template, CardView, cards, cardsGroup, CarouselBuilder, GridBuilder, HelpWidget) {

    var cardWidthError = "The width of a card that is defined in percentage should be a number that ends on '%'";

    //view for the cards layout
    var CardsView = Marionette.CompositeView.extend({
        template: cards,
        itemView: CardView,
        itemViewOptions: function () {
            var hasCardSelection = _.isString(this.options.configuration.cardSelection) && this.options.configuration.cardSelection != "none" ? true : false;
            return {
                "content": this.options.content,
                "configuration": this.options.configuration,
                "hasCardSelection": hasCardSelection
            };
        },
        events: {
            "click .card-group-title": "toggleGroup"
        },
        initialize: function (options) {
            this.listenTo(this.collection, "update", this.updateCardsView);
            if (this.options.configuration.layout != "carousel") { //grid layout
                this.gridBuilderInstance = {};
            }
        },
        appendHtml: function (collectionView, itemView, index) {
            var $cardsViewContainer = this.getItemViewContainer(collectionView),
                groupConfiguration = this.options.configuration.group,
                cardViewContent = itemView.$el;

            //adds card groups (if) or (else) adds cards individually to the $cardsViewContainer (main container)
            if (groupConfiguration && groupConfiguration.id) {
                var groupId = itemView.model.get(groupConfiguration.id),
                    groupClass = ".card-group[data-group=" + groupId + "]",
                    $groupContainer = $cardsViewContainer.find(groupClass);
                if (!$groupContainer.length) {
                    var groupTitleObj = this.getGroupTitle(groupId, groupConfiguration),
                        cardGroupContent = render_template(cardsGroup, {
                            "group": groupId,
                            "title": groupTitleObj.content
                        });
                    $groupContainer = $cardsViewContainer.append(cardGroupContent).find(groupClass);
                    this.setGroupTitleHelp(groupTitleObj, $groupContainer);
                }
                // Append the card content to its group
                $groupContainer.find(".card-group-content").append(cardViewContent);
            } else {
                $cardsViewContainer.append(cardViewContent);
            }
            this.collectionView = collectionView;
        },
        updateCardsView: function () {//invoked when all views (cards) in this composite view are rendered
            this.collection.length && this.setCardLayout();
        },
        setCardState: function (cardIds, state) {
            var self = this,
                cardModel, cardView;
            cardIds = _.isString(cardIds) ? [cardIds] : cardIds;
            cardIds.forEach(function (cardId) {
                cardModel = self.collection.get(cardId);
                cardView = self.collectionView.children.findByModel(cardModel);
                cardView.setCardState(state);
            });
        },
        getGroupTitle: function (groupId, groupConfiguration) {
            var groupTitle = {
                    "content": groupId
                },
                groupTitleCallbackObj;
            if (_.isFunction(groupConfiguration.title)) {
                groupTitleCallbackObj = groupConfiguration.title(groupId);
                if (_.isObject(groupTitleCallbackObj)) {
                    if (groupTitleCallbackObj.content) {
                        groupTitle.content = groupTitleCallbackObj.content;
                    }
                    if (groupTitleCallbackObj.help) {
                        groupTitle.help = groupTitleCallbackObj.help;
                    }
                }
            }
            return groupTitle;
        },
        setGroupTitleHelp: function (groupTitleObj, $groupContainer) {
            if (_.isObject(groupTitleObj.help)) {
                new HelpWidget({
                    "container": $groupContainer.find(".group-title"),
                    "view": groupTitleObj.help
                }).build();
            }
        },
        setCardLayout: function () {
            var cardSetting = {
                cardHeight: this.options.configuration.cardSize.height,
                cardWidth: this.options.configuration.cardSize.width,
                cardMinWidth: this.options.configuration.cardSize["min-width"],
                cardMaxWidth: this.options.configuration.cardSize["max-width"],
                isWidthResponsive: _.isString(this.options.configuration.cardSize.width) && ~this.options.configuration.cardSize.width.indexOf("%") ? true : false,
                cardSelector: "card-view-wrapper"
            };
            if (cardSetting.isWidthResponsive && isNaN(cardSetting.cardWidth.split("%")[0])) {
                throw new Error(cardWidthError);
            }
            switch (this.options.configuration.layout) {
                case "carousel": //carousel style
                    new CarouselBuilder(this.$el).setCardLayout(cardSetting);
                    break;
                case "bar":// bar style
                    this.$el.addClass("carousel-bar");
                    new CarouselBuilder(this.$el).setCardLayout(cardSetting);
                    break;
                default://defaults to grid layout
                    this.setCardGridLayout(cardSetting);
            }
        },
        setCardGridLayout: function (cardSetting) {
            if (this.options.configuration.group) {
                var self = this;
                //restores card html
                if (!_.isEmpty(this.gridBuilderInstance)) {
                    for (var groupKey in this.gridBuilderInstance) {
                        this.gridBuilderInstance[groupKey].destroy();
                    }
                    this.gridBuilderInstance = {};
                }
                //sets the grid layout for each card group
                this.$el.find(".card-group").each(function () {
                    var $cardGroup = $(this),
                        groupId = $cardGroup.data("group"),
                        $cardGroupContent = $cardGroup.find(".card-group-content");
                    if ($cardGroupContent.find(":not('.card-sizer')").length) {
                        self.gridBuilderInstance[groupId] = new GridBuilder($cardGroupContent);
                        self.gridBuilderInstance[groupId].setCardLayout(cardSetting);
                    } else {
                        $cardGroup.remove(); //removes group title without cards
                    }
                });
            } else {
                !_.isEmpty(this.gridBuilderInstance) && this.gridBuilderInstance.destroy();
                this.gridBuilderInstance = new GridBuilder(this.$el);
                this.gridBuilderInstance.setCardLayout(cardSetting);
            }
        },
        toggleGroup: function (event) {
            var $cardGroup = $(event.target).closest(".card-group");
            $cardGroup.find(".group-carat").toggleClass("collapsed");
            $cardGroup.find(".card-group-content").toggleClass("hide");
        }
    });

    return CardsView;
});