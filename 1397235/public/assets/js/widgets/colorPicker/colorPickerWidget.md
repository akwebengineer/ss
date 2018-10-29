# Color Picker Widget


## Introduction
The colorPicker widget is a reusable graphical user interface that renders a colorPicker input with a palette dialog for a color selection.


## API
The colorPicker widget follows the widget programming interface standards, therefore it exposes: build and destroy methods. Any configuration required by the widget is passed to its constructor.


## Configuration
The configuration object has the following parameters:

```
{
    container:  <(required) Object, defines the DOM element where the widget will be rendered>
    value: <(optional) string, defines the value of the colorPicker which should represent an hexadecimal value>
}    
```

For example, a colorPicker widget could be instantiated with the following configuration:

```
  var colorPickerWidget = new ColorPickerWidget({
      "container": $colorPickerContainer,
      "value": "b988b9"
  }).build();
```

### container
The container parameter represents the DOM element that will contain the color picker widget.

### value
It defines the value that will be assigned to the color picker widget.


## Methods

###build
Adds the dom elements and events of the colorPicker widget in the specified container. For example:

```
    colorPickerWidget.build();
```

###getValue
Gets the current value of the color picker. For example:

```
    colorPickerWidget.getValue();
```

###setValue
Sets a value for the color picker, it should be a string that represents an hexadecimal value. For example:

```
    colorPickerWidget.setValue("348ccb");
```

### destroy
Clean up the specified container from the resources created by the colorPicker widget.

```
    colorPickerWidget.destroy();
```


## Usage
To include a color picker widget, import the colorPickerWidget class and then create an instance of the class and define at least the container. For example:

```
    require(['widgets/colorPicker/colorPickerWidget'], ...)
    ...
    new ColorPickerWidget({
          "container": $colorPickerContainer,
    }).build();
```

## Events

###slipstreamColorPicker:onChange
The event gets triggered when the colorPicker value gets changed. It provides an object with the updatedValue property. updatedValue represents the new value of the color picker. For example:

```
    $colorPickerWrapper.trigger("slipstreamColorPicker:onChange", {
        "updatedValue": updatedValue
    });
```
