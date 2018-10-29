define([
    'widgets/search/searchWidget',
    'widgets/search/conf/configurationSample'
], function (SearchWidget, configurationSample) {

    function createContainer() {
        var container = $("<div id = 'searchContainer' style='width: 1300px;'></div>");
        $('#test_widget').append(container);

        return container;
    }

    var self = this;

    describe('SearchWidget Unit Tests:', function () {
        var searchContainer = createContainer();

        describe('Exposed methods exists', function () {
            var searchWidgetObj = new SearchWidget({
                "container": searchContainer
            });

            it('should exist', function () {
                searchWidgetObj.should.exist;
            });

            it('build() should exist', function () {
                assert.isFunction(searchWidgetObj.build, 'The Search widget must have a function named build.');
            });

            it('destroy() should exist', function () {
                assert.isFunction(searchWidgetObj.destroy, 'The Search widget must have a function named destroy.');
            });

            it('addTokens() should exist', function () {
                assert.isFunction(searchWidgetObj.addTokens, 'The Search widget must have a function named addTokens.');
            });

            it('replaceToken() should exist', function () {
                assert.isFunction(searchWidgetObj.replaceToken, 'The Search widget must have a function named replaceToken.');
            });

            it('removeToken() should exist', function () {
                assert.isFunction(searchWidgetObj.removeToken, 'The Search widget must have a function named removeToken.');
            });

            it('removeAllTokens() should exist', function () {
                assert.isFunction(searchWidgetObj.removeAllTokens, 'The Search widget must have a function named removeAllTokens.');
            });

            it('getAllTokens() should exist', function () {
                assert.isFunction(searchWidgetObj.getAllTokens, 'The Search widget must have a function named getAllTokens.');
            });

            it('getTokensExpression() should exist', function () {
                assert.isFunction(searchWidgetObj.getTokensExpression, 'The Search widget must have a function named getTokensExpression.');
            });
            
            it('focusInput() should exist', function () {
                assert.isFunction(searchWidgetObj.focusInput, 'The Search widget must have a function named focusInput.');
            });
        });

        describe('Read only Filter methods', function () {
            var searchWidgetObj;
            var tokens = (['123.43.5.3', 'ManagedStatus = InSync,OutSync', 'ConnectionStatus = Down,Up']);
            //var that = this;
            before(function () {
                searchWidgetObj = new SearchWidget({
                    "container": searchContainer,
                    "readOnly": true,
                    "logicMenu": ['OR']
                });
                searchWidgetObj.build();
            });

            after(function () {
                searchWidgetObj.destroy();
            });

            it('getAllTokens method: with empty filter bar', function () {
                var allTokens = searchWidgetObj.getAllTokens();
                assert.lengthOf(allTokens, 0, 'filter bar should be empty');
            });

            it('addTokens method: add singleToken', function () {
                searchWidgetObj.addTokens([tokens[0]]);
                var allTokens = searchWidgetObj.getAllTokens();
                assert.lengthOf(allTokens, 1, 'filter bar should have 1 token');
                assert.equal(allTokens[0], tokens[0], 'Token value should be same as added');
            });

            it('addTokens method: add keyValue Token', function () {
                searchWidgetObj.addTokens([tokens[1], tokens[2]]);
                var allTokens = searchWidgetObj.getAllTokens();
                assert.lengthOf(allTokens, tokens.length, 'Filter bar should have 3 tokens');
                assert.equal(allTokens[0], tokens[0], 'First token should be same as added');
                assert.equal(allTokens[1], tokens[1], 'Second token value should be same as added');
                assert.equal(allTokens[2], tokens[2], 'Third token value should be same as added');
            });

            it('removeAllTokens method: remove all Tokens when tokens are existing', function () {
                var tokensBeforeRemove = searchWidgetObj.getAllTokens();
                assert.notEqual(tokensBeforeRemove.length, 0, 'Filter bar should not be empty');
                searchWidgetObj.removeAllTokens();
                var tokensAfterRemove = searchWidgetObj.getAllTokens();
                assert.lengthOf(tokensAfterRemove, 0, 'All tokens should be removed');
            });

            it('removeAllTokens method: remove all Tokens when no tokens', function () {
                // used to test that method call on empty filter bar should not error out
                var tokensBeforeRemove = searchWidgetObj.getAllTokens();
                assert.equal(tokensBeforeRemove.length, 0, 'Filter bar should be empty');
                searchWidgetObj.removeAllTokens();
                var tokensAfterRemove = searchWidgetObj.getAllTokens();
                assert.lengthOf(tokensAfterRemove, 0, 'No error should happen');
            });

            it('getTokensExpression',function(){
                // used to provide a string that consists the search expression
                searchWidgetObj.addTokens([tokens[1], tokens[2]]);
                assert.equal(searchWidgetObj.getTokensExpression(),"ManagedStatus = InSync,OutSync OR ConnectionStatus = Down,Up","Search expression should match");
            });
            it('replaceTokens method: replace keyValue Token', function () {
                searchWidgetObj.removeAllTokens();
                searchWidgetObj.addTokens(tokens);
                searchWidgetObj.replaceToken('ManagedStatus',['DeviceFamily = SRX']);
                var allTokens = searchWidgetObj.getAllTokens();
                assert.lengthOf(allTokens, tokens.length, 'Filter bar should have 3 tokens');
                assert.equal(allTokens[0], tokens[0], 'First token should be same as added');
                assert.equal(allTokens[1], tokens[2], 'Second token replaced & added at the end');
                assert.equal(allTokens[2], 'DeviceFamily = SRX', 'Third token value should be same as added');
            });

            describe('removeToken method', function () {
                var tokensBeforeRemove = [];
            
                describe('singleToken', function () {
                    before(function () {
                        searchWidgetObj.removeAllTokens(); // clear the filter to test
                        searchWidgetObj.addTokens(tokens);
                        tokensBeforeRemove = searchWidgetObj.getAllTokens();
                    });
            
                    it('remove singleToken ', function () {
                        searchWidgetObj.removeToken('123.43.5.3');
                        var tokensAfterRemove = searchWidgetObj.getAllTokens();
                        assert.lengthOf(tokensAfterRemove, tokensBeforeRemove.length - 1, 'One token should be removed');
                        assert.equal(tokensAfterRemove[0], tokensBeforeRemove[1], 'First token should be same as Second token before remove happened');
                        assert.equal(tokensAfterRemove[1], tokensBeforeRemove[2], 'Second token should be same as Third token before remove happened');
                    });

                    it('remove singleToken and appendValue is true', function () {
                        searchWidgetObj.removeToken('123.43.5.3', true);
                        var tokensAfterRemove = searchWidgetObj.getAllTokens();
                        assert.lengthOf(tokensAfterRemove, tokensBeforeRemove.length, 'token should be appended back');
                        assert.equal(tokensAfterRemove[0], tokensBeforeRemove[1], 'First token should be same as Second token before remove happened');
                        assert.equal(tokensAfterRemove[1], tokensBeforeRemove[2], 'Second token should be same as Third token before remove happened');
                    });
                });
            
                describe('Key Value Token scenarios', function () {
                    beforeEach(function () {
                        searchWidgetObj.removeAllTokens(); // clear the filter to test
                        searchWidgetObj.addTokens(tokens);
                        searchWidgetObj.addTokens(['DeviceFamilyKey = SRX,MX,EX']);
                        tokensBeforeRemove = searchWidgetObj.getAllTokens();
                    });
            
                    it('remove entire token, when only \'key\' is provided', function () {
                        searchWidgetObj.removeToken('DeviceFamilyKey'); // remove only the key
                        var tokensAfterRemove = searchWidgetObj.getAllTokens();
                        var tokenPresentAfterRemove = _.indexOf(tokensAfterRemove, 'DeviceFamilyKey = SRX,MX,EX');
                        assert.equal(tokenPresentAfterRemove, -1, "Entire token should be deleted from list");
                        assert.lengthOf(tokensAfterRemove, tokensBeforeRemove.length - 1, 'One token should be removed');
                    });
            
                    it('remove only the value from token when \'key and any one value\'  provided', function () {
                        searchWidgetObj.removeToken('DeviceFamilyKey = MX'); // remove only the key with only one value
                        var tokensAfterRemove = searchWidgetObj.getAllTokens();
                        var tokenPresentAfterRemove = _.indexOf(tokensAfterRemove, 'DeviceFamilyKey = SRX,EX');
                        assert.notEqual(tokenPresentAfterRemove, -1, "Value should be partially removed, token should contain DeviceFamilyKey = SRX,EX");
                        assert.lengthOf(tokensAfterRemove, tokensBeforeRemove.length, 'Entire token should not be deleted - only token value needs to be removed');
                    });
            
                    it('remove all the mentioned values from token as provided in \'key and any set of values\'', function () {
                        searchWidgetObj.removeToken('DeviceFamilyKey = SRX,EX'); // remove only the key with more than one value but not all the values
                        var tokensAfterRemove = searchWidgetObj.getAllTokens();
                        var tokenPresentAfterRemove = _.indexOf(tokensAfterRemove, 'DeviceFamilyKey = MX');
                        assert.notEqual(tokenPresentAfterRemove, -1, "Values should be partially removed, token should contain DeviceFamilyKey = MX");
                        assert.lengthOf(tokensAfterRemove, tokensBeforeRemove.length, 'Entire token should not be deleted - only token value needs to be removed');
                    });
            
                    it('remove entire token if provided values are exhaustive of selected values \'key and all set of values\'', function () {
                        searchWidgetObj.removeToken('DeviceFamilyKey = SRX,MX,EX'); // remove only the key with more than one value but not all the values
                        var tokensAfterRemove = searchWidgetObj.getAllTokens();
                        var tokenPresentAfterRemove = _.indexOf(tokensAfterRemove, 'DeviceFamilyKey = SRX,MX,EX');
                        assert.equal(tokenPresentAfterRemove, -1, "Entire token should be deleted from list");
                        assert.lengthOf(tokensAfterRemove, tokensBeforeRemove.length - 1, 'One token should be removed');
                    });

                    it('append back the value from token when \'key and any one value\'  provided and appendValue is true', function () {
                        searchWidgetObj.removeToken('DeviceFamilyKey = MX', true); // delete token and append back already existing value
                        var tokensAfterRemove = searchWidgetObj.getAllTokens();
                        var tokenPresentAfterRemove = _.indexOf(tokensAfterRemove, 'DeviceFamilyKey = SRX,EX,MX');
                        assert.notEqual(tokenPresentAfterRemove, -1, "Value should be appended back, token should contain DeviceFamilyKey = SRX,EX,MX");
                        assert.lengthOf(tokensAfterRemove, tokensBeforeRemove.length, 'Entire token should not be deleted - value needs to be appended back');
                    });
            
                    it('append back the values from token when \'key and any set of values\' and appendValue is true', function () {
                        searchWidgetObj.removeToken('DeviceFamilyKey = SRX,EX', true); // delete token and append back already existing values
                        var tokensAfterRemove = searchWidgetObj.getAllTokens();
                        var tokenPresentAfterRemove = _.indexOf(tokensAfterRemove, 'DeviceFamilyKey = MX,SRX,EX');
                        assert.notEqual(tokenPresentAfterRemove, -1, "Values should be appended back, token should contain DeviceFamilyKey = MX,SRX,EX");
                        assert.lengthOf(tokensAfterRemove, tokensBeforeRemove.length, 'Entire token should not be deleted - token values needs to be appended back');
                    });
            
                    it('removeToken method: append back the value in token when \'key and any nobn existent value\' and appendValue is true', function () {
                        searchWidgetObj.removeToken('DeviceFamilyKey = NotAlreadyExists', true); // delete token and append back NotAlreadyExists in the token
                        var tokensAfterRemove = searchWidgetObj.getAllTokens();
                        var tokenPresentAfterRemove = _.indexOf(tokensAfterRemove, 'DeviceFamilyKey = SRX,MX,EX,NotAlreadyExists');
                        assert.notEqual(tokenPresentAfterRemove, -1, "Non existing value should be appended back, token should contain DeviceFamilyKey = SRX,MX,EX,NotAlreadyExists");
                        assert.lengthOf(tokensAfterRemove, tokensBeforeRemove.length, 'Entire token should not be deleted - non existent value will be appended back');
                    });
                    it('removeToken method: remove token with exact \'key value \' when multiple token with same keys exist containing different values', function () {
                        searchWidgetObj.addTokens(['DeviceFamilyKey = TRX']);
                        tokensBeforeRemove = searchWidgetObj.getAllTokens();
                        searchWidgetObj.removeToken('DeviceFamilyKey = TRX'); // delete token having already defined key value pair
                        var tokensAfterRemove = searchWidgetObj.getAllTokens();
                        var tokenPresentAfterRemove = _.indexOf(tokensAfterRemove, 'DeviceFamilyKey = SRX,MX,EX');
                        assert.notEqual(tokenPresentAfterRemove, -1, "Exact token needs to be deleted, token should contain DeviceFamilyKey = SRX,MX,EX");
                        assert.lengthOf(tokensAfterRemove, tokensBeforeRemove.length -1, 'Entire token should not be deleted - already existing token with same key remains');
                    });
                });
            });

        });

        describe('Advance Filter methods', function () {
            var searchWidgetObj;
            var tokens = (['123.43.5.3', 'NOT', 'DeviceFamily = SRX,MX,EX', 'AND', 'Name = test1,test2,test3', 'NOT', 'OSVersion = 12.2,12.3,13.1,12.4', 'OR', '10.10.10.10']);

            before(function () {
                searchWidgetObj = new SearchWidget({
                    "filterMenu": configurationSample.searchConf.filterMenu,
                    "logicMenu": configurationSample.searchConf.logicMenu,
                    "container": searchContainer
                });
                searchWidgetObj.build();
            });

            after(function () {
                searchWidgetObj.destroy();
            });

            it('getAllTokens method: with empty filter bar', function () {
                var allTokens = searchWidgetObj.getAllTokens();
                assert.lengthOf(allTokens, 0, 'filter bar should be empty');
            });

            it('addTokens method: add multiple tokens', function () {
                searchWidgetObj.addTokens(tokens);
                var allTokens = searchWidgetObj.getAllTokens();
                assert.lengthOf(allTokens, tokens.length, 'Filter bar should have ' + tokens.length + ' tokens');
            });

            it('removeAllTokens method: remove all Tokens when tokens are existing', function () {
                var tokensBeforeRemove = searchWidgetObj.getAllTokens();
                assert.notEqual(tokensBeforeRemove.length, 0, 'Filter bar should not be empty');
                searchWidgetObj.removeAllTokens();
                var tokensAfterRemove = searchWidgetObj.getAllTokens();
                assert.lengthOf(tokensAfterRemove, 0, 'All tokens should be removed');
            });

            it('removeAllTokens method: remove all Tokens when no tokens', function () {
                // used to test that method call on empty filter bar should not error out
                var tokensBeforeRemove = searchWidgetObj.getAllTokens();
                assert.equal(tokensBeforeRemove.length, 0, 'Filter bar should be empty');
                searchWidgetObj.removeAllTokens();
                var tokensAfterRemove = searchWidgetObj.getAllTokens();
                assert.lengthOf(tokensAfterRemove, 0, 'No error should happen');
            });

            it('getTokensExpression',function(){
                // used to provide a string that consists the search expression
                searchWidgetObj.addTokens([tokens[0], tokens[1], tokens[2]]);
                assert.equal(searchWidgetObj.getTokensExpression(),'123.43.5.3 NOT DeviceFamilyKey = SRX,MX,EX',"Search expression should match");
            });

            describe('removeToken method', function () {
                var tokensBeforeRemove = [];

                beforeEach(function () {
                    searchWidgetObj.removeAllTokens(); // clear the filter to test
                    searchWidgetObj.addTokens(tokens);
                    tokensBeforeRemove = searchWidgetObj.getAllTokens();
                });

                it('remove singleToken ', function () {
                    searchWidgetObj.removeToken('123.43.5.3');
                    var tokensAfterRemove = searchWidgetObj.getAllTokens();
                    assert.lengthOf(tokensAfterRemove, tokensBeforeRemove.length - 2, 'two tokens should be removed including logical operator');
                    assert.equal(tokensAfterRemove[0], tokensBeforeRemove[2], 'First token should be same as Third token before remove happened');
                    assert.equal(tokensAfterRemove[1], tokensBeforeRemove[3], 'Second token should be same as Fourth token before remove happened');
                });

                it('remove entire token, when only \'key\' is provided', function () {
                    searchWidgetObj.addTokens(['AND', 'DeviceFamily = SRX,MX,EX']);
                    tokensBeforeRemove = searchWidgetObj.getAllTokens();
                    searchWidgetObj.removeToken('DeviceFamily'); // remove only the key
                    var tokensAfterRemove = searchWidgetObj.getAllTokens();
                    var tokenPresentAfterRemove = _.indexOf(tokensAfterRemove, 'DeviceFamily = SRX,MX,EX');
                    assert.equal(tokenPresentAfterRemove, -1, "Entire token should be deleted from list");
                    assert.lengthOf(tokensAfterRemove, tokensBeforeRemove.length - 2, 'two tokens should be removed including logical operator');
                });

            });

        });

        describe('Callback methods triggered', function () {
            var searchWidgetObj;
            var tokens = (['123.43.5.3', 'ManagedStatus = InSync,OutSync', 'ConnectionStatus = Down,Up']);
            var eventTriggered;
            var removedToken;

            function resetEventTriggered() {
                eventTriggered = 0;
            }

            function afterTokenRemoved(deletedToken) {
                eventTriggered++;
                removedToken = deletedToken;
            }

            function afterAllTokenRemoved() {
                eventTriggered++;
            }

            before(function () {
                searchWidgetObj = new SearchWidget({
                    "container": searchContainer,
                    "readOnly": true,
                    "afterTagRemoved": afterTokenRemoved,
                    "afterAllTagRemoved": afterAllTokenRemoved
                });
                searchWidgetObj.build();
            });

            beforeEach(function () {
                resetEventTriggered();
            });

            after(function () {
                searchWidgetObj.destroy();
            });

            it('removeToken method: remove Token, Event should be triggered', function () {
                searchWidgetObj.addTokens(tokens);
                searchWidgetObj.removeToken('ManagedStatus = OutSync');
                assert.equal(eventTriggered, 1, "Event should be triggered");
            });

            it('removeToken method: remove Token, Event should be triggered', function () {
                searchWidgetObj.addTokens(tokens);
                searchWidgetObj.removeToken('ManagedStatus = OutSync', false, true); // avoidTriggerEvent = true
                assert.equal(eventTriggered, 0, "Event should not be triggered");
            });

            it('removeToken method: remove Token, validate the value in callback', function () {
                searchWidgetObj.removeAllTokens();
                searchWidgetObj.addTokens(tokens);
                searchWidgetObj.removeToken('ManagedStatus');
                assert.equal(removedToken, "ManagedStatus = InSync,OutSync", "removed token value should be: ManagedStatus = InSync,OutSync");
            });

            it('removeAllTokens method: remove all Tokens, Event should be triggered', function () {
                searchWidgetObj.removeAllTokens();
                assert.equal(eventTriggered, 1, "Event should be triggered");
            });

            it('removeAllTokens method: remove all Tokens, Event should be not be triggered', function () {
                searchWidgetObj.removeAllTokens(true); // avoidTriggerEvent = true
                assert.equal(eventTriggered, 0, "Event should not be triggered");
            });

        });

        describe('Events triggered', function () {
            var searchWidgetObj;
            var tokens = (['123.43.5.3', 'ManagedStatus = InSync,OutSync', 'ConnectionStatus = Down,Up']);

            before(function () {
                searchWidgetObj = new SearchWidget({
                    "container": searchContainer,
                    "readOnly": true
                });
            });

            after(function () {
                searchWidgetObj.destroy();
            });

            it('ReadOnly search should trigger the slipstream event', function (done) {
                var eventTriggered = 0;
                searchWidgetObj.build();
                searchContainer.on("slipstreamSearch:onChange", function () {
                    eventTriggered++;
                    assert.equal(eventTriggered, 1, "event should be triggered once");
                    done();
                });
                searchWidgetObj.addTokens(tokens);
            });

        });

        describe('UI interaction', function(){
             var TestContext = function() {
                var resultConf = {};
                this.searchContainer = $("div");

                $.extend(resultConf, configurationSample.searchConf, {
                    container:searchContainer
                });

                this.searchWidgetObj = new SearchWidget(resultConf);

                this.searchWidgetObj.build();

                this.inputField = searchContainer.find("input.ui-widget-content");
                this.removeAllTokens = searchContainer.find(".removeAllTokens");

                this.destroy = function() {
                    this.searchWidgetObj.destroy();
                }
            };

            it('Clear All button test',function(){
                var tc = new TestContext();
                tc.searchWidgetObj.addTokens(["test"]);
                tc.removeAllTokens.click();
                assert.equal(tc.searchWidgetObj.getAllTokens().length,0, "container should be empty.");
                tc.destroy();
            });

            it('open parentheses as input should auto advance the cursor', function (done) {
                var tc = new TestContext();
                tc.searchWidgetObj.removeAllTokens();
                assert.equal(tc.searchWidgetObj.getAllTokens().length, 0, "There should be no token in container.");
                tc.inputField.on("keyup", function (e) {
                    var updatedTokens = tc.searchWidgetObj.getAllTokens();
                    assert.equal(updatedTokens.length, 1, "There should be one token in the container.");
                    assert.equal(updatedTokens[0], '(', "There should be open parentheses in the container.");
                    tc.destroy();
                    done();
                });
                tc.inputField.trigger({
                    type: 'keyup',
                    which: 57,
                    shiftKey: true
                });
            });

            it('close parentheses as input should auto advance the cursor', function (done) {
                var tc = new TestContext();
                tc.searchWidgetObj.removeAllTokens();
                tc.searchWidgetObj.addTokens(['(', 'test']);
                tc.inputField.on("keyup", function (e) {
                    var updatedTokens = tc.searchWidgetObj.getAllTokens();
                    assert.equal(updatedTokens.length, 3, "There should be three tokens in the container.");
                    assert.equal(updatedTokens[2], ')', "There should be close parentheses in the container.");
                    tc.destroy();
                    done();
                });
                tc.inputField.trigger({
                    type: 'keyup',
                    which: 48,
                    shiftKey: true
                });
            });

            it('keys should be tokenized with the label provided in config', function (done) {
                var tc = new TestContext();
                tc.searchWidgetObj.removeAllTokens();
                var originalOSVersionLabel = configurationSample.searchConf.filterMenu.OSVersionKey.label;
                tc.inputField.val("osversion");
                tc.inputField.trigger("keyup");
                tc.inputField.on("keydown", function() {
                    var keyElement = searchContainer.find(".tagit-label");
                    assert.equal(keyElement.text(), originalOSVersionLabel, "Enter key should create token with provided label as in config");
                    tc.destroy();
                    done();
                });
                tc.inputField.trigger({
                    type: 'keydown',
                    which: 13
                });
            });

            it('Logical operator should tokenize - valid input - (or)', function (done) {
                var tc = new TestContext();
                tc.searchWidgetObj.removeAllTokens();
                tc.searchWidgetObj.addTokens(['test']);
                tc.inputField.on("keydown", function (e) {
                    if (e.which === $.ui.keyCode.ENTER) {
                        var updatedTokens = tc.searchWidgetObj.getAllTokens();
                        assert.equal(updatedTokens.length, 2, "Logical operator should be tokenized");
                        assert.equal(tc.inputField.hasClass("keyError"), false, "Logical operator should not flag error");
                    }
                    tc.destroy();
                    done();
                });
                tc.inputField.val("or");
                tc.inputField.trigger({
                    type: 'keydown',
                    which: $.ui.keyCode.ENTER
                });
            });

            it('Logical operator should not tokenize - invalid input (o)', function (done) {
                var tc = new TestContext();
                tc.searchWidgetObj.removeAllTokens();
                tc.searchWidgetObj.addTokens(['test']);
                tc.inputField.on("keydown", function (e) {
                    if (e.which === $.ui.keyCode.ENTER) {
                        var updatedTokens = tc.searchWidgetObj.getAllTokens();
                        assert.equal(updatedTokens.length, 1, "Logical operator should not be tokenized");
                        assert.equal(tc.inputField.hasClass("keyError"), true, "Logical operator should flag error");
                    }
                    tc.destroy();
                   done();
                });
                tc.inputField.val("o");
                tc.inputField.trigger({
                    type: 'keydown',
                    which: $.ui.keyCode.ENTER
                });
            });

            it('Logical operator should not have any error when substring of valid logical characters are entered- valid input (o)', function (done) {
                var tc = new TestContext();
                tc.searchWidgetObj.removeAllTokens();
                tc.searchWidgetObj.addTokens(['test']);
                tc.inputField.on("keydown", function (e) {
                    assert.equal(tc.inputField.hasClass("keyError"), false, "Logical operator should not flag error");
                    tc.destroy();
                    done();
                });
                tc.inputField.val("");
                tc.inputField.trigger({
                    type: 'keydown',
                    key: 'o'
                });
            });

            it('Logical operator should not have any error when valid logical characters is entered- valid input (or)', function (done) {
                var tc = new TestContext();
                tc.searchWidgetObj.removeAllTokens();
                tc.searchWidgetObj.addTokens(['test']);
                tc.inputField.on("keydown", function (e) {
                    assert.equal(tc.inputField.hasClass("keyError"), false, "Logical operator should not flag error");
                    tc.destroy();
                    done();
                });
                tc.inputField.val("o");
                tc.inputField.trigger({
                    type: 'keydown',
                    key: 'r'
                });
            });

            it('Logical operator should not have error flag when invalid logical characters is entered- invalid input (or1)', function (done) {
                var tc = new TestContext();
                tc.searchWidgetObj.removeAllTokens();
                tc.searchWidgetObj.addTokens(['test']);
                tc.inputField.on("keydown", function (e) {
                    assert.equal(tc.inputField.hasClass("keyError"), true, "Logical operator should flag error");
                    tc.destroy();
                    done();
                });
                tc.inputField.val("or");
                tc.inputField.trigger({
                    type: 'keydown',
                    key: '1'
                });
            });
        });
        
        describe('Search as you type', function() {
            var TestContext = function(conf) {
                var resultConf = {};
                this.searchContainer = $("div");

                $.extend(resultConf, configurationSample.autocompleteSearchConf, {
                    container:searchContainer
                }, conf);

                this.searchWidgetObj = new SearchWidget(resultConf);
                this.searchWidgetObj.build();

                this.searchContainer = searchContainer;
                this.inputField = searchContainer.find("input.ui-widget-content");
                this.autocompleteInput = searchContainer.find("input.inlineAutocomplete");

                this.destroy = function() {
                    this.searchWidgetObj.destroy();
                }
            };

            describe('Advanced Filter - Search as you type, tokenizeOnEnter', function() {
                var conf = {
                    tokenizeOnEnter: true
                };

                it('fire afterPartialTokenUpdated after character entered from keyboard', function(done) {
                    var tc;
                    var partialToken;

                    tc = new TestContext($.extend(conf, {
                        afterPartialTagUpdated: function() {
                            partialToken = tc.inputField.val();
                        }
                    }));

                    tc.inputField.val("f");
                    tc.inputField.on("keyup", function() {
                        assert.equal(partialToken, "f", "afterPartialTokenUpdated should fire after character entered from keyboard");
                        tc.destroy();
                        done();
                    });
                    tc.inputField.trigger("keyup");
                });

                it('autocomplete string should be displayed after key prefix entered from keyboard', function(done) {
                    var tc = new TestContext(conf);
                    tc.inputField.val("U");
                    tc.inputField.on("keyup", function() {
                        assert.equal(tc.autocompleteInput.val(), "USR", "Keys should be autocompleted when their prefixes are entered into the input field");
                        tc.destroy();
                        done();
                    });
                    tc.inputField.trigger("keyup");
                });

                it('autocomplete should be executed when TAB key is pressed', function(done) {
                    var tc = new TestContext(conf);
                    tc.inputField.val("U");
                    tc.inputField.trigger("keyup");
                    tc.inputField.on("keydown", function() {
                        var tokens = tc.searchWidgetObj.getAllTokens();
                        assert.equal(tokens[0], "USR", "TAB key should create token from the autocomplete suggestion");
                        tc.destroy();
                        done();
                    });
                    tc.inputField.trigger({
                        type: 'keydown',
                        which: 9
                    });
                });

                it('implicit operator should be AND', function(done) {
                    var tc = new TestContext(conf);

                    tc.inputField.val("foo");
                    tc.inputField.trigger({
                        type: 'keydown',
                        which: 13
                    });

                    tc.inputField.val("bar");
                    tc.inputField.on("keydown", function() {
                        var tokens = tc.searchWidgetObj.getAllTokens();
                        assert.equal(tokens.length, 3, "Three tokens should be generated");
                        assert.equal(tokens[1], "AND", "Operator between the tokens should be 'AND'");
                        tc.destroy();
                        done();
                    });
                    tc.inputField.trigger({
                        type: 'keydown',
                        which: 13
                    });
                });

                it('delete token with implicit operator', function(done) {
                    var tc = new TestContext(conf);

                    tc.inputField.val("foo");
                    tc.inputField.trigger({
                        type: 'keydown',
                        which: 13
                    });

                    tc.inputField.val("bar");
                    tc.inputField.trigger({
                        type: 'keydown',
                        which: 13
                    });

                    tc.inputField.val("foobar");
                    tc.inputField.on("keydown", function() {
                        tc.searchWidgetObj.removeToken("bar");
                        var tokens = tc.searchWidgetObj.getAllTokens();

                        assert.equal(tokens.length, 3, "Three tokens should remain");
                        assert.equal(tokens[0], "foo");
                        assert.equal(tokens[1], "AND");
                        assert.equal(tokens[2], "foobar");

                        tc.searchWidgetObj.removeToken("foo");

                        var tokens = tc.searchWidgetObj.getAllTokens();

                        assert.equal(tokens.length, 1, "One token should remain");
                        assert.equal(tokens[0], "foobar");

                        tc.searchWidgetObj.removeToken("foobar");

                        var tokens = tc.searchWidgetObj.getAllTokens();

                        assert.equal(tokens.length, 0, "No tokens should remain");
                        tc.destroy();
                        done();
                    });
                    tc.inputField.trigger({
                        type: 'keydown',
                        which: 13
                    });
                });
            });

            describe('Advanced Filter - Search as you type, no tokenizeOnEnter', function() {
                var eventTriggered;
                var removedToken;

                function resetEventTriggered() {
                    eventTriggered = 0;
                }

                function afterTokenRemoved(deletedToken) {
                    eventTriggered++;
                    removedToken = deletedToken;
                }

                var conf = {
                    tokenizeOnEnter: false
                };

                it('token should not be created when ENTER key is pressed', function(done) {
                    var tc = new TestContext(conf);

                    tc.inputField.val("foo");
                    tc.inputField.on("keydown", function() {
                        var tokens = tc.searchContainer.find(".tagit-choice");
                        assert.equal(tokens.length, 0, "The ENTER key should not have created a token");
                        tc.destroy();
                        done();
                    });
                    tc.inputField.trigger({
                        type: 'keydown',
                        which: 13
                    });
                });

                it('delete token with implicit operator as false', function () {

                    var testConf = {
                        "afterTagRemoved": afterTokenRemoved,
                        "allowPartialTokens": true,
                        "autocomplete": {
                            inline: true
                        },
                        "keyTokens": {
                            "maxNumber": 1,
                            "position": "start"
                        },
                        "implicitLogicOperator": false
                    };

                    $.extend(testConf, conf);

                    var tc = new TestContext(testConf);
                    tc.searchWidgetObj.addTokens(["ADDR", "nonKeyToken1", "nonKeyToken2"]);
                    assert.equal(tc.searchWidgetObj.getAllTokens().length, 3, "container should have 3 element.");

                    var tokenUlElement = tc.searchContainer.find("ul.ui-widget-content");

                    var nonKeyTokenCloseIcon2 = tokenUlElement.find("li span:contains('nonKeyToken2')").siblings().find("svg.tagit-close");
                    resetEventTriggered();
                    nonKeyTokenCloseIcon2.click();
                    assert.equal(eventTriggered, 1, "Event should be triggered with Non key element");
                    assert.equal(tc.searchWidgetObj.getAllTokens().length, 2, "container should have 2 element.");
                    assert.equal(removedToken, "nonKeyToken2", "removed token value should be as: nonKeyToken2");

                    var nonKeyTokenCloseIcon1 = tokenUlElement.find("li span:contains('nonKeyToken1')").siblings().find("svg.tagit-close");
                    resetEventTriggered();
                    nonKeyTokenCloseIcon1.click();
                    assert.equal(eventTriggered, 1, "Event should be triggered with Non key element");
                    assert.equal(tc.searchWidgetObj.getAllTokens().length, 1, "container should have 1 element.");
                    assert.equal(removedToken, "nonKeyToken1", "removed token value should be as: nonKeyToken1");

                    var addrCloseIcon = tokenUlElement.find("li span:contains('ADDR')").siblings().find("svg.tagit-close");
                    resetEventTriggered();
                    addrCloseIcon.click();
                    assert.equal(eventTriggered, 1, "Event should be triggered with defined key element");
                    assert.equal(tc.searchWidgetObj.getAllTokens().length, 0, "container should have no element.");
                    assert.equal(removedToken, "ADDR", "removed token value should be as: ADDR");

                    tc.destroy();
                });
            });

            describe('Advanced Filter - no partial tokens', function() {
                var conf = {
                    tokenizeOnEnter: false,
                    allowPartialTokens: false
                };

                it('afterPartialTag should not be called after keyboard input', function(done) {
                    var partialToken;
                    var tc;

                    tc = new TestContext($.extend(conf, {
                        afterPartialTagUpdated: function() {
                            partialToken = tc.inputField.val();
                        }
                    }));

                    tc.inputField.val("f");
                    tc.inputField.on("keyup", function() {
                        assert.isUndefined(partialToken, "A partial token should not have been created");
                        tc.destroy();
                        done();
                    });
                    tc.inputField.trigger("keyup");
                });
            });

            describe('Advanced Filter - Search as you type, maxNumber KeyTokens', function() {

                it('keys should be tokenized with the label provided in config', function (done) {
                    var tc = new TestContext();
                    var originalUSRLabel = configurationSample.autocompleteSearchConf.filterMenu.USR.label;
                    tc.inputField.val("u");
                    tc.inputField.trigger("keyup");
                    tc.inputField.on("keydown", function() {
                        var tokens = tc.searchWidgetObj.getAllTokens();
                        assert.equal(tokens[0], originalUSRLabel, "TAB key should create token with provided label as in config");
                        tc.destroy();
                        done();
                    });
                    tc.inputField.trigger({
                        type: 'keydown',
                        which: 9
                    });
                });

                it('Multiple keys are allowed by default', function (done) {
                    var tc = new TestContext();
                    tc.inputField.val("U");
                    tc.inputField.on("keydown", function() {
                        assert.equal(tc.inputField.val(), "U", "Keys should be autocompleted when one key is already entered, input value shoud be present");
                        assert.equal(tc.autocompleteInput.val(), "USR", "Keys should be autocompleted when one key is already entered, field should have key");
                        tc.destroy();
                        done();
                    });
                    tc.inputField.trigger({
                        type: 'keydown',
                        which: 9
                    });
                });

                it('Multiple keys are allowed as default, if maxNumber is not positive integer', function(done) {
                    var tc = new TestContext({keyTokens: {maxNumber: 0}});
                    tc.inputField.val("U");
                    tc.inputField.on("keydown", function() {
                        assert.equal(tc.inputField.val(), "U", "Keys should be autocompleted when one key is already entered, input value shoud be present");
                        assert.equal(tc.autocompleteInput.val(), "USR", "Keys should be autocompleted when one key is already entered, field should have key");
                        tc.destroy();
                        done();
                    });
                    tc.inputField.trigger({
                        type: 'keydown',
                        which: 9
                    });
                });

                it('Multiple keys should not be allowed to be tokenized - duplicate Key', function(done) {
                    var tc = new TestContext({keyTokens: {maxNumber: 1}});
                    tc.searchWidgetObj.addTokens(['USR']);
                    tc.inputField.val("u");
                    tc.inputField.trigger("keyup");
                    tc.inputField.on("keydown", function() {
                        var tokens = tc.searchWidgetObj.getAllTokens();
                        assert.notEqual(tokens[2].toUpperCase(), "USR", "TAB key should not create duplicate key");
                        tc.destroy();
                        done();
                    });
                    tc.inputField.trigger({
                        type: 'keydown',
                        which: 9
                    });
                });

                it('Multiple keys should not be allowed to be tokenized - non-duplicate Key', function(done) {
                    var tc = new TestContext({keyTokens: {maxNumber: 1}});
                    tc.searchWidgetObj.addTokens(['USR']);
                    tc.inputField.val("s");
                    tc.inputField.trigger("keyup");
                    tc.inputField.on("keydown", function() {
                        var tokens = tc.searchWidgetObj.getAllTokens();
                        assert.notEqual(tokens[2].toUpperCase(), "SITE", "TAB key should not create another token key");
                        tc.destroy();
                        done();
                    });
                    tc.inputField.trigger({
                        type: 'keydown',
                        which: 9
                    });
                });

                it('if Multiple keys are not allowed, on second key type value, autocomplete should not be displayed', function (done) {
                    var tc = new TestContext({keyTokens: {maxNumber: 1}});
                    tc.searchWidgetObj.addTokens(['USR']);
                    tc.inputField.val("U");
                    tc.inputField.on("keydown", function() {
                        assert.equal(tc.inputField.val(), "U", "Keys should not be autocompleted when one key is already entered, only input value shoud be present");
                        assert.equal(tc.autocompleteInput.val(), "", "Keys should not be autocompleted when one key is already entered, field should be empty");
                        tc.destroy();
                        done();
                    });
                    tc.inputField.trigger({
                        type: 'keydown',
                        which: 9
                    });
                });

                it('Multiple keys should be allowed to be tokenized with duplicate Key', function(done) {
                    var tc = new TestContext({keyTokens: {maxNumber: 2}});
                    tc.searchWidgetObj.addTokens(['USR']);
                    tc.inputField.val("U");
                    tc.inputField.trigger("keyup");
                    tc.inputField.on("keydown", function() {
                        var tokens = tc.searchWidgetObj.getAllTokens();
                        assert.equal(tokens[2].toUpperCase(), "USR", "TAB key should create duplicate key");
                        tc.destroy();
                        done();
                    });
                    tc.inputField.trigger({
                        type: 'keydown',
                        which: 9
                    });
                });

                it('if Multiple keys are allowed with 2 keys, on second key type value, autocomplete should be displayed', function (done) {
                    var tc = new TestContext({keyTokens: {maxNumber: 2}});
                    tc.searchWidgetObj.addTokens(['USR']);
                    tc.inputField.val("U");
                    tc.inputField.on("keydown", function() {
                        assert.equal(tc.inputField.val(), "U", "Keys should be autocompleted when one key is already entered, only input value should be present");
                        assert.equal(tc.autocompleteInput.val(), "USR", "Keys should not autocompleted when one key is already entered, field should have full key as value");
                        tc.destroy();
                        done();
                    });
                    tc.inputField.trigger({
                        type: 'keydown',
                        which: 9
                    });
                });

                it('Multiple keys should be allowed to be tokenized with non-duplicate Key', function(done) {
                    var tc = new TestContext({keyTokens: {maxNumber: 3}});
                    tc.searchWidgetObj.addTokens(['USR']);
                    tc.inputField.val("S");
                    tc.inputField.trigger("keyup");
                    tc.inputField.on("keydown", function() {
                        var tokens = tc.searchWidgetObj.getAllTokens();
                        assert.equal(tokens[2].toUpperCase(), "SITE", "TAB key should create another token key respective to the configuration keys");
                        tc.destroy();
                        done();
                    });
                    tc.inputField.trigger({
                        type: 'keydown',
                        which: 9
                    });
                });
            });

            describe('Advanced Filter - Search as you type, keyTokens position config', function() {
                it('First token should be a key - input as key', function(done) {
                    var tc = new TestContext({keyTokens: {
                        position: "start"
                    }});
                    tc.inputField.val("U");
                    tc.inputField.trigger("keyup");
                    tc.inputField.on("keydown", function() {
                        var tokens = tc.searchWidgetObj.getAllTokens();
                        assert.equal(tokens.length, 1, "only one token should be existing");
                        assert.equal(tokens[0], "USR", "TAB key should create first token from the configuration key");
                        tc.destroy();
                        done();
                    });
                    tc.inputField.trigger({
                        type: 'keydown',
                        which: 9
                    });
                });

                it('First token should be a key - input as non-key', function(done) {
                    var conf = {
                        allowPartialTokens: false,
                        keyTokens: {
                            position: "start"
                        }
                    };
                    var tc = new TestContext(conf);
                    tc.inputField.val("abc");
                    tc.inputField.trigger("keyup");
                    tc.inputField.on("keydown", function() {
                        var tokens = tc.searchWidgetObj.getAllTokens();
                        assert.equal(tokens.length, 0, "only one token should be existing");
                        tc.destroy();
                        done();
                    });
                    tc.inputField.trigger({
                        type: 'keydown',
                        which: 9
                    });
                });

                it('First token can be any token type - input as non-key', function(done) {
                    var tc = new TestContext({keyTokens: {
                        position: "any"
                    }});
                    tc.inputField.val("test");
                    tc.inputField.trigger("keyup");
                    tc.inputField.on("keydown", function() {
                        var tokens = tc.searchWidgetObj.getAllTokens();
                        assert.equal(tokens.length, 1, "One token should be created");
                        assert.equal(tokens[0], "test", "Enter key should be able to create first token as any type of token");
                        tc.destroy();
                        done();
                    });
                    tc.inputField.trigger({
                        type: 'keydown',
                        which: 13
                    });
                });
            });

            describe('Advanced Filter - UI elements', function () {
                it('Remove Icon should be part of tokenized search term', function () {
                    var tc = new TestContext();
                    tc.searchWidgetObj.removeAllTokens();
                    tc.searchWidgetObj.addTokens(['test']);
                    var removeIconElement = searchContainer.find(".tagit-close");
                    assert.equal(removeIconElement.length, 1, "Only one remove icon should be present");
                    tc.destroy();
                });
            });
        });

        describe('Exception Handling if container not defined', function () {
            var searchWidgetObj;
            var noContainerMessage = 'The container property required to build the Search widget is missing';

            before(function () {
                searchWidgetObj = new SearchWidget({
                    "container": 'noSuchContainer' // no such DOM container
                }).build();
            });

            function callMethod(functionMethod, params) {
                // common method to test the exception in case
                // calling methods on a search widget built on non existent container
                var exceptionMessage;
                try {
                    functionMethod.call(params);
                } catch (e) {
                    exceptionMessage = e.message;
                }

                assert.equal(exceptionMessage, noContainerMessage, 'No Container Exception should be thrown');
            }

            it('addTokens method: when container not defined', function () {
                callMethod(searchWidgetObj.addTokens, ['token1', 'token2']);
            });

            it('replaceToken method: when container not defined', function () {
                callMethod(searchWidgetObj.replaceToken, ['NameKey', 'token2']);
            });

            it('removeToken method: when container not defined', function () {
                callMethod(searchWidgetObj.removeToken, ['token1']);
            });

            it('removeAllTokens method: when container not defined', function () {
                callMethod(searchWidgetObj.removeAllTokens);
            });

            it('getAllTokens method: when container not defined', function () {
                callMethod(searchWidgetObj.getAllTokens);
            });

            it('getTokensExpression method: when container not defined', function () {
                callMethod(searchWidgetObj.getTokensExpression);
            });

            it('destroy method: when container not defined', function () {
                callMethod(searchWidgetObj.destroy);
            });
        });

        describe('Actions on Container', function(){
            var TestContext = function() {
                var resultConf = {};
                this.searchContainer = $("div");

                $.extend(resultConf, configurationSample.searchConf, {
                    container:searchContainer
                });

                this.searchWidgetObj = new SearchWidget(resultConf);

                this.searchWidgetObj.build();

                this.destroy = function() {
                    this.searchWidgetObj.destroy();
                }
            };

            it('Click on logical operator should get updated with new selected value', function (done) {
                var tc = new TestContext();
                tc.searchWidgetObj.removeAllTokens();
                tc.searchWidgetObj.addTokens(['test1', 'OR', 'test2', 'AND', 'test3']);
                var firstLogicalOperator = searchContainer.find("li.token1");
                var firstOperatorSuggestion = searchContainer.find("ul#logicOperatorMenu > li:first a");

                firstLogicalOperator.on("click", function (e) {
                    $.when(firstOperatorSuggestion.trigger("mousedown")).done(function () {
                        var updatedFirstLogicalOperator = searchContainer.find("li.token1 > input").val();
                        var suggestedValue = firstOperatorSuggestion.text();
                        assert.equal(updatedFirstLogicalOperator, suggestedValue, "Logical operator should be updated.");
                        var updatedTokens = tc.searchWidgetObj.getAllTokens();
                        assert.equal(updatedTokens[1], suggestedValue, "Logical operator should be updated with suggested value");
                    });
                    tc.destroy();
                    done();
                });

                firstLogicalOperator.trigger("click");
            });

            it('Remove Icon should be part of tokenized search term', function () {
                var tc = new TestContext();
                tc.searchWidgetObj.removeAllTokens();
                tc.searchWidgetObj.addTokens(['test']);
                var removeIconElement = searchContainer.find(".tagit-close");
                assert.equal(removeIconElement.length, 1, "Only one remove icon should be present");
                tc.destroy();
            });
        });
    });
});