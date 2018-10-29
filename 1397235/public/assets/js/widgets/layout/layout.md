# Layout Widget


## Introduction
The Layout widget is a reusable graphical user interface that allows users to render a complex layout with multiple panels.

## API
The Layout widget follows the widget programming interface standards, therefore it exposes: build and destroy methods. Any data required by the widget is passed by its constructor.


## Configuration
The configuration object has the following parameters:

```
{
    container:  <DOM object that defines where the widget will be rendered>
    panels: <Array of objects that defines the panels that will be rendered and that is part of a layout. It should be an array with objects with the following parameters:>
    id: <String, defines the id of the panel, required. The id should be unique in the layout configuration.>
    content: <Array or Slipstream view, required. Defines content of the panel and represented by a [Slipstream view](docs/Views.md) object data type or an array of Objects if the content of the panel is expected to be another sets of panels.>
    height: <number that defines the height of a panel. The height of this item is relative to the other children of its parent in percent.>
    width: <number that defines the width of a panel. The width of this item is relative to the other children of its parent in percent.>
    isClosable: <boolean that determines if the panel is closable. If false, the close icon on the items tab will be hidden. Default value is false.>
    type: <String that defines the type of the panel. Possible values are 'row', 'column', or 'component'. row and column should be used when content is an array of other panels. component should be used when the content is a [Slipstream view](docs/Views.md) and is the default value.>
    events: <Object that defines the callbacks that will be invoked when an event in the layout widget is triggered; for example, when a panel is closed.>
}
```

For example, a layout widget could be instantiated with the following configuration:

```
    var layoutWidget = new LayoutWidget({
                                     container:  layoutContainer,
                                     panels: panelsArray
                                 });
```

where the panelsArray variable for the panels parameter is an array of objects. For example:

```
    var panelsArray = [{
       type: 'column',
       id: 'grids',
       content: [{
           id:"simpleGrid",
           content:new SimpleGridView(),
           height: 70,
           width: 70
       },{
           id:"smallGrid",
           height: 30,
           width: 100,
           content: new SmallGrid(),
           isClosable: true
       }]
    }];
```

### container
The container parameter represents the DOM element that will contain the layout widget.

### panels
The panels parameter represents the panels that will be rendered and that is part of a layout. It should be an array with objects with the following parameters:
- id: id of the panel and represented by a string primitive data type. The id should be unique in the layout configuration.
- content: content of the panel and represented by a Slipstream view object data type [Slipstream view](docs/Views.md) or an array of Objects if the content of the panel is expected to be another sets of panels.
- height <optional>: defines the height of a panel. The height of this item is relative to the other children of its parent in percent. If it is not specified, then the panels height will take the available height.
- width <optional>: defines the height of a panel. The width of this item is relative to the other children of its parent in percent. If it not specified, then the panel width will be divided equally among the available width.
- isClosable <optional>: determines if the panel is closable. If false, the close icon on the items tab will be hidden . Default value is false.
- isExpandable <optional>: determines if the panel is expandable/collapsable. If false, the expand icon on the items tab will be hidden . Default value is false.
- type <optional>: Define the type of the panel. Possible values are 'row', 'column', or 'component'. row and column should be used when content is an array of other panels. component should be used when the content is a [Slipstream view](docs/Views.md), it is the default value.

For example:

```
    var panelsArray = [{
       type: 'column',
       id: 'grids',
       content: [{
           id:"simpleGrid",
           content:new SimpleGridView(),
           height: 70,
           width: 70
       },{
           id:"smallGrid",
           height: 30,
           width: 100,
           content: new SmallGrid(),
           isClosable: true
       }]
    }];
```

A column type will render panels horizontally. A row type will render panels vertically, next to each other. A combination of them is possible when the content of one of the panels define a group of panels by using an array of objects.

### events
It defines the callback that will be invoked when an event in the layout widget is triggered; for example, when a panel is closed. It is represented as an Object and its property is:

#### onPanelClosed
It is a callback that will be invoked when a panel is closed. It has the parameters: panelId and panelView where panelId represents the id of the panel and panelView represents the Slipstream view for this panel. For example, the configuration of the layout widget could be:

```
var layoutConfiguration = {
    container:  layoutContainer,
    panels: [{
     type: 'column',
     id: 'horizontalPanels',
         content: [{
             id:"simpleGridWithNewPanel",
             content:simpleGridPanel,
             height: 70,
             isClosable: false
         },{
             id:"smallGrid",
             height: 30,
             content: new SmallGrid(),
             isExpandable: false
         }]
    }],
    events: {
     onPanelClosed: onPanelDestroyedCallback
    }
};
```

where the event callback could be defined as:

```
var onPanelDestroyedCallback = function (panelId, panelView) {
    console.log(panelId);
    panelView.destroy();
};
```

## build
Adds the dom elements and events of the Layout widget in the specified container. For example:

```
    layoutWidget.build();
```

## destroy
Clean up the specified container from the resources created by the Layout widget.

```
    layoutWidget.destroy();
```

## updatePanel
Updates the content of a panel by creating the new panel or updating an existing one. It requires the itemConfiguration parameter:
- itemConfiguration - Configuration of the panel to add/update with same parameters defined for content
- location - by default, a panel will be added at the end of the layout (either at he bottom of the grid if the type of panels is column or at the right if the type is row). If the location is defined as an object with a parentId parameter as the id of the parent panel, then the panel will be added as a child. If the location is not provided, the panel will be added at the end of the layout.

For example:

```
    layoutWidget.updatePanel({
            id:"quickView",
            height: 70,
            width: 30,
            content: quickView,
            isClosable: true
        }, {
            parentId: 'simpleGridQuickView'
    });
```

If a panel is programmatically either maximized or minimised (using the toggleMaximizePanel), then the updatePanel method requires that all the panels are not in the maximize size. In this case, before calling updatePanel, toggleMaximizePanel should be invoked. For example:

```
    layoutWidget.toggleMaximizePanel("simpleGridWithNewPanel", false);
    layoutWidget.updatePanel({
        id:"smallGrid",
        height: 30,
        content: QuickView,
        isExpandable: false
    });
```

where "simpleGridWithNewPanel" and "smallGrid" are all the panels in the layout.

## toggleMaximizePanel
Toggles a panel from regular size to its maximum size. It has the panelId and isMaximized parameters:
- panelId - Required parameter, it represents the id of the panel.
- isMaximized - Optional parameter, it indicates if a panel should be maximised (true) or set to a regular size (false).

For example:

```
    layoutWidget.toggleMaximizePanel("simpleGridWithNewPanel");
```

## destroyPanel
Destroys a panel by removing all its elements (configuration, DOM, events) from the layout widget. It has the panelId parameter:
- panelId - Required parameter, it represents the id of the panel.

For example:

```
    layoutWidget.destroyPanel("simpleGridWithNewPanel");
```

## Usage
To include the layout widget, define the container, and the panels (name and views). For example:

```
    new LayoutWidget({
        container: layoutContainer,
        panels: [{
            type: 'column',
            id: 'grids',
            content: [{
                    id:"simpleGrid",
                    content:new SimpleGridView(),
                    height: 70,
                    width: 100
                },{
                    id:"smallGrid",
                    height: 30,
                    width: 100,
                    content: new SmallGrid(),
                    isClosable: true
            }]
            }]
        }]
    }).build();
```

Or for a layout that will have a dynamic panel (updatePanel method):

```
    new LayoutWidget({
        container: layoutContainer,
        panels: [{
            type: 'column',
            id: 'grids',
            content: [{
                type: 'row',
                id:"simpleGridQuickView",
                content: [{
                    id:"simpleGrid",
                    content:new SimpleGridView(),
                    height: 70,
                    width: 70
                }]
            },{
                id:"smallGrid",
                height: 30,
                width: 100,
                content: new SmallGrid(),
                isClosable: true
            }]
        }]
    }).build();
```