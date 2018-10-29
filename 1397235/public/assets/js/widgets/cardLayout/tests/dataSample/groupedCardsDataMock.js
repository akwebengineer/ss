/**
 * Mocks the API response for cards that includes the group property
 *
 * @module GroupedCardsDataMock
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'mockjax'
], /** @lends GroupedCardsDataMock*/
function (mockjax) {

    /**
     * GroupedCardsDataMock constructor
     *
     * @constructor
     * @class GroupedCardsDataMock- Mocks grouped cards data
     * @returns {Object} Current GroupedCardsDataMock's object: this
     */
    var GroupedCardsDataMock = function () {

        /**
         * Initializes the grouped cards data mock for API response
         */
        this.init = function () {
            var groupedCards = setData();
            mockApiResponse(groupedCards);
        };

        /**
         * Sets cards data
         * @inner
         */
        var setData = function () {
            var groupedCards = {};

            groupedCards.allGroups = {
                "root1": {
                    "root2": {
                        "root3": [
                            {
                                "position": 1,
                                "total": 126,
                                "name": "Tenant1",
                                "tenant": "Starbucks 1",
                                "status": "SLA not met",
                                "progress": "92%",
                                "apps": "35/91",
                                "switch": "151/3 links",
                                "packages": "Gold 37 | Silver 18 | Others 17",
                                "groupId": "group1",
                                "cardId": "card1",
                                "cardType": "description",
                                "help": {
                                    "content": "Tooltip for Tenant1 without 'More'",
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                },
                                "date": "2007-10-06"
                            },
                            {
                                "position": 2,
                                "total": 126,
                                "name": "Tenant2",
                                "tenant": "Facebook 1",
                                "status": "SLA not met",
                                "progress": "86%",
                                "apps": "35/91",
                                "switch": "151/3 links",
                                "packages": "Gold 37 | Silver 18 | Others 17",
                                "groupId": "group1",
                                "cardId": "card2",
                                "cardType": "description",
                                "help": {
                                    "content": "Tooltip for Tenant2",
                                    "ua-help-text": "More..",
                                    "ua-help-identifier": "alias_for_ua_event_binding_card2"
                                },
                                "date": "2007-10-06"
                            },
                            {
                                "position": 3,
                                "total": 126,
                                "name": "Tenant3",
                                "tenant": "LinkedIn 2",
                                "status": "SLA not met",
                                "progress": "75%",
                                "apps": "35/91",
                                "switch": "151/3 links",
                                "packages": "Gold 37 | Silver 18 | Others 17",
                                "groupId": "group1",
                                "cardId": "card3",
                                "cardType": "percentage",
                                "date": "2007-10-06"
                            },
                            {
                                "position": 4,
                                "total": 126,
                                "name": "Tenant4",
                                "tenant": "Facebook 3",
                                "status": "SLA not met",
                                "progress": "68%",
                                "apps": "35/91",
                                "switch": "151/3 links",
                                "packages": "Gold 37 | Silver 18 | Others 17",
                                "groupId": "group1",
                                "cardId": "card4",
                                "cardType": "percentage",
                                "help": {
                                    "content": "Tooltip for <br/> Tenant2",
                                    "ua-help-text": "More..",
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                },
                                "date": "2007-10-06"
                            },
                            {
                                "position": 5,
                                "total": 126,
                                "name": "Tenant5",
                                "tenant": "Starbucks 5",
                                "status": "SLA not met",
                                "progress": "57%",
                                "apps": "35/91",
                                "switch": "151/3 links",
                                "packages": "Gold 37 | Silver 18 | Others 17",
                                "groupId": "group1",
                                "cardId": "card5",
                                "cardType": "description",
                                "date": "2007-10-06"
                            },
                            {
                                "position": 6,
                                "total": 126,
                                "name": "Tenant6",
                                "tenant": "LinkedIn 5",
                                "status": "SLA not met",
                                "progress": "57%",
                                "apps": "35/91",
                                "switch": "151/3 links",
                                "packages": "Gold 37 | Silver 18 | Others 17",
                                "groupId": "group2",
                                "cardId": "card6",
                                "cardType": "description",
                                "help": {
                                    "content": "Tooltip for Tenant6 without ua-help-identifier"
                                },
                                "date": "2007-10-06"
                            },
                            {
                                "position": 7,
                                "total": 126,
                                "name": "Tenant7",
                                "tenant": "Starbucks 1",
                                "status": "SLA not met",
                                "progress": "92%",
                                "apps": "35/91",
                                "switch": "151/3 links",
                                "packages": "Gold 37 | Silver 18 | Others 17",
                                "groupId": "group2",
                                "cardId": "card7",
                                "cardType": "description",
                                "help": {
                                    "content": "Tooltip for <br/> Tenant7",
                                    "ua-help-text": "More..",
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                },
                                "date": "2007-10-06"
                            },
                            {
                                "position": 8,
                                "total": 126,
                                "name": "Tenant8",
                                "tenant": "Facebook 8",
                                "status": "SLA not met",
                                "progress": "86%",
                                "apps": "35/91",
                                "switch": "151/3 links",
                                "packages": "Gold 37 | Silver 18 | Others 17",
                                "groupId": "group2",
                                "cardId": "card8",
                                "cardType": "description",
                                "date": "2007-10-06"
                            },
                            {
                                "position": 9,
                                "total": 126,
                                "name": "Tenant9",
                                "tenant": "LinkedIn 2",
                                "status": "SLA not met",
                                "progress": "75%",
                                "apps": "35/91",
                                "switch": "151/3 links",
                                "packages": "Gold 37 | Silver 18 | Others 17",
                                "groupId": "group2",
                                "cardId": "card9",
                                "cardType": "percentage",
                                "help": {
                                    "content": "Tooltip for <br/> Tenant9",
                                    "ua-help-text": "More..",
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                },
                                "date": "2007-10-06"
                            },
                            {
                                "position": 10,
                                "total": 126,
                                "name": "Tenant10",
                                "tenant": "Facebook 3",
                                "status": "SLA not met",
                                "progress": "68%",
                                "apps": "35/91",
                                "switch": "151/3 links",
                                "packages": "Gold 37 | Silver 18 | Others 17",
                                "groupId": "group3",
                                "cardId": "card10",
                                "cardType": "percentage",
                                "date": "2007-10-06"
                            },
                            {
                                "position": 11,
                                "total": 126,
                                "name": "Tenant11",
                                "tenant": "Starbucks 5",
                                "status": "SLA not met",
                                "progress": "57%",
                                "apps": "35/91",
                                "switch": "151/3 links",
                                "packages": "Gold 37 | Silver 18 | Others 17",
                                "groupId": "group3",
                                "cardId": "card11",
                                "cardType": "description",
                                "date": "2007-10-06"
                            },
                            {
                                "position": 12,
                                "total": 126,
                                "name": "Tenant12",
                                "tenant": "LinkedIn 5",
                                "status": "SLA not met",
                                "progress": "57%",
                                "apps": "35/91",
                                "switch": "151/3 links",
                                "packages": "Gold 37 | Silver 18 | Others 17",
                                "groupId": "group2",
                                "cardId": "card12",
                                "cardType": "description",
                                "date": "2007-10-06"
                            }
                        ]
                    }
                }
            };

            groupedCards.last = {
                "root1": {
                    "root2": {
                        "root3": [
                            {
                                "position": 1,
                                "total": 126,
                                "name": "Tenant1",
                                "tenant": "Starbucks 1",
                                "status": "SLA not met",
                                "progress": "92%",
                                "apps": "35/91",
                                "switch": "151/3 links",
                                "packages": "Gold 37 | Silver 18 | Others 17",
                                "groupId": "group1",
                                "cardId": "card1",
                                "cardType": "description",
                                "help": {
                                    "content": "Tooltip for Tenant1 without 'More'",
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                },
                                "date": "2007-10-06"
                            },
                            {
                                "position": 2,
                                "total": 126,
                                "name": "Tenant2",
                                "tenant": "Facebook 1",
                                "status": "SLA not met",
                                "progress": "86%",
                                "apps": "35/91",
                                "switch": "151/3 links",
                                "packages": "Gold 37 | Silver 18 | Others 17",
                                "groupId": "group1",
                                "cardId": "card2",
                                "cardType": "description",
                                "help": {
                                    "content": "Tooltip for Tenant2",
                                    "ua-help-text": "More..",
                                    "ua-help-identifier": "alias_for_ua_event_binding_card2"
                                },
                                "date": "2007-10-06"
                            },
                            {
                                "position": 6,
                                "total": 126,
                                "name": "Tenant6",
                                "tenant": "LinkedIn 5",
                                "status": "SLA not met",
                                "progress": "57%",
                                "apps": "35/91",
                                "switch": "151/3 links",
                                "packages": "Gold 37 | Silver 18 | Others 17",
                                "groupId": "group2",
                                "cardId": "card6",
                                "cardType": "description",
                                "help": {
                                    "content": "Tooltip for Tenant6 without ua-help-identifier"
                                },
                                "date": "2007-10-06"
                            },
                            {
                                "position": 7,
                                "total": 126,
                                "name": "Tenant7",
                                "tenant": "Starbucks 1",
                                "status": "SLA not met",
                                "progress": "92%",
                                "apps": "35/91",
                                "switch": "151/3 links",
                                "packages": "Gold 37 | Silver 18 | Others 17",
                                "groupId": "group2",
                                "cardId": "card7",
                                "cardType": "description",
                                "help": {
                                    "content": "Tooltip for <br/> Tenant7",
                                    "ua-help-text": "More..",
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                },
                                "date": "2007-10-06"
                            },
                            {
                                "position": 12,
                                "total": 126,
                                "name": "Tenant12",
                                "tenant": "LinkedIn 5",
                                "status": "SLA not met",
                                "progress": "57%",
                                "apps": "35/91",
                                "switch": "151/3 links",
                                "packages": "Gold 37 | Silver 18 | Others 17",
                                "groupId": "group2",
                                "cardId": "card12",
                                "cardType": "description",
                                "date": "2007-10-06"
                            }
                        ]
                    }
                }
            };

            groupedCards.old = {
                "root1": {
                    "root2": {
                        "root3": [
                            {
                                "position": 3,
                                "total": 126,
                                "name": "Tenant3",
                                "tenant": "LinkedIn 2",
                                "status": "SLA not met",
                                "progress": "75%",
                                "apps": "35/91",
                                "switch": "151/3 links",
                                "packages": "Gold 37 | Silver 18 | Others 17",
                                "groupId": "group1",
                                "cardId": "card3",
                                "cardType": "percentage",
                                "date": "2007-10-06"
                            },
                            {
                                "position": 4,
                                "total": 126,
                                "name": "Tenant4",
                                "tenant": "Facebook 3",
                                "status": "SLA not met",
                                "progress": "68%",
                                "apps": "35/91",
                                "switch": "151/3 links",
                                "packages": "Gold 37 | Silver 18 | Others 17",
                                "groupId": "group1",
                                "cardId": "card4",
                                "cardType": "percentage",
                                "help": {
                                    "content": "Tooltip for <br/> Tenant2",
                                    "ua-help-text": "More..",
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                },
                                "date": "2007-10-06"
                            },
                            {
                                "position": 5,
                                "total": 126,
                                "name": "Tenant5",
                                "tenant": "Starbucks 5",
                                "status": "SLA not met",
                                "progress": "57%",
                                "apps": "35/91",
                                "switch": "151/3 links",
                                "packages": "Gold 37 | Silver 18 | Others 17",
                                "groupId": "group1",
                                "cardId": "card5",
                                "cardType": "description",
                                "date": "2007-10-06"
                            },
                            {
                                "position": 8,
                                "total": 126,
                                "name": "Tenant8",
                                "tenant": "Facebook 8",
                                "status": "SLA not met",
                                "progress": "86%",
                                "apps": "35/91",
                                "switch": "151/3 links",
                                "packages": "Gold 37 | Silver 18 | Others 17",
                                "groupId": "group2",
                                "cardId": "card8",
                                "cardType": "description",
                                "date": "2007-10-06"
                            },
                            {
                                "position": 9,
                                "total": 126,
                                "name": "Tenant9",
                                "tenant": "LinkedIn 2",
                                "status": "SLA not met",
                                "progress": "75%",
                                "apps": "35/91",
                                "switch": "151/3 links",
                                "packages": "Gold 37 | Silver 18 | Others 17",
                                "groupId": "group2",
                                "cardId": "card9",
                                "cardType": "percentage",
                                "help": {
                                    "content": "Tooltip for <br/> Tenant9",
                                    "ua-help-text": "More..",
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                },
                                "date": "2007-10-06"
                            },
                            {
                                "position": 10,
                                "total": 126,
                                "name": "Tenant10",
                                "tenant": "Facebook 3",
                                "status": "SLA not met",
                                "progress": "68%",
                                "apps": "35/91",
                                "switch": "151/3 links",
                                "packages": "Gold 37 | Silver 18 | Others 17",
                                "groupId": "group3",
                                "cardId": "card10",
                                "cardType": "percentage",
                                "date": "2007-10-06"
                            },
                            {
                                "position": 11,
                                "total": 126,
                                "name": "Tenant11",
                                "tenant": "Starbucks 5",
                                "status": "SLA not met",
                                "progress": "57%",
                                "apps": "35/91",
                                "switch": "151/3 links",
                                "packages": "Gold 37 | Silver 18 | Others 17",
                                "groupId": "group3",
                                "cardId": "card11",
                                "cardType": "description",
                                "date": "2007-10-06"
                            }
                        ]
                    }
                }
            };

            return groupedCards;
        };

        /**
         * Mocks the API response for cards that includes the group property
         * @param {Object} groupedCards - card data with group property
         * @inner
         */
        var mockApiResponse = function (groupedCards) {
            $.mockjax({
                url: '/api/get-grouped-cards-data',
                dataType: 'json',
                response: function (settings) {
                    console.log('parameters in the mockjack request: ' + settings.data);
                    if (_.isString(settings.data)) {
                        var urlHash = {},
                            seg = settings.data.split('&');
                        for (var i = 0; i < seg.length; i++) {
                            if (!seg[i]) {
                                continue;
                            }
                            var s = seg[i].split('=');
                            urlHash[s[0]] = s[1];
                        }
                        switch (urlHash['_search']) {
                            case "last":
                                this.responseText = groupedCards.last;
                                break;
                            case "old":
                                this.responseText = groupedCards.old;
                                break;
                            default:
                                this.responseText = groupedCards.allGroups;
                        }
                    }
                    else {
                        this.responseText = groupedCards.allGroups;
                    }
                },
                responseTime: 10
            });
        };

    };

    return GroupedCardsDataMock;
});