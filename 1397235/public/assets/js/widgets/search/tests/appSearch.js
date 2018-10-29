/**
 * A view that uses the Search Widget to generate a Search field from a configuration object
 * The configuration contains the key and label pairs & operators from which the auto complete menu in the Search widget should be built.
 *
 * @module Search View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @author Vidushi Gupta<vidushi@juniper.net>
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/search/searchWidget',
    'widgets/search/conf/configurationSample',
    'es6!widgets/search/react/tests/view/searchComponentView',
    'text!widgets/search/tests/templates/searchExample.html',
    'lib/template_renderer/template_renderer'
], function (Backbone, SearchWidget, configurationSample, SearchComponentView, example, render_template) {
    var SearchView = Backbone.View.extend({

        events: {
            'click .addRoTokens': 'addReadOnlyTokens',
            'click .removeRoToken': 'removeReadOnlyToken',
            'click .replaceRoToken': 'replaceReadOnlyToken',
            'click .getRoSearchString': 'getReadOnlyTokenExpression',
            'click .clearRoTokens': 'clearReadOnlySearchTokens',
            'click .submitRoSearch': 'submitReadOnlySearch',
            'click .addPrecedenceTokens': 'addAdvanceTokensWithPrecedence',
            'click .addAdvanceTokens': 'addAdvanceTokens',
            'click .getAdvanceSearchString': 'getAdvanceTokenExpression',
            'click .clearTokens': 'clearAdvanceSearchTokens',
            'click .submitSearch': 'submitAdvanceSearch',
            'click .submitAutocompleteSearch': 'submitAutocompleteSearch',
            'click .submitAutocompleteSearchTokenizeOnEnter': 'submitAutocompleteSearchTokenizeOnEnter',
            'click .submitAutocompleteSearchNoPartialTokens': 'submitAutocompleteSearchNoPartialTokens',
            'click .submitAutocompleteSearchContainerNoMultipleKeyTokens': 'submitAutocompleteSearchContainerNoMultipleKeyTokens',
            'click .submitAutocompleteSearchContainerKeyPositionAsStart': 'submitAutocompleteSearchContainerKeyPositionAsStart',
            'click .submitAutocompleteSearchImplicitOperatorAsFalse': 'submitAutocompleteSearchImplicitOperatorAsFalse',
            'click .addAutocompleteTokens': 'addAutocompleteTokens'
        },

        initialize: function () {
            this.addContent(this.$el, example);
            !this.options.pluginView && this.render();
        },

        render: function () {
            var readOnlySearchContainer = this.$el.find('.readOnlySearchContainer')[0];
            var searchContainer = this.$el.find('.searchContainer')[0];
            var autocompleteSearchContainer = this.$el.find('.autocompleteSearchContainer')[0];
            var autocompleteSearchContainerTokenizeOnEnter = this.$el.find('.autocompleteSearchContainerTokenizeOnEnter')[0];
            var autocompleteSearchContainerNoPartialTokens = this.$el.find('.autocompleteSearchContainerNoPartialTokens')[0];
            var autocompleteSearchContainerNoMultipleKeyTokens = this.$el.find('.autocompleteSearchContainerNoMultipleKeyTokens')[0];
            var autocompleteSearchContainerKeyPositionAsStart = this.$el.find('.autocompleteSearchContainerKeyPositionAsStart')[0];
            var autocompleteSearchImplicitOperatorAsFalse = this.$el.find('.autocompleteSearchImplicitOperatorAsFalse')[0];
            var reactContainer = this.$el.find('.reactExamples')[0];


            this.readOnlySearch = new SearchWidget({
                "container": readOnlySearchContainer,
                "readOnly": true,
                "logicMenu": ['OR'],
                "afterTagAdded": this.afterTokenAdded,
                "afterTagRemoved": this.afterTokenRemoved,
                "afterAllTagRemoved": this.afterAllTokenRemoved
            });
            this.readOnlySearch.build();
            this.readOnlySearch.addTokens(['123.43.5.3', 'ManagedStatus < InSync, OutSync', 'ConnectionStatus = Down, Up']);

            this.advanceSearch = new SearchWidget(
                $.extend(configurationSample.searchConf, {
                    "container": searchContainer,
                    "afterTagAdded": this.afterTokenAdded,
                    "afterTagRemoved": this.afterTokenRemoved,
                    "afterAllTagRemoved": this.afterAllTokenRemoved
                })
            );
            this.advanceSearch.build();

            this.autocompleteSearch = new SearchWidget(
                $.extend(configurationSample.autocompleteSearchConf, {
                     "container": autocompleteSearchContainer,
                     "afterPartialTokenUpdated": this.afterPartialTokenUpdated,
                     "afterTagRemoved": this.afterTokenRemoved,
                })
            );
            this.autocompleteSearch.build();

            this.autocompleteSearchTokenizeOnEnter = new SearchWidget(
                $.extend(configurationSample.autocompleteSearchConf, {
                     "container": autocompleteSearchContainerTokenizeOnEnter,
                     "afterPartialTokenUpdated": this.afterPartialTokenUpdated,
                     "afterTagRemoved": this.afterTokenRemoved,
                     "tokenizeOnEnter": true
                })
            );
            this.autocompleteSearchTokenizeOnEnter.build();

            this.autocompleteSearchNoPartialTokens = new SearchWidget(
                $.extend(configurationSample.autocompleteSearchConf, {
                    "container": autocompleteSearchContainerNoPartialTokens,
                    "afterPartialTokenUpdated": this.afterPartialTokenUpdated,
                    "afterTagRemoved": this.afterTokenRemoved,
                    "allowPartialTokens": false
                })
            );
            this.autocompleteSearchNoPartialTokens.build();

            this.autocompleteSearchContainerNoMultipleKeyTokens = new SearchWidget(
                $.extend(configurationSample.autocompleteSearchConf, {
                    "container": autocompleteSearchContainerNoMultipleKeyTokens,
                    "afterPartialTokenUpdated": this.afterPartialTokenUpdated,
                    "afterTagRemoved": this.afterTokenRemoved,
                    "keyTokens": {
                        "maxNumber": 1
                    }
                })
            );
            this.autocompleteSearchContainerNoMultipleKeyTokens.build();

            this.autocompleteSearchContainerKeyPositionAsStart = new SearchWidget(
                $.extend(configurationSample.autocompleteSearchConf, {
                    "container": autocompleteSearchContainerKeyPositionAsStart,
                    "afterPartialTokenUpdated": this.afterPartialTokenUpdated,
                    "afterTagRemoved": this.afterTokenRemoved,
                    "allowPartialTokens": true,
                    "tokenizeOnEnter": false,
                    "keyTokens": {
                        "position": "start"
                    }
                })
            );
            this.autocompleteSearchContainerKeyPositionAsStart.build();

            this.autocompleteSearchImplicitOperatorAsFalse = new SearchWidget(
                $.extend(configurationSample.autocompleteSearchConf, {
                    "container": autocompleteSearchImplicitOperatorAsFalse,
                    "allowPartialTokens": true,
                    "tokenizeOnEnter": false,
                    "autocomplete": {
                        "inline": true
                    },
                    "keyTokens": {
                        "maxNumber": 1,
                        "position": "start"
                    },
                    implicitLogicOperator: false
                })
            );
            this.autocompleteSearchImplicitOperatorAsFalse.build();
            this.autocompleteSearchImplicitOperatorAsFalse.addTokens(["ADDR", "test1", "test2", "test3", "test4"]);

            // React Component
            new SearchComponentView({
                el: reactContainer
            }).render();

            return this;
        },

        afterTokenAdded: function () {
            console.log("Event triggered on token Added");
        },
        afterTokenRemoved: function (removedToken) {
            console.log("Event triggered on token Removed");
            console.log("Removed Token is: "+ removedToken);
        },
        afterAllTokenRemoved: function () {
            console.log("Event triggered on All tokens Removed");
        },

        afterPartialTokenUpdated: function () {
            console.log("partial token added");
        },

        addReadOnlyTokens: function () {
            this.readOnlySearch.addTokens(['ManagedStatus = OutSync']);
        },

        replaceReadOnlyToken: function () {
            this.readOnlySearch.replaceToken('ManagedStatus', ['DeviceFamily = SRX']);
        },

        removeReadOnlyToken: function () {
            this.readOnlySearch.removeToken('ManagedStatus = OutSync');
        },

        getReadOnlyTokenExpression: function () {
            console.log(this.readOnlySearch.getTokensExpression());
        },

        clearReadOnlySearchTokens: function () {
            this.readOnlySearch.removeAllTokens();
        },

        submitReadOnlySearch: function () {
            console.log(this.readOnlySearch.getAllTokens());
        },

        addAdvanceTokensWithPrecedence: function () {
            this.advanceSearch.addTokens(['(', '(', '(', 'Managed Status = InSync, OutSync', 'AND', 'NameKey = test1, test2, test3', 'NOT', '10.10.10.10', ')', 'OR', '(', 'DeviceFamily != SRX,MX', 'AND', 'ConnectionStatusKey = up', ')', ')', 'OR', '10.10.10.10', ')']);
        },

        addAdvanceTokens: function () {
            this.advanceSearch.addTokens(['Managed Status = InSync, OutSync', 'AND', 'NameKey = test1, test2, test3', 'NOT', 'OSVersion = 12.2, 12.3, 13.1, 12.4', 'OR', '10.10.10.10']);
        },

        getAdvanceTokenExpression: function () {
            console.log(this.advanceSearch.getTokensExpression());
        },

        clearAdvanceSearchTokens: function () {
            this.advanceSearch.removeAllTokens();
        },

        submitAdvanceSearch: function () {
            console.log(this.advanceSearch.getAllTokens());
        },

        submitAutocompleteSearch: function () {
            console.log(this.autocompleteSearch.getAllTokens());
        },

        submitAutocompleteSearchTokenizeOnEnter: function () {
            console.log(this.autocompleteSearchTokenizeOnEnter.getAllTokens());
        },

        submitAutocompleteSearchNoPartialTokens: function () {
            console.log(this.autocompleteSearchNoPartialTokens.getAllTokens());
        },

        submitAutocompleteSearchContainerNoMultipleKeyTokens: function () {
            console.log(this.autocompleteSearchContainerNoMultipleKeyTokens.getAllTokens());
        },

        submitAutocompleteSearchContainerKeyPositionAsStart: function () {
            console.log(this.autocompleteSearchContainerKeyPositionAsStart.getAllTokens());
        },
        
        submitAutocompleteSearchImplicitOperatorAsFalse: function () {
            console.log(this.autocompleteSearchImplicitOperatorAsFalse.getAllTokens());
        },

        addAutocompleteTokens: function () {
            this.autocompleteSearch.addTokens(['user', 'miriam', 'eva', 'sanket']);
        },
        
        addContent: function ($container, template) {
            $container.append((render_template(template)));
        }

    });

    return SearchView;
});