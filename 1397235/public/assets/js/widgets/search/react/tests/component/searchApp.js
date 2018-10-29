/**
 * A view that uses the Search component (created from search widget) to render a search bar with tokens
 *
 * @module SearchComponent View
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/search/react/search'
], function (React, ReactDOM, Search) {

    //creates a React component from the Search component so states can be handled by the user of the Search component
    class SearchApp extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                tokens: ['123.43.5.3', 'OSVersion = 12.2']
            };
            this.addTokens = this.addTokens.bind(this);
            this.removeToken = this.removeToken.bind(this);
            this.replaceToken = this.replaceToken.bind(this);
            this.clearTokens = this.clearTokens.bind(this);
            this.getTokens = this.getTokens.bind(this);
        }

        /* method to add tokens to the search bar using states
         @param tokens: array of strings containing the values for tokens
         */
        addTokens() {
            let tokens = ['ManagedStatus = InSync', 'Name = test1'];
            this.setState({
                "tokens": this.state.tokens.concat(tokens)
            });
            console.log("Added tokens: " + JSON.stringify(tokens));
        };

        /* method to show how to remove any token and update the state
         @param token: string
         */
        removeToken() {
            let token = 'ManagedStatus = InSync';
            this.setState({
                "tokens": _.without(this.state.tokens, token)
            });
            console.log("Removed token: " + token);
        };

        /* method to replace an existing token with a new token - new will be added at the end of all tokens
         @param replaceToken: string - to indicate which token needs to be replaced
         @param newToken: array - containing the replacing token
         */
        replaceToken() {
            let replaceToken = 'Name = test1';
            let newToken = ['DeviceFamily = SRX'];

            let updatedTokens = _.without(this.state.tokens, replaceToken);
            if (this.state.tokens.length != updatedTokens.length) {
                this.setState({
                    "tokens": updatedTokens.concat(newToken)
                });
            }
            console.log("'" + replaceToken + "' Token Replaced with: " + JSON.stringify(newToken));
        };

        /* method to clear all tokens in the filter */
        clearTokens() {
            this.setState({"tokens": []});
            console.log("All tokens removed");
        };

        /* method to get the current values using state of tokens */
        getTokens() {
            console.log(this.state.tokens);
        };

        render() {
            return (
                <span>
                    <Search
                        tokens={this.state.tokens}
                        onChange={(tokens) => this.setState({"tokens": tokens})}
                    />
                    <br/><br/><br/>
                    <span className="slipstream-secondary-button" onClick={this.addTokens}>Add Tokens</span>
                    <span className="slipstream-secondary-button" onClick={this.removeToken}>Remove Tokens</span>
                    <span className="slipstream-secondary-button" onClick={this.replaceToken}>Replace Tokens</span>
                    <span className="slipstream-secondary-button" onClick={this.clearTokens}>Clear All</span>
                    <span className="slipstream-secondary-button" onClick={this.getTokens}>Get Tokens</span>

                </span>
            );
        }
    }

    return SearchApp;
});