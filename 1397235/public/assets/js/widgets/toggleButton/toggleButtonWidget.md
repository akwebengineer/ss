# Toggle Button Widget


## Introduction
Toggle button is a reusable graphical user interface that renders a button with on and off states. It is configurable; for example, it could be rendered with a default state (on/off), or it could be disabled.
The toggle button can be added to a container programmatically or as a component. The current document describes how to add a toggle button programmatically. To add a toggle button as a React component, refer to [ToggleButton React Component](public/assets/js/widgets/toggleButton/react/toggleButton.md).


## API
The Toggle button widget follows the widget programming interface standards, therefore it exposes: build and destroy methods. Any configuration required by the widget is passed to its constructor.


## Configuration
The configuration object has the following parameters:

```
{
    container:  <(required) DOM object that defines where the widget will be rendered>
    id: <(required) string, defines the id of the toggle button widget>
    name: <(required) string, defines the name of the toggle button widget>
    on: <(required) boolean, if it is set to true, the toggle button is considered "on"; otherwise it considered is off.]
}    
```

For example, a toggle button widget could be instantiated with the following configuration:

```
  var toggleButtonWidget = new ToggleButtonWidget({
      "container": this.$toggleButtonContainer,
      "id": "togglebutton_1",
      "name": "togglebutton_1",
      "on": false
  }).build();
```

### container
The container parameter represents the DOM element that will contain the toggle button widget.

### id
It defines the id that the input element in the toggle button widget will be assigned to. It is a string and it has to be unique in the page/DOM.

### name
It defines the name that the input element in the toggle button widget will be assigned to. It is a string data type.

### on
It defines the state of the toggle button widget. If it is set to true, the button is on and if it is set to falsey (false, undefined, etc.) then the button represents the state off.

### disabled
It disables the toggle button widget, so its value can't be updated from on to off or vise versa once it is rendered.

### inlineLabel
It defines the inline label that will be shown next to the toggle button. It is an optional property and can set as a boolean or as an Object. If it is defined as a boolean, true will enable the inline label with "On" and "Off" text. If it is set to false, then the inline label will not be shown. If the value is set as an Object, then it should include the "on" and "off" properties. These properties will be used to replace the default "On" and "Off". For example:

```javascript
    new ToggleButtonWidget({
        "container": toggleButtonContainer,
        "id": "togglebutton_1",
        "name": "togglebutton_1",
        "inlineLabel": true
    }).build();
```

## Methods

###build
Adds the dom elements and events of the toggle button widget in the specified container. For example:

```
    toggleButtonWidget.build();
```

### destroy
Clean up the specified container from the resources created by the toggle button widget.

```
    toggleButtonWidget.destroy();
```

### setValue
Sets the toggle button widget value to the state on (true) or off (false). For example:

```
    toggleButtonWidget.setValue(true);
```

### getValue
Gets the value of the toggle button widget. If the toggle button is on "on" state, then the value is true; if the toggle button is on "off" state, then the value is undefined. For example:

```
    toggleButtonWidget.getValue();
```

### disable
Disables the user interaction in the toggle button. For example:

```
    toggleButtonWidget.disable();
```

### enable
Enables the user interaction in the toggle button. For example:

```
    toggleButtonWidget.enable();
```

### isDisabled
Checks if the toggle button widget is disabled. If it is disabled then it returns true; otherwise it returns false. For example:

```
    toggleButtonWidget.isDisabled();
```

## Events

###slipstreamToggleButton:onChange
The event gets triggered when the toggleButton value gets changed. It provides an object with the updatedValue property. updatedValue represents the new value of the toggle button. For example:

```
    $toggleButtonContainer.bind("slipstreamToggleButton:onChange", function (e, val) {
        console.log(val.updatedValue));
    });
```

## Usage
To include a toggle button widget, define at least the container and the id. For example:

```
    new ToggleButtonWidget({
        "container": this.$toggleButtonContainer,
        "id": "togglebutton_1",
        "name": "togglebutton_1",
        "on": false
    }).build();
```

## Form widget integration
The toggle button widget is integrated to the form widget, to use it as part of the form, define in the elements parameter, as part of a section:

```
    var formConfiguration = {
        "sections": [
            {
                "elements": [
                    {
                        "element_toggleButton": true,
                        "id": "togglebutton_field_1",
                        "name": "togglebutton_field_1",
                        "on": true,
                        "label": "Toggle Button"
                    },
                    {
                    ...
                    }
                ]
            }
        ],
        "buttons": [
            ...
        ]
    };
 ```

 Then, instantiate the form widget and build it. For example:

 ```
     new FormWidget({
         "elements": formConfiguration,
         "container": toggleButtonFormContainer
     }).build();
 ```