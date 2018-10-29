/**
 * A sample configuration object that shows the parameters required to build a card layout widget
 *
 * @module configurationSample
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    "widgets/cardLayout/tests/dataSample/localCardsData"
], function (localCardsData) {

    var configurationSample = {};

    configurationSample.carouselResponsiveCards = {
        "subTitle": "Card Layout with Responsive Cards and Carousel View", //string
        "data": {
            "url": "/assets/js/widgets/cardLayout/tests/dataSample/cardsData.json",
            "root": "root1.root2.root3",
            "id": "name", //property that contains the card id
            // "disabled": "disabledState" //property that contains the disabled state
        },
        "cardSelection": "multi", //absent, defaults to "none". also available "single",
        "layout": "carousel", //options: "grid", "carousel"
        "cardSize": {
            "height": 95,
            "width": "20%", //percentage width supports min-width and max-width
            "min-width": 350,
            "max-width": 500
        }
    };

    configurationSample.localBarResponsiveCards = {
        "subTitle": "Card Layout with Responsive Cards and Bar View", //string
        "data": {
            "id": "cardId", //property that contains the card id
            "getData": function (addCardsData) {
                addCardsData(localCardsData.barCard);
            }
        },
        "layout": "bar", //options: "grid", "carousel", "bar"
        "cardSize": {
            "height": 75,
            "width": "5%",
            "min-width": 130,
            "max-width": 300
        }
    };

    configurationSample.barShortResponsiveCards = {
        "subTitle": "Remote data",
        "data": {
            "url": "/assets/js/widgets/cardLayout/tests/dataSample/cardsShortData.json",
            "root": "root1.root2.root3",
            "id": "name"
        },
        "layout": "bar",
        "cardSize": {
            "height": 75,
            "width": "5%",
            "min-width": 130,
            "max-width": 300
        }
    };

    configurationSample.responsiveCards = {
        "subTitle": { //obj
            "content": "Card Layout with Responsive Cards and Grid View",
            "help": {
                "content": "Tooltip for the subtitle of a Card Layout Widget",
                "ua-help-text": "More..",
                "ua-help-identifier": "alias_for_ua_event_binding"
            }
        },
        "data": {
            "url": "/assets/js/widgets/cardLayout/tests/dataSample/cardsData.json",
            "root": "root1.root2.root3",
            "id": "name" //property that contains the card id
        },
        "cardSelection": "multi", //absent, defaults to "none". also available "single"
        "cardSize": {
            "height": 140,
            "width": "33%", //percentage width supports min-width and max-width
            "min-width": 320,
            "max-width": 520
        }
    };

    configurationSample.localResponsiveCards = {
        "subTitle": { //obj
            "content": "Card Layout with Local Data, Responsive Cards and Grid View",
            "help": {
                "content": "Tooltip for the subtitle of a Card Layout Widget",
                "ua-help-text": "More..",
                "ua-help-identifier": "alias_for_ua_event_binding"
            }
        },
        "data": {
            "id": "name", //property that contains the card id
            "getData": function (addCardsData) {
                addCardsData(localCardsData.gridCard);
            }
        },
        "cardSelection": "multi", //absent, defaults to "none". also available "single"
        "cardSize": {
            "height": 140,
            "width": "33%", //percentage width supports min-width and max-width
            "min-width": 320,
            "max-width": 520
        }
    };

    configurationSample.fixedCards = {
        "subTitle": "Card Layout with Fixed Cards and Grid View", //string
        "data": {
            "url": "/assets/js/widgets/cardLayout/tests/dataSample/cardsData.json", //needs connection to Space Server
            "headers": {
                "Authorization": 'Basic c3VwZXI6am5wcjEyMyE=',
                "Accept": 'application/vnd.juniper.sd.service-management.services+json;version=1;q=0.01'
            },
            "root": "root1.root2.root3",
            "id": "name" //property that contains the card id
        },
        // "cardSelection": "single",
        // "cardSelection": "none", //absent defaults to "none"
        "cardSize": {
            "height": 180,
            "width": 310
        }
    };

    var getGroupTitle = function (groupId) {
      if (groupId == "group2") {
          return {
              "content": "Group <i>title</i>: " + groupId
          };
      }
      return {
          "content": "Group " + groupId,
          "help": {
              "content": "Tooltip for " + groupId,
              "ua-help-text": "More..",
              "ua-help-identifier": "alias_for_ua_event_binding"
          }
      };
    };

    configurationSample.groupedCards = {
        "subTitle": { //obj
            "content": "Card Layout with Grouped Cards",
            "help": {
                "content": "Tooltip for the subtitle of a Card Layout Widget",
                "ua-help-text": "More..",
                "ua-help-identifier": "alias_for_ua_event_binding"
            }
        },
        "data": {
            "url": "/api/get-grouped-cards-data",
            "root": "root1.root2.root3",
            "id": "name", //property that contains the card id
        },
        "group": {
            "id": "groupId",
            "title": getGroupTitle
        },
        "cardSelection": "multi", //absent, defaults to "none". also available "single"
        "cardSize": {
            "height": 150,
            "width": "33%", //percentage width supports min-width and max-width
            "min-width": 320,
            "max-width": 520
        }
    };

    return configurationSample;

});