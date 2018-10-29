/**
 * A module that builds a card layout widget from a configuration object.
 * The configuration object includes the container which should be used to render the widget, the configuration option and the cards content view
 *
 * @module CardLayoutWidget
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
    "widgets/cardLayout/views/cardLayoutView",
    "widgets/cardLayout/models/cardLayoutSubtitleModel",
    "widgets/cardLayout/views/cardLayoutSubtitleView",
    "widgets/cardLayout/models/cardCollection",
    "widgets/cardLayout/views/cardsView",
    "widgets/help/helpWidget"
], /** @lends CardLayoutWidget*/
function (CardLayoutView, CardLayoutSubtitleModel, CardLayoutSubtitleView, CardCollection, CardsView, HelpWidget) {

    var CardLayoutWidget = function (conf) {

        /**
         * CardLayoutWidget constructor
         *
         * @constructor
         * @class CardLayoutWidget- Builds a card layout widget from a configuration object.
         * @param {Object} conf - It requires the container and the options for the card layout. It optionally defines the content property.
         * @param {Object} conf.container - DOM element that defines the container where the widget will be rendered.
         * @param {Array} conf.options - It defines an Object with the subTitle (optional), data and cardSize properties required to configure the card layout widget.
         * @param {string or Object} conf.options.subtitle - Optional property, defines the subtitle of the card layout. It could be a string that represents the value of the subtitle or an Object with the content, ua-help and ua-help-identifier properties.
         * @param {string} conf.options.subtitle.content - Defines the subtitle of the card layout.
         * @param {Object} conf.options.subtitle.help - Defines the help icon of the card layout. It is an Object with the properties: content, ua-help-test and ua-help-identifier. They are string, where content property is the content of the tooltip, the ua-help-text is the text for the ua-help-identifier identifier.
         * @param {Object} conf.options.cardSize - Required property, represented by an Object with the height and width of the card.
         * @param {number} conf.options.cardSize.height - Required property, represents the height of a card.
         * @param {number or string} conf.options.cardSize.width - Required property, represents the width of a card. If the value is a number indicates the fixed width that a card will have. It is defined a string that defines a percentage (for example, 30%), it represents the width of the card with respect to its container. A width defined in percentage could also work with other properties defined in the cardSize Object like min-width and max-width.
         * @param {number} conf.options.cardSize.min-width - Optional property, available only if the width has been defined in percentages, it represents the min width a card could have for the available the card layout container width.
         * @param {number} conf.options.cardSize.max-width - Optional property, available only if the width has been defined in percentages, it represents the max width a card could have for the available the card layout container width.
         * @param {Object} conf.options.data - Required property, represented by an Object with the url, header, root and id properties.
         * @param {Object} conf.options.data.url - Required property, represents the API that will provide data to be showed in the cards layout.
         * @param {Object} conf.options.data.headers - Optional property, represents the headers (Authorization and Accept) required to be attached to the API request.
         * @param {Object} conf.options.data.root - Optional property, represents the location where the data starts.
         * @param {Object} conf.options.data.id - Required property, represents the id that will be used to identify uniquely each card.
         * @param {string} conf.options.cardSelection - single, multi, none (default, if property is absent)
         * @param {Object} conf.content - Optional property, represents the constructor of a Slipstream view to be used to render the content of a card. When the card layout widget instantiates the view, it passes the card id and card data for each of the cards.
         * @returns {Object} Current CardLayoutWidget's object: this
         */
        var self = this,
            $cardLayoutContainer = $(conf.container),
            hasRequiredConfiguration = _.isObject(conf) && !_.isUndefined(conf.container) && _.isObject(conf.options) && _.isObject(conf.options.cardSize) && _.isObject(conf.options.data),
            cardLayoutBuilt = false,
            errorMessages = {
                'noConf': 'The configuration object for the card layout widget is missing',
                'noContainer': 'The configuration for the card layout widget must include the container property',
                'noOptions': 'The configuration for the card layout widget must include the options property',
                'noCardSize': 'The configuration for the card layout widget must include the cardSize in the options property',
                'noData': 'The configuration for the card layout widget must include the data in the options property',
                'noBuilt': 'The card layout widget was not built'
            },
            cardCollection, cardsView;

        /**
         * Throws error messages if some required properties of the configuration are not available.
         * @inner
         */
        var showError = function () {
            if (!_.isObject(conf))
                throw new Error(errorMessages.noConf);
            if (_.isUndefined(conf.container))
                throw new Error(errorMessages.noContainer);
            if (_.isUndefined(conf.options))
                throw new Error(errorMessages.noOptions);
            if (!_.isObject(conf.options.cardSize))
                throw new Error(errorMessages.noCardSize);
            if (!_.isObject(conf.options.data))
                throw new Error(errorMessages.noData);
            else //generic error
                throw new Error(errorMessages.noBuilt);
        };


        /**
         * Builds the card layout widget in the specified container.
         * @returns {Object} returns the instance of the card layout widget that was built.
         */
        this.build = function () {
            if (hasRequiredConfiguration) {
                var cardLayoutView = new CardLayoutView({
                    el: conf.container
                });
                cardLayoutView.render();
                addContainerObserver();//defers adding the carousel/bar/grid layout to the cards until cards data is available and is rendered

                cardLayoutView.subTitleRegion.show(createCardLayoutSubtitleView());
                createCardsView(cardLayoutView); //defers show cardsRegion to when the cardCollection is ready (fetchCardCollection method)

                $cardLayoutContainer = $cardLayoutContainer.find(".card-layout-widget");

                cardLayoutBuilt = true;
            } else {
                showError();
            }
            return this;
        };

        /**
         * Creates the cardLayoutSubtitleView instance to be used as the subtitle of the layout widget
         * @returns {Object} returns the instance of the card layout subtitle view
         * @inner
         */
        var createCardLayoutSubtitleView = function () {
            var subTitle = _.isObject(conf.options.subTitle) ? conf.options.subTitle : {"content": conf.options.subTitle};
            var cardLayoutSubtitleModel = new CardLayoutSubtitleModel({
                subTitle: subTitle,
                help: false
            });
            var cardLayoutSubtitleView = new CardLayoutSubtitleView({
                model: cardLayoutSubtitleModel
            });
            return cardLayoutSubtitleView;
        };

        /**
         * Creates the CardsView instance to be used as the cards layout of the layout widget
         * @param {Object} cardLayoutView - view with title and cards (main view)
         * @inner
         */
        var createCardsView = function (cardLayoutView) {
            cardCollection = new CardCollection([], conf.options);
            cardsView = new CardsView({
                collection: cardCollection,
                content: conf.content,
                configuration: conf.options
            });
            cardLayoutView.cardsRegion.show(cardsView);
            fetchCardCollection();
        };

        /**
         * Fetches the card collection, adds the cardsView to the cardsRegion and triggers the slipstreamCardLayout.cardsData:onLoadComplete event with the response data
         * @inner
         */
        var fetchCardCollection = function () {
            var triggerLoadCompleteEvent = function (cardCollectionResponse) {
                //adds help tooltip to the card layout sub-title
                if (conf.options.subTitle && conf.options.subTitle.help) {
                    new HelpWidget({
                        "container": $cardLayoutContainer.find(".subtitle .content"),
                        "view": conf.options.subTitle.help
                    }).build();
                }
                $cardLayoutContainer.trigger("slipstreamCardLayout.cardsData:onLoadComplete", cardCollectionResponse);
            };

            var dataConf = conf.options.data; //data property is required, and checked during build
            if (dataConf.url) {//remote data
                cardCollection.fetch({
                    success: function (collection, response) {
                        triggerLoadCompleteEvent({
                            status: "success",
                            response: response
                        });
                    },
                    error: function (collection, response) {
                        triggerLoadCompleteEvent({
                            status: "error",
                            response: response.responseText
                        });
                    },
                    reset: true
                });
            } else if (_.isFunction (dataConf.getData)){//local data
                var addData = function (localCardsData) {
                    var cardCollectionData = _.map(localCardsData, function (val) {
                        return _.extend({id: val[dataConf.id]}, val);
                    });
                    cardCollection.reset(cardCollectionData);
                    triggerLoadCompleteEvent({status: "success"});
                };
                dataConf.getData(_.bind(addData, self));
            }
        };

        /**
         * Adds a MutationObserver to detect changes in the card layout container after cards collection is available and was rendered
         * @inner
         */
        var addContainerObserver = function () {
            var observer = new MutationObserver(function (mutations) {
                if (cardCollection.length) {
                    cardCollection.trigger("update");
                    $cardLayoutContainer.trigger("slipstreamCardLayout.cardsView:onRenderComplete");
                    observer.disconnect();
                }
            });
            observer.observe($cardLayoutContainer[0], {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            });
        };

        /**
         * Gets the selected cards
         * @returns {Object} returns an Object containing two attributes: cardsSelected and numberOfCardsSelected. cardsSelected property provides an object with the id of the card as a key and the data of the card as a value for all the selected cards. numberOfCardsSelected represents the number of cards currently selected.
         */
        this.getCardSelection = function () {
            if (cardLayoutBuilt) {
                return cardCollection.getCardSelection();
            } else {
                throw new Error(errorMessages.noBuilt);
            }
        };

        /**
         * Sets the state of a card selection
         * @param {Object} cardIds - string or array of strings with the id of the cards that requires a state update
         * @param {Object} status - boolean, true (or undefined) will select a card, false will deselect it
         */
        this.setCardSelection = function (cardIds, status) {
            if (cardLayoutBuilt) {
                status = _.isBoolean(status) ? status : true;
                cardCollection.setCardSelection(cardIds, status);
            } else {
                throw new Error(errorMessages.noBuilt);
            }
            return this;
        };

        /**
         * Toggles a card selection: if it is selected, then it will be deselected and vice versa
         * @param {Object} cardIds - string or array of strings with the id of the cards to be toggled
         */
        this.toggleCardSelection = function (cardIds) {
            if (cardLayoutBuilt) {
                cardCollection.setCardSelection(cardIds);
            } else {
                throw new Error(errorMessages.noBuilt);
            }
            return this;
        };

        /**
         * Reloads a collection by resetting the current selection in a collection, loading a new one using updated API parameters and restoring the current card selection
         * @param {Object} parameters - Criteria to be updated
         */
        var reloadCollection = function (parameters) {
            var cardSelection = cardCollection.getCardSelection();
            cardCollection.selectNone();
            cardCollection.reset();
            cardCollection.fetch({
                data: $.param(parameters),
                success: function () {
                    self.toggleCardSelection(_.keys(cardSelection.cardsSelected));
                    cardCollection.trigger("update"); //custom event to indicate that the collection is updated after filtering
                }
            });
        };

        /**
         * Search cards by fetching the cards collection with an updated API that includes the searchParameters
         * @param {Object} searchParameters - Criteria to be searched
         */
        this.setFilter = function (searchParameters) {
            if (cardLayoutBuilt) {
                reloadCollection(searchParameters || {});
            } else {
                throw new Error(errorMessages.noBuilt);
            }
            return this;
        };

        /**
         * Removes all filters added and sends API request
         */
        this.removeFilter = function () {
            if (cardLayoutBuilt) {
                reloadCollection({});
            } else {
                throw new Error(errorMessages.noBuilt);
            }
            return this;
        };

        /**
         * Enables the user interaction in a card(s)
         * @param {Object} cardIds - string or array of strings with the id of the cards to be enabled
         * @param {boolean} state - state to be assigned to a card: true - disabled, false - enabled
         * @inner
         */
        var setCardState = function (cardIds, state) {
            cardsView.setCardState(cardIds, state);
            cardCollection.setCardState(cardIds, state);
        };

        /**
         * Disables a card(s) so it can not be selected
         * @param {Object} cardIds - string or array of strings with the id of the cards to be disabled
         */
        this.disable = function (cardIds) {
            if (cardLayoutBuilt) {
                setCardState(cardIds, true);
            } else {
                showError();
            }
        };

        /**
         * Enables a card(s) so it can be selected
         * @param {Object} cardIds - string or array of strings with the id of the cards to be enabled
         */
        this.enable = function (cardIds) {
            if (cardLayoutBuilt) {
                setCardState(cardIds, false);
            } else {
                showError();
            }
        };

        /**
         * Checks if a card is disabled
         * @returns {boolean} value - if it is disabled then it returns true; otherwise it returns false
         */
        this.isDisabled = function (cardId) {
            if (cardLayoutBuilt) {
                return cardCollection.isCardDisabled(cardId);
            } else {
                showError();
            }
        };

        /**
         * Clean up the specified container from the resources created by the card layout widget.
         * @returns {Object} returns the instance of the card layout widget.
         */
        this.destroy = function () {
            if (cardLayoutBuilt) {
                $cardLayoutContainer.find(".cards > div").masonry("destroy");
                $cardLayoutContainer.remove();
            } else {
                throw new Error(errorMessages.noBuilt);
            }
            return this;
        };

    };

    return CardLayoutWidget;
});