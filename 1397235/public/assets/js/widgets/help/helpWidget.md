# Help Widget


## Introduction
The help widget is a reusable graphical user interface that renders a help icon with a tooltip and a ua-help-identifier (to be linked with an external help page).

The help can be added to a container programmatically or as a component. The current document describes how to add a help programmatically. To add a help as a React component, refer to [Help React Component](public/assets/js/widgets/help/react/help.md).

## API
The help widget follows the widget programming interface standards, therefore it exposes: build and destroy methods. Any configuration required by the widget is passed to its constructor.


## Configuration
The configuration object has the following parameters:

```
{
    container:  <(required) DOM object that defines where the widget will be rendered>
    view: <(optional) Object, defines help tooltip content and help identifier>
    size: <(optional) String, define the size of help icon>
}    
```

For example, a help widget could be instantiated with the following configuration:

```
  var helpWidget = new HelpWidget({
      "container": this.$helpContainer,
      "view":  {
         "content": "Tooltip that shows how to access view help from the Help Widget",
         "ua-help-text": "More..",
         "ua-help-identifier": "alias_for_ua_event_binding"
      },
      "size": "small"
  }).build();
```

### container
The container parameter represents the DOM element that will contain the help widget. The help widget can be added to a specific element (when the *view* attribute is included), which represents the view type, or it can be added to multiple elements, which represents the inline type. Therefore, help widget can be one of the following types: 

- **view type**: The help icon will be appended to the specified container. In this mode, the view attribute must be included, and it represents the content that will be shown when the help icon is hovered. For example:

```
  var helpWidget = new HelpWidget({
      "container": helpContainer,
      "view":  {
         "content": "Tooltip that shows how to access view help from the Help Widget",
         "ua-help-text": "More..",
         "ua-help-identifier": "alias_for_ua_event_binding"
      }
  }).build();
```

- **inline type**: The help-widget will be added to any element that has the *data-help-widget* attribute. The value of the attribute will provide the content of the tooltip when the help icon is hovered. Use *data-ua-id* attribute to add help identifier. For example, for the following markup:

```javascript
    <ul class="inline-help">
        <li data-help-widget="This is an inline help example for element 1">inline Help Example 1</li>
        <li data-help-widget="This is an inline help example for element 2" data-ua-id="alias_for_ua_event_binding">inline Help Example 2</li>
    </ul>
```

The container will be the reference to the .inline-help DOM element (helpContainer). In this case, the help widget can be built using:

```
  var helpWidget = new HelpWidget({
      "container": helpContainer
  }).build();
```

After the help widget is built, two help icons will be added next to each element with the data-help-widget attribute.

### view
It represents the help content associated with the help icon that will be shown on hover of the icon. It is an object with the following attributes:
- **content** A string or html that represents the content of the help tooltip. 
- **ua-help-text** (Optional) The text that will be used as a link to an external help page.
- **ua-help-identifer** (Optional) The [help identifer](https://ssd-git.juniper.net/spog/slipstream/blob/master/docs/help.md) used to create the link to an external help page.

### size
Define the size of help icon. Only "small" size is avaliable. Otherwise, the help widget will use the default size.

## Methods

### build
Adds the dom elements and events of the help widget in the specified container. For example:

```
    helpWidget.build();
```

### enable
Enables the help tooltip of the widget to be able to open. For example:

```
    helpWidget.enable();
```

### disable
Disables the help tooltip of the widget from being able to open. For example:

```
    helpWidget.disable();
```

### destroy
Clean up the specified container from the resources created by the help widget.

```
    helpWidget.destroy();
```


## Usage
For view help, include a help widget with the container and the view. For example:

```
    new HelpWidget({
        "container": this.$helpContainer,
         "view":  {
            "content": "Tooltip that shows how to access view help from the Help Widget",
            "ua-help-text": "More..",
            "ua-help-identifier": "alias_for_ua_event_binding"
        }
    }).build();
```

For inline help, include a help widget with the container. For example:

```
    new HelpWidget({
        "container": this.$helpContainer,
    }).build();
```