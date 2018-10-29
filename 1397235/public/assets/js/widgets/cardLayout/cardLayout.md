# Card Layout Widget


## Introduction
The card layout widget is a reusable graphical user interface that renders cards in a responsive layout.


## API
The card layout widget follows the widget programming interface standards, therefore it exposes: build and destroy methods. Any configuration required by the widget is passed to its constructor.


## Configuration
The configuration object has the following properties:

```javascript
{
    container:  <(required) DOM object that defines where the widget will be rendered>,
    options: <(required) Object, defines additional properties used to modify the interaction and provide data in the card layout>,
    content: <Object, Slipstream view that defines the content of a card in the card layout>
}
```

For example, a card layout widget could be instantiated with the following configuration:

```javascript
    var CardLayoutWidget = new CardLayoutWidget({
        "container": this.$responsiveWidthCards, //cardLayout container
        "options": {
            "subTitle": {
                "content": "Card Layout Title for Responsive Cards",
                "help": {
                    "content": "Tooltip for the subtitle of a <br/> Card Layout Widget",
                    "ua-help-text": "More..",
                    "ua-help-identifier": "alias_for_ua_event_binding"
                }
            },
            "cardSize": {
                "height": 90,
                "width": "20%", //percentage width supports min-width and max-width
                "min-width": 280,
                "max-width": 400
            },
            "data": {
                "url": "/assets/js/widgets/cardLayout/tests/dataSample/cardsData.json",
                "root": "root1.root2.root3",
                "id": "name" //property that contains the card id
            },
            "cardSelection": "multi",
            "layout": "grid" //options: "grid", "carousel"
        },
        "content": CardsView //Slipstream view
    });
```

### container
The container property represents the DOM element that will contain the card layout widget.

### options
It defines an Object with the subTitle (optional), data and cardSize properties required to configure the card layout widget. It is a required property and the Object includes subTitle, layout, cardSize, data, cardSelection and group.

#### subTitle
It defines the subtitle of the card layout. Its data type is a string or an Object. If it is a string, the subtitle value is provided with this property; in the case of an Object, in addition to the subtitle, a help icon can be included. The subtitle object has the properties: content, help.

**content**
String, adds a subtitle to the card layout.

**help**
Object, adds a help icon next to the subtitle. It has the properties: content, ua-help-text and ua-help-identifier

- **content**
String, defines the content of the help tooltip

- ***ua-help-text***
String, defines the content of text for the more link tooltip.

- ***ua-help-identifier***
String, adds an alias for user assistance event binding.

For example, the subtitle property in a card layout configuration could be:

```javascript
var cardLayoutConfiguration = {
    ...
    "subTitle": { //obj
        "content": "Card Layout Title for Responsive Cards",
        "help": {
            "content": "Tooltip for the subtitle of a <br/> Card Layout Widget",
            "ua-help-text": "More..",
            "ua-help-identifier": "alias_for_ua_event_binding"
        }
    },
    ...
}
```

#### layout
An optional property that defines the type of layout that the cardLayout widget will render. It could be "grid", "carousel" or "bar". "grid" is the default value and will render the cards in a grid layout. "carousel" renders the cards in a carousel format. "bar" renders the cards in a carousel format but closer to each other, like in a summary bar style.

#### cardSize
It's a required property and it's represented by an Object with the height and width of the card. It has the properties: height, width, min-width and max-width

**height**
Required property, represents the height of a card.

**width**
In the case of *grid* layout, it is a required property, represents the width of a card. If the value is a number indicates the width in pixels that a card will have and the card will not be responsive. If the width is defined as a string, then its value should be a percentage (for example, "30%"). The percentage indicates the width of the card with respect to the card layout container. A width defined in percentage could also work with other properties defined in the cardSize Object like min-width and max-width. min-width and max-width is not available for a card defined as a number (pixels).
In the case of *carousel* layout, the width can only be represented in percentages, and it is an optional property. When absent, it will default to 25%. It defines the number of cards that will be shown in the carousel; for example: a 25% of the width will allow to show 4 cards (100/25) at a time.  min-width and max-width are optional properties that indicate the minimum width and the maximum with a card should have.

**min-width**
Optional property, available only if the width has been defined in percentages, it represents the min width a card could have for the available the card layout container width.

**max-width**
Optional property, available only if the width has been defined in percentages, it represents the max width a card could have for the available the card layout container width.

For example, the cardSize property in a card layout configuration could be:

```javascript
var cardLayoutConfiguration = {
    ...
    "cardSize": {
        "height": 90,
        "width": "20%", //percentage width supports min-width and max-width
        "min-width": 280,
        "max-width": 400
    },
    ...
}
```

#### data
It is a required property, and it's represented by an Object that should include id property and optionally, the disabled property. If the data will be available from a remote server, then the data Object should include the url, and optionally the header and root properties. If data is available locally, then the getData callback should be implemented.

**url**
Required property if data source is remote. It represents the endpoint that will provide data to be shown in the cards layout.

**headers**
Optional property, represents the headers (for example, Authorization and Accept) required to be attached to the API request.

**root**
Optional property, represents the location within the response at which the data starts.

**getData**
Required property if data source is local. It is invoked to request the cards data and includes the addCardsData parameter. addCardsData is a function that getData implementation should call with the cards data. Data is expected to be an array of Objects with each of them representing the card data. For example:

```javascript
var cardLayoutConfiguration = {
    ...
    "data": {
         "id": "name", //property that contains the card id
                   "getData": function (addCardsData) {
                       addCardsData(localCardsData);//where localCardsData represents the cards data
                   }
    },
    ...
}
```

**id**
Required property, defines the name of the attribute that will represent the unique id within the response.

**disabled**
Optional property, defines the name of the attribute that will represent the disabled value of a card (true/false) within the response. All cards are enabled by default unless data (disabled value) indicates otherwise. When a card is disabled, user interaction is disabled (for example, the more details link and the help icon are disabled) and the content container will have the slipstream_card_widget_disabled class. The content of the card is provided by the user of the widget and it should be updated to indicate that the card content is disabled. 

For example, the data property in a card layout configuration could be:

```javascript
var cardLayoutConfiguration = {
    ...
    "data": {
        "url": "/assets/js/widgets/cardLayout/tests/dataSample/cardsData.json", //needs connection to Space Server
        "headers": {
            "Authorization": 'Basic c3VwZXI6am5wcjEyMyE=',
            "Accept": 'application/vnd.juniper.sd.service-management.services+json;version=1;q=0.01'
        },
        "root": "root1.root2.root3",
        "id": "name" //property that contains the card id
    },
    ...
}
```

**help**
Optional property, defines the help icon that will be included next to the card title. It is an object with the properties: content, ua-help-text and ua-help-identifier.

- **content**
String, defines the content of the help tooltip

If any icons are added in the tooltip content and application needs them to be themable then, image should be kept in the form of:

```
<svg class="className">
    <use href="svgPath"/>
</svg>
```

where svg image should not have a fill color of its own, and the fill color should be assigned as the default icon color(from theme variables) using className in css.

If the icon is not defined in the above way then, it will not be themable.

- ***ua-help-text***
String, defines the content of text for the more link tooltip.

- ***ua-help-identifier***
String, adds an alias for user assistance event binding.

For example, the subtitle property in a card layout configuration could be:

```javascript
var cardData = {
    ...
    }, { //obj 
        "help": {
            "content": "Tooltip for the subtitle of a <br/> Card Layout Widget",
            "ua-help-text": "More..",
            "ua-help-identifier": "alias_for_ua_event_binding"
        }
    }, {
    ...
}
```

Optionally, if help property is not available in the card data, then a card view could implement the getHelpConfiguration method to include the help icon next to the card title.

#### group
It is an optional property and it enables the representation of cards in groups. It requires that the cards data include the group id property. The group configuration option is an Object with the id and title properties.  

**id**
Required property and represented by a String. It defines the card data property that will provide the group id.

**title**
Optional property and represented by a callback. It defines the title that will be shown in the group title. The callback provides the groupId as a parameter and the expected output is an Object. The Object should include the content property with an html string. Optionally, it could also include the help Object composed by content, ua-help-text and ua-help-identifier. If the callback is absent, the title will only show the groupId.
If any icons added in the title need to be themable then the icon needs to be inline svg. 

For example, the group property in a card layout configuration could be:

```javascript
var cardData = {
    ...
    }, { //obj 
        "group": {
            "id": "groupId",
            "title": function (groupId) {
                return {
                   "content": "Group " + groupId,
                   "help": {
                       "content": "Tooltip for " + groupId,
                       "ua-help-text": "More..",
                       "ua-help-identifier": "alias_for_ua_event_binding"
                   }
                };
            }    
        }
    }, {
    ...
}
```

#### content
It's an optional property, and represented by a [Slipstream view](docs/Views.md) object data type. It is used to render the content of a card. When the card layout widget instantiates the view, it passes the card id and card data for each of the cards in an object (id, data). Optionally, the Slipstream view for the card content could include the methods getTitle, getHelpConfiguration, getTitleIcon and the getFooter methods that if they are available, will be used to render the title, get the help configuration, render the content (html) of the title icon area and render the footer of the card. No parameters are passed to the method and the expected output is a simple string or an HTML string.

If any icons are added in the card content and application needs them to be themable then, image should be kept in the form of:

```
<svg class="className">
    <use href="svgPath"/>
</svg>
```

where svg image should not have a fill color of its own, and the fill color should be assigned as the default icon color(from theme variables) using className in css.

If the icon is not defined in the above way then, it will not be themable.

For example, the content property could be the following:

```javascript
var cardLayoutConfiguration = {
    ...
    "content": cardsView,
    ...
}
```
where cardsView is:

```
var CardsView = function(dataObj) {
    render: function () {
        this.$el.append(dataObj.data.description);
    },
    getTitle: function () {
        var cardId = dataObj.id;
        return "Card " + cardTitle;
    },
    getHelpConfiguration: function () {
        if (this.options.data.cardId == "card2") {
            return {
                "content": "Tooltip for <br/>" + this.options.data.cardId,
                "ua-help-text": "More..",
                "ua-help-identifier": "alias_for_ua_event_binding"
            };
        }
    }
    getFooter: function () {
        var cardDate = dataObj.data.date;
        return "Last updated " + new Date(cardDate);
    },
    getMoreDetails: function () {
        return CardsMoreDetailsView; //Slipstream view
    }
};
```

If ***getFooter*** method is not implemented in the view, then the default card timestamp will be shown. If footer is not needed, then getFooter method should return false. If the footer of a card is available, it could optionally include the "More Details" link. It allows to show more information of a card by replacing the current card view with the more details view. This feature will be available if the view of a card implements the ***getMoreDetails*** method. The method should return a a [Slipstream view](docs/Views.md) which will be rendered on the more details view.

## Methods

###build
Adds the DOM elements and events of the card layout widget in the specified container. For example:

```
    cardLayoutWidget.build();
```

### getCardSelection
Gets the selected cards. It returns an Object containing two attributes: cardsSelected and numberOfCardsSelected. cardsSelected property provides an object with the id of the card as a key and the data of the card as a value for all the selected cards. numberOfCardsSelected represents the number of cards currently selected. For example:

```
    cardLayoutWidget.getCardSelection();
```

### setCardSelection
Sets the state of a card selection. It takes two parameters: cardIds and status. cardIds could be a string or array of strings with the id of the cards that requires a state update. status parameter is optional and it is represented by a boolean; if it is true (or undefined), the card will be selected, if it is false, then the card will deselected. For example:

```
    this.cardLayoutWidget.setCardSelection("Tenant1");
    this.cardLayoutWidget.setCardSelection(["Tenant3", "Tenant5"], false);
```

### toggleCardSelection
Toggles a card selection. It takes the cardIds parameter. cardIds could be a string or array of strings with the id of the cards that require a toggle in their state. For example:

```
    this.cardLayoutWidget.toggleCardSelection("Tenant2");
    this.cardLayoutWidget.toggleCardSelection(["Tenant4", "Tenant6"]);
```

### disable
Disabled a card, so it can not be selected. It takes the cardIds parameter. cardIds could be a string or array of strings with the id of the cards that will be disabled. When a card is disabled, user interaction is disabled (for example, the more details link and the help icon are disabled) and the content container will have the slipstream_card_widget_disabled class. The content of the card is provided by the user of the widget and it should be updated to indicate that the card content is disabled. For example:

```
    cardLayoutWidget.disable("Tenant2");
```

### enable
Enables a card, so it can be selected. It takes the cardIds parameter. cardIds could be a string or array of strings with the id of the cards that will be enabled. User interaction in the card will be enabled, like the more details link and the help icon will be enabled, and the content of the card (defined by the user of the widget) should be enabled also. For example:

```
    cardLayoutWidget.enable("Tenant2");
```

### isDisabled
Check if a card is disabled. It takes the cardId parameter: a string with the id of the card. For example:

```
    cardLayoutWidget.isDisabled("Tenant2");
```

### setFilter
Allows to filter cards by sending a new URL request (provided in data property) with search parameters. The search parameters should be provided in the method parameter using an Object data type with a key (token) and value pair. The key/value is defined by the user of the widget so it can match the back end implementation. The method is available only for grid layout. For example:

```
    this.cardLayoutWidget.setFilter({
        "_search": "last"
    });
```

### removeFilter
Removes all filters added and sends API request so the cards can be rendered without filters. For example:

```
    this.cardLayoutWidget.removeFilter();
```

### destroy
Removes the card layout widget from the container.

```
    cardLayoutWidget.destroy();
```


## Events

### slipstreamGrid.cardsData:onLoadComplete
It is triggered when the data (conf.options.data or conf.options.getData) has been loaded and it is ready to be consumed by the card layout widget. The handler for this event is passed the cardCollectionResponse object with two attributes: status and response. status property indicates if the data load was a "success" or an "error" and the response property provides the received data. For example, to listen for this event, the user of the card layout widget could do the following:

```
$cardLayoutContainer.bind("slipstreamCardLayout.cardsData:onLoadComplete", function (e, cardCollectionResponse) {
    console.log(cardCollectionResponse.status);
    console.log(cardCollectionResponse.response);
});
```

### slipstreamGrid.cardsView:onRenderComplete
It is triggered when the cards view has been rendered with cards data (conf.options.data or conf.options.getData). For example, to listen for this event, the user of the card layout widget could do the following:

```
$cardLayoutContainer.bind("slipstreamCardLayout.cardsView:onRenderComplete", function () {
    console.log("cardLayout is rendered");
});
```

### slipstreamCardLayout.cardSelection
It is triggered when a card is selected and if the options.cardSelection is enabled. The handler for this event is passed the cardSelection object containing two attributes: cardsSelected and numberOfCardsSelected. cardsSelected property provides an object with the id of the card as a key and the data of the card as a value for all the cards selected. numberOfCardsSelected represents the number of cards currently selected. For example, to listen for this event, the user of the card layout widget could do the following:

```
$cardLayoutContainer.bind("slipstreamCardLayout.cardSelection", function (e, cardSelection) {
    console.log(cardSelection.cardsSelected);
    console.log(cardSelection.numberOfCardsSelected);
});
```


## Usage
To create a card layout widget, define at least the container, options, and content (Slipstream view). For example:

```
    new CardLayoutWidget({
       "container": cardContainer, //card container
       "options": cardOptions, //card options
       "content": CardsView //card content Slipstream view
    }).build();
```
where each property follows the format described in the Configuration section.