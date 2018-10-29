/**
 * Mocks the API response for cards that includes the group property
 *
 * @module localCardsData
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define([], /** @lends localCardsData*/
function () {

    /**
     * localCardsData constructor
     *
     * @constructor
     * @class localCardsData- Mocks grouped cards data
     * @returns {Object} Current localCardsData's object: this
     */
    var localCardsData = {};

    localCardsData.barCard = [
        {
            "cardId": "summary1",
            "title": "Total Links",
            "content": "3"
        },
        {
            "cardId": "summary2",
            "title": "Bandwidth Utilized",
            "content": "90%"
        },
        {
            "cardId": "summary3",
            "title": "Throughput (MB/sec)",
            "content": "78.6"
        },
        {
            "cardId": "summary4",
            "title": "Latency (ms)",
            "content": "8"
        },
        {
            "cardId": "summary5",
            "title": "Packet Loss (Monitored)",
            "content": "3%"
        },
        {
            "cardId": "summary6",
            "title": "E2E Delay (ms)",
            "content": "10"
        },
        {
            "cardId": "summary7",
            "title": "Total Links",
            "content": "3_c"
        },
        {
            "cardId": "summary8",
            "title": "Bandwidth Utilized - P2",
            "content": "90_c%"
        },
        {
            "cardId": "summary9",
            "title": "Throughput (MB/sec) - P2",
            "content": "78.6_c"
        },
        {
            "cardId": "summary10",
            "title": "Latency (ms) - P2",
            "content": "8_c"
        },
        {
            "cardId": "summary11",
            "title": "Packet Loss (Monitored) - P2",
            "content": "3_c%"
        },
        {
            "cardId": "summary12",
            "title": "E2E Delay (ms) - P2",
            "content": "10_c"
        },
        {
            "cardId": "summary13",
            "title": "Total Links",
            "content": "3_c1"
        },
        {
            "cardId": "summary14",
            "title": "Bandwidth Utilized - P2",
            "content": "90_c1%"
        },
        {
            "cardId": "summary15",
            "title": "Throughput (MB/sec) - P2",
            "content": "78.6_c1"
        },
        {
            "cardId": "summary16",
            "title": "Latency (ms) - P2",
            "content": "8_c1"
        },
        {
            "cardId": "summary17",
            "title": "Packet Loss (Monitored) - P2",
            "content": "3_c1%"
        },
        {
            "cardId": "summary18",
            "title": "E2E Delay (ms) - P2",
            "content": "10_c1"
        }
    ];

    localCardsData.gridCard = [
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
            "cardId": "card3",
            "cardType": "percentage",
            "disabledState": true,
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
            "cardId": "card4",
            "cardType": "percentage",
            "help": {
                "content": "Tooltip for <br/> Tenant2",
                "ua-help-text": "More..",
                "ua-help-identifier": "alias_for_ua_event_binding"
            },
            "disabled": true,
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
            "cardId": "card12",
            "cardType": "description",
            "date": "2007-10-06"
        }
    ];

    return localCardsData;

});