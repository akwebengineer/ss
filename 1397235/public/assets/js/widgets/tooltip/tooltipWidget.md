# Tooltip Widget


## Introduction
The Tooltip widget is a reusable graphical user interface that allows users to show a tooltip in the selected container.

The tooltip can be added to a container programmatically or as a component. The current document describes how to add a tooltip programmatically. To add a tooltip as a React component, refer to [Tooltip React Component](public/assets/js/widgets/tooltip/react/tooltip.md).

## API
The Tooltip widget follows the widget programming interface standards, therefore it exposes: a build and destroy methods. Any data required by the widget is passed by its constructor.


### Configuration
The configuration object has three variables:

```
{
    container: <define the DOM element where the widget will be rendered>,
    elements: <optional, define the parameters that overwrite the default behavior of the tooltip like minWidth, maxHeight, position, etc.>
    view: <optional, define the content that the tooltip will show when the assigned container is hovered.>
}
```

For example, a Tooltip widget with default values should be instantiated with:

```
var tooltip = new TooltipWidget({
    "container": this.el
});
```

A Tooltip widget with user defined values should be instantiated with:

```
var tooltip = new TooltipWidget({
    "elements": configurationSample,
    "container": stringTooltipContainer
    "view": templateView
}).build()
```

where the "elements" should be defined in a set of key/value pairs. For example:

```
var configurationSample = {
    "minWidth": 300,
    "maxHeight": 300,
    "position": 'right',
    "interactive": true
}
```

## Container
It represents the DOM element that will have a tooltip. If the container doesn't include the 'tooltip' class, then a view (view parameter) should be provided.

## Elements
It represents an object with the configuration parameters required to overwrite the default tooltip behavior. The parameters are:

**minWidth**
Set a minimum width for the tooltip. Default: 0 (auto width).

**maxWidth**
Set a maximum width for the tooltip. Default: null (no max width).

**position**
Set the position of the tooltip. Default: 'top'.

**offsetX**
Offsets the tooltip (in pixels) farther left/right from the origin. Default: 0.

**offsetY**
Offsets the tooltip (in pixels) farther up/down from the origin. Default: 0.

**functionBefore**
Create a custom function to be fired before the tooltip opens. This function may prevent or hold off the opening. Default: function(origin, continueTooltip) { continueTooltip(); }

**functionReady**
Create a custom function to be fired when the tooltip and its contents have been added to the DOM. Default: function(origin, tooltip) {}

**contentCloning**
If you provide a jQuery object to the 'content' option, this sets if it is a clone of this object that should actually be used. Default: false

**trigger** 
Indicates when tooltip should open. This parameter can have either of these two values: 'hover' and 'click'. The default value is 'hover'. When the trigger is click, the close icon for tooltips will be available.

**onlyOne** 
If we only want one tooltip open at a time, close all tooltips currently open and not already disappearing. The default value is false.

## View
It defines the content of the tooltip. The content can be a simple string o a HTML markup like images, text formatting tags, etc. If a view is not defined, all elements with a tooltip class will be searched and their title attribute will be used as the content of the tooltip.

### Build
Adds the dom elements and events of the Tooltip widget in the specified container. For example:

```
tooltip.build();
```

### Destroy
Clean up the specified container from the resources created by the Tooltip widget.

```
tooltip.destroy();
```

## Usage
To include the Tooltip widget, a container with a tooltip class or a html node or string should be defined.

### Using a tooltip class
- The HTML markup should include a container with the tooltip class and the title that will be showed in a tooltip:

```
<li>
    Tooltip with simple text on the image: <svg class="ua-field-help tooltip" title="Test Help Tooltp"><use href="#icon_help"></use></svg>
</li>
```

- The Javascript code that will be used to render a tooltip for the HTML markup above should be:

```
new TooltipWidget({
    "container": this.el
}).build();
```

### Using a string as a tooltip content
- The HTML markup that will be hovered to show a tooltip could be the following:

```
 <li id="stringTooltip">
    Tooltip with string on the view
</li>
```

- The Javascript code that will be used to render a tooltip for the HTML markup above should be:

```
var stringView  = "build: build information";
new TooltipWidget({
    "elements": configurationSample.stringContent,
    "container": this.containers.stringTooltip,
    "view": stringView
}).build();
```

### Using a HTML markup as a tooltip content
- The HTML markup that will be hovered to show a tooltip could be the following:

```
<li id="formTooltip" class="viewLine">
    Tooltip with form on hover over the text
</li>
```

- The Javascript code that will be used to render a tooltip for the HTML markup above should be:

```
var formView =  new AddView().render().el;
var tooltip = new TooltipWidget({
    "elements": configurationSample.formContent,
    "container": this.containers.formTooltip,
    "view": formView
}).build();
```

If any icons are added in the tooltip content and application needs them to be themable then, image should be kept in the form of:

```
<svg class="className">
    <use href="svgPath"/>
</svg>
```

where svg image should not have a fill color of its own, and the fill color should be assigned as the default icon color(from theme variables) using className in css.

If the icon is not defined in the above way then, it will not be themable.

## Utility methods
The Tooltip widget exposes additional methods intended to help user to use the widget.

### refresh
It refreshes the tooltip content by destroying any instance of it and adding a new tooltip.

### updateContent
It updates the content of the tooltip. It requires the new content to be rendered. If the new content is not available, then the tooltip won't be showed. For example:

```
tooltip.updateContent("new content");
```
### enable
Enables a tooltip to be able to open it. For example:

```
tooltip.enable();
```

### disable
Disables a tooltip from being able to open it. For example:

```
tooltip.disable();
```