/**
 * A module that builds a Search widget from a configuration object.
 * The configuration object includes the container which should be used to render the widget
 * and the list of label/values that should be showed in the search auto complete menu.
 *
 * @module SearchWidget
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @author Vidushi Gupta<vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'tagit',
    'text!widgets/search/templates/searchContainer.html',
    'lib/template_renderer/template_renderer'
], /** @lends SearchWidget */
function (tagit, searchTemplate, render_template) {

    /**
     * SearchWidget constructor
     *
     * @constructor
     * @class SearchWidget - Builds a Search widget from a configuration object.
     *
     * @param {Object} conf - It requires the container parameter. The rest of the parameters are optional.
     * container: defines the container where the widget will be rendered
     * readOnly: defines if the token area will be shown as a read only container. The filter and logic menus won't be available.
     * filterMenu: defines the filter context menu that will be shown on the token area. It is used to select the key and value of a token.
     * logicMenu: defines the logic context menu that will be shown on the token area between two tokens. It is used to replace the default AND logic operator added by default between two tokens.
     * tokenizeOnEnter: A boolean defining whether tokenization is performed on the current token when the user hits the Enter key.
     * implicitLogicOperator: Defines whether the logic operator between tokens will be added implicitly. If true then the first operator defined in the logicMenu will be considered the implicit 
     * operator and all others will be ignored.
     * autoComplete: An object that defines the widget's autocomplete behavior.
     * keyTokens: An object that defines the behavior of key tokens.
     * afterTagAdded: callback function invoked after a tag is added.
     * afterTagRemoved: callback function invoked after a tag is removed.
     * afterAllTagRemoved: callback function invoked after all tags are removed
     * allowPartialTokens: Defines if token completion events will be generated as a user types tokens, even if the token has not been completed.
     *
     * @returns {Object} Current SearchWidget's object: this
     */
    var SearchWidget = function (conf) {
        var containers = {
                '$searchContainer': $(conf.container)
            },
            errorMessages = {
                'noContainer': 'The container property required to build the Search widget is missing'
            },
            self = this;

        /**
         * Builds the Search widget in the specified container
         * @returns {Object} Current "this" of the class
         */
        this.build = function () {
            var allOperators = ['!=', '<=', '>=', '=', '<', '>']; // IMP Note: keep the list updated with any new operator that app user may intend to use.

            containers.$searchContainer.append(render_template(searchTemplate, {
                'readOnly': conf.readOnly,
                'inlineToken' : !conf.allowPartialTokens && (conf.autocomplete && conf.autocomplete.inline)
            }));
            containers.$tokensContainer = containers.$searchContainer.find('.search-widget');

            if (conf.allowPartialTokens) {
                containers.$tokensContainer.addClass("partialTokenEnabled");
            }

            var logicalOperator = conf.logicMenu;

            if (this.implicitLogicOperator && (!logicalOperator || logicalOperator.length == 0)) {
                logicalOperator = ['AND'];
            }

            containers.$tokensContainer.tagit({
                source: conf.filterMenu,
                logicalOperator: logicalOperator,
                defaultOperators: conf.operators || allOperators,
                allOperators: allOperators,
                singleField: true,
                singleFieldDelimiter: '&',
                showAutocompleteOnFocus: true,
                allowSpaces: true,
                readOnly: conf.readOnly,
                afterTokenAdded: afterTokenAdded,
                afterTokenRemoved: afterTokenRemoved,
                afterAllTokenRemoved: afterAllTokenRemoved,
                allowPartialTokens: conf.allowPartialTokens,
                keyTokens: conf.keyTokens,
                afterPartialTokenUpdated: afterPartialTokenUpdated,
                autocomplete: conf.autocomplete,
                implicitLogicOperator: conf.implicitLogicOperator,
                tokenizeOnEnter: conf.tokenizeOnEnter
            });

            registerActionEventsHandlers();
            return this;
        };

        /**
         * Adds events handlers that listens when a user clicks on the filterMenu icon, the remove token icon and the remove all token button
         * @inner
         */
        var registerActionEventsHandlers = function () {
            containers.$searchContainer.find('.removeAllTokens').off('click.fndtn.removeAllTokens').on('click.fndtn.removeAllTokens', function (e) {
                self.removeAllTokens();
            });
        };

        /**
         * Method to check if the container exists & initialized by tagit lib
         * @inner
         */
        var $tokensContainerExists = function () {
            // test if the container is created & tagit library is associated
            return containers.$tokensContainer && containers.$tokensContainer.length;
        };

        /**
         * If the token is added on UI accordingly the custom callbacks will be executed
         * @param {object} event - jquery event object
         * @inner
         */
        var afterTokenAdded = function (event) {
            _.isFunction(conf.afterTagAdded) && conf.afterTagAdded();
        };

        /**
         * This callback is triggered whenever the partial token is updated.
         * @param {object} event - jquery event object
         * @inner
         */
        var afterPartialTokenUpdated = function (event) {
            _.isFunction(conf.afterPartialTagUpdated) && conf.afterPartialTagUpdated();
        };

        /**
         * If the token is removed on UI OR programatically accordingly the custom callbacks will be executed
         * @param {object} event - jquery event object
         * @param {object} token - object with deleted token details
         * @inner
         */
        var afterTokenRemoved = function (event, token) {
            _.isFunction(conf.afterTagRemoved) && conf.afterTagRemoved(token.tokenLabel);
        };

        /**
         * If the token all the tokens are removed on UI OR programatically accordingly the custom callbacks will be executed
         * @param {object} event - jquery event object
         * @inner
         */
        var afterAllTokenRemoved = function (event) {
            _.isFunction(conf.afterAllTagRemoved) && conf.afterAllTagRemoved();
        };

        /**
         * Adds new token to the token area
         * @param {Array} tokens - token or tokens that will be added to the token container
         * @param {boolean} avoidTriggerEvent - if true, then the event associated with each token creation will not be triggered
         * for key value token, the format accepts <label operator values> || <configKey operator values>
         */
        this.addTokens = function (tokens, avoidTriggerEvent) {
            if ($tokensContainerExists()) {
                containers.$tokensContainer.tagit("addTokens",  _.isArray(tokens) ? tokens : [tokens], avoidTriggerEvent);
            } else {
                throw new Error(errorMessages.noContainer);
            }
        };

        /**
         * Replaces a existing token with provided value
         * @param {String} key - key that needs to be replaced, it can be single token key OR key-value token key
         * @param {Array} token - New token that needs to be replaced with
         */
        this.replaceToken = function (key, token) {
            if ($tokensContainerExists()) {
                containers.$tokensContainer.tagit('replaceToken', key , _.isArray(token) ? token : [token]);
            } else {
                throw new Error(errorMessages.noContainer);
            }
        };
        
        /**
         * Removes a token from the available token list. When the key is provided, and there is more of one value assigned to the key, then only the token value will be removed from the token. When the key is available but not token value, then the token that matches the key will be removed.
         * @param {Array} token - if only provided, then entire token will be removed. If the token is with values, the specific values will be removed. If the token do not have any more values, then entire token will be removed.
         * @param {boolean} appendValue - if true, then the `specified value will be added in token & token will be added back to the UI.
         * @param {boolean} avoidTriggerEvent - if true, then the event associated with each token removing will not be triggered
         */
        this.removeToken = function (token, appendValue, avoidTriggerEvent) {
            if ($tokensContainerExists()) {
                var deletedToken = containers.$tokensContainer.tagit("removeToken", _.isArray(token) ? token : [token], appendValue, avoidTriggerEvent);
                return deletedToken;
            } else {
                throw new Error(errorMessages.noContainer);
            }
        };

        /**
         * Clears all tokens.
         * @param {boolean} avoidTriggerEvent - if true, then the associated event will not be triggered
         */
        this.removeAllTokens = function (avoidTriggerEvent) {
            if ($tokensContainerExists()) {
                containers.$tokensContainer.tagit('removeAllTokens', avoidTriggerEvent);
            } else {
                throw new Error(errorMessages.noContainer);
            }
        };

        /**
         * Gets all available tokens from the token container.
         * @return {Array} tokens - array of string containing all the components entered in the search filter
         */
        this.getAllTokens = function () {
            if ($tokensContainerExists()) {
                return containers.$tokensContainer.tagit('getAllTokens');
            } else {
                throw new Error(errorMessages.noContainer);
            }
        };
        
        /**
         * Gets the complete search expression entered in the search filter
         * @return {String} searchExpression - string containing complete search expression entered in the search filter
         */
        this.getTokensExpression = function () {
            if ($tokensContainerExists()) {
                return containers.$tokensContainer.tagit('getTokensExpression');
            } else {
                throw new Error(errorMessages.noContainer);
            }
        };

        /**
         * Sets focus on the input field.
         */
        this.focusInput = function() {
            containers.$tokensContainer.tagit('focusInput');
        };

        /**
         * Destroys all elements created by the Search widget in the specified container
         * @returns {Object} Current Search object
         */
        this.destroy = function () {
            if ($tokensContainerExists()) {
                containers.$tokensContainer.tagit('destroy');
            } else {
                throw new Error(errorMessages.noContainer);
            }
            return this;
        };
    };

    return SearchWidget;
});