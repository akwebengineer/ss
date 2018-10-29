/**
 * A view that uses the Search component (created from the search widget) to render search bar
 *
 * @module SearchComponent View
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/search/react/search',
    'es6!widgets/search/react/tests/component/searchApp'
], function (React, ReactDOM, Search, SearchApp) {

    var SearchComponentView = function (options) {
        this.el = options.el;

        this.render = function () {
            ReactDOM.render(
                <div>
                    <h4>Read Only Search</h4>
                    <Search logicMenu={['OR']}/>
                    <br/>
                    <h4>Read Only - With initial values</h4>
                    <Search
                        tokens={["123.43.5.3", "ManagedStatus = InSync, OutSync"]}
                    />
                    <br/>
                    <h4>Read Only - Interactive</h4>
                    <SearchApp/>
                </div>, this.el
            );
            return this;
        };
    };

    return SearchComponentView;

});