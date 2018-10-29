/**
 * A collection representing the cards used to render card layout widget
 *
 * @module CardCollection
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    "widgets/cardLayout/models/cardModel",
    'backbone.picky'
], /** @lends CardCollection*/
function (CardModel) {

    var CardCollection = Backbone.Collection.extend({

        model: CardModel,

        /**
         * Sets properties to be used in the request
         * @param {Object} options - composed by an Object with the headers, root, id and url to be used in the request
         */
        initialize: function (data, options) {
            this.requestHeaders = options.data.headers;
            this.root = options.data.root;
            this.url = options.data.url;
            this.id = options.data.id;
            this.options = options;
            this.setCardSelectionType(options.cardSelection);
            this.cardSelectionHash = {};
        },

        /**
         * Parses the response by extracting data from the json root
         * @param {Object} response - data after json root
         */
        parse: function (response) {
            var self = this;
            if (this.root) {
                var props = this.root.split('.'),
                    propsLength = props.length;
                //recursive function that uses the root property to get the data from the response
                var getData = function (response, index) {
                    if (index < propsLength - 1) {
                        response = response[props[index++]];
                        return getData(response, index);
                    }
                    return response[props[index]];
                };
                response = getData(response, 0);
            }
            response.forEach(function (itemResponse) {
                itemResponse.id = itemResponse[self.options.data.id];
                if (self.options.data.disabled) {
                    itemResponse.disabled = itemResponse[self.options.data.disabled];
                }
            });
            return response;
        },

        /**
         * Sets card selection support for multi selection or single selection
         * @param {String/boolean} cardSelection - it disables card selection (falsy) or enables it by the string "single" for single selection or "multi" for multiselection. In case of a true boolean, then the selection will default to multi selection.
         */
        setCardSelectionType: function (cardSelection) {
            if (cardSelection) {
                var selectable;
                switch (cardSelection) {
                    case "multi":
                        selectable = new Backbone.Picky.MultiSelect(this);
                        break;
                    case "single":
                        selectable = new Backbone.Picky.SingleSelect(this);
                        break;
                }
                _.extend(this, selectable);
                this.cardSelectionType = cardSelection;
            }
        },

        /**
         * Sets the cardSelectionHash as per the selection in the card model
         * @param {Object} cardModel - model of the card that requires an update on its selection
         */
        setCardSelectionHash: function (cardModel) {
            if (cardModel.selected) { //card was selected
                if (this.cardSelectionType == "single") {
                    this.cardSelectionHash = {};
                }
                this.cardSelectionHash[cardModel.id] = cardModel.toJSON();
            } else {
                delete this.cardSelectionHash[cardModel.id];
            }
        },

        /**
         * Sets the selection of a card model
         * @param {Object} cardModel - model of the card that requires an update on its selection
         * @param {Object} status - boolean, true will select a card, false will deselect it, and undefined will toggle the state of the card model
         */
        setCardModelSelection: function (cardModel, status) {
            if (_.isUndefined(status)) {
                cardModel.toggleSelected();
            } else if (_.isBoolean(status)) {
                if (status) {
                    cardModel.select();
                } else {
                    cardModel.deselect();
                }
            }
            this.setCardSelectionHash(cardModel);
        },

        /**
         * Sets the state of a card selection
         * @param {Object} cardIds - string or array of strings with the id of the cards that requires a state update
         * @param {Object} status - boolean, true will select a card, false will deselect it, and undefined will toggle the state of the card model
         */
        setCardSelection: function (cardIds, status) {
            var self = this,
                cardModel, isDisabled;
            if (this.cardSelectionType) {
                cardIds = _.isString(cardIds) ? [cardIds] : cardIds;
                cardIds.forEach(function (cardId) {
                    cardModel = self.collection.get(cardId);
                    if (cardModel) {
                        isDisabled = cardModel.get("disabled");
                        !isDisabled && self.setCardModelSelection(cardModel, status); //if card is not disabled, then set the selection
                    }
                });
            }
        },

        /**
         * Gets the selected cards
         * @returns {Object} returns an Object containing two attributes: cardsSelected and numberOfCardsSelected. cardsSelected property provides an object with the id of the card as a key and the data of the card as a value for all the selected cards. numberOfCardsSelected represents the number of cards currently selected.
         */
        getCardSelection: function () {
            if (this.cardSelectionType) {
                return {
                    "cardsSelected": this.cardSelectionHash,
                    "numberOfCardsSelected": _.size(this.cardSelectionHash)
                };
            }
        },

        /**
         * Sets the state of a card model: enable or disable
         * @param {Object} cardModel - model of the card that requires an update on the state
         * @param {boolean} state - true will disable a card, false will enable it, and undefined will toggle the state of the card model
         */
        setCardModelState: function (cardModel, state) {
            if (state) {
                cardModel.deselect();
                this.setCardSelectionHash(cardModel);
            }
            cardModel.set("disabled", state);
        },

        /**
         * Sets the state of a card
         * @param {Object} cardIds - string or array of strings with the id of the cards that requires an update of its state
         * @param {boolean} state - true will disable a card, false will enable it
         */
        setCardState: function (cardIds, state) {
            var self = this,
                cardModel;
            if (this.cardSelectionType) {
                cardIds = _.isString(cardIds) ? [cardIds] : cardIds;
                cardIds.forEach(function (cardId) {
                    cardModel = self.collection.get(cardId);
                    self.setCardModelState(cardModel, state);
                });
            }
        },

        /**
         * Checks if a card is disabled
         * @param {string} cardId - string with the id of the card
         * @returns {boolean} returns a boolean with the value true if the card is disabled and false otherwise
         */
        isCardDisabled: function (cardId) {
            var cardModel = this.collection.get(cardId);
            return cardModel.get("disabled");
        }

    });

    return CardCollection;
});
